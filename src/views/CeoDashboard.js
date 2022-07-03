import React from "react";
import PropTypes from "prop-types";
import { Card,
  CardHeader,
  CardBody,
  Container, Row, Col, Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "shards-react";

import {URL,DKEY} from '../constants';
import PageTitle from "../components/common/PageTitle";
import WindRadar from "../components/components-overview/WindRadar";
import ProjectHours from "../components/components-overview/ProjectHours";
import ProjectSubTask from "../components/components-overview/ProjectSubTask";
import StaffTime from "../components/components-overview/StaffTime";
import ProjectType from "../components/components-overview/ProjectType";
import DatePicker from "react-datepicker";
import Cookies from "universal-cookie";




// import "react-datepicker/dist/react-datepicker.css";




class CeoDashboard extends React.Component{ 



    constructor(props) {
      super(props);
      
      
      this.toggle = this.toggle.bind(this);
      this.getLastWeek = this.getLastWeek.bind(this);
      // this.toggle = this.toggle.bind(this);
    
      const userIs_logged=localStorage.getItem('is_logged');
      const userEmail=localStorage.getItem('Email');
      const userToken=localStorage.getItem('Password');
      if(userIs_logged != 1){
        this.props.history.push("/login");
      }
      // const cookies = new Cookies();
      // let permission = cookies.get('permissions')
      // var CryptoJS = require("crypto-js");
      // var bytes = CryptoJS.AES.decrypt(permission, DKEY);
      // var permissions = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

      // if(!permissions.find(({ name }) => name === 'CeoDashboard' ) ){
      //     this.props.history.push("/"+permissions[0].name);
      // }

      require('../utils').checkpermision('CeoDashboard')
      
      const SN = this.props.match.params.SN
      this.state = {
        smallStats: [],
      
        SNid :SN,
        timeIntervalForProject:this.getToday(),  
        useRangeForProject:false,
        startTimeForProject: new Date(2020, 10, 10),
        endTimeForProject: new Date(),



        timeIntervalForProduct:this.getToday(),  
        useRangeForProduct:false,
        startTimeForProduct: new Date(2020, 10, 10),
        endTimeForProduct: new Date(),



        timeIntervalForStaff:this.getToday(),  
        useRangeForStaff:false,
        startTimeForStaff: new Date(2020, 10, 10),
        endTimeForStaff: new Date(),



        timeIntervalForSubTask:this.getToday(),  
        useRangeForSubTask:false,
        startTimeForSubTask: new Date(2020, 10, 10),
        endTimeForSubTask: new Date(),

        open: false ,
        // date:new Date()

      }
      

    }

    toggle() {
      this.setState(prevState => {
        return { open: !prevState.open };
      });
    }

     getLastWeek() {
      var today = new Date();
      var lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
       var lastWeekFornatted = this.FormatDate(lastWeek);
      return lastWeekFornatted;
    }
     getLastMonth() {
      var today = new Date();
      var lastWeek = new Date(today.getFullYear(), today.getMonth()-1, today.getDate());
       var lastWeekFornatted = this.FormatDate(lastWeek);
      return lastWeekFornatted;
    }
     getLastYear() {
      var today = new Date();
      var lastWeek = new Date(today.getFullYear()-1, today.getMonth(), today.getDate());
       var lastWeekFornatted = this.FormatDate(lastWeek);
      return lastWeekFornatted;
    }
     getToday() {
      var date = new Date();
      var today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
       var lastWeekFornatted = this.FormatDate(today);
      return lastWeekFornatted;
    }


    FormatDate(lastWeek){
        var lastWeekMonth = lastWeek.getMonth() + 1;
        var lastWeekDay = lastWeek.getDate();
        var lastWeekYear = lastWeek.getFullYear();
        var lastWeekDisplay =  lastWeekYear + "-" +  lastWeekMonth + "-"  + lastWeekDay    ;
        return(lastWeekDisplay);
    }

    createSelectItems() {
      let items = [
        this.getToday(),
        this.getLastWeek(),
        this.getLastMonth(),
        this.getLastYear()
      ]; 
      let  dates=['Today', 'Last 7 Days', 'Last 30 Days' , 'Last 365 Days']
              
      for (let i = 0; i < 4; i++) {             
           items.push(<option key={i} value={items[i]}>{dates[i]}</option>);   

      }
      return items;
  }  

    changeDropdownValue = (e) => {
      this.setState({timeIntervalForProject : e.target.value});
    }
    changeDropdownValueForProduct = (e) => {
      this.setState({timeIntervalForProduct : e.target.value});
    }
    changeDropdownValueForStaff = (e) => {
      this.setState({timeIntervalForStaff : e.target.value});
    }
    changeDropdownValueForSubTask = (e) => {
      this.setState({timeIntervalForSubTask: e.target.value});
    }

    // ======================================

    handleStartDateChangeForProject = (e) =>{
      this.setState({          
        startTimeForProject: e
      });
    }
    handleEndDateChangeForProject = (e) =>{
      this.setState({          
        endTimeForProject: e
      });
    }
     handleuseRangeForProject = ()=>{
       this.setState({          
        useRangeForProject: !this.state.useRangeForProject
      });
      
    }
    // ==================================

    handleStartDateChangeForProduct = (e) =>{
      this.setState({          
        startTimeForProduct: e
      });
    }
    handleEndDateChangeForProduct = (e) =>{
      this.setState({          
        endTimeForProduct: e
      });
    }
     handleuseRangeForProduct = ()=>{
       this.setState({          
        useRangeForProduct: !this.state.useRangeForProduct
      });
      
     }

     // =============================

     handleStartDateChangeForStaff = (e) =>{
      this.setState({          
        startTimeForStaff: e
      });
    }
    handleEndDateChangeForStaff = (e) =>{
      this.setState({          
        endTimeForStaff: e
      });
    }
     handleuseRangeForStaff = ()=>{
       this.setState({          
        useRangeForStaff: !this.state.useRangeForStaff
      });
    }

      // =============================

      handleStartDateChangeForSubTask = (e) =>{
        this.setState({          
          startTimeForSubTask: e
        });
      }
      handleEndDateChangeForSubTask = (e) =>{
        this.setState({          
          endTimeForSubTask: e
        });
      }
       handleuseRangeForSubTask = ()=>{
         this.setState({          
          useRangeForSubTask: !this.state.useRangeForSubTask
        });
      }
    

    render(){
        return(

          <Container fluid className="main-content-container px-4">
          {/* Page Header */}
          <Row noGutters className="page-header py-4">
            <PageTitle title="CEO Dashboard" className="text-sm-left mb-3" />
            
          
          </Row>
          
          {/* <button className='btn btn-info'
          onClick={this.createNotification('info')}>Info
        </button>
        <hr/>
        <button className='btn btn-success'
          onClick={this.createNotification('success')}>Success
        </button>
        <hr/>
        <button className='btn btn-warning'
          onClick={this.createNotification('warning')}>Warning
        </button> */}
        {/* <hr/> */}
        

          <Row>
            <Col lg="6" md="6" sm="12" className="mb-4">

              <Card small>
                <CardHeader  className="border-bottom">
                  <h6  className="m-0">Total Hours Per Project</h6>
                  <div className="block-handle" />
                  <label style={{marginRight : "10px"}}>
                    <input style={{marginRight : "10px"}}  type="checkbox" onChange={this.handleuseRangeForProject} />
                    Select Time Period
                  </label>
                  
                  
                  { this.state.useRangeForProject 
                    ? <span style={{marginRight : "10px"}}>
                      <DatePicker
                        wrapperClassName="datePicker"
                        // style={{marginRight : "10px"}}
                        selected={this.state.startTimeForProject}
                        onChange={this.handleStartDateChangeForProject}
                        placeholderText = 'Starting Date'
                      />
                    </span>
                    : null
                  }
                  { this.state.useRangeForProject 
                    ? <span style={{marginRight : "10px"}}>
                      <DatePicker
                        // style={{marginRight : "10px"}}
                        wrapperClassName="datePicker"
                        selected={this.state.endTimeForProject}
                        onChange={this.handleEndDateChangeForProject}
                        placeholderText = 'Ending Date'
                      />
                    </span>
                    : null
                  }
                  { !this.state.useRangeForProject  
                    ? <select 
                    style={{
                      backgroundColor: "white", 
                      color:"#008CBA",
                      borderRadius: '3px',
                      padding: '3px',
                      border: '2px solid #008CBA',
                      marginLeft : "10px"
   
                      }} 
                      value={this.state.timeIntervalForProject} onChange={this.changeDropdownValue}>
                       {/* <option value='2021-10-7'>Today</option>
                       <option value='2021-09-30'>Last Week</option>
                       <option value='2021-09-7'>Last Month</option>
                       <option value='2020-10-7'>Last Year</option> */}
                       {this.createSelectItems()}
                    </select>
                    : null
                  }
                 
                

    
                </CardHeader>

                
                

                <CardBody className="p-0">

                

                <ProjectHours  key={7}
                   useRangeForProject={this.state.useRangeForProject} 
                  sn={this.state.SNid}
                  timeIntervalForProject = {this.state.timeIntervalForProject} 
                  startTimeForProject = {this.state.startTimeForProject}
                  endTimeForProject ={this.state.endTimeForProject}
               />
               

                </CardBody>

              </Card>
           </Col>

           <Col lg="6" md="6" sm="12" className="mb-4">

              <Card small>
                <CardHeader  className="border-bottom">
                  <h6   className="m-0">Total Hours Per Product</h6>
                  <div className="block-handle" />
                  <label style={{marginRight : "10px"}} >
                    <input style={{marginRight : "10px"}}  type="checkbox" onChange={this.handleuseRangeForProduct} />
                    Select Time Period
                  </label>
                  { this.state.useRangeForProduct  
                    ? <span style={{marginRight : "10px"}}>
                      <DatePicker
                        selected={this.state.startTimeForProduct}
                        onChange={this.handleStartDateChangeForProduct}
                      />
                      </span>
                    : null
                  }
                  { this.state.useRangeForProduct  
                    ? <span style={{marginRight : "10px"}}>
                      <DatePicker
                        selected={this.state.endTimeForProduct}
                        onChange={this.handleEndDateChangeForProduct}
                      />
                      </span>
                    : null
                  }
                  { !this.state.useRangeForProduct  
                    ? <select 
                      style={{
                        backgroundColor: "white", 
                        color:"#008CBA",
                        borderRadius: '3px',
                        padding: '3px',
                        border: '2px solid #008CBA',
                        marginLeft : "10px"
    
                        }} 
                        value={this.state.timeIntervalForProduct} onChange={this.changeDropdownValueForProduct}>
                        {/* <option value='2021-10-7'>Today</option>
                        <option value='2021-09-30'>Last Week</option>
                        <option value='2021-09-7'>Last Month</option>
                        <option value='2020-10-7'>Last Year</option> */}
                        {this.createSelectItems()}
                      </select>
                    : null
                  }
                  
                  

                  

                </CardHeader>

                <CardBody className="p-0">

                <ProjectType 
                timeIntervalForProduct ={this.state.timeIntervalForProduct}
                 sn={this.state.SNid}
                 useRangeForProduct = {this.state.useRangeForProduct} 
                 startTimeForProduct = {this.state.startTimeForProduct}
                 endTimeForProduct ={this.state.endTimeForProduct}
                 />
               

                </CardBody>

              </Card>
           </Col>

           <Col lg="6" md="6" sm="12" className="mb-4">

           <Card small>
            <CardHeader  className="border-bottom">
           <h6   className="m-0">Total Hours Per staffs</h6>
           <div className="block-handle" />
           <label style={{marginRight : "10px"}} >
                    <input style={{marginRight : "10px"}}  type="checkbox" onChange={this.handleuseRangeForStaff} />
                    Select Time Period
                  </label>
                  { this.state.useRangeForStaff 
                    ? <span style={{marginRight : "10px"}}>
                      <DatePicker
                        selected={this.state.startTimeForStaff}
                        onChange={this.handleStartDateChangeForStaff}
                      />
                      </span>
                      : null
                  }
                  { this.state.useRangeForStaff 
                    ?  <span style={{marginRight : "10px"}}>
                      <DatePicker
                        selected={this.state.endTimeForStaff}
                        onChange={this.handleEndDateChangeForStaff}
                      />
                      </span>
                    : null
                  }
                 
                  { !this.state.useRangeForStaff 
                    ? <select 
                      style={{
                        backgroundColor: "white", 
                        color:"#008CBA",
                        borderRadius: '3px',
                        padding: '3px',
                        border: '2px solid #008CBA',
                        marginLeft : "10px"
    
                        }} 
                        value={this.state.timeIntervalForStaff} onChange={this.changeDropdownValueForStaff}>
                        {/* <option value='2021-10-7'>Today</option>
                        <option value='2021-09-30'>Last Week</option>
                        <option value='2021-09-7'>Last Month</option>
                        <option value='2020-10-7'>Last Year</option> */}
                        {this.createSelectItems()}
                      </select>
                    : null
                  }
           

           </CardHeader>

            <CardBody className="p-0">

              <StaffTime 
              timeIntervalForStaff = {this.state.timeIntervalForStaff} 
              // sn={this.state  }
              useRangeForStaff = {this.state.useRangeForStaff} 
              startTimeForStaff = {this.state.startTimeForStaff}
              endTimeForStaff ={this.state.endTimeForStaff}
              />
 

            </CardBody>

            </Card>
            </Col>

            <Col lg="6" md="6" sm="12" className="mb-4">

             <Card small>
             <CardHeader  className="border-bottom">
             <h6  className="m-0">Total Hours Per Task</h6>
             <div className="block-handle" />
             <label style={{marginRight : "10px"}} >
                    <input style={{marginRight : "10px"}}  type="checkbox" onChange={this.handleuseRangeForSubTask} />
                    Select Time Period
                  </label>
                  { this.state.useRangeForSubTask  
                    ? <span style={{marginRight : "10px"}}>
                      <DatePicker
                        selected={this.state.startTimeForSubTask}
                        onChange={this.handleStartDateChangeForSubTask}
                      />
                      </span>
                    : null
                }
                  
                  { this.state.useRangeForSubTask 
                    ? <span style={{marginRight : "10px"}}>
                      <DatePicker
                        selected={this.state.endTimeForSubTask}
                        onChange={this.handleEndDateChangeForSubTask}
                      />
                      </span>
                    : null
                }
                  
                  { !this.state.useRangeForSubTask  
                    ? <select 
                      style={{
                        backgroundColor: "white", 
                        color:"#008CBA",
                        borderRadius: '3px',
                        padding: '3px',
                        border: '2px solid #008CBA',
                        marginLeft : "10px"
    
                        }} 
                        value={this.state.timeIntervalForSubTask} onChange={this.changeDropdownValueForSubTask}>
                        {/* <option value='2021-10-7'>Today</option>
                        <option value='2021-09-30'>Last Week</option>
                        <option value='2021-09-7'>Last Month</option>
                        <option value='2020-10-7'>Last Year</option> */}
                        {this.createSelectItems()}
                      </select>
                    : null
                }
             
             </CardHeader>

             <CardBody className="p-0">

               <ProjectSubTask 
               timeIntervalForSubTask={this.state.timeIntervalForSubTask}
                sn={this.state.SNid}
                useRangeForSubTask = {this.state.useRangeForSubTask} 
                startTimeForSubTask = {this.state.startTimeForSubTask}
                endTimeForSubTask ={this.state.endTimeForSubTask}
                />


            </CardBody>

             </Card>
             </Col>
        
        </Row>

         {/* <Row>
        <Col lg="12" md="6" sm="12" className="mb-4">

           <Card small>
            <CardHeader className="border-bottom">
              <h6 className="m-0">Wind Speed Against Output Power</h6>
              <div className="block-handle" />
            </CardHeader>

            <CardBody className="p-0">
              <WindSpeedcanvas/>

            </CardBody>

          </Card>
        </Col>
      </Row> */}
      
    </Container>

    );
}


};




export default CeoDashboard;
