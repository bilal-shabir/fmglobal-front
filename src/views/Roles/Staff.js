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

let controller;

function Staff () {
  
  const {t} = useTranslation()
  return (
    <>
      <Container fluid className="main-content-container px-4">
        <Row noGutters className="page-header py-4">
            {/* <Col sm={10} md={10} lg={10} > */}
            <h4 style={{fontWeight:'600'}}>{t('employee_page_heading')}</h4>
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
      </Container>
    </>
              
  );
}
export default Staff;
