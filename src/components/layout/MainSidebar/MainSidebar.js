import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Col } from "shards-react";
import SidebarMainNavbar from "./SidebarMainNavbar";
import SidebarNavItems from "./SidebarNavItems";
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

  componentDidMount() {
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
        <SidebarMainNavbar hideLogoText={this.props.hideLogoText} />
        <SidebarNavItems hideLogoText={this.props.hideLogoText}/>
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
