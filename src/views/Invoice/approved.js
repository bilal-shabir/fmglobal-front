import React from "react";
import { Modal, Button } from "react-bootstrap";
import {
  Card
} from "shards-react";
import { Container, Row, Col } from "shards-react";
import { URL2, DKEY } from "../../constants";
import PageTitle from "../../components/common/PageTitle";
import L from "../../components/components-overview/loader";
import "../../assets/style.css";
import "react-data-table-component-extensions/dist/index.css";
import DataTable from "react-data-table-component";
import ReactExport from "react-data-export";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Can } from "@casl/react";
import setPermissions from "../defineAbility";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

let controller

class Approved_Invoices extends React.Component {
  constructor(props) {
    super(props);
    const userIs_logged = localStorage.getItem("is_logged");
    if (userIs_logged != 1) {
      this.props.history.push("/login");
    }
    this.state = {
      ability: null,
      isLoaded: false,
      show: false,
      show_create: false,
      show_data: false,
      show_billcustomer: false,
      billingData: null,
      data: [],
      data1: [],
      invoice: [],
      devices: [],
      customers: [],
      customerProject: [],
      project_id: null,
      previous_dues: null,
      companies: [],
      projects: [],
      billing_month: [],
      invoice_id: null,
      cr_approval: false,
      customStyles: {
        headCells: {
          style: {
            backgroundColor: "#BDAC37",
            color: "white"
          }
        }
      },
      columns: [
        {
          name: "Device",
          selector: "device_sn",
          sortable: true
        },
        {
          name: "Production Date",
          selector: row => this.abc2(row.production_date),
          sortable: true,
          width: "150px"
        },
        {
          name: "Production Generated (kWh)",
          selector: row => parseFloat(row.production_generated).toFixed(5),
          sortable: true
        },
        {
          name: "Invoice Number",
          selector: "invoice_invc_number",
          sortable: true
        },
        {
          name: "Device Description",
          selector: "device_desc",
          sortable: true
        },
        {
          name: "Customer",
          selector: "invoice_project_customer_name",
          sortable: true
        },
        {
          name: "Project",
          selector: "invoice_project_name",
          sortable: true
        }
      ]
    };
    this.handleShowCreate = this.handleShowCreate.bind(this);
  }

  async componentDidMount() {
    require("../../utils").checkpermision("Approved");

    controller = new AbortController();
    const signal = controller.signal;
    await fetch(URL2+'getPermissions',{
      headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json',

       },
       credentials: 'include',
       signal
    }).then(response => response.json())
    .then((json)=>{
      // console.log("permissions", json)
      const ability = setPermissions(json);
      // console.log("permissions",ability)
      this.setState({
        ability:ability
      })
    })
    // let permission = localStorage.getItem("permissions");
    // var CryptoJS = require("crypto-js");
    // var bytes = CryptoJS.AES.decrypt(permission, DKEY);
    // var permissions = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    // // console.log(permissions)
    // if (
    //   permissions.find(
    //     ({ resource }) => resource.name === "CR_invoice_approval"
    //   )
    // ) {
    //   this.setState({
    //     cr_approval: true
    //   });
    // }
    this.getData();
  }
  async getData() {
    let url = new URL(URL2 + `invoice/getInvoices`);

    //Add a second foo parameter.
    url.searchParams.append("project_name", "");
    url.searchParams.append("customer_name", "");
    url.searchParams.append("approved_by_operation", "");
    url.searchParams.append("approved_by_finance", "");
    url.searchParams.append("billing_month", "");
    url.searchParams.append("status", "");

    controller = new AbortController();
        const signal = controller.signal;
    await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
     
      },
      credentials: "include",
      signal
    })
      .then(response => response.json())
      .then(response => {
        if (response.statusCode == 404 || response.statusCode == 401 || response.statusCode == 500 || response.statusCode == 403 || response.statusCode == 400) { 
          throw Error(response.statusText)        
        }
        else{
           //   console.log(response)
        const invoices = response.filter(
          invoice => invoice.invoice_status.name == "Approved"
        );
        var companies = [];
        for (let index = 0; index < invoices.length; index++) {
          companies[index] = invoices[index].customer.name;
        }
        const uniq_company = [...new Set(companies)];
        var projects = [];
        for (let index = 0; index < invoices.length; index++) {
          projects[index] = invoices[index].project.name;
        }
        const uniq_projects = [...new Set(projects)];
        const billing_months = [];
        for (let index = 0; index < invoices.length; index++) {
          billing_months[index] = invoices[index].billing_month;
        }
        const uniq_months = [...new Set(billing_months)];

        // console.log(invoices)
        this.setState({
          billing_months: uniq_months,
          projects: uniq_projects,
          companies: uniq_company,
          isLoaded: true,
          data: invoices,
          data1: invoices
        });
        } 
      })
      .catch((e) => {
        // console.log(e)  
        toast.error('Something went wrong, invoices not retrieved', {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            });
      });

    fetch(URL2 + "auth-customer-role/getCustomer", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",

      },
      credentials: "include",
      signal
    })
      .then(response => response.json())
      .then(response => {
        if (response.statusCode == 404 || response.statusCode == 401 || response.statusCode == 500 || response.statusCode == 403 || response.statusCode == 400) { 
          throw Error(response.statusText)        
        }
        else{
          this.setState({
            customers: response
          });
          this.setState({
            columnsInvoices: [
              {
                name: <span>Invoice Number</span>,
                selector: row => row.invc_number
              },
              {
                name: (
                  <span>
                    Customer Name{" "}
                    <select
                      id="customer"
                      style={{
                        width: "37px",
                        borderRadius: "5px",
                        fontSize: "10px",
                        marginLeft: "3px",
                        cursor: "pointer"
                      }}
                      onChange={this.projectfilter}
                    >
                      <option value="" disabled selected>
                        Filter
                      </option>
                      {this.state.companies.map(company => (
                        <option key={company} value={company}>
                          {company}
                        </option>
                      ))}
                    </select>
                  </span>
                ),
                selector: row => row.customer.name
              },
      
              {
                name: (
                  <span>
                    Project Name{" "}
                    <select
                      id="p_name"
                      style={{
                        width: "37px",
                        borderRadius: "5px",
                        fontSize: "10px",
                        marginLeft: "3px",
                        cursor: "pointer"
                      }}
                      onChange={this.projectfilter}
                    >
                      <option value="" disabled selected>
                        Filter
                      </option>
                      {this.state.projects.map(project => (
                        <option key={project} value={project}>
                          {project}
                        </option>
                      ))}
                    </select>
                  </span>
                ),
                selector: row => row.project.name
              },
              {
                name: <span>Created by</span>,
                selector: row => row.created_by.name
              },
              {
                name: <span>Created on</span>,
                selector: row => this.abc2(row.created_at)
              },
              {
                name: (
                  <span>
                    Operations Approval{" "}
                    <select
                      id="o_approval"
                      style={{
                        width: "37px",
                        borderRadius: "5px",
                        fontSize: "10px",
                        marginLeft: "3px",
                        cursor: "pointer"
                      }}
                      onChange={this.projectfilter}
                    >
                      <option value="" disabled selected>
                        Filter
                      </option>
                      <option key={true} value={true}>
                        &#x2714;
                      </option>
                      <option key={false} value={false}>
                        &#x274C;
                      </option>
                    </select>
                  </span>
                ),
                selector: row =>
                  row.approved_by_operation ? (
                    <span>&#x2714;</span>
                  ) : (
                    <span>&#x274C;</span>
                  ),
                center: true
              },
              {
                name: (
                  <span>
                    Finance Approval{" "}
                    <select
                      id="f_approval"
                      style={{
                        width: "37px",
                        borderRadius: "5px",
                        fontSize: "10px",
                        marginLeft: "3px",
                        cursor: "pointer"
                      }}
                      onChange={this.projectfilter}
                    >
                      <option value="" disabled selected>
                        Filter
                      </option>
                      <option key={true} value={true}>
                        &#x2714;
                      </option>
                      <option key={false} value={false}>
                        &#x274C;
                      </option>
                    </select>
                  </span>
                ),
                selector: row =>
                  row.approved_by_finance ? (
                    <span>&#x2714;</span>
                  ) : (
                    <span>&#x274C;</span>
                  ),
                center: true
              },
              {
                name: (
                  <span>
                    Billing Month
                    <select
                      id="b_month"
                      style={{
                        width: "37px",
                        borderRadius: "5px",
                        fontSize: "10px",
                        marginLeft: "3px",
                        cursor: "pointer"
                      }}
                      onChange={this.projectfilter}
                    >
                      <option value="" disabled selected>
                        Filter
                      </option>
                      {this.state.billing_months.map(month => (
                        <option key={month} value={month}>
                          {month}
                        </option>
                      ))}
                    </select>
                  </span>
                ),
                selector: row => row.billing_month,
                center: true
              },
              {
                name: <span>Status</span>,
                selector: row => (
                  <span style={{ padding: "10px" }}>
                    {row.invoice_status.name}
                  </span>
                ),
                center: true
              },
              {
                name: <span>Actions</span>,
                selector: row => (
                  <Can I="read" a="/invoice/getInvoice/:id/" ability={this.state.ability}>
                  <button
                    type="button"
                    
                    onClick={() => this.handleShow(row.id)}
                    
                  >
                    View Details
                  </button>
                  </Can>
                ),
                center: true
              }
            ]
          });
        }
        //   console.log(response)
       
      })
      .catch((e) => {
        // console.log(e)  
        toast.error('Something went wrong, customers not retrieved', {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            });
      });
   
  }
  handleShowCreate() {
    this.setState({
      show_create: true
    });
  }
  handleProjectNameChange = event => {
    this.setState({
      project_id: event.target.value
    });
    controller = new AbortController();
        const signal = controller.signal;
    fetch(URL2 + "project-device/getDevices/" + event.target.value, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
      signal
    })
      .then(response => response.json())
      .then(response => {
        //   console.log(response)
        const selectedProject = this.state.customerProject.find(
          project => project.id == this.state.project_id
        );
        this.setState({
          devices: response,
          counter: response.length,
          selectedProject: selectedProject
        });
      });
  };
  handleCustomerNameChange = event => {
    // console.log(event.target.value);
    this.setState({
      customer_id: event.target.value
    });
    controller = new AbortController();
        const signal = controller.signal;
    fetch(URL2 + "project/getProjects/" + event.target.value, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
      signal
    })
      .then(response => response.json())
      .then(response => {
        const selected = this.state.customers.find(
          customer => customer.id == this.state.customer_id
        );
        const selectedcustomer = selected.customer;
        this.setState({
          customerProject: response,
          selectedCustomer: selectedcustomer
        });
      });
  };
  create_invoice = () => {
    var x = document.getElementById("snackbar_invc");
    // Add the "show" class to DIV
    x.className = "show";
    // After 3 seconds, remove the show class from DIV
    setTimeout(function() {
      x.className = x.className.replace("show", "");
    }, 3000);
    this.setState({
      isLoaded: false
    });
    this.getData();
    this.handleCloseCreate();
  };

  handleShow = id => {
    this.setState({
      invoice_id: id
    });
    controller = new AbortController();
        const signal = controller.signal;
    fetch(URL2 + "invoice/getInvoice/" + id, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
      signal
    })
      .then(response => response.json())
      .then(response => {
        if (response.statusCode == 404 || response.statusCode == 401 || response.statusCode == 500 || response.statusCode == 403 || response.statusCode == 400) { 
          throw Error(response.statusText)        
        }
        else{
          //console.log(response)
          const count = [];
          count.push(response.invoice);
          //console.log(count)
          this.setState({
            invoice: count,
            devices: response.devices,
            show: true,
          });
        }
      })
      .catch((e) => {
        // console.log(e)  
        toast.error('Something went wrong, invoice not retrieved', {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            });
      });
    this.setState({
      invoice: [],
      devices: []
    });
  };

  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  handleClose = () => {
    this.setState({ show: false });
  };
  handleCloseCreate = () => {
    this.setState({ show_create: false });
  };

  convert(date) {
    var time = Date.parse(date);

    var d = new Date(time);
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const year = d.getFullYear();

    return day + "/" + month + "/" + year;
  }
  abc(date) {
    var time = Date.parse(date);
    var date1 = new Date(time);

    let d = this.addZero(date1.getDate());
    let m = this.addZero(date1.getMonth() + 1);
    let y = this.addZero(date1.getFullYear());

    let time1 = y + "/" + m + "/" + d;
    return time1;
  }
  abc2(date) {
    var time = Date.parse(date);
    var date1 = new Date(time);

    let d = this.addZero(date1.getDate());
    let m = this.addZero(date1.getMonth() + 1);
    let y = this.addZero(date1.getFullYear());

    let time1 = y + "-" + m + "-" + d;
    return time1;
  }
  addZero(i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  }
  projectfilter = () => {
    // alert(document.getElementById("o_approval").value)

    let url = new URL(URL2 + `invoice/getInvoices`);
    //Add a second foo parameter.
    url.searchParams.append(
      "project_name",
      document.getElementById("p_name").value
    );
    url.searchParams.append(
      "customer_name",
      document.getElementById("customer").value
    );
    url.searchParams.append(
      "approved_by_operation",
      document.getElementById("o_approval").value
    );
    url.searchParams.append(
      "approved_by_finance",
      document.getElementById("f_approval").value
    );
    url.searchParams.append(
      "billing_month",
      document.getElementById("b_month").value
    );
    // url.searchParams.append('status', document.getElementById("status").value);

    controller = new AbortController();
        const signal = controller.signal;
    fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
      signal
    })
      .then(response => response.json())
      .then(response => {
        if (response.statusCode == 404 || response.statusCode == 401 || response.statusCode == 500 || response.statusCode == 403 || response.statusCode == 400) { 
          throw Error(response.statusText)        
        }
        else{
          const invoices = response.filter(
            invoice => invoice.invoice_status.name == "Approved"
          );
          this.setState({
            data: invoices,
            data1: invoices
          });
        }
        
      })
      .catch((e) => {
        // console.log(e)  
        toast.error('Something went wrong, invoices not filtered', {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            });
      });
  }
  resetfilters = () => {
    if (this.state.data.length != 0) {
      document.getElementById("customer").selectedIndex = 0; //0 = option 1
      document.getElementById("p_name").selectedIndex = 0; //0 = option 1
      document.getElementById("f_approval").selectedIndex = 0; //0 = option 1
      document.getElementById("o_approval").selectedIndex = 0; //0 = option 1
      // document.getElementById("status").selectedIndex = 0; //0 = option 1
      document.getElementById("b_month").selectedIndex = 0; //0 = option 1
    }

    document.getElementById("search").value = ''
    controller = new AbortController();
        const signal = controller.signal;
    fetch(URL2 + "invoice/getInvoices", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
      signal
    })
      .then(response => response.json())
      .then(response => {
        if (response.statusCode == 404 || response.statusCode == 401 || response.statusCode == 500 || response.statusCode == 403 || response.statusCode == 400 ) { 
          throw Error(response.statusText)        
        }
        else{
          var companies = [];
        for (let index = 0; index < response.length; index++) {
          companies[index] = response[index].customer.name;
        }
        const uniq_company = [...new Set(companies)];
        var projects = [];
        for (let index = 0; index < response.length; index++) {
          projects[index] = response[index].project.name;
        }
        const uniq_projects = [...new Set(projects)];
        const invoices = response.filter(
          invoice => invoice.invoice_status.name == "Approved"
        );
        this.setState({
          projects: uniq_projects,
          companies: uniq_company,
          data: invoices,
          data1: invoices
        });
        }
        //   console.log(response)
      })
      .catch((e) => {
        // console.log(e)  
        toast.error('Something went wrong, filter reset failed', {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            });
      });
  }
  billcustomer = async (id, action) => {
    controller = new AbortController();
        const signal = controller.signal;
    var previous_dues
    if(action){
      if (!document.getElementById("previous_dues").value) {
        toast.info('Please specify previous dues for invoice top be billed', {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          });
        return;
      }
      else{
        previous_dues = document.getElementById("previous_dues").value;
      }
      
    }

    await fetch(
      URL2 + `invoice/CustomerRelationApprovalForInvoice/${id}/${action}`,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        method: "POST",
        mode: "cors",
        signal,
        body: JSON.stringify({ previous_dues: previous_dues })
      }
    )
    .then(response => response.json())
    .then(response => {
      if (response.statusCode == 404 || response.statusCode == 401 || response.statusCode == 500 || response.statusCode == 403 || response.statusCode == 400 ) { 
        throw Error(response.statusText)        
      }
      else{
        if (action) {
          toast.success('Invoice Billed to Customer', {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            });
          let url = new URL(URL2 + `invoice/getInvoices`);
    
          //Add a second foo parameter.
          url.searchParams.append("project_name", "");
          url.searchParams.append("customer_name", "");
          url.searchParams.append("approved_by_operation", "");
          url.searchParams.append("approved_by_finance", "");
          url.searchParams.append("billing_month", "");
          url.searchParams.append("status", "");
           fetch(url, {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            credentials: "include",
            signal
          })
            .then(response => response.json())
            .then(response => {
              if (response.statusCode == 404 || response.statusCode == 401 || response.statusCode == 500  || response.statusCode == 403 || response.statusCode == 400) { 
                throw Error(response.statusText)        
              }
              else{
              //   console.log(response)
              const invoices = response.filter(
                invoice => invoice.invoice_status.name == "Approved"
              );
              var companies = [];
              for (let index = 0; index < invoices.length; index++) {
                companies[index] = invoices[index].customer.name;
              }
              const uniq_company = [...new Set(companies)];
              var projects = [];
              for (let index = 0; index < invoices.length; index++) {
                projects[index] = invoices[index].project.name;
              }
              const uniq_projects = [...new Set(projects)];
              const billing_months = [];
              for (let index = 0; index < invoices.length; index++) {
                billing_months[index] = invoices[index].billing_month;
              }
              const uniq_months = [...new Set(billing_months)];
    
              // console.log(invoices)
              this.setState({
                billing_months: uniq_months,
                projects: uniq_projects,
                companies: uniq_company,
                isLoaded: true,
                data: invoices,
                data1: invoices
              });
            }
            })
            .catch((e) => {
              // console.log(e)  
              toast.error('Something went wrong, invoices not retrieved', {
                  position: "top-center",
                  autoClose: 3000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: false,
                  draggable: true,
                  progress: undefined,
                  });
            });
          this.handleClosebillcustomer();
          this.handleClose();
        } else {
          toast.success('Invoice Rejected', {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            });
          let url = new URL(URL2 + `invoice/getInvoices`);
    
          //Add a second foo parameter.
          url.searchParams.append("project_name", "");
          url.searchParams.append("customer_name", "");
          url.searchParams.append("approved_by_operation", "");
          url.searchParams.append("approved_by_finance", "");
          url.searchParams.append("billing_month", "");
          url.searchParams.append("status", "");
           fetch(url, {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            credentials: "include",
            signal
          })
            .then(response => response.json())
            .then(response => {
              if (response.statusCode == 404 || response.statusCode == 401 || response.statusCode == 500 || response.statusCode == 403 || response.statusCode == 400) { 
                throw Error(response.statusText)        
              }
              else{

              
              //   console.log(response)
              const invoices = response.filter(
                invoice => invoice.invoice_status.name == "Approved"
              );
              var companies = [];
              for (let index = 0; index < invoices.length; index++) {
                companies[index] = invoices[index].customer.name;
              }
              const uniq_company = [...new Set(companies)];
              var projects = [];
              for (let index = 0; index < invoices.length; index++) {
                projects[index] = invoices[index].project.name;
              }
              const uniq_projects = [...new Set(projects)];
              const billing_months = [];
              for (let index = 0; index < invoices.length; index++) {
                billing_months[index] = invoices[index].billing_month;
              }
              const uniq_months = [...new Set(billing_months)];
    
              // console.log(invoices)
              this.setState({
                billing_months: uniq_months,
                projects: uniq_projects,
                companies: uniq_company,
                isLoaded: true,
                data: invoices,
                data1: invoices
              })
            }
            })
            .catch((e) => {
              // console.log(e)  
              toast.error('Something went wrong, invoices not retrieved', {
                  position: "top-center",
                  autoClose: 3000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: false,
                  draggable: true,
                  progress: undefined,
                  });
            });
          this.handleClose();
        }
      }
    })
    .catch((e) => {
      // console.log(e)  
      toast.error('Something went wrong, invoice not billed', {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          });
    });
    

    // setTimeout(function(){ document.location.reload(true) }, 1000);
  };
  flattenObj = ob => {
    // The object which contains the
    // final result
    let result = {};

    // loop through the object "ob"
    for (const i in ob) {
      // We check the type of the i using
      // typeof() function and recursively
      // call the function again
      if (typeof ob[i] === "object" && !Array.isArray(ob[i])) {
        const temp = this.flattenObj(ob[i]);
        for (const j in temp) {
          // Store temp in result
          result[i + "_" + j] = temp[j];
        }
      }

      // Else store ob[i] in result directly
      else {
        result[i] = ob[i];
      }
    }
    return result;
  };
  showbillingdata = async id => {
    controller = new AbortController();
        const signal = controller.signal;
    await fetch(URL2 + "invoice-production/getInvoiceProduction/" + id, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
      signal
    })
      .then(response => response.json())
      .then(response => {
        if (response.statusCode == 404 || response.statusCode == 401 || response.statusCode == 500  || response.statusCode == 403 || response.statusCode == 400) { 
          throw Error(response.statusText)        
        }
        else{
          for (let index = 0; index < response.length; index++) {
            const ob = response[index];
            response[index] = this.flattenObj(ob);
          }
          //   console.log(response)
          this.setState({
            billingData: response,
            show_data: true
          });
        } 
      })
      .catch((e) => {
        // console.log(e)  
        toast.error('Something went wrong, billing data not retrieved', {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            });
      })
  };
  billingdataclose = () => {
    this.setState({
      show_data: false
    });
  };
  handleClosebillcustomer = () => {
    this.setState({
      show_billcustomer: false
    });
  };
  bill_customer = id => {
    controller = new AbortController();
        const signal = controller.signal;
    fetch(URL2 + "invoice/getInvoice/" + id, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
      signal
    })
      .then(response => response.json())
      .then(response => {
        //   console.log(response)
        this.setState({
          previous_dues: response.invoice.previous_dues
        });
      });

    this.setState({
      show_billcustomer: true
    });
  };
  onFilter = e => {
    const key = e.key; // const {key} = event; ES6+
    if (key === "Backspace" || key === "Delete") {
      this.setState({
        isLoaded: false
      });
      const filteredItems = this.state.data1.filter(
        item =>
        JSON.stringify(item.id)
        .toLowerCase()
        .indexOf(e.target.value.toLowerCase()) !== -1 ||
    
      JSON.stringify(item.customer.name)
        .toLowerCase()
        .indexOf(e.target.value.toLowerCase()) !== -1 ||
    
      JSON.stringify(item.project.name)
        .toLowerCase()
        .indexOf(e.target.value.toLowerCase()) !== -1 ||
    
      JSON.stringify(item.created_by.name)
        .toLowerCase()
        .indexOf(e.target.value.toLowerCase()) !== -1 ||
    
      JSON.stringify(item.created_at)
        .toLowerCase()
        .indexOf(e.target.value.toLowerCase()) !== -1 ||
    
      JSON.stringify(item.invc_number)
        .toLowerCase()
        .indexOf(e.target.value.toLowerCase()) !== -1 ||

      JSON.stringify(item.billing_month)
        .toLowerCase()
        .indexOf(e.target.value.toLowerCase()) !== -1 ||
    
      JSON.stringify(item.invoice_status.name)
        .toLowerCase()
        .indexOf(e.target.value.toLowerCase()) !== -1


      );
      // console.log(filteredItems)
      this.setState({
        data: filteredItems,
        isLoaded: true
      });
      // console.log('data',this.state.data)
    } else {
      // console.log(e.target.value)
      this.setState({
        isLoaded: false
      });
      const filteredItems = this.state.data.filter(
        item =>
        JSON.stringify(item.id)
        .toLowerCase()
        .indexOf(e.target.value.toLowerCase()) !== -1 ||
    
      JSON.stringify(item.customer.name)
        .toLowerCase()
        .indexOf(e.target.value.toLowerCase()) !== -1 ||
    
      JSON.stringify(item.project.name)
        .toLowerCase()
        .indexOf(e.target.value.toLowerCase()) !== -1 ||
    
      JSON.stringify(item.created_by.name)
        .toLowerCase()
        .indexOf(e.target.value.toLowerCase()) !== -1 ||
    
      JSON.stringify(item.created_at)
        .toLowerCase()
        .indexOf(e.target.value.toLowerCase()) !== -1 ||
    
      JSON.stringify(item.invc_number)
        .toLowerCase()
        .indexOf(e.target.value.toLowerCase()) !== -1 ||

      JSON.stringify(item.billing_month)
        .toLowerCase()
        .indexOf(e.target.value.toLowerCase()) !== -1 ||
    
      JSON.stringify(item.invoice_status.name)
        .toLowerCase()
        .indexOf(e.target.value.toLowerCase()) !== -1


      );
      // console.log(filteredItems)
      this.setState({
        data: filteredItems,
        isLoaded: true
      });
      // console.log('data',this.state.data)
    }
  };
  render() {
    return (
      <div class="main-content-container container-fluid px-4">
        <Row noGutters className="page-header py-4">
          <PageTitle
            title={"Billing Dashboard"}
            className="text-sm-left mb-3"
          />
        </Row>

        {this.state.isLoaded ? (
          <>
          <Can I="read" a="/invoice/getInvoices/" ability={this.state.ability}>
            <Row style={{marginBottom: '-10px'}}>
              <Col></Col>
              <Col></Col>
              <Col>
                <input
                  style={{ border: "1px solid black" }}
                  class="form-control"
                  id="search"
                  type="text"
                  placeholder="Search..."
                  onKeyUp={this.onFilter}
                ></input>
              </Col>
            </Row>

            <div class="card card-small mb-4" style={{ marginTop: "15px" }}>
              <div
                style={{ display: "flex" }}
                class="  card-header border-bottom"
              >
                <h5 style={{ flex: "8" }} class="m-0 ">
                  Approved Invoices
                  <span
                    style={{
                      fontSize: "9px",
                      marginLeft: "5px",
                      color: "blue",
                      cursor: "pointer"
                    }}
                    onClick={this.resetfilters}
                  >
                    reset filters
                  </span>
                </h5>
                {/* <button className="btn btn-primary" onClick={this.handleShowCreate}>Create</button> */}
              </div>

              <Card small style={{ borderRadius: "0" }}>
                <DataTable
                  columns={this.state.columnsInvoices}
                  data={this.state.data}
                  highlightOnHover={true}
                  style={{ overflow: "wrap" }}
                  sortServer
                  pagination
                  customStyles={this.state.customStyles}
                />
              </Card>
            </div>
            </Can>
          </>
        ) : (
          <L></L>
        )}

        <span>
          <Container fluid className="main-content-container px-4">
            <>
              <div id="snackbar_invc" style={{ marginTop: "45px" }}>
                Invoice Created
              </div>

              <Modal
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                show={this.state.show}
                style={{marginLeft:'6%'}}
              >
                <Modal.Header>
                  <Modal.Title>Invoice Details</Modal.Title>
                  <span>
                  <Can I="read" a="/invoice-production/getInvoiceProduction/:id/" ability={this.state.ability}> 
                    <button

                      onClick={() =>
                        this.showbillingdata(this.state.invoice[0].id)
                      }
                      style={{
                        marginRight: "5px"
               
                      }}
                    >
                      Billing Data
                    </button>
                    </Can>
                    <button  onClick={this.handleClose}>
                      Close
                    </button>
                  </span>
                </Modal.Header>
                <Modal.Body>
                  <form
                    onSubmit={() => this.formsubmit(this.state.invoice[0].id)}
                  >
                    {this.state.invoice.map(invoice => (
                      <ul class="list-group list-group-flush">
                        <li class="list-group-item p-3">
                          <div class="row">
                            <div class="col-sm-12 col-md-6">
                              <h4>Customer Details </h4>
                              {/* <div class="form-group">
                                 <label >Customer ID</label>
                                 <input type="text" class="form-control"  placeholder="Enter customer ID" name="cust-ID" id="cust-ID" defaultValue={invoice.customer.id} disabled style={{backgroundColor: 'white'}} required></input>
                             </div>
                             <div class="form-group">
                                 <label >Project ID</label>
                                 <input type="text" class="form-control"  placeholder="Enter Project ID" name="proj-ID" id="proj-ID" defaultValue={invoice.project.id} disabled style={{backgroundColor: 'white'}} required></input>
                             </div>
                             <div class="form-group">
                                 <label >Customer Reference Number</label>
                                 <input type="text" class="form-control"  placeholder="Enter Year-Customer ID-Project ID" name="INV-crn" id="INV-crn" defaultValue={invoice.invc_crn} disabled style={{backgroundColor: 'white'}} required></input>
                             </div> */}

                              <div class="form-group">
                                <label>Customer Name</label>
                                <input
                                  type="text"
                                  class="form-control"
                                  placeholder="Enter Customer name"
                                  name="cust-name"
                                  id="cust-name"
                                  defaultValue={invoice.customer.name}
                                  required
                                  disabled
                                ></input>
                              </div>
                              <div class="form-group">
                                <label>Project Name</label>
                                <input
                                  type="text"
                                  class="form-control"
                                  placeholder="Enter Project name"
                                  name="proj-name"
                                  id="proj-name"
                                  defaultValue={invoice.project.name}
                                  required
                                  disabled
                                ></input>
                              </div>
                              <div class="form-group">
                                <label>Address Line 1</label>
                                <input
                                  type="text"
                                  class="form-control"
                                  placeholder=""
                                  name="comp-address"
                                  id="comp-address"
                                  defaultValue={
                                    invoice.customer.invoice_address_line_1
                                  }
                                  required
                                  disabled
                                ></input>
                              </div>
                              <div class="form-group">
                                <label>Address Line 2</label>
                                <input
                                  type="text"
                                  class="form-control"
                                  placeholder=""
                                  name="comp-city"
                                  id="comp-city"
                                  defaultValue={
                                    invoice.customer.invoice_address_line_2
                                  }
                                  required
                                  disabled
                                ></input>
                              </div>
                              <div class="form-group">
                                <label>Address Line 3</label>
                                <input
                                  type="text"
                                  class="form-control"
                                  placeholder=""
                                  name="comp-state"
                                  id="comp-state"
                                  defaultValue={
                                    invoice.customer.invoice_address_line_3
                                  }
                                  required
                                  disabled
                                ></input>
                              </div>
                              <div class="form-group">
                                <label>Address Line 4</label>
                                <input
                                  type="text"
                                  class="form-control"
                                  placeholder=""
                                  name="comp-zip"
                                  id="comp-zip"
                                  defaultValue={
                                    invoice.customer.invoice_address_line_4
                                  }
                                  required
                                  disabled
                                ></input>
                              </div>
                              <div class="form-group">
                                <label>Address Line 5</label>
                                <input
                                  type="text"
                                  class="form-control"
                                  placeholder=""
                                  name="comp-zip"
                                  id="comp-zip"
                                  defaultValue={
                                    invoice.customer.invoice_address_line_5
                                  }
                                  required
                                  disabled
                                ></input>
                              </div>
                              <div class="form-group">
                                <label>Address Line 6</label>
                                <input
                                  type="text"
                                  class="form-control"
                                  placeholder=""
                                  name="comp-zip"
                                  id="comp-zip"
                                  defaultValue={
                                    invoice.customer.invoice_address_line_6
                                  }
                                  required
                                  disabled
                                ></input>
                              </div>
                              <div class="form-group">
                                <label>Company Phone</label>
                                <input
                                  type="text"
                                  class="form-control"
                                  placeholder="Enter phone number"
                                  name="comp-phone"
                                  id="comp-phone"
                                  defaultValue={invoice.customer.mobile}
                                  required
                                  disabled
                                ></input>
                              </div>
                              <div class="form-group">
                                <label>Customer Email Address</label>
                                <input
                                  type="email"
                                  class="form-control"
                                  placeholder="Enter email address"
                                  name="comp-email"
                                  id="comp-email"
                                  defaultValue={invoice.customer.email}
                                  required
                                  disabled
                                ></input>
                              </div>
                            </div>
                            <div class="col-sm-12 col-md-6">
                              <h4>Billing Details</h4>

                              {/* <div class="form-group" >
                                 <label >Invoice Number</label>
                                 <input type="number" class="form-control"  placeholder="Enter invoice number" name="INV-number" id="INV-number" defaultValue={invoice.invc_number} required></input>
                             </div> */}

                              <div class="form-group">
                                <label>Invoice Start Date</label>
                                <input
                                  type="date"
                                  class="form-control"
                                  placeholder="Enter start date"
                                  name="INV-start-date"
                                  id="INV-start-date"
                                  defaultValue={this.abc2(invoice.start_date)}
                                  required
                                  disabled
                                ></input>
                              </div>
                              <div class="form-group">
                                <label>Invoice End Date</label>
                                <input
                                  type="date"
                                  class="form-control"
                                  placeholder="Enter end date"
                                  name="INV-end-date"
                                  id="INV-end-date"
                                  defaultValue={this.abc2(invoice.end_date)}
                                  required
                                  disabled
                                ></input>
                              </div>
                              <div class="form-group">
                                <label>Payment Due Date</label>
                                <input
                                  type="date"
                                  class="form-control"
                                  placeholder="Enter due date"
                                  name="INV-due-date"
                                  id="INV-due-date"
                                  defaultValue={this.abc2(invoice.due_date)}
                                  required
                                  disabled
                                ></input>
                              </div>
                              <div class="form-group">
                                <label>Billing Month</label>
                                <input
                                  type="text"
                                  class="form-control"
                                  placeholder="Invoice Billing Month"
                                  name="INV-billing-month"
                                  id="INV-billing-month"
                                  defaultValue={invoice.billing_month}
                                  required
                                  disabled
                                ></input>
                              </div>
                              <div class="form-group">
                                <label>Total Power Generated</label>
                                <input
                                  type="number"
                                  class="form-control"
                                  placeholder="enter power generated"
                                  name="INV-power-generated"
                                  id="INV-power-generated"
                                  defaultValue={parseFloat(
                                    invoice.production_generated
                                  ).toFixed(3)}
                                  disabled
                                  required
                                  step="0.00001"
                                ></input>
                              </div>
                              <div class="form-group">
                                <label>Sub Total</label>
                                <input
                                  type="number"
                                  class="form-control"
                                  placeholder="enter Sub Total"
                                  name="INV-sub-total"
                                  id="INV-sub-total"
                                  defaultValue={parseFloat(
                                    invoice.sub_total
                                  ).toFixed(3)}
                                  required
                                  step="0.00001"
                                  disabled
                                ></input>
                              </div>
                              <div class="form-group">
                                <label>Tax Rate</label>
                                <input
                                  type="number"
                                  class="form-control"
                                  placeholder="enter tax rate"
                                  name="INV-tax-rate"
                                  id="INV-tax-rate"
                                  defaultValue={parseFloat(
                                    invoice.tax_rate
                                  ).toFixed(3)}
                                  required
                                  disabled
                                ></input>
                              </div>
                              <div class="form-group">
                                <label>Tax</label>
                                <input
                                  type="number"
                                  class="form-control"
                                  placeholder="enter tax"
                                  name="INV-tax"
                                  id="INV-tax"
                                  defaultValue={parseFloat(invoice.tax).toFixed(
                                    3
                                  )}
                                  required
                                  step="0.00001"
                                  disabled
                                ></input>
                              </div>
                              <div class="form-group">
                                <label>Total Amount</label>
                                <input
                                  type="number"
                                  class="form-control"
                                  placeholder="enter total Amount"
                                  name="INV-total-amount"
                                  id="INV-total-amount"
                                  defaultValue={parseFloat(
                                    invoice.total
                                  ).toFixed(3)}
                                  required
                                  step="0.00001"
                                  disabled
                                ></input>
                              </div>
                              <div class="form-group">
                                <label>Previous Month Dues</label>
                                <input
                                  type="number"
                                  class="form-control"
                                  placeholder="enter total Amount"
                                  name="INVC_PREVIOUS_DUES"
                                  id="INVC_PREVIOUS_DUES"
                                  defaultValue={parseFloat(
                                    invoice.previous_dues
                                  ).toFixed(3)}
                                  required
                                  step="0.00001"
                                  disabled
                                ></input>
                              </div>
                            </div>
                          </div>
                        </li>
                      </ul>
                    ))}

                    <Row>
                      <h4>Device Details</h4>
                      {/* <a onClick={this.add_device} style={{marginTop: '9px', marginLeft: '2%', color: 'blue', cursor: 'pointer'}}>+add device</a> */}
                    </Row>
                    {this.state.devices.map(device => (
                      <div>
                        <Row>
                          <Col>
                            <label for="exampleInputPassword1">Device ID</label>
                            <input
                              type="text"
                              class="form-control"
                              placeholder="enter device ID"
                              name="did1"
                              id={"did" + device.id}
                              defaultValue={device.device.sn}
                              disabled
                              required
                            ></input>
                          </Col>
                          <Col>
                            <label for="exampleInputPassword1">
                              Device Description
                            </label>
                            <input
                              type="text"
                              class="form-control"
                              placeholder="enter description"
                              name="desc1"
                              id={"desc" + device.id}
                              defaultValue={device.device.desc}
                              required
                              disabled
                            ></input>
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <label for="exampleInputPassword1">
                              Device Power Generation
                            </label>
                            <input
                              type="number"
                              class="form-control"
                              placeholder="enter power generated"
                              name="pgen1"
                              id={"pgen" + device.id}
                              defaultValue={parseFloat(
                                device.production_generated
                              ).toFixed(3)}
                              required
                              step="0.001"
                              disabled
                            ></input>
                          </Col>
                          <Col>
                            <label for="exampleInputPassword1">
                              Device Amount
                            </label>
                            <input
                              type="number"
                              class="form-control"
                              placeholder="enter power generated"
                              name="amn1"
                              id={"amn" + device.id}
                              defaultValue={parseFloat(device.amount).toFixed(
                                3
                              )}
                              required
                              step="0.001"
                              disabled
                            ></input>
                          </Col>
                        </Row>
                        <hr />
                      </div>
                    ))}
                  </form>
                </Modal.Body>
                <Modal.Footer>
                  <button  onClick={this.handleClose}>
                    Close
                  </button>
                    <Can I="read" a="/invoice/CustomerRelationApprovalForInvoice/:id/:action/" ability={this.state.ability}></Can>
                    <span>
                      <button
                        onClick={() =>
                          this.bill_customer(this.state.invoice_id)
                        }
                        variant="primary"
                        style={{
                          marginLeft: "5px",
                          
                        }}
                      >
                        Bill Customer
                      </button>
                      <button
                        onClick={() =>
                          this.billcustomer(this.state.invoice_id, false)
                        }
                        
                        style={{
                          marginLeft: "10px",
                          
                          
                        }}
                      >
                        Reject Invoice
                      </button>
                    </span>
 
                </Modal.Footer>
              </Modal>
              <Modal
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                show={this.state.show_create}
                style={{marginLeft:'6%'}}
              >
                <Modal.Header>
                  <Modal.Title>Create Invoice</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Row>
                    <Col>
                      <div class="form-group">
                        <label for="exampleInputPassword1">Customer</label>
                        {/* <input type="text" class="form-control"  placeholder="Enter customer ID" name="cust-ID" id="cust-ID" ></input> */}
                        <select
                          class="form-control"
                          name="cust-ID"
                          id="cust-ID"
                          onChange={this.handleCustomerNameChange}
                        >
                          <option disabled selected value>
                            {" "}
                            -- select an option --{" "}
                          </option>
                          {this.state.customers.map(customer => (
                            <option
                              key={customer.id}
                              value={customer.id}
                            >
                              {customer.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </Col>

                    <Col>
                      <div class="form-group">
                        <label for="exampleInputPassword1">Project</label>
                        <select
                          class="form-control"
                          name="proj-ID"
                          id="proj-ID"
                          onChange={this.handleProjectNameChange}
                        >
                          <option selected> -- select an option -- </option>
                          {this.state.customerProject.map(project => (
                            <option key={project.id} value={project.id}>
                              {project.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <div class="form-group">
                        <label for="exampleInputPassword1">
                          Invoice Start Date
                        </label>
                        <input
                          type="date"
                          class="form-control"
                          placeholder="Enter start date"
                          name="INV-start-date"
                          id="INV-start-date"
                          required
                        ></input>
                      </div>
                    </Col>
                    <Col>
                      <div class="form-group">
                        <label for="exampleInputPassword1">
                          Invoice End Date
                        </label>
                        <input
                          type="date"
                          class="form-control"
                          placeholder="Enter start date"
                          name="INV-end-date"
                          id="INV-end-date"
                          required
                        ></input>
                      </div>
                    </Col>
                  </Row>
                </Modal.Body>
                <Modal.Footer>
                  <button  onClick={this.handleCloseCreate}>
                    Close
                  </button>
                  <button
                   
                    onClick={this.create_invoice}
                  >
                    Create
                  </button>
                </Modal.Footer>
              </Modal>
              <Modal
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                show={this.state.show_data}
                style={{marginLeft:'6%'}}
              >
                <Modal.Header>
                  <Modal.Title>Billing Data</Modal.Title>
                  <span>
                  <Can I="read" a="/invoice-production/getInvoiceProduction/:id/" ability={this.state.ability}> 
                    <ExcelFile
                      filename="Billing Data"
                      element={
                        <button 
                        >
                          {" "}
                          Download Report{" "}
                        </button>
                      }
                    >
                      <ExcelSheet data={this.state.billingData} name="Data">
                        <ExcelColumn
                          label="Invoice Number"
                          value="invoice_invc_number"
                        />
                        <ExcelColumn
                          label="Customer"
                          value="invoice_project_customer_name"
                        />
                        <ExcelColumn
                          label="Project"
                          value="invoice_project_name"
                        />
                        <ExcelColumn label="Device" value="device_sn" />
                        <ExcelColumn
                          label="Device Description"
                          value="device_desc"
                        />
                        <ExcelColumn
                          label="Production Date"
                          value={row => this.abc2(row.production_date)}
                        />
                        <ExcelColumn
                          label="Production Generated (kWh)"
                          value={row =>
                            +parseFloat(row.production_generated).toFixed(5)
                          }
                        />
                      </ExcelSheet>
                    </ExcelFile>
                    </Can>
                    <button
               
                      onClick={this.billingdataclose}
                      style={{ marginLeft: "5px" }}
                    >
                      Close
                    </button>
                  </span>
                </Modal.Header>
                <Modal.Body>
                  <DataTable
                    columns={this.state.columns}
                    data={this.state.billingData}
                    highlightOnHover={true}
                    style={{ overflow: "wrap" }}
                    sortServer
                    pagination
                    customStyles={this.state.customStyles}
                  />
                </Modal.Body>
                <Modal.Footer></Modal.Footer>
              </Modal>
              <Modal
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                show={this.state.show_billcustomer}
                style={{marginLeft:'6%'}}
              >
                <Modal.Header>
                  <Modal.Title>Bill Customer</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <form>
                    <Row>
                      {/* <Col>
                                <div class="form-group">
                                    <label for="exampleInputPassword1">Invoice Number</label>
                                    <input type="text" class="form-control"  placeholder="Enter Invoice Number" name="invoice_number" id="invoice_number" required ></input>
                                </div>
                            </Col> */}
                      <Col>
                        <div class="form-group">
                          <label for="exampleInputPassword1">
                            Previous Dues
                          </label>
                          <input
                            type="number"
                            class="form-control"
                            placeholder="Previous Dues"
                            name="previous_dues"
                            id="previous_dues"
                            required
                            defaultValue={this.state.previous_dues}
                          ></input>
                        </div>
                      </Col>
                    </Row>
                  </form>
                </Modal.Body>
                <Modal.Footer>
                  <button
                    onClick={this.handleClosebillcustomer}
                  >
                    Close
                  </button>
                  <button
          
                    onClick={() =>
                      this.billcustomer(this.state.invoice_id, true)
                    }
    
                  >
                    Confirm
                  </button>
                </Modal.Footer>
              </Modal>
            </>
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss={false}
                draggable
                pauseOnHover={false}
                style={{marginLeft:'6%'}}
                />
          </Container>
        </span>
      </div>
    );
  }
}
export default Approved_Invoices;
