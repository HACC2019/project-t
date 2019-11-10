import React from 'react'
import { Pie, defaults } from 'react-chartjs-2';

export default function SomePieChart() {
  // data fetching here
  const chartData = () => (
    {
      datasets: [
        {
          data: [10, 20, 30],
          backgroundColor: ['red', 'blue', 'green']
        }
      ], 
      labels: [
        'Red',
        'Blue',
        'Green'
      ]
    }
  )

  const chartOptions = defaults.pie;

  return (
    <div>
      <Pie data={chartData} options={chartOptions} />
    </div>
  )
}
