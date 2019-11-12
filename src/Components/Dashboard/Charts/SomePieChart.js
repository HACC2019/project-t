import React from 'react'
import { Pie, defaults } from 'react-chartjs-2';

export default function SomePieChart() {
  // data fetching here
  const chartData = () => (
    {
      datasets: [
        {
          data: [10, 20, 30],
          backgroundColor: ['rgba(195, 21, 21, 0.6)', 'rgba(48, 21, 195, 0.6)', 'rgba(24, 195, 21, 0.6)'],
          borderColor: '#464648',
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
