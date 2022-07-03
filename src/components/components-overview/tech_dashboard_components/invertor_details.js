import React, { Component } from "react";
import ReactEcharts from "echarts-for-react";
import { graphic } from 'echarts';
import '../../../assets/style.css'
import { Card,
    CardHeader,
    CardBody,
    Container, Row, Col
  } from "shards-react";
  const colors = ['#5470C6', '#91CC75', '#EE6666'];
class InvertorChart extends Component {

    constructor(props) {
        super(props);
        this.onChartClick = this.onChartClick.bind(this);
        var data = this.props.data
        var yaxis =[]
        var series = []
        var offsetright =0
        var offsetleft =0
        var time=[]
        // console.log("invertortype",this.props.type)
        for (let index = 0; index < this.props.time.length; index++) {
          time[index] = this.abc(this.props.time[index])
          
        }
        var tooltip
        var legend
        if(data.length>18 && this.props.type=="SMA" && this.props.top){
          var tooltip = {
            trigger: 'axis',
            className: 'invertorDetailChartToolTipExtra',
            axisPointer: {
              type: 'cross'
            }
          }
        }
        else if(data.length>18 && this.props.type=="SMA"){
          var tooltip = {
            trigger: 'axis',
            className: 'invertorDetailChartToolTipExtraBelow',
            axisPointer: {
              type: 'cross'
            }
          }
        }
        else if(this.props.top && data.length>9){
          var tooltip = {
            trigger: 'axis',
            className: 'invertorDetailChartToolTip',
            axisPointer: {
              type: 'cross'
            }
          }
        }
        else{
          var tooltip = {
            trigger: 'axis',
            axisPointer: {
              type: 'cross'
            }
          }
        }
        
        if(this.props.height < 400){
          // tooltip = {
          //   position: [-20, 0],
          //   trigger: 'axis',
          //   axisPointer: {
          //     type: 'cross'
          //   }
          // }
          legend = false
          var grid = {}
          // if(data.length > 5){
          //   grid = { 
          //     left : '28%',
          //     right: '27%',
          //     // top: '40%'
          //   }
          // }
          // else if(data.length > 4){
          //   grid = { 
          //     left : '23%',
          //     right: '20%',
          //     // top: '35%'
          //   }
          // }
           if(data.length > 3){
            grid = { 
              left : '18%',
              right: '18%',
              // top: '35%'
            }
          }
          else if(data.length > 2){
            grid = { 
              left : '18%',
              // top: '35%'
              
            }
          }
          for (let index = 0; index < data.length; index++) {
            if(index % 2 == 0){
              yaxis[index] = {
                type: 'value',
                name: data[index].name,
                position: 'left',
                alignTicks: true,
                offset: offsetleft,
                axisLine: {
                  show: true,
                  // lineStyle: {
                  //   color: '#004769'
                  // }
                },
                axisLabel: {
                  formatter: `{value} ${data[index].unit}`
                } 
               }
      
               series[index] = {
                name: data[index].name,
                type: 'line',
                yAxisIndex: index,
                showSymbol: false,
                data: data[index].data,
                itemStyle: {
                  color: data[index].color
                }
               }
               offsetleft = offsetleft + 100
            }
            else{
              yaxis[index] = {
                type: 'value',
                name: data[index].name,
                position: 'right',
                alignTicks: true,
                offset: offsetright,
                axisLine: {
                  show: true,
                  // lineStyle: {
                  //   color: '#004769'
                  // }
                },
                axisLabel: {
                  formatter: `{value} ${data[index].unit}`
                } 
               }
      
               series[index] = {
                name: data[index].name,
                type: 'line',
                yAxisIndex: index,
                showSymbol: false,
                data: data[index].data,
                itemStyle: {
                  color: data[index].color
                }
               }
               offsetright = offsetright + 100
            }
          }
        }
        else{
          // tooltip={
          //   trigger: 'axis',
          //   axisPointer: {
          //     type: 'cross'
          //   }
          // }
          legend = true
          var grid = {}
          if(data.length > 18){
            grid = { 
              left : '23%',
              right: '22%',
              top: '29%'
            }
          }
          else if(data.length > 5){
            grid = { 
              left : '23%',
              right: '22%',
              top: '20%'
            }
          }
          else if(data.length > 4){
            grid = { 
              left : '23%',
              right: '20%',
              top: '20%'
            }
          }
          else if(data.length > 3){
            grid = { 
              left : '20%',
              right: '20%',
              top: '20%'
            }
          }
          else if(data.length > 2){
            grid = { 
              left : '20%',
              top: '20%'
              
            }
          }
          for (let index = 0; index < data.length; index++) {
            if(index % 2 == 0){
              yaxis[index] = {
                type: 'value',
                name: data[index].name,
                position: 'left',
                alignTicks: true,
                offset: offsetleft,
                axisLine: {
                  show: true,
                  // lineStyle: {
                  //   color: '#004769'
                  // }
                },
                axisLabel: {
                  formatter: `{value} ${data[index].unit}`
                } 
               }
      
               series[index] = {
                name: data[index].name,
                type: 'line',
                yAxisIndex: index,
                showSymbol: false,
                data: data[index].data,
                itemStyle: {
                  color: data[index].color
                }
               }
               offsetleft = offsetleft + 100
            }
            else{
              yaxis[index] = {
                type: 'value',
                name: data[index].name,
                position: 'right',
                alignTicks: true,
                offset: offsetright,
                axisLine: {
                  show: true,
                  // lineStyle: {
                  //   color: '#004769'
                  // }
                },
                axisLabel: {
                  formatter: `{value} ${data[index].unit}`
                } 
               }
      
               series[index] = {
                name: data[index].name,
                type: 'line',
                yAxisIndex: index,
                showSymbol: false,
                data: data[index].data,
                itemStyle: {
                  color: data[index].color
                }
               }
               offsetright = offsetright + 100
            }
          }
        }
        // console.log("time", time)
        

        // console.log("yaxis", yaxis)
        // console.log("series", series)
        
        this.state={
            grid: grid,
            yaxis : yaxis,
            series : series,
            height: this.props.height,
            time: time,
            legend : legend,
            tooltip: tooltip
            
        }
    }
    onChartClick = (params) => {
        this.props.barclick(params.name); 
        // console.log(params.name);
    };
    onEvents = {
        click: this.onChartClick
    }
    abc (date)
{
  var time = Date.parse(date);
  var date1 = new Date(time);

  
 let h =this.addZero(date1.getHours())
 let m =this.addZero(date1.getMinutes())
  
  let time1 = h + ":" + m
  return time1

}
addZero(i) {
  if (i < 10) {i = "0" + i}
  return i;
}
    render(){
        return(
            
            <ReactEcharts 
            onEvents={this.onEvents}
       
                style={{height:this.state.height}} //276
                    option={{
                        color: colors,
                        tooltip: this.state.tooltip,
                        grid: this.state.grid,
                        // toolbox: {
                        //   feature: {
                        //     dataView: { show: true, readOnly: false },
                        //     restore: { show: true },
                        //     saveAsImage: { show: true }
                        //   }
                        // },
                        legend: {
                          
                          show: this.state.legend
                        },
                        xAxis: [
                          {
                            type: 'category',
                            axisTick: {
                              alignWithLabel: true
                            },
                            // prettier-ignore
                            data: this.state.time
                          }
                        ],
                        yAxis: this.state.yaxis,
                        series:this.state.series
                      }}
            />
        )
    }
}
export default InvertorChart