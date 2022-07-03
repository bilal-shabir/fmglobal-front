import React from "react";
// import PropTypes from "prop-types";
import { Container} from "shards-react";
// import Spinner from 'react-bootstrap/Spinner';

// import PageTitle from "../components/common/PageTitle";
// import SmallStats from "../components/common/SmallStats";
// import UsersOverview from "../components/blog/UsersOverview";
// import UsersByDevice from "../components/blog/UsersByDevice";
// import NewDraft from "../components/blog/NewDraft";
// import Discussions from "../components/blog/Discussions";
// import SystemsInfo from "../components/common/SystemsInfo";
// import SystemsInfo2 from "../components/common/SystemsInfo2";
// import SystemsInfo3 from "../components/common/SystemsInfo3";


class Dashboard extends React.Component{

  constructor(props) {
    super(props);
  
    const userIs_logged=localStorage.getItem('is_logged');
    // const userEmail=localStorage.getItem('Email');
    // const userToken=localStorage.getItem('Password');
    // const UserId=localStorage.getItem('ID');
    if(userIs_logged != 1){
      this.props.history.push("/login");
    }

  }

  render (){
      return (
        <Container fluid className="main-content-container px-4">

       
      </Container>

      );
  }

};

export default Dashboard;
