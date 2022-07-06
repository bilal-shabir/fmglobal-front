import React from "react";
import { Container, Row, Col } from "shards-react";
import { useTranslation } from "react-i18next";
import AddEmployee from '../../components/components-overview/customer/addCustomer.js';
import EditEmployee from '../../components/components-overview/customer/editCustomer.js';
import ManageMembership from '../../components/components-overview/customer/manageMembership.js';
import ManagePayments from '../../components/components-overview/customer/managePayments.js';
import ReactDataGrid from '@inovua/reactdatagrid-community';
import '@inovua/reactdatagrid-community/index.css';
import '@inovua/reactdatagrid-enterprise/theme/amber-light.css';
import '@inovua/reactdatagrid-community/base.css';
import SelectFilter from '@inovua/reactdatagrid-community/SelectFilter';
import Cookies from "universal-cookie";

const cookies = new Cookies();
const currentLanguageCode = cookies.get('i18next') || 'en'
const rtl = (currentLanguageCode=='ar')

const gridStyle = { minHeight: 600 }
const status = [
  {
    id: 1,
    label: "Active"
  },
  {
    id: 2,
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
    { name: 'is_deleted', operator: 'eq', type: 'select', value:2},
  ];
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
      render: ({ value })=> value === 2 ? "In-Active": "Active"
    },
    { 
      name: 'row', 
      header: ()=> (<div style={{width:'100%', textAlign:'center'}}>Actions</div>), headerProps: { style: headerStyle },width: rtl ? 270 : 300,
      render: ({ value })=> 
        <div style={{textAlign:'center', display:'flex', justifyContent:'space-between', alignItems:'center', }}>
          <EditEmployee />
          <ManageMembership />
          <ManagePayments />
        </div>
    },
  ];

  const data = [
    {
      id:"1",
      name:"bilal",
      email: "bilal@gmail.com",
      CPR: "981009662",
      nationality: "Bahrain",
      is_deleted: 1
    },
    {
      id:"2",
      name:"farhan",
      email: "farhan@gmail.com",
      CPR: "980567435",
      nationality: "Pakistan",
      is_deleted: 2
    }
  ];
function Employee () {
  
  const {t} = useTranslation()
  return (
      <Container fluid className="main-content-container px-4">
        <Row noGutters className="page-header py-4">
            <h4 style={{fontWeight:'600', color:'black'}}>{t('customer_page_heading')}</h4>
        </Row>
        <div style={{padding:'10px 10px', textAlign: rtl ? 'left' : 'right', width:'100%'}}>
          <AddEmployee />
        </div>
        <Row style={{padding:'0 20px'}}>
        <ReactDataGrid
            idProperty="id"
            style={gridStyle}
            defaultFilterValue={filterValue}
            columns={columns}
            dataSource={data}
            rtl={rtl}
            theme="amber-light"
            rowHeight={'50px'}
            pagination
            
        />
        </Row>
 
      </Container>        
  );
}
export default Employee;
