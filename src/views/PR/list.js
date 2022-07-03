import React from "react";
import { Modal, Button } from "react-bootstrap";
import {Card,
    CardHeader,
    CardBody,
    ListGroup,
    ListGroupItem,
    CardFooter} from "shards-react";
import {Container, Row, Col} from "shards-react";
import {URL2,DKEY} from '../../constants';
import {Link} from "react-router-dom";
import PageTitle from "../../components/common/PageTitle";
import Cookies from "universal-cookie";
import L from "../../components/components-overview/loader";
import '../../assets/style.css';
import check from '../../images/check.png'
import x_mark from '../../images/x_mark.png'
import arrow_down from '../../images/arrow_down_black.png'
import moneybag from '../../images/money_bag.png'

class Billed_Invoice extends React.Component{
    constructor(props) {
        super(props);
        const userIs_logged=localStorage.getItem('is_logged');
      const userEmail=localStorage.getItem('Email');
      const userToken=localStorage.getItem('Password');
      if(userIs_logged != 1){
        this.props.history.push("/login");
      }
        this.state = {
            isLoaded: false,
            show: false,
            show_create: false,
            data: [],
            invoice: [],
            customers: [],
            customerProject:[],
            project_id: null,
            companies: null,
            projects: null,
            billing_months: null,
            edit_only: false
          };
          this.handleShowCreate = this.handleShowCreate.bind(this)
          
      }

      componentDidMount() {
        require('../../utils').checkpermision('PR')
        let permission = localStorage.getItem('permissions');
        var CryptoJS = require("crypto-js");
        var bytes = CryptoJS.AES.decrypt(permission, DKEY);
        var permissions = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        //console.log(permissions)
        this.getData()

      }
      getData(){
        const access_token = localStorage.getItem('access_token');
        fetch(URL2+'purchase-requisition/getInvoices', {
            headers : { 
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'access_token' : access_token
             },
             credentials: 'include'
          }).then(response => response.json())
          .then((response) => {
            //   console.log(response)
              var companies = []
              for (let index = 0; index < response.length; index++) {
                companies[index] = response[index].customer.name;
                  
              }
              const uniq_company = [...new Set(companies)];
              var projects = []
              for (let index = 0; index < response.length; index++) {
                projects[index] = response[index].project.name;
                  
              }
              const uniq_projects = [...new Set(projects)];
              const billing_months =[]
              for (let index = 0; index < response.length; index++) {
                billing_months[index] = response[index].billing_month;
                  
              }
              const uniq_months = [...new Set(billing_months)];
              this.setState({
                billing_months: uniq_months,
                  projects:uniq_projects,
                  companies: uniq_company,
                  isLoaded: true,
                  data: response
              })
              

              
          })
    
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
                    
                })
                
            })
      }
      handleShowCreate(){
        this.setState({
            show_create: true
        })
      }
      handleProjectNameChange=(event)=>{
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
                this.setState({
                    devices: response,
                    counter: response.length,
                    selectedProject: selectedProject
                })
        })
    }
    handleCustomerNameChange = (event) =>{
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
    }
    create_invoice=()=>{
        var x = document.getElementById("snackbar_invc");
        // Add the "show" class to DIV
        x.className = "show";
        // After 3 seconds, remove the show class from DIV
        setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
        const access_token = localStorage.getItem('access_token');
        this.setState({
            isLoaded: false
        })
        this.getData()
        this.handleCloseCreate()
    }

      handleShow = (id) => {
        const cookies = new Cookies();
        const access_token = localStorage.getItem('access_token');
        fetch(URL2+'invoice/getInvoice/'+id, {
            headers : { 
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'access_token' : access_token
             },
             credentials: 'include'
          }).then(response => response.json())
          .then((response)=>{
              //console.log(response)
              const count = []
              count.push(response.invoice);
              //console.log(count)
              this.setState({
                  invoice: count,
                  devices: response.devices
              })
              
          })
          this.setState({ 
              show: true,
              invoice: [],
              devices: [] 
            });
      };

       numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
    
      handleClose = () => {
        this.setState({ show: false });
      };
      handleCloseCreate = () => {
        this.setState({ show_create: false });
      }

      formsubmit = (id) => {
        const data = new FormData();
        const count = this.state.devices.length;
        
        //invoice Primary key
        data.append('id', id)

        
        var custID =document.getElementById("cust-ID").value;
        var projID =document.getElementById("proj-ID").value;
        //customer details data append
        
       
        data.append('customer', custID )
        data.append('project', projID )

        //billing details
        data.append('counter' , count)
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
        var d ={}
        //single device details
        for (let index = 0; index < this.state.devices.length; index++) {
            var desc = document.getElementById("desc"+this.state.devices[index].id).value
            var pgen = document.getElementById("pgen"+this.state.devices[index].id).value
            var amn = document.getElementById("amn"+this.state.devices[index].id).value
            var did = document.getElementById("did"+this.state.devices[index].id).value
            //var pkey =  this.state.devices[index].INVC_DTAL_ID
            //alert(pkey)
           
            d['INVC_DTAL_ID'+index] = this.state.devices[index].id
            d['INVC_DTAL_DESC'+index] =desc
            d['INVC_DTAL_POWER_GENERATED'+index] = pgen
            d['INVC_DTAL_AMOUNT'+index] = amn
            d['INVC_DTAL_DVIC_ID'+index] = did
            d['counter'] = this.state.devices.length;
            
            
            data.append('INVC_DTAL_ID'+index , this.state.devices[index].id)
            data.append('INVC_DTAL_DESC'+index , desc )
            data.append('INVC_DTAL_POWER_GENERATED'+index , pgen)
            data.append('INVC_DTAL_AMOUNT'+index , amn )
            data.append('INVC_DTAL_DVIC_ID'+index , did )

        }
       var object =[
            {
                "id": id
            },
            {
                "invc_number": INVnumber,
                "invc_crn": INVcrn,
                "start_date": INVstartdate,
                "end_date" : INVenddate,
                "due_date" : INVduedate,
                "billing_month" : INVbillingmonth,
                "production_generated" : INVpowergenerated,
                "sub_total" : INVsubtotal,
                "tax_rate" : INVtaxrate,
                "tax" : INVtax,
                "total" : INVtotalamount,
                "previous_dues" : INVCPREVIOUSDUES
            }
        ]
        
        object.push(d)
        
        const cookies = new Cookies();
        const access_token = localStorage.getItem('access_token');
        fetch(URL2+'invoice/updateInvoice', {
            headers : { 
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'access_token' : access_token
               },
               credentials: 'include',
              method: 'PUT',
              mode: 'cors',
              body: JSON.stringify(object)
            })
            .then(response => response.json())
               .then((json) => {
                // alert(json.id)
                //  this.props.history.push('/InvoicePDF/'+json.id)
        
                });
      }
    convert(date){
        
        var time = Date.parse(date);
        
        var d = new Date(time);
        const month =d.getMonth()+1
        const day = d.getDate()
        const year = d.getFullYear()
        
        return day+'/'+month+'/'+year
        
    }
    abc (date)
        {
        var time = Date.parse(date);
        var date1 = new Date(time);
        
        let d =this.addZero(date1.getDate())
        let m =this.addZero(date1.getMonth()+1)
        let y = this.addZero(date1.getFullYear())
        
        let time1 = y + "/" + m + "/"+d
        return time1
        
        }
        abc2 (date)
        {
        var time = Date.parse(date);
        var date1 = new Date(time);
        
        let d =this.addZero(date1.getDate())
        let m =this.addZero(date1.getMonth()+1)
        let y = this.addZero(date1.getFullYear())
        
        let time1 = y + "-" + m + "-"+d
        return time1
        
        }
    addZero(i) {
        if (i < 10) {i = "0" + i}
        return i;
        }
    projectfilter =(event) => {
        alert(document.getElementById("c_name").value)
        alert(document.getElementById("p_name").value)
        alert(document.getElementById("b_month").value)
        // alert(event.target.value)
        this.setState({
            isLoaded: false
        })
        const result = this.state.data.filter(invoice => invoice.project.name == event.target.value);
        // console.log(result)
        this.setState({
            isLoaded: true,
            data: result
        })
    }
    resetfilters = () => {

        

        const access_token = localStorage.getItem('access_token');
        fetch(URL2+'invoice/getInvoices', {
            headers : { 
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'access_token' : access_token
             },
             credentials: 'include'
          }).then(response => response.json())
          .then((response) => {
            //   console.log(response)
              var companies = []
              for (let index = 0; index < response.length; index++) {
                companies[index] = response[index].customer.name;
                  
              }
              const uniq_company = [...new Set(companies)];
              var projects = []
              for (let index = 0; index < response.length; index++) {
                projects[index] = response[index].project.name;
                  
              }
              const uniq_projects = [...new Set(projects)];
              this.setState({
                  projects:uniq_projects,
                  companies: uniq_company,
                  
                  data: response
              })
              
          })

        document.getElementById("c_name").selectedIndex = 0; //0 = option 1
        document.getElementById("p_name").selectedIndex = 0; //0 = option 1
        document.getElementById("b_month").selectedIndex = 0; //0 = option 1
    }

      
    render(){
        return(
            
            
            <div class="main-content-container container-fluid px-4">
            <Row noGutters className="page-header py-4">
                <PageTitle title={"Billing Dashboard"}   className="text-sm-left mb-3" />
            </Row>
            
                {this.state.isLoaded ? ( 
            
  
            <div class="card card-small mb-4" style={{marginTop:'15px'}}>
              <div  style={{display:'flex'}} class="  card-header border-bottom">
                <h5 style={{flex:'8'}} class="m-0 ">Billed Invoices<span style={{fontSize:'9px', marginLeft:'5px', color:'blue', cursor:'pointer'}} onClick={this.resetfilters}>reset filters</span></h5>
                {/* <button className="btn btn-primary" onClick={this.handleShowCreate}>Create</button> */}
                
              </div>
              
              <div class="card-body p-0 pb-3 text-center">
                <table class="table mb-0">
                  <thead class="bg-light">
                    <tr>
                      <th scope="col" class="border-0">Invoice Number</th>
                      <th scope="col" class="border-0">
                          Company Name
                          <select id="c_name" style={{width:'37px', borderRadius:'5px', fontSize:'10px', marginLeft:'3px', cursor:'pointer'}}>
                          <option value="" disabled selected>Filter</option>
                          {this.state.companies.map((company) => 
                                               <option key={company } value={company}>   
                                                      { company}
                                               </option>
                                              )}
                          </select>
                      </th>
                      <th scope="col" class="border-0">
                          Project Name
                          <select id="p_name" style={{width:'37px', borderRadius:'5px', fontSize:'10px', marginLeft:'3px', cursor:'pointer'}} onChange={this.projectfilter}>
                          <option value="" disabled selected>Filter</option>
                          {this.state.projects.map((project) => 
                                               <option key={project } value={project}>   
                                                      { project}
                                               </option>
                                              )}
                          </select>
                        </th>
                      <th scope="col" class="border-0">Created by</th>
                      <th scope="col" class="border-0">Created at</th>
                      <th scope="col" class="border-0">Billing Period</th>
                      {/* <th scope="col" class="border-0">
                          Status
                          <select id="status" style={{width:'37px', borderRadius:'5px', fontSize:'10px', marginLeft:'3px', cursor:'pointer'}} onChange={this.projectfilter}>
                            <option value="" disabled selected>Filter</option>
                            <option key="new" value="new">   
                                    New
                            </option>
                            <option key="pending_approval" value="pending_approval">   
                                    Pending Approval
                            </option>
                            <option key="approved" value="approved">   
                                    Approved
                            </option>  
                            <option key="billed" value="billed">   
                                    Invoiced
                            </option>
                            <option key="rejected" value="rejected">   
                                    Rejected
                            </option>
                            <option key="reversed" value="reversed">   
                                    reversed
                            </option>                   
                          </select>
                      </th> */}
                       <th scope="col" class="border-0">
                          Billing Month
                          <select id="b_month" style={{width:'37px', borderRadius:'5px', fontSize:'10px', marginLeft:'3px', cursor:'pointer'}} onChange={this.projectfilter}>
                          <option value="" disabled selected>Filter</option>
                          {this.state.billing_months.map((month) => 
                                               <option key={month } value={month}>   
                                                      { month}
                                               </option>
                                              )}
                          </select>
                        </th>
                        <th scope="col" class="border-0">Due Date</th>
                        <th scope="col" class="border-0">Total Amount (BHD)</th>
                      <th scope="col" class="border-0">Actions</th>
                    </tr>   
                  </thead>
                  <tbody>
                  {this.state.data.map((invoice) => (
                      <tr>
                      <td>INVC-{invoice.invc_number}</td>
                      <td>{invoice.customer.name}</td>
                      <td>{invoice.project.name}</td>
                      <td>-</td>
                      <td>{this.abc(invoice.created_at)}</td>
                      <td>{this.abc(invoice.start_date)}-{this.abc(invoice.end_date)}</td>
                      <td>{invoice.billing_month}</td>
                      <td>{this.abc(invoice.due_date)}</td>
                      <td style={{textAlign:'right'}} >{invoice.total}</td>
                      {/* <td>
                          <Link to={`/InvoicePDF/${invoice.id }`} class="btn btn-primary mr-1" style={{backgroundColor:'#21de66', borderColor:'#21de66',marginTop:'3px'}}>View PDF</Link>
                          <button type="button" class="btn btn-primary mr-1" onClick={()=>this.handleShow(invoice.id) } style={{marginTop:'3px'}}>&nbsp;&nbsp;&nbsp;&nbsp;Edit&nbsp;&nbsp;&nbsp;&nbsp;</button>
                          
                      </td> */}
                      <td>
                            {/* <button type="button" class="btn btn-primary mr-1" onClick={()=>this.handleShow(invoice.id) } style={{marginTop:'3px'}}>View Details</button> */}
                            <Link to={`/InvoicePDF/${invoice.id }`} class="btn btn-primary mr-1" style={{backgroundColor:'#21de66', borderColor:'#21de66',marginTop:'3px'}}>View PDF</Link>
                        </td>
                    </tr>
                    ))}
                  </tbody>
                </table>
              </div>
             
            </div>

            
            ) : (<L></L>) }

            
            <span>
                <Container  fluid className="main-content-container px-4">
                <>
                <div id="snackbar_invc" style={{marginTop:'45px'}}>Invoice Created</div>

                <Modal
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    show={this.state.show}
                >

                    <Modal.Header>
                    <Modal.Title>Edit Invoice</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <form onSubmit={()=>this.formsubmit(this.state.invoice[0].id)}>
                    {this.state.invoice.map((invoice) => (
                         <ul class="list-group list-group-flush">
                         <li class="list-group-item p-3">
                         <div class="row">
                             <div class="col-sm-12 col-md-6">
                             <h4>Customer Details</h4>
                             {/* <div class="form-group">
                                 <label >Customer ID</label>
                                 <input type="text" class="form-control"  placeholder="Enter customer ID" name="cust-ID" id="cust-ID" defaultValue={invoice.customer.id} disabled style={{backgroundColor: 'white'}} required></input>
                             </div>
                             <div class="form-group">
                                 <label >Project ID</label>
                                 <input type="text" class="form-control"  placeholder="Enter Project ID" name="proj-ID" id="proj-ID" defaultValue={invoice.project.id} disabled style={{backgroundColor: 'white'}} required></input>
                             </div>
                             <div class="form-group">
                                 <label >Customer Reference Number</label>
                                 <input type="text" class="form-control"  placeholder="Enter Year-Customer ID-Project ID" name="INV-crn" id="INV-crn" defaultValue={invoice.invc_crn} disabled style={{backgroundColor: 'white'}} required></input>
                             </div> */}
                             
                             <div class="form-group">
                                 <label >Customer Name</label>
                                 <input type="text" class="form-control"  placeholder="Enter Customer name" name="cust-name" id="cust-name" defaultValue={invoice.customer.name} required disabled ></input>
                             </div>
                             <div class="form-group">
                                 <label >Company Name</label>
                                 <input type="text" class="form-control"  placeholder="Enter Company name" name="comp-name" id="comp-name" defaultValue={invoice.customer.name} required disabled></input>
                             </div>
                             <div class="form-group">
                                 <label >Project Name</label>
                                 <input type="text" class="form-control"  placeholder="Enter Project name" name="proj-name" id="proj-name" defaultValue={invoice.project.name} required disabled ></input>
                             </div>
                             <div class="form-group">
                                 <label >Company Street Address</label>
                                 <input type="text" class="form-control"  placeholder="Enter street address" name="comp-address" id="comp-address"  defaultValue={invoice.customer.street} required disabled></input>
                             </div>
                             <div class="form-group">
                                 <label >Company City</label>
                                 <input type="text" class="form-control"  placeholder="Enter city" name="comp-city" id="comp-city" defaultValue={invoice.customer.city} required disabled></input>
                             </div><div class="form-group">
                                 <label >Company State</label>
                                 <input type="text" class="form-control"  placeholder="Enter State" name="comp-state" id="comp-state" defaultValue={invoice.customer.state} required disabled></input>
                             </div>
                             <div class="form-group">
                                 <label >Company ZIP</label>
                                 <input type="text" class="form-control"  placeholder="Enter ZIP" name="comp-zip" id="comp-zip" defaultValue={invoice.customer.zip} required disabled></input>
                             </div>
                             <div class="form-group">
                                 <label >Company Phone</label>
                                 <input type="text" class="form-control"  placeholder="Enter phone number" name="comp-phone" id="comp-phone" defaultValue={invoice.customer.mobile} required disabled></input>
                             </div>
                             <div class="form-group">
                                 <label >Customer Email Address</label>
                                 <input type="email" class="form-control"  placeholder="Enter email address" name="comp-email" id="comp-email" defaultValue={invoice.customer.email} required disabled></input>
                             </div>
                             
                             
                             </div>
                             <div class="col-sm-12 col-md-6">
                             <h4>Billing Details</h4>
                             
                             {/* <div class="form-group" >
                                 <label >Invoice Number</label>
                                 <input type="number" class="form-control"  placeholder="Enter invoice number" name="INV-number" id="INV-number" defaultValue={invoice.invc_number} required></input>
                             </div> */}
                             
                             <div class="form-group">
                                 <label >Invoice Start Date</label>
                                 <input type="date" class="form-control"  placeholder="Enter start date" name="INV-start-date" id="INV-start-date" defaultValue={this.abc2(invoice.start_date)} required ></input>
                             </div>
                             <div class="form-group">
                                 <label >Invoice End Date</label>
                                 <input type="date" class="form-control"  placeholder="Enter end date" name="INV-end-date" id="INV-end-date" defaultValue={this.abc2(invoice.end_date)} required></input>
                             </div>
                             <div class="form-group">
                                 <label >Payment Due Date</label>
                                 <input type="date" class="form-control"  placeholder="Enter due date" name="INV-due-date" id="INV-due-date" defaultValue={this.abc2(invoice.due_date)} required ></input>
                             </div>
                             <div class="form-group">
                                 <label >Billing Month</label>
                                 <input type="text" class="form-control"  placeholder="Invoice Billing Month" name="INV-billing-month" id="INV-billing-month" defaultValue={invoice.billing_month} required></input>
                             </div>
                             <div class="form-group">
                                 <label >Total Power Generated</label>
                                 <input type="number" class="form-control"  placeholder="enter power generated" name="INV-power-generated" id="INV-power-generated"defaultValue={invoice.production_generated} disabled required step="0.001"></input>
                             </div>
                             <div class="form-group">
                                 <label >Sub Total</label>
                                 <input type="number" class="form-control"  placeholder="enter Sub Total" name="INV-sub-total" id="INV-sub-total" defaultValue={invoice.sub_total} required step="0.001" disabled></input>
                             </div>
                             <div class="form-group">
                                 <label >Tax Rate</label>
                                 <input type="number" class="form-control"  placeholder="enter tax rate" name="INV-tax-rate" id="INV-tax-rate" defaultValue={invoice.tax} required disabled></input>
                             </div>
                             <div class="form-group">
                                 <label >Tax</label>
                                 <input type="number" class="form-control"  placeholder="enter tax" name="INV-tax" id="INV-tax" defaultValue={invoice.tax_rate} required step="0.001" disabled></input>
                             </div>
                             <div class="form-group">
                                 <label >Total Amount</label>
                                 <input type="number" class="form-control"  placeholder="enter total Amount" name="INV-total-amount" id="INV-total-amount" defaultValue={invoice.total} required step="0.001" disabled></input>
                             </div>
                             <div class="form-group">
                                 <label >Previous Month Dues</label>
                                 <input type="number" class="form-control"  placeholder="enter total Amount" name="INVC_PREVIOUS_DUES" id="INVC_PREVIOUS_DUES" defaultValue={invoice.previous_dues} required step="0.001" disabled></input>
                             </div>
                             
                             </div>
                         </div>
                         </li>
                     </ul>
                    ))}
                   
                    <Row><h4>Device Details</h4> 
                    {/* <a onClick={this.add_device} style={{marginTop: '9px', marginLeft: '2%', color: 'blue', cursor: 'pointer'}}>+add device</a> */}
                    </Row>
                    {this.state.devices.map((device) => (
                        <div>
                        <Row>
                        <Col>
                                <label for="exampleInputPassword1">Device ID</label>
                                <input type="text" class="form-control"  placeholder="enter device ID" name="did1" id={"did"+device.id} defaultValue={device.device.id} disabled required ></input>
                            </Col>
                            <Col>
                                <label for="exampleInputPassword1">Device Description</label>
                                <input type="text" class="form-control"  placeholder="enter description" name="desc1" id={"desc"+device.id} defaultValue={device.desc} required></input>
                            </Col>
                            
                        </Row>
                        <Row>
                        <Col>
                                <label for="exampleInputPassword1">Device Power generation</label> 
                                <input type="number" class="form-control"  placeholder="enter power generated" name="pgen1" id={"pgen"+device.id} defaultValue={device.production_generated} required step="0.001" disabled></input>
                            </Col>
                            <Col>
                                <label for="exampleInputPassword1">Device Amount</label>
                                <input type="number" class="form-control"  placeholder="enter power generated" name="amn1" id={"amn"+device.id} defaultValue={device.amount} required step="0.001" disabled></input>
                            </Col>
                            
                        </Row>
                        <hr/>
                        </div>
                        
                    ))}
                    
                    <Button variant="secondary" onClick={this.handleClose}>
                        Close
                    </Button>
                    {this.state.edit_only ? (
                    <Button type="submit" variant="primary" style={{marginLeft:'10px'}}>
                        Request Approval
                    </Button>): (
                    <Button type="submit" variant="primary" style={{marginLeft:'10px'}}>
                        Approve
                    </Button>)}
                    
                    
                    </form>
                    </Modal.Body>
                    <Modal.Footer>
                    
                    </Modal.Footer>
                </Modal>
                <Modal
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    show={this.state.show_create}
                >
                    <Modal.Header>
                    <Modal.Title>Create Invoice</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
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
                                    <option selected> -- select an option -- </option>
                                    {this.state.customerProject.map((project) => 
                                               <option key={project.id } value={project.id}>   
                                                      {  project.name}
                                               </option>
                                              )}
                                    </select>
                                    
                                </div>
                            </Col>
                        </Row>
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
                        

                        
                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={this.handleCloseCreate}>
                        Close
                    </Button>
                    <Button variant="btn btn-primary" onClick={this.create_invoice}>
                        Create
                    </Button>
                    </Modal.Footer>
                </Modal>
                </>
                </Container>
            </span>
          </div>
        );
    }
}
export default Billed_Invoice;