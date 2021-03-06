import React, { Component } from 'react';
import { Grid, Card } from 'semantic-ui-react';
import style from './dashboard.scss';
import Warning from './Warning.jsx'
import WeeklyStationAverage from './Charts/WeeklyStationAverage.jsx';
import ValidInvalidSessions from './Charts/ValidInvalidSessions.jsx';
import SomePieChart from './Charts/SomePieChart';

export default class DashView extends Component {
  render() {
    let alerts = [];
    let faultMap = this.props.analytics.getFaults(null, 9);
    
    for (let [stationID, faults] of faultMap) {
      let currentWeek = this.props.analytics.getWeekFromDate(new Date(this.props.analytics.getTime()));

      // Color the station orange if there was a probable fault last week
      if (faults[faults.length - 1].week === currentWeek - 1) {
        alerts.push(<Warning key={stationID} stationID={stationID}/>);
      }
    }
    
    return (
      <div className={style.container}>
        <div className={style.dashView}>
          <h1 style={{textAlign: 'center', color: '#D8D9DA', fontWeight: 500}}>Overall Summary</h1>
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
                    <Card.Header style={{color: '#D8D9DA'}}>
                      Station 5
                    </Card.Header>
                    <WeeklyStationAverage analytics={this.props.analytics} stationID={5}/>
                  </Card.Content>
                </Card>
              </Grid.Column>
                <Grid.Column>
                <Card fluid style={{backgroundColor: '#212124', boxShadow: '0 1px 3px 0 #141414, 0 0 0 1px #141414'}}>
                  <Card.Content>
                    <Card.Header style={{color: '#D8D9DA'}}>
                      Valid vs. Invalid Stations
                    </Card.Header>
                    <ValidInvalidSessions analytics={this.props.analytics} />
                  </Card.Content>
                </Card>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row stretched centered>
              <Grid.Column>
                <Card fluid style={{backgroundColor: '#212124', boxShadow: '0 1px 3px 0 #141414, 0 0 0 1px #141414'}}>
                  <Card.Content>
                    <Card.Header style={{color: '#D8D9DA'}}>
                      Some more Data
                    </Card.Header>
                    <ValidInvalidSessions analytics={this.props.analytics} />
                  </Card.Content>
                </Card>
              </Grid.Column>
              <Grid.Column>
                <Card fluid style={{backgroundColor: '#212124', boxShadow: '0 1px 3px 0 #141414, 0 0 0 1px #141414'}}>
                  <Card.Content>
                    <Card.Header style={{color: '#D8D9DA'}}>
                      Some more Data
                    </Card.Header>
                    <ValidInvalidSessions analytics={this.props.analytics} />
                  </Card.Content>
                </Card>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row stretched centered>
              <Grid.Column>
                <Card fluid style={{backgroundColor: '#212124', boxShadow: '0 1px 3px 0 #141414, 0 0 0 1px #141414'}}>
                  <Card.Content>
                    <Card.Header style={{color: '#D8D9DA'}}>
                      Some more Data
                    </Card.Header>
                    <ValidInvalidSessions analytics={this.props.analytics} />
                  </Card.Content>
                </Card>
              </Grid.Column>
              <Grid.Column>
                <Card fluid style={{backgroundColor: '#212124', boxShadow: '0 1px 3px 0 #141414, 0 0 0 1px #141414'}}>
                  <Card.Content>
                    <Card.Header style={{color: '#D8D9DA'}}>
                      Some more Data
                    </Card.Header>
                    <ValidInvalidSessions analytics={this.props.analytics} />
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
