import React, { Suspense, useState } from "react";
import { Container, Row } from "shards-react";
import { useTranslation } from "react-i18next";
import '@inovua/reactdatagrid-community/index.css';
import '@inovua/reactdatagrid-enterprise/theme/amber-light.css';
import '@inovua/reactdatagrid-community/base.css';
import SelectFilter from '@inovua/reactdatagrid-community/SelectFilter';
import NumberFilter from '@inovua/reactdatagrid-community/NumberFilter';
import { ToastContainer } from 'react-toastify';
import L from "../../components/components-overview/loader";
import { URL2 } from "../../constants.js";
import AddMembership from '../../components/components-overview/membership/addMembership';
import EditMembership from '../../components/components-overview/membership/editMembership';
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
    { name: 'downpayment', operator: 'eq', type: 'number' },
    { name: 'cost', operator: 'eq', type: 'number'},
    { name: 'lodgings', operator: 'eq', type: 'number'},
    { name: 'is_deleted', operator: 'eq', type: 'select', value:false},
    { name: 'contract_duration',operator: 'eq', type: 'number'},
    { name: 'supervisor_commision',operator: 'eq', type: 'number'},
    { name: 'employee_commision',operator: 'eq', type: 'number'}
  ];
const rtl = checkLanguage()


function Membership () {
  const {t} = useTranslation()
  const controller = new AbortController();
  const url= URL2+"membership"
  const [memberships, refetch] = useGetFetch(controller, url)
  const [gridRef, setGridRef] = useState(null);
  const columns = [
    { name: 'id', header: 'Id', defaultVisible: false, defaultWidth: 80, type: 'number',  },
    { name: 'name', header: rtl ? 'اسم' : 'Name', defaultFlex: 1 ,headerProps: { style: headerStyle }},
    { name: 'downpayment', header: rtl ? 'الدفع لأسفل' : 'Down Payment', defaultFlex: 1,headerProps: { style: headerStyle }, type: "number", filterEditor: NumberFilter },
    { name: 'cost', header: rtl ? 'قدر': 'Cost', defaultFlex: 1,headerProps: { style: headerStyle }, type: "number", filterEditor: NumberFilter },
    { name: 'lodgings', header: rtl ? 'غرف مفروشة' : 'Lodgings', defaultFlex: 1,headerProps: { style: headerStyle }, type: "number", filterEditor: NumberFilter },
    { name: 'contract_duration', header: rtl ? 'مدة العقد' : 'Contract Duration', defaultFlex: 1,headerProps: { style: headerStyle }, type: "number", filterEditor: NumberFilter },
    { name: 'employee_commision', header: rtl ? 'عمولة الموظف' : 'Employee Commission', defaultFlex: 1,headerProps: { style: headerStyle }, type: "number", filterEditor: NumberFilter },
    { name: 'supervisor_commision', header: rtl ? 'عمولة المشرف' : 'Supervisor Commission', defaultFlex: 1,headerProps: { style: headerStyle }, type: "number", filterEditor: NumberFilter },
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
          <EditMembership data={value} refetch={refetch} rtl={rtl} />
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
            <h4 style={{fontWeight:'600', color:'black'}}>{t('membership_page_heading')}</h4>
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
          <AddMembership refetch = {refetch} rtl={rtl} />
        </div>
        <Row style={{padding:'0 20px'}}>
        <ReactDataGrid
            handle={setGridRef}
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
