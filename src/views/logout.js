import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Spinner from 'react-bootstrap/Spinner';
import {URL2} from '../constants';
import "./login.css";
import {Router, Route, Link, RouteHandler} from 'react-router';
import { withRouter } from "react-router-dom";
import Cookies from "universal-cookie";


class Logout extends React.Component {

  constructor(props) {
    super(props);
    //console.log(URL);

    localStorage.removeItem('Email');
    localStorage.removeItem('Token');
    
    localStorage.removeItem('ID');
    localStorage.removeItem('is_logged');


    localStorage.removeItem('permissions');
    localStorage.removeItem('state');
    localStorage.removeItem('username');
    localStorage.removeItem('company');
    localStorage.removeItem('user_id');
    localStorage.removeItem('Name');
    localStorage.removeItem('side_menu');
    
    const UserType=localStorage.getItem('Type');
    if (UserType == 'employee') {
      localStorage.removeItem('Type');    
      this.props.history.push("Employeelogin");

    }
    else{
      localStorage.removeItem('Type');
      this.props.history.push("login");
    }
    

  }

  componentDidMount(){
    fetch(URL2+'logout',{
      headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json',

       },
       credentials: 'include'
    })
    // .then(response => response.json())
  }
  
  
  
  render() {

  return (
   <div></div>
  );
}
} // close for login

export default Logout;
