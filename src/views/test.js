import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Spinner from 'react-bootstrap/Spinner';
import {URL} from '../constants';
import logo from '../images/PavilionLogo.png';
import "./login.css";


class Login extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
        data: [],
        per: 3,
        page: 1,
        num_rows:1,
        show_loading:false,
        hide_form:false
      };

      this.handleSubmit = this.handleSubmit.bind(this);


  }

  handleSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const data = new FormData(form);
    this.setState({ show_loading: true}); 
  
    
    var email=document.getElementById("Email").value;
    var password=document.getElementById("Password").value;

    fetch(URL+'users/login_ver', {
      headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
       },
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify({ Email: email, Password: password })
    }).then(response => response.json())
    // .catch((error) => {
    //   alert( error);
    // })
    .then((json) => {
      //console.log(json)
      if(json.status=='success'){
        if(json.data != 'The User is not active'){
          this.setState({
            show_loading: false,
            hide_form:true
            })
            
            localStorage.setItem('UserType',json.UserType);
            localStorage.setItem('ID',json.data.id);
            localStorage.setItem('Email',json.data.email);
            localStorage.setItem('Token',json.data.token);
            localStorage.setItem('Type',json.data.Type);
            localStorage.setItem('admin',json.data.admin);
            localStorage.setItem('permissions',json.data.permissions);
            localStorage.setItem('is_logged','1');

            const permissions=localStorage.getItem('permissions');
            var permission = (permissions||"").split(",");
            
            this.props.history.push("/"+permission[0]);
          }else{
            alert('The User is not active')
            this.setState({
              show_loading: false
          
              })   
          }
      }
      else if(json.status=='failed'){
  
        alert('Invalid Username or Password')
        this.setState({
          show_loading: false
      
          })     
      }
      else if(json.status=='validation_error'){
  
        alert('Please fill all fields!')
        this.setState({
          show_loading: false
      
          })     
      }
  
    }
  )}
  
  
  
  render() {

  return (
    <div className="Login">
        <div class="card" style={{ Width: "90px"}}> 
            <img class="card-img-top" src={logo} style={{ maxWidth: "90px"}} alt="Card image cap"/>
                <div class="card-body">
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Group size="lg" controlId="Login.Email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            autoFocus
                            type="email"
                            value={this.state.Email} id="Email" name="Email" onChange={this.handleInputChange}
                        />
                        </Form.Group>
                        <Form.Group size="lg" controlId="Login.Password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            value={this.state.Password} id="Password" name="Password" onChange={this.handleInputChange}
                        />
                        </Form.Group>
                        <Button variant="primary" className="btn-infi-app-form" type="submit">
                        {
                            this.state.show_loading  &&
                            <div><Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true"/><span className="sr-only">Loading...</span></div>
                        } 
                        Login 
                        </Button>
                    </Form>
                </div>
         </div>
    </div>
  );
}
} // close for login

export default Login;
