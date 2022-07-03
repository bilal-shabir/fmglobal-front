import React, { useMemo } from "react";
import {Link} from "react-router-dom";
import DataTable from "react-data-table-component";
import FilterComponent from "./FilterComponent";

const Table = props => {
  const columns = [
    {
      name: "PR NO.",
      selector: "DocNo",
      sortable: true,
      grow: 2
    },
    {
      name: "Requested By",
      selector: "",
      sortable: true,
      grow: 2
    },
    {
      name: "Company",
      selector: "Company",
      sortable: true,
      hide: "sm"
    },
    {
      name: "Project",
      selector: "project",
      sortable: true
    },
    {
      name: "Delivery Date",
      selector: "DeliveryDate",
      sortable: true,
      hide: "md"
    },
    {
      name: "Status",
      selector: "status",
      sortable: true,
      hide: "md"
    },
    {
      name: "Actions",
      button: true,
      cell: row =>
        row.showButtons ? (
          <>
            <button
              onClick={() => props.click(row.name)}
              style={{ marginRight: "5px" }}
            >
              Edit
            </button>
            <button onClick={() => props.click(row.name)}>PDF</button>
            <button>
                            {/* <button type="button" class="btn btn-primary mr-1" onClick={()=>this.handleShow(invoice.id) } style={{marginTop:'3px'}}>View Details</button> */}
                            <Link to={`/pdf/`} class="btn btn-primary mr-1" style={{backgroundColor:'#21de66', borderColor:'#21de66',marginTop:'3px'}}>View PDF</Link>
                        </button>
          
          </>
        ) : null
    }
  ];

  const [filterText, setFilterText] = React.useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = React.useState(
    false
  );
  // const filteredItems = data.filter(
  //   item => item.name && item.name.includes(filterText)
  // );
  const filteredItems = props.data.filter(
    item =>
      JSON.stringify(item)
        .toLowerCase()
        .indexOf(filterText.toLowerCase()) !== -1
  );

  const subHeaderComponent = useMemo(() => {
    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterText("");
      }
    };

    return (
      <FilterComponent
        onFilter={e => setFilterText(e.target.value)}
        onClear={handleClear}
        filterText={filterText}
      />
    );
  }, [filterText, resetPaginationToggle]);

  return (
    <DataTable
      title="Records"
      columns={columns}
      data={filteredItems}
      defaultSortField="name"
      striped
      pagination
      subHeader
      subHeaderComponent={subHeaderComponent}
    />
  );
};

export default Table;
