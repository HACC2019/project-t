import React, { Component } from 'react';
import { Bar } from 'react-chartjs-2';
import {getWeeklyTotals} from '../../../../lib/map_tools.js';

export default class WeeklyStationAverage extends Component {
//  constructor(props) {
//    super(props);
//  }
  
  render() {
    // fetch data here
    console.log(this.props.analytics)
    let data = getWeeklyTotals(this.props.analytics.getRecords(this.props.stationID));
    let labels = [];
    console.log(data);
    
    let startIndex = -1;
    
    for (let i = 0; i < data.length; i++) {
      if (data[i] !== undefined) {
        if (startIndex === -1) {
          startIndex = i;
        }
        if (startIndex !== -1) {
          labels.push(i);
        }
      }
    }
    data = data.splice(startIndex);
    
    const chartData = () => (
      {
        barPercentage: 0.3,
        barThickness: 'flex',
        maxBarThickness: 8,
        minBarLength: 2,
        borderColor: '#464648',

        labels: labels, // label all bars here
        datasets: [
            { // one stack of the bar
            label: `Station ${this.props.stationID}`,
            data: data,
            backgroundColor: 'rgba(255, 159, 64, 0.2)',
            borderColor: 'rgba(255, 159, 64, 1)',
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
