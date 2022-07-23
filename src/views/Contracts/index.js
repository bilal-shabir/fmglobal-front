import React, { Suspense, useState } from "react";
import { Container, Row } from "shards-react";
import { useTranslation } from "react-i18next";
import '@inovua/reactdatagrid-community/index.css';
import '@inovua/reactdatagrid-enterprise/theme/amber-light.css';
import '@inovua/reactdatagrid-community/base.css';
import moment from "moment";
// import SelectFilter from '@inovua/reactdatagrid-community/SelectFilter';
import { ToastContainer } from 'react-toastify';
// import AddMembership from '../../components/components-overview/membership/addMembership';
import NumberFilter from '@inovua/reactdatagrid-community/NumberFilter';
import DateFilter from '@inovua/reactdatagrid-community/DateFilter'
import ReactDataGrid from '@inovua/reactdatagrid-community';
import { useGetFetch } from "../../hooks/useGetFetch.js";
import { checkLanguage } from "../../utils";
import L from "../../components/components-overview/loader";
import { URL2 } from "../../constants.js";
import exportCSV  from "../../components/components-overview/Data Exports/excel.js";


window.moment = moment
const gridStyle = { minHeight: 600 }
// const status = [
//   {
//     id: false,
//     label: "Active"
//   },
//   {
//     id: true,
//     label: "In-Active"
//   },
// ]
const headerStyle = {
  backgroundColor: '#D79D12',
  color: 'black',
}

const filterValue = [
    { name: 'is_deleted', operator: 'eq', type: 'select', value:false},
    { name: 'status', operator: 'contains', type: 'string', value:''},
    { name: 'downpayment_paid', operator: 'eq', type: 'number'},
    {
        name: 'start_date',
        operator: 'eq',
        type: 'date',
        value: ''
    },
    {
        name: 'end_date',
        operator: 'eq',
        type: 'date',
        value: ''
    },
  ];
const rtl = checkLanguage()


function Contract () {
  const {t} = useTranslation()
  const controller = new AbortController();
  const url= URL2+"contract"
  const [contracts] = useGetFetch(controller, url)
  const [gridRef, setGridRef] = useState(null);
  const columns = [
    { name: 'id', header: 'Contract ID', defaultVisible: false, defaultWidth: 80, type: 'number',  },
    {
        name: 'start_date',
        header: rtl ? 'تاريخ البدء' : 'Start date',
        defualtFlex: 1,
        filterEditor: DateFilter,
        // enableColumnFilterContextMenu: false,
        width: 200,
        headerProps: { style: headerStyle },
        filterEditorProps: (props, { index }) => {
          // for range and notinrange operators, the index is 1 for the after field
          return {
            dateFormat: 'MM-DD-YYYY',
            cancelButton: false,
            highlightWeekends: false,
            placeholder: index === 1 ? 'To': 'From'
          }
        },
        render: ({ value, cellProps }) => {
          return moment(value).format('MM-DD-YYYY')
        }
    },
    {
        name: 'end_date',
        header: rtl ? 'تاريخ الانتهاء' : 'End date',
        defualtFlex: 1,
        filterEditor: DateFilter,
        // enableColumnFilterContextMenu: false,
        width: 200,
        headerProps: { style: headerStyle },
        filterEditorProps: (props, { index }) => {
          // for range and notinrange operators, the index is 1 for the after field
          return {
            dateFormat: 'MM-DD-YYYY',
            cancelButton: false,
            highlightWeekends: false,
            placeholder: index === 1 ? 'To': 'From'
          }
        },
        render: ({ value, cellProps }) => {
          return value ? moment(value).format('MM-DD-YYYY') : "N/A"
        }
    },
    // { name: 'is_deleted', header: rtl ? 'الحالة': 'Status', defaultFlex: 1, filterEditor: SelectFilter,headerProps: { style: headerStyle },
    //   filterEditorProps: {
    //     placeholder: 'All',
    //     dataSource: status
    //   },
    //   render: ({ value })=> value === true ? "In-Active": "Active"
    // },
    { name: 'status', header: rtl ? 'الحالة': 'Status', defaultFlex: 1, headerProps: { style: headerStyle }},
    { name: 'downpayment_paid', header: rtl ? 'دفعة مقدمة مدفوعة': 'Down Payment Paid', defaultFlex: 1, headerProps: { style: headerStyle }, type: "number", filterEditor: NumberFilter},
  ];
  const downloadCSV = () => {
    gridRef.current.visibleColumns = gridRef.current.allColumns.filter(object => {
      return object.name !== 'data'
    });
    exportCSV(gridRef)
  }
  return (
    <Suspense fallback={<L />}>
      <Container fluid className="main-content-container px-4">
        <Row noGutters className="page-header py-4">
            <h4 style={{fontWeight:'600', color:'black'}}>{t('contracts_page_heading')}</h4>
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
            {/* <div style={{width: 10}}></div> */}
          {/* <AddMembership refetch = {refetch} rtl={rtl} /> */}
        </div>
        <Row style={{padding:'0 20px'}}>
        <ReactDataGrid
            handle={setGridRef}
            idProperty="id"
            style={gridStyle}
            defaultFilterValue={filterValue}
            columns={columns}
            dataSource={contracts}
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
export default Contract;
