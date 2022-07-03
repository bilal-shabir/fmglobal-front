import React from "react";
//import PropTypes from "prop-types";
import { Modal, Button } from "react-bootstrap";
import { Card,
  Container, Row, Col, FormSelect
} from "shards-react";
import '../../assets/style.css';
//import {URL,DKEY} from '../constants';
import PageTitle from "../../components/common/PageTitle";
// import WeatherStatus from "../../components/components-overview/tech_dashboard_components/weather_status";
import ProductionChart from "../../components/components-overview/tech_dashboard_components/production_chart";
import TechCards from "../../components/components-overview/tech_dashboard_components/tech_dashboard_cards";
import error from "../../images/error_red.png";
import warning from "../../images/warning_yellow.png";
import DataTable, { createTheme } from "react-data-table-component";
import {Link,NavLink as RouteNavLink, NavLink} from "react-router-dom";
import { URL2 } from "../../constants";
import L from "../../components/components-overview/loader";
import TechLoader from "../../components/components-overview/tech_dashboard_components/tech_loader.js"
import image_not_found from '../../images/default_notFound.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Can } from "@casl/react";
import setPermissions from "../defineAbility";


const rowSelectCritera = row => row.id
let controller
let controller2
let controller3
class TechDashboard extends React.Component{ 

    constructor(props) {
        super(props);
        this._isMounted = false;
        const userIs_logged=localStorage.getItem('is_logged');
        if(userIs_logged != 1){
        this.props.history.push("/login");
        }
        require('../../utils').checkpermision('TechnicalDashboard')
        const today = new Date();
        const year = today.getFullYear()
        const month = this.addZero(today.getMonth()+1)
        const day =this.addZero(today.getDate())
        const today_date =year+'-'+month+'-'+day

        var yesterday = new Date();
        yesterday.setDate( yesterday.getDate() - 1 );
        const year2 = yesterday.getFullYear()
        const month2 = this.addZero(yesterday.getMonth()+1)
        const day2 =this.addZero(yesterday.getDate())
        const yesterday_date =year2+'-'+month2+'-'+day2

        const queryParams = new URLSearchParams(window.location.search);
        
        const data =queryParams.get('data') ? JSON.parse(queryParams.get('data')) : null

        const selected_project = data ? data.project : null
        
        this.state = {
            ability: null,
            selected_project: selected_project,
            device_view: false,
            error_heading: null,
            project_devices: [],
            projects: [],
            customers : [],
            default_settings: queryParams.get('data') ? JSON.parse(queryParams.get('data')) : null, 
            default_data: queryParams.get('data') ? JSON.parse(queryParams.get('data')) : null,
            fullreportprojects: [],
            fullreportdevices: null,
            all_projects: [],
            cardsLoaded: false,
            total_production: 0,
            total_invertors: 0,
            total_invertors_online: 0,
            total_projects: 0,
            total_projects_online: 0,
            offline_projects: 0,
            utilization: 0,
            current_power: 0,
            tableLoaded: false,
            chartLoaded: false,
            show_errors: false,
            time: [],
            production: [],
            consumption: [],
            time1: [],
            production1: [],
            consumption1: [],
            chartLoaded1: false,
            table_data:[],
            show_invertor_details: false,
            weatherimage1:null,
            weatherimage2:null,
            temperature: null,
            chart1_max_temperature: null,
            chart1_min_temperature: null,
            chart2_max_temperature: null,
            chart2_min_temperature: null,
            max_date: today_date,
            today_date : today_date,
            yesterday_date: yesterday_date,
            selectedRows: [],
            errors: [],
            striped: {
                default: '#004769'
              },
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
                    name: 'Customer',
                    selector: (row) => <span onClick={()=>this.customerSelect(row.customer.name)} style={{cursor:'pointer'}}><u>{row.customer.name}</u></span>

                },
                {
                    name: 'Project',
                    selector: (row) =>  <span onClick={()=>this.projectSelect(row.name)} style={{cursor:'pointer'}}><u>{row.name}</u></span>,
                },
                {
                    name: 'Invertors Online',
                    selector: (row) => <span>{row.online_devices+"/"+row.total_devices}{row.online_devices == row.total_devices ? (<span>🟢</span>):(<span>🔴</span>)}</span>,
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
            customStyles : {
                headCells: {
                    style: {
                        backgroundColor: '#004769',
                        color: 'white'
                    }
                }
            },
        }
        createTheme('solarized', {
            
            striped: {
              default: '#004769'
            }
          })
        // alert(today_date)
    //   require('../utils').checkpermision('WindSystem')
    }

    async componentDidMount(){
        this._isMounted = true;
        controller2 = new AbortController();
        const signal = controller2.signal;

        await fetch(URL2+'getPermissions',{
            headers : { 
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              // 'access_token' : json.access_token
             },
             credentials: 'include',
             signal
          }).then(response => response.json())
          .then((json)=>{
            if (json.statusCode == 404 || json.status==404 || json.statusCode == 500 || json.statusCode == 403 || json.statusCode == 401 || json.statusCode == 400) {
                throw Error(json.statusText)        
            }
            console.log("permissions", json)
            const ability = setPermissions(json);
            console.log("permissions",ability)
            this.setState({
              ability:ability
            })
          })
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
        if(document.getElementById("fullreport")){
            document.getElementById("fullreport").disabled = true;
        }
        
        // var x = document.getElementById("dailychart");
        // x.style.display = "none"
        console.log("defaultData",this.state.default_data)
        const projects = [];
        if (this.state.default_data && (this.state.default_data.single_device || this.state.default_data.project_select)) {
            this.setState({
                device_view: true,
                columns: [
                    {
                        name: 'Customer',
                        selector: (row) =>row.customer

                    },
                    {
                        name: 'Project',
                        selector: (row) =>  <span onClick={()=>this.projectSelect(row.project)} style={{cursor:'pointer'}}><u>{row.project}</u></span>,
                    },
                    // <span onClick={()=>this.projectSelect(row.name)} style={{cursor:'pointer'}}><u>{row.name}</u></span>
                    {
                        name: 'Invertors',
                        selector: (row) =>  <span onClick={()=>this.invertorSelect(row.device.sn)} style={{cursor:'pointer'}}><u>{row.device.sn}</u>{row.device.status == 1 ? (<span>🟢</span>):(<span>🔴</span>)}</span>,
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
                    {
                        name: 'Action',
                        selector: (row) =>  <button className="btn btn-primary" style={{backgroundColor:'#004769', borderColor:'#004769', color:'white'}} ><Link style={{color:'white'}} to={`InvertorDetails/${row.project_id}?p=${JSON.stringify({project: row.project, customer: row.customer, sn: row.device.sn, type: row.device.desc, manufacturer: row.device.device_manufacturer.name, capacity: row.device.capacity})}`}>Invertor Detail</Link></button>,
                        center: true
                    },


                ],
            })
        }
        var utilization
        var current_power
        await fetch(URL2+'project/getPowerProjectsForTechDashboard', {
            headers : { 
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                },
                credentials: 'include',
                signal
            })
            .then(response => response.json())
            .then((json) => {
                console.log(json)
                if (json.statusCode == 404 || json.status==404 || json.statusCode == 500 || json.statusCode == 403 || json.statusCode == 401 || json.statusCode == 400 ) {
                    this.setState({
                                weatherimage1: image_not_found,
                                chart1_max_temperature: null,
                                chart1_min_temperature: null,
                                tableDisable : true,
                                chartLoaded: false
                            })
                    throw Error(json.statusText)        
                }
                else {
                // console.log("Project data",json)
                var customers = []
                for (let index = 0; index < json.length; index++) {
                    projects[index] = json[index].id;
                    customers[index] = json[index].customer.name;
                    
                }
                const uniq_customers = [...new Set(customers)];
                this.setState({
                    customers: uniq_customers
                })
                var total_production = 0
                var total_projects = json.length
                var total_devices = 0
                var total_devices_online = 0
                var offline_projects = 0
                for (let index = 0; index < json.length; index++) {
                    
                    total_production=total_production+ json[index].production_generated 
                    var devices_online = 0
                    for (let index1 = 0; index1 < json[index].projects_devices.length; index1++) {
                        if(json[index].projects_devices[index1].device.status==1){
                            devices_online = devices_online + 1
                        }
                    }
                    if(devices_online == 0){
                        offline_projects = offline_projects + 1
                    }
                    total_devices = total_devices + (json[index].projects_devices).length
                    total_devices_online = total_devices_online + devices_online
                    json[index]["online_devices"] = devices_online
                    json[index]["total_devices"] = (json[index].projects_devices).length
                    
                }
                var devices = []
                if (this.state.default_data) {
                    if(this.state.default_data.single_device){
                        const filteredItems = json.filter(
                            item => item.name == this.state.default_data.project )
                        // this.setState({table_data : filteredItems})
                        // console.log(filteredItems)
                        const customer = filteredItems[0].customer.name
                        devices = filteredItems[0].projects_devices
                        for (let index = 0; index < devices.length; index++) {
                            devices[index]["customer"] = customer
                            devices[index]["project"] = filteredItems[0].name
                            devices[index]["project_id"]=filteredItems[0].id
                            
                        }
                        devices = devices.filter(
                            item => item.device.sn == this.state.default_data.sn )
                    }
                    else if (this.state.default_data.customer_select) {
                        devices = json.filter(
                            item => item.customer.name == this.state.default_data.customer )
                    }
                    else if(this.state.default_data.project_select){
                        const filteredItems = json.filter(
                            item => item.name == this.state.default_data.project )
                        // this.setState({table_data : filteredItems})
                        console.log(filteredItems)
                        const customer = filteredItems[0].customer.name
                        devices = filteredItems[0].projects_devices
                        for (let index = 0; index < devices.length; index++) {
                            devices[index]["customer"] = customer
                            devices[index]["project"] = filteredItems[0].name
                            devices[index]["project_id"]=filteredItems[0].id
                            
                        }
                    }
                    else {
                        devices = json
                    }
                    
                }
                this.setState({
                    all_projects: json,
                    table_data: this.state.default_data ? devices : json,
                    total_production: total_production/1000,
                    total_projects: total_projects,
                    total_invertors: total_devices,
                    total_invertors_online: total_devices_online,
                    offline_projects: offline_projects,
                    // cardsLoaded: true,
                    tableLoaded: true
                })

                document.getElementById("fullreport").disabled = false;
            }
            })
            .catch((e) => {
                console.log(e)
                // toast.error('Error: Projects not retrieved', {
                //     position: "top-center",
                //     autoClose: 3000,
                //     hideProgressBar: false,
                //     closeOnClick: true,
                //     pauseOnHover: false,
                //     draggable: true,
                //     progress: undefined,
                //     });
              });
            // console.log(this.state.table_data)
            // console.log(projects)

            const access_token = localStorage.getItem('access_token');  
        
            fetch(URL2+'project/getUtilizationForIntertors', {
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
                        this.setState({
                                    weatherimage1: image_not_found,
                                    chart1_max_temperature: null,
                                    chart1_min_temperature: null,
                                    tableDisable : true,
                                    chartLoaded: false
                                })
                        throw Error(json.statusText)        
                    }
                    else{

                    
                    // console.log(json)
                    utilization = json.utilization? json.utilization.toFixed() : 0
                    current_power = json.production ? (json.production/1000).toFixed() : 0

                    // console.log(utilization)
                    // console.log(current_power)
                    this.setState({
                        utilization: utilization,
                        current_power: current_power,
                        cardsLoaded: true
                    })
                    }
                })
                .catch((e) => {
                console.log(e)
                    // toast.error('Error: Utilization data not retrieved', {
                    //     position: "top-center",
                    //     autoClose: 3000,
                    //     hideProgressBar: false,
                    //     closeOnClick: true,
                    //     pauseOnHover: false,
                    //     draggable: true,
                    //     progress: undefined,
                    //     });
                  });
        
        // fetch(URL2+'weather-history/getCurrentweather/2022-04-19', {
        //     headers : { 
        //         'Content-Type': 'application/json',
        //         'Accept': 'application/json',
        //         'access_token' : access_token
        //         },
        //         credentials: 'include'
        //     })
        //     .then((json) =>{
        //         console.log(json)
        //     })

        
       
        // document.getElementById("production").checked = true;
        fetch(`https://api.weatherapi.com/v1/forecast.json?key=8b275674fea4449dab0133622222303&q=Bahrain&days=1&aqi=no&alerts=no`, {
            headers : { 
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Cookie': "",
                },
                signal
            })
            .then(response => response.json())
            .then((json) => {
                // console.log(json)
                this.setState({
                    weatherimage1: json.forecast.forecastday[0].day.condition.icon,
                    chart1_max_temperature: json.forecast.forecastday[0].day.maxtemp_c ,
                    chart1_min_temperature: json.forecast.forecastday[0].day.mintemp_c,
                })
            })

        fetch(`https://api.weatherapi.com/v1/history.json?key=8b275674fea4449dab0133622222303&q=Bahrain&dt=${this.state.yesterday_date}`, {
            headers : { 
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Cookie': "",
                },
                signal
            })
            .then(response => response.json())
            .then((json) => {
                // console.log(json)
                this.setState({
                    weatherimage2: json.forecast.forecastday[0].day.condition.icon,
                    chart2_max_temperature: json.forecast.forecastday[0].day.maxtemp_c ,
                    chart2_min_temperature: json.forecast.forecastday[0].day.mintemp_c,
                })
            })
        
    }

    componentWillUnmount(){
        this._isMounted = false;
        if(controller2){
            controller2.abort();
        }
        this.cancelRequest2()
        this.cancelRequest()
    }

    handleClose = () =>{
        var x = document.getElementById("dailychart");
        x.style.display = "none"
    }
    retrieve_errors = async(project_id, msg_type,  date ,devices) => {
        controller2 = new AbortController();
        const signal = controller2.signal;
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
        var device = devices ? devices.length == 0 ? null : devices : null
        // console.log(project_id)
        await fetch(URL2+'messages/getMessages', {
            headers : { 
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                },
                method: 'PATCH',
                body: JSON.stringify({ message_type: msg_type, project: project_id, date: date? date : null, device_sn: device }),
                credentials: 'include',
                signal
            })
            .then(response => response.json())
            .then((json) => {
                if (json.statusCode == 404 || json.status==404 || json.statusCode == 500 || json.statusCode == 403 || json.statusCode == 401 || json.statusCode == 400) {
                    throw Error(json.statusText)        
                }
                else{
                // console.log("errors",json)
                this.setState({
                    errors: json,
                    show_errors: true
                })
            }
            })
            .catch((e) => {
                // console.log(e)  
                toast.warning('Something went wrong, Errors not fetched', {
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
    abc2 (date)
{
const split = date.split("T")
// const split2 = split[1].split("+")

var time = Date.parse(split[0]);
var date1 = new Date(time);

let d =this.addZero(date1.getDate())
let m =this.addZero(date1.getMonth()+1)
let y = this.addZero(date1.getFullYear())

let time1 = y + "-" + m + "-"+d+" "+split[1]
return time1

}

    customerSelect = (row) =>{
        this.cancelRequest()
        this.cancelRequest2()
        var default_settings = this.state.default_settings ? this.state.default_settings : {}

        default_settings['customer'] = row
        default_settings['customer_select'] = true
        default_settings['project_select'] = false
        default_settings['all'] = false
        default_settings['single_device'] = false
        // if(this.state.table_data[0].device)
        const filteredItems = this.state.table_data.filter(
            item => item.customer.name == row )
        this.setState({table_data : filteredItems, default_settings: default_settings, fullreportdevices: null, project_devices: [], device_view: false})
        
    }
    projectSelect = (row) => {
        this.cancelRequest()
        this.cancelRequest2()
        var default_settings = this.state.default_settings ? this.state.default_settings : {}
        default_settings['project'] = row
        default_settings['customer_select'] = false
        default_settings['project_select'] = true
        default_settings['all'] = false
        default_settings['single_device'] = false
        document.getElementById("fullreport").disabled = true;
        
            
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
                    default_settings['project_id'] = filteredItems[0].id
            
                    // console.log(devices)
        
                    this.setState({
                        selected_project: row,
                        device_view: true,
                        columns: [
                            {
                                name: 'Customer',
                                selector: (row) =>row.customer
        
                            },
                            {
                                name: 'Project',
                                selector: (row) =>  <span onClick={()=>this.projectSelect(row.project)} style={{cursor:'pointer'}}><u>{row.project}</u></span>,
                            },
                            // <span onClick={()=>this.projectSelect(row.name)} style={{cursor:'pointer'}}><u>{row.name}</u></span>
                            {
                                name: 'Invertors',
                                selector: (row) =>  <span onClick={()=>this.invertorSelect(row.device.sn)} style={{cursor:'pointer'}}><u>{row.device.sn}</u>{row.device.status == 1 ? (<span>🟢</span>):(<span>🔴</span>)}</span>,
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
                            {
                                name: 'Action',
                                selector: (row) =>  <button className="btn btn-primary" style={{backgroundColor:'#004769', borderColor:'#004769', color:'white'}} ><Link style={{color:'white'}} to={`InvertorDetails/${row.project_id}?p=${JSON.stringify({project: row.project, customer: row.customer, sn: row.device.sn, type: row.device.desc, manufacturer: row.device.device_manufacturer.name, capacity: row.device.capacity})}`}>Invertor Detail</Link></button>,
                                center: true
                            },
        
        
                        ],
                        table_data : devices,
                        tableLoaded: true,
                        default_settings: default_settings
                    })
                document.getElementById("fullreport").disabled = false;
           
            
    }
    invertorSelect = (row) => {
        this.cancelRequest()
        this.cancelRequest2()
        var default_settings = this.state.default_settings ? this.state.default_settings : {}
        default_settings['sn'] = row
        default_settings['customer_select'] = false
        default_settings['project_select'] = false
        default_settings['all'] = false
        default_settings['single_device'] = true
        const filteredItems = this.state.table_data.filter(
            item => item.device.sn == row )
        // this.setState({table_data : filteredItems})\
        default_settings['project'] = filteredItems[0].project
        default_settings['project_id'] = filteredItems[0].project_id
        // console.log(filteredItems)
        this.setState({
            device_view: true,
            table_data : filteredItems,
            default_settings: default_settings
        })
    }
    addZero(i) {
        if (i < 10) {i = "0" + i}
        return i;
    }
    decreaseTodaysDate =async () => {
        
        this.cancelRequest()

        controller = new AbortController();
        const signal = controller.signal;
        
        
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
         await fetch(URL2+`weather-history/getCurrentweather/${date2}`, {
            headers : { 
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                },
                credentials: 'include'
            })
            .then(json => json.json())
            .then((json)=>{
                // console.log('hererere', json)
                if (json.statusCode == 404 || json.status==404 || json.statusCode == 500 || json.statusCode == 403 || json.statusCode == 401 || json.statusCode == 400) {
                    this.setState({
                                weatherimage1: image_not_found,
                                chart1_max_temperature: null,
                                chart1_min_temperature: null,
                                tableDisable : true,
                                chartLoaded: false
                            })
                    throw Error(json.statusText)        
                }
                else{
                    // Promise.all(json);
                    // console.log("here",json)

                this.setState({
                    weatherimage1: json.image ? json.image : image_not_found,
                    chart1_max_temperature: json.max_temp,
                    chart1_min_temperature: json.min_temp,
                    tableDisable : true,
                    chartLoaded: false
                })
                }
            })
            .catch((e) => {
                // console.log(e)  
                toast.warning('No weather data found for specified date', {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined,
                    });
              });
        var projects = []
        var devices = []
        if(this.state.selectedRows[0].device){
            // alert("here")
            for (let index = 0; index < this.state.selectedRows.length; index++) {
                devices[index] = this.state.selectedRows[index].device.id;
                
            }
        }
        else{
            for (let index = 0; index < this.state.selectedRows.length; index++) {
                projects[index] = this.state.selectedRows[index].id;
                
            }
        }
        // console.log(projects)
        // console.log(devices)
        if(projects.length !=0){
            const access_token = localStorage.getItem('access_token'); 
        fetch(URL2+'project/getTechDashboardChartdata', {
            headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'access_token' : access_token
            },
            credentials: 'include',
            method: 'PATCH',
            signal,
            mode: 'cors',
            body: JSON.stringify({ project_id: projects, n:1000000, date: date2})
        }).then(response => response.json()).
        then((json)=>{
            if (json.statusCode == 404 || json.status==404 || json.statusCode == 500 || json.statusCode == 403  || json.statusCode == 401 || json.statusCode == 400) {
                throw Error(json.statusText)        
            }
            else{
            // console.log(json)
            var production1 = []
            for (let index = 0; index < json.production.time.length; index++) {
                let obj = {
                'time': json.production.time[index],
                'production' : (json.production.combined[index]/1000).toFixed(3),
                'consumption' : Math.abs((json.production.consumption[index]/1000).toFixed(3))
                }
                production1.push(obj)
            }
            const uniqueValuesSet = new Set();
            const p = production1.filter((obj) => {
                // check if name property value is already in the set
                const isPresentInSet = uniqueValuesSet.has(obj.time);
              
                // add name property value to Set
                uniqueValuesSet.add(obj.time);
              
                // return the negated value of
                // isPresentInSet variable
                return !isPresentInSet;
            });
            // console.log(production1)
            // console.log(p)

            var time= []
            var production = []
            var consumption = []

            for (let index = 0; index < p.length; index++) {
                time.push(p[index].time)
                production.push(p[index].production)
                consumption.push(p[index].consumption)
            }
            // console.log(time)
            // console.log(production)
            var t =[]
            for (let index = 0; index < time.length; index++) {
            t[index] = this.abc(time[index])
            
            }
            this.setState({
                time: t.reverse(),
                production: production.reverse(),
                consumption: consumption.reverse(),
                chartLoaded: true,
                tableDisable: false,
            })

        }})
        .catch((e) => {
            console.log(e)  
            // toast.error('Error: Chart Data not fetched', {
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
        else{
            const access_token = localStorage.getItem('access_token'); 
        fetch(URL2+'project/getTechDashboardChartdata', {
            headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'access_token' : access_token
            },
            credentials: 'include',
            method: 'PATCH',
            signal,
            mode: 'cors',
            body: JSON.stringify({ project_id : this.state.selectedRows[0].project_id ,device_ids: devices, n:1000000, date: date2})
        }).then(response => response.json()).
        then((json)=>{
            if (json.statusCode == 404 || json.status==404 || json.statusCode == 500 || json.statusCode == 403 || json.statusCode == 403 || json.statusCode == 400) {
                throw Error(json.statusText)        
            }
            else{
            // console.log(json)
            var production1 = []
            for (let index = 0; index < json.production.time.length; index++) {
                let obj = {
                'time': json.production.time[index],
                'production' : (json.production.combined[index]/1000).toFixed(3),
                'consumption' : Math.abs((json.production.consumption[index]/1000).toFixed(3))
                }
                production1.push(obj)
            }
            const uniqueValuesSet = new Set();
            const p = production1.filter((obj) => {
                // check if name property value is already in the set
                const isPresentInSet = uniqueValuesSet.has(obj.time);
              
                // add name property value to Set
                uniqueValuesSet.add(obj.time);
              
                // return the negated value of
                // isPresentInSet variable
                return !isPresentInSet;
            });
            // console.log(production1)
            // console.log(p)

            var time= []
            var production = []
            var consumption = []

            for (let index = 0; index < p.length; index++) {
                time.push(p[index].time)
                production.push(p[index].production)
                consumption.push(p[index].consumption)
            }
            // console.log(time)
            // console.log(production)
            var t =[]
            for (let index = 0; index < time.length; index++) {
            t[index] = this.abc(time[index])
            
            }
            this.setState({
                time: t.reverse(),
                production: production.reverse(),
                consumption: consumption.reverse(),
                chartLoaded: true,
                tableDisable: false,
            })

        }})
        .catch((e) => {
            console.log(e)  
            // toast.error('Error: Project not fetched', {
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
    }
    
    increaseTodaysDate =async () => {
        

        var date = new Date(this.state.today_date)
        const d = new Date()
        const y1 = date.getFullYear()
        const m1 = this.addZero(date.getMonth()+1)
        const d1 =this.addZero(date.getDate())
        const t1 =y1+'-'+m1+'-'+d1

        const y2 = d.getFullYear()
        const m2 = this.addZero(d.getMonth()+1)
        const d2 =this.addZero(d.getDate())
        const t2 =y2+'-'+m2+'-'+d2

        if (t1 !== t2) {
            date.setDate( date.getDate() + 1 );
            this.cancelRequest()

        controller = new AbortController();
        const signal = controller.signal;
        const year = date.getFullYear()
        const month = this.addZero(date.getMonth()+1)
        const day =this.addZero(date.getDate())
        const date2 =year+'-'+month+'-'+day
        this.setState({
            today_date: date2
        })
        
        document.getElementById("today").value = date2;
        if(t2 != date2){
            const access_token = localStorage.getItem('access_token'); 
            await fetch(URL2+`weather-history/getCurrentweather/${date2}`, {
            headers : { 
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'access_token': access_token
                },
                credentials: "include"
            })
            .then(response => response.json())
            .then((json) => {
                if (json.statusCode == 404 || json.statusCode == 500 || json.statusCode == 403 || json.statusCode == 401 || json.statusCode == 400) {
                    this.setState({
                                weatherimage1: image_not_found,
                                chart1_max_temperature: null,
                                chart1_min_temperature: null,
                                tableDisable : true,
                                chartLoaded: false
                            })
                    throw Error(json.statusText)        
                }
                else{
                    this.setState({
                        weatherimage1: json.image ? json.image : image_not_found,
                        chart1_max_temperature: json.max_temp,
                        chart1_min_temperature: json.min_temp,
                        tableDisable: true,
                        chartLoaded: false
                    })
                }
                // console.log(json)
                
            })
            .catch((e) => {
                console.log(e)  
                // toast.warning('No weather data found for specified date', {
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
        else{
            await fetch(`https://api.weatherapi.com/v1/forecast.json?key=8b275674fea4449dab0133622222303&q=Bahrain&days=1&aqi=no&alerts=no`, {
            headers : { 
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Cookie': "",
                }
            })
            .then(response => response.json())
            .then((json) => {
                // console.log(json)
                this.setState({
                    weatherimage1: json.forecast.forecastday[0].day.condition.icon,
                    chart1_max_temperature: json.forecast.forecastday[0].day.maxtemp_c ,
                    chart1_min_temperature: json.forecast.forecastday[0].day.mintemp_c,
                    tableDisable: true,
                    chartLoaded: false
                })
            })
        }
        

            var projects = []
            var devices = []
            if(this.state.selectedRows[0].device){
                // alert("here")
                for (let index = 0; index < this.state.selectedRows.length; index++) {
                    devices[index] = this.state.selectedRows[index].device.id;
                    
                }
            }
            else{
                for (let index = 0; index < this.state.selectedRows.length; index++) {
                    projects[index] = this.state.selectedRows[index].id;
                    
                }
            }
        // console.log(projects)
        if(projects.length !=0){
            const access_token = localStorage.getItem('access_token'); 
        fetch(URL2+'project/getTechDashboardChartdata', {
            headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'access_token' : access_token
            },
            credentials: 'include',
            method: 'PATCH',
            signal,
            mode: 'cors',
            body: JSON.stringify({ project_id: projects, n:1000000, date: date2})
        }).then(response => response.json()).
        then((json)=>{
            if (json.statusCode == 404 || json.status==404 || json.statusCode == 500 || json.statusCode == 403 || json.statusCode == 401 || json.statusCode == 400 ) {
                throw Error(json.statusText)        
            }
            else{
            // console.log(json)
            var production1 = []
            for (let index = 0; index < json.production.time.length; index++) {
                let obj = {
                'time': json.production.time[index],
                'production' : (json.production.combined[index]/1000).toFixed(3),
                'consumption' : Math.abs((json.production.consumption[index]/1000).toFixed(3))
                }
                production1.push(obj)
            }
            const uniqueValuesSet = new Set();
            const p = production1.filter((obj) => {
                // check if name property value is already in the set
                const isPresentInSet = uniqueValuesSet.has(obj.time);
              
                // add name property value to Set
                uniqueValuesSet.add(obj.time);
              
                // return the negated value of
                // isPresentInSet variable
                return !isPresentInSet;
            });
            // console.log(production1)
            // console.log(p)

            var time= []
            var production = []
            var consumption = []

            for (let index = 0; index < p.length; index++) {
                time.push(p[index].time)
                production.push(p[index].production)
                consumption.push(p[index].consumption)
            }
            // console.log(time)
            // console.log(production)
            var t =[]
            for (let index = 0; index < time.length; index++) {
            t[index] = this.abc(time[index])
            
            }
            this.setState({
                time: t.reverse(),
                production: production.reverse(),
                consumption: consumption.reverse(),
                chartLoaded: true,
                tableDisable: false,
            })

        }})
        .catch((e) => {
            console.log(e)  
            // toast.error('Error: Chart Data not fetched', {
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
        else{
            const access_token = localStorage.getItem('access_token'); 
        fetch(URL2+'project/getTechDashboardChartdata', {
            headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'access_token' : access_token
            },
            credentials: 'include',
            method: 'PATCH',
            signal,
            mode: 'cors',
            body: JSON.stringify({ project_id : this.state.selectedRows[0].project_id ,device_ids: devices, n:1000000, date: date2})
        }).then(response => response.json()).
        then((json)=>{
            if (json.statusCode == 404 || json.status==404 || json.statusCode == 500 || json.statusCode == 403 || json.statusCode == 401 || json.statusCode == 400 ) {
                throw Error(json.statusText)        
            }
            else{
            // console.log(json)
            var production1 = []
            for (let index = 0; index < json.production.time.length; index++) {
                let obj = {
                'time': json.production.time[index],
                'production' : (json.production.combined[index]/1000).toFixed(3),
                'consumption' : Math.abs((json.production.consumption[index]/1000).toFixed(3))
                }
                production1.push(obj)
            }
            const uniqueValuesSet = new Set();
            const p = production1.filter((obj) => {
                // check if name property value is already in the set
                const isPresentInSet = uniqueValuesSet.has(obj.time);
              
                // add name property value to Set
                uniqueValuesSet.add(obj.time);
              
                // return the negated value of
                // isPresentInSet variable
                return !isPresentInSet;
            });
            // console.log(production1)
            // console.log(p)

            var time= []
            var production = []
            var consumption = []

            for (let index = 0; index < p.length; index++) {
                time.push(p[index].time)
                production.push(p[index].production)
                consumption.push(p[index].consumption)
            }
            // console.log(time)
            // console.log(production)
            var t =[]
            for (let index = 0; index < time.length; index++) {
            t[index] = this.abc(time[index])
            
            }
            this.setState({
                time: t.reverse(),
                production: production.reverse(),
                consumption: consumption.reverse(),
                chartLoaded: true,
                tableDisable: false,
            })

        }})
        .catch((e) => {
            console.log(e)  
            // toast.error('Error: Chart Data not fetched', {
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
    } 
    }

    decreaseYesterdayDate =async() => {
        this.cancelRequest2()

        controller3 = new AbortController();
        const signal = controller3.signal;

        var date = new Date(this.state.yesterday_date)
        date.setDate( date.getDate() - 1 );

        const year = date.getFullYear()
        const month = this.addZero(date.getMonth()+1)
        const day =this.addZero(date.getDate())
        const date2 =year+'-'+month+'-'+day
        this.setState({
            yesterday_date: date2
        })
        document.getElementById("yesterday").value = date2;
                await fetch(URL2+`weather-history/getCurrentweather/${date2}`, {
                    headers : { 
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        },
                        credentials: 'include'
                    })
                    .then(response => response.json())
                    .then((json) => {
                        if (json.statusCode == 404 || json.statusCode == 500 || json.statusCode == 403 || json.statusCode == 401 || json.statusCode == 400) {
                            this.setState({
                                weatherimage2: image_not_found,
                                chart2_max_temperature: null,
                                chart2_min_temperature: null,
                                tableDisable : true,
                                chartLoaded1: false
                            })
                            throw Error(json.statusText)        
                        }
                        else{
                            // Promise.all(json);
                            // console.log("here",json)
        
                        this.setState({
                            weatherimage2: json.image ? json.image : image_not_found ,
                            chart2_max_temperature: json.max_temp,
                            chart2_min_temperature: json.min_temp,
                            tableDisable : true,
                            chartLoaded1: false
                        })
                        }
                    })
                    .catch((e) => {
                        // console.log(e)  
                        toast.warning('No weather data found for specified date', {
                            position: "top-center",
                            autoClose: 3000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: false,
                            draggable: true,
                            progress: undefined,
                            });
                      });
        
                var projects = []
            var devices = []
            if(this.state.selectedRows[0].device){
                // alert("here")
                for (let index = 0; index < this.state.selectedRows.length; index++) {
                    devices[index] = this.state.selectedRows[index].device.id;
                    
                }
            }
            else{
                for (let index = 0; index < this.state.selectedRows.length; index++) {
                    projects[index] = this.state.selectedRows[index].id;
                    
                }
            }
            if(projects.length != 0 ){
                const access_token = localStorage.getItem('access_token'); 
                fetch(URL2+'project/getTechDashboardChartdata', {
                    headers : { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'access_token' : access_token
                    },
                    credentials: 'include',
                    method: 'PATCH',
                    signal,
                    mode: 'cors',
                    body: JSON.stringify({ project_id: projects, n:1000000, date: date2})
                }).then(response => response.json()).
                then((json)=>{
                    if (json.statusCode == 404 || json.status==404 || json.statusCode == 500 || json.statusCode == 403 || json.statusCode == 401 || json.statusCode == 400 ) {
                        throw Error(json.statusText)        
                    }
                    else{
                    // console.log(json)
                    var production1 = []
                    for (let index = 0; index < json.production.time.length; index++) {
                        let obj = {
                        'time': json.production.time[index],
                        'production' : (json.production.combined[index]/1000).toFixed(3),
                        'consumption' : Math.abs((json.production.consumption[index]/1000).toFixed(3))
                        }
                        production1.push(obj)
                    }
                    const uniqueValuesSet = new Set();
                    const p = production1.filter((obj) => {
                        // check if name property value is already in the set
                        const isPresentInSet = uniqueValuesSet.has(obj.time);
                      
                        // add name property value to Set
                        uniqueValuesSet.add(obj.time);
                      
                        // return the negated value of
                        // isPresentInSet variable
                        return !isPresentInSet;
                    });
                    // console.log(production1)
                    // console.log(p)
        
                    var time= []
                    var production = []
                    var consumption = []
        
                    for (let index = 0; index < p.length; index++) {
                        time.push(p[index].time)
                        production.push(p[index].production)
                        consumption.push(p[index].consumption)
                    }
                    // console.log(time)
                    // console.log(production)
                    var t =[]
                    for (let index = 0; index < time.length; index++) {
                    t[index] = this.abc(time[index])
                    
                    }
                    this.setState({
                        time1: t.reverse(),
                        production1: production.reverse(),
                        consumption1: consumption.reverse(),
                        chartLoaded1: true,
                        tableDisable: false,
                    })
        
            }})
            .catch((e) => {
                console.log(e)  
                // toast.error('Error: Chart Data not fetched', {
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
            else{
                const access_token = localStorage.getItem('access_token'); 
                fetch(URL2+'project/getTechDashboardChartdata', {
                    headers : { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'access_token' : access_token
                    },
                    credentials: 'include',
                    method: 'PATCH',
                    signal,
                    mode: 'cors',
                    body: JSON.stringify({project_id : this.state.selectedRows[0].project_id ,device_ids: devices, n:1000000, date: date2})
                }).then(response => response.json()).
                then((json)=>{
                    if (json.statusCode == 404 || json.status==404 || json.statusCode == 500 || json.statusCode == 403 || json.statusCode == 401 || json.statusCode == 400) {
                        throw Error(json.statusText)        
                    }
                    else{
                    // console.log(json)
                    var production1 = []
                    for (let index = 0; index < json.production.time.length; index++) {
                        let obj = {
                        'time': json.production.time[index],
                        'production' : (json.production.combined[index]/1000).toFixed(3),
                        'consumption' : Math.abs((json.production.consumption[index]/1000).toFixed(3))
                        }
                        production1.push(obj)
                    }
                    const uniqueValuesSet = new Set();
                    const p = production1.filter((obj) => {
                        // check if name property value is already in the set
                        const isPresentInSet = uniqueValuesSet.has(obj.time);
                      
                        // add name property value to Set
                        uniqueValuesSet.add(obj.time);
                      
                        // return the negated value of
                        // isPresentInSet variable
                        return !isPresentInSet;
                    });
                    // console.log(production1)
                    // console.log(p)
        
                    var time= []
                    var production = []
                    var consumption = []
        
                    for (let index = 0; index < p.length; index++) {
                        time.push(p[index].time)
                        production.push(p[index].production)
                        consumption.push(p[index].consumption)
                    }
                    // console.log(time)
                    // console.log(production)
                    var t =[]
                    for (let index = 0; index < time.length; index++) {
                    t[index] = this.abc(time[index])
                    
                    }
                    this.setState({
                        time1: t.reverse(),
                        production1: production.reverse(),
                        consumption1: consumption.reverse(),
                        chartLoaded1: true,
                        tableDisable: false,
                    })
        
            }})
            .catch((e) => {
                console.log(e)  
                // toast.error('Error: Chart Data not fetched', {
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
                
    }
    increaseYesterdayDate =async() => {
        
        var date = new Date(this.state.yesterday_date)
        const d = new Date()
        const y1 = date.getFullYear()
        const m1 = this.addZero(date.getMonth()+1)
        const d1 =this.addZero(date.getDate())
        const t1 =y1+'-'+m1+'-'+d1

        const y2 = d.getFullYear()
        const m2 = this.addZero(d.getMonth()+1)
        const d2 =this.addZero(d.getDate())
        const t2 =y2+'-'+m2+'-'+d2

        if (t1 !== t2) {
            date.setDate( date.getDate() + 1 );
            this.cancelRequest()

        controller3 = new AbortController();
        const signal = controller3.signal;
        const year = date.getFullYear()
        const month = this.addZero(date.getMonth()+1)
        const day =this.addZero(date.getDate())
        const date2 =year+'-'+month+'-'+day
        this.setState({
            yesterday_date: date2
        })
        document.getElementById("yesterday").value = date2;
        if(t2 != date2){
            const access_token = localStorage.getItem('access_token'); 
            await fetch(URL2+`weather-history/getCurrentweather/${date2}`, {
            headers : { 
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'access_token': access_token
                },
                credentials: "include"
            })
            .then(response => response.json())
            .then((json) => {
                if (json.statusCode == 404 || json.statusCode == 500 || json.statusCode == 403 || json.statusCode == 401 || json.statusCode == 400 ) {
                    this.setState({
                        weatherimage2: image_not_found,
                        chart2_max_temperature: null,
                        chart2_min_temperature: null,
                        tableDisable : true,
                        chartLoaded1: false
                    })
                    throw Error(json.statusText)        
                }
                else{
                    // Promise.all(json);
                    // console.log("here",json)

                this.setState({
                    weatherimage2: json.image ? json.image : image_not_found,
                    chart2_max_temperature: json.max_temp,
                    chart2_min_temperature: json.min_temp,
                    tableDisable : true,
                    chartLoaded1: false
                })
                }
            })
            .catch((e) => {
                // console.log(e)  
                toast.warning('No weather data found for specified date', {
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
        else{
            await fetch(`https://api.weatherapi.com/v1/forecast.json?key=8b275674fea4449dab0133622222303&q=Bahrain&days=1&aqi=no&alerts=no`, {
            headers : { 
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Cookie': "",
                }
            })
            .then(response => response.json())
            .then((json) => {
                // console.log(json)
                this.setState({
                    weatherimage2: json.forecast.forecastday[0].day.condition.icon,
                    chart2_max_temperature: json.forecast.forecastday[0].day.maxtemp_c ,
                    chart2_min_temperature: json.forecast.forecastday[0].day.mintemp_c,
                    chartLoaded1: false,
                    tableDisable: true,
                })
            })
        }
                var projects = []
                var devices = []
                if(this.state.selectedRows[0].device){
                    // alert("here")
                    for (let index = 0; index < this.state.selectedRows.length; index++) {
                        devices[index] = this.state.selectedRows[index].device.id;
                        
                    }
                }
                else{
                    for (let index = 0; index < this.state.selectedRows.length; index++) {
                        projects[index] = this.state.selectedRows[index].id;
                        
                    }
                }
                if(projects.length != 0 ){
                    const access_token = localStorage.getItem('access_token'); 
                    fetch(URL2+'project/getTechDashboardChartdata', {
                        headers : { 
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'access_token' : access_token
                        },
                        credentials: 'include',
                        method: 'PATCH',
                        signal,
                        mode: 'cors',
                        body: JSON.stringify({ project_id: projects, n:1000000, date: date2})
                    }).then(response => response.json()).
                    then((json)=>{
                        if (json.statusCode == 404 || json.status==404 || json.statusCode == 500 || json.statusCode == 403 || json.statusCode == 401 || json.statusCode == 400 ) {
                            throw Error(json.statusText)        
                        }
                        else{
                        // console.log(json)
                        var production1 = []
                        for (let index = 0; index < json.production.time.length; index++) {
                            let obj = {
                            'time': json.production.time[index],
                            'production' : (json.production.combined[index]/1000).toFixed(3),
                            'consumption' : Math.abs((json.production.consumption[index]/1000).toFixed(3))
                            }
                            production1.push(obj)
                        }
                        const uniqueValuesSet = new Set();
                        const p = production1.filter((obj) => {
                            // check if name property value is already in the set
                            const isPresentInSet = uniqueValuesSet.has(obj.time);
                          
                            // add name property value to Set
                            uniqueValuesSet.add(obj.time);
                          
                            // return the negated value of
                            // isPresentInSet variable
                            return !isPresentInSet;
                        });
                        // console.log(production1)
                        // console.log(p)
            
                        var time= []
                        var production = []
                        var consumption = []
            
                        for (let index = 0; index < p.length; index++) {
                            time.push(p[index].time)
                            production.push(p[index].production)
                            consumption.push(p[index].consumption)
                        }
                        // console.log(time)
                        // console.log(production)
                        var t =[]
                        for (let index = 0; index < time.length; index++) {
                        t[index] = this.abc(time[index])
                        
                        }
                        this.setState({
                            time1: t.reverse(),
                            production1: production.reverse(),
                            consumption1: consumption.reverse(),
                            chartLoaded1: true,
                            tableDisable: false,
                        })
            
                }})
                .catch((e) => {
                    console.log(e)  
                    // toast.error('Error: Chart Data not fetched', {
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
                else{
                    const access_token = localStorage.getItem('access_token'); 
                    fetch(URL2+'project/getTechDashboardChartdata', {
                        headers : { 
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'access_token' : access_token
                        },
                        credentials: 'include',
                        method: 'PATCH',
                        signal,
                        mode: 'cors',
                        body: JSON.stringify({project_id : this.state.selectedRows[0].project_id ,device_ids: devices, n:1000000, date: date2})
                    }).then(response => response.json())
                    .then((json)=>{
                        if (json.statusCode == 404 || json.status==404 || json.statusCode == 500 || json.statusCode == 403 || json.statusCode == 401 || json.statusCode == 400) {
                            throw Error(json.statusText)        
                        }
                        else{
                        // console.log(json)
                        var production1 = []
                        for (let index = 0; index < json.production.time.length; index++) {
                            let obj = {
                            'time': json.production.time[index],
                            'production' : (json.production.combined[index]/1000).toFixed(3),
                            'consumption' : Math.abs((json.production.consumption[index]/1000).toFixed(3))
                            }
                            production1.push(obj)
                        }
                        const uniqueValuesSet = new Set();
                        const p = production1.filter((obj) => {
                            // check if name property value is already in the set
                            const isPresentInSet = uniqueValuesSet.has(obj.time);
                          
                            // add name property value to Set
                            uniqueValuesSet.add(obj.time);
                          
                            // return the negated value of
                            // isPresentInSet variable
                            return !isPresentInSet;
                        });
                        // console.log(production1)
                        // console.log(p)
            
                        var time= []
                        var production = []
                        var consumption = []
            
                        for (let index = 0; index < p.length; index++) {
                            time.push(p[index].time)
                            production.push(p[index].production)
                            consumption.push(p[index].consumption)
                        }
                        // console.log(time)
                        // console.log(production)
                        var t =[]
                        for (let index = 0; index < time.length; index++) {
                        t[index] = this.abc(time[index])
                        
                        }
                        this.setState({
                            time1: t.reverse(),
                            production1: production.reverse(),
                            consumption1: consumption.reverse(),
                            chartLoaded1: true,
                            tableDisable: false,
                        })
            
                    }})
                    .catch((e) => {
                        console.log(e)  
                        // toast.error('Error: Chart Data not fetched', {
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
        }
    }
    cancelRequest = () =>{
        if(controller){
            controller.abort();
        }
    }
    cancelRequest2 = () =>{
        if(controller3){
            controller3.abort();
        }
    }
    handleChange = async ({ selectedRows }) => {
        this.cancelRequest()
        this.cancelRequest2()
        controller = new AbortController();
        const signal = controller.signal;
        // const controller = new AbortController()
        // const signal = controller.signal
        // await controller.abort();
        // console.log(selectedRows)
        var fullreportprojects = []
        var fullreportdevices = []

        if(this.state.device_view){
            for (let index = 0; index <selectedRows.length; index++) {
                fullreportprojects[index] = selectedRows[index].device.id
            }
        }
        else{
            for (let index = 0; index <selectedRows.length; index++) {
                fullreportprojects[index] = selectedRows[index].id
            }
        }

        
        // if(selectedRows[0].device){
        //     for (let index = 0; index <selectedRows.length; index++) {
        //         fullreportdevices[index] = selectedRows[index].device.sn
        //     }
        // }
        this.setState({
            // fullreportdevices: fullreportdevices,
            fullreportprojects: fullreportprojects,
            selectedRows: selectedRows,
            chartLoaded: false,
            chartLoaded1: false,
            tableDisable: true,
        })
        // console.log("selected", selectedRows)
        if(selectedRows.length !=0){
            var projects = []
            var devices = []
        // console.log(selectedRows.device)
        if(selectedRows[0].device){
            for (let index = 0; index < selectedRows.length; index++) {
                devices[index] = selectedRows[index].device.id;
                fullreportdevices[index] = selectedRows[index].device.sn;
            }
            // alert("here")
        
        }
        else {
            for (let index = 0; index < selectedRows.length; index++) {
                projects[index] = selectedRows[index].id;
        }
        
            
        }
        // console.log(projects)
        // console.log(devices)
        this.setState({fullreportdevices: fullreportdevices})
        if(projects.length != 0){
            fetch(URL2+'project/getTechDashboardChartdata', {
                headers : { 
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                },
                credentials: 'include',
                method: 'PATCH',
                signal,
                mode: 'cors',
                body: JSON.stringify({ project_id: projects, n:1000000, date: this.state.today_date})
            }).then(response => response.json())
            .then((json)=>{
                if (json.statusCode == 404 || json.status==404 || json.statusCode == 500 || json.statusCode == 403 || json.statusCode == 401) {
                    throw Error(json.statusText)        
                }
                else{
                // console.log(json)
                var production1 = []
                for (let index = 0; index < json.production.time.length; index++) {
                    let obj = {
                    'time': json.production.time[index],
                    'production' : (json.production.combined[index]/1000).toFixed(3),
                    'consumption' : Math.abs((json.production.consumption[index]/1000).toFixed(3))
                    }
                    production1.push(obj)
                }
                const uniqueValuesSet = new Set();
                const p = production1.filter((obj) => {
                    // check if name property value is already in the set
                    const isPresentInSet = uniqueValuesSet.has(obj.time);
                  
                    // add name property value to Set
                    uniqueValuesSet.add(obj.time);
                  
                    // return the negated value of
                    // isPresentInSet variable
                    return !isPresentInSet;
                });
                // console.log(production1)
                // console.log(p)
    
                var time= []
                var production = []
                var consumption = []
    
                for (let index = 0; index < p.length; index++) {
                    time.push(p[index].time)
                    production.push(p[index].production)
                    consumption.push(p[index].consumption)
                }
                // console.log(time)
                // console.log(production)
                var t =[]
                for (let index = 0; index < time.length; index++) {
                t[index] = this.abc(time[index])
                
                }
                this.setState({
                    time: t.reverse(),
                    production: production.reverse(),
                    consumption: consumption.reverse(),
                    chartLoaded: true
                })
    
            }}).catch((e) => {
                console.log(e)  
                // toast.error('Error: Chart Data not fetched', {
                //     position: "top-center",
                //     autoClose: 3000,
                //     hideProgressBar: false,
                //     closeOnClick: true,
                //     pauseOnHover: false,
                //     draggable: true,
                //     progress: undefined,
                //     });
              });
            this.callChart2Data(projects)
        }
        else{
            fetch(URL2+'project/getTechDashboardChartdata', {
                headers : { 
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                },
                credentials: 'include',
                method: 'PATCH',
                signal,
                mode: 'cors',
                body: JSON.stringify({ project_id : selectedRows[0].project_id ,device_ids: devices, n:1000000, date: this.state.today_date})
            }).then(response => response.json()).
            then((json)=>{
                if (json.statusCode == 404 || json.status==404 || json.statusCode == 500 || json.statusCode == 403 || json.statusCode == 401 || json.statusCode == 400) {
                    throw Error(json.statusText)        
                }
                else{
                // console.log(json)
                var production1 = []
                for (let index = 0; index < json.production.time.length; index++) {
                    let obj = {
                    'time': json.production.time[index],
                    'production' : (json.production.combined[index]/1000).toFixed(3),
                    'consumption' : Math.abs((json.production.consumption[index]/1000).toFixed(3))
                    }
                    production1.push(obj)
                }
                const uniqueValuesSet = new Set();
                const p = production1.filter((obj) => {
                    // check if name property value is already in the set
                    const isPresentInSet = uniqueValuesSet.has(obj.time);
                  
                    // add name property value to Set
                    uniqueValuesSet.add(obj.time);
                  
                    // return the negated value of
                    // isPresentInSet variable
                    return !isPresentInSet;
                });
                // console.log(production1)
                // console.log(p)
    
                var time= []
                var production = []
                var consumption = []
    
                for (let index = 0; index < p.length; index++) {
                    time.push(p[index].time)
                    production.push(p[index].production)
                    consumption.push(p[index].consumption)
                }
                // console.log(time)
                // console.log(production)
                var t =[]
                for (let index = 0; index < time.length; index++) {
                t[index] = this.abc(time[index])
                
                }
                this.setState({
                    time: t.reverse(),
                    production: production.reverse(),
                    consumption: consumption.reverse(),
                    chartLoaded: true
                })
    
            }}).catch((e) => {
                // console.log(e)  
                toast.error('Error: Chart Data not fetched', {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined,
                    });
              });

              this.callChart2Data(null, selectedRows[0].project_id, devices )
            
        }
        
    }
        
      };

      callChart2Data = (projects, projectID, devices) => {
        controller3 = new AbortController();
        const signal = controller3.signal;
        if(projects){
            fetch(URL2+'project/getTechDashboardChartdata', {
                headers : { 
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                },
                credentials: 'include',
                method: 'PATCH',
                signal,
                mode: 'cors',
                body: JSON.stringify({ project_id: projects, n:1000000, date: this.state.yesterday_date})
            }).then(response => response.json())
            .then((json)=>{
                if (json.statusCode == 404 || json.status==404 || json.statusCode == 500 || json.statusCode == 403 || json.statusCode == 401 || json.statusCode == 400) {
                    throw Error(json.statusText)        
                }
                else{
                // console.log(json)
                var production1 = []
                for (let index = 0; index < json.production.time.length; index++) {
                    let obj = {
                    'time': json.production.time[index],
                    'production' : (json.production.combined[index]/1000).toFixed(3),
                    'consumption' : Math.abs((json.production.consumption[index]/1000).toFixed(3))
                    }
                    production1.push(obj)
                }
                const uniqueValuesSet = new Set();
                const p = production1.filter((obj) => {
                    // check if name property value is already in the set
                    const isPresentInSet = uniqueValuesSet.has(obj.time);
                  
                    // add name property value to Set
                    uniqueValuesSet.add(obj.time);
                  
                    // return the negated value of
                    // isPresentInSet variable
                    return !isPresentInSet;
                });
                // console.log(production1)
                // console.log(p)
    
                var time= []
                var production = []
                var consumption = []
    
                for (let index = 0; index < p.length; index++) {
                    time.push(p[index].time)
                    production.push(p[index].production)
                    consumption.push(p[index].consumption)
                }
                // console.log(time)
                // console.log(production)
                var t =[]
                for (let index = 0; index < time.length; index++) {
                t[index] = this.abc(time[index])
                
                }
                this.setState({
                    time1: t.reverse(),
                    production1: production.reverse(),
                    consumption1: consumption.reverse(),
                    chartLoaded1: true,
                    tableDisable: false,
                })
    
            }}).catch((e) => {
                console.log(e)  
                // toast.error('Error: Chart Data not fetched', {
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
        else{
            fetch(URL2+'project/getTechDashboardChartdata', {
                headers : { 
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                },
                credentials: 'include',
                method: 'PATCH',
                signal,
                mode: 'cors',
                body: JSON.stringify({project_id : projectID, device_ids: devices, n:1000000, date: this.state.yesterday_date})
            }).then(response => response.json()).
            then((json)=>{
                if (json.statusCode == 404 || json.status==404 || json.statusCode == 500 || json.statusCode == 403 || json.statusCode == 401 || json.statusCode == 400) {
                    throw Error(json.statusText)        
                }
                else{
                // console.log(json)
                var production1 = []
                for (let index = 0; index < json.production.time.length; index++) {
                    let obj = {
                    'time': json.production.time[index],
                    'production' : (json.production.combined[index]/1000).toFixed(3),
                    'consumption' : Math.abs((json.production.consumption[index]/1000).toFixed(3))
                    }
                    production1.push(obj)
                }
                const uniqueValuesSet = new Set();
                const p = production1.filter((obj) => {
                    // check if name property value is already in the set
                    const isPresentInSet = uniqueValuesSet.has(obj.time);
                  
                    // add name property value to Set
                    uniqueValuesSet.add(obj.time);
                  
                    // return the negated value of
                    // isPresentInSet variable
                    return !isPresentInSet;
                });
                // console.log(production1)
                // console.log(p)
    
                var time= []
                var production = []
                var consumption = []
    
                for (let index = 0; index < p.length; index++) {
                    time.push(p[index].time)
                    production.push(p[index].production)
                    consumption.push(p[index].consumption)
                }
                // console.log(time)
                // console.log(production)
                var t =[]
                for (let index = 0; index < time.length; index++) {
                t[index] = this.abc(time[index])
                
                }
                this.setState({
                    time1: t.reverse(),
                    production1: production.reverse(),
                    consumption1: consumption.reverse(),
                    chartLoaded1: true,
                    tableDisable: false,
                })
    
            }}).catch((e) => {
                // console.log(e)  
                toast.error('Error: Chart Data not fetched', {
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
        
      }

      resetTable = () =>{
        //   this.setState({})
        // document.getElementById("fullreport").disabled = true;
        document.getElementById("project").selectedIndex = 0
        document.getElementById("invertor").selectedIndex = 0
        document.getElementById("customer").selectedIndex = 0
          this.setState({
              device_view: false,
              projects : [],
            tableLoaded: false,
            columns: [
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
                
                // document.getElementById("fullreport").disabled = false;
           
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
        table_data: this.state.all_projects,
        default_settings: null,
        tableLoaded: true,})
    }
    abc (date)
    {
    var time = Date.parse(date);
    var date1 = new Date(time);

    
    let h =this.addZero(date1.getHours())
    let m =this.addZero(date1.getMinutes())
    
    let time1 = h + ":" + m
    return time1

    }
    todayChartDateChange = async(e) =>{
        this.setState({
            today_date: e.target.value
        })
        this.cancelRequest()
        const d = new Date()
        const y2 = d.getFullYear()
        const m2 = this.addZero(d.getMonth()+1)
        const d2 =this.addZero(d.getDate())
        const t2 =y2+'-'+m2+'-'+d2
        controller = new AbortController();
        const signal = controller.signal;
        const querydate = e.target.value
        // console.log(querydate)
        if(t2 != e.target.value ){
            const access_token = localStorage.getItem('access_token'); 
            await fetch(URL2+`weather-history/getCurrentweather/${querydate}`, {
            headers : { 
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'access_token': access_token
                },
                credentials: "include"
            })
            .then(response => response.json())
            .then((json) => {
                    if (json.statusCode == 404 || json.statusCode == 500 || json.statusCode == 403 || json.statusCode == 401 || json.statusCode == 400 ) {
                        this.setState({
                            weatherimage1: image_not_found,
                            chart1_max_temperature: null,
                            chart1_min_temperature: null,
                            tableDisable : true,
                            chartLoaded: false
                        })
                        throw Error(json.statusText)        
                    }
                    else{
                        // Promise.all(json);
                        // console.log("here",json)
    
                    this.setState({
                        weatherimage1: json.image ? json.image : image_not_found,
                        chart1_max_temperature: json.max_temp,
                        chart1_min_temperature: json.min_temp,
                        tableDisable: true,
                        chartLoaded: false
                    })
                    }
            })
            .catch((e) => {
                // console.log(e)  
                toast.warning('No weather data found for specified date', {
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
        else{
            await fetch(`https://api.weatherapi.com/v1/forecast.json?key=8b275674fea4449dab0133622222303&q=Bahrain&days=1&aqi=no&alerts=no`, {
                headers : { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Cookie': "",
                    }
                })
                .then(response => response.json())
                .then((json) => {
                    // console.log(json)
                    this.setState({
                        weatherimage1: json.forecast.forecastday[0].day.condition.icon,
                        chart1_max_temperature: json.forecast.forecastday[0].day.maxtemp_c ,
                        chart1_min_temperature: json.forecast.forecastday[0].day.mintemp_c,
                        chartLoaded: false,
                        tableDisable: true,
                    })
                })
        }

                 var projects = []
                    var devices = []
                    if(this.state.selectedRows[0].device){
                        // alert("here")
                        for (let index = 0; index < this.state.selectedRows.length; index++) {
                            devices[index] = this.state.selectedRows[index].device.id;
                            
                        }
                    }
                    else{
                        for (let index = 0; index < this.state.selectedRows.length; index++) {
                            projects[index] = this.state.selectedRows[index].id;
                            
                        }
                    }
                if(projects.length != 0 ){
                    const access_token = localStorage.getItem('access_token'); 
                fetch(URL2+'project/getTechDashboardChartdata', {
                    headers : { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'access_token' : access_token
                    },
                    credentials: 'include',
                    method: 'PATCH',
                    signal,
                    mode: 'cors',
                    body: JSON.stringify({ project_id: projects, n:1000000, date: querydate})
                }).then(response => response.json()).
                then((json)=>{
                    if (json.statusCode == 404 || json.status==404 || json.statusCode == 500 || json.statusCode == 403 || json.statusCode == 401 || json.statusCode == 400 ) {
                        throw Error(json.statusText)        
                    }
                    else{
                    // console.log(json)
                    var production1 = []
                    for (let index = 0; index < json.production.time.length; index++) {
                        let obj = {
                        'time': json.production.time[index],
                        'production' : (json.production.combined[index]/1000).toFixed(3),
                        'consumption' : Math.abs((json.production.consumption[index]/1000).toFixed(3))
                        }
                        production1.push(obj)
                    }
                    const uniqueValuesSet = new Set();
                    const p = production1.filter((obj) => {
                        // check if name property value is already in the set
                        const isPresentInSet = uniqueValuesSet.has(obj.time);
                      
                        // add name property value to Set
                        uniqueValuesSet.add(obj.time);
                      
                        // return the negated value of
                        // isPresentInSet variable
                        return !isPresentInSet;
                    });
                    // console.log(production1)
                    // console.log(p)
        
                    var time= []
                    var production = []
                    var consumption = []
        
                    for (let index = 0; index < p.length; index++) {
                        time.push(p[index].time)
                        production.push(p[index].production)
                        consumption.push(p[index].consumption)
                    }
                    // console.log(time)
                    // console.log(production)
                    var t =[]
                    for (let index = 0; index < time.length; index++) {
                    t[index] = this.abc(time[index])
                    
                    }
                    this.setState({
                        time: t.reverse(),
                        production: production.reverse(),
                        consumption: consumption.reverse(),
                        chartLoaded: true,
                        tableDisable: false,
                    })
        
                }}).catch((e) => {
                    // console.log(e)  
                    toast.error('Error: Chart Data not fetched', {
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
                else{
                    const access_token = localStorage.getItem('access_token'); 
                fetch(URL2+'project/getTechDashboardChartdata', {
                    headers : { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'access_token' : access_token
                    },
                    credentials: 'include',
                    method: 'PATCH',
                    signal,
                    mode: 'cors',
                    body: JSON.stringify({ project_id : this.state.selectedRows[0].project_id ,device_ids: devices, n:1000000, date: querydate})
                }).then(response => response.json()).
                then((json)=>{
                    if (json.statusCode == 404 || json.status==404 || json.statusCode == 500 || json.statusCode == 403 || json.statusCode == 401 || json.statusCode == 400) {
                        throw Error(json.statusText)        
                    }
                    else{
                    // console.log(json)
                    var production1 = []
                    for (let index = 0; index < json.production.time.length; index++) {
                        let obj = {
                        'time': json.production.time[index],
                        'production' : (json.production.combined[index]/1000).toFixed(3),
                        'consumption' : Math.abs((json.production.consumption[index]/1000).toFixed(3))
                        }
                        production1.push(obj)
                    }
                    const uniqueValuesSet = new Set();
                    const p = production1.filter((obj) => {
                        // check if name property value is already in the set
                        const isPresentInSet = uniqueValuesSet.has(obj.time);
                      
                        // add name property value to Set
                        uniqueValuesSet.add(obj.time);
                      
                        // return the negated value of
                        // isPresentInSet variable
                        return !isPresentInSet;
                    });
                    // console.log(production1)
                    // console.log(p)
        
                    var time= []
                    var production = []
                    var consumption = []
        
                    for (let index = 0; index < p.length; index++) {
                        time.push(p[index].time)
                        production.push(p[index].production)
                        consumption.push(p[index].consumption)
                    }
                    // console.log(time)
                    // console.log(production)
                    var t =[]
                    for (let index = 0; index < time.length; index++) {
                    t[index] = this.abc(time[index])
                    
                    }
                    this.setState({
                        time: t.reverse(),
                        production: production.reverse(),
                        consumption: consumption.reverse(),
                        chartLoaded: true,
                        tableDisable: false,
                    })
        
                }}).catch((e) => {
                    console.log(e)  
                    // toast.error('Error: Chart Data not fetched', {
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
                
        

    }
    yesterdayChartDateChange = async(e) =>{
        this.setState({
            yesterday_date: e.target.value
        })
        this.cancelRequest2()
        const d = new Date()
        const y2 = d.getFullYear()
        const m2 = this.addZero(d.getMonth()+1)
        const d2 =this.addZero(d.getDate())
        const t2 =y2+'-'+m2+'-'+d2

        if(t2 != e.target.value ){

        }
        else{

        }
        controller3 = new AbortController();
        const signal = controller3.signal;
        const querydate = e.target.value
        // console.log(querydate)

        if(t2 != e.target.value ){
            const access_token = localStorage.getItem('access_token'); 
            await fetch(URL2+`weather-history/getCurrentweather/${querydate}`, {
            headers : { 
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'access_token': access_token
                },
                credentials: "include"
            })
            .then(response => response.json())
            .then((json) => {
                if (json.statusCode == 404 || json.statusCode == 500 || json.statusCode == 403 || json.statusCode == 401 || json.statusCode == 400 ) {
                    this.setState({
                        weatherimage2: image_not_found,
                        chart2_max_temperature: null,
                        chart2_min_temperature: null,
                        tableDisable : true,
                        chartLoaded1: false
                    })
                    throw Error(json.statusText)        
                }
                else{
                    // Promise.all(json);
                    // console.log("here",json)

                this.setState({
                    weatherimage2: json.image ? json.image : image_not_found,
                    chart2_max_temperature: json.max_temp,
                    chart2_min_temperature: json.min_temp,
                    tableDisable : true,
                    chartLoaded1: false
                })
                }
            })
            .catch((e) => {
                // console.log(e)  
                toast.warning('No weather data found for specified date', {
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
        else{
            await fetch(`https://api.weatherapi.com/v1/forecast.json?key=8b275674fea4449dab0133622222303&q=Bahrain&days=1&aqi=no&alerts=no`, {
                headers : { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Cookie': "",
                    }
                })
                .then(response => response.json())
                .then((json) => {
                    // console.log(json)
                    this.setState({
                        weatherimage2: json.forecast.forecastday[0].day.condition.icon,
                        chart2_max_temperature: json.forecast.forecastday[0].day.maxtemp_c ,
                        chart2_min_temperature: json.forecast.forecastday[0].day.mintemp_c,
                        chartLoaded1: false,
                        tableDisable: true,
                    })
                })
        }
        
                var projects = []
                    var devices = []
                    if(this.state.selectedRows[0].device){
                        // alert("here")
                        for (let index = 0; index < this.state.selectedRows.length; index++) {
                            devices[index] = this.state.selectedRows[index].device.id;
                            
                        }
                    }
                    else{
                        for (let index = 0; index < this.state.selectedRows.length; index++) {
                            projects[index] = this.state.selectedRows[index].id;
                            
                        }
                    }
                if(projects.length != 0){
                    const access_token = localStorage.getItem('access_token'); 
                fetch(URL2+'project/getTechDashboardChartdata', {
                    headers : { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'access_token' : access_token
                    },
                    credentials: 'include',
                    method: 'PATCH',
                    signal,
                    mode: 'cors',
                    body: JSON.stringify({ project_id: projects, n:1000000, date: querydate})
                }).then(response => response.json()).
                then((json)=>{
                    if (json.statusCode == 404 || json.status==404 || json.statusCode == 500 || json.statusCode == 403 || json.statusCode == 401 || json.statusCode == 400) {
                        throw Error(json.statusText)        
                    }
                    else{
                    // console.log(json)
                    var production1 = []
                    for (let index = 0; index < json.production.time.length; index++) {
                        let obj = {
                        'time': json.production.time[index],
                        'production' : (json.production.combined[index]/1000).toFixed(3),
                        'consumption' : Math.abs((json.production.consumption[index]/1000).toFixed(3))
                        }
                        production1.push(obj)
                    }
                    const uniqueValuesSet = new Set();
                    const p = production1.filter((obj) => {
                        // check if name property value is already in the set
                        const isPresentInSet = uniqueValuesSet.has(obj.time);
                      
                        // add name property value to Set
                        uniqueValuesSet.add(obj.time);
                      
                        // return the negated value of
                        // isPresentInSet variable
                        return !isPresentInSet;
                    });
                    // console.log(production1)
                    // console.log(p)
        
                    var time= []
                    var production = []
                    var consumption = []
        
                    for (let index = 0; index < p.length; index++) {
                        time.push(p[index].time)
                        production.push(p[index].production)
                        consumption.push(p[index].consumption)
                    }
                    // console.log(time)
                    // console.log(production)
                    var t =[]
                    for (let index = 0; index < time.length; index++) {
                    t[index] = this.abc(time[index])
                    
                    }
                    this.setState({
                        time1: t.reverse(),
                        production1: production.reverse(),
                        consumption1: consumption.reverse(),
                        chartLoaded1: true,
                        tableDisable: false,
                    })
        
                }}).catch((e) => {
                    // console.log(e)  
                    toast.error('Error: Chart Data not fetched', {
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
                else{
                    const access_token = localStorage.getItem('access_token'); 
                fetch(URL2+'project/getTechDashboardChartdata', {
                    headers : { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'access_token' : access_token
                    },
                    credentials: 'include',
                    method: 'PATCH',
                    signal,
                    mode: 'cors',
                    body: JSON.stringify({ project_id : this.state.selectedRows[0].project_id ,device_ids: devices, n:1000000, date: querydate})
                }).then(response => response.json()).
                then((json)=>{
                    if (json.statusCode == 404 || json.status==404 || json.statusCode == 500 || json.statusCode == 403 || json.statusCode == 401 || json.statusCode == 400) {
                        throw Error(json.statusText)        
                    }
                    else{
                    // console.log(json)
                    var production1 = []
                    for (let index = 0; index < json.production.time.length; index++) {
                        let obj = {
                        'time': json.production.time[index],
                        'production' : (json.production.combined[index]/1000).toFixed(3),
                        'consumption' : Math.abs((json.production.consumption[index]/1000).toFixed(3))
                        }
                        production1.push(obj)
                    }
                    const uniqueValuesSet = new Set();
                    const p = production1.filter((obj) => {
                        // check if name property value is already in the set
                        const isPresentInSet = uniqueValuesSet.has(obj.time);
                      
                        // add name property value to Set
                        uniqueValuesSet.add(obj.time);
                      
                        // return the negated value of
                        // isPresentInSet variable
                        return !isPresentInSet;
                    });
                    // console.log(production1)
                    // console.log(p)
        
                    var time= []
                    var production = []
                    var consumption = []
        
                    for (let index = 0; index < p.length; index++) {
                        time.push(p[index].time)
                        production.push(p[index].production)
                        consumption.push(p[index].consumption)
                    }
                    // console.log(time)
                    // console.log(production)
                    var t =[]
                    for (let index = 0; index < time.length; index++) {
                    t[index] = this.abc(time[index])
                    
                    }
                    this.setState({
                        time1: t.reverse(),
                        production1: production.reverse(),
                        consumption1: consumption.reverse(),
                        chartLoaded1: true,
                        tableDisable: false,
                    })
        
                }}).catch((e) => {
                    console.log(e)  
                    // toast.error('Error: Chart Data not fetched', {
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

    }
    fullReportData = () =>{
        var array = []
        for (let index = 0; index < this.state.selectedRows.length; index++) {
            array[index] = this.state.selectedRows[index].id
        }
        window.location = '/TechnicalDashboard/1?p='+array;
    }
    customerChange = (event) => {
        document.getElementById("project").selectedIndex = 0
        document.getElementById("invertor").selectedIndex = 0
        this.cancelRequest()
        this.cancelRequest2()
        const projects = this.state.all_projects.filter(project =>
            project.customer.name == event.target.value)
        
        this.setState({
            device_view: false,
            projects: projects,
            project_devices: []
        })
        // console.log(projects)

        
        var default_settings = this.state.default_settings ? this.state.default_settings : {}

        default_settings['customer'] = event.target.value
        default_settings['customer_select'] = true
        default_settings['project_select'] = false
        default_settings['all'] = false
        default_settings['single_device'] = false
        // if(this.state.table_data[0].device)

        this.setState({
            // tableLoaded: false,
            columns: [
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
         
          setTimeout(()=>this.customerChangeSetData(projects,default_settings), 100);
    }
    customerChangeSetData = (projects,default_settings) => {
        this.setState({
            table_data : projects, default_settings: default_settings, fullreportdevices: null, tableLoaded: true,
        })
    }

    projectChange = (event) => {
        this.cancelRequest()
        this.cancelRequest2()
        const project = this.state.all_projects.find(project =>
            project.name == event.target.value)
        document.getElementById("invertor").selectedIndex = 0
        var project_devices = project.projects_devices
        this.setState({
            selected_project: event.target.value,
            device_view: true,
            project_devices: project_devices
        })
        
        var default_settings = this.state.default_settings ? this.state.default_settings : {}
        default_settings['project'] = event.target.value
        default_settings['customer_select'] = false
        default_settings['project_select'] = true
        default_settings['all'] = false
        default_settings['single_device'] = false
        default_settings['project_id'] = project.id
        document.getElementById("fullreport").disabled = true;
        
 
                    // this.setState({table_data : filteredItems})\
                    // console.log(filteredItems)
                    const customer = project.customer.name
                    for (let index = 0; index < project_devices.length; index++) {
                        project_devices[index]["customer"] = customer
                        project_devices[index]["project"] = event.target.value
                        project_devices[index]["project_id"]=project.id
        
                    }
            
                    // console.log(devices)
        
                    this.setState({
                        columns: [
                            {
                                name: 'Customer',
                                selector: (row) =>row.customer
        
                            },
                            {
                                name: 'Project',
                                selector: (row) =>  <span onClick={()=>this.projectSelect(row.project)} style={{cursor:'pointer'}}><u>{row.project}</u></span>,
                            },
                            // <span onClick={()=>this.projectSelect(row.name)} style={{cursor:'pointer'}}><u>{row.name}</u></span>
                            {
                                name: 'Invertors',
                                selector: (row) =>  <span onClick={()=>this.invertorSelect(row.device.sn)} style={{cursor:'pointer'}}><u>{row.device.sn}</u>{row.device.status == 1 ? (<span>🟢</span>):(<span>🔴</span>)}</span>,
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
                            {
                                name: 'Action',
                                selector: (row) =>  <button className="btn btn-primary" style={{backgroundColor:'#004769', borderColor:'#004769', color:'white'}} ><Link style={{color:'white'}} to={`InvertorDetails/${row.project_id}?p=${JSON.stringify({project: row.project, customer: row.customer, sn: row.device.sn, type: row.device.desc, manufacturer: row.device.device_manufacturer.name, capacity: row.device.capacity})}`}>Invertor Detail</Link></button>,
                                center: true
                            },
        
        
                        ],
                        table_data : project_devices,
                        tableLoaded: true,
                        default_settings: default_settings
                    })
                document.getElementById("fullreport").disabled = false;
    }
    invertorChange = (event) => {
        this.cancelRequest()
        this.cancelRequest2()
        // console.log(this.state.table_data)
        var default_settings = this.state.default_settings ? this.state.default_settings : {}
        default_settings['sn'] = event.target.value
        default_settings['customer_select'] = false
        default_settings['project_select'] = false
        default_settings['all'] = false
        default_settings['single_device'] = true
        

        const project = this.state.all_projects.find(
            item => item.name ==  this.state.table_data[0].project )
        // console.log(project)
        const devices = project.projects_devices
        const filteredItems = devices.filter(
            item => item.device.sn ==  event.target.value )
        // this.setState({table_data : filteredItems})\
        default_settings['project'] = this.state.table_data[0].project
        default_settings['project_id'] = this.state.table_data[0].project_id
        // console.log(filteredItems)
        this.setState({
            table_data : filteredItems,
            default_settings: default_settings
        })
    }
    onFilter = (e) =>{
        const key = e.key; // const {key} = event; ES6+
        if (key === "Backspace" || key === "Delete") {
          this.setState({
            tableLoaded:false,
          })
          const filteredItems = this.state.all_projects.filter(
            item =>
            JSON.stringify(item.name)
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
            table_data: filteredItems,
            tableLoaded:true
          })
          // console.log('data',this.state.data)
        }
        else{
        // console.log(e.target.value)
        this.setState({
          tableLoaded:false,
        })
        const filteredItems = this.state.table_data.filter(
            item =>
            JSON.stringify(item.name)
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
            table_data: filteredItems,
            tableLoaded:true
        })
        // console.log('data',this.state.data)
      }
    }
    onFilterdevice = (e) =>{
        // alert("hello")
        const key = e.key; // const {key} = event; ES6+
        if (key === "Backspace" || key === "Delete") {
          this.setState({
            tableLoaded:false,
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
            table_data: filteredItems,
            tableLoaded:true
          })
          // console.log('data',this.state.data)
        }
        else{
        // console.log(e.target.value)
        this.setState({
            tableLoaded:false,
        })
        const filteredItems = this.state.table_data.filter(
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
            table_data: filteredItems,
            tableLoaded:true
        })
        // console.log('data',this.state.data)
      }
    }
    render(){
        return(

            <Container fluid className="main-content-container px-4">
            {/* Page Header */}
            <Row noGutters className="page-header py-4">
                <Col lg="9" md="12" sm="12">
                <PageTitle title={`O&M Technical Dashboard`} className="text-sm-left mb-3" style={{width:'100%'}} />
                </Col>
                <Col>
                <Row Col lg="3" md="12" sm="12">
                    <Col lg="8" md="12" sm="12">
                     {/* <Row style={{backgroundColor:'white', paddingTop:'5px', borderRadius:'15px'}}>
                         <Col style={{textAlign:'center'}}>
                         <label for="scales" style={{marginRight:'10px', color:'black', fontWeight:'500'}}>Production</label>
                         <input type="checkbox" id="production" name="scales"/>
                         </Col>
                         <Col style={{textAlign:'center'}}>
                         <label for="scales" style={{marginRight:'10px', color:'black', fontWeight:'500'}}>Consumption</label>
                         <input type="checkbox" id="scales" name="scales"/>
                         </Col>
                     </Row> */}
                    </Col>
                    <Col lg="4" md="12" sm="12">
                        {/* <div style={{textAlign:'center'}}>
                            <button id="fullreport" style={{border:'0px', backgroundColor:'#F5F6F8'}} onClick={this.fullReportData}>Full Report</button>
                        </div> */}
                        {this.state.tableLoaded ? ( 
                        <span>
                            {this.state.device_view ? (
                                <NavLink id="fullreport" tag={RouteNavLink} to={`TechnicalDashboard/1?d=${this.state.fullreportprojects}&data=${JSON.stringify(this.state.default_settings)}`}  style={{color:'black'}}>
                                    <span style={{fontSize:14, marginLeft:'10px'}}>Full Report</span>
                                </NavLink>
                            ):
                            (
                                <NavLink id="fullreport" tag={RouteNavLink} to={`TechnicalDashboard/1?p=${this.state.fullreportprojects}&data=${JSON.stringify(this.state.default_settings)}`}  style={{color:'black'}}>
                                <span style={{fontSize:14, marginLeft:'10px'}}>Full Report</span>
                                </NavLink>
                            )}
                        </span>):( <NavLink id="fullreport" tag={RouteNavLink} to={`#`}  style={{color:'black'}}>
                      <span style={{fontSize:14, marginLeft:'10px'}}>Full Report</span>
                    </NavLink>)}
                       
                    </Col>
                </Row>
                </Col>
            </Row>

            <Container fluid className="main-content-container px-4" >
            
            {this.state.cardsLoaded ? (
            <Can I="read" a="/project/getPowerProjectsForTechDashboard/" ability={this.state.ability}>
            <TechCards 
            total_production = {this.state.total_production} 
            total_projects={this.state.total_projects} 
            total_invertors={this.state.total_invertors}
            total_invertors_online={this.state.total_invertors_online}
            utilization={this.state.utilization}
            current_power={this.state.current_power}
            offline_projects={this.state.offline_projects}
            ></TechCards>
            </Can>
            
            ) : (<TechLoader></TechLoader>)}
            
            <div style={{marginTop:'30px'}}>
            <Row>
                <Col  lg="6" md="12" sm="12" >
                    <Row style={{marginBottom: '35px'}}>
                        <Col lg="12" md="12" sm="12" className="d-flex justify-content-center">
                            <div>
                            <center style={{display:'flex', width:'100%'}}>
                            <button style={{border:0, backgroundColor: '#F4F5F7'}} onClick={this.decreaseTodaysDate} ><i style={{fontSize:'35px',marginRight:'10px', cursor:'pointer'}} class='fas' >&#xf0d9;</i></button>
                            <input type="date" class="form-control" style={{textAlign:'center', width:'300px'}} defaultValue={this.state.today_date} id="today" max={this.state.max_date} onChange={this.todayChartDateChange}  ></input>
                            <button style={{border:0, backgroundColor: '#F4F5F7'}} onClick={this.increaseTodaysDate} ><i style={{fontSize:'35px',marginLeft:'10px',cursor:'pointer'}} class='fas'>&#xf0da;</i></button>
                            </center>
                            </div>
                        </Col>
                    </Row>
                    <Row style={{marginBottom: '-35px'}}>
                    <Col>
                        </Col>
                    <Col>
                        </Col>
                        <Col>
                        </Col>
                        <Col>
                        </Col>
                        <Col>
                        </Col>
                        <Col>
                        </Col>
                        <Col >
                            
                        </Col>
                        <Col style={{textAlign:"center"}}>
                            <div style={{display:"flex"}}>
                            {this.state.tableLoaded ? (
                                <Can I="read" a="/messages/getMessages/" ability={this.state.ability}>
                                <>
                                {this.state.device_view ? (
                                    <button 
                                    style={{border: "0px", backgroundColor:'white'}}
                                    onClick={()=>this.retrieve_errors(null,4,this.state.today_date, this.state.fullreportdevices)}>
                                        <img src={warning} width="25px" style={{cursor:'pointer'}} >
                                            </img>
                                    </button>
                                ):(
                                    <button 
                                style={{border: "0px", backgroundColor:'white'}}
                                onClick={()=>this.retrieve_errors(this.state.fullreportprojects,4,this.state.today_date, this.state.fullreportdevices)}>
                                    <img src={warning} width="25px" style={{cursor:'pointer'}} >
                                        </img>
                                </button>
                                )}
                                </>
                                </Can>
                            ) : (
                               <a>
                                    <img src={warning} width="25px" style={{marginRight:'5px', cursor:'pointer'}} >
                                        </img>
                                </a>)}
                                {this.state.tableLoaded ? (
                                    <Can I="read" a="/messages/getMessages/" ability={this.state.ability}>
                                    <>
                                    {this.state.device_view ? 
                                    (
                                        <button 
                                        style={{border: "0px", backgroundColor:'white'}}
                                        onClick={()=>this.retrieve_errors(null,3,this.state.today_date, this.state.fullreportdevices)}>
                                            <img src={error} width="25px" style={{marginLeft:'-7px', cursor:'pointer'}} >
                                                </img>
                                        </button>
                                    ):(
                                        <button 
                                        style={{border: "0px", backgroundColor:'white'}}
                                        onClick={()=>this.retrieve_errors(this.state.fullreportprojects,3,this.state.today_date, this.state.fullreportdevices)}>
                                            <img src={error} width="25px" style={{marginLeft:'-7px', cursor:'pointer'}} >
                                                </img>
                                        </button>
                                    )}
                                
                                </>
                                </Can>
                            ) : (
                                <a>
                                    <img src={error} width="25px" style={{marginRight:'5px', cursor:'pointer'}} >
                                        </img>
                                </a>
                                )}
                            </div>
                        
                        </Col>
                    </Row>
                    <div style={{backgroundColor:'white', borderRadius:'15px', height:'330px'}}>
                        <div style={{display:"flex", marginBottom:'-80px'}} >
                            <div style={{textAlign:'center', width:'50%'}} >  
                                <img src={this.state.weatherimage1} width="50px" className="weatherimageleft"></img>
                                {this.state.chart1_min_temperature ? (
                                    <p style={{color:'black'}} className="weatherimageleft weathertext">Min {this.state.chart1_min_temperature}°C</p>
                                ):(
                                    <p style={{color:'black'}} className="weatherimageleft weathertext">&nbsp;</p>
                                )}
                                
                            </div>
                            <div style={{textAlign:'center', width:'50%'}}>
                                <img src={this.state.weatherimage1} width="50px" className="weatherimageright"></img>
                                {this.state.chart1_max_temperature ? (
                                <p style={{color:'black'}} className="weatherimageright weathertext">Max {this.state.chart1_max_temperature}°C</p>
                                ) : (
                                    <p style={{color:'black'}} className="weatherimageright weathertext">&nbsp;</p>
                                )}
                                
                            </div>
                        </div>
                       {this.state.chartLoaded ? (<ProductionChart height={300} time={this.state.time} production={this.state.production} consumption={this.state.consumption}></ProductionChart>) :(<L marginTop={"14%"}></L>)}
                        
                    </div>
                    
                    
                </Col>
                <Col  lg="6" md="12" sm="12" >
                    <Row style={{marginBottom: '35px'}}>
                        <Col lg="12" md="12" sm="12" className="d-flex justify-content-center">
                            <div>
                            <center style={{display:'flex', width:'100%'}}>
                            <button style={{border:0, backgroundColor: '#F4F5F7'}} onClick={this.decreaseYesterdayDate}><i style={{fontSize:'35px',marginRight:'10px',cursor:'pointer'}} class='fas'>&#xf0d9;</i></button>
                            <input type="date" class="form-control" style={{textAlign:'center', width:'300px'}} defaultValue={this.state.yesterday_date} id="yesterday"  max={this.state.max_date} onChange={this.yesterdayChartDateChange} ></input>
                            <button style={{border:0, backgroundColor: '#F4F5F7'}} onClick={this.increaseYesterdayDate} ><i style={{fontSize:'35px',marginLeft:'10px',cursor:'pointer'}} class='fas' >&#xf0da;</i></button>
                            </center>
                            </div>
                        </Col>
                    </Row>
                    <Row style={{marginBottom: '-55px'}}>
                    <Col>
                        </Col>
                    <Col>
                        </Col>
                        <Col>
                        </Col>
                        <Col>
                        </Col>
                        <Col>
                        </Col>
                        <Col>
                        </Col>
                        <Col >
                            
                        </Col>
                        <Col style={{textAlign:"center"}}>
                        <div style={{display:"flex"}}>
                            {this.state.tableLoaded ? (
                                <Can I="read" a="/messages/getMessages/" ability={this.state.ability}>
                                <>
                                {this.state.device_view ? (
                                    <button 
                                        style={{border: "0px", backgroundColor:'white'}}
                                        onClick={()=>this.retrieve_errors(null,4,this.state.yesterday_date, this.state.fullreportdevices)}>
                                            <img src={warning} width="25px" style={{ cursor:'pointer'}} >
                                                </img>
                                        </button>
                                ) : (
                                    <button 
                                        style={{border: "0px", backgroundColor:'white'}}
                                        onClick={()=>this.retrieve_errors(this.state.fullreportprojects,4,this.state.yesterday_date, this.state.fullreportdevices)}>
                                            <img src={warning} width="25px" style={{ cursor:'pointer'}} >
                                                </img>
                                        </button>
                                )}
                                
                                </>
                                </Can>) : (
                                
                                <a>
                                    
                                    <img src={warning} width="25px" style={{marginRight:'5px', cursor:'pointer'}} >
                                        </img>
                                </a>
                                )}
                                {this.state.tableLoaded ? (
                                    <Can I="read" a="/messages/getMessages/" ability={this.state.ability}>
                                    <>
                                    {
                                        this.state.device_view ? (
                                            <button 
                                                style={{border: "0px", backgroundColor:'white'}}
                                                onClick={()=>this.retrieve_errors(null,3,this.state.yesterday_date, this.state.fullreportdevices)}>
                                                    <img src={error} width="25px" style={{marginLeft:'-7px', cursor:'pointer'}} >
                                                        </img>
                                            </button>
                                        ) : (
                                            <button 
                                                style={{border: "0px", backgroundColor:'white'}}
                                                onClick={()=>this.retrieve_errors(this.state.fullreportprojects,3,this.state.yesterday_date, this.state.fullreportdevices)}>
                                                    <img src={error} width="25px" style={{marginLeft:'-7px', cursor:'pointer'}} >
                                                        </img>
                                            </button>
                                        )
                                    }
                                    </>
                                    </Can>
                            ) : (
                              <a>
                                    <img src={error} width="25px" style={{marginRight:'5px', cursor:'pointer'}} >
                                        </img>
                                </a>)}
                            </div>
                        
                        </Col>
                    </Row>
                    <div style={{backgroundColor:'white', marginTop:'20px',  borderRadius:'15px',  height:'330px'}}>
                        <div style={{display:"flex", marginBottom:'-80px'}}>
                            <div style={{textAlign:'center', width:'50%'}}>  
                                <img src={this.state.weatherimage2} width="50px"className="weatherimageleft"></img>
                                {this.state.chart2_min_temperature ? (
                                    <p style={{color:'black'}}className="weatherimageleft weathertext">Min {this.state.chart2_min_temperature}°C</p>
                                ) : (
                                    <p style={{color:'black'}}className="weatherimageleft weathertext">&nbsp;</p>
                                )}
                                
                            </div>
                            <div style={{textAlign:'center', width:'50%'}}>
                                <img src={this.state.weatherimage2} width="50px"className="weatherimageright"></img>
                                {this.state.chart2_max_temperature ? (
                                <p style={{color:'black'}}className="weatherimageright weathertext">Max {this.state.chart2_max_temperature}°C</p>
                                ) : (
                                <p style={{color:'black'}}className="weatherimageright weathertext">&nbsp;</p>       
                                )}
                                
                            </div>
                        </div>
                       
                        {this.state.chartLoaded1 ? (<ProductionChart height={300} time={this.state.time1} production={this.state.production1} consumption={this.state.consumption1}></ProductionChart>) :(<L></L>)}
                    </div>
                    
                    
                </Col>
            </Row>
            </div>
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
                    <FormSelect aria-label="Default select example" name="location" id="invertor" onChange={this.invertorChange}>
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
                          <input style={{ width:'130px', border: '1px solid black' }} class="form-control" id="search" type="text" placeholder="Search..." onKeyUp={this.onFilter}></input>
                      )}
                  </Col>
                </Row>
            </Card>


          </Col>
        </Row>
            <Card small style={{borderRadius:'10px',marginBottom:'40px'}}>
                {this.state.tableLoaded ? (
                <Can I="read" a="/project/getPowerProjectsForTechDashboard/" ability={this.state.ability}>
                <DataTable
                    columns={this.state.columns}
                    data={this.state.table_data}
                    selectableRows
                    onSelectedRowsChange={this.handleChange}
                    customStyles= {this.state.customStyles}
                    selectableRowSelected ={rowSelectCritera}
                    striped
                    pagination
                    // disabled={this.state.tableDisable} 
                />
                </Can> ):(<L marginTop={"5%"}></L>)}
                
             </Card>
            {/* <div style={{padding:'15px', backgroundColor:'white', width:'70%', marginLeft:'13%', marginTop:'-580px', zIndex:2,position: 'absolute', borderRadius:'15px'}} id="dailychart" class="dchart">
                
                <Row style={{marginBottom:'15px', borderBottom: '1px solid #cfcfcf', padding:'10px'}}>
                    <Col lg="6" md="6" sm="6">
                        <h4>Invertor Details</h4>
                    </Col>
                    <Col lg="6" md="6" sm="6" style={{textAlign:'right'}}>
                    <Button variant="secondary" onClick={this.handleClose}>
                        Close
                    </Button>
                    </Col>
                
                </Row>
                <Row style={{marginTop: '0px'}}>
                    <Col>
                    </Col>
                    <Col>
                    </Col>
                    <Col>
                    <p style={{ fontSize:'14px', textAlign:'right'}}><Link style={{color:'black'}} to={`TechnicalDashboard/1?p=${JSON.stringify(this.state.selectedRows)}`}>Invertor Comparison</Link></p>

                    </Col>
                </Row>

                <Row>
                    <Col sm={3} md={3} lg={3}>
                    <div style={{padding: '10px', backgroundColor: '#f9f9f9'}}>
                        <h5>CHANNELS</h5>
                    </div>
                    <div style={{padding:'10px'}}>
                        <p>
                            Apparent power <br/>
                            <span style={{fontWeight:'normal', color:'#6b6b6b'}}>Symo 20.0-3-M</span>
                        </p>
                        <p>
                            Apparent power <br/>
                            <span style={{fontWeight:'normal', color:'#6b6b6b'}}>Symo 20.0-3-M</span>
                        </p>
                    </div>
                    
                    </Col>
                    <Col sm={9} md={9} lg={9} >
                        <InvertorChart></InvertorChart>
                    </Col>
                </Row>

            </div> */}

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
            
            </Container>

        );
    }

};



export default TechDashboard;
