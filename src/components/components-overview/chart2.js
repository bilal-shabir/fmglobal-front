import React, { Component } from "react";
import ReactEcharts from "echarts-for-react";

class Echart2 extends Component {
    render() {
      return (
          
        <ReactEcharts 
       
       style={{height:'318px'}}
          option={{
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                // Use axis to trigger tooltip
                type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
              }
            },
            legend: {},
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: {
              type: 'value',
              name: 'kWh',
              nameLocation: 'middle',
              nameGap: 30,
              nameTextStyle: {
                fontWeight: 'bold'
              }
            },
            yAxis: {
              type: 'category',
              data: ['Dec 2021', 'Jan 2022' ]
            },
            series: [
              {
                name: 'Power Generated',
                type: 'bar',
                stack: 'total',
                barWidth: '60%',
                color: '#ffc900',
                label: {
                  show: true
                },
                emphasis: {
                  focus: 'series'
                },
                data: [32, 30, 30, 33, 30, 30, 32]
              },
            ]
          }}
        />
        
      );
    }
  }export default Echart2;
  
  