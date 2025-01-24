import React, { useEffect, useState } from "react";
import Header from "../../../jsx/layouts/nav/Header";
import styles from "./styles.module.css";
import ReactECharts from "echarts-for-react";
import { connect } from "react-redux";
import { actions as dashboardWorkflowActions } from "../../../stores/tenantAdmin/dashboard/workFlow";
import { actions as defaultActions } from ".././../../stores/tenantAdmin/dashboard/default";
import { actions as invalidAction } from ".././../../stores/tenantAdmin/dashboard/invalid";
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
import {  Row, Skeleton, Spin } from "antd";
import moment from "moment";
import teleVisit from "../../../../src/images/invalid/televisit.webp";
import scope from "../../../../src/images/invalid/scope.webp";
import inValid from "../../../../src/images/invalid/invalid.webp";
import imProper from "../../../../src/images/invalid/improper.webp";
import multiple from "../../../../src/images/invalid/multiple.webp";
import mrn from "../../../../src/images/invalid/mrn.webp";
import illegal from "../../../../src/images/invalid/illelegal.webp";
import dos from "../../../../src/images/invalid/calender.svg";
import InvalidChart from "./invalidChart";
import {
  formatValues,
  getLast30Days,
  getLast7Days,
  getResponePopup,
} from "../../../utils/reusable";
import CardSkeleton from "../../../components/skeleton/card";
import Modal from "react-bootstrap/Modal";

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
  getAllLabAndRadiologyChart,
  getInvalidDashboard,
  invalidData,
  invalidLoader,
  graphName,
}) => {
  const [activeBtn, setActiveBtn] = useState("default");
  const [selectedValue, setSelectedValue] = useState(null);
  const [flagData, setFlagData] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate:
      moment().subtract(29, "days").format("YYYY-MM-DD") + "T00:00:00.000Z",
    endDate: moment().format("YYYY-MM-DD") + "T23:59:59.000Z",
  });
  const [selectedOrganization, setSelectedOrganization] = useState("");
  const [customDate, setCustomDate] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(null);

  const showModal = (data) => {
    setIsModalOpen(data);
  };
  const handleOk = () => {
    setIsModalOpen(null);
  };

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
      value: index + 1,
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
  const dates =
    selectedValue === "custom"
      ? customDate
      : selectedValue === "last_1_week"
      ? getLast7Days()
      : getLast30Days();
  const dosCountValue = flagData?.dosCount?.response?.invalidDosCountMapByDate;
  const teleVisitCountValue =
    flagData?.teleVisit?.response?.invalidDosCountMapByDate;
  const outOfScopeValue =
    flagData?.outOfscope?.response?.invalidDosCountMapByDate;
  const inValidCountValue =
    flagData?.provider?.response?.invalidDosCountMapByDate;
  const improperDateCountValue =
    flagData?.imProper?.response?.invalidDosCountMapByDate;
  const multiplePatientCountValue =
    flagData?.mutiple?.response?.invalidDosCountMapByDate;
  const mrnIdMismatchCountValue =
    flagData?.mrnMismatch?.response?.invalidDosCountMapByDate;
  const patientDobMismatchCountValue =
    flagData?.patientDobMismatch?.response?.invalidDosCountMapByDate;
  const illegalFormatCountValue =
    flagData?.inValidDoc?.response?.invalidDosCountMapByDate;
  const invalidChartData = [
    {
      id: 1,
      header: "DOS Count",
      count: flagData?.dosCount?.response?.currentFilterCOunt,
      images: dos,
      bg: "#A8ADFF",
      data: formatValues(dosCountValue, dates),
      overAll: flagData?.dosCount?.response?.totalCount || 0,
    },
    {
      id: 2,
      header: "Televist Count",
      count: flagData?.teleVisit?.response?.currentFilterCOunt || 0,
      images: teleVisit,
      bg: "#ADF6FF",
      data: formatValues(teleVisitCountValue, dates),
      overAll: flagData?.teleVisit?.response?.totalCount || 0,
    },
    {
      id: 3,
      header: "Out of Scope",
      count: flagData?.outOfscope?.response?.currentFilterCOunt || 0,
      images: scope,
      bg: "#FFADDA",
      data: formatValues(outOfScopeValue, dates),
      overAll: flagData?.outOfscope?.response?.totalCount || 0,
    },
    {
      id: 4,
      header: "Invalid Credentails",
      count: flagData?.provider?.response?.currentFilterCOunt || 0,
      images: inValid,
      bg: "#FFECA8",
      data: formatValues(inValidCountValue, dates),
      overAll: flagData?.provider?.response?.totalCount || 0,
    },
    {
      id: 5,
      header: "Improper Data",
      count: flagData?.imProper?.response?.currentFilterCOunt || 0,
      images: imProper,
      bg: "#FFDCDC",
      data: formatValues(improperDateCountValue, dates),
      overAll: flagData?.imProper?.response?.totalCount || 0,
    },
    {
      id: 6,
      header: "Multiple Patient Found",
      count: flagData?.mutiple?.response?.currentFilterCOunt || 0,
      images: multiple,
      bg: "#E2F1F3",
      data: formatValues(multiplePatientCountValue, dates),
      overAll: flagData?.mutiple?.response?.totalCount || 0,
    },
    {
      id: 7,
      header: "MRN Id Mismatch",
      count: flagData?.mrnMismatch?.response?.currentFilterCOunt || 0,
      images: mrn,
      bg: "#FFCC9E",
      data: formatValues(mrnIdMismatchCountValue, dates),
      overAll: flagData?.mrnMismatch?.response?.totalCount || 0,
    },
    {
      id: 8,
      header: "Patient DOB Mismatch",
      count: flagData?.patientDobMismatch?.response?.currentFilterCOunt || 0,
      images: dos,
      bg: "#B8CCFF",
      data: formatValues(patientDobMismatchCountValue, dates),
      overAll: flagData?.patientDobMismatch?.response?.totalCount || 0,
    },
    {
      id: 9,
      header: "Illegial Format",
      count: flagData?.inValidDoc?.response?.currentFilterCOunt || 0,
      images: illegal,
      bg: "#C8A8FF",
      data: formatValues(illegalFormatCountValue, dates),
      overAll: flagData?.inValidDoc?.response?.totalCount || 0,
    },
  ];
  const totalCount = invalidChartData.map((item) => item.count);
  const initialValue = 0;
  const totalCountSum = totalCount?.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    initialValue
  );
  const currentCount = invalidChartData.map((item) => item.overAll);
  const currentCountSum = currentCount?.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    initialValue
  );

  const flagNameList = [
    { flagName: "IN_VALID_DOC", label: "dosCount" },
    { flagName: "AUDIO_VISIT", label: "teleVisit" },
    { flagName: "VIDEO_VISIT", label: "videoVisit" },
    { flagName: "OUT_OF_SCOPE", label: "outOfscope" },
    { flagName: "PROVIDER_UNAUTHORIZED", label: "provider" },
    { flagName: "IMPROPER_DATA", label: "imProper" },
    { flagName: "MULTIPLE_PATIENT_FOUND", label: "mutiple" },
    { flagName: "MRN_ID_MISMATCH", label: "mrnMismatch" },
    { flagName: "PATIENT_DOB_MISMATCH", label: "patientDobMismatch" },
    { flagName: "IN_VALID_DOC", label: "inValidDoc" },
  ];
  const chartData = async (item) => {
    try {
      const response = await getInvalidDashboard(
        item.flagName,
        dateRange.startDate,
        dateRange.endDate,
        selectedOrganization
      );
      if (response?.status == "SUCCESS") {
        setFlagData((prev) => ({
          ...prev,
          [item.label]: response,
        }));
      } else {
        if (activeBtn === "Invalid") {
          getResponePopup(response);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getOrganizationStatusData();
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
    getAllLabAndRadiologyChart(
      dateRange.startDate,
      dateRange.endDate,
      selectedOrganization
    );
  }, [dateRange, selectedOrganization]);

  useEffect(() => {
    if (activeBtn === "Invalid") {
      flagNameList.map((item) => {
        chartData(item);
      });
    }
  }, [selectedOrganization, dateRange, activeBtn]);

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
          ) : activeBtn === "Invalid" ? (
            <>
              <div className={`row ${styles.box}`}>
                {invalidChartData.map((data, index) => (
                  <div className="col-4 mt-3" key={data.id}>
                    <Card padding="10px" borderRadius="10px" height="330px">
                      {invalidLoader ? (
                        <div>
                          <Skeleton.Input
                            className="w-100"
                            style={{ height: "288px" }}
                            active
                          />
                        </div>
                      ) : (
                        <InvalidChart
                          selectedValue={selectedValue}
                          header={data.header}
                          count={data.count}
                          images={data.images}
                          background={data.bg}
                          data={data.data}
                          customDate={customDate}
                          overAll={data.overAll}
                          setIsModalOpen={setIsModalOpen}
                          onClick={showModal}
                          values={data}
                          hideContent={true}
                          id={data.id}
                          graphName={data?.header}
                        />
                      )}
                    </Card>
                    {index === 0 && (
                      <div className="d-flex gap-3 mt-3">
                        <h5 className="fontWeight3">Data Discrepancies </h5>
                        <div>
                          <div className="font2 text-muted">
                            current/Overall
                          </div>
                          {invalidLoader ? (
                            <CardSkeleton />
                          ) : (
                            <div className="fontWeight3 font5">
                              {currentCountSum}/{totalCountSum}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className={`row ${styles.box1}`}>
                <div className={`col-lg-3`}>
                  <Card padding="10px" borderRadius={"10px"} height={"95%"}>
                    <HeadTitle header="Organizations" fontSize="16px" />
                    <OrgPieChartInfo
                      data={orgData}
                      header="Allocated"
                      orgLoader={orgLoader}
                    />
                  </Card>
                </div>
                <div className={`col-lg-9`}>
                  <Card padding="10px" borderRadius={"10px"} height={"95%"}>
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
                <div className={`col-9 ${styles.box}`}>
                  <Card padding="10px" borderRadius={"10px"}>
                    <Accuracy
                      dateRange={dateRange}
                      selectedOrganization={selectedOrganization}
                      selectedValue={selectedValue}
                      customDate={customDate}
                    />
                  </Card>
                </div>
                <div className={`col-3 ${styles.box}`}>
                  <Card padding="10px" borderRadius={"10px"}>
                    <Notifications />
                  </Card>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <Modal className=" customReactModal d-flex align-items-center justify-content-center" show={isModalOpen} onHide={handleOk}>
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body>
          <InvalidChart
            selectedValue={selectedValue}
            header={isModalOpen?.header}
            count={isModalOpen?.count}
            images={isModalOpen?.images}
            background={isModalOpen?.bg}
            data={isModalOpen?.data}
            customDate={customDate}
            overAll={isModalOpen?.overAll}
            setIsModalOpen={setIsModalOpen}
            onClick={showModal}
            hideContent={false}
            id={isModalOpen?.id}
          />
        </Modal.Body>
      </Modal>
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

    userLoader: state?.tenantAdmin?.dashboard?.workFlow?.userLoader,
    auditorLoader: state?.tenantAdmin?.dashboard?.workFlow?.auditorLoader,
    allocatedLoader: state?.tenantAdmin?.dashboard?.workFlow?.allocatedLoader,
    reviewerLoader: state?.tenantAdmin?.dashboard?.workFlow?.reviewerLoader,
    orgLoader: state?.tenantAdmin?.dashboard?.workFlow?.organizationLoader,
    top10DiseasesData:
      state?.tenantAdmin?.dashboard?.default?.allTop10Diseases?.data?.response,
    invalidData: state?.tenantAdmin?.dashboard?.invalid?.InvalidCounts,
    invalidLoader: state?.tenantAdmin?.dashboard?.invalid?.InvalidCountsLoader,
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
    getAllLabAndRadiologyChart: defaultActions.getAllLabAndRadiologyChart,
    getInvalidDashboard: invalidAction?.InvalidCounts,
  }
);
export default enhancer(Index);
