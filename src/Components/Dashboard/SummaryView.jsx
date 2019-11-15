import React, { Component } from 'react';
import { Grid, Card } from 'semantic-ui-react';
import Warning from './Warning.jsx';
import CumulativeSessions from './Charts/CumulativeSessions.jsx'
import InitiationMethod from './Charts/InitiationMethod.jsx';
import PaymentType from './Charts/PaymentType.jsx'
import PortType from './Charts/PortType.jsx'
import style from '../../styles/dashboard.scss';

export default class SummaryView extends Component {
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
      <div>
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
              <CumulativeSessions analytics={this.props.analytics}/>
            </Grid.Column>
            <Grid.Column>
              <InitiationMethod analytics={this.props.analytics} />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <PaymentType analytics={this.props.analytics} />
            </Grid.Column>
            <Grid.Column>
              <PortType analytics={this.props.analytics} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}
