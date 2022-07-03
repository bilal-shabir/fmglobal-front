import React, { Component } from "react";
import ReactEcharts from "echarts-for-react";
import { graphic } from 'echarts'

class Echart6 extends Component{
    constructor(props) {
        super(props);
      
        const userIs_logged=localStorage.getItem('is_logged');
        if(userIs_logged != 1){
          this.props.history.push("/login");
        }
        var days = []
        for (let index = 0; index < this.props.data.days.length; index++) {
          var time = Date.parse(this.props.data.days[index]);
          var date1 = new Date(time);
         days[index] = this.addZero(date1.getDate())
        }

        this.state ={
          values : this.props.data.productionPerMonth,
          days: days
        }
        //console.log('chart data:')
        //console.log(this.state.days)
        //console.log(this.state.values)
      }
      addZero(i) {
        if (i < 10) {i = "0" + i}
        return i;
      }
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
              legend: {},
              grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
              },
              xAxis: [
                {
                  type: 'category',
                  data: this.state.days,
                  axisTick: {
                    alignWithLabel: true
                  }
                }
              ],
              yAxis: [
                {
                  type: 'value'
                }
              ],
              series: [
                {
                  name: 'Power Generated',
                  type: 'bar',
                  barWidth: '60%',
                  data: this.state.values,
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
                
              ]
            }}
          />
          
        );
      }
}

export default Echart6;