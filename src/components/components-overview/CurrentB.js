import React, { Component } from "react";
import ReactApexChart from "react-apexcharts";
import icon from '../../images/battery.png';
import filler3 from '../../images/filler3.jpeg'
import b1 from '../../images/full.png';
import b2 from '../../images/seventy.png';
import b3 from '../../images/half.png';
import b4 from '../../images/quater.png';
import b5 from '../../images/zero.png';

class CurrentB extends React.Component {
    constructor(props) {
      super(props);
      var battery = Math.round(this.props.value)
      if (battery == 0) {
        
          var src = b5
        
      }
      else if (battery > 0 && battery <40 ) {
        
          var src = b4
        
      }
      else if (battery > 40 && battery <65 ) {
        
          var src = b3
        
      }
      else if (battery > 65 && battery <85 ) {
        
          var src = b2
        
      }
      else{
        
          var src = b1
        
      }
      
      this.state = {
        series: [Math.round(this.props.value)],
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
                image: src,
                imageWidth: 90,
                imageHeight: 90, 
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
                  fontSize: '16px'
                }
              }
            }
          },
          fill: {
            colors: ['#BDAC37']
            
          },
          stroke: {
            curve: 'smooth',
            lineCap: 'square'
          },
          labels: ['Battery'],
        },
      
      
      };
      
    }

  

    render() {
      return (
        <div id="chart">
            <ReactApexChart options={this.state.options} series={this.state.series} type="radialBar" height={300} style={{paddingBottom: '30px', marginTop:'10px'}} />
        </div>
        );
    }
}

export default CurrentB;