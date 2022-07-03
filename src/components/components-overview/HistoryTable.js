import React, { Component } from "react";
import DataTable from "react-data-table-component";
import L from "./loader";
import { ListGroup,ListGroupItem} from "react-bootstrap";


class HistoryTable extends Component {

  constructor(props) {
    super(props);
    
    const pid = this.props.id
    this.state = {
      columns :  this.props.columns,
      conditionalRowStyles:  this.props.conditionalRowStyles,
      data: this.props.data,
      customStyles : this.props.customStyles
      };

    //const ExpandedComponent = ;
  }
  getExpandableRows = (data) =>{

    let comments = [];
    comments = data.comments;
    // console.log(comments)
    return (
      <div className="p-3">
      <h6>Message Source:</h6>
      <span>
        {data.message_source_name}
      </span>
  
      <h6>Comments:</h6>
      <ListGroup as="ol" variant="flush">
      {comments.map((c) => 
       <ListGroup.Item as="li">
       {c}
       </ListGroup.Item>
      )}
      </ListGroup>
      </div>
  
    )
  }
  render() {
       
      return (
        
        <DataTable
          columns={this.state.columns}
          data={this.state.data}
          highlightOnHover={true}
          style={{overflow:'wrap'}}
          conditionalRowStyles={this.state.conditionalRowStyles}
          customStyles = {this.state.customStyles}
          expandableRows
          expandableRowsComponent={
            ({ data }) => this.getExpandableRows(data)
           
          }
          sortServer
          pagination
          />
        
      );
    }
  }
  export default HistoryTable;
  

  