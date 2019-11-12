import React from 'react';
import { Bar } from 'react-chartjs-2';

export default function SomeBarChart() {
  // fetch data here
  const chartData = () => (
    {
      barPercentage: 0.3,
      barThickness: 'flex',
      maxBarThickness: 8,
      minBarLength: 2,
      borderColor: '#464648',

      labels: ['2018', '2019'], // label all axes here
      datasets: [
          { // one stack of the bar
          label: 'Oahu',
          data: [10, 15],
          backgroundColor: 'rgba(255, 159, 64, 0.2)',
          borderColor: 'rgba(255, 159, 64, 1)',
          borderWidth: 1
          },
          {
            label: 'Maui County',
            data: [5, 7],
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
