import React, { Component } from "react";
import ReactEcharts from "echarts-for-react";

class CurrentPower extends Component {
  render() {
    return (
      <ReactEcharts 
      theme=''
      style=
   {
     {
       width:'100%',
       height:'320px',
       maxHeight:'100%',
     }
   }
        option={{
          
          series: [
            {
              type: 'gauge',
              startAngle: 180,
              endAngle: 0,
              min: 0,
              max: 1,
              splitNumber: 8,
              axisLine: {
                lineStyle: {
                  width: 6,
                    color: [
                    [0.25, '#FF6E76'],
                    [0.5, '#FDDD60'],
                    [0.75, '#58D9F9'],
                    [1, '#7CFFB2']
                  ]
                }
              },
              pointer: {
                icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
                length: '8%',
                width: 20,
                offsetCenter: [0, '-60%'],
                itemStyle: {
                  color: 'auto'
                }
              },
              axisTick: {
                length: 4,
                lineStyle: {
                  color: 'auto',
                  width: 2
                }
              },
              splitLine: {
                length: 20,
                lineStyle: {
                  color: 'auto',
                  width: 5
                }
              },
              axisLabel: {
                color: '#464646',
                fontSize: 12,
                distance: -77,
                formatter: function (value) {
                  if (value === 0.875) {
                    return 'Excellent';
                  } else if (value === 0.625) {
                    return 'Good';
                  } else if (value === 0.375) {
                    return 'Normal';
                  } else if (value === 0.125) {
                    return 'Poor';
                  }
                  return '';
                }
              },
              title: {
                offsetCenter: [0, '-25%'],
                fontSize: 15
              },
              detail: {
                fontSize: 15,
                offsetCenter: [0, '2%'],
                valueAnimation: true,
                formatter: function (value) {
                  return Math.round(value * 100) + ' KWH';
                },
                color: 'auto'
              },
              data: [
                {
                  value: 0.4,
                  name: 'System Production'
                }
              ]
            }
          ]
        }}
      />
    );
  }
}export default CurrentPower;