import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Spinner from 'react-bootstrap/Spinner';
import { URL2, DKEY } from '../constants';
import logo from '../images/PavilionLogo.png';
import banner from '../images/banner2.jpg'
import Dashboard from "./Dashboard";
import Cookies from 'universal-cookie';
import { Select } from "semantic-ui-react";
import { Modal } from "react-bootstrap";
import { Card, Container, Row, Col } from "shards-react";
// import { Text, Extratext,Textlink,StyleSheet } from "react-native";


class NewPassword extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      show: false,
      name: null,
      data: [],
      per: 3,
      page: 1,
      num_rows: 1,
      show_loading: false,
      hide_form: false,

    };
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
    localStorage.removeItem('Type');
    //this.handleSubmit = this.handleSubmit.bind(this);
  }

  //   handleSubmit(event) {
  //   event.preventDefault();
  //   this.setState({ show_loading: true });
  //   const cookies = new Cookies();


  //   var email = document.getElementById("Email").value;
  //   var password = document.getElementById("Password").value;

  //   fetch(URL2 + 'NewPassword', {
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Accept': 'application/json'
  //     },
  //     credentials: 'include',
  //     method: 'POST',
  //     mode: 'cors',
  //     body: JSON.stringify({ email: email, password: password })
  //   }).then(response => response.json())
  //     .then((json) => {
  //       // console.log(json.message)
  //       console.log(json)
  //       if (json.message == 'succeess') {
  //         this.setState({
  //           name: json.name
  //         })
  //         //cookies.set('access_token', json.access_token, { path: '/', secure:false} )
  //         localStorage.setItem('access_token', json.access_token);
  //         localStorage.setItem('user_id', json.id);
  //         fetch(URL2 + 'customer-role-company/permission', {
  //           headers: {
  //             'Content-Type': 'application/json',
  //             'Accept': 'application/json',
  //             'access_token': json.access_token
  //           },
  //           credentials: 'include'
  //         }).then(response => response.json())
  //           .then((json) => {
  
  //             console.log(json)
  //             console.log("==============================================")

  //             if (json.length != 0) {
  //               this.setState({
  //                 show_loading: false,
  //                 hide_form: true
  //               })

  //               var CryptoJS = require("crypto-js");
  //               var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(json), DKEY).toString();

  //               //cookies.set('permissions', ciphertext, { path: '/', secure:true} )
  //               localStorage.setItem('permissions', ciphertext);
  //               localStorage.setItem('UserType', 'Staff');
  //               localStorage.setItem('Email', email);
  //               localStorage.setItem('username', email);
  //               localStorage.setItem('Name', this.state.name);
  //               localStorage.setItem('Type', 'customer');
  //               localStorage.setItem('admin', '0');
  //               localStorage.setItem('is_logged', '1');
  //               if (json[0].resource.name == 'Invoice') {
  //                 this.props.history.push("/ViewInvoices");
  //               }
  //               else {
  //                 this.props.history.push("/" + json[0].resource.name);
  //               }
  //             }
  //             else {
  //               var x = document.getElementById("snackbar2");
  //               // Add the "show" class to DIV
  //               x.className = "show";
  //               // After 3 seconds, remove the show class from DIV
  //               setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
  //               this.setState({
  //                 show_loading: false,
  //                 hide_form: true
  //               })

  //             }
  //           })


  //       }
  //       else {
  //         var x = document.getElementById("snackbar");
  //         // Add the "show" class to DIV
  //         x.className = "show";
  //         // After 3 seconds, remove the show class from DIV
  //         setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
  //         this.setState({
  //           show_loading: false,
  //           hide_form: true
  //         })
  //       }

  //     }
  //     )
  // }

  // showreset = () => {
  //   this.setState({
  //     show: true

  //   })
  // }

  // hidereset = () => {
  //   this.setState({
  //     show: false

  //   })
  // }

  render() {

    return (


      <div class="auth-wrapper">
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
                          {/* <label style={{fontSize:'13px'}}></label> */}
                          <div class="input-group mb-3">

                            {/* <div class="input-group-prepend">
                            <span class="input-group-text" id="basic-addon1">
                              @
                            </span>
                          </div> */}
                            <input
                              type="text"
                              class="form-control"
                              aria-label="Username"
                              aria-describedby="basic-addon1"
                              // defaultValue={this.state.pr.Requested_B}
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
              <Button variant="primary" onClick={() => this.handlesubmit(this.state.pr.id)}>
                Submit
              </Button>
            </Modal.Footer>
          </Modal>

        </div>
        <div class="auth-form-wrapper">
                          
          <div class="auth-form">
            <div class="auth-form-label">
              <img class="card-img-top" src={logo} style={{ maxWidth: "50px" }} alt="Card image cap" />
              <p class="primary-label">Pavilion Renewables</p>

            </div>
            <div class="auth-form-label">
              <p class="primary-label" style={{ fontSize: 13, color: '#C9C9C9' }}>----------------Password Reset-----------------</p>
            </div>
            <form style={{ paddingLeft: '25px', paddingRight: '25px' }} onSubmit={this.handleSubmit}>
              <div>
                <input type="password" name="newpassword" placeholder="New password" id="newpassword" class="text" />
              </div>

              <div>
                <input type="password" name="confirmnewpassword" placeholder="Confirm new password" id="confirmnewpassword" class="password" />
              </div>
              <div style={{ marginTop: '10px' }}>
                <a onClick={this.showreset} style={{ cursor: 'pointer' }} > </a>


                <button class="button" type="submit" style={{ marginTop: '10px' }}>
                  {
                    this.state.show_loading &&
                    <div style={{ display: 'inline-block', paddingRight: '5px' }}><Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /><span className="sr-only">Loading...</span></div>
                  }
                  Submit
                </button>
                
              </div>
            </form>
          </div>
        </div>
        <div id="snackbar">Invalid Credentials</div>
        <div id="snackbar2">No Access</div>
      </div>

    );
  }
} // close for NewPassword

export default NewPassword;
