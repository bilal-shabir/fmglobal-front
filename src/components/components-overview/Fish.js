import React, { Component } from "react";
import Chart from "react-apexcharts";

class Fish extends React.Component {
  
    constructor(props) {
      super(props);
  
      this.state = {
        
        series: [{
          name: 'Max Fish Weight(g)',
          type: 'column',
          data: [203.8,293.6,80.2,150,335.4,358.2,396.2]
        }, {
          name: 'Max Fish Size (cm)',
          type: 'column',
          data: [21,22,16.5,19,24,24.7,25.5]
        }, {
          name: 'Average Daily Feed (g)',
          type: 'line',
          data: [56.32,67.81,39.39,60.69,91.15,89.62,105.56]
        }],
        options: {
          chart: {
            height: 350,
            type: 'line',
            stacked: false
          },
          dataLabels: {
            enabled: false
          },
          stroke: {
            width: [1, 1, 4]
          },
  
          xaxis: {
            categories: ['Tank 7','Tank 8','Tank 9','Tank 10','Tank 11','Tank 12','Tank 13'],
          },
          yaxis: [
            {
              axisTicks: {
                show: true,
              },
              axisBorder: {
                show: true,
                color: '#008FFB'
              },
              labels: {
                style: {
                  colors: '#008FFB',
                }
              },
              title: {
                text: "Max Fish Weight(g)",
                style: {
                  color: '#008FFB',
                }
              },
              tooltip: {
                enabled: true
              }
            },
            {
              seriesName: 'Income',
              opposite: true,
              axisTicks: {
                show: true,
              },
              axisBorder: {
                show: true,
                color: '#00E396'
              },
              labels: {
                style: {
                  colors: '#00E396',
                }
              },
              title: {
                text: "Max Fish Size (cm)",
                style: {
                  color: '#00E396',
                }
              },
            },
            {
              seriesName: 'Revenue',
              opposite: true,
              axisTicks: {
                show: true,
              },
              axisBorder: {
                show: true,
                color: '#FEB019'
              },
              labels: {
                style: {
                  colors: '#FEB019',
                },
              },
              title: {
                text: "Average Daily Feed (g)",
                style: {
                  color: '#FEB019',
                }
              }
            },
          ],
          tooltip: {
            fixed: {
              enabled: true,
              position: 'topLeft', // topRight, topLeft, bottomRight, bottomLeft
              offsetY: 30,
              offsetX: 60
            },
          },
          legend: {
            horizontalAlign: 'left',
            offsetX: 40
          }
        },
      
      
      };
    }
  
  
    render() {
      return (
  
        <Chart options={this.state.options} series={this.state.series} type="line" />
        
      );
    }
  }
  
  export default Fish;
  