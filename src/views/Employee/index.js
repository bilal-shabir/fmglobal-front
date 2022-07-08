import React, { Suspense } from "react";
import { Container, Row } from "shards-react";
import { useTranslation } from "react-i18next";
import '@inovua/reactdatagrid-community/index.css';
import '@inovua/reactdatagrid-enterprise/theme/amber-light.css';
import '@inovua/reactdatagrid-community/base.css';
import SelectFilter from '@inovua/reactdatagrid-community/SelectFilter';
import Cookies from "universal-cookie";
import { ToastContainer } from 'react-toastify';
import './style.css';
import L from "../../components/components-overview/loader";
import { URL2 } from "../../constants.js";
import AddEmployee from '../../components/components-overview/employee/addEmployee.js';
import EditEmployee from '../../components/components-overview/employee/editEmployee.js'
import ReactDataGrid from '@inovua/reactdatagrid-community';
import { useGetFetch } from "../../hooks/useGetFetch.js";

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
    { name: 'name', operator: 'startsWith', type: 'string' },
    { name: 'email', operator: 'eq', type: 'string' },
    { name: 'CPR', operator: 'eq', type: 'number'},
    { name: 'nationality', operator: 'eq', type: 'string'},
    { name: 'is_deleted', operator: 'eq', type: 'select', value:false},
  ];
const cookies = new Cookies();
const currentLanguageCode = cookies.get('i18next') || 'en'
const rtl = (currentLanguageCode==='ar')
function Employee () {
  const {t} = useTranslation()
  const controller = new AbortController();
  const url= URL2+"employee"
  const [employees, refetch] = useGetFetch(controller, url)
  const columns = [
    { name: 'id', header: 'Id', defaultVisible: false, defaultWidth: 80, type: 'number',  },
    { name: 'name', header: 'Name', defaultFlex: 1 ,headerProps: { style: headerStyle }},
    { name: 'email', header: 'Email', defaultFlex: 1,headerProps: { style: headerStyle } },
    { name: 'CPR', header: 'CPR', defaultFlex: 1,headerProps: { style: headerStyle } },
    { name: 'nationality', header: 'Nationality', defaultFlex: 1,headerProps: { style: headerStyle } },
    { name: 'is_deleted', header: 'Status', defaultFlex: 1, filterEditor: SelectFilter,headerProps: { style: headerStyle },
      filterEditorProps: {
        placeholder: 'All',
        dataSource: status
      },
      render: ({ value })=> value === true ? "In-Active": "Active"
    },
    { 
      name: 'data', 
      header: ()=> (<div style={{width:'100%', textAlign:'center'}}>Actions</div>), headerProps: { style: headerStyle },
      defaultFlex: 1,  
      render: ({ value })=> 
        <div style={{textAlign:'center'}}>
          <EditEmployee />
        </div>
    },
  ];
  return (
    <Suspense fallback={<L />}>
      <Container fluid className="main-content-container px-4">
        <Row noGutters className="page-header py-4">
            <h4 style={{fontWeight:'600', color:'black'}}>{t('employee_page_heading')}</h4>
        </Row>
        <div style={{padding:'10px 10px', textAlign: rtl ? 'left' : 'right', width:'100%'}}>
          <AddEmployee refetch = {refetch} />
        </div>
        <Row style={{padding:'0 20px'}}>
        <ReactDataGrid
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
