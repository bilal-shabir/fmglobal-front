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
import L3 from "../../components/components-overview/progress.js";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Can } from "@casl/react";
import setPermissions from "../defineAbility";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

class Created_Invoices extends React.Component {
  constructor(props) {
    super(props);
    const userIs_logged = localStorage.getItem("is_logged");
    if (userIs_logged != 1) {
      this.props.history.push("/login");
    }
    const date = new Date();
    const year = date.getFullYear();
    const month = this.addZero(date.getMonth() + 1);
    const day = this.addZero(date.getDate() - 1);
    const create_date_max = year + "-" + month + "-" + day;
    this.state = {
      ability: null,
      create_date_max: create_date_max,
      create_date_min: "",
      isLoaded: false,
      show: false,
      show_create: false,
      show_data: false,
      show_loader: false,
      billingData: null,
      data: [],
      data1: [],
      invoice: [],
      devices: [],
      customers: [],
      customerProject: [],
      project_id: null,
      companies: [],
      projects: [],
      billing_months: [],
      inv_write: false,
      inv_delete: false,
      invoice_id: null,
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
    
    require("../../utils").checkpermision("Created");
    await fetch(URL2+'getPermissions',{
      headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // 'access_token' : json.access_token
       },
       credentials: 'include'
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
    // //console.log(permissions)
    // // if(!permissions.find(({ resource }) => resource.name === 'Operation_Approval' ) ){
    // //     this.setState({
    // //         edit_only: true
    // //     })
    // // }
    // const inv_permission = permissions.find(
    //   ({ resource }) => resource.name === "Invoice"
    // );
    // if (inv_permission.write == true) {
    //   this.setState({
    //     inv_write: true
    //   });
    // }
    // if (inv_permission.delete == true) {
    //   this.setState({
    //     inv_delete: true
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
    const access_token = localStorage.getItem("access_token");
    await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        access_token: access_token
      },
      credentials: "include"
    })
      .then(response => response.json())
      .then(response => {
        if (response.statusCode == 404 || response.statusCode == 401 || response.statusCode == 500 || response.statusCode == 403 || response.statusCode == 400 ) { 
          throw Error(response.statusText)        
        }
        else{
          //   console.log(response)
        const invoices = response.filter(
          invoice => invoice.invoice_status.name == "New"
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

    fetch(URL2 + "auth-customer-role/getCustomer", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        access_token: access_token
      },
      credentials: "include"
    })
      .then(response => response.json())
      .then(response => {
        if (response.statusCode == 404 || response.statusCode == 401 || response.statusCode == 500 || response.statusCode == 403 || response.statusCode == 400) { 
          throw Error(response.statusText)        
        }
        else{
          //   console.log(response)
        this.setState({
          customers: response
        });
        }
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
            <span  style={{ padding: "10px" }}>
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
  handleShowCreate() {
    this.setState({
      show_create: true
    });
  }
  handleProjectNameChange = event => {
    this.setState({
      project_id: event.target.value
    });
    const access_token = localStorage.getItem("access_token");
    fetch(URL2 + "project-device/getDevices/" + event.target.value, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        access_token: access_token
      },
      credentials: "include"
    })
      .then(response => response.json())
      .then(response => {
        //   console.log(response)
        const selectedProject = this.state.customerProject.find(
          project => project.id == this.state.project_id
        );
        this.setState({
          selectedProject: selectedProject
        });
      });
  };
  handleCustomerNameChange = event => {
    // console.log(event.target.value);
    this.setState({
      customer_id: event.target.value
    });
    const access_token = localStorage.getItem("access_token");
    fetch(URL2 + "project/getProjects/" + event.target.value, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        access_token: access_token
      },
      credentials: "include"
    })
      .then(response => response.json())
      .then(response => {
        if (response.statusCode == 404 || response.statusCode == 401 || response.statusCode == 500 || response.statusCode == 403 || response.statusCode == 400) { 
          throw Error(response.statusText)        
        }
        else{
          const selected = this.state.customers.find(
            customer => customer.id == this.state.customer_id
          );
          const selectedcustomer = selected.customer;
          this.setState({
            customerProject: response,
            selectedCustomer: selectedcustomer
          });
        }    
      })
      .catch((e) => {
        // console.log(e)  
        toast.error('Something went wrong, projects not retrieved', {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            });
      });
  };
  create_invoice = async () => {
    document.getElementById("createinvoice").disabled = true;
    
    const start_date = document.getElementById("INV_start_date").value;
    const end_date = document.getElementById("INV_end_date").value;
    const e_date = new Date(end_date);
    const s_date = new Date(start_date);
    // console.log(e_date.getMonth())
    const company_id = localStorage.getItem("company");
    const access_token = localStorage.getItem("access_token");
    await fetch(URL2 + "invoice/generateInvoice", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        access_token: access_token
      },
      credentials: "include",
      method: "POST",
      mode: "cors",
      body: JSON.stringify({
        customer_id: this.state.customer_id,
        company_id: company_id,
        project_id: this.state.project_id,
        start_date: s_date,
        end_date: e_date
      })
    })
      .then(response => response.json())
      .then(response => {
        // console.log(response)
        if (response.statusCode == 404 || response.statusCode == 401 || response.statusCode == 500 || response.statusCode == 403 || response.statusCode == 400) { 
          throw Error(response.statusText)        
        }
        else{
          if (response.msg) {
            toast.info('Invoice already exists for selected period', {
              position: "top-center",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: false,
              draggable: true,
              progress: undefined,
              });
            // this.close();
          } else {
            this.setState({
              show_loader: true
            });
            var x = document.getElementById("generated");
            var y = document.getElementById("not_generated");
            // Add the "show" class to DIV
  
            setTimeout(function() {
              y.className = "hide";
            }, 6000);
            // After 3 seconds, remove the show class from DIV
            setTimeout(function() {
              x.className = "show";
            }, 6000);
  
            setTimeout(this.close, 7000);
            //   setTimeout(function(){ document.location.reload(true) }, 7000);
          }
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
    document.getElementById("createinvoice").disabled = false;
  };
  close = async () => {
    let url = new URL(URL2 + `invoice/getInvoices`);

    //Add a second foo parameter.
    url.searchParams.append("project_name", "");
    url.searchParams.append("customer_name", "");
    url.searchParams.append("approved_by_operation", "");
    url.searchParams.append("approved_by_finance", "");
    url.searchParams.append("billing_month", "");
    url.searchParams.append("status", "");
    const access_token = localStorage.getItem("access_token");
    await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        access_token: access_token
      },
      credentials: "include"
    })
      .then(response => response.json())
      .then(response => {
        //   console.log(response)
        const invoices = response.filter(
          invoice => invoice.invoice_status.name == "New"
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

        this.setState({
          billing_months: uniq_months,
          projects: uniq_projects,
          companies: uniq_company,
          isLoaded: true,
          data: invoices,
          data1: invoices
        });
      });
    this.setState({
      show_loader: false,
      show_create: false
    });
  };

  handleShow = id => {
    this.setState({
      invoice_id: id
    });
    const access_token = localStorage.getItem("access_token");
    fetch(URL2 + "invoice/getInvoice/" + id, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        access_token: access_token
      },
      credentials: "include"
    })
      .then(response => response.json())
      .then(response => {
        if (response.statusCode == 404 || response.statusCode == 401 || response.statusCode == 500 || response.statusCode == 403 || response.statusCode == 400) { 
          throw Error(response.statusText)        
        }
        else{
          //   console.log(response)
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

  formsubmit = id => {
    alert(id);
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

    const access_token = localStorage.getItem("access_token");
    fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        access_token: access_token
      },
      credentials: "include"
    })
      .then(response => response.json())
      .then(response => {
        if (response.statusCode == 404 || response.statusCode == 401 || response.statusCode == 500 || response.statusCode == 403 || response.statusCode == 400) { 
          throw Error(response.statusText)        
        }
        else{
          const invoices = response.filter(
            invoice => invoice.invoice_status.name == "New"
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
  };
  resetfilters = () => {
    if (this.state.data.length != 0) {
      document.getElementById("customer").selectedIndex = 0; //0 = option 1
      document.getElementById("p_name").selectedIndex = 0; //0 = option 1
      document.getElementById("o_approval").selectedIndex = 0; //0 = option 1
      document.getElementById("f_approval").selectedIndex = 0; //0 = option 1
      // document.getElementById("status").selectedIndex = 0; //0 = option 1
      document.getElementById("b_month").selectedIndex = 0; //0 = option 1
    }
    document.getElementById("search").value = ''
    const access_token = localStorage.getItem("access_token");
    fetch(URL2 + "invoice/getInvoices", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        access_token: access_token
      },
      credentials: "include"
    })
      .then(response => response.json())
      .then(response => {
        if (response.statusCode == 404 || response.statusCode == 401 || response.statusCode == 500 || response.statusCode == 403 || response.statusCode == 400) { 
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
          invoice => invoice.invoice_status.name == "New"
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
  };
  requestapproval = async id => {
    document.getElementById("requestapproval").disabled = true;
    const access_token = localStorage.getItem("access_token");
    await fetch(URL2 + `invoice/requestApprovalForInvoice/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        access_token: access_token
      },
      credentials: "include",
      method: "POST",
      mode: "cors"
    })
    .then(response => response.json())
    .then(response => {
      // console.log(response)
      if (response.statusCode == 404 || response.statusCode == 401 || response.statusCode == 500 || response.statusCode == 403 || response.statusCode == 400) { 
        throw Error(response.statusText)        
      }
            else{
              document.getElementById("requestapproval").disabled = false;
              this.handleClose();
              toast.success('Sent for approval', {
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
              // const access_token = localStorage.getItem('access_token');
              fetch(url, {
                headers: {
                  "Content-Type": "application/json",
                  Accept: "application/json",
                  access_token: access_token
                },
                credentials: "include"
              })
                .then(response => response.json())
                .then(response => {
          
                  if(response.status == 401 || response.status == 404){
                    alert("An error occurred, please try again")
                  }
                  else{
                    const invoices = response.filter(
                      invoice => invoice.invoice_status.name == "New"
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
            
                    this.setState({
                      billing_months: uniq_months,
                      projects: uniq_projects,
                      companies: uniq_company,
                      isLoaded: true,
                      data: invoices,
                      data1: invoices
                    });
                  }
          
                  //   console.log(response)
                  
                });
            }
    })
    .catch((e) => {
      // console.log(e)  
      toast.error('Something went wrong, invoice not sent for approval', {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          });
    });
    //   var x = document.getElementById("snackbar_invc");
    // Add the "show" class to DIV
    // x.className = "show";
    // After 3 seconds, remove the show class from DIV
    // setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
   

    // setTimeout(function(){ document.location.reload(true) }, 1000);
  };
  deleteinvoice = async id => {
    const access_token = localStorage.getItem("access_token");
    await fetch(URL2 + `invoice/DeleteInvoice/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        access_token: access_token
      },
      credentials: "include",
      method: "DELETE",
      mode: "cors"
    })
    .then(response => response.json())
    .then(response => {
      if (response.statusCode == 404 || response.statusCode == 401 || response.statusCode == 500 || response.statusCode == 403 || response.statusCode == 400) { 
        throw Error(response.statusText)        
      }
      else{
        toast.success('Invoice Deleted', {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          });

          this.handleClose();
    // alert("Invoice Deleted");

    let url = new URL(URL2 + `invoice/getInvoices`);

    //Add a second foo parameter.
    url.searchParams.append("project_name", "");
    url.searchParams.append("customer_name", "");
    url.searchParams.append("approved_by_operation", "");
    url.searchParams.append("approved_by_finance", "");
    url.searchParams.append("billing_month", "");
    url.searchParams.append("status", "");
    // const access_token = localStorage.getItem('access_token');
     fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        access_token: access_token
      },
      credentials: "include"
    })
      .then(response => response.json())
      .then(response => {
        //   console.log(response)
        const invoices = response.filter(
          invoice => invoice.invoice_status.name == "New"
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

        this.setState({
          billing_months: uniq_months,
          projects: uniq_projects,
          companies: uniq_company,
          isLoaded: true,
          data: invoices,
          data1: invoices
        });
      });
      }
    })
    .catch((e) => {
      // console.log(e)  
      toast.error('Something went wrong, invoices not deleted', {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          });
    });

    
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
    const access_token = localStorage.getItem("access_token");
    await fetch(URL2 + "invoice-production/getInvoiceProduction/" + id, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        access_token: access_token
      },
      credentials: "include"
    })
      .then(response => response.json())
      .then(response => {
        if (response.statusCode == 404 || response.statusCode == 401 || response.statusCode == 500 || response.statusCode == 403 || response.statusCode == 400) { 
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
      });
  };
  billingdataclose = () => {
    this.setState({
      show_data: false
    });
  };
  invoicestartdate = () => {
    // alert(document.getElementById("INV_start_date").value)
    this.setState({
      create_date_min: document.getElementById("INV_start_date").value
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
        <Row style={{marginBottom:'-10px'}}>
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
                New Invoices
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
              <Can I="write" a="/invoice/generateInvoice/" ability={this.state.ability}>
              <button
                onClick={this.handleShowCreate}
                // disabled={!this.state.inv_write}
              >
                Create
              </button>
              </Can>
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
              <div id="snackbar_invc2" style={{ marginTop: "45px" }}>
                Sent for approval
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
                        marginRight: "5px",
                      }}
                    >
                      Billing Data
                    </button>
                    </Can>
                    <button onClick={this.handleClose}>
                      Close
                    </button>
                  </span>
                </Modal.Header>
                <Modal.Body>
                  <form>
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
                  <Can I="write" a="/invoice/requestApprovalForInvoice/:id/" ability={this.state.ability}>
                  <button
                    onClick={() => this.requestapproval(this.state.invoice_id)}
                    id="requestapproval"
                    // disabled={!this.state.inv_write}
                  >
                    Request Approval
                  </button>
                  </Can>
                  <Can I="delete" a="/invoice/DeleteInvoice/:id/" ability={this.state.ability}>
                  <button
                    onClick={() => this.deleteinvoice(this.state.invoice_id)}
                    // disabled={!this.state.inv_delete}
                  >
                    Delete
                  </button>
                  </Can>
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
                          id="INV_start_date"
                          required
                          onChange={this.invoicestartdate}
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
                          id="INV_end_date"
                          required
                          max={this.state.create_date_max}
                          min={this.state.create_date_min}
                        ></input>
                      </div>
                    </Col>
                  </Row>
                </Modal.Body>
                <Modal.Footer>
                  <button onClick={this.handleCloseCreate}>
                    Close
                  </button>
                  <button

                    onClick={this.create_invoice}
                    id="createinvoice"

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
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                show={this.state.show_loader}
                id="loader"
                style={{marginLeft:'6%'}}
              >
                <Modal.Body>
                  <div
                    style={{ textAlign: "center", marginTop: "30px" }}
                    id="not_generated"
                  >
                    <h4>Generating Invoice</h4>
                  </div>
                  <div
                    style={{ textAlign: "center", marginTop: "30px" }}
                    id="generated"
                  >
                    <h4 style={{ color: "darkgreen" }}>Invoice Generated</h4>
                  </div>
                  <L3></L3>
                </Modal.Body>
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
export default Created_Invoices;
