import React, { Component } from "react";
import ReactEcharts from "echarts-for-react";
import {URL2,DKEY,URL3} from '../../../src/constants.js';
import L2 from "./loader2.js";
import '../../assets/style.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

let controller

class Echart4 extends Component {
  ws = new WebSocket(URL3);
  constructor(props) {
    super(props);

    const userIs_logged=localStorage.getItem('is_logged');
    if(userIs_logged != 1){
    this.props.history.push("/login");
    }

    const pid = this.props.id
    // alert(pid)
    
    this.state = {
        series: null,
        baq: pid == 8 ? true : false,
        pid: pid,
        production_value_sma: [],
        production_value_fronius: [],
        production_time: [],
        production_device: [],
        isLoaded: false,
        updated_at: 0,
    }
//
}
async componentDidMount() {

  controller = new AbortController();
  const signal = controller.signal;

  fetch(URL2+'project/get_current', {
    headers : { 
      'Content-Type': 'application/json',
      'Accept': 'application/json',

     },
     credentials: 'include',
    method: 'PATCH',
    mode: 'cors',
    signal,
    body: JSON.stringify({ project_id: this.state.pid, n:7})
  }).then(response => response.json()).
  then((json)=>{
    if (json.statusCode == 404 || json.status==404 || json.statusCode == 500 || json.statusCode == 403 || json.statusCode == 400 || json.statusCode == 401) {
      throw Error(json.statusText)        
  }
  else{
    // console.log('Live Production')
    // console.log(json)
    if(json.production.time.length == 0){
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
        this.setState({
          production_value_sma: [0,0,0,0,0,0,0],
          production_time: pt.reverse().splice(0,7).reverse(),
          isLoaded: true,
        })
      }
else{
  var production1 = []
  for (let index = 0; index < json.production.time.length; index++) {
    let obj = {
      'time': json.production.time[index],
      'sma' : json.production.sma[index],
      'fronius': json.production.fronius[index],
     'device': json.production.devices[index]
    }
    production1.push(obj)
    
  }
  // console.log(production1)
    const uniqueValuesSet = new Set();

// array of objects with duplicate values

const production = production1.filter((obj) => {
  // check if name property value is already in the set
  const isPresentInSet = uniqueValuesSet.has(obj.time);

  // add name property value to Set
  uniqueValuesSet.add(obj.time);

  // return the negated value of
  // isPresentInSet variable
  return !isPresentInSet;
});
// console.log(production)
    

    

    var time= []
    var value_sma=[]
    var value_fronius=[]
    var devices=[]
    for (let index = 0; index < production.length; index++) {
      if(production[index].sma){
        value_sma.push(production[index].sma/1000)
      }
      else{
        value_sma.push(production[index].sma)
      }
      if(production[index].fronius){
        value_fronius.push(production[index].fronius/1000)
      }
      else{
        value_fronius.push(production[index].fronius)
      }
      time.push(this.abc(production[index].time))
      devices.push(production[index].device)
    }
    // console.log(devices)
    for (let i = 0; i < devices.length; i++) {
      devices[i] = "Device(s): "+ devices[i];
    }
    // console.log(devices)
    // console.log(value_sma)
    // console.log(value_fronius)


    this.setState({
      production_value_fronius : value_fronius.splice(0,7).reverse(),
      production_value_sma: value_sma.splice(0,7).reverse(),
      production_time: time.splice(0,7).reverse(),
      production_device: devices.splice(0,7).reverse(),
      isLoaded: true,
    })
    if(!this.state.production_value_fronius.every(element => element === null) && !this.state.production_value_sma.every(element => element === null)){
      this.setState({
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
            color: '#004769',
            data: this.state.production_value_fronius,
            type: 'line',
            smooth: true,
            name:'Fronius',
            connectNulls: true,
          },
          {
            color: '#FFFFFF',
            type: 'line',
            data: this.state.production_device,
            name: '',
          }
        ]
      })
    }
  }
}})
.catch((e) => {
  console.log(e)  
  // toast.error('Error: Chart data not fetched', {
  //     position: "top-center",
  //     autoClose: 3000,
  //     hideProgressBar: false,
  //     closeOnClick: true,
  //     pauseOnHover: false,
  //     draggable: true,
  //     progress: undefined,
  //     });
});
  

  // const ws =  new WebSocket(URL3);

  // this.setState({
  //   ws: ws
  // })

  this.ws.onopen = () =>  {
      //console.log('connected')
      this.ws.send(
          JSON.stringify({
            event: 'project/register',
            data: {project_id: this.state.pid, number_of_records: 7},
          }),
        );
      }
  this.ws.onmessage =  event =>  {
    // console.log(event)
      const json = JSON.parse(event.data);
      // console.log(json) 
      // console.log(json) 
      if(json.production && json.event == 'project/project_graph'){
        // console.log(json)
        if(!json.production.time){
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
          // console.log(ranges)
          const d = new Date();
          let hour = d.getHours();
          const pt = ranges.slice(0,ranges.indexOf(this.addZero(hour)+":00")+1)
          this.setState({
            production_value_sma: [0,0,0,0,0,0,0],
            production_time: pt.reverse().splice(0,7).reverse(),
            isLoaded: true,
          })
        }
        else {
          this.setState({
            isLoaded: false
          })
        
        var time= this.state.production_time
        var value_sma=this.state.production_value_sma
        var value_fronius = this.state.production_value_fronius
        var device = this.state.production_device
        
        if(time.at(-1) != this.abc(json.production.time) && time.length == 7){
          time.shift()
          value_sma.shift()
          value_fronius.shift()
          device.shift()
          if(json.production.sma){
            value_sma.push(json.production.sma/1000)
          }
          else{
            value_sma.push(json.production.sma)
          }
          if(json.production.fronius){
            value_fronius.push(json.production.fronius/1000)
          }
          else{
            value_fronius.push(json.production.fronius)
          }
          time.push(this.abc(json.production.time))
          device.push("Device(s): "+json.production.devices)
          this.setState({
            production_value_sma: value_sma,
            production_value_fronius: value_fronius,
            production_time: time,
            production_device: device,
            isLoaded: true,

          })
        }
        else if (time.at(-1) != this.abc(json.production.time) && time.length < 7){
          if(json.production.sma){
            value_sma.push(json.production.sma/1000)
          }
          else{
            value_sma.push(json.production.sma)
          }
          if(json.production.fronius){
            value_fronius.push(json.production.fronius/1000)
          }
          else{
            value_fronius.push(json.production.fronius)
          }
          time.push(this.abc(json.production.time))
          device.push("Device(s): "+json.production.devices)
          this.setState({
            production_value_sma: value_sma,
            production_value_fronius: value_fronius,
            production_time: time,
            production_device: device,
            isLoaded: true,

          })
        }
        else{
          this.setState({
            isLoaded: true
          })
        }
      }
    }
  }
  // ws.close()
}

componentWillUnmount(){
    if(controller){
      controller.abort();
  }
  this.ws.close()
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
 
    render() {
      return (
        
        <div>
          {this.state.isLoaded ? (
        <ReactEcharts 
       
       style={{height:'250px'}} //276
          option={{
            tooltip: {
              trigger: 'axis',
              // position: [100, 0],
              className: `${this.state.baq ? "livecharttooltip" : " "}`,
              textStyle: {
                fontSize: 14,
                width: '200px',
                overflow: "hidden"
                
              }
            },
            title: {
              text: "Hourly Production (kW)",
              left: "start",
              textStyle: {
                fontSize: 14,
                fontWeight: 'normal',
                color: '#004769'
              }
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
            series: this.state.series ? this.state.series : [
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
              },
              {
                color: '#FFFFFF',
                type: 'line',
                data: this.state.production_device,
                name: '',
              }
            ]
          }}
        />
        ): (<L2></L2>)}
        </div>
        
      );
    }
  }
  export default Echart4;
  

  
