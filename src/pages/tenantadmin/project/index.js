import React from "react";
import Header from "../../../jsx/layouts/nav/Header";
import Tab from "../../../mainStream/components/tags";
import { connect } from "react-redux";
import Patientsync from '../patientsync'
import { actions as tinActions } from "../../../stores/tenantAdmin/tin";
import Patients from "../../../commonPages/patients";

const Project = ({ getProjectActiveTab, activeTabName }) => {
  const tabs = ["Patients", "Sync"];
  const activeTab = activeTabName || "Patients";
  const handleTabs = (name) => {
    getProjectActiveTab({
      projectActiveTab: name,
    });
  };
  return (
    <div className={`show`}>
      <Header />
      <div style={{ marginTop: "5%" }}>
        <Tab icon activeTab={activeTab} handleTabs={handleTabs} tabs={tabs} />
      </div>
      <div>
        {activeTab === "Patients" && <Patients route={`/tenantadmin/project/details`}/>}
        {activeTab === "Sync" && (
          <div>
            <Patientsync />
          </div>
        )}
      </div>
    </div>
  );
};

const enhancer = connect(
  (state) => ({
    activeTabName: state.tenantAdmin.tin?.activeTabRoutedData?.projectActiveTab,
  }),
  {
    getProjectActiveTab: tinActions.getProjectActiveTab,
  }
);

export default enhancer(Project);
