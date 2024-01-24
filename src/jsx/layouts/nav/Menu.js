import { SVGICON } from "../../constant/theme";
import workingstatusActive from "../../../images/workingstatus/workingstatusInactive.png";

export const MenuList = [
  {
    title: "User Management",
    iconStyle: SVGICON.Usermanagement,
    to: "/admin/user",
  },
  {
    title: "Patient File",
    iconStyle: SVGICON.Apps,
    to: "/admin/patient",
  },
  {
    title: "File Management",
    iconStyle: SVGICON.File,
    to: "/admin/file-management",
  },
  {
    title: "File View",
    iconStyle: SVGICON.TaskIcon,
    to: "/admin/file-view",
  },
];

export const PhysicanMenuList = [
  {
    title: "Dashboard",
    iconStyle: SVGICON.dashboardIcon,
    to: "/physician/dashboard",
  },
  // {
  //     title:'Patient List1',
  //     iconStyle:SVGICON.patientListIcon,
  //     to: '/physician/patient',
  // },
  {
    title: "My Work Queue",
    iconStyle: SVGICON.patientListIcon,
    to: "/physician/patients",
    childRoute: "/physician/patients/details",
  },
  {
    title: "Report",
    iconStyle: SVGICON.ReportIcon,
    to: "/physician/report",
    childRoute: "/physician/report/individualreport",
  },
  {
    title: "Working Status",
    iconStyle: SVGICON.workingStatus,
    to: "/physician/workingstatus",
  },
];
export const AdminMenuList = [
  {
    title: "Users",
    iconStyle: SVGICON.dashboardIcon,
    to: "/admin/user",
  },

  {
    title: "Patients",
    iconStyle: SVGICON.patientListIcon,
    to: "/admin/patients",
  },
   {
    title: "File Processing",
    iconStyle: SVGICON.Usermanagement,
    to: "/admin/file-processing",
  },
  {
    title: "Patient Allocate",
    iconStyle: SVGICON.ReportIcon,
    to: "/admin/allocatedUser",
  },
  {
    title: "Tracking",
    iconStyle: SVGICON.ReportIcon,
    to: "/admin/tracking",
  },
  // {
  //   title: "Notification",
  //   iconStyle: SVGICON.ReportIcon,
  //   to: "/admin/notification",
  // },
  // {
  //   title: "Auditing Window",
  //   iconStyle: SVGICON.Usermanagement,
  //   to: "/coder/auditing",
  // },
]
export const L2AuditMenuList = [
  {
    title: "Dashboard",
    iconStyle: SVGICON.dashboardIcon,
    to: "/coder/dashboard",
  },

  {
    title: "My Works",
    iconStyle: SVGICON.patientListIcon,
    to: "/coder/myworks",
  },
  {
    title: "Auditing Window",
    iconStyle: SVGICON.Usermanagement,
    to: "/coder/auditing",
  },
];
export const L2AuditorMenuList = [
  {
    title: "Dashboard",
    iconStyle: SVGICON.dashboardIcon,
    to: "/l2Auditor/dashboard",
  },
  {
    title: "User Queue",
    iconStyle: SVGICON.adminUser,
    to: "/l2Auditor/user",
    childRoute: "/l2Auditor/user/userQueue",
    childRoute2: "/l2Auditor/user/details",

  },
  {
    title: "Audited Queue",
    iconStyle: SVGICON.patientListIcon,
    to: "/l2Auditor/auditing",
  },
  {
    title: "Report",
    iconStyle: SVGICON.ReportIcon,
    to: "/l2Auditor/report",
  },
];


