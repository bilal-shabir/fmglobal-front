import React from "react";
import PropTypes from "prop-types";
import {
  Card,
  CardHeader,
  CardBody,
  ListGroup,
  ListGroupItem,
  CardFooter,
  Row,
  Col,
  FormSelect
} from "shards-react";
import {URL} from '../../constants';

class Systemsinfo extends React.Component{

  constructor(props) {
        super(props);
        const userIs_logged=localStorage.getItem('is_logged');
        const userEmail=localStorage.getItem('Email');
        const userToken=localStorage.getItem('Password');
        const UserId=localStorage.getItem('ID');

        if(userIs_logged != 1){
        this.props.history.push("/login");
        }

        this.state = {
          UserId,
          TP: '',
          isLoaded: false,
          
        }
    }

  componentDidMount() {
      fetch(URL+'customers/getSalmanPower', {
          headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
        })
        .then(res => res.json())
        .then(result => {
          if(result.status=='success'){
            //console.log(result);
            this.setState({
              isLoaded: true,
              TP: result.data.TP
            });
            //console.log(result.data.TP);
          }
          else if(result.status=='failed'){
            alert('failed')
            this.setState({
              isLoaded: false
              })     
          }
        });
  }

  render() {
    
    const { TP, isLoaded } = this.state;
    if (!isLoaded) {
      return <div>Loading ... </div>;
    } else {
      return (
      <Card small>
        <CardHeader className="border-bottom">
          <h6 className="m-0">Salman City</h6>
          <div className="block-handle" />
        </CardHeader>
    
        <CardBody className="p-0">
          <ListGroup small flush className="list-group-small">
              <ListGroupItem className="d-flex px-3">
                <span className="text-semibold text-fiord-blue">System Type</span>
                <span className="ml-auto text-right text-semibold text-reagent-gray">
                Recycle System
                </span>
              </ListGroupItem>
          </ListGroup>

          <ListGroup small flush className="list-group-small">
              <ListGroupItem className="d-flex px-3">
                <span className="text-semibold text-fiord-blue">Power Consumption (KW)</span>
                <span className="ml-auto text-right text-semibold text-reagent-gray">
                  {TP}
                </span>
              </ListGroupItem>
          </ListGroup>

          <ListGroup small flush className="list-group-small">
              <ListGroupItem className="d-flex px-3">
                <span className="text-semibold text-fiord-blue">Water Production (CBM)</span>
                <span className="ml-auto text-right text-semibold text-reagent-gray">
                  -
                </span>
              </ListGroupItem>
          </ListGroup>

        </CardBody>
        
        <CardFooter className="border-top">
          <Row>
            {/* Time Span */}
            <Col>
              <FormSelect
                size="sm"
                value="last-week"
                style={{ maxWidth: "130px" }}
                onChange={() => {}}
              >
                <option value="last-week">Last Week</option>
              </FormSelect>
            </Col>
    
            {/* View Full Report */}
            <Col className="text-right view-report">
              {/* eslint-disable-next-line */}
              <a href="#">Full report &rarr;</a>
            </Col>
          </Row>
        </CardFooter>
      </Card>
    );
    }
  }
};

export default Systemsinfo;
