import React from "react";
import Chart from "react-apexcharts";
import {URL} from '../../constants';

class WindSpeed extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    
      series: [
        {
        name: 'Wind Speed',
        type: 'line',
        data: []
        },
        {
          name: 'Current Power',
          type: 'line',
          data: []
        }
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
          width: [2, 2, 4],
          curve: 'smooth'
        },
        xaxis: {
          type: 'datetime',
          labels:{
            datetimeUTC: false,
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
              text: "Wind Speed",
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
            title: {
              text: "Current Power",
              style: {
                color: '#FEB019',
              }
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
        },
        legend: {
          horizontalAlign: 'left',
          offsetX: 40
        }
      },
    
    };
  }
 
  async componentDidMount() {
    let sn = this.props.sn
    const response = await fetch(URL+'Users/get_power_and_wind_speed/'+sn,{
        headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
        },
        method: 'GET',
    })
    const json = await response.json()
    const speed = json.speed
    const power = json.power

    let finalspeed = []
    for (let row of speed) {
      const {x,y} = row
      const dt = x.split(/\-|\s/);
      //var newDate = date1[1] + '/' +date1[0] +'/' +date1[2];
      finalspeed.push([dt.slice(0,3).reverse().join('/')+' '+dt[3],y])
    }

    let finalpower = []
    for (let row of power) {
      const {x,y} = row
      finalpower.push([x,y])
    }

    //console.log(finalspeed)
    //console.log(finalpower)
    this.setState({
      series: [
        {
        name: 'Wind Speed',
        data: finalspeed
        },
        {
          name: 'Current Power',
          data: finalpower
        }
    ],
    })

      
}


  render() {
    return (

      <Chart options={this.state.options} series={this.state.series} type="line" />
    );
  }
}

export default WindSpeed;
