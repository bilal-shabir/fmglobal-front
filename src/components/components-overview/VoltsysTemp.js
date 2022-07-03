import React, { Component } from "react";
import Chart from "react-apexcharts";
import ApexCharts from 'apexcharts'
import {URL} from '../../constants';
import  { useState, useEffect } from "react";

class VoltsysTemp extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
        
            series: [
                {
                name: 'Voltage',
                type: 'line',
                data: []
                },

            ],
            options: {
                chart: {
                    height: 350,
                    type: 'area'
                },
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    curve: 'smooth',
                    colors: ['#e8aa1a']
                },
                fill: {
                    colors: ['#e8aa1a']
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
                        color: '#FEB019'
                      },
                      labels: {
                        style: {
                          colors: '#FEB019',
                        }
                      },
                      title: {
                        text: "PCB Temperature",
                        style: {
                          color: '#FEB019',
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
        const response = await fetch(URL+'Users/get_PCB_TEMP/'+sn,{
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

export default VoltsysTemp;
