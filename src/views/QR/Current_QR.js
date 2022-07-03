import React from "react";
import { Modal, Button } from "react-bootstrap";
import {Card,Container, Row, Col} from "shards-react";
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
//import FilterComponent from "./FilterComponent";
let controller
class Current_QR extends React.Component{

  constructor(props) {
      super(props);
      const userIs_logged=localStorage.getItem('is_logged');
      const userEmail=localStorage.getItem('Email');
      const userToken=localStorage.getItem('Password');
    if(userIs_logged != 1){
      this.props.history.push("/login");
    }
      this.state = {
          sort: false,
          requested_by: [],
          companies:[],
          projects:[],
          status: [],
          maintained_by: [],
          isLoaded: false,
          show: false,
          pr:[],
          data: [],
          data1:[],
          Contacts: [],
          projects:[],
          id: [],
          items:[],

          columns: [
            {
                name: "Contact",
                selector: (row) =>  row.null,
                sortable: true,
            },
            {
                name: "Project",
                selector: (row) => row.null,
                sortable: true,
            },
            {
                name: "Task",
                selector: (row) => row.null,
                sortable: true,
            },
            {
              name: "Description",
              selector: (row) => row.null,
              sortable: true,
              right: true
            },
            {
              name: "Status",
              selector: (row) => row.null,
              sortable: true,
              right: true
            },

            
          ],

          columns2: [
            {
                name: "Contact",
                selector: (row) =>  row.null,
                sortable: true,
            },
            {
                name: "Project",
                selector: (row) => row.id,
                sortable: true,
            },
            {
                name: "Task",
                selector: (row) => row.company_name,
                sortable: true,
            },
            {
              name: "Description",
              selector: (row) => row.project_name,
              sortable: true,
              right: true
            },
            {
              name: "Status",
              selector: (row) => row.status,
              sortable: true,
              right: true
            },


            
          ],
        };
    }

    componentWillUnmount(){
      if(controller){
        controller.abort();
    }
    }
    async componentDidMount() {
      controller = new AbortController();
      const signal = controller.signal;
      // require('../../utils').checkpermision('PR')
      // let permission = localStorage.getItem('permissions');
      // var CryptoJS = require("crypto-js");
      // var bytes = CryptoJS.AES.decrypt(permission, DKEY);
      // var permissions = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      //console.log(permissions)
      // if(!permissions.find(({ resource }) => resource.name === 'PR' ) && !permissions.find(({ resource }) => resource.name === 'PR_S' ) )
      // this.setState({
      //   edit_pr: true
      // })
      // {
      //     window.location.replace("/"+permissions[0].resource.name);
      // }
      const cookies = new Cookies();
      const access_token = localStorage.getItem('access_token');
      let url = new URL(URL2+`QR_TimeSheet/get_qr_report_disactive`);
      url.searchParams.append('sort', 'DESC');
      await fetch(url, {
          headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'access_token' : access_token
           },
           credentials: 'include',
           signal
         })
        .then(response => response.json())
        .then((response) => {
            console.log(response)

            // console.log(uniq_maintained_by)
            this.setState({
              isLoaded: true,
              data: response,
              data1: response
          })
        })

        let url20 = new URL(URL2+`QR_TimeSheet/get_qr_report_active`);
        url.searchParams.append('sort', 'DESC');
        await fetch(url20, {
            headers : { 
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'access_token' : access_token
             },
             credentials: 'include',
             signal,
           })
          .then(response => response.json())
          .then((response) => {
              console.log(response)
  
              // console.log(uniq_maintained_by)
              this.setState({
                isLoaded: true,
                data: response,
            })
            console.log("Issam Test",response)
          })

        
          this.setState({
            columns: [
              {
                name: <span>Emp-ID</span>,
                selector: (row) => row.created_by.pavilion_id,

            },
              {
                  name: <span>Employee Name</span>,
                  selector: (row) => row.name,
  
              },
              {
  
                  name:  <span>Project</span>,
                  selector: (row) => row.project_name,
              },
              {
                  name: <span>Task</span>,
                  selector: (row) => row.task_name,
   
              },
              {
                name: <span>Description</span>,
                selector: (row) => row.description_name,
 
            },
            {
              name: <span>Phone</span>,
              selector: (row) => row.employeePhone,

          },
  
            ],
          })
       

        this.setState({
          columns2: [
            {
              name: <span>Emp-ID</span>,
              selector: (row) => row.pavilion_id,

          },
            {
                name: <span>Employee Name</span>,
                selector: (row) => row.name,

            },
            {

                name:  <span>Contact Number</span>,
                selector: (row) => row.mobile,
            },
            {
                name: <span>Email</span>,
                selector: (row) => row.email,
 
            },


          ],
        })
     
    }


    getUpdatedItems = () => {
      
      let updated_items = [];
      const updated_item_by_keys = {};

      for(const key of Object.keys(this.state.items[0])){
        updated_item_by_keys[key] = document.getElementsByClassName(key);
      }


      for(const key of Object.keys(updated_item_by_keys) ){
        for(const item of updated_item_by_keys[key]){

          let item_id, item_value;

          if(item.getAttribute('data-item-id')){
             item_id = item.getAttribute('data-item-id');
             item_value = item.value
          }

          if (updated_items.find(i => i && i.id === item_id)){
              updated_items = updated_items.map(i => {
                
              if(i && i.id === item_id){
                i[key] = item_value;
              }

              return i;
            });
          }
          else{
            updated_items.push({id: item_id, [key]: item_value});
          }
        }
      }

      return updated_items;
    }


  
  render(){
      return(
      <Container fluid className="main-content-container px-4" >


      {/* Page Header */}
      <Row noGutters className="page-header py-4">
          <PageTitle title={`QR Attendance`}  className="text-sm-left" /> 
      </Row>

      <div class="form-group">
        


      </div>
     

      {this.state.isLoaded ? (
        <div >


          <Card  style={{ marginBottom:'20px'}} small>
            <div style={{ paddingLeft:'20px',paddingRight:'20px', marginBottom:'20px'}}>
          <h6 style={{ marginTop:'10px'}}>Who is not using the The QR system</h6>

        </div>

              <DataTable
              columns={this.state.columns2}
              data={this.state.data1}
              highlightOnHover={true}
              //selectableRows
              //defaultSortFieldId={2}
              style={{overflow:'wrap'}}
              //sortServer
              pagination/>  

          </Card>

          <Card small>
            <div style={{ paddingLeft:'20px',paddingRight:'20px', marginBottom:'20px'}}>
          <h6 style={{ marginTop:'10px'}}>Who is using the QR system </h6>

        </div>

        <DataTable
              columns={this.state.columns}
              data={this.state.data}
              highlightOnHover={true}
              style={{overflow:'wrap'}}
              pagination/>

            
          </Card>
      </div>
      ): (<L></L>)}
     

    </Container>
      );
  }
}
export default Current_QR;

