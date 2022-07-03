import React from "react";
import {
  Modal,
  Button,
  select,
  Alert,
  CardImg,
  Form,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import { Tooltip, Container, Row, Col, Card, FormSelect } from "shards-react";
import { URL3, URL2, DKEY } from "../../constants";
import PageTitle from "../../components/common/PageTitle";
import L from "../../components/components-overview/loader";
import TimePicker from "react-bootstrap-time-picker";
import { timeFromInt } from "time-number";
import Spinner from "react-bootstrap/Spinner";
import DataTable from "react-data-table-component";
import ParameterTable from "../../components/components-overview/ParameterTable";
import { ToastContainer, toast } from "react-toastify";
import { Can } from "@casl/react";
import setPermissions from "../defineAbility";
import BootstrapSwitchButton from "bootstrap-switch-button-react";

let controller;
class Modules extends React.Component {
  constructor(props) {
    super(props);

    const userIs_logged = localStorage.getItem("is_logged");
    if (userIs_logged != 1) {
      this.props.history.push("/login");
    }

    this.state = {
      mainLoaded: false,
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
      showEdit: false,
      editRow: null,
      showCopy: false,
      copyRow: null,
      edit_start_time: "00:00",
      edit_end_time: "00:00",
      editModuleObject: null,
      selectedObject: null,
    };
  }

  addZero(i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  }

  formatDate(date) {
    var time = Date.parse(date);
    var date1 = new Date(time);

    let hour = this.addZero(date1.getHours());
    let min = this.addZero(date1.getMinutes());
    let s = this.addZero(date1.getSeconds());

    let day = this.addZero(date1.getDate());
    let month = this.addZero(date1.getMonth() + 1);
    let year = this.addZero(date1.getFullYear());

    return year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + s;
  }

  handleShowCreate() {
    this.setState({
      isOpen: true,
    });
  }

  closeModal = () => {
    this.setState({
      isOpen: false,
    });
  };

  closeEditModal = () => {
    this.setState({
      editModuleObject: {},
      showEdit: false,
    });
  };

  getProjects = async () => {
    // console.log(event.target.value);
    const access_token = localStorage.getItem("access_token");
    await fetch(URL2 + "project/", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        access_token: access_token,
      },
      credentials: "include",
    })
      .then((response) => response.json())
      .then((response) => {
        this.setState({
          project: response,
        });
      });
  };

  handelProjectChange = async (event) => {
    // console.log(event.target.value);
    const access_token = localStorage.getItem("access_token");
    await fetch(
      URL2 + "project-device/getDevicesPerProject/" + event.target.value,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          access_token: access_token,
        },
        credentials: "include",
      }
    )
      .then((response) => response.json())

      .then((response) => {
        this.setState({
          devices: response,
        });
      });
  };

  handleClick = () => {
    this.handleShowCreate();
    this.getProjects();
  };

  getProjectDevice = async (p, d) => {
    const access_token = localStorage.getItem("access_token");
    await fetch(URL2 + "project-device/getProjectDeviceID/" + p + "/" + d, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        access_token: access_token,
      },
      credentials: "include",
    })
      .then((response) => response.json())

      .then((response) => {
        // console.log(response[0].id)
        this.setState({
          project_device_id: response[0].id,
        });
      });

    return this.state.project_device_id;
  };

  handelSubmit = async (event) => {
    event.preventDefault();
    this.setState({ show_loading: true });
  };

  edit_handelSubmit = async (event) => {
    event.preventDefault();
    this.setState({ show_loading: true });
  };
  copyRow(id) {}

  editRow(id) {}

  handleAddModules = async () => {
    var module = document.getElementById("module_id").value;
    await fetch(URL2 + "auth-module", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
      method: "POST",
      mode: "cors",
      body: JSON.stringify({
        name: module,
      }),
    });
  };

  handleEditModule = async () => {
    var module_name = document.getElementById("Group_name1").value;

    await fetch(URL2 + "auth-module", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
      method: "PUT",
      mode: "cors",
      body: JSON.stringify([
        { id: this.state.selectedObject },
        {
          name: module_name,
        },
      ]),
    });
  };

  async handelEditRow(row) {
    // console.log('hi edit')

    const response = await fetch(URL2 + "auth-module/" + row.id, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
      method: "GET",
      mode: "cors",
    });
    const json = await response.json();
    await this.setState({
      editModuleObject: json,
    });

    this.setState({
      showEdit: true,
      editRow: row,
      selectedObject: row.id,
    });
  }

  handelCopyRow(row) {
    this.setState({
      showCopy: true,
      copyRow: row,
    });
  }

  async getParameters() {
    const access_token = localStorage.getItem("access_token");
    await fetch(URL2 + "auth-module", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        access_token: access_token,
      },
      credentials: "include",
    })
      .then((response) => response.json())
      .then((response) => {
        this.setState({
          data: response,

          columns: [
            {
              name: "Name",
              selector: (row) => row.name,
              sortable: true,
              grow: 1,
            },

            {
              cell: (row) => (
                <span style={{ paddingRight: "10px" }}>
                  {" "}
                  <BootstrapSwitchButton
                    onstyle="success"
                    width={85}
                    height={10}
                    checked={true}
                    onlabel="Active"
                    offlabel="Inactive"
                    onChange={(checked) => {
                      this.setState({ isUserAdmin: checked });
                    }}
                  />
                </span>
              ),
              allowOverflow: true,
              button: true,
            },
            {
              cell: (row) => (
                <span
                  onClick={this.handelEditRow.bind(this, row)}
                  style={{ cursor: "pointer" }}
                >
                  <i
                    class="material-icons"
                    style={{ fontSize: "15px", color: "blue" }}
                  >
                    edit
                  </i>
                </span>
              ),
              allowOverflow: true,
              button: true,
              width: "40px",
            },
          ],

          customStyles: {
            headCells: {
              style: {
                color: "#202124",
                fontSize: "14px",
              },
            },
            rows: {
              highlightOnHoverStyle: {
                backgroundColor: "rgb(230, 244, 244)",
                borderBottomColor: "#FFFFFF",
                borderRadius: "25px",
                outline: "1px solid #FFFFFF",
              },
            },
            pagination: {
              style: {
                border: "none",
              },
            },
          },
          isLoaded: true,
        });
      });
  }

  async componentDidMount() {
    controller = new AbortController();
    const signal = controller.signal;

    await fetch(URL2 + "getPermissions", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
      signal,
    })
      .then((response) => response.json())
      .then((json) => {
        if (
          json.statusCode == 404 ||
          json.status == 404 ||
          json.statusCode == 500 ||
          json.statusCode == 403
        ) {
          throw Error(json.statusText);
        } else {
          console.log("permissions", json);
          const ability = setPermissions(json);
          console.log("permissions", ability);
          this.setState({
            ability: ability,
            mainLoaded: true,
          });
        }
      })
      .catch((e) => {
        toast.warning("Something went wrong...", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
        });
      });
    this.getParameters();
  }

  componentWillUnmount() {
    if (controller) {
      controller.abort();
    }
  }

  render() {
    const { isLoaded, editRow } = this.state;
    return (
      <>
        {this.state.mainLoaded ? (
          <Container fluid className="main-content-container px-4">
            <Row noGutters style={{ paddingTop: "10px" }} className="mb-2">
              <Col lg="6" md="6" sm="12" className="mb-4">
                <PageTitle
                  title={"Modules"}
                  className="page-header text-sm-left"
                />
              </Col>
              <Col lg="6" md="6" sm="12" className="mb-4">
                {/* <Can I="write" a="/auth-role/" ability={this.state.ability}> */}
                <button
                  className="btn btn-primary"
                  onClick={this.handleClick}
                  style={{
                    backgroundColor: "#004769",
                    borderColor: "#004769",
                    float: "right",
                    fontSize: "20px",
                  }}
                >
                  Add
                </button>
                {/* </Can> */}
              </Col>
            </Row>
            <Row>
              <Col lg="12" md="12" sm="12" className="mb-4">
                <Card className="mb-4" small>
                  <Row
                    className="align-items-center"
                    style={{ margin: "initial" }}
                  >
                    <Col sm={1} className="my-1">
                      <FormSelect
                        style={{ width: "280px" }}
                        aria-label="Default select example"
                        name="xero_contact"
                        id="xero_contact"
                      >
                        <option selected disabled value={false}>
                          filter 1
                        </option>
                      </FormSelect>
                    </Col>

                    <Col sm={1} className="my-1">
                      <FormSelect
                        onChange={this.handleProjectChange}
                        style={{ width: "280px", marginLeft: "250px" }}
                        aria-label="Default select example"
                        name="xero_project"
                        id="xero_project"
                      >
                        <option selected disabled value={false}>
                          filter 2
                        </option>
                      </FormSelect>
                    </Col>

                    <span
                      style={{
                        fontSize: "14px",
                        marginLeft: "60%",
                        color: "blue",
                        cursor: "pointer",
                      }}
                      onClick={this.resetfilters}
                    >
                      Reset Filters
                    </span>

                    <Col sm={2}>
                      <input
                        style={{ border: "1px solid black" }}
                        class="form-control"
                        id="search"
                        type="text"
                        placeholder="Search..."
                        onKeyUp={this.onFilter}
                      ></input>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>

            <Row>
              {isLoaded ? (
                <Col lg="12" md="12" sm="12" className="mb-4">
                  <Card style={{ marginBottom: "10px" }} small></Card>

                  <Card small>
                    <DataTable
                      columns={this.state.columns}
                      data={this.state.data}
                      highlightOnHover={true}
                      style={{ overflow: "wrap" }}
                      sortServer
                      pagination
                    />
                  </Card>
                </Col>
              ) : (
                <L></L>
              )}
            </Row>

            {/* ------- ADD NEW PARAMETER FORM -------- */}
            <span>
              <Modal
                show={this.state.isOpen}
                onHide={this.closeModal}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
              >
                <Modal.Header closeButton>
                  <Modal.Title id="contained-modal-title-vcenter">
                    Add Module
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <form onSubmit={this.handleAddModules}>
                    <ul class="list-group list-group-flush">
                      <li class="list-group-item p-3">
                        <div class="row">
                          <div class="col-sm-12 col-md-12">
                            <div class="form-group">
                              <label>Module Name</label>
                              <input
                                type="text"
                                class="form-control"
                                name="module_name"
                                id="module_id"
                                placeholder="Module name"
                              ></input>
                            </div>
                          </div>
                        </div>
                      </li>
                    </ul>

                    <button class="formButton" type="submit">
                      {this.state.show_loading && (
                        <div
                          style={{
                            display: "inline-block",
                            paddingRight: "5px",
                          }}
                        >
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                          />
                          <span className="sr-only">Loading...</span>
                        </div>
                      )}
                      Save
                    </button>
                  </form>
                </Modal.Body>
                <Modal.Footer>
                  <button onClick={this.closeModal}>Close</button>
                </Modal.Footer>
              </Modal>
            </span>
            {/* ------- END ADD NEW PARAMETER FORM -------- */}

            {/* ------- EDIT PARAMETER FORM -------- */}
            <span>
              {editRow ? (
                <Modal
                  show={this.state.showEdit}
                  onHide={this.closeEditModal}
                  size="lg"
                  aria-labelledby="contained-modal-title-vcenter"
                  centered
                >
                  <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                      Edit Module
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <form onSubmit={this.handleEditModule}>
                      <ul class="list-group list-group-flush">
                        <li class="list-group-item p-3">
                          <div class="row">
                            <div class="col-sm-12 col-md-12">
                              <div class="form-group">
                                <label>Module Name</label>
                                <input
                                  type="text"
                                  class="form-control"
                                  id="Group_name1"
                                  defaultValue={
                                    this.state.editModuleObject.name
                                  }
                                ></input>
                              </div>
                            </div>
                          </div>
                          <div class="row"></div>
                        </li>
                      </ul>
                      <button class="formButton" type="submit">
                        {this.state.show_loading && (
                          <div
                            style={{
                              display: "inline-block",
                              paddingRight: "5px",
                            }}
                          >
                            <Spinner
                              as="span"
                              animation="border"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                            />
                            <span className="sr-only">Loading...</span>
                          </div>
                        )}
                        Save
                      </button>
                    </form>
                  </Modal.Body>
                  <Modal.Footer>
                    <button onClick={this.closeEditModal}>Close</button>
                  </Modal.Footer>
                </Modal>
              ) : (
                <div></div>
              )}
            </span>
            {/* ------- EDIT PARAMETER FORM -------- */}

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
              style={{ marginLeft: "6%" }}
            />
          </Container>
        ) : (
          <L></L>
        )}
      </>
    );
  }
}
export default Modules;
