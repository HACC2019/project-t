import React from 'react'
import { Pie, defaults } from 'react-chartjs-2';

export default function SomePieChart() {
  // data fetching here
  const chartData = () => (
    {
      datasets: [
        {
          data: [10, 20, 30],
          backgroundColor: ['red', 'blue', 'green'],
          borderColor: '#D8D9DA',
        }
      ], 
      labels: [
        'Red',
        'Blue',
        'Green'
      ]
    }
  )

  const chartOptions = {
    legend: {
      labels: {
        fontColor: '#D8D9DA'
      }
    },
    
  }

  return (
    <div>
      <Pie data={chartData} options={chartOptions} />
    </div>
  )
}
