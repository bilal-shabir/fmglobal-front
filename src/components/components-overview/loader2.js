import React, { Component } from "react";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";

class L2 extends Component {
    render(){
        return(
            <div style={{
                width:'100%',
                height:'200px',
                textAlign:'center',
                marginTop:'17%'
            }}>
                <Loader
                    type="Oval"
                    color="#004769"
                    height={50}
                    width={50}
                    // timeout={3000} //3 secs
                />
                <p style={{color:'#004769', fontSize:16}}>Loading</p>
            </div>
        )
    }
}
export default L2