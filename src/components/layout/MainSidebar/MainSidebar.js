import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Col, Button } from "shards-react";
import Cookies from "universal-cookie";
import {DKEY} from '../../../constants'
import SidebarMainNavbar from "./SidebarMainNavbar";
import SidebarSearch from "./SidebarSearch";
import SidebarNavItems from "./SidebarNavItems";
// import bg0 from '../MainSidebar/IMG_1121.JPG'
import bg from '../MainSidebar/bg.png'
import bg2 from '../MainSidebar/bg2.png'
import bg3 from '../MainSidebar/bg3.png'
import bg4 from '../MainSidebar/bg4.png'
import bg5 from '../MainSidebar/bg7.JPG'

import { Store } from "../../../flux";
import   '../../../assets/MainSidebar.css';

class MainSidebar extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      menuVisible: false,
      sidebarNavItems: Store.getSidebarItems(),
      collapsed:false,
    };


    this.onChange = this.onChange.bind(this);
  }

  componentWillMount() {
    Store.addChangeListener(this.onChange);
  }

  componentWillUnmount() {
    Store.removeChangeListener(this.onChange);
  }

  onChange() {
    this.setState({
      ...this.state,
      menuVisible: Store.getMenuState(),
      sidebarNavItems: Store.getSidebarItems()
    });
  }
  componentDidMount (){
  
  }

  toggleSideNavBar = () => {
    if(this.state.collapsed){
      var main_content = document.getElementById("main-content");
      var side_bar = document.getElementById("main-sidebar");
      var logo = document.getElementById("main-logo");
      logo.style.visibility = 'visible';
      var hamburger = document.getElementById("hamburger");
      // hamburger.style.marginLeft = "-50px";
      var logo_text = document.getElementById("logo-text");
      logo_text.style.visibility = 'visible'; 
      side_bar.style.width = "25%";
      main_content.classList.remove("col-lg-12");
      main_content.classList.add("col-lg-10");
      main_content.style.marginLeft = "16%";
      
       
      // main_content.style.flex = "25%";
      // main_content.style.maxWidth = "75%";
    }else{
      var main_content = document.getElementById("main-content");
      var side_bar = document.getElementById("main-sidebar");
      var logo = document.getElementById("main-logo");
      var hamburger = document.getElementById("hamburger");
      hamburger.style.marginLeft = "15px";
      logo.style.visibility = 'hidden';
      var logo_text = document.getElementById("logo-text");
      logo_text.style.visibility = 'hidden';
      
      
      // for (let el of document.querySelectorAll('.sideBarNavItem')) el.style.visibility = 'hidden';
      let width = window.innerWidth
      if (width < 1501) {
        side_bar.style.width = "3.9%";
        main_content.classList.remove("col-lg-10");
        main_content.classList.add("col-lg-12");
        main_content.style.marginLeft = "3.9%";
        main_content.style.flex = "96.1%";
        main_content.style.maxWidth = "96.1%";
      }
      else{
        side_bar.style.width = "2.6%";
        main_content.classList.remove("col-lg-10");
        main_content.classList.add("col-lg-12");
        main_content.style.marginLeft = "2.6%";
        main_content.style.flex = "97.4%";
        main_content.style.maxWidth = "97.4%";
      }
      
    }
    this.setState({collapsed : !this.state.collapsed});
    
   
  }

  render() {
    const classes = classNames(
      "main-sidebar",
      "px-0",
      "col-12",
      "bg",
      this.state.menuVisible && "open"
    );

    return (
      <Col id= 'main-sidebar mainsidebarbg'
        tag="aside"
        className={classes}
        lg={{ size: 2 }}
        md={{ size: 3 }}
        style={{ 
          backgroundImage: "linear-gradient(to bottom, #2A2D36, #2A2D36)"
        }}
      >
        <SidebarMainNavbar  toggleSideNavBar={this.toggleSideNavBar} hideLogoText={this.props.hideLogoText} />
        <SidebarNavItems toggleSideNavBar={this.toggleSideNavBar} hideLogoText={this.props.hideLogoText}/>
      </Col>
    );
  }
}

MainSidebar.propTypes = {
  /**
   * Whether to hide the logo text, or not.
   */
  hideLogoText: PropTypes.bool
};

MainSidebar.defaultProps = {
  hideLogoText: false
};
SidebarNavItems.propTypes = {
  /**
   * Whether to hide the logo text, or not.
   */
  hideLogoText: PropTypes.bool
};

SidebarNavItems.defaultProps = {
  hideLogoText: false
};


export default MainSidebar;
