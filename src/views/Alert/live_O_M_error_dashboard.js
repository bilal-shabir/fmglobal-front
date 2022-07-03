import React from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { Container, Row, Col } from "shards-react";
import { URL3, URL2 } from "../../constants";
import { Card, FormSelect } from "shards-react";
import "../../assets/O_M_dashboard.css";
import PageTitle from "../../components/common/PageTitle";
import DataTable from "react-data-table-component";
import L from "../../components/components-overview/loader";
import Spinner from 'react-bootstrap/Spinner';


class live_O_M_error_dashboard extends React.Component {
  constructor(props) {
    super(props);



    const userIs_logged = localStorage.getItem("is_logged");
    if (userIs_logged != 1) {
      this.props.history.push("/login");
    }

    //require('../../utils').checkpermision('O_M_error')


    this.state = {
      errors_completed: 0,
      errors_inProgress: 0,
      errors_new: 0,
      warnings_completed: 0,
      warnings_inProgress: 0,
      warnings_new: 0,
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
      data1: [],
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
      disabled: true,
      msg_status: null,
      n_status: "New",
      FilterProject: [],
      FilterDevice: [],
      FilterStatus: [],
      from: new Date(),
      to: new Date(),
    };

    this.handelTableSelect = this.handelTableSelect.bind(this);
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

    if (device_manufacturer_name === "SMA") {
      return "S"
    }
    if (device_manufacturer_name === "Fronius") {
      return "F"
    }
    else {
      return 'N/R'
    }
  }

  handelTableSelect = (event) => {
    //event.preventDefault();
    // console.log(event.target.value)
    this.setState({
      rowStatus: event.target.value,
      rowId: event.target.id
    })

    if (event.target.value === 'In-Progress') {
      this.setState({
        disabled: !this.state.disabled,
      })
    }

    // console.log(this.state.disabled)
  }

  returnOptions = (id, status) => {

    if (status === 'New') {

      this.setState({
        msg_status: status
      })

      return (
        <FormSelect name="status" id={id} size="sm" className="mb-2" onChange={this.handelTableSelect}>
          <option selected value={status}>{status}</option>
          <option value="In-Progress">In-Progress</option>
          <option value="Closed">Closed</option>
        </FormSelect>
      )
    } else {

      this.setState({
        msg_status: status
      })

      return (
        <FormSelect name="status" id={id} size="sm" className="mb-2" onChange={this.handelTableSelect}>
          <option value={status}>{status}</option>
          <option value="Closed">Closed</option>
        </FormSelect>
      )
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

  formatType = (name) => {

    if (name === "Error") {
      return "E"
    } else if (name === "Warning") {
      return "W"
    }

  }

  returnButton = (row) => {
    return <button onClick={this.TableclickHandler}>Process</button>
  }

  returnDeviceName = (dname) => {

    if (dname !== null) {
      return dname
    } else {
      return "Not Available"
    }

  }

  returnMessageSource = (source) => {
    if (source === "PRM") {
      return "P"
    } else if (source === "INV") {
      return "I"
    } else {
      return "Not Recognized"
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
      // console.log(event)
      let json = JSON.parse(event.data);
      // console.log(json)
      const error_messages_ids = json.error_messages.map(message => message.id);

      messages = messages.filter(message => !error_messages_ids.includes(message.id));

      // option 1
      messages.unshift(...json.error_messages);

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
              style: { "padding-left": 0, "padding-right": 0, "box-sizing": 'content-box' }
            },
            {
              name: "",
              selector: (row) => row.id,
              sortable: true,
              //grow:0,
              width: "40px",
              style: { "padding-left": 0, "padding-right": 0, "box-sizing": 'content-box' }
            },
            {
              name: "",
              selector: (row) => this.returnMessageSource(row.message_source_name),
              sortable: true,
              //grow:0,
              width: "30px",
              style: { "padding-left": 0, "padding-right": 0, "box-sizing": 'content-box' }
            },
            {
              name: "",
              selector: (row) => this.returnDeviceType(row.device_manufacturer_name),
              sortable: true,
              //grow:0,
              width: "30px",
              wrap: true,
              style: { "padding-left": 0, "padding-right": 0, "box-sizing": 'content-box' }
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
              selector: (row) => row.message_status_name,
              // sortable: true,
              grow: 1,

            },
          ],
          conditionalRowStyles: [
            {
              when: (row) => row.message_type_name === "Error",
              style: {
                color: "red",
                "&:hover": {
                  cursor: "pointer",
                },
              },
            },
            {
              when: (row) => row.message_type_name === "Warning",
              style: {
                color: "#ffb400",
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
              Height: '30px', // override the row height
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
          errors_inProgress: json.errors_inProgress,
          errors_new: json.errors_new,
          warnings_new: json.warnings_new,
          warnings_inProgress: json.warnings_inProgress,
          Info: json.Info,
          ok_checks: json.Normal,
        }
      )
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

  closeModal = () => {
    this.setState({
      isOpen: false
    })
  }


  handelTableSelect(event) {
    //event.preventDefault();
    // console.log(event.target.value)
    this.setState({
      rowStatus: event.target.value,
      rowId: event.target.id
    })

    if (event.target.value !== 'New') {
      this.setState({
        disabled: false,
      })
    }
  }


  getFilterProject = async () => {

 
    await fetch(URL2 + 'project/', {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',

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


  getStatus = async (event) => {

    const access_token = localStorage.getItem('access_token');
    await fetch(URL2 + 'message-status', {
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
          FilterStatus: response,
        })
      })
  }



  async componentDidMount() {
    this.getData()
    this.getFilterProject()
    this.getStatus()
    //this.getFilterDevices()
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
      def_msg_type = [3, 4]
    }

    if (def_msg_status === null) {
      def_msg_status = [1, 2]
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


  processAlert = async (event) => {

    event.preventDefault();
    this.setState({ show_loading: true });

    var rowStatus = this.state.rowStatus;
    var rowId = this.state.rowId
    // console.log(rowId)
    // console.log(rowStatus)
    var msg = document.getElementById("msg").value;
    // console.log(msg)

    if (!rowStatus || !rowId) {
      alert("Please Change the status")
      this.setState({ show_loading: false });
      this.TablecloseModal()
    } else {

      const access_token = localStorage.getItem('access_token');
      await fetch(URL2 + 'message/processAlert', {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'access_token': access_token
        },
        credentials: 'include',
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify({ id: rowId, status: rowStatus, comments: msg })
      })
        .then(response => response.json())
        .then((response) => {
          // console.log(response)
          if (response.message) {
            alert('Message Was Updated Succesfuly')
           // this.getData();
            this.setState({ show_loading: false });
            this.TablecloseModal()
          }
        })

    }
  }



  render() {
    const { isLoaded } = this.state;
    return (
      <Container fluid className="main-content-container px-4">

        <Row noGutters style={{ paddingTop: "10px" }} className="mb-2">
          <Col lg="6" md="6" sm="12" className="mb-4">
            <PageTitle title={'Alert Dashboard'} className="page-header text-sm-left" />
          </Col>
        </Row>

        <span>
          <Modal
            show={this.state.isOpenButton}
            onHide={this.TablecloseModal}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered>
            <Modal.Header closeButton>
              {/* <Modal.Title id="contained-modal-title-vcenter">
                Adding Parameter
              </Modal.Title> */}
            </Modal.Header>
            <Modal.Body>

              <form onSubmit={this.processAlert}>
                <ul class="list-group list-group-flush">
                  <li class="list-group-item p-3">
                    <div class="row">
                      <div class="col-sm-12 col-md-12">

                        <label class="form-label" for="msg">Comments</label>
                        <textarea class="form-control" id="msg" rows="8"></textarea>

                      </div>

                    </div>
                  </li>
                </ul>
                <button class="button submit" type="submit">
                  {
                    this.state.show_loading &&
                    <div style={{ display: 'inline-block', paddingRight: '5px' }}>
                      <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
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

        <div style={{ justifyContent: 'center', marginTop: '30px' }} >

          <div className="">
            <Row style={{ width: '100%', margin: '0 auto' }} >

              <Col lg="3" md="12" sm="12" className="mb-4" >
                <Card small >
                  <div className="p-0" style={{ backgroundColor: 'white', borderRadius: 'inherit', border: '1px solid #cfd1d4' }}>
                    <span className="ml-auto text-center text-bold"  >
                      <p class="cardstats">{this.state.errors_new} <br /></p>
                    </span>
                    <div style={{ margin: "auto", width: "100%", alignContent: "center", alignItems: "center", marginBottom: '2px' }}>
                      <div className="text-center text-bold" style={{ backgroundColor: '#F5F6F8', width: '97%', marginLeft: '1.5%', marginTop: '-20px' }}>
                        <span class="cardheading">New Errors</span>
                      </div>
                    </div>
                  </div>

                </Card>

              </Col>

              <Col lg="3" md="12" sm="12" className="mb-4" >
                <Card small className="cardtip">
                  <div className="p-0" style={{ backgroundColor: 'white', borderRadius: 'inherit', border: '1px solid #cfd1d4' }}>
                    <span className="ml-auto text-center text-bold"  >
                      <p class="cardstats">{this.state.errors_inProgress} <br /></p>
                    </span>
                    <div style={{ margin: "auto", width: "100%", alignContent: "center", alignItems: "center", marginBottom: '2px' }}>
                      <div className="text-center text-bold" style={{ backgroundColor: '#F5F6F8', width: '97%', marginLeft: '1.5%', marginTop: '-20px' }}>
                        <span class="cardheading">In-Progress Errors</span>
                      </div>
                    </div>

                  </div>

                </Card>

              </Col>



              <Col lg="3" md="12" sm="12" className="mb-4" >
                <Card small className="cardtip2">
                  <div className="p-0" style={{ backgroundColor: 'white', borderRadius: 'inherit', border: '1px solid #cfd1d4' }}>
                    <span className="ml-auto text-center text-bold"  >
                      <p class="cardstats">{this.state.warnings_new} <br /></p>
                    </span>
                    <div style={{ margin: "auto", width: "100%", alignContent: "center", alignItems: "center", marginBottom: '2px' }}>
                      <div className="text-center text-bold" style={{ backgroundColor: '#F5F6F8', width: '97%', marginLeft: '1.5%', marginTop: '-20px' }}>
                        <span class="cardheading">New Warnings</span>
                      </div>
                    </div>
                   

                  </div>
                </Card>

              </Col>
              <Col lg="3" md="12" sm="12" className="mb-4" >
                
                <Card small className="cardtip3">
                  <div className="p-0" style={{ backgroundColor: 'white', borderRadius: 'inherit', border: '1px solid #cfd1d4' }}>
                    <span className="ml-auto text-center text-bold"  >
                      <p class="cardstats">{this.state.warnings_inProgress} <br /></p>
                    </span>
                    <div style={{ margin: "auto", width: "97.5%", alignContent: "center", alignItems: "center", marginBottom: '2px' }}>
                      
                      <div className="text-center text-bold" style={{ backgroundColor: '#F5F6F8', width: '97%', marginLeft: '1.5%', marginTop: '-20px' }}>
                        <span class="cardheading">In-Progress Warnings</span>
                      </div>
                    </div>
                  </div>
                </Card>

              </Col>


            </Row>
          </div>
        </div>






        <Row>


          <Col lg="12" md="12" sm="12" className="mb-4">
            {isLoaded ? (
              <Card small>

                <DataTable
                  columns={this.state.columns}
                  data={this.state.data}
                  highlightOnHover={true}
                  style={{ overflow: 'wrap' }}
                  rowsPerPage={20}
                  conditionalRowStyles={this.state.conditionalRowStyles}
                  customStyles={this.state.customStyles}
                  expandableRows
                  expandableRowsComponent={
                    ({ data }) =>
                      <div className="p-3">
                        <h6>Comments:</h6>
                        <span>
                          {data.comments}
                        </span>
                      </div>
                  }
                 sortServer
                  pagination
                  filterable
                />

              </Card>

            ) : (<L></L>)}
          </Col>
        </Row>




      </Container>
    );
  }
}

export default live_O_M_error_dashboard;
