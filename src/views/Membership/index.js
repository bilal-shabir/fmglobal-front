import React, { Suspense } from "react";
import { Container, Row } from "shards-react";
import { useTranslation } from "react-i18next";
import '@inovua/reactdatagrid-community/index.css';
import '@inovua/reactdatagrid-enterprise/theme/amber-light.css';
import '@inovua/reactdatagrid-community/base.css';
import SelectFilter from '@inovua/reactdatagrid-community/SelectFilter';
import Cookies from "universal-cookie";
import { ToastContainer } from 'react-toastify';
import L from "../../components/components-overview/loader";
import { URL2 } from "../../constants.js";
import AddMembership from '../../components/components-overview/membership/addMembership';
import EditMembership from '../../components/components-overview/membership/editMembership';
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
    { name: 'downpayment', operator: 'eq', type: 'number' },
    { name: 'cost', operator: 'eq', type: 'number'},
    { name: 'lodgings', operator: 'eq', type: 'number'},
    { name: 'is_deleted', operator: 'eq', type: 'select', value:false},
    { name: 'contract_duration',operator: 'eq', type: 'number'},
    { name: 'supervisor_commision',operator: 'eq', type: 'number'},
    { name: 'employee_commision',operator: 'eq', type: 'number'}
  ];
const cookies = new Cookies();
const currentLanguageCode = cookies.get('i18next') || 'en'
const rtl = (currentLanguageCode==='ar')


function Membership () {
  const {t} = useTranslation()
  const controller = new AbortController();
  const url= URL2+"membership"
  const [memberships, refetch] = useGetFetch(controller, url)
  const columns = [
    { name: 'id', header: 'Id', defaultVisible: false, defaultWidth: 80, type: 'number',  },
    { name: 'name', header: rtl ? 'اسم' : 'Name', defaultFlex: 1 ,headerProps: { style: headerStyle }},
    { name: 'downpayment', header: rtl ? 'الدفع لأسفل' : 'Down Payment', defaultFlex: 1,headerProps: { style: headerStyle } },
    { name: 'cost', header: rtl ? 'قدر': 'Cost', defaultFlex: 1,headerProps: { style: headerStyle } },
    { name: 'lodgings', header: rtl ? 'غرف مفروشة' : 'Lodgings', defaultFlex: 1,headerProps: { style: headerStyle } },
    { name: 'contract_duration', header: rtl ? 'مدة العقد' : 'Contract Duration', defaultFlex: 1,headerProps: { style: headerStyle } },
    { name: 'employee_commision', header: rtl ? 'عمولة الموظف' : 'Employee Commission', defaultFlex: 1,headerProps: { style: headerStyle } },
    { name: 'supervisor_commision', header: rtl ? 'عمولة المشرف' : 'Supervisor Commission', defaultFlex: 1,headerProps: { style: headerStyle } },
    { name: 'is_deleted', header: rtl ? 'الحالة': 'Status', defaultFlex: 1, filterEditor: SelectFilter,headerProps: { style: headerStyle },
      filterEditorProps: {
        placeholder: 'All',
        dataSource: status
      },
      render: ({ value })=> value === true ? "In-Active": "Active"
    },
    { 
      name: 'data', 
      header: ()=> (<div style={{width:'100%', textAlign:'center'}}>{rtl ? 'أجراءات' : 'Actions'}</div>), headerProps: { style: headerStyle },
      width: 100,
      render: ({ value })=> 
        <div style={{textAlign:'center'}}>
          <EditMembership data={value} refetch={refetch} rtl={rtl} />
        </div>
    },
  ];
  return (
    <Suspense fallback={<L />}>
      <Container fluid className="main-content-container px-4">
        <Row noGutters className="page-header py-4">
            <h4 style={{fontWeight:'600', color:'black'}}>{t('membership_page_heading')}</h4>
        </Row>
        <div style={{padding:'10px 10px', textAlign: rtl ? 'left' : 'right', width:'100%'}}>
          <AddMembership refetch = {refetch} rtl={rtl} />
        </div>
        <Row style={{padding:'0 20px'}}>
        <ReactDataGrid
            idProperty="id"
            style={gridStyle}
            defaultFilterValue={filterValue}
            columns={columns}
            dataSource={memberships}
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
              style={!rtl ? {marginLeft:'6%'} : {marginLeft:'-6%'}}
            />
      </Container>
      </Suspense>     
  );
}
export default Membership;
