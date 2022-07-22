import React, { Suspense, useEffect, useState } from "react";
import { Container, Row } from "shards-react";
import { useTranslation } from "react-i18next";
import '@inovua/reactdatagrid-community/index.css';
import '@inovua/reactdatagrid-enterprise/theme/amber-light.css';
import '@inovua/reactdatagrid-community/base.css';
import SelectFilter from '@inovua/reactdatagrid-community/SelectFilter';
import DateFilter from '@inovua/reactdatagrid-community/DateFilter'
import moment from "moment";
import { Link } from "react-router-dom";
import ReactDataGrid from '@inovua/reactdatagrid-community';
import { ToastContainer } from 'react-toastify';
import L from "../../components/components-overview/loader";
import { URL2 } from "../../constants.js";
import AddReservation from '../../components/components-overview/reservation/addReservation';
import EditReservation from '../../components/components-overview/reservation/editReservation';
import { useGetFetch } from "../../hooks/useGetFetch.js";
import { checkLanguage } from "../../utils";
import { GET } from "../../components/API calls/GET";


window.moment = moment
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
    { name: 'hotel_name', operator: 'eq', type: 'string' },
    { name: 'start_date', operator: 'eq', type: 'date'},
    { name: 'end_date', operator: 'eq', type: 'date'},
    { name: 'is_deleted', operator: 'eq', type: 'select', value:false},
    { name: 'description',operator: 'eq', type: 'string'},
    { name: 'customerId',operator: 'eq', type: 'number'},
  ];
const rtl = checkLanguage()


function Reservation () {
  const {t} = useTranslation()
  const controller = new AbortController();
  const url= URL2+"reservation"
  const [reservations, refetch] = useGetFetch(controller, url)
  const[customers , setCustomers] = useState([])
  useEffect(() => {
    async function fetchCustomers() {
      let response = await GET(URL2+'customer', "Error: Failed to fetch customers")
      if(response){
        setCustomers(response)
      }
    }
    fetchCustomers()
  }, []);
  const columns = [
    { name: 'id', header: 'Id', defaultVisible: false, defaultWidth: 80, type: 'number',  },
    { name: 'hotel_name', header: rtl ? 'الدفع لأسفل' : 'Hotel Name', defaultFlex: 1,headerProps: { style: headerStyle } },
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
    { name: 'description', header: rtl ? 'تفصيل' : 'Description', defaultFlex: 1,headerProps: { style: headerStyle } },
    // { name: 'customerId', header: rtl ? 'عميل' : 'Customer', defaultFlex: 1,headerProps: { style: headerStyle } },
    { name: 'is_deleted', header: rtl ? 'الحالة': 'Status', defaultFlex: 1, filterEditor: SelectFilter,headerProps: { style: headerStyle },
      filterEditorProps: {
        placeholder: 'All',
        dataSource: status
      },
      render: ({ value })=> value === true ? "In-Active": "Active"
    },
    { 
      name: 'data', 
      header:rtl ? 'أجراءات' : 'Actions',
      width: 160,
      headerProps: { style: headerStyle } ,
      render: ({ value })=> 
      <div style={{textAlign:'center', display:'flex', justifyContent:'space-between', alignItems:'center', }}>
        <EditReservation customers={customers} data={value} refetch={refetch} />
        <Link
            to={`/ReservationVoucherPDF/${value.id}`}
            className="btn btn-dark"  
            type="button" 
            style={{ color:'#D79D12'}}
        >
            <i className="material-icons">picture_as_pdf</i> PDF
        </Link>
      </div>
    },
  ];
  return (
    <Suspense fallback={<L />}>
      <Container fluid className="main-content-container px-4">
        <Row noGutters className="page-header py-4">
            <h4 style={{fontWeight:'600', color:'black'}}>{t('manage_reservation_heading')}</h4>
        </Row>
        <div style={{padding:'10px 10px', textAlign: rtl ? 'left' : 'right', width:'100%'}}>
          <AddReservation customers={customers} refetch = {refetch} rtl={rtl} />
        </div>
        <Row style={{padding:'0 20px'}}>
        <ReactDataGrid
            idProperty="id"
            style={gridStyle}
            defaultFilterValue={filterValue}
            columns={columns}
            dataSource={reservations}
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
export default Reservation;
