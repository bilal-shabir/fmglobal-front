import React, { useState } from 'react';
import { Modal, Button } from "react-bootstrap";
import { withRouter } from "react-router";
import {Card,Container, Row, Col , FormSelect , FormCheckbox} from "shards-react";
import {URL2,DKEY} from '../../constants';
import {Link} from "react-router-dom";
import PageTitle from "../../components/common/PageTitle";
import Cookies from "universal-cookie";
import L from "../../components/components-overview/loader";
import DataTable from "react-data-table-component";
import Table from "./DataTable";
import file from '../../assets/fileb.pdf'
import arrow from '../../images/arrow.png'
import arrowup from '../../images/arrowup.png';
// import FilterComponent from "./FilterComponent";
import CreatableSelect from 'react-select/creatable';
import 'react-tabs/style/react-tabs.css';
import { event } from 'react-ga';
import {useHistory,BrowserRouter,Route} from "react-router-dom";
import { Redirect } from 'react-router'
import {QR_PDF} from './QR_pdf';
import {PDF_QR} from "./PDF_QR";
import { BlobProvider, PDFDownloadLink } from '@react-pdf/renderer'
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';





let controller
class QR_Generate extends React.Component{

  

  constructor(props) {

      super(props);
      const userIs_logged=localStorage.getItem('is_logged');
      const userXeroID=localStorage.getItem('company_id_xero');
      const userEmail=localStorage.getItem('Email');
      const userToken=localStorage.getItem('Password');
      
    if(userIs_logged != 1){
      this.props.history.push("/login");
      
      // this.props.history.push({
      //   pathname:"/QR_PDF",
      //   state:{
      //       key:this.state.SelectedDescription
      //    }
      //  });
    }
      this.state = {
          Generated_QR:[],
          messages:[],
          Contact_id: null,
          rowStatus: null,
          dropDownDisabled:true,
          rowId: null,
          selectedRows:[],
          Test:"Data",
          SelectedDescription:[],
          SelectedDesc:[],
          selectedRows2:[],
          Contact_name:null,
          Contacts: [],
          Description:[{}],
          Contact:[],
          contact_names:[],
          sort: false,
          Project_task:[],
          status: [],
          maintained_by: [],
          isLoaded: false,
          show: false,
          checked:false,
          Contact_date:[],
          data: [],
          tasks:[],
          id: [],
          items:[],
          contact_name:[],
          Generate_tasks:[],
          data1:[],
          dropValue: null,
          generate_button:true,

        };



        
    }

   componentWillUnmount(){
    if(controller){
      controller.abort();
  }
  }


  async componentDidMount(){
    controller = new AbortController();
    const signal = controller.signal;
  
    const access_token = localStorage.getItem('access_token');
    const XeroID = localStorage.getItem('password');

    console.log("Xero ID",XeroID)

    const Description = await fetch(URL2 + "QR_Description", {
      headers: {
        "Content-Type": "application/json",
        'Accept': "application/json",
        'access_token' : access_token
      },
      credentials: 'include',
      method: "GET",
      signal,


    });
    const Desc = await Description.json();

   console.log("Desc",Desc)
    let FinalDesc = []
    for (const row of Desc) {
      //for(const newRow of FinalDesc){
        //const newRow = null
        FinalDesc.push({"value":row.name,"label":row.name,"CompanyID":row.company_id_xero,"id":row.id})
     // }
    }
    this.setState({
      Description:FinalDesc,
    })

      console.log("Descriptions",FinalDesc)


    const response = await fetch(URL2 + "QR_Generater/getContact",{
      
      headers: {
        "Content-Type": "application/json",
        'Accept': "application/json",
        'access_token' : access_token
      },
      credentials: 'include',
      method: "GET",
      signal,
 

    })
    try{
      const json = await response.json();
      const data_count = json.count;
      const res = json.data;
      
      let Contacts = json;
      var id = [];
      var projects = [];
      var tasks = [];
      console.log("Alhawaj test",Contacts )
  
      this.setState({
        Contacts: Contacts,
        id:id,
        projects:projects,
        //Contact_date: json,
        tasks:tasks,
        isLoaded: true,
        })
    }catch(err){

      alert("Xero API is not Responding")
    }
  }

  handleContactNameChange = async(event) =>{

    try{
    const a = JSON.parse(event.target.value)
    this.setState({
        Contact_id: a.id,
        Contact_name: a.name,

    })


    const filtered = this.state.Contacts.find(contacts => 
      contacts.id == a.id
      )

      //console.log("Projects",filtered)
      const projects = filtered.projects
      console.log("Projects",filtered)
      //console.log("Projects",this.state.tasks)
      this.setState({
        projects: projects,
        //Contact_date:filtered

      })
    }catch(err){

      alert("Xero API is not Responding")
    }

}

handleCreate = (inputValue,optionLabel) => {
  controller = new AbortController();
  const signal = controller.signal;

  console.log("input Value Create",inputValue);
  console.log("optionLabel",optionLabel);
  //console.log(`action Create: ${actionMeta.action}`);
   const access_token = localStorage.getItem('access_token');
   const Response =  fetch(URL2 + "QR_Description/AddDescription", {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      access_token: access_token
    },
    credentials: 'include',
    method: "POST",
    signal,
    mode: "cors",
    body: JSON.stringify({
      "name" : inputValue
    })

  });

  return(inputValue,optionLabel)

};

updateState = event =>  {


  console.log("new value",this.state.SelectedDescription)


  for(const a of event.selectedRows){

    const rowDesc = this.state.SelectedDescription.filter(row => 
      row.taskid === a.taskid
    )
    console.log("New Desc",rowDesc)
    console.log("a value",a)
    a.descName = rowDesc[0].value.value
    a.descID = rowDesc[0].value.id
  }

  
  
  this.setState({ 
    selectedRows: event.selectedRows,
    generate_button:false,
  });
  console.log("dropdown",this.state.dropDownDisabled)
  console.log("State Selected",event.selectedRows);

  }


  

   handleGenerateButton= async()=>{
    controller = new AbortController();
    const signal = controller.signal;

    if (this.state.selectedRows.length <= 4){

    var SelectedDesc=[]
    SelectedDesc.push(this.state.SelectedDescription)
    let QR=[]
    const access_token = localStorage.getItem('access_token');

    for (let index = 0; index < this.state.selectedRows.length; index++){
      var task = "false"
      if(this.state.selectedRows[index].taskname === "Travel")
      task= "true"
      else{
        task="false"
      }

    await fetch(URL2 + 'QR_Generater/generateQr',
    {
    
      headers: {
        "Content-Type": "application/json",
        'Accept': "application/json",
        'access_token' : access_token
      },
      credentials: 'include',
      method: "POST",
      signal,
      body:JSON.stringify({ 
        contact_id:this.state.selectedRows[index].contactId,
        contact_name:this.state.selectedRows[index].contact_name,
        project_id:this.state.selectedRows[index].projectId,
        project_name:this.state.selectedRows[index].projectname,
        task_id:this.state.selectedRows[index].taskid,
        task_name:this.state.selectedRows[index].taskname,
        description_id:this.state.selectedRows[index].descID,
        description_name:this.state.selectedRows[index].descName,
        travel:task,
        })

    })
    .then((response) => response.json())
    .then(response => {
      //console.log("Qr Generate Response",response)
      //console.log("Qr Generated Image",response.generated_qr_project)
      console.log("response",response)
      QR[index]=response
      
      this.setState({ 
        Generated_QR: QR,
      });
    }
    )
  }
  //console.log("QR",QR)
  //this.props.history.push(`/QR_pdf?p=${JSON.stringify(QR)}`);
  
  window.open(`/QR_pdf?p=${JSON.stringify(QR)}`, "_blank").focus();


  

  //this.handleGeneratePDF()
  //this.props.history.pushState({state: QR},'QR Data',"/QR_pdf")
  //this.location.reload();
    
  

    }
    else{
      alert("Please select less than 5 rows for multi generation")

    }

    console.log("My Array" , this.state.Generated_QR)

// this.handleGeneratePDF()

  };


  

  // handleGeneratePDF=()=>{

  //   const ViewReceipt = () => (
  //     <BlobProvider document={PDF_QR}>
  //       {({ url }) => (
  //         <a className="button" href={url} target="_blank" rel="noopener noreferrer">
  //           Open in New Tab
  //         </a>
  //       )}
  //     </BlobProvider>
  //   )

  // }



handleDescChange = (newValue  ,taskid,taskname, event , contact_name,projectname,contactId,projectId) => {

  let newval = []
  newval.push({"taskid":taskid,"taskname":taskname,"value":newValue})
  

  this.setState({ 
    SelectedDescription: this.state.SelectedDescription.concat(newval)
  });
   console.log("Selected Description",this.state.SelectedDescription)

};

handleInputChange = (inputValue, actionMeta) => {
   const access_token = localStorage.getItem('access_token');

};



DescChange = (inputValue) => {
  let selected =[]
  console.log("input value",inputValue); 
  console.log(`Option selected:`);
  console.log(`value selected:`, inputValue.value);
  selected.push(inputValue.value)
  console.log("Selected",selected)

}

getValue=(inputValue)=>{
  console.log("Second Function",inputValue); 
}



handleProjectChange = async(event) =>{
  const a = JSON.parse(event.target.value)
  console.log("handle Project change",a)
  const filtered = this.state.Contacts.find(contacts => 
    contacts.id == a.contect_id
    )

    const filtered2 = this.state.projects.find(project => 
      project.contactId == a.contect_id
      )
  
  const access_token = localStorage.getItem('access_token');
  await fetch(URL2+'QR_Generater/get_Contact_project_task/'+filtered.id +'/'+filtered.name, {
   headers: {
     "Content-Type": "application/json",
     'Accept': "application/json",
     'access_token' : access_token
   },
   credentials: 'include',
   method: "GET",
 })
 .then(response => response.json())
 .then(response => {
     var projects = response;
    this.setState({
    tasks :projects
    })
     
     console.log("This.state tasks",this.state.tasks)
     console.log("Fadhel Test",projects)
     const filteredTasks = this.state.tasks.filter(task => 
      task.projectId == a.project_id
      )
  
      console.log("Tasks Alhawaj",filteredTasks)

      this.setState({
        Contact_date :filteredTasks
        })


        this.setState({
          columns: [
            {
                name: <span>Contact</span>,
                selector: (row) =>  row.contact_name,
                 sortable: true,

            },
            {

                name:  <span>Project</span>,
                selector: (row) => row.projectname,
                 sortable: true,
 
            },
            {
                name: <span>Task</span>,
                selector: (row) => row.taskname,
                 sortable: true,
        
            },

            {
              id:'Description',
              name: <span>Description</span>,
              sortable: true,
             
              
              cell : (row) => 
              {console.log("row value",row.taskname)
                return(
                <form>
                  <div  style ={{ zIndex:"100000",width:"200px"}}>
                  <CreatableSelect name="status"
                    isClearable
                    onChange={(event)=>this.handleDescChange(event,row.taskid,row.taskname,row.contact_name,row.projectname,row.contactId,row.projectId)}
                    onInputChange={this.handleInputChange}
                    options={this.state.Description}
                    onCreateOption = {this.handleCreate}

                  />
          
                  </div>
                  
                </form>
              )},

              sortable: true,
              center: true,

            },

    
     
          ],
        })
   
 })



}

      render(){
      return(

        
      <Container fluid className="main-content-container px-4" >
            <Row noGutters className="page-header py-4">
          <PageTitle title={`QR Code Generate`}  className="text-sm-left" /> 
          </Row>

      <div class="form-group">
        
      </div>
     
      {this.state.isLoaded ? (
        <div >
            <div style={{ paddingLeft:'10px',paddingRight:'10px', marginBottom:'5px'}}>
          <Row>

        </Row>
          <Row>
          <Col lg="12" md="12" sm="12" className="mb-4">
            <Card className="mb-4" small>
      
                <Row className="align-items-center" style={{margin: 'initial'}}>
                  <Col  sm={1} className="my-1">
                    <FormSelect onChange={this.handleContactNameChange} style={{  width: '280px' }} aria-label="Default select example" name="xero_contact" id="xero_contact" >
                      <option selected disabled value={false}>Contact</option>
                      {this.state.Contacts.map((Contacts) => 
                                      <option key={Contacts.id} name ={Contacts.name} value={JSON.stringify(Contacts)}>   

                                            {Contacts.name}
                                      </option>)}

                    </FormSelect>
                  </Col>

                  <Col  sm={1} className="my-1">
                    <FormSelect  onChange={this.handleProjectChange} style={{  width: '280px', marginLeft:'250px' }} aria-label="Default select example" name="xero_project" id="xero_project">
                      <option selected disabled value={false}>Project</option>
                      {this.state.projects.map((projects) => 
                                      <option key={projects.project_name} name ={projects.project_name} value={JSON.stringify(projects)}>   
                                            
                                            
                                            {projects.project_name}
                                      </option>)}
                    </FormSelect>
                  </Col>


                  <span style={{ fontSize: '14px', marginLeft: '60%', color: 'blue', cursor: 'pointer' }} onClick={this.resetfilters}>Reset Filters</span>

                  <Col  sm={2}>
                    <input style={{ border: '1px solid black'}} class="form-control" id="search" type="text" placeholder="Search..." onKeyUp={this.onFilter}></input>
                  </Col>
                </Row>
            </Card>


          </Col>
        </Row>
        
        </div>
        <Card small>
            <DataTable
              columns={this.state.columns}
              data={this.state.Contact_date}
              highlightOnHover={true}
              selectableRows
              onSelectedRowsChange={this.updateState}
              style={{overflow:'wrap'}}
              pagination
            />

        <button  isdisables={this.state.generate_button} onClick={this.handleGenerateButton} style={{borderColor:'#BDAC37' , width:'10%',marginLeft:'89%',marginBottom:'5px'}}>  Generate </button>
        
          </Card>
      </div>
      ): (<L></L>)}

                </Container>
    
      );
  }
}
export default withRouter(QR_Generate);

