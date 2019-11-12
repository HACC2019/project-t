import React, { Component } from 'react'
import { Message } from 'semantic-ui-react'
import CHARGE_STATIONS from '../../../json/chargeStations'

class Warning extends Component {
  constructor(props) {
    super(props);
  }
 
  render () {
    let stationDetails;
    
    for (let station of CHARGE_STATIONS) {
      if (station.ID === this.props.stationID) {
        stationDetails = station;
      }
    }
    
    return (
      <Message warning inverted style={{background: '#4d3a2a'}}>
        <Message.Header style={{color: 'white'}}>Possible Fault at the {stationDetails.Property} charging station</Message.Header>
        <p style={{color: 'white'}}>{stationDetails.Street_Address}</p>
      </Message>
    );
  }
  
}

export default Warning;
