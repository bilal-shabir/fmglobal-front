import React, { Component } from "react";
import ReactEcharts from "echarts-for-react";
import { graphic } from 'echarts';

import { Card,
    CardHeader,
    CardBody,
    Container, Row, Col
  } from "shards-react";

class DailyChart extends Component {


    constructor(props) {
        super(props);
        this.onChartClick = this.onChartClick.bind(this);

        var days = []
        for (let index = 0; index < this.props.data.days.length; index++) {
          var time = Date.parse(this.props.data.days[index]);
          var date1 = new Date(time);
          days[index] = this.addZero(date1.getDate())
        }
        // console.log('dailychart', this.props.data)
        this.state ={
          production : this.props.data.productionPerMonth,
          consumption: this.props.data.consumptionPerMonth,
          days: days
        }
    }
    onChartClick = (params) => {
        this.props.barclick(params.name); 
        // console.log(params.name);
    };
    onEvents = {
        click: this.onChartClick
    }
    addZero(i) {
      if (i < 10) {i = "0" + i}
      return i;
    }
    render(){
        return(
            
            <ReactEcharts 
            onEvents={this.onEvents}
       
                style={{height:'330px'}} //276
                    option={{
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {
                              type: 'shadow'
                            }
                          },
                    legend:{},
                    xAxis: {
                        type: 'category',
                        data: this.state.days
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [
                        {
                            name: 'Production',
                            data: this.state.production,
                            type: 'bar',
                            itemStyle: {
                                color: new graphic.LinearGradient(1, 0, 0, 0, [
                
                                  {
                                    offset: 0,
                                    color: 'rgba(222,206,99,1)'
                                  },
                                  {
                                    offset: 1,
                                    color: 'rgba(198,183,84,1)'
                                  }])
                              }
                        },
                        {
                            name: 'Consumption',
                            data: this.state.consumption,
                            type: 'bar',
                            itemStyle: {
                                color: new graphic.LinearGradient(1, 0, 0, 0, [
                
                                  {
                                    offset: 0,
                                    color: '#004769'
                                  },
                                  {
                                    offset: 1,
                                    color: '#004769'
                                  }])
                              }
                            
                        }
                    ]
                    }}
            />
        )
    }
}
export default DailyChart