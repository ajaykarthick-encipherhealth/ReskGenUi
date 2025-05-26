import React, { useState } from "react";
import HeaderFile from "../../../jsx/layouts/nav/Header";
import Card from "../../../components/card";
import Style from "./style.module.css";
import RegularButtonWithIcon from "../../../components/buttonWithIcon";
import ConfigIcon from "../../../images/svg/settingsIcons/config";
import Fire from "../../../images/svg/settingsIcons/fihr";
import EmrFhir from "./emrFihr";
import { Layout, Menu } from "antd";
import ChatAuditConfig from "./configuration/chatAuditConfig";
import FlagConfig from "./configuration/flagConfig";
import FileProcessingConfig from "./configuration/fileProcessungConfig";
import MedicalCoding from "./coding/medicalCoding";
import Insulin from "./coding/insulin";
import DirectCodes from "./coding/directCodes";
import HealthMetricConfig from "./coding/healthMetricConfig";
import ComorbidConditions from "./coding/comorbidConditions";
import CriticalConditions from "./coding/criticalConditions";
import RafConfig from "./coding/rafConfig";
import HistoryCodes from "./coding/historyCodes";
import DownCodes from "./coding/downCodes";
import DirectConfirmCodes from "./coding/directConfirmCodes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileImport,
  faFireFlameCurved,
  faHospital,
  faSliders,
  faFile,
  faUser,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import QueryTemplateConfig from "./configuration/queryTemplateCofig";
import DiagnosticReportConfig from "./coding/diagnosticReportConfig";
import MeatConfig from "./coding/meatCofig";
import ComboConfig from "./coding/comboConfig";
import ConflictConfig from "./coding/conflictConfig";
import OldMiConfig from "./coding/oldMiConfig";
import PmhConditionConfig from "./coding/pmhConditionConfig";
import FTPSETPIntegration from "./coding/ftpSetpIntegration";
import leftArrow from "../../../images/svg/leftArrow.svg";
import Image from "next/image";
import { useRouter } from "next/router";
import Projects from "./projects";
import Clients from "./clients";
import Users from "./users";

const { Sider } = Layout;

const menuList = (activePage) => [
  {
    key: `Configuration`,
    icon: (
      <FontAwesomeIcon
        icon={faSliders}
        style={{
          color: "#04306f",
        }}
        className="fs-4 fa-rotate-90"
      />
    ),
    label: `Configuration`,
    children: [
      {
        key: "Chat_Audit_Config",
        label: "Chart Audit Config",
      },
      {
        key: "Flag_Config",
        label: "Flag Config",
      },
      {
        key: "File_Processing_Config",
        label: "File Processing Config",
      },
      {
        key: "Query_Template_Config",
        label: "Query Template Config",
      },
    ],
  },
  {
    key: `Coding_Guidelines`,
    icon: (
      <FontAwesomeIcon
        icon={faHospital}
        style={{
          color: "#04306f",
        }}
        className="fs-4"
      />
    ),
    label: `Coding Guidelines`,
    children: [
      {
        key: "Medical_Coding",
        label: "Medical Coding",
      },
      {
        key: "Insulin_Medications",
        label: "Insulin Medications",
      },
      {
        key: "Direct_Confirm_Codes",
        label: "Direct Confirm Codes",
      },
      {
        key: "Health_Metric_Config",
        label: "Health Metric Config",
      },
      {
        key: "Diagnostic_Report_Config",
        label: "Diagnostic Report Config",
      },
      {
        key: "Meat_Config",
        label: "Meat Config",
      },
      {
        key: "OldMi_Config",
        label: "OldMi Config",
      },
      {
        key: "Combo_Config",
        label: "Combo Config",
      },
      {
        key: "Conflict_Config",
        label: "Conflict Config",
      },
      {
        key: "Comorbid_Conditions",
        label: "Comorbid Conditions",
      },
      {
        key: "Critical_Conditions",
        label: "Critical Conditions",
      },
      {
        key: "History_Codes",
        label: "History Codes",
      },
      {
        key: "Down_Codes",
        label: "Down Codes",
      },
      {
        key: "PMH_Config",
        label: "PMH Condition Config",
      },
      {
        key: "RAF_CONFIG",
        label: "RAF Config",
      },
    ],
  },
  {
    key: `EMR-FHIR`,
    icon: (
      <span className="">
        <FontAwesomeIcon
          icon={faFireFlameCurved}
          className={`${activePage === "EMR-FHIR" && "text-white"} fs-3`}
          style={{
            color: activePage === "EMR-FHIR" ? "#fff" : "#04306f",
          }}
        />
      </span>
    ),
    label: `EMR-FHIR`,
  },
  {
    key: `FTP-SFTP`,
    icon: (
      <span className="">
        <FontAwesomeIcon
          icon={faFileImport}
          style={{
            color: activePage === "FTP-SFTP" ? "#fff" : "#04306f",
            fontSize: "20px",
          }}
        />
      </span>
    ),
    label: `FTP-SFTP`,
  },
  {
    key: `Projects`,
    icon: (
      <span className="">
        <FontAwesomeIcon
          icon={faFile}
          style={{
            color: activePage === "Projects" ? "#fff" : "#04306f",
            fontSize: "20px",
          }}
        />
      </span>
    ),
    label: `Projects`,
  },
  {
    key: `Clients`,
    icon: (
      <span className="">
        <FontAwesomeIcon
          icon={faUsers}
          style={{
            color: activePage === "Clients" ? "#fff" : "#04306f",
            fontSize: "20px",
          }}
        />
      </span>
    ),
    label: `Clients`,
  },
  {
    key: `Add Users`,
    icon: (
      <span className="">
        <FontAwesomeIcon
          icon={faUser}
          style={{
            color: activePage === "Add Users" ? "#fff" : "#04306f",
            fontSize: "20px",
          }}
        />
      </span>
    ),
    label: `Add Users`,
  },
];

const Settings = () => {
  const router = useRouter();
  const [activePage, setActivePage] = useState("Chat_Audit_Config");
  const handleMenuClick = (e) => {
    setActivePage(e.key);
  };
  console.log(activePage);
  return (
    <div>
      <HeaderFile />
      <div className="row patient-file-container">
        <div className={Style.container_fluid_patient}>
          <div>
            <div className="d-flex py-4">
              <div style={{ height: "90vh" }}>
                <div className="font2 m-2 cr-pointer">
                  <div
                    className={`${Style.backButtonStyle}`}
                    onClick={() => {
                      router.back();
                    }}
                  >
                    <Image src={leftArrow} alt="Left Arrow" /> <div>BACK</div>
                  </div>
                </div>

                <hr style={{ border: "0.5px solid #8C9097" }} />
                <div className={`${Style.title} m-2`}>
                  <div style={{ paddingLeft: "25px" }}>Settings</div>
                </div>
                <hr style={{ border: "0.5px solid #8C9097" }} />
                <Layout className="settingsSidebar">
                  <Sider width={250}>
                    <div className={Style.menuLists} style={{ width: "100%" }}>
                      <Menu
                        mode="inline"
                        defaultSelectedKeys={["Chat_Audit_Config"]}
                        defaultOpenKeys={["Configuration"]}
                        items={menuList(activePage)}
                        onClick={handleMenuClick}
                        className="custom-menu"
                      />
                    </div>
                  </Sider>
                </Layout>
              </div>
              <div style={{ height: "1000px" }}>
                <hr
                  style={{
                    border: "0.5px solid #8C9097",
                    width: "100%",
                    margin: "10px 0",
                    boxSizing: "border-box",
                    height: "1000px",
                  }}
                />
              </div>

              <div style={{ height: "100vh", width: "100%" }}>
                {activePage == "Chat_Audit_Config" && <ChatAuditConfig />}
                {activePage == "Flag_Config" && <FlagConfig />}
                {activePage == "File_Processing_Config" && (
                  <FileProcessingConfig />
                )}
                {activePage == "Query_Template_Config" && (
                  <QueryTemplateConfig />
                )}
                {activePage == "Diagnostic_Report_Config" && (
                  <DiagnosticReportConfig />
                )}
                {activePage == "Meat_Config" && <MeatConfig />}
                {activePage == "OldMi_Config" && <OldMiConfig />}
                {activePage == "Medical_Coding" && <MedicalCoding />}
                {activePage == "Insulin_Medications" && <Insulin />}
                {activePage == "Direct_Codes" && <DirectCodes />}
                {activePage == "PMH_Config" && <PmhConditionConfig />}
                {activePage == "FTP-SFTP" && <FTPSETPIntegration />}
                {activePage == "Health_Metric_Config" && <HealthMetricConfig />}
                {activePage == "Combo_Config" && <ComboConfig />}
                {activePage == "Conflict_Config" && <ConflictConfig />}
                {activePage == "Comorbid_Conditions" && <ComorbidConditions />}
                {activePage == "Critical_Conditions" && <CriticalConditions />}
                {activePage == "RAF_CONFIG" && <RafConfig />}
                {activePage == "History_Codes" && <HistoryCodes />}
                {activePage == "Down_Codes" && <DownCodes />}
                {activePage == "Direct_Confirm_Codes" && <DirectConfirmCodes />}
                {activePage == "EMR-FHIR" && <EmrFhir />}
                {activePage == "Projects" && (
                  <div className="content-body">
                    <div className="container-users">
                      <Projects />
                    </div>
                  </div>
                )}
                {activePage == "Clients" && (
                  <div className="content-body">
                    <div className="container-users">
                      {" "}
                      <Clients />
                    </div>
                  </div>
                )}
                {activePage == "Add Users" && <Users />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
