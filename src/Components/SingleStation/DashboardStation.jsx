import React, {Component} from 'react';
import {Card, Table, TableBody, Button, Grid} from 'semantic-ui-react';
import style from './singlestyle.scss';
import CHARGE_STATIONS from "../../../json/chargeStations";
import SampleLineGraph from "../Dashboard/Charts/SampleLineGraph.jsx";
import WeeklyStationAverage from "../Dashboard/Charts/WeeklyStationAverage.jsx";
import Warning from "../Dashboard/Warning.jsx";


class DashboardStation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                chargeStations: CHARGE_STATIONS
            },
            filtered: '',
        }
        this.handleClick = this.handleClick.bind(this);
        this.getStationDetails = this.getStationDetails.bind(this);
    }

    getStationDetails() {
        return this.state.data.chargeStations
            .filter(dataItem => (dataItem.ID) === (this.props.pickedStation))
            .map((item) => (
                <Table.Row key={item}>
                    <Table.Cell>{item.Street_Address}</Table.Cell>
                    <Table.Cell>{item.Hours_Of_Operation}</Table.Cell>
                    <Table.Cell>{item.Charger_Fee}</Table.Cell>
                    <Table.Cell>{item.Charging_Standards}</Table.Cell>
                </Table.Row>
            ))
    }

    handleClick() {
        this.props.home(true);
    }

    render() {
        let alerts = [];
        let faultMap = this.props.analytics.getFaults(this.props.pickedStation);
        let mobileTotal;
        let deviceTotal;
        let webTotal;
        mobileTotal = this.props.analytics.getDataBySessionStart('MOBILE', this.props.pickedStation, 1).invalid.length + this.props.analytics.getDataBySessionStart('MOBILE', this.props.pickedStation, 1).valid.length;
        deviceTotal = this.props.analytics.getDataBySessionStart('DEVICE', this.props.pickedStation, 1).invalid.length + this.props.analytics.getDataBySessionStart('DEVICE', this.props.pickedStation, 1).valid.length;
        webTotal = this.props.analytics.getDataBySessionStart('WEB', this.props.pickedStation, 1).invalid.length + this.props.analytics.getDataBySessionStart('WEB', this.props.pickedStation, 1).valid.length;
      
        for (let [stationID, faults] of faultMap) {
            let currentWeek = this.props.analytics.getWeekNumberOf(new Date(this.props.analytics.getTime()));

            // Color the station orange if there was a probable fault last week
            if (faults[faults.length - 1].week === currentWeek - 1) {
                alerts.push(<Warning stationID={stationID}/>);
            }
        }
        const showItems = this.getStationDetails();
        
      return (
            <div className={style.container}>
                <Button onClick={this.handleClick}> Summary </Button>
                <Table>
                    <TableBody>
                        {showItems}
                    </TableBody>
                </Table>
                <div className={style.dashView}>
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
                          <Card fluid style={{backgroundColor: '#212124', boxShadow: '0 1px 3px 0 #141414, 0 0 0 1px #141414'}}> 
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
                                    {this.props.analytics.getDataBySessionStart('MOBILE', this.props.pickedStation, 1).invalid.length} invalid sessions/{mobileTotal}
                                  </Grid.Column>
                                </Grid.Row>
                                <Grid.Row stretched columns={2} style={{color: '#D8D9DA'}}>
                                  <Grid.Column>
                                    Device
                                  </Grid.Column>
                                  <Grid.Column>
                                    {this.props.analytics.getDataBySessionStart('DEVICE', this.props.pickedStation, 1).invalid.length} invalid sessions/{deviceTotal}
                                  </Grid.Column>
                                </Grid.Row>
                                <Grid.Row stretched columns={2} style={{color: '#D8D9DA'}}>
                                  <Grid.Column>
                                    Web
                                  </Grid.Column>
                                  <Grid.Column>
                                    {this.props.analytics.getDataBySessionStart('WEB', this.props.pickedStation, 1).invalid.length} invalid sessions/{webTotal}
                                  </Grid.Column>
                                </Grid.Row>
                              </Grid>
                            </Card.Content>
                          </Card>
                        </Grid.Column>
                        <Grid.Column>
                          <Card fluid style={{backgroundColor: '#212124', boxShadow: '0 1px 3px 0 #141414, 0 0 0 1px #141414'}}>
                            <Card.Content>
                              <Card.Header style={{color: '#D8D9DA', paddingBottom: '1em'}}>
                                Valid Session Averages
                              </Card.Header>
                              <Grid>
                                  <Grid.Row stretched columns={2} style={{color: '#D8D9DA'}}>
                                    <Grid.Column>
                                      Duration
                                    </Grid.Column>
                                    <Grid.Column>
                                      {Math.round(this.props.analytics.getAverageDuration(this.props.pickedStation, 1) * 1000) / 1000} ms
                                    </Grid.Column>
                                  </Grid.Row>
                                  <Grid.Row stretched columns={2} style={{color: '#D8D9DA'}}>
                                    <Grid.Column>
                                      Electricity Usage
                                    </Grid.Column>
                                    <Grid.Column>
                                      {Math.round(this.props.analytics.getAveragePowerUsage(this.props.pickedStation, 1) * 1000) / 1000} kWh/session
                                    </Grid.Column>
                                  </Grid.Row>
                              </Grid>
                            </Card.Content>
                          </Card>
                        </Grid.Column>
                        <Grid.Column>
                          <Card fluid style={{backgroundColor: '#212124', boxShadow: '0 1px 3px 0 #141414, 0 0 0 1px #141414'}}>
                            <Card.Content>
                              <Card.Header style={{color: '#D8D9DA', paddingBottom: '1em'}}>
                                Average Turnaround Time
                              </Card.Header>
                                <Grid>
                                  <Grid.Row stretched columns={2} style={{color: '#D8D9DA'}}>
                                    <Grid.Column>
                                      {Math.round(this.props.analytics.getAverageTurnaround(this.props.pickedStation, 1) * 1000) / 1000} s
                                    </Grid.Column>
                                  </Grid.Row>
                                </Grid>
                            </Card.Content>
                          </Card>
                        </Grid.Column>
                      </Grid.Row>
                    </Grid>
                </div>
            </div>
        )
    }
}

export default DashboardStation;