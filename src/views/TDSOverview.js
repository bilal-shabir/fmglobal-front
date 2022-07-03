import React from "react";
import { Card,
  CardHeader,
  CardBody,
 Container, Row, Col
} from "shards-react";

import {URL} from '../constants';
import PageTitle from "../components/common/PageTitle";
import TDSChart from "../components/components-overview/TDSChart";


class TDSOverview extends React.Component{ 

    constructor(props) {
      super(props);
    
      const userIs_logged=localStorage.getItem('is_logged');
      if(userIs_logged != 1){
        this.props.history.push("/login");
      }
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
                    <PageTitle title="TDS Monitoring" subtitle="Dashboard" className="text-sm-left mb-3" />
                </Row>

                <Row>
                    <Col lg="12" md="6" sm="12" className="mb-4">

                        <Card small>
                        <CardHeader className="border-bottom">
                            <h6 className="m-0">TDS Values</h6>
                            <div className="block-handle" />
                        </CardHeader>

                        <CardBody className="p-0">
                            <TDSChart sn={this.state.SNid}/>
                        </CardBody>

                        </Card>
                    </Col> 
                </Row>
            </Container>

        );
    }

};
export default TDSOverview;
