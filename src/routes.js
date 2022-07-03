import React from "react";
import { Redirect } from "react-router-dom";

// Layout Types
import { DefaultLayout } from "./layouts";
import { Plain } from "./layouts";

// Route Views
import results from "./views/results";
import login from "./views/login";
import logout from "./views/logout";
import Dashboard from "./views/Dashboard";
import WaterSystem from "./views/WaterSystem";
import WaterOverview from "./views/WaterOverview";
import FishFarmSystem from "./views/FishFarmSystem";
import PowerSystem from "./views/PowerSystem";
import PowerOverview from "./views/PowerOverview";
import WindSystem from "./views/WindSystem";
import Voltsys from "./views/Voltsys";
import WindOverview from "./views/WindOverview";
import VoltsysOverview from "./views/VoltsysOverview";
import CeoDashboard from "./views/CeoDashboard";
import TDSOverview from "./views/TDSOverview";
import O_M_dashboard from "./views/Alert/O_M_dashboard";
import O_M_error_dashboard from "./views/Alert/O_M_error_dashboard";
import O_M_parameter_conf from "./views/Alert/O_M_parameter_conf";
import O_M_historical_Dashboard from "./views/Alert/O_M_historical_dashboard";
import Users from "./views/Users";
import Plotly from "./views/plotly";
import EmployeeLogin from "./views/EmployeeLogin";
import PowerSystemNew from "./views/PowerSystemNew";
import PR_create from "./views/PR/create";
import QR_checkin from "./views/QR/Checkin";
import QR_Generate from "./views/QR/QR_Generate";
import QR_PDF from "./views/QR/QR_pdf";
import QR_XeroReport from "./views/QR/XeroReport";
import QR_ActiveDisactive from "./views/QR/QR_ActiveDisactive";
import AttendanceReport from "./views/QR/AttendanceReport";
import Current_QR from "./views/QR/Current_QR";
import PR_view from "./views/PR/view";
import PR_Approve from "./views/PR/processing";
import PR_PDF from "./views/PR/pdf";
import Invoice from "./views/Invoice/Invoice";
import InvoicePDF from "./views/Invoice/InvoicePDF";
import ViewInvoices from "./views/Invoice/ViewInvoices";
import All_Invoices from "./views/Invoice/all";
import Pending_Approval_Invoices from "./views/Invoice/pending_approval";
import Approved_Invoices from "./views/Invoice/approved";
import Created_Invoice from "./views/Invoice/created";
import Billed_Invoice from "./views/Invoice/billed";
import Rejected_Invoices from "./views/Invoice/rejected";
import UserProfileLite from "./views/UserProfileLite";
import UserProfile from "./views/Profile/UserProfile";
import ProductionReport from "./views/reports/production";
import TechDashboard from "./views/tech_dashboard";
import TechFullReport from "./views/tech_dashboard/full_report";
import InvertorDetails from "./views/tech_dashboard/invertor_details";
import InvertorComparison from "./views/tech_dashboard/invertor_comparison";
import NewPassword from "./views/new_password";
import configuration from "./views/configuration";
import administration from "./views/administration";
import RolesDashboard from "./views/Roles/RolesDashboard";
import ResourcesDashboard from "./views/Roles/ResourcesDashboard";
import configurate from "./views/configuration";

import ResToMod from "./views/Roles/ResToMod";

import O_M_groups_conf from "./views/Alert/O_M_groups_conf";
import Staff from "./views/Roles/Staff";
import UserAssign from "./views/Roles/UserAssign";
import ViewChangeHistory from "./views/Roles/ViewChangeHistory";
import Modules from "./views/Roles/Modules";
import live_O_M_error_dashboard from "./views/Alert/live_O_M_error_dashboard";
import Employee from "./views/Employee";
import Customer from "./views/Customer";

export default [
  {
    path: "/",
    exact: true,
    layout: DefaultLayout,
    component: () => <Redirect to="/Roles" />,
  },

  {
    path: "/login",
    layout: Plain,
    component: EmployeeLogin,
  },
  {
    path: "/EmployeeLogin",
    layout: Plain,
    component: EmployeeLogin,
  },
  {
    path: "/Employee",
    exact: "true",
    layout: DefaultLayout,
    component: Employee,
  },
  {
    path: "/Customer",
    exact: "true",
    layout: DefaultLayout,
    component: Customer,
  },
  {
    path: "/new_password",
    layout: Plain,
    component: NewPassword,
  },
  {
    path: "/logout",
    layout: Plain,
    component: logout,
  },
  {
    path: "/CeoDashboard",
    exact: "true",
    layout: DefaultLayout,
    component: CeoDashboard,
  },
  {
    path: "/O_M_Dashboard",
    exact: "true",
    layout: DefaultLayout,
    component: O_M_dashboard,
  },
  {
    path: "/O_M_Error",
    layout: DefaultLayout,
    exact: "true",
    component: O_M_error_dashboard,
  },
  {
    path: "/O_M_History",
    layout: DefaultLayout,
    exact: "true",
    component: O_M_historical_Dashboard,
  },
  {
    path: "/O_M_Parameters",
    layout: DefaultLayout,
    exact: "true",
    component: O_M_parameter_conf,
  },
  {
    path: "/O_M_Groups",
    layout: DefaultLayout,
    exact: "true",
    component: O_M_groups_conf,
  },
  {
    path: "/Dashboard",
    layout: DefaultLayout,
    component: Dashboard,
  },

  {
    path: "/WaterSystem",
    exact: "true",
    layout: DefaultLayout,
    component: WaterSystem,
  },
  {
    path: "/WaterSystem/:Id/:type",
    layout: DefaultLayout,
    exact: "true",
    component: results,
  },
  {
    path: "/WaterSystem/:Id",
    layout: DefaultLayout,
    exact: "true",
    component: WaterOverview,
  },

  {
    path: "/FishFarmSystem",
    layout: DefaultLayout,
    component: FishFarmSystem,
  },
  {
    path: "/PowerSystem",
    layout: DefaultLayout,
    exact: "true",
    component: PowerSystem,
  },
  {
    path: "/PowerSystem/:Id",
    layout: DefaultLayout,
    exact: "true",
    component: PowerOverview,
  },
  {
    path: "/PowerSystemNew",
    layout: DefaultLayout,
    exact: "true",
    component: PowerSystemNew,
  },
  {
    path: "/WindSystem",
    layout: DefaultLayout,
    exact: "true",
    component: WindSystem,
  },
  {
    path: "/Voltsys",
    layout: DefaultLayout,
    exact: "true",
    component: Voltsys,
  },
  {
    path: "/WindSystem/:SN",
    layout: DefaultLayout,
    exact: "true",
    component: WindOverview,
  },
  {
    path: "/Voltsys/:SN",
    layout: DefaultLayout,
    exact: "true",
    component: VoltsysOverview,
  },
  {
    path: "/Users",
    layout: DefaultLayout,
    exact: "true",
    component: Users,
  },
  {
    path: "/UserProfile",
    layout: DefaultLayout,
    exact: "true",
    component: UserProfile,
  },
  {
    path: "/TDSOverview/:SN",
    layout: DefaultLayout,
    component: TDSOverview,
  },
  {
    path: "/Invoice",
    layout: DefaultLayout,
    exact: "true",
    component: All_Invoices,
  },
  {
    path: "/Created_Invoice",
    layout: DefaultLayout,
    exact: "true",
    component: Created_Invoice,
  },
  {
    path: "/Pending_Invoice",
    layout: DefaultLayout,
    exact: "true",
    component: Pending_Approval_Invoices,
  },
  {
    path: "/finance_invoice_approval",
    layout: DefaultLayout,
    exact: "true",
    component: Pending_Approval_Invoices,
  },
  {
    path: "/Approved_Invoice",
    layout: DefaultLayout,
    exact: "true",
    component: Approved_Invoices,
  },
  {
    path: "/Billed_Invoice",
    layout: DefaultLayout,
    exact: "true",
    component: Billed_Invoice,
  },

  {
    path: "/Rejected_Invoice",
    layout: DefaultLayout,
    exact: "true",
    component: Rejected_Invoices,
  },
  {
    path: "/InvoicePDF/:id",
    layout: DefaultLayout,
    exact: "true",
    component: InvoicePDF,
  },
  {
    path: "/ViewInvoices",
    layout: DefaultLayout,
    exact: "true",
    component: All_Invoices,
  },

  {
    path: "/pr_create",
    layout: DefaultLayout,
    exact: "true",
    component: PR_create,
  },
  {
    path: "/PurchaseRequisition",
    layout: DefaultLayout,
    exact: "true",
    component: PR_view,
  },
  {
    path: "/PR_S",
    layout: DefaultLayout,
    exact: "true",
    component: PR_view,
  },
  {
    path: "/pr_processing",
    layout: DefaultLayout,
    exact: "true",
    component: PR_Approve,
  },
  {
    path: "/pr_pdf/:id",
    layout: DefaultLayout,
    exact: "true",
    component: PR_PDF,
  },
  {
    path: "/ProductionReport",
    layout: DefaultLayout,
    exact: "true",
    component: ProductionReport,
  },
  {
    path: "/TechnicalDashboard",
    layout: DefaultLayout,
    exact: "true",
    component: TechDashboard,
  },
  {
    path: "/TechnicalDashboard/:id",
    layout: DefaultLayout,
    exact: "true",
    component: TechFullReport,
  },
  {
    path: "/InvertorDetails/:id",
    layout: DefaultLayout,
    exact: "true",
    component: InvertorDetails,
  },
  {
    path: "/InvertorDetails/InvertorComparison/:id",
    layout: DefaultLayout,
    exact: "true",
    component: InvertorComparison,
  },
  {
    path: "/Roles",
    layout: DefaultLayout,
    exact: "true",
    component: RolesDashboard,
  },
  {
    path: "/Resources",
    layout: DefaultLayout,
    exact: "true",
    component: ResourcesDashboard,
  },
  {
    path: "/configuration",
    layout: DefaultLayout,
    component: configuration,
  },

  {
    path: "/Assign_Res_to_Mod",
    layout: DefaultLayout,
    exact: "true",
    component: ResToMod,
  },
  {
    path: "/Staff",
    layout: DefaultLayout,
    exact: "true",
    component: Staff,
  },

  {
    path: "/UserAssign",
    layout: DefaultLayout,
    exact: "true",
    component: UserAssign,
  },

  {
    path: "/Modules",
    layout: DefaultLayout,
    exact: "true",
    component: Modules,
  },

  {
    path: "/ViewChangeHistory",
    layout: DefaultLayout,
    exact: "true",
    component: ViewChangeHistory,
  },
  {
    path: "/O_M_Live_Error",
    layout: DefaultLayout,
    exact: "true",
    component: live_O_M_error_dashboard,
  },
  {
    path: "/List",
    layout: DefaultLayout,
    exact: "true",
    component: PR_view,
  },
  // {
  //   path: "/administration",
  //   layout: DefaultLayout,
  //  component: administration
  // },
  {
    path: "/QR",
    layout: DefaultLayout,
    exact: "true",
    component: QR_checkin,
  },
  {
    path: "/Checkin-Checkout",
    layout: DefaultLayout,
    exact: "true",
    component: QR_checkin,
  },
  {
    path: "/QR_Generate",
    layout: DefaultLayout,
    exact: "true",
    component: QR_Generate,
  },
  {
    path: "/QR_PDF",
    layout: DefaultLayout,
    exact: "true",
    component: QR_PDF,
  },
  {
    path: "/Staff_Timesheet",
    layout: DefaultLayout,
    exact: "true",
    component: Current_QR,
  },
  {
    path: "/Xero_Report",
    layout: DefaultLayout,
    exact: "true",
    component: QR_XeroReport,
  },
  {
    path: "/Attendance_Report",
    layout: DefaultLayout,
    exact: "true",
    component: AttendanceReport,
  },
  {
    path: "/QR_Activate_Deactivate",
    layout: DefaultLayout,
    exact: "true",
    component: QR_ActiveDisactive,
  },
  {
    path: "/get_value_project/:id/:pid",
    layout: Plain,
    component: EmployeeLogin,
  },
];
