import React from "react";
import {
  Modal,
  Button,
  select,
  Alert,
  CardImg,
  Form,
  InputGroup,
  FormControl,
  Table
} from "react-bootstrap";
import { Tooltip, Container, Row, Col, Card, FormSelect } from "shards-react";
import { URL3, URL2, DKEY } from "../../constants";

import PageTitle from "../../components/common/PageTitle";
import L from "../../components/components-overview/loader";
import TimePicker from "react-bootstrap-time-picker";
import { timeFromInt } from "time-number";
import Spinner from "react-bootstrap/Spinner";
import DataTable from "react-data-table-component";
import Multiselect from "multiselect-react-dropdown";
import ParameterTable from "../../components/components-overview/ParameterTable";
import { ToastContainer, toast } from "react-toastify";
import { Can } from "@casl/react";
import setPermissions from "../defineAbility";
import BootstrapSwitchButton from "bootstrap-switch-button-react";
import { useTranslation } from "react-i18next";

import ReactDataGrid from '@inovua/reactdatagrid-community'
import '@inovua/reactdatagrid-community/index.css'

import NumberFilter from '@inovua/reactdatagrid-community/NumberFilter'
import SelectFilter from '@inovua/reactdatagrid-community/SelectFilter'
import DateFilter from '@inovua/reactdatagrid-community/DateFilter'
import moment from "moment";
import Cookies from "universal-cookie";

window.moment = moment

const gridStyle = { minHeight: 600 }

const filterValue = [
    { name: 'name', operator: 'startsWith', type: 'string' },
    { name: 'age', operator: 'eq', type: 'number' },
    { name: 'city', operator: 'startsWith', type: 'string'},
    {
      name: 'birthDate',
      operator: 'eq',
      type: 'date',
    //   value: '08-08-2022'
    },
  ];
  const columns = [
    { name: 'id', header: 'Id', defaultVisible: false, defaultWidth: 80, type: 'number' },
    { name: 'name', header: 'Name', defaultFlex: 1 },
    { name: 'age', header: 'Age', defaultFlex: 1, type: 'number', filterEditor: NumberFilter },
    {
      name: 'birthDate',
      header: 'Bith date',
      defualtFlex: 1,
      minWidth: 200,
      filterEditor: DateFilter,
      filterEditorProps: (props, { index }) => {
        // for range and notinrange operators, the index is 1 for the after field
        return {
          dateFormat: 'MM-DD-YYYY',
          cancelButton: false,
          highlightWeekends: false,
          placeholder: index == 1 ? 'Created date is before...': 'Created date is after...'
        }
      },
      render: ({ value, cellProps }) => {
        return moment(value).format('MM-DD-YYYY')
      }
    },
    { name: 'city', header: 'City', defaultFlex: 1 },
    { name: 'name2', header: 'Actions', defaultFlex: 1,  render: ({ value })=> <div style={{textAlign:'center'}}><button onClick={()=>{console.log(value)}}>Hello</button></div> },
  ];

  const data = [
    {
        id:"1",
        name:"bilal",
        age: "23",
        birthDate: moment("08-07-2022").format('MM-DD-YYYY'),
        city: "Muahrraq"

    },
    {
        id:"2",
        name:"farhan",
        age: "23",
        birthDate: moment("08-07-2022").format('MM-DD-YYYY'),
        city: "Muahrraq"

    }
  ];
const cookies = new Cookies();
const currentLanguageCode = cookies.get('i18next') || 'en'
const rtl = (currentLanguageCode=='ar')
function Customer () {
  
  const {t} = useTranslation()
  return (
    <>
      <Container fluid className="main-content-container px-4">
        <Row noGutters className="page-header py-4">
            {/* <Col sm={10} md={10} lg={10} > */}
            <h4 style={{fontWeight:'600', color:'black'}}>{t('customer_page_heading')}</h4>
            {/* </Col> */}
            {/* <Col style={{textAlign: 'right'}}>
            {this.state.user_type== "Employee" ? 
            (<button
              className="btn btn-primary"
              onClick={this.handleClick}
              style={{
                backgroundColor: "#004769",
                borderColor: "#004769",
                float: "right",
                fontSize: "20px",
              }}
            >
              Add
            </button>):
            (<button
              className="btn btn-primary"
              onClick={this.handleCustomerClick}
              style={{
                backgroundColor: "#004769",
                borderColor: "#004769",
                float: "right",
                fontSize: "20px",
              }}
            >
              Add
            </button>)
            }
            </Col> */}
            
        </Row>
        <Row style={{padding:'0 20px'}}>
        <ReactDataGrid
            idProperty="id"
            style={gridStyle}
            defaultFilterValue={filterValue}
            columns={columns}
            dataSource={data}
            rtl={rtl}
        />
        </Row>
 
      </Container>
    </>
              
  );
}
export default Customer;
