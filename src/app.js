import React, {Component} from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from 'react-router-dom';
import Map from './Components/Map/Map';
import StationSidebar from './Components/layout/MainSidebar/StationSidebar';
import Dashboard from './Components/Dashboard/Dashboard';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stationList: {visible: [], other: []},
      selectedStation: undefined,
    }

    this.handleMapChange = this.handleMapChange.bind(this);
    this.handleStationSelect = this.handleStationSelect.bind(this);
    this.handleStationLeave = this.handleStationLeave.bind(this);
  }

  handleMapChange(stations) {
    this.setState({stationList: stations});
  }

  handleStationSelect(s) {
    this.setState({ selectedStation: s }, console.log('station selected', s))
  }

  handleStationLeave() {
    this.setState({ selectedStation: undefined })
  }


  render() {
      return(
        <div style={{ display: 'flex'}} >
          <StationSidebar
            stations={this.state.stationList}
            onStationSelect={this.handleStationSelect}
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
            <Map 
              selectedStation={this.state.selectedStation}
              onMapChange={this.handleMapChange}
            />
          </div>
        </div>
      )
  }
}

export default App;