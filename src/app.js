import React, {Component} from 'react';
import TimeSimulation from '../lib/TimeSimulation.js';
import SimulationController from './Components/SimulationController.jsx';
import MapComponent from './Components/Map/MapComponent.jsx';
import StationSidebar from './Components/Map/StationSidebar.jsx';
import Dashboard from './Components/Dashboard/Dashboard';
import { processStationRecords } from '../lib/map_tools.js';
import RecordAnalytics from '../lib/RecordAnalytics';
import DashboardStation from './Components/SingleStation/DashboardStation.jsx'

class App extends Component {
  constructor(props) {
    super(props);
    
    this.timeController = new TimeSimulation();
    this.timeController.addListener(this.onTimeChange.bind(this));
    this.analytics = new RecordAnalytics(this.timeController);
    window.analytics = this.analytics;
    
    this.state = {
      stationList: {visible: [], other: []},
      selectedStation: undefined,
      faultMap: processStationRecords(this.timeController.getValidRecords()),
      stationClicked: '',
      home: true

    }

    this.handleMapChange = this.handleMapChange.bind(this);
    this.handleStationHover = this.handleStationHover.bind(this);
    this.handleStationLeave = this.handleStationLeave.bind(this);
    this.handleStationClick = this.handleStationClick.bind(this);
    this.handleSidebarClick = this.handleSidebarClick.bind(this);

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

  handleStationClick(el) {
    this.setState({stationClicked: el, home: false});
  }

  handleSidebarClick(s) {
    this.setState({stationClicked: s, home: false});
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
              onStationClick={this.handleSidebarClick}
            />
            <div style={{ display: 'inline-flex', flexDirection: 'column', width: '100%'}}>
              {(this.state.home) ? <Dashboard analytics={this.analytics}/> : <DashboardStation pickedStation={this.state.stationClicked}/>}
              <MapComponent
                selectedStation={this.state.selectedStation}
                onMapChange={this.handleMapChange}
                faultMap={this.state.faultMap}
                stationClicked={this.handleStationClick}
              />
            </div>
          </div>
        </div>
      )
  }
}

export default App;