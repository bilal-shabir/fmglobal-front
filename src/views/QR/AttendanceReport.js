import React from "react";
import moment from 'moment'
import {Card,Container, Row, Col , FormSelect} from "shards-react";
import {URL2,DKEY} from '../../constants';
import PageTitle from "../../components/common/PageTitle";
import L from "../../components/components-overview/loader";
import DataTable from "react-data-table-component";
import ReactExport from "react-data-export";

let controller
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

class AttendanceReport extends React.Component{

  constructor(props) {
      super(props);
      const userIs_logged=localStorage.getItem('is_logged');
      const userEmail=localStorage.getItem('Email');
      const userToken=localStorage.getItem('Password');
    if(userIs_logged != 1){
      this.props.history.push("/login");
    }

      this.state = {
          from: moment(new Date()).format("YYYY-MM-DD"),
          to: moment(new Date()).format("YYYY-MM-DD"),
          Attendance:[],
          Attendance_filter:[],
          Attendance_rest:[],
          columns: [],
          employee_id: [],
          team : [],
          dirict_manger : []
        };
    }
    componentWillUnmount(){
      if(controller){
        controller.abort();
    }
    }

    returnManager = (row) =>{
      if(row.direct_manager){
        return row.direct_manager.name
      }else{
        return "No Manager"
      }
    }

  async componentDidMount(){
    controller = new AbortController();
    const signal = controller.signal;

    let from_date=this.state.from
    let to_date=this.state.to
    const response = await fetch(URL2 +'QR_TimeSheet/get_timesheat_calamari/'+from_date+'/'+to_date,{
      headers: {
        "Content-Type": "application/json",
        'Accept': "application/json"
      },
      credentials: 'include',
      method: "GET",
      signal
    });

    const json = await response.json();
    var employee_id = []
    var team = []
    var dirict_manger = []
    for (let index = 0; index < json.length; index++) {
      employee_id[index] = json[index].employee_no;
      team[index] = json[index].team[0];
      dirict_manger[index] = this.returnManager(json[index]);
    }
    var uniq_employee_id = [...new Set(employee_id)];
    var uniq_team = [...new Set(team)];
    var uniq_dirict_manger = [...new Set(dirict_manger)];

    this.setState({
      Attendance: json,
      Attendance_filter : json,
      Attendance_rest : json ,
      employee_id: uniq_employee_id.sort() ,
      team : uniq_team.sort(),
      dirict_manger : uniq_dirict_manger.sort(),
       isLoaded: true,
      columns: [
        {
          name: "Emp-ID",
          selector: (row) =>  row.employee_no,
          sortable: true,
      },
      {
        name: "Check-In",
        selector: (row) =>  row.started,
        sortable: true,
      },
      {
        name: "Check-Out",
        selector: (row) =>  row.finished,
        sortable: true,
      },
      {
        name: "Full Name",
        selector: (row) =>  row.full_name,
        sortable: true,
      },
      {
        name: "Email",
        selector: (row) =>  row.email,
        sortable: true,
      },
      {
        name: "Working Plan",
        selector: (row) =>  row.working_day_duration_time,
        sortable: true,
      },
      {
        name: "Manager",
        selector: (row) =>  this.returnManager(row),
        sortable: true,
      },
      {
        name: "Team",
        selector: (row) =>  row.team[0],
        sortable: true, 
      },
      {
        name: "Duration",
        selector: (row) =>  row.duration,
        sortable: true,
      },
      {
        name: "Balance",
        selector: (row) =>  row.balance,
        sortable: true,
      },
      {
        name: "%",
        selector: (row) =>  row.percentage,
        sortable: true,
      },

      ],

      })
  }

  //Handel date from and to
  handleDatFromAndToChange=async(event)=>{
    controller = new AbortController();
    const signal = controller.signal;

    document.getElementById("EmpId").selectedIndex = 0;
    document.getElementById("Team").selectedIndex = 0;
    document.getElementById("DirectManager").selectedIndex = 0;
    this.setState({
      isLoaded: false,
      })
  const from =document.getElementById("Date_From").value
  const to =document.getElementById("Date_To").value

  const response = await fetch(URL2 +'QR_TimeSheet/get_timesheat_calamari/'+from+'/'+to,{
    headers: {
      "Content-Type": "application/json",
      'Accept': "application/json"
    },
    credentials: 'include',
    method: "POST",
    signal

  });

  const json = await response.json();
  this.setState({
    Attendance: json,
    Attendance_filter : json,
    isLoaded: true,
    })
  }

filter=(event)=>{
  this.setState({
    isLoaded : false
  })
  let Attendance
  if(event.target.name === "EmpId")
  {
    Attendance = this.state.Attendance_filter.filter(records =>
      records.employee_no == event.target.value)    
  }
  else if(event.target.name === "Team")
  {
    Attendance = this.state.Attendance_filter.filter(records =>
      records.team == event.target.value)
  }else if(event.target.name === "DirectManager")
  {
    Attendance = this.state.Attendance_filter.filter(records =>
      this.returnManager(records) == event.target.value)
  }
    this.setState({
    Attendance: Attendance,
    isLoaded : true
  })
}

onFilter = (e) =>{
    this.setState({
      isLoaded:false,
    })
    const filteredItems = this.state.Attendance_filter.filter(
      item =>
        JSON.stringify(item)
          .toLowerCase()
          .indexOf(e.target.value.toLowerCase()) !== -1
    );
    this.setState({
      Attendance: filteredItems,
      isLoaded:true
    })
}

resetfilters = async() =>{
  this.setState({
    isLoaded:false
  })
    document.getElementById("EmpId").selectedIndex = 0;
    document.getElementById("Team").selectedIndex = 0;
    document.getElementById("DirectManager").selectedIndex = 0;
    document.getElementById("Date_From").value  = moment(new Date()).format("YYYY-MM-DD");
    document.getElementById("Date_To").value  = moment(new Date()).format("YYYY-MM-DD");
    this.setState({
      Attendance: this.state.Attendance_rest,
      isLoaded:true
    })

  }


  render(){
      return(
      <Container fluid className="main-content-container px-4" >
      {/* Page Header */}
      <Row noGutters className="page-header py-4">
          <PageTitle title={`Attendance Report`}  className="text-sm-left" /> 
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
                    <FormSelect aria-label="Default select example" name="EmpId" id="EmpId" onChange={this.filter} >
                      <option selected disabled value={false}>Employee ID</option>
                      {this.state.employee_id.map((employee_id) => 
                                             <option key={employee_id } value={employee_id}>   
                                                    { employee_id}
                                             </option>
                                            )}
                    </FormSelect>
                  </Col>

                  <Col sm={2} className="my-1">
                    <FormSelect aria-label="Default select example" name="Team" id="Team" onChange={this.filter} >
                      <option selected disabled value={false}>Team</option>
                      {this.state.team.map((team) => 
                                             <option key={team } value={team}>   
                                                    { team}
                                             </option>
                                            )}
                    </FormSelect>
                  </Col>

                  <Col sm={2} className="my-1">
                    <FormSelect aria-label="Default select example" name="DirectManager" id="DirectManager" onChange={this.filter} >
                      <option selected disabled value={false}>Direct Manager</option>
                      {this.state.dirict_manger.map((dirict_manger) => 
                                             <option key={dirict_manger } value={dirict_manger}>   
                                                    { dirict_manger}
                                             </option>
                                            )}
                    </FormSelect>
                  </Col>
                  <span> From </span>
                  <Col sm={1} className="my-1">
                  <div>
                      {/* <label for="exampleInputPassword1">From</label> */}
                      <input onChange={this.handleDatFromAndToChange} type="Date" class="form-control" placeholder="Choose From Date" name="Date_From" id="Date_From" 
                        defaultValue={this.state.from}
                      ></input>
                    </div>
                  </Col>
                  <span> To </span>
                  <Col sm={1} className="my-1">
                  <div>
                      {/* <label for="exampleInputPassword1">From</label> */}
                      <input onChange={this.handleDatFromAndToChange} type="Date" class="form-control" placeholder="Choose From Date" name="Date_to" id="Date_To" 
                        defaultValue={this.state.to}
                      ></input>
                    </div>
                  </Col>
                    
                  <span style={{ fontSize: '14px', color: 'blue', cursor: 'pointer' }} onClick={this.resetfilters}>Reset Filters</span>

                  <Col sm={1}>
                    <input style={{border: '1px solid black' }} class="form-control" id="search" type="text" placeholder="Search..." onKeyUp={this.onFilter}></input>
                  </Col>
                  <ExcelFile
                      filename = {"Attendance Report "+moment(new Date()).format("YYYY-MM-DD HH:MM:SS")}
                      element={
                      <button
                  
                      >
                          {" "}Exeport Excel{" "}
                      </button>
                      }
                  >
                      <ExcelSheet data={this.state.Attendance} name="Data">
                      <ExcelColumn
                          label="Emp-ID"
                          value={row => row.employee_no}
                      />
                      <ExcelColumn
                          label="Check-In"
                          value ={row => row.started}
                      />
                       <ExcelColumn
                          label="Check-Out"
                          value ={row => row.finished}
                      />
                       <ExcelColumn
                          label="Full Name"
                          value ={row => row.full_name}
                      />
                       <ExcelColumn
                          label="Email"
                          value ={row => row.email}
                      />
                       <ExcelColumn
                          label="Working Plan"
                          value ={row => row.working_day_duration_time}
                      />
                         <ExcelColumn
                          label="Manager"
                          value ={row => this.returnManager(row)}
                      />
                         <ExcelColumn
                          label="Team"
                          value ={row => row.team[0]}
                      />
                         <ExcelColumn
                          label="Duration"
                          value ={row => row.duration}
                      />
                            <ExcelColumn
                          label="Balance"
                          value ={row => row.balance}
                      />
                              <ExcelColumn
                          label="%"
                          value ={row => row.percentage}
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
              data={this.state.Attendance}
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
export default AttendanceReport;

