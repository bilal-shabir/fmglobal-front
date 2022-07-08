import React from "react";
import { Redirect } from "react-router-dom";

// Layout Types
import { DefaultLayout } from "./layouts";
import { Plain } from "./layouts";

// Route Views

import Employee from "./views/Employee";
import Customer from "./views/Customer";
import EmployeeLogin from "./views/EmployeeLogin";

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
];
