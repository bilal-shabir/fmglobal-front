import React from "react";
//import PropTypes from "prop-types";
import { Card,
  CardHeader,
  CardBody,
  Container, Row, Col
} from "shards-react";

//import {URL,DKEY} from '../constants';
import PageTitle from "../components/common/PageTitle";
//import WindRadar from "../components/components-overview/WindRadar";
import WindSpeed from "../components/components-overview/WindSpeed";
import WindRose from "../components/components-overview/WindRose";

//import WindSpeedcanvas from "../components/components-overview/WindSpeedcanvas";
//import {Link,useRouteMatch,} from "react-router-dom";
//import Cookies from "universal-cookie";



class WindOverview extends React.Component{ 

    constructor(props) {
      super(props);
    
      const userIs_logged=localStorage.getItem('is_logged');
      //const userEmail=localStorage.getItem('Email');
      //const userToken=localStorage.getItem('Password');
      if(userIs_logged != 1){
        this.props.history.push("/login");
      }
      require('../utils').checkpermision('WindSystem')
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
            <PageTitle title="Wind Speed Monitoring" subtitle="Dashboard" className="text-sm-left mb-3" />
          </Row>


          <Row>
            <Col lg="6" md="6" sm="12" className="mb-4">

              <Card small>
                <CardHeader className="border-bottom">
                  <h6 className="m-0">Wind Speed Against Output Power</h6>
                  <div className="block-handle" />
                </CardHeader>

                <CardBody className="p-0">
                <WindSpeed sn={this.state.SNid}/>

                </CardBody>
              
              </Card>
           </Col>
          {/* <Col lg="4" md="6" sm="12" className="mb-4">

          <Card small>
            <CardHeader className="border-bottom">
              <h6 className="m-0">Wind Radar</h6>
              <div className="block-handle" />
            </CardHeader>

            <CardBody className="p-0">
            <WindRadar/>

            </CardBody>
            
          </Card>


          </Col> */}
          <Col lg="6" md="6" sm="12" className="mb-4">

            <Card small>
              <CardHeader className="border-bottom">
                <h6 className="m-0">Wind Rose</h6>
                <div className="block-handle" />
              </CardHeader>

              <CardBody className="p-0">
              <WindRose sn={this.state.SNid} />

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



export default WindOverview;
