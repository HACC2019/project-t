import React, {Component} from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from 'react-router-dom';
import TimeSimulation from '../lib/TimeSimulation.js';
import SimulationController from './Components/SimulationController.jsx';
import MapComponent from './Components/Map/MapComponent.jsx';
import StationSidebar from './Components/Map/StationSidebar.jsx';
import Dashboard from './Components/Dashboard/Dashboard';
import { processStationRecords } from '../lib/map_tools.js';

class App extends Component {
  constructor(props) {
    super(props);
    
    this.timeController = new TimeSimulation();
    this.timeController.addListener(this.onTimeChange.bind(this));
    
    this.state = {
      stationList: {visible: [], other: []},
      selectedStation: undefined,
      faultMap: processStationRecords(this.timeController.getRecords())
    }

    this.handleMapChange = this.handleMapChange.bind(this);
    this.handleStationHover = this.handleStationHover.bind(this);
    this.handleStationLeave = this.handleStationLeave.bind(this);
  }

  handleMapChange(stations) {
    this.setState({stationList: stations});
  }

  handleStationHover(s) {
    this.setState({ selectedStation: s });
  }

  handleStationLeave() {
    this.setState({ selectedStation: undefined })
  }

  onTimeChange(records) {
    this.setState({faultMap: processStationRecords(records)});
  }

  render() {
      return(
        <div style={{display: 'flex', flexDirection: 'column', height: '100vh'}}>
          <SimulationController controller={this.timeController} />
          <div style={{ flex: 1, display: 'flex', overflow: 'hidden'}} >
            <StationSidebar
              stations={this.state.stationList}
              onStationSelect={this.handleStationHover}
              onStationLeave={this.handleStationLeave}
            />
            <div style={{ display: 'inline-flex', flexDirection: 'column', width: '100%'}}>
              <Router>
                <Switch>
                  <Route path="/">
                    <Dashboard />
                  </Route>
                </Switch>
              </Router>
              <MapComponent
                selectedStation={this.state.selectedStation}
                onMapChange={this.handleMapChange}
                faultMap={this.state.faultMap}
              />
            </div>
          </div>
        </div>
      )
  }
}

export default App;