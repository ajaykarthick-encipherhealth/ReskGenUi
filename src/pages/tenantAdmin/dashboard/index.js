import React, { useEffect, useState } from "react";
import Header from "../../../jsx/layouts/nav/Header";
import styles from "./styles.module.css";
import { connect } from "react-redux";
import { actions as dashboardWorkflowActions } from "../../../stores/tenantAdmin/dashboard/workFlow";
import { actions as defaultActions } from ".././../../stores/tenantAdmin/dashboard/default";
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
import { Row, Skeleton, Spin } from "antd";
import moment from "moment";
import { getAllDatesInRange } from "../../../utils/reusable";

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
  userLoader,
  auditorLoader,
  allocatedLoader,
  reviewerLoader,
  orgLoader,
  getTop10DiseasesData,
  getAccuracyScore,
}) => {
  const [activeBtn, setActiveBtn] = useState("default");
  const [selectedValue, setSelectedValue] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate:
      moment().subtract(29, "days").format("YYYY-MM-DD") + "T00:00:00.000Z",
    endDate: moment().format("YYYY-MM-DD") + "T23:59:59.000Z",
  });
  const [selectedOrganization, setSelectedOrganization] = useState("");
  const [customDate, setCustomDate] = useState("");

  const getAllDatesInRange = (dateRange) => {
    const dates = [];
    let currentDate = moment(dateRange?.startDate);

    while (currentDate.isSameOrBefore(dateRange?.endDate)) {
      dates.push(currentDate.format("MMMDD"));
      currentDate = currentDate.add(1, "days");
    }

    return dates;
  };
  useEffect(() => {
    const customRange = getAllDatesInRange(dateRange);
    setCustomDate(customRange);
  }, [dateRange]);

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
      name: " Audit Completed",
      itemStyle: { color: "#4AA1AB" },
    },
    {
      value: auditorStatusData?.response?.auditedStatus?.AUDIT_PENDING,
      name: " Audit Pending",
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
      itemStyle: {
        color: [
          "#757FEF",
          "#805DCA",
          "#6EC6CA",
          "#4361EE",
          "#FF7889",
          "#705F93",
          "#5AA7A7",
          "#114B5F",
          "#A495CB",
          "#245B43",
          "#A75377",
        ][index % 10],
      },
    })) || [];

  const handleOrganizationChange = (value) => {
    setSelectedOrganization(value);
  };

  const renderCardSkeleton = () => (
    <div className="d-flex justify-content-around ">
      <div>
        <Skeleton.Input className="w-100" style={{ height: "170px" }} active />
      </div>
      <div className="d-flex flex-column mb-3">
        <Skeleton.Input active size="default" className="mb-2" />
        <Skeleton.Input active size="default" className="mb-2" />

        <Skeleton.Input active size="default" className="mb-2" />

        <Skeleton.Input active size="default" />
      </div>
    </div>
  );

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
    getTop10DiseasesData(
      dateRange.startDate,
      dateRange.endDate,
      selectedOrganization
    );
    getAccuracyScore(
      dateRange.startDate,
      dateRange.endDate,
      selectedOrganization
    );
  }, [dateRange, selectedOrganization]);

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
            setSelectedValue={setSelectedValue}
            dateRange={dateRange}
          />
          {activeBtn === "default" ? (
            <>
              <div className={`row ${styles.box}`}>
                <div className={`col-lg-4`}>
                  <Card padding="10px" borderRadius={"10px"}>
                    <TotalCounts
                      dateRange={dateRange}
                      selectedOrganization={selectedOrganization}
                    />
                  </Card>
                </div>
                <div className={`col`}>
                  <Card padding="10px" borderRadius={"10px"}>
                    <RafAndRevenue
                      dateRange={dateRange}
                      selectedOrganization={selectedOrganization}
                      customDate={customDate}
                      selectedValue={selectedValue}
                    />
                  </Card>
                </div>
              </div>
              {/* total codes */}
              <div className={`row`}>
                <div className={`col ${styles.box}`}>
                  <Card padding="10px" borderRadius={"10px"}>
                    <TotalCodes
                      dateRange={dateRange}
                      selectedOrganization={selectedOrganization}
                      selectedValue={selectedValue}
                      customDate={customDate}
                    />
                  </Card>
                </div>
              </div>
              {/* hcc */}
              <div className={`row`}>
                <div className={`col ${styles.box}`}>
                  <Card padding="10px" borderRadius={"10px"}>
                    <HccCodes
                      dateRange={dateRange}
                      selectedOrganization={selectedOrganization}
                      selectedValue={selectedValue}
                      customDate={customDate}
                    />
                  </Card>
                </div>
              </div>
              {/* car gaps */}
              <div className={`row`}>
                <div className={`col ${styles.box}`}>
                  <Card padding="10px" borderRadius={"10px"}>
                    <CaregapCodes
                      dateRange={dateRange}
                      selectedOrganization={selectedOrganization}
                      selectedValue={selectedValue}
                      customDate={customDate}
                    />
                  </Card>
                </div>
              </div>
              {/* radiology */}
              <div className={`row ${styles.box}`}>
                <div className={`col-lg-4`}>
                  <Card padding="10px" borderRadius={"10px"}>
                    <RadiolodyAndLab
                      dateRange={dateRange}
                      selectedOrganization={selectedOrganization}
                    />
                  </Card>
                </div>
                <div className={`col-lg-8`}>
                  <Card padding="10px" borderRadius={"10px"}>
                    <Files
                      activeBtn={activeBtn}
                      dateRange={dateRange}
                      selectedOrganization={selectedOrganization}
                      selectedValue={selectedValue}
                      classNames="workflowChart"
                      customDate={customDate}
                    />
                  </Card>
                </div>
              </div>
              {/* top 10 diseases */}
              <div className={`row ${styles.box}`}>
                <div className={`col`}>
                  <Card padding="10px" borderRadius={"10px"}>
                    <Top10Diseases
                      dateRange={dateRange}
                      selectedOrganization={selectedOrganization}
                    />
                  </Card>
                </div>
                <div className={`col`}>
                  <Card padding="10px" borderRadius={"10px"}>
                    <TopOIGCodes
                      dateRange={dateRange}
                      selectedOrganization={selectedOrganization}
                    />
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
                    <OrgPieChartInfo
                      data={orgData}
                      header="Allocated"
                      orgLoader={orgLoader}
                    />
                  </Card>
                </div>
                <div className={`col-lg-9`}>
                  <Card padding="10px" borderRadius={"10px"}>
                    <HeadTitle header="Files" fontSize="16px" />

                    <WorkFlowFiles
                      dateRange={dateRange}
                      selectedOrganization={selectedOrganization}
                      classNames="workflowChart1"
                      selectedValue={selectedValue}
                      customDate={customDate}
                    />
                  </Card>
                </div>
              </div>
              {/* total codes */}
              <div className={`row ${styles.box}`}>
                <div className={`col-lg-3`}>
                  <Card padding="10px" borderRadius={"10px"} height="265px">
                    <HeadTitle header="Allocated Status" fontSize="20px" />

                    {allocatedLoader ? (
                      <div>{renderCardSkeleton()}</div>
                    ) : allocatedLoader ? (
                      <div className="d-flex justify-content-center align-items-center">
                        <Spin size="large" />
                      </div>
                    ) : (
                      <PieChartInfo data={allocatedData} header="Allocated" />
                    )}
                  </Card>
                </div>
                <div className={`col-lg-3`}>
                  <Card padding="10px" borderRadius={"10px"} height="265px">
                    <HeadTitle header="Reviewer Status" fontSize="20px" />
                    {reviewerLoader ? (
                      <div>{renderCardSkeleton()}</div>
                    ) : (
                      <PieChartInfo data={reviewerData} header="Reviewer" />
                    )}
                  </Card>
                </div>
                <div className={`col-lg-3`}>
                  <Card padding="10px" borderRadius={"10px"} height="265px">
                    <HeadTitle header="Sample Auditor Status" fontSize="20px" />

                    {auditorLoader ? (
                      <div>{renderCardSkeleton()}</div>
                    ) : (
                      <PieChartInfo data={auditorData} header="Auditor" />
                    )}
                  </Card>
                </div>
                <div className={`col-lg-3`}>
                  <Card padding="10px" borderRadius={"10px"} height="265px">
                    <HeadTitle header="Users" fontSize="20px" />

                    {userLoader ? (
                      <div>{renderCardSkeleton()}</div>
                    ) : (
                      <PieChartInfo data={usersData} header="Users" />
                    )}
                  </Card>
                </div>
              </div>
              {/* hcc */}
              <div className={`row`}>
                <div className={`col ${styles.box}`}>
                  <Card padding="10px" borderRadius={"10px"}>
                    <Accuracy  dateRange={dateRange}
                      selectedOrganization={selectedOrganization}/>
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
    allocatedStatusData:
      state?.tenantAdmin?.dashboard?.workFlow?.allocatedStatus?.data,
    auditorStatusData:
      state?.tenantAdmin?.dashboard?.workFlow?.auditorStatus?.data,
    userStatusData: state?.tenantAdmin?.dashboard?.workFlow?.userStatus?.data,
    reviewerStatusData:
      state?.tenantAdmin?.dashboard?.workFlow?.reviewerStatus?.data,
    organizationStatusData:
      state?.tenantAdmin?.dashboard?.workFlow?.organizationStatus?.data,

    userLoader: state?.tenantAdmin?.workFlow?.userLoader,
    auditorLoader: state?.tenantAdmin?.workFlow?.auditorLoader,
    allocatedLoader: state?.tenantAdmin?.workFlow?.allocatedLoader,
    reviewerLoader: state?.tenantAdmin?.workFlow?.reviewerLoader,
    orgLoader: state?.tenantAdmin?.workFlow?.organizationLoader,
    top10DiseasesData:
      state?.tenantAdmin?.dashboard?.default?.allTop10Diseases?.data?.response,
  }),
  {
    getUserStatusData: dashboardWorkflowActions?.userStatusAction,
    getAuditorStatusData: dashboardWorkflowActions?.auditorStatusAction,
    getAllocatedStatusData: dashboardWorkflowActions?.allocatedStatusAction,
    getReviewerStatusData: dashboardWorkflowActions?.reviewerStatusAction,
    getOrganizationStatusData:
      dashboardWorkflowActions?.organizationStatusAction,
    getTop10DiseasesData: defaultActions.top10Diseases,
    getAccuracyScore: dashboardWorkflowActions.getAccuracyWorkflow,
  }
);
export default enhancer(Index);
