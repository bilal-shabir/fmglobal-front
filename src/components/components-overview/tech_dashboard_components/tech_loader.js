import React, { Component } from "react";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";

class TechLoader extends Component {
    render(){
        return(
            <div style={{
                width:'100%',
                height:'200px',
                textAlign:'center',
                marginTop:'5%'
            }}>
                <Loader
                    type="Oval"
                    color="#007BFF"
                    height={50}
                    width={50}
                    // timeout={3000} //3 secs
                />
            </div>
        )
    }
}
export default TechLoader