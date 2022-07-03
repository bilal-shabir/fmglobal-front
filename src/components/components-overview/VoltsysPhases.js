import React, { Component } from "react";
import Chart from "react-apexcharts";
import ApexCharts from 'apexcharts'
import {URL} from '../../constants';
import  { useState, useEffect } from "react";

class VoltsysPhases extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
        
          series: [{
              name: "Phase 1",
              data: []
            },
            {
              name: "Phase 2",
              data: []
            },
            {
              name: 'Phase 2',
              data: []
            }
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
              width: [2, 2, 2],
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
                      return val + " (mins)"
                    }
                  }
                },
                {
                  title: {
                    formatter: function (val) {
                      return val + " per session"
                    }
                  }
                },
                {
                  title: {
                    formatter: function (val) {
                      return val;
                    }
                  }
                }
              ]
            },
            grid: {
              borderColor: '#f1f1f1',
            }
          },
        
        
        };
    }
    async componentDidMount() {

        //this.updateTimer =  setInterval(async () =>   {

        let sn = this.props.sn
        const response = await fetch(URL+'Users/get_phases/'+sn,{
            headers : {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
            },
            method: 'GET',
        })
        const json = await response.json()
        const Phase1 = json.Phase1
        const Phase2 = json.Phase2
        const Phase3 = json.Phase3

        let finalPhase1 = []
        let finalPhase2 = []
        let finalPhase3 = []
        for (let row of Phase1) {
            const {x,y} = row
            finalPhase1.push([x,y])
        }
        for (let row of Phase2) {
            const {x,y} = row
            finalPhase2.push([x,y])
        }
        for (let row of Phase3) {
            const {x,y} = row
            finalPhase3.push([x,y])
        }
        //console.log(finalPhase1,finalPhase2,finalPhase3)

        this.setState({
            series: [{
                name: "Phase 1",
                data: finalPhase1
              },
              {
                name: "Phase 2",
                data: finalPhase2
              },
              {
                name: 'Phase 2',
                data: finalPhase3
              }
            ],
        })
        //}, 10000);
      
    }
    // componentWillUnmount(){

    //     clearInterval(this.updateTimer);
    // }

  render() {
        return (

        <Chart options={this.state.options} series={this.state.series} type="line" height={200} />
        );
    }
}
export default VoltsysPhases;