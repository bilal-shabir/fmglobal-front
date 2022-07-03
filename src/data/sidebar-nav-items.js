export default function () {
  return [
    {
      name: "PowerSystem",
      title: "O&M Power Dashboard",
      htmlBefore:
        '<i class="large material-icons" style="color: #DCCC62;font-size: 18px;" >power</i>',
      to: "/PowerSystem",
    },
    {
      name: "AlertDashboard",
      title: "AlertDashboard",
      htmlBefore:
        '<i class="material-icons" style="color: #DCCC62;font-size: 18px;">receipt</i>',
      to: "#",
      submenu: [
        {
          title: "LiveErrorsWarnings",
          link: "/O_M_Live_Error",
          icon: "invoiceicon",
        },
        {
          title: "ErrorsWarnings",
          link: "/O_M_Error",
          icon: "invoiceicon",
        },
        {
          title: "NormalInformation",
          link: "/O_M_Dashboard",
          icon: "invoiceicon",
        },
        {
          title: "History",
          link: "/O_M_History",
          icon: "invoiceicon",
        },
        {
          title: "EmployeesGroups",
          link: "/O_M_Groups",
          icon: "invoiceicon",
        },
      ],
    },

    {
      name: "Dashboard",
      title: "Dashboard",
      htmlBefore:
        '<i class="material-icons" style="color: #DCCC62;font-size: 18px;">table_chart</i>',
      to: "/Dashboard",
    },
    {
      name: "TechnicalDashboard",
      title: "O&M Technical Dashboard",
      htmlBefore:
        '<i class="material-icons" style="color: #DCCC62;font-size: 18px;">library_add</i>',
      to: "/TechnicalDashboard",
    },
    {
      name: "WaterSystem",
      title: "Water Testing Dashboard",
      htmlBefore:
        '<i class="material-icons" style="color: #DCCC62;font-size: 18px;">opacity</i>',
      to: "/WaterSystem",
    },
    {
      name: "FishFarmSystem",
      title: "Fish Farm Dashboard",
      htmlBefore:
        '<i class="material-icons" style="color: #DCCC62;font-size: 18px;">set_meal</i>',
      to: "/FishFarmSystem",
    },

    {
      name: "WindSystem",
      title: "Wind Dashboard",
      htmlBefore:
        '<i class="material-icons" style="color: #DCCC62;font-size: 18px;">air</i>',
      to: "/WindSystem",
    },
    {
      name: "VoltsysSystem",
      title: "Voltsys Dashboard",
      htmlBefore:
        '<i class="material-icons" style="color: #DCCC62;font-size: 18px;">bolt</i>',
      to: "/Voltsys",
    },
    {
      name: "Billing",
      title: "Billing",
      htmlBefore:
        '<i class="material-icons" style="color: #DCCC62;font-size: 18px;">receipt</i>',
      to: "#",
      submenu: [
        {
          title: "Invoices",
          submenu: [
            {
              title: "All",
              link: "/Invoice",
            },
            {
              title: "Created",
              link: "/Created_Invoice",
            },
            {
              title: "Pending Approval",
              link: "/Pending_Invoice",
            },
            {
              title: "Approved",
              link: "/Approved_Invoice",
            },
            {
              title: "Billed",
              link: "/Billed_Invoice",
            },
            {
              title: "Rejected",
              link: "/Rejected_Invoice",
            },
          ],
        },
        {
          title: "Customers",
          link: "/customers",
          icon: "icons-21.png",
        },
      ],
    },
    {
      name: "PurchaseRequisition",
      title: "PR",
      htmlBefore:
        '<i class="material-icons" style="color: #DCCC62;font-size: 18px;">receipt</i>',
      to: "#",
      submenu: [
        {
          title: "List",
          link: "/PurchaseRequisition",
          icon: "invoice.png",
        },
        {
          title: "Create",
          link: "/pr_create",
          icon: "add.png",
        },
        {
          title: "Processing",
          link: "/pr_processing",
          icon: "invoice.png",
        },
      ],
    },
    {
      name: "Reports",
      title: "O&MReports",
      htmlBefore:
        '<i class="material-icons" style="color: #DCCC62;font-size: 18px;">receipt</i>',
      to: "#",
      submenu: [
        {
          title: "Daily Production",
          link: "/ProductionReport",
          icon: "invoice.png",
        },
      ],
    },
    // {
    //   name:"QR",
    //   title: "QR Code",
    //   htmlBefore:'<i class="material-icons" style="color: #DCCC62;font-size: 18px;">receipt</i>',
    //   to: "#",
    // },
    {
      name: "QR",
      title: "QR System",
      htmlBefore:
        '<i class="material-icons" style="color: #DCCC62;font-size: 18px;">receipt</i>',
      to: "#",
      submenu: [
        {
          title: "Checkin/Check-out",
          link: "/Checkin-Checkout",
          icon: "icons-21.png",
        },
        {
          title: "My TimeSheet",
          link: "/MyTimeSheet",
          icon: "icons-21.png",
        },
        {
          title: "Manage QR",
          link: "#",
          icon: "icons-21.png",
          submenu: [
            {
              title: "Generate QR",
              link: "/QR_Generate",
              icon: "icons-21.png",
            },
            {
              title: "Activate/Deactivate QR",
              link: "/QR_Activate_Deactivate",
              icon: "icons-21.png",
            },
          ],
        },
        {
          title: "QR Reports",

          submenu: [
            {
              title: "QR Monitoring",
              link: "/Staff_Timesheet",
            },
            {
              title: "Xero Report",
              link: "/Xero_Report",
            },
            {
              title: "Attendance Report",
              link: "/Attendance_Report",
            },
          ],
        },
      ],
    },

    {
      name: "PlotlyChart",
      title: "Plotly Chart",
      htmlBefore:
        '<i class="material-icons" style="color: #DCCC62;font-size: 18px;">library_add</i>',
      to: "/Plotly",
    },

    {
      name: "Administration",
      title: "Administration",
      htmlBefore:
        '<i class="material-icons" style="color: #DCCC62;font-size: 18px;">receipt</i>',
      to: "#",
      submenu: [
        {
          title: "Roles and Responsibilities",
          submenu: [
            {
              title: "Roles",
              link: "/Roles",
            },
          ],
        },

        {
          title: "Staff Details",
          link: "/Staff",
        },
      ],
    },

    {
      name: "Configuration",
      title: "Configuration",
      htmlBefore:
        '<i class="material-icons" style="color: #DCCC62;font-size: 18px;">receipt</i>',
      to: "/configuration",
      submenu: [
        {
          title: "Resources",
          link: "/Resources",
        },
        {
          title: "Modules",
          link: "/Modules",
        },
        {
          title: "Assign Resources to Modules",
          link: "/Assign_Res_to_Mod",
        },
      ],
    },
  ];
}
