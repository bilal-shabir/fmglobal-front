import React from "react";
import {URL2,DKEY} from '../../constants';
import {
    Card,
    CardHeader,
    ListGroup,
    ListGroupItem,
    Row,
    Col,
    Form,
    FormGroup,
    FormInput,
    FormSelect,
    FormTextarea,
    Container
  } from "shards-react";
  import { Modal, Button } from "react-bootstrap";
  import { ToastContainer, toast } from 'react-toastify';
  import UserDetails from "./UserDetails";
// import "react-datepicker/dist/react-datepicker.css";

class UserAccountDetails extends React.Component {
  constructor(props) {
    super(props);
    let type = localStorage.getItem('Type');
    const details = this.props.user_details
    this.state ={
        show: false,
        type: type,
        user_details: details
    }
  }
  
  handleShow = () => {
    this.setState({
      show: true
    })
  }

  handleClose = () => {
    this.setState({
      show:false
    })
  }

  changePassword =() =>{
    if(!document.getElementById("Password").value || !document.getElementById("C").value || !document.getElementById("O").value){
      alert("Please fill all fields")
      return
    }
    if(document.getElementById("Password").value !== document.getElementById("C").value){
      alert('Passwords do not match')
      return
    }
        fetch(URL2+'auth-user/changePassword', {
            headers : { 
              'Content-Type': 'application/json',
              'Accept': 'application/json',
             },
             body: JSON.stringify({ password: document.getElementById("Password").value, oldPassword: document.getElementById("O").value }),
             method:'PUT',
             mode:'cors',
             credentials: 'include'
          }).then(response => response.json())
          .then(response =>{
            if (response.statusCode == 404 || response.status==404 || response.statusCode == 500 || response.statusCode == 403 || response.statusCode == 400 || response.statusCode == 401) {
              throw Error(response.statusText)        
            
            }
            else{
            if (response.Error){
              toast.info( response.Error, {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                });
                
            }
            else{
              toast.success('Password Changed Succesfully', {
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
            this.handleClose()
              this.handleClose()
            }
            // console.log(response)
          }})
          .catch((e) => {
            // console.log(e)  
            toast.error('Something went wrong...', {
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
          });
  }
  update_employee_details = () => {
    const id = localStorage.getItem('user_id');

    fetch(URL2+'employee/update_details/'+id, {
      headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json',

       },
       body: JSON.stringify({ name: document.getElementById("name").value, mobile: document.getElementById("mobile").value, "address": document.getElementById("address").value}),
       method:'PUT',
       mode:'cors',
       credentials: 'include'
    }).then(response => response.json())
    .then(response =>{
      if (response.affected){
        alert("Account details updated successfully")
        localStorage.setItem('Name', document.getElementById("name").value);
        fetch(URL2+'employee/'+id,{
          headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json',
   
          },
          credentials: 'include'
        }).then(response => response.json())
        .then((json)=>{
          // console.log(json)
          this.setState({
            user_details: json
          })
        })
      }
      else{
        alert("Something went wrong... please try again")
      }

    })
  }

  render() {
    return (
      <Container>
        
        <Card small className="mb-4">
        <CardHeader className="border-bottom">
          <h6 className="m-0">Account Details</h6>
        </CardHeader>
        {this.state.type=='employee' ? (
          
        <ListGroup flush>
          <ListGroupItem className="p-3">
            <Row>
              <Col>
                <Form>
                  <Row form>
                    {/* First Name */}
                    <Col md="6" className="form-group">
                      <label htmlFor="feFirstName">Full Name</label>
                      <FormInput
                        id="name"
                        placeholder="Full Name"
                        defaultValue={this.state.user_details.name}
                      />
                    </Col>
                    {/* Last Name */}
                    {/* <Col md="6" className="form-group">
                      <label htmlFor="feLastName">Last Name</label>
                      <FormInput
                        id="feLastName"
                        placeholder="Last Name"
                        value="Alhawaj"
                        onChange={() => {}}
                      />
                    </Col> */}
                  </Row>
                  <Row form>
                    {/* Email */}
                    <Col md="6" className="form-group">
                      <label htmlFor="feEmail">Email</label>
                      <FormInput
                        type="email"
                        placeholder="Email Address"
                        defaultValue={this.state.user_details.email}
                        disabled
                        id="email"
                      />
                    </Col>
                    {/* Password */}
                    <Col md="6" className="form-group">
                      <label htmlFor="fePassword">Phone Number</label>
                      <FormInput
                        type="text"
                        placeholder="Phone Number"
                        defaultValue={this.state.user_details.mobile}
                        id="mobile"
                      />
                    </Col>
                  </Row>
                  <FormGroup>
                    <label htmlFor="feAddress">Address</label>
                    <FormInput
                      id="address"
                      placeholder="Address"
                      defaultValue={this.state.user_details.address}
                    />
                  </FormGroup>
                  <Button theme="accent" style={{backgroundColor:'#004769', borderColor:'#004769'}} onClick={()=>this.update_employee_details()} >Update details</Button>
                  <Button theme="accent" style={{marginLeft:'5px',backgroundColor:'#004769', borderColor:'#004769'}} onClick={this.handleShow}>Change Password</Button>
                </Form>
              </Col>
            </Row>
          </ListGroupItem>
        </ListGroup>):
        (<ListGroup flush>
            <ListGroupItem className="p-3">
              <Row>
                <Col>
                  <Form>
                    <Row form>
                      {/* First Name */}
                      <Col md="6" className="form-group">
                        <label htmlFor="feFirstName">Full Name</label>
                        <FormInput
                          disabled
                          id="feFirstName"
                          placeholder="First Name"
                          value={this.state.user_details.name}
                         
                        />
                      </Col>
                      {/* Last Name */}
                      <Col md="6" className="form-group">
                        <label htmlFor="feLastName">Email</label>
                        <FormInput
                        disabled
                          type="email"
                          
                          placeholder="Email Address"
                          value={this.state.user_details.email}
                         
                        
                        />
                      </Col>
                    </Row>
                    <Row form>
                      {/* Email */}
                      <Col md="6" className="form-group">
                        <label htmlFor="feEmail">Phone Number</label>
                        <FormInput
                        disabled
                          type="email"
                          
                          
                          value={this.state.user_details.mobile}
                          
                          autoComplete="email"
                        />
                      </Col>
                      {/* Password */}
                      {/* <Col md="6" className="form-group">
                        <label htmlFor="fePassword">Payment Terms (days)</label>
                        <FormInput
                        disabled
                          type="number"
                          id="feEmai"
                          value={this.state.user_details.days_for_payment}
                        />
                      </Col> */}
                    </Row>
                    <Row form>
                      {/* Email */}
                      <Col md="6" className="form-group">
                        <label htmlFor="feEmail">Address Line 1</label>
                        <FormInput
                        disabled
                          type="text"
                          value={this.state.user_details.invoice_address_line_1}
                        />
                      </Col>
                      {/* Password */}
                      <Col md="6" className="form-group">
                        <label htmlFor="feEmail">Address Line 2</label>
                        <FormInput
                        disabled
                          type="text"
                          value={this.state.user_details.invoice_address_line_2}
                        />
                      </Col>
                    </Row>
                    <Row form>
                      {/* Email */}
                      <Col md="6" className="form-group">
                        <label htmlFor="feEmail">Address Line 3</label>
                        <FormInput
                        disabled
                          type="text"
                          value={this.state.user_details.invoice_address_line_3}
                        />
                      </Col>
                      {/* Password */}
                      <Col md="6" className="form-group">
                        <label htmlFor="feEmail">Address Line 4</label>
                        <FormInput
                        disabled
                          type="text"
                          value={this.state.user_details.invoice_address_line_4}
                        />
                      </Col>
                    </Row>
                    <Row form>
                      {/* Email */}
                      <Col md="6" className="form-group">
                        <label htmlFor="feEmail">Address Line 5</label>
                        <FormInput
                        disabled
                          type="text"
                          value={this.state.user_details.invoice_address_line_5}
                        />
                      </Col>
                      {/* Password */}
                      <Col md="6" className="form-group">
                        <label htmlFor="feEmail">Address Line 6</label>
                        <FormInput
                        disabled
                          type="text"
                          value={this.state.user_details.invoice_address_line_6}
                        />
                      </Col>
                    </Row>

                    {/* <Button theme="accent" style={{backgroundColor:'#004769', borderColor:'#004769'}}>Update Account</Button> */}
                    <Button theme="accent" style={{marginLeft:'5px',backgroundColor:'#004769', borderColor:'#004769'}} onClick={this.handleShow}>Change Password</Button>
                  </Form>
                </Col>
              </Row>
            </ListGroupItem>
          </ListGroup>)
        }
      </Card>
      
      <Modal
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={this.state.show}
  >
      <Modal.Header>
      <Modal.Title>Change Password</Modal.Title>

      </Modal.Header>
      <Modal.Body>
      <Row>
          <Col>
          <div>
          <label for="exampleInputPassword1">Old Password</label>
            <input type="password" name="Password" placeholder="Enter Old Password" id="O" class="password" defaultValue={null}/>
          </div>
          </Col>
  
      </Row>
      <Row>
          <Col>
              <div>
              <label for="exampleInputPassword1">New Password</label>
            <input type="password" name="Password" placeholder="Enter New Password"  id="Password" class="password"/>
          </div>
          </Col>
          <Col>
          <div>
          <label for="exampleInputPassword1">Confirm New Password</label>
            <input type="password" name="Password" placeholder="Confirm New Password" id="C" class="password"/>
          </div>
          </Col>
      </Row>
      <div style={{marginTop:'15px'}}>
      <Button variant="secondary" onClick={this.handleClose}>
          Close
      </Button>
      
        <Button onClick={()=>this.changePassword()} variant="primary"  style={{marginLeft:'5px',backgroundColor:'#004769', borderColor:'#004769'}}>
        Change Password
    </Button>

      
      </div>
      </Modal.Body>
      <Modal.Footer>
      
      </Modal.Footer>
  </Modal>
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
                // style={{marginLeft:'6%'}}
                />
  </Container>
    );
  }
}

export default UserAccountDetails;
