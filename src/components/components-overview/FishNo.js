import React, { Component } from "react";
import Chart from "react-apexcharts";


class FishNo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    
      series: [
        {
          name: 'Tank 2',
          data: [81]
        },
        {
          name: 'Tank 3',
          data: [100]
        },
        {
          name: 'Tank 4',
          data: [100]
        },
        {
          name: 'Tank 5',
          data: [90]
        },
        {
          name: 'Tank 6',
          data: [112]
        },
        {
        name: 'Tank 7',
        data: [46]
      }, {
        name: 'Tank 8',
        data: [51]
      }, {
        name: 'Tank 9',
        data: [328]
      }, {
        name: 'Tank 10',
        data: [50]
      },
      {
        name: 'Tank 11',
        data: [54]
      },
      {
        name: 'Tank 12',
        data: [53]
      },
      {
        name: 'Tank 13',
        data: [50]
      },
      {
        name: 'Tank 14',
        data: [97]
      },

    
    
    ],
      options: {
        colors: ['#2E93fA', '#66DA26', '#546E7A', '#E91E63', '#FF9800','#e8563c','#3d8522','#1956a6','#64676b','#7d439c','#9c1363','#0e7569','#8a2c0a'],
        title: {
          text: 'Total Number of Fish:1320',
          align: 'left',
          margin: 10,
          offsetX: 0,
          offsetY: 0,
          floating: false,
          style: {
            fontSize:  '14px',
            fontWeight:  'bold',
            color:  '#263238'
          },
      },
      
        chart: {
          type: 'bar',
          height: 350,
          stacked: true,
          toolbar: {
            show: true
          },
          zoom: {
            enabled: true
          }
        },
        responsive: [{
          breakpoint: 480,
          options: {
            legend: {
              position: 'bottom',
              offsetX: -10,
              offsetY: 0
            }
          }
        }],
        plotOptions: {
          bar: {
            borderRadius: 8,
            horizontal: false,
          },
        },
        xaxis: {
          type: 'string',
          categories: ['Tilapia Fish Tanks'],
        },
        legend: {
          position: 'right',
          offsetY: 40
        },
        fill: {
          opacity: 1
        }
      },
    
    
    };

  }

  render() {
    return (

      <Chart options={this.state.options} series={this.state.series} type="bar" />
    );
  }
}

export default FishNo;
