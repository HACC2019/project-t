import React, { Component } from 'react';
import { Grid, Card, Image, Statistic } from 'semantic-ui-react';
import style from './dashboard.scss';
import Warning from './Warning.jsx'
import WeeklyStationAverage from './Charts/WeeklyStationAverage.jsx';
import SampleLineGraph from './Charts/SampleLineGraph.jsx';
import SomeBarChart from './Charts/SomeBarChart';
import SomePieChart from './Charts/SomePieChart';

export default class DashView extends Component {
  render() {
    return (
      <div className={style.container}>
        <div className={style.dashView}>
          <Grid columns='equal'>
            <Grid.Row stretched centered>
              <Grid.Column>
                <Warning station={this.props.analytics.getRecords()[0]}/>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row stretched centered>
              <Grid.Column>
                <Card fluid style={{backgroundColor: '#212124', boxShadow: '0 1px 3px 0 #141414, 0 0 0 1px #141414'}}>
                  <Card.Content>
                    <Card.Header style={{color: '#D8D9DA'}}>
                      Station 5
                    </Card.Header>
                    <SampleLineGraph/>
                  </Card.Content>
                </Card>
              </Grid.Column>
            </Grid.Row>
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
                      Some more Data
                    </Card.Header>
                    <SomePieChart />
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
                    <SomeBarChart />
                  </Card.Content>
                </Card>
              </Grid.Column>
              <Grid.Column>
                <Card fluid style={{backgroundColor: '#212124', boxShadow: '0 1px 3px 0 #141414, 0 0 0 1px #141414'}}>
                  <Card.Content>
                    <Card.Header style={{color: '#D8D9DA'}}>
                      Some more Data
                    </Card.Header>
                    <SomeBarChart />
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
                    <SomeBarChart />
                  </Card.Content>
                </Card>
              </Grid.Column>
              <Grid.Column>
                <Card fluid style={{backgroundColor: '#212124', boxShadow: '0 1px 3px 0 #141414, 0 0 0 1px #141414'}}>
                  <Card.Content>
                    <Card.Header style={{color: '#D8D9DA'}}>
                      Some more Data
                    </Card.Header>
                    <SomeBarChart />
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
