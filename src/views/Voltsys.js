import React from "react";
import PropTypes from "prop-types";
import { Card,
  CardHeader,
  CardBody,
  ListGroup,
  ListGroupItem,
  CardFooter,
  FormSelect, Container, Row, Col } from "shards-react";

import PageTitle from "../components/common/PageTitle";
import WindRadar from "../components/components-overview/WindRadar";
import WindRose from "../components/components-overview/WindRose";
import WindSpeed from "../components/components-overview/WindSpeed";
import WindSpeedcanvas from "../components/components-overview/WindSpeedcanvas";
import {URL,DKEY} from '../constants';
import {Link,useRouteMatch,} from "react-router-dom";
import Cookies from "universal-cookie";
import L from "../components/components-overview/loader";

class Voltsys extends React.Component{ 

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

      this.state = {
        UserId,admin,UserType,
        isLoaded: false,
        
      }
    
    }

    async componentDidMount() {
      require('../utils').checkpermision('VoltsysSystem')

        const {UserId,admin,UserType} = this.state
        const response =  await fetch(URL+'users/getProjects/'+UserType+'/'+UserId+'/'+admin+'/Voltsys', {
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

    render(){

        let items = this.state.items;
        const { isLoaded } = this.state;
        return(

            <Container fluid className="main-content-container px-4">
            {/* Page Header */}
            <Row noGutters className="page-header py-4">
              <PageTitle title="Voltsys Controller" subtitle="Dashboard" className="text-sm-left mb-3" />
            </Row>
            
            {isLoaded ? (<Row> 
            {items.map(item => ( 
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
                        </CardBody>
                        
                        <CardFooter className="border-top">
                        <Row>
                            {/* View Full Report */}
                            <Col className="text-right view-report">
                                {/* eslint-disable-next-line */}
                                <Link to={`/Voltsys/${item.SerialNO}`}>Full report &rarr;</Link>
                            </Col>
                        </Row>
                        </CardFooter>
                    </Card> 
                    
                </Col>
            ))} 
            </Row> ) : (<L></L>)}
      </Container>

 

    );
}
};



export default Voltsys;
