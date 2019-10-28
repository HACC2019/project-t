import React, { Component } from "react";
import { InteractiveMap } from "react-map-gl";
import DeckGL from "@deck.gl/react";
import { LineLayer, ScatterplotLayer, PolygonLayer } from "@deck.gl/layers";
import { TripsLayer } from "@deck.gl/geo-layers";
// import {MapboxLayer} from '@deck.gl/mapbox';
import "mapbox-gl/dist/mapbox-gl.css";
import GL from "@luma.gl/constants";

import CHARGE_STATIONS from "../../../json/chargeStations";
import ROADS from "../../../json/trips";
import BUILDINGS from "../../../json/buildings";
import mapConfig from "./mapConfig";

import sidebarStyles from '../../styles/sidebar.css';

class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: 0,
      stationElevation: mapConfig.INITIAL_STATION_ELEVATION,
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
    this._animationFrame = window.requestAnimationFrame(
      this._animate.bind(this)
    );
  }

  _onViewStateChange(states) {
    const percentage =
      mapConfig.INITIAL_VIEW_STATE.minZoom / states.viewState.zoom;

    this.setState({
      stationElevation: mapConfig.INITIAL_STATION_ELEVATION * percentage
    });

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
      let element = (
        <div key={station.ID} className={sidebarStyles.item}>
          <div className={sidebarStyles.property}>{station.Property}</div>
          <div className={sidebarStyles.city}>{station.City}</div>
        </div>
      );
      stationList.push(element);
    }

    this.setState({ stationList: stationList });

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
    const { getWidth = 3 } = this.props;

    let layers = [
      new PolygonLayer({
        id: "buildings",
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
        id: "trips",
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
      layers.push(
        new PolygonLayer({
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
        })
      );
    }

    return layers;
  }

  render() {
    const {
    } = this.props;
    return (
      <div style={{ display: "flex" }}>
        <div id="stations">{this.state.stationList}</div>
        <div style={{ position: "relative", flex: 1 }}>
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
            <InteractiveMap
              reuseMaps
              mapStyle={mapConfig.mapStyle}
              preventStyleDiffing={true}
              mapboxApiAccessToken={process.env.MAPBOX_TOKEN}
              ref={map => (this.mapRef = map)}
            />
          </DeckGL>
        </div>
      </div>
    );
  }
}

export default Map;