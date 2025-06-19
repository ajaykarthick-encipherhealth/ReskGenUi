import React from "react";
import Header from "../../jsx/layouts/nav/Header";
import Tab from "../../mainStream/components/tags";
import { connect } from "react-redux";
import { actions as tinActions } from "../../stores/tenantAdmin/tin";
import GenerateView from "./generateView";
import GeneratedReports from "./generatedReports";
import {actions as tableAction} from  '../../stores/tableView'

const Project = ({ getProjectActiveTab, activeTabName,getTableData }) => {
  const tabs = ["Report Generate View","Generated Reports"]
  const activeTab = activeTabName || tabs?.[0] || "Report Generate View";
  const handleTabs = (name) => {
    getTableData({ reloadTrue: true });
    getProjectActiveTab({
      reportTab: name,
    });
  };
  return (
    <div className={`show`}>
      {/* <Header /> */}
      <div className="text-center"  style={{paddingTop:"80px"}}>
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
       getTableData: tableAction.tableViewAction,
  }
);

export default enhancer(Project);
