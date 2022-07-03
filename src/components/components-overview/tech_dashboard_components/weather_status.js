import React, { Component } from "react";
import weathericon from '../../../images/rain.png'


class WeatherStatus extends Component {

    constructor(props) {
        super(props);

        this.state={
            image: this.props.image,
            temp: this.props.temp
        }
    }

    async componentDidMount(){
        // document.getElementById("production").checked = true;
        await fetch('https://api.weatherapi.com/v1/forecast.json?key=8b275674fea4449dab0133622222303&q=Bahrain&days=1&aqi=no&alerts=no', {
            headers : { 
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Cookie': "",
                }
            })
            .then(response => response.json())
            .then((json) => {
                // console.log(json)
                this.setState({
                    image: json.current.condition.icon,
                    temp: json.current.temp_c
                })
            })
        
    }

    render(){
        return(
            <div style={{width:'100%', textAlign:'center'}}>
               <img src={this.state.image} width="150px"></img>
               <p style={{fontSize:'20px', color:'black'}}>{this.state.temp}°C</p>
            </div>
        )
    }
}
export default WeatherStatus