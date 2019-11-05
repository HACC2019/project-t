import React, { Component } from "react";
import { InteractiveMap } from "react-map-gl";
import DeckGL from "@deck.gl/react";
import { PolygonLayer, TextLayer } from "@deck.gl/layers";
import { TripsLayer } from "@deck.gl/geo-layers";
import GL from "@luma.gl/constants";
import StationSidebar from './StationSidebar.jsx';
import TimeSimulationController from '../../../lib/TimeSimulationController.js';
import SimulationControl from './SimulationControl.jsx';
import CHARGE_STATIONS from "../../../json/chargeStations";
import BUILDINGS from "../../../json/buildings";
import mapConfig from "./mapConfig";
import { processStationRecords } from '../../../lib/map_tools.js';

function getContour(station, scale = 1) {
  return [
    [station.Longitude + (.001 * scale), station.Latitude - (.0005 * scale)],
    [station.Longitude + (.001 * scale), station.Latitude + (.0005 * scale)],
    [station.Longitude - (.001 * scale), station.Latitude + (.0005 * scale)],
    [station.Longitude - (.001 * scale), station.Latitude - (.0005 * scale)]
  ];
}

class MapComponent extends Component {
  constructor(props) {
    super(props);
    
    let labels = [];
        
		for (let station of CHARGE_STATIONS) {
			labels.push({label: station.Property, coordinates: [station.Longitude, station.Latitude]});
		}
    
  	this.timeController = new TimeSimulationController();
		this.timeController.addListener(this.onTimeChange.bind(this));
		
    this.state = {
      time: 0,
      stationElevation: mapConfig.INITIAL_STATION_ELEVATION,
      data: {
        chargeStations: CHARGE_STATIONS
      },
      trips: [],
      zoomLevel: mapConfig.INITIAL_VIEW_STATE.zoom,
      faultMap: processStationRecords(this.timeController.getRecords())
    };
    this.mapRef = null;
    
    this._animate = this._animate.bind(this);
    this._onViewStateChange = this._onViewStateChange.bind(this);
    this.componentDidFirstRender = this.componentDidFirstRender.bind(this);
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
  
  componentDidFirstRender(mapRef) {
    this.mapRef = mapRef;

      const visibleStations = this.updateStationSidebar();
      this.props.onMapChange(visibleStations);
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
    this._animationFrame = window.requestAnimationFrame(
      this._animate
    );
  }

  _onViewStateChange(states) {
    const percentage =
      mapConfig.INITIAL_VIEW_STATE.minZoom / states.viewState.zoom;

    this.setState({
      stationElevation: mapConfig.INITIAL_STATION_ELEVATION * percentage,
      zoomLevel: states.viewState.zoom
    });
    
    const visibleStations = this.updateStationSidebar();
    this.props.onMapChange(visibleStations);
  }

  updateStationSidebar() {
    // Which Charge Stations are in view?
    const mapBounds = this.mapRef.getMap().getBounds();
    const visibleStations = this.state.data.chargeStations.filter(e => {
      if (
        e.Longitude > mapBounds._sw.lng &&
        e.Longitude < mapBounds._ne.lng &&
        (e.Latitude > mapBounds._sw.lat && e.Latitude < mapBounds._ne.lat)
      ) {
        return true;
      }
      return false;
    });
    const otherStations = this.state.data.chargeStations.filter(e => {
      if (
        e.Longitude > mapBounds._sw.lng &&
        e.Longitude < mapBounds._ne.lng &&
        (e.Latitude > mapBounds._sw.lat && e.Latitude < mapBounds._ne.lat)
      ) {
        return false;
      }
      return true;
    });

    return {visible: visibleStations, other: otherStations}
  }
  
  onTimeChange(records) {
    this.setState({faultMap: processStationRecords(records)});
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
    const { getWidth = 3 } = this.props;

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
        id: "buildings",
        data: BUILDINGS,
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

    ];
      
      
    // GREEN: [82, 125, 85]
    // ORANGE: [253, 128, 93]
    // RED: [184, 81, 81]
    for (let charger of this.state.data.chargeStations) {
      layers.push(
        new PolygonLayer({
          id: `charge-station-${charger.ID}`,
          data: [charger],
          pickable: true,
          stroked: true,
          filled: true,
          extruded: true,
          lineWidthMinPixels: 1,
          getPolygon: d => this.props.selectedStation === charger.ID ? getContour(d, 3) : getContour(d),
          getElevation: d => this.props.selectedStation === charger.ID ? this.state.stationElevation * 3 : this.state.stationElevation,
          getFillColor: data => {
            if (!data.Servicing) {
              return [184, 81, 81];
            } else if (this.state.faultMap.has(data.ID)) {
              return [253, 128, 93];
            } else {
              return [82, 125, 85];
            }
          },
          getLineColor: [80, 80, 80],
          getLineWidth: 1,
          updateTriggers: {
            getElevation: [this.state.stationElevation]
          }
        })
      );
    }

    return layers;
  }

  render() {
    return (
      <div style={{ display: "flex", flexDirection: 'column' }}>
        <SimulationControl controller={this.timeController} />
        <div style={{ display: "flex", flex: 1 }}>
          <StationSidebar
            stations={this.state.stationList}
            onStationHover={this.onStationHover}
            onStationLeave={this.onStationLeave}
          />
          <div id='main-map' style={{position: 'relative', flex: 1, zIndex: 1}}>
            <DeckGL
              layers={this._renderLayers()}
              onViewStateChange={this._onViewStateChange}
              initialViewState={mapConfig.INITIAL_VIEW_STATE}
              controller={true}
              pickingRadius={5}
              parameters={{
                blendFunc: [GL.SRC_ALPHA, GL.ONE, GL.ONE_MINUS_DST_ALPHA, GL.ONE],
                blendEquation: GL.FUNC_ADD
              }}
            >
              <TripsLayer 
                id= "trips"
                data= {this.state.trips}
                getPath= {d => d.path}
                getTimestamps= {d => d.timestamps}
                getColor= {d => this.choose([[253, 128, 93], [75, 218, 250]])}
                opacity= {0.5}
                widthMinPixels= {2}
                rounded= {true}
                trailLength= {10}
                currentTime= {this.state.time}
                shadowEnabled= {false}
              />
              <InteractiveMap
                reuseMaps
                mapStyle={mapConfig.mapStyle}
                preventStyleDiffing={true}
                mapboxApiAccessToken={process.env.MAPBOX_TOKEN}
                ref={this.componentDidFirstRender}
              />
            </DeckGL>
          </div>
        </div>
      </div>
    );
  }
}

export default MapComponent;