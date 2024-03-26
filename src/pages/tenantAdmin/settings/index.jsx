import React, { useState } from "react";
import Header from "../../../jsx/layouts/nav/Header";
import Card from "../../../components/card";
import Style from "./style.module.css";
import RegularButtonWithIcon from "../../../components/buttonWithIcon";
import ConfigIcon from "../../../images/svg/settingsIcons/config";
import Fire from "../../../images/svg/settingsIcons/fihr";
import Configuration from "./configuration";
import EmrFhir from "./emrFihr";

const tabMenu = [
  {
    name: "Configuration",
    isActiveIcon: <ConfigIcon active={true} />,
    icon: <ConfigIcon />,
  },
  { name: "EMR-FHIR", icon: <Fire />, isActiveIcon: <Fire active={true} /> },
];
const Settings = () => {
  const [activePage, setActivePage] = useState(tabMenu[0].name);
  return (
    <div style={{ backgroundColor: "#F0F6FE" }}>
      <Header />
      <div className={Style.headerContainer}>
        <div className={`${Style.title} mb-2`}>Settings</div>
        <Card>
          <div className="row p-4">
            <div className="col-lg-2">
              {tabMenu.map((item) =>
                item.name == activePage ? (
                  <div className="mb-2">
                    <RegularButtonWithIcon
                      name={item.name}
                      onClick={() => setActivePage(item.name)}
                      width={250}
                      icon={item.isActiveIcon}
                    />
                  </div>
                ) : (
                  <div className="mb-2">
                    <RegularButtonWithIcon
                      type={"outline"}
                      name={item.name}
                      onClick={() => setActivePage(item.name)}
                      width={250}
                      icon={item.icon}
                    />
                  </div>
                )
              )}
            </div>
            <div
              className="col-lg-9 border rounded-3 mx-4 border-bottom-2"
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
