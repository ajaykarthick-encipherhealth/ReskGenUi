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
const { Sider } = Layout;

const menuList = [
  {
    key: `Configuration`,
    icon: <ConfigIcon />,
    label: `Configuration`,
    children: [
      {
        key: "File_Processing_Config",
        label: "File Processing Config",
      },
      {
        key: "Chat_Audit_Config",
        label: "Chart Audit Config",
      },
      {
        key: "Flag_Config",
        label: "Flag Config",
      },
    ],
  },
  {
    key: `Coding_Guidelines`,
    icon: <ConfigIcon />,
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
        key: "RAF_CONFIG",
        label: "RAF Config",
      },
    ],
  },
  {
    key: `EMR-FHIR`,
    icon: <Fire />,
    label: `EMR-FHIR`,
  },
];

const Settings = () => {
  const [activePage, setActivePage] = useState("File_Processing_Config");
  const handleMenuClick = (e) => {
    setActivePage(e.key);
  };
  return (
    <div>
      <HeaderFile />
      <div className={Style.headerContainer}>
        <div className={`${Style.title} mb-2`}>Settings</div>
        <div style={{minHeight: "78vh"}}>
        <Card>
          <div className="d-flex py-4">
            <div>
              <Layout>
                <Sider width={250} >
                  <div className={Style.menuLists}>
                  <Menu
                    mode="inline"
                    defaultSelectedKeys={["File_Processing_Config"]}
                    defaultOpenKeys={["Configuration"]}
                    items={menuList}
                    onClick={handleMenuClick}
                  /></div>
                </Sider>
              </Layout>
            </div>
            <div
              className="border rounded-3 mx-4 border-bottom-2"
              style={{minHeight: "74vh", width: "100%" }}
            >
              {activePage == "Chat_Audit_Config" && <ChatAuditConfig />}
              {activePage == "Flag_Config" && <FlagConfig />}
              {activePage == "File_Processing_Config" && (
                <FileProcessingConfig />
              )}

              {activePage == "Medical_Coding" && <MedicalCoding />}
              {activePage == "Insulin_Medications" && <Insulin />}
              {activePage == "Direct_Codes" && <DirectCodes />}
              {activePage == "Health_Metric_Config" && <HealthMetricConfig />}
              {activePage == "Comorbid_Conditions" && <ComorbidConditions />}
              {activePage == "Critical_Conditions" && <CriticalConditions />}
              {activePage == "RAF_CONFIG" && <RafConfig />}
              {activePage == "History_Codes" && <HistoryCodes />}
              {activePage == "Down_Codes" && <DownCodes />}
              {activePage == "Direct_Confirm_Codes" && <DirectConfirmCodes />}
              {activePage == "EMR-FHIR" && <EmrFhir />}
            </div>
          </div>
        </Card></div>
      </div>
    </div>
  );
};

export default Settings;
