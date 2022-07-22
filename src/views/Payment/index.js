import React, { Suspense, useEffect, useState } from "react";
import { Container, Row } from "shards-react";
import { useTranslation } from "react-i18next";
import '@inovua/reactdatagrid-community/index.css';
import '@inovua/reactdatagrid-enterprise/theme/amber-light.css';
import '@inovua/reactdatagrid-community/base.css';
import SelectFilter from '@inovua/reactdatagrid-community/SelectFilter';
import { ToastContainer } from 'react-toastify';
import DateFilter from '@inovua/reactdatagrid-community/DateFilter'
import moment from "moment";
import L from "../../components/components-overview/loader";
import { URL2 } from "../../constants.js";
import AddPayment from '../../components/components-overview/payment/addPayment';
import EditPayment from '../../components/components-overview/payment/editPayment';
import ReactDataGrid from '@inovua/reactdatagrid-community';
import { useGetFetch } from "../../hooks/useGetFetch.js";
import { checkLanguage } from "../../utils";
import { GET } from "../../components/API calls/GET";

const gridStyle = { minHeight: 600 }
const status = [
  {
    id: false,
    label: "Paid"
  },
  {
    id: true,
    label: "unpaid"
  },
]
const headerStyle = {
  backgroundColor: '#D79D12',
  color: 'black',
}

const filterValue = [
    { name: 'payment_date', operator: 'eq', type: 'date'},
    { name: 'paid', operator: 'eq', type: 'select', value:null},
    { name: 'amount',operator: 'eq', type: 'number'},
    { name: 'type',operator: 'eq', type: 'string'}
  ];
const rtl = checkLanguage()


function Payment () {
  const {t} = useTranslation()
  const controller = new AbortController();
  const url= URL2+"payment"
  const [memberships, refetch] = useGetFetch(controller, url)
  const[customers , setCustomers] = useState([])
  const columns = [
    { name: 'id', header: 'Id', defaultVisible: false, defaultWidth: 80, type: 'number' },
    {
        name: 'payment_date',
        header: rtl ? ' موعد الدفع' : 'Payment Date',
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
    { name: 'paid', header: rtl ? 'الحالة': 'Payment Status', defaultFlex: 1, filterEditor: SelectFilter,headerProps: { style: headerStyle },
      filterEditorProps: {
        placeholder: 'All',
        dataSource: status
      },
      render: ({ value })=> value ? "Paid": "unpaid"
    },
    { name: 'amount', header: rtl ? 'مقدار' : 'Amount', defaultFlex: 1,headerProps: { style: headerStyle } },
    { name: 'type', header: rtl ? 'نوع' : 'Type', defaultFlex: 1,headerProps: { style: headerStyle } },
    { 
      name: 'data', 
      header: rtl ? 'أجراءات' : 'Actions',
      headerProps: { style: headerStyle },
      width: 100,
      render: ({ value })=> 
        <div style={{textAlign:'center'}}>
          <EditPayment data={value} refetch={refetch} rtl={rtl} />
        </div>
    },
  ];
  useEffect(() => {
    async function fetchCustomers() {
      let response = await GET(URL2+'customer', "Error: Failed to fetch customers")
      if(response){
        setCustomers(response)
      }
    }
    fetchCustomers()
  }, []);
  return (
    <Suspense fallback={<L />}>
      <Container fluid className="main-content-container px-4">
        <Row noGutters className="page-header py-4">
            <h4 style={{fontWeight:'600', color:'black'}}>{t('membership_page_heading')}</h4>
        </Row>
        <div style={{padding:'10px 10px', textAlign: rtl ? 'left' : 'right', width:'100%'}}>
          <AddPayment customers={customers} refetch = {refetch} rtl={rtl} />
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
export default Payment;
