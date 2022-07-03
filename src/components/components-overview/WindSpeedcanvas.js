import React, { Component } from "react";
import Chart from "react-google-charts";
import {URL} from '../../constants';


var startTime = 0, endTime = 0;
class WindSpeedcanvas extends React.Component {

  constructor(props) {
    super(props);
    const userIs_logged=localStorage.getItem('is_logged');
   
    if(userIs_logged != 1){
    this.props.history.push("/login");
    }

    this.state = {
        data : [],
        metadata:'',
        limit : '',
        limitvalues : '',
        dataLoadingStatus: 'loading',
        chartData: [],
        chemicalCODE:"",
        pid:this.props.id,
        type:this.props.type,
        series:[]
    }
    
}
  

  async componentDidMount() {

    const response = await fetch(URL+'customers/get_power_and_wind_speed/',{
      headers : { 
      'Content-Type': 'application/json',
      'Accept': 'application/json'
      },
      method: 'GET',
  })
    const json = await response.json()
    // console.log(json);
    const speed = json.speed
    const power = json.power

    const columns = [
    { type: 'date', label: 'Year' },
    { type: 'number', label: 'Wind Speed' },
    { type: 'number', label: 'Current Power' },
    ]
    let speeds = []
    for (let row of speed) {
      for(let row1 of power){
        const {x,y} = row
        const {d,p} = row1
        speeds.push([new Date(Date.parse(x)),y,p])
        
        }
    }
    //console.log(speeds);

    this.setState({
    chartData: [columns, ...speeds],
    dataLoadingStatus: 'ready',
    series: {
      // Gives each series an axis name that matches the Y-axis below.
      0: { axis: 'Wind Speed' ,curveType: 'function', color: '#0c76c7'},
      1: { axis: 'Current Power' ,curveType: 'function', color: '#702391'},
      //4: { color: '#702391' , lineDashStyle: [14, 2, 2, 7] , lineWidth: 4  },          
    }
    })

      
}
	
	render() {
		
				
		return (
		
		 <Chart
                width={'100%'}
                height={'100%'}
                chartType="LineChart"
                loader = {this.state.dataLoadingStatus}
                data={this.state.chartData}
                options={{  
                chart: {
                    title:'Wind Speed Vs Power',
                },
                animation: {"startup": true},
                explorer: {  axis: 'horizontal',keepInBounds: true, actions: ['dragToZoom', 'rightClickToReset'],maxZoomIn: .5,maxZoomOut: 8 },
                width: 1500,
                height: 700,
                series: this.state.series,
                axes: {
                  // Adds labels to each axis; they don't have to match the axis names.
                  y: {
                    Wind: { label: 'Wind Speed' },
                    Power: { label: 'Current Power' },
                  },
                },
                trendlines: { 0: {} },
                hAxis: {
                    formatr: 'yyyy',
                },
                vAxis: {
                format: 'short',
                },
                title: this.state.chemicalCODE+' Level',
                }}
                rootProps={{ 'data-testid': '1' }}
            />
		
		);
	} 			
 


}

export default WindSpeedcanvas;
