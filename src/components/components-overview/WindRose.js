import React from "react";
import styled from "styled-components";
import {WindRose} from "react-windrose-chart";
import {URL} from '../../constants';

class WindRose2 extends React.Component {
   Container = styled.div`
  width: 600px;
  height: 600px;
`;
  constructor(props) {
    super(props);

    //let sn = this.props.sn

    this.state = {

      "data": [
        {
          "angle": "N",
          "0-2": 1,
          "2-4": 2,
          "4-6": 4,
          "6-8": 6,
          "8-10": 5,
          "+10": 7,
          "total": 99
        },
        {
          "angle": "NNE",
          "0-2": 0,
          "2-4": 0,
          "4-6": 0,
          "6-8": 0,
          "8-10": 0,
          "+10": 0,
          "total": 0
        },
        {
          "angle": "NE",
          "0-2": 2,
          "2-4": 2,
          "4-6": 2,
          "6-8": 2,
          "8-10": 1,
          "+10": 1,
          "total": 11
        },
        {
          "angle": "ENE",
          "0-2": 0,
          "2-4": 0,
          "4-6": 0,
          "6-8": 0,
          "8-10": 0,
          "+10": 0,
          "total": 0
        },
        {
          "angle": "E",
          "0-2": 6,
          "2-4": 5,
          "4-6": 2,
          "6-8": 1,
          "8-10": 1,
          "+10": 1,
          "total": 16
        },
        {
          "angle": "ESE",
          "0-2": 0,
          "2-4": 0,
          "4-6": 0,
          "6-8": 0,
          "8-10": 0,
          "+10": 0,
          "total": 0
        },
        {
          "angle": "SE",
          "0-2": 8,
          "2-4": 4,
          "4-6": 2,
          "6-8": 1,
          "8-10": 0,
          "+10": 0,
          "total": 15
        },
        {
          "angle": "SSE",
          "0-2": 0,
          "2-4": 0,
          "4-6": 0,
          "6-8": 0,
          "8-10": 0,
          "+10": 0,
          "total": 0
        },
        {
          "angle": "S",
          "0-2": 13,
          "2-4": 2,
          "4-6": 1,
          "6-8": 1,
          "8-10": 0,
          "+10": 0,
          "total": 18
        },
        {
          "angle": "SSW",
          "0-2": 0,
          "2-4": 0,
          "4-6": 0,
          "6-8": 0,
          "8-10": 0,
          "+10": 0,
          "total": 0
        },
        {
          "angle": "SW",
          "0-2": 7,
          "2-4": 1,
          "4-6": 0,
          "6-8": 0,
          "8-10": 0,
          "+10": 0,
          "total": 9
        },
        {
          "angle": "WSW",
          "0-2": 0,
          "2-4": 0,
          "4-6": 0,
          "6-8": 0,
          "8-10": 0,
          "+10": 0,
          "total": 0
        },
        {
          "angle": "W",
          "0-2": 1,
          "2-4": 0,
          "4-6": 0,
          "6-8": 1,
          "8-10": 0,
          "+10": 0,
          "total": 3
        },
        {
          "angle": "WNW",
          "0-2": 0,
          "2-4": 0,
          "4-6": 0,
          "6-8": 0,
          "8-10": 0,
          "+10": 0,
          "total": 0
        },
        {
          "angle": "NW",
          "0-2": 0,
          "2-4": 0,
          "4-6": 1,
          "6-8": 1,
          "8-10": 1,
          "+10": 1,
          "total": 5
        },
        {
          "angle": "NNW",
          "0-2": 0,
          "2-4": 0,
          "4-6": 0,
          "6-8": 0,
          "8-10": 0,
          "+10": 0,
          "total": 0
        },
      ],
      "columns": [
        "angle",
        "0-2",
        "2-4",
        "4-6",
        "6-8",
        "8-10",
        "+10"
      ]
      
    };
  }
  
  async componentDidMount() {

    

    //let sn = this.props.sn

    // console.log(this.state.data[1]["0-2"])

    // alert(this.props.timeIntervalForProject)
    // var N = [0,0,0,0,0];
    // var finalarray =[];
    // var finalarraytotaltime =[];
    // const response = await fetch(URL+'Users/getProjectTime/2020-11-11',{
    const response = await fetch(URL+'Users/getWindRose/'+this.props.sn,{
        headers : {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
        },
        method: 'GET',
    })
    
    const json = await response.json()
    const res = json.data
    console.table(res)  
    // console.table('data')  

  

  for (let i = 0; i < res.length; i++) {
    // this.insertChartValues(res[i])
    
  }
 

    this.setState({
     
      "data": [ { "angle": "N","0-2": 0,"2-4": 0,"4-6": 0,"6-8": 0,"8-10": 0,"+10": 0,"total": 0}]
    
    })
    
      
  }
  

  // insertChartValues =(res) =>{
  //   // if(res.direction == 'N' && res.speed >=0 && res.speed < 2){
  //   //   this.N[0] = this.N[0]+1
  //   // }else if (res.direction == 'N' && res.speed >=2 && res.speed < 4){}
  //   // this.N[1] = this.N[1] +1 
  // }
  

  render() {
    return (
      <WindRose data={this.state.data} columns={this.state.columns} />
    );
  }
}
  
export default WindRose2;
