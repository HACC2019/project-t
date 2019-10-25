import React, {Component} from 'react';
import {render} from 'react-dom';

import {InteractiveMap} from 'react-map-gl';
import DeckGL from '@deck.gl/react';
import {LineLayer, ScatterplotLayer, PolygonLayer} from '@deck.gl/layers';
import {TripsLayer} from '@deck.gl/geo-layers';
import {MapboxLayer} from '@deck.gl/mapbox';

import sidebarStyles from './styles/sidebar.css';

import CHARGE_STATIONS from './../json/chargestations';
import STATION_RECORDS from './../json/station_records';
import ROADS from './../json/trips';
import BUILDINGS from './../json/buildings'

// Maximum allowed error deviation from the predicted weekly trend before considering a station faulty
const INITIAL_STATION_ELEVATION = 2000;
const STATION_FAULT_THRESHOLD = 30;

// The Mapbox API token

function getWeekNumber(date) {
    const DAY = 1000 * 60 * 60 * 24;
    // Unix epoch happens on Thursday, so add three days
    // And divide by seven days a week
    //  (new Date('01-05-1970 00:00-0000').getTime() + (DAY * 3)) / (DAY * 7)
    let adjustedEpoch = new Date('01-04-1970 00:00:00').getTime();

    return Math.floor((date.getTime() - adjustedEpoch) / (DAY * 7));
    //    (new Date('10-20-19 00:00:00-0000').getTime() + (1000 * 60 * 60 * 24 * 3)) / (1000 * 60 * 60 * 24 * 7)
}

function processStationRecords() {
    function sum(accumulator, currentValue) {
        return accumulator + currentValue;
    }

    let stationMap = new Map();
    for (let record of STATION_RECORDS) {
        if (!stationMap.has(record['Charge Station Name'])) {
            stationMap.set(record['Charge Station Name'], []);
        }

        let weekRecords = stationMap.get(record['Charge Station Name']);
        let weekIndex = getWeekNumber(new Date(record['Start Time']));

        if (weekRecords[weekIndex] === undefined) {
            weekRecords[weekIndex] = [];
        }

        weekRecords[weekIndex].push(record);
    }

    for (let [stationName, stationWeeks] of stationMap) {
        let xyValues = [];
        let xValues = [];
        let yValues = [];
        let weekCount = 0;
        let weeklyAverage = 0;

        for (let week = 0; week < stationWeeks.length; week++) {
            let weekRecords = stationWeeks[week];

            if (weekRecords === undefined) {
                continue;
            }

            xyValues.push(week * weekRecords.length );
            xValues.push(week);
            yValues.push(weekRecords.length);
            weeklyAverage += weekRecords.length;
            weekCount++;
        }

        // https://classroom.synonym.com/calculate-trendline-2709.html
        let a = weekCount * xyValues.reduce(sum);
        let b = xValues.reduce(sum) * yValues.reduce(sum);
        let c = weekCount * xValues.reduce((accumulator, currentValue) => accumulator + currentValue ** 2, 0);
        let d = xValues.reduce(sum) ** 2;
        let m = (a - b) / (c - d);
        let e = yValues.reduce(sum);
        let f = m * xValues.reduce(sum);
        let yint = (e - f) / weekCount;

        stationWeeks.slopeIntercept = (x) => {
            return m * x + yint;
        }

        stationWeeks.average = weeklyAverage / weekCount;

        for (let week = 0; week < stationWeeks.length; week++) {
            let weekRecords = stationWeeks[week];

            if (weekRecords === undefined) {
                continue;
            }

            let percentError = (stationWeeks.slopeIntercept(week) - weekRecords.length) / weekRecords.length * 100;

            if (percentError > STATION_FAULT_THRESHOLD) {
                console.log(`POSSIBLE FAULT AT STATION ${stationName} IN WEEK ${week}. Expected ${stationWeeks.slopeIntercept(week)}, but only had ${weekRecords.length}`);
            }
        }
    }

    return stationMap;
}

console.log(processStationRecords());

const INITIAL_VIEW_STATE = {
    latitude: 21.479635,
    longitude: -157.97240,
    zoom: 10.5,
    minZoom: 8,
    maxZoom: 15,
    pitch: 45,
    bearing: 15
};

export class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            time: 0,
            stationElevation: INITIAL_STATION_ELEVATION,
            data: {
                chargeStations: CHARGE_STATIONS,
                trips: ROADS,
                buildings: BUILDINGS
            },
            stationList: []
        };
        this.mapRef = null;
        this._onViewStateChange = this._onViewStateChange.bind(this);
    }

    componentDidMount() {
        this._animate();
    }

    componentWillUnmount() {
        if (this._animationFrame) {
            window.cancelAnimationFrame(this._animationFrame);
        }
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

        this.setState({stationElevation: INITIAL_STATION_ELEVATION * percentage});

        // Which Charge Stations are in view?
        const mapBounds = this.mapRef.getMap().getBounds();
        const visibleStations = this.state.data.chargeStations.filter((e) => {
            if ((e.Longitude > mapBounds._sw.lng && e.Longitude < mapBounds._ne.lng) && (e.Latitude > mapBounds._sw.lat && e.Latitude < mapBounds._ne.lat)) {
                return true;
            }
            return false;
        });
        
//        let visibleStationsElement = document.getElementById('stations');
//        while (visibleStationsElement.lastChild) {
//            visibleStationsElement.removeChild(visibleStationsElement.lastChild);
//        }
        
        let stationList = [];
        
        for (let station of visibleStations) {
//            let element = document.createElement('div');
//            let property = document.createElement('div');
//            let city = document.createElement('div');
//            let property = document.createElement('div');
//            let city = document.createElement('div');
//            property.innerText = `${station.Property}`;
//            property.style.fontSize = "1.2em"; 
//            city.innerText = `${station.City}`;
//            city.style.fontSize = "0.9em";
//            city.style.paddingBottom = "10px";
//            element.appendChild(property);
//            element.appendChild(city);
//            visibleStationsElement.appendChild(element);
            let element =  <div key={station.ID} className={sidebarStyles.item}>
                <div className={sidebarStyles.property}>{station.Property}</div>
                <div className={sidebarStyles.city}>{station.City}</div>
            </div>;
            stationList.push(element);
        }
        
        this.setState({stationList: stationList});
        
        console.log(visibleStations);
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
            }),
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
                getPolygon: d => d.contour,
                getElevation: d => this.state.stationElevation,
                getFillColor: d => [255, 255, 204],
                getLineColor: [80, 80, 80],
                getLineWidth: 1,
                onClick: (info, event) => {
                    // console.log(info);
                },
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
                <div id='stations'>
                    {this.state.stationList}
                </div>
                <div style={{position: 'relative', flex: 1}}>
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
                            ref={map => this.mapRef = map}
                        />
                    </DeckGL>
                </div>
               
                
            </div>
        );
    }
}

export default App;