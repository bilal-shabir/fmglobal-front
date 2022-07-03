import React from "react";
import { Col, Container, Row,Card,CardBody } from "shards-react";

import PageTitle from "../../components/common/PageTitle";
import {URL2, DKEY} from '../../constants';
import Form from "react-bootstrap/Form";
import Cookies from "universal-cookie";
import { ItemDescription } from "semantic-ui-react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Can } from "@casl/react";
import setPermissions from "../defineAbility";


class PR_create extends React.Component{
    constructor(props){
        super(props);
        const userIs_logged=localStorage.getItem('is_logged');
    //   const userEmail=localStorage.getItem('Email');
    //   const userToken=localStorage.getItem('Password');
      if(userIs_logged != 1){
        this.props.history.push("/login");
      }
      var items = [0]
        this.state = {
            ability: null,
            items: items,
            selectedFile: null
          };
        this.handleSubmit = this.handleSubmit.bind(this);
        // this.add_device = this.add_device.bind(this);
        // this.removedevice = this.removedevice.bind(this);
        this.handleCustomerNameChange = this.handleCustomerNameChange.bind(this);
    }

    async componentDidMount(){
        require('../../utils').checkpermision('Create')
        await fetch(URL2+'getPermissions',{
            headers : { 
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              // 'access_token' : json.access_token
             },
             credentials: 'include'
          }).then(response => response.json())
          .then((json)=>{
            // console.log("permissions", json)
            const ability = setPermissions(json);
            console.log("permissions",ability)
            this.setState({
              ability:ability
            })
          })
    }
    onFileChange = event => { 
        // Update the state 
        // console.log(event.target.files[0])
        this.setState({ selectedFile: event.target.files[0] }); 
      }; 
    
//   


    async handleSubmit(e){
        
        e. preventDefault();
        document.getElementById("sub").disabled = true;
        const data = new FormData();
        data.append('company_name' , document.getElementById("Company_Name").value)
        data.append('project_name' , document.getElementById("Project_Name").value)
        data.append('requestor_location' , document.getElementById("Requestor_Location").value)
        data.append('department_or_unit' , document.getElementById("DepartmentOrUnit").value)
        data.append('delivery_address' , document.getElementById("Delivery_Address").value)
        data.append('contact_number' , document.getElementById("Contact_Number").value)
        data.append('requested_by' , document.getElementById("Requested_By").value)
        data.append('requested_by_position' , document.getElementById("Requested_By_Position").value)
        data.append('delivery_date' , document.getElementById("Delivery_Date").value)
        data.append('lead_time' , document.getElementById("Lead_Time").value)
        data.append('location' , document.getElementById("Location").value)
        data.append('comments' , document.getElementById("Comments").value)
        data.append('status' , "New")
        const filedata = document.getElementById('myfile').files[0]
        // alert(filedata.name.split('.').pop())
        // return
        // filedata.name
        if(filedata){
            if(filedata.name.split('.').pop() !== 'pdf' && filedata.name.split('.').pop() !=='PDF'){
                alert('Wrong file type attached, only pdf allowed')
                document.getElementById("sub").disabled = false;
                return
            }
        }
        
        var object =
            {
                "company_name": document.getElementById("Company_Name").value,
                "Project_Name": document.getElementById("Project_Name").value,
                "Requestor_Location": document.getElementById("Requestor_Location").value,
                "department_or_unit": document.getElementById("DepartmentOrUnit").value,
                "delivery_address": document.getElementById("Delivery_Address").value,
                "contact_number": document.getElementById("Contact_Number").value,
                "requested_by": document.getElementById("Requested_By").value,
                "requested_by_position": document.getElementById("Requested_By_Position").value,
                "delivery_date": document.getElementById("Delivery_Date").value,
                "lead_time": document.getElementById("Lead_Time").value,
                "location": document.getElementById("Location").value,
                "comments": document.getElementById("Comments").value,
                "status":"New",
                // "purchase_items":[]
            }

        const Values= []
        for (let index = 0; index < this.state.items.length; index++) {
            var items ={
                "unit": document.getElementById("Unit"+index).value,
                "quantity": document.getElementById("Quantity"+index).value,
                "description": document.getElementById("Description"+index).value,
                "available": document.getElementById("Available"+index).value,
                "need_to_procure": document.getElementById("Procure"+index).value,
            }
            Values.push(items)

        }
        // console.log(JSON.stringify(Values))
        data.append('purchase_items' , JSON.stringify(Values) )
        data.append('file', filedata)
         //object.push(items)
         var object2 = {};
        data.forEach(function(value, key){
                object2[key] = value;
            });

        // console.log(object2)
        
            
        // console.log(object)
        // console.log("===================================================================")
        const access_token = localStorage.getItem('access_token');
         fetch(URL2+'purchase-requisition/addPR', {
            headers : { 
                // 'Content-Type': 'multipart/form-data; boundary=<calculated when request is sent>',
                // 'Accept': 'application/json',
                'access_token' : access_token,
                // 'type': 'formData'
               },
               credentials: 'include',
              method: 'POST',
    
              body: data
            })
            .then(response => response.json())
               .then((json) => {
                if (json.statusCode == 404 || json.statusCode == 401 || json.statusCode == 500 || json.statusCode == 403 || json.statusCode == 400) { 
                    throw Error(json.statusText)        
                }
                else{

                
                // alert(json.id)
                if(json.project_name){
                    toast.success('The MR has been created', {
                        position: "top-center",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: false,
                        draggable: true,
                        progress: undefined,
                        });
                    window.location.reload();
                }
                else{
                    toast.error('Something went wrong, MR not created', {
                        position: "top-center",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: false,
                        draggable: true,
                        progress: undefined,
                        });
                    document.getElementById("sub").disabled = false;
                }
                // this.props.history.push('/PR')
                }
                })
                .catch((e) => {
                    // console.log(e)  
                    toast.error('Something went wrong, MR not created', {
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

    handleCustomerNameChange(event){
        // console.log(event.target.value);
        var items =[]

        for (let index = 0; index < event.target.value; index++) {
            items[index] = index
            
        }
        this.setState({
            items: items
        })
     
    }


    async UploadFile() {
        let formData = new FormData();
        formData.append('photo', this.file, this.file.name);
        try {
          const response = await fetch('PrUpload/upload', {
            method: 'POST',
            body: formData,
          });
          if (!response.ok) {
            throw new Error(response.statusText);
          }
        //   console.log(response);
        } catch (err) {
        //   console.log(err);
        }
      }

   
    onFileChange(fileChangeEvent) {
        this.file = fileChangeEvent.target.files[0];
      }

        uploadPhoto = (fileChangeEvent) => {
        // Get a reference to the file that has just been added to the input
        const photo = fileChangeEvent.target.files[0];
        // Create a form data object using the FormData API
        let formData = new FormData();
        // Add the file that was just added to the form data
        formData.append('photo', photo, photo.name);
        // POST formData to server using Fetch API
      };



    render(){
        return(
            
            <Container fluid className="main-content-container px-4">
                <Row noGutters className="page-header py-4">
                     <PageTitle title={"Create Material Requisition"}   className="text-sm-left mb-3" />
                </Row>
                {/* <Row noGutters className="page-header py-4">
                   <PageTitle title={"Billing Dashboard"}   className="text-sm-left mb-3" />
                </Row> */}
               
                <Form onSubmit={this.handleSubmit} style={{margin:'3%'}}> 
                
                <Row>
                    <Col >
                    <h4>Material Requisition Details</h4>
                    <Card>
                        <CardBody>
                        <Row>
                            <Col>
                                <div class="form-group">
                                    <label for="exampleInputPassword1">Company</label>
                                    {/* <input type="text" class="form-control"  placeholder="Enter customer ID" name="cust-ID" id="cust-ID" ></input> */}
                                    <select class="form-control" name="Company_Name" id="Company_Name" required>
                                    <option disabled selected  value=''> -- select a comapny -- </option>
                                    
                                               <option key="1" value="Pavilion Renewables">   
                                                     Pavilion Renewables
                                               </option>
                                               <option key="2" value="Pavilion Energy">   
                                                     Pavilion Energy
                                               </option>
                                               <option key="3" value="Pavilion Water">   
                                                     Pavilion Water
                                               </option> 
                                               <option key="4" value="Pavilion Agriculture">   
                                                     Pavilion Agriculture
                                               </option> 
                                               <option key="5" value="Pavilion Karbon">   
                                                     Pavilion Karbon
                                               </option> 

                                    </select>
                                </div>
                            </Col>
                            
                            <Col>
                            <div class="form-group">
                                <label for="exampleInputPassword1">Project Name</label>
                                <select class="form-control" name="Project_Name" id="Project_Name" required>
                                    <option disabled selected value=''> -- Select a Project -- </option>
                                    
                                               <option key="1" value="AL AREEN HOTELS W.L.L-AA - HVS - ENERGY-2021-13-19">   
                                               AL AREEN HOTELS W.L.L-AA - HVS - ENERGY
                                               </option>
                                               <option key="2" value="AL AREEN HOTELS W.L.L-AA - RO - ENERGY-2021-13-20">   
                                               AL AREEN HOTELS W.L.L-AA - RO - ENERGY
                                               </option>
                                               <option key="3" value="AL AREEN LEISURE AND TOURISM CO THE LOST PARADISE OF DILMUN W.L.L-AA - LPOD - ENERGY-2021-14-21">   
                                               AL AREEN LEISURE AND TOURISM CO THE LOST PARADISE OF DILMUN
                                               </option> 
                                               <option key="4" value="AL WASM W.L.L-BOTTLED WATER-2021-6-6">   
                                               AL WASM W.L.L-BOTTLED WATER
                                               </option> 
                                               <option key="5" value="BAHRAIN ALUMINIUM EXTRUSION CO. (BALEXCO) B.S.C.-BLX - ENERGY-2021-10-16">   
                                               BAHRAIN ALUMINIUM EXTRUSION CO. (BALEXCO) B.S.C.-BLX - ENERGY
                                               </option> 
                                               <option key="6" value="BAHRAIN CITY CENTER MALL-BCCM - ENEGRY-2021-2-2">   
                                               BAHRAIN CITY CENTER MALL-BCCM - ENEGRY
                                               </option> 
                                               <option key="7" value="BAHRAIN REAL ESTATE INVESTMENT (EDAMAH) B.S.C.-EDM - ENERGY-2021-16-23">   
                                               BAHRAIN REAL ESTATE INVESTMENT (EDAMAH) B.S.C.-EDM - ENERGY
                                               </option> 
                                               <option key="8" value="BEIT AL QURAN MUSEUM-BAQ - ENERGY-2021-5-5">   
                                               BEIT AL QURAN MUSEUM-BAQ - ENERGY
                                               </option> 
                                               <option key="9" value="FALCON CEMENT COMPANY B.S.C. (C)-FC - ENERGY-2021-11-17">   
                                               FALCON CEMENT COMPANY B.S.C. (C)-FC - ENERGY
                                               </option> 
                                               <option key="10" value="PAVILION ENERGY W.L.L-WAREHOUSE-2021-9-9">   
                                               PAVILION ENERGY W.L.L-WAREHOUSE
                                               </option> 
                                               <option key="11" value="PAVILION RENEWABLES W.L.L-LABORATORY-2021-8-15">   
                                               PAVILION RENEWABLES W.L.L-LABORATORY
                                               </option> 
                                               <option key="12" value="PAVILION RENEWABLES W.L.L-MAINTENANCE -2021-8-11">   
                                               PAVILION RENEWABLES W.L.L-MAINTENANCE
                                               </option> 
                                               <option key="13" value="PAVILION RENEWABLES W.L.L-MANUFACTURING-2021-8-14">   
                                               PAVILION RENEWABLES W.L.L-MANUFACTURING
                                               </option> 
                                               <option key="14" value="PAVILION RENEWABLES W.L.L-OFFICE BWTC-2021-8-12">   
                                               PAVILION RENEWABLES W.L.L-OFFICE BWTC
                                               </option> 
                                               <option key="15" value="PAVILION RENEWABLES W.L.L-OFFICE HIDD-2021-8-13">   
                                               PAVILION RENEWABLES W.L.L-OFFICE HIDD
                                               </option> 
                                               <option key="16" value="PAVILION RENEWABLES W.L.L-RnD (RESEARCH AND DEVELOPMENT)-2021-8-10">   
                                               PAVILION RENEWABLES W.L.L-RnD (RESEARCH AND DEVELOPMENT)
                                               </option> 
                                               <option key="17" value="PAVILION RENEWABLES W.L.L-SALMAN CITY-2021-8-8">   
                                               PAVILION RENEWABLES W.L.L-SALMAN CITY
                                               </option> 
                                               <option key="18" value="RECKITT BENCKISER BAHRAIN W.L.L-RB - ENERGY-2021-12-18">   
                                               RECKITT BENCKISER BAHRAIN W.L.L-RB - ENERGY
                                               </option> 
                                               <option key="19" value="RECKITT BENCKISER BAHRAIN W.L.L-RB - WATER-2021-12-22">   
                                               RECKITT BENCKISER BAHRAIN W.L.L-RB - WATER
                                               </option> 
                                               <option key="20" value="THALIYA WATER TREATMENT W.L.L-SALT RECOVERY -2021-7-7">   
                                               THALIYA WATER TREATMENT W.L.L-SALT RECOVERY
                                               </option> 
                                               <option key="21" value="THE LE MERIDIEN HOTEL BAHRAIN-LMH - ENERGY-2021-3-3">   
                                               THE LE MERIDIEN HOTEL BAHRAIN-LMH - energy
                                               </option> 
                                               <option key="22" value="THE WESTIN HOTEL BAHRAIN-WH - ENERGY-2021-4-4">   
                                               THE WESTIN HOTEL BAHRAIN-WH - ENERGY
                                               </option> 
                                               <option key="23" value="Engie Indian Community Project -Water - 2022-33-37">   
                                               Engie Indian Community - Water
                                               </option> 
                                               <option key="24" value="Um al Nassan - Water System - 2022-37-41">   
                                               Um al Nassan - Water
                                               </option> 
                                               <option key="25" value="Pavilion Energy - Pavilion Energy Operations - Internal">   
                                               Pavilion Energy - Pavilion Energy Operations - Internal
                                               </option> 
                                               <option key="26" value="Pavilion Water - Pavilion Water Operations - Internal">   
                                               Pavilion Water - Pavilion Water Operations - Internal
                                               </option>
						                        <option key="27" value="Al Dur - Water Treatment Plant">   
                                                    Al Dur - Water Treatment Plant
                                               </option>
                                                <option key="27" value="Al Dur - Pyrolysis Plant">   
                                                    Al Dur - Pyrolysis Plant
                                               </option> 

                                    </select>
                            </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                            <div class="form-group">
                                <label for="exampleInputPassword1">Requestor Location</label>
                                <select class="form-control" name="Requestor_Location" id="Requestor_Location" required>
                                    <option disabled selected value=''> -- Requestor Location -- </option>
                                    
                                               <option key="1" value="Warehouse">   
                                                     Warehouse
                                               </option>
                                               <option key="2" value="Bahrain World Trade Center">   
                                                     Bahrain World Trade Center
                                               </option>
                                               <option key="3" value="Project Site">   
                                                     Project Site
                                               </option> 
                                               <option key="4" value="GB Corp">   
                                                     GB Corp
                                               </option>
                                               <option key="5" value="Al Dur - Water Treatment Plant">   
                                                        Al Dur - Water Treatment Plant 
                                               </option>
                                               <option key="6" value="Al Dur - Pyrolysis Plant">   
                                                    Al Dur - Pyrolysis Plant
                                               </option>
                                    </select>
                        </div>
                            </Col>
                            <Col>
                            <div class="form-group">
                            <label for="exampleInputEmail1">Department/Unit</label>
                            <select class="form-control" name="DepartmentOrUnit" id="DepartmentOrUnit" required>
                                    <option disabled selected value=''> -- Departments -- </option>
                                    
                                               <option key="1" value="IT">   
                                                     IT
                                               </option>
                                               <option key="2" value="Finance">   
                                                     Finance
                                               </option>
                                               <option key="3" value="Sales">   
                                                     Sales
                                               </option> 
                                               <option key="3" value="HR">   
                                                     HR
                                               </option> 
                                               <option key="4" value="procurement">   
                                                 Procurement
                                               </option> 
                                               <option key="4" value="Project Managment">   
                                                 Project Managment
                                               </option> 
                                               <option key="5" value="Lab">   
                                                 Lab
                                               </option> 
                                               <option key="6" value="Reasearch and Development">   
                                                 Reasearch and Development
                                               </option> 
                                               <option key="6" value="manufacturing">   
                                               Manufacturing
                                               </option> 
                                    </select>
                        </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                            <div class="form-group">
                            <label for="exampleInputPassword1">Deliver To</label>
                            <select class="form-control" name="Delivery_Address" id="Delivery_Address" required>
                                    <option disabled selected value=''> -- Deliver To -- </option>
                                    
                                               <option key="1" value="Warehouse">   
                                                     Warehouse
                                               </option>
                                               <option key="2" value="Bahrain World Trade Center">   
                                                     Bahrain World Trade Center
                                               </option>
                                               <option key="3" value="Project Site">   
                                                     Project Site
                                               </option>
                                               <option key="4" value="GB Corp">   
                                                     GB Corp
                                               </option>
                                               <option key="5" value="Al Dur - Water Treatment Plant">   
                                                         Al Dur - Water Treatment Plant 
                                                </option>
                                                <option key="6" value="Al Dur - Pyrolysis Plant">   
                                                         Al Dur - Pyrolysis Plant
                                                </option>
                                    </select>
                        </div>
                            </Col>
                            <Col>
                            <div class="form-group">
                            <label for="exampleInputPassword1">Phone Number</label>
                            <input type="text" class="form-control"  placeholder="Enter Phone Number" name="Contact_Number" id="Contact_Number" required></input>
                        </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <div class="form-group">
                                    <label for="exampleInputPassword1">Requested By Name</label>
                                    <select class="form-control" name="Requested_By" id="Requested_By" required>
                                    <option disabled required selected value=''> -- Requested By -- </option>
                                    
                                               <option key="1" value="Ali Akbar">   
                                               Ali Akbar
                                               </option>
                                               <option key="2" value="Bradley Worral">   
                                               Bradley Worral
                                               </option>
                                               <option key="3" value="Bruce Buchan">   
                                               Bruce Buchan
                                               </option> 
                                               <option key="4" value="Dominik Braun">   
                                               Dominik Braun
                                               </option> 
                                               <option key="5" value="Donovan de Wet">   
                                               Donovan de Wet
                                               </option> 
                                               <option key="6" value="Eqbal Alzoghbi">   
                                               Eqbal Alzoghbi
                                               </option> 
                                               <option key="7" value="Jaco Roos">   
                                               Jaco Roos
                                               </option> 
                                               <option key="8" value="Juanice Pienaar">   
                                               Juanice Pienaar
                                               </option> 
                                               <option key="9" value="Linda Scholtemeijer">   
                                               Linda Scholtemeijer
                                               </option> 
                                               <option key="10" value="Marius Nortje">   
                                               Marius Nortje
                                               </option> 
                                               <option key="11" value="Muhammad Aslam">   
                                               Muhammad Aslam
                                               </option> 
                                               <option key="12" value="Philip Roos">   
                                               Philip Roos
                                               </option> 
                                               <option key="13" value="Pieter Scholtemeijer">   
                                               Pieter Scholtemeijer
                                               </option> 
                                               <option key="14" value="Quinton Green">   
                                               Quinton Green
                                               </option> 
                                               <option key="15" value="Robin Dufour">   
                                               Robin Dufour
                                               </option> 
                                               <option key="16" value="Ruby Sawhney">   
                                               Ruby Sawhney
                                               </option> 
                                               <option key="17" value="Sreehari">   
                                               Sreehari
                                               </option> 
                                               <option key="18" value="Stephen Fitzpatrick">   
                                               Stephen Fitzpatrick
                                               </option> 
                                               <option key="19" value="Thajbeh Saif">   
                                               Thajbeh Saif
                                               </option> 
                                               <option key="20" value="Victor de Kock">   
                                               Victor de Kock
                                               </option> 
                                               <option key="21" value="Waqas Bashir">   
                                               Waqas Bashir
                                               </option> 
                                               <option key="22" value="Sayed Jaafer Hashem">   
                                               Sayed Jaafer Hashem
                                               </option> 
                                               <option key="23" value="Shane Reynolds">   
                                               Shane Reynolds
                                               </option> 
                                               <option key="24" value="Mario Struwig">   
                                               Mario Struwig
                                               </option>
                                               <option key="25" value="Tryan-Lee Cronning">   
                                               Tryan-Lee Cronning
                                               </option> 
                                               <option key="26" value="Ahmed A Jalil">   
                                               Ahmed A Jalil
                                               </option> 
                                               <option key="27" value="Mohammed Naveed">   
                                               Mohammed Naveed
                                               </option>
				
                                    </select>

                                </div>
                            </Col>
                            <Col>
                                <div class="form-group">
                                    <label for="exampleInputPassword1">Requested By Position</label>
                                    <select class="form-control" name="Requested_By_Position" id="Requested_By_Position" required>
                                    <option disabled required selected value=''> -- Requested By Position -- </option>
                                    
                                               <option key="1" value="Solar Lead">   
                                               Solar Lead
                                               </option>
                                               <option key="2" value="Head of IT">   
                                               Head of IT
                                               </option>
                                               <option key="3" value="Head of Operation (Water)">   
                                               Head of Operation (Water)
                                               </option> 
                                               <option key="4" value="Carpentry Workshop Lead">   
                                               Carpentry Workshop Lead
                                               </option> 
                                               <option key="5" value="Head of Design">   
                                               Head of Design
                                               </option> 
                                               <option key="6" value="Digital Marketing Executive">   
                                               Digital Marketing Executive
                                               </option> 
                                               <option key="7" value="Site Manager">   
                                               Site Manager
                                               </option> 
                                               <option key="8" value="HR Consultant">   
                                               HR Consultant
                                               </option> 
                                               <option key="9" value="Head of Operation (Small Projects)">   
                                               Head of Operation (Small Projects)
                                               </option> 
                                               <option key="10" value="Lab">   
                                               Lab
                                               </option> 
                                               <option key="11" value="Warehouse Manager">   
                                               Warehouse Manager
                                               </option> 
                                               <option key="12" value="Lead Horticulturalist">   
                                               Lead Horticulturalist
                                               </option> 
                                               <option key="13" value="Mechanical Design">   
                                               Mechanical Design
                                               </option> 
                                               <option key="14" value="RnD Manager">   
                                               RnD Manager
                                               </option> 
                                               <option key="15" value="Commercial and Marketing Director">   
                                               Commercial and Marketing Director
                                               </option> 
                                               <option key="16" value="Information Technology Manager">   
                                               Information Technology Manager
                                               </option> 
                                               <option key="17" value="Head Of Operation (Major Project)">   
                                               Head Of Operation (Major Project)
                                               </option> 
                                               <option key="18" value="Office Manager">   
                                               Office Manager
                                               </option> 
                                               <option key="19" value="Resource Manager">   
                                               Resource Manager
                                               </option> 
                                               <option key="20" value="Senior Procurement Manager">   
                                               Senior Procurement Manager
                                               </option> 
                                               <option key="21" value="Lead Electrical Engineer">   
                                               Lead Electrical Engineer
                                               </option> 
                                               <option key="22" value="EHS Manager">   
                                               EHS Manager
                                               </option> 
                                               <option key="23" value="Laboratory Manager">   
                                               Laboratory Manager
                                               </option> 
                                    </select>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                            <div class="form-group">
                                <label for="exampleInputPassword1">Delivery Date</label>
                                <input type="date" class="form-control"  placeholder="Select delivery date" name="Delivery_Date" id="Delivery_Date"required ></input>
                            </div>
                            </Col>
                            <Col>
                                <div class="form-group">
                                    <label for="exampleInputPassword1">Lead Time (Days)</label>
                                    <input type="number" class="form-control"  placeholder="Enter Lead Time" name="Lead_Time" id="Lead_Time"  required step="1"></input>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <div class="form-group">
                                    <label for="exampleInputPassword1">Use Location</label>
                                    <input type="text" class="form-control"  placeholder="Use Location" name="Location" id="Location" required></input>
                                </div>
                            </Col>
                            <Col>
                                <div class="form-group">
                                <label for="exampleInputPassword1">Comment</label>
                                <textarea class="form-control"  placeholder="Comment............." name="Comments" id="Comments" ></textarea>
                                </div>
                            </Col>
                            
                        </Row>

                        <Row>
                            <Col>
                            <div class="form-group">
                                    <label for="exampleInputPassword1">Select Attachment - optional</label>
                                    <label for="exampleInputPassword1" style={{fontSize:'9px', color:'grey', marginLeft:'3px'}}>Only pdf files accepted</label>
                                    {/* <input type="file" onChange={this.onFileChange} />  */}
                                    <input type="file" id="myfile" name="myfile"  class="form-control"></input>
                                </div>
                          
              
                            </Col>
                            
                        </Row>
                        </CardBody>
                    </Card>
                       
      
                    </Col>
                </Row>
                
                
                <Row>
                    
                    
                    <Col>
                    
                    <Row>
                    <Col>
                    <Row><h4 style={{marginTop:'20px'}}>Items Details</h4></Row>
                        <div class="form-group" style={{display:'flex'}}>
                            <label for="exampleInputPassword1">Select number of items: </label>
                            <select class="form-control" name="num_items" id="num_items" onChange={this.handleCustomerNameChange} style={{width:'40px',marginLeft:'7px'}}>
                                {/* <option disabled selected value> -- select a number -- </option> */}
                            
                                <option key="1" value="1" selected>   
                                        1
                                </option>
                                <option key="2" value="2">   
                                       2
                                </option>
                                <option key="3" value="3">   
                                        3
                                </option>    
                                <option key="4" value="4">   
                                        4
                                </option>
                                <option key="5" value="5">   
                                       5
                                </option>
                                <option key="6" value="6">   
                                        6
                                </option>   
                                <option key="7" value="7">   
                                        7
                                </option>
                                <option key="8" value="8">   
                                       8
                                </option>
                                <option key="9" value="9">   
                                        9
                                </option>
                                <option key="10" value="10">   
                                        10
                                </option>    
                            </select>
                        </div>
                    </Col>
                    <Col>
                    </Col>
                </Row>
                    {this.state.items.map((item)=>(
                        <div class="form-group" id="detail" >
                        <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                        </div>
                       
                        
                        <Card>
                            <CardBody>
                            <Row><h5 style={{padding: '5px'}}>Item {item + 1}</h5></Row>
                            <Row>
                                <Col>
                                    <label for="exampleInputPassword1">Unit</label>
                                    <input type="text" class="form-control"  placeholder={"Enter Unit"} name="Unit" id={"Unit"+item} required maxlength="8"></input>
                                </Col>
                                <Col>
                                    <label for="exampleInputPassword1">Quantity </label>
                                    <input type="number" class="form-control"  placeholder="Enter Quantity" name="Quantity" id={"Quantity"+item} required step="1" ></input>
                                </Col>
                                
                            </Row>
                            <Row>
                                <Col>
                                    <label for="exampleInputPassword1">Description</label>
                                    <label for="exampleInputPassword1" style={{fontSize:'9px', color:'grey', marginLeft:'3px'}}>maximum 94 characters</label>
                                    <input type="text" class="form-control"  placeholder="Enter Description" name="Description" id={"Description"+item} required maxlength="94"></input>
                                </Col>
                                <Col>
                                    <label for="exampleInputPassword1">Available in Store - optional</label>
                                    <input type="number" class="form-control"  name="Available" id={"Available"+item}  step="1"></input>
                                </Col>
                                
                            </Row>
                            <Row>
                                <Col>
                                    <label for="exampleInputPassword1">Need to Procure - optional</label>
                                    <input type="number" class="form-control"  name="Procure" id={"Procure"+item}   step="1"></input>
                                </Col>
                                <Col>
                                  
                                </Col>
                                
                            </Row>
                            </CardBody>
                        </Card>
                            
                            {/* <hr/> */}
                        </div>
                    ))}
                    </Col>
                </Row>
                
                <button id="sub"  type="submit" >Submit</button>
                
                    
                
                </Form>
                {/* <Can I="read" a="/purchase-requisition/get-prid/:id/" ability={this.state.ability}></Can> */}
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
}
export default PR_create;