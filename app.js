import React, {Component} from 'react';
import {render} from 'react-dom';

import {InteractiveMap} from 'react-map-gl';
import DeckGL from '@deck.gl/react';
import {LineLayer, ScatterplotLayer, PolygonLayer} from '@deck.gl/layers';
import {TripsLayer} from '@deck.gl/geo-layers';
import {MapboxLayer} from '@deck.gl/mapbox';


import GL from '@luma.gl/constants';

const MAPBOX_TOKEN = 'pk.eyJ1IjoibG92ZW1pbGt0ZWEiLCJhIjoiY2swcGFtb3JzMDhoMDNkcGE5NW9ueGh6aSJ9.OryBJxboTqlp_lmrUyTD1g'; // eslint-disable-line

const INITIAL_VIEW_STATE = {
  latitude: 21.479635,
  longitude: -157.97240,
  zoom: 10.5,
  minZoom: 10.5,
  maxZoom: 13,
  pitch: 45,
  bearing: 15
};

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: 0,
      stationElevation: 5000,
      data: {
        chargeStations: CHARGE_STATIONS,
        trips: ROADS,
        buildings: BUILDINGS
      },
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

    this.setState({stationElevation: 5000 * percentage});

    // Which Charge Stations are in view?
    const mapBounds = this.mapRef.getMap().getBounds();
    const visibleStations = this.state.data.chargeStations.filter((e) => {
      if ((e.Longitude > mapBounds._sw.lng && e.Longitude < mapBounds._ne.lng) && (e.Latitude > mapBounds._sw.lat && e.Latitude < mapBounds._ne.lat)) {
        return true;
      }
      return false;
    });
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

    return [
      new PolygonLayer({
        id: 'charge-stations',
        data: this.state.data.chargeStations,
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
        // onDrag: (info, event) => { 
        //   console.log(info);
        //   console.log(event); 
        // },
        updateTriggers: {
          getElevation: [this.state.stationElevation]
        }
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
        getElevation: d => 100,
        getFillColor: d => [33, 33, 33]
      }),
      new TripsLayer({
        id: 'trips',
        data: this.state.data.trips,
        getPath: d => d.path,
        getTimestamps: d => d.timestamps,
        getColor: d => this.choose([[253, 128, 93], [23, 184, 190]]),
        opacity: 0.3,
        widthMinPixels: 2,
        rounded: true,
        trailLength: 10,
        currentTime: this.state.time,
        shadowEnabled: false
      }),
    ];
  }

  render() {
    const {mapStyle = 'mapbox://styles/mapbox/dark-v10'} = this.props;
    return (
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

        {this._renderTooltip}
      </DeckGL>
    );
  }
}

export function renderToDOM(container) {
  render(<App />, container);
}