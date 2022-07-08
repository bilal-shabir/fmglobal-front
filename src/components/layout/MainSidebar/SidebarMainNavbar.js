import React from "react";
import PropTypes from "prop-types";
import { Navbar, NavbarBrand } from "shards-react";
import { Dispatcher, Constants } from "../../../flux";
import '../../../assets/style.css';
import menu from '../../../images/fmlogo.png'; 
import Cookies from "universal-cookie";

class SidebarMainNavbar extends React.Component {
  constructor(props) {
    super(props);
    const cookies = new Cookies();
    this.state={
      direction : cookies.get('i18next') || 'en'
    }
    this.handleToggleSidebar = this.handleToggleSidebar.bind(this);
  }

  handleToggleSidebar() {
    Dispatcher.dispatch({
      actionType: Constants.TOGGLE_SIDEBAR
    });
  }
  

  render() {
    const { hideLogoText } = this.props;
    return (
      <div  className="main-navbar" style={{backgroundColor:'#D79D12'}}>
        <Navbar
          className="align-items-stretch flex-md-nowrap  p-0"
          type="light"
        >
          <NavbarBrand
            className="w-100 mr-0"
            href="#"
            // style={{ lineHeight: "25px" }}
            

          >
            {this.state.direction === 'en' ? (<div  className="d-table" style={{marginLeft:'25%'}} >
              {/* {this.state.show?<i id='hamburger' style={{color:'white', marginLeft:'15px', fontSize:'23px'}} onClick = {this.props.toggleSideNavBar} className="material-icons menulogo" >menu</i> : <div></div> } */}
              
              <img
                id="main-logo"
                className="d-inline-block align-top mr-1 navlogo"
                // style={{ maxWidth: "40px" , marginLeft:'15px'}}
                src={menu}
                alt="Pavilion Dashboard"
              />
              {!hideLogoText && (
                <h2  id="logo-text" className="d-none d-md-inline navlogotext" style={{color:'white'}}>
                  F&M Global
                </h2>
              )}
              
            </div>)
            :
            (<div  className="d-table" style={{marginRight:'25%'}} >
            {/* {this.state.show?<i id='hamburger' style={{color:'white', marginLeft:'15px', fontSize:'23px'}} onClick = {this.props.toggleSideNavBar} className="material-icons menulogo" >menu</i> : <div></div> } */}
            
            <img
              id="main-logo"
              className="d-inline-block align-top mr-1 navlogo"
              // style={{ maxWidth: "40px" , marginLeft:'15px'}}
              src={menu}
              alt="Pavilion Dashboard"
            />
            {!hideLogoText && (
              <h2  id="logo-text" className="d-none d-md-inline navlogotext" style={{color:'white'}}>
                F&M Global
              </h2>
            )}
            
          </div>)}
            
          </NavbarBrand>
          {/* eslint-disable-next-line */}
          <a
            className="toggle-sidebar d-sm-inline d-md-none d-lg-none"
            onClick={this.handleToggleSidebar}
          >
            <i className="material-icons">&#xE5C4;</i>
          </a>
        </Navbar>
      </div>
    );
  }
}

SidebarMainNavbar.propTypes = {
  /**
   * Whether to hide the logo text, or not.
   */
  hideLogoText: PropTypes.bool
};

SidebarMainNavbar.defaultProps = {
  hideLogoText: false
};

export default SidebarMainNavbar;
