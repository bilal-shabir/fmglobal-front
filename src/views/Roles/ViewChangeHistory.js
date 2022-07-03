import React from "react";
import { Modal, Button, select, Alert, CardImg, Form, InputGroup, FormControl } from "react-bootstrap";
import { Tooltip, Container, Row, Col, Card, FormSelect } from "shards-react";
import { URL3, URL2, DKEY } from "../../constants";
// import "../assets/O_M_Dashboard.css";
import PageTitle from "../../components/common/PageTitle";
import L from "../../components/components-overview/loader";
import TimePicker from 'react-bootstrap-time-picker';
import { timeFromInt } from 'time-number';
import Spinner from 'react-bootstrap/Spinner';
import DataTable from "react-data-table-component";
import ParameterTable from "../../components/components-overview/ParameterTable";


class ViewChangeHistory extends React.Component {
  constructor(props) {
    super(props);

    const userIs_logged = localStorage.getItem("is_logged");
    if (userIs_logged != 1) {
      this.props.history.push("/login");
    }


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
      rowId: null,
      show: false,
      deleteRowid: null,
      showEdit: false,
      editRow: null,
      showCopy: false,
      copyRow: null,
      edit_start_time: "00:00",
      edit_end_time: "00:00",
    };
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

  closeDeleteModal = () => {
    this.setState({
      show: false
    })
  }

  closeEditModal = () => {
    this.setState({
      showEdit: false
    })
  }

  closeCopyModal = () => {
    this.setState({
      showCopy: false
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


  handleEditTimeChange = (edit_start_time) => {
    // console.log(start_time);
    const s = timeFromInt(edit_start_time);
    this.setState({ edit_start_time: s });
  }



  handleEditEndTimeChange = (edit_end_time) => {
    // console.log(end_time);
    const e = timeFromInt(edit_end_time);
    // console.log(e)
    this.setState({ edit_end_time: e });
  }


  editStartTimeValue = (v) => {
    this.setState({ edit_start_time: v });
  }

  editEndTimeValue = (v) => {
    this.setState({ edit_end_time: v });
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


  checked = (value) => {

    if (value === 1) {
      return true
    } else {
      return false
    }
  }


  getBoolean = (value) => {

    if (value === 1) {
      value = 'Yes'// flase
      return value
    } else {
      value = 'No'// true
      return value
    }

  }

  resetValues = () => {
    this.setState({
      // show_loading: false 
    });
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

    if (!min_value || !max_value || !start_time || !end_time || !type || !parameter_id || !project_id || !device_id) {
      alert("Please make sure to Fill the form")
      this.setState({ show_loading: false });
    } else {

      var project_device = await this.getProjectDevice(project_id, device_id)


      const access_token = localStorage.getItem('access_token');
      const response = await fetch(URL2 + 'project-parameter/addParameter', {
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
      const json = await response.json();

      // console.log(json)
      if (json.status === false) {

        alert('Parameter Was Not Added Succesfuly')
        this.setState({ show_loading: false });
        this.closeModal()
      } else {
        alert('Parameter Added Succesfuly')

        //console.log(json.last_row)
        let data3 = this.state.data
        if (data3.length > 0) {
          data3.unshift(...json.last_row)
        } else {
          data3.push(json.last_row)
        }

        //console.log(data3)

        this.setState({
          show_loading: false,
          data: data3
        });

        this.closeModal()

      }


    }
  }


  edit_handelSubmit = async (event) => {

    event.preventDefault();
    this.setState({ show_loading: true });

    // console.log(this.state.editRow)
    // console.log("=========================")


    var edit_min_value = document.getElementById("edit_min_value").value;
    var edit_max_value = document.getElementById("edit_max_value").value;
    var edit_start_time = this.state.start_time;
    var edit_end_time = this.state.end_time;
    var edit_type = document.getElementById("edit_type").value;
    var edit_is_email = this.state.is_email;
    var edit_is_signal = this.state.is_signal;
    var edit_is_null = this.state.is_null;
    var edit_id = this.state.editRow.id




    if (this.state.editRow.min_value === edit_min_value && this.state.editRow.max_value === edit_max_value &&
      this.state.editRow.start_time === edit_start_time && this.state.editRow.end_time === edit_end_time &&
      this.state.editRow.type === edit_type && this.state.editRow.edit_is_email === edit_is_email &&
      this.state.editRow.is_signal === edit_is_signal && this.state.editRow.is_null === edit_is_null
    ) {
      alert("Error : No Changes Were Made!")
      this.setState({ show_loading: false });
    } else {

      const access_token = localStorage.getItem('access_token');
      const response = await fetch(URL2 + 'project-parameter/updateParameter', {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'access_token': access_token
        },
        credentials: 'include',
        method: 'PUT',
        mode: 'cors',
        body: JSON.stringify({
          id: edit_id,
          min_value: edit_min_value,
          max_value: edit_max_value,
          start_time: edit_start_time,
          end_time: edit_end_time,
          type: edit_type,
          is_email: edit_is_email,
          is_signal: edit_is_signal,
          is_null: edit_is_null,
        })
      })
      const json = await response.json();

      // console.log(json)
      if (json.status === false) {

        alert('Parameter Was Not Updated Succesfuly')
        this.setState({ show_loading: false });
        this.closeEditModal()
      } else {
        alert('Parameter Updated Succesfuly')


        this.setState({
          show_loading: false,
          data: json.arrayOfActiveParameter
        });

        this.closeEditModal()
      }


    }
  }

  copyRow(id) {

    // console.log(id)

  }

  editRow(id) {

    // console.log(id)

  }

  async deleteRow(rid) {

    this.setState({ show_loading: true });

    const access_token = localStorage.getItem('access_token');
    const response = await fetch(URL2 + 'project-parameter/deleteParameter/', {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'access_token': access_token
      },
      credentials: 'include',
      method: 'PUT',
      mode: 'cors',
      body: JSON.stringify({ id: rid, is_active: false })
    })
    const json = await response.json();
    // console.log(json)
    if (json.status === false) {

      alert('Parameter Was Not Deleted, Please try again later!')
      this.setState({ show_loading: false });
      this.closeDeleteModal()
    } else {
      alert('Parameter Deleted Succesfuly')


      this.setState({
        show_loading: false,
        data: json.arrayOfActiveParameter
      });

      this.closeDeleteModal()
    }
  }

  handelEditRow(row) {
    // console.log('hi edit')
    this.setState({
      showEdit: true,
      editRow: row
    })

    // console.log(this.state.showEdit)
    // console.log(this.state.editRow)


  }

  handelCopyRow(row) {
    // console.log('hi copy')
    this.setState({
      showCopy: true,
      copyRow: row
    })

    // console.log(this.state.showCopy)
    // console.log(this.state.copyRow)


  }

  DeleteConfirmation(id) {

    // console.log('hi')
    this.setState({
      show: true,
      deleteRowid: id
    })

    // console.log(this.state.show)
    // console.log(this.state.deleteRowid)
  }

  // async getParameters() {
  //   const access_token = localStorage.getItem('access_token');
  //   await fetch(URL2 + 'project-parameter/getParameters', {
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Accept': 'application/json',
  //       'access_token': access_token
  //     },
  //     credentials: 'include'
  //   }).then(response => response.json()).then(response => {
  //     this.setState(
  //       {
  //         data: response,

  //         columns: [
  //           {
  //             name: "ID",
  //             selector: (row) => this.formatDate(row.created_at),
  //             sortable: true,
  //             wrap: true,
  //             grow: 0,
  //           },
  //           {
  //             name: "Description",
  //             selector: (row) => row.parameter_id.name,
  //             sortable: true,
  //             grow: 1,
  //           },
  //           {
  //             name: "Module",
  //             selector: (row) => row.project_device.project.name,
  //             sortable: true,
  //             wrap: true,
  //             grow: 0.5,
  //           },
  //           {
  //             name: "Date",
  //             selector: (row) => row.parameter_id.device_manufacturer.name,
  //             sortable: true,
  //             grow: 0.5,
  //           },
  //           {
  //             name: "User",
  //             selector: (row) => row.project_device.device.sn,
  //             sortable: true,
  //             grow: 0.5,
  //           },
           
  //           {
  //             cell: row => <span onClick={this.DeleteConfirmation.bind(this, row.id)} style={{ cursor: 'pointer' }}><i class="material-icons" style={{ fontSize: '15px', color: 'red' }}>delete</i></span>,
  //             allowOverflow: true,
  //             button: true,
  //             width: '40px',
  //           },
  //         ],

  //         customStyles: {
  //           headCells: {
  //             style: {
  //               color: '#202124',
  //               fontSize: '14px',
  //             },
  //           },
  //           rows: {
  //             highlightOnHoverStyle: {
  //               backgroundColor: 'rgb(230, 244, 244)',
  //               borderBottomColor: '#FFFFFF',
  //               borderRadius: '25px',
  //               outline: '1px solid #FFFFFF',
  //             },
  //           },
  //           pagination: {
  //             style: {
  //               border: 'none',
  //             },
  //           },
  //         },
  //         isLoaded: true,
  //       }
  //     )
  //   })
  // }

  async componentDidMount() {
    // this.getParameters()
    // this.refreshData()

  }

  render() {
    const { isLoaded, editRow } = this.state;
    return (
      <Container fluid className="main-content-container px-4">

        <Row noGutters style={{ paddingTop: "10px" }} className="mb-2">
          <Col lg="6" md="6" sm="12" className="mb-4">
            <PageTitle title={'View Change History'} className="page-header text-sm-left" />
          </Col>
          <Col lg="6" md="6" sm="12" className="mb-4">
            <button className="btn btn-primary" onClick={this.handleClick} style={{ backgroundColor: '#004769', borderColor: '#004769', float: 'right', fontSize: '20px' }}>Export</button>
          </Col>
        </Row>
        <Row>
          <Col lg="12" md="12" sm="12" className="mb-4">
            <Card className="mb-4" small>
      
                <Row className="align-items-center" style={{margin: 'initial'}}>
                  <Col  sm={1} className="my-1">
                    <FormSelect  style={{  width: '280px' }} aria-label="Default select example" name="xero_contact" id="xero_contact" >
                      <option selected disabled value={false}>filter 1</option>
                   

                    </FormSelect>
                  </Col>

                  <Col  sm={1} className="my-1">
                    <FormSelect  onChange={this.handleProjectChange} style={{  width: '280px', marginLeft:'250px' }} aria-label="Default select example" name="xero_project" id="xero_project">
                      <option selected disabled value={false}>filter 2</option>
         
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

        <Row>
          {isLoaded ? (

            <Col lg="12" md="12" sm="12" className="mb-4">

              <Card style={{ marginBottom: '10px' }} small>

                {/* <Row className="align-items-center" style={{ margin: 'initial' }}>
                  <Col sm={1} className="my-1">
                    <FormSelect aria-label="Default select example" name="EmpId" id="EmpId" >
                      <option selected disabled value={false}>Filter 1</option>
                      <option value="3">PW058</option>

                    </FormSelect>
                  </Col>

                  <Col sm={1} className="my-1">
                    <FormSelect aria-label="Default select example" name="Staff_name" id="Staff_name" >
                      <option selected disabled value={false}>Filter 2</option>
                      <option value="3">Mohammed Alhawaj</option>
                    </FormSelect>
                  </Col>
                  <span style={{ fontSize: '14px', marginLeft: '45px', color: 'blue', cursor: 'pointer' }} onClick={this.resetfilters}>Reset Filters</span>

                  <Col sm={2}>
                    <input style={{ width: '130px', border: '1px solid black' }} class="form-control" id="search" type="text" placeholder="Search..." onKeyUp={this.onFilter}></input>
                  </Col>
                </Row> */}

              </Card>

              <Card small>
                <DataTable
                  columns={this.state.columns}
                  data={this.state.data}
                  highlightOnHover={true}
                  style={{ overflow: 'wrap' }}
              
                  sortServer
                  pagination
                />

              </Card>
            </Col>


          ) : (<L></L>)}
        </Row>



        {/* ------- DELETE CONFORMATION FORM -------- */}
        <span>
          <Modal
            show={this.state.show}
            onHide={this.closeDeleteModal}
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>Delete Confirmation</Modal.Title>
            </Modal.Header>
            <Modal.Body><div className="alert alert-danger">Are you sure you want to delete this change record?</div></Modal.Body>
            <Modal.Footer>
              <Button variant="default" onClick={this.closeDeleteModal}>
                Cancel
              </Button>
              <Button variant="danger" onClick={this.deleteRow.bind(this, this.state.deleteRowid)} >
                Delete
              </Button>
            </Modal.Footer>
          </Modal>
        </span>

        {/* ------- DELETE CONFORMATION FORM -------- */}





      </Container>
    );
  }

}
export default ViewChangeHistory