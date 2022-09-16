import React, { Component } from "react";
import ReactEcharts from "echarts-for-react";
import { graphic } from 'echarts'


class PieChart extends Component{
    render() {
        return (
            <ReactEcharts 
            style={{height: '350px', width:'98%',marginLeft:'1%'}}
            
            option={{
                tooltip: {
                  trigger: 'item'
                },
                series: [
                  {
                    name: 'Access From',
                    type: 'pie',
                    radius: '90%',
                    data: [
                      { value: 1048, name: 'Paid Payments', itemStyle: { color: '#17171B' } },
                      { value: 735, name: 'Unpaid Payments', itemStyle: { color: '#D79D12' } },
                    ],
                    emphasis: {
                      itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                      }
                    }
                  }
                ]
              }}
          />
        )
    }
}

export default PieChart