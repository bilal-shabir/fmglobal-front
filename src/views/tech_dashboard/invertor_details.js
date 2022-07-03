import React, { useState } from "react";
import { Card,
    Container, Row, Col,FormSelect
  } from "shards-react";
import {Link,NavLink as RouteNavLink, NavLink} from "react-router-dom";
import InvertorChart from "../../components/components-overview/tech_dashboard_components/invertor_details";
import DataTable from "react-data-table-component";
import L from "../../components/components-overview/loader";
import { URL2 } from "../../constants";
import ReactExport from "react-data-export";
import { Modal, Button } from "react-bootstrap";
import '../../assets/style.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Can } from "@casl/react";
import setPermissions from "../defineAbility";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

// const rowSelectCritera = row => row.name == "EnergyExported" || row.name == "StandardizedPower" || row.name == "VoltageDC2" || row.name == "VoltageDC1"
// const rowSelectCritera = row =>  row.name == "VoltageDC2" || row.name == "VoltageDC1" || row.name == "voltagePhaseC" || row.name == "voltagePhaseB"
const rowSelectCritera = row => row.name == "VoltageA" || row.name == "VoltageB" || row.name == "VoltageC" || row.name == "voltagePhaseA" || row.name == "voltagePhaseB" || row.name == "voltagePhaseC"
const paginationComponentOptions = {
    noRowsPerPage: true,
};
let controller

let cancel
class InvertorDetails extends React.Component {

  constructor(props) {
    super(props);
    const queryParams = new URLSearchParams(window.location.search);
    var invertor = JSON.parse(queryParams.get('p'));

    // const split = invertor.type.split(" ")

    // invertor.type = split[0]

    invertor["project_id"] = this.props.match.params.id.toString()
    
    const heading = ` - ${invertor.customer} - ${invertor.project} - ${invertor.sn} (${invertor.type})`
     
    // console.log("details",invertor)
    const today = new Date();
        const year = today.getFullYear()
        const month = this.addZero(today.getMonth()+1)
        const day =this.addZero(today.getDate())
        const today_date =year+'-'+month+'-'+day
    this.state={
        errors: [],
        all_channels: [],
        selected_project: invertor.project,
        device_view: true,
        customers: [],
        projects: [],
        project_devices: [],
        all_projects: [],
        heading : heading,
        excelLoader: false,
        datatableloaded: false,
        project_id: this.props.match.params.id.toString(),
        tableLoaded : false,
        today_date: today_date,
        chartLoaded: false,
        invertor: invertor,
        selectedrows: [],
        chart_data : [],
        chart_data_temp : [],
        table_data: [],
        data: [],
        time: [],
        excel_data: [],
        error_columns: [
            {
                name: 'Project',
                selector: (row) => row.project_name

            },
            {
                name: 'Device',
                selector: (row) =>  row.device_sn,
            },
            {
                name: 'Date & Time',
                selector: (row) =>  this.abc2(row.created_at),
            },
            {
                name: 'Status',
                selector: (row) =>  row.message_status_name,
            },
            {
                name: 'Source',
                selector: (row) =>  row.message_source_name,
            },
        ],
        columns: [
            {
                name: 'Channels',
                selector: (row) => <span>{row.mapped_name}</span>,
                width: "150px"

            },
            {
                name: 'Description',
                selector: (row) => <span>{row.description}</span>,

            },

        ],
        columns_data: [
            {
                name: 'Customer',
                selector: (row) => <span onClick={()=>this.customerSelect(row.customer.name)} style={{cursor:'pointer'}}><u>{row.customer.name}</u></span>

            },
            {
                name: 'Project',
                selector: (row) =>  <span onClick={()=>this.projectSelect(row.name)} style={{cursor:'pointer'}}><u>{row.name}</u></span>,
            },
            // {
            //     name: 'Invertors Online',
            //     selector: (row) => <span>{row.online_devices+"/"+row.total_devices}{row.online_devices == row.total_devices ? (<span>🟢</span>):(<span>🔴</span>)}</span>,
            //     center: true
            // },
            {
                name: 'Power kW',
                selector: (row) => (row.production_generated/1000).toFixed(3),
                center:true
            },
            {
                name: 'Production (Today) kWh',
                selector: (row) => (row.production_for_today/1000).toFixed(3),
                center: true
            },
            {
                name: 'Errors',
                selector: 'errors',
                center: true
            },


        ],
        customStyles_data : {
            headCells: {
                style: {
                    backgroundColor: '#004769',
                    color: 'white'
                }
            }
        },
        customStyles : {
            headCells: {
                style: {
                    backgroundColor: '#004769',
                    color: 'white'
                }
            }
        },
    }
 }
  componentDidMount=async()=>{
    
    cancel = new AbortController();
    const signal = cancel.signal;

    var inv = this.state.invertor
    inv["single_device"]= true


    this.setState({
        invertor: inv,
        columns_data: [
            {
                name: 'Customer',
                selector: (row) =>row.customer

            },
            {
                name: 'Project',
                selector: (row) =>  <span onClick={()=>this.projectSelect(row.project)} style={{cursor:'pointer'}}><u>{row.project}</u></span>,
            },
            {
                name: 'Invertors',
                selector: (row) => <span style={{cursor:'pointer'}} onClick={()=>this.invertorChange(row.device.sn)}><u>{row.device.sn}</u>{row.device.status == 1 ? (<span>🟢</span>):(<span>🔴</span>)}</span>,
                center: true
            },
            {
                name: 'Description',
                selector: (row) =>  row.device.desc,
                center: true
            },
            {
                name: 'Power kW',
                selector: (row) => (row.production_generated/1000).toFixed(3),
                center:true
            },
            {
                name: 'Production (Today) kWh',
                selector: (row) => (row.production_for_today/1000).toFixed(3),
                center: true
            },
            {
                name: 'Errors',
                selector: (row) => <span style={{cursor:'pointer'}} onClick={()=>this.retrieve_errors(row.project_id, 3, null, row.device.sn)}><u>{row.errors}</u></span>,
                center: true
            },


        ]
    })
     
     fetch(URL2+'project/getPowerProjectsForTechDashboard', {
        headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            },
            credentials: 'include',
            signal
        })
        .then(response => response.json())
        .then((json) => {
            if (json.statusCode == 404 || json.status==404 || json.statusCode == 500 || json.statusCode == 403 || json.statusCode == 401 || json.statusCode == 400 ) {
                throw Error(json.statusText)        
            }
            else{
            var customers= []
            for (let index = 0; index < json.length; index++) {
                // projects[index] = json[index].id;
                customers[index] = json[index].customer.name;
                
            }
            // console.log(json)
            const filteredItems = json.filter(
                item => item.id == this.state.project_id )
            // this.setState({table_data : filteredItems})
            // console.log(filteredItems)
            const customer = filteredItems[0].customer.name
            var devices = filteredItems[0].projects_devices
            for (let index = 0; index < devices.length; index++) {
                devices[index]["customer"] = customer
                devices[index]["project"] = filteredItems[0].name
                devices[index]["project_id"]=filteredItems[0].id
                
            }
            // for (let index = 0; index < json.length; index++) {  
            //     projects[index] = json[index];
                
            // }

            const filteredItems2 = devices.filter(
                item => item.device.sn == this.state.invertor.sn )

            
            this.setState({
                all_projects: json,
                customers: customers,
                data: filteredItems2,
                datatableloaded: true,
            })

            
        }})
        .catch((e) => {
            console.log(e)  
            // toast.error('Error: Projects not fetched', {
            //     position: "top-center",
            //     autoClose: 3000,
            //     hideProgressBar: false,
            //     closeOnClick: true,
            //     pauseOnHover: false,
            //     draggable: true,
            //     progress: undefined,
            //     });
          });
        document.getElementById("increasedate").disabled = true
        document.getElementById("decreasedate").disabled = true
        document.getElementById("today").disabled = true
    await fetch(URL2+`project/getInvetorDataForTechDashboard/${this.state.invertor.sn}/${this.state.today_date}/${this.state.invertor.manufacturer}`, {
        headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            },
            credentials: 'include',
            signal
        })
        .then(response => response.json())
        .then((json) => {
            if (json.statusCode == 404 || json.status==404 || json.statusCode == 500 || json.statusCode == 403 || json.statusCode == 401 || json.statusCode == 400) {
                throw Error(json.statusText)        
            }
            else{
            var capacity = []
            for (let index = 0; index < json.time.length; index++) {
                capacity[index] = this.state.invertor.capacity;
                
            }
            var obj = {
                name: "capacity",
                mapped_name: "capacity",
                data: capacity,
                unit: "W"
            }

            var channels = json.channels
            channels.push(obj)

            

            var sorted_array = channels

            sorted_array.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))
            
            json.channels = sorted_array
            
            // console.log("datatat", this.state.invertor.capacity)
            // console.log("datatataaaa", json)
            // console.log("datatataaaa2", sorted_array)
            // console.log("datatataaaa2", json.channels)

            // var data = []

            // for (let index = 0; index < sort.length; index++) {
            //     var obj = {}
            //     const found = json.channels.find(element => element.name == sort[index]);
            //     obj = {
            //         name: sort[index],
            //         data: found.data,
            //         unit: found.unit
            //     }
            //     data.push(obj)
            // }
            // console.log("datatataaaa3", data)
            const customer = this.state.invertor.customer
            const project = this.state.invertor.project
            const device_desc = this.state.invertor.type
            var excel_data = []
            for (let index = 0; index < json.channels.length; index++) {
                
                for (let index2 = 0; index2 < json.channels[index].data.length; index2++) {
                    var obj = {}
                    obj["customer"] = customer
                    obj["project"] = project
                    obj["device_desc"] = device_desc 
                    obj["device"] = this.state.invertor.sn
                    obj["channel"] = json.channels[index].name
                    obj["time"] = json.time[index2]
                    obj["unit"] = json.channels[index].unit
                    obj["data"] = json.channels[index].data[index2] 
                    
                    excel_data.push(obj)
                }
            }
           
                this.setState({
                    all_channels: json,
                    excel_data: excel_data,
                    chart_data: json.channels,
                    chart_data_temp: json.channels,
                    time: json.time,
                    table_data: sorted_array.reverse(),
                    tableLoaded: true,
                    excelLoader: true
                })
            
            // console.log("excel data", excel_data)
            
            document.getElementById("increasedate").disabled = false
            document.getElementById("decreasedate").disabled = false
            document.getElementById("today").disabled = false
            
        }}).catch((e) => {
            // console.log(e)  
            toast.error('Error: Chart data not fetched', {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                });
          });
 }
 componentWillUnmount=()=>{
    if(cancel){
        cancel.abort();
    }
    this.cancelRequest()
 }

 customerSelect = (row) =>{
    this.cancelRequest()
    // if(this.state.table_data[0].device)
    var inv = this.state.invertor
    inv.customer = row
    inv["customer_select"]= true
    inv["single_device"] = false
    inv["all"] = false
    inv["project_select"]= false

    const filteredItems = this.state.data.filter(
        item => item.customer.name == row )
    this.setState({data : filteredItems, device_view: false})
}
customerChange = (event) => {
    document.getElementById("project").selectedIndex = 0
    document.getElementById("invertor").selectedIndex = 0
    this.cancelRequest()
    const projects = this.state.all_projects.filter(project =>
        project.customer.name == event.target.value)
    
    this.setState({
        device_view: false,
        projects: projects,
        project_devices: []
    })
    // console.log(projects)

    for (let index = 0; index < this.state.all_projects.length; index++) {
        var devices_online = 0
        for (let index1 = 0; index1 < this.state.all_projects[index].projects_devices.length; index1++) {
            if(this.state.all_projects[index].projects_devices[index1].device.status==1){
                devices_online = devices_online + 1
            }
        }
        this.state.all_projects[index]["online_devices"] = devices_online
        this.state.all_projects[index]["total_devices"] = (this.state.all_projects[index].projects_devices).length
        
    }
    var inv = this.state.invertor
    inv.customer = event.target.value
    inv["customer_select"]= true
    inv["single_device"] = false
    inv["all"] = false
    inv["project_select"]= false
    // if(this.state.table_data[0].device)

    this.setState({
        // tableLoaded: false,
        columns_data: [
            {
                name: 'Customer',
                selector: (row) => <span onClick={()=>this.customerSelect(row.customer.name)} style={{cursor:'pointer'}}><u>{row.customer.name}</u></span>

            },
            {
                name: 'Project',
                selector: (row) =>  <span onClick={()=>this.projectSelect(row.name)} style={{cursor:'pointer'}}><u>{row.name}</u></span>,
            },
            {
                name: 'Invertors Online',
                selector: (row) =>  <span>{row.online_devices+"/"+row.total_devices}{row.online_devices == row.total_devices ? (<span>🟢</span>):(<span>🔴</span>)}</span>,
                center: true
            },
            {
                name: 'Power kW',
                selector: (row) => (row.production_generated/1000).toFixed(3),
                center:true
            },
            {
                name: 'Production (Today) kWh',
                selector: (row) => (row.production_for_today/1000).toFixed(3),
                center: true
            },
            {
                name: 'Errors',
                selector: (row) => <span style={{cursor:'pointer'}} onClick={()=>this.retrieve_errors(row.id, 3)}><u>{row.errors}</u></span>,
                center: true
            },


        ],
      })
     
      setTimeout(()=>this.customerChangeSetData(projects,inv), 100);
}
customerChangeSetData = (projects,inv) => {
    this.setState({
        data : projects,
    })
}
projectSelect = (row) => {
   
    
       
            const filteredItems = this.state.all_projects.filter(
                item => item.name == row )
            // this.setState({table_data : filteredItems})\
            // console.log(filteredItems)
        const customer = filteredItems[0].customer.name
        var devices = filteredItems[0].projects_devices
        for (let index = 0; index < devices.length; index++) {
            devices[index]["customer"] = customer
            devices[index]["project"] = row
            devices[index]["project_id"]=filteredItems[0].id
            
        }
        var inv = this.state.invertor

        inv["customer_select"]= false
        inv["single_device"] = false
        inv["project_select"]= true
        inv["all"] = false
        // console.log(devices)
        
        this.setState({
            selected_project: row,
            device_view: true,
            invertor: inv,
            columns_data: [
                {
                    name: 'Customer',
                    selector: (row) =>row.customer
        
                },
                {
                    name: 'Project',
                    selector: (row) =>  <span onClick={()=>this.projectSelect(row.project)} style={{cursor:'pointer'}}><u>{row.project}</u></span>,
                },
                {
                    name: 'Invertors',
                    selector: (row) => <span style={{cursor:'pointer'}} onClick={()=>this.invertorChange(row.device.sn)}><u>{row.device.sn}</u>{row.device.status == 1 ? (<span>🟢</span>):(<span>🔴</span>)}</span>,
                    center: true
                },
                {
                    name: 'Description',
                    selector: (row) =>  row.device.desc,
                    center: true
                },
                {
                    name: 'Power kW',
                    selector: (row) => (row.production_generated/1000).toFixed(3),
                    center:true
                },
                {
                    name: 'Production (Today) kWh',
                    selector: (row) => (row.production_for_today/1000).toFixed(3),
                    center: true
                },
                {
                    name: 'Errors',
                    selector: (row) => <span style={{cursor:'pointer'}} onClick={()=>this.retrieve_errors(row.project_id, 3, null, row.device.sn)}><u>{row.errors}</u></span>,
                    center: true
                },
        
        
            ],
            data : devices,
            datatableloaded: true
        })

    
}
projectChange = (event) => {
    this.cancelRequest()
    const project = this.state.all_projects.find(project =>
        project.name == event.target.value)
    document.getElementById("invertor").selectedIndex = 0
    var project_devices = project.projects_devices
    this.setState({
        selected_project: event.target.value,
        device_view: true,
        project_devices: project_devices
    })
                // this.setState({table_data : filteredItems})\
                // console.log(filteredItems)
                const customer = project.customer.name
                for (let index = 0; index < project_devices.length; index++) {
                    project_devices[index]["customer"] = customer
                    project_devices[index]["project"] = event.target.value
                    project_devices[index]["project_id"]=project.id
    
                }
                var inv = this.state.invertor

        inv["customer_select"]= false
        inv["single_device"] = false
        inv["project_select"]= true
        inv["all"] = false
        
                // console.log(project_devices)
    
                this.setState({
                    invertor: inv,
                    columns_data: [
                        {
                            name: 'Customer',
                            selector: (row) =>row.customer
            
                        },
                        {
                            name: 'Project',
                            selector: (row) =>  <span onClick={()=>this.projectSelect(row.project)} style={{cursor:'pointer'}}><u>{row.project}</u></span>,
                        },
                        {
                            name: 'Invertors',
                            selector: (row) => <span style={{cursor:'pointer'}} onClick={()=>this.invertorChange(row.device.sn)}><u>{row.device.sn}</u>{row.device.status == 1 ? (<span>🟢</span>):(<span>🔴</span>)}</span>,
                            center: true
                        },
                        {
                            name: 'Description',
                            selector: (row) =>  row.device.desc,
                            center: true
                        },
                        {
                            name: 'Power kW',
                            selector: (row) => (row.production_generated/1000).toFixed(3),
                            center:true
                        },
                        {
                            name: 'Production (Today) kWh',
                            selector: (row) => (row.production_for_today/1000).toFixed(3),
                            center: true
                        },
                        {
                            name: 'Errors',
                            selector: (row) => <span style={{cursor:'pointer'}} onClick={()=>this.retrieve_errors(row.project_id, 3, null, row.device.sn)}><u>{row.errors}</u></span>,
                            center: true
                        },
            
            
                    ],
                    data : project_devices,
                    // tableLoaded: true,
                    datatableloaded: true
                })
            // document.getElementById("fullreport").disabled = false;
}
invertorSelect = async(row) => {
    const project = this.state.all_projects.find(
        item => item.name ==  this.state.data[0].project )
    // console.log(project)
    const devices = project.projects_devices
    const filteredItems = devices.filter(
        item => item.device.sn ==  row.target.value )
    // this.setState({table_data : filteredItems})\
    // console.log(filteredItems)

    const sn = filteredItems[0].device.sn
    const desc = filteredItems[0].device.desc
    this.setState({
        device_view: true,
        data : filteredItems,
        tableLoaded: false,
        excelLoader: false,
        heading : ` - ${filteredItems[0].customer} - ${filteredItems[0].project} - ${sn} (${desc})`
    })
    var inv = this.state.invertor
    inv.sn = filteredItems[0].device.sn
    inv.customer = filteredItems[0].customer
    inv.project = filteredItems[0].project
    inv.manufacturer = filteredItems[0].device.device_manufacturer.name
    inv["single_device"] = true
    inv["customer_select"]= false
    inv["project_select"]= false
    inv["all"]=false

    this.setState({
        invertor: inv
    })

    document.getElementById("increasedate").disabled = true
        document.getElementById("decreasedate").disabled = true
        document.getElementById("today").disabled = true
    await fetch(URL2+`project/getInvetorDataForTechDashboard/${sn}/${this.state.today_date}/${inv.manufacturer}`, {
        headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            },
            credentials: 'include'
        })
        .then(response => response.json())
        .then((json) => {
            if (json.statusCode == 404 || json.status==404 || json.statusCode == 500 || json.statusCode == 403 || json.statusCode == 401 || json.statusCode == 400) {
                throw Error(json.statusText)        
            }
            else{
        var capacity = []
        for (let index = 0; index < json.time.length; index++) {
            capacity[index] = filteredItems[0].device.capacity;
            
        }
        var obj = {
            name: "capacity",
            mapped_name: "capacity",
            data: capacity,
            unit: "W"
        }
        this.state.invertor.capacity = filteredItems[0].device.capacity

        var channels = json.channels
        channels.push(obj)
        var sorted_array = channels

        sorted_array.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))
        json.channels = sorted_array
            const customer = this.state.invertor.customer
        const project = this.state.invertor.project
        const device_desc = this.state.invertor.type
        var excel_data = []
        for (let index = 0; index < json.channels.length; index++) {
            
            for (let index2 = 0; index2 < json.channels[index].data.length; index2++) {
                var obj = {}
                obj["customer"] = customer
                obj["project"] = project
                obj["device_desc"] = device_desc
                obj["device"] = this.state.invertor.sn
                obj["channel"] = json.channels[index].name
                obj["time"] = json.time[index2]
                obj["unit"] = json.channels[index].unit
                obj["data"] = json.channels[index].data[index2] 
                
                excel_data.push(obj)
            }
        }
            this.setState({
                all_channels: json,
                excel_data: excel_data,
                chart_data: json.channels,
                chart_data_temp: json.channels,
                time: json.time,
                table_data: sorted_array.reverse(),
                tableLoaded: true,
                excelLoader: true
            })
            document.getElementById("increasedate").disabled = false
            document.getElementById("decreasedate").disabled = false
            document.getElementById("today").disabled = false
            
        }})
        .catch((e) => {
            // console.log(e)  
            toast.error('Error: Chart data not fetched', {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                });
          });
}
 addZero(i) {
    if (i < 10) {i = "0" + i}
    return i;
  }

 handleChange = async(selectedRows) => {
     if(selectedRows.selectedRows){
         if(selectedRows.selectedRows.length !=0){
    this.setState({
        selectedrows: selectedRows
    })
    //  console.log("selected", selectedRows)
     this.setState({
         chartLoaded: false
     })
    const rows = selectedRows.selectedRows
    // console.log(rows)
    var names = []
    for (let index = 0; index < rows.length; index++) {
        names[index] = rows[index].name
    }
    // console.log(names)

   var res =  this.state.chart_data.filter(function (el) {
        return names.indexOf(el.name) >= 0; 
      });
    //   console.log("herrreeee",res)

    this.setState({
        chart_data_temp: res,
        
    })
    setTimeout(this.set, 600);
}
}
 }

 set = () =>{
     this.setState({
        chartLoaded: true
     })
 }
 cancelRequest = () =>{
    if(controller){
        controller.abort();
    }
}
 decreaseDate = async() =>{
    this.cancelRequest()

    controller = new AbortController();
    const signal = controller.signal;
     this.setState({
        chartLoaded: false,
        excelLoader: false
     })
    var date = new Date(this.state.today_date)
    date.setDate( date.getDate() - 1 );

    const year = date.getFullYear()
    const month = this.addZero(date.getMonth()+1)
    const day =this.addZero(date.getDate())
    const date2 =year+'-'+month+'-'+day
    this.setState({
        today_date: date2
    })
    document.getElementById("today").value = date2;
    await fetch(URL2+`project/getInvetorDataForTechDashboard/${this.state.invertor.sn}/${date2}/${this.state.invertor.manufacturer}`, {
        headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            },
            signal,
            credentials: 'include'
        })
        .then(response => response.json())
        .then((json) => {
            if (json.statusCode == 404 || json.status==404 || json.statusCode == 500 || json.statusCode == 403 || json.statusCode == 401 || json.statusCode == 400) {
                throw Error(json.statusText)        
            }
            else{
            const customer = this.state.invertor.customer
            const project = this.state.invertor.project
            const device_desc = this.state.invertor.type
            var excel_data = []

            var capacity = []
            for (let index = 0; index < json.time.length; index++) {
                capacity[index] = this.state.invertor.capacity;
                
            }
            var obj = {
                name: "capacity",
                mapped_name: "capacity",
                data: capacity,
                unit: "W"
            }

           json.channels.push(obj)
            for (let index = 0; index < json.channels.length; index++) {
                
                for (let index2 = 0; index2 < json.channels[index].data.length; index2++) {
                    var obj = {}
                    obj["customer"] = customer
                    obj["project"] = project
                    obj["device_desc"] = device_desc
                    obj["device"] = this.state.invertor.sn
                    obj["channel"] = json.channels[index].name
                    obj["time"] = json.time[index2]
                    obj["unit"] = json.channels[index].unit
                    obj["data"] = json.channels[index].data[index2] 
                    
                    excel_data.push(obj)
                }
            }
            this.setState({
                all_channels: json,
                excel_data: excel_data,
                chart_data: json.channels,
                // chart_data_temp: json.channels,
                time: json.time,
                // tableLoaded: true
                excelLoader: true
            })
            
        }})
        .catch((e) => {
            // console.log(e)  
            toast.error('Error: Chart data not fetched', {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                });
          });
        this.handleChange(this.state.selectedrows)
 }

 increaseDate = async() =>{
    this.cancelRequest()

    controller = new AbortController();
    const signal = controller.signal;
     this.setState({
        chartLoaded: false,
        excelLoader: false
     })
    var date = new Date(this.state.today_date)
    date.setDate( date.getDate() + 1 );

    const year = date.getFullYear()
    const month = this.addZero(date.getMonth()+1)
    const day =this.addZero(date.getDate())
    const date2 =year+'-'+month+'-'+day
    this.setState({
        today_date: date2
    })
    document.getElementById("today").value = date2;
    await fetch(URL2+`project/getInvetorDataForTechDashboard/${this.state.invertor.sn}/${date2}/${this.state.invertor.manufacturer}`, {
        headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            },
            signal,
            credentials: 'include'
        })
        .then(response => response.json())
        .then((json) => {
            if (json.statusCode == 404 || json.status==404 || json.statusCode == 500 || json.statusCode == 403 || json.statusCode == 401 || json.statusCode == 400 ) {
                throw Error(json.statusText)        
            }
            else{
            var capacity = []
            for (let index = 0; index < json.time.length; index++) {
                capacity[index] = this.state.invertor.capacity;
                
            }
            var obj = {
                name: "capacity",
                mapped_name: "capacity",
                data: capacity,
                unit: "W"
            }

           json.channels.push(obj)
            const customer = this.state.invertor.customer
            const project = this.state.invertor.project
            const device_desc = this.state.invertor.type
            var excel_data = []
            for (let index = 0; index < json.channels.length; index++) {
                
                for (let index2 = 0; index2 < json.channels[index].data.length; index2++) {
                    var obj = {}
                    obj["customer"] = customer
                    obj["project"] = project
                    obj["device_desc"] = device_desc
                    obj["device"] = this.state.invertor.sn
                    obj["channel"] = json.channels[index].name
                    obj["time"] = json.time[index2]
                    obj["unit"] = json.channels[index].unit
                    obj["data"] = json.channels[index].data[index2] 
                    
                    excel_data.push(obj)
                }
            }
            this.setState({
                all_channels: json,
                excel_data: excel_data,
                chart_data: json.channels,
                // chart_data_temp: json.channels,
                time: json.time,
                // tableLoaded: true
                excelLoader: true
            })
            
        }})
        .catch((e) => {
            // console.log(e)  
            toast.error('Error: Chart data not fetched', {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                });
          });
        this.handleChange(this.state.selectedrows)

}
datechange = async(e) =>{
    this.setState({
        today_date: e.target.value,
        excelLoader: false
    })

    this.cancelRequest()

    controller = new AbortController();
    const signal = controller.signal;
    this.setState({
       chartLoaded: false
    })
   await fetch(URL2+`project/getInvetorDataForTechDashboard/${this.state.invertor.sn}/${e.target.value}/${this.state.invertor.manufacturer}`, {
       headers : { 
           'Content-Type': 'application/json',
           'Accept': 'application/json',
           },
           signal,
           credentials: 'include'
       })
       .then(response => response.json())
       .then((json) => {
        if (json.statusCode == 404 || json.status==404 || json.statusCode == 500 || json.statusCode == 403 || json.statusCode == 401 || json.statusCode == 400) {
            throw Error(json.statusText)        
        }
        else{
        var capacity = []
        for (let index = 0; index < json.time.length; index++) {
            capacity[index] = this.state.invertor.capacity;
            
        }
        var obj = {
            name: "capacity",
            mapped_name: "capacity",
            data: capacity,
            unit: "W"
        }

       json.channels.push(obj)
        const customer = this.state.invertor.customer
        const project = this.state.invertor.project
        const device_desc = this.state.invertor.type
        var excel_data = []
        for (let index = 0; index < json.channels.length; index++) {
            
            for (let index2 = 0; index2 < json.channels[index].data.length; index2++) {
                var obj = {}
                obj["customer"] = customer
                obj["project"] = project
                obj["device_desc"] = device_desc
                obj["device"] = this.state.invertor.sn
                obj["channel"] = json.channels[index].name
                obj["time"] = json.time[index2]
                obj["unit"] = json.channels[index].unit
                obj["data"] = json.channels[index].data[index2] 
                
                excel_data.push(obj)
            }
        }
           this.setState({
                all_channels: json,
               excel_data: excel_data,
               chart_data: json.channels,
            //    chart_data_temp: json.channels,
               time: json.time,
            //    tableLoaded: true
            excelLoader: true
           })
           
       }}).catch((e) => {
        // console.log(e)  
        toast.error('Error: Chart data not fetched', {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            });
      });
       this.handleChange(this.state.selectedrows)
}
invertorChange = async(row) => {
    const filteredItems = this.state.data.filter(
        item => item.device.sn == row )
    // console.log(filteredItems)
    const sn = filteredItems[0].device.sn
    const desc = filteredItems[0].device.desc
    this.setState({
        data : filteredItems,
        tableLoaded: false,
        excelLoader: false,
        heading : ` - ${filteredItems[0].customer} - ${filteredItems[0].project} - ${sn} (${desc})`
    })
    var inv = this.state.invertor
    inv.sn = row
    inv.customer = filteredItems[0].customer
    inv.project = filteredItems[0].project
    inv.manufacturer = filteredItems[0].device.device_manufacturer.name
    inv["single_device"] = true
    inv["customer_select"]= false
    inv["project_select"]= false
    inv["all"]=false

    this.setState({
        invertor: inv
    })

    document.getElementById("increasedate").disabled = true
        document.getElementById("decreasedate").disabled = true
        document.getElementById("today").disabled = true
    await fetch(URL2+`project/getInvetorDataForTechDashboard/${row}/${this.state.today_date}/${inv.manufacturer}`, {
        headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            },
            credentials: 'include'
        })
        .then(response => response.json())
        .then((json) => {
            if (json.statusCode == 404 || json.status==404 || json.statusCode == 500 || json.statusCode == 403 || json.statusCode == 401 || json.statusCode == 400 ) {
                throw Error(json.statusText)        
            }
            else{
            var capacity = []
            for (let index = 0; index < json.time.length; index++) {
                capacity[index] = filteredItems[0].device.capacity;
                
            }
            var obj = {
                name: "capacity",
                mapped_name: "capacity",
                data: capacity,
                unit: "W"
            }

            var channels = json.channels
            channels.push(obj)
        var sorted_array = channels

        

        this.state.invertor.capacity = filteredItems[0].device.capacity
        sorted_array.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))
        json.channels = sorted_array
            const customer = this.state.invertor.customer
        const project = this.state.invertor.project
        const device_desc = this.state.invertor.type
        var excel_data = []
        for (let index = 0; index < json.channels.length; index++) {
            
            for (let index2 = 0; index2 < json.channels[index].data.length; index2++) {
                var obj = {}
                obj["customer"] = customer
                obj["project"] = project
                obj["device_desc"] = device_desc
                obj["device"] = this.state.invertor.sn
                obj["channel"] = json.channels[index].name
                obj["time"] = json.time[index2]
                obj["unit"] = json.channels[index].unit
                obj["data"] = json.channels[index].data[index2] 
                
                excel_data.push(obj)
            }
        }
            this.setState({
                all_channels: json,
                excel_data: excel_data,
                chart_data: json.channels,
                chart_data_temp: json.channels,
                time: json.time,
                table_data: sorted_array.reverse(),
                tableLoaded: true,
                excelLoader: true
            })
            document.getElementById("increasedate").disabled = false
            document.getElementById("decreasedate").disabled = false
            document.getElementById("today").disabled = false
            
        }}).catch((e) => {
            // console.log(e)  
            toast.error('Error: Chart data not fetched', {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                });
          });
}
resetTable = () =>{
    //   this.setState({})
    var inv = this.state.invertor
    inv["project_select"]= false
    inv["customer_select"]= false
    inv["single_device"] = false
    inv["all"] = true
      this.setState({
          device_view: false,
        invertor: inv,
        datatableloaded: false,
        columns_data: [
            {
                name: 'Customer',
                selector: (row) => <span onClick={()=>this.customerSelect(row.customer.name)} style={{cursor:'pointer'}}><u>{row.customer.name}</u></span>

            },
            {
                name: 'Project',
                selector: (row) =>  <span onClick={()=>this.projectSelect(row.name)} style={{cursor:'pointer'}}><u>{row.name}</u></span>,
            },
            {
                name: 'Invertors Online',
                selector: (row) =>  <span>{row.online_devices+"/"+row.total_devices}{row.online_devices == row.total_devices ? (<span>🟢</span>):(<span>🔴</span>)}</span>,
                center: true
            },
            {
                name: 'Power kW',
                selector: (row) => (row.production_generated/1000).toFixed(3),
                center:true
            },
            {
                name: 'Production (Today) kWh',
                selector: (row) => (row.production_for_today/1000).toFixed(3),
                center: true
            },
            {
                name: 'Errors',
                selector: (row) => <span style={{cursor:'pointer'}} onClick={()=>this.retrieve_errors(row.id, 3)}><u>{row.errors}</u></span>,
                center: true
            },


        ],
      })
       setTimeout(this.settabledata, 100);
       
       
        
           
     
}
settabledata = () =>{
    for (let index = 0; index < this.state.all_projects.length; index++) {
        var devices_online = 0
        for (let index1 = 0; index1 < this.state.all_projects[index].projects_devices.length; index1++) {
            if(this.state.all_projects[index].projects_devices[index1].device.status==1){
                devices_online = devices_online + 1
            }
        }
        this.state.all_projects[index]["online_devices"] = devices_online
        this.state.all_projects[index]["total_devices"] = (this.state.all_projects[index].projects_devices).length
        
    }
    this.setState({
        // all_projects: json,
    data: this.state.all_projects,
    datatableloaded: true})
}
abc2 (date)
{
const split = date.split("T")
const split2 = split[1].split("+")

var time = Date.parse(split[0]);
var date1 = new Date(time);

let d =this.addZero(date1.getDate())
let m =this.addZero(date1.getMonth()+1)
let y = this.addZero(date1.getFullYear())

let time1 = y + "-" + m + "-"+d+" "+split2[0]
return time1

}
addZero(i) {
if (i < 10) {i = "0" + i}
return i;
}
goback = () =>{
    const data = JSON.stringify(this.state.invertor)
    document.location.href = `http://localhost:3001/TechnicalDashboard?data=${data}`
    // document.location.href = `${URL2}TechnicalDashboard`

    // localStorage.setItem("TechDefaultData", JSON.stringify(this.state.invertor));
}
onFilter = (e) =>{
    const key = e.key; // const {key} = event; ES6+
    if (key === "Backspace" || key === "Delete") {
      this.setState({
        datatableloaded:false,
      })
      const filteredItems = this.state.all_projects.filter(
        item =>
        JSON.stringify(item.mapped_name)
        .toLowerCase()
        .indexOf(e.target.value.toLowerCase()) !== -1 ||
    
      JSON.stringify(item.customer.name)
        .toLowerCase()
        .indexOf(e.target.value.toLowerCase()) !== -1 
    
    //   JSON.stringify(item.project.name)
    //     .toLowerCase()
    //     .indexOf(e.target.value.toLowerCase()) !== -1   
      );
      // console.log(filteredItems)
      this.setState({
        data: filteredItems,
        datatableloaded:true
      })
      // console.log('data',this.state.data)
    }
    else{
    // console.log(e.target.value)
    this.setState({
        datatableloaded:false,
    })
    const filteredItems = this.state.all_projects.filter(
        item =>
        JSON.stringify(item.mapped_name)
        .toLowerCase()
        .indexOf(e.target.value.toLowerCase()) !== -1 ||
    
        JSON.stringify(item.customer.name)
        .toLowerCase()
        .indexOf(e.target.value.toLowerCase()) !== -1 
    
        // JSON.stringify(item.project.name)
        // .toLowerCase()
        // .indexOf(e.target.value.toLowerCase()) !== -1

      );
    // console.log(filteredItems)
    this.setState({
        data: filteredItems,
        datatableloaded:true
    })
    // console.log('data',this.state.data)
  }
}

onFilterdevice = (e) =>{
    // alert("hello")
    const key = e.key; // const {key} = event; ES6+
    if (key === "Backspace" || key === "Delete") {
      this.setState({
        datatableloaded:false,
      })

      const data = this.state.all_projects.find(
          item => item.name == this.state.selected_project
      )
      const devices = data.projects_devices
      const filteredItems = devices.filter(
        item =>
        JSON.stringify(item.device.sn)
        .toLowerCase()
        .indexOf(e.target.value.toLowerCase()) !== -1 ||
    
      JSON.stringify(item.customer)
        .toLowerCase()
        .indexOf(e.target.value.toLowerCase()) !== -1 
    
    //   JSON.stringify(item.project.name)
    //     .toLowerCase()
    //     .indexOf(e.target.value.toLowerCase()) !== -1   
      );
      // console.log(filteredItems)
      this.setState({
        data: filteredItems,
        datatableloaded:true
      })
      // console.log('data',this.state.data)
    }
    else{
    // console.log(e.target.value)
    this.setState({
        datatableloaded:false,
    })
    const filteredItems = this.state.data.filter(
        item =>
        JSON.stringify(item.device.sn)
        .toLowerCase()
        .indexOf(e.target.value.toLowerCase()) !== -1 ||
    
        JSON.stringify(item.customer)
        .toLowerCase()
        .indexOf(e.target.value.toLowerCase()) !== -1 
    
        // JSON.stringify(item.project.name)
        // .toLowerCase()
        // .indexOf(e.target.value.toLowerCase()) !== -1

      );
    // console.log(filteredItems)
    this.setState({
        data: filteredItems,
        datatableloaded:true
    })
    // console.log('data',this.state.data)
  }
}
channelFilter = (e) =>{
    // console.log(this.state.all_channels)
    const data = this.state.all_channels.channels
    // console.log(data)
    const key = e.key; // const {key} = event; ES6+
    if (key === "Backspace" || key === "Delete") {
    //   this.setState({
    //     // datatableloaded:false,
    //   })
      const filteredItems = data.filter(
        item =>
        JSON.stringify(item.mapped_name)
        .toLowerCase()
        .indexOf(e.target.value.toLowerCase()) !== -1    
      );
      
      this.setState({
        table_data: filteredItems,
        // datatableloaded:true
      })
      // console.log('data',this.state.data)
    }
    else{
    // console.log(e.target.value)
    // this.setState({
    //     datatableloaded:false,
    // })
    const filteredItems = data.filter(
        item =>
        JSON.stringify(item.mapped_name)
        .toLowerCase()
        .indexOf(e.target.value.toLowerCase()) !== -1
    
    
        // JSON.stringify(item.project.name)
        // .toLowerCase()
        // .indexOf(e.target.value.toLowerCase()) !== -1

      );
    // console.log(filteredItems)
    this.setState({
        table_data: filteredItems,
        // datatableloaded:true
    })
    // console.log('data',this.state.data)
  }
}
retrieve_errors = async(project_id, msg_type,  date ,devices) => {

    // console.log(date)
    if(msg_type == 3){
        this.setState({
            error_heading: "Error"
        })
    }
    else{
        this.setState({
            error_heading: "Warning"
        })
    }
    this.setState({
        show_errors: true
    })
    var device = devices ? devices.length == 0 ? null : devices : null
    // console.log(device)
    await fetch(URL2+'messages/getMessages', {
        headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            },
            method: 'PATCH',
            body: JSON.stringify({ message_type: msg_type, project: project_id, date: date? date : null, device_sn: device }),
            credentials: 'include'
        })
        .then(response => response.json())
        .then((json) => {
            if (json.statusCode == 404 || json.status==404 || json.statusCode == 500 || json.statusCode == 403  || json.statusCode == 401 || json.statusCode == 400) {
                throw Error(json.statusText)        
            }
            else{
            // console.log("errors",json)
            this.setState({
                errors: json
            })
        }})
        .catch((e) => {
            // console.log(e)  
            toast.error('Error: Errors not fetched', {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                });
          });
}
error_close = () => {
    
    this.setState({
        errors: [],
        show_errors: false
    })
}
  
  render() {

  return (
    <Container fluid className="main-content-container px-4">
        <Row noGutters className="page-header py-4">
                <Col sm={10} md={10} lg={10} >
                <h4 style={{fontWeight:'600'}}>O&M Technical Dashboard{this.state.heading}</h4>
                </Col>
                <Col style={{textAlign: 'right'}}>
                <p style={{ paddingTop:'5px', fontSize:'14px'}}><Link style={{color:'black'}} to={`InvertorComparison/${this.state.invertor.sn}?p=${JSON.stringify(this.state.invertor)}`}>Invertor Comparison</Link></p>
                </Col>
                
            </Row>
            <Row style={{ marginTop:'20px'}}>
                    <Col>
                    {/* <button className="btn btn-primary" style={{backgroundColor:'#004769', borderColor:'#004769', padding:'5px'}}  onClick={this.goback}>Go Back</button> */}
                    <button className="btn btn-primary" style={{backgroundColor:'#004769', borderColor:'#004769', padding:'5px'}}>
                    <NavLink tag={RouteNavLink} to={`/TechnicalDashboard?data=${JSON.stringify(this.state.invertor)}`}  style={{color:'white'}}>
                      <span style={{fontSize:14}}>Back</span>
                    </NavLink>
                    </button>
                    </Col>
                </Row>
           
            <Card style={{padding:'15px', marginTop:'5px'}}>
                <Row>
                    <Col>
                    </Col>
                    <Col>
                    </Col>
                    <Col style={{textAlign:'right'}}>
                        {this.state.excelLoader ? (
                            <ExcelFile filename="Invertor Data" element={(<Button style={{backgroundColor:'#004769', borderColor:'#004769'}}> Export Data </Button>)}>
                            <ExcelSheet data={this.state.excel_data} name="Data">
                                <ExcelColumn label="Customer" value="customer"/>
                                <ExcelColumn label="Project" value="project"/>
                                <ExcelColumn label="Device" value="device"/>
                                <ExcelColumn label="Device Description" value="device_desc"/>
                                <ExcelColumn label="Channel" value="channel"/>
                                <ExcelColumn label="Time" value={row => this.abc2(row.time)}/>
                                <ExcelColumn label="Data"  value={row => +parseFloat(row.data)}/>
                                <ExcelColumn label="Unit"  value="unit"/>
                            </ExcelSheet>
                        </ExcelFile>
                        ) : (
                            <ExcelFile filename="Invertor Data" element={(<Button disabled style={{backgroundColor:'#004769', borderColor:'#004769'}}> Export Data </Button>)}>
                        <ExcelSheet data={this.state.excel_data} name="Data">
                            <ExcelColumn label="Customer" value="customer"/>
                            <ExcelColumn label="Project" value="project"/>
                            <ExcelColumn label="Device" value="device"/>
                            <ExcelColumn label="Device Description" value="device_desc"/>
                            <ExcelColumn label="Channel" value="channel"/>
                            <ExcelColumn label="Time" value="time"/>
                            <ExcelColumn label="Data"  value={row => +parseFloat(row.data)}/>
                            <ExcelColumn label="Unit"  value="unit"/>
                        </ExcelSheet>
                    </ExcelFile>
                        )}
                    
                    </Col>
                </Row>
            <Row>
                <Col sm={3} md={3} lg={3}>
                    <Row style={{marginBottom: '3px'}}>
                        <Col>
                        </Col>
                        <Col>
                        <input style={{ border: '1px solid black'}} class="form-control" id="search" type="text" placeholder="Search..." onKeyUp={this.channelFilter}></input>
                        </Col>
                    </Row>
                    {this.state.tableLoaded ? (
                        <DataTable
                        columns={this.state.columns}
                        data={this.state.table_data}
                        selectableRows
                        onSelectedRowsChange={this.handleChange}
                        customStyles= {this.state.customStyles}
                        selectableRowSelected ={rowSelectCritera}
                        paginationComponentOptions={paginationComponentOptions}
                        // striped
                        pagination
                        // disabled={this.state.tableDisable} 
                    />
                    ):(<L></L>)}
                
                
                </Col>
                <Col sm={9} md={9} lg={9} style={{paddingTop:'50px'}}>
                    
                    {this.state.chartLoaded ? (<InvertorChart top={false} height={580} data={this.state.chart_data_temp} time={this.state.time} type={this.state.invertor.manufacturer}></InvertorChart>) : (<L marginTop={"15%"} marginBottom={"19%"}></L>)}
                    
                    <Row>
                        <Col lg="12" md="12" sm="12" className="d-flex justify-content-center">
                            <div>
                            <center style={{display:'flex', width:'100%'}}>
                            <button style={{border:0, backgroundColor: '#FFFFFF'}} onClick={this.decreaseDate}  id="decreasedate" ><i style={{fontSize:'35px',marginRight:'10px', cursor:'pointer'}} class='fas' >&#xf0d9;</i></button>
                            <input type="date" class="form-control" style={{textAlign:'center', width:'300px'}} onChange={this.datechange} defaultValue={this.state.today_date} id="today" max={this.state.max_date}  ></input>
                            <button style={{border:0, backgroundColor: '#FFFFFF'}} onClick={this.increaseDate} id="increasedate"><i style={{fontSize:'35px',marginLeft:'10px',cursor:'pointer'}} class='fas'>&#xf0da;</i></button>
                            </center>
                            </div>
                        </Col>
            </Row>
                </Col>
            </Row>
            
            </Card>
            {/* <Row style={{ marginTop:'50px'}}>
                <Col><h5 style={{flex:'8'}} class="m-0 "><span style={{fontSize:'11px', marginLeft:'5px', color:'blue', cursor:'pointer'}} onClick={this.resetTable}>Reset</span></h5></Col>
            </Row> */}
            <Row style={{ marginBottom:'10px', marginTop:'50px'}}>
          <Col lg="12" md="12" sm="12">
            <Card small>
      
                <Row className="align-items-center" style={{margin: 'initial'}}>
                  <Col sm={3} className="my-1">
                    <FormSelect aria-label="Default select example" name="msg_type" id="customer" onChange={this.customerChange}>
                      <option selected disabled value={false}>Customer</option>
                      {this.state.customers.map(
                        (p) =>

                          <option key={p} value={p}>
                            {p}
                          </option>
                      )
                      }
                    </FormSelect>
                  </Col>
                  <Col sm={3} className="my-1">
                    <FormSelect aria-label="Default select example" name="location" id="project" onChange={this.projectChange}>
                      <option selected disabled value={false}>Project</option>
                      {this.state.projects.map(
                        (p) =>

                          <option key={p.name} value={p.name}>
                            {p.name}
                          </option>
                      )
                      }
                    </FormSelect>
                  </Col>
                  <Col sm={3} className="my-1">
                    <FormSelect aria-label="Default select example" name="location" id="invertor" onChange={this.invertorSelect}>
                      <option selected disabled value={false}>Invertor</option>
                      {this.state.project_devices.map(
                        (p) =>

                          <option key={p.device.sn} value={p.device.sn}>
                            {p.device.sn}
                          </option>
                      )
                      }
                    </FormSelect>
                  </Col>

                  <Col sm={1}>
                  <span style={{ fontSize: '11px', color: 'blue', cursor: 'pointer' }} onClick={this.resetTable}>Reset Filters</span>
                  </Col>
                  

                  <Col sm={2}>
                      {this.state.device_view ? (<input style={{ border: '1px solid black' }} class="form-control" id="search" type="text" placeholder="Search..." onKeyUp={this.onFilterdevice}></input>) : (
                          <input style={{ border: '1px solid black' }} class="form-control" id="search" type="text" placeholder="Search..." onKeyUp={this.onFilter}></input>
                      )}
                    {/* <input style={{ border: '1px solid black' }} class="form-control" id="search" type="text" placeholder="Search..." onKeyUp={this.onFilter}></input> */}
                  </Col>
                </Row>
            </Card>


          </Col>
        </Row>
            <Card small style={{borderRadius:'10px', marginBottom:'40px'}}>
                {this.state.datatableloaded ? (<DataTable
                        columns={this.state.columns_data}
                        data={this.state.data}
                        // selectableRows
                        // onSelectedRowsChange={this.handleChange}
                        customStyles= {this.state.customStyles_data}
                        // selectableRowSelected ={rowSelectCritera}
                        // paginationComponentOptions={paginationComponentOptions}
                        striped
                        pagination
                        // disabled={this.state.tableDisable} 
                    />) : (<L marginTop={"10%"}></L>)}
            
             </Card>

             <Modal
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    show={this.state.show_errors}
                    
                >
                    <Modal.Header>
                    <Modal.Title>{this.state.error_heading}</Modal.Title>
                    <span>
                    <Button variant="secondary" onClick={this.error_close} style={{marginLeft:'5px'}}>
                        Close
                    </Button>
                    </span>
                    </Modal.Header>
                    <Modal.Body>
                        <DataTable
                            columns={this.state.error_columns}
                            data={this.state.errors}
                            highlightOnHover={true}
                            style={{overflow:'wrap'}}
                            sortServer
                            pagination
                            expandableRows
                            expandableRowsComponent={
                                ({ data }) =>
                                  <div className="p-3">
                                    <p style={{fontSize:"12px"}}>Comments:</p>
                                    <span>
                                      {data.comments}
                                    </span>
                                  </div>
                              }
                            // customStyles= {this.state.customStyles}
                        />
                    </Modal.Body>
                    <Modal.Footer>
                    
                    </Modal.Footer>
                </Modal>
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
                style={{marginLeft:'6%'}}
                />
             
    </Container>
  
  );
}
} 

export default InvertorDetails;
