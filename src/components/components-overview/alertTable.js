import React, { Component } from "react";
import DataTable from "react-data-table-component";
import L from "./loader";


class AlertTable extends Component {

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
          conditionalRowStyles={this.state.conditionalRowStyles}
          customStyles = {this.state.customStyles}
          sortServer
          pagination
          />
        
      );
    }
  }
  export default AlertTable;
  

  