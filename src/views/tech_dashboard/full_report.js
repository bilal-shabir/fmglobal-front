import React from "react";
//import PropTypes from "prop-types";
import { Card,
  CardHeader,
  CardBody,
  Container, Row, Col, Form
} from "shards-react";
import '../../assets/style.css';
import { Modal, Button, ThemeProvider } from "react-bootstrap";
import {URL2} from '../../constants';
//import {URL,DKEY} from '../constants';
import PageTitle from "../../components/common/PageTitle";
import {NavLink as RouteNavLink, NavLink} from "react-router-dom";
import production from '../../images/icons-26.png'
import consumption from '../../images/renewable-energy.png'
import DailyChart from "../../components/components-overview/tech_dashboard_components/daily_chart";
import ProductionChart from "../../components/components-overview/tech_dashboard_components/production_chart";
import L from "../../components/components-overview/loader";
import TechMonthlyChart from "../../components/components-overview/tech_dashboard_components/monthly_chart";
import error from "../../images/error_red.png";
import warning from "../../images/warning_yellow.png";
import DataTable from "react-data-table-component";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Can } from "@casl/react";
import setPermissions from "../defineAbility";

let controller

let cancel

class TechFullReport extends React.Component{ 

    constructor(props) {
        super(props);
        const userIs_logged=localStorage.getItem('is_logged');
        if(userIs_logged != 1){
        this.props.history.push("/login");
        }
        const queryParams = new URLSearchParams(window.location.search);
        var projects
        var devices
        var project_id = null
        const data = JSON.parse(queryParams.get('data')) 
        if(queryParams.get('p')){
             projects = queryParams.get('p').split(',');
        }
        else{
             projects = null
        }

        if(queryParams.get('d')){
            devices = queryParams.get('d').split(',');
            project_id = data.project_id
        }
        else {
            devices = null
        }
        
        // console.log('param',queryParams.get('data'))
        this.state = {
            project_id: project_id,
            error_heading: null,
            today_date: null,
            default_data: queryParams.get('data'),
            monthSelected: null,
            data: null,
            show: false,
            daily_data: null,
            chartload2: false,
            chartload:false,
            hourlyChartLoaded: false,
            time: [],
            production: [],
            consumption: [],
            time1: [],
            production1: [],
            consumption1: [],
            errors: [],
            live_production: 0,
            live_consumption: 0,
            projects: projects,
            devices: devices,
            month_chart_heading: 'Last 12 months',
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
        }
        // console.log(projects)
    }

    async componentDidMount(){

        cancel = new AbortController();
        const signal = cancel.signal;

        // console.log("here",this.state.data)
        var x = document.getElementById("dailychart");
        x.style.display = "none";

        const date = new Date
        const year = date.getFullYear()
        const month = date.getMonth()+1
        const d = year + '-' + this.addZero(month)
        this.setState({
            monthSelected: d
        })
        const access_token = localStorage.getItem('access_token');
          
          const day =this.addZero(date.getDate())
          const today_date =year+'-'+this.addZero(month)+'-'+day
          this.setState({
            today_date: today_date
          })
        //   const access_token = localStorage.getItem('access_token'); 

        if(this.state.projects){
            await fetch(URL2+'project/getWeeklyData',{
                headers : { 
                  'Content-Type': 'application/json',
                  'Accept': 'application/json',
                  'access_token' : access_token
                 },
                 credentials: 'include',
                 method: 'PATCH',
                 mode: 'cors',
                 body: JSON.stringify({project_id: this.state.projects, date: d})
              })
              .then(response => response.json())
              .then((json)=>{
                if (json.statusCode == 404 || json.status==404 || json.statusCode == 500 || json.statusCode == 403 || json.statusCode == 400 || json.statusCode == 401) {
                    throw Error(json.statusText)        
                }
                else{
                // console.log('asd')
                // console.log(json)
                this.setState({
                  selected_date: d,
                  daily_data : json,
                //   selected_month : date.toLocaleString('en-us', { month: 'long' }),
                  chartload2: true
                  
                })
        
              }})
              .catch((e) => {
                console.log(e)  
                // toast.error('Error: Weekly chart data not fetched', {
                //     position: "top-center",
                //     autoClose: 3000,
                //     hideProgressBar: false,
                //     closeOnClick: true,
                //     pauseOnHover: false,
                //     draggable: true,
                //     progress: undefined,
                //     });
              });
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
                body: JSON.stringify({ project_id : this.state.projects, n:1000000, date: today_date})
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
                    live_production: production[0],
                    live_consumption: consumption[0],
                    time1: t.reverse(),
                    production1: production.reverse(),
                    consumption1: consumption.reverse(),
                    chartload: true
                    // chartLoaded: true,
                    // tableDisable: false,
                })
    
            }}).catch((e) => {
                console.log(e)  
                // toast.error('Error: Hourly Chart data not fetched', {
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
        else {
            // console.log("lskdhflkjsnfd",this.state.devices)
            for (let index = 0; index < this.state.devices.length; index++) {
                this.state.devices[index] = +this.state.devices[index]
                
            }
            // console.log("lskdhflkjsnfd2",this.state.devices)
            await fetch(URL2+'project/getWeeklyData',{
                headers : { 
                  'Content-Type': 'application/json',
                  'Accept': 'application/json',
                  'access_token' : access_token
                 },
                 credentials: 'include',
                 method: 'PATCH',
                 mode: 'cors',
                 body: JSON.stringify({project_id: this.state.project_id, devices: this.state.devices, date: d})
              })
              .then(response => response.json())
              .then((json)=>{
                if (json.statusCode == 404 || json.status==404 || json.statusCode == 500 || json.statusCode == 403  || json.statusCode == 401 || json.statusCode == 400) {
                    throw Error(json.statusText)        
                }
                else{
                // console.log('asd')
                // console.log(json)
                this.setState({
                  selected_date: d,
                  daily_data : json,
                //   selected_month : date.toLocaleString('en-us', { month: 'long' }),
                  chartload2: true
                  
                })
        
              }}).catch((e) => {
                console.log(e)  
                // toast.error('Error: Weekly chart data not fetched', {
                //     position: "top-center",
                //     autoClose: 3000,
                //     hideProgressBar: false,
                //     closeOnClick: true,
                //     pauseOnHover: false,
                //     draggable: true,
                //     progress: undefined,
                //     });
              });
              
            fetch(URL2+'project/getTechDashboardChartdata', {
                headers : { 
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'access_token' : access_token
                },
                credentials: 'include',
                method: 'POST',
                // signal,
                mode: 'cors',
                body: JSON.stringify({ project_id : this.state.project_id, n:1000000, device_ids: this.state.devices, date: today_date})
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
                    live_production: production[0],
                    live_consumption: consumption[0],
                    time1: t.reverse(),
                    production1: production.reverse(),
                    consumption1: consumption.reverse(),
                    chartload: true
                    // chartLoaded: true,
                    // tableDisable: false,
                })
    
            }}).catch((e) => {
                console.log(e)  
                // toast.error('Error: Hourly chart not fetched', {
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
    componentWillUnmount(){
        if(cancel){
            cancel.abort()
        }
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

    addZero(i) {
        if (i < 10) {i = "0" + i}
        return i;
      }
    cancelRequest = () =>{
        if(controller){
            controller.abort();
        }
    }
    handleBarClick = (data) => {

        this.cancelRequest()

        controller = new AbortController();
        const signal = controller.signal;

        this.setState({
            hourlyChartLoaded: false,
            data: data
        })
        var x = document.getElementById("dailychart");
        x.style.display = "block"
        
        const access_token = localStorage.getItem('access_token'); 

        if(this.state.projects){
            fetch(URL2+'project/getTechDashboardChartdata', {
                headers : { 
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'access_token' : access_token
                },
                credentials: 'include',
                method: 'POST',
                signal,
                mode: 'cors',
                body: JSON.stringify({ project_id : this.state.projects, n:1000000, date: this.state.selected_date + "-"+data})
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
                    hourlyChartLoaded: true
                    // chartLoaded: true,
                    // tableDisable: false,
                })
    
            }}).catch((e) => {
                // console.log(e)  
                toast.error('Error: Hourly chart data not fetched', {
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
            fetch(URL2+'project/getTechDashboardChartdata', {
                headers : { 
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'access_token' : access_token
                },
                credentials: 'include',
                method: 'POST',
                signal,
                mode: 'cors',
                body: JSON.stringify({ project_id : this.state.project_id, n:1000000,device_ids: this.state.devices, date: this.state.selected_date + "-"+data})
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
                    hourlyChartLoaded: true
                    // chartLoaded: true,
                    // tableDisable: false,
                })
    
            }}).catch((e) => {
                // console.log(e)  
                toast.error('Error: Hourly chart data not fetched', {
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
    abc (date)
    {
    var time = Date.parse(date);
    var date1 = new Date(time);

    
    let h =this.addZero(date1.getHours())
    let m =this.addZero(date1.getMinutes())
    
    let time1 = h + ":" + m
    return time1

    }
    handleClose = () => {
        var x = document.getElementById("dailychart");
        x.style.display = "none"
        // this.setState({ show: false });
      }

    dailyChartMonthChange = (e) => {
        
    var time = Date.parse(e.target.value);
    var date1 = new Date(time);
  
    
    this.setState({
      chartload2: false,
      month: date1.getMonth(),
      monthSelected: e.target.value
    })
    const pid = this.state.projects;
    const access_token = localStorage.getItem('access_token'); 

    if(this.state.projects){
        fetch(URL2+'project/getWeeklyData',{
            headers : { 
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'access_token' : access_token
             },
             credentials: 'include',
             method: 'PATCH',
             mode: 'cors',
             body: JSON.stringify({project_id: pid, date: e.target.value})
          })
          .then(response => response.json())
          .then((json)=>{
            if (json.statusCode == 404 || json.status==404 || json.statusCode == 500 || json.statusCode == 403  || json.statusCode == 401 || json.statusCode == 400) {
                throw Error(json.statusText)        
            }
            else{
            // console.log(json)
            // var  months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            this.setState({
              daily_data : json,
            //   monthSelected : months[this.state.month],
              chartload2: true
            })
            // alert(this.state.selected_month)
            
          }}).catch((e) => {
            // console.log(e)  
            toast.error('Error: Weekly chart data not fetched', {
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
        fetch(URL2+'project/getWeeklyData',{
            headers : { 
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'access_token' : access_token
             },
             credentials: 'include',
             method: 'POST',
             mode: 'cors',
             body: JSON.stringify({project_id: this.state.project_id, date: e.target.value, devices: this.state.devices})
          })
          .then(response => response.json())
          .then((json)=>{
            if (json.statusCode == 404 || json.status==404 || json.statusCode == 500 || json.statusCode == 403 || json.statusCode == 401 || json.statusCode == 400) {
                throw Error(json.statusText)        
            }
            else{
            // console.log(json)
            // var  months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            this.setState({
              daily_data : json,
            //   monthSelected : months[this.state.month],
              chartload2: true
            })
            // alert(this.state.selected_month)
            
          }})
          .catch((e) => {
            // console.log(e)  
            toast.error('Error: Project not fetched', {
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
    retrieve_errors = async(project_id, msg_type,  date ,devices) => {

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
        var devices2 = []
        if (devices) {
            await fetch(URL2+`device/getDevicesForInvertorComparison`, {
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
                    for (let index = 0; index < devices.length; index++) {
                        const device = json.find(item =>
                            item.id == devices[index]
                            )
                        devices2[index]= device.sn
                    }
                }}).catch((e) => {
                    // console.log(e)  
                    toast.error('Error: Devices not fetched', {
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
        // console.log("here",devices2)
        
        const d = new Date(document.getElementById("month").value)
        // console.log(d)
        var firstDay = new Date(d.getFullYear(), d.getMonth(), 1);
        var lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0);

        firstDay = date ? null : firstDay.getFullYear() + '-'+ this.addZero(firstDay.getMonth()+1) +'-'+this.addZero(firstDay.getDate())
        lastDay =  date ? null : lastDay.getFullYear() + '-'+ this.addZero(lastDay.getMonth()+1) +'-'+this.addZero(lastDay.getDate())

        // console.log(firstDay)
        // console.log(lastDay)

        this.setState({
            
        })
        var device = devices ? devices.length == 0 ? null : devices2 : null
        // console.log(device)
        await fetch(URL2+'messages/getMessages', {
            headers : { 
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                },
                method: 'PATCH',
                body: JSON.stringify({ message_type: msg_type, project: device ? null : project_id, device_sn: null, date: date? date : null, device_sn: device, from_date: firstDay, to_date: lastDay }),
                credentials: 'include'
            })
            .then(response => response.json())
            .then((json) => {
                if (json.statusCode == 404 || json.status==404 || json.statusCode == 500 || json.statusCode == 403 || json.statusCode == 401 || json.statusCode == 400 ) {
                    throw Error(json.statusText)        
                }
                else{
                // console.log("errors",json)
                this.setState({
                    errors: json
                })
            }}).catch((e) => {
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
            show_errors: false
        })
    }
    render(){
        return(

            <Container fluid className="main-content-container px-4">
                <Row noGutters className="page-header py-4">
                    <PageTitle title={`O&M Technical Dashboard / Full Report`} className="text-sm-left mb-3" style={{width:'100%'}} />
                    {/* <p style={{float:'right'}}>Back</p> */}
                </Row>
                <Row>
                    <Col>
                    {/* <button className="btn btn-primary" style={{backgroundColor:'#004769', borderColor:'#004769', padding:'5px'}}  onClick={this.goback}>Go Back</button> */}
                    <button className="btn btn-primary" style={{backgroundColor:'#004769', borderColor:'#004769', padding:'5px'}}  >
                    <NavLink tag={RouteNavLink} to={`/TechnicalDashboard?data=${this.state.default_data}`}  style={{color:'white'}}>
                      <span style={{fontSize:14}}>Back</span>
                    </NavLink>
                    </button>
                    </Col>
                </Row>
                <Row style={{marginTop: "5px"}}>
            <Col lg="4" md="12" sm="12" className="col-lg mb-5">
                <Card small>
                    <CardHeader className="border-bottom d-flex">
                        {/* <h6 className="m-0">Current Production <span style={{fontSize:11, color:'d9d9d9',marginLeft:'10px'}}><i class="material-icons">update</i> {this.state.last_updated}</span></h6> */}
                        
                             <h6 className="text-semibold text-fiord-blue">Latest Production</h6>
                             <span className="ml-auto text-right text-semibold text-reagent-gray">
                             {/* <i class="material-icons">update</i> {this.state.last_updated} */}
                             </span>
                        
                     
                        <div className="block-handle" />
                        </CardHeader>
                    
                        <CardBody className="p-0">
                                <div style={{margin: "auto",width: "232px",padding: "15px",alignContent:"center",alignItems:"center",marginTop: "1.75rem"}}>
                                    <img id="my-svg" alt=""  src={production} style={{ maxWidth: "99%"}}/>
                                </div>
                                <span className="ml-auto text-center text-bold" style={{fontSize:"16px",fontWeight:"500"}}>
                                    <p>{this.state.live_production} kW</p>
                                </span>  
                        </CardBody>

                </Card>
            </Col>
            <Col lg="4" md="12" sm="12" className="col-lg mb-5">
            
                <Card small>
                    <CardHeader className="border-bottom">
                    <h6 className="text-semibold text-fiord-blue">Hourly Production (kW)</h6>
                    <div className="block-handle" />
                    </CardHeader>
                
                    <CardBody>

                    {this.state.chartload ?
                        (<div className={"hourlypowerchart1"}>
                            <Row>
                                <Col>
                                </Col>
                                <Col>
                                </Col>
                                <Col style={{textAlign:'right'}}>
                                    {/* <div style={{display:'flex', textAlign:'right'}}> */}
                                    {this.state.projects ? (
                                        <>
                                        <button 
                                        style={{border: "0px", backgroundColor:'#F4F4F4'}}
                                        onClick={()=>this.retrieve_errors(this.state.projects,4,this.state.today_date, this.state.fullreportdevices)}>
                                            <img src={warning} width="25px" style={{ cursor:'pointer'}} >
                                                </img>
                                    </button>
                                    <button 
                                        style={{border: "0px", backgroundColor:'#F4F4F4'}}
                                        onClick={()=>this.retrieve_errors(this.state.projects,3,this.state.today_date, this.state.fullreportdevices)}>
                                            <img src={error} width="25px" style={{marginLeft:'-7px', cursor:'pointer'}} >
                                                </img>
                                    </button>
                                    </>
                                    ):
                                    (
                                        <>
                                        <button 
                                        style={{border: "0px", backgroundColor:'#F4F4F4'}}
                                        onClick={()=>this.retrieve_errors(null,4,this.state.today_date, this.state.devices)}>
                                            <img src={warning} width="25px" style={{ cursor:'pointer'}} >
                                                </img>
                                    </button>
                                    <button 
                                        style={{border: "0px", backgroundColor:'#F4F4F4'}}
                                        onClick={()=>this.retrieve_errors(null,3,this.state.today_date, this.state.devices)}>
                                            <img src={error} width="25px" style={{marginLeft:'-7px', cursor:'pointer'}} >
                                                </img>
                                    </button>
                                    </>
                                    )}
                                    
                                    {/* </div> */}
                                
                                </Col>
                            </Row>
                              <ProductionChart height={241} time={this.state.time1} production={this.state.production1} consumption={this.state.consumption1}></ProductionChart>
                        
                            </div>
                            ): (<L></L>)}
                    </CardBody>
                    
                </Card>
               
            </Col>

            <Col lg="4" md="12" sm="12" className="col-lg mb-5">
                <Card small>
                    <CardHeader className="border-bottom d-flex">
                        {/* <h6 className="m-0">Current Production <span style={{fontSize:11, color:'d9d9d9',marginLeft:'10px'}}><i class="material-icons">update</i> {this.state.last_updated}</span></h6> */}
                        
                             <h6 className="text-semibold text-fiord-blue">Latest Consumption</h6>
                             <span className="ml-auto text-right text-semibold text-reagent-gray">
                             {/* <i class="material-icons">update</i> {this.state.last_updated} */}
                             </span>
                        
                     
                        <div className="block-handle" />
                        </CardHeader>
                    
                        <CardBody className="p-0">
                                <div style={{margin: "auto",width: "232px",padding: "15px",alignContent:"center",alignItems:"center",marginTop: "1.75rem"}}>
                                    <img id="my-svg" alt=""  src={consumption} style={{ maxWidth: "99%"}}/>
                                </div>
                                <span className="ml-auto text-center text-bold" style={{fontSize:"16px",fontWeight:"500"}}>
                                    <p>{this.state.live_consumption} kW</p>
                                </span>  
                        </CardBody>

                </Card>
            </Col>
            
        </Row>
        <Row  >
            <Col  lg="12" md="12" sm="12" className="col-lg mb-5">
            
                <Card  small style={{ zIndex:1}}>
                    <CardHeader className="border-bottom">
                    <h6 className="m-0">Daily Power Generated (kWh)  
                    {/* <span style={{fontSize:'15px', color:'#c9c9c9'}}><i class="material-icons">update</i> {this.state.last_updated}</span>  */}
                    </h6>
                    <div className="block-handle" />
                    </CardHeader>
                    <Row>

                    <Col>
                    <Form style={{padding:'5px'}}>           
                    <div class="form-group" style={{display:"flex"}}>
                        <label for="exampleInputPassword1" style={{marginTop:'2px'}}>Select Month: </label>
                        <input type="month" class="form-control" id="month" onChange={this.dailyChartMonthChange } defaultValue={this.state.monthSelected}  style={{width:'250px',marginLeft:'5px'}} ></input>
                    </div>
                    </Form>
                    </Col>
                    <Col>
                    <Row>
                        <Col>
                        </Col>
                        <Col>
                        </Col>
                        <Col style={{textAlign:'right'}}>
                            {/* <div style={{display:'flex', textAlign:'right'}}> */}
                            
                            {this.state.projects ? (
                                <div>
                                <button 
                                style={{border: "0px", backgroundColor:'white'}}
                                onClick={()=>this.retrieve_errors(this.state.projects,4,null, this.state.fullreportdevices)}>
                                    <img src={warning} width="25px" style={{ cursor:'pointer'}} >
                                        </img>
                            </button>
                            <button 
                                style={{border: "0px", backgroundColor:'white'}}
                                onClick={()=>this.retrieve_errors(this.state.projects,3,null, this.state.fullreportdevices)}>
                                    <img src={error} width="25px" style={{marginLeft:'-7px', cursor:'pointer'}} >
                                        </img>
                            </button>
                            </div>
                            ):(
                                <div>
                                <button 
                                style={{border: "0px", backgroundColor:'white'}}
                                onClick={()=>this.retrieve_errors(this.state.project_id,4,null, this.state.devices)}>
                                    <img src={warning} width="25px" style={{ cursor:'pointer'}} >
                                        </img>
                            </button>
                            <button 
                                style={{border: "0px", backgroundColor:'white'}}
                                onClick={()=>this.retrieve_errors(this.state.project_id,3,null, this.state.devices)}>
                                    <img src={error} width="25px" style={{marginLeft:'-7px', cursor:'pointer'}} >
                                        </img>
                            </button>
                            </div>
                            )
                            }
                            
                            
                            {/* </div> */}
                        
                        </Col>
                    </Row>
                    </Col>
                    </Row>
                    <CardBody className="p-0">
                        
                    {this.state.chartload2 && this.state.daily_data ? (<DailyChart barclick={this.handleBarClick} data={this.state.daily_data}></DailyChart>) :(<L></L>) }
                        
                    </CardBody>
                    
                </Card>
               
            </Col>
            
            
        </Row>
{/*         
        <Modal
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    show={this.state.show}
                >
                    <Modal.Header>
                    <Modal.Title>Production for</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <h1>{this.state.monthSelected}</h1>
                        <h1>{this.state.data}</h1>
                        <div className={"hourlypowerchart1"}>
                        <Echart5 time={[]} value_sma={[]} value_fronius={[]}></Echart5>
                        </div> 
                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={this.handleClose}>
                        Close
                    </Button>
                    <Button variant="btn btn-primary"  style={{backgroundColor:'#004769', borderColor:'#004769'}}>
                        Create
                    </Button>
                    </Modal.Footer>
                    
                </Modal> */}
                <div style={{padding:'15px', backgroundColor:'white', width:'50%', marginLeft:'24%', marginTop:'-600px', zIndex:2,position: 'absolute', borderRadius:'15px'}} id="dailychart" class="dchart">
                <Row style={{marginBottom:'5px', borderBottom: '1px solid #cfcfcf', padding:'10px'}}>
                    <Col lg="6" md="6" sm="6">
                        <h4>Production on {this.state.monthSelected +'-'+this.state.data}</h4>
                    </Col>
                    <Col lg="6" md="6" sm="6" style={{textAlign:'right'}}>
                    <Button variant="secondary" onClick={this.handleClose}>
                        Close
                    </Button>
                    </Col>
                
                </Row>
                
                {/* <div className={"hourlypowerchart1"}> */}
                <div>
                {this.state.hourlyChartLoaded ? (
                    <>
                    <Row>
                    <Col>
                    </Col>
                    <Col>
                    </Col>
                    <Col style={{textAlign:'right'}}>
                        {/* <div style={{display:'flex', textAlign:'right'}}> */}
                        {this.state.projects ?
                        (
                            <div>
                                <button 
                            style={{border: "0px", backgroundColor:'white'}}
                            onClick={()=>this.retrieve_errors(this.state.projects,4,this.state.monthSelected +'-'+this.state.data, this.state.fullreportdevices)}>
                                <img src={warning} width="25px" style={{ cursor:'pointer'}} >
                                    </img>
                        </button>
                        <button 
                            style={{border: "0px", backgroundColor:'white'}}
                            onClick={()=>this.retrieve_errors(this.state.projects,3,this.state.monthSelected +'-'+this.state.data, this.state.fullreportdevices)}>
                                <img src={error} width="25px" style={{marginLeft:'-7px', cursor:'pointer'}} >
                                    </img>
                        </button>
                            </div>
                        ):
                        (
                            <div>
                                <button 
                            style={{border: "0px", backgroundColor:'white'}}
                            onClick={()=>this.retrieve_errors(this.state.project_id,4,this.state.monthSelected +'-'+this.state.data, this.state.devices)}>
                                <img src={warning} width="25px" style={{ cursor:'pointer'}} >
                                    </img>
                        </button>
                        <button 
                            style={{border: "0px", backgroundColor:'white'}}
                            onClick={()=>this.retrieve_errors(this.state.project_id,3,this.state.monthSelected +'-'+this.state.data, this.state.devices)}>
                                <img src={error} width="25px" style={{marginLeft:'-7px', cursor:'pointer'}} >
                                    </img>
                        </button>
                            </div>
                        )}
                        
                        {/* </div> */}
                    
                    </Col>
                </Row>
                
                <ProductionChart height={300} time={this.state.time} production={this.state.production} consumption={this.state.consumption}></ProductionChart>
                </>
                ):(<L></L>)}
                </div>
                {/* </div> */}
                </div>

                <Row  >
            <Col  lg="12" md="12" sm="12" className="col-lg mb-5">
            
                <Card  small>
                    <CardHeader className="border-bottom">
                    <h6 className="m-0">Total Monthly Power (kWh)  <span style={{fontSize:'13px', color:'#c9c9c9'}}>{this.state.month_chart_heading}</span></h6>
                    <div className="block-handle" />
                    </CardHeader>
                    
                    <CardBody className="p-0">
                        {this.state.projects ? 
                        
                    (
                        <TechMonthlyChart id={ this.state.projects}></TechMonthlyChart>
                    ):
                    (
                        <TechMonthlyChart id={ this.state.project_id} devices={this.state.devices}></TechMonthlyChart>
                    )}
                        
                        
                    </CardBody>
                    
                </Card>
               
            </Col>
            
            
        </Row>
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

};



export default TechFullReport;
