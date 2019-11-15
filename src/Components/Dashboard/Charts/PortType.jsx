import React, { Component } from 'react';
import { Bar } from 'react-chartjs-2';
import GraphCard from '../GraphCard.jsx';
import {getWeeklyTotals} from '../../../../lib/map_tools.js';
const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default class PortType extends Component {
  constructor(props) {
    super(props);

    this.props.analytics.addListener(this, this.forceUpdate);
  }

  render() {

    let adjustedEpoch = new Date('01-01-1970 00:00:00');
    let aggregateHours = this.props.analytics._timeRange.aggregate;
    let chademoData = this.props.analytics.getDataByPortType('CHADEMO', this.props.stationID);
    chademoData = chademoData.valid.concat(chademoData.invalid);
    chademoData = this.props.analytics.aggregateRecords(chademoData);
    let dcData = this.props.analytics.getDataByPortType('DCCOMBOTYP1', this.props.stationID);
    dcData = dcData.valid.concat(dcData.invalid);
    dcData = this.props.analytics.aggregateRecords(dcData);

    let labels = [];
    let startIndex = -1;

    // RFID
    for (let i = 0; i < chademoData.length; i++) {
      if (startIndex === -1 && (chademoData[i] !== undefined || dcData[i] !== undefined)) {
        startIndex = i;
      }

      if (startIndex > -1) {
        if (chademoData[i] === undefined) {
          chademoData[i] = 0;
        }
        if (dcData[i] === undefined) {
          dcData[i] = 0;
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

    chademoData = chademoData.splice(startIndex);
    dcData = dcData.splice(startIndex);

    const chartData = {
      barPercentage: 0.3,
      barThickness: 'flex',
      maxBarThickness: 8,
      minBarLength: 2,
      borderColor: '#464648',

      labels: labels, // label all axes here
      datasets: [
        { // one stack of the bar
          label: 'CHADEMO',
          data: chademoData,
          backgroundColor: 'rgba(255, 159, 64, 0.2)',
          borderColor: 'rgba(255, 159, 64, 1)',
          borderWidth: 1
        },
        {
          label: 'DCCOMBOTYP1',
          data: dcData,
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
      animation: {
        duration: 100,
        easing: 'easeOutQuart'
      },
      maintainAspectRatio: false,
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
      <GraphCard title='Charging Port Type'>
        <Bar data={chartData} options={chartOptions}/>
      </GraphCard>
    );
  }
}