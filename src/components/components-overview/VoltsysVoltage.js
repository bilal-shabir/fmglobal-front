import React, { Component } from "react";
import Chart from "react-apexcharts";
import ApexCharts from 'apexcharts'
import {URL} from '../../constants';
import  { useState, useEffect } from "react";

class VoltsysVoltage extends React.Component {

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
          id: 'area-datetime',
          type: 'line',
          height: 350,
          stacked: false
        },
        zoom: {
          type: 'x',
          enabled: true,
          autoScaleYaxis: true
        },
        toolbar: {
          autoSelected:'zoom',
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          width: [3, 3  ],
          curve: 'smooth'
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
              color: '#008FFB'
            },
            labels: {
              style: {
                colors: '#008FFB',
              }
            },
            title: {
              text: "Voltage",
              style: {
                color: '#008FFB',
              }
            },
            tooltip: {
              enabled: true
            }
          },
        ],
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
          show: true,
       
      },


          
        },
        legend: {
          horizontalAlign: 'left',
          offsetX: 40
        },
        animations: {
          enabled: true,
          easing: 'linear',
          dynamicAnimation: {
            speed: 1000
          }
        }
      },
    
    };
    
  }


  

   componentDidMount() {
    
 
    this.updateTimer =  setInterval(async () =>   {

    let sn = this.props.sn
    const response = await fetch(URL+'Users/get_data_Voltage/'+sn,{
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
        name: 'Voltage',
        data: finalVoltage
        },
 
    ],
    })}, 10000);
      
}
componentWillUnmount(){
  clearInterval(this.updateTimer);
}

  render() {
    return (

      <Chart options={this.state.options} series={this.state.series} type="line" />
    );
  }
}

export default VoltsysVoltage;
