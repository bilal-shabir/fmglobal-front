import React from "react";

import ViewUsers from "../components/Users/ViewUsers";
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

// import "react-datepicker/dist/react-datepicker.css";

class Users extends React.Component {
  constructor(props) {
    super(props);
  }
  async componentDidMount() {
    
    
  }
 

  render() {
    return (
      <Container  fluid className=" mt-4 main-content-container px-4">
 
        <ViewUsers/>
      </Container>
    );
  }
}

export default Users;
