
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHospital } from "@fortawesome/free-regular-svg-icons";
import {
  faUsersLine,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import {
  DashboardOutlined,
  BellOutlined,
  FilePptOutlined,
  DashboardFilled,
  FilePptFilled,
  BellFilled,
  ProfileFilled,
  ProfileOutlined,
  FileOutlined,
  FileFilled,
  UserOutlined,
  FileDoneOutlined,
  FileTextFilled,
  FileTextOutlined,
} from "@ant-design/icons";
import { SVGICON } from "../../constant/theme";

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
    iconStyle:  <DashboardOutlined />,
    activeIcon:  <DashboardFilled />,
    to: "/reviewer/dashboard",
  },

  {
    title: "My Work Queue",
    iconStyle: <ProfileOutlined />,
    activeIcon:   <ProfileFilled />,
    to: "/reviewer/patients",
    childRoute: "/reviewer/patients/details",
  },
  {
    title: "Report",
    iconStyle: <FileOutlined />,
    activeIcon:   <FileFilled />,
    to: "/reviewer/report",
    childRoute: "/reviewer/report/individualreport",
  },
  // {
  //   title: "Report",
  //   iconStyle: SVGICON.ReportIcon,
  //   to: "/reviewer/reports",
  //   childRoute: "/reviewer/report/individualreport",
  // },
  // {
  //   title: "FeedBack",
  //   iconStyle: SVGICON.ReportIcon,
  //   to: "/reviewer/feedback",
  // },
];
export const AdminMenuList = [
  {
    title: "Dashboard",
    iconStyle:  <DashboardOutlined />,
    activeIcon:  <DashboardFilled />,
    to: "/admin/dashboard",
  },
  {
    title: "Users",
    iconStyle:  <UserOutlined />,
    activeIcon:   <FontAwesomeIcon icon={faUser} />,
    to: "/admin/user",
  },

  {
    title: "Patients",
    iconStyle:    <FontAwesomeIcon icon={faHospital} />,
    activeIcon:  <DashboardFilled />,
    to: "/admin/patients",
    childRoute: "/admin/patients/details",
  },
  {
    title: "File Processing",
    iconStyle:   <FilePptOutlined />,
    activeIcon:   <FilePptFilled />,
    to: "/admin/fileprocessing",
  },
  {
    title: "Patient Allocation",
    iconStyle:<FontAwesomeIcon icon={faUsersLine} />,
    activeIcon:    <FileFilled />,
    to: "/admin/allocateduser",
  },
  {
    title: "Tracking",
    iconStyle: <FileDoneOutlined />,
    activeIcon:  <DashboardFilled />,
    to: "/admin/tracking",
    childRoute3: "/admin/patients/details",
  },
  {
    title: "Report",
    iconStyle:   <FileTextOutlined />,
    activeIcon:   <FileTextFilled />,
    to: "/admin/report",
    childRoute: "/admin/report/individualreport",
  },
  {
    title: "Notification",
    iconStyle: <BellOutlined />,
    activeIcon:   <BellFilled />,
    to: "/admin/notification",
  },
  // {
  //   title: "FeedBack",
  //   iconStyle: SVGICON.ReportIcon,
  //   to: "/admin/feedback",
  // },
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

export const PhysicanMenu = [
  {
    title: "Dashboard",
    iconStyle: SVGICON.dashboardIcon,
    to: "/physicians/dashboard",
  }
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
    childRoute: "/supervisor/patients/details",
  },
  // {
  //   title: "FeedBack",
  //   iconStyle: SVGICON.ReportIcon,
  //   to: "/supervisor/feedback",
  // },
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
  {
    title: "Dashboard",
    iconStyle: SVGICON.dashboardIcon,
    to: "/tenantAdmin/dashboard",
    // childRoute: "/fhirTable/details",
  },
  {
    title: "Users",
    iconStyle: SVGICON.adminUser,
    to: "/tenantAdmin/user",
  },
  {
    title: "Patients",
    iconStyle: SVGICON.patientListIcon,
    to: "/tenantAdmin/patients",
    childRoute: "/tenantAdmin/patients/details",
  },
  // {
  //   title: "Query",
  //   iconStyle: SVGICON.dashboardIcon,
  //   to: "/tenantAdmin/query",
  //   // childRoute: "/fhirTable/details",
  // },
  {
    title: "Patients Sync",
    iconStyle: SVGICON.adminUser,
    to: "/tenantAdmin/fhirTable",
    // childRoute: "/fhirTable/details",
    childRoute:'/tenantAdmin/fhirTable/pdfTable'
  },
  {
    title: "File Processing",
    iconStyle: SVGICON.Usermanagement,
    to: "/tenantAdmin/fileprocessing",
  },
  {
    title: "Patient Allocation",
    iconStyle: SVGICON.Allocation,
    to: "/tenantAdmin/allocateduser",
  },
  {
    title: "Report",
    iconStyle: SVGICON.ReportIcon,
    to: "/tenantAdmin/report",
    childRoute: "/tenantAdmin/report",
  },
  {
    title: "Tracking",
    iconStyle: SVGICON.Tracking,
    to: "/tenantAdmin/tracking",
    childRoute3: "/tenantAdmin/patients/details",
  },
  {
    title: "Notification",
    iconStyle: SVGICON.Notification,
    to: "/admin/notification",
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
export const PhysicianMenuList = [
  {
    title: "Dashbaord",
    iconStyle: SVGICON.dashboardIcon,
    to: "/physician/dashboard",
  },
  {
    title: "Patients",
    iconStyle: SVGICON.physicianPatient,
    to: "/physician/patients",
    childRoute: "/physician/comparison",
  },
];