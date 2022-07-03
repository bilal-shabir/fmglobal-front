import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Spinner from 'react-bootstrap/Spinner';
import {URL2,DKEY} from '../constants';
import logo from '../images/PavilionLogo.png';
import banner from '../images/banner2.jpg'
import "./login.css";
import Dashboard from "./Dashboard";
import Cookies from 'universal-cookie';
import { Select } from "semantic-ui-react";
import defineAbility from "./defineAbility";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Modal } from "shards-react";


class Login extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
        name: null,
        data: [],
        per: 3,
        page: 1,
        num_rows:1,
        show_loading:false,
        hide_form:false,

      };
    localStorage.removeItem('Email');
    localStorage.removeItem('Token');

    localStorage.removeItem('ID');
    localStorage.removeItem('is_logged');
    localStorage.removeItem('side_menu');

    localStorage.removeItem('permissions');
    localStorage.removeItem('state');
    localStorage.removeItem('username');
    localStorage.removeItem('company');
    localStorage.removeItem('user_id');
    localStorage.removeItem('Name');
    localStorage.removeItem('Type');
    this.handleSubmit = this.handleSubmit.bind(this);
 }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({ show_loading: true}); 
    const cookies = new Cookies();
    
    
    var email=document.getElementById("Email").value;
    var password=document.getElementById("Password").value;

    fetch(URL2+'login', {
      headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
       },
       credentials: 'include',
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify({ email: email, password: password })
    }).then(response => response.json())
    .then((json) => {
      // console.log(json.message)
      // console.log(json)
      if(json.message=='succeess'){
        this.setState({
          name: json.name
        })
        //cookies.set('access_token', json.access_token, { path: '/', secure:false} )
        localStorage.setItem('user_id',json.id);
        fetch(URL2+'getPermissions',{
          headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json',

           },
           credentials: 'include'
        }).then(response => response.json())
        .then((json)=>{
          
          if (json.statusCode == 404 || json.statusCode == 401 || json.statusCode == 500 || json.statusCode == 403 || json.statusCode == 400) { 
            throw Error(json.statusText)        
          }
          else{
            if(json.modules.length != 0){
              this.setState({
                show_loading: false,
                hide_form:true
              })
    
              var CryptoJS = require("crypto-js");
              var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(json.modules), DKEY).toString();
    
              //cookies.set('permissions', ciphertext, { path: '/', secure:true} )
              localStorage.setItem('permissions',ciphertext);
              localStorage.setItem('UserType','Staff');
              localStorage.setItem('Email',email);
              localStorage.setItem('username',email);
              localStorage.setItem('Name',this.state.name);
              localStorage.setItem('Type','customer');
              localStorage.setItem('admin','0');
              localStorage.setItem('is_logged','1');
              if(json.modules[0].name =='Billing'){
                this.props.history.push("/ViewInvoices");
              }
              else{
                this.props.history.push("/"+json.modules[0].name);
              }
            }
            else{
              toast.info('No Access', {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                });
              this.setState({
                show_loading: false,
                hide_form:true
              })
              
            }
          }
        
        
        })
        .catch((e) => {
          console.log(e)  
          toast.error('Something went wrong...', {
              position: "top-center",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: false,
              draggable: true,
              progress: undefined,
              });
        });
  
        
        
      }
      else{
        var x = document.getElementById("snackbar");
        // Add the "show" class to DIV
        x.className = "show";
        // After 3 seconds, remove the show class from DIV
        setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
        this.setState({
          show_loading: false,
          hide_form:true
        })
      }
    
    }
  )}
  
  //fadhel input
  showreset=()=>{
    this.setState({
      show: true
    
    })}
    
    hidereset=()=>{
    this.setState({
      show: false
      
    })
      }
  //

  render() {

  return (

  <>
      <div id='ResetModal'>

      <Modal
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            show={this.state.show}
          >
            <Modal.Header>
              <Modal.Title>Reset Password Request</Modal.Title>
            </Modal.Header>
            <Modal.Body>

            <ul class="list-group list-group-flush">
              <li class="list-group-item p-3">
                <div class="row">
                  <div class="col-sm-12 col-md-12">
                    <strong class="text-muted d-block mb-2"> Enter your email address: </strong>
                    <form>
                      <div class="form-group">
                     
                        <div class="input-group mb-3">

                          <input
                            type="text"
                            class="form-control"
                            aria-label="Username"
                            aria-describedby="basic-addon1"
                            id="Requested_B"
                          />{" "}
                        </div>
                      </div>

                     
                    </form>
                  </div>
                 
                </div>
              </li>
              </ul>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={this.hidereset}>
                Close
              </Button>
              <Button variant="primary"  onClick={()=>this.handlesubmit(this.state.pr.id)}>
                Submit
              </Button>
            </Modal.Footer>
          </Modal>

      </div>


    <div class="auth-wrapper">
    <div class="auth-form-wrapper">
      <div class="auth-media">
        
        <img class="card-img-top" src={banner} alt="Card image cap" style={{borderRadius: '20px',height:'300px', marginTop:'20px'}}/>
      </div>
      <div class="auth-form">
        <div class="auth-form-label">
        <img class="card-img-top" src={logo} style={{ maxWidth: "50px"}} alt="Card image cap"/>
          <p class="primary-label">Pavilion Renewables</p>
          
        </div>
        <div class="auth-form-label">
        <p class="primary-label" style={{fontSize:13, color:'#C9C9C9'}}>----------------Customer Portal-----------------</p>
        </div>
      <form style={{paddingLeft: '25px', paddingRight:'25px'}} onSubmit={this.handleSubmit}>
          <div>
            <input type="text" name="Email" placeholder="Email" id="Email" class="text"/>
          </div>

          <div>
            <input type="password" name="Password" placeholder="Password" id="Password" class="password"/>
          </div>
          <div style={{marginTop:'10px'}}>
          <a onClick={this.showreset} style ={{cursor: 'pointer'}} >Forgot Password? </a>
          <p></p>    
          <button class="button" type="submit">
                        {
                            this.state.show_loading  &&
                            <div style={{display:'inline-block',paddingRight:'5px'}}><Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true"/><span className="sr-only">Loading...</span></div>
                        } 
                        SIGN IN 
         </button>
          </div>
        </form> 
      </div>
    </div>
    <div id="snackbar">Invalid Credentials</div>
    <div id="snackbar2">No Access</div>
    <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss={false}
                draggable
                pauseOnHover={false}
                style={{marginLeft:'6%'}}
                />
  </div>
  </>
  );
}
} 

export default Login;
