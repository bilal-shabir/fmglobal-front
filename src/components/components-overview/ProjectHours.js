import React, { Component } from "react";
import Chart from "react-apexcharts";
import {URL} from '../../constants';
import  { useState, useEffect } from "react";


class CeoDashboard extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
    
      series: [{
        name: 'Hours',
        data: []
      }],
      options: {
        chart: {
          height: 200,
          type: 'bar',
          zoom: {
            enabled: false
          }
        },
        noData: {
          text: 'No Data Available',
          align: 'center',
          verticalAlign: 'middle',
          offsetX: 0,
          offsetY: 0,
          style: {
            color: '#008CBA',
            fontSize: '30px',
          
          }
        },
        dataLabels: {
          enabled: true
        },
        stroke: {
          curve: 'straight'
        },
        grid: {
          row: {
            colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
            opacity: 0.5
          },
        },
        xaxis: {
          type: 'String',
          categories:[],
          //tickAmount: undefined,
          //tickPlacement: 'between',
        },
        
       
        plotOptions: {
          bar: {
            columnWidth: '100%',
            distributed: true,
          }
        },
        
      },
      timeIntervalForProject : this.props.timeIntervalForProject,
      useRangeForProject:this.props.useRangeForProject,
      startTimeForProject: this.formatDate(this.props.startTimeForProject) ,
      endTimeForProject: this.formatDate(this.props.endTimeForProject)

      
    
    };
  }


  

  async componentDidMount() {

    
    
    let sn = this.props.sn

    // alert(this.state.timeIntervalForProject)

    // alert(this.props.timeIntervalForProject)
    var cat = [];
    var finalarray =[];
    var finalarraytotaltime =[];
    const response = await fetch(URL+'Users/getProjectTime/'+ 
    this.state.timeIntervalForProject + '/' +
     this.state.useRangeForProject + '/' + 
     this.state.startTimeForProject + '/' +
     this.state.endTimeForProject
     ,{
        headers : {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
        },
        method: 'GET',
    }) 
    const json = await response.json()
    const Time = json.data
    console.table(Time)  

    let TotalTime = []
    if(Time){
      for (let row of Time) {
        const {x,y} = row
        // if(y !== null && y !== '0' ){
        TotalTime.push([y])
        cat.push([x])
        }
      // }
      
      for(let i = 0; i < cat.length; i++) {
      
        for(let j = 0; j < cat[i].length; j++) {
          
          finalarray.push(cat[i][j]);
  
        }
  
        
      }
      
  
      for(let i = 0; i < TotalTime.length; i++) {
      
        for(let j = 0; j < TotalTime[i].length; j++) {
          
          finalarraytotaltime.push(TotalTime[i][j]);
  
        }
      }
    }
    

    

    this.setState({
      series: [{
        name: 'Hours',
        data: finalarraytotaltime
      }],
      options: {
        chart: {
          height: 350,
          type: 'bar',
          zoom: {
            enabled: false
          }
        },
        dataLabels: {
          enabled: true
        },
        stroke: {
          curve: 'straight'
        },
        grid: {
          row: {
            colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
            opacity: 0.5
          },
        },
        xaxis: {
          type: 'String',
          categories:finalarray,
          //tickAmount: undefined,
          //tickPlacement: 'between',
        },
        
       
        plotOptions: {
          bar: {
            columnWidth: '100%',
            distributed: true,
          }
        },
        
      },
    
    })//}, 10000);
      
  }
  // componentWillUnmount(){
  //   clearInterval(this.updateTimer);
  // }
  async componentDidUpdate(prevProps){
    // Optimize this later!!!!
    if(prevProps.timeIntervalForProject !== this.props.timeIntervalForProject){
         await this.setState({          
          timeIntervalForProject: this.props.timeIntervalForProject,
          useRangeForProject:this.props.useRangeForProject
        });
        // alert(this.state.endTimeForProject)
   
        // alert(this.state.timeIntervalForProject)
        this.componentDidMount()
        
    }

     if(prevProps.startTimeForProject !== this.props.startTimeForProject || prevProps.endTimeForProject !== this.props.endTimeForProject){
         await this.setState({          
          startTimeForProject: this.formatDate(this.props.startTimeForProject),
          endTimeForProject: this.formatDate(this.props.endTimeForProject),
          useRangeForProject:this.props.useRangeForProject
        });
        this.componentDidMount()
        // console.log(this.state.startTimeForProject)
        // console.log(this.state.endTimeForProject)
      }
}

 formatDate(date) {
  var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2) 
      month = '0' + month;
  if (day.length < 2) 
      day = '0' + day;

  return [year, month, day].join('-');
}

  render() {
    return (
      
      <Chart options={this.state.options} series={this.state.series} type="bar" />
     
    );
  }
}

export default CeoDashboard;
