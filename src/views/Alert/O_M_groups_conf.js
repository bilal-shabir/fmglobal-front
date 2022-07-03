import React from "react";
import { Modal, Button, select, Alert, CardImg, Form, InputGroup, FormControl } from "react-bootstrap";
import { Tooltip, Container, Row, Col, Card } from "shards-react";
import { URL3, URL2, DKEY } from "../../constants";
import "../../assets/O_M_dashboard.css";
import PageTitle from "../../components/common/PageTitle";
import L from "../../components/components-overview/loader";
import TimePicker from 'react-bootstrap-time-picker';
import { timeFromInt } from 'time-number';
import Spinner from 'react-bootstrap/Spinner';
import DataTable from "react-data-table-component";
import Multiselect from 'multiselect-react-dropdown';
import ParameterTable from "../../components/components-overview/ParameterTable";


class O_M_groups_conf extends React.Component {
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
      edit_is_null: 0,
      edit_is_email: 0,
      edit_is_signal: 0,
      copy_is_null: 0,
      copy_is_email: 0,
      copy_is_signal: 0,
      isOpenButton: false,
      rowStatus: null,
      rowId: null,
      show: false,
      deleteRowid: null,
      showEdit:false,
      editRow:null,
      showCopy:false,
      copyRow:null,
      edit_start_time: "00:00",
      edit_end_time: "00:00",
      copy_start_time: "00:00",
      copy_end_time: "00:00",
      openTooltip: false,
      allEmployees:[],
      selectedValue:[],
      employeeSelectedList:[],
      employeeSelectedItem:null,
      employeeRemovedItem:null,
      employeeRemovedList:[]
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

  handleClick = () => {
    this.handleShowCreate()
    this.getEmployees()
  }

  handleShowCreate() {
    this.setState({
      isOpen: true
    })
  }


  closeModal = () => {
    this.setState({
      isOpen: false,
      start_time: "00:00",
      end_time: "00:00",
      project: [],
      devices: [],
      device_id: 0,
      device_manufacturer_id: 0,
      parameters: [],
      msgs_types: [],
      project_device_id: 0,
    })
  }

  closeEditModal = () => {
    this.setState({
      showEdit: false,
      //edit_start_time: "00:00",
      //edit_end_time: "00:00",
    })
  }


  closeCopyModal = () => {
    this.setState({
      showCopy: false,
      //edit_start_time: "00:00",
      //edit_end_time: "00:00",
    })
  }
 
  closeDeleteModal = () => {
    this.setState({
      show: false
    })
  }

  getEmployees = async () => {
    // console.log(event.target.value);
    const access_token = localStorage.getItem('access_token');
    await fetch(URL2 + 'employee/', {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'access_token': access_token
      },
      credentials: 'include'
    }).then(response => response.json())
      .then(response => {
        this.setState({
          allEmployees: response,
        })
      })
  }

  onSelect = (selectedList, selectedItem) => {
    this.setState({ 
      employeeSelectedList: [],
    });
    console.log(selectedList, selectedItem)
    selectedItem.new = true
    selectedItem.is_active_inGroup = true
    this.setState({ 
      employeeSelectedList: selectedList,
      employeeSelectedItem: selectedItem
    });
  }

  onSelectEdit = (selectedList, selectedItem) => {
    console.log(selectedList, selectedItem)

    // this.setState({ 
    //   employeeSelectedList: [],
    // });

    //selectedList = this.state.employeeSelectedList

    selectedItem.new = true
    selectedItem.is_active_inGroup = true

    for(const row of selectedList){
      if(row !== selectedItem){
        row.new = false
        row.is_active_inGroup = true
      }
    }

    this.setState({ 
      employeeSelectedList: selectedList,
      employeeSelectedItem: selectedItem
    });
    console.log(this.state.employeeSelectedList)
  }

  onRemove = (selectedList, removedItem) => {
    console.log(selectedList, removedItem)
    removedItem.new = false
    removedItem.is_active_inGroup = false
    this.state.employeeRemovedList.push(removedItem)
    console.log(this.state.employeeRemovedList)
    this.setState({ 
      employeeSelectedList: selectedList,
      employeeRemovedItem: removedItem,
    });
  }
  

  add_handelSubmit = async (event) => {

    event.preventDefault();
    this.setState({ show_loading: true, isLoaded: false });

    const group_name = document.getElementById("group_name").value;
    let groupsEmployees = this.state.employeeSelectedList;


    if (!group_name || !groupsEmployees) {
      alert("Please make sure to Fill the form")
      this.setState({
        show_loading: false,
        isLoaded:true,
        employeeSelectedList:[]
      });
    } else {

     // var project_device = await this.getProjectDevice(project_id, device_id)


      const access_token = localStorage.getItem('access_token');
      const response = await fetch(URL2 + 'employee-groups/createGroupsEmployee', {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'access_token': access_token
        },
        credentials: 'include',
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify({
          name: group_name, employees: groupsEmployees
        })
      })
      const json = await response.json();

      // console.log(json)
      if (json.status === false) {

        alert('Group Was Not Added Succesfuly')
        this.setState({
          show_loading: false,
          isLoaded:true,
          employeeSelectedList:[]
        });
        this.closeModal()
      } else {
        alert('Group Added Succesfuly')

        //console.log(json.last_row)
        // let data3 = this.state.data
        // if(data3.length > 0){
        //   data3.unshift(json.last_row)
        // }else{
        //   data3.push(json.last_row)
        // }
        
        //console.log(data3)

        this.setState({
          data: json.last_data,
          show_loading: false,
          isLoaded:true,
          employeeSelectedList:[]
        });

        this.closeModal()
        
      }


    }
  }


  edit_handelSubmit = async (event) => {

    event.preventDefault();
    this.setState({ show_loading: true, isLoaded: false });

    const group_name = document.getElementById("group_name").value;
    var group_id = this.state.editRow.id
    let groupsEmployees = this.state.employeeSelectedList;
    let groupsremovedEmployees = this.state.employeeRemovedList;

    console.log(groupsEmployees)
    if (!group_name || groupsEmployees.length === 0) {
      alert("Please make sure to Fill the form")
      this.setState({
        show_loading: false,
        isLoaded:true,
        employeeSelectedList:[]
      });
    } else {

     // var project_device = await this.getProjectDevice(project_id, device_id)


      const access_token = localStorage.getItem('access_token');
      const response = await fetch(URL2 + 'employee-groups/editGroupsEmployee', {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'access_token': access_token
        },
        credentials: 'include',
        method: 'PUT',
        mode: 'cors',
        body: JSON.stringify({
          id:group_id, name: group_name, employees: groupsEmployees, removed_employees:groupsremovedEmployees
        })
      })
      const json = await response.json();

      console.log(json)
      if (json.status === false) {

        alert('Group Was Not Updated Succesfuly')
        this.setState({
          show_loading: false,
          isLoaded:true,
          employeeSelectedList:[]
        });
        this.closeEditModal()
      } else {
        alert('Group Updated Succesfuly')

        //console.log(json.last_row)
        // let data3 = this.state.data
        // if(data3.length > 0){
        //   data3.unshift(json.last_row)
        // }else{
        //   data3.push(json.last_row)
        // }
        
        //console.log(data3)

        this.setState({
          data: json.last_data,
          show_loading: false,
          isLoaded:true,
          employeeSelectedList:[]
        });

        this.closeEditModal()
        
      }


    }
  }

  equalsIgnoreOrder = (groupsEmployees, copiedEmployees) => {
    if (groupsEmployees.length !== copiedEmployees.length) return false;
    const uniqueValues = new Set([...groupsEmployees, ...copiedEmployees]);
    for (const v of uniqueValues) {
      const groupsEmployeesCount = groupsEmployees.filter(e => e === v).length;
      const copiedEmployeesCount = copiedEmployees.filter(e => e === v).length;
      if (groupsEmployeesCount !== copiedEmployeesCount) return false;
    }
    return true;
  }

  copy_handelSubmit = async (event) => {
    event.preventDefault();
    this.setState({ show_loading: true, isLoaded: false });

    const group_name = document.getElementById("group_name").value;
    let groupsEmployees = this.state.employeeSelectedList;
    let copiedEmployees = this.state.copyRow.employees

    console.log(groupsEmployees)
    //console.log(equalsIgnoreOrder)
    if (!group_name || groupsEmployees.length === 0) {
      alert("Please make sure to Fill the form")
      this.setState({
        show_loading: false,
        isLoaded:true,
        //employeeSelectedList:[]
      });
    }if(group_name === this.state.copyRow.name && this.equalsIgnoreOrder(groupsEmployees,copiedEmployees) === true ){
      alert("You Cant Copy The Same Group")
      this.setState({
        show_loading: false,
        isLoaded:true,
        //employeeSelectedList:[]
      });
    }else {

     // var project_device = await this.getProjectDevice(project_id, device_id)


      const access_token = localStorage.getItem('access_token');
      const response = await fetch(URL2 + 'employee-groups/createGroupsEmployee', {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'access_token': access_token
        },
        credentials: 'include',
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify({
          name: group_name, employees: groupsEmployees
        })
      })
      const json = await response.json();

      //console.log(json)
      if (json.status === false) {

        alert('Group Not Added Succesfuly')
        this.setState({
          show_loading: false,
          isLoaded:true,
          employeeSelectedList:[]
        });
        this.closeCopyModal()
      } else {
        alert('Group Added Succesfuly')

        this.setState({
          data: json.last_data,
          show_loading: false,
          isLoaded:true,
          employeeSelectedList:[]
        });

        this.closeCopyModal()
        
      }


    }
  }



  async deleteRow(rid) {

    this.setState({ show_loading: true });

    const access_token = localStorage.getItem('access_token');
    const response = await fetch(URL2 + 'employee-groups/deleteGroupsEmployee/', {
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
    console.log(json)
    if (json.status === false) {

      alert('Group Was Not Deleted, Please try again later!')
      this.setState({ show_loading: false });
      this.closeDeleteModal()
    } else {
      alert('Group Deleted Succesfuly')


      this.setState({
        show_loading: false,
        data: json.last_data
      });

      this.closeDeleteModal()
    }
  }

  handelEditRow(row){
    console.log('hi edit',row)

    for(const row of row.employees){
      row.new = false
      row.is_active_inGroup = true
    }

    this.setState({
      showEdit: true,
      editRow: row,
      employeeSelectedList:row.employees
    })

    console.log(this.state.editRow)
  }

  handelCopyRow(row){
    console.log('hi copy',row.employee)
    this.setState({
      showCopy: true,
      copyRow: row,
      employeeSelectedList:row.employees
    })
    // this.getProjects()
    // this.handelProjectChange(undefined,row.project_device.project.id)
    // this.handelDeviceChange(row.project_device.device.id)
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

  toggleTooltp () {
    console.log("hiiiiii")
    this.setState({
      openTooltip: !this.state.openTooltip
    });

    console.log(this.state.openTooltip)
  }


  returnEmployees(employees){
    
    return(
    <div class="omDiv">
      {employees.map((e)=>
          
            <div class="omDiv">
            <span style={{ cursor: 'pointer', color:'darkgray' }}><i id={"Tooltip"+e.id} class="material-icons" style={{ fontSize: '30px' }}>account_circle</i></span>
            <span class="omSpan">
              {e.email}
            </span>
            </div>
        )}
    </div>
    )
  }

  async getGroups() {
    const access_token = localStorage.getItem('access_token');
    await fetch(URL2 + 'employee-groups/getGroupsEmployees', {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'access_token': access_token
      },
      credentials: 'include'
    }).then(response => response.json()).then(response => {

      // for (const row of response){
        
      // }
      this.setState(
        {
          data: response,
          columns: [
            {
              name: "Date & Time",
              selector: (row) => this.formatDate(row.created_at),
              sortable: true,
              wrap: true,
            },
            {
              name: "Group",
              selector: (row) => row.name,
              sortable: true,
              //grow: 1,
            },
            {
              name: "Employees",
              selector: (row) => this.returnEmployees(row.employees),
              sortable: true,
              wrap: true,
              //grow: 0.5,
            },
            {
              cell: row => <span onClick={this.handelCopyRow.bind(this, row)} style={{ cursor: 'pointer' }}><i class="material-icons" style={{ fontSize: '15px' }}>content_copy</i></span>,
              allowOverflow: true,
              button: true,
              width: '40px',
            },
            {
              cell: row => <span onClick={this.handelEditRow.bind(this, row)} style={{ cursor: 'pointer' }}><i class="material-icons" style={{ fontSize: '15px', color: 'blue' }}>edit</i></span>,
              allowOverflow: true,
              button: true,
              width: '40px',
            },
            {
              cell: row => <span onClick={this.DeleteConfirmation.bind(this, row.id)} style={{ cursor: 'pointer' }}><i class="material-icons" style={{ fontSize: '15px', color: 'red' }}>delete</i></span>,
              allowOverflow: true,
              button: true,
              width: '40px',
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
        }
      )
    })
  }

  async componentDidMount() {
    this.getGroups()
    this.getEmployees()
    // this.refreshData()

  }

  render() {
    const { isLoaded,editRow,copyRow } = this.state;
    return (
      <Container fluid className="main-content-container px-4">

        <Row noGutters style={{ paddingTop: "10px" }} className="mb-2">
          <Col lg="6" md="6" sm="12" className="mb-4">
            <PageTitle title={'O&M Groups'} className="page-header text-sm-left" />
          </Col>
          <Col lg="6" md="6" sm="12" className="mb-4">
            <button className="btn btn-primary" onClick={this.handleClick} style={{ backgroundColor: '#004769', borderColor: '#004769', float: 'right', fontSize: '20px' }}>Add</button>
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
                  style={{ overflow: 'wrap' }}
                  customStyles={this.state.customStyles}
                  sortServer
                  pagination
                />

              </Card>
            </Col>


          ) : (<L></L>)}
        </Row>


        
        {/* ------- ADD NEW GROUP FORM -------- */}
        <span>
          <Modal
            show={this.state.isOpen}
            onHide={this.closeModal}
            aria-labelledby="contained-modal-title-vcenter"
            centered>
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-vcenter">
                Create Group
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form onSubmit={this.add_handelSubmit}>
                <ul class="list-group list-group-flush">
                  <li class="list-group-item p-3">
                    <div class="row">
                      <div class="col-sm-12 col-md-12">
                        <div class="form-group">
                          <label >Group Name</label>
                          <input type="text" class="form-control" id="group_name" placeholder="Name"></input>
                        </div>
                        <div class="form-group">
                          <label >Employees</label>
                          <Multiselect
                            options={this.state.allEmployees} // Options to display in the dropdown
                            //selectedValues={this.state.selectedValue} // Preselected value to persist in dropdown
                            onSelect={this.onSelect} // Function will trigger on select event
                            onRemove={this.onRemove} // Function will trigger on remove event
                            displayValue="email" // Property name to display in the dropdown options
                          />
                        </div>
                      </div>
          
                    </div>
                  </li>
                </ul>
                <button class="formButton" type="submit">
                  {
                    this.state.show_loading &&
                    <div style={{ display: 'inline-block', paddingRight: '5px' }}>
                      <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                      <span className="sr-only">Loading...</span>
                    </div>
                  }
                  Save
                </button>
              </form>
            </Modal.Body>
            <Modal.Footer>
              <button onClick={this.closeModal}>Close</button>
            </Modal.Footer>
          </Modal>
        </span>
        {/* ------- END ADD NEW GROUP FORM -------- */}




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
            <Modal.Body><div className="alert alert-danger">Are you sure you want to delete this group?</div></Modal.Body>
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




        {/* ------- EDIT GROUP FORM -------- */}
        <span>
        {editRow ? (
          <Modal
            show={this.state.showEdit}
            onHide={this.closeEditModal}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered>
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-vcenter">
                Edit Groups
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <form onSubmit={this.edit_handelSubmit}>
                <ul class="list-group list-group-flush">
                  <li class="list-group-item p-3">
                    <div class="row">
                      <div class="col-sm-12 col-md-12">
                        <div class="form-group">
                          <label >Group Name</label>
                          <input type="text" class="form-control" id="group_name" placeholder="Name" defaultValue={editRow.name}></input>
                        </div>
                        <div class="form-group">
                          <label >Employees</label>
                          <Multiselect
                            options={this.state.allEmployees} // Options to display in the dropdown
                            selectedValues={editRow.employees} // Preselected value to persist in dropdown
                            onSelect={this.onSelectEdit} // Function will trigger on select event
                            onRemove={this.onRemove} // Function will trigger on remove event
                            displayValue="email" // Property name to display in the dropdown options
                          />
                        </div>
                      </div>
          
                    </div>
                  </li>
                </ul>
                <button class="formButton" type="submit">
                  {
                    this.state.show_loading &&
                    <div style={{ display: 'inline-block', paddingRight: '5px' }}>
                      <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                      <span className="sr-only">Loading...</span>
                    </div>
                  }
                  Save
                </button>
              </form>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.closeEditModal}>Close</Button>
            </Modal.Footer>
          </Modal>
          ) : (<div></div>)}
        </span>
        {/* ------- EDIT GROUP FORM FORM -------- */}



        {/* ------- Copy GROUP FORM -------- */}
        <span>
        {copyRow ? (
          <Modal
            show={this.state.showCopy}
            onHide={this.closeCopyModal}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered>
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-vcenter">
                Copy Group
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <form onSubmit={this.copy_handelSubmit}>
                <ul class="list-group list-group-flush">
                  <li class="list-group-item p-3">
                    <div class="row">
                      <div class="col-sm-12 col-md-12">
                        <div class="form-group">
                          <label >Group Name</label>
                          <input type="text" class="form-control" id="group_name" placeholder="Name" defaultValue={copyRow.name}></input>
                        </div>
                        <div class="form-group">
                          <label >Employees</label>
                          <Multiselect
                            options={this.state.allEmployees} // Options to display in the dropdown
                            selectedValues={copyRow.employees} // Preselected value to persist in dropdown
                            onSelect={this.onSelect} // Function will trigger on select event
                            onRemove={this.onRemove} // Function will trigger on remove event
                            displayValue="email" // Property name to display in the dropdown options
                          />
                        </div>
                      </div>
          
                    </div>
                  </li>
                </ul>
                <button class="formButton" type="submit">
                  {
                    this.state.show_loading &&
                    <div style={{ display: 'inline-block', paddingRight: '5px' }}>
                      <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                      <span className="sr-only">Loading...</span>
                    </div>
                  }
                  Save
                </button>
              </form>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.closeCopyModal}>Close</Button>
            </Modal.Footer>
          </Modal>
          ) : (<div></div>)}
        </span>
        {/* ------- Copy GROUP FORM FORM -------- */}





      </Container>
    );
  }

}
export default O_M_groups_conf