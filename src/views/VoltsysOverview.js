import React from "react";
import PropTypes from "prop-types";
import { Card,
  CardHeader,
  CardBody,
  ListGroup,
  ListGroupItem,
  CardFooter,
  FormSelect, Container, Row, Col
} from "shards-react";


import PageTitle from "../components/common/PageTitle";
import VoltsysVoltage from "../components/components-overview/VoltsysVoltage";
import {Link,useRouteMatch,} from "react-router-dom";
import VoltsysTemp from "../components/components-overview/VoltsysTemp";
import VoltsysDump from "../components/components-overview/VoltsysDump";
import VoltsysPhases from "../components/components-overview/VoltsysPhases";
import Cookies from "universal-cookie";
import {DKEY} from  '../constants';



class VoltsysOverview extends React.Component{ 

    constructor(props) {
      super(props);
    
      const userIs_logged=localStorage.getItem('is_logged');
      const userEmail=localStorage.getItem('Email');
      const userToken=localStorage.getItem('Password');
      if(userIs_logged != 1){
        this.props.history.push("/login");
      }
      require('../utils').checkpermision('VoltsysSystem')
      const SN = this.props.match.params.SN
      this.state = {
        smallStats: [],
        SNid :SN,

      }

    }


    render(){
        return(

          <Container fluid className="main-content-container px-4">
          {/* Page Header */}
          <Row noGutters className="page-header py-4">
            <PageTitle title="Voltsys Controller Monitoring" subtitle="Dashboard" className="text-sm-left mb-3" />
          </Row>


          <Row>
            <Col lg="4" md="6" sm="12" className="mb-4">

              <Card small>
                <CardHeader className="border-bottom">
                  <h6 className="m-0">Voltage Monitoring</h6>
                  <div className="block-handle" />
                </CardHeader>

                <CardBody className="p-0">

                <VoltsysVoltage sn={this.state.SNid}/>
               

                </CardBody>

              </Card>
           </Col>
          <Col lg="4" md="6" sm="12" className="mb-4">

          <Card small>
            <CardHeader className="border-bottom">
              <h6 className="m-0">PCB Temperature</h6>
              <div className="block-handle" />
            </CardHeader>

            <CardBody className="p-0">
              <VoltsysTemp sn={this.state.SNid}/>
            </CardBody>

          </Card>

          </Col>

          <Col lg="4" md="6" sm="12" className="mb-4">

          <Card small>
            <CardHeader className="border-bottom">
              <h6 className="m-0">Dumpload Voltage</h6>
              <div className="block-handle" />
            </CardHeader>

            <CardBody className="p-0">
              <VoltsysDump sn={this.state.SNid}/>
            </CardBody>

          </Card>
          </Col> 

        </Row>

        <Row>
          <Col lg="12" md="6" sm="12" className="mb-4">

            <Card small>
              <CardHeader className="border-bottom">
                <h6 className="m-0">Voltsys Phases</h6>
                <div className="block-handle" />
              </CardHeader>

              <CardBody className="p-0">
                <VoltsysPhases sn={this.state.SNid}/>
              </CardBody>

            </Card>
          </Col> 
        </Row>
    </Container>

    );
}

};



export default VoltsysOverview;
