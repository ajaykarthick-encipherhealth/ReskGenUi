import React, { useEffect, useState } from "react";
import Header from "../../../../jsx/layouts/nav/Header";
import SubNavBar from "../../../../components/subNavBar";
import Tab from "../../../../mainStream/components/tags";
import Fileprocessing from "../../../../commonPages/fileprocessing";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import { actions as tinActions } from "../../../../stores/tenantAdmin/tin";
import MoveBack from "../../../../commonPages/moveBack";
import PatientAllocation from "../../../../commonPages/patientAllocation";
import QueryApproval from "../../../../commonPages/queryApproval";
import Patients from "../../../../commonPages/patients";
import { getAccessTabItems } from "../../../../utils/reusable";
import visitStyles from "../../../../styles/visitdata.module.css";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { actions as allPatientSyncAction } from "../../../../stores/tenantAdmin/patientSync";

const TinDetails = ({ activeTabName, getProjectActiveTab,getRoutedData,getRoutedDatAllocation }) => {
  const router = useRouter();

  const tabs = getAccessTabItems({ page: "Tin", tabsMenu: "tabMenuList2" });
  const { tab } = router.query;
  const activeTab = tab || activeTabName?.tinDetailsTab;
  const [parsedData, setParsedData] = useState([]);

  const handleTabs = (name) => {
    getRoutedData(null)
    getRoutedDatAllocation(null);
    getProjectActiveTab({ tinDetailsTab: name });
    router.replace({
      pathname: router.pathname,
      query: { ...router.query, tab: name },
    });
  };
  const processstatusBodyTemplate = (rowData) => {
    const isFinished =
      parsedData?.length > 0 &&
      parsedData?.find(
        (data) =>
          data?.patientId === rowData?.patientId &&
          data?.processStageChart === "FINISHED"
      ) !== undefined;

    const rowStatus =
      rowData?.computing === 0 && parsedData?.length === 0
        ? "Not Computed"
        : rowData?.computing == 1
        ? "Processing"
        : isFinished || rowData?.computing == 2
        ? "Computed"
        : rowData?.computing == 3
        ? "Failed"
        : "Not Computed";
    return (
      <div className="patient-status">
        <div
          className={visitStyles.roleStyle}
          style={{
            backgroundColor:
              rowStatus === "Computed"
                ? "#cceeff "
                : rowStatus === "Processing"
                ? "#dfd8f3"
                : rowStatus === "Failed"
                ? "#e88d8d"
                : "#F1DEDA",
            color:
              rowStatus === "Computed"
                ? " #285563"
                : rowStatus === "Processing"
                ? "#452b90"
                : rowStatus === "Failed"
                ? "red"
                : "#BA704F",
          }}
        >
          {rowStatus === "Processing" && (
            <Spin
              indicator={
                <LoadingOutlined
                  style={{
                    fontSize: 16,
                  }}
                  spin
                  className="ant-badge"
                />
              }
              style={{ color: "#452b90", margin: "0 10px 0 0" }}
            />
          )}
          {rowStatus}
        </div>
      </div>
    );
  };
  const handleBack = () => {
    getProjectActiveTab(activeTabName);
    router.push("/tenantadmin/tin");
    getRoutedData(null) 
  };
  useEffect(() => {
    if (tab) {
      getProjectActiveTab({ tinDetailsTab: tab });
    }
  }, [tab]);

  return (
    <div className={`show `}>
      <Header />
      <div className="header">
        <SubNavBar hideBackArrow={true} handleBack={handleBack} />
      </div>
      <div style={{ marginTop: "10%" }}>
        <div>
          <Tab
            width={"60%"}
            icon
            activeTab={activeTab}
            handleTabs={handleTabs}
            tabs={tabs}
          />
        </div>
        {activeTab === "Patients" && (
          <Patients route={`/tenantadmin/tin/details`} />
        )}
        {activeTab === "File Processing" && (
          <div>
            <Fileprocessing />
          </div>
        )}
        {activeTab === "Patient Allocation" && (
          <PatientAllocation statusBodyTemplate={processstatusBodyTemplate} />
        )}
        {activeTab === "Moveback" && (
          <MoveBack statusBodyTemplate={processstatusBodyTemplate} />
        )}
        {activeTab === "Query Approval" && (
          <QueryApproval statusBodyTemplate={processstatusBodyTemplate} />
        )}
      </div>
    </div>
  );
};

const enhancer = connect(
  (state) => {
    return {
      activeTabName: state.tenantAdmin.tin?.activeTabRoutedData,
    };
  },
  {
    getProjectActiveTab: tinActions.getProjectActiveTab,
    getRoutedData: allPatientSyncAction.getRoutedData,   
    getRoutedDatAllocation: tinActions.getAllocationRoutedData, 
  }
);

export default enhancer(TinDetails);
