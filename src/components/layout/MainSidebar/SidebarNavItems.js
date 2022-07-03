import React from "react";
import PropTypes from "prop-types";
import { URL, DKEY, URL2 } from '../../../constants';
import SidebarNavItem from "./SidebarNavItem";
import { Store } from "../../../flux";
import Cookies from "universal-cookie";
import { NavLink as RouteNavLink, useLocation } from "react-router-dom";
import { NavItem, NavLink, Nav, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Button } from "shards-react";
import '../../../assets/style.css';
import billicon from '../../../images/bill.png';
import qricon from '../../../images/qricon.png';
import invoiceicon from '../../../images/invoice.png';
import addinvoice from '../../../images/add.png';
import arrow from '../../../images/arrow.png';
import arrowup from '../../../images/arrowup.png';
import dashboardicon from '../../../images/icons-21.png'
import { Dispatcher, Constants } from "../../../flux";
import { set } from "lodash";

class SidebarNavItems extends React.Component {
  constructor(props) {
    super(props)

    //const permissions=localStorage.getItem('permissions');
    //console.log(localStorage.getItem('permissions'));
    //console.log(localStorage.getItem('permissions2'));

    //console.log(JSON.parse(localStorage.getItem('permissions2')))

    //console.log(this.persmissions)

    //cookie decryption

    const cookies = new Cookies();
    let permission = localStorage.getItem('permissions');

    // if (localStorage.getItem('permissions') == null) {
    //   window.location.replace("/logout");

    // }
    // var CryptoJS = require("crypto-js");
    // var bytes = CryptoJS.AES.decrypt(permission, DKEY);
    // var permissions = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

    // console.log(permissions)
    var permission2 = []
    // for (let index = 0; index < permissions.length; index++) {
    //   permission2[index] = permissions[index].name;
      
    // }
    //console.log(permission2)

    //var permission = (permissions||"").split(",");
    const type = localStorage.getItem('Type');

    if (localStorage.getItem("side_menu")) {
      const d = JSON.parse(localStorage.getItem("side_menu"))
      this.state = d
    }
    else {
      if (type == 'employee') {
        this.state = {
          open: false,
          open1: false,
          open2: false,
          open3: false,
          open4: false,
          open5: false,
          open6: false,
          open7: false,
          open8: false,
          openReport:false,
          permission2,
          openGenerate:false,
          openQrReports:false,
          type: type,
          navItems: Store.getSidebarItems()
        }
      }
      else {
        this.state = {
          open: false,
          open1: false,
          open2: false,
          open3: false,
          open4: false,
          open5: false,
          open6: false,
          openReport:false,
          permission2,
          type: type,
          navItems: Store.getSidebarItems()
        };
      }
    }
    this.setState({
      permission2: permission2
    })





    this.toggle = this.toggle.bind(this);
    this.toggle1 = this.toggle1.bind(this);
    this.toggle2 = this.toggle2.bind(this);
    this.toggle_invoice = this.toggle_invoice.bind(this)
    this.toggle_alert = this.toggle_alert.bind(this)
    this.toggle_administration = this.toggle_administration.bind(this)
    this.toggle_resources = this.toggle_resources.bind(this)
    this.toggle_rr = this.toggle_rr.bind(this)
    this.toggle_qr = this.toggle_qr.bind(this)
    this.toggle_qr_report = this.toggle_qr_report.bind(this)

    this.handleToggleSidebar = this.handleToggleSidebar.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentWillMount() {
    Store.addChangeListener(this.onChange);
  }

  componentWillUnmount() {
    Store.removeChangeListener(this.onChange);
  }
  componentDidMount() {
    // let permission = localStorage.getItem('permissions');
    // var CryptoJS = require("crypto-js");
    // var bytes = CryptoJS.AES.decrypt(permission, DKEY);
    // var permissions = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    // var permission2 = []
    // this.toggle()
    // for (let index = 0; index < permissions.length; index++) {
    //   permission2[index] = permissions[index].resource.name;
      
    // }
    
  }
  handleToggleSidebar() {
    Dispatcher.dispatch({
      actionType: Constants.TOGGLE_SIDEBAR
    });
  }
  onChange() {
    this.setState({
      ...this.state,
      navItems: Store.getSidebarItems()
    });
  }
  handleToggleSidebar() {
    Dispatcher.dispatch({
      actionType: Constants.TOGGLE_SIDEBAR
    });
  }
  toggle() {
    this.setState({ open: !this.state.open });

    setTimeout(() => {
      localStorage.setItem("side_menu", JSON.stringify(this.state))
    }, 100);
  }
  toggle1() {
    this.setState({ open1: !this.state.open1 });
    setTimeout(() => {
      localStorage.setItem("side_menu", JSON.stringify(this.state))
    }, 100);

  }
  toggle2() {
    this.setState({ open2: !this.state.open2 });
    setTimeout(() => {
      localStorage.setItem("side_menu", JSON.stringify(this.state))
    }, 100);
  }
  toggle_invoice() {
    this.setState({ open3: !this.state.open3 });
    setTimeout(() => {
      localStorage.setItem("side_menu", JSON.stringify(this.state))
    }, 100);

  }
  toggle3 = () => {
    this.setState({ open4: !this.state.open4 });
    setTimeout(() => {
      localStorage.setItem("side_menu", JSON.stringify(this.state))
    }, 100);
  }

  toggle_administration(){
    this.setState({open6 : !this.state.open6});
    setTimeout(() => {
      localStorage.setItem("side_menu", JSON.stringify(this.state))
    }, 100);
  }

  toggle_resources(){
    this.setState({open7 : !this.state.open7});
    setTimeout(() => {
      localStorage.setItem("side_menu", JSON.stringify(this.state))
    }, 100);
  }
  toggle_rr(){
    this.setState({open8 : !this.state.open8});
    setTimeout(() => {
      localStorage.setItem("side_menu", JSON.stringify(this.state))
    }, 100);
  }
  toggle_alert(){
    this.setState({open5 : !this.state.open5});
    setTimeout(() => {
      localStorage.setItem("side_menu", JSON.stringify(this.state))
    }, 100);

  }


  toggle_qr(){
    this.setState({open6 : !this.state.open6});
    setTimeout(() => {
      localStorage.setItem("side_menu", JSON.stringify(this.state))
    }, 100);
    
  }
  toggle_qr_report(){
    this.setState({openQrReports : !this.state.openQrReports});
    setTimeout(() => {
      localStorage.setItem("side_menu", JSON.stringify(this.state))
    }, 100);
    
  }
  toggle_qr_generate=()=>{
    this.setState({openGenerate : !this.state.openGenerate});
    setTimeout(() => {
      localStorage.setItem("side_menu", JSON.stringify(this.state))
    }, 100);
    
  }

  menu(permissions,data){
    if(permissions.includes(data)){
      return true
    } else {
      return false
    }
  }

  render() {
    const { navItems: items, permission2 } = this.state;
    return (
      <div className="nav-wrapper">
        
          {items.map((item, idx) => {
            if (item.name=='Billing') {
              return  this.menu(permission2,item.name) && (
                <Nav  className="nav--no-borders flex-column">
                  {this.state.type == 'customer' ? (
                    <ul className="item">
                    <NavLink style={{color:'white',  cursor:'pointer'}} tag={RouteNavLink} activeClassName="bg" to="/Billed_Invoice">
                    <img src={invoiceicon} width={17} height={17} style={{marginLeft:'10px'}} /><span style={{ marginLeft:'13px'}} id="icon-text" className="menuText">Invoices</span> 
                    </NavLink>
                  </ul>
                ) : (
                  <span>
                    <ul onClick={this.toggle} className="item">
                      <NavLink style={{color:'white',  cursor:'pointer'}}>
                      <img src={billicon} width={17} height={17} style={{marginLeft:'10px'}} /><span style={{marginLeft:'13px'}} id="icon-text" className="menuText">Billing</span> 
                      {this.state.open ? (<img src={arrowup} width={10} height={10} style={{marginLeft:'5px'}} />): (<img src={arrow} width={10} height={10} style={{marginLeft:'5px'}} />)}
                      
                      </NavLink>
                    </ul>
                    <>
                    {item.submenu && this.state.open ? (
                      <>
                      {
                        item.submenu.map((inner)=>{
                          if(inner.title == "Invoices"){
                          return this.menu(permission2, inner.title) && (
                            <span>
                              <ul  style={{paddingLeft: '30px'}} onClick={this.toggle_invoice} id="item0" className="item" >
                                <NavLink style={{color:'white', cursor:'pointer'}}>
                                <img src={invoiceicon} width={17} height={17} /> <span style={{marginLeft:'10px'}} className="submenuText">Invoices</span>{this.state.open3 ? (<img src={arrowup} width={10} height={10} style={{marginLeft:'5px'}} />): (<img src={arrow} width={10} height={10} style={{marginLeft:'5px'}} />)}
                                </NavLink>
                              </ul>
                              <>
                              {inner.submenu  && this.state.open3 ? (
                                inner.submenu.map((third) =>{
                                  return  this.menu(permission2,third.title) && (
                                    <ul  style={{paddingLeft: '70px'}} id="item1" className="item" >
                                      <NavLink  tag={RouteNavLink} to={third.link} activeClassName="bg" style={{color:'white'}}>
                                        <span style={{fontSize:14, marginLeft:'10px'}}>{third.title}</span>
                                      </NavLink>
                                    </ul>
                                  )
                                })
                              ):(
                                null
                              ) }
                              </>
                            </span>
    
                          )
                        }
                        else{
                          return this.menu(permission2, inner.title) && (
                          <ul  style={{paddingLeft: '30px'}} id="item7" className="item" >
                            <NavLink style={{color:'white', cursor:'pointer'}} tag={RouteNavLink} to={inner.link} activeClassName="bg">
                            <img src={`img/${inner.icon}`} width={17} height={17} /> <span style={{marginLeft:'10px'}} className="submenuText">{inner.title}</span>
                            </NavLink>
                          </ul>
                        )} 
                        })
                      }
                      </>
                    ):(null)}
                    </>
                    </span>
                  )}
                  
                </Nav>


              )}


              else if (item.name=='QR') {

                return  this.menu(permission2,item.name) && (
                 
                  <Nav  className="nav--no-borders flex-column">
                    
                    <ul onClick={this.toggle1} className="item">
                    <NavLink style={{color:'white'}}>
                    <img src={billicon} width={17} height={17} style={{marginLeft:'10px'}} /><span style={{marginLeft:'13px'}} id="pr-icon-text" className="menuText">QR System</span> {this.state.open1 ? (<img src={arrowup} width={10} height={10} style={{marginLeft:'5px'}} />): (<img src={arrow} width={10} height={10} style={{marginLeft:'5px'}} />)}
                    </NavLink>
                    </ul>
                    {this.state.open1 && item.submenu ? (

                      <span>
                      {
                        item.submenu.map((inner)=>{
                          if(inner.title == "Manage QR"){
                          return this.menu(permission2, inner.title) && (
                            <span>
                              <ul  style={{paddingLeft: '30px'}} onClick={this.toggle_qr_generate} id="item0" className="item" >
                                <NavLink style={{color:'white', cursor:'pointer'}}>
                                <img src={invoiceicon} width={17} height={17} /> <span style={{ marginLeft:'10px'}} className="submenuText">Manage QR</span>{this.state.openGenerate ? (<img src={arrowup} width={10} height={10} style={{marginLeft:'5px'}} />): (<img src={arrow} width={10} height={10} style={{marginLeft:'5px'}} />)}
                                </NavLink>
                              </ul>
                              <>
                              {inner.submenu  && this.state.openGenerate ? (
                                inner.submenu.map((third) =>{
                                  return  this.menu(permission2,third.title) && (
                                    <ul  style={{paddingLeft: '70px'}} id="item1" className="item" >
                                      <NavLink  tag={RouteNavLink} to={third.link} activeClassName="bg" style={{color:'white'}}>
                                        <span style={{fontSize:14, marginLeft:'10px'}}>{third.title}</span>
                                      </NavLink>
                                    </ul>
                                  )
                                })
                              ):(
                                null
                              ) }
                              </>
                            </span>
    
                          )
                        }
                        else if(inner.title == "QR Reports"){
                          return this.menu(permission2, inner.title) && (
                            <span>
                              <ul  style={{paddingLeft: '30px'}} onClick={this.toggle_qr_report} id="item0" className="item" >
                                <NavLink style={{color:'white', cursor:'pointer'}}>
                                <img src={invoiceicon} width={17} height={17} /> <span style={{marginLeft:'10px'}} className="submenuText">QR Reports</span>{this.state.openQrReports ? (<img src={arrowup} width={10} height={10} style={{marginLeft:'5px'}} />): (<img src={arrow} width={10} height={10} style={{marginLeft:'5px'}} />)}
                                </NavLink>
                              </ul>
                              <>
                              {inner.submenu  && this.state.openQrReports ? (
                                inner.submenu.map((third) =>{
                                  return  this.menu(permission2,third.title) && (
                                    <ul  style={{paddingLeft: '70px'}} id="item1" className="item" >
                                      <NavLink  tag={RouteNavLink} to={third.link} activeClassName="bg" style={{color:'white'}}>
                                        <span style={{fontSize:14, marginLeft:'10px'}}>{third.title}</span>
                                      </NavLink>
                                    </ul>
                                  )
                                })
                              ):(
                                null
                              ) }
                              </>
                            </span>
    
                          )
                        }
                        
                        else {
                          return this.menu(permission2, inner.title) && (
                          <ul  style={{paddingLeft: '30px'}} id="item7" className="item" >
                            <NavLink style={{color:'white', cursor:'pointer'}} tag={RouteNavLink} to={inner.link} activeClassName="bg">
                            <img src={`img/${inner.icon}`} width={17} height={17} /> <span style={{ marginLeft:'10px'}} className="submenuText">{inner.title}</span>
                            </NavLink>
                          </ul>
                        )} 
                        })
                      }



                    </span>
                    ) : (<div></div>)}
                    
                  </Nav>
  
  
                )}
              else if (item.name=='PurchaseRequisition') {

                return  this.menu(permission2,item.name) && (
                 
                  <Nav  className="nav--no-borders flex-column">
                    
                    <ul onClick={this.toggle1} className="item">
                    <NavLink style={{color:'white'}}>
                    <img src={billicon} width={17} height={17} style={{marginLeft:'10px'}} /><span style={{ marginLeft:'13px'}} className="menuText" id="pr-icon-text">Material Requisition</span> {this.state.open1 ? (<img src={arrowup} width={10} height={10} style={{marginLeft:'5px'}} />): (<img src={arrow} width={10} height={10} style={{marginLeft:'5px'}} />)}
                    </NavLink>
                    </ul>
                    {this.state.open1 && item.submenu ? (

                      <span>
                        {item.submenu.map((inner)=>{
                           return  this.menu(permission2,inner.title) && (
                            <ul  style={{paddingLeft: '30px'}} id="pr_item1" className="item" >
                              <NavLink  tag={RouteNavLink} to={inner.link} activeClassName="bg" style={{color:'white'}}>
                              <img src={`img/${inner.icon}`} width={17} height={17} /> <span style={{marginLeft:'10px'}} className="submenuText">{inner.title}</span>
                              </NavLink>
                            </ul>
                           )
                        })}
                    </span>
                    ) : (<div></div>)}
                    
                  </Nav>
  
  
                )}
                else if (item.name=='Reports'){
                    return  this.menu(permission2,item.name) && (
                   
                      <Nav  className="nav--no-borders flex-column">
                        
                        <ul onClick={this.toggle3} className="item">
                        <NavLink style={{color:'white', cursor: "pointer"}}>
                        <img src={billicon} width={17} height={17} style={{marginLeft:'10px', }} /><span style={{ marginLeft:'13px'}} className="menuText" id="prs-icon-text">O&#38;M Reports</span> {this.state.open4 ? (<img src={arrowup} width={10} height={10} style={{marginLeft:'5px'}} />): (<img src={arrow} width={10} height={10} style={{marginLeft:'5px'}} />)}
                        </NavLink>
                        </ul>
                        {this.state.open4 && item.submenu ? (
                          <span>
                          {item.submenu.map((inner)=>{
                             return  this.menu(permission2,inner.title) && (
                              <ul  style={{paddingLeft: '30px'}} id="dpreport" className="item" >
                                <NavLink  tag={RouteNavLink} to={inner.link} activeClassName="bg" style={{color:'white'}}>
                                <img src={invoiceicon} width={17} height={17} /> <span style={{marginLeft:'10px'}} className="submenuText">{inner.title}</span>
                                </NavLink>
                              </ul>
                             )
                          })}
                        </span>
                        ) : (<div></div>)}
 
                      </Nav>
                    )
                }
              else if (item.name=='AlertDashboard') {
                return  this.menu(permission2,item.name) && (
                 
                  <Nav  className="nav--no-borders flex-column">
                    
                    <ul onClick={this.toggle_alert} className="item">
                    <NavLink style={{color:'white'}}>
                      <img src={billicon} width={17} height={17} style={{marginLeft:'10px'}} />
                      <span style={{ marginLeft:'12px', cursor:"pointer"}} className="menuText" id="alert-icon-text"> O&M Alert Dashboard</span>
                      {this.state.open5 ? (<img src={arrowup} width={10} height={10} style={{marginLeft:'5px'}} />): (<img src={arrow} width={10} height={10} style={{marginLeft:'5px'}} />)}
                    </NavLink>
                    </ul>
                    {this.state.open5 && item.submenu ? (
                      <span>
                          {item.submenu.map((inner)=>{
                             return  this.menu(permission2,inner.title) && (
                              <ul  style={{paddingLeft: '30px'}} id="dpreport" className="item" >
                                <NavLink  tag={RouteNavLink} to={inner.link} activeClassName="bg" style={{color:'white'}}>
                                <img src={invoiceicon} width={17} height={17} /> <span style={{marginLeft:'10px'}} className="submenuText">{inner.title}</span>
                                </NavLink>
                              </ul>
                             )
                          })}
                        </span>
                    ) : (<div></div>)}
                  </Nav>

            )
          }

          else if (item.name=='Configuration'){
            return  this.menu(permission2,item.name) && (
           
              <Nav  className="nav--no-borders flex-column">
                
                <ul onClick={this.toggle_resources} className="item">
                <NavLink style={{color:'white', cursor: "pointer"}}>
                <img src={billicon} width={17} height={17} style={{marginLeft:'10px', }} /><span style={{ marginLeft:'12px'}} className="menuText" id="prs-icon-text">Configuration</span> {this.state.open7 ? (<img src={arrowup} width={10} height={10} style={{marginLeft:'5px'}} />): (<img src={arrow} width={10} height={10} style={{marginLeft:'5px'}} />)}
                </NavLink>
                </ul>
                {this.state.open7 && item.submenu ? (
                  <span>
                  {item.submenu.map((inner)=>{
                     return  this.menu(permission2,inner.title) && (
                      <ul  style={{paddingLeft: '30px'}} id="dpreport" className="item" >
                        <NavLink  tag={RouteNavLink} to={inner.link} activeClassName="bg" style={{color:'white'}}>
                        <img src={invoiceicon} width={17} height={17} /> <span style={{ marginLeft:'10px'}} className="submenuText">{inner.title}</span>
                        </NavLink>
                      </ul>
                     )
                  })}
                </span>
                ) : (<div></div>)}

              </Nav>
            )
        }
          
          // else if (item.name=='Configuration') {
          //   return  this.menu(permission2,item.name) && (
             
          //     <Nav  className="nav--no-borders flex-column">
                
          //         <span>
          //         <ul onClick={this.toggle_resources} className="item">
          //       <NavLink style={{color:'white',  cursor:'pointer'}}>
          //       <img src={billicon} width={17} height={17} style={{marginLeft:'10px'}} /><span style={{fontSize:15, marginLeft:'12px'}} id="icon-text">Configuration</span> 
          //       {this.state.open7 ? (<img src={arrowup} width={10} height={10} style={{marginLeft:'5px'}} />): (<img src={arrow} width={10} height={10} style={{marginLeft:'5px'}} />)}
                
          //       </NavLink>
          //       </ul>
          //       {this.state.open7 ? (
          //       <>
                
          //       <ul  style={{paddingLeft: '30px'}} id="item_resource_1" className="item" >
          //         <NavLink style={{color:'white', cursor:'pointer'}} tag={RouteNavLink} to="/Resources" activeClassName="bg">
          //         <img src={dashboardicon} width={17} height={17} /> <span style={{fontSize:15, marginLeft:'10px'}}>Permissions</span>
          //         </NavLink>
          //       </ul> 
                
          //       <ul  style={{paddingLeft: '30px'}} id="item_resource_2" className="item" >
          //         <NavLink style={{color:'white', cursor:'pointer'}} tag={RouteNavLink} to="/Modules" activeClassName="bg">
          //         <img src={dashboardicon} width={17} height={17} /> <span style={{fontSize:15, marginLeft:'10px'}}>Modules</span>
          //         </NavLink>
          //       </ul>
          //       {/* <ul  style={{paddingLeft: '70px'}} id="item_role_4" className="item" >
          //         <NavLink tag={RouteNavLink} to="/Assign_Res_to_Mod" activeClassName="bg" style={{color:'white'}}>
          //           <span style={{fontSize:14, marginLeft:'10px'}}>Assign Resources to Modules</span>
          //         </NavLink>
          //       </ul> */}
          //       <ul  style={{paddingLeft: '30px'}} id="item_role_4" className="item" >
          //         <NavLink style={{color:'white', cursor:'pointer'}} tag={RouteNavLink} to="/Assign_Res_to_Mod" activeClassName="bg">
          //         <img src={dashboardicon} width={17} height={17} /> <span style={{fontSize:15, marginLeft:'10px'}}>Assign Permissions to Modules </span>
          //         </NavLink>
          //       </ul>
          //       {/* <ul  style={{paddingLeft: '30px'}} id="item_resource_3" className="item" >
          //         <NavLink style={{color:'white', cursor:'pointer'}} tag={RouteNavLink} to="/ModToRol" activeClassName="bg">
          //         <img src={dashboardicon} width={17} height={17} /> <span style={{fontSize:15, marginLeft:'10px'}}>Assign Modules to Roles</span>
          //         </NavLink>
          //       </ul> */}
          //       {/* <ul  style={{paddingLeft: '70px'}} id="item_role_3" className="item" >
          //         <NavLink tag={RouteNavLink} to="/Assign_Mod_to_Rol" activeClassName="bg" style={{color:'white'}}>
          //           <span style={{fontSize:14, marginLeft:'10px'}}>Assign Modules to Roles </span>
          //         </NavLink>
          //       </ul>
          //        */}
          //       </>) : (<div></div>)}
                
            
                
          //       </span>
               
                
          //     </Nav>


          //   )}
          
          else if (item.name=='Administration') {

            return  this.menu(permission2,item.name) && (
             
              <Nav  className="nav--no-borders flex-column">
                
                <ul onClick={this.toggle_administration} className="item">
                <NavLink style={{color:'white'}}>
                <img src={billicon} width={17} height={17} style={{marginLeft:'10px'}} /><span style={{ marginLeft:'12px'}} className="menuText" id="pr-icon-text">Administration</span> {this.state.open6 ? (<img src={arrowup} width={10} height={10} style={{marginLeft:'5px'}} />): (<img src={arrow} width={10} height={10} style={{marginLeft:'5px'}} />)}
                </NavLink>
                </ul>
                {this.state.open6 && item.submenu ? (

                  <span>
                    {item.submenu.map((inner)=>{
                        if(inner.title == "Roles and Responsibilities"){
                          return this.menu(permission2, inner.title) && (
                            <span>
                              <ul  style={{paddingLeft: '30px'}} onClick={this.toggle_rr} id="item0" className="item" >
                                <NavLink style={{color:'white', cursor:'pointer'}}>
                                <img src={invoiceicon} width={17} height={17} /> <span style={{ marginLeft:'10px'}} className="submenuText">Roles and Responsibilities</span>{this.state.open8 ? (<img src={arrowup} width={10} height={10} style={{marginLeft:'5px'}} />): (<img src={arrow} width={10} height={10} style={{marginLeft:'5px'}} />)}
                                </NavLink>
                              </ul>
                              <>
                              {inner.submenu  && this.state.open8 ? (
                                inner.submenu.map((third) =>{
                                  return  this.menu(permission2,third.title) && (
                                    <ul  style={{paddingLeft: '70px'}} id="item1" className="item" >
                                      <NavLink  tag={RouteNavLink} to={third.link} activeClassName="bg" style={{color:'white'}}>
                                        <span style={{fontSize:14, marginLeft:'10px'}}>{third.title}</span>
                                      </NavLink>
                                    </ul>
                                  )
                                })
                              ):(
                                null
                              ) }
                              </>
                            </span>
    
                          )
                        }
                        else{
                          return  this.menu(permission2,inner.title) && (
                            <ul  style={{paddingLeft: '30px'}} id="dpreport" className="item" >
                              <NavLink  tag={RouteNavLink} to={inner.link} activeClassName="bg" style={{color:'white'}}>
                              <img src={invoiceicon} width={17} height={17} /> <span style={{ marginLeft:'10px'}} className="submenuText">{inner.title}</span>
                              </NavLink>
                            </ul>
                           )
                        }
                    })}
                </span>
                ) : (<div></div>)}
                
              </Nav>


            )}
          // else if (item.name=='Administration') {
          //   return  this.menu(permission2,item.name) && (
             
          //     <Nav  className="nav--no-borders flex-column">
                  
              
          //         <span>
          //         <ul onClick={this.toggle_administration} className="item">
          //       <NavLink style={{color:'white',  cursor:'pointer'}}>
          //       <img src={billicon} width={17} height={17} style={{marginLeft:'10px'}} /><span style={{fontSize:15, marginLeft:'12px'}} id="icon-text">Administration</span> 
          //       {this.state.open6 ? (<img src={arrowup} width={10} height={10} style={{marginLeft:'5px'}} />): (<img src={arrow} width={10} height={10} style={{marginLeft:'5px'}} />)}
                
          //       </NavLink>
          //       </ul>
          //       {this.state.open6 ? (
          //       <><ul  style={{paddingLeft: '30px'}} onClick={this.toggle_rr} id="item_role_0" className="item" >
          //         <NavLink style={{color:'white', cursor:'pointer'}}>
          //         <img src={invoiceicon} width={17} height={17} /> <span style={{fontSize:15, marginLeft:'10px'}}>Roles and Responsibilities</span>{this.state.open8 ? (<img src={arrowup} width={10} height={10} style={{marginLeft:'5px'}} />): (<img src={arrow} width={10} height={10} style={{marginLeft:'5px'}} />)}
          //         </NavLink>
          //       </ul>
          //       {this.state.open8 ? (
          //         <>
          //         <ul  style={{paddingLeft: '70px'}} id="item_role_1" className="item" >
          //         <NavLink  tag={RouteNavLink} to="/Roles" activeClassName="bg" style={{color:'white'}}>
          //           <span style={{fontSize:14, marginLeft:'10px'}}>Roles</span>
          //         </NavLink>
          //       </ul>

          //       <ul  style={{paddingLeft: '70px'}} id="item_role_2" className="item" >
          //         <NavLink tag={RouteNavLink} to="/Assign_Res_to_Rol" activeClassName="bg" style={{color:'white'}}>
          //           <span style={{fontSize:14, marginLeft:'10px'}}>Assign Permissions</span>
          //         </NavLink>
          //       </ul>
          //       {/* <ul  style={{paddingLeft: '70px'}} id="item_role_3" className="item" >
          //         <NavLink tag={RouteNavLink} to="/Assign_Mod_to_Rol" activeClassName="bg" style={{color:'white'}}>
          //           <span style={{fontSize:14, marginLeft:'10px'}}>Assign Modules to Roles </span>
          //         </NavLink>
          //       </ul> */}
              
          //       {/* <ul  style={{paddingLeft: '70px'}} id="item_role_5" className="item" >
          //         <NavLink tag={RouteNavLink} to="/Staff" activeClassName="bg" style={{color:'white'}}>
          //           <span style={{fontSize:14, marginLeft:'10px'}}>Staff Details</span>
          //         </NavLink>
          //       </ul> */}
          //       {/* <ul  style={{paddingLeft: '70px'}} id="item_role_6" className="item" >
          //         <NavLink tag={RouteNavLink} to="/UserAssign" activeClassName="bg" style={{color:'white'}}>
          //           <span style={{fontSize:14, marginLeft:'10px'}}>User Assignment</span>
          //         </NavLink>
          //       </ul>  */}
                
          //       </>
          //       ) : (<div></div>)}
                
  
          //       {/* <ul  style={{paddingLeft: '30px'}} id="item_role_7" className="item" >
          //         <NavLink style={{color:'white', cursor:'pointer'}} tag={RouteNavLink} to="/Password_reset" activeClassName="bg">
          //         <img src={dashboardicon} width={17} height={17} /> <span style={{fontSize:15, marginLeft:'10px'}}>Password Reset</span>
          //         </NavLink>
          //       </ul> */}

          //       <ul  style={{paddingLeft: '30px'}} id="item_role_9" className="item" >
          //         <NavLink style={{color:'white', cursor:'pointer'}} tag={RouteNavLink} to="/Staff" activeClassName="bg">
          //         <img src={dashboardicon} width={17} height={17} /> <span style={{fontSize:15, marginLeft:'10px'}}>Staff Details</span>
          //         </NavLink>
          //       </ul>

          //       <ul  style={{paddingLeft: '30px'}} id="item_role_8" className="item" >
          //         <NavLink style={{color:'white', cursor:'pointer'}} tag={RouteNavLink} to="/ViewChangeHistory" activeClassName="bg">
          //         <img src={dashboardicon} width={17} height={17} /> <span style={{fontSize:15, marginLeft:'10px'}}>View Change History</span>
          //         </NavLink>
          //       </ul>
                
                
          //       </>) : (<div></div>)}
                
            
                
          //       </span>

                
          //     </Nav>


          // )}
            
          // else if (item.name == 'O_M_Dashboard') {
          //   return this.menu(permission2, item.name) && (

          //     <Nav className="nav--no-borders flex-column">

          //       <ul onClick={this.toggle_alert} className="item">
          //         <NavLink style={{ color: 'white' }}>
          //           <img src={billicon} width={17} height={17} style={{ marginLeft: '10px' }} />
          //           <span style={{ marginLeft: '12px', cursor: "pointer" }} className="menuText" id="alert-icon-text"> O&M Alert Dashboard</span>
          //           {this.state.open5 ? (<img src={arrowup} width={10} height={10} style={{ marginLeft: '5px' }} />) : (<img src={arrow} width={10} height={10} style={{ marginLeft: '5px' }} />)}
          //         </NavLink>
          //       </ul>
          //       {this.state.open5 ? (
          //         <>
          //         <ul style={{ paddingLeft: '30px' }} id="alert_item5" className="item" >
          //             <NavLink tag={RouteNavLink} to="/live_O_M_Error" activeClassName="bg" style={{ color: 'white' }}>
          //               <img src={invoiceicon} width={17} height={17} /> <span style={{ fontSize: 15, marginLeft: '10px' }}>Live Errors & Warnings</span>
          //             </NavLink>
          //           </ul>
          //           <ul style={{ paddingLeft: '30px' }} id="alert_item1" className="item" >
          //             <NavLink tag={RouteNavLink} to="/O_M_Error" activeClassName="bg" style={{ color: 'white' }}>
          //               <img src={invoiceicon} width={17} height={17} /> <span style={{ fontSize: 15, marginLeft: '10px' }}>Errors & Warnings</span>
          //             </NavLink>
          //           </ul>

          //           <ul style={{ paddingLeft: '30px' }} id="alert_item2" className="item" >
          //             <NavLink tag={RouteNavLink} to="/O_M_Dashboard" activeClassName="bg" style={{ color: 'white' }}>
          //               <img src={invoiceicon} width={17} height={17} /> <span style={{ fontSize: 15, marginLeft: '10px' }}>Normal & Information</span>
          //             </NavLink>
          //           </ul>

          //           <ul style={{ paddingLeft: '30px' }} id="alert_item3" className="item" >
          //             <NavLink tag={RouteNavLink} to="/O_M_History" activeClassName="bg" style={{ color: 'white' }}>
          //               <img src={invoiceicon} width={17} height={17} /> <span style={{ fontSize: 15, marginLeft: '10px' }}>History</span>
          //             </NavLink>
          //           </ul>

          //           <ul style={{ paddingLeft: '30px' }} id="alert_item4" className="item" >
          //             <NavLink tag={RouteNavLink} to="/O_M_Parameters" activeClassName="bg" style={{ color: 'white' }}>
          //               <img src={addinvoice} width={17} height={17} /> <span style={{ fontSize: 15, marginLeft: '10px' }}>Parameters</span>
          //             </NavLink>
          //           </ul>

          //           <ul style={{ paddingLeft: '30px' }} id="alert_item4" className="item" >
          //             <NavLink tag={RouteNavLink} to="/O_M_Groups" activeClassName="bg" style={{ color: 'white' }}>
          //               <img src={addinvoice} width={17} height={17} /> <span style={{ fontSize: 15, marginLeft: '10px' }}>Groups</span>
          //             </NavLink>
          //           </ul>
          //         </>
          //          ) : (<div></div>)}
          //          </Nav>
          //      )}

                // else if (item.name=='QR') {
                //   return  this.menu(permission2,item.name) && (
                   
                //     <Nav  className="nav--no-borders flex-column">
                      
                //       <ul onClick={this.toggle_qr} className="QRitem">
                //       <NavLink style={{color:'white'}}>
                //         <img src={qricon} width={17} height={17} style={{marginLeft:'10px'}} />
                //         <span style={{fontSize:15, marginLeft:'12px', cursor:"pointer"}} id="alert-icon-text">QR System</span>
                //         {this.state.open6 ? (<img src={arrowup} width={10} height={10} style={{marginLeft:'5px'}} />): (<img src={arrow} width={10} height={10} style={{marginLeft:'5px'}} />)}
                //       </NavLink>
                //       </ul>
                //       {this.state.open6 ? (
                //         <>
                //         <ul  style={{paddingLeft: '30px'}} id="Qr_item1" className="QRitem" >
                //         <NavLink  tag={RouteNavLink} to="/Checkin" activeClassName="bg" style={{color:'white'}}>
                //         <img src={invoiceicon} width={17} height={17} /> <span style={{fontSize:15, marginLeft:'10px'}}>Check-in / Check-out</span>
                //         </NavLink>
                //       </ul>
                      
                //       <ul  style={{paddingLeft: '30px'}} id="Qr_item2" className="QRitem" >
                //         <NavLink  tag={RouteNavLink} to="/QR_Generate" activeClassName="bg" style={{color:'white'}}>
                //         <img src={invoiceicon} width={17} height={17} /> <span style={{fontSize:15, marginLeft:'10px'}}>Generate QR</span>
                //         </NavLink>
                //       </ul>
  
                //       <ul  style={{paddingLeft: '30px'}} id="Qr_item3" className="QRitem" >
                //         <NavLink tag={RouteNavLink} to="/Current_QR" activeClassName="bg" style={{color:'white'}}>
                //         <img src={invoiceicon} width={17} height={17} /> <span style={{fontSize:15, marginLeft:'10px'}}>Who is using QR</span>
                //         </NavLink>
                //       </ul>

                //       <ul  style={{paddingLeft: '30px'}} id="Qr_item4" className="QRitem" >
                //         <NavLink tag={RouteNavLink} to="/Attendance_Report" activeClassName="bg" style={{color:'white'}}>
                //         <img src={addinvoice} width={17} height={17} /> <span style={{fontSize:15, marginLeft:'10px'}}>Attendance Report</span>
                //         </NavLink>

                //         </ul>
                //         <ul  style={{paddingLeft: '30px'}} id="Qr_item4" className="QRitem" >
                //         <NavLink tag={RouteNavLink} to="/QR_ActiveDisactive" activeClassName="bg" style={{color:'white'}}>
                //         <img src={addinvoice} width={17} height={17} /> <span style={{fontSize:15, marginLeft:'10px'}}>Active/Disactive QR </span>
                //         </NavLink>

                //         </ul>

                //         <ul  style={{paddingLeft: '30px'}} id="Qr_item4" className="QRitem" >
                //         <NavLink tag={RouteNavLink} to="/Xero_Report" activeClassName="bg" style={{color:'white'}}>
                //         <img src={addinvoice} width={17} height={17} /> <span style={{fontSize:15, marginLeft:'10px'}}>Xero Report</span>
                //         </NavLink>



                //         <ul onClick={this.toggle_qr_report} className="QRitem">
                //       <NavLink style={{color:'white'}}>
                //         {/* <img src={qricon} width={17} height={17} style={{marginLeft:'10px'}} /> */}
                //         <span style={{fontSize:15, marginLeft:'12px', cursor:"pointer"}} id="alert-icon-text">QR Reports</span>
                //         {this.state.openReport ? (<img src={arrowup} width={10} height={10} style={{marginLeft:'5px'}} />): (<img src={arrow} width={10} height={10} style={{marginLeft:'5px'}} />)}
                //       </NavLink>
                //       </ul>

                //         <Nav  className="nav--no-borders flex-column">
                //       {this.state.open6 ? (
                //         <>
                //       </>
                //       ) : (<div></div>)}
                //     </Nav>
                //       </ul></>
                //       ) : (<div></div>)}
                //     </Nav>
                //   )
                
                
                
                
                // }
                  
    

          else {
            return this.menu(permission2, item.name) && (
              <Nav className="nav--no-borders flex-column">
                <SidebarNavItem key={idx} item={item} />
              </Nav>
            )
          }
        })}

      </div>
    )
  }
}
SidebarNavItem.propTypes = {
  /**
   * Whether to hide the logo text, or not.
   */
  hideLogoText: PropTypes.bool
};

SidebarNavItem.defaultProps = {
  hideLogoText: false
};
export default SidebarNavItems;
