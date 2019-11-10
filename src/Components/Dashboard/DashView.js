import React from 'react';
import { Grid, Card, Image, Statistic } from 'semantic-ui-react';
import style from './dashboard.scss';

import SomeBarChart from './Charts/SomeBarChart';
import SomePieChart from './Charts/SomePieChart';

export default function DashView() {

  return (
    <div className={style.container}>
      <div className={style.dashView}>
        <Grid centered columns={4}>
          <Grid.Row centered stretched>
            <Statistic inverted size='small'>
              <Statistic.Value>
                Turnaround Time
              </Statistic.Value>
              <Statistic.Label>Average Time Between Uses</Statistic.Label>
            </Statistic>
          </Grid.Row>
          <Grid.Row stretched centered >
            <Grid.Column width={8}>
            <Card fluid>
              <Card.Content>
              <Card.Header>
                Some Data
                </Card.Header>
                <SomeBarChart />
              </Card.Content>
              </Card>
            </Grid.Column>
            <Grid.Column>
              <Card>
                <Card.Content>
                  <Card.Header>
                    Some more Data
                  </Card.Header>
                  <SomePieChart />
                </Card.Content>
              </Card>
              <Card>
                <Card.Content>
                  <Card.Header>
                    Some more Data
                  </Card.Header>
                  <SomeBarChart />
                </Card.Content>
              </Card>
            </Grid.Column>
            <Grid.Column>
              <Card>
                <Card.Content>
                  <Card.Header>
                    Some more Data
                  </Card.Header>
                  <SomeBarChart />
                </Card.Content>
              </Card>
                <Card>
                <Card.Content>
                    <Card.Header>
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
