import React, { Component } from 'react';
import { Bar } from 'react-chartjs-2';
import {getWeeklyTotals} from '../../../../lib/map_tools.js';

export default class WeeklyStationAverage extends Component {
  constructor(props) {
    super(props);

    this.props.analytics.addListener(this, this.forceUpdate)
  }
  
  render() {
    // fetch data here
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
          scaleLabel: {
            display: true,
            labelString: 'Week',
            fontColor: '#D8D9DA'
          },
          ticks: {
            fontColor: '#D8D9DA'
          },
          gridLines: {
          color: '#464648'
        },
        stacked: true

        }],
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Sessions',
            fontColor: '#D8D9DA'
          },
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
