import React, {Component} from "react";
import PropTypes from "prop-types";
import { NavLink as RouteNavLink } from "react-router-dom";
import { NavItem, NavLink } from "shards-react";
import bg4 from '../MainSidebar/icons-24.png'
import '../../../assets/style.css'
import powericon from '../../../images/icons-24.png'
import watericon from '../../../images/icons-22.png'
import windicon from '../../../images/icons-25.png'
import volticon from '../../../images/icons-26.png' 
import fishicon from '../../../images/icons-23.png'
import dashboardicon from '../../../images/icons-21.png' 
import customericon from '../../../images/customericon.png'  

class SidebarNavItem extends Component{

  constructor(props) {
    super(props);
    this.state = {
        item: this.props.item,
        src: null
    }
//
}
async componentDidMount() {
 var item = this.state.item
 if (item.name == 'PowerSystem'){
    this.setState({
      src: powericon
    })
 }
 else if(item.name== 'WindSystem'){
  this.setState({
    src: windicon
  })
 }
 else if(item.name == 'WaterSystem'){
  this.setState({
    src: watericon
  })
 }
 else if(item.name =='FishFarmSystem'){
  this.setState({
    src: fishicon
  })
 }
 else if(item.name =='Customer'){
  this.setState({
    src: dashboardicon
  })
 }
 else if(item.name =='O_M_Dashboard'){
  this.setState({
    src: dashboardicon
  })
 }
 else{
  this.setState({
    src: volticon
  })
 }
}

  render(){
    const {item } = this.state;
    return(
      <ul className="item">
    <NavLink tag={RouteNavLink} to={item.to} activeClassName="bg">
      {item.htmlBefore && (
        <div
          style={{marginLeft:'5px'}}
          className="d-inline-block item-icon-wrapper"
          
        >
          <img src={this.state.src} width={25} height={25} />
        </div>
      )}
      {item.title && <span class = 'sideBarNavItem' style={{color:'white', marginLeft:'10px'}} className="menuText" id="logo-text">{item.title}</span>}
      {item.htmlAfter && (
        <div style={{color:'white'}}
          className="d-inline-block item-icon-wrapper"
          dangerouslySetInnerHTML={{ __html: item.htmlAfter }}
        />
      )}
    </NavLink>
  </ul>
    );
  }
}

// const SidebarNavItem = ({ item }) => (
//   <ul className="item">
//     <NavLink tag={RouteNavLink} to={item.to} activeClassName="bg">
//       {item.htmlBefore && (
//         <div
//           style={{marginLeft:'20px'}}
//           className="d-inline-block item-icon-wrapper"
//           dangerouslySetInnerHTML={{ __html: item.htmlBefore }}
          
//         />
//       )}
//       {item.title && <span class = 'sideBarNavItem' style={{color:'white',fontSize:15, marginLeft:'10px'}} id="logo-text">{item.title}</span>}
//       {item.htmlAfter && (
//         <div style={{color:'white'}}
//           className="d-inline-block item-icon-wrapper"
//           dangerouslySetInnerHTML={{ __html: item.htmlAfter }}
//         />
//       )}
//     </NavLink>
//   </ul>
// );

// SidebarNavItem.propTypes = {
//   /**
//    * The item object.
//    */
//   item: PropTypes.object
  
// };

export default SidebarNavItem;
