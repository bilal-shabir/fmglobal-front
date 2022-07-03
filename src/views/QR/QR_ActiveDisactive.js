import React from "react";
import { Modal, Button } from "react-bootstrap";
import {Card,Container, Row, Col , FormSelect , FormCheckbox} from "shards-react";
import {URL2,DKEY} from '../../constants';
import PageTitle from "../../components/common/PageTitle";
import L from "../../components/components-overview/loader";
import DataTable from "react-data-table-component";
import 'react-tabs/style/react-tabs.css';
import BootstrapSwitchButton from 'bootstrap-switch-button-react'

let controller
class QR_ActiveDisactive extends React.Component{
 
  constructor(props) {
      super(props);
      const userIs_logged=localStorage.getItem('is_logged');
      const userXeroID=localStorage.getItem('company_id_xero');
      const userEmail=localStorage.getItem('Email');
      const userToken=localStorage.getItem('Password');
    if(userIs_logged != 1){
      this.props.history.push("/login");
    }
      this.state = {
          QR_Tasks_List:[],
          isUserAdmin: null,
          Contact_id: null,
          rowStatus: null,
          rowId: null,
          selectedRows:[],
          Test:"Data",
          SelectedDescription:[],
          SelectedDesc:[],
          selectedRows2:[],
          Contact_name:null,
          Contacts: [],
          Description:[],
          Contact:[],
          contact_names:[],
          sort: false,
          requested_by: [],
          companies:[],
          projects:[],
          Project_task:[],
          status: [],
          maintained_by: [],
          isLoaded: true,
          show: false,
          checked:false,
          //Contact_date:[],
          data: [],
          tasks:[],
          id: [],
          items:[],
          contact_name:[],
          Generate_tasks:[],
          data1:[],
          dropValue: null,
          columns: [
            {
              name: <span>id</span>,
              selector: (row) => row.id,
               sortable: true,
              //width:'150px'
            },
            {
                name: <span>Contact</span>,
                selector: (row) =>  row.contact_name,
                 sortable: true,
                //width:'120px'
            },
            {
              // onChange={this.filter}
                name:  <span>Project</span>,
                selector: (row) => row.project_name,
                 sortable: true,
                //width:'150px'
            },
            {
                name: <span>Task</span>,
                selector: (row) => row.task_name,
                 sortable: true,
                //width:'150px'
            },
            {
              name: <span>Description</span>,
              selector: (row) => row.description_name,
               sortable: true,
              //width:'150px'
          },
          {
            id: row => row.id,
            name: <span>Active?</span>,
            cell: row => <span style={{ paddingRight: '10px' }}> <BootstrapSwitchButton width={85} height={10}
              value={row.is_active}
              state={row.is_active}
              checked={row.is_active}
              onlabel='Active'
              offlabel='Inactive'
              onChange={(checked,id)=>this.handleStatusChange(checked,row.id)}
              /></span>,
            allowOverflow: true,
            button: true,
            // width: '40px',
            // height: '50px'
          },
          ],
          // options : [
          //   { value: "Test", label:"Test" },
          // ],

          // options : [],
        };

        
    }

    

    

    

  async componentDidMount(){
    controller = new AbortController();
    const signal = controller.signal;
  
    
    const access_token = localStorage.getItem('access_token');
    const response = await fetch(URL2 + "QR_Generater/active_and_inactive_generated_QR", {
      headers: {
        "Content-Type": "application/json",
        'Accept': "application/json",
        'access_token' : access_token
      },
      credentials: 'include',
      method: "GET",
      signal,

    });
    

    const json = await response.json();
    let QR_Tasks = json;
    console.log("QR_Tasks_List",QR_Tasks )

    this.setState({
      QR_Tasks_List :QR_Tasks,
      })

      console.log("print state" , this.state.QR_Tasks_List)

      this.setState({
        columns: [
          {
            name: <span>id</span>,
            selector: (row) => row.id,
             sortable: true,
            //width:'150px'
        },
          {
              name: <span>Contact</span>,
              selector: (row) =>  row.contact_name,
               sortable: true,
              //width:'120px'
          },
          {
            // onChange={this.filter}
              name:  <span>Project</span>,
              selector: (row) => row.project_name,
               sortable: true,
              //width:'150px'
          },
          {
              name: <span>Task</span>,
              selector: (row) => row.task_name,
               sortable: true,
              //width:'150px'
          },
          {
            name: <span>Description</span>,
            selector: (row) => row.description_name,
             sortable: true,
            //width:'150px'
        },

        {
          name: <span>Active?</span>,
          //var x=row.id,
          cell: row => <span style={{ paddingRight: '10px' }}> <BootstrapSwitchButton width={85} height={10}
            //value={row.id}
            //state={row.is_active}
            checked={row.is_active}
            onlabel='Active'
            offlabel='Inactive'
            onChange={(checked,id)=>this.handleStatusChange(checked,row.id)}
            /></span>,
          allowOverflow: true,
          button: true,
          // width: '40px',
          // height: '50px'
        },
        ],
      })
  }

  componentWillUnmount(){
    if(controller){
      controller.abort();
  }
  }



    handleStatusChange(checked,id) {
      controller = new AbortController();
      const signal = controller.signal;
      //console.log("Component",component);
      console.log("active?",checked);
      console.log("id",id);
      const access_token = localStorage.getItem("access_token");
      fetch(URL2 +`QR_Generater/delete`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          access_token: access_token
        },
        credentials: "include",
        method: "PUT",
        signal,
        mode: "cors",
        body: JSON.stringify({ 
          "is_active": checked,
          "id": id
        })
      });

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



updateState = state =>  {
  //console.log(state);
  //var SelectedDesc=[]
  console.log("State Selected",state.selectedRows);
  console.log("State Only",state);
  //console.log("return",this.handleDescChange())


  for(const a of state.selectedRows){
    console.log(a)
    a.desc = this.state.SelectedDescription
  }
  
  this.setState({ 
    selectedRows: state.selectedRows,
  });

    console.log("Selected",this.state.selectedRows)

  }



  
    handleClose = () => {
      this.setState({ show: false });
    };

    convert(date){
      
      var time = Date.parse(date);
      
      var d = new Date(time);
      const month =d.getMonth()+1
      const day = d.getDate()
      const year = d.getFullYear()
      
      return year+'-'+this.addZero(month)+'-'+this.addZero(day)
      
    }

    abc (date)
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
  
  render(){
      return(

        
      <Container fluid className="main-content-container px-4" >


            {/* Page Header */}
            <Row noGutters className="page-header py-4">
          <PageTitle title={`Active / Inactive QR tasks`}  className="text-sm-left" /> 
              {/* <CreatableSelect 
              isClearable
              onChange={this.handleDescChange}
              onInputChange={this.handleInputChange}
              options={this.state.Description}
              autosize={true}
              /> */}

          </Row>

      <div class="form-group">
        
      </div>
     
      {this.state.isLoaded ? (
        <div >


          
            <div style={{ paddingLeft:'10px',paddingRight:'10px', marginBottom:'5px'}}>
          {/* <h6 style={{ marginTop:'10px'}}>Select The Contact and the Project </h6> */}
          <Row>

        </Row>
          <Row>
          <Col lg="12" md="12" sm="12" className="mb-4">



          </Col>
        </Row>
        
        {/* <Row >

        </Row> */}
        </div>
        <Card small>
            <DataTable
              columns={this.state.columns}
              data={this.state.QR_Tasks_List}
              highlightOnHover={true}
              //selectableRows
              //onSelectedRowsChange={this.updateState}
              style={{overflow:'wrap'}}
              //onRowClicked={this.handleDescChange}
              pagination
            />

          </Card>
      </div>
      ): (<L></L>)}
      {/* <div id="snackbar_invc" style={{marginTop:'45px'}}>Material Request Info Updated</div> */}

  



    </Container>
      );
  }
}
export default QR_ActiveDisactive;

