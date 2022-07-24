import React from "react";
import {URL2} from '../constants';
import "./login.css";

class Logout extends React.Component {


  componentDidMount(){
    fetch(URL2+'logout',{
      headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        "Authorization": 'Bearer ' + localStorage.getItem("access_token")
       },
       credentials: 'include'
    })
    localStorage.removeItem("access_token")
    this.props.history.push("login");

  }
  
  
  
  render() {

  return (
   <div></div>
  );
}
} // close for login

export default Logout;