import React, { Component } from "react";
import Chart from "react-apexcharts";
import ApexCharts from 'apexcharts'
import {URL} from '../../constants';
import  { useState, useEffect } from "react";

class VoltsysDump extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
        
            series: [
                {
                name: 'Voltage',
                data: []
                },

            ],
            options: {
                chart: {
                    height: 350,
                    type: 'area'
                },
                // plotOptions: {
                //     bar: {
                //       horizontal: false,
                //       columnWidth: '55%',
                //       endingShape: 'rounded'
                //     }
                // },
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    width: [0.5],
                    curve: 'smooth',
                    colors: ['#1ae8b1']
                },
                fill: {
                    colors: ['#1ae8b1']
                },
                xaxis: {
                    type: 'datetime',
                    labels:{
                      datetimeUTC: true,
                      datetimeFormatter: {
                        year: 'yyyy',
                        month: 'MMM \'yy',
                        day: 'dd MMM',
                        hour: 'hh:mm'
                      },
                      format: 'yyyy/dd/MM hh:mm:ss ',
                       
                    },
                    tooltip: {
                      
                        format: 'dd MMM yyyy'
                      
                    },
                },
                yaxis: [
                    {
                      axisTicks: {
                        show: true,
                      },
                      axisBorder: {
                        show: true,
                        color: '#1ae8b1'
                      },
                      labels: {
                        style: {
                          colors: '#1ae8b1',
                        }
                      },
                      title: {
                        text: "Dumpload Voltage",
                        style: {
                          color: '#1ae8b1',
                        }
                      },
                      tooltip: {
                        enabled: true
                      }
                    },
                  ],
                legend: {
                    horizontalAlign: 'left',
                    offsetX: 40
                },
                tooltip: {
                    format: 'dd MMM yyyy',
                    fixed: {
                      enabled: true,
                      position: 'topLeft', // topRight, topLeft, bottomRight, bottomLeft
                      offsetY: 30,
                      offsetX: 60
                    },
          
                    x: {
                      show: true,
                      format: 'yyyy/dd/MM hh:mm:ss',
                   
                    },
                    y: {
                        show: true
                    }
                }
                // animations: {
                //     enabled: true,
                //     easing: 'linear',
                //     dynamicAnimation: {
                //         speed: 1000
                //     }
                // }
            },
        
        };
    }


  

    async componentDidMount() {

        //this.updateTimer =  setInterval(async () =>   {

        let sn = this.props.sn
        const response = await fetch(URL+'Users/get_Dumpload/'+sn,{
            headers : {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
            },
            method: 'GET',
        })
        const json = await response.json()
        const Voltage = json.Voltage

        let finalVoltage = []
        for (let row of Voltage) {
        const {x,y} = row
        finalVoltage.push([x,y])
        }


        this.setState({
        series: [
            {
            name: 'PCB Temp',
            data: finalVoltage
            },
    
        ],
        })
        //}, 10000);
      
    }
    componentWillUnmount(){

        clearInterval(this.updateTimer);
    }

  render() {
    return (

      <Chart options={this.state.options} series={this.state.series} type="area" />
    );
  }
}

export default VoltsysDump;
