import React, { Component } from "react";
import Chart from "react-apexcharts";
import icon from '../../images/battery.png';

class CurrentBattery extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    
      series: [],
      options: {
        chart: {
          height: 200,
          type: 'radialBar',
        },
        plotOptions: {
          radialBar: {
            hollow: {
              margin: '15px',
              size: '50%',
              image: icon,
              imageWidth: 50,
              imageHeight: 50,
              imageClipped: false,
            },
            dataLabels: {
              name: {
                show: false,
                color: '#fff'
              },
              value: {
                show: true,
                color: '#5a6169',
                offsetY: 150,
                fontSize: '16px',
                fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"',
                fontWeight: 'bolder',
                margin: '0px,0px,28px',
                formatter: function (val) {
                  val = 50
                  return val + ' %'
                }
              }
            }
          }
        },
        fill: {
          type: 'gradient',
          gradient: {
            type: 'diagonal2',
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.9,
            inverseColors: true,
            colorStops: [
              {
                offset: 0,
                color: "#FF0000",
                opacity: 0.5
              },
              {
                offset: 15,
                color: "#FFF200",
                opacity: 0.5
              },
              {
                offset: 30,
                color: "#FFF200",
                opacity: 0.5
              },
              {
                offset: 40,
                color: "#1E9600",
                opacity: 0.5
              },
              {
                offset: 70,
                color: "#1E9600",
                opacity: 0.5
              },
              {
                offset: 100,
                color: "#1E9600",
                opacity: 0.5
              },
             
            ]

          }
        },
        // stroke: {
        //   lineCap: 'round'
        // },
      },
    
    
    };
    
    
    
  }
  componentDidMount(){
      let data = this.props.data;
      this.setState({
        series: [50],
    })
  }


  render() {
    return (

      <Chart options={this.state.options} series={this.state.series} type="radialBar" height={320} />
    );
  }
}

export default CurrentBattery;
