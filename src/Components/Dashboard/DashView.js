import React from 'react';
import { Card, Image, Statistic } from 'semantic-ui-react';
import style from './dashboard.scss';

import SomeBarChart from './Charts/SomeBarChart';
import SomePieChart from './Charts/SomePieChart';

export default function DashView() {

  return (
    <div className={style.container}>
      <div className={style.dashView}>
        <Statistic size='small'>
          <Statistic.Value>
            Turnaround Time
          </Statistic.Value>
          <Statistic.Label>Average Time Between Uses</Statistic.Label>

        </Statistic>
        <Card.Group>
          <Card color='red'>
            <Card.Content>
              <Card.Header>
                Some Data
              </Card.Header>
              <SomeBarChart />
            </Card.Content>
          </Card>
          <Card color='red'>
            <Card.Content>
              <Card.Header>
                Some more Data
              </Card.Header>
              <SomePieChart />
            </Card.Content>
          </Card>
        </Card.Group>
      </div>
    </div>
  )
}
