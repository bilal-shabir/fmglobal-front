import React, { Suspense, useEffect, useState } from "react";
import { Container, Row } from "shards-react";
import { useTranslation } from "react-i18next";
import ReactDataGrid from '@inovua/reactdatagrid-community';
import '@inovua/reactdatagrid-community/index.css';
import '@inovua/reactdatagrid-enterprise/theme/amber-light.css';
import '@inovua/reactdatagrid-community/base.css';
import SelectFilter from '@inovua/reactdatagrid-community/SelectFilter';
import { ToastContainer } from 'react-toastify';
import AddCustomer from '../../components/components-overview/customer/addCustomer.js';
import EditCustomer from '../../components/components-overview/customer/editCustomer.js';
// import ManageMembership from '../../components/components-overview/customer/manageMembership.js';
import ManagePayments from '../../components/components-overview/customer/managePayments.js';
import L from "../../components/components-overview/loader";
import { URL2 } from "../../constants.js";
import { useGetFetch } from "../../hooks/useGetFetch.js";
import { checkLanguage } from "../../utils.js";
import { GET } from "../../components/API calls/GET.js";
import exportCSV  from "../../components/components-overview/Data Exports/excel.js";

const rtl = checkLanguage()
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
    { name: 'name', operator: 'eq', type: 'string' },
    { name: 'email', operator: 'eq', type: 'string' },
    { name: 'mobile', operator: 'eq', type: 'string' },
    { name: 'CPR', operator: 'eq', type: 'number'},
    { name: 'nationality', operator: 'eq', type: 'string'},
    { name: 'is_deleted', operator: 'eq', type: 'select', value:null},
    { name: 'membership', operator: 'eq', type: 'select', value: null},
];



function Customer () {
  const {t} = useTranslation()
  const controller = new AbortController();
  const url= URL2+"customer";
  const [gridRef, setGridRef] = useState(null);
  let [customers, refetch] = useGetFetch(controller, url)
  const[memberships , setMemberships] = useState([])
  const[membershipFilterSource , setMembershipFilterSource] = useState([])
  useEffect(() => {
    async function fetchMemberships() {
      let response = await GET(URL2+'membership', "Error: Failed to fetch memberhsips")
      let membershipFilter = []
      if(response){
        for (let index = 0; index < response.length; index++) {
          let obj = {
            id: response[index].name,
            label: response[index].name
          }
          membershipFilter.push(obj)
        }
      // membershipFilter.push({id: null, label: "No Membership"})
      setMembershipFilterSource(membershipFilter)
      setMemberships(response)
      }
    }
    fetchMemberships()
  }, [rtl]);
  
  const columns = [
    { name: 'id', header: 'Id', defaultVisible: false, type: 'number',  },
    { name: 'name', header: 'Name', defaultFlex: 1 ,headerProps: { style: headerStyle }},
    { name: 'email', header: 'Email', defaultFlex: 1,headerProps: { style: headerStyle } },
    { name: 'CPR', header: 'CPR', defaultFlex: 1,headerProps: { style: headerStyle } },
    { name: 'nationality', header: 'Nationality', defaultFlex: 1,headerProps: { style: headerStyle } },
    { name: 'mobile', header: 'Mobile', defaultFlex: 1,headerProps: { style: headerStyle }},
    { 
      name: 'membership', 
      header: 'Membership', 
      defaultFlex: 1,
      headerProps: { style: headerStyle }, 
      filterEditor: SelectFilter,
      filterEditorProps: {
        placeholder: 'All',
        dataSource: membershipFilterSource
      },
      render: ({value}) => value ? value : null
      
    },
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
      header: rtl ? 'أجراءات' : 'Actions',
      headerProps: { style: headerStyle },
      width: rtl ? 190 : 190,
      render: ({ value })=> 
        <div style={{textAlign:'center', display:'flex', justifyContent:'space-between', alignItems:'center', }}>
          <EditCustomer data={value} refetch={refetch} />
          {/* <ManageMembership /> */}
          <ManagePayments data={value} refetch={refetch}/>
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
    <Suspense fallback={<L></L>}>
        <Container fluid className="main-content-container px-4">
          <Row noGutters className="page-header py-4">
              <h4 style={{fontWeight:'600', color:'black'}}>{t('customer_page_heading')}</h4>
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
            <AddCustomer memberships = {memberships} refetch={refetch} />
          </div>
          <Row style={{padding:'0 20px'}}>
          <ReactDataGrid
              handle={setGridRef}
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
              rtl={rtl}
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
