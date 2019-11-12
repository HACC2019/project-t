import React, { Component } from 'react';
import { Bar } from 'react-chartjs-2';
import {getWeeklyTotals} from '../../../../lib/map_tools.js';

var timeFormat = 'MM/DD/YYYY HH:mm';

function newDate(days) {
    return new Date(Date.now() + (1000 * 60 * 60 * 24 * days));
}

function newDateString(days) {
    let date = newDate(days);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
}

var MONTHS = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];

var COLORS = [
    '#4dc9f6',
    '#f67019',
    '#f53794',
    '#537bc4',
    '#acc236',
    '#166a8f',
    '#00a950',
    '#58595b',
    '#8549ba'
];

let Samples = {};

Samples.utils = {
  // Adapted from http://indiegamr.com/generate-repeatable-random-numbers-in-js/
  srand: function(seed) {
      this._seed = seed;
  },

  rand: function(min, max) {
      var seed = this._seed;
      min = min === undefined ? 0 : min;
      max = max === undefined ? 1 : max;
      this._seed = (seed * 9301 + 49297) % 233280;
      return min + (this._seed / 233280) * (max - min);
  },

  numbers: function(config) {
      var cfg = config || {};
      var min = cfg.min || 0;
      var max = cfg.max || 1;
      var from = cfg.from || [];
      var count = cfg.count || 8;
      var decimals = cfg.decimals || 8;
      var continuity = cfg.continuity || 1;
      var dfactor = Math.pow(10, decimals) || 0;
      var data = [];
      var i, value;

      for (i = 0; i < count; ++i) {
          value = (from[i] || 0) + this.rand(min, max);
          if (this.rand() <= continuity) {
              data.push(Math.round(dfactor * value) / dfactor);
          } else {
              data.push(null);
          }
      }

      return data;
  },

  labels: function(config) {
      var cfg = config || {};
      var min = cfg.min || 0;
      var max = cfg.max || 100;
      var count = cfg.count || 8;
      var step = (max - min) / count;
      var decimals = cfg.decimals || 8;
      var dfactor = Math.pow(10, decimals) || 0;
      var prefix = cfg.prefix || '';
      var values = [];
      var i;

      for (i = min; i < max; i += step) {
          values.push(prefix + Math.round(dfactor * i) / dfactor);
      }

      return values;
  },

  months: function(config) {
      var cfg = config || {};
      var count = cfg.count || 12;
      var section = cfg.section;
      var values = [];
      var i, value;

      for (i = 0; i < count; ++i) {
          value = MONTHS[Math.ceil(i) % 12];
          values.push(value.substring(0, section));
      }

      return values;
  },

  color: function(index) {
      return COLORS[index % COLORS.length];
  },

  transparentize: function(color, opacity) {
      var alpha = opacity === undefined ? 0.5 : 1 - opacity;
      return Color(color).alpha(alpha).rgbString();
  }
};

Samples.utils.srand(98234589723948);

// DEPRECATED
function randomScalingFactor() {
  return Math.round(Samples.utils.rand(-100, 100));
};

export default class SampleLineGraph extends Component {
//  constructor(props) {
//    super(props);
//  }
  
  render() {
    const chartData = {
        labels: [ // Date Objects
            newDate(0),
            newDate(1),
            newDate(2),
            newDate(3),
            newDate(4),
            newDate(5),
            newDate(6)
        ],
        datasets: [{
            label: 'My First dataset',
            backgroundColor: '#FF6384',
            borderColor: '#FF6384',
            fill: false,
            data: [
                randomScalingFactor(),
                randomScalingFactor(),
                randomScalingFactor(),
                randomScalingFactor(),
                randomScalingFactor(),
                randomScalingFactor(),
                randomScalingFactor()
            ],
        }, {
            label: 'My Second dataset',
            backgroundColor: '#36A2EB',
            borderColor: '#36A2EB',
            fill: false,
            data: [
                randomScalingFactor(),
                randomScalingFactor(),
                randomScalingFactor(),
                randomScalingFactor(),
                randomScalingFactor(),
                randomScalingFactor(),
                randomScalingFactor()
            ],
        }, {
            label: 'Dataset with point data',
            backgroundColor: '#4bc0c0',
            borderColor: '#4bc0c0',
            fill: false,
            data: [{
                x: newDateString(0),
                y: randomScalingFactor()
            }, {
                x: newDateString(5),
                y: randomScalingFactor()
            }, {
                x: newDateString(7),
                y: randomScalingFactor()
            }, {
                x: newDateString(15),
                y: randomScalingFactor()
            }],
        }]
    }

    const chartOptions = {
      legend: {
        labels: {
          fontColor: '#D8D9DA'
        }
      },
      scales: {
        xAxes: [{
          type: 'time',
          time: {
              parser: timeFormat,
              // round: 'day'
              tooltipFormat: 'll HH:mm'
          },
          scaleLabel: {
              display: true,
              labelString: 'Date'
          },
          ticks: {
            fontColor: '#D8D9DA'
          },
          gridLines: {
            color: '#464648'
          },
        }],
        yAxes: [{
          scaleLabel: {
							display: true,
							labelString: 'value'
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
