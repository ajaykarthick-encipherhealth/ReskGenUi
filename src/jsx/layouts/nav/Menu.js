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
    to: "/reviewer/dashboard",
  },
  // {
  //     title:'Patient List1',
  //     iconStyle:SVGICON.patientListIcon,
  //     to: '/reviewer/patient',
  // },
  {
    title: "My Work Queue",
    iconStyle: SVGICON.patientListIcon,
    to: "/reviewer/patients",
    childRoute: "/reviewer/patients/details",
  },
  {
    title: "Report",
    iconStyle: SVGICON.ReportIcon,
    to: "/reviewer/report",
    childRoute: "/reviewer/report/individualreport",
  },
  // {
  //   title: "Working Status",
  //   iconStyle: SVGICON.workingStatus,
  //   to: "/reviewer/workingstatus",
  // },
];
export const AdminMenuList = [
  {
    title: "Dashboard",
    iconStyle: SVGICON.dashboardIcon,
    to: "/admin/dashboard",
  },
  {
    title: "Users",
    iconStyle: SVGICON.adminUser,
    to: "/admin/user",
  },

  {
    title: "Patients",
    iconStyle: SVGICON.patientListIcon,
    to: "/admin/patients",
    childRoute: "/reviewer/patients/details",
  },
  {
    title: "File Processing",
    iconStyle: SVGICON.Usermanagement,
    to: "/admin/file-processing",
  },
  {
    title: "Patient Allocate",
    iconStyle: SVGICON.Allocation,
    to: "/admin/allocatedUser",
  },
  {
    title: "Tracking",
    iconStyle: SVGICON.Tracking,
    to: "/admin/tracking",
  },
  {
    title: "Report",
    iconStyle: SVGICON.ReportIcon,
    to: "/admin/report",
    childRoute: "/admin/report/individualreport",
  },
  {
    title: "Notification",
    iconStyle: SVGICON.Notification,
    to: "/admin/notification",
  },
  // {
  //   title: "Auditing Window",
  //   iconStyle: SVGICON.Usermanagement,
  //   to: "/coder/auditing",
  // },
];
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
    to: "/supervisor/dashboard",
  },
  {
    title: "User Queue",
    iconStyle: SVGICON.adminUser,
    to: "/supervisor/user",
    childRoute: "/supervisor/user/userQueue",
    childRoute2: "/supervisor/user/details",
  },
  {
    title: "Audited Queue",
    iconStyle: SVGICON.patientListIcon,
    to: "/supervisor/auditing",
  },
  // {
  //   title: "Org",
  //   iconStyle: SVGICON.ReportIcon,
  //   to: "/supervisor/org",
  // },
  {
    title: "Report",
    iconStyle: SVGICON.ReportIcon,
    to: "/supervisor/report",
    childRoute: "/supervisor/report/individualreport",
  },
];

export const ProviderMenuList = [
  // {
  //   title: "Dashboard",
  //   iconStyle: SVGICON.dashboardIcon,
  //   to: "/provider/dashboard",
  // },
  {
    title: "Comparison",
    iconStyle: SVGICON.adminUser,
    to: "/provider/comparison",
  },
  {
    title: "Query",
    iconStyle: SVGICON.patientListIcon,
    to: "/provider/query",
  },
];

export const EHRMenuList = [
  {
    title: "Patients",
    iconStyle: SVGICON.adminUser,
    to: "/ehr/patients",
    childRoute: "/ehr/patients/details",
  },
];
