import React, {Component} from 'react';
import {Card, Table, TableBody, Button, Grid} from 'semantic-ui-react';
import ValidInvalidSessions from '../Dashboard/Charts/ValidInvalidSessions.jsx';
import InitiationMethod from '../Dashboard/Charts/InitiationMethod.jsx';
import PaymentType from '../Dashboard/Charts/PaymentType.jsx'
import PortType from '../Dashboard/Charts/PortType.jsx'
import Warning from "../Dashboard/Warning.jsx";

export default class StationView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filtered: '',
    }
    this.handleClick = this.handleClick.bind(this);
    this.getStationDetails = this.getStationDetails.bind(this);
  }

  getStationDetails() {
    let stationDetails = this.props.analytics.getStationDetails(this.props.pickedStation);

    if (!stationDetails) {
      return undefined;
    }

    return (
      <Table.Row key={stationDetails}>
        <Table.Cell>{stationDetails.Street_Address}</Table.Cell>
        <Table.Cell>{stationDetails.Hours_Of_Operation}</Table.Cell>
        <Table.Cell>{stationDetails.Charger_Fee}</Table.Cell>
        <Table.Cell>{stationDetails.Charging_Standards}</Table.Cell>
      </Table.Row>
    );
  }

  handleClick() {
    this.props.home(true);
  }

  getTime(timestamp) {
    let hours = Math.floor(timestamp / 3600);
    timestamp -= hours * 3600;
    let minutes = Math.floor(timestamp / 60);
    timestamp -= minutes * 60;
    let seconds = Math.round(timestamp);
    let time = '';

    if (hours > 0) {
      time += `${hours} hour${hours > 1 ? 's' : ''}`;
    }
    if (minutes > 0) {
      time += `${time.length > 1 ? ', ' : ''}${minutes} minute${minutes > 1 ? 's' : ''}`;
    }
    if (seconds > 0) {
      time += `${time.length > 1 ? ', ' : ''}${seconds} second${seconds > 1 ? 's' : ''}`;
    }

    return time;
}

  render() {
    let stationDetails = this.props.analytics.getStationDetails(this.props.pickedStation);
    let alerts = [];
    let faultMap = this.props.analytics.getFaults(this.props.pickedStation);
    let mobileTotal;
    let deviceTotal;
    let webTotal;
    mobileTotal = this.props.analytics.getDataBySessionStart('MOBILE', this.props.pickedStation).invalid.length + this.props.analytics.getDataBySessionStart('MOBILE', this.props.pickedStation).valid.length;
    deviceTotal = this.props.analytics.getDataBySessionStart('DEVICE', this.props.pickedStation).invalid.length + this.props.analytics.getDataBySessionStart('DEVICE', this.props.pickedStation).valid.length;
    webTotal = this.props.analytics.getDataBySessionStart('WEB', this.props.pickedStation).invalid.length + this.props.analytics.getDataBySessionStart('WEB', this.props.pickedStation).valid.length;

    const rfidPaymentsTot = (this.props.analytics.getDataByPayType('RFID', this.props.pickedStation).invalid.length +
      this.props.analytics.getDataByPayType('RFID', this.props.pickedStation).valid.length);
    const creditPaymentsTot = (this.props.analytics.getDataByPayType('CREDITCARD', this.props.pickedStation).invalid.length +
      this.props.analytics.getDataByPayType('CREDITCARD', this.props.pickedStation).valid.length);
    const webPaymentsTot = (this.props.analytics.getDataByPayType('WEB', this.props.pickedStation).invalid.length +
      this.props.analytics.getDataByPayType('WEB', this.props.pickedStation).valid.length);
    const sessionTotals = (this.props.analytics.getRecords(this.props.pickedStation).length +
      this.props.analytics.getInvalidRecords( this.props.pickedStation).length);
    const chadPort = (this.props.analytics.getDataByPortType("CHADEMO", this.props.pickedStation).valid.length +
      this.props.analytics.getDataByPortType( "CHADEMO", this.props.pickedStation).invalid.length);
    const dCombo = (this.props.analytics.getDataByPortType("DCCOMBOTYP1", this.props.pickedStation).valid.length +
      this.props.analytics.getDataByPortType( "DCCOMBOTYP1", this.props.pickedStation).invalid.length);

    for (let [stationID, faults] of faultMap) {
      let currentWeek = this.props.analytics.getWeekFromDate(new Date(this.props.analytics.getTime()));

      // Color the station orange if there was a probable fault last week
      if (faults[faults.length - 1].week === currentWeek - 1) {
        alerts.push(<Warning stationID={stationID}/>);
      }
    }
    const showItems = this.getStationDetails();

    return (
      <div>
        <h1 style={{textAlign: 'center', color: '#D8D9DA', fontWeight: 500}}>{stationDetails ? stationDetails.Property : 'Newly Placed Station'}</h1>
        <Button style={{position: 'absolute', top: '1rem', right: '2rem'}} inverted onClick={this.handleClick}>BACK TO SUMMARY</Button>
        <Table>
          <TableBody>
            {showItems}
          </TableBody>
        </Table>
        <Grid columns='equal'>
          {
            alerts.length > 0 ?
              <Grid.Row stretched centered>
                <Grid.Column>
                  {alerts}
                </Grid.Column>
              </Grid.Row>
            :
              undefined
          }
          <Grid.Row stretched centered>
            <Grid.Column>
              <Card fluid style={{
                backgroundColor: '#212124',
                boxShadow: '0 1px 3px 0 #141414, 0 0 0 1px #141414'
              }}>
                <Card.Content>
                  <Card.Header style={{color: '#D8D9DA', paddingBottom: '1em'}}>
                    Payment Types
                  </Card.Header>
                  <Grid>
                    <Grid.Row stretched columns={2} style={{color: '#D8D9DA'}}>
                      <Grid.Column>
                        RFID payments
                      </Grid.Column>
                      <Grid.Column>
                        {this.props.analytics.getDataByPayType('RFID', this.props.pickedStation).invalid.length} invalid / {rfidPaymentsTot} total
                      </Grid.Column>
                    </Grid.Row>
                    <Grid.Row stretched columns={2} style={{color: '#D8D9DA'}}>
                      <Grid.Column>
                        Credit Card
                      </Grid.Column>
                      <Grid.Column>
                        {this.props.analytics.getDataByPayType('CREDITCARD', this.props.pickedStation).invalid.length} invalid / {creditPaymentsTot} total
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </Card.Content>
              </Card>
            </Grid.Column>
            <Grid.Column>
              <Card fluid style={{
                backgroundColor: '#212124',
                boxShadow: '0 1px 3px 0 #141414, 0 0 0 1px #141414'
              }}>
                <Card.Content>
                  <Card.Header style={{color: '#D8D9DA', paddingBottom: '1em'}}>
                    Session Overview
                  </Card.Header>
                  <Grid>
                    <Grid.Row stretched columns={2} style={{color: '#D8D9DA'}}>
                      <Grid.Column>
                        Valid Sessions
                      </Grid.Column>
                      <Grid.Column>
                        {this.props.analytics.getRecords(this.props.pickedStation).length} valid
                      </Grid.Column>
                    </Grid.Row>
                    <Grid.Row stretched columns={2} style={{color: '#D8D9DA'}}>
                      <Grid.Column>
                        Invalid Sessions
                      </Grid.Column>
                      <Grid.Column>
                        {this.props.analytics.getInvalidRecords(this.props.pickedStation).length} invalid
                      </Grid.Column>
                    </Grid.Row>
                    <Grid.Row stretched columns={2} style={{color: '#D8D9DA'}}>
                      <Grid.Column>
                        Total Sessions
                      </Grid.Column>
                      <Grid.Column>
                        {sessionTotals} total
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </Card.Content>
              </Card>
            </Grid.Column>
            <Grid.Column>
              <Card fluid style={{
                backgroundColor: '#212124',
                boxShadow: '0 1px 3px 0 #141414, 0 0 0 1px #141414'
              }}>
                <Card.Content>
                  <Card.Header style={{color: '#D8D9DA', paddingBottom: '1em'}}>
                    Port Type
                  </Card.Header>
                  <Grid>
                    <Grid.Row stretched columns={2} style={{color: '#D8D9DA'}}>
                      <Grid.Column>
                        Chademo
                      </Grid.Column>
                      <Grid.Column>
                        {this.props.analytics.getDataByPortType("CHADEMO", this.props.pickedStation).invalid.length} invalid
                        / {chadPort} total
                      </Grid.Column>
                    </Grid.Row>
                    <Grid.Row stretched columns={2} style={{color: '#D8D9DA'}}>
                      <Grid.Column>
                        DCCOMBOTYP1
                      </Grid.Column>
                      <Grid.Column>
                        {this.props.analytics.getDataByPortType("DCCOMBOTYP1", this.props.pickedStation).invalid.length} invalid
                        / {dCombo} total
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </Card.Content>
              </Card>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row stretched centered>
            <Grid.Column>
              <Card fluid style={{
                backgroundColor: '#212124',
                boxShadow: '0 1px 3px 0 #141414, 0 0 0 1px #141414'
              }}>
                <Card.Content>
                  <Card.Header style={{color: '#D8D9DA', paddingBottom: '1em'}}>
                    Session Initiation
                  </Card.Header>
                  <Grid>
                    <Grid.Row stretched columns={2} style={{color: '#D8D9DA'}}>
                      <Grid.Column>
                        Mobile
                      </Grid.Column>
                      <Grid.Column>
                        {this.props.analytics.getDataBySessionStart('MOBILE', this.props.pickedStation).invalid.length} invalid
                        / {mobileTotal} total
                      </Grid.Column>
                    </Grid.Row>
                    <Grid.Row stretched columns={2} style={{color: '#D8D9DA'}}>
                      <Grid.Column>
                        Device
                      </Grid.Column>
                      <Grid.Column>
                        {this.props.analytics.getDataBySessionStart('DEVICE', this.props.pickedStation).invalid.length} invalid
                      / {deviceTotal} total
                      </Grid.Column>
                    </Grid.Row>
                    <Grid.Row stretched columns={2} style={{color: '#D8D9DA'}}>
                      <Grid.Column>
                        Web
                      </Grid.Column>
                      <Grid.Column>
                        {this.props.analytics.getDataBySessionStart('WEB', this.props.pickedStation).invalid.length} invalid
                        / {webTotal} total
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </Card.Content>
              </Card>
            </Grid.Column>
            <Grid.Column>
              <Card fluid style={{
                backgroundColor: '#212124',
                boxShadow: '0 1px 3px 0 #141414, 0 0 0 1px #141414'
              }}>
                <Card.Content>
                  <Card.Header style={{color: '#D8D9DA', paddingBottom: '1em'}}>
                    Averages Per Valid Session
                  </Card.Header>
                  <Grid>
                    <Grid.Row stretched columns={2} style={{color: '#D8D9DA'}}>
                      <Grid.Column>
                        Duration
                      </Grid.Column>
                      <Grid.Column>
                        {this.getTime(this.props.analytics.getAverageDuration(this.props.pickedStation))}
                      </Grid.Column>
                    </Grid.Row>
                    <Grid.Row stretched columns={2} style={{color: '#D8D9DA'}}>
                      <Grid.Column>
                        Electricity Usage
                      </Grid.Column>
                      <Grid.Column>
                        {Math.round(this.props.analytics.getAveragePowerUsage(this.props.pickedStation) * 1000) / 1000} kWh
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </Card.Content>
              </Card>
            </Grid.Column>
            <Grid.Column>
              <Card fluid style={{
                backgroundColor: '#212124',
                boxShadow: '0 1px 3px 0 #141414, 0 0 0 1px #141414'
              }}>
                <Card.Content>
                  <Card.Header style={{color: '#D8D9DA', paddingBottom: '1em'}}>
                    Average Turnaround Time
                  </Card.Header>
                  <Grid>
                    <Grid.Row stretched style={{color: '#D8D9DA'}}>
                      <Grid.Column>
                        {this.props.analytics.getAverageTurnaround(this.props.pickedStation) > -1 ? this.getTime(this.props.analytics.getAverageTurnaround(this.props.pickedStation)) :
                      'Not enough data to calculate'}
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </Card.Content>
              </Card>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row stretched centered>
            <Grid.Column>
              <ValidInvalidSessions analytics={this.props.analytics} stationID={this.props.pickedStation} />
            </Grid.Column>
            <Grid.Column>
              <InitiationMethod analytics={this.props.analytics} stationID={this.props.pickedStation} />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <PaymentType analytics={this.props.analytics} stationID={this.props.pickedStation} />
            </Grid.Column>
            <Grid.Column>
              <PortType analytics={this.props.analytics} stationID={this.props.pickedStation} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}
