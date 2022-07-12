import React, { Suspense } from "react";
import { Container, Row } from "shards-react";
import { useTranslation } from "react-i18next";
import ReactDataGrid from '@inovua/reactdatagrid-community';
import '@inovua/reactdatagrid-community/index.css';
import '@inovua/reactdatagrid-enterprise/theme/amber-light.css';
import '@inovua/reactdatagrid-community/base.css';
import SelectFilter from '@inovua/reactdatagrid-community/SelectFilter';
import { ToastContainer } from 'react-toastify';
import Cookies from "universal-cookie";
import AddCustomer from '../../components/components-overview/customer/addCustomer.js';
import EditCustomer from '../../components/components-overview/customer/editCustomer.js';
import ManageMembership from '../../components/components-overview/customer/manageMembership.js';
// import ManagePayments from '../../components/components-overview/customer/managePayments.js';
import L from "../../components/components-overview/loader";
import { URL2 } from "../../constants.js";
import { useGetFetch } from "../../hooks/useGetFetch.js";

const cookies = new Cookies();
const currentLanguageCode = cookies.get('i18next') || 'en'
const rtl = (currentLanguageCode==='ar')

const gridStyle = { minHeight: 600 }
const status = [
  {
    id: false,
    label: "Active"
  },
  {
    id: true,
    label: "Inactive"
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

function Customer () {

  const controller = new AbortController();
  const url= URL2+"customer"
  const [customers, refetch] = useGetFetch(controller, url)
  const [memberships] = useGetFetch(controller, URL2+"membership")
  const {t} = useTranslation()
  const columns = [
    { name: 'id', header: 'Id', defaultVisible: false, type: 'number',  },
    { name: 'name', header: 'Name', defaultFlex: 1 ,headerProps: { style: headerStyle }},
    { name: 'email', header: 'Email', defaultFlex: 1,headerProps: { style: headerStyle } },
    { name: 'CPR', header: 'CPR', defaultFlex: 1,headerProps: { style: headerStyle } },
    { name: 'nationality', header: 'Nationality', defaultFlex: 1,headerProps: { style: headerStyle } },
    { name: 'is_deleted', header: 'Status', defaultFlex: 1, filterEditor: SelectFilter,headerProps: { style: headerStyle },
      filterEditorProps: {
        placeholder: 'All',
        dataSource: status
      },
      render: ({ value })=> value === true ? "Inactive": "Active"
    },
    { 
      name: 'data',
      defaultVisible: true,
      header: ()=> (<div style={{width:'100%', textAlign:'center'}}>Actions</div>), headerProps: { style: headerStyle },
      width: rtl ? 180 : 200,
      render: ({ value })=> 
        <div style={{textAlign:'center', display:'flex', justifyContent:'space-between', alignItems:'center', }}>
          <EditCustomer data={value} refetch={refetch} />
          <ManageMembership />
          {/* <ManagePayments /> */}
        </div>
    },
  ];
  return (
    <Suspense fallback={<L></L>}>
        <Container fluid className="main-content-container px-4">
          <Row noGutters className="page-header py-4">
              <h4 style={{fontWeight:'600', color:'black'}}>{t('customer_page_heading')}</h4>
          </Row>
          <div style={{padding:'10px 10px', textAlign: rtl ? 'left' : 'right', width:'100%'}}>
            <AddCustomer memberships = {memberships} refetch={refetch} />
          </div>
          <Row style={{padding:'0 20px'}}>
          <ReactDataGrid
              idProperty="id"
              style={gridStyle}
              defaultFilterValue={filterValue}
              columns={columns}
              dataSource={customers}
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
export default Customer;
