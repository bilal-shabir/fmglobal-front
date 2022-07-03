import React from "react";
import { Container, Row, Col ,  Card,
  CardHeader,  ListGroup,
  ListGroupItem, } from "shards-react";
import Chart from "react-google-charts";
import PageTitle from "../components/common/PageTitle";
import WaterButtons from "../components/components-overview/WaterButtons";
import {Link} from 'react-router-dom';
import Cookies from "universal-cookie";
import {DKEY} from '../constants';





class Results extends React.Component{

  constructor(props) {
    super(props);
  
    const userIs_logged=localStorage.getItem('is_logged');
    const userEmail=localStorage.getItem('Email');
    const userToken=localStorage.getItem('Password');
    if(userIs_logged != 1){
      this.props.history.push("/login");
    }
    require('../utils').checkpermision('WaterSystem')
    const pid = this.props.match.params.Id
    const type = this.props.match.params.type
    //console.log(pid)
    //console.log(type)
    this.state={
      id:pid,
      type:type
    }
    //console.log(this.state.id)
    //console.log(this.state.type)
    

  }


render(){
  const {id,type} = this.state
  //console.log(id)
  //console.log(type)
  return(
  <Container fluid className="main-content-container px-4">
    {/* Page Header */}
    <Row noGutters className="page-header py-4">
      <PageTitle title="Water Testing Results" subtitle="Salman City Mass Spec" className="text-sm-left mb-3" />
      <ListGroupItem className="p-3">
        <strong className="text-muted d-block my-2">
          Chemical Elements
        </strong>
        <WaterButtons id={id} type={type}/>
        <Col className="text-right view-report">
              {/* eslint-disable-next-line */}
              
              {/* changes */}
              <Link to={`/WaterSystem/${this.state.id}`}>View Summary report &rarr;</Link> 
              {/* changes */}
            </Col>
      </ListGroupItem>
    </Row>
  
  </Container>
);
}
}
export default Results;

