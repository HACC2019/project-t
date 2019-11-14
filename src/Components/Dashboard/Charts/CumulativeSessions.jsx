import React, { Component } from 'react';
import { Bar } from 'react-chartjs-2';
import {getWeeklyTotals} from '../../../../lib/map_tools.js';

export default class CumulativeSessions extends Component {
  constructor(props) {
    super(props);

    this.props.analytics.addListener(this, this.forceUpdate);
  }
  
  render() {
    
    console.log(this.props.stationID);
    let valid = getWeeklyTotals(this.props.analytics.getRecords(this.props.stationID));
    let invalid = getWeeklyTotals(this.props.analytics.getInvalidRecords(this.props.stationID));
    let futureInvalid = [];
    let futureValid = [];
    let futureLength = 0;
    let labels = [];

    //Set values of future data here.
    if (this.props.analytics._futureTimeRange.on) {
      futureValid = [90, 90, 90, 90, 90];  //insert forecasting functions here
      futureInvalid = [50, 50, 50, 50];  //insert forecasting functions here
      futureLength = (futureValid.length > futureInvalid.length) ? futureValid.length : futureInvalid.length;
    } else {
      futureInvalid = [];
      futureValid = [];
      futureLength = 0;
    }
    
    let startIndex = -1;
    
    for (let i = 0; i < valid.length; i++) {
      if (valid[i] !== undefined) {
        if (startIndex === -1) {
          startIndex = i;
        }
        if (startIndex !== -1) {
          let date = this.props.analytics.getDateFromWeek(i);
          labels.push(`${date.getMonth() < 10 ? `0${date.getMonth()}` : date.getMonth()}-${date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()}-${date.getFullYear().toString().substring(2)}`);
        }
      }
    }

    if (this.props.analytics._futureTimeRange.on) {
      /* creates x-axis labels for future data
       * not sure if we should go by valid.length or invalid.length
       */
      futureLength = futureLength +  valid.length;
      for (let j = valid.length; j < futureLength; j++) {
        let date = this.props.analytics.getDateFromWeek(j);
        labels.push(`${date.getMonth() < 10 ? `0${date.getMonth()}` : date.getMonth()}-${date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()}-${date.getFullYear().toString().substring(2)}`);    
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

    if (this.props.analytics._futureTimeRange.on) {
      // Shifts future data to future timeline by adding undefined to beginning of arrays
      for (let i = 0; i < valid.length; i++) {
        futureValid.unshift(undefined);
      }

      // Shifts future data to future timeline by adding undefined to beginning of arrays
      for (let i = 0; i < invalid.length; i++) {
        futureInvalid.unshift(undefined);
      }
    }


    let bars;
  
    if (this.props.analytics._futureTimeRange.on) {
      bars = [
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
        },
        { // one stack of the bar
          label: 'Predicted Invalid Sess.',
          data: futureInvalid,
          backgroundColor: 'rgba(255, 137, 64, 0.2)',
          borderColor: 'rgba(255, 137, 64, 1)',
          borderWidth: 1
          },
        { // one stack of the bar
          label: 'Predicted Valid Sess.',
          data: futureValid,
          backgroundColor: 'rgba(54, 117, 235, 0.2)',
          borderColor: 'rgba(54, 117, 235, 1)',
          borderWidth: 1
        }
      ];
    } else {
      bars = [
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
      ];
    }

  const chartData = () => (
    {
      barPercentage: 0.3,
      barThickness: 'flex',
      maxBarThickness: 8,
      minBarLength: 2,
      borderColor: '#464648',

      labels: labels, // label all axes here
      datasets: bars
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
    <div>
      <Bar data={chartData} options={chartOptions}/>
    </div>
  )
  }
}