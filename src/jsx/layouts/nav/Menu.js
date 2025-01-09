import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHospital } from "@fortawesome/free-regular-svg-icons";
import {
  faUser,
  faBarsStaggered,
  faHospitalAlt,
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
  EnvironmentOutlined,
  FileTextFilled,
  FileTextOutlined,
  EnvironmentFilled,
  ContactsOutlined,
  ContactsFilled,
} from "@ant-design/icons";
import { faUser as faUserReg } from "@fortawesome/free-regular-svg-icons";
import { SVGICON } from "../../constant/theme";
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
    childRoute2: "/reviewer/report/reportdetails",
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
    childRoute: "/admin/patients/details",
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
export const Analyst = [
  {
    title: "Patients",
    iconStyle: <FontAwesomeIcon icon={faHospital} />,
    activeIcon: <FontAwesomeIcon icon={faHospitalAlt} />,
    to: "/analyst/patients",
    childRoute: "/admin/patients/details",
  },
];
export const L2AuditorMenuList = () => {
  return [
    {
      title: "Dashboard",
      iconStyle: <DashboardOutlined />,
      activeIcon: <DashboardFilled />,
      to: "/supervisor/dashboard",
    },

    {
      title: "User Queue",
      iconStyle: <FontAwesomeIcon icon={faUserReg} />,
      activeIcon: <FontAwesomeIcon icon={faUser} />,
      to: "/supervisor/user",
      childRoute: "/supervisor/user/userqueue",
      childRoute2: "/supervisor/user/details",
    },
    {
      title: "Audited Queue",
      iconStyle: (
        <FontAwesomeIcon
          icon={faBarsStaggered}
          className={`${styles.outlinedColor}`}
        />
      ),
      activeIcon: <FontAwesomeIcon icon={faBarsStaggered} />,
      to: "/supervisor/auditing",
      childRoute: "/supervisor/patients/details",
    },
    {
      title: "Report",
      iconStyle: <FileOutlined />,
      activeIcon: <FileFilled />,
      to: "/supervisor/report",
      childRoute: "/supervisor/report/individualreport",
      childRoute2: "/supervisor/report/reportdetails",
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
    to: "/tenantadmin/dashboard",
    // childRoute: "/fhirTable/details",
  },
  {
    title: "Users",
    iconStyle: <UserOutlined />,
    activeIcon: <FontAwesomeIcon icon={faUser} />,
    to: "/tenantadmin/user",
  },
  {
    title: "Patients",
    iconStyle: <FontAwesomeIcon icon={faHospital} className="hospitalIcon"/>,
    activeIcon: <FontAwesomeIcon icon={faHospitalAlt} className="hospitalIcon"/>,
    to: "/tenantadmin/patients",
    childRoute: "/tenantadmin/patients/details",
  },
  // {
  //   title: "Query",
  //   iconStyle: SVGICON.dashboardIcon,
  //   to: "/tenantadmin/query",
  //   // childRoute: "/fhirTable/details",
  // },
  {
    title: "Patients Sync",
    iconStyle: SVGICON.adminUser,
    activeIcon:SVGICON.adminUser,
    to: "/tenantadmin/patientsync",
    // childRoute: "/fhirTable/details",
    childRoute: "/tenantadmin/patientsync/details",
    childRoute2: "/tenantadmin/patientsync/batchfilesview",
    childRoute3: "/tenantadmin/patientsync/pdftable",

    
  },
  {
    title: "File Processing",
    iconStyle: <FilePptOutlined />,
    activeIcon: <FilePptFilled />,
    to: "/tenantadmin/fileprocessing",
  },
  {
    title: "Patient Allocation",
    iconStyle: <ContactsOutlined />,
    activeIcon: <ContactsFilled />,
    to: "/tenantadmin/allocateduser",
  },
  {
    title: "Report",
    iconStyle: <FileTextOutlined />,
    activeIcon: <FileTextFilled />,
    to: "/tenantadmin/report",
    childRoute: "/tenantadmin/report/individualreport",
    childRoute2: "/tenantadmin/report/reportdetails",
  },
  {
    title: "Tracking",
    iconStyle: <EnvironmentOutlined />,
    activeIcon: <EnvironmentFilled />,
    to: "/tenantadmin/tracking",
    childRoute2: "/tenantadmin/tracking/details",
  },
  {
    title: "Notification",
    iconStyle: <BellOutlined />,
    activeIcon: <BellFilled />,
    to: "/tenantadmin/notification",
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
    iconStyle: <DashboardOutlined />,
    activeIcon: <DashboardFilled />,
    to: "/physician/dashboard",
  },
  {
    title: "Patients",
    iconStyle: <FontAwesomeIcon icon={faHospital} />,
    activeIcon: <FontAwesomeIcon icon={faHospitalAlt} />,
    to: "/physician/patients",
    childRoute: "/physician/comparison",
  },
];
