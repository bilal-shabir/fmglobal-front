import React from "react";
import { Modal, Table } from "react-bootstrap";
import { Container, Row, Col, Card, FormSelect } from "shards-react";
import { URL2 } from "../../constants";
import "../../assets/style.css";
import PageTitle from "../../components/common/PageTitle";
import L from "../../components/components-overview/loader";
import Spinner from "react-bootstrap/Spinner";
import DataTable from "react-data-table-component";
import Multiselect from "multiselect-react-dropdown";
import BootstrapSwitchButton from "bootstrap-switch-button-react";
import { ToastContainer, toast } from "react-toastify";
import { Can } from "@casl/react";
import setPermissions from "../defineAbility";
import { useTranslation, initReactI18next } from "react-i18next";


function RolesDashboard () {
  const {t} = useTranslation()
 return(
  <h1>{t('sign_in')}</h1>
 )
}
export default RolesDashboard;
