import React from "react";
import profilepicture from '../../images/defaultProfile.png';
import {
    Card,
    CardHeader,
    Button,
    ListGroup,
    ListGroupItem,
    Progress
  } from "shards-react";

// import "react-datepicker/dist/react-datepicker.css";

class UserDetails extends React.Component {
  constructor(props) {
    super(props);
    const details = this.props.user_details
    let type = localStorage.getItem('Type');
    this.state ={
      details: details,
      type : type
    }
  }
  
  render() {
    return (
        <Card small className="mb-4 pt-3 pb-3">
        <CardHeader className="">
          
        </CardHeader>
        <div className="mb-3 mx-auto">
            <img
              className="rounded-circle"
              src={profilepicture}
              alt=""
              width="150"
            />
          </div>
          <h4 className="mb-0 text-center">{this.state.details.name}</h4>
          
          
          {/* <Button pill outline size="sm" className="mb-2">
            <i className="material-icons mr-1">person_add</i> Follow
          </Button> */}
      </Card>
    );
  }
}

export default UserDetails;
