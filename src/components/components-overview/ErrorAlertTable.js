import React, { Component } from "react";
import DataTable from "react-data-table-component";
import L from "./loader";


class ErrorAlertTable extends Component {

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
    render() {
       
      return (
        
        <DataTable
          columns={this.state.columns}
          data={this.state.data}
          highlightOnHover={true}
          style={{overflow:'wrap'}}
          rowsPerPage={20}
          conditionalRowStyles={this.state.conditionalRowStyles}
          customStyles = {this.state.customStyles}
          expandableRows
          expandableRowsComponent={
            ({ data }) => 
            <div className="p-3">
              <h6>Message Source:</h6>
              <span>
                {data.message_source.name}
              </span>

              <h6>Comments:</h6>
              <span>
                {data.comments}
              </span>
            </div>
          }
          sortServer
          pagination
          filterable
          />
        
      );
    }
  }
  export default ErrorAlertTable;
  

  