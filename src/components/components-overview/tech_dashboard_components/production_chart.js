import React, { Component } from "react";
import ReactEcharts from "echarts-for-react";
import { Card,
    CardHeader,
    CardBody,
    Container, Row, Col
  } from "shards-react";


class ProductionChart extends Component {
  constructor(props) {
    super(props);

    const time = this.props.time
    const production = this.props.production
    // console.log("chart",time)
    // console.log("chart",production)
    
    

    this.state={
      time: time,
      production : production,
      consumption: this.props.consumption,
      height: this.props.height
    }
  }

    render(){
        return(
            
                <ReactEcharts 
       
       style={{height:this.state.height}} //276
          option={{
            tooltip: {
                        trigger: 'axis'
                      },
            xAxis: {
              type: 'category',
              data: this.state.time
            },
            yAxis: {
              type: 'value',
              
            },
            legend: {},
            dataZoom: [
              {
                type: 'inside',
                start: 0,
                end: 20
              },
              {
                start: 0,
                end: 20
              }
            ],
            series: [
              
              {
                name: 'Production',
                type: 'bar',
                smooth: false,
                symbol: 'none',
                areaStyle: {},
                color:'#BDAC37',
                data: this.state.production
              },
              {
                name: 'Consumption',
                data: this.state.consumption,
                type: 'line',
                smooth: false,
                color:'black'
              }
            ]
          }}
        />
          
        )
    }
}
export default ProductionChart