import React, { useState } from "react";
import HeaderFile from "../../../jsx/layouts/nav/Header";
import Card from "../../../components/card";
import Style from "./style.module.css";
import RegularButtonWithIcon from "../../../components/buttonWithIcon";
import ConfigIcon from "../../../images/svg/settingsIcons/config";
import Fire from "../../../images/svg/settingsIcons/fihr";
import Configuration from "./configuration";
import EmrFhir from "./emrFihr";
import { Breadcrumb, Layout, Menu, theme } from "antd";
const { Header, Content, Footer, Sider } = Layout;

const menuList = [
  {
    key: `Configuration`,
    icon: <ConfigIcon />,
    label: `Configuration`,
    children: [
      {
        key: "Chat Audit Config",
        label: "Chat Audit Config",
      },
      {
        key: "Flag Config",
        label: "Flag Config",
      },
      {
        key: "File Processing Config",
        label: "File Processing Config",
      },
    ],
  },
  {
    key: `Coding Guidelines`,
    icon: <ConfigIcon />,
    label: `Coding Guidelines`,
    children: [
      {
        key: "Medical Coding",
        label: "Medical Coding",
      },
      {
        key: "Insulin Medications",
        label: "Insulin Medications",
      },
      {
        key: "Direct Codes",
        label: "Direct Codes",
      },
      {
        key: "Health Metric Config",
        label: "Health Metric Config",
      },
      {
        key: "Comorbid Conditions",
        label: "Comorbid Conditions",
      },
      {
        key: "Critical Conditions",
        label: "Critical Conditions",
      },
    ],
  },
  {
    key: `EMR-FHIR`,
    icon: <Fire />,
    label: `EMR-FHIR`,
  },
];
const tabMenu = [
  {
    name: "Configuration",
    isActiveIcon: <ConfigIcon active={true} />,
    icon: <ConfigIcon />,
    subMenu: [
      {
        id: 1,
        title: "Chat Audit Config",
      },
      {
        id: 2,
        title: "Flag Config",
      },
      {
        id: 3,
        title: "File Processing Config",
      },
    ],
  },
  { name: "EMR-FHIR", icon: <Fire />, isActiveIcon: <Fire active={true} /> },
];
const Settings = () => {
  const [activePage, setActivePage] = useState(tabMenu[0].name);
  return (
    <div style={{ backgroundColor: "#F0F6FE" }}>
      <HeaderFile />
      <div className={Style.headerContainer}>
        <div className={`${Style.title} mb-2`}>Settings</div>
        <Card>
          <div className="d-flex justify-between pt-2">
            <div className="w-[40%]">
              <Layout>
                <Sider width={250}>
                  <Menu
                    mode="inline"
                    defaultSelectedKeys={["Chat Audit Config"]}
                    defaultOpenKeys={["Configuration"]}
                    style={{
                      height: "100%",
                      width: "100%",
                    }}
                    items={menuList}
                    onChange={(value)=>{console.log(value)}}
                  />
                </Sider>
              </Layout>
            </div>
            <div
              className="w-[60%] border rounded-3 mx-4 border-bottom-2"
              style={{ height: "90vh" }}
            >
              {activePage == tabMenu[0].name && <Configuration />}
              {activePage == tabMenu[1].name && <EmrFhir />}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
