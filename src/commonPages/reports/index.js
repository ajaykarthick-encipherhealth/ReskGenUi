import React from "react";
import Header from "../../jsx/layouts/nav/Header";
import Tab from "../../mainStream/components/tags";
import { connect } from "react-redux";
import { actions as tinActions } from "../../stores/tenantAdmin/tin";
import GenerateView from "./generateView";
import GeneratedReports from "./generatedReports";

const Project = ({ getProjectActiveTab, activeTabName }) => {
  const tabs = ["Report Generate View","Generated Reports"]
  const activeTab = activeTabName || tabs?.[0] || "Report Generate View";
  const handleTabs = (name) => {
    getProjectActiveTab({
      reportTab: name,
    });
  };
  return (
    <div className={`show`}>
      <Header />
      <div style={{ marginTop: "7%" }}>
        <Tab icon activeTab={activeTab} handleTabs={handleTabs} tabs={tabs} />
      </div>
      <div>
        {activeTab === "Report Generate View" && <GenerateView />}
        {activeTab === "Generated Reports" && (
          <div>
            <GeneratedReports />
          </div>
        )}
      </div>
    </div>
  );
};

const enhancer = connect(
  (state) => ({
    activeTabName: state.tenantAdmin.tin?.activeTabRoutedData?.reportTab,
  }),
  {
    getProjectActiveTab: tinActions.getProjectActiveTab,
  }
);

export default enhancer(Project);
