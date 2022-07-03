import React, { Component } from "react";
import Chart from "react-apexcharts";

class MonthlyPower extends Component {
  constructor(props) {
    super(props);
    this.state = {

      series: [{
        name: 'Power(KWH)',
        data: [],
      }],
      options: {
        chart: {
          height: 350,
          type: 'bar',
        },
        plotOptions: {
          bar: {
            borderRadius: 20,
            dataLabels: {
              position: 'top', // top, center, bottom
            },
          }
        },
        dataLabels: {
          enabled: true,
          formatter: function (val) {
            return val + " KWH";
          },
          offsetY: -20,
          style: {
            fontSize: '12px',
            colors: ["#304758"]
          }
        },
        
        xaxis: {
          type:'category',
          position: 'bottom',
          axisBorder: {
            show: false
          },
          axisTicks: {
            show: false
          },
          labels: {
            show: true,
            style: {
              colors: [],
              fontSize: '24px',
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontWeight: 400,
              cssClass: 'apexcharts-xaxis-label',
          },
          },
          crosshairs: {
            fill: {
              type: 'gradient',
              gradient: {
                colorFrom: '#D8E3F0',
                colorTo: '#BED1E6',
                stops: [0, 100],
                opacityFrom: 0.4,
                opacityTo: 0.5,
              }
            }
          },
          tooltip: {
            enabled: true,
          }
        },
        yaxis: {
          axisBorder: {
            show: false
          },
          axisTicks: {
            show: false,
          },
          labels: {
            show: false,
            formatter: function (val) {
              return val + " KWH";
            }
          }
        
        },
      
      },
    }
  }

  componentDidMount(){
    let res = this.props.data;
    this.setState({
        series: [{
            data: res,
          }]
    })
  }
  render() {
    return (

      <Chart options={this.state.options} series={this.state.series} type="bar" />
    );
  }
}

export default MonthlyPower;
