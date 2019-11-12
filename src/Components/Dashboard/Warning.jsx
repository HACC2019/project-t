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
      <Message warning>
        <Message.Header>Warning: Possible Fault at {stationDetails.Property}</Message.Header>
        <p>{stationDetails.Street_Address}</p>
      </Message>
    );
  }
  
}

export default Warning;
