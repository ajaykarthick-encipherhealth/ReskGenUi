import React, { useEffect, useState } from "react";
import Header from "../../../jsx/layouts/nav/Header";
import styles from "./styles.module.css";
import { connect } from "react-redux";
import { actions as dashboardWorkflowActions } from "../../../stores/tenantAdmin/dashboard/workFlow";
import Card from "../../../components/card";
import HeaderFilters from "./components/headerFilters";
import TotalCounts from "./default/totalcounts";
import RafAndRevenue from "./default/rafAndRevenue";
import HccCodes from "./default/hcc";
import CaregapCodes from "./default/caregaps";
import TotalCodes from "./default/totalcodes";
import RadiolodyAndLab from "./default/radiologyAndLab";
import Files from "./workFlow/files";
import Top10Diseases from "./default/top10Diseases";
import TopOIGCodes from "./default/topOIGCodes";
import WorkFlowFiles from "./workFlow/files";
import Accuracy from "./workFlow/accuracy";
import Notifications from "./workFlow/notifications";
import HeadTitle from "../../../components/headtitle";
import PieChartInfo from "./components/pieChart/PieChartInfo";
import OrgPieChartInfo from "./components/OrgPieChart/OrgPieChartInfo";

const Index = ({
  getUserStatusData,
  allocatedStatusData,
  getAuditorStatusData,
  auditorStatusData,
  getAllocatedStatusData,
  userStatusData,
  getReviewerStatusData,
  reviewerStatusData,
  getOrganizationStatusData,
  organizationStatusData,
}) => {
  const [activeBtn, setActiveBtn] = useState("default");
  const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });
  const [selectedOrganization, setSelectedOrganization] = useState("");

  const allocatedData = [
    {
      value: allocatedStatusData?.response?.allocated,
      name: "Allocated",
      itemStyle: { color: "#3276CD" },
    },
    {
      value: allocatedStatusData?.response?.notAllocated,
      name: "Not Allocated",
      itemStyle: { color: "#AF47D2" },
    },
  ];
  const reviewerData = [
    {
      value: reviewerStatusData?.response?.processedStatus?.COMPLETED,
      name: "Completed",
      itemStyle: { color: "#00BC13" },
    },
    {
      value: reviewerStatusData?.response?.processedStatus?.PENDING,
      name: "Pending",
      itemStyle: { color: "#2EA4FF" },
    },
    {
      value: reviewerStatusData?.response?.processedStatus?.HOLD,
      name: "Hold",
      itemStyle: { color: "#3C0AD2" },
    },
    {
      value: reviewerStatusData?.response?.processedStatus?.DECLINED,
      name: "Declined",
      itemStyle: { color: "#EB5252" },
    },
  ];

  const auditorData = [
    {
      value: auditorStatusData?.response?.auditedStatus?.AUDITED,
      name: "Audit Completed",
      itemStyle: { color: "#4AA1AB" },
    },
    {
      value: auditorStatusData?.response?.auditedStatus?.AUDIT_PENDING,
      name: "Audit Pending",
      itemStyle: { color: "#BD3A79" },
    },
    {
      value: auditorStatusData?.response?.auditedStatus?.AUDITHOLD,
      name: "Audit Hold",
      itemStyle: { color: "#EBAE00" },
    },
    {
      value: auditorStatusData?.response?.auditedStatus?.DECLINED,
      name: "Audit Declined",
      itemStyle: { color: "#C21807" },
    },
  ];
  const usersData = [
    {
      value: userStatusData?.response?.REVIEWER,
      name: "Reviewer",
      itemStyle: { color: "#2196F3" },
    },
    {
      value: userStatusData?.response?.SUPERVISOR,
      name: "Supervisor",
      itemStyle: { color: "#805DCA" },
    },
    {
      value: userStatusData?.response?.ADMIN,
      name: "Admin",
      itemStyle: { color: "#4361EE" },
    },
  ];

  const orgData =
    organizationStatusData?.response?.map((org, index) => ({
      value: index,
      name: org.name,
      itemStyle: { color: ["#757FEF", "#805DCA", "#4361EE"][index % 3] },
    })) || [];

  const handleOrganizationChange = (value) => {
    setSelectedOrganization(value);
  };

  useEffect(() => {
    getUserStatusData(
      dateRange.startDate,
      dateRange.endDate,
      selectedOrganization
    );
    getAuditorStatusData(
      dateRange.startDate,
      dateRange.endDate,
      selectedOrganization
    );
    getAllocatedStatusData(
      dateRange.startDate,
      dateRange.endDate,
      selectedOrganization
    );
    getReviewerStatusData(
      dateRange.startDate,
      dateRange.endDate,
      selectedOrganization
    );
    getOrganizationStatusData();
  }, [dateRange]);

  return (
    <div style={{ backgroundColor: "#F0F6FE" }}>
      <Header />
      <div className={styles.maincontainer}>
        <div className={styles.rowCOntainer}>
          <HeaderFilters
            activeBtn={activeBtn}
            setActiveBtn={setActiveBtn}
            setDateRange={setDateRange}
            handleOrganizationChange={handleOrganizationChange}
            setSelectedOrganization={setSelectedOrganization}
            selectedOrganization={selectedOrganization}
          />
          {activeBtn === "default" ? (
            <>
              <div className={`row ${styles.box}`}>
                <div className={`col-lg-4`}>
                  <Card padding="10px" borderRadius={"10px"}>
                    <TotalCounts dateRange={dateRange} />
                  </Card>
                </div>
                <div className={`col`}>
                  <Card padding="10px" borderRadius={"10px"}>
                    <RafAndRevenue dateRange={dateRange} />
                  </Card>
                </div>
              </div>
              {/* total codes */}
              <div className={`row`}>
                <div className={`col ${styles.box}`}>
                  <Card padding="10px" borderRadius={"10px"}>
                    <TotalCodes dateRange={dateRange} />
                  </Card>
                </div>
              </div>
              {/* hcc */}
              <div className={`row`}>
                <div className={`col ${styles.box}`}>
                  <Card padding="10px" borderRadius={"10px"}>
                    <HccCodes dateRange={dateRange} />
                  </Card>
                </div>
              </div>
              {/* car gaps */}
              <div className={`row`}>
                <div className={`col ${styles.box}`}>
                  <Card padding="10px" borderRadius={"10px"}>
                    <CaregapCodes dateRange={dateRange} />
                  </Card>
                </div>
              </div>
              {/* radiology */}
              <div className={`row ${styles.box}`}>
                <div className={`col-lg-4`}>
                  <Card padding="10px" borderRadius={"10px"}>
                    <RadiolodyAndLab />
                  </Card>
                </div>
                <div className={`col-lg-8`}>
                  <Card padding="10px" borderRadius={"10px"}>
                    <Files />
                  </Card>
                </div>
              </div>
              {/* top 10 diseases */}
              <div className={`row ${styles.box}`}>
                <div className={`col`}>
                  <Card padding="10px" borderRadius={"10px"}>
                    <Top10Diseases />
                  </Card>
                </div>
                <div className={`col`}>
                  <Card padding="10px" borderRadius={"10px"}>
                    <TopOIGCodes />
                  </Card>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className={`row ${styles.box}`}>
                <div className={`col-lg-3`}>
                  <Card padding="10px" borderRadius={"10px"}>
                    <HeadTitle header="Organizations" fontSize="16px" />
                    <OrgPieChartInfo data={orgData} header="Allocated" />
                  </Card>
                </div>
                <div className={`col-lg-9`}>
                  <Card padding="10px" borderRadius={"10px"}>
                    <HeadTitle header="Files" fontSize="16px" />
                    <WorkFlowFiles />
                  </Card>
                </div>
              </div>
              {/* total codes */}
              <div className={`row ${styles.box}`}>
                <div className={`col-lg-3`}>
                  <Card padding="10px" borderRadius={"10px"} height="auto">
                    <HeadTitle header="Allocated Status" fontSize="16px" />
                    <PieChartInfo data={allocatedData} header="Allocated" />
                  </Card>
                </div>
                <div className={`col-lg-3`}>
                  <Card padding="10px" borderRadius={"10px"} height="auto">
                    <HeadTitle header="Reviewer Status" fontSize="16px" />
                    <PieChartInfo data={reviewerData} header="Reviewer" />
                  </Card>
                </div>
                <div className={`col-lg-3`}>
                  <Card padding="10px" borderRadius={"10px"} height="auto">
                    <HeadTitle header="Auditor Status" fontSize="16px" />
                    <PieChartInfo data={auditorData} header="Auditor" />
                  </Card>
                </div>
                <div className={`col-lg-3`}>
                  <Card padding="10px" borderRadius={"10px"} height="auto">
                    <HeadTitle header="Users" fontSize="16px" />
                    <PieChartInfo data={usersData} header="Users" />
                  </Card>
                </div>
              </div>
              {/* hcc */}
              <div className={`row`}>
                <div className={`col ${styles.box}`}>
                  <Card padding="10px" borderRadius={"10px"}>
                    <Accuracy />
                  </Card>
                </div>
                <div className={`col-lg-3 ${styles.box}`}>
                  <Card padding="10px" borderRadius={"10px"}>
                    <Notifications />
                  </Card>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const enhancer = connect(
  (state) => ({
    allocatedStatusData: state?.tenantAdmin?.dashboard?.workFlow?.allocatedStatus?.data,
    auditorStatusData: state?.tenantAdmin?.dashboard?.workFlow?.auditorStatus?.data,
    userStatusData: state?.tenantAdmin?.dashboard?.workFlow?.userStatus?.data,
    reviewerStatusData: state?.tenantAdmin?.dashboard?.workFlow?.reviewerStatus?.data,
    organizationStatusData: state?.tenantAdmin?.dashboard?.workFlow?.organizationStatus?.data,
  }),

  {
    getUserStatusData: dashboardWorkflowActions?.userStatusAction,
    getAuditorStatusData: dashboardWorkflowActions?.auditorStatusAction,
    getAllocatedStatusData: dashboardWorkflowActions?.allocatedStatusAction,
    getReviewerStatusData: dashboardWorkflowActions?.reviewerStatusAction,
    getOrganizationStatusData: dashboardWorkflowActions?.organizationStatusAction,
  }
);
export default enhancer(Index);
