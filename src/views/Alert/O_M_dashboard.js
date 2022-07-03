import React from "react";
// import PropTypes from "prop-types";
import { Modal, Button,select, Alert, CardImg } from "react-bootstrap";
import { Container, Row, Col, CardHeader} from "shards-react";
import { URL3,URL2,DKEY} from "../../constants";
import { Card, CardBody, CardTitle, CardSubtitle, FormSelect} from "shards-react";
import AlertTable from "../../components/components-overview/alertTable";
// import Colors from "../components/components-overview/TestColors";
// import {
//   CardHeader,
//   ListGroup,
//   ListGroupItem,
//   CardFooter,
//   FormSelect,
// } from "shards-react";
import "../../assets/O_M_dashboard.css";
import PageTitle from "../../components/common/PageTitle";
import DataTable from "react-data-table-component";
import L from "../../components/components-overview/loader";
import errorpng from '../../images/errors.png'
import ok_checks from '../../images/ok_checks.png'
import TimePicker from 'react-bootstrap-time-picker';
import { timeFromInt } from 'time-number';
import Spinner from 'react-bootstrap/Spinner';
import { Can } from "@casl/react";
import setPermissions from "../defineAbility";

class O_M_Dashboard extends React.Component {
  constructor(props) {
    super(props);

    

    const userIs_logged = localStorage.getItem("is_logged");
    if (userIs_logged != 1) {
      this.props.history.push("/login");
    }

    require('../../utils').checkpermision('AlertDashboard')


    this.state = {
      ability: null,
      errors_completed: 0,
      errors_inProgress: 0,
      warnings_completed: 0,
      warnings_inProgress: 0,
      Info: 0,
      ok_checks: 0,
      error: false,
      error_count: 0,
      tickets_count: 0,
      ok_count: 0,
      row_count: 0,
      hilight: false,
      max_id: null,
      isLoaded: false,
      columns: null,
      customStyles: null,
      data: [],
      data2: [],
      ExpandedComponent:null,
      isOpen: false,
      value_time: "00:00",
      start_time: "00:00",
      end_time: "00:00",
      project:[],
      devices:[],
      device_id:0,
      device_manufacturer_id:0,
      parameters:[],
      msgs_types:[],
      project_device_id:0,
      show_loading:false,
      is_null : 0,
      is_email : 0,
      is_signal : 0,
      isOpenButton: false,
      rowStatus: null,
      rowId:null
    };

    this.handleClick = this.handleClick.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.handleTimeChange = this.handleTimeChange.bind(this);
    this.handelTableSelect = this.handelTableSelect.bind(this);
  }


 
  addZero(i) {
    if (i < 10) {i = "0" + i}
    return i;
  }

  handleShowCreate(){
    this.setState({
      isOpen: true
    })
  }

  closeModal(){
    this.setState({
      isOpen: false
    })
  }

  handleTimeChange(start_time) {
    // console.log(start_time);
    const s = timeFromInt(start_time);
    this.setState({ start_time : s });
  }


  
  handleEndTimeChange = (end_time) => {
    // console.log(end_time);
    const e = timeFromInt(end_time);
    // console.log(e)
    this.setState({ end_time : e });
  }

  formatDate(date){
    var time = Date.parse(date);
    var date1 = new Date(time);

    let hour =this.addZero(date1.getHours())
    let min =this.addZero(date1.getMinutes())
    let s =this.addZero(date1.getSeconds())

    let day =this.addZero(date1.getDate())
    let month =this.addZero(date1.getMonth()+1)
    let year =this.addZero(date1.getFullYear())

    return year+'-'+month+'-'+day+' '+ hour+':'+min+':'+s
  }


  returnDeviceLocation(project_name) {
    if (project_name) {
      return project_name
    }
    else {
      return 'Not Available'
    }
  }

  returnDeviceType(device_manufacturer_name) {

    if(device_manufacturer_name === "SMA"){
      return "S"
    }
    if(device_manufacturer_name === "Fronius"){
      return "F"
    }
    else{
      return 'N/R'
    }
  }


  formatType = (name) => {

    if(name === "Normal"){
      return "N"
    }else if (name === "Information") {
      return "I"
    }

  }

  returnButton = (row) => {
    return <button onClick={this.TableclickHandler}>Process</button>
  }

  returnDeviceName = (dname) =>{

    if(dname !== null){
      return dname
    }else{
      return "Not Available"
    }

  }

  returnMessageSource = (source) =>{
    if(source === "PRM"){
      return "P"
    }else if(source === "INV"){
      return "I"
    }else{
      return "Not Recognized"
    }
  }


  async getData(){
  const ws =  new WebSocket(URL3);
  let normal_messages = [];
   ws.onopen = () =>  {
      //console.log('connected')
      ws.send(
          JSON.stringify({
            event: 'onm/register',
            data: {number_of_records: 7},
          }),
        );
      }
  ws.onmessage =  event =>  {
    this.setState({
      isLoaded:false
    })
      //console.log(event)
      let json = JSON.parse(event.data);
      // console.log(json)

      // option 1
      normal_messages.unshift(...json.normal_messages);
     
      this.setState(
        {
          data2: normal_messages,
          
          columns: [
            {
              name: "",
              selector: (row) => this.formatType(row.message_type_name),
              sortable: true,
              //grow:0,
              width: "30px",
              style: {"padding-right" : 0, "box-sizing" : 'content-box' }
            },
            {
              name: "",
              selector: (row) => row.id,
              sortable: true,
              //grow:0,
              width: "40px",
              style: {"padding-left" : 0 , "padding-right" : 0, "box-sizing" : 'content-box' }
            },
            {
              name: "",
              selector: (row) => this.returnMessageSource(row.message_source_name),
              sortable: true,
              //grow:0,
              width: "30px",
              style: {"padding-left" : 0 , "padding-right" : 0, "box-sizing" : 'content-box' }
            },
            {
              name: "",
              selector: (row) => this.returnDeviceType(row.device_manufacturer_name),
              sortable: true,
              //grow:0,
              width: "30px",
              wrap: true,
              style: {"padding-left" : 0 , "padding-right" : 0, "box-sizing" : 'content-box' }
            },
            {
              name: "Date & Time",
              selector: (row) => this.formatDate(row.created_at),
              sortable: true,
              //wrap: true,
              grow:1,
            }, 
            {
              name: "Project",
              selector: (row) => this.returnDeviceLocation(row.project_name),
              sortable: true,
              wrap: true,
            },
            {
              name: "Device",
              selector: (row) => row.device_sn,
              sortable: true,
              wrap: true,
            },
            {
              name: "Description",
              selector: (row) => this.returnDeviceName(row.device_name),
              sortable: true,
              wrap: true,
            },
            {
              name: "Messages",
              selector: (row) =>row.name,
              sortable: true,
              wrap: true,
              sortable: true,
              grow:3,
            },
            {
              name: "Status",
              selector: (row) => row.message_status_name,
              sortable: true,
              grow: 0.5,
            },
            { //Hidden Column
              name: "Type",
              selector: (row) => row.message_type_name,
              sortable: true,
              grow: 0,
              omit:true
              //Hidden Column
            },
            { //Hidden Column
              name: "Source",
              selector: (row) => row.message_source_name,
              sortable: true,
              omit:true
              //Hidden Column
            },
            {//Hidden Column
              name: "Device Type",
              selector: (row) => this.returnDeviceType(row.device_manufacturer_name),
              sortable: true,
              wrap: true,
              omit:true
              //Hidden Column
            },
          ],
          conditionalRowStyles: [
            {
              when: (row) => row.ID == this.state.max_id && this.state.hilight,
              style: {
                color: "white",
                backgroundColor: "#F85A5A",
                "&:hover": {
                  cursor: "pointer",
                }, 
              },
            },
            {
              when: (row) => row.message_type_name === "Normal",
              style: {
                color: "green",
                "&:hover": {
                  cursor: "pointer",
                },
              },
            },
          ],
          customStyles : {
            headCells: {
              style: {
                color: '#202124',
                fontSize: '14px',
              },
            },
            rows: {
              highlightOnHoverStyle: {
                backgroundColor: 'rgb(230, 244, 244)',
                borderBottomColor: '#FFFFFF',
                borderRadius: '25px',
                outline: '1px solid #FFFFFF',
              },
            },
            pagination: {
              style: {
                border: 'none',
              },
            },
          },
          isLoaded: true,
          errors_completed: json.errors_completed,
          errors_inProgress: json.errors_inProgress,
          warnings_completed: json.warnings_completed,
          warnings_inProgress: json.warnings_inProgress,
          Info: json.Info,
          ok_checks: json.Normal,
        }
      )
      
      // var mpath = require('mpath');
      // console.log(mpath.get('0.device.projects_devices[0].id',messages )) 
}
  }

  TableclickHandler = () => {
    this.setState({
      isOpenButton: true
    })
  }

  TablecloseModal = () => {
    this.setState({
      isOpenButton: false
    })
  }

  handelTableSelect(event) {
    //event.preventDefault();
    // console.log(event.target.value)
    this.setState({
      rowStatus : event.target.value,
      rowId : event.target.id
    })

    // console.log(this.state.rowStatus)
    // console.log(this.state.rowId)
  }

  getProjects = async() => {
    // console.log(event.target.value);
    const access_token = localStorage.getItem('access_token');
    await fetch(URL2+'project/', {
        headers : { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'access_token': access_token
         },
         credentials: 'include'
      }).then(response => response.json())
      .then(response => {
            this.setState({
                project : response,
            })
        })
  }

  handelProjectChange = async(event) =>{
    //  console.log(event.target.value);
     const access_token = localStorage.getItem('access_token');
     await fetch(URL2+'project-device/getDevicesPerProject/'+event.target.value, {
         headers : { 
           'Content-Type': 'application/json',
           'Accept': 'application/json',
           'access_token': access_token
          },
          credentials: 'include'
       }).then(response => response.json())
      
       .then(response => {
        // console.log(response)
             this.setState({
                 devices : response,
             })
         })
        // console.log(this.state.devices)

  }

  handelDeviceChange = async(event) =>{
    // console.log(event.target.value);


    let d_id = 0;
    for (const dev of this.state.devices){
      // console.log(dev)
      // console.log(dev.device.id == event.target.value)
      if (dev.device.id == event.target.value){
        d_id = dev.device.device_manufacturer.id
      }
    }
    //console.log(event.target.value,d_id)

    const access_token = localStorage.getItem('access_token');
    await fetch(URL2+'parameter/getByDevice/'+d_id, {
        headers : { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'access_token': access_token
         },
         credentials: 'include'
      }).then(response => response.json())
     
      .then(response => {
      //  console.log(response)
            this.setState({
                parameters : response,
            })
      })
      //console.log(this.state.parameters)
  }

  handelParameterChange = async(event) => {
    // console.log(event.target.value);

    const access_token = localStorage.getItem('access_token');

    await fetch(URL2+'message-type/', {
      headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'access_token': access_token
       },
       credentials: 'include'
    }).then(response => response.json())
   
    .then(response => {
    //  console.log(response)
          let types =[]
          const error = response.find(row => row.name == "Error")
          const warning = response.find(row => row.name == "Warning")

          types.push(error,warning)

          // console.log(types)
          this.setState({
              msgs_types : types,
          })
    })
    //console.log(this.state.msgs_types)


  }
   
  // async refreshData(){
  //   this.updateTimer = setInterval(async () => {
  //     this.getData()
  //   }, 5000);
  // }

  handleClick = () => {
    this.handleShowCreate()
    this.getProjects()
  }

  async componentDidMount() {
    await fetch(URL2+'getPermissions',{
      headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // 'access_token' : json.access_token
       },
       credentials: 'include'
    }).then(response => response.json())
    .then((json)=>{
      // console.log(json)
      const ability = setPermissions(json);
      this.setState({
        ability:ability
      })
    })

    this.getData()
    // this.refreshData()
    
  }

   getProjectDevice = async (p,d) =>{
     
    const access_token = localStorage.getItem('access_token');
    await fetch(URL2+'project-device/getProjectDeviceID/'+p+'/'+d, {
      headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'access_token': access_token
       },
       credentials: 'include'
    }).then(response => response.json())
   
    .then(response => {
    //  console.log(response[0].id)
      this.setState({
        project_device_id : response[0].id,
      })
    })

    return this.state.project_device_id
  }

  handelNullChange = () => {

    if(this.state.is_null == 1){
      this.setState({
        is_null : 0
      })
    }else if(this.state.is_null == 0){
      this.setState({
        is_null : 1
      })
    }
    
  }

  handelEmailChange = () => {

    if(this.state.is_email == 1){
      this.setState({
        is_email : 0
      })
    }else if(this.state.is_email == 0){
      this.setState({
        is_email : 1
      })
    }

  }

  handelSignalChange = () => {

    if(this.state.is_signal == 1){
      this.setState({
        is_signal : 0
      })
    }else if(this.state.is_signal == 0){
      this.setState({
        is_signal : 1
      })
    }

  }

  handelSubmit = async (event) => {

    event.preventDefault();
    this.setState({ show_loading: true}); 

    var min_value=document.getElementById("min_value").value;
    var max_value=document.getElementById("max_value").value;
    var start_time = this.state.start_time; 
    var end_time = this.state.end_time; 
    var type = document.getElementById("type").value;
    var is_email = this.state.is_email;
    var is_signal = this.state.is_signal;
    var is_null = this.state.is_null;
   

    var parameter_id = document.getElementById("parameter").value;

    var project_id = document.getElementById("project").value;
    var device_id = document.getElementById("device").value;

    var project_device = await this.getProjectDevice(project_id,device_id)

    const access_token = localStorage.getItem('access_token');  
    await fetch(URL2+'project-parameter/addParameter',{
        headers : { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'access_token' : access_token
          },
        credentials: 'include',
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify({ min_value: min_value, max_value: max_value, start_time: start_time, end_time: end_time,
          type: type, is_email: is_email, is_signal: is_signal, is_null: is_null , parameter_id : parameter_id , project_device : project_device })
    })
    .then(response => response.json())
    .then((response)=>{
        // console.log(response)
        if(response.message){
            alert('Parameter Added Succesfuly')
            this.setState({ show_loading: false});
            this.closeModal()
        }
    })
  }

  processAlert = async (event) => {

    event.preventDefault();
    this.setState({ show_loading: true}); 

    var rowStatus = this.state.rowStatus; 
    var rowId = this.state.rowId
    // console.log(rowId)
    // console.log(rowStatus)
    var msg = document.getElementById("msg").value;
    // console.log(msg)
   
    const access_token = localStorage.getItem('access_token');  
    await fetch(URL2+'message/processAlert',{
        headers : { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'access_token' : access_token
          },
        credentials: 'include',
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify({id: rowId, status:rowStatus, comments:msg })
    })
    .then(response => response.json())
    .then((response)=>{
        // console.log(response)
        if(response.message){
            alert('Message Was Updated Succesfuly')
            this.setState({ show_loading: false});
            this.closeModal()
        }
    })
  }

 

  render() {
    const {isLoaded} = this.state;
    return (
      <Container fluid className="main-content-container px-4">

        <Row noGutters style={{ paddingTop: "10px" }} className="mb-2">
          <Col lg="6" md="6" sm="12" className="mb-4">
           <PageTitle title={'Alert Dashboard'}  className="page-header text-sm-left" /> 
          </Col>
        </Row>

        <div style={{justifyContent:'center', marginTop:'30px'}} >
           
           <div className="">
              <Row style={{width:'100%', margin: '0 auto' }} >
                             
      
      
                        <Col lg="6" md="12" sm="12" className="mb-4" >
                        {/* <p className="m-0 text-center cardtxt" >Total Power Generated</p> */}
                          <Card small  className="cardtip1">
                              <div className="p-0" style={{backgroundColor:'white', borderRadius:'inherit', border:'1px solid #cfd1d4'}}>
                                <span className="ml-auto text-center text-bold"  >
                                    <p class="cardstats">{this.state.ok_checks} <br/></p>
                                  </span>
                                <div style={{margin: "auto",width: "100%",alignContent:"center",alignItems:"center", marginBottom:'2px'}}>
                                  {/* <img src={icon33} width={'100%'}></img> */}
                                  <div className="text-center text-bold" style={{backgroundColor:'#F5F6F8',width:'97%', marginLeft:'1.5%',marginTop:'-20px'}}>
                                    <span  class="cardheading">Normal</span>
                                  </div>
                                  {/* <div className="text-center text-bold tip1" style={{backgroundColor:'#F5F6F8',width:'97%', marginLeft:'1.5%'}}>
                                    <span style={{color:'black'}} class="cardheading">Tree seedlings grown for ten years</span>
                                  </div> */}
                                </div>
                                  {/* <div className="text-center text-bold" style={{backgroundColor:'#F5F6F8',width:'97%', marginLeft:'1.5%'}}>
                                    <span style={{fontSize:'12px'}}>Total Power Consumption</span>
                                  </div> */}
                                
                              </div>
                          </Card> 
                          
                        </Col>
   
   
                        <Col lg="6" md="12" sm="12" className="mb-4" >
                        {/* <p className="m-0 text-center cardtxt" >Total Power Generated</p> */}
                          <Card small className="cardtip3">
                              <div className="p-0" style={{backgroundColor:'white', borderRadius:'inherit', border:'1px solid #cfd1d4'}}>
                              <span className="ml-auto text-center text-bold"  >
                                  <p class="cardstats">{this.state.Info} <br/></p>
                                </span>
                              <div style={{margin: "auto",width: "97.5%",alignContent:"center",alignItems:"center", marginBottom:'2px'}}>
                                {/* <img src={icon36} width={'100%'}></img> */}
                                <div className="text-center text-bold" style={{backgroundColor:'#F5F6F8',width:'97%', marginLeft:'1.5%',marginTop:'-20px'}}>
                                  <span class="cardheading">information</span>
                                </div>
                                {/* <div className="text-center text-bold tip3" style={{backgroundColor:'#F5F6F8',width:'97%', marginLeft:'1.5%',marginTop:'-20px'}}>
                                  <span style={{color:'black'}} class="cardheading">Smart Phones Charged</span>
                                </div> */}
                                </div>
                                {/* <div className="text-center text-bold" style={{backgroundColor:'#F5F6F8',width:'97%', marginLeft:'1.5%'}}>
                                  <span style={{fontSize:'12px'}}>Total Power Consumption</span>
                                </div> */}
                              
                              </div>
                          </Card> 
                          
                        </Col>  
                      </Row>
           </div>
          </div>
        <Row>
        {isLoaded ? (
        
            <Col lg="12" md="12" sm="12" className="mb-4">
            
              <Card small>
              <AlertTable columns={this.state.columns} data={this.state.data2} conditionalRowStyles={this.state.conditionalRowStyles} customStyles={this.state.customStyles}></AlertTable>
              </Card>

            </Col>
      
          
        ) :(<L></L>)}
        </Row>
       
        
                        
                    
      </Container>
    );
  }
}

export default O_M_Dashboard;
