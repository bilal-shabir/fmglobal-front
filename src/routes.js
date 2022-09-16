import React from "react";
import { Redirect } from "react-router-dom";

// Layout Types
import { DefaultLayout } from "./layouts";
import { Plain } from "./layouts";

// Route Views

import Employee from "./views/Employee";
import Customer from "./views/Customer";
import EmployeeLogin from "./views/EmployeeLogin";
import Membership from "./views/Membership";
import ReservationVoucherPDF from "./views/PDF/reservationVoucher";
import Reservation from "./views/Reservation";
import Contract from "./views/Contracts";
import Payment from "./views/Payment";
import Payment_Notes from "./views/Payment Notes";
import Logout from "./views/logout";
import Role from "./views/Roles";
import Analytics from "./views/Analytics";

export default [
  {
    path: "/",
    exact: true,
    layout: DefaultLayout,
    component: () => <Redirect to="/login" />,
  },

  {
    path: "/login",
    layout: Plain,
    component: EmployeeLogin,
  },
  {
    path: "/Employee",
    exact: true,
    layout: DefaultLayout,
    component: Employee,
  },
  {
    path: "/Customer",
    exact: true,
    layout: DefaultLayout,
    component: Customer,
  },
  {
    path: "/Membership",
    exact: true,
    layout: DefaultLayout,
    component: Membership,
  },
  {
    path: "/Reservations",
    exact: true,
    layout: DefaultLayout,
    component: Reservation,
  },
  {
    path: "/Contracts",
    exact: true,
    layout: DefaultLayout,
    component: Contract,
  },
  {
    path: "/Payments",
    exact: true,
    layout: DefaultLayout,
    component: Payment,
  },
  {
    path: "/Payment-Notes",
    exact: true,
    layout: DefaultLayout,
    component: Payment_Notes,
  },
  {
    path: "/Roles",
    exact: true,
    layout: DefaultLayout,
    component: Role,
  },
  {
    path: "/Analytics",
    exact: true,
    layout: DefaultLayout,
    component: Analytics,
  },
  {
    path: "/logout",
    exact: true,
    layout: DefaultLayout,
    component: Logout,
  },
  {
    path: "/ReservationVoucherPDF/:id",
    exact: true,
    layout: DefaultLayout,
    component: ReservationVoucherPDF,
  },
];
