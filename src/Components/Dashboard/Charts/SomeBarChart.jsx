import React, { Component } from 'react';
import { Bar } from 'react-chartjs-2';
import {getWeeklyTotals} from '../../../../lib/map_tools.js';

export default class SomeBarChart extends Component {
  constructor(props) {
    super(props);

    this.props.analytics.addListener(this, this.forceUpdate);
  }
  
  render() {
    
    console.log(this.props.stationID);
    let valid = getWeeklyTotals(this.props.analytics.getRecords(this.props.stationID));
    let invalid = getWeeklyTotals(this.props.analytics.getInvalidRecords(this.props.stationID));
  

    let labels = [];

    
    let startIndex = -1;
    
    for (let i = 0; i < valid.length; i++) {
      if (valid[i] !== undefined) {
        if (startIndex === -1) {
          startIndex = i;
        }
        if (startIndex !== -1) {
          labels.push(i);
        }
      }
    }
    valid = valid.splice(startIndex);
    
    for (let i = 0; i < invalid.length; i++) {
      if (invalid[i] !== undefined) {
        if (startIndex === -1) {
          startIndex = i;
        }
      }
    }
    invalid = invalid.splice(startIndex);
  
  const chartData = () => (
    {
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
    }
  )

  const chartOptions = {
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
            labelString: 'Week',
            fontColor: '#D8D9DA'
          },
        stacked: true
      }],
      yAxes: [{
        ticks: {
            fontColor: '#D8D9DA'
          },
          gridLines: {
          color: '#464648'
        },
        stacked: true
      }]
    },
    chartArea: {
        backgroundColor: '#212124'
    }
  }

  return (
    <div>
      <Bar data={chartData} options={chartOptions}/>
    </div>
  )
  }
}