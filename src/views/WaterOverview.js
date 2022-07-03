import React from "react";
import PropTypes from "prop-types";
import { Container, Row, Col } from "shards-react";

import PageTitle from "../components/common/PageTitle";
import Test from "../components/components-overview/Test";
import Colors from "../components/components-overview/TestColors";
import {URL,DKEY} from '../constants';
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import Cookies from "universal-cookie";


class WaterOverview extends React.Component{

  constructor(props) {
    super(props);
  
    const userIs_logged=localStorage.getItem('is_logged');
    const userEmail=localStorage.getItem('Email');
    const userToken=localStorage.getItem('Password');
    if(userIs_logged != 1){
      this.props.history.push("/login");
    }
    
    const pid = this.props.match.params.Id
    this.state = {
      id :pid,
      tests:[]
    }
  }

  async componentDidMount() {
    require('../utils').checkpermision('WaterSystem')
    const pid = this.state.id
    //console.log(pid);
    const response =  await fetch(URL+'users/countWaterTests/'+pid, {
        headers : { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
      })
      const json = await response.json()
      const count = json.count
      //console.log(count);
      this.setState({
        tests : count
      })
      //console.log(this.state.test);
  }

  render (){
    const {id,tests} = this.state
    return (
      <Container fluid className="main-content-container px-4" >
        {/* Page Header */}
        
        <Tabs defaultActiveKey="RO" id="RO">
          {tests.map((test, idx) => (
            <Tab eventKey={test.type} title={test.type} key={idx}>
              <Test IdParentToChild = {id} TestParentToChild = {test.type}  />
            </Tab>
          ))}
        </Tabs>
      </Container>
    ); 
}
}

export default WaterOverview;

