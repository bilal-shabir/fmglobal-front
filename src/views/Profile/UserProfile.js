import React from "react";
import {URL2,DKEY} from '../../constants';
import {
  Card,
  CardHeader,
  CardBody,
  ListGroup,
  ListGroupItem,
  CardFooter,
  FormSelect,
  Container,
  Row,
  Col,
} from "shards-react";

import PageTitle from "../../components/common/PageTitle";
import UserAccountDetails from "../../components/components-overview/UserAccountDetails";
import UserDetails from "../../components/components-overview/UserDetails";
import L from "../../components/components-overview/loader";

// import "react-datepicker/dist/react-datepicker.css";

class UserProfile extends React.Component {
  constructor(props) {
    super(props);

    this.state ={
      user_details : null
    }
  }
  componentDidMount(){
    const id = localStorage.getItem('user_id');
    let type = localStorage.getItem('Type');
    if(type=='customer'){
      fetch(URL2+'customer/'+id,{
        headers : { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include'
      }).then(response => response.json())
      .then((json)=>{
        // console.log(json)
        this.setState({
          user_details: json
        })
      })
    }
    else{
      fetch(URL2+'employee/'+id,{
        headers : { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include'
      }).then(response => response.json())
      .then((json)=>{
        // console.log(json)
        this.setState({
          user_details: json
        })
      })
    }
    
  }

  render() {
    return (
        <Container fluid className="main-content-container px-4">
          {this.state.user_details ? (
            <div>
        <Row noGutters className="page-header py-4">
          <PageTitle title="User Profile" md="12" className="ml-sm-auto mr-sm-auto" />
        </Row>
        <Row>
          <Col lg="4">
            <UserDetails user_details={this.state.user_details}></UserDetails>
          </Col>
          <Col lg="8">
            <UserAccountDetails user_details={this.state.user_details}></UserAccountDetails>
          </Col>
        </Row>
        </div>
        ): (<L></L>)}
      </Container>
    );
  }
}

export default UserProfile;
