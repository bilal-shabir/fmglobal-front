import React from "react";
import { Modal, Button } from "react-bootstrap";
import {Card,Container, Row, Col} from "shards-react";
import {URL2,DKEY} from '../../constants';
import {Link} from "react-router-dom";
import PageTitle from "../../components/common/PageTitle";
import Cookies from "universal-cookie";
import L from "../../components/components-overview/loader";
import DataTable from "react-data-table-component";
import data from "./data";
import Table from "./DataTable";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import setPermissions from "../defineAbility";
import { Can } from "@casl/react";


class PR_Approve extends React.Component{

    constructor(props) {
        super(props);
        const userIs_logged=localStorage.getItem('is_logged');
        const userEmail=localStorage.getItem('Email');
        const userToken=localStorage.getItem('Password');
      if(userIs_logged != 1){
        this.props.history.push("/login");
      }
        this.state = {
            ability: null,
            requested_by: [],
            companies:[],
            projects:[],
            status: [],
            maintained_by: [],
            isLoaded: false,
            show: false,
            data: [],
            data1: [], 
            pr: [],
            items:[],
            edit_pr: false,
            //invoice: [],
            //devices: []
            columns: [
              {
                  name: "PR No.",
                  selector: (row) => "MRN-"+row.id,
                  // sortable: true,
              },
              {
                  name: "Requested by",
                  selector: (row) => row.requested_by,
                  sortable: true,
              },
              {
                  name: "Company",
                  selector: (row) => row.company_name,
                  sortable: true,
              },
              {
                name: "Project",
                selector: (row) => row.project_name,
                sortable: true,
                right: true
              },
              {
                name: "Delivery Date",
                selector: (row) => this.convert(row.delivery_date),
                sortable: true,
                right: true
              },
              {
                name: "Status",
                selector: (row) => row.status,
                sortable: true,
                right: true
              },
              {
                name: "Responsible for MR",
                selector: (row) => row.maintained_by,
                sortable: true,
                right: true,
                width: '180px'
              },
              {
                name: "PO Number",
                selector: (row) => row.po_number,
                sortable: true,
                right: true,
              },
              {
                name: "Print",
                cell:(row)=> <span><Can I="read" a="/purchase-requisition/get-prid/:id/" ability={this.state.ability}><button style={{marginTop:'3px'}}><Link to={`/pr_pdf/${row.id }`} style={{color:"black"}}>PDF</Link></button></Can>
                {row.uploaded_file ? (<Can I="read" a="/purchase-requisition/getPrAttachment/:id/" ability={this.state.ability}><button onClick={()=>this.testFileGet(row.id) } type="submit"  style={{marginTop:'3px'}}>Attachment</button></Can>):
                (<Can I="read" a="/purchase-requisition/getPrAttachment/:id/" ability={this.state.ability}><button onClick={()=>this.testFileGet(row.id) } disabled type="submit" style={{marginTop:'3px', marginLeft:'2px'}}>Attachment</button></Can>)}
                
              </span>,
                
                center: true,
                width:'230px'
              },
              {
                name: "Action",
                cell:(row)=> <Can I="update" a="/purchase-requisition/updatePR/:id/" ability={this.state.ability}><button type="button"   onClick={()=>this.editpr(row.id) } style={{marginLeft:'2px'}}>Edit</button></Can>,
                sortable: true,
                right: true
              }
              
            ],
          };
      }
      async testFileGet(id){
        // alert(id)
        const access_token = localStorage.getItem('access_token');
        await fetch(URL2+'purchase-requisition/getPrAttachment/'+id, {
            headers : { 
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'access_token' : access_token
             },
             credentials: 'include'
          }).then(response => {
            if (response.statusCode == 404 || response.statusCode == 401 || response.statusCode == 500 || response.statusCode == 403 || response.statusCode == 400) { 
              throw Error(response.statusText)        
          }
          else{
            const pdfWindow = window.open();
            pdfWindow.location.href = response.url;      
            // console.log(response)
          }
        })
        .catch((e) => {
          // console.log(e)  
          toast.error('Something went wrong, attachment not retrieved', {
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

    async componentDidMount() {
      require('../../utils').checkpermision('Processing')
      // let permission = localStorage.getItem('permissions');
      // var CryptoJS = require("crypto-js");
      // var bytes = CryptoJS.AES.decrypt(permission, DKEY);
      // var permissions = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      // //console.log(permissions)
      // if(!permissions.find(({ resource }) => resource.name === 'PR' ) && !permissions.find(({ resource }) => resource.name === 'PR_S' ) )
      // this.setState({
      //   edit_pr: true
      // })
      await fetch(URL2+'getPermissions',{
        headers : { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          // 'access_token' : json.access_token
         },
         credentials: 'include'
      }).then(response => response.json())
      .then((json)=>{
        console.log("permissions", json)
        const ability = setPermissions(json);
        console.log("permissions",ability)
        this.setState({
          ability:ability
        })
      })
      // {
      //     window.location.replace("/"+permissions[0].resource.name);
      // }
      const cookies = new Cookies();
      const access_token = localStorage.getItem('access_token');
      let url = new URL(URL2+`purchase-requisition/get-prs`);
      url.searchParams.append('sort', 'DESC');
      await fetch(url, {
          headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'access_token' : access_token
           },
           credentials: 'include'
        }).then(response => response.json())
        .then((response) => {
          if (response.statusCode == 404 || response.statusCode == 401 || response.statusCode == 500 || response.statusCode == 403 || response.statusCode == 400) { 
            throw Error(response.statusText)        
        }
        else{
            // console.log(response)
            var requested_by = []
              for (let index = 0; index < response.length; index++) {
                requested_by[index] = response[index].requested_by;
                  
              }
              var uniq_requested_by = [...new Set(requested_by)];
              uniq_requested_by = uniq_requested_by.filter(element => {
                return element !== '';
              });
              // console.log(uniq_requested_by)
              var companies = []
              for (let index = 0; index < response.length; index++) {
                companies[index] = response[index].company_name;
                  
              }
              var uniq_companies = [...new Set(companies)];
              uniq_companies = uniq_companies.filter(element => {
                return element !== '';
              });
              // console.log(uniq_companies)
              var projects = []
              for (let index = 0; index < response.length; index++) {
                projects[index] = response[index].project_name;
                  
              }
              var uniq_projects = [...new Set(projects)];
              uniq_projects = uniq_projects.filter(element => {
                return element !== '';
              });
              var status = []
              for (let index = 0; index < response.length; index++) {
                status[index] = response[index].status;
                  
              }
              var uniq_status = [...new Set(status)];
              uniq_status = uniq_status.filter(element => {
                return element !== '';
              });
              var maintained_by = []
              for (let index = 0; index < response.length; index++) {
                maintained_by[index] = response[index].maintained_by;
                  
              }
              var uniq_maintained_by = [...new Set(maintained_by)];
              // console.log(uniq_maintained_by)
              uniq_maintained_by = uniq_maintained_by.filter(element => {
                return element !== '' && element !==null
              });
            // console.log(uniq_maintained_by)
            this.setState({
              isLoaded: true,
              maintained_by: uniq_maintained_by,
              status: uniq_status,
              projects: uniq_projects,
              companies: uniq_companies,
              requested_by: uniq_requested_by,
              data: response,
              data1: response
          })
        }
        }).catch((e) => {
          // console.log(e)  
          toast.error('Something went wrong, Material Requisitions not retrieved', {
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
          columns: [
            {
              name: <span>MR No. <select id="pr_sort" style={{width:'37px', borderRadius:'5px', fontSize:'10px', marginLeft:'3px', cursor:'pointer'}} onChange={this.filter}>
              <option value='DESC' disabled selected>Sort</option>
              <option value='DESC' key={1}>DESC</option>
              <option value='ASC' key={2}>ASC</option>
              
              </select></span>,
              selector: (row) => "MRN-" + row.id,
              // sortable: true,
              width:'120px'
          },
            {
              // onChange={this.filter}
                name:  <span>Requested by <select id="r_by" style={{width:'37px', borderRadius:'5px', fontSize:'10px', marginLeft:'3px', cursor:'pointer'}} onChange={this.filter} >
                      <option value='' disabled selected>Filter</option>
                      {this.state.requested_by.map((company) => 
                                           <option key={company } value={company}>   
                                                  { company}
                                           </option>
                                          )}
                      </select></span>,
                selector: (row) => row.requested_by,
                // sortable: true,
                width:'150px'
            },
            {
                name: <span>Company <select id="company" style={{width:'37px', borderRadius:'5px', fontSize:'10px', marginLeft:'3px', cursor:'pointer'}} onChange={this.filter}>
                <option value='' disabled selected>Filter</option>
                {this.state.companies.map((company) => 
                                     <option key={company } value={company}>   
                                            { company}
                                     </option>
                                    )}
                </select></span>,
                selector: (row) => row.company_name,
                // sortable: true,
                width:'145px'
            },
            {
              name: <span>Project <select id="p_name" style={{width:'37px', borderRadius:'5px', fontSize:'10px', marginLeft:'3px', cursor:'pointer'}} onChange={this.filter}>
              <option value='' disabled selected>Filter</option>
              {this.state.projects.map((company) => 
                                   <option key={company } value={company}>   
                                          { company}
                                   </option>
                                  )}
              </select></span>,
              selector: (row) => row.project_name,
              // sortable: true,
              center: true,
              width:'230px'
            },
            {
              name: "Created On",
              selector: (row) => this.convert(row.created_at),
              // sortable: true,
              center: true,
              width:'115px'
            },
            {
              name: "Delivery Date",
              selector: (row) => this.convert(row.delivery_date),
              // sortable: true,
              center: true,
              width:'115px'
            },
            {
              name: <span>Status <select id="pr_status" style={{width:'37px', borderRadius:'5px', fontSize:'10px', marginLeft:'3px', cursor:'pointer'}} onChange={this.filter}>
              <option value='' disabled selected>Filter</option>
              {this.state.status.map((company) => 
                                   <option key={company } value={company}>   
                                          { company}
                                   </option>
                                  )}
              </select></span>,
              selector: (row) => row.status,
              // sortable: true,
              center: true,
              width:'150px'
            },
            {
              name:  <span>Responsible for MR <select id="m_by" style={{width:'37px', borderRadius:'5px', fontSize:'10px', marginLeft:'3px', cursor:'pointer'}}  onChange={this.filter}>
              <option value='' disabled selected>Filter</option>
              {this.state.maintained_by.map((company) => 
                                   <option key={company } value={company}>   
                                          { company}
                                   </option>
                                  )}
              </select></span>,
              selector: (row) => row.maintained_by,
              // sortable: true,
              center: true,
              width: '195px'
            },
            {
              name: "PO Number",
              selector: (row) => row.po_number,
              // sortable: true,
              right: true,
              width:'130px'
            },
            {
              name: "Print",
              cell:(row)=> <span><Can I="read" a="/purchase-requisition/get-prid/:id/" ability={this.state.ability}><button style={{marginTop:'3px'}}><Link to={`/pr_pdf/${row.id }`} style={{color:'black'}}>PDF</Link></button></Can>
              {row.uploaded_file ? (<Can I="read" a="/purchase-requisition/getPrAttachment/:id/" ability={this.state.ability}><button onClick={()=>this.testFileGet(row.id) } type="submit"  style={{marginTop:'3px', marginLeft:'2px'}}>Attachment</button></Can>):
              (<Can I="read" a="/purchase-requisition/getPrAttachment/:id/" ability={this.state.ability}><button onClick={()=>this.testFileGet(row.id) } disabled type="submit" style={{marginTop:'3px', marginLeft:'2px'}}>Attachment</button></Can>)}
              
            </span>,
              
              center: true,
              width:'230px'
            },
            {
              name: "Action",
              cell:(row)=> <Can I="update" a="/purchase-requisition/updatePR/:id/" ability={this.state.ability}><button type="button"   onClick={()=>this.editpr(row.id) } >Edit</button></Can>,
              // sortable: true,
              center  : true,
              width:'100px'
            }
            
          ],
        })
     
    }
    filter = async() => {
      let url = new URL(URL2+`purchase-requisition/get-prs`);

      // alert(document.getElementById("p_name").value)
      url.searchParams.append('project_name', document.getElementById("p_name").value);
      url.searchParams.append('company_name', document.getElementById("company").value);
      url.searchParams.append('requested_by',  document.getElementById("r_by").value);
      url.searchParams.append('maintained_by', document.getElementById("m_by").value);
      url.searchParams.append('status', document.getElementById("pr_status").value);
      url.searchParams.append('sort', document.getElementById("pr_sort").value);

      const access_token = localStorage.getItem('access_token');
      await fetch(url, {
        headers : { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'access_token' : access_token
         },
         credentials: 'include'
      }).then(response => response.json())
      .then((response) => {
        if (response.statusCode == 404 || response.statusCode == 401 || response.statusCode == 500 || response.statusCode == 403 || response.statusCode == 400) { 
          throw Error(response.statusText)        
        }
        else{

        
          // console.log(response)
          var requested_by = []
              for (let index = 0; index < response.length; index++) {
                requested_by[index] = response[index].requested_by;
                  
              }
              var uniq_requested_by = [...new Set(requested_by)];
              uniq_requested_by = uniq_requested_by.filter(element => {
                return element !== '';
              });
              // console.log(uniq_requested_by)
              var companies = []
              for (let index = 0; index < response.length; index++) {
                companies[index] = response[index].company_name;
                  
              }
              var uniq_companies = [...new Set(companies)];
              uniq_companies = uniq_companies.filter(element => {
                return element !== '';
              });
              // console.log(uniq_companies)
              var projects = []
              for (let index = 0; index < response.length; index++) {
                projects[index] = response[index].project_name;
                  
              }
              var uniq_projects = [...new Set(projects)];
              uniq_projects = uniq_projects.filter(element => {
                return element !== '';
              });
              var status = []
              for (let index = 0; index < response.length; index++) {
                status[index] = response[index].status;
                  
              }
              var uniq_status = [...new Set(status)];
              uniq_status = uniq_status.filter(element => {
                return element !== '';
              });
              var maintained_by = []
              for (let index = 0; index < response.length; index++) {
                maintained_by[index] = response[index].maintained_by;
                  
              }
              var uniq_maintained_by = [...new Set(maintained_by)];
              // console.log(uniq_maintained_by)
              uniq_maintained_by = uniq_maintained_by.filter(element => {
                return element !== '' && element !==null
              });
          // console.log(uniq_maintained_by)
          this.setState({
            isLoaded: true,
            maintained_by: uniq_maintained_by,
            status: uniq_status,
            projects: uniq_projects,
            companies: uniq_companies,
            requested_by: uniq_requested_by,
            data: response,
            data1: response
        })
        if(document.getElementById('search').value){
          // this.setState({
          //   isLoaded:false,
          // })
          // console.log(this.state.data)
          const filteredItems = this.state.data.filter(
            item =>
              JSON.stringify(item.id)
                .toLowerCase()
                .indexOf(document.getElementById('search').value.toLowerCase()) !== -1 ||

              JSON.stringify(item.company_name)
                .toLowerCase()
                .indexOf(document.getElementById('search').value.toLowerCase()) !== -1 ||
              
              JSON.stringify(item.requested_by)
                .toLowerCase()
                .indexOf(document.getElementById('search').value.toLowerCase()) !== -1 ||

              JSON.stringify(item.project_name)
                .toLowerCase()
                .indexOf(document.getElementById('search').value.toLowerCase()) !== -1 ||

              JSON.stringify(item.po_number)
                .toLowerCase()
                .indexOf(document.getElementById('search').value.toLowerCase()) !== -1 ||

              JSON.stringify(item.maintained_by)
                .toLowerCase()
                .indexOf(document.getElementById('search').value.toLowerCase()) !== -1 ||

              JSON.stringify(item.delivery_date)
                .toLowerCase()
                .indexOf(document.getElementById('search').value.toLowerCase()) !== -1 ||

              JSON.stringify(item.created_at)
                .toLowerCase()
                .indexOf(document.getElementById('search').value.toLowerCase()) !== -1


          );
          // console.log(filteredItems)
          this.setState({
            data: filteredItems,
            isLoaded:true
          })
          // console.log('data',this.state.data)
        }
      }
      }).catch((e) => {
        // console.log(e)  
        toast.error('Something went wrong, filteration failed', {
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

    resetfilters = async() =>{
      let url = new URL(URL2+`purchase-requisition/get-prs`);
      if(this.state.data.length != 0){
        document.getElementById("company").selectedIndex = 0; //0 = option 1
        document.getElementById("p_name").selectedIndex = 0; //0 = option 1
        document.getElementById("r_by").selectedIndex = 0; //0 = option 1
        document.getElementById("m_by").selectedIndex = 0; //0 = option 1
        document.getElementById("pr_status").selectedIndex = 0; //0 = option 1
        document.getElementById("pr_sort").selectedIndex = 0; //0 = option 1
      }
      document.getElementById("search").value = ''
      // alert(document.getElementById("p_name").value)
      url.searchParams.append('project_name', '');
      url.searchParams.append('company_name', '');
      url.searchParams.append('requested_by',  '');
      url.searchParams.append('maintained_by', '');
      url.searchParams.append('status', '');
      url.searchParams.append('sort', 'DESC');

      const access_token = localStorage.getItem('access_token');
      await fetch(url, {
        headers : { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'access_token' : access_token
         },
         credentials: 'include'
      }).then(response => response.json())
      .then((response) => {
        if (response.statusCode == 404 || response.statusCode == 401 || response.statusCode == 500 || response.statusCode == 403 || response.statusCode == 400) { 
          throw Error(response.statusText)        
      }
      else{
          // console.log(response)
          var requested_by = []
              for (let index = 0; index < response.length; index++) {
                requested_by[index] = response[index].requested_by;
                  
              }
              var uniq_requested_by = [...new Set(requested_by)];
              uniq_requested_by = uniq_requested_by.filter(element => {
                return element !== '';
              });
              // console.log(uniq_requested_by)
              var companies = []
              for (let index = 0; index < response.length; index++) {
                companies[index] = response[index].company_name;
                  
              }
              var uniq_companies = [...new Set(companies)];
              uniq_companies = uniq_companies.filter(element => {
                return element !== '';
              });
              // console.log(uniq_companies)
              var projects = []
              for (let index = 0; index < response.length; index++) {
                projects[index] = response[index].project_name;
                  
              }
              var uniq_projects = [...new Set(projects)];
              uniq_projects = uniq_projects.filter(element => {
                return element !== '';
              });
              var status = []
              for (let index = 0; index < response.length; index++) {
                status[index] = response[index].status;
                  
              }
              var uniq_status = [...new Set(status)];
              uniq_status = uniq_status.filter(element => {
                return element !== '';
              });
              var maintained_by = []
              for (let index = 0; index < response.length; index++) {
                maintained_by[index] = response[index].maintained_by;
                  
              }
              var uniq_maintained_by = [...new Set(maintained_by)];
              // console.log(uniq_maintained_by)
              uniq_maintained_by = uniq_maintained_by.filter(element => {
                return element !== '' && element !==null
              });
          // console.log(uniq_maintained_by)
          this.setState({
            isLoaded: true,
            maintained_by: uniq_maintained_by,
            status: uniq_status,
            projects: uniq_projects,
            companies: uniq_companies,
            requested_by: uniq_requested_by,
            data: response,
            data1: response
        })
      }
      })
      .catch((e) => {
        // console.log(e)  
        toast.error('Something went wrong, reset filter failed', {
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

      editpr =(id) => {
        const access_token = localStorage.getItem('access_token');
        fetch(URL2+'purchase-requisition/get-prid/'+id, {
          headers : { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'access_token' : access_token
          },
          credentials: 'include',
          
          
          }).then(response => response.json())
          .then(response => {
            if (response.statusCode == 404 || response.statusCode == 401 || response.statusCode == 500 || response.statusCode == 403 || response.statusCode == 400) { 
              throw Error(response.statusText)        
          }
          else{

          
                //console.log(response)
              this.setState({
                  pr: response.pr,
                  items:response.items,
                  show: true,
                  isLoaded:true
              })

              //console.log(response)
            }
          }) 
          .catch((e) => {
            // console.log(e)  
            toast.error('Something went wrong, MR not retrieved', {
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

      getUpdatedItems = () => {
        
        let updated_items = [];
        const updated_item_by_keys = {};

        for(const key of Object.keys(this.state.items[0])){
          updated_item_by_keys[key] = document.getElementsByClassName(key);
        }


        for(const key of Object.keys(updated_item_by_keys) ){
          for(const item of updated_item_by_keys[key]){

            let item_id, item_value;

            if(item.getAttribute('data-item-id')){
               item_id = item.getAttribute('data-item-id');
               item_value = item.value
            }

            if (updated_items.find(i => i && i.id === item_id)){
                updated_items = updated_items.map(i => {
                  
                if(i && i.id === item_id){
                  i[key] = item_value;
                }

                return i;
              });
            }
            else{
              updated_items.push({id: item_id, [key]: item_value});
            }
          }
        }

        return updated_items;
      }



      

      handlesubmit = async (id) => {
        

        const purchase_items = this.getUpdatedItems();
        // console.log(purchase_items)

        // for (let index = 0; index < purchase_items.length; index++) {
        //   delete purchase_items[index]['id'] 
          
        // }
        // console.log('here')
        // console.log(purchase_items)
        const formdata=new FormData()
        if(document.getElementById('myfile').files[0]){
          formdata.append('file', document.getElementById('myfile').files[0])
        }

        
        formdata.append('requested_by',  document.getElementById("Requested_B").value)
        formdata.append('company_name',  document.getElementById("Company_Name").value)
        formdata.append('project_name',  document.getElementById("Project_Name").value)
        formdata.append('delivery_date',  document.getElementById("Delivery_Date").value)
        formdata.append('status',  document.getElementById("Status").value)
        formdata.append('po_number',  document.getElementById("PO_Number").value)
        formdata.append('bom_number',  document.getElementById("BOM_Number").value)
        formdata.append('comments',  document.getElementById("Comments").value)
        formdata.append('approved_by',  document.getElementById("Approved_By").value)
        formdata.append('maintained_by',  document.getElementById("Maintained_By").value)
        formdata.append('purchase_items',  JSON.stringify(purchase_items))
        
        if(document.getElementById('myfile').files[0]){
          if(document.getElementById('myfile').files[0].name.split('.').pop() !== 'pdf' && document.getElementById('myfile').files[0].name.split('.').pop() !=='PDF'){
              alert('Wrong file type attached, only pdf allowed')
              // document.getElementById("sub").disabled = false;
              return
          }
      }
      this.setState({
        isLoaded:false
      })
        
        const data = [
          {
            "id": id
          },
          {
            // "id": document.getElementById("id").value,
            "requested_by": document.getElementById("Requested_B").value,
            "company_name": document.getElementById("Company_Name").value,
            "project_name": document.getElementById("Project_Name").value,
            "delivery_date": document.getElementById("Delivery_Date").value,
            "status": document.getElementById("Status").value,
            "po_number": document.getElementById("PO_Number").value,
            "bom_number": document.getElementById("BOM_Number").value,
            "comments": document.getElementById("Comments").value,
            "approved_by": document.getElementById("Approved_By").value,
            purchase_items,
            


            
          },
          // {
           //"id": "7",
          // "Unit":document.getElementById("Unit").value,
          // "Quantity":document.getElementById("Quantity").value,
          // "Available":document.getElementById("Available").value,
          // "Description":document.getElementById("Description").value,
          // "Need_to_Procure":document.getElementById("Need_to_Procure").value,
       
          // "counter":1
          
          // }
          
          
        ]






      //   for (let index = 0; index < this.state.items.length; index++) {
      //     var items ={
      //         "Unit": document.getElementById("Unit"+index).value,
      //         "Quantity": document.getElementById("Quantity"+index).value,
      //         "Description": document.getElementById("Description"+index).value,
      //         "Available": document.getElementById("Available"+index).value,
      //         "Need_to_Procure": document.getElementById("Need_to_Procure"+index).value,
      //     }
      //     data.purchase_items.push(items)
      //     console.log(data)

      // }
      //console.log(items)
        // console.log(data)
        const access_token = localStorage.getItem('access_token');
        await fetch(URL2+'purchase-requisition/updatePR/'+id, {
            headers : { 
                // 'Content-Type': 'application/json',
                // 'Accept': 'application/json',
                'access_token' : access_token
                },
                credentials: 'include',
              method: 'PUT',
              // mode: 'cors',
              body: formdata
            })
            .then(response => response.json())
            .then((json) => {
              if (json.statusCode == 404 || json.statusCode == 401 || json.statusCode == 500 || json.statusCode == 403 || json.statusCode == 400) { 
                throw Error(json.statusText)        
            }
            else{
              
            
                 // console.log(json)
                if(json){
                  this.setState({
                    show:false
                  })
                  toast.success('MR updated successfully', {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined,
                    });
                  
                  
                }
              }
                })
                .catch((e) => {
                  // console.log(e)  
                  toast.error('Something went wrong, MR not updated', {
                      position: "top-center",
                      autoClose: 3000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: false,
                      draggable: true,
                      progress: undefined,
                      });
                });

                let url = new URL(URL2+`purchase-requisition/get-prs`);
                url.searchParams.append('sort', 'DESC');
                await fetch(url, {
                  headers : { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'access_token' : access_token
                   },
                   credentials: 'include'
                }).then(response => response.json())
                .then((response) => {
                  if (response.statusCode == 404 || response.statusCode == 401 || response.statusCode == 500 || response.statusCode == 403 || response.statusCode == 400) { 
                    throw Error(response.statusText)        
                }
                else{

              
                  // console.log(response)
                  var requested_by = []
                  for (let index = 0; index < response.length; index++) {
                    requested_by[index] = response[index].requested_by;
                      
                  }
                  const uniq_requested_by = [...new Set(requested_by)];
                  // console.log(uniq_requested_by)
                  var companies = []
                  for (let index = 0; index < response.length; index++) {
                    companies[index] = response[index].company_name;
                      
                  }
                  const uniq_companies = [...new Set(companies)];
                  // console.log(uniq_companies)
                  var projects = []
                  for (let index = 0; index < response.length; index++) {
                    projects[index] = response[index].project_name;
                      
                  }
                  const uniq_projects = [...new Set(projects)];
                  var status = []
                  for (let index = 0; index < response.length; index++) {
                    status[index] = response[index].status;
                      
                  }
                  const uniq_status = [...new Set(status)];
                  var maintained_by = []
                  for (let index = 0; index < response.length; index++) {
                    maintained_by[index] = response[index].maintained_by;
                      
                  }
                  const uniq_maintained_by = [...new Set(maintained_by)];
                  const filtered_maintained_by = uniq_maintained_by.filter(function (el) {
                    return el != null;
                  });
                  // console.log(uniq_maintained_by)
                  this.setState({
                    isLoaded: true,
                    maintained_by: filtered_maintained_by,
                    status: uniq_status,
                    projects: uniq_projects,
                    companies: uniq_companies,
                    requested_by: uniq_requested_by,
                    data: response,
                    data1: response
                })
              }
              })
              .catch((e) => {
                // console.log(e)  
                toast.error('Something went wrong, MR not retrieved', {
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
      handleClose = () =>{
        this.setState({
          show : false
        })
      }

       numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
    
      handleClose = () => {
        this.setState({ show: false });
      };

      convert(date){
        
        var time = Date.parse(date);
        
        var d = new Date(time);
        const month =d.getMonth()+1
        const day = d.getDate()
        const year = d.getFullYear()
        
        return year+'-'+this.addZero(month)+'-'+this.addZero(day)
        
      }
      abc (date)
        {
        var time = Date.parse(date);
        var date1 = new Date(time);
        
        let d =this.addZero(date1.getDate())
        let m =this.addZero(date1.getMonth()+1)
        let y = this.addZero(date1.getFullYear())
        
        let time1 = y + "-" + m + "-"+d
        return time1
        
        }
        addZero(i) {
            if (i < 10) {i = "0" + i}
            return i;
          }
          onFilter = (e) =>{
            const key = e.key; // const {key} = event; ES6+
            if (key === "Backspace" || key === "Delete") {
              this.setState({
                isLoaded:false,
              })
              const filteredItems = this.state.data1.filter(
                item =>
                  JSON.stringify(item.id)
                    .toLowerCase()
                    .indexOf(e.target.value.toLowerCase()) !== -1 ||
  
                  JSON.stringify(item.company_name)
                    .toLowerCase()
                    .indexOf(e.target.value.toLowerCase()) !== -1 ||
                  
                  JSON.stringify(item.requested_by)
                    .toLowerCase()
                    .indexOf(e.target.value.toLowerCase()) !== -1 ||
  
                  JSON.stringify(item.project_name)
                    .toLowerCase()
                    .indexOf(e.target.value.toLowerCase()) !== -1 ||
  
                  JSON.stringify(item.po_number)
                    .toLowerCase()
                    .indexOf(e.target.value.toLowerCase()) !== -1 ||

                  JSON.stringify(item.maintained_by)
                    .toLowerCase()
                    .indexOf(e.target.value.toLowerCase()) !== -1 ||
                  
                  JSON.stringify(item.status)
                    .toLowerCase()
                    .indexOf(e.target.value.toLowerCase()) !== -1 ||
                  
                  JSON.stringify(item.delivery_date)
                    .toLowerCase()
                    .indexOf(e.target.value.toLowerCase()) !== -1 ||

                  JSON.stringify(item.created_at)
                    .toLowerCase()
                    .indexOf(e.target.value.toLowerCase()) !== -1
  
  
              );
              // console.log(filteredItems)
              this.setState({
                data: filteredItems,
                isLoaded:true
              })
              // console.log('data',this.state.data)
            }
            else{
            // console.log(e.target.value)
            this.setState({
              isLoaded:false,
            })
            const filteredItems = this.state.data.filter(
              item =>
                JSON.stringify(item.id)
                  .toLowerCase()
                  .indexOf(e.target.value.toLowerCase()) !== -1 ||

                JSON.stringify(item.company_name)
                  .toLowerCase()
                  .indexOf(e.target.value.toLowerCase()) !== -1 ||
                
                JSON.stringify(item.requested_by)
                  .toLowerCase()
                  .indexOf(e.target.value.toLowerCase()) !== -1 ||

                JSON.stringify(item.project_name)
                  .toLowerCase()
                  .indexOf(e.target.value.toLowerCase()) !== -1 ||

                JSON.stringify(item.po_number)
                  .toLowerCase()
                  .indexOf(e.target.value.toLowerCase()) !== -1 ||

                JSON.stringify(item.maintained_by)
                  .toLowerCase()
                  .indexOf(e.target.value.toLowerCase()) !== -1 ||
                
                JSON.stringify(item.status)
                  .toLowerCase()
                  .indexOf(e.target.value.toLowerCase()) !== -1 ||
                
                JSON.stringify(item.delivery_date)
                  .toLowerCase()
                  .indexOf(e.target.value.toLowerCase()) !== -1 ||

                JSON.stringify(item.created_at)
                  .toLowerCase()
                  .indexOf(e.target.value.toLowerCase()) !== -1


            );
            // console.log(filteredItems)
            this.setState({
              data: filteredItems,
              isLoaded:true
            })
            // console.log('data',this.state.data)
          }
        }
      
    render(){
        return(
        <Container fluid className="main-content-container px-4" >
        {/* Page Header */}
        <Row noGutters className="page-header py-4">
            <PageTitle title={`Material Requisition`}  className="text-sm-left" /> 
        </Row>
        {this.state.isLoaded ? (
          <div>
            <Can I="read" a="/purchase-requisition/get-prs/" ability={this.state.ability}>
            <Row style={{marginBottom: '5px'}}>
              <Col>
              <h5 style={{flex:'8'}} class="m-0 "><span style={{fontSize:'11px', marginLeft:'5px', color:'blue', cursor:'pointer'}} onClick={this.resetfilters}>Reset Filters</span></h5>
              </Col>
              <Col>
              </Col>
              <Col>
              <input style={{border:'1px solid black'}} class="form-control" id="search" type="text" placeholder="Search..."  onKeyUp={this.onFilter}></input>
              </Col>
            </Row>
         
            <Card small>




        
        <DataTable
          columns={this.state.columns}
          data={this.state.data}
          highlightOnHover={true}
          defaultSortFieldId={0}
          style={{overflow:'wrap'}}
          //sortServer
          pagination
        />
        
        
        </Card>
        
        </Can>
        </div>
        ): (<L></L>)}
        <div id="snackbar_invc" style={{marginTop:'45px'}}>Material request Info Updated</div>
        <Modal
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            show={this.state.show}
          >
            <Modal.Header>
              <Modal.Title>Edit Material Request</Modal.Title>
            </Modal.Header>
            <Modal.Body>

            <ul class="list-group list-group-flush">
              <li class="list-group-item p-3">
                <div class="row">
                  <div class="col-sm-12 col-md-6">
                    <strong class="text-muted d-block mb-2">Material Request Information</strong>
                    <form>
                      <div class="form-group">
                      <label style={{fontSize:'13px'}}>Requested By</label>
                        <div class="input-group mb-3">
                        
                          {/* <div class="input-group-prepend">
                            <span class="input-group-text" id="basic-addon1">
                              @
                            </span>
                          </div> */}
                          <input
                            type="text"
                            class="form-control"
                            aria-label="Username"
                            aria-describedby="basic-addon1"
                            defaultValue={this.state.pr.requested_by}
                            id="Requested_B"
                          />{" "}
                        </div>
                      </div>

                      <div class="form-group">
                      <label style={{fontSize:'13px'}}>Company</label>
                        <div class="input-group mb-3">
                          <input
                            type="text"
                            class="form-control"
                            aria-label="Username"
                            aria-describedby="basic-addon1"
                            defaultValue={this.state.pr.company_name}
                            id="Company_Name"
                          />{" "}
                        </div>
                      </div>

                      <div class="form-group">
                      <label style={{fontSize:'13px'}}>Project</label>
                        <input
                          type="text"
                          class="form-control"
                          id="Project_Name"
                            
                          defaultValue={this.state.pr.project_name}
                        />{" "}
                      </div>
                      <div class="form-group">
                      <label style={{fontSize:'13px'}}>Delivery Date</label>
                        <input
                          type="Date"
                          class="form-control"
                          
                          id="Delivery_Date"
                          defaultValue={this.abc(this.state.pr.delivery_date)}
                        />{" "}
                      </div>
                      
                      <div class="form-group">
                      <label style={{fontSize:'13px'}}>Attachment</label>
                      <label for="exampleInputPassword1" style={{fontSize:'9px', color:'grey', marginLeft:'3px'}}>Only pdf files accepted</label>
                      <input type="file" id="myfile" name="myfile" class="form-control"></input>{" "}
                      </div>
                      <div class="form-group">
                      <label style={{fontSize:'13px'}}>Responsible for MR</label>
                        <div class="input-group mb-3">
                          {
                          <select  defaultValue={this.state.pr.maintained_by} class="form-control" name="Maintained_By" id="Maintained_By">
                          <option disabled selected value=''> --Maintained By-- </option>
                              <option key="1" value="Waqas Bashir">   
                              Waqas Bashir
                              </option>
                              <option key="2" value="Warrick Viviers">   
                              Warrick Viviers
                              </option>
                              <option key="3" value="Muhammed Aslam">   
                              Muhammed Aslam
                              </option>
                              <option key="4" value="Tyrone Owen">   
                              Tyrone Owen
                              </option>
                              <option key="5" value="Ahmed A Jalil">   
                              Ahmed A Jalil
                              </option>
                              <option key="6" value="Joel Kerina">   
                              Joel Kerina
                              </option>

                          </select>
                          }
                        </div>
                      </div>

                      {}
                    </form>
                  </div>
                  <div class="col-sm-12 col-md-6">
                    <strong class="text-muted d-block mb-2">
                    &nbsp;
                    </strong>
                    <form>
                      <div class="form-group">
                      <label style={{fontSize:'13px'}}>Status</label>
                        <div class="input-group mb-3">
                          {
                          <select  defaultValue={this.state.pr.status} class="form-control" name="Status" id="Status">
                          <option disabled selected value> --Document Status-- </option>
                          
                                     <option key="1" value="New">   
                                           New
                                     </option>
                                     <option key="3" value="Approved">   
                                          Approved
                                     </option> 
                                     <option key="4" value="PO Created">   
                                           PO Created
                                     </option> 
                                     <option key="5" value="Delivered">   
                                            Delivered
                                     </option> 
                                     <option key="5" value="Complete">   
                                            Complete
                                     </option> 
                                     <option key="5" value="Cancelled">   
                                            Cancelled
                                     </option> 

                          </select>
                          }
                        </div>
                      </div>

                      <div class="form-group">
                      <label style={{fontSize:'13px'}}>Approved By</label>
                        <div class="input-group mb-3">
                          {
                          <select  defaultValue={this.state.pr.approved_by} class="form-control" name="Approved_By" id="Approved_By">
                          <option disabled selected value> --Document Approved By-- </option>
                          
                          <option key="1" value="Ali Akbar">   
                                               Ali Akbar
                                               </option>
                                               <option key="2" value="Bradley Worral">   
                                               Bradley Worral
                                               </option>
                                               <option key="3" value="Bruce Buchan">   
                                               Bruce Buchan
                                               </option> 
                                               <option key="4" value="Dominik Braun">   
                                               Dominik Braun
                                               </option> 
                                               <option key="5" value="Donovan de Wet">   
                                               Donovan de Wet
                                               </option> 
                                               <option key="6" value="Eqbal Alzoghbi">   
                                               Eqbal Alzoghbi
                                               </option> 
                                               <option key="7" value="Jaco Roos">   
                                               Jaco Roos
                                               </option> 
                                               <option key="8" value="Juanice Pienaar">   
                                               Juanice Pienaar
                                               </option> 
                                               <option key="9" value="Linda Scholtemeijer">   
                                               Linda Scholtemeijer
                                               </option> 
                                               <option key="10" value="Marius Nortje">   
                                               Marius Nortje
                                               </option> 
                                               <option key="11" value="Muhammad Aslam">   
                                               Muhammad Aslam
                                               </option> 
                                               <option key="12" value="Philip Roos">   
                                               Philip Roos
                                               </option> 
                                               <option key="13" value="Pieter Scholtemeijer">   
                                               Pieter Scholtemeijer
                                               </option> 
                                               <option key="14" value="Quinton Green">   
                                               Quinton Green
                                               </option> 
                                               <option key="15" value="Robin Dufour">   
                                               Robin Dufour
                                               </option> 
                                               <option key="16" value="Ruby Sawhney">   
                                               Ruby Sawhney
                                               </option> 
                                               <option key="17" value="Sreehari">   
                                               Sreehari
                                               </option> 
                                               <option key="18" value="Stephen Fitzpatrick">   
                                               Stephen Fitzpatrick
                                               </option> 
                                               <option key="19" value="Thajbeh Saif">   
                                               Thajbeh Saif
                                               </option> 
                                               <option key="20" value="Victor de Kock">   
                                               Victor de Kock
                                               </option> 
                                               <option key="21" value="Waqas Bashir">   
                                               Waqas Bashir
                                               </option> 

                          </select>
                          }
                        </div>
                      </div>

                      <div class="form-group">
                      <label style={{fontSize:'13px'}}>PO No</label>
                        <input
                          type="text"
                          class="form-control"
                          id="PO_Number"
                          defaultValue={this.state.pr.po_number}
                        />{" "}
                      </div>

                      <div class="form-group">
                      <label style={{fontSize:'13px'}}>BOM No</label>
                        <input
                          type="text"
                          class="form-control"
                          id="BOM_Number"
                          defaultValue={this.state.pr.bom_number}
                        />{" "}
                      </div>
                      <div class="form-group">
                      <label style={{fontSize:'13px'}}>Comment</label>

                      <textarea 
                      class="form-control"  
                      id="Comments" 
                      defaultValue={this.state.pr.comments}
                      >
                      </textarea>{" "}
                      </div>

                    </form>
                  </div>
                </div>
              </li>
              </ul>

              {this.state.items.map((item,i) => (
              <Row>items Details
                <Col>

                <li key={i}>

                <label style={{fontSize:'13px'}}>Item Description</label>
                        <input
                          type="text"
                          class="form-control description"
                          data-item-id={item.id}
                          id="description"
                          defaultValue={item.description}
                          maxlength="94"
                        />{" "}

                          <label style={{fontSize:'13px'}}>Item Available</label>
                        <input
                          type="text"
                          class="form-control available"
                          id="available"
                          data-item-id={item.id}
                          defaultValue={item.available}
                        />{" "}

                        <label style={{fontSize:'13px'}}>Item Quantity</label>
                        <input
                          type="text"
                          class="form-control quantity"
                          id="quantity"
                          data-item-id={item.id}
                          defaultValue={item.quantity}
                        />{" "}

                        <label style={{fontSize:'13px'}}>Item Unit</label>
                        <input
                          maxlength="8"
                          type="text"
                          class="form-control unit"
                          id="unit"
                          data-item-id={item.id}
                          defaultValue={item.unit}
                        />{" "}
                         <label style={{fontSize:'13px'}}>Item Need to Procure</label>
                        <input
                          type="text"
                          class="form-control need_to_procure"
                          id="need_to_procure"
                          data-item-id={item.id}
                          defaultValue={item.need_to_procure}
                        />{" "} 

                </li>

                
                
                <div class="form-group">
                      
                      </div>
                </Col>
              </Row>
               ))}
            </Modal.Body>
            <Modal.Footer>
              <button  onClick={this.handleClose}>
                Close
              </button>
              <button  disabled={this.state.edit_pr} onClick={()=>this.handlesubmit(this.state.pr.id)}>
                Save Changes
              </button>
            </Modal.Footer>
          </Modal>
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
        );
    }
}
export default PR_Approve;