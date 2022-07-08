import React, { Component } from "react";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";

class L extends Component {
    constructor(props) {
        super(props);
        // alert(this.props.marginTop)
       if(this.props.marginBottom && this.props.marginTop){
            this.state = {
                margin_bottom: this.props.marginBottom,
                margin_top: this.props.marginTop,
                setMargin: true

            }
        }
        else if(this.props.marginBottom){
            this.state = {
                margin_bottom: this.props.marginBottom,
                setMargin: false
            }
        }
        else if(this.props.marginTop){
            this.state = {
                margin_top: this.props.marginTop,
                setMargin: true
            }
        }
        else{
            this.state = {
                margin_bottom: null,
                setMargin: false
            }
        }
    }
    // componentDidMount(){
    //     document.getElementById("loader").style.marginTop = "17%";
            
        
    // }

    render(){
        return(
            <div id="loader" style={{
                
                width:'100%',
                height:'200px',
                textAlign:'center',
                marginTop: this.state.setMargin ? this.state.margin_top : '17%',
                marginBottom: this.state.margin_bottom ? this.state.margin_bottom : 0
            }}>
                <Loader
                    type="Oval"
                    color="black"
                    height={50}
                    width={50}
                    // timeout={3000} //3 secs
                />
            </div>
        )
    }
}
export default L