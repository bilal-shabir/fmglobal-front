import React from "react";
import {Card,
  CardBody,
  ListGroup,
  ListGroupItem,
  CardFooter,
  Row,
  Col,
  Container} from "shards-react";
import {Link} from "react-router-dom";
import PageTitle from "../components/common/PageTitle";
import { URL2} from '../constants';
import '../assets/style.css';
import L from "../components/components-overview/loader";
import icon36 from '../images/icons-36.png';
import icon34 from '../images/icons-34.png';
import icon33 from '../images/icons-33.png';
import icon32 from '../images/icons-32.png';
import icon31 from '../images/icons-31.png';
import Echart4 from "../components/components-overview/LiveProduction";
import { Can } from "@casl/react";
import setPermissions from "./defineAbility";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

let controller
class PowerSystem extends React.Component{
  constructor(props) {
    super(props);
    const userIs_logged=localStorage.getItem('is_logged');
    if(userIs_logged != 1){
      this.props.history.push("/login");
    }
    this.state = {
        ability: null,
        customer: false,
        total_production: 0,
        CO2: 0,
        trees: 0,
        cars: 0,
        smartphones: 0,
        inverters: 0,
        projects: [],
        isLoaded:false,
        counter: 0
    }
  }

  async componentDidMount() {

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
      if (json.statusCode == 404 || json.status==404 || json.statusCode == 500 || json.statusCode == 403 || json.statusCode == 400) {
        throw Error(json.statusText)        
    }
    else{
      console.log("permissions", json)
      const ability = setPermissions(json);
      console.log("permissions",ability)
      this.setState({
        ability:ability
      })
    }
    })
    .catch((e) => {
      console.log(e)  
      // toast.warning('Something went wrong...', {
      //     position: "top-center",
      //     autoClose: 3000,
      //     hideProgressBar: false,
      //     closeOnClick: true,
      //     pauseOnHover: false,
      //     draggable: true,
      //     progress: undefined,
      //     });
    });
    
    require('../utils').checkpermision('PowerSystem')

    const type = localStorage.getItem('Type'); 
    if(type == 'customer'){
        this.setState({
            customer:true
        })
    }
    fetch(URL2+'project/getPowerProjects',{
        headers : { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',

         },
         credentials: 'include',
         signal
      })
      .then(response => response.json())
      .then((json)=>{
        if (json.statusCode == 404 || json.status==404 || json.statusCode == 500 || json.statusCode == 403 || json.statusCode == 400) {
          throw Error(json.statusText)        
      }
      else{
          console.log(json)
          const projects = json.filter(project =>
            project.project_type.name== 'Solar' || 'Power'
            )
            if(projects.length !=0){
              this.setState({
                projects: projects,
                
              })
            }
          
            let total_production = 0;
            let inverters = 0;
            for (let index = 0; index < projects.length; index++) {
              total_production = total_production + projects[index].production_generated
              //inverters = inverters + (projects[index].devices).length
                
            }
            total_production = total_production/1000
            this.setState({
                total_production: Math.round(total_production),
                inverters: Math.round(inverters),
                CO2: Math.round((total_production*0.00071)*1000),
                smartphones: Math.round(total_production*86.2),
                cars: Math.round(total_production*1.8*1.609344),
                trees: Math.round(total_production*0.01172),
                isLoaded: true
            })
       }
      })
      .catch((e) => {
        console.log(e)  
        // toast.error('Error: Project not fetched', {
        //     position: "top-center",
        //     autoClose: 3000,
        //     hideProgressBar: false,
        //     closeOnClick: true,
        //     pauseOnHover: false,
        //     draggable: true,
        //     progress: undefined,
        //     });
      });
      
  }
  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  componentWillUnmount(){
    if(controller){
      controller.abort();
  }
  }

  render (){
    // let items = this.state.items;
    // { tp,co2,tree,car,Planes,
 
    const {isLoaded } = this.state;
    return (
      <Container fluid className="main-content-container px-4" >
        {/* Page Header */}
        <Row noGutters className="page-header py-4">
            <PageTitle title={`O&M Power Dashboard`}  className="text-sm-left" /> 
            
        </Row>
        {this.state.projects && this.state.customer ?(<Row noGutters className="page-header">
          <Col sm={12} className="text-sm-left text-center text-md-left mb-sm-0 col-12 col-sm-4 mb-6">
          {/* {this.state.projects ? (<Updated_at id={this.state.projects[0].id}></Updated_at>) : (<div></div>)} */}
         
          </Col>
       
        </Row>): (<div></div>)}
        
        {isLoaded ? (<Container fluid className="main-content-container px-4" > 
        
        <Can I="read" a="/project/getPowerProjects/" ability={this.state.ability}>
        <div style={{display:'flex',justifyContent:'center', marginTop:'30px'}} >    
            <div className="">
            <Row style={{width:'100%', margin: '0 auto' }} >
                           
                    <Col lg="1" md="12" sm="12" >  
                      </Col>
                          
                        
                      
                      <Col lg="2" md="12" sm="12" className="mb-4" >
                      {/* <p className="m-0 text-center cardtxt" >Total Power Generated</p> */}
                        <Card small >
                            <div className="p-0" style={{backgroundColor:'white', borderRadius:'0', border:'1px solid #cfd1d4'}}>
                            <span className="ml-auto text-center text-bold"  >
                                <p class="cardstats">{this.numberWithCommas(this.state.total_production)} <br/>kWh</p>
                              </span>
                            <div style={{margin: "auto",width: "100%",alignContent:"center",alignItems:"center", marginTop:'-40px', marginBottom:'2px'}}>
                              <img src={icon31} width={'100%'}></img>
                              <div className="text-center text-bold" style={{backgroundColor:'#F5F6F8',width:'97%', marginLeft:'1.5%',marginTop:'-20px'}}>
                                <span  class="cardheading">Total Production</span>
                              </div>
                              </div>
                              {/* <div className="text-center text-bold" style={{backgroundColor:'#F5F6F8',width:'97%', marginLeft:'1.5%'}}>
                                <span style={{fontSize:'12px'}}>Total Power Consumption</span>
                              </div> */}
                            
                            </div>
                            
                        </Card> 
                        
                      </Col>
    
                      <Col lg="2" md="12" sm="12" className="mb-4" >
                      {/* <p className="m-0 text-center cardtxt" >Total Power Generated</p> */}
                        <Card small className="cardtip">
                            <div className="p-0" style={{backgroundColor:'white', borderRadius:'0', border:'1px solid #cfd1d4'}}>
                            <span className="ml-auto text-center text-bold"  >
                                <p class="cardstats">{this.numberWithCommas(this.state.CO2)} <br/>kg</p>
                              </span>
                            <div style={{margin: "auto",width: "100%",alignContent:"center",alignItems:"center", marginTop:'-40px', marginBottom:'2px'}}>
                              <img src={icon32} width={'100%'}></img>
                              <div className="text-center text-bold tipfirstshow" style={{backgroundColor:'#F5F6F8',width:'97%', marginLeft:'1.5%',marginTop:'-20px'}}>
                                <span class="cardheading">CO2 Savings</span>
                              </div>
                              <div className="text-center text-bold tip" style={{backgroundColor:'#F5F6F8',width:'97%', marginLeft:'1.5%',marginTop:'-20px'}}>
                              <span style={{color:'black'}} class="cardheading">CO2 emissions (Kg) avoided</span>
                              </div>
                              </div>
                            
                            </div>
                            
                        </Card> 
                        
                      </Col>
    
    
                      <Col lg="2" md="12" sm="12" className="mb-4" >
                      {/* <p className="m-0 text-center cardtxt" >Total Power Generated</p> */}
                        <Card small  className="cardtip1">
                            <div className="p-0" style={{backgroundColor:'white', borderRadius:'0', border:'1px solid #cfd1d4'}}>
                            <span className="ml-auto text-center text-bold"  >
                                <p class="cardstats">{this.numberWithCommas(this.state.trees)} <br/>Trees</p>
                              </span>
                            <div style={{margin: "auto",width: "100%",alignContent:"center",alignItems:"center", marginTop:'-40px', marginBottom:'2px'}}>
                              <img src={icon33} width={'100%'}></img>
                              <div className="text-center text-bold tipfirstshow1" style={{backgroundColor:'#F5F6F8',width:'97%', marginLeft:'1.5%',marginTop:'-20px'}}>
                                <span  class="cardheading">Trees Seedlings</span>
                              </div>
                              <div className="text-center text-bold tip1" style={{backgroundColor:'#F5F6F8',width:'97%', marginLeft:'1.5%'}}>
                                <span style={{color:'black'}} class="cardheading">Tree seedlings grown for ten years</span>
                              </div>
                              </div>
                              {/* <div className="text-center text-bold" style={{backgroundColor:'#F5F6F8',width:'97%', marginLeft:'1.5%'}}>
                                <span style={{fontSize:'12px'}}>Total Power Consumption</span>
                              </div> */}
                            
                            </div>
                        </Card> 
                        
                      </Col>
                      <Col lg="2" md="12" sm="12" className="mb-4" >
                      {/* <p className="m-0 text-center cardtxt" >Total Power Generated</p> */}
                        <Card small className="cardtip2">
                            <div className="p-0" style={{backgroundColor:'white', borderRadius:'0', border:'1px solid #cfd1d4'}}>
                            <span className="ml-auto text-center text-bold"  >
                                <p class="cardstats">{this.numberWithCommas(this.state.cars)} <br/>Kilometers</p>
                              </span>
                            <div style={{margin: "auto",width: "100%",alignContent:"center",alignItems:"center", marginTop:'-40px', marginBottom:'2px'}}>
                              <img src={icon34} width={'100%'}></img>
                              <div className="text-center text-bold tipfirstshow2" style={{backgroundColor:'#F5F6F8',width:'97%', marginLeft:'1.5%',marginTop:'-20px'}}>
                                <span  class="cardheading">Cars</span>
                              </div>
                              <div className="text-center text-bold tip2" style={{backgroundColor:'#F5F6F8',width:'97%', marginLeft:'1.5%'}}>
                                <span style={{color:'black'}} class="cardheading">Kilometers driven by an average passenger vehicle</span>
                              </div>
                              </div>
                              {/* <div className="text-center text-bold" style={{backgroundColor:'#F5F6F8',width:'97%', marginLeft:'1.5%'}}>
                                <span style={{fontSize:'12px'}}>Total Power Consumption</span>
                              </div> */}
                            
                            </div>
                        </Card> 
                        
                      </Col>
                      <Col lg="2" md="12" sm="12" className="mb-4" >
                      {/* <p className="m-0 text-center cardtxt" >Total Power Generated</p> */}
                        <Card small className="cardtip3">
                            <div className="p-0" style={{backgroundColor:'white', borderRadius:'0', border:'1px solid #cfd1d4'}}>
                            <span className="ml-auto text-center text-bold"  >
                                <p class="cardstats">{this.numberWithCommas(this.state.smartphones)} <br/>Smart Phones</p>
                              </span>
                            <div style={{margin: "auto",width: "97.5%",alignContent:"center",alignItems:"center", marginTop:'-40px', marginBottom:'2px'}}>
                              <img src={icon36} width={'100%'}></img>
                              <div className="text-center text-bold tipfirstshow3" style={{backgroundColor:'#F5F6F8',width:'97%', marginLeft:'1.5%',marginTop:'-20px'}}>
                                <span class="cardheading">Phones</span>
                              </div>
                              <div className="text-center text-bold tip3" style={{backgroundColor:'#F5F6F8',width:'97%', marginLeft:'1.5%',marginTop:'-20px'}}>
                                <span style={{color:'black'}} class="cardheading">Smart Phones Charged</span>
                              </div>
                              </div>
                              {/* <div className="text-center text-bold" style={{backgroundColor:'#F5F6F8',width:'97%', marginLeft:'1.5%'}}>
                                <span style={{fontSize:'12px'}}>Total Power Consumption</span>
                              </div> */}
                            
                            </div>
                        </Card> 
                        
                      </Col>     
                    </Row>
            </div>
        </div>
        </Can> 
        <Can I="read" a="/project/get_current/" ability={this.state.ability}>
        <Row style={{marginTop:'100px'}}>
            {/* {items.map(i =>(  */}
            { this.state.projects.map((i,index) =>{
                let counter
                if (index > 3) {
                    counter = 0
                }
                else{
                    counter = index
                }
                return(
                <Col lg="4" md="12" sm="12" className="mb-4">
                
                <Card small style={{marginTop: '100px'}}>
                     
                 
                     <CardBody className="p-0">
                     <div className={"hourlypowerchart1"} style={{padding:'5px', marginTop:'-90px'}}>

                       <Echart4 id={i.id}></Echart4>
                     </div>

                     <ListGroup small flush className="list-group-small">
                         <ListGroupItem className="d-flex px-3">
                             <span className="text-semibold text-fiord-blue" style={{fontSize:15, fontWeight:'bold'}}  >Project</span>
                             <span className="ml-auto text-right" style={{fontSize:15, fontWeight:'bold'}}>
                             {i.name}
                             </span>
                         </ListGroupItem>
                     </ListGroup>
                     <ListGroup small flush className="list-group-small">
                         <ListGroupItem className="d-flex px-3">
                             <span className="text-semibold text-fiord-blue">System Location</span>
                             <span className="ml-auto text-right text-bold text-reagent-gray">
                             {i.proj_location}
                             </span>
                         </ListGroupItem>
                     </ListGroup>

                     <ListGroup small flush className="list-group-small">
                         <ListGroupItem className="d-flex px-3">
                             <span className="text-semibold text-fiord-blue">Total Production (kWh)</span>
                             <span className="ml-auto text-right text-bold text-reagent-gray" style={{fontSize:"16px",fontWeight:"bolder"}}>
                               {this.numberWithCommas(Math.round(i.production_generated/1000))}
                             </span>
                         </ListGroupItem>
                     </ListGroup>
                    
                     </CardBody>
                     
                     <CardFooter className="border-top">
                     <Row>
                         
                         <Col className="text-right view-report">
                         
                         <Link to={`PowerSystem/${i.id}?h=${i.name}`}>Full Report &rarr;</Link>
                         </Col>
                     </Row>
                     </CardFooter>
                 </Card>
                 
                 
             </Col>

            )})}
                
            </Row>
          </Can>  
             </Container> ) : (<L></L>)}
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

export default PowerSystem;

