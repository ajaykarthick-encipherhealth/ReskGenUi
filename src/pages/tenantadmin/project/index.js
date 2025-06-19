import React from "react";
import Tab from "../../../mainStream/components/tags";
import { connect } from "react-redux";
import Patientsync from '../patientsync'
import { actions as tinActions } from "../../../stores/tenantAdmin/tin";
import Patients from "../../../commonPages/patients";
import { getAccessTabItems } from "../../../utils/reusable";
import {actions as tableAction} from '../../../stores/tableView'

const Project = ({ getProjectActiveTab, activeTabName,getTableData }) => {
  const tabs = getAccessTabItems({page:"Project",tabsMenu:"tabMenuList"});
  const activeTab = activeTabName || tabs?.[0] || "Patients";
  const handleTabs = (name) => {
     getTableData({ reloadTrue: true });
    getProjectActiveTab({
      projectActiveTab: name,
    });
  };
  return (
    <div className={`show`}>
      {/* <Header /> */}
      <div style={{marginTop:"70px"}}>
      <div className="text-center">
        <Tab icon activeTab={activeTab} handleTabs={handleTabs} tabs={tabs} />
        </div>
      </div>
      <div>
        {activeTab === "Patients" && (
          <Patients
            backRoute={"/tenantadmin/project"}
            route={`/tenantadmin/project/details`}
          />
        )}
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
    getTableData: tableAction.tableViewAction,
  }
);

export default enhancer(Project);
