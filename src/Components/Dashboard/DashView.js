import React from 'react';
import { Card, Image, Statistic } from 'semantic-ui-react';
import { Pie, Bar } from 'react-chartjs-2'
import style from './dashboard.scss';

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
              let BarChart = require("react-chartjs").Bar;

              let MyComponent = React.createClass({
              render: function() {
              return <BarChart data={chartData} options={chartOptions}/>
            }
            });
            </Card.Content>
          </Card>
          <Card color='red'>
            <Card.Content>
              <Card.Header>
                Some more Data
              </Card.Header>
              let PieChart = require("react-chartjs").Pie;

              let MyComponent = React.createClass({
              render: function() {
              return <PieChart data={chartData} options={chartOptions}/>
            }
            });
            </Card.Content>
          </Card>
        </Card.Group>
      </div>
    </div>
  )
}
