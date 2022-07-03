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


class O_M_parameter_conf extends React.Component {
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
      allGroups: [],
      groupSelectedList: [],
      groupSelectedItem: null,
      groupRemovedItem:null,
      groupRemovedList:[]
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

  closeDeleteModal = () => {
    this.setState({
      show: false
    })
  }

  closeEditModal = () => {
    this.setState({
      showEdit: false,
      edit_start_time: "00:00",
      edit_end_time: "00:00",
    })
  }

  closeCopyModal = () => {
    this.setState({
      showCopy: false,
      copy_start_time: "00:00",
      copy_end_time: "00:00",
      project: [],
      devices: [],
      device_id: 0,
      device_manufacturer_id: 0,
      parameters: [],
      msgs_types: [],
      project_device_id: 0,
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

  handleCopyTimeChange = (copy_start_time) => {
    // console.log(start_time);
    const s = timeFromInt(copy_start_time);
    this.setState({ copy_start_time: s });
  }

  handleCopyEndTimeChange = (copy_end_time) => {
    // console.log(end_time);
    const e = timeFromInt(copy_end_time);
    // console.log(e)
    this.setState({ copy_end_time: e });
  }

  getGroups = async () => {
    // console.log(event.target.value);
    const access_token = localStorage.getItem('access_token');
    await fetch(URL2 + 'groups/', {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'access_token': access_token
      },
      credentials: 'include'
    }).then(response => response.json())
      .then(response => {
        this.setState({
          allGroups: response,
        })
      })
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

  handelProjectChange = async (event, pid) => {

    var project_id = 0;
    if(event === undefined){
      project_id = pid
      //document.getElementById("def_parameter_value_id").hidden = true
      //document.getElementById('def_device_value_id').hidden = true
    }
    if(pid === undefined){
      project_id = event.target.value

      if (event.target.id === "copy_project"){
        document.getElementById("copy_device").selectedIndex = 0; //0 = option 1
        document.getElementById('device_value_id').hidden = true
        document.getElementById("copy_parameter").selectedIndex = 0; //0 = option 1
        document.getElementById('parameter_value_id').hidden = true
      }
    }
    console.log(project_id);

  
    //document.getElementById("device_type").selectedIndex = 0; //0 = option 1
   // document.getElementById("device_sn").selectedIndex = 0; //0 = option 1

    const access_token = localStorage.getItem('access_token');
    await fetch(URL2 + 'project-device/getDevicesPerProject/' + project_id, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'access_token': access_token
      },
      credentials: 'include'
    }).then(response => response.json())

      .then(response => {
        console.log(response)
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


  handleClick = () => {
    this.handleShowCreate()
    this.getProjects()
    this.getGroups()
  }

  onSelect = (selectedList, selectedItem) => {
    this.setState({ 
      groupSelectedList: [],
    });
    console.log(selectedList, selectedItem)
    selectedItem.new = true
    selectedItem.is_active_inGroup = true
    this.setState({ 
      groupSelectedList: selectedList,
      groupSelectedItem: selectedItem
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
      groupSelectedList: selectedList,
      groupSelectedItem: selectedItem
    });
    console.log(this.state.groupSelectedList)
  }

  onRemove = (selectedList, removedItem) => {
    console.log(selectedList, removedItem)
    removedItem.new = false
    removedItem.is_active_inGroup = false
    this.state.groupRemovedList.push(removedItem)
    console.log(this.state.groupRemovedList)
    this.setState({ 
      groupSelectedList: selectedList,
      groupRemovedItem: removedItem,
    });
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
        console.log(response)
        console.log(response[0].id)
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

  handelEditNullChange = () => {

    if (this.state.edit_is_null == 1) {
      this.setState({
        edit_is_null: 0
      })
    } else if (this.state.edit_is_null == 0) {
      this.setState({
        edit_is_null: 1
      })
    }

  }

  handelEditEmailChange = () => {

    if (this.state.edit_is_email == 1) {
      this.setState({
        edit_is_email: 0
      })
    } else if (this.state.edit_is_email == 0) {
      this.setState({
        edit_is_email: 1
      })
    }

  }

  handelEditSignalChange = () => {

    if (this.state.edit_is_signal == 1) {
      this.setState({
        edit_is_signal: 0
      })
    } else if (this.state.edit_is_signal == 0) {
      this.setState({
        edit_is_signal: 1
      })
    }

  }

  handelCopyNullChange = () => {

    if (this.state.copy_is_null == 1) {
      this.setState({
        copy_is_null: 0
      })
    } else if (this.state.copy_is_null == 0) {
      this.setState({
        copy_is_null: 1
      })
    }

  }

  handelCopyEmailChange = () => {

    if (this.state.copy_is_email == 1) {
      this.setState({
        copy_is_email: 0
      })
    } else if (this.state.copy_is_email == 0) {
      this.setState({
        copy_is_email: 1
      })
    }

  }

  handelCopySignalChange = () => {

    if (this.state.copy_is_signal == 1) {
      this.setState({
        copy_is_signal: 0
      })
    } else if (this.state.copy_is_signal == 0) {
      this.setState({
        copy_is_signal: 1
      })
    }

  }

  checked = (value) => {

    if(value === 1){
      return true
    }else {
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
    this.setState({ show_loading: true, isLoaded: false });

    var min_value = document.getElementById("min_value").value;
    var max_value = document.getElementById("max_value").value;
    var start_time = this.state.start_time;
    var end_time = this.state.end_time;
    var type = document.getElementById("type").value;
    var is_email = this.state.is_email;
    var is_signal = this.state.is_signal;
    var is_null = this.state.is_null;

    const groups = this.state.groupSelectedList;


    var parameter_id = document.getElementById("parameter").value;

    var project_id = document.getElementById("project").value;
    var device_id = document.getElementById("device").value;

    if (!min_value || !max_value || !start_time || !end_time || !type || !parameter_id || !project_id || !device_id ) {
      alert("Please make sure to Fill the form")
      this.setState({
        show_loading: false,
        isLoaded:true,
        start_time: "00:00",
        end_time: "00:00",
        project: [],
        devices: [],
        device_id: 0,
        device_manufacturer_id: 0,
        parameters: [],
        msgs_types: [],
        project_device_id: 0,
      });
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
          type: type, is_email: is_email, is_signal: is_signal, is_null: is_null,
          parameter_id: parameter_id, project_device: project_device, groups:groups
        })
      })
      const json = await response.json();

      // console.log(json)
      if (json.status === false) {

        alert('Parameter Was Not Added Succesfuly')
        this.setState({
          show_loading: false,
          isLoaded:true,
          start_time: "00:00",
          end_time: "00:00",
          project: [],
          devices: [],
          device_id: 0,
          device_manufacturer_id: 0,
          parameters: [],
          msgs_types: [],
          project_device_id: 0,
        });
        this.closeModal()
      } else {
        alert('Parameter Added Succesfuly')

        //console.log(json.last_row)
        // let data3 = this.state.data
        // if(data3.length > 0){
        //   data3.unshift(json.last_row)
        // }else{
        //   data3.push(json.last_row)
        // }
        
        //console.log(data3)

        this.setState({
          data: json.last_row,
          show_loading: false,
          isLoaded: true,
          start_time: "00:00",
          end_time: "00:00",
          project: [],
          devices: [],
          device_id: 0,
          device_manufacturer_id: 0,
          parameters: [],
          msgs_types: [],
          project_device_id: 0,
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
    var edit_start_time = this.state.edit_start_time;
    var edit_end_time = this.state.edit_end_time;
    var edit_type = document.getElementById("edit_type").value;
    var edit_is_email = this.state.edit_is_email;
    var edit_is_signal = this.state.edit_is_signal;
    var edit_is_null = this.state.edit_is_null;
    var edit_id = this.state.editRow.id;
    let groupsEmployees = this.state.groupSelectedList;
    let groupsremovedEmployees = this.state.groupRemovedList;


    // console.log(edit_min_value,edit_max_value,edit_start_time,edit_end_time,edit_type,edit_is_email,edit_is_signal,edit_is_null,edit_id)

    
    if (this.state.editRow.min_value === edit_min_value && this.state.editRow.max_value === edit_max_value &&
      this.state.editRow.start_time === edit_start_time && this.state.editRow.end_time === edit_end_time &&
      this.state.editRow.type === edit_type && this.state.editRow.edit_is_email === edit_is_email &&
      this.state.editRow.is_signal === edit_is_signal && this.state.editRow.is_null === edit_is_null
      ) {
      alert("Error : No Changes Were Made!")
      this.setState({ 
        show_loading: false,
        edit_start_time: "00:00",
        edit_end_time: "00:00",
        groupSelectedList:[]
      });
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
          groups: groupsEmployees, 
          removed_groups:groupsremovedEmployees
        })
      })
      const json = await response.json();

      // console.log(json)
      if (json.status === false) {

        alert('Parameter Was Not Updated Succesfuly')
        this.setState({ 
          show_loading: false,
          edit_start_time: "00:00",
          edit_end_time: "00:00",
          groupSelectedList:[]
        });
        this.closeEditModal()
      } else {
        alert('Parameter Updated Succesfuly')


        this.setState({
          show_loading: false,
          data: json.last_data,
          edit_start_time: "00:00",
          edit_end_time: "00:00",
          groupSelectedList:[]
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

    var copy_min_value = document.getElementById("copy_min_value").value;
    var copy_max_value = document.getElementById("copy_max_value").value;
    var copy_start_time = this.state.copy_start_time;

    if(copy_start_time === "00:00"){
      copy_start_time = this.state.copyRow.start_time
    }
    var copy_end_time = this.state.copy_end_time;

    if(copy_end_time === "00:00"){
      copy_end_time = this.state.copyRow.end_time
    }

    var copy_type = document.getElementById("copy_type").value;
    var copy_is_email = this.state.copy_is_email;
    var copy_is_signal = this.state.copy_is_signal;
    var copy_is_null = this.state.copy_is_null;


    var copy_parameter_id = document.getElementById("copy_parameter").value;
    var copy_project_id = document.getElementById("copy_project").value;
    var copy_device_id = document.getElementById("copy_device").value;


    let groupsEmployees = this.state.groupSelectedList;
    let copiedEmployees = this.state.copyRow.groups

    if (!copy_min_value || !copy_max_value || !copy_start_time 
      || !copy_end_time || !copy_type || !copy_parameter_id 
      || !copy_project_id || !copy_device_id || groupsEmployees.length === 0) {

      alert("Please make sure to Fill the form")
      this.setState({
        show_loading: false,
        isLoaded:true,
        copy_start_time: "00:00",
        copy_end_time: "00:00",
        project: [],
        devices: [],
        device_id: 0,
        device_manufacturer_id: 0,
        parameters: [],
        msgs_types: [],
        project_device_id: 0,
      });
    } else {

      console.log(copy_project_id, copy_device_id)
      var copy_project_device = await this.getProjectDevice(copy_project_id, copy_device_id)


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
          min_value: copy_min_value,
          max_value: copy_max_value,
          start_time: copy_start_time,
          end_time: copy_end_time,
          type: copy_type,
          is_email: copy_is_email,
          is_signal: copy_is_signal,
          is_null: copy_is_null,
          parameter_id: copy_parameter_id,
          project_device: copy_project_device,
          groups:groupsEmployees
        })
      })
      const json = await response.json();

      console.log(json)
      if (json.status === false) {

        alert('Parameter Was Not Added Succesfuly')
        this.setState({ 
          show_loading: false,
          isLoaded:true,
          copy_start_time: "00:00",
          copy_end_time: "00:00",
          project: [],
          devices: [],
          device_id: 0,
          device_manufacturer_id: 0,
          parameters: [],
          msgs_types: [],
          project_device_id: 0,
          groupSelectedList:[]
        });
        this.closeCopyModal()
      } else {
        alert('Parameter Added Succesfuly')

        //console.log(json.last_row)
        // let data3 = this.state.data
        // if(data3.length > 0){
        //   data3.unshift(json.last_row)
        // }else{
        //   data3.push(json.last_row)
        // }
        
        //console.log(data3)

        this.setState({
          show_loading: false,
          isLoaded:true,
          data: json.last_row,
          copy_start_time: "00:00",
          copy_end_time: "00:00",
          project: [],
          devices: [],
          device_id: 0,
          device_manufacturer_id: 0,
          parameters: [],
          msgs_types: [],
          project_device_id: 0,
          groupSelectedList:[]
        });

        this.closeCopyModal()
        
      }


    }
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

  handelEditRow(row){
    // console.log('hi edit')
    for(const row of row.groups){
      row.new = false
      row.is_active_inGroup = true
    }

    this.setState({
      showEdit: true,
      editRow: row,
      groupSelectedList:row.groups
    })
    this.getGroups()
    console.log(this.state.showEdit)
    console.log(this.state.editRow)
  }

  handelCopyRow(row){
    // console.log('hi copy')
    this.setState({
      showCopy: true,
      copyRow: row,
      groupSelectedList:row.groups
    })
    this.getProjects()
    this.getGroups()
    this.handelProjectChange(undefined,row.project_device.project.id)
    this.handelDeviceChange(row.project_device.device.id)
    console.log(this.state.showCopy)
    console.log(this.state.copyRow)


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

  returnGroups(groupsRow){
    
    return(
    <div class="omDiv">
      {groupsRow.map((g)=>
          
            <div class="omDiv">
            <span style={{ cursor: 'pointer', color:'darkgray' }}>
              <i id={"Tooltip"+g.id} class="material-icons" style={{ fontSize: '20px' }}>groups</i>
            </span>
            <span class="omSpan">
              {g.name}
            </span>
            </div>
        )}
    </div>
    )
  }

  async getParameters() {
    const access_token = localStorage.getItem('access_token');
    await fetch(URL2 + 'project-parameter/getParameters', {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'access_token': access_token
      },
      credentials: 'include'
    }).then(response => response.json()).then(response => {
      console.log(response)
      this.setState(
        {
          data: response,

          columns: [
            {
              name: "Date & Time",
              selector: (row) => this.formatDate(row.created_at),
              sortable: true,
              wrap: true,
              grow: 0,
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
              grow: 0.5,
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
              grow: 0.5,
            },
            {
              name: "Min Value",
              selector: (row) => row.min_value,
              sortable: true,
              wrap: true,
              sortable: true,
              grow: 0.5,
              //format: row => `${row.name.slice(0, 500)}...`,
            },
            {
              name: "Max Value",
              selector: (row) => row.max_value,
              sortable: true,
              wrap: true,
              grow: 0.5,
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
              name: "Groups",
              selector: (row) => this.returnGroups(row.groups),
              sortable: true,
              wrap: true,
              //grow: 0.5,
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
            // {
            //   name: "Added By",
            //   //selector: (row) => row.created_by.name,
            //   sortable: true,
            //   grow: 0.5,
            // },
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
      console.log(this.state.data)
    })
  }

  async componentDidMount() {
    this.getParameters()
    // this.refreshData()

  }

  render() {
    const { isLoaded,editRow,copyRow } = this.state;
    return (
      <Container fluid className="main-content-container px-4">

        <Row noGutters style={{ paddingTop: "10px" }} className="mb-2">
          <Col lg="6" md="6" sm="12" className="mb-4">
            <PageTitle title={'O&M Parameters'} className="page-header text-sm-left" />
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


        
        {/* ------- ADD NEW PARAMETER FORM -------- */}
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
                          <select class="form-control" aria-label="project select" name="project" id="project" onChange={(e) => {this.handelProjectChange(e,undefined)}} required
                          >
                            <option disabled selected value> -- select an option -- </option>
                            {this.state.project.map((p) =>
                              <option key={p.id} value={p.id}>
                                {p.name}
                              </option>
                            )}
                          </select>
                        </div>
                        <div class="form-group">
                          <label >Parameter</label>
                          <select class="form-control" aria-label="parameter select" name="parameter" id="parameter" onChange={this.handelParameterChange} required>
                            <option disabled selected value> -- select an option -- </option>
                            {this.state.parameters.map((prm) =>
                              <option key={prm.id} value={prm.id}>
                                {prm.name}
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
                          <input type="number" step="0.01" class="form-control" placeholder="" name="min_value" id="min_value" required></input>
                        </div>

                        <div class="form-group">
                          <label >Groups</label>
                          <Multiselect
                            options={this.state.allGroups} // Options to display in the dropdown
                            //selectedValues={this.state.selectedValue} // Preselected value to persist in dropdown
                            onSelect={this.onSelect} // Function will trigger on select event
                            onRemove={this.onRemove} // Function will trigger on remove event
                            displayValue="name" // Property name to display in the dropdown options
                          />
                        </div>

                      </div>


                      <div class="col-sm-12 col-md-6">
                        <div class="form-group">
                          <label >Device</label>
                          <select class="form-control" aria-label="device select" name="device" id="device" onChange={this.handelDeviceChange} required>
                            <option disabled selected value> -- select an option -- </option>
                            {this.state.devices.map((d) =>
                              <option key={d.device.id} value={d.device.id}>
                                {d.device.desc + ' - ' + d.device.sn}
                              </option>
                            )}
                          </select>
                        </div>
                        <div class="form-group">
                          <label >Message Type</label>
                          <select class="form-control" aria-label="parameter select" name="type" id="type" required>
                            <option disabled selected value> -- select an option -- </option>
                            {this.state.msgs_types.map((msg) =>
                              <option key={msg.id} value={msg.name}>
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
                          <input type="number" step="0.01" class="form-control" placeholder="" name="max_value" id="max_value" required></input>
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-sm-12 col-md-4">
                        <div class="form-check form-check-inline">
                          <input type="checkbox" class="form-check-input" placeholder="" name="is_null" id="is_null" onChange={this.handelNullChange}></input>
                          <label class="form-check-label">Allow Empty</label>
                        </div>
                      </div>
                      <div class="col-sm-12 col-md-4">
                        <div class="form-check form-check-inline" inline>
                          <input type="checkbox" class="form-check-input" placeholder="" name="is_email" id="is_email" onChange={this.handelEmailChange}></input>
                          <label class="form-check-label">Send Email</label>
                        </div>
                      </div>
                      <div class="col-sm-12 col-md-4">
                        <div class="form-check form-check-inline" inline>
                          <input type="checkbox" class="form-check-input" placeholder="" name="is_signal" id="is_signal" onChange={this.handelSignalChange}></input>
                          <label class="form-check-label">Send Signal</label>
                        </div>
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
        {/* ------- END ADD NEW PARAMETER FORM -------- */}




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
            <Modal.Body><div className="alert alert-danger">Are you sure you want to delete this parameter?</div></Modal.Body>
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




        {/* ------- EDIT PARAMETER FORM -------- */}
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
                Edit Parameter
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form onSubmit={this.edit_handelSubmit}>
                <ul class="list-group list-group-flush">
                  <li class="list-group-item p-3">
                    <div class="row">
                      <div class="col-sm-12 col-md-6">

                        <div class="form-group">
                          <label >Project</label>
                          <select class="form-control" aria-label="project select" name="edit_project" id="edit_project" onChange={this.handelProjectChange} required
                          >
                              <option disabled selected key={editRow.project_device.project.id} value={editRow.project_device.project.id}>
                                {editRow.project_device.project.name}
                              </option>
                          
                          </select>
                        </div>
                        <div class="form-group">
                          <label >Parameter</label>
                          <select class="form-control" aria-label="parameter select" name="edit_parameter" id="edit_parameter" onChange={this.handelParameterChange} required>
                            
                              <option disabled selected key={editRow.parameter_id.id} value={editRow.parameter_id.id}>
                                {editRow.parameter_id.name}
                              </option>
                      
                          </select>
                        </div>
                        <div class="form-group">
                          <label >Start Time</label>
                          <label style={{float: "right"}}>{editRow.start_time}</label>
                          <TimePicker format={24} step="5"
                            onChange={this.handleEditTimeChange} value={this.state.edit_start_time}
                          />
                        </div>
                        <div class="form-group">
                          <label >Minimum value</label>
                          <input type="number" step="0.01" class="form-control" name="edit_min_value" id="edit_min_value" defaultValue={editRow.min_value} required></input>
                        </div>


                        <div class="form-group">
                          <label >Groups</label>
                          <Multiselect
                            options={this.state.allGroups} // Options to display in the dropdown
                            selectedValues={editRow.groups} // Preselected value to persist in dropdown
                            onSelect={this.onSelect} // Function will trigger on select event
                            onRemove={this.onRemove} // Function will trigger on remove event
                            displayValue="name" // Property name to display in the dropdown options
                          />
                        </div>


                        

                      </div>


                      <div class="col-sm-12 col-md-6">
                        <div class="form-group">
                          <label >Device</label>
                          <select class="form-control" aria-label="device select" name="edit_device" id="edit_device" onChange={this.handelDeviceChange} required>
                           
                              <option disabled selected key={editRow.project_device.device.id} value={editRow.project_device.device.id}>
                                {editRow.project_device.device.desc + ' - ' + editRow.project_device.device.sn}
                              </option>
                            
                          </select>
                        </div>
                        <div class="form-group">
                          <label >Message Type</label>
                          <select class="form-control" aria-label="parameter select" name="edit_type" id="edit_type" required>
                            <option selected key={editRow.type} value={editRow.type}>{editRow.type}</option>
                            {this.state.msgs_types.map((msg) =>
                              <option key={msg.id} value={msg.name}>
                                {msg.name}
                              </option>
                            )}
                          </select>
                        </div>
                        <div class="form-group">
                          <label >End Time</label>
                          <label style={{float: "right"}}>{editRow.end_time}</label>
                          <TimePicker format={24} step="5"
                            onChange={this.handleEditEndTimeChange} value={this.state.edit_end_time}
                          />
                        </div>
                        <div class="form-group">
                          <label >Maximum value</label>
                          <input type="tel" step="0.01" class="form-control" placeholder="" name="edit_max_value" id="edit_max_value"  defaultValue={editRow.max_value} required></input>
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-sm-12 col-md-4">
                        <div class="form-check form-check-inline">
                          <input type="checkbox" class="form-check-input" placeholder="" name="edit_is_null" id="edit_is_null" defaultChecked={this.checked(editRow.is_null)} onChange={this.handelEditNullChange}></input>
                          <label class="form-check-label">Allow Empty</label>
                        </div>
                      </div>
                      <div class="col-sm-12 col-md-4">
                        <div class="form-check form-check-inline" inline>
                          <input type="checkbox" class="form-check-input" placeholder="" name="edit_is_email" id="edit_is_email" defaultChecked={this.checked(editRow.is_email)} onChange={this.handelEditEmailChange}></input>
                          <label class="form-check-label">Send Email</label>
                        </div>
                      </div>
                      <div class="col-sm-12 col-md-4">
                        <div class="form-check form-check-inline" inline>
                          <input type="checkbox" class="form-check-input" placeholder="" name="edit_is_signal" id="edit_is_signal" defaultChecked={this.checked(editRow.is_signal)} onChange={this.handelEditSignalChange}></input>
                          <label class="form-check-label">Send Signal</label>
                        </div>
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
                  EDIT
                </button>
              </form>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.closeEditModal}>Close</Button>
            </Modal.Footer>
          </Modal>
          ) : (<div></div>)}
        </span>
        {/* ------- EDIT PARAMETER FORM FORM -------- */}



        {/* ------- Copy PARAMETER FORM -------- */}
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
                Copy Parameter
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form onSubmit={this.copy_handelSubmit}>
                <ul class="list-group list-group-flush">
                  <li class="list-group-item p-3">
                    <div class="row">
                      <div class="col-sm-12 col-md-6">

                        <div class="form-group">
                          <label >Project</label>
                          <select class="form-control" aria-label="project select" name="copy_project" id="copy_project" onChange={this.handelProjectChange} required
                          >
                              <option selected key={copyRow.project_device.project.id} value={copyRow.project_device.project.id}>
                                {copyRow.project_device.project.name}
                              </option>
                              {this.state.project.filter(value => value.id !== copyRow.project_device.project.id).map((p) =>
                              <option key={p.id} value={p.id}>
                                {p.name}
                              </option>
                            )}
                          
                          </select>
                        </div>
                        <div class="form-group">
                          <label >Parameter</label>
                          <select class="form-control" aria-label="parameter select" name="copy_parameter" id="copy_parameter" onChange={this.handelParameterChange} required>
                            
                              <option disabled value id="def_parameter_value_id"> -- select an option -- </option>
                              <option  selected key={copyRow.parameter_id.id} id="parameter_value_id" value={copyRow.parameter_id.id}>
                                {copyRow.parameter_id.name}
                              </option>
                              {this.state.parameters.filter(value => value.id !== copyRow.parameter_id.id).map((prm) =>
                              <option key={prm.id} value={prm.id}>
                                {prm.name}
                              </option>
                            )}

              
                      
                          </select>
                        </div>
                        <div class="form-group">
                          <label >Start Time</label>
                          <label style={{float: "right"}}>{copyRow.start_time}</label>
                          <TimePicker format={24} step="5"
                            onChange={this.handleCopyTimeChange} value={this.state.copy_start_time}
                          />
                        </div>
                        <div class="form-group">
                          <label >Minimum value</label>
                          <input type="number" step="0.01" class="form-control" name="copy_min_value" id="copy_min_value" defaultValue={copyRow.min_value} required></input>
                        </div>


                        
                        <div class="form-group">
                          <label >Groups</label>
                          <Multiselect
                            options={this.state.allGroups} // Options to display in the dropdown
                            selectedValues={copyRow.groups} // Preselected value to persist in dropdown
                            onSelect={this.onSelect} // Function will trigger on select event
                            onRemove={this.onRemove} // Function will trigger on remove event
                            displayValue="name" // Property name to display in the dropdown options
                          />
                        </div>

                      </div>


                      <div class="col-sm-12 col-md-6">
                        <div class="form-group">
                          <label >Device</label>
                          <select class="form-control" aria-label="device select" name="copy_device" id="copy_device" onChange={this.handelDeviceChange} required>
                                
                              <option disabled value id="def_device_value_id"> -- select an option -- </option>
                              <option selected key={copyRow.project_device.device.id} id ="device_value_id" value={copyRow.project_device.device.id}>
                                {copyRow.project_device.device.desc + ' - ' + copyRow.project_device.device.sn}
                              </option>
                              {this.state.devices.filter(value => value.device.id !== copyRow.project_device.device.id).map((d) =>
                              <option key={d.device.id} value={d.device.id}>
                                {d.device.desc + ' - ' + d.device.sn}
                              </option>
                            )}
                            
                          </select>
                        </div>
                        <div class="form-group">
                          <label >Message Type</label>
                          <select class="form-control" aria-label="parameter select" name="copy_type" id="copy_type" required>
                            <option key={copyRow.type} value={copyRow.type}>{copyRow.type}</option>
                            {this.state.msgs_types.filter(value => value.name !== copyRow.type).map((msg) =>
                              <option key={msg.id} value={msg.name}>
                                {msg.name}
                              </option>
                            )}
                          </select>
                        </div>
                        <div class="form-group">
                          <label >End Time</label>
                          <label style={{float: "right"}}>{copyRow.end_time}</label>
                          <TimePicker format={24} step="5"
                            onChange={this.handleCopyEndTimeChange} value={this.state.copy_end_time}
                          />
                        </div>
                        <div class="form-group">
                          <label >Maximum value</label>
                          <input type="tel" step="0.01" class="form-control" placeholder="" name="copy_max_value" id="copy_max_value"  defaultValue={copyRow.max_value} required></input>
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-sm-12 col-md-4">
                        <div class="form-check form-check-inline">
                          <input type="checkbox" class="form-check-input" placeholder="" name="copy_is_null" id="copy_is_null" defaultChecked={this.checked(copyRow.is_null)} onChange={this.handelCopyNullChange}></input>
                          <label class="form-check-label">Allow Empty</label>
                        </div>
                      </div>
                      <div class="col-sm-12 col-md-4">
                        <div class="form-check form-check-inline" inline>
                          <input type="checkbox" class="form-check-input" placeholder="" name="copy_is_email" id="copy_is_email" defaultChecked={this.checked(copyRow.is_email)} onChange={this.handelCopyEmailChange}></input>
                          <label class="form-check-label">Send Email</label>
                        </div>
                      </div>
                      <div class="col-sm-12 col-md-4">
                        <div class="form-check form-check-inline" inline>
                          <input type="checkbox" class="form-check-input" placeholder="" name="copy_is_signal" id="copy_is_signal" defaultChecked={this.checked(copyRow.is_signal)} onChange={this.handelCopySignalChange}></input>
                          <label class="form-check-label">Send Signal</label>
                        </div>
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
                  Copy
                </button>
              </form>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.closeCopyModal}>Close</Button>
            </Modal.Footer>
          </Modal>
          ) : (<div></div>)}
        </span>
        {/* ------- Copy PARAMETER FORM FORM -------- */}





      </Container>
    );
  }

}
export default O_M_parameter_conf