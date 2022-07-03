import React from "react";
import { Modal, Button, select, Alert, CardImg } from "react-bootstrap";
import { Container, Row, Col, Card, FormSelect} from "shards-react";
import { URL3, URL2, DKEY } from "../../constants";
import "../../assets/O_M_dashboard.css";
import PageTitle from "../../components/common/PageTitle";
import L from "../../components/components-overview/loader";
import errorpng from '../../images/errors.png'
import ok_checks from '../../images/ok_checks.png'
import TimePicker from 'react-bootstrap-time-picker';
import { timeFromInt } from 'time-number';
import Spinner from 'react-bootstrap/Spinner';
import HistoryTable from "../../components/components-overview/HistoryTable";

import DataTable from "react-data-table-component";

import { ListGroup,ListGroupItem} from "react-bootstrap";

class O_M_historical_Dashboard extends React.Component {
  constructor(props) {
    super(props);



    const userIs_logged = localStorage.getItem("is_logged");
    if (userIs_logged != 1) {
      this.props.history.push("/login");
    }

    //require('../../utils').checkpermision('O_M_history')

    this.state = {
      isLoaded: false,
      data: [],
      data1: [],
      FilterProject: [],
      FilterDevice: [],
      from: new Date(),
      to: new Date(),
    }
  }

  addZero(i) {
    if (i < 10) { i = "0" + i }
    return i;
  }



  formatDate(date) {
    var time = Date.parse(date);
    var date1 = new Date(time);

    let hour = this.addZero(date1.getHours())
    let min = this.addZero(date1.getMinutes())
    let s = this.addZero(date1.getSeconds())

    let day = this.addZero(date1.getDate())
    let month = this.addZero(date1.getMonth() + 1)
    let year = this.addZero(date1.getFullYear())

    return year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + s
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

    if(name === "Error"){
      return "E"
    }else if (name === "Warning") {
      return "W"
    } if(name === "Normal"){
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

  convertFilterValues = (value) => {
    if (typeof value === 'string') {

      if (value === 'false') {
        return value = null
      } else {
        return value
      }

    } else {
      return value = parseInt(value)
    }
  }

  async getData() {
    const ws = new WebSocket(URL3);
    let messages = [];
    ws.onopen = () => {
      //console.log('connected')
      ws.send(
        JSON.stringify({
          event: 'onm/register',
          data: { number_of_records: 7 },
        }),
      );
    }
    ws.onmessage = event => {
      this.setState({
        isLoaded: false
      })
      //console.log(event)
      let json = JSON.parse(event.data);
      // console.log(json)

      // option 1
      messages.unshift(...json.completed_messages);


      //console.log(messages)

      this.setState(
        {
          data: messages,
          data1: messages,


          columns: [
            {
              name: "",
              selector: (row) => this.formatType(row.message_type_name),
              sortable: true,
              //grow:0,
              width: "30px",
              style: {"padding-left" : 0 , "padding-right" : 0, "box-sizing" : 'content-box' }
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
              grow: 1,
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
              selector: (row) => row.name,
              sortable: true,
              wrap: true,
              sortable: true,
              grow: 3,
              //format: row => `${row.name.slice(0, 500)}...`,
            },
            {
              name: "Status",
              // selector: (row) => row.message_status.name,
              // sortable: true,
              grow: 0.5,

              cell: (row) => row.message_status_name
            },
            // {
            //     name: "Closed By",
            //     selector: (row) => row.updated_by.name,
            //     // sortable: true,
            //     grow: 0.5,
            //   },
              {
                name: "Closed at",
                selector: (row) => this.formatDate(row.updated_at),
                sortable: true,
                //wrap: true,
                grow: 1,
  
              },
          ],
          conditionalRowStyles: [
            {
              when: (row) => row.message_type_name === "Error",
              style: {
                ////backgroundColor: "#F7D1D1",
                color: "red",
                "&:hover": {
                  cursor: "pointer",
                },
              },
            },
            {
              when: (row) => row.message_type_name === "Warning",
              style: {
                color: "rgb(255,174,66,0.9)",
                "&:hover": {
                  cursor: "pointer",
                },
              },
            },
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
          customStyles: {
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
  getFilterProject = async () => {

    const access_token = localStorage.getItem('access_token');
    await fetch(URL2 + 'project/', {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'access_token': access_token
      },
      credentials: 'include'
    }).then(response => response.json())
      .then(response => {
        // console.log(response)
        this.setState({
          FilterProject: response,
        })
      })
  }


  getFilterDevices = async (event) => {

    const access_token = localStorage.getItem('access_token');
    await fetch(URL2 + 'device/', {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'access_token': access_token
      },
      credentials: 'include'
    }).then(response => response.json())
      .then(response => {
        // console.log(response)
        this.setState({
          FilterDevice: response,
        })
      })
  }


  getFilterDevicesPerProject = async (event) => {

    const access_token = localStorage.getItem('access_token');
    await fetch(URL2 + 'project-device/getDevicesPerProject/' + event.target.value, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'access_token': access_token
      },
      credentials: 'include'
    }).then(response => response.json())
      .then(response => {
        // console.log(response)
        this.setState({
          FilterDevice: response,
        })
      })
  }




  async componentDidMount() {
    this.getData()
    this.getFilterProject()
    // this.refreshData()

  }

  filter = async (event) => {

    //event.preventDefault();
    this.setState({ show_loading: true });

    var status = this.convertFilterValues(document.getElementById("status").value)

    var device_type = this.convertFilterValues(document.getElementById("device_type").value)

    var project = this.convertFilterValues(document.getElementById("location").value);
    //if (location === "false") { location = null }

    var device_sn = this.convertFilterValues(document.getElementById("device_sn").value);

    var msg_type = this.convertFilterValues(document.getElementById("msg_type").value);

    var from_date = document.getElementById("fdate").value;

    var to_date = document.getElementById("tdate").value

    var def_msg_type = null;
    var def_msg_status = null;

    // console.log(status, device_type, msg_type, project, device_sn, def_msg_type);

    if (msg_type === null) {
      def_msg_type = [3,4,1,5]
    }

    if (def_msg_status === null) {
      def_msg_status = [3, 4]
    }

    let url = new URL(URL2 + `messages/getMessages/`);
    const access_token = localStorage.getItem('access_token');
    await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'access_token': access_token
      },
      credentials: 'include',
      method: 'PATCH',
      mode: 'cors',
      body: JSON.stringify({
        def_msg_type: def_msg_type,
        def_msg_status:def_msg_status,
        message_type: msg_type,
        message_status: status,
        device_type: device_type,
        device_sn: device_sn,
        project: project,
        from_date: from_date,
        to_date: to_date,
      })
    })
      .then(response => response.json())
      .then((response) => {
        // console.log(response)
        this.setState(
          {
            data: response,
            data1: response
          })
      })

    // console.log(this.state.data)
  }

  onFilter = (e) => {
    const key = e.key;
    // console.log(key)
    if (key === "Backspace" || key === "Delete") {
      this.setState({
        isLoaded: false,
      })
      const filteredItems = this.state.data1.filter(
        row =>

          JSON.stringify(row.id)
            .toLowerCase()
            .indexOf(e.target.value.toLowerCase()) !== -1 ||

          JSON.stringify(row.name)
            .toLowerCase()
            .indexOf(e.target.value.toLowerCase()) !== -1 ||

          JSON.stringify(row.device_sn)
            .toLowerCase()
            .indexOf(e.target.value.toLowerCase()) !== -1 ||

          JSON.stringify(row.device_name)
            .toLowerCase()
            .indexOf(e.target.value.toLowerCase()) !== -1 ||

          JSON.stringify(row.project_name)
            .toLowerCase()
            .indexOf(e.target.value.toLowerCase()) !== -1 ||

          JSON.stringify(row.message_status_name)
            .toLowerCase()
            .indexOf(e.target.value.toLowerCase()) !== -1 ||

          JSON.stringify(row.message_type_name)
            .toLowerCase()
            .indexOf(e.target.value.toLowerCase()) !== -1 ||

          JSON.stringify(row.device_manufacturer_name)
            .toLowerCase()
            .indexOf(e.target.value.toLowerCase()) !== -1 ||

          JSON.stringify(row.message_source_name)
            .toLowerCase()
            .indexOf(e.target.value.toLowerCase()) !== -1

        // JSON.stringify(row.delivery_date)
        //   .toLowerCase()
        //   .indexOf(e.target.value.toLowerCase()) !== -1


      );
      // console.log(filteredrows)
      this.setState({
        data: filteredItems,
        isLoaded: true
      })
      // console.log('data',this.state.data)
    }
    else {
      // console.log(e.target.value)
      this.setState({
        isLoaded: false,
      })
      const filteredItems = this.state.data.filter(
        row =>

          JSON.stringify(row.id)
            .toLowerCase()
            .indexOf(e.target.value.toLowerCase()) !== -1 ||

          JSON.stringify(row.name)
            .toLowerCase()
            .indexOf(e.target.value.toLowerCase()) !== -1 ||

          JSON.stringify(row.device_sn)
            .toLowerCase()
            .indexOf(e.target.value.toLowerCase()) !== -1 ||

          JSON.stringify(row.device_name)
            .toLowerCase()
            .indexOf(e.target.value.toLowerCase()) !== -1 ||

          JSON.stringify(row.project_name)
            .toLowerCase()
            .indexOf(e.target.value.toLowerCase()) !== -1 ||

          JSON.stringify(row.message_status_name)
            .toLowerCase()
            .indexOf(e.target.value.toLowerCase()) !== -1 ||

          JSON.stringify(row.message_type_name)
            .toLowerCase()
            .indexOf(e.target.value.toLowerCase()) !== -1 ||

          JSON.stringify(row.device_manufacturer_name)
            .toLowerCase()
            .indexOf(e.target.value.toLowerCase()) !== -1 ||

          JSON.stringify(row.message_source_name)
            .toLowerCase()
            .indexOf(e.target.value.toLowerCase()) !== -1
      );
      // console.log(filteredItems)
      this.setState({
        data: filteredItems,
        isLoaded: true
      })
    }
    // console.log('data',this.state.data)
  }


  resetfilters = async () => {
    if (this.state.data.length != 0) {
      document.getElementById("status").selectedIndex = 0; //0 = option 1
      document.getElementById("device_type").selectedIndex = 0; //0 = option 1
      document.getElementById("device_sn").selectedIndex = 0; //0 = option 1
      document.getElementById("location").selectedIndex = 0; //0 = option 1
      this.setState({
        from: new Date(),
        to: new Date(),
      })
    }

    await this.getData()


  }

  onChangeProject = (e) =>{

    this.filter();
    this.getFilterDevicesPerProject(e);

  }

  render() {
    const { isLoaded } = this.state;
    return (
      <Container fluid className="main-content-container px-4">
        <Row noGutters style={{ paddingTop: "10px" }} className="mb-2">
          <Col lg="6" md="6" sm="12" className="mb-4">
            <PageTitle title={'O&M History'} className="page-header text-sm-left" />
          </Col>
        </Row>
        <div style={{ justifyContent: 'center', marginTop: '30px' }} >

          <div className="">
            <Row style={{ width: '100%', margin: '0 auto' }} >



              <Col lg="6" md="12" sm="12" className="mb-4" >
                {/* <p className="m-0 text-center cardtxt" >Total Power Generated</p> */}
                <Card small className="cardtip1">
                  <div className="p-0" style={{ backgroundColor: 'white', borderRadius: 'inherit', border: '1px solid #cfd1d4' }}>
                    <span className="ml-auto text-center text-bold"  >
                      <p class="cardstats">{this.state.errors_completed} <br /></p>
                    </span>
                    <div style={{ margin: "auto", width: "100%", alignContent: "center", alignItems: "center", marginBottom: '2px' }}>
                      {/* <img src={icon33} width={'100%'}></img> */}
                      <div className="text-center text-bold" style={{ backgroundColor: '#F5F6F8', width: '97%', marginLeft: '1.5%', marginTop: '-20px' }}>
                        <span class="cardheading">Closed Errors</span>
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
                  <div className="p-0" style={{ backgroundColor: 'white', borderRadius: 'inherit', border: '1px solid #cfd1d4' }}>
                    <span className="ml-auto text-center text-bold"  >
                      <p class="cardstats">{this.state.warnings_completed} <br /></p>
                    </span>
                    <div style={{ margin: "auto", width: "97.5%", alignContent: "center", alignItems: "center", marginBottom: '2px' }}>
                      {/* <img src={icon36} width={'100%'}></img> */}
                      <div className="text-center text-bold" style={{ backgroundColor: '#F5F6F8', width: '97%', marginLeft: '1.5%', marginTop: '-20px' }}>
                        <span class="cardheading">Closed Warnings</span>
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
          <Col lg="12" md="12" sm="12" className="mb-4">
            <Card className="mb-4" small>
      
                <Row className="align-items-center" style={{margin: 'initial'}}>
                  <Col sm={1} className="my-1">
                    <FormSelect aria-label="Default select example" name="msg_type" id="msg_type" onChange={this.filter}>
                      <option selected disabled value={false}>Type</option>
                      <option value="3">Error</option>
                      <option value="4">Warning</option>
                      <option value="1">Normal</option>
                      <option value="5">Information</option>
                    </FormSelect>
                  </Col>
                  <Col sm={1} className="my-1">
                    <FormSelect aria-label="Default select example" name="location" id="location" onChange={this.onChangeProject}>
                      <option selected disabled value={false}>Project</option>
                      {this.state.FilterProject.map(
                        (p) =>

                          <option key={p.name} value={p.id}>
                            {p.name}
                          </option>
                      )
                      }
                    </FormSelect>
                  </Col>

                  <Col sm={1} className="my-1">
                    <FormSelect aria-label="Default select example" name="device_sn" id="device_sn" onChange={this.filter}>
                      <option selected disabled value={false}>Device</option>
                      {this.state.FilterDevice.map(
                        (d) =>

                          <option key={d.device.sn} value={d.device.sn}>
                            {d.device.sn}
                          </option>
                      )
                      }
                    </FormSelect>
                  </Col>

                  <Col sm={1} className="my-1">
                    <FormSelect aria-label="Default select example" name="device_type" id="device_type" onChange={this.filter}>
                      <option selected disabled value={false}>Type</option>
                      <option value="2">Fronuis</option>
                      <option value="1">SMA</option>
                    </FormSelect>
                  </Col>

                  <Col sm={2} className="my-1">
                    <div>
                      {/* <label for="exampleInputPassword1">From</label> */}
                      <input type="date" class="form-control" placeholder="Choose From Date" name="INV-start-date" id="fdate" 
                        defaultValue={this.state.from} onChange={this.filter}
                      ></input>
                    </div>
                  </Col>
                  <span> to </span>
                  <Col sm={2} className="my-1">
                    <div>
                      {/* <label for="exampleInputPassword1">To</label> */}
                      <input type="date" class="form-control" placeholder="Enter To Date" name="INV-start-date" id="tdate" 
                        defaultValue={this.state.to} onChange={this.filter}
                      ></input>
                    </div>
                  </Col>

                 
                  <Col sm={1} className="my-1">
                    <FormSelect aria-label="Default select example" name="status" id="status" onChange={this.filter}>
                      <option selected disabled value={false}>Status</option>
                      <option value="3">Closed</option>
                      <option value="4">Normal</option>
                    </FormSelect>
                  </Col>
                  <span style={{ fontSize: '14px', marginLeft: '5px', color: 'blue', cursor: 'pointer' }} onClick={this.resetfilters}>Reset Filters</span>

                  <Col sm={2}>
                    <input style={{ border: '1px solid black' }} class="form-control" id="search" type="text" placeholder="Search..." onKeyUp={this.onFilter}></input>
                  </Col>
                </Row>
            </Card>


          </Col>
        </Row>
        <Row>
          {isLoaded ? (

            <Col lg="12" md="12" sm="12" className="mb-4">

              <Card small>
              <DataTable
                  columns={this.state.columns}
                  data={this.state.data}
                  highlightOnHover={true}
                  style={{overflow:'wrap'}}
                  conditionalRowStyles={this.state.conditionalRowStyles}
                  customStyles = {this.state.customStyles}
                  expandableRows
                  expandableRowsComponent={
                    ({ data }) => 

                    <div className="p-3">

                    <h6>Comments:</h6>
                    <ListGroup as="ol" variant="flush">
                    {data.comments.map((c) => 
                     <ListGroup.Item as="li">
                     {c}
                     </ListGroup.Item>
                    )}
                    </ListGroup>
                    </div>
                  
                  }
                  sortServer
                  pagination
                />
              </Card>
            </Col>


          ) : (<L></L>)}
        </Row>
      </Container>
    );
  }
}
export default O_M_historical_Dashboard