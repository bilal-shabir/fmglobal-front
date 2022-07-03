import React from "react";
import { Modal, Button, select, Alert, CardImg } from "react-bootstrap";
import { Container, Row, Col, Card} from "shards-react";
import { URL3, URL2, DKEY } from "../../constants";
import "../../assets/O_M_dashboard.css";
import PageTitle from "../../components/common/PageTitle";
import L from "../../components/components-overview/loader";
import TimePicker from 'react-bootstrap-time-picker';
import { timeFromInt } from 'time-number';
import Spinner from 'react-bootstrap/Spinner';
import ParameterTable from "../../components/components-overview/ParameterTable";

class UsersView extends React.Component {
  constructor(props) {
    super(props);

    const userIs_logged = localStorage.getItem("is_logged");
    if (userIs_logged != 1) {
      this.props.history.push("/login");
    }


    //require('../../utils').checkpermision('O_M_parameter')


    this.state = {
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
      ExpandedComponent: null,
      isOpen: false,
      value_time: "00:00",
      start_time: "00:00",
      end_time: "00:00",
      project: [],
      devices: [],
      device_id: 0,
      device_manufacturer_id: 0,
      parameters: [],
      msgs_types: [],
      project_device_id: 0,
      show_loading: false,
      is_null: 0,
      is_email: 0,
      is_signal: 0,
      isOpenButton: false,
      rowStatus: null,
      rowId: null
    };
  }

  addZero(i) {
    if (i < 10) {i = "0" + i}
    return i;
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

  handleShowCreate() {
    this.setState({
      isOpen: true
    })
  }

  closeModal = () => {
    this.setState({
      isOpen: false
    })
  }

  handleTimeChange = (start_time) => {
    // console.log(start_time);
    const s = timeFromInt(start_time);
    this.setState({ start_time: s });
  }



  handleEndTimeChange = (end_time) => {
    // console.log(end_time);
    const e = timeFromInt(end_time);
    // console.log(e)
    this.setState({ end_time: e });
  }

  getProjects = async () => {
    // console.log(event.target.value);
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
        this.setState({
          project: response,
        })
      })
  }

  handelProjectChange = async (event) => {
    // console.log(event.target.value);
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
          devices: response,
        })
      })
    // console.log(this.state.devices)

  }

  handelDeviceChange = async (event) => {
    // console.log(event.target.value);


    let d_id = 0;
    for (const dev of this.state.devices) {
      // console.log(dev)
      // console.log(dev.device.id == event.target.value)
      if (dev.device.id == event.target.value) {
        d_id = dev.device.device_manufacturer.id
      }
    }
    //console.log(event.target.value,d_id)

    const access_token = localStorage.getItem('access_token');
    await fetch(URL2 + 'parameter/getByDevice/' + d_id, {
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
          parameters: response,
        })
      })
    //console.log(this.state.parameters)
  }

  handelParameterChange = async (event) => {
    // console.log(event.target.value);

    const access_token = localStorage.getItem('access_token');

    await fetch(URL2 + 'message-type/', {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'access_token': access_token
      },
      credentials: 'include'
    }).then(response => response.json())

      .then(response => {
        // console.log(response)
        let types = []
        const error = response.find(row => row.name == "Error")
        const warning = response.find(row => row.name == "Warning")

        types.push(error, warning)

        // console.log(types)
        this.setState({
          msgs_types: types,
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



  getProjectDevice = async (p, d) => {

    const access_token = localStorage.getItem('access_token');
    await fetch(URL2 + 'project-device/getProjectDeviceID/' + p + '/' + d, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'access_token': access_token
      },
      credentials: 'include'
    }).then(response => response.json())

      .then(response => {
        // console.log(response[0].id)
        this.setState({
          project_device_id: response[0].id,
        })
      })

    return this.state.project_device_id
  }

  handelNullChange = () => {

    if (this.state.is_null == 1) {
      this.setState({
        is_null: 0
      })
    } else if (this.state.is_null == 0) {
      this.setState({
        is_null: 1
      })
    }

  }

  handelEmailChange = () => {

    if (this.state.is_email == 1) {
      this.setState({
        is_email: 0
      })
    } else if (this.state.is_email == 0) {
      this.setState({
        is_email: 1
      })
    }

  }

  handelSignalChange = () => {

    if (this.state.is_signal == 1) {
      this.setState({
        is_signal: 0
      })
    } else if (this.state.is_signal == 0) {
      this.setState({
        is_signal: 1
      })
    }

  }

  async getData(){
    const ws =  new WebSocket(URL3);
    let parameters = [];
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
        parameters.unshift(...json.projectParameter);
       
        
  
        this.setState(
          {
            data: parameters,
            
            columns: [
              {
                name: "Date & Time",
                selector: (row) => this.formatDate(row.created_at),
                sortable: true,
                wrap: true,
                grow:0,
              },
              {
                name: "Parameter",
                selector: (row) => row.parameter_id.name,
                sortable: true,
                grow: 1,
              },
              {
                name: "Project",
                selector: (row) => row.project_device.project.name,
                sortable: true,
                wrap: true,
                grow:0.5,
              },
              {
                name: "Device Type",
                selector: (row) => row.parameter_id.device_manufacturer.name,
                sortable: true,
                grow: 0.5,
              },
              {
                name: "device",
                selector: (row) => row.project_device.device.sn,
                sortable: true,
                grow:0.5,
              },
              {
                name: "Min Value",
                selector: (row) =>row.min_value,
                sortable: true,
                wrap: true,
                sortable: true,
                grow:0.5,
                //format: row => `${row.name.slice(0, 500)}...`,
              },
              {
                name: "Max Value",
                selector: (row) => row.max_value,
                sortable: true,
                wrap: true,
                grow:0.5,
              },
              {
                name: "Start Time",
                selector: (row) => row.start_time,
                sortable: true,
                grow: 0.5,
              },
              {
                name: "End Time",
                selector: (row) => row.end_time,
                sortable: true,
                grow: 0.5,
              },
              {
                name: "Type",
                selector: (row) => row.type,
                sortable: true,
                grow: 0.5,
              },
              {
                name: "Empty ?",
                selector: (row) => this.getBoolean(row.is_null),
                sortable: true,
                grow: 0,
              },
              {
                name: "Email ?",
                selector: (row) => this.getBoolean(row.is_email),
                sortable: true,
                grow: 0,
              },
              {
                name: "Signal ?",
                selector: (row) => this.getBoolean(row.is_signal),
                sortable: true,
                grow: 0,
              },
              {
                name: "Added By",
                //selector: (row) => row.created_by.name,
                sortable: true,
                grow: 0.5,
              },
              // { 
              //   button: true,
              //   cell: () => <button onClick={this.TableclickHandler}>Process</button>
              // }
            ],
            // conditionalRowStyles: [
            //   {
            //     when: (row) => row.message_type.name === "Error",
            //     style: {
            //       ////backgroundColor: "#F7D1D1",
            //       color: "red",
            //       "&:hover": {
            //         cursor: "pointer",
            //       },
            //     },
            //   },
            //   {
            //     when: (row) => row.message_type.name === "Warning",
            //     style: {
            //       color: "rgb(255,174,66,0.9)",
            //       "&:hover": {
            //         cursor: "pointer",
            //       },
            //     },
            //   },
            //   {
            //     when: (row) => row.ID == this.state.max_id && this.state.hilight,
            //     style: {
            //       color: "white",
            //       backgroundColor: "#F85A5A",
            //       "&:hover": {
            //         cursor: "pointer",
            //       }, 
            //     },
            //   },
            //   {
            //     when: (row) => row.message_type.name === "Normal",
            //     style: {
            //       color: "green",
            //       "&:hover": {
            //         cursor: "pointer",
            //       },
            //     },
            //   },
            // ],
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
          }
        )
        
        // var mpath = require('mpath');
        // console.log(mpath.get('0.device.projects_devices[0].id',messages )) 
  }
    }

    getBoolean = (value) => {

      if(value === 1){
        value = 'No'// flase
        return value 
      }else {
        value = 'Yes'// true
        return value 
      }

    }

  handelSubmit = async (event) => {

    event.preventDefault();
    this.setState({ show_loading: true });

    var min_value = document.getElementById("min_value").value;
    var max_value = document.getElementById("max_value").value;
    var start_time = this.state.start_time;
    var end_time = this.state.end_time;
    var type = document.getElementById("type").value;
    var is_email = this.state.is_email;
    var is_signal = this.state.is_signal;
    var is_null = this.state.is_null;


    var parameter_id = document.getElementById("parameter").value;

    var project_id = document.getElementById("project").value;
    var device_id = document.getElementById("device").value;

    if(!min_value || !max_value || !start_time || !end_time || !type || !is_email || !is_signal || !is_null || !parameter_id || !project_id || !device_id){
      alert("Please make sure to Fill the form")
      this.setState({ show_loading: false });
    }else{

      var project_device = await this.getProjectDevice(project_id, device_id)
  
  
      const access_token = localStorage.getItem('access_token');
      await fetch(URL2 + 'project-parameter/addParameter', {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'access_token': access_token
        },
        credentials: 'include',
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify({
          min_value: min_value, max_value: max_value, start_time: start_time, end_time: end_time,
          type: type, is_email: is_email, is_signal: is_signal, is_null: is_null, parameter_id: parameter_id, project_device: project_device
        })
      })
        .then(response => response.json())
        .then((response) => {
          // console.log(response)
          if (response.result === true) {
            alert('Parameter Added Succesfuly')
            this.setState({ show_loading: false });
            this.closeModal()
          }else {
            alert('Parameter Was Not Added Succesfuly')
            this.setState({ show_loading: false });
            this.closeModal()
          }
        })

    }
  }

  
  async componentDidMount() {
    this.getData()
    // this.refreshData()
    
  }

  render() {
    const {isLoaded} = this.state;
    return (
      <Container fluid className="main-content-container px-4">

        <Row noGutters style={{ paddingTop: "10px" }} className="mb-2">
          <Col lg="6" md="6" sm="12" className="mb-4">
           <PageTitle title={'O&M Parameters'}  className="page-header text-sm-left" /> 
          </Col>
          <Col lg="6" md="6" sm="12" className="mb-4">
            <button className="btn btn-primary" onClick={this.handleClick} style={{backgroundColor:'#004769', borderColor:'#004769', float:'right',fontSize: '20px'}}>Add</button>
          </Col> 
        </Row>

        <span>
          <Modal
            show={this.state.isOpen}
            onHide={this.closeModal}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered>
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-vcenter">
                Adding Parameter
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form onSubmit={this.handelSubmit}>
                <ul class="list-group list-group-flush">
                  <li class="list-group-item p-3">
                    <div class="row">
                      <div class="col-sm-12 col-md-6">

                        <div class="form-group">
                            <label >Project</label>
                            <select class="form-control"  aria-label="project select" name="project" id="project" onChange={this.handelProjectChange} required
                            >
                              <option disabled selected value> -- select an option -- </option>
                              {this.state.project.map((p) => 
                                <option key={p.id } value={p.id}>   
                                        {  p.name}
                                </option>
                              )}
                            </select>
                        </div>
                        <div class="form-group">
                            <label >Parameter</label>
                            <select class="form-control"  aria-label="parameter select" name="parameter" id="parameter" onChange={this.handelParameterChange} required>
                              <option disabled selected value> -- select an option -- </option>
                              {this.state.parameters.map((prm) => 
                                <option key={prm.id } value={prm.id}>   
                                        {  prm.name}
                                </option>
                              )}
                            </select>
                        </div>
                        <div class="form-group">
                            <label >Start Time</label>
                            <TimePicker format={24} step="5"
                                onChange={this.handleTimeChange} value={this.state.start_time}
                            />
                        </div>
                        <div class="form-group">
                            <label >Minimum value</label>
                            <input type="number" class="form-control"  placeholder="" name="min_value" id="min_value"  required></input>
                        </div>

                      </div>


                      <div class="col-sm-12 col-md-6">
                        <div class="form-group">
                            <label >Device</label>
                            <select class="form-control"  aria-label="device select" name="device" id="device" onChange={this.handelDeviceChange} required>
                              <option disabled selected value> -- select an option -- </option>
                              {this.state.devices.map((d) => 
                                <option key={d.device.id } value={d.device.id}>   
                                        {d.device.desc +' - '+ d.device.sn}
                                </option>
                              )}
                            </select>
                        </div>
                        <div class="form-group">
                            <label >Message Type</label>
                            <select class="form-control"  aria-label="parameter select" name="type" id="type" required>
                              <option disabled selected value> -- select an option -- </option>
                              {this.state.msgs_types.map((msg) => 
                                <option key={msg.id } value={msg.name}>   
                                        {msg.name}
                                </option>
                              )}
                            </select>
                        </div>
                        <div class="form-group">
                            <label >End Time</label>
                            <TimePicker format={24} step="5" 
                              onChange={this.handleEndTimeChange} start={this.state.start_time} value={this.state.end_time}
                            />
                        </div>
                        <div class="form-group">
                            <label >Maximum value</label>
                            <input type="number" class="form-control"  placeholder="" name="max_value" id="max_value"  required></input>
                        </div>
                      </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-12 col-md-4">
                          <div class="form-check form-check-inline">
                              <input type="checkbox" class="form-check-input"  placeholder="" name="is_null" id="is_null" onChange={this.handelNullChange}></input>
                              <label class="form-check-label">Allow Empty</label>
                          </div>
                        </div>
                        <div class="col-sm-12 col-md-4">
                          <div class="form-check form-check-inline" inline>
                              <input type="checkbox" class="form-check-input"  placeholder="" name="is_email" id="is_email" onChange={this.handelEmailChange}></input>
                              <label class="form-check-label">Send Email</label>
                          </div>
                        </div>
                        <div class="col-sm-12 col-md-4">
                          <div class="form-check form-check-inline" inline>
                              <input type="checkbox" class="form-check-input"  placeholder="" name="is_signal" id="is_signal" onChange={this.handelSignalChange}></input>
                              <label class="form-check-label">Send Signal</label>
                          </div>
                        </div>
                    </div>
                  </li>
                </ul>
                <button class="button submit" type="submit">
                  {
                      this.state.show_loading  &&
                      <div style={{display:'inline-block',paddingRight:'5px'}}>
                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true"/>
                        <span className="sr-only">Loading...</span>
                      </div>
                  } 
                  ADD
                </button>
              </form>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.closeModal}>Close</Button>
            </Modal.Footer>
          </Modal>
        </span>


        <Row>
        {isLoaded ? (
         
            <Col lg="12" md="12" sm="12" className="mb-4">
            
              <Card small>
                <ParameterTable columns={this.state.columns} data={this.state.data} conditionalRowStyles={this.state.conditionalRowStyles} customStyles={this.state.customStyles}></ParameterTable>
              </Card>
            </Col>
         
          
        ) :(<L></L>)}
        </Row>
       
        
                        
                    
      </Container>
    );
  }

}
export default UsersView