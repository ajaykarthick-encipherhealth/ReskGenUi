import React, { useEffect } from "react";
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

const TinDetails = ({ activeTabName, getProjectActiveTab }) => {
  const router = useRouter();

  const tabs = getAccessTabItems({ page: "Tin", tabsMenu: "tabMenuList2" });
  const { tab } = router.query;
  const activeTab = tab || activeTabName?.tinDetailsTab;
  
  const handleTabs = (name) => {
    getProjectActiveTab({ tinDetailsTab: name });
    router.replace({
      pathname: router.pathname,
      query: { ...router.query, tab: name },
    });
  };

  const handleBack = () => {
    getProjectActiveTab(activeTabName);
    router.push("/tenantadmin/tin");
  };
  useEffect(() => {
    if (tab) {
      getProjectActiveTab({ tinDetailsTab: tab });
    }
  }, [tab]);

  return (
    <div className={`show `}>
      <Header />
      <div>
        <SubNavBar hideBackArrow={true} handleBack={handleBack} />
        <div className="mt-5">
          <Tab
            width={"60%"}
            icon
            activeTab={activeTab}
            handleTabs={handleTabs}
            tabs={tabs}
          />
          {activeTab === "Patients" && (
            <Patients route={`/tenantadmin/tin/details`} />
          )}
          {activeTab === "File Processing" && (
            <div>
              <Fileprocessing />
            </div>
          )}
          {activeTab === "Patient Allocation" && <PatientAllocation />}
          {activeTab === "Moveback" && <MoveBack />}
          {activeTab === "Query Approval" && <QueryApproval />}
        </div>
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
  }
);

export default enhancer(TinDetails);
