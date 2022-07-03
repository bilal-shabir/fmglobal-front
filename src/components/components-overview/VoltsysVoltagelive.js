import React, { Component } from "react";
import Chart from "react-apexcharts";
import ApexCharts from 'apexcharts'
import {URL} from '../../constants';

class VoltsysVoltage extends React.Component {

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
          autoSelected: 'zoom'
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          width: [2, 2 ,2 ],
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
          // {
          //   seriesName: 'Wind Speed',
          //   opposite: true,
          //   axisTicks: {
          //     show: true,
          //   },
          //   axisBorder: {
          //     show: true,
          //     color: '#00E396'
          //   },
          //   labels: {
          //     style: {
          //       colors: '#00E396',
          //     }
          //   },
          //   title: {
          //     text: "Wind Speed",
          //     style: {
          //       color: '#00E396',
          //     }
          //   },
          // },
          {
            seriesName: 'Current Power',
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

  
  
  async componentDidMount() {

    // var lastDate = 0;
    // var data = []
    // var TICKINTERVAL = 86400000
    // let XAXISRANGE = 777600000
    // function getDayWiseTimeSeries(baseval, count, yrange) {
    //   var i = 0;
    //   while (i < count) {
    //     var x = baseval;
    //     var y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;
    
    //     data.push({
    //       x, y
    //     });
    //     lastDate = baseval
    //     baseval += TICKINTERVAL;
    //     i++;
    //   }
    // }
    
    // getDayWiseTimeSeries(new Date('31 May 2021 GMT').getTime(), 50, {
    //   min: 0,
    //   max: 500
    // })
    
    // function getNewSeries(baseval, yrange) {
    //   var newDate = baseval + TICKINTERVAL;
    //   lastDate = newDate
    
    //   for(var i = 0; i< data.length - 50; i++) {
    //     // IMPORTANT
    //     // we reset the x and y of the data which is out of drawing area
    //     // to prevent memory leaks
    //     data[i].x = newDate - XAXISRANGE - TICKINTERVAL
    //     data[i].y = 0
    //   }
    
    //   data.push({
    //     x: newDate,
    //     y: Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min
    //   })
    // }
    
    // function resetData(){
    //   // Alternatively, you can also reset the data at certain intervals to prevent creating a huge series 
    //   data = data.slice(data.length - 50, data.length);
    // }

    let sn = this.props.sn
    const response = await fetch(URL+'Users/get_Voltage/'+sn,{
        headers : {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
        },
        method: 'GET',
    })
    const json = await response.json()
    const Voltage = json.Voltage
    // const power = json.power

    // let finalspeed = []
    // for (let row of speed) {
    //   const {x,y} = row
    //   const dt = x.split(/\-|\s/);
    //   //var newDate = date1[1] + '/' +date1[0] +'/' +date1[2];
    //   finalspeed.push([dt.slice(0,3).reverse().join('/')+' '+dt[3],y])
    // }

    let finalVoltage = []
    for (let row of Voltage) {
      const {x,y} = row
      finalVoltage.push([x,y])
    }

    //console.log(finalspeed)
    //console.log(finalpower)
    this.setState({
      series: [
        {
        name: 'Voltage',
        data: finalVoltage
        },
        // {
        //   name: 'Current Power',
        //   data: finalpower
        // }
    ],
    })


    // window.setInterval(() => {
    //   getNewSeries(lastDate, {
    //     min: 0,
    //     max: 500
    //   })
      
    //   ApexCharts.exec('area-datetime', 'updateSeries', [{
    //     data: data
    //   }])
    // }, 1000)

      
}


  render() {
    return (

      <Chart options={this.state.options} series={this.state.series} type="line" />
    );
  }
}

export default VoltsysVoltage;
