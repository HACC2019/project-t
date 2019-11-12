import React, { Component } from 'react'
import { Message } from 'semantic-ui-react'
import CHARGE_STATIONS from '../../../json/chargestations'

class Warning extends Component {
  constructor(props) {
    super(props);
  }
 
  render () {
    let stationDetails;
    
    for (let station of CHARGE_STATIONS) {
      if (station.ID === this.props.station.id) {
        stationDetails = station;
      }
    }
    
    console.log(this.props.station);
    console.log(stationDetails);
    return (
      <Message warning>
        <Message.Header>Warning: Possible Fault at {stationDetails.Property}</Message.Header>
        <p>{stationDetails.Street_Address}</p>
      </Message>
    );
  }
  
}

export default Warning;