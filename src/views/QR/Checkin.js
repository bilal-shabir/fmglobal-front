import { FormInput,Col, Container, Row,Card,CardBody } from "shards-react";
import { Modal, Button } from "react-bootstrap";
import PageTitle from "../../components/common/PageTitle";
import {URL2, DKEY} from '../../constants';
import Form from "react-bootstrap/Form";
import Cookies from "universal-cookie";
import { ItemDescription } from "semantic-ui-react";
import React, { Component,useState }  from "react";
import { render } from "react-dom";
import { QrReader } from 'react-qr-reader';

let controller
class QR_checkin extends React.Component{
    constructor(props){
        super(props);

        const userIs_logged=localStorage.getItem('is_logged');
      const userEmail=localStorage.getItem('Email');
      const userToken=localStorage.getItem('Password');
      console.log(userEmail)
      console.log(userEmail)


      if(userIs_logged != 1){
        this.props.history.push("/login");
      }
    
        this.state = {

            isloaded:true,
            QR_data:[],
            delay: 4000,
            result: "No Data Captured",
            Location_Data:[],
            contact_name:[],
            task_type:false,
            checkin_button_disabled:true,
            checkout_button_disabled:true,
            check_in_latitude:null,
            check_in_longitude:null,
            Time_sheet:[],
            QR_URL:[]

          };

        
    }
    
    componentWillUnmount(){
      
      if(controller){
        controller.abort();
    }
    }


    handleScan = data => {

        console.log("data",data)
          if (data) {
            this.setState({
              result: data,
            });
            console.log("result data", this.state.result)
            this.setState({
              contact_name: this.state.result.text,
              QR_data:this.convertURL(),
              checkin_button_disabled:false
            });
            console.log("Contact Name", this.state.contact_name)
            console.log("QR_data", this.state.QR_data)
            this.check_task_type()
    
          }
  

      };
      handleError = err => {
        console.error(err);
      };

      convertURL(){

          let QR_Code_URL= new URL("http://"+JSON.stringify(this.state.result.text))
          console.log("QR_Code_URL" , QR_Code_URL)
          const decodedURI= decodeURI(QR_Code_URL);
          console.log("decodedURL" , decodedURI)
  
          var pathname = new URL(decodedURI).pathname;
  
          console.log("path name",pathname);
  

           var fixURL= pathname.replace(/%20/g,' ');
           var FinalURL= fixURL.replace(/%22/g,' ');
           console.log("fix URL",FinalURL)
  
  
           let splitUrl = FinalURL.split("/");
           
           console.log("spilit",splitUrl)
  
  
      return(splitUrl);

    }

    check_out= async(event)=>{
      controller = new AbortController();
      const signal = controller.signal;
         

        if(this.state.Time_sheet.length>0){
          const Response =  await fetch(URL2 + 'QR_TimeSheet/CheckOut/',{
           headers: {
             "Content-Type": "application/json",
             Accept: "application/json"
           },
           credentials: 'include',
           method: "POST",
           signal,
           body:JSON.stringify({ 
            "check_out_latitude":this.state.check_in_latitude,
            "check_out_longitude":this.state.check_in_longitude,
            // "travelTocompanyId":this.state.Time_sheet.company_id_xero,
            // "travelToProjectId":this.state.Time_sheet.project_id,
            // "travelToProjectName":this.state.Time_sheet.project_name,
            // "travelToTaskId":this.state.Time_sheet.task_id,
            // "travelToTaskName":this.state.Time_sheet.task_name,
            // "travelToDescription":this.state.Time_sheet.description_name,
            // "travelToDescriptionid":this.state.Time_sheet.discription_id,
            })

       
         });
         const json = await Response.json();
         console.log(json)
  

  
        }


    }


     check_in= async (event)=>{
      controller = new AbortController();
      const signal = controller.signal;

      const response = await fetch(URL2 + 'QR_TimeSheet/CheckIn/',{
         headers: {
           "Content-Type": "application/json",
           Accept: "application/json"
         },
         credentials: 'include',
         method: "POST",
         signal,
         body:JSON.stringify({ 
          "company_id_xero":this.state.QR_data[2],
          "contact_id":this.state.QR_data[3],
          "contact_name":this.state.QR_data[4],
          "project_id":this.state.QR_data[5],
          "project_name":this.state.QR_data[6],
          "task_id":this.state.QR_data[7],
          "task_name":this.state.QR_data[8],
          "discription_id":this.state.QR_data[9],
          "description_name":this.state.QR_data[10],
          "travel":this.state.task_type,
          "check_in_latitude":this.state.check_in_latitude,
          "check_in_longitude":this.state.check_in_longitude,

          })
       })
       const json = await response.json();
       console.log(this.state.QR_data)


    }



      getLocation = () => {
        let x= null;
        let y= null;
        navigator.geolocation.getCurrentPosition(this.getCoordinates);
      }
      getCoordinates = (position)=>{
        console.log("here",position)
        this.setState({ 
          check_in_latitude: position.coords.latitude, 
          check_in_longitude: position.coords.longitude
          })
      } 

      getTimeSheet = async()=>{
        controller = new AbortController();
        const signal = controller.signal;
        const access_token = localStorage.getItem('access_token');
        const response =  await fetch(URL2 + "QR_TimeSheet/get_qr_report_active", {
          headers: {
            "Content-Type": "application/json",
            'Accept': "application/json",
            'access_token' : access_token
          },
          credentials: 'include',
          method: "GET",
          signal,
    
        });
        const Time_Sheet = await response.json();
        console.log("Response",Time_Sheet)
        if(Time_Sheet.length>0)
        {
          this.setState({ 
            checkout_button_disabled:false,
            Time_sheet:Time_Sheet
          })

        }
        

      } 
      Fetch_QR_URL = async()=>{
        const queryParams = new URLSearchParams(window.location.search);
        if(queryParams.get('p')){

          var QR_URL= window.location.href
          var subStr = QR_URL.substr(28);
          var fixURL= subStr.replace(/%20/g,' ');
          var FinalURL= fixURL.replace(/%22/g,' ');
          let splitUrl = FinalURL.split("/");
          console.log("Final URL",splitUrl)
          
          this.setState({ 
            checkin_button_disabled:false,
            QR_data:splitUrl

          })

        }


      }
      
      data_FROM_QR(){
        const QR_URL = window.location.href;
        console.log("current URL",QR_URL)


      }



             componentDidMount() {
              //require('../../utils').checkpermision('checkin/check-out')
              this.Fetch_QR_URL()
              //this.data_FROM_QR()
              

              this.getTimeSheet()
              let value = this.getLocation()
                console.log("value" , value)
              }

              check_task_type(){
                const task_type=this.state.QR_data[11]
                if(task_type == true){
                    this.setState({
                        task_type:true
                      });
                }

              }




    render(){
        console.log("location",this.props)
        console.log("QR URL",this.state.QR_URL)

        const task_type = this.state.QR_data[11]
        const Contact = this.state.QR_data[4]
        const project = this.state.QR_data[6]
        const task = this.state.QR_data[8]
        const description = this.state.QR_data[10]

        // console.log("Page URL",window.location.pathname)
        // console.log("check_in_latitude",this.state.check_in_latitude)
        // console.log("check_in_longtiude",this.state.check_in_longitude)
        // console.log("Data" , this.state.QR_data)
        // console.log("delay", this.state.delay)

        const previewStyle = {
            height: 300,
            width: 300,
        }


          
        return(
            
            <Container fluid className="main-content-container px-4">
                <Row noGutters className="page-header py-4">
                     <PageTitle title={"QR Check-In / Check-Out"}   className="text-sm-left mb-3" />
                </Row>

        <div>
        <QrReader
          scanDelay={this.state.delay}
          onError={this.handleError}
          onResult={this.handleScan}
          containerStyle={{ width: "20%" }}
        />
        </div>

        
                <Form  style={{margin:'3%'}}> 
                
                <Row>
                    <Col >
               
                    <Card>
                        <CardBody>
                        <Row>
                            <Col>
                            <div class="form-group">
                                    <label htmlFor="Contact">Contact</label>
                                    <FormInput
                                        value={Contact ? Contact : 'Contact'}
                                        disabled={true}
                                        id="Contact"
                                        defaultValue="Contact"
                                    />
                                </div>
                            </Col>
                            
                        </Row>
                        <Row>
                            <Col>
                            <div class="form-group">
                                    <label htmlFor="Project">Project</label>
                                    <FormInput
                                        value={project ? project : 'project'}
                                        disabled={true}
                                        id="Project"
                                        defaultValue="Project"
                                    />
                                </div>
                            </Col>
                            
                        </Row>

                        <Row>
                            <Col>
                            <div class="form-group">
                                    <label htmlFor="Task">Task</label>
                                    <FormInput
                                        value={task ? task : 'task'}
                                        disabled={true}
                                        id="Task"
                                        defaultValue="Task"
                                    />
                                </div>
                            </Col>
                            
                        </Row>
                        <Row>
                            <Col>
                                <div class="form-group">
                                    <label htmlFor="Desc">Description</label>
                                    <FormInput
                                        value={description ? description : 'Description'}
                                        disabled={true}
                                        id="Desc"
                                        defaultValue="Description"
                                    />
                                </div>
                            </Col>
                            
                        </Row>
                       
                        </CardBody>
                         <Row style={{marginBottom:'20px'}}>
                             <Col style={{marginLeft:'40%'}}>
                             <button  onClick={this.check_in()} disabled={this.state.checkin_button_disabled} id="Check-In">Check-In</button>
                             <button onClick={this.check_out()}disabled={this.state.checkout_button_disabled} style={{marginLeft:'10px'}} id="Check-Out">Check-Out</button>
                             </Col>

                        

                         </Row>


                    </Card>
                       
      
                    </Col>
                </Row>
                
                </Form> 
            </Container>   
        );
    }
}
export default QR_checkin;