import React, { Component } from "react";
import Chart from "react-apexcharts";
import icon from '../../images/power.png';

class CurrentLastMonth extends React.Component {
constructor(props) {
    super(props);

    this.state = {
    
      series: [{
        data: []
      }],
      options: {
        chart: {
          type: 'bar',
          height: 350
        },
        plotOptions: {
          bar: {
            borderRadius: 4,
            horizontal: true,
          }
        },
        dataLabels: {
          enabled: false
        },
        xaxis: {
          type:'date',
          datetimeFormatter: {
           
            month: 'MMM \'yy',
           
          }
        },
        // tooltip: {
        //     x: {
        //       format: 'MMMM'
        //     }
        // },
      },
    };
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
            <div id="chart">
            <Chart options={this.state.options} series={this.state.series} type="bar" height={350} />
            </div>
        )
    }
};
export default CurrentLastMonth;