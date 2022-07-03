import React from "react";
import PropTypes from "prop-types";
import {Link} from 'react-router-dom';
import { Card,
  CardHeader,
  CardBody,
  ListGroup,
  ListGroupItem,
  CardFooter,
  FormSelect, Container, Row, Col } from "shards-react";

import PageTitle from "../components/common/PageTitle";
import FishNo from "../components/components-overview/FishNo";
import Fish from "../components/components-overview/Fish";
import {URL,DKEY} from '../constants';
import fish from '../images/Tilapia.png';
import Cookies from 'universal-cookie';
import L from "../components/components-overview/loader";



class FishFarmSystem extends React.Component{

  constructor(props) {
        super(props);
        const userIs_logged=localStorage.getItem('is_logged');
        const UserId=localStorage.getItem('ID');
        const admin=localStorage.getItem('admin');
        const UserType=localStorage.getItem('UserType');

        if(userIs_logged != 1){
        this.props.history.push("/login");
        }

        this.state = {
          TP: '',
          HUM: '',
          UserId,admin,UserType,
          items:[],
          isLoaded: false,
        }
    }

    async componentDidMount() {

      require('../utils').checkpermision('FishFarmSystem')

      const {UserId,admin,UserType} = this.state
      await fetch(URL+'users/getFishTemp_Hum',{
          headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
        })
        
        .then(res => res.json())
        .then(result => {
          if(result.status=='success'){
           // console.log(result);
            this.setState({
              isLoaded: true,
              TP: result.data.TP,
              HUM: result.data.HUM,
            });
            //console.log(result.data.TP);
          }
          else if(result.status=='failed'){
            this.setState({
              isLoaded: false
              })     
          }
        });

        const response = await fetch(URL+'users/getProjects/'+UserType+'/'+UserId+'/'+admin+'/Fish', {
            headers : { 
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
          })
          const json = await response.json()
          const res = json.data.res
          this.setState({items:res ,isLoaded: true})
    }
 

  render() {
    const { TP,HUM, isLoaded} = this.state;
    let items = this.state.items;
  
    return(
      
      <Container fluid className="main-content-container px-4">
        <Row noGutters className="page-header py-4">
          <PageTitle title="Fish Farm" subtitle="Dashboard" className="text-sm-left mb-3" />
        </Row>
        
        {isLoaded ? (<Container fluid className="main-content-container px-4">
          
        <Row>

        <Col lg="4" md="6" sm="12" className="mb-4">
        {items.map(item => (
                    <Card small>
                        <CardHeader className="border-bottom">
                        <h6 className="m-0">{item.SystemName}</h6>
                        <div className="block-handle" />
                        </CardHeader>
                
                        <CardBody className="p-0">
                            <ListGroup small flush className="list-group-small">
                                <ListGroupItem className="d-flex px-3">
                                    <span className="text-semibold text-fiord-blue">System Location</span>
                                    <span className="ml-auto text-right text-semibold text-reagent-gray">
                                    {item.location}
                                    </span>
                                </ListGroupItem>
                            </ListGroup>

                            <ListGroup small flush className="list-group-small">
                                <ListGroupItem className="d-flex px-3">
                                    <span className="text-semibold text-fiord-blue">Serial Number</span>
                                    <span className="ml-auto text-right text-semibold text-reagent-gray">
                                    {item.SerialNO}
                                    </span>
                                </ListGroupItem>
                            </ListGroup>
                            <ListGroup small flush className="list-group-small">
                                <ListGroupItem className="d-flex px-3">
                                    <span className="text-semibold text-fiord-blue">Fish Type</span>
                                    <span className="ml-auto text-right text-semibold text-reagent-gray">
                                        Tilapia
                                    </span>
                                </ListGroupItem>
                            </ListGroup>

                            <ListGroup small flush className="list-group-small">
                                <ListGroupItem className="d-flex px-3">
                                    <span className="text-semibold text-fiord-blue">Report Date</span>
                                    <span className="ml-auto text-right text-semibold text-reagent-gray">
                                    24-Feb-2021
                                    </span>
                                </ListGroupItem>
                            </ListGroup>

                        </CardBody>
                            
                     </Card>
                    ))}
          </Col>

          <Col lg="4" md="6" sm="12" className="mb-4">
                <Card small>

                
                    <CardBody className="p-0">
                        <img 
                            className="rounded mx-auto d-block"
                                style={{ width: "50%" }}
                                Width={"70%"} 
                                src={fish}
                                alt="Tilapia Fish"
                        />
                    </CardBody>
                </Card>
          </Col>

          

          <Col lg="4" md="6" sm="12" className="mb-4">
            <Card small>
                <CardHeader className="border-bottom">
                <h6 className="m-2">Environment Summary</h6>
                <div className="block-handle" />
                </CardHeader>
            
                <CardBody className="p-0">
            
                    <ListGroup small flush className="list-group-small">
                        <ListGroupItem className="d-flex px-3">
                            <span className="text-semibold text-fiord-blue">Current Temperature</span>
                            <span className="ml-auto text-right text-semibold text-reagent-gray">
                        {TP} °C
                            </span>
                        </ListGroupItem>
                    </ListGroup>

                    <ListGroup small flush className="list-group-small">
                        <ListGroupItem className="d-flex px-3">
                            <span className="text-semibold text-fiord-blue">Current Humidity</span>
                            <span className="ml-auto text-right text-semibold text-reagent-gray">
                            {HUM} %
                            </span>
                        </ListGroupItem>
                    </ListGroup>

                    <ListGroup small flush className="list-group-small">
                        <ListGroupItem className="d-flex px-3">
                                <span className="text-semibold text-fiord-blue">Current Water Temperature</span>
                                <span className="ml-auto text-right text-semibold text-reagent-gray">
                                - °C
                                </span>
                        </ListGroupItem>
                    </ListGroup>

                    <ListGroup small flush className="list-group-small">
                        <ListGroupItem className="d-flex px-3">
                                <span className="text-semibold text-fiord-blue">Total Number of Fish</span>
                                <span className="ml-auto text-right text-semibold text-reagent-gray">
                                1320
                                </span>
                        </ListGroupItem>
                    </ListGroup>
        
                </CardBody>
                
            </Card>
    
          </Col>
    
        </Row>
    
        <Row>
          <Col lg="6" md="8" sm="12" className="mb-4">
              
              <Card small>
                <CardHeader className="border-bottom">
                  <h6 className="m-0">Fish Tank Overview</h6>
                  <div className="block-handle" />
                </CardHeader>
              
                <CardBody className="p-0">
                    <Fish/>
                </CardBody>
                
              </Card>
          </Col>

          <Col lg="6" md="8" sm="12" className="mb-4">
            <Card small>
                    <CardHeader className="border-bottom">
                    <h6 className="m-0">Number Of Fish</h6>
                    <div className="block-handle" />
                    </CardHeader>
                    <CardBody className="p-0">
                        <FishNo/>
                    </CardBody>
            </Card>
          </Col>
        </Row>
        </Container> ):(<L></L>)}
      </Container>
      
    );
  
}

              
};
  
export default FishFarmSystem;
