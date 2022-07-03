import React from "react";
import PropTypes from "prop-types";
import {Card,
  CardHeader,
  CardBody,
  ListGroup,
  ListGroupItem,
  CardFooter,
  Row,
  Col,
  Container} from "shards-react";
import {Link,useRouteMatch,} from "react-router-dom";
import CurrentB from "../components/components-overview/CurrentB";
import PageTitle from "../components/common/PageTitle";
import {URL,DKEY} from '../constants';
import co2svg from '../images/co2.svg';
import dollarpng from '../images/dollar.png';
import savingpng from '../images/saving.png';
import treepng from '../images/trees.png';
import carpng from '../images/car.png';
import travelpng from '../images/travel.png';
import energy from '../images/energy.svg';
import '../assets/style.css';
import Cookies from "universal-cookie";
import L from "../components/components-overview/loader";
import { Loader } from 'semantic-ui-react'
import MonthlyPower from "../components/components-overview/MonthlyPower";
import icon from '../images/battery.png';
import CurrentBattery from "../components/components-overview/CurrentBattery";
import Echart2 from "../components/components-overview/chart2";
import Echart3 from "../components/components-overview/chart3";
import renewableenergy from '../images/renewable-energy.png';
//import CurrentPower from "../components/components-overview/CurrentP";
import CurrentPower from '../components/components-overview/CurrentPower';
// import Cookies from "universal-cookie";

class PowerSystemNew extends React.Component{

  constructor(props) {
    super(props);
    
    const userIs_logged=localStorage.getItem('is_logged');
    const admin=localStorage.getItem('admin');
    const UserId=localStorage.getItem('ID');
    const UserType=localStorage.getItem('UserType');

    if(userIs_logged != 1){
      this.props.history.push("/login");
    }
    

    this.state = {
      UserId,admin,UserType,
      isLoaded:false,
      tp:"",co2:"",
      items: [],
      id: null,
      power:"",
        battery:"",
        Monthly:"",
        LastTwoMonths:'',
        sum:[],
    }
  
  }

  async componentDidMount() {
    require('../utils').checkpermision('PowerSystem')
    this.getData();
    const {UserId,admin,UserType} = this.state
    const response =  await fetch(URL+'users/getProjects/'+UserType+'/'+UserId+'/'+admin+'/Turbin', {
        headers : { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
      })

      if(UserType == 'Customer' && admin == 0){
        const json = await response.json()
        const res = json.data.res
        const cal = json.data.cal
        //console.log(cal);
        let finalarray = [];
        for(let i = 0; i < res.length; i++) {
    
          for(let j = 0; j < res[i].length; j++) {
            
           // console.log(res[i][j]);
            finalarray.push(res[i][j]);

          }
        }
        this.setState({items:finalarray , tp:cal.P,co2:cal.CO2,tree:cal.Trees,car:cal.Car,Planes:cal.Planes, isLoaded: true})
      }else{

        const json = await response.json()
        const res = json.data.res
        const cal = json.data.cal
        //console.log(cal);
        this.setState({items:res , tp:cal.P,co2:cal.CO2,tree:cal.Trees,car:cal.Car,Planes:cal.Planes, isLoaded: true})
        this.setState({id: this.state.items[0].id})
        
      }
  }
  async getData() {
    const pid = this.state.id
    //console.log(pid);
    const response =  await fetch(URL+'users/getPowerDashboard/'+pid, {
        headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
        },
    })
    const json = await response.json()
    
    const CurrentPower = json.CurrentPower
    const CurrentBattery = json.CurrentBattery
    const TotalConsuptionPerMonth = json.TotalConsuptionPerMonth
    // const TotalConsuptionForTwoMonths = json.TotalConsuptionPerMonth.slice(json.TotalConsuptionPerMonth.length-2 , json.TotalConsuptionPerMonth.length)
    // console.table(TotalConsuptionPerMonth);
    //console.log(TotalConsuptionPerMonth);
    let sums = []
    //let monthly =[]
    var  months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    for (let row of TotalConsuptionPerMonth) {
        const {Month,Year,E_day} = row
        const d = new Date(Year,Month,'01');
        //console.log(d);
        const m = months[d.getMonth()-1];
        //console.log(m);
        // const date = year + "/" + month;
        const random = Math.round(E_day/1000);
        sums.push({x:m,y:random})
    }

   

    const TotalConsuptionForTwoMonths = sums.slice(sums.length-2 , sums.length)
    console.table(TotalConsuptionForTwoMonths);

    this.setState({
        power : CurrentPower,
        battery: CurrentBattery,
        Monthly:TotalConsuptionPerMonth,
        LastTwoMonths:TotalConsuptionForTwoMonths,
        isLoaded:true,
        sum:sums,
    })

    this.intervalID = setTimeout(this.getData.bind(this), 5000);
}
componentWillUnmount() {
    /*
      stop getData() from continuing to run even
      after unmounting this component. Notice we are calling
      'clearTimeout()` here rather than `clearInterval()` as
      in the previous example.
    */
    clearTimeout(this.intervalID);
  }

  render (){
    let items = this.state.items;

 
    const { tp,co2,tree,car,Planes,isLoaded } = this.state;
    return (
      <Container fluid className="main-content-container px-4" >
        {/* Page Header */}
        <Row noGutters className="page-header py-4">
        <PageTitle title={" Power Overview"}  subtitle="Overview" className="text-sm-left mb-3" />
        </Row>
        {isLoaded ? (<Container fluid className="main-content-container px-4" > 
             
        <Row style={{width:'100%', margin: '0 auto' }} >
            <Col lg="2" md="12" sm="12" className="mb-4" >
            
            <Card small>
                <CardHeader className="border-bottom">
                <h6 className="m-0 text-center">Total Production</h6>
                <div className="block-handle" />
                </CardHeader>
            
                <CardBody className="p-0">
                
                    <div style={{margin: "auto",width: "45%",paddingTop: "15px",alignContent:"center",alignItems:"center"}}>
                    <img id="my-svg"  src={energy} width={'100%'}></img>
                    </div>
                    <span className="ml-auto text-center text-bold" style={{fontSize:"16px",fontWeight:"bolder"}}>
                    <p><br />{tp.toFixed(1)}<br /> KWh</p>
                    </span>
                
                </CardBody>
            </Card> 
            
            </Col>

            <Col lg="2" md="12" sm="12" className="mb-4">
            
            <Card small>
                <CardHeader className="border-bottom">
                <h6 className="m-0 text-center">CO2 Savings</h6>
                <div className="block-handle" />
                </CardHeader>
            
                <CardBody className="p-0">
                
                    <div style={{margin: "auto",width: "45%",paddingTop: "15px",alignContent:"center",alignItems:"center"}}>
                    <img id="my-svg"  src={co2svg} width={'100%'}></img>
                    </div>
                    <span className="ml-auto text-center text-bold" style={{fontSize:"16px",fontWeight:"bolder"}}>
                    <p><br />{co2.toFixed(1)}<br /> Kg</p>
                    </span>
            

                </CardBody>
            </Card> 
            
            </Col>


            <Col lg="2" md="12" sm="12" className="mb-4">
            
            <Card small>
                <CardHeader className="border-bottom">
                <h6 className="m-0 text-center">Trees Seedlings</h6>
                <div className="block-handle" />
                </CardHeader>
            
                <CardBody className="p-0">
                
                    <div style={{margin: "auto",width: "45%",paddingTop: "15px",alignContent:"center",alignItems:"center"}}>
                    <img id="my-svg" src={treepng} width={'100%'}></img>
                    </div>
                    <span className="ml-auto text-center text-bold" style={{fontSize:"16px",fontWeight:"bolder"}}>
                    <p><br />{Math.round(tree)} <br />Trees</p>
                    </span>
            

                </CardBody>
            </Card> 
            
            </Col>

            <Col lg="2" md="12" sm="12" className="mb-4">
            
            <Card small>
                <CardHeader className="border-bottom">
                <h6 className="m-0 text-center">Cars</h6>
                <div className="block-handle" />
                </CardHeader>
            
                <CardBody className="p-0">
                
                    <div style={{margin: "auto",width: "45%",paddingTop: "15px",alignContent:"center",alignItems:"center"}}>
                    <img id="my-svg"  src={carpng} width={'100%'}></img>
                    </div>
                    <span className="ml-auto text-center text-bold" style={{fontSize:"16px",fontWeight:"bolder"}}>
                    <p> <br />{car.toFixed(1)} <br />Kilometres</p>
                    </span>
            

                </CardBody>
            </Card> 
            
            </Col>

            <Col lg="2" md="12" sm="12" className="mb-4">
            
            <Card small>
                <CardHeader className="border-bottom">
                <h6 className="m-0 text-center">Planes</h6>
                <div className="block-handle" />
                </CardHeader>
            
                <CardBody className="p-0">
                
                    <div style={{margin: "auto",width: "45%",paddingTop: "15px",alignContent:"center",alignItems:"center"}}>
                    <img id="my-svg"  src={travelpng} width={'100%'}></img>
                    </div>
                    <span className="ml-auto text-center text-bold" style={{fontSize:"16px",fontWeight:"bolder"}}>
                    <p> <br />{ Planes.toFixed(1)} <br />Kilometres</p>
                    </span>
            

                </CardBody>
            </Card> 
            
            </Col>
            <Col lg="2" md="12" sm="12" className="mb-4">
            
            <Card small>
                <CardHeader className="border-bottom">
                <h6 className="m-0 text-center">Total Savings</h6>
                <div className="block-handle" />
                </CardHeader>
            
                <CardBody className="p-0">
                
                    <div style={{margin: "auto",width: "45%",paddingTop: "15px",alignContent:"center",alignItems:"center"}}>
                    <img id="my-svg"  src={savingpng} width={'100%'}></img>
                    </div>
                    <span className="ml-auto text-center text-bold" style={{fontSize:"16px",fontWeight:"bolder"}}>
                    <p> <br />{ Planes.toFixed(1)} <br />BHD</p>
                    </span>
            

                </CardBody>
            </Card> 
            
            </Col>
        </Row>
        
        <Row style={{marginTop: '2%'}}>
            <Col lg="4" md="6" sm="6" className="col-lg mb-5">
                <Card small>
                    <CardHeader className="border-bottom">
                        <h6 className="m-0">Current Production</h6>
                        <div className="block-handle" />
                        </CardHeader>
                    
                        <CardBody className="p-0">
                                <div style={{margin: "auto",width: "50%",padding: "10px",alignContent:"center",alignItems:"center",marginTop: "1.75rem"}}>
                                    <img id="my-svg" alt=""  src={renewableenergy} style={{ maxWidth: "100%"}}/>
                                </div>
                                <span className="ml-auto text-center text-bold" style={{fontSize:"16px",fontWeight:"bolder"}}>
                                    <p>{ Math.round(this.state.power)} W</p>
                                </span>  
                        </CardBody>

                </Card>
            </Col>

            <Col  lg="4" md="6" sm="6" className="col-lg mb-5">
                <Card small>
                <CardHeader className="border-bottom">
                    <h6 className="m-0">Current Battery</h6>
                    <div className="block-handle" />
                </CardHeader>
            
                    <CardBody className="p-0">
                        {/* <div style={{margin: "auto",width: "35%",padding: "10px",alignContent:"center",alignItems:"center",marginTop: "1.75rem"}}>
                            <img id="my-icon"  src={icon} style={{ maxWidth: "100%"}}/>
                        </div> */}
                        
                        {/* <div style={{margin: "auto",width: "50%",padding: "10px",alignContent:"center",alignItems:"center",marginTop: "1.75rem"}}>
                                    <img id="my-svg"   src={energy} style={{ maxWidth: "100%"}}/>
                        </div> */}
                        
                        {/* <span className="ml-auto text-center text-bold" style={{fontSize:"16px",fontWeight:"bolder"}}>
                                   
                        </span>   */}
                        
                        {/* <CurrentBattery data={this.state.battery}/> */}
                        <CurrentB></CurrentB>
                        {/* <span className="ml-auto text-center text-bold" style={{fontSize:"16px",fontWeight:"bolder"}}>
                            <p>{this.state.battery} %</p>
                        </span>  */}
                    </CardBody>
                
                </Card>
            </Col>
            <Col lg="4" md="6" sm="12" className="col-lg mb-5">
            
                <Card small>
                    <CardHeader className="border-bottom">
                    <h6 className="m-0">Power Consumed for last two months(KWH)</h6>
                    <div className="block-handle" />
                    </CardHeader>
                
                    <CardBody className="p-0">
                        <Echart2></Echart2>
                    </CardBody>
                    
                </Card>
               
            </Col>
        </Row>
        <Row  >
            <Col  lg="12" md="6" sm="12" className="col-lg mb-5">
            
                <Card  small>
                    <CardHeader className="border-bottom">
                    <h6 className="m-0">Total Monthly Power (KWH)</h6>
                    <div className="block-handle" />
                    </CardHeader>
                
                    <CardBody className="p-0">
                        <Echart3></Echart3>
                    </CardBody>
                    
                </Card>
               
            </Col>
            
            
        </Row>
                
             
    </Container> ) : (<L></L>)}

    </Container>
      
    ); 
}
}

export default PowerSystemNew;

