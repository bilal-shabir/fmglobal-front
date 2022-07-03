import React from "react";
// import PropTypes from "prop-types";
import { Card,
  CardHeader,
  CardBody,
  Container, Row, Col, Form
}from "shards-react";
import {URL2,URL3} from '../constants';
import PageTitle from "../components/common/PageTitle";
//import energy from '../images/renewable-energy.png';
import CurrentB from "../components/components-overview/CurrentB";
import Echart3 from "../components/components-overview/chart3";
import Echart5 from "../components/components-overview/LiveProductionoverview";
// import icon from '../images/battery.png';
// import Cookies from "universal-cookie";
import '../assets/style.css';
import production from '../images/icons-26.png'
import L from "../components/components-overview/loader";
import Echart6 from "../components/components-overview/chart4";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


let controller


class PowerOverview extends React.Component{ 

    intervalID;
    ws =  new WebSocket(URL3);
    constructor(props) {
        super(props);
    
        const userIs_logged=localStorage.getItem('is_logged');
        if(userIs_logged != 1){
        this.props.history.push("/login");
        }

        const queryParams = new URLSearchParams(window.location.search);
        const name = queryParams.get('h');
        const pid = this.props.match.params.Id
        this.state = {
            id :pid,
            power:"",
            battery:"",
            Monthly:"",
            LastTwoMonths:'',
            sum:[],
            isLoaded:false,
            monthlyData: [],
            chartload: false,
            chartload2: false,
            production_value_fronius: [],
            production_value_sma: [],
            production_time: [],
            daily_data: null,
            live_battery: 0,
            live_production: 0,
            project_name: name,
            last_updated: null,
            selected_month: null,
            month: null,
            selected_date: null,
            month_chart_heading: null

        }
        this.handler = this.handler.bind(this);
    //
    }


  async componentDidMount() {
    
    controller = new AbortController();
    const signal = controller.signal;
     
    require('../utils').checkpermision('PowerSystem')
    const pid = this.state.id;
    const type = localStorage.getItem('Type');
    if(type=='customer'){
      this.setState({
        month_chart_heading: 'Year 2022'
      })
    }
    else{
      this.setState({
        month_chart_heading: 'Last 12 months'
      })
    }

    // await fetch(URL2+'project/getProject/'+pid,{
    //     headers : { 
    //       'Content-Type': 'application/json',
    //       'Accept': 'application/json',
    //       'access_token' : access_token
    //      },
    //      credentials: 'include'
    //   })
    //   .then(response => response.json())
    //   .then((json)=>{
    //    // console.log(json)
    //       this.setState({
    //           monthlyData: json,
              
    //       })
    //       //console.log(this.state.monthlyData)   
    //   })
      const date = new Date
      const year = date.getFullYear()
      const month = date.getMonth()+1
      const d = year + '-' + this.addZero(month)
      
      await fetch(URL2+'project/getWeeklyData',{
        headers : { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',

         },
         credentials: 'include',
         method: 'PATCH',
         mode: 'cors',
         signal,
         body: JSON.stringify({project_id: pid, date: d})
      })
      .then(response => response.json())
      .then((json)=>{
        if (json.statusCode == 404 || json.status==404 || json.statusCode == 500 || json.statusCode == 403 || json.statusCode == 400) {
          throw Error(json.statusText)        
      }
      else{
        //console.log('asd')
        //console.log(json)
        this.setState({
          selected_date: d,
          daily_data : json,
          selected_month : date.toLocaleString('en-us', { month: 'long' }),
          // chartload2: true
          
        })

  }})
  .catch((e) => {
    // console.log(e)  
    toast.error('Error: Weekly data not fetched', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        });
  });
      
      fetch(URL2+'project/get_current', {
        headers : { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
         },
         credentials: 'include',
        method: 'PATCH',
        mode: 'cors',
        signal,
        body: JSON.stringify({ project_id: this.state.id, n:7})
      }).then(response => response.json()).
      then((json)=>{
        if (json.statusCode == 404 || json.status==404 || json.statusCode == 500 || json.statusCode == 403 || json.statusCode == 400) {
          throw Error(json.statusText)        
      }
      else{

      
        if(json.production.time.length != 0){
          var production1 = []
              for (let index = 0; index < json.production.time.length; index++) {
                let obj = {
                  'time': json.production.time[index],
                  'sma' : json.production.sma[index],
                  'fronius': json.production.fronius[index]
                }
                production1.push(obj)
                
              }
              // console.log(production1)
                const uniqueValuesSet = new Set();

            // array of objects with duplicate values

            const production = production1.filter((obj) => {
              // check if name property value is already in the set
              const isPresentInSet = uniqueValuesSet.has(obj.time);

              // add name property value to Set
              uniqueValuesSet.add(obj.time);

              // return the negated value of
              // isPresentInSet variable
              return !isPresentInSet;
            });
            // console.log(production)
          var time= []
          var value_sma=[]
          var value_fronius=[]
        
          for (let index = 0; index < production.length; index++) {
            if(production[index].sma){
              value_sma.push(production[index].sma/1000)
            }
            else{
              value_sma.push(production[index].sma)
            }
            if(production[index].fronius){
              value_fronius.push(production[index].fronius/1000)
            }
            else{
              value_fronius.push(production[index].fronius)
            }
            time.push(this.abc(production[index].time))
          }
          // console.log(time)
          // console.log(value_sma)
          // console.log(value_fronius)
          var date = Date.parse(production[0].time);
          var date1 = new Date(date);
          const day = date1.getDate()
          const month = date1.toLocaleString('en-us', { month: 'short' }); 
          var last_updated = day + " " +month +", " +time[0]
          if(json.battery.length != 0){
            var bat = json.battery[0].value
          }
          else{
              var bat = 0
          }
          if(value_fronius[0]){
            var pro= value_fronius[0]
          }
          else if(value_sma[0]){
            var pro= value_sma[0]
          }
          else{
            var pro = 0
          }
          // console.log(time)
          // console.log(value_fronius)
          // console.log(value_sma)
          this.setState({
            production_value_fronius : value_fronius,
            production_value_sma: value_sma,
            production_time: time,
            last_updated: last_updated,
            live_battery: bat,
            live_production: pro.toFixed(3),
            chartload: true,
            isLoaded:true,
            chartload2: true,
          })
        }
        else{
          var date1 = new Date
          const day = date1.getDate()
          const month = date1.toLocaleString('en-us', { month: 'short' }); 
          var last_updated = day + " " +month +", " + this.addZero(date1.getHours()) + ":00"

          this.setState({
            last_updated:last_updated,
            chartload: true,
            isLoaded:true,
            chartload2: true,
          })
        }
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

  this.ws.onopen = () =>  {
      //console.log('connected')
      this.ws.send(
          JSON.stringify({
            event: 'project/register',
            data: {project_id: this.state.id, number_of_records: 7},
          }),
        );
      }
  this.ws.onmessage =  event =>  {
      const json = JSON.parse(event.data);
      if(json.production && json.event == 'project/project_graph'){
        this.setState({
          isLoaded: false
        })
        var time= this.state.production_time
        var value=this.state.production_value
        if(time.at(-1) != this.abc(json.production.time)){
      // const uniqueValuesSet = new Set();

      // const production = json.production.filter((obj) => {
      //   // check if time property value is already in the set
      //   const isPresentInSet = uniqueValuesSet.has(obj.time);

      //   // add time property value to Set
      //   uniqueValuesSet.add(obj.time);

      //   // return the negated value of
      //   // isPresentInSet variable
      //   return !isPresentInSet;
      // });
     
      // for (let index = 0; index < production.length; index++) {
        
      //   time.push(this.abc(production[index].time))
      //   value.push(production[index].value/1000)
      // }
      // alert('hello')
      // console.log(time)
      // console.log(value)
      //console.log('new value: '+ json.production.value)
      //console.log('new time: '+ json.production.time)
      time.shift()
      value.shift()
      //console.log('shifted')
      //console.log(value)
      //console.log( time)
      value.push(json.production.value/1000)
      time.push(this.abc(json.production.time))
      //console.log('updated:')
      //console.log(value)
      //console.log(time)
      const date = new Date
        const day = date.getDate()
        const month = date.toLocaleString('en-us', { month: 'short' }); 
        const last_updated = month + " " + day+", " +this.abc(json.production.time)
      this.setState({
        live_production: (json.production.value/1000).toFixed(3),
        production_value: value,
        production_time: time,
        last_updated: last_updated,
        isLoaded: true
      })
        
      }
      else{
        this.setState({
          isLoaded: true
        })
      }
    }
    if(json.battery && json.event == 'project/project_battery_power'){
      this.setState({
        live_battery: json.battery.value
        
      })
    }
      
}

   
  }

  addZero(i) {
    if (i < 10) {i = "0" + i}
    return i;
  }
  closeConnection(){
    if(controller){
      controller.abort();
  }
  }
  handler(e){
    this.closeConnection()
    var time = Date.parse(e.target.value);
    var date1 = new Date(time);
  
    controller = new AbortController();
    const signal = controller.signal;
    
    this.setState({
      chartload2: false,
      month: date1.getMonth()
    })
    const pid = this.state.id;

     fetch(URL2+'project/getWeeklyData',{
        headers : { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
      
         },
         credentials: 'include',
         method: 'PATCH',
         mode: 'cors',
         signal,
         body: JSON.stringify({project_id: pid, date: e.target.value})
      })
      .then(response => response.json())
      .then((json)=>{
        if (json.statusCode == 404 || json.status==404 || json.statusCode == 500 || json.statusCode == 403|| json.statusCode == 400 ) {
          throw Error(json.statusText)        
      }
      else{
        // console.log(json)
        var  months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        this.setState({
          daily_data : json,
          selected_month : months[this.state.month],
          chartload2: true
        })
        // alert(this.state.selected_month)
        
  }})
  .catch((e) => {
    // console.log(e)  
    toast.error('Error: Weekly data not fetched', {
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
  abc (date)
{
  var time = Date.parse(date);
  var date1 = new Date(time);

  
 let h =this.addZero(date1.getHours())
 let m =this.addZero(date1.getMinutes())
  
  let time1 = h + ":" + m
  return time1

}
addZero(i) {
  if (i < 10) {i = "0" + i}
  return i;
}

  componentWillUnmount() {
    /*
      stop getData() from continuing to run even
      after unmounting this component. Notice we are calling
      'clearTimeout()` here rather than `clearInterval()` as
      in the previous example.
    */
      if(controller){
        controller.abort();
    }
    clearTimeout(this.intervalID);
    this.ws.close()
  }


 render(){
    const { isLoaded} = this.state
  return (
    <Container fluid className="main-content-container px-4">
      {/* Page Header */}
        <Row noGutters className="page-header py-4">
            <PageTitle title={`O&M Power Dashboard / `+this.state.project_name}  className="text-sm-left" /> 
            
        </Row>
        <Row noGutters className="page-header">
          <Col sm={12} className="text-sm-left text-center text-md-left mb-sm-0 col-12 col-sm-4 mb-5">
          <span className="text-semibold">
              <i class="material-icons">update</i> {this.state.last_updated}
        </span>
          </Col>
       
        </Row>
        

        {isLoaded ? (<Container fluid className="main-content-container px-4">
        
        <Row style={{marginTop: '2%'}}>
            <Col lg="4" md="12" sm="12" className="col-lg mb-5">
                <Card small>
                    <CardHeader className="border-bottom d-flex">
                        {/* <h6 className="m-0">Current Production <span style={{fontSize:11, color:'d9d9d9',marginLeft:'10px'}}><i class="material-icons">update</i> {this.state.last_updated}</span></h6> */}
                        
                             <h6 className="text-semibold text-fiord-blue">Latest Production</h6>
                             <span className="ml-auto text-right text-semibold text-reagent-gray">
                             <i class="material-icons">update</i> {this.state.last_updated}
                             </span>
                        
                     
                        <div className="block-handle" />
                        </CardHeader>
                    
                        <CardBody className="p-0">
                                <div style={{margin: "auto",width: "240px",padding: "15px",alignContent:"center",alignItems:"center",marginTop: "1.75rem"}}>
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
                        <div className={"hourlypowerchart1"}>
                        {this.state.chartload ?  (<Echart5 time={this.state.production_time} value_sma={this.state.production_value_sma} value_fronius={this.state.production_value_fronius}></Echart5> ): <L></L>}
                        </div>
                    </CardBody>
                    
                </Card>
               
            </Col>

            <Col  lg="4" md="12" sm="12" className="col-lg mb-5">
                <Card small>
                <CardHeader className="border-bottom d-flex">
                  <h6 className="text-semibold text-fiord-blue">Battery</h6>
                  <span className="ml-auto text-right text-semibold text-reagent-gray">
                  <i class="material-icons">update</i> {this.state.last_updated}
                  </span>
                      <div className="block-handle" />
                </CardHeader>
            
                    <CardBody className="p-0">
                    {this.state.chartload ?(<CurrentB value={this.state.live_battery}></CurrentB>): <L></L>}
                    </CardBody>
                
                </Card>
            </Col>
            
        </Row>
        <Row  >
            <Col  lg="12" md="12" sm="12" className="col-lg mb-5">
            
                <Card  small>
                    <CardHeader className="border-bottom">
                    <h6 className="m-0">Daily Power Generated (kWh)  <span style={{fontSize:'15px', color:'#c9c9c9'}}><i class="material-icons">update</i> {this.state.last_updated}</span> </h6>
                    <div className="block-handle" />
                    </CardHeader>
                    <Form style={{padding:'5px'}}>
                    <div class="form-group" style={{display:"flex"}}>
                        <label for="exampleInputPassword1" style={{marginTop:'2px'}}>Select Month: </label>
                        <input type="month" class="form-control"  defaultValue={this.state.selected_date} style={{width:'250px',marginLeft:'5px'}}  onChange={this.handler}></input>
                    </div>
                    </Form>
                    <CardBody className="p-0">
                        
                        {this.state.chartload2 && this.state.daily_data ? (<Echart6 data={this.state.daily_data}></Echart6>): <L></L>}
                        
                    </CardBody>
                    
                </Card>
               
            </Col>
            
            
        </Row>
        
        <Row  >
            <Col  lg="12" md="12" sm="12" className="col-lg mb-5">
            
                <Card  small>
                    <CardHeader className="border-bottom">
                    <h6 className="m-0">Total Monthly Power (kWh)  <span style={{fontSize:'13px', color:'#c9c9c9'}}>{this.state.month_chart_heading}</span></h6>
                    <div className="block-handle" />
                    </CardHeader>
                
                    <CardBody className="p-0">
                        {this.state.chartload ? (<Echart3 id={ this.state.id}></Echart3>): <L></L>}
                        
                    </CardBody>
                    
                </Card>
               
            </Col>
            
            
        </Row>
       
  
        </Container>):(<L></L>)}
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
export default PowerOverview;