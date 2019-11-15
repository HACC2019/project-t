import React, { Component } from 'react';
import { Bar } from 'react-chartjs-2';
import GraphCard from '../GraphCard.jsx';
const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default class CumulativeSessions extends Component {
  constructor(props) {
    super(props);

    this.props.analytics.addListener(this, this.forceUpdate);
  }
  
  render() {
    let adjustedEpoch = new Date('01-01-1970 00:00:00');
    let aggregateHours = this.props.analytics._timeRange.aggregate;
    let valid = this.props.analytics.aggregateRecords(this.props.analytics.getRecords(this.props.stationID));
    let invalid = this.props.analytics.aggregateRecords(this.props.analytics.getInvalidRecords(this.props.stationID));

    let futureInvalid = [];
    let futureValid = [];
    let futureLength = 0;
    let labels = [];
    let startIndex = -1;

    //Set values of future data here.
    if (this.props.analytics._futureTimeRange.type !== "Current") {
      futureValid = [90, 90, 90, 90, 90];  //insert forecasting functions here
      futureInvalid = [50, 50, 50, 50];  //insert forecasting functions here
      futureLength = (futureValid.length > futureInvalid.length) ? futureValid.length : futureInvalid.length;
    } else {
      futureInvalid = [];
      futureValid = [];
      futureLength = 0;
    }
    
    
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

    if (this.props.analytics._futureTimeRange.type !== "Current") {
      /* creates x-axis labels for future data
       * not sure if we should go by valid.length or invalid.length
       */
      futureLength = futureLength +  valid.length;
      for (let j = valid.length; j < futureLength; j++) {
        let date = this.props.analytics.getDateFromWeek(j);
        labels.push(`${date.getMonth() < 10 ? `0${date.getMonth()}` : date.getMonth()}-${date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()}-${date.getFullYear().toString().substring(2)}`);    
      }
    }

    if (this.props.analytics._futureTimeRange.type !== "Current") {
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
  
    if (this.props.analytics._futureTimeRange.type !== "Current") {
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
    );

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
      <GraphCard title='Cumulative Sessions'>
        <Bar data={chartData} options={chartOptions}/>
      </GraphCard>
    );
  }
}