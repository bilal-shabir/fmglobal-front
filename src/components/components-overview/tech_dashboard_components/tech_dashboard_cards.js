import React, { Component } from "react";
// import weathericon from '../../../images/cloudy.png'
import WeatherStatus from "./weather_status";
import { Card,
    CardHeader,
    CardBody,
    Container, Row, Col
  } from "shards-react";

import '../../../assets/style.css'


class TechCards extends Component {
    constructor(props) {
        super(props);
    this.state={
        total_production : (this.props.total_production/1000).toFixed(),
        total_projects: this.props.total_projects,
        total_invertors: this.props.total_invertors,
        total_invertors_online: this.props.total_invertors_online,
        utilization: this.props.utilization,
        current_power: this.props.current_power,
        offline_projects: this.props.offline_projects
    }
    }
    render(){
        return(
            <Row style={{marginTop:'20px'}}>
                <Col lg="3"  md="12" sm="12">
                    <WeatherStatus></WeatherStatus>
                </Col>
                <Col lg="2" md="12" sm="12" className="mb-4" >
                      {/* <p className="m-0 text-center cardtxt" >Total Power Generated</p> */}
                        <Card small >
                            <div className="p-0" style={{backgroundColor:'white', borderRadius:'0', border:'1px solid #cfd1d4'}}>
                                <div className="ml-auto text-center text-bold" style={{marginTop:'8px'}}  >
                                    <p style={{color:'#BDAC37'}} className="techcardheading">Power</p>
                                </div>
                                <div style={{textAlign:'center'}}>
                                    <h2 style={{fontWeight:'500', color:'black'}} className="techcardmaintext">{this.state.current_power}</h2>
                                </div>
                                <div style={{textAlign:'center'}}>
                                    <p style={{color:'black'}} className="techcardtext">Utilization - {this.state.utilization}%</p>
                                </div>
                              <div className="text-center text-bold" style={{backgroundColor:'#F5F6F8',width:'97%', marginLeft:'1.5%', marginBottom:'3px'}}>
                                <span style={{fontSize:'17px', color:'black'}}>kW</span>
                              </div>
                            
                            </div>
                            
                        </Card> 
                        
                </Col>
                <Col lg="2" md="12" sm="12" className="mb-4" >
                    {/* <p className="m-0 text-center cardtxt" >Total Power Generated</p> */}
                    <Card small >
                        <div className="p-0" style={{backgroundColor:'white', borderRadius:'0', border:'1px solid #cfd1d4'}}>
                            <div className="ml-auto text-center text-bold" style={{marginTop:'8px'}}  >
                                <p style={{color:'#BDAC37'}} className="techcardheading">Projects</p>
                            </div>
                            <div style={{textAlign:'center'}}>
                                <h2 style={{fontWeight:'500', color:'black'}} className="techcardmaintext">{this.state.total_projects-this.state.offline_projects}/{this.state.total_projects}</h2>
                            </div>
                            <div style={{textAlign:'center'}}>
                                <p style={{color:'black'}}>&nbsp; </p>
                            </div>
                            <div className="text-center text-bold" style={{backgroundColor:'#F5F6F8',width:'97%', marginLeft:'1.5%', marginBottom:'3px'}}>
                            <span style={{fontSize:'17px', color:'black'}}>Online</span>
                            </div>
                        
                        </div>
                        
                    </Card> 
                    
                </Col>
                <Col lg="2" md="12" sm="12" className="mb-4" >
                    {/* <p className="m-0 text-center cardtxt" >Total Power Generated</p> */}
                    <Card small >
                        <div className="p-0" style={{backgroundColor:'white', borderRadius:'0', border:'1px solid #cfd1d4'}}>
                            <div className="ml-auto text-center text-bold" style={{marginTop:'8px'}}  >
                                <p style={{color:'#BDAC37'}} className="techcardheading">Invertors</p>
                            </div>
                            <div style={{textAlign:'center'}}>
                                <h2 style={{fontWeight:'500', color:'black'}} className="techcardmaintext">{this.state.total_invertors_online}/{this.state.total_invertors}</h2>
                            </div>
                            <div style={{textAlign:'center'}}>
                                <p style={{color:'black'}}>&nbsp;</p>
                            </div>
                            <div className="text-center text-bold" style={{backgroundColor:'#F5F6F8',width:'97%', marginLeft:'1.5%', marginBottom:'3px'}}>
                            <span style={{fontSize:'17px', color:'black'}}>Online</span>
                            </div>
                        
                        </div>
                        
                    </Card> 
                    
                </Col>
                <Col lg="2" md="12" sm="12" className="mb-4" >
                    {/* <p className="m-0 text-center cardtxt" >Total Power Generated</p> */}
                    <Card small >
                        <div className="p-0" style={{backgroundColor:'white', borderRadius:'0', border:'1px solid #cfd1d4'}}>
                            <div className="ml-auto text-center text-bold" style={{marginTop:'8px'}}  >
                                <p style={{color:'#BDAC37'}} className="techcardheading">Total Production</p>
                            </div>
                            <div style={{textAlign:'center'}}>
                                <h2 style={{fontWeight:'500', color:'black'}} className="techcardmaintext">{this.state.total_production}</h2>
                            </div>
                            <div style={{textAlign:'center'}}>
                                <p style={{color:'black'}}>&nbsp;</p>
                            </div>
                            <div className="text-center text-bold" style={{backgroundColor:'#F5F6F8',width:'97%', marginLeft:'1.5%', marginBottom:'3px'}}>
                            <span style={{fontSize:'17px', color:'black'}}>MWh</span>
                            </div>
                        
                        </div>
                        
                    </Card> 
                    
                </Col>
                
            </Row>
        )
    }
}
export default TechCards