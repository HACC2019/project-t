import React, {Component} from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from 'react-router-dom';
import MapComponent from './Components/Map/MapComponent.jsx';
import StationSidebar from './Components/Map/StationSidebar.jsx';
import Dashboard from './Components/Dashboard/Dashboard';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stationList: {visible: [], other: []},
      selectedStation: undefined,
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


  render() {
      return(
        <div style={{ display: 'flex'}} >
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
            />
          </div>
        </div>
      )
  }
}

export default App;