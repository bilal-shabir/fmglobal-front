import React from "react";
import moment from 'moment'
import {Card,Container, Row, Col , FormSelect} from "shards-react";
import {URL2,DKEY} from '../../constants';
import PageTitle from "../../components/common/PageTitle";
import L from "../../components/components-overview/loader";
import DataTable from "react-data-table-component";
import ReactExport from "react-data-export";
// import {data} from './data.js';
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
let controller

class XeroReport extends React.Component{
  constructor(props) {
    super(props);
    const userIs_logged=localStorage.getItem('is_logged');
    const userEmail=localStorage.getItem('Email');
    const userToken=localStorage.getItem('Password');
  if(userIs_logged != 1){
    this.props.history.push("/login");
  }
  
    this.state = {
        XeroReport:[],
        XeroReport_filter:[],
        XeroReport_rest:[],
        columns: [],
        contact_name: [],
        project : [],
        task : [],
        project_temp: [],
        task_temp :[]
      };
  }
  componentWillUnmount(){
    if(controller){
      controller.abort();
  }
  }

async componentDidMount(){

  controller = new AbortController();
  const signal = controller.signal;
  
  const response = await fetch(URL2 +'QR_Xero_Project_Task/xero_report',{
    headers: {
      "Content-Type": "application/json",
      'Accept': "application/json"
    },
    credentials: 'include',
    method: "GET",
    signal

  });
  const json = await response.json();
  // console.log(json)
 // const json = data
  let contact_name =[]
  let project = []
  let task = []
  for (let index = 0; index < json.length; index++) {
    project[index] = json[index].project_name
    task[index] = json[index].task_name
    contact_name[index] = json[index].contact_name
  }
  var uniq_contact_name = [...new Set(contact_name)].filter(element => element !== null && element !== undefined && element !== '');
  var uniq_project = [...new Set(project)].filter(element => element !== null && element !== undefined && element !== '');
  var uniq_task = [...new Set(task)].filter(element => element !== null && element !== undefined && element !== '');


  this.setState({
    XeroReport: json,
    XeroReport_filter : json,
    XeroReport_rest : json ,
    contact_name : uniq_contact_name.sort(),
    project_temp : uniq_project.sort(),
    task_temp : uniq_task.sort(),
    isLoaded: true,
     columns: [
      {
        name: "Emp-ID",
        selector: (row) =>  row.employee_no,
        sortable: true,
     },
     {
        name: "Emp-Name",
        selector: (row) =>  row.userName,
        sortable: true,
    },
    {
      name: "Contact Name",
      selector: (row) =>  row.contact_name,
      sortable: true,
   },
    {
      name: "Project Name",
      selector: (row) =>  row.project_name,
      sortable: true,
    },
    {
      name: "Task Name",
      selector: (row) =>  row.task_name,
      sortable: true,
    },
    {
      name: "Description",
      selector: (row) =>  row.description,
      sortable: true,
    },
    {
      name: "Time",
      selector: (row) =>  row.time,
      sortable: true,
    },
    {
      name: "Date Entered",
      selector: (row) =>  row.dateEnteredUtc,
      sortable: true,
    },
    {
      name: "Date",
      selector: (row) =>  row.dateUtc,
      sortable: true,
    },

    ],

    })
}

filter=(event)=>{
  this.setState({
    isLoaded : false
  })
let XeroReport
 if(event.target.name === "contact_name")
{
  XeroReport = this.state.XeroReport_filter.filter(records =>
    records.contact_name == event.target.value)
  let projects = []
  for (let index = 0; index < XeroReport.length; index++) {
    projects[index] = XeroReport[index].project_name
  }
  var uniq_project = [...new Set(projects)];
  this.setState({
    project: uniq_project
  })
  
}
else if(event.target.name === "project")
{
  XeroReport = this.state.XeroReport.filter(records =>
    records.project_name == event.target.value)
    let tasks = []
    for (let index = 0; index < XeroReport.length; index++) {
      tasks[index] = XeroReport[index].task_name
    }
    var uniq_tasks = [...new Set(tasks)];
    this.setState({
      task: uniq_tasks
    })
}else if(event.target.name === "task")
{
  XeroReport = this.state.XeroReport.filter(records =>
    records.task_name == event.target.value)
}
  this.setState({
    XeroReport: XeroReport,
    isLoaded : true
})
}

onFilter = (e) =>{
  this.setState({
    isLoaded:false,
  })
  const filteredItems = this.state.XeroReport_filter.filter(
    item =>
      JSON.stringify(item)
        .toLowerCase()
        .indexOf(e.target.value.toLowerCase()) !== -1
  );
  this.setState({
    XeroReport: filteredItems,
    isLoaded:true
  })
}

resetfilters = async() =>{
this.setState({
  isLoaded:false
})
  document.getElementById("contact_name").selectedIndex = 0;
  document.getElementById("project").selectedIndex = 0;
  document.getElementById("task").selectedIndex = 0;
  this.setState({
    XeroReport: this.state.XeroReport_filter,
    project : [],
    task :[],
    isLoaded:true
  })

}
  
  render(){
    return(
      <Container fluid className="main-content-container px-4" >
      {/* Page Header */}
      <Row noGutters className="page-header py-4">
          <PageTitle title={`Xero Report`}  className="text-sm-left" /> 
      </Row>
      <div class="form-group">
      </div>
        <div >
            <div style={{ paddingLeft:'10px',paddingRight:'10px', marginBottom:'10px'}}>
          {/* <h6 style={{ marginTop:'10px'}}>Select The Contact and the Project </h6> */}
        
          <Row>
          <Col lg="12" md="12" sm="12" className="mb-4">
            <Card className="mb-4" small>
      
                <Row className="align-items-center" style={{margin: 'initial'}}>

                  <Col sm={2} className="my-1">
                    <FormSelect aria-label="Default select example" name="contact_name" id="contact_name" onChange={this.filter} >
                      <option selected disabled value={false}>Contacts</option>
                      {this.state.contact_name.map((contact_name) => 
                                             <option key={contact_name } value={contact_name}>   
                                                    { contact_name}
                                             </option>
                                            )}
                    </FormSelect>
                  </Col>

                  <Col sm={2} className="my-1">
                    <FormSelect aria-label="Default select example" name="project" id="project" onChange={this.filter} >
                      <option selected disabled value={false}>Project</option>
                      {this.state.project.map((project) => 
                                             <option key={project } value={project}>   
                                                    { project}
                                             </option>
                                            )}
                    </FormSelect>
                  </Col>

                  <Col sm={2} className="my-1">
                    <FormSelect aria-label="Default select example" name="task" id="task" onChange={this.filter} >
                      <option selected disabled value={false}>Task</option>
                      {this.state.task.map((task) => 
                                             <option key={task } value={task}>   
                                                    { task}
                                             </option>
                                            )}
                    </FormSelect>
                  </Col>
               
                    
                  <span style={{ fontSize: '14px', color: 'blue', cursor: 'pointer' }} onClick={this.resetfilters}>Reset Filters</span>

                  <Col sm={1}>
                    <input style={{border: '1px solid black' }} class="form-control" id="search" type="text" placeholder="Search..." onKeyUp={this.onFilter}></input>
                  </Col>
                  <ExcelFile
                      filename = {"Xero Report "+moment(new Date()).format("YYYY-MM-DD HH:MM:SS")}
                      element={
                      <button
                  
                      >
                          {" "}Exeport Excel{" "}
                      </button>
                      }
                  >
                      <ExcelSheet data={this.state.XeroReport} name="Data">
                      <ExcelColumn
                          label="Emp-ID"
                          value={row => row.employee_no}
                      />
                      <ExcelColumn
                          label="Emp-Name"
                          value ={row => row.userName}
                      />
                      <ExcelColumn
                          label="Contact Name"
                          value ={row => row.contact_name}
                      />
                       <ExcelColumn
                          label="Project Name"
                          value ={row => row.project_name}
                      />
                       <ExcelColumn
                          label="Task Name"
                          value ={row => row.task_name}
                      />
                       <ExcelColumn
                          label="Description"
                          value ={row => row.description}
                      />
                       <ExcelColumn
                          label="Time"
                          value ={row => row.time}
                      />
                         <ExcelColumn
                          label="Date Entered"
                          value ={row =>row.dateEnteredUtc}
                      />
                         <ExcelColumn
                          label="Date"
                          value ={row => row.dateUtc}
                      />

                  </ExcelSheet>
</ExcelFile>
                </Row>
            </Card>


          </Col>
        </Row>
         
        </div>
        {this.state.isLoaded ? (
        <Card small>
            <DataTable
              columns={this.state.columns}
              data={this.state.XeroReport}
              highlightOnHover={true}
              style={{overflow:'wrap'}}
              //selectableRows
              //defaultSortFieldId={2}
              //sortServer
              pagination
            />
          </Card>
          ): (<L></L>)}
      </div>
      
    </Container>
      );
  }
}
export default XeroReport;

