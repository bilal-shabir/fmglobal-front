import React from "react";
import { Col, Container, Row, } from "shards-react";

import PageTitle from "../../components/common/PageTitle";
import {URL2} from '../../constants';
import Form from "react-bootstrap/Form";
import Cookies from "universal-cookie";


class Invoice extends React.Component{
    constructor(props){
        super(props);
        const userIs_logged=localStorage.getItem('is_logged');
    //   const userEmail=localStorage.getItem('Email');
    //   const userToken=localStorage.getItem('Password');
      if(userIs_logged != 1){
        this.props.history.push("/login");
      }
        this.state = {
            counter: 0,
            customers: [],
            projects: [],
            contracts: [],
            devices: [],
            projectDevices:[],
            customerProject: [],
            company_name: '',
            company_phone:'',
            company_city:'',
            company_zip:'',
            company_state:'',
            company_address: '',
            customer_crn: '',
            customer_id: null,
            project_name: '',
            project_id: null,
            selectedCustomer: {},
            selectedProject: {}

           
          };
        this.handleSubmit = this.handleSubmit.bind(this);
        // this.add_device = this.add_device.bind(this);
        // this.removedevice = this.removedevice.bind(this);
        this.handleCustomerNameChange = this.handleCustomerNameChange.bind(this);
        this.handleProjectNameChange = this.handleProjectNameChange.bind(this);
    }
    
//    async componentDidMount(){
//        this.props.history.push('/CeoDashboard')
//    }

componentWillMount() {

    require('../../utils').checkpermision('Invoice')
    const access_token = localStorage.getItem('access_token');
    fetch(URL2+'customer-role-company/getCustomer', {
        headers : { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'access_token' : access_token
         },
         credentials: 'include'
      }).then(response => response.json())
      .then(response => {
        //   console.log(response)
          this.setState({
            customers: response,
            // projects: response.projects,
            // contracts: response.contracts,
            // devices: response.project_devices
            
          })
        
      })
}

    async handleSubmit(e){
        e. preventDefault();
        const data = new FormData();

        //customer details
        //var custname =document.getElementById("cust-name").value;
        //var compname =document.getElementById("comp-name").value;
        //var projname =document.getElementById("proj-name").value;
        //var compaddress =document.getElementById("comp-address").value;
        //var compcity =document.getElementById("comp-city").value;
        //var compstate =document.getElementById("comp-state").value;
        //var compzip =document.getElementById("comp-zip").value;
        //var compphone =document.getElementById("comp-phone").value;
        //var compemail =document.getElementById("comp-email").value;
        var custID =document.getElementById("cust-ID").value;
        var projID =document.getElementById("proj-ID").value;

        


        //billing details
        var INVnumber =document.getElementById("INV-number").value;
        var INVcrn =document.getElementById("INV-crn").value;
        var INVstartdate =document.getElementById("INV-start-date").value;
        var INVenddate =document.getElementById("INV-end-date").value;
        var INVduedate =document.getElementById("INV-due-date").value;
        var INVbillingmonth =document.getElementById("INV-billing-month").value;
        var INVpowergenerated =document.getElementById("INV-power-generated").value;
        var INVsubtotal =document.getElementById("INV-sub-total").value;
        var INVtaxrate =document.getElementById("INV-tax-rate").value;
        var INVtax =document.getElementById("INV-tax").value;
        var INVtotalamount =document.getElementById("INV-total-amount").value;
        var INVCPREVIOUSDUES = document.getElementById("INVC_PREVIOUS_DUES").value;
        var count = this.state.counter;

        //sinlge device details
        for (let index = 0; index < this.state.devices.length; index++) {
            var desc = document.getElementById("desc"+this.state.devices[index].device.id).value
            var pgen = document.getElementById("pgen"+this.state.devices[index].device.id).value
            var amn = document.getElementById("amn"+this.state.devices[index].device.id).value
            var did = document.getElementById("did"+this.state.devices[index].device.id).value
            
            data.append('INVC_DTAL_DESC'+index , desc )
            data.append('INVC_DTAL_POWER_GENERATED'+index , pgen)
            data.append('INVC_DTAL_AMOUNT'+index , amn )
            data.append('INVC_DTAL_DVIC_ID'+index , did )

        }

        
        //customer details data append
        data.append('counter' , count)
        //data.append('INVC_CUSTOMER_NAME' , custname)
        //data.append('INVC_COMPANY_NAME', compname )
        //data.append('INVC_PROJECT_NAME', projname )
        //data.append('INVC_COMPANY_STREET_ADDRESS', compaddress )
        //data.append('INVC_COMPANY_CITY', compcity )
        //data.append('INVC_COMPANY_STATE', compstate )
        //data.append('INVC_COMPANY_ZIP', compzip )
        //data.append('INVC_COMPANY_PHONE', compphone )
        //data.append('INVC_COMPANY_EMAIL', compemail )
        data.append('customer', custID )
        data.append('project', projID )

        //billing details data append
        data.append('invc_number' , INVnumber)
        data.append('invc_crn', INVcrn )
        data.append('start_date', INVstartdate )
        data.append('end_date', INVenddate )
        data.append('due_date', INVduedate )
        data.append('billing_month', INVbillingmonth )
        data.append('production_generated', INVpowergenerated )
        data.append('sub_total', INVsubtotal )
        data.append('tax_rate', INVtaxrate )
        data.append('tax', INVtax )
        data.append('total', INVtotalamount)
        data.append('previous_dues', INVCPREVIOUSDUES)
        // alert(data)

        //console.log(data)
        // alert(data)
        var object = {};
        data.forEach(function(value, key){
                object[key] = value;
            });
            
        // console.log(object)
        // console.log("===================================================================")
        const access_token = localStorage.getItem('access_token');
         fetch(URL2+'invoice/addInvoice', {
            headers : { 
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'access_token' : access_token
               },
               credentials: 'include',
              method: 'POST',
              mode: 'cors',
              body: JSON.stringify(object)
            })
            .then(response => response.json())
               .then((json) => {
                // alert(json.id)
                // console.log(json)
                this.props.history.push('/ViewInvoices')
        
                });
             } 

    handleCustomerNameChange(event){
        // console.log(event.target.value);
        this.setState({
            customer_id: event.target.value,
            
        })
        const access_token = localStorage.getItem('access_token');
        fetch(URL2+'project/getProjects/'+event.target.value, {
            headers : { 
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'access_token': access_token
             },
             credentials: 'include'
          }).then(response => response.json())
          .then(response => {
              
                const selected = this.state.customers.find(customer =>
                    customer.customer.id == this.state.customer_id)
                const selectedcustomer = selected.customer
                this.setState({
                    customerProject : response,
                    selectedCustomer: selectedcustomer
                })
            })
        
        

        // const custprojects = this.state.projects.filter(project =>
        //     project.clientid=== event.target.value
        //     )
        // // console.table(custprojects)

        // this.setState({
        //     company_name: selectedCustomer.company,
        //     company_phone: selectedCustomer.phonenumber,
        //     company_city:selectedCustomer.city,
        //     company_zip:selectedCustomer.zip,
        //     company_state: selectedCustomer.state,
        //     company_address: selectedCustomer.address,
        //     customerProject : custprojects,
        //     project_name: '',
        //     customer_crn: '',
        //     projectDevices:[],
        //     counter: 0
            
        // })
        
        
    }
    handleProjectNameChange(event){
        this.setState({
            project_id: event.target.value,
            
        })
        const access_token = localStorage.getItem('access_token');
        fetch(URL2+'project-device/getDevices/'+event.target.value, {
            headers : { 
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'access_token': access_token
             },
             credentials: 'include'
          }).then(response => response.json())
          .then(response => {
            //   console.log(response)
              const selectedProject = this.state.customerProject.find(project =>
                project.id == this.state.project_id)
            // console.log(selectedProject)
                // const selected = this.state.customers.find(customer =>
                //     customer.customer.id == this.state.customer_id)
                // const selectedcustomer = selected.customer
                this.setState({
                    devices: response,
                    counter: response.length,
                    selectedProject: selectedProject
                })
        })
        // const crn = this.state.contracts.find(contract =>
        //     contract.project_id === event.target.value   
        //     )
        // const pdevices = this.state.devices.filter(device => 
        //     device.PROJECT_ID === event.target.value && device.CUSTOMER_ID === this.state.customer_id
        //     )
        // const pname = this.state.projects.find(project =>
        //     project.id === event.target.value)
        // // console.log(pdevices)
        // this.setState({
        //     projectDevices: pdevices,
        //     customer_crn: crn.ref,
        //     counter: pdevices.length,
        //     project_name: pname.name
        // })
        // console.log(this.state.counter)
    }

    render(){
        return(
            
            <Container fluid className="main-content-container px-4">
                <Row noGutters className="page-header py-4">
                     <PageTitle title={"Billing Dashboard"}   className="text-sm-left mb-3" />
                </Row>
                {/* <Row noGutters className="page-header py-4">
                   <PageTitle title={"Billing Dashboard"}   className="text-sm-left mb-3" />
                </Row> */}
                <Form onSubmit={this.handleSubmit} style={{margin:'3%'}}> 
                <Row>
                    <Col >
                    <h4>Customer Details</h4>
                        <Row>
                            <Col>
                                <div class="form-group">
                                    <label for="exampleInputPassword1">Customer</label>
                                    {/* <input type="text" class="form-control"  placeholder="Enter customer ID" name="cust-ID" id="cust-ID" ></input> */}
                                    <select class="form-control" name="cust-ID" id="cust-ID" onChange={this.handleCustomerNameChange}>
                                    <option disabled selected value> -- select an option -- </option>
                                    {this.state.customers.map((customer) => 
                                               <option key={customer.customer.id } value={customer.customer.id}>   
                                                      {  customer.customer.name}
                                               </option>
                                              )}
                                    </select>
                                </div>
                            </Col>
                            
                            <Col>
                                <div class="form-group">
                                    <label for="exampleInputPassword1">Project</label>
                                    <select class="form-control" name="proj-ID" id="proj-ID" onChange={this.handleProjectNameChange}>
                                    <option selected value> -- select an option -- </option>
                                    {this.state.customerProject.map((project) => 
                                               <option key={project.id } value={project.id}>   
                                                      {  project.name}
                                               </option>
                                              )}
                                    </select>
                                    
                                </div>
                            </Col>
                        </Row>
                        <div class="form-group">
                                <label for="exampleInputPassword1">Customer Reference Number</label>
                                <input type="text" class="form-control"  placeholder="Select Customer and Project" name="INV-crn" id="INV-crn" required></input>
                        </div>
                        <div class="form-group">
                            <label for="exampleInputEmail1">Customer Name</label>
                            <input type="text" class="form-control"  placeholder="Enter Customer name" name="cust-name" id="cust-name" defaultValue={this.state.selectedCustomer.name}  required></input>
                        </div>
                        <div class="form-group">
                            <label for="exampleInputPassword1">Company Name</label>
                            <input type="text" class="form-control"  placeholder="Enter Company name" name="comp-name" id="comp-name" defaultValue={this.state.selectedCustomer.name} required></input>
                        </div>
                        <div class="form-group">
                            <label for="exampleInputPassword1">Project Name</label>
                            <input type="text" class="form-control"  placeholder="Enter Project name" name="proj-name" id="proj-name" required defaultValue={this.state.selectedProject.name}></input>
                        </div>
                        
                        <Row>
                            <Col>
                                <div class="form-group">
                                    <label for="exampleInputPassword1">Company Street Address</label>
                                    <input type="text" class="form-control"  placeholder="Enter street address" name="comp-address" id="comp-address" defaultValue={this.state.selectedCustomer.street} required></input>
                                </div>
                            </Col>
                            <Col>
                                <div class="form-group">
                                    <label for="exampleInputPassword1">Company City</label>
                                    <input type="text" class="form-control"  placeholder="Enter city" name="comp-city" id="comp-city" defaultValue={this.state.selectedCustomer.city} required></input>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <div class="form-group">
                                    <label for="exampleInputPassword1">Company ZIP</label>
                                    <input type="text" class="form-control"  placeholder="Enter ZIP" name="comp-zip" id="comp-zip" defaultValue={this.state.selectedCustomer.zip} required></input>
                                </div>
                            </Col>
                            <Col>
                                <div class="form-group">
                                    <label for="exampleInputPassword1">Company State</label>
                                    <input type="text" class="form-control"  placeholder="Enter State" name="comp-state" id="comp-state" defaultValue={this.state.selectedCustomer.state} required></input>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <div class="form-group">
                                    <label for="exampleInputPassword1">Company Phone</label>
                                    <input type="text" class="form-control"  placeholder="Enter phone number" name="comp-phone" id="comp-phone" defaultValue={this.state.selectedCustomer.mobile} required></input>
                                </div>
                            </Col>
                            <Col>
                                <div class="form-group">
                                    <label for="exampleInputPassword1">Customer Email Address</label>
                                    <input type="email" class="form-control"  placeholder="Enter email address" name="comp-email" id="comp-email"required defaultValue={this.state.selectedCustomer.email} ></input>
                                </div>
                            </Col>
                        </Row>
      
                    </Col>
                    <Col >
                        <h4>Billing Details</h4>
                        <div class="form-group" >
                                <label for="exampleInputEmail1">Invoice Number</label>
                                <input type="number" class="form-control"  placeholder="Enter invoice number" name="INV-number" id="INV-number" required></input>
                            </div>
                            
                            <Row>
                                <Col>
                                    <div class="form-group">
                                        <label for="exampleInputPassword1">Invoice Start Date</label>
                                        <input type="date" class="form-control"  placeholder="Enter start date" name="INV-start-date" id="INV-start-date"required ></input>
                                    </div>
                                </Col>
                                
                                <Col>
                                    <div class="form-group">
                                        <label for="exampleInputPassword1">Invoice End Date</label>
                                        <input type="date" class="form-control"  placeholder="Enter start date" name="INV-end-date" id="INV-end-date"required ></input>
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <div class="form-group">
                                        <label for="exampleInputPassword1">Payment Due Date</label>
                                        <input type="date" class="form-control"  placeholder="Enter due date" name="INV-due-date" id="INV-due-date" required></input>
                                    </div>
                                </Col>
                                <Col>
                                    <div class="form-group">
                                        <label for="exampleInputPassword1">Billing Month</label>
                                        <input type="text" class="form-control"  placeholder="Invoice Billing Month" name="INV-billing-month" id="INV-billing-month"required ></input>
                                    </div> 
                                </Col>
                            </Row>
                            <div class="form-group">
                                <label for="exampleInputPassword1">Total Power Generated</label>
                                <input type="number" class="form-control"  placeholder="Enter power generated (kWh)" name="INV-power-generated" id="INV-power-generated"  step="0.001" required></input>
                            </div> 
                            <Row>
                                <Col>
                                    <div class="form-group">
                                        <label for="exampleInputPassword1">Tax Rate</label>
                                        <input type="number" class="form-control"  placeholder="Enter tax rate" name="INV-tax-rate" id="INV-tax-rate" required></input>
                                    </div>
                                </Col>
                                <Col>
                                    <div class="form-group">
                                        <label for="exampleInputPassword1">Tax</label>
                                        <input type="number" class="form-control"  placeholder="Enter tax" name="INV-tax" id="INV-tax"  step="0.001" required></input>
                                    </div> 
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <div class="form-group">
                                        <label for="exampleInputPassword1">Sub Total</label>
                                        <input type="number" class="form-control"  placeholder="Enter Sub Total" name="INV-sub-total" id="INV-sub-total"  step="0.001" required></input>
                                    </div>
                                </Col>
                                <Col>
                                    <div class="form-group">
                                        <label for="exampleInputPassword1">Total Amount</label>
                                        <input type="number" class="form-control"  placeholder="Enter total Amount" name="INV-total-amount" id="INV-total-amount"  step="0.001" required></input>
                                    </div>
                                </Col>
                            </Row>                                
                            <div class="form-group">
                                <label for="exampleInputPassword1">Previous Month Dues</label>
                                <input type="number" class="form-control"  placeholder="Enter total Amount" name="INVC_PREVIOUS_DUES" id="INVC_PREVIOUS_DUES"  step="0.001" required></input>
                            </div>
                    
                    </Col>
                </Row>
                <Row><h4>Device Details</h4></Row>
                
                <div style={{display: 'flex',  justifyContent:'center', alignItems:'center',}}>
                { this.state.counter === 0 ?
                        <div><h4 style={{ color:'#C8C8C8'}}>No devices installed for this customer and project</h4></div>
                    :null}
                </div>
                <Row>
                    
                    
                    <Col>
                    {this.state.devices.map((device)=>(
                        <div class="form-group" id="detail" >
                        <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                        </div>
                            <Row>
                                <Col>
                                    <label for="exampleInputPassword1">Device ID</label>
                                    <input type="text" class="form-control"  placeholder="Enter device ID" name="did" id={"did"+device.device.id} value={device.device.sn} disabled style={{backgroundColor:'white' }} required></input>
                                </Col>
                                <Col>
                                    <label for="exampleInputPassword1">Device Description</label>
                                    <input type="text" class="form-control"  placeholder="Enter description" name="desc" id={"desc"+device.device.id} required ></input>
                                </Col>
                                
                            </Row>
                            <Row>
                                <Col>
                                    <label for="exampleInputPassword1">Device Power generation</label> 
                                    <input type="number" class="form-control"  placeholder="Enter power generated (kWh)" id={"pgen"+device.device.id} name="pgen"  step="0.001" required></input>
                                </Col>
                                <Col>
                                    <label for="exampleInputPassword1">Device Amount</label>
                                    <input type="number" class="form-control"  placeholder="Enter device amount" id={"amn"+device.device.id} name="amn"  step="0.001" required></input>
                                </Col>
                                
                            </Row>
                            <hr/>
                        </div>
                    ))}
                    </Col>
                </Row>
                { this.state.counter !== 0 ?
                        <button type="submit" class="btn btn-primary">Submit</button>
                    :null}
                
                </Form>
               
                
            </Container>
            
            
        );
    }
}
export default Invoice;