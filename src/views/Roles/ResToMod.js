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
import {
  Tooltip,
  Container,
  Row,
  Col,
  Card,
  FormCheckbox,
  FormSelect,
} from "shards-react";
import { URL3, URL2, DKEY } from "../../constants";
import PageTitle from "../../components/common/PageTitle";
import L from "../../components/components-overview/loader";
import TimePicker from "react-bootstrap-time-picker";
import { timeFromInt } from "time-number";
import Spinner from "react-bootstrap/Spinner";
import DataTable from "react-data-table-component";
import ParameterTable from "../../components/components-overview/ParameterTable";
import { Input } from "semantic-ui-react";
import ToggleButton from "react-toggle-button";
import Toggle from "react-toggle";
import Multiselect from "multiselect-react-dropdown";
import ToggleButtons from "../../components/components-overview/ToggleButtons";
import BootstrapSwitchButton from "bootstrap-switch-button-react";
import { ToastContainer, toast } from "react-toastify";
import { Can } from "@casl/react";
import setPermissions from "../defineAbility";

let controller;

class ResToMod extends React.Component {
  constructor(props) {
    super(props);

    const userIs_logged = localStorage.getItem("is_logged");
    if (userIs_logged != 1) {
      this.props.history.push("/login");
    }

    this.state = {
      mainLoaded: false,
      checked: true,
      errors_completed: 0,
      errors_inProgress: 0,
      cheeseIsReady: false,
      warnings_completed: 0,
      toggle: "Active",
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
    };
  }

  handleChange = () => {
    this.setState({
      checked: !this.state.checked,
    });
  };

  handleShowCreate() {
    this.setState({
      isOpen: true,
    });
  }

  handleCheeseChange() {
    this.setState({
      cheeseIsReady: true,
    });
  }

  closeModal = () => {
    this.setState({
      isOpen: false,
    });
  };

  closeEditModal = () => {
    this.setState({
      showEdit: false,
    });
  };

  closeCopyModal = () => {
    this.setState({
      showCopy: false,
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

  checked = (value) => {
    if (value === 1) {
      return true;
    } else {
      return false;
    }
  };

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

    if (
      !min_value ||
      !max_value ||
      !start_time ||
      !end_time ||
      !type ||
      !parameter_id ||
      !project_id ||
      !device_id
    ) {
      alert("Please make sure to Fill the form");
      this.setState({ show_loading: false });
    } else {
      var project_device = await this.getProjectDevice(project_id, device_id);

      const access_token = localStorage.getItem("access_token");
      const response = await fetch(URL2 + "project-parameter/addParameter", {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          access_token: access_token,
        },
        credentials: "include",
        method: "POST",
        mode: "cors",
        body: JSON.stringify({
          min_value: min_value,
          max_value: max_value,
          start_time: start_time,
          end_time: end_time,
          type: type,
          is_email: is_email,
          is_signal: is_signal,
          is_null: is_null,
          parameter_id: parameter_id,
          project_device: project_device,
        }),
      });
      const json = await response.json();

      if (json.status === false) {
        alert("Parameter Was Not Added Succesfuly");
        this.setState({ show_loading: false });
        this.closeModal();
      } else {
        alert("Parameter Added Succesfuly");

        let data3 = this.state.data;
        if (data3.length > 0) {
          data3.unshift(...json.last_row);
        } else {
          data3.push(json.last_row);
        }

        this.setState({
          show_loading: false,
          data: data3,
        });

        this.closeModal();
      }
    }
  };

  edit_handelSubmit = async (event) => {
    event.preventDefault();
    this.setState({ show_loading: true });
  };

  copyRow(id) {}

  editRow(id) {}

  handelEditRow(row) {
    this.setState({
      showEdit: true,
      editRow: row,
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
    await fetch(URL2 + "auth-module-resource", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        access_token: access_token,
      },
      credentials: "include",
    })
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        this.setState({
          data: response,

          columns: [
            {
              name: "Resources",
              selector: (row) => row.resource_id,
              sortable: true,
              wrap: true,
              grow: 0.5,
            },
            {
              name: "Module",
              selector: (row) => row.module_id,
              sortable: true,
              grow: 0.5,
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
                  onClick={this.handelCopyRow.bind(this, row.id)}
                  style={{ cursor: "pointer" }}
                >
                  <i class="material-icons" style={{ fontSize: "15px" }}>
                    content_copy
                  </i>
                </span>
              ),
              allowOverflow: true,
              button: true,
              width: "40px",
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

  render() {
    const { isLoaded, editRow } = this.state;
    return (
      <>
        {this.state.mainLoaded ? (
          <Container fluid className="main-content-container px-4">
            <Row noGutters style={{ paddingTop: "10px" }} className="mb-2">
              <Col lg="6" md="6" sm="12" className="mb-4">
                <PageTitle
                  title={"Assign Resources to Module"}
                  className="page-header text-sm-left"
                />
              </Col>
              <Col lg="6" md="6" sm="12" className="mb-4">
                <Can
                  I="write"
                  a="/auth-resources/"
                  ability={this.state.ability}
                >
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
                </Can>
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

            {/* ------- Assign NEW Resource to Module FORM -------- */}
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
                    Assign Resources to Module
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <form onSubmit={this.handelSubmit}>
                    <ul class="list-group list-group-flush">
                      <li class="list-group-item p-3">
                        <div class="row">
                          <div class="col-sm-12 col-md-12">
                            <div class="form-group">
                              <label>Resources</label>
                              <select
                                class="form-control"
                                aria-label="project select"
                                name="project"
                                id="project"
                                onChange={this.handelProjectChange}
                                required
                              >
                                <option disabled selected value>
                                  {" "}
                                  -- Select Resources --{" "}
                                </option>
                                {this.state.project.map((p) => (
                                  <option key={p.id} value={p.id}>
                                    {p.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div class="form-group">
                              <label>Module</label>
                              <select
                                class="form-control"
                                aria-label="project select"
                                name="project"
                                id="project"
                                onChange={this.handelProjectChange}
                                required
                              >
                                <option disabled selected value>
                                  {" "}
                                  -- Select Module --{" "}
                                </option>
                                {this.state.project.map((p) => (
                                  <option key={p.id} value={p.id}>
                                    {p.name}
                                  </option>
                                ))}
                              </select>
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
                            module="status"
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

            {/* ------- EDIT Assignment FORM -------- */}
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
                      Edit Assignment
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <form onSubmit={this.handelSubmit}>
                      <ul class="list-group list-group-flush">
                        <li class="list-group-item p-3">
                          <div class="row">
                            <div class="col-sm-12 col-md-12">
                              <div class="form-group">
                                <label>Resources</label>
                                <select
                                  class="form-control"
                                  aria-label="project select"
                                  name="project"
                                  id="project"
                                  onChange={this.handelProjectChange}
                                  required
                                >
                                  <option disabled selected value>
                                    {" "}
                                    -- Select Resources --{" "}
                                  </option>
                                  {this.state.project.map((p) => (
                                    <option key={p.id} value={p.id}>
                                      {p.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div class="form-group">
                                <label>Module</label>
                                <select
                                  class="form-control"
                                  aria-label="project select"
                                  name="project"
                                  id="project"
                                  onChange={this.handelProjectChange}
                                  required
                                >
                                  <option disabled selected value>
                                    {" "}
                                    -- Select Module --{" "}
                                  </option>
                                  {this.state.project.map((p) => (
                                    <option key={p.id} value={p.id}>
                                      {p.name}
                                    </option>
                                  ))}
                                </select>
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
                              module="status"
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
            {/* ------- EDIT Assignment FORM -------- */}

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
export default ResToMod;
