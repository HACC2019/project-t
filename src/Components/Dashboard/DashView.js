import React, { Component } from 'react';
import { Grid, Card, Image, Statistic } from 'semantic-ui-react';
import style from './dashboard.scss';
import RecordAnalytics  from '../../../lib/RecordAnalytics.js';

import WeeklyStationAverage from './Charts/WeeklyStationAverage.jsx';
import SomeBarChart from './Charts/SomeBarChart';
import SomePieChart from './Charts/SomePieChart';

export default class DashView extends Component {
  render() {
    return (
      <div className={style.container}>
        <div className={style.dashView}>
          <Grid centered columns={4}>
            <Grid.Row stretched centered >
              <Grid.Column width={8}>
                <Card fluid color='orange'> 
                  <Card.Content>
                    <Card.Header>
                      Station 5
                    </Card.Header>
                    <WeeklyStationAverage analytics={this.props.analytics} stationID={5} />
                  </Card.Content>
                </Card>
                <Card fluid color='blue'> 
                  <Card.Content>
                    <Card.Header>
                      Station 6
                    </Card.Header>
                    <WeeklyStationAverage analytics={this.props.analytics} stationID={6} />
                  </Card.Content>
                </Card>
                <Card fluid>
                  <Card.Content>
                    <Card.Header>
                    Payment Mode
                    </Card.Header>
                    <Card.Content>
                    Credit Card: {new RecordAnalytics().getByDataByPayType(new RecordAnalytics().getInvalidRecords()), 'CREDITCARD'}
                    / {new RecordAnalytics().getByDataByPayType(new RecordAnalytics().getRecordsFor(this.props.stationID, 12), 'CREDITCARD')}
                    </Card.Content>
                    <Card.Content>
                      RFID: {new RecordAnalytics().getByDataByPayType(new RecordAnalytics().getInvalidRecords()), 'RFID'}
                      / {new RecordAnalytics().getByDataByPayType(new RecordAnalytics().getRecordsFor(this.props.stationID, 12), 'RFID')}
                    </Card.Content>
                  </Card.Content>
                </Card>
              </Grid.Column>
              <Grid.Column>
                <Card>
                  <Card.Content>
                    <Card.Header>
                    </Card.Header>
                    <Card.Content>
                      Valid Sessions: {new RecordAnalytics().getRecordsFor(this.props.stationID, 12).length}
                    </Card.Content>
                    <Card.Content>
                      Invalid Sessions: {new RecordAnalytics().getInvalidRecords().length}
                    </Card.Content>
                    <Card.Content>
                      Total Sessions: {new RecordAnalytics().gerRecordsFor(this.props.stationID, 12).length}
                    </Card.Content>
                  </Card.Content>
                </Card>
                <Card>
                  <Card.Content>
                    <Card.Header>
                      Average Turnaround Time
                    </Card.Header>
                      {new RecordAnalytics().getAverageTurnaround(this.props.stationID, 12)} Minutes
                  </Card.Content>
                </Card>
              </Grid.Column>
              <Grid.Column>
                <Card>
                  <Card.Content>
                    <Card.Header>

                    </Card.Header>
                    <Card.Content>
                      Credit Card: {new RecordAnalytics().getByDataByPayType(new RecordAnalytics().getInvalidRecords()), 'CREDITCARD'}
                      / {new RecordAnalytics().getByDataByPayType(new RecordAnalytics().getRecordsFor(this.props.stationID, 12), 'CREDITCARD')}
                    </Card.Content>
                    <Card.Content>
                      RFID: {new RecordAnalytics().getByDataByPayType(new RecordAnalytics().getInvalidRecords()), 'RFID'}
                      / {new RecordAnalytics().getByDataByPayType(new RecordAnalytics().getRecordsFor(this.props.stationID, 12), 'RFID')}
                    </Card.Content>
                  </Card.Content>
                </Card>
                  <Card>
                  <Card.Content>
                      <Card.Header>
                      </Card.Header>
                    <Card.Content>
                      Credit Card: {new RecordAnalytics().getByDataByPayType(new RecordAnalytics().getInvalidRecords()), 'CREDITCARD'}
                      / {new RecordAnalytics().getByDataByPayType(new RecordAnalytics().getRecords(this.props.stationID, 12), 'CREDITCARD')}
                    </Card.Content>
                    <Card.Content>
                      RFID: {new RecordAnalytics().getByDataByPayType(new RecordAnalytics().getInvalidRecords()), 'RFID'}
                      / {new RecordAnalytics().getByDataByPayType(new RecordAnalytics().getRecords(this.props.stationID, 12), 'RFID')}
                    </Card.Content>
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
