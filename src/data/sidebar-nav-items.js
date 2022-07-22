export default function() {
  return [
    {
      title: "Customers",
      title_ar: "عملاء",
      htmlBefore: '<i class="material-icons" >contacts</i>',
      to: "/Customer",
    },
    {
      title: "Reservations",
      title_ar: "التحفظات",
      htmlBefore: '<i class="material-icons" >event</i>',
      to: "/Reservations",
    },
    {
      title: "Memberships",
      title_ar: "العضويات",
      htmlBefore: '<i class="material-icons" >card_membership</i>',
      to: "/Membership",
    },
    {
      title: "Payments",
      title_ar: "المدفوعات",
      htmlBefore: '<i class="material-icons" >payment</i>',
      to: "/Payments",
    },
    {
      title: "Contracts",
      title_ar: "انكماش",
      htmlBefore: '<i class="material-icons" >receipt</i>',
      to: "/Contracts",
    },
    {
      title: "Payment Notes",
      title_ar: "ملاحظات الدفع",
      htmlBefore: '<i class="material-icons" >note</i>',
      to: "/Payment Notes",
    },
    {
      title: "Employees",
      title_ar: "موظف",
      to: "/Employee",
      htmlBefore: '<i class="material-icons" >assignment_ind</i>',
      htmlAfter: ""
    }
  ];
}
