import React, { Suspense, useEffect, useState } from "react";
import { Container, Row } from "shards-react";
import { useTranslation } from "react-i18next";
import "@inovua/reactdatagrid-community/index.css";
import "@inovua/reactdatagrid-enterprise/theme/amber-light.css";
import "@inovua/reactdatagrid-community/base.css";
import SelectFilter from "@inovua/reactdatagrid-community/SelectFilter";
import NumberFilter from "@inovua/reactdatagrid-community/NumberFilter";
import { ToastContainer } from "react-toastify";
import L from "../../components/components-overview/loader";
import { URL2 } from "../../constants.js";
import ReactDataGrid from "@inovua/reactdatagrid-community";
import { checkLanguage } from "../../utils";
import exportCSV from "../../components/components-overview/Data Exports/excel.js";
import { GET } from "../../components/API calls/GET";
import AddRole from "../../components/components-overview/role/addRole";

const gridStyle = { minHeight: 600 };
const status = [
  {
    id: false,
    label: "Active",
  },
  {
    id: true,
    label: "In-Active",
  },
];
const headerStyle = {
  backgroundColor: "#D79D12",
  color: "black",
};

const filterValue = [
  { name: "name", operator: "contains", type: "string" },
  { name: "downpayment", operator: "eq", type: "number" },
  { name: "cost", operator: "eq", type: "number" },
  { name: "lodgings", operator: "eq", type: "number" },
  { name: "is_deleted", operator: "eq", type: "select", value: false },
  { name: "contract_duration", operator: "eq", type: "number" },
  { name: "supervisor_commision", operator: "eq", type: "number" },
  { name: "employee_commision", operator: "eq", type: "number" },
];
const rtl = checkLanguage();

function Role() {
  const { t } = useTranslation();
  const [roles, setRoles] = useState([]);
  const [gridRef, setGridRef] = useState(null);
  const columns = [
    {
      name: "id",
      header: "Id",
      defaultVisible: false,
      defaultWidth: 80,
      type: "number",
    },
    {
      name: "name",
      header: rtl ? "اسم" : "Name",
      defaultFlex: 1,
      headerProps: { style: headerStyle },
    },  
    {
      name: "data",
      header: rtl ? "أجراءات" : "Actions",
      headerProps: { style: headerStyle },
      width: 100,
      render: ({ value }) => (
        <div style={{ textAlign: "center" }}>
          {/* <EditMembership data={value} refetch={refetch} rtl={rtl} /> */}
        </div>
      ),
    },
  ];
  useEffect(() => {
    fetchRoles()
  }, []);
  async function fetchRoles() {
    const url = URL2 + "role";
      let response = await GET(url, "Error: Failed to fetch roles", null)
      if(response){
        setRoles(response)
      }
    }

  
  const downloadCSV = () => {
    gridRef.current.visibleColumns = gridRef.current.allColumns.filter(
      (object) => {
        return (
          object.name !== "data" &&
          object.name !== "id" &&
          object.name !== "is_deleted"
        );
      }
    );
    exportCSV(gridRef);
  };
  
  return (
    <Suspense fallback={<L />}>
      <Container fluid className="main-content-container px-4">
        <Row noGutters className="page-header py-4">
          <h4 style={{ fontWeight: "600", color: "black" }}>
            {t("role_page_heading")}
          </h4>
        </Row>
        <div
          className="d-flex justify-content-end"
          style={{ padding: "10px 10px", width: "100%" }}
        >
          <div style={{ width: "10px" }}></div>
          <button
            className="btn btn-dark"
            type="button"
            style={{ color: "#D79D12" }}
            onClick={downloadCSV}
          >
            <i className="large material-icons">file_download</i> Export CSV
          </button>
          <div style={{ width: 10 }}></div>
          <AddRole refetch={fetchRoles} rtl={rtl} />
        </div>
        <Row style={{ padding: "0 20px" }}>
          <ReactDataGrid
            handle={setGridRef}
            idProperty="id"
            style={gridStyle}
            defaultFilterValue={filterValue}
            columns={columns}
            dataSource={roles}
            rtl={rtl}
            theme="amber-light"
            rowHeight={50}
            pagination
          />
        </Row>
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
          style={!rtl ? { marginLeft: "6%" } : { marginLeft: "-6%" }}
        />
      </Container>
    </Suspense>
  );
}
export default Role;
