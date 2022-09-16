import React, { Component } from "react";
import ReactEcharts from "echarts-for-react";
import { graphic } from 'echarts'


class MonthlyChart extends Component{
    render() {
        return (
            <ReactEcharts 
         
            style={{height: '350px', width:'98%',marginLeft:'1%'}}
            option={{
              tooltip: {
                trigger: 'axis',
                axisPointer: {
                  type: 'shadow'
                }
              },
              title: {
                text: "Monthly Payments",
                left: "start",
                textStyle: {
                  fontSize: 14,
                  fontWeight: 'normal',
                  color: '#D79D12'
                }
              },
              grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
              },
              xAxis: [
                {
                  type: 'category',
                  data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun','Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                  axisTick: {
                    alignWithLabel: true
                  },
                  axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#D79D12'
                    },
                  },
                  
                }
              ],
              yAxis: [
                {
                  type: 'value',
                  axisLabel: {
                    show: true,
                    textStyle: {
                        color: '#D79D12'
                    }
                  },
                  splitLine: {
                    lineStyle: {
                        color: '#30302f'
                    }
                }
                }
              ],
              series: [
                {
                  name: 'Sales',
                  type: 'bar',
                  barWidth: '60%',
                  barRadius: '10px',
                  data: [120, 200, 150, 80, 70, 110, 130,120, 200, 150, 80, 70, 110, 130],
                  itemStyle: {
                    color: new graphic.LinearGradient(1, 0, 0, 0, [
    
                      {
                        offset: 0,
                        color: 'rgba(215,157,18,1)'
                      },
                      {
                        offset: 1,
                        color: 'rgba(208,147,0,1)'
                      }])
                  }
                },
                
              ]
            }}
          />
        )
    }
}

export default MonthlyChart