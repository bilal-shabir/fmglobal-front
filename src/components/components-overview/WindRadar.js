import React, { Component } from "react";
import Chart from "react-apexcharts";


class WindRadar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    
      series: [{
        name: 'Location A',
        data: [5,
          13,
          6,
          6,
          15,
          15,
          11,
          12,
          14,
          3,
          14,
          3,
          8,
          17,
          4,
          9
          ],
      }, {
        name: 'Location B',
        data: [5,
          18,
          11,
          18,
          16,
          13,
          18,
          8,
          14,
          12,
          18,
          3,
          12,
          10,
          6,
          9
          ],
      }, {
        name: 'Location C',
        data: [17,
          12,
          15,
          2,
          4,
          10,
          6,
          14,
          9,
          10,
          9,
          3,
          14,
          14,
          15,
          15
          ],
      }],
      options: {
        chart: {
          height: 350,
          type: 'radar',
          dropShadow: {
            enabled: true,
            blur: 1,
            left: 1,
            top: 1
          }
        },

        stroke: {
          width: 2
        },
        fill: {
          opacity: 0.2
        },
        markers: {
          size: 0
        },
        xaxis: {
          categories: ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW']
        }
      },
    
    };
  }

  render() {
    return (

      <Chart options={this.state.options} series={this.state.series} type="radar" />
    );
  }
}

export default WindRadar;
