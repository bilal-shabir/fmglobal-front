import React from "react";
import { NavLink as RouteNavLink, Link } from "react-router-dom";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Collapse,
  NavItem,
  NavLink
} from "shards-react";
import createHistory from "history/createBrowserHistory";
import icon15 from '../../../../images/icon15.png';


class UserActions extends React.Component{
  constructor(props) {
    super(props);

    const userIs_logged=localStorage.getItem('is_logged');
    const userEmail=localStorage.getItem('Name')
    const userToken=localStorage.getItem('Password');

    // alert(localStorage.getItem('Name'))
    // if(userIs_logged != 1){
    //   const history = createHistory()
    //   history.push("/login");
    //   //this.props.history.push('/login');
    // }

    this.state = {
      visible: false,
      Email:userEmail
    };

    this.toggleUserActions = this.toggleUserActions.bind(this);
  }

  toggleUserActions() {
    this.setState({
      visible: !this.state.visible
    });
  }

  render() {
    return (
      <NavItem tag={Dropdown} caret toggle={this.toggleUserActions} style={{marginLeft:'10%'}}>
        <DropdownToggle caret tag={NavLink} className="text-nowrap px-3" style={{color:'black'}}>
          <img src={icon15} width="25px"></img>
         {/* <span className="d-none d-md-inline-block" style={{color:'white',fontSize:17, paddingLeft:'5px'  }}>{this.state.Email}</span> */}
        </DropdownToggle>
        <Collapse tag={DropdownMenu}small open={this.state.visible} >
        <DropdownItem tag={Link} to="/UserProfile">
            <i className="material-icons" style={{color:'black'}} >account_circle</i> Profile
          </DropdownItem>
          <DropdownItem tag={Link} to="/logout" className="text-danger">
            <i className="material-icons text-danger" >&#xE879;</i> Logout
          </DropdownItem>
        </Collapse>
      </NavItem>
    );
  }
}
export default UserActions;