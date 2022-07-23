import React, { Suspense, useState } from "react";
import { Container, Row } from "shards-react";
import { useTranslation } from "react-i18next";
import '@inovua/reactdatagrid-community/index.css';
import '@inovua/reactdatagrid-enterprise/theme/amber-light.css';
import '@inovua/reactdatagrid-community/base.css';
import SelectFilter from '@inovua/reactdatagrid-community/SelectFilter';
import { ToastContainer } from 'react-toastify';
import './style.css';
import L from "../../components/components-overview/loader";
import { URL2 } from "../../constants.js";
import AddEmployee from '../../components/components-overview/employee/addEmployee.js';
import EditEmployee from '../../components/components-overview/employee/editEmployee.js'
import ReactDataGrid from '@inovua/reactdatagrid-community';
import { useGetFetch } from "../../hooks/useGetFetch.js";
import { checkLanguage } from "../../utils";
import exportCSV  from "../../components/components-overview/Data Exports/excel.js";

const gridStyle = { minHeight: 600 }
const status = [
  {
    id: false,
    label: "Active"
  },
  {
    id: true,
    label: "In-Active"
  },
]
const headerStyle = {
  backgroundColor: '#D79D12',
  color: 'black',
}
const filterValue = [
    { name: 'name', operator: 'contains', type: 'string' },
    { name: 'email', operator: 'contains', type: 'string' },
    { name: 'CPR', operator: 'eq', type: 'number'},
    { name: 'nationality', operator: 'contains', type: 'string'},
    { name: 'is_deleted', operator: 'eq', type: 'select', value:false},
  ];
const rtl = checkLanguage()



function Employee () {
  const {t} = useTranslation()
  const [gridRef, setGridRef] = useState(null);
  const controller = new AbortController();
  const url= URL2+"employee"
  const [employees, refetch] = useGetFetch(controller, url)
  const columns = [
    { name: 'id', header: 'Id', defaultVisible: false, defaultWidth: 80, type: 'number',  },
    { name: 'name', header: rtl ? 'اسم' : 'Name', defaultFlex: 1 ,headerProps: { style: headerStyle }},
    { name: 'email', header: rtl ? 'البريد الإلكتروني' : 'Email', defaultFlex: 1,headerProps: { style: headerStyle } },
    // { name: 'CPR', header: 'CPR', defaultFlex: 1,headerProps: { style: headerStyle } },
    // { name: 'nationality', header: rtl ? 'جنسية' : 'Nationality', defaultFlex: 1,headerProps: { style: headerStyle } },
    { name: 'mobile', header: rtl ? 'رقم الهاتف' : 'Mobile', defaultFlex: 1,headerProps: { style: headerStyle } },
    { name: 'is_deleted', header: rtl ? 'الحالة': 'Status', defaultFlex: 1, filterEditor: SelectFilter,headerProps: { style: headerStyle },
      filterEditorProps: {
        placeholder: 'All',
        dataSource: status
      },
      render: ({ value })=> value === true ? "In-Active": "Active"
    },
    { 
      name: 'data', 
      header: rtl ? 'أجراءات' : 'Actions',
      headerProps: { style: headerStyle },
      width: 100,
      render: ({ value })=> 
        <div style={{textAlign:'center'}}>
          <EditEmployee data={value} refetch={refetch} />
        </div>
    },
  ];
  const downloadCSV = () => {
    gridRef.current.visibleColumns = gridRef.current.allColumns.filter(object => {
      return object.name !== 'data' && 
      object.name !== 'id' && 
      object.name !== 'is_deleted'
    });
    exportCSV(gridRef)
  }
  return (
    <Suspense fallback={<L />}>
      <Container fluid className="main-content-container px-4">
        <Row noGutters className="page-header py-4">
            <h4 style={{fontWeight:'600', color:'black'}}>{t('employee_page_heading')}</h4>
        </Row>
        <div className= "d-flex justify-content-end" style={{padding:'10px 10px', width:'100%'}}>
            <div style={{width: '10px'}}></div>
            <button 
              className="btn btn-dark"  
              type="button" 
              style={{ color:'#D79D12'}} 
              onClick={downloadCSV}
            >
              <i className="large material-icons">file_download</i> Export CSV
            </button>
            <div style={{width: 10}}></div>
          <AddEmployee refetch = {refetch} />
        </div>
        <Row style={{padding:'0 20px'}}>
        <ReactDataGrid
            handle={setGridRef}
            idProperty="id"
            style={gridStyle}
            defaultFilterValue={filterValue}
            columns={columns}
            dataSource={employees}
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
              style={{marginLeft:'6%'}}
            />
      </Container>
    </Suspense>     
  );
}
export default Employee;
