import React, { Component } from "react";
import ReactEcharts from "echarts-for-react";

class Echart4 extends Component {


    constructor(props) {
    super(props);
    

    const userIs_logged=localStorage.getItem('is_logged');
    if(userIs_logged != 1){
    this.props.history.push("/login");
    }

    if(this.props.time.length == 0){
      const ranges = [];
      const date = new Date();
      const format = {
          hour: 'numeric',
          minute: 'numeric',
      };
  
      for (let minutes = 0; minutes < 24 * 60; minutes = minutes + 30) {
          date.setHours(0);
          date.setMinutes(minutes);
          ranges.push(date.toLocaleTimeString('ru', format));
      }
      //console.log(ranges)
      const d = new Date();
      let hour = d.getHours();
      const pt = ranges.slice(0,ranges.indexOf(this.addZero(hour)+":00")+1)
      this.state = {
        production_value_sma: [0,0,0,0,0,0,0],
        production_time: pt.reverse().splice(0,7).reverse(),
        isLoaded: true,
      }
    }
    else{
      this.state = {
        production_value_sma: this.props.value_sma.splice(0,7).reverse(),
        production_value_fronius: this.props.value_fronius.splice(0,7).reverse(),
        production_time: this.props.time.splice(0,7).reverse(),
    }
  }

    // alert(pid)
    
    


//
}
addZero(i) {
  if (i < 10) {i = "0" + i}
  return i;
}
    render() {
      return (
        <ReactEcharts 
       
       style={{height:'276px'}}
          option={{
            tooltip: {
              trigger: 'axis'
            },
           
            
            
            xAxis: {
              type: 'category',
              data: this.state.production_time,
              axisLine: {
                show: true,
                lineStyle: {
                    color: '#004769'
                },
              },
              splitLine: {
                lineStyle: {
                    color: '#004769'
                }
            }
            },
            yAxis: {
              type: 'value',
              axisLabel: {
                show: true,
                textStyle: {
                    color: '#004769'
                }
              },
            },
            series: [
              {
                color: '#BAAA37',
                data: this.state.production_value_sma,
                type: 'line',
                smooth: true,
                name: 'SMA',
                connectNulls: true
              },
              {
                color: '#BAAA37',
                data: this.state.production_value_fronius,
                type: 'line',
                smooth: true,
                name:'Fronius',
                connectNulls: true,
              }
            ]
          }}
        />
        
      );
    }
  }
  export default Echart4;
