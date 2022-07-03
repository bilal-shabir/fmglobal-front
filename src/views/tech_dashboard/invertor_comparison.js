import React from "react";
import { Card,
    Container, Row, Col
  } from "shards-react";
import {NavLink as RouteNavLink, NavLink} from "react-router-dom";
import InvertorChart from "../../components/components-overview/tech_dashboard_components/invertor_details";
import DataTable, { createTheme } from "react-data-table-component";
import L from "../../components/components-overview/loader";
import { URL2 } from "../../constants";
import ReactExport from "react-data-export";
import { Button } from "react-bootstrap";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

const rowSelectCritera = row => row.name == "VoltageA" || row.name == "VoltageB" || row.name == "VoltageC" || row.name == "voltagePhaseA" || row.name == "voltagePhaseB" || row.name == "voltagePhaseC"
const paginationComponentOptions = {
    noRowsPerPage: true,
};
let controller
let controller2
let cancel
class InvertorComparison extends React.Component {
  constructor(props) {
    super(props);
    const invertor = this.props.match.params.id
    const today = new Date();
    const year = today.getFullYear()
    const month = this.addZero(today.getMonth()+1)
    const day =this.addZero(today.getDate())
    const chart1_date =year+'-'+month+'-'+day
    require('../../utils').checkpermision('TechnicalDashboard')
    var yesterday = new Date();
    yesterday.setDate( yesterday.getDate() - 1 );
    const year2 = yesterday.getFullYear()
    const month2 = this.addZero(yesterday.getMonth()+1)
    const day2 =this.addZero(yesterday.getDate())
    const chart2_date =year2+'-'+month2+'-'+day2
    const queryParams = new URLSearchParams(window.location.search);
    this.state={
        capacity1: null,
        capacity2: null,
        default_data: queryParams.get('p'),
        rawData1: [],
        rawData2: [],
        customer1: null,
        project1: null,
        device_desc1: null,
        customer2: null,
        project2: null,
        device_desc2: null,
        tableLoaded1: false,
        tableLoaded2: false,
        deviceLoaded: false,
        chartLoaded1: false,
        chartLoaded2: false,
        excelLoaded: false,
        chart1_date: chart1_date,
        chart2_date: chart2_date,
        excel_data: [],
        excel_data2: [],
        table_data1: [],
        table_data2: [],
        chart_data1 : [],
        projects: [],
        chart_data_temp1 : [],
        time1: [],
        chart_data2 : [],
        chart_data_temp2 : [],
        time2: [],
        invertor1: [],
        invertor2: [],
        invertors: [],
        invertors2: [],
        initialInvertor: invertor,
        initialProject: {},
        selectedrows1: [],
        selectedrows2: [],
        columns: [
            {
                name: 'Channels',
                selector: (row) => row.mapped_name,
                width: "150px"

            },
            {
                name: 'Description',
                selector: (row) => <span>{row.description}</span>,

            },

        ],
        customStyles : {
            rows: {
                style: {
                    minHeight: '15px', // override the row height
                },
            },
            headCells: {
                style: {
                    backgroundColor: '#004769',
                    color: 'white'
                }
            },
            pagination: {
                style: {
                    
                    fontSize: '9px',
                    minHeight: '15px',
                    
                },
            
            }
        },
    }
 }
 async componentDidMount(){
    cancel = new AbortController();
    const canceller = cancel.signal;
    // const company = localStorage.getItem('company');
    // var customer
    // var project
    // var device_desc
    fetch(URL2+`project/getProjectsbyCompany/2`, {
        headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            },
            credentials: 'include',
            canceller
        })
        .then(response => response.json())
        .then((json) => {
            if (json.statusCode == 404 || json.status==404 || json.statusCode == 500 || json.statusCode == 403 || json.statusCode == 401 || json.statusCode == 400 ) {
                throw Error(json.statusText)        
            }
            else{
            
            // console.log(json)
            const selectedProject = json.find(element => 
                element.projects_devices.find(e => 
                   e.device.sn ==  this.state.initialInvertor)
            )
            var array = []
            for (let index = 0; index < selectedProject.projects_devices.length; index++) {
                array[index] = selectedProject.projects_devices[index].device.sn;
                
            }
            // console.log("selectedPROjjjjeeecct", selectedProject)
            this.setState({
                
                project1: selectedProject.name,
                customer1: selectedProject.customer.name,
                
                project2: selectedProject.name,
                customer2: selectedProject.customer.name
            })
            // project = selectedProject.name
            // customer = selectedProject.customer.name
            

            
            const uniqueValuesSet = new Set();
            // array of objects with duplicate values
            const array2 = selectedProject.projects_devices
            const uniq2 = array2.filter((obj) => {
            // check if name property value is already in the set
            const isPresentInSet = uniqueValuesSet.has(obj.device.sn);
            // add name property value to Set
            uniqueValuesSet.add(obj.device.sn);
            // return the negated value of
            // isPresentInSet variable
            return !isPresentInSet;
            });
            // console.log(this.state.initialInvertor)
            // console.log("filtered Projects",selectedProject)
            this.setState({
                // invertor1: this.state.initialInvertor,
                // invertor2: this.state.initialInvertor,
                invertors: uniq2,
                invertors2: uniq2,
                projects : json,
                initialProject : selectedProject,
                
            })

        }})
        .catch((e) => {
            console.log(e)  
            // toast.warning('Something went wrong...', {
            //     position: "top-center",
            //     autoClose: 3000,
            //     hideProgressBar: false,
            //     closeOnClick: true,
            //     pauseOnHover: false,
            //     draggable: true,
            //     progress: undefined,
            //     });
          });
    
    await fetch(URL2+`device/getDevicesForInvertorComparison`, {
        headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            },
            credentials: 'include',
            canceller
        })
        .then(response => response.json())
        .then((json) => {
            if (json.statusCode == 404 || json.status==404 || json.statusCode == 500 || json.statusCode == 403 || json.statusCode == 401 || json.statusCode == 400) {
                throw Error(json.statusText)        
            }
            else{
            // console.log("hereeerrreee", json)
            var array = []
            // console.log(array[0])
            // console.log(this.state.initialInvertor)
            for (let index = 0; index < json.length; index++) {
                array[index] = json[index].sn;
                
            }
            const selectedInvertor = json.find(element => 
                element.sn == this.state.initialInvertor
            )
            this.setState({
                device_desc1: selectedInvertor.desc
            })
            // device_desc = selectedInvertor.desc
            // console.log(selectedInvertor)
            this.setState({
                // invertors: array,
                capacity1: selectedInvertor.capacity,
                capacity2: selectedInvertor.capacity,
                invertor1: selectedInvertor,
                invertor2: selectedInvertor,
                deviceLoaded: true
            })
        }})
        .catch((e) => {
            console.log(e)  
            // toast.warning('Something went wrong...', {
            //     position: "top-center",
            //     autoClose: 3000,
            //     hideProgressBar: false,
            //     closeOnClick: true,
            //     pauseOnHover: false,
            //     draggable: true,
            //     progress: undefined,
            //     });
          });
        // datatable
        if(document.getElementById("invertorone")){
            document.getElementById("invertorone").disabled = true
        }
        if(document.getElementById("invertortwo")){
            document.getElementById("invertortwo").disabled = true
        }
        if(document.getElementById("chartoneincrease")){
            document.getElementById("chartoneincrease").disabled = true
        }
        if(document.getElementById("chartonedecrease")){
            document.getElementById("chartonedecrease").disabled = true
        }
        if(document.getElementById("today")){
            document.getElementById("today").disabled = true
        }
        controller = new AbortController();
        const signal = controller.signal;
         fetch(URL2+`project/getInvetorDataForTechDashboard/${this.state.initialInvertor}/${this.state.chart1_date}/${this.state.invertor1.device_manufacturer.name}`, {
            headers : { 
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                },
                signal,
                credentials: 'include',
                
            })
            .then(response => response.json())
            .then((json) => {
                if (json.statusCode == 404 || json.status==404 || json.statusCode == 500 || json.statusCode == 403 || json.statusCode == 401 || json.statusCode == 400) {
                    throw Error(json.statusText)        
                }
                else{
                var capacity = []
            for (let index = 0; index < json.time.length; index++) {
                capacity[index] = this.state.capacity1;
                
            }
            var obj = {
                name: "capacity",
                mapped_name: "capacity",
                data: capacity,
                unit: "W"
            }

            var channels = json.channels
            channels.push(obj)
            json.channels = channels
                var sorted_array = json.channels
                sorted_array.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))
                // console.log(json)
                var excel_data = []
                for (let index = 0; index < json.channels.length; index++) {
                    
                    for (let index2 = 0; index2 < json.channels[index].data.length; index2++) {
                        var obj = {}
                        obj["customer"] = this.state.customer1
                        obj["project"] = this.state.project1
                        obj["device_desc"] = this.state.device_desc1 
                        obj["device"] = this.state.initialInvertor
                        obj["channel"] = json.channels[index].name
                        obj["time"] = json.time[index2]
                        obj["unit"] = json.channels[index].unit
                        obj["data"] = json.channels[index].data[index2] 
                        
                        excel_data.push(obj)
                    }
                }
                this.setState({
                    rawData1: json,
                    excel_data: excel_data,
                    table_data1: sorted_array.reverse(),
                    chart_data1: json.channels,
                    chart_data_temp1: json.channels,
                    time1: json.time,
                    tableLoaded1: true,
                })
                document.getElementById("chartoneincrease").disabled = false
                document.getElementById("chartonedecrease").disabled = false
                document.getElementById("today").disabled = false
                document.getElementById("invertorone").disabled = false
            }})
            .catch((e) => {
                console.log(e)  
                // toast.warning('Something went wrong...', {
                //     position: "top-center",
                //     autoClose: 3000,
                //     hideProgressBar: false,
                //     closeOnClick: true,
                //     pauseOnHover: false,
                //     draggable: true,
                //     progress: undefined,
                //     });
              });

        
        document.getElementById("charttwoincrease").disabled = true
        document.getElementById("charttwodecrease").disabled = true
        document.getElementById("yesterday").disabled = true
        controller2 = new AbortController();
        const signal2 = controller2.signal;
         fetch(URL2+`project/getInvetorDataForTechDashboard/${this.state.initialInvertor}/${this.state.chart2_date}/${this.state.invertor1.device_manufacturer.name}`, {
            headers : { 
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                },
                signal2,
                credentials: 'include',
                
            })
            .then(response => response.json())
            .then((json) => {
                if (json.statusCode == 404 || json.status==404 || json.statusCode == 500 || json.statusCode == 403 || json.statusCode == 401 || json.statusCode == 400 ) {
                    throw Error(json.statusText)        
                }
                else{
                var capacity = []
                for (let index = 0; index < json.time.length; index++) {
                    capacity[index] = this.state.capacity2;
                    
                }
                var obj = {
                    name: "capacity",
                    mapped_name: "capacity",
                    data: capacity,
                    unit: "W"
                }
    
                var channels = json.channels
                channels.push(obj)
                json.channels = channels
                var sorted_array = json.channels
                sorted_array.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))
                // console.log(json)
                var excel_data = []
                for (let index = 0; index < json.channels.length; index++) {
                    
                    for (let index2 = 0; index2 < json.channels[index].data.length; index2++) {
                        var obj = {}
                        obj["customer"] = this.state.customer1
                        obj["project"] = this.state.project1
                        obj["device_desc"] = this.state.device_desc1 
                        obj["device"] = this.state.initialInvertor
                        obj["channel"] = json.channels[index].name
                        obj["time"] = json.time[index2]
                        obj["unit"] = json.channels[index].unit
                        obj["data"] = json.channels[index].data[index2] 
                        
                        excel_data.push(obj)
                    }
                }
                this.setState({
                    rawData2: json,
                    excel_data2: excel_data,
                    table_data2: sorted_array.reverse(),
                    chart_data2: json.channels,
                    chart_data_temp2: json.channels,
                    time2: json.time,
                    tableLoaded2: true,
                    excelLoaded: true,
                })
                document.getElementById("charttwoincrease").disabled = false
                document.getElementById("charttwodecrease").disabled = false
                document.getElementById("yesterday").disabled = false
                
                document.getElementById("invertortwo").disabled = false
                
            }}).catch((e) => {
                console.log(e)  
                // toast.warning('Something went wrong...', {
                //     position: "top-center",
                //     autoClose: 3000,
                //     hideProgressBar: false,
                //     closeOnClick: true,
                //     pauseOnHover: false,
                //     draggable: true,
                //     progress: undefined,
                //     });
              });
 }
 componentWillUnmount(){
    if(cancel){
        cancel.abort();
    }
    if(controller){
        controller.abort();
    }
    if(controller2){
        controller2.abort();
    }
 }
 handleChange = async(selectedRows) => {
    if(selectedRows.selectedRows){
        if(selectedRows.selectedRows.length !=0){
    this.setState({
        selectedrows1 : selectedRows
    })
    // console.log("selected", selectedRows)
    this.setState({
        chartLoaded1: false
    })
   const rows = selectedRows.selectedRows
//    console.log(rows)
   var names = []
   for (let index = 0; index < rows.length; index++) {
       names[index] = rows[index].name
   }
//    console.log(names)

  var res =  this.state.chart_data1.filter(function (el) {
       return names.indexOf(el.name) >= 0; 
     });
    //  console.log(res)

   this.setState({
       chart_data_temp1: res,
       
   })
   setTimeout(this.set, 600);
}
}
}
 set = () =>{
    this.setState({
       chartLoaded1: true
    })
}
handleChangeSecond = async(selectedRows) => {
    if(selectedRows.selectedRows){
        if(selectedRows.selectedRows.length !=0){
    this.setState({
        selectedrows2 : selectedRows
    })   
    // console.log("selected", selectedRows)
    this.setState({
        chartLoaded2: false
    })
   const rows = selectedRows.selectedRows
//    console.log(rows)
   var names = []
   for (let index = 0; index < rows.length; index++) {
       names[index] = rows[index].name
   }
//    (names)

  var res =  this.state.chart_data2.filter(function (el) {
       return names.indexOf(el.name) >= 0; 
     });
    //  console.log(res)

   this.setState({
       chart_data_temp2: res,
       
   })
   setTimeout(this.setSecond, 600);
}
}
}
 setSecond = () =>{
    this.setState({
       chartLoaded2: true
    })
}
addZero(i) {
    if (i < 10) {i = "0" + i}
    return i;
}

handleProjectOneChange = async(e) =>{
    const selectedProject = this.state.projects.find(element => 
        element.id == e.target.value
    )
    const uniqueValuesSet = new Set();
    // array of objects with duplicate values
    const array2 = selectedProject.projects_devices
    const uniq2 = array2.filter((obj) => {
    // check if name property value is already in the set
    const isPresentInSet = uniqueValuesSet.has(obj.device.sn);
    // add name property value to Set
    uniqueValuesSet.add(obj.device.sn);
    // return the negated value of
    // isPresentInSet variable
    return !isPresentInSet;
    });
    // console.log("uniq2",  uniq2)
    this.setState({
        customer1: selectedProject.customer.name,
        project1: selectedProject.name,
        invertors: uniq2,
    })
}

handleInvertorOneChange=async(e)=>{
    document.getElementById("chartoneincrease").disabled = true
    document.getElementById("chartonedecrease").disabled = true
    document.getElementById("today").disabled = true
    this.cancelRequest()
    const sn = e.target.value
    const previousInvertor = this.state.invertor1
    controller = new AbortController();
    const signal = controller.signal;

    this.setState({
        excelLoaded: false
    })
    
    var selectedInvertor
     await fetch(URL2+`device/getDevicesForInvertorComparison`, {
        headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            },
            credentials: 'include'
        })
        .then(response => response.json())
        .then((json) => {
            // console.log(sn)
            // console.log(json)
             selectedInvertor = json.find(element => 
                element.sn == sn
            )
            // console.log(selectedInvertor)
            this.setState({
                invertor1: selectedInvertor,
            })
            
        })
        
    if(previousInvertor.device_manufacturer.id !== selectedInvertor.device_manufacturer.id){
        this.setState({
            tableLoaded1: false
        })
        await fetch(URL2+`project/getInvetorDataForTechDashboard/${sn}/${this.state.chart1_date}/${selectedInvertor.device_manufacturer.name}`, {
            headers : { 
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                },
                signal,
                credentials: 'include'
            })
            .then(response => response.json())
            .then((json) => {
                var capacity = []
                for (let index = 0; index < json.time.length; index++) {
                    capacity[index] = selectedInvertor.capacity;
                    
                }
                var obj = {
                    name: "capacity",
                    mapped_name: "capacity",
                    data: capacity,
                    unit: "W"
                }
    
                var channels = json.channels
                channels.push(obj)
                json.channels = channels

                this.setState({
                    capacity1: selectedInvertor.capacity
                })
                var sorted_array = json.channels
                sorted_array.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))
                var excel_data = []
                for (let index = 0; index < json.channels.length; index++) {
                    
                    for (let index2 = 0; index2 < json.channels[index].data.length; index2++) {
                        var obj = {}
                        obj["customer"] = this.state.customer1
                        obj["project"] = this.state.project1
                        obj["device_desc"] = this.state.invertor1.desc
                        obj["device"] = sn
                        obj["channel"] = json.channels[index].name
                        obj["time"] = json.time[index2]
                        obj["unit"] = json.channels[index].unit
                        obj["data"] = json.channels[index].data[index2] 
                        
                        excel_data.push(obj)
                    }
                }
                this.setState({
                    rawData1: json,
                    excel_data: excel_data,
                    chart_data1: json.channels,
                    chart_data_temp1: json.channels,
                    time1: json.time,
                    table_data1: sorted_array.reverse(),
                    tableLoaded1: true,
                    excelLoaded: true
                })
                document.getElementById("chartoneincrease").disabled = false
                document.getElementById("chartonedecrease").disabled = false
                document.getElementById("today").disabled = false
            })
    }
    else {
        this.setState({
            chartLoaded1: false
        })
        await fetch(URL2+`project/getInvetorDataForTechDashboard/${sn}/${this.state.chart1_date}/${selectedInvertor.device_manufacturer.name}`, {
            headers : { 
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                },
                signal,
                credentials: 'include'
            })
            .then(response => response.json())
            .then((json) => {
                var capacity = []
                for (let index = 0; index < json.time.length; index++) {
                    capacity[index] = selectedInvertor.capacity;
                    
                }
                var obj = {
                    name: "capacity",
                    mapped_name: "capacity",
                    data: capacity,
                    unit: "W"
                }
    
                var channels = json.channels
                channels.push(obj)
                json.channels = channels

                this.setState({
                    capacity1: selectedInvertor.capacity
                })
                var excel_data = []
                for (let index = 0; index < json.channels.length; index++) {
                    
                    for (let index2 = 0; index2 < json.channels[index].data.length; index2++) {
                        var obj = {}
                        obj["customer"] = this.state.customer1
                        obj["project"] = this.state.project1
                        obj["device_desc"] = this.state.invertor1.desc
                        obj["device"] = sn
                        obj["channel"] = json.channels[index].name
                        obj["time"] = json.time[index2]
                        obj["unit"] = json.channels[index].unit
                        obj["data"] = json.channels[index].data[index2] 
                        
                        excel_data.push(obj)
                    }
                }
                this.setState({
                    rawData1: json,
                    excel_data: excel_data,
                    chart_data1: json.channels,
                    chart_data_temp1: json.channels,
                    time1: json.time,
                    excelLoaded: true,
                    // table_data1: json.channels,
                    // tableLoaded1: true
                })
                document.getElementById("chartoneincrease").disabled = false
                document.getElementById("chartonedecrease").disabled = false
                document.getElementById("today").disabled = false
            })
            this.handleChange(this.state.selectedrows1)
    }
    
}
handleProjectTwoChange = async(e) =>{
    const selectedProject = this.state.projects.find(element => 
        element.id == e.target.value
    )
    const uniqueValuesSet = new Set();
    // array of objects with duplicate values
    const array2 = selectedProject.projects_devices
    const uniq2 = array2.filter((obj) => {
    // check if name property value is already in the set
    const isPresentInSet = uniqueValuesSet.has(obj.device.sn);
    // add name property value to Set
    uniqueValuesSet.add(obj.device.sn);
    // return the negated value of
    // isPresentInSet variable
    return !isPresentInSet;
    });
    this.setState({
        customer2: selectedProject.customer.name,
        project2: selectedProject.name,
        invertors2: uniq2,
    })
}
handleInvertorTwoChange=async(e)=>{
    document.getElementById("charttwoincrease").disabled = true
    document.getElementById("charttwodecrease").disabled = true
    document.getElementById("yesterday").disabled = true
    this.cancelRequestTwo()
    const sn = e.target.value
    const previousInvertor = this.state.invertor2
    controller2 = new AbortController();
    const signal = controller2.signal;
    
    this.setState({
        excelLoaded: false
    })

    var selectedInvertor
    await fetch(URL2+`device/getDevicesForInvertorComparison`, {
        headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            },
            credentials: 'include'
        })
        .then(response => response.json())
        .then((json) => {
            selectedInvertor = json.find(element => 
                element.sn == sn
            )
            // console.log(selectedInvertor)
            this.setState({
                invertor2: selectedInvertor,
            })
        })

    if(previousInvertor.device_manufacturer.id !== selectedInvertor.device_manufacturer.id){
        this.setState({
            tableLoaded2: false
        })
        

    await fetch(URL2+`project/getInvetorDataForTechDashboard/${sn}/${this.state.chart2_date}/${selectedInvertor.device_manufacturer.name}`, {
        headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            },
            signal,
            credentials: 'include'
        })
        .then(response => response.json())
        .then((json) => {
            var capacity = []
                for (let index = 0; index < json.time.length; index++) {
                    capacity[index] = selectedInvertor.capacity;
                    
                }
                var obj = {
                    name: "capacity",
                    mapped_name: "capacity",
                    data: capacity,
                    unit: "W"
                }
    
                var channels = json.channels
                channels.push(obj)
                json.channels = channels

                this.setState({
                    capacity2: selectedInvertor.capacity
                })
            var sorted_array = json.channels
            sorted_array.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))
            var excel_data = []
                for (let index = 0; index < json.channels.length; index++) {
                    
                    for (let index2 = 0; index2 < json.channels[index].data.length; index2++) {
                        var obj = {}
                        obj["customer"] = this.state.customer2
                        obj["project"] = this.state.project2
                        obj["device_desc"] = this.state.invertor2.desc 
                        obj["device"] = sn
                        obj["channel"] = json.channels[index].name
                        obj["time"] = json.time[index2]
                        obj["unit"] = json.channels[index].unit
                        obj["data"] = json.channels[index].data[index2] 
                        
                        excel_data.push(obj)
                    }
                }
            this.setState({
                rawData2: json,
                excel_data2: excel_data,
                chart_data2: json.channels,
                chart_data_temp2: json.channels,
                time2: json.time,
                table_data2: sorted_array.reverse(),
                tableLoaded2: true,
                excelLoaded: true,
            })
        document.getElementById("charttwoincrease").disabled = false
        document.getElementById("charttwodecrease").disabled = false
        document.getElementById("yesterday").disabled = false
        })
    }
    else{
        this.setState({
            chartLoaded2: false
        })

    await fetch(URL2+`project/getInvetorDataForTechDashboard/${sn}/${this.state.chart2_date}/${selectedInvertor.device_manufacturer.name}`, {
        headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            },
            signal,
            credentials: 'include'
        })
        .then(response => response.json())
        .then((json) => {
            var capacity = []
                for (let index = 0; index < json.time.length; index++) {
                    capacity[index] = selectedInvertor.capacity;
                    
                }
                var obj = {
                    name: "capacity",
                    mapped_name: "capacity",
                    data: capacity,
                    unit: "W"
                }
    
                var channels = json.channels
                channels.push(obj)
                json.channels = channels

                this.setState({
                    capacity2: selectedInvertor.capacity
                })
            var excel_data = []
                for (let index = 0; index < json.channels.length; index++) {
                    
                    for (let index2 = 0; index2 < json.channels[index].data.length; index2++) {
                        var obj = {}
                        obj["customer"] = this.state.customer2
                        obj["project"] = this.state.project2
                        obj["device_desc"] = this.state.invertor2.desc 
                        obj["device"] = sn
                        obj["channel"] = json.channels[index].name
                        obj["time"] = json.time[index2]
                        obj["unit"] = json.channels[index].unit
                        obj["data"] = json.channels[index].data[index2] 
                        
                        excel_data.push(obj)
                    }
                }
            this.setState({
                rawData2: json,
                excel_data2: excel_data,
                chart_data2: json.channels,
                chart_data_temp2: json.channels,
                time2: json.time,
                excelLoaded: true
                // table_data2: json.channels,
                // tableLoaded2: true
            })
        document.getElementById("charttwoincrease").disabled = false
        document.getElementById("charttwodecrease").disabled = false
        document.getElementById("yesterday").disabled = false
        })
        this.handleChangeSecond(this.state.selectedrows2)
    }
   
}
chartOneDateChange = async(e) =>{
    this.setState({
        chart1_date: e.target.value
    })
    document.getElementById("invertorone").disabled = true
    this.cancelRequest()

    controller = new AbortController();
    const signal = controller.signal;
    this.setState({
       chartLoaded1: false,
       excelLoaded: false,
    })
    const invertor = document.getElementById("invertorone").value
   await fetch(URL2+`project/getInvetorDataForTechDashboard/${invertor}/${e.target.value}/${this.state.invertor1.device_manufacturer.name}`, {
       headers : { 
           'Content-Type': 'application/json',
           'Accept': 'application/json',
           },
           signal,
           credentials: 'include'
       })
       .then(response => response.json())
       .then((json) => {
        var capacity = []
        for (let index = 0; index < json.time.length; index++) {
            capacity[index] = this.state.capacity1;
            
        }
        var obj = {
            name: "capacity",
            mapped_name: "capacity",
            data: capacity,
            unit: "W"
        }

        var channels = json.channels
        channels.push(obj)
        json.channels = channels


        var excel_data = []
        for (let index = 0; index < json.channels.length; index++) {
            
            for (let index2 = 0; index2 < json.channels[index].data.length; index2++) {
                var obj = {}
                obj["customer"] = this.state.customer1
                obj["project"] = this.state.project1
                obj["device_desc"] = this.state.invertor1.desc 
                obj["device"] = invertor
                obj["channel"] = json.channels[index].name
                obj["time"] = json.time[index2]
                obj["unit"] = json.channels[index].unit
                obj["data"] = json.channels[index].data[index2] 
                
                excel_data.push(obj)
            }
        }

           this.setState({
               rawData1: json,
               excel_data:excel_data,
               chart_data1: json.channels,
               excelLoaded: true,
            //    chart_data_temp1: json.channels,
               time1: json.time,
            //    tableLoaded1: true
           })
           
       })
       this.handleChange(this.state.selectedrows1)
       document.getElementById("invertorone").disabled = false
}
chartTwoDateChange = async(e) =>{
    this.setState({
        chart2_date: e.target.value,
        excelLoaded: false
    })
    document.getElementById("invertortwo").disabled = true
    this.cancelRequestTwo()

    controller2 = new AbortController();
    const signal = controller2.signal;
    this.setState({
       chartLoaded2: false,
       excelLoaded: false
    })
    const invertor = document.getElementById("invertortwo").value
   await fetch(URL2+`project/getInvetorDataForTechDashboard/${invertor}/${e.target.value}/${this.state.invertor1.device_manufacturer.name}`, {
       headers : { 
           'Content-Type': 'application/json',
           'Accept': 'application/json',
           },
           signal,
           credentials: 'include'
       })
       .then(response => response.json())
       .then((json) => {
        var capacity = []
        for (let index = 0; index < json.time.length; index++) {
            capacity[index] = this.state.capacity2;
            
        }
        var obj = {
            name: "capacity",
            mapped_name: "capacity",
            data: capacity,
            unit: "W"
        }

        var channels = json.channels
        channels.push(obj)
        json.channels = channels
        var excel_data = []
        for (let index = 0; index < json.channels.length; index++) {
            
            for (let index2 = 0; index2 < json.channels[index].data.length; index2++) {
                var obj = {}
                obj["customer"] = this.state.customer2
                obj["project"] = this.state.project2
                obj["device_desc"] = this.state.invertor2.desc 
                obj["device"] = invertor
                obj["channel"] = json.channels[index].name
                obj["time"] = json.time[index2]
                obj["unit"] = json.channels[index].unit
                obj["data"] = json.channels[index].data[index2] 
                
                excel_data.push(obj)
            }
        }
           this.setState({
               rawData2: json,
               excel_data2: excel_data,
               chart_data2: json.channels,
               excelLoaded: true,
            //    chart_data_temp2: json.channels,
               time2: json.time,
            //    tableLoaded2: true
           })
           
       })
       this.handleChangeSecond(this.state.selectedrows2)
       document.getElementById("invertortwo").disabled = false
}
chartOneDecreaseDate = async() => {
    // alert()
    this.cancelRequest()
    // console.log("selected", this.state.selectedrows1)
    controller = new AbortController();
    const signal = controller.signal;
     this.setState({
        chartLoaded1: false,
        excelLoaded: false,
     })
     document.getElementById("invertorone").disabled = true
    var date = new Date(this.state.chart1_date)
    date.setDate( date.getDate() - 1 );

    const year = date.getFullYear()
    const month = this.addZero(date.getMonth()+1)
    const day =this.addZero(date.getDate())
    const date2 =year+'-'+month+'-'+day
    this.setState({
        chart1_date: date2
    })
    const invertor = document.getElementById("invertorone").value
    document.getElementById("today").value = date2;
    await fetch(URL2+`project/getInvetorDataForTechDashboard/${invertor}/${date2}/${this.state.invertor1.device_manufacturer.name}`, {
        headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            },
            signal,
            credentials: 'include'
        })
        .then(response => response.json())
        .then((json) => {
            var capacity = []
        for (let index = 0; index < json.time.length; index++) {
            capacity[index] = this.state.capacity1;
            
        }
        var obj = {
            name: "capacity",
            mapped_name: "capacity",
            data: capacity,
            unit: "W"
        }

        var channels = json.channels
        channels.push(obj)
        json.channels = channels
            var excel_data = []
            for (let index = 0; index < json.channels.length; index++) {
                
                for (let index2 = 0; index2 < json.channels[index].data.length; index2++) {
                    var obj = {}
                    obj["customer"] = this.state.customer1
                    obj["project"] = this.state.project1
                    obj["device_desc"] = this.state.invertor1.desc
                    obj["device"] = invertor
                    obj["channel"] = json.channels[index].name
                    obj["time"] = json.time[index2]
                    obj["unit"] = json.channels[index].unit
                    obj["data"] = json.channels[index].data[index2] 
                    
                    excel_data.push(obj)
                }
            }
    
            this.setState({
                excel_data: excel_data,
                rawData1: json,
                chart_data1: json.channels,
                // chart_data_temp1: json.channels,
                time1: json.time,
                excelLoaded: true,
                // tableLoaded1: true
            })
            
        })
        this.handleChange(this.state.selectedrows1)
        document.getElementById("invertorone").disabled = false
}
chartOneIncreaseDate = async() => {
    // alert()
    this.cancelRequest()
    // console.log("selected", this.state.selectedrows1)
    controller = new AbortController();
    const signal = controller.signal;
     this.setState({
        chartLoaded1: false,
        excelLoaded: false
     })
     document.getElementById("invertorone").disabled = true
    var date = new Date(this.state.chart1_date)
    date.setDate( date.getDate() + 1 );

    const year = date.getFullYear()
    const month = this.addZero(date.getMonth()+1)
    const day =this.addZero(date.getDate())
    const date2 =year+'-'+month+'-'+day
    this.setState({
        chart1_date: date2
    })
    const invertor = document.getElementById("invertorone").value
    document.getElementById("today").value = date2;
    await fetch(URL2+`project/getInvetorDataForTechDashboard/${invertor}/${date2}/${this.state.invertor1.device_manufacturer.name}`, {
        headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            },
            signal,
            credentials: 'include'
        })
        .then(response => response.json())
        .then((json) => {
            var capacity = []
        for (let index = 0; index < json.time.length; index++) {
            capacity[index] = this.state.capacity1;
            
        }
        var obj = {
            name: "capacity",
            mapped_name: "capacity",
            data: capacity,
            unit: "W"
        }

        var channels = json.channels
        channels.push(obj)
        json.channels = channels
            var excel_data = []
            for (let index = 0; index < json.channels.length; index++) {
                
                for (let index2 = 0; index2 < json.channels[index].data.length; index2++) {
                    var obj = {}
                    obj["customer"] = this.state.customer1
                    obj["project"] = this.state.project1
                    obj["device_desc"] = this.state.invertor1.desc
                    obj["device"] = invertor
                    obj["channel"] = json.channels[index].name
                    obj["time"] = json.time[index2]
                    obj["unit"] = json.channels[index].unit
                    obj["data"] = json.channels[index].data[index2] 
                    
                    excel_data.push(obj)
                }
            }
    
            this.setState({
                excel_data: excel_data,
                rawData1: json,
                chart_data1: json.channels,
                // chart_data_temp1: json.channels,
                time1: json.time,
                excelLoaded: true
                // tableLoaded1: true
            })
            
        })
        this.handleChange(this.state.selectedrows1)
        document.getElementById("invertorone").disabled = false
}
chartTwoDecreaseDate = async() => {
    // alert()
    this.cancelRequestTwo()

    controller2 = new AbortController();
    const signal = controller2.signal;
     this.setState({
        chartLoaded2: false,
        excelLoaded: false
     })
     document.getElementById("invertortwo").disabled = true
    var date = new Date(this.state.chart2_date)
    date.setDate( date.getDate() - 1 );

    const year = date.getFullYear()
    const month = this.addZero(date.getMonth()+1)
    const day =this.addZero(date.getDate())
    const date2 =year+'-'+month+'-'+day
    this.setState({
        chart2_date: date2
    })
    const invertor = document.getElementById("invertortwo").value
    document.getElementById("yesterday").value = date2;
    await fetch(URL2+`project/getInvetorDataForTechDashboard/${invertor}/${date2}/${this.state.invertor2.device_manufacturer.name}`, {
        headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            },
            signal,
            credentials: 'include'
        })
        .then(response => response.json())
        .then((json) => {
            var capacity = []
        for (let index = 0; index < json.time.length; index++) {
            capacity[index] = this.state.capacity2;
            
        }
        var obj = {
            name: "capacity",
            mapped_name: "capacity",
            data: capacity,
            unit: "W"
        }

        var channels = json.channels
        channels.push(obj)
        json.channels = channels
            var excel_data = []
            for (let index = 0; index < json.channels.length; index++) {
                
                for (let index2 = 0; index2 < json.channels[index].data.length; index2++) {
                    var obj = {}
                    obj["customer"] = this.state.customer2
                    obj["project"] = this.state.project2
                    obj["device_desc"] = this.state.invertor2.desc 
                    obj["device"] = invertor
                    obj["channel"] = json.channels[index].name
                    obj["time"] = json.time[index2]
                    obj["unit"] = json.channels[index].unit
                    obj["data"] = json.channels[index].data[index2] 
                    
                    excel_data.push(obj)
                }
            }
            this.setState({
                excel_data2: excel_data,
                rawData2: json,
                chart_data2: json.channels,
                // chart_data_temp2: json.channels,
                time2: json.time,
                excelLoaded: false
                // tableLoaded2: true
            })
            
        })
        this.handleChangeSecond(this.state.selectedrows2)
        document.getElementById("invertortwo").disabled = false
}
chartTwoIncreaseDate = async() => {
    // alert()
    this.cancelRequestTwo()

    controller2 = new AbortController();
    const signal = controller2.signal;
     this.setState({
        chartLoaded2: false,
        excelLoaded: false
     })
     document.getElementById("invertortwo").disabled = true
    var date = new Date(this.state.chart2_date)
    date.setDate( date.getDate() + 1 );

    const year = date.getFullYear()
    const month = this.addZero(date.getMonth()+1)
    const day =this.addZero(date.getDate())
    const date2 =year+'-'+month+'-'+day
    this.setState({
        chart2_date: date2
    })
    const invertor = document.getElementById("invertortwo").value
    document.getElementById("yesterday").value = date2;
    await fetch(URL2+`project/getInvetorDataForTechDashboard/${invertor}/${date2}/${this.state.invertor2.device_manufacturer.name}`, {
        headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            },
            signal,
            credentials: 'include'
        })
        .then(response => response.json())
        .then((json) => {
            var capacity = []
        for (let index = 0; index < json.time.length; index++) {
            capacity[index] = this.state.capacity2;
            
        }
        var obj = {
            name: "capacity",
            mapped_name: "capacity",
            data: capacity,
            unit: "W"
        }

        var channels = json.channels
        channels.push(obj)
        json.channels = channels
            var excel_data = []
            for (let index = 0; index < json.channels.length; index++) {
                
                for (let index2 = 0; index2 < json.channels[index].data.length; index2++) {
                    var obj = {}
                    obj["customer"] = this.state.customer2
                    obj["project"] = this.state.project2
                    obj["device_desc"] = this.state.invertor2.desc 
                    obj["device"] = invertor
                    obj["channel"] = json.channels[index].name
                    obj["time"] = json.time[index2]
                    obj["unit"] = json.channels[index].unit
                    obj["data"] = json.channels[index].data[index2] 
                    
                    excel_data.push(obj)
                }
            }
            this.setState({
                excel_data2: excel_data,
                rawData2: json,
                chart_data2: json.channels,
                // chart_data_temp2: json.channels,
                time2: json.time,
                excelLoaded: true
                // tableLoaded2: true
            })
            
        })
        this.handleChangeSecond(this.state.selectedrows2)
        document.getElementById("invertortwo").disabled = false
}
cancelRequest = () =>{
    if(controller){
        controller.abort();
    }
}
cancelRequestTwo =() =>{
    if(controller2){
        controller2.abort();
    }
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
channelFilter = (e) =>{
    // console.log(this.state.all_channels)
    const data = this.state.rawData1.channels
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
        table_data1: filteredItems,
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
        table_data1: filteredItems,
        // datatableloaded:true
    })
    // console.log('data',this.state.data)
  }
}
channelFilter2 = (e) =>{
    // console.log(this.state.all_channels)
    const data = this.state.rawData2.channels
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
        table_data2: filteredItems,
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
        table_data2: filteredItems,
        // datatableloaded:true
    })
    // console.log('data',this.state.data)
  }
}
  render() {

  return (
    <Container fluid className="main-content-container px-4">
        <Row noGutters className="page-header py-4">
                <Col sm={10} md={10} lg={10} >
                <h4 style={{fontWeight:'600'}}>O&M Invertor Comparison Dashboard</h4>
                </Col>
                
            </Row>

            <Row style={{ marginTop:'30px'}}>
                    <Col>
                    {/* <button className="btn btn-primary" style={{backgroundColor:'#004769', borderColor:'#004769', padding:'5px'}}  onClick={this.goback}>Go Back</button> */}
                    <button className="btn btn-primary" style={{backgroundColor:'#004769', borderColor:'#004769', padding:'5px'}}  >
                    <NavLink tag={RouteNavLink} to={`/InvertorDetails/${JSON.parse(this.state.default_data).project_id}?p=${this.state.default_data}`}  style={{color:'white'}}>
                      <span style={{fontSize:14}}>Back</span>
                    </NavLink>
                    </button>
                    </Col>
                </Row>
           
            <Card style={{padding:'15px', marginBottom: '20px', marginTop: '5px'}}>

            <Row>
                <Col>
                </Col>
                <Col>
                </Col>
                <Col style={{textAlign:'right'}}>
                    {this.state.excelLoaded ? (
                        <ExcelFile filename="Invertor Data" element={(<Button style={{backgroundColor:'#004769', borderColor:'#004769'}}> Export Data </Button>)}>
                        <ExcelSheet data={this.state.excel_data} name="Invertor 1">
                            <ExcelColumn label="Customer" value="customer"/>
                            <ExcelColumn label="Project" value="project"/>
                            <ExcelColumn label="Device" value="device"/>
                            <ExcelColumn label="Device Description" value="device_desc"/>
                            <ExcelColumn label="Channel" value="channel"/>
                            <ExcelColumn label="Time" value={row => this.abc2(row.time)}/>
                            <ExcelColumn label="Data"  value={row => +parseFloat(row.data)}/>
                            <ExcelColumn label="Unit"  value="unit"/>
                        </ExcelSheet>
                        <ExcelSheet data={this.state.excel_data2} name="Invertor 2">
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
                            <input style={{ border: '1px solid black', height:'25px'}} class="form-control" id="search" type="text" placeholder="Search..." onKeyUp={this.channelFilter}></input>
                        </Col>
                    </Row>
                    {this.state.tableLoaded1 ? (<DataTable
                    columns={this.state.columns}
                    data={this.state.table_data1}
                    selectableRows
                    onSelectedRowsChange={this.handleChange}
                    customStyles= {this.state.customStyles}
                    selectableRowSelected ={rowSelectCritera}
                    paginationComponentOptions={paginationComponentOptions}
                    // striped
                    pagination
                    // disabled={this.state.tableDisable} 
                />) : (<L></L>)}
                
                </Col>
                <Col sm={9} md={9} lg={9} >
                <Row>
                        <Col sm={2} md={2} lg={2}>
                        <div style={{marginTop:'20px'}}>
                            <p>
                                Project <br/>
                                {this.state.deviceLoaded? (<select
                                    class="form-control"
                                    name="invertor1"
                                    id="i"
                                    onChange={this.handleProjectOneChange}
                                    defaultValue={this.state.initialProject.id}
                                    style={{marginBottom:'5px'}}
                                    >
                                    <option selected> -- select an option -- </option>
                                    {this.state.projects.map(project => (
                                        <option key={project.id} value={project.id}>
                                        {project.name}
                                        </option>
                                    ))}
                                </select>):(<div> </div>)}
                                Invertor <br/>
                                {this.state.deviceLoaded? (<select
                                    class="form-control"
                                    name="invertor1"
                                    id="invertorone"
                                    onChange={this.handleInvertorOneChange}
                                    defaultValue={this.state.initialInvertor}
                                    >
                                    <option selected> -- select an option -- </option>
                                    {this.state.invertors.map(invertor => (
                                        <option key={invertor.device.sn} value={invertor.device.sn}>
                                        {invertor.device.sn} / {invertor.device.desc}
                                        </option>
                                    ))}
                                </select>):(<div> </div>)}
                                
                            </p>
                            
                        </div>
                        <div style={{marginTop:'10px'}}>
                            <p>
                            <span style={{fontWeight:"bold" , fontSize: "12px"}}>Customer:</span> <span style={{fontSize: "12px"}}>{this.state.customer1}</span> <br/>
                                <span style={{fontWeight:"bold", fontSize: "12px"}}>Project:</span>  <span style={{fontSize: "12px"}}>{this.state.project1}</span> <br/>
                                <span style={{fontWeight:"bold", fontSize: "12px"}}>Invertor:</span> <span style={{fontSize: "12px"}}>{this.state.invertor1.sn ? this.state.invertor1.sn : null } / {this.state.invertor1.desc ? this.state.invertor1.desc : null}</span><br/>
                                <span style={{fontWeight:"bold", fontSize: "12px"}}>Invertor Type:</span>  <span style={{fontSize: "12px"}}>{this.state.invertor1.device_manufacturer ? this.state.invertor1.device_manufacturer.name : this.state.invertor1.manufacturer }</span><br/>
                                
                            </p>

                        </div>
                        
                        </Col>
                        <Col sm={10} md={10} lg={10}>
                        {this.state.chartLoaded1 ? (<InvertorChart top={true} type={this.state.invertor1.device_manufacturer.name} height={300} data={this.state.chart_data_temp1} time={this.state.time1}></InvertorChart>):(<L marginTop={"9%"} marginBottom={"1.8%"}></L>)}
                        <Row>
                        <Col lg="12" md="12" sm="12" className="d-flex justify-content-center">
                            <div>
                            <center style={{display:'flex', width:'100%'}}>
                            <button style={{border:0, backgroundColor: '#FFFFFF'}} id="chartoneincrease" onClick={this.chartOneDecreaseDate}  ><i style={{fontSize:'35px',marginRight:'10px', cursor:'pointer'}} class='fas'  >&#xf0d9;</i></button>
                            <input type="date" class="form-control" style={{textAlign:'center', width:'300px'}} id="today" defaultValue={this.state.chart1_date} onChange={this.chartOneDateChange}></input>
                            <button style={{border:0, backgroundColor: '#FFFFFF'}} id="chartonedecrease" onClick={this.chartOneIncreaseDate} ><i style={{fontSize:'35px',marginLeft:'10px',cursor:'pointer'}} class='fas' >&#xf0da;</i></button>
                            </center>
                            </div>
                        </Col>
                        </Row>
                        </Col>
                </Row>
                </Col>
                
               </Row>
               <hr/>
               <Row>
                <Col sm={3} md={3} lg={3}>
                    <Row style={{marginBottom: '3px'}}>
                        <Col>
                        </Col>
                        <Col>
                            <input style={{ border: '1px solid black', height:'25px'}} class="form-control" id="search" type="text" placeholder="Search..." onKeyUp={this.channelFilter2}></input>
                        </Col>
                    </Row>
                    {this.state.tableLoaded2 ? (<DataTable
                    columns={this.state.columns}
                    data={this.state.table_data2}
                    selectableRows
                    onSelectedRowsChange={this.handleChangeSecond}
                    customStyles= {this.state.customStyles}
                    selectableRowSelected ={rowSelectCritera}
                    // striped
                    paginationComponentOptions={paginationComponentOptions}
                    pagination
                    // disabled={this.state.tableDisable} 
                />) : (<L></L>)}
                
                </Col>
                <Col sm={9} md={9} lg={9} >
                <Row>
                        <Col sm={2} md={2} lg={2}>
                        <div style={{marginTop:'20px'}}>
                            <p>
                                Project <br/>
                                {this.state.deviceLoaded? (<select
                                    class="form-control"
                                    name="invertor1"
                                    id="i"
                                    onChange={this.handleProjectTwoChange}
                                    defaultValue={this.state.initialProject.id}
                                    style={{marginBottom:'5px'}}
                                    >
                                    <option selected> -- select an option -- </option>
                                    {this.state.projects.map(project => (
                                        <option key={project.id} value={project.id}>
                                        {project.name}
                                        </option>
                                    ))}
                                </select>):(<div> </div>)}
                                Invertor <br/>
                                {this.state.deviceLoaded? (<select
                                    class="form-control"
                                    name="invertor2"
                                    id="invertortwo"
                                    onChange={this.handleInvertorTwoChange}
                                    defaultValue={this.state.initialInvertor}
                                    >
                                    <option selected> -- select an option -- </option>
                                    {this.state.invertors2.map(invertor => (
                                        <option key={invertor.device.sn} value={invertor.device.sn}>
                                        {invertor.device.sn} / {invertor.device.desc}
                                        </option>
                                    ))}
                                </select>):(<div> </div>)}
                                
                            </p>
                            
                        </div>
                        <div style={{marginTop:'10px'}}>
                        <p>
                            <span style={{fontWeight:"bold" , fontSize: "12px"}}>Customer:</span> <span style={{fontSize: "12px"}}>{this.state.customer2}</span> <br/>
                                <span style={{fontWeight:"bold", fontSize: "12px"}}>Project:</span>  <span style={{fontSize: "12px"}}>{this.state.project2}</span> <br/>
                                <span style={{fontWeight:"bold", fontSize: "12px"}}>Invertor:</span> <span style={{fontSize: "12px"}}>{this.state.invertor2.sn} / {this.state.invertor2.desc}</span><br/>
                                <span style={{fontWeight:"bold", fontSize: "12px"}}>Invertor Type:</span>  <span style={{fontSize: "12px"}}>{this.state.invertor2.device_manufacturer ? this.state.invertor2.device_manufacturer.name : this.state.invertor2.manufacturer }</span><br/>
                                
                            </p>

                        </div>
                        
                        </Col>
                        <Col sm={10} md={10} lg={10}>
                        {this.state.chartLoaded2 ? (<InvertorChart top={false} height={300} type={this.state.invertor2.device_manufacturer.name} data={this.state.chart_data_temp2} time={this.state.time2}></InvertorChart>):(<L marginTop={"9%"} marginBottom={"1.8%"}></L>)}
                        <Row>
                        <Col lg="12" md="12" sm="12" className="d-flex justify-content-center">
                            <div>
                            <center style={{display:'flex', width:'100%'}}>
                            <button style={{border:0, backgroundColor: '#FFFFFF'}} id="charttwodecrease" ><i style={{fontSize:'35px',marginRight:'10px', cursor:'pointer'}} class='fas' onClick={this.chartTwoDecreaseDate} >&#xf0d9;</i></button>
                            <input type="date" class="form-control" style={{textAlign:'center', width:'300px'}} id="yesterday" defaultValue={this.state.chart2_date} onChange={this.chartTwoDateChange}></input>
                            <button style={{border:0, backgroundColor: '#FFFFFF'}} id="charttwoincrease" ><i style={{fontSize:'35px',marginLeft:'10px',cursor:'pointer'}} class='fas' onClick={this.chartTwoIncreaseDate}>&#xf0da;</i></button>
                            </center>
                            </div>
                        </Col>
                        </Row>
                        </Col>
                </Row>
                </Col>
               </Row>
            
            </Card>
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

export default InvertorComparison;
