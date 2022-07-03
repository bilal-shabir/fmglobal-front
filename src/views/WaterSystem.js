import React from "react";
import { BrowserRouter as Router, Route,Switch,Link} from "react-router-dom";
import withTracker from "../withTracker";
import PropTypes from "prop-types";
import {
  Card,
  CardHeader,
  CardBody,
  ListGroup,
  ListGroupItem,
  CardFooter,
  Row,
  Col,
  Container,
} from "shards-react";
import {URL,DKEY} from '../constants';
import PageTitle from "../components/common/PageTitle";
import WaterOverview from "./WaterOverview";
import Cookies from "universal-cookie";
import L from "../components/components-overview/loader";



class WaterSystem extends React.Component{

  constructor(props) {
        super(props);
        const userIs_logged=localStorage.getItem('is_logged');
        const userEmail=localStorage.getItem('Email');
        const userToken=localStorage.getItem('Password');
        const admin=localStorage.getItem('admin');
        const UserId=localStorage.getItem('ID');
        const UserType=localStorage.getItem('UserType');

        if(userIs_logged != 1){
        this.props.history.push("/login");
        }
        // const rout = this.props.routes
        // //console.log(rout);
        // const path0 = rout[0];
        // const path1 = rout[1];
        // console.log(path0,path1);
        this.state = {
          UserId,admin,UserType,
          TP: '',
          isLoaded: false,
          
        }

        //this.renderelement = this.renderelement.bind(this);
    }

    async componentDidMount() {
        require('../utils').checkpermision('WaterSystem')
        const {UserId,admin,UserType} = this.state
        const response =  await fetch(URL+'users/getProjects/'+UserType+'/'+UserId+'/'+admin+'/Water', {
            headers : { 
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
          })
          const json = await response.json()
          const res = json.data.res
          //console.log(res)
          this.setState({items:res ,isLoaded: true})
         
    }

   

  render() {
        const {UserType} = this.state;
        const { isLoaded} = this.state;
        let items = this.state.items;

        return (
    
        <Container fluid className="main-content-container px-4">
            {/* Page Header */}
            <Row noGutters className="page-header py-4">
                <PageTitle title="Water Systems Info" subtitle="Overview" className="text-sm-left mb-3" />
            </Row>

            {isLoaded ? (<Row> 
                {items.map(item => { 
                    return item.SystemName == 'TDS Meter'?
                    <Col lg="4" md="12" sm="12" className="mb-4">
                            
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
                                        <span className="text-semibold text-fiord-blue">Power Consumption (KW)</span>
                                        <span className="ml-auto text-right text-semibold text-reagent-gray">
                                        -
                                        </span>
                                    </ListGroupItem>
                                </ListGroup>
                            
                                <ListGroup small flush className="list-group-small">
                                    <ListGroupItem className="d-flex px-3">
                                        <span className="text-semibold text-fiord-blue">Water Production (CBM)</span>
                                        <span className="ml-auto text-right text-semibold text-reagent-gray">
                                        -
                                        </span>
                                    </ListGroupItem>
                                </ListGroup>
                            
                                </CardBody>
                                
                                <CardFooter className="border-top">
                                <Row>
                                    {/* View Full Report */}
                                    <Col className="text-right view-report">
                                    {/* eslint-disable-next-line */}
                                    <Link to={`/TDSOverview/${item.SerialNO}`}>Full report &rarr;</Link>
                                    </Col>
                                </Row>
                                </CardFooter>
                            </Card> 
                            
                        </Col>

                    :
                    <Col lg="4" md="12" sm="12" className="mb-4">
                        
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
                                    <span className="text-semibold text-fiord-blue">Power Consumption (KW)</span>
                                    <span className="ml-auto text-right text-semibold text-reagent-gray">
                                    {item.TP}
                                    </span>
                                </ListGroupItem>
                            </ListGroup>
                        
                            <ListGroup small flush className="list-group-small">
                                <ListGroupItem className="d-flex px-3">
                                    <span className="text-semibold text-fiord-blue">Water Production (CBM)</span>
                                    <span className="ml-auto text-right text-semibold text-reagent-gray">
                                    -
                                    </span>
                                </ListGroupItem>
                            </ListGroup>
                        
                            </CardBody>
                            
                            <CardFooter className="border-top">
                            <Row>
                                {/* View Full Report */}
                                <Col className="text-right view-report">
                                {/* eslint-disable-next-line */}

                                {/* changes */}
                                <Link to={`/WaterSystem/${item.id}`}>Full report &rarr;</Link>
                                {/* changes */} 

                                {/* <Route
                                    key={path0.index}
                                    path={path0.path}
                                    exact={path0.exact}
                                    component={withTracker(props => {
                                        return (
                                        
                                            <path0.component {...props} />
                                        
                                        );
                                    })}
                                /> */}
                                </Col>
                            </Row>
                            </CardFooter>
                        </Card> 
                    </Col>

                })}
        </Row> ) : (<L></L>)} 
           
        
            
        </Container>
    
        );
        
    }
  
};

export default WaterSystem;
