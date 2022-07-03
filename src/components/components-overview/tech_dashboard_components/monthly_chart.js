import React, { Component } from "react";
import ReactEcharts from "echarts-for-react";
import { graphic } from 'echarts'
import L from "../loader";
import {URL2,URL3} from '../../../constants';


class TechMonthlyChart extends Component {
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
      pid: this.props.id,
      devices: this.props.devices ? this.props.devices : null
    }
    // console.log("Project devices",this.props.devices)
  }
  componentDidMount(){
    //console.log('here')
    // console.log(this.state.pid)

    const type = localStorage.getItem('Type'); 

    if(this.state.devices){
      for (let index = 0; index < this.state.devices.length; index++) {
        this.state.devices[index] = +this.state.devices[index]
        
     }
      // console.log(typeof this.state.devices[0])
      fetch(URL2+'project/getMonthlyDataForEmployee',{
        headers : { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',

         },
         credentials: 'include',
         method: 'PATCH',
         mode: 'cors',
         body: JSON.stringify({project_id: this.state.pid, devices: this.state.devices})
      })
      .then(response => response.json())
      .then((json)=>{
        // console.log(json)
        var value = []
        var value1 = []
        for (let index = 0; index < json.productionPerMonth.length; index++) {
          if(json.productionPerMonth[index] != 0){
          value[index] =  json.productionPerMonth[index].toFixed(3);
          }
          else{
            value[index] =  json.productionPerMonth[index]
          }
          if(json.consumptionPerMonth[index] != 0){
            value1[index] =  json.consumptionPerMonth[index].toFixed(3);
            }
            else{
              value1[index] =  json.consumptionPerMonth[index]
            }
        }
          this.setState({
              value: value.reverse(),
              consumption:value1.reverse(),
              data: json.months.reverse(),
              isloaded:true
          })
          //console.log('here2')
          //console.log(this.state.data)   
      })
    }
    else{
      fetch(URL2+'project/getMonthlyDataForEmployee',{
        headers : { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
         },
         credentials: 'include',
         method: 'PATCH',
         mode: 'cors',
         body: JSON.stringify({project_id: this.state.pid})
      })
      .then(response => response.json())
      .then((json)=>{
        // console.log(json)
        var value = []
        var value1 = []
        for (let index = 0; index < json.productionPerMonth.length; index++) {
          if(json.productionPerMonth[index] != 0){
          value[index] =  json.productionPerMonth[index].toFixed(3);
          }
          else{
            value[index] =  json.productionPerMonth[index]
          }
          if(json.consumptionPerMonth[index] != 0){
            value1[index] =  json.consumptionPerMonth[index].toFixed(3);
            }
            else{
              value1[index] =  json.consumptionPerMonth[index]
            }
        }
          this.setState({
              value: value.reverse(),
              consumption:value1.reverse(),
              data: json.months.reverse(),
              isloaded:true
          })
          //console.log('here2')
          //console.log(this.state.data)   
      })
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
            // label: {
            //   show: true,
            //   position: 'top'
            // },
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
                barWidth: '30%',
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
              {
                name: 'Consumption',
                data: this.state.consumption,
                type: 'bar',
                barWidth: '30%',
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
        
        ):(<L></L>) }</div>
        
      );
    }
  }export default TechMonthlyChart;
  