import React, {Component} from 'react';

import {InteractiveMap} from 'react-map-gl';
import DeckGL from '@deck.gl/react';
import {PolygonLayer, TextLayer} from '@deck.gl/layers';
import {TripsLayer} from '@deck.gl/geo-layers';
import StationSidebar from './components/StationSidebar.jsx';

import GL from '@luma.gl/constants';

// Maximum allowed error deviation from the predicted weekly trend before considering a station faulty
const INITIAL_STATION_ELEVATION = 3000;
// The Mapbox API token
const MAPBOX_TOKEN = 'pk.eyJ1IjoibG92ZW1pbGt0ZWEiLCJhIjoiY2swcGFtb3JzMDhoMDNkcGE5NW9ueGh6aSJ9.OryBJxboTqlp_lmrUyTD1g'; // eslint-disable-line

function getContour(station, scale = 1) {
    return [
        [station.Longitude + (.001 * scale), station.Latitude - (.0005 * scale)],
        [station.Longitude + (.001 * scale), station.Latitude + (.0005 * scale)],
        [station.Longitude - (.001 * scale), station.Latitude + (.0005 * scale)],
        [station.Longitude - (.001 * scale), station.Latitude - (.0005 * scale)]
    ];
}

export class App extends Component {
    constructor(props) {
        super(props);
        
        let labels = [];
        
        for (let station of CHARGE_STATIONS) {
            labels.push({label: station.Property, coordinates: [station.Longitude, station.Latitude]});
        }
        
        this.state = {
            time: 0,
            stationElevation: INITIAL_STATION_ELEVATION,
            data: {
                chargeStations: CHARGE_STATIONS,
                trips: ROADS,
                buildings: BUILDINGS,
                labels: labels
            },
            stationList: {visible: [], other: []},
            selectedStation: undefined,
            zoomLevel: INITIAL_VIEW_STATE.zoom
        };
        this.mapRef = null;
        this._onViewStateChange = this._onViewStateChange.bind(this);
    }

    componentDidMount() {
        this._animate();
        fetch('trips.json')
          .then(res => res.json())
          .then(data => {
            this.setState({ trips: data })
          })
    }

    componentWillUnmount() {
        if (this._animationFrame) {
            window.cancelAnimationFrame(this._animationFrame);
        }
    }
    
    // Class property syntax means no need to .bind() this function
    componentDidFirstRender = (mapRef) => {
        this.mapRef = mapRef;
        
        this.updateStationSidebar();
    }

    _animate() {
        const {
            loopLength = 8000, // unit corresponds to the timestamp in source data
            animationSpeed = 30 // unit time per second
        } = this.props;
        const timestamp = Date.now() / 1000;
        const loopTime = loopLength / animationSpeed;

        this.setState({
            time: ((timestamp % loopTime) / loopTime) * loopLength
        });
        this._animationFrame = window.requestAnimationFrame(this._animate.bind(this));
    }

    _onViewStateChange(states) {
        const percentage = INITIAL_VIEW_STATE.minZoom / states.viewState.zoom;

        this.setState({stationElevation: INITIAL_STATION_ELEVATION * percentage, zoomLevel: states.viewState.zoom});
        
        this.updateStationSidebar();
    }

    updateStationSidebar() {
        // Which Charge Stations are in view?
        const mapBounds = this.mapRef.getMap().getBounds();
        const visibleStations = this.state.data.chargeStations.filter((e) => {
            if ((e.Longitude > mapBounds._sw.lng && e.Longitude < mapBounds._ne.lng) && (e.Latitude > mapBounds._sw.lat && e.Latitude < mapBounds._ne.lat)) {
                return true;
            }
            return false;
        });
        const otherStations = this.state.data.chargeStations.filter((e) => {
            if ((e.Longitude > mapBounds._sw.lng && e.Longitude < mapBounds._ne.lng) && (e.Latitude > mapBounds._sw.lat && e.Latitude < mapBounds._ne.lat)) {
                return false;
            }
            return true;
        });
        
        this.setState({stationList: {visible: visibleStations, other: otherStations}})
    }
    
    onStationHover = (stationID) => {
        this.setState({selectedStation: stationID});
    }
    
    onStationLeave = () => {
        this.setState({selectedStation: undefined});
    }

    choose(choices) {
        var index = Math.floor(Math.random() * 100);
        if (index == 1) {
            return choices[1];
        } else {
            return choices[0];
        }
    }

    _renderLayers() {
        const {
            getWidth = 3
        } = this.props;
        
        let layers = [
            new TextLayer({
                id: 'station-labels',
                data: this.state.data.labels,
                getPosition: data => data.coordinates,
                getText: data => data.label,
                getSize: Math.pow(this.state.zoomLevel, 1.5) / 2.2,
                getColor: [255, 255, 255, 255],
                getAngle: 0,
                getTextAnchor: 'middle',
                getAlignmentBaseline: 'center',
                getPixelOffset: [0, (Math.pow(this.state.zoomLevel, 2) - 60)],
                fontFamily: 'Roboto, Arial'
            }),
            new PolygonLayer({
                id: 'buildings',
                data: this.state.data.buildings,
                stroked: true,
                filled: true,
                extruded: true,
                lineWidthMinPixels: 1,
                getPolygon: d => {
                    return d.geometry.coordinates;
                },
                getElevation: d => 50,
                getFillColor: d => [33, 33, 33]
            }),
            new TripsLayer({
                id: 'trips',
                data: this.state.data.trips,
                getPath: d => d.path,
                getTimestamps: d => d.timestamps,
                getColor: d => this.choose([[253, 128, 93], [75, 218, 250]]),
                opacity: 0.5,
                widthMinPixels: 2,
                rounded: true,
                trailLength: 10,
                currentTime: this.state.time,
                shadowEnabled: false
            })
        ];

        for (let charger of this.state.data.chargeStations) {
            layers.push(new PolygonLayer({
                id: `charge-station-${charger.ID}`,
                data: [charger],
                pickable: true,
                stroked: true,
                filled: true,
                extruded: true,
                lineWidthMinPixels: 1,
                getPolygon: d => this.state.selectedStation === charger.ID ? getContour(d, 3) : getContour(d),
                getElevation: d => this.state.selectedStation === charger.ID ? this.state.stationElevation * 3 : this.state.stationElevation,
                getFillColor: d => this.state.selectedStation === charger.ID ? [253, 128, 93] : [255, 255, 204],
                getLineColor: [80, 80, 80],
                getLineWidth: 1,
                updateTriggers: {
                    getElevation: [this.state.stationElevation]
                }
            }));
        }

        return layers;
    }

    render() {
        
        const {mapStyle = 'mapbox://styles/lovemilktea/ck1yqjfgi4wge1co4075zwrnh'} = this.props;
        return (
            <div style={{display: "flex"}}>
                <StationSidebar
                    stations={this.state.stationList}
                    onStationHover={this.onStationHover}
                    onStationLeave={this.onStationLeave}
                />
                <div id='main-map' style={{position: 'relative', flex: 1}}>
                    <DeckGL
                        layers={this._renderLayers()}
                        onViewStateChange={this._onViewStateChange}
                        initialViewState={INITIAL_VIEW_STATE}
                        controller={true}

                        pickingRadius={5}
                        parameters={{
                            blendFunc: [GL.SRC_ALPHA, GL.ONE, GL.ONE_MINUS_DST_ALPHA, GL.ONE],
                            blendEquation: GL.FUNC_ADD
                        }}
                        >

                        <InteractiveMap
                            reuseMaps
                            mapStyle={mapStyle}
                            preventStyleDiffing={true}
                            mapboxApiAccessToken={MAPBOX_TOKEN}
                            ref={this.componentDidFirstRender}
                        />
                    </DeckGL>
                </div>
            </div>
        );
    }
}

export function renderToDOM(container) {
    render(<App />, container);
}
