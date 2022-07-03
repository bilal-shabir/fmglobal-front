import React, { Component } from "react";
import ReactEcharts from "echarts-for-react";
import { graphic } from 'echarts'
import L from "./loader";
import {URL2} from '../../constants';
let controller


class Echart3 extends Component {
  constructor(props) {
    super(props);
  
    const userIs_logged=localStorage.getItem('is_logged');
    if(userIs_logged != 1){
      this.props.history.push("/login");
    }
    this.state = {
      customer: false,
      value: null,
      data: null,
      isloaded: false ,
      pid: this.props.id
    }
  
  }
  componentDidMount(){
    controller = new AbortController();
    const signal = controller.signal;
    //console.log('here')
    //console.log(this.state.pid)
   
    const type = localStorage.getItem('Type'); 
    if(type == 'employee'){
      fetch(URL2+'project/getMonthlyDataForEmployee',{
        headers : { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',

         },
         credentials: 'include',
         method: 'PATCH',
         mode: 'cors',
         signal,
         body: JSON.stringify({project_id: this.state.pid})
      })
      .then(response => response.json())
      .then((json)=>{
        // console.log(json)
        var value = []
        for (let index = 0; index < json.productionPerMonth.length; index++) {
          if(json.productionPerMonth[index] != 0){
          value[index] =  json.productionPerMonth[index].toFixed(3);
          }
          else{
            value[index] =  json.productionPerMonth[index]
          }
        }
          this.setState({
              value: value.reverse(),
              data: json.months.reverse(),
              isloaded:true
          })
          //console.log('here2')
          //console.log(this.state.data)   
      })
        
    }
    else{
      fetch(URL2+'project/getMonthlyDataForCustomer/'+this.state.pid,{
        headers : { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',

         },
         credentials: 'include',
         signal
      })
      .then(response => response.json())
      .then((json)=>{
        // console.log(json)
        var value = []
        for (let index = 0; index < json.productionPerMonth.length; index++) {
          if(json.productionPerMonth[index] != 0){
          value[index] =  json.productionPerMonth[index].toFixed(3)
          }
          else{
            value[index] =  json.productionPerMonth[index]
          }
        }
          this.setState({
            
              value: value,
              data: json.monthName,
              isloaded:true
          })
          //console.log('here2')
          //console.log(this.state.data)   
      })
    }
     
  }
  componentWillUnmount(){
    if(controller){
      controller.abort();
  }
  }
  

    render() {
      return (
        <div>
          {this.state.isloaded ? (<ReactEcharts 
       
          style={{height: '350px', width:'98%',marginLeft:'1%'}}
          option={{
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              }
            },
            label: {
              show: true,
              position: 'top'
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
                data: this.state.data,
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
                data: this.state.value,
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
        
        ):(<L></L>) }</div>
        
      );
    }
  }export default Echart3;
  