import React, { Component } from "react";
import Chart from "react-apexcharts";
import ApexCharts from 'apexcharts'
import {URL} from '../../constants';
import  { useState, useEffect } from "react";

class TDSChart extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
        
          series: [{
              name: "TDS 1",
              data: []
            },
            {
              name: "TDS 2",
              data: []
            },
          ],
          options: {
            chart: {
              height: 200,
              type: 'line',
              zoom: {
                enabled: false
              },
            },
            dataLabels: {
              enabled: false
            },
            stroke: {
              width: [2, 2],
              curve: 'smooth',
              //dashArray: [0, 8, 5]
            },
            legend: {
              tooltipHoverFormatter: function(val, opts) {
                return val + ' - ' + opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] + ''
              }
            },
            markers: {
              size: 0,
              hover: {
                sizeOffset: 6
              }
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
            tooltip: {
              y: [
                {
                  title: {
                    formatter: function (val) {
                      return val 
                    }
                  }
                },
                {
                  title: {
                    formatter: function (val) {
                      return val
                    }
                  }
                },
              ]
            },
            grid: {
              borderColor: '#f1f1f1',
            }
          },
        
        
        };
    }
   componentDidMount() {

        this.updateTimer =  setInterval(async () =>   {

        let sn = this.props.sn
        const response = await fetch(URL+'Users/getTDS/'+sn,{
            headers : {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
            },
            method: 'GET',
        })
        const json = await response.json()
        const TDS1 = json.TDS1
        const TDS2 = json.TDS2
      
        let finalTDS1 = []
        let finalDS2 = []
      
        for (let row of TDS1) {
            const {x,y} = row
            finalTDS1.push([x,y])
        }
        for (let row of TDS2) {
            const {x,y} = row
            finalDS2.push([x,y])
        }
        //console.log(finalTDS1,finalDS2)

        this.setState({
            series: [{
                name: "TDS 1",
                data: finalTDS1
              },
              {
                name: "TDS 2",
                data: finalDS2
              },
            ],
        })
       }, 10000);
      
    }
    componentWillUnmount(){

        clearInterval(this.updateTimer);
    }

  render() {
        return (

        <Chart options={this.state.options} series={this.state.series} type="line" height={200} />
        );
    }
}
export default TDSChart;