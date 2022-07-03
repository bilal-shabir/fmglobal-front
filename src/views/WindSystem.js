import React from "react";
import PropTypes from "prop-types";
import { Card,
  CardHeader,
  CardBody,
  ListGroup,
  ListGroupItem,
  CardFooter,
  FormSelect, Container, Row, Col } from "shards-react";

import PageTitle from "../components/common/PageTitle";
import WindRadar from "../components/components-overview/WindRadar";
import WindRose from "../components/components-overview/WindRose";
import WindSpeed from "../components/components-overview/WindSpeed";
import WindSpeedcanvas from "../components/components-overview/WindSpeedcanvas";
import {URL2,DKEY} from '../constants';
import {Link,useRouteMatch,} from "react-router-dom";
import Cookies from "universal-cookie";
import L from "../components/components-overview/loader";
import Echart4 from "../components/components-overview/LiveProduction";
import '../assets/style.css';



class WindSystem extends React.Component{ 

    constructor(props) {
      super(props);
      const userIs_logged=localStorage.getItem('is_logged');
      if(userIs_logged != 1){
        this.props.history.push("/login");
      }

      this.state = {
        isLoaded: false,
        projects: []
        
      }
      
    }

    async componentDidMount() {
      
      require('../utils').checkpermision('WindSystem')
      const cookies = new Cookies();

      fetch(URL2+'project/getWindProjects',{
        headers : { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
  
         },
         credentials: 'include'
      })
      .then(response => response.json())
      .then((json)=>{
          //console.log(json)
          const projects = json.filter(project =>
            project.project_type.name== 'wind'
            )
          //console.log(projects)
          this.setState({
              projects: projects,
              isLoaded: true
            })
      })

        
    }

    render(){

        let items = this.state.projects;
        const { isLoaded } = this.state;
        return(

            <Container fluid className="main-content-container px-4">
            {/* Page Header */}
            <Row noGutters className="page-header py-4">
              <PageTitle title="Wind Speed Monitoring" subtitle="Dashboard" className="text-sm-left mb-3" />
            </Row>
            
            {isLoaded ? (<Row> 

            
            {items.map(item => ( 
                item.devices.map(device=>(
                  <Col lg="4" md="12" sm="12" className="mb-4">
                
                <Card small style={{marginTop: '100px'}}>
                     
                 
                     <CardBody className="">
                     <div className={"hourlypowerchart4"} style={{padding:'5px', marginTop:'-90px'}}>

                       <Echart4 ></Echart4>
                     </div>

                     <ListGroup small flush className="list-group-small">
                         <ListGroupItem className="d-flex px-3">
                             <span className="text-semibold text-fiord-blue" style={{fontSize:15, fontWeight:'bold'}}  >Project</span>
                             <span className="ml-auto text-right" style={{fontSize:15, fontWeight:'bold'}}>
                             {item.name}
                             </span>
                         </ListGroupItem>
                     </ListGroup>
                     <ListGroup small flush className="list-group-small">
                         <ListGroupItem className="d-flex px-3">
                             <span className="text-semibold text-fiord-blue">System Location</span>
                             <span className="ml-auto text-right text-bold text-reagent-gray">
                             {item.proj_location}
                             </span>
                         </ListGroupItem>
                     </ListGroup>

                     <ListGroup small flush className="list-group-small">
                         <ListGroupItem className="d-flex px-3">
                             <span className="text-semibold text-fiord-blue">Serial Number</span>
                             <span className="ml-auto text-right text-bold text-reagent-gray" style={{fontSize:"16px",fontWeight:"bolder"}}>
                               {device.sn}
                             </span>
                         </ListGroupItem>
                     </ListGroup>
                    
                     </CardBody>
                     
                     <CardFooter className="border-top">
                     <Row>
                         
                         <Col className="text-right view-report">
                         
                         <Link to={`PowerSystem/5`}>Full report &rarr;</Link>
                         </Col>
                     </Row>
                     </CardFooter>
                 </Card>
                 
                 
             </Col>
                ))
            ))} 
            </Row> ) : (<L></L>)}
      </Container>

 

    );
}
};



export default WindSystem;
