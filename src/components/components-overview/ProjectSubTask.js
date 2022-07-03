import React, { Component } from "react";
import Chart from "react-apexcharts";
import {URL} from '../../constants';
import  { useState, useEffect } from "react";

class SubTask extends React.Component {
  
  constructor(props) {
    super(props);

    this.state = {
    
      series: [{
        name: 'Hours',
        data: []
      }],
      options: {
        chart: {
          height: 500,
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
          categories:[],
          //tickAmount: undefined,
          //tickPlacement: 'between',
        },
        
        plotOptions: {
          bar: {
            columnWidth: '100%',
            borderRadius: 4,
            horizontal: true,
          }
        },
      },
      timeIntervalForSubTask:this.props.timeIntervalForSubTask,
      useRangeForSubTask:this.props.useRangeForSubTask,
      startTimeForSubTask: this.formatDate(this.props.startTimeForSubTask) ,
      endTimeForSubTask: this.formatDate(this.props.endTimeForSubTask)
  
    
    };
  }


  

   async componentDidMount() {

    // alert(this.state.endTimeForSubTask)
    var cat = [];
    var string ="";
    var finalarray =[];
    var finalarraytotaltime =[];
 
    //this.updateTimer =  setInterval(async () =>   {

    let sn = this.props.sn
    const response = await fetch(URL+'Users/getProjectSubTask/' +
     this.state.timeIntervalForSubTask + '/' +
     this.state.useRangeForSubTask  + '/' + 
     this.state.startTimeForSubTask  + '/' +
     this.state.endTimeForSubTask 
     ,{
        headers : {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
        },
        method: 'GET',
    })
    const json = await response.json()
    const Time = json.data

    let TotalTime = []
    if(Time){
      for (let row of Time) {
        const {x,y} = row
        // if(y !== null && y !== '0' ){
          TotalTime.push([y])
          cat.push([x])
        // }
      }
  
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
    

    // finalarray.split(",")
    // string = finalarray;
    
    //console.log(finalarray,finalarraytotaltime);

   
    //console.log(TotalTime,cat) 


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
          enabled: true,
          textAnchor: 'start',
          style: {
            colors: ['#000'],
            fontSize: '10px',
            fontWeight: 'bold'
          },
          formatter: function (val, opt) {
            return opt.w.globals.labels[opt.dataPointIndex] + ":  " + val
          },
          offsetX: 0,
          dropShadow: {
            enabled: false
          }
        },
        colors: ['#33b2df', '#546E7A', '#d4526e', '#13d8aa', '#A5978B', '#2b908f', '#f9a3a4', '#90ee7e',
        '#f48024', '#69d2e7'
        ],
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
          labels: {
            show: true,
            rotate: -45,
            rotateAlways: false,
            hideOverlappingLabels: true,
            showDuplicates: false,
            trim: false,
            minHeight: undefined,
            maxHeight: 120,
            style: {
                colors: [],
                fontSize: '12px',
                fontFamily: 'Helvetica, Arial, sans-serif',
                fontWeight: 400,
                cssClass: 'apexcharts-xaxis-label',
            },
            offsetX: 0,
            offsetY: 0,
            format: undefined,
            formatter: undefined,
            datetimeUTC: true,
            datetimeFormatter: {
                hour: 'HH:mm',
            },
          },
          axisBorder: {
            show: true,
            color: '#78909C',
            height: 1,
            width: '100%',
            offsetX: 0,
            offsetY: 0
          },
          title: {
            text: 'Total Hours',
            offsetX: 0,
            offsetY: 0,
            style: {
                color: '#000',
                fontSize: '12px',
                fontFamily: 'Helvetica, Arial, sans-serif',
                fontWeight: 600,
                cssClass: 'apexcharts-xaxis-title',
            },
          },
        },
        yaxis: {
          labels: {
            show: false
          },
          title: {
            text: 'Task',
            offsetX: 0,
            offsetY: 0,
            style: {
                color: '#000',
                fontSize: '12px',
                fontFamily: 'Helvetica, Arial, sans-serif',
                fontWeight: 600,
                cssClass: 'apexcharts-xaxis-title',
            },
          },

        },
        legend: {
          show: false,
        },


        
        plotOptions: {
          bar: {
            barHeight: '100%',
            distributed: true,
            horizontal: true,
            columnWidth: '100%',
            dataLabels: {
              position: 'bottom'
            },
          }
        },
      },
    
    })//}, 10000);
      
}
// componentWillUnmount(){
//   clearInterval(this.updateTimer);
// }
async componentDidUpdate(prevProps){
  if(prevProps.timeIntervalForSubTask !== this.props.timeIntervalForSubTask){
       await this.setState({          
        timeIntervalForSubTask: this.props.timeIntervalForSubTask,
        useRangeForSubTask:this.props.useRangeForSubTask
      });
      // alert(this.state.timeIntervalForProject)
      // alert('tttt')
      this.componentDidMount()
      
  }
  if(prevProps.startTimeForSubTask !== this.props.startTimeForSubTask || prevProps.endTimeForSubTask !== this.props.endTimeForSubTask){
    await this.setState({          
     startTimeForSubTask: this.formatDate(this.props.startTimeForSubTask),
     endTimeForSubTask: this.formatDate(this.props.endTimeForSubTask),
     useRangeForSubTask:this.props.useRangeForSubTask
   });
  //  alert('yasbdvas')
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

      <Chart options={this.state.options} series={this.state.series} type="bar" height={700} />
    );
  }
}

export default SubTask;
