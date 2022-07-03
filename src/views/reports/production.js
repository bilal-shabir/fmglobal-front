import React from "react";
import {URL2,DKEY} from '../../constants';
import {Container, Row, Col, Card} from "shards-react";
import { Modal, Button } from "react-bootstrap";
import L4 from "../../components/components-overview/progressProductionReport.js";
import PageTitle from "../../components/common/PageTitle";
import DataTable from "react-data-table-component";
import ReactExport from "react-data-export";
import '../../assets/style.css';
import L3 from "../../components/components-overview/progress.js";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;


class ProductionReport extends React.Component{

  constructor(props) {
    super(props);
    var date = new Date(); 
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1); 
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0); 


    this.state ={
      includeInvc: false,
      show_loader: false,
      show_loader2: false,
      productionData: null,
      customer_id: 0,
      project_id: 0,
      customers: [],
      customerProject: [],
      selectedCustomer: null,
      selectedProject: null,
      show_data: false,
      customStyles : {
        headCells: {
            style: {
                backgroundColor: '#BDAC37',
                color: 'white'
            }
        }
    },
    columns: [
      {
          name: "Device",
          selector: "device_sn",
          sortable: true,
        },
        {
          name: "Production Date",
          selector: (row) => this.abc2(row.production_date),
          sortable: true,
          width:'150px'
      },
      {
          name: "Production Generated (kWh)",
          selector: (row) => (parseFloat(row.production_generated)/1000).toFixed(5),
          sortable: true,
        },
      {
          name: "Device Description",
          selector: "device_desc",
          sortable: true,
      },
      {
          name: "Customer", 
          selector: "customer",
          sortable: true,
      },
      {
          name: "Invoice Number",
          selector: "invc_number",
          sortable: true,
      },
      {
        name: "Invoice Status",
        selector: "invc_status",
        sortable: true,
      }
    ],
    firstDay: firstDay.getFullYear()+'-'+this.addZero(firstDay.getMonth()+1)+'-'+this.addZero(firstDay.getDate()),
    lastDay: lastDay.getFullYear()+'-'+this.addZero(lastDay.getMonth()+1)+'-'+this.addZero(lastDay.getDate())
    }
    // console.log(this.state.firstDay)
  }
  async componentDidMount(){
    


    const access_token = localStorage.getItem('access_token');
    await fetch(URL2+'auth-customer-role/getCustomer', {
      headers : { 
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'access_token' : access_token
      },
      credentials: 'include'
      }).then(response => response.json())
      .then(response => {
        if (response.statusCode == 404 || response.status==404 || response.statusCode == 500 || response.statusCode == 403 || response.statusCode == 400) {
          throw Error(response.statusText)        
      }
      else{
            // console.log(response)
          this.setState({
              customers: response,
              
          })
          
      }}).catch((e) => {
        // console.log(e)  
        toast.error('Error: Customers not fetched', {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            });
      });

      // await fetch(URL2+'project/getProjectsbyCompany/2', {
      //   headers : { 
      //   'Content-Type': 'application/json',
      //   'Accept': 'application/json',
      //   'access_token' : access_token
      //   },
      //   credentials: 'include'
      //   }).then(response => response.json())
      //   .then(response => {
      //     console.log("here")
      //         console.log(response)
      //       this.setState({
      //         customerProject: response,
                
      //       })
            
      //   })

    
  }
  handleCustomerNameChange = (event) =>{
    // console.log(event.target.value);
    this.setState({
        customer_id: event.target.value,
    })

//console.log(" 555", event.target.key)

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
        if (response.statusCode == 404 || response.status==404 || response.statusCode == 500 || response.statusCode == 403 || response.statusCode == 400) {
          throw Error(response.statusText)        
      }
      else{
            const selected = this.state.customers.find(customer =>
                customer.id == this.state.customer_id)
            const selectedcustomer = selected.customer
            this.setState({
                customerProject : response,
                // selectedCustomer: selectedcustomer
            })
        }})
        .catch((e) => {
          // console.log(e)  
          toast.error('Error: Projects not fetched', {
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

handleProjectNameChange=(event)=>{
  this.setState({
      project_id: event.target.value,
      
  })
  
      //   console.log(response)
        const selectedProject = this.state.customerProject.find(project =>
          project.id == this.state.project_id)
          this.setState({
              
              selectedProject: selectedProject
     
          })
}
billingdataclose =() => {
  this.setState({ 
      show_data: false
  })
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
  flattenObj = (ob) => {
 
    // The object which contains the
    // final result
    let result = {};
 
    // loop through the object "ob"
    for (const i in ob) {
 
        // We check the type of the i using
        // typeof() function and recursively
        // call the function again
        if ((typeof ob[i]) === 'object' && !Array.isArray(ob[i])) {
            const temp = this.flattenObj(ob[i]);
            for (const j in temp) {
 
                // Store temp in result
                result[i + '_' + j] = temp[j];
            }
        }
 
        // Else store ob[i] in result directly
        else {
            result[i] = ob[i];
        }
    }
    return result;
};
generate_report = ()=>{
  // alert(document.getElementById("sdate").value)
  
  const start_date = document.getElementById("sdate").value
//  alert(start_date)
  const end_date = document.getElementById("edate").value
  // alert(end_date)
  // console.log(typeof end_date)
  const access_token = localStorage.getItem('access_token');
  const company = localStorage.getItem('company');
   fetch(URL2+'invoice/productionReport',{
    headers : { 
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'access_token' : access_token
    },
    credentials: 'include',
    method: 'PATCH',
    mode: 'cors',
    body: JSON.stringify({
      "customer_id": this.state.customer_id,
      "company_id": company,
      "project_id":this.state.project_id,
      "start_date": `${start_date}`,
      "end_date": `${end_date}`,
      "invoice_number_flag":this.state.includeInvc
    })
  }).then(response => response.json())
  .then((json)=>{
    if (json.statusCode == 404 || json.status==404 || json.statusCode == 500 || json.statusCode == 403 || json.statusCode == 400 || json.statusCode == 40) {
      throw Error(json.statusText)        
  }
  else{
    if(this.state.includeInvc){
      this.setState({ 
        show_loader: true
    })
    }else{
      this.setState({ 
        show_loader2: true
    })
    }
    var merged = [].concat.apply([], json);
    for (let index = 0; index < merged.length; index++) {
      const ob = merged[index]
      merged[index] = this.flattenObj(ob)
        
    }
    this.setState({
      show_loader2:false,
      show_loader: false,
      show_data:true,
      productionData: merged
    })
    // console.log(json)
    // console.log(merged)
  }}).catch((e) => {
    // console.log(e)  
    toast.error('Error: Production Report not generated', {
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
reset =() =>{
  this.setState({
    customer_id: 0,
    project_id: 0
  })
  document.getElementById("cust").selectedIndex = 0;
  document.getElementById("proj").selectedIndex = 0;
}
includeInvoiceNumber = () =>{
  this.setState({includeInvc : !this.state.includeInvc});
}

  render (){
      return (
        <Container fluid className="main-content-container px-4">
          <Row noGutters className="page-header py-4">
            <PageTitle title={`Daily Production Report`}  className="text-sm-left" /> 
            
        </Row>
          <Row style={{marginTop:'30px'}}>
            <Col lg="4" md="12" sm="12">
            <span>
            <Card small className="mb-4 p-3" >
                  <Row>
                  <Col>
                      <div class="form-group">
                          <label for="exampleInputPassword1">Customer</label>
                          {/* <input type="text" class="form-control"  placeholder="Enter customer ID" name="cust-ID" id="cust-ID" ></input> */}
                          <select class="form-control" name="cust-ID" id="cust" onChange={this.handleCustomerNameChange}>
                          <option disabled selected value={0}> -- select an option -- </option>
                          {this.state.customers.map((customer) => 
                                      <option key={customer.id } value={customer.id}>   
                                            {  customer.name}
                                      </option>
                                    )}
                          </select>
                      </div>
                  </Col>
                  
                  <Col>
                      <div class="form-group">
                          <label for="exampleInputPassword1">Project</label>
                          <select class="form-control" name="proj-ID" id="proj" onChange={this.handleProjectNameChange}>
                          <option selected value={0}> -- select an option -- </option>
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
                          <label for="exampleInputPassword1">Start Date</label>
                          <input type="date" class="form-control"  placeholder="Enter start date" name="INV-start-date" id="sdate"required defaultValue={this.state.firstDay}></input>
                      </div>
                  </Col>
                  <Col>
                      <div class="form-group">
                          <label for="exampleInputPassword1">End Date</label>
                          <input type="date" class="form-control"  placeholder="Enter start date" name="INV-end-date" id="edate"required defaultValue={this.state.lastDay}></input>
                      </div>
                  </Col>
              </Row>
              <Row>
              
              <Col>
                <input type="checkbox" id="scales" name="scales" onClick={this.includeInvoiceNumber} />
                <label for="scales" style={{marginLeft:'10px'}}>Include Invoice Number</label>
              </Col>
              
              </Row>
              <div style={{marginTop:'20px'}}>
              <Button variant="secondary" onClick={this.reset}>
                  Reset
              </Button>
              <Button variant="btn btn-primary" onClick={this.generate_report}  style={{backgroundColor:'#004769', borderColor:'#004769', marginLeft:'10px'}}>
                  Generate Report
              </Button>
              </div>
              </Card>
              </span>
            </Col>
            <Col lg="4" md="12" sm="12">
            </Col>
            <Col lg="4" md="12" sm="12">
            </Col>
          </Row>
          
          <div>
          <Modal
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    show={this.state.show_data}
                    
                >
                    <Modal.Header>
                    <Modal.Title>Production Report</Modal.Title>
                    <span>
                    <ExcelFile filename="Production Report" element={(<Button style={{backgroundColor:'#004769', borderColor:'#004769'}}> Download Report </Button>)}>
                        <ExcelSheet data={this.state.productionData} name="Data">
                            <ExcelColumn label="Customer" value="customer"/>
                            <ExcelColumn label="Project" value="project"/>
                            <ExcelColumn label="Device" value="device_sn"/>
                            <ExcelColumn label="Device Description" value="device_desc"/>
                            <ExcelColumn label="Production Date" value={row => this.abc2(row.production_date)}/>
                            <ExcelColumn label="Production Generated (kWh)"  value={row => +(parseFloat(row.production_generated)/1000).toFixed(5)}/>
                            <ExcelColumn label="Invoice Number" value={row =>row.invc_number}/>
                            <ExcelColumn label="Invoice Status"  value={row => row.invc_status}/>
                        </ExcelSheet>
                    </ExcelFile>
                    <Button variant="secondary" onClick={this.billingdataclose} style={{marginLeft:'5px'}}>
                        Close
                    </Button>
                    </span>
                    </Modal.Header>
                    <Modal.Body>
                        <DataTable
                            columns={this.state.columns}
                            data={this.state.productionData}
                            highlightOnHover={true}
                            style={{overflow:'wrap'}}
                            sortServer
                            pagination
                            customStyles= {this.state.customStyles}
                        />
                    </Modal.Body>
                    <Modal.Footer>
                    
                    </Modal.Footer>
                </Modal>
                <Modal
                    size="md"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    show={this.state.show_loader}
                    id="loader"
                >
                    <Modal.Body>
                        <div style={{textAlign:'center',marginTop:'30px'}}  id="not_generated"><h4>Generating Report</h4></div>
                        <div style={{textAlign:'center',marginTop:'30px'}} id="generated"><h4 style={{color:'darkgreen'}}>Invoice Generated</h4></div>
                        <L4></L4>
                    </Modal.Body>
                </Modal>
                <Modal
                    size="md"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    show={this.state.show_loader2}
                    id="loader"
                >
                    <Modal.Body>
                        <div style={{textAlign:'center',marginTop:'30px'}}  id="not_generated"><h4>Generating Report</h4></div>
                        <div style={{textAlign:'center',marginTop:'30px'}} id="generated"><h4 style={{color:'darkgreen'}}>Invoice Generated</h4></div>
                        <L3></L3>
                    </Modal.Body>
                </Modal>
          </div>
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
       
      </Container>

      );
  }

};

export default ProductionReport;
