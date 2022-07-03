import React, { Component } from "react";
import Chart from "react-apexcharts";
import {URL} from '../../constants';
import  { useState, useEffect } from "react";

class ProjectType extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    
      series: [{
        name: 'Hours',
        data: []
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
      timeIntervalForProduct : this.props.timeIntervalForProduct,
      useRangeForProduct:this.props.useRangeForProduct,
      startTimeForProduct: this.formatDate(this.props.startTimeForProduct) ,
      endTimeForProduct: this.formatDate(this.props.endTimeForProduct)
    
    
    
    };
  }


  

  async componentDidMount() {
 
  
    // alert(this.state.startTimeForProduct)
    // alert(this.state.useRangeForProduct)

      let sn = this.props.sn
      var cat = [];
      var string ="";
      var finalarray =[];
      var finalarraytotaltime =[];
      const response = await fetch(URL+'Users/getTypeTime/' 
      + this.state.timeIntervalForProduct + '/' +
      this.state.useRangeForProduct + '/' + 
      this.state.startTimeForProduct + '/' +
      this.state.endTimeForProduct,{
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
          }
        // }
  
        for(let i = 0; i < cat.length; i++) {
        
          for(let j = 0; j < cat[i].length; j++) {
            
            finalarray.push(cat[i][j]);
  
          }
  
          
        }
        console.table(Time)
  
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
      
      
      })
  //}, 10000);
      
}
 


async componentDidUpdate(prevProps){
  if(prevProps.timeIntervalForProduct !== this.props.timeIntervalForProduct){
       await this.setState({          
        timeIntervalForProduct: this.props.timeIntervalForProduct,
        useRangeForProduct:this.props.useRangeForProduct
      });
      // alert(this.state.timeIntervalForProject)
      this.componentDidMount()
      
  }

  if(prevProps.startTimeForProduct !== this.props.startTimeForProduct || prevProps.endTimeForProduct !== this.props.endTimeForProduct){
    await this.setState({          
     startTimeForProduct: this.formatDate(this.props.startTimeForProduct),
     endTimeForProduct: this.formatDate(this.props.endTimeForProduct),
     useRangeForProduct:this.props.useRangeForProduct
   });
   this.componentDidMount()
  //  console.log(this.state.startTimeForProject)
  //  console.log(this.state.endTimeForProject)
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

export default ProjectType;
