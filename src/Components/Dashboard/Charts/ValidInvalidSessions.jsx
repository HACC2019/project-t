import React, { Component } from 'react';
import { Bar } from 'react-chartjs-2';
import GraphCard from '../GraphCard.jsx';
import {getWeeklyTotals} from '../../../../lib/map_tools.js';
const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default class ValidInvalidSessions extends Component {
  constructor(props) {
    super(props);

    this.props.analytics.addListener(this, this.forceUpdate);
  }

  render() {
    let adjustedEpoch = new Date('01-01-1970 00:00:00');
    let aggregateHours = this.props.analytics._timeRange.aggregate;
    let valid = this.props.analytics.aggregateRecords(this.props.analytics.getRecords(this.props.stationID));
    let invalid = this.props.analytics.aggregateRecords(this.props.analytics.getInvalidRecords(this.props.stationID));

    let labels = [];
    let startIndex = -1;

    for (let i = 0; i < valid.length; i++) {
      if (startIndex === -1 && (valid[i] !== undefined || invalid[i] !== undefined)) {
        startIndex = i;
      }

      if (startIndex > -1) {
        if (valid[i] === undefined) {
          valid[i] = 0;
        }
        if (invalid[i] === undefined) {
          invalid[i] = 0;
        }

        if (aggregateHours == 1) {
          let date = new Date(1000 * 3600 * i + adjustedEpoch.getTime());
          labels.push(`${date.getHours() > 12 ? date.getHours() - 12 : date.getHours() == 0 ? 12 : date.getHours()} ${date.getHours() < 12 ? 'AM' : 'PM'}`);
        } else if (aggregateHours == 24) {
          let date = new Date(1000 * 3600 * 24 * i + adjustedEpoch.getTime());
          labels.push(`${monthNames[date.getMonth()]} ${date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()}`);
        } else if (aggregateHours == 168) {
          let date = this.props.analytics.getDateFromWeek(i);
          labels.push(`${monthNames[date.getMonth()]} ${date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()}`);
        }
      }
    }

    valid = valid.splice(startIndex);
    invalid = invalid.splice(startIndex);

    const chartData = {
      barPercentage: 0.3,
      barThickness: 'flex',
      maxBarThickness: 8,
      minBarLength: 2,
      borderColor: '#464648',

      labels: labels, // label all axes here
      datasets: [
        { // one stack of the bar
          label: 'Invalid Sessions',
          data: invalid,
          backgroundColor: 'rgba(255, 159, 64, 0.2)',
          borderColor: 'rgba(255, 159, 64, 1)',
          borderWidth: 1
        },
        {
          label: 'Valid Sessions',
          data: valid,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }
      ]
    };

    let xAxisLabel;

    if (aggregateHours == 1) {
      xAxisLabel = 'Hours';
    } else if (aggregateHours == 24) {
      xAxisLabel = 'Days';
    } else if (aggregateHours == 168) {
      xAxisLabel = 'Weeks';
    }

    const chartOptions = {
      maintainAspectRatio: false,
      animation: false,
      legend: {
        labels: {
          fontColor: '#D8D9DA'
        }
      },
      scales: {
        xAxes: [{
          ticks: {
            fontColor: '#D8D9DA'
          },
          gridLines: {
            color: '#464648'
          },
          scaleLabel: {
            display: true,
            labelString: xAxisLabel,
            fontColor: '#D8D9DA'
          },
          stacked: true
        }],
        yAxes: [{
          ticks: {
            suggestedMin: 0,
            fontColor: '#D8D9DA'
          },
          gridLines: {
            color: '#464648'
          },
          scaleLabel: {
            display: true,
            labelString: 'Sessions',
            fontColor: '#D8D9DA'
          },
          stacked: true
        }]
      },
      chartArea: {
        backgroundColor: '#212124'
      }
    }

    return (
      <GraphCard title='Session Overview'>
        <div style={{position: 'relative', height: '30vh'}}>
          <Bar data={chartData} options={chartOptions}/>
        </div>
      </GraphCard>
    );
  }
}