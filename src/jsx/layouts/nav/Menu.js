import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHospital } from "@fortawesome/free-regular-svg-icons";
import { faUser, faHospitalAlt } from "@fortawesome/free-solid-svg-icons";
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
  EnvironmentOutlined,
  FileTextFilled,
  FileTextOutlined,
  EnvironmentFilled,
  ContactsOutlined,
  ContactsFilled,
} from "@ant-design/icons";
import { SVGICON } from "../../constant/theme";
import {
  DashboardFilled,
  DashboardOutlined,
  FileFilled,
  FileOutlined,
} from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBarsStaggered, faUser } from "@fortawesome/free-solid-svg-icons";
import styles from "../nav/styles.module.css";

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
    iconStyle: <DashboardOutlined />,
    activeIcon: <DashboardFilled />,
    to: "/reviewer/dashboard",
  },

  {
    title: "My Work Queue",
    iconStyle: <ProfileOutlined />,
    activeIcon: <ProfileFilled />,
    to: "/reviewer/patients",
    childRoute: "/reviewer/patients/details",
  },
  {
    title: "Report",
    iconStyle: <FileOutlined />,
    activeIcon: <FileFilled />,
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
    iconStyle: <DashboardOutlined />,
    activeIcon: <DashboardFilled />,
    to: "/admin/dashboard",
  },
  {
    title: "Users",
    iconStyle: <UserOutlined />,
    activeIcon: <FontAwesomeIcon icon={faUser} />,
    to: "/admin/user",
  },

  {
    title: "Patients",
    iconStyle: <FontAwesomeIcon icon={faHospital} />,
    activeIcon: <FontAwesomeIcon icon={faHospitalAlt} />,
    to: "/admin/patients",
    childRoute: "/admin/patients/details",
  },
  {
    title: "File Processing",
    iconStyle: <FilePptOutlined />,
    activeIcon: <FilePptFilled />,
    to: "/admin/fileprocessing",
  },
  {
    title: "Patient Allocation",
    iconStyle: <ContactsOutlined />,
    activeIcon: <ContactsFilled />,
    to: "/admin/allocateduser",
  },
  {
    title: "Tracking",
    iconStyle: <EnvironmentOutlined />,
    activeIcon: <EnvironmentFilled />,
    to: "/admin/tracking",
    childRoute3: "/admin/patients/details",
  },
  {
    title: "Report",
    iconStyle: <FileTextOutlined />,
    activeIcon: <FileTextFilled />,
    to: "/admin/report",
    childRoute: "/admin/report/individualreport",
  },
  {
    title: "Notification",
    iconStyle: <BellOutlined />,
    activeIcon: <BellFilled />,
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
  },
];
export const L2AuditorMenuList = () => {
  return [
    {
      title: "Dashboard",
      iconStyle:  <DashboardOutlined />,
      activeIcon: <DashboardFilled />,
      to: "/supervisor/dashboard",
    },

    {
      title: "User Queue",
      iconStyle: <FontAwesomeIcon icon={faUser} className={`${styles.outlinedColor}`}/>,
      activeIcon: <FontAwesomeIcon icon={faUser} className={`${styles.filledColor}`}/>,
      to: "/supervisor/user",
      childRoute: "/supervisor/user/userQueue",
      childRoute2: "/supervisor/user/details",
    },
    {
      title: "Audited Queue",
      iconStyle: <FontAwesomeIcon icon={faBarsStaggered} className={`${styles.outlinedColor}`}/>,
      activeIcon: <FontAwesomeIcon icon={faBarsStaggered} className={`${styles.filledColor}`}/>,
      to: "/supervisor/auditing",
      childRoute: "/supervisor/patients/details",
    },
    {
      title: "Report",
      iconStyle: <FileOutlined />,
      activeIcon: <FileFilled />,
      to: "/supervisor/report",
      childRoute: "/supervisor/report/individualreport",
    },
  ];
};

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

export const ProviderMenuList = [
  {
    title: "Dashboard",
     iconStyle: <DashboardOutlined />,
    activeIcon: <DashboardFilled />,
    to: "/tenantAdmin/dashboard",
    // childRoute: "/fhirTable/details",
  },
  {
    title: "Users",
    iconStyle: <UserOutlined />,
    activeIcon: <FontAwesomeIcon icon={faUser} />,
    to: "/tenantAdmin/user",
  },
  {
    title: "Patients",
    iconStyle: <FontAwesomeIcon icon={faHospital} />,
    activeIcon: <FontAwesomeIcon icon={faHospitalAlt} />,
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
    childRoute: "/tenantAdmin/fhirTable/pdfTable",
  },
  {
    title: "File Processing",
    iconStyle: <FilePptOutlined />,
    activeIcon: <FilePptFilled />,
    to: "/tenantAdmin/fileprocessing",
  },
  {
    title: "Patient Allocation",
    iconStyle: <ContactsOutlined />,
    activeIcon: <ContactsFilled />,
    to: "/tenantAdmin/allocateduser",
  },
  {
    title: "Report",
    iconStyle: <FileTextOutlined />,
    activeIcon: <FileTextFilled />,
    to: "/tenantAdmin/report",
    childRoute: "/tenantAdmin/report",
  },
  {
    title: "Tracking",
    iconStyle: <EnvironmentOutlined />,
    activeIcon: <EnvironmentFilled />,
    to: "/tenantAdmin/tracking",
    childRoute3: "/tenantAdmin/patients/details",
  },
  {
    title: "Notification",
    iconStyle: <BellOutlined />,
    activeIcon: <BellFilled />,
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
