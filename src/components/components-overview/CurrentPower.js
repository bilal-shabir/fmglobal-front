import React, { Component } from "react";
import Chart from "react-apexcharts";
import icon from '../../images/power.png';

class CurrentPower extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    
      series: [],
      options: {
        chart: {
            height: 350,
            type: 'radialBar',
        },
        plotOptions: {
          radialBar: {
            hollow: {
              margin: 15,
              size: '70%',
              image: icon,
              imageWidth: 64,
              imageHeight: 64,
              imageClipped: false
            },
            dataLabels: {
              name: {
                show: false,
                color: '#fff'
              },
              value: {
                show: true,
                color: '#333',
                offsetY: 70,
                fontSize: '22px'
              }
            }
          }
        },
        fill: {
          type: 'gradient',
          gradient: {
            shade: 'dark',
            type: 'horizontal',
            shadeIntensity: 0.5,
            gradientToColors: ['#ABE5A1'],
            inverseColors: true,
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 100]
          }
        },
        stroke: {
          lineCap: 'round'
        },
        labels: ['Volatility'],
      },
    
    
    };
    
    
    
  }
  componentDidMount(){
      let data = this.props.data;
      this.setState({
        series: [data],
    })
  }


  render() {
    return (

      <Chart options={this.state.options} series={this.state.series} type="radialBar" height={350}/>
    );
  }
}

export default CurrentPower;
