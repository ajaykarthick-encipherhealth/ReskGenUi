import React, { useEffect, useState } from "react";
import Header from "../../../jsx/layouts/nav/Header";
import styles from "./styles.module.css";
import { connect } from "react-redux";
import { actions as dashboardWorkflowActions } from "../../../stores/tenantAdmin/dashboard/workFlow";
import { actions as defaultActions } from ".././../../stores/tenantAdmin/dashboard/default";
import { actions as invalidAction } from ".././../../stores/tenantAdmin/dashboard/invalid";
import { actions as allPatientSyncAction } from "../../../stores/tenantAdmin/patientSync";
import Card from "../../../components/card";
import HeaderFilters from "./components/headerFilters";
import TotalCounts from "./default/totalcounts";
import RafAndRevenue from "./default/rafAndRevenue";
import HccCodes from "./default/hcc";
import PotentialDiagnosis from "./default/potentialDiagnosis";
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
import { Skeleton } from "antd";
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
  formatDateForIndex,
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
  routedData,
  routedBtn,
}) => {
  const [activeBtn, setActiveBtn] = useState("default");
  const [selectedValue, setSelectedValue] = useState(null);
  const [flagData, setFlagData] = useState(null);
  // const [dateRange, setDateRange] = useState({
  //   startDate:
  //     moment().subtract(29, "days").format("YYYY-MM-DD") + "T00:00:00.000Z",
  //   endDate: moment().format("YYYY-MM-DD") + "T23:59:59.000Z",
  // });
  const [dateRange, setDateRange] = useState({
    startDate: formatDateForIndex({
      date: moment().subtract(29, "days").format("YYYY-MM-DD"),
      index: 0,
    }),

    endDate: formatDateForIndex({
      date: moment().format("YYYY-MM-DD"),
      index: 1,
    }),
  });
  const [selectedOrganization, setSelectedOrganization] = useState("");
  const [customDate, setCustomDate] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(null);
  const [selectDos, setSelectDos] = useState("DOSWISE");

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
    {
      value: userStatusData?.response?.TENANT_ADMIN,
      name: "Tenant Admin",
      itemStyle: { color: "#3C0AD2" },
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
  const handleChange = (value) => {
    setSelectDos(value);
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
  const inValidDocumentValue =
    flagData?.invaliddocument?.response?.invalidDosCountMapByDate;
  const teleVisitValue =
    flagData?.televisit?.response?.invalidDosCountMapByDate;
  const invalidcredentailsValue =
    flagData?.invalidcredentails?.response?.invalidDosCountMapByDate;
  const patientDobValue =
    flagData?.patientDobMismatch?.response?.invalidDosCountMapByDate;
  const patientNameCountValue =
    flagData?.patientNameMismatch?.response?.invalidDosCountMapByDate;
  const scopeYearValue =
    flagData?.scopeyearmismatch?.response?.invalidDosCountMapByDate;
  const patientDeceasedValue =
    flagData?.patientdeceasded?.response?.invalidDosCountMapByDate;
  const mrnIdValue =
    flagData?.mrnIdMismatch?.response?.invalidDosCountMapByDate;
  const multiplePatientCount =
    flagData?.multiplePatientFound?.response?.invalidDosCountMapByDate;
  const patientInActiveValue =
    flagData?.patientInactive?.response?.invalidDosCountMapByDate;


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
      header: "Invalid Document",
      count: flagData?.invaliddocument?.response?.currentFilterCOunt || 0,
      images: imProper,
      bg: "#FFDCDC",
      data: formatValues(inValidDocumentValue, dates),
      overAll: flagData?.invaliddocument?.response?.totalCount || 0,
    },
    {
      id: 3,
      header: "Televisit (Audio visit) count",
      count: flagData?.televisit?.response?.currentFilterCOunt || 0,
      images: teleVisit,
      bg: "#ADF6FF",
      data: formatValues(teleVisitValue, dates),
      overAll: flagData?.televisit?.response?.totalCount || 0,
    },
    {
      id: 4,
      header: "Invalid Credentails",
      count: flagData?.invalidcredentails?.response?.currentFilterCOunt || 0,
      images: inValid,
      bg: "#FFECA8",
      data: formatValues(invalidcredentailsValue, dates),
      overAll: flagData?.invalidcredentails?.response?.totalCount || 0,
    },
    {
      id: 5,
      header: "Patient DOB Mismatch",
      count: flagData?.patientDobMismatch?.response?.currentFilterCOunt || 0,
      images: dos,
      bg: "#B8CCFF",
      data: formatValues(patientDobValue, dates),
      overAll: flagData?.patientDobMismatch?.response?.totalCount || 0,
    },
    {
      id: 6,
      header: "Patient Name Mismatch",
      count: flagData?.patientNameMismatch?.response?.currentFilterCOunt || 0,
      images: multiple,
      bg: "#E2F1F3",
      data: formatValues(patientNameCountValue, dates),
      overAll: flagData?.patientNameMismatch?.response?.totalCount || 0,
    },
    {
      id: 7,
      header: "Scope Year Mis-match",
      count: flagData?.scopeyearmismatch?.response?.currentFilterCOunt || 0,
      images: scope,
      bg: "#FFADDA",
      data: formatValues(scopeYearValue, dates),
      overAll: flagData?.scopeyearmismatch?.response?.totalCount || 0,
    },
    {
      id: 8,
      header: "Patient Deceased",
      count: flagData?.patientdeceasded?.response?.currentFilterCOunt || 0,
      images: dos,
      bg: "#B8CCFF",
      data: formatValues(patientDeceasedValue, dates),
      overAll: flagData?.patientdeceasded?.response?.totalCount || 0,
    },
    {
      id: 9,
      header: "MRN ID Mismatch",
      count: flagData?.mrnIdMismatch?.response?.currentFilterCOunt || 0,
      images: mrn,
      bg: "#E3B982",
      data: formatValues(mrnIdValue, dates),
      overAll: flagData?.mrnIdMismatch?.response?.totalCount || 0,
    },
    {
      id: 10,
      header: "Multiple Patient Found",
      count: flagData?.multiplePatientFound?.response?.currentFilterCOunt || 0,
      images: multiple,
      bg: "#E2F1F3",
      data: formatValues(multiplePatientCount, dates),
      overAll: flagData?.multiplePatientFound?.response?.totalCount || 0,
    },
    {
      id: 11,
      header: "Patient In-active",
      count: flagData?.patientInactive?.response?.currentFilterCOunt || 0,
      images: illegal,
      bg: "#C8A8FF",
      data: formatValues(patientInActiveValue, dates),
      overAll: flagData?.patientInactive?.response?.totalCount || 0,
    },
  ];
  const totalCount = invalidChartData
    .filter((item) => item.id >= 4)
    ?.map((item) => item.count);
  const initialValue = 0;
  const totalCountSum = totalCount?.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    initialValue
  );
  const currentCount = invalidChartData
    .filter((item) => item.id >= 4)
    .map((item) => item.overAll);
  const currentCountSum = currentCount?.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    initialValue
  );
  const flagNameList = [
    { flagName: "UNAPPROVED_DOC", label: "dosCount", id: 1 },
    { flagName: "IN_VALID_DOC", label: "invaliddocument", id: 2 },
    { flagName: "AUDIO_VISIT", label: "televisit", id: 3 },
    { flagName: "PROVIDER_UNAUTHORIZED", label: "invalidcredentails", id: 4 },
    { flagName: "PATIENT_DOB_MISMATCH", label: "patientDobMismatch", id: 5 },
    { flagName: "PATIENT_NAME_MISMATCH", label: "patientNameMismatch", id: 6 },
    { flagName: "SCOPE_YEAR_MISMATCH", label: "scopeyearmismatch", id: 7 },
    { flagName: "PATIENT_DECEASED", label: "patientdeceasded", id: 8 },
    { flagName: "MRN_ID_MISMATCH", label: "mrnIdMismatch", id: 9 },
    {
      flagName: "MULTIPLE_PATIENT_FOUND",
      label: "multiplePatientFound",
      id: 10,
    },
    { flagName: "PATIENT_INACTIVE", label: "patientInactive", id: 11 },
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
    if (activeBtn === "workflow") {
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
      getAccuracyScore(
        dateRange.startDate,
        dateRange.endDate,
        selectedOrganization
      );
    }
  }, [dateRange, selectedOrganization, activeBtn]);

  useEffect(() => {
    getAllLabAndRadiologyChart(
      dateRange.startDate,
      dateRange.endDate,
      selectedOrganization
    );
  }, [dateRange, selectedOrganization]);
  useEffect(() => {
    if (activeBtn === "workflow") {
      getOrganizationStatusData();
    }
  }, [activeBtn]);

  useEffect(() => {
    if (activeBtn === "Invalid") {
      flagNameList.map((item) => {
        chartData(item);
      });
    }
  }, [selectedOrganization, dateRange, activeBtn]);
  useEffect(() => {
    if (routedData) {
      setActiveBtn("Invalid");
    }
  }, [routedData]);

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
            handleChange={handleChange}
          />
          {activeBtn === "default" ? (
            <>
              <div className={`row ${styles.box}`}>
                <div className="col-lg-4 col-md-6 col-sm-12">
                  <Card padding="10px" borderRadius="10px">
                    <TotalCounts
                      dateRange={dateRange}
                      selectedOrganization={selectedOrganization}
                      selectDos={selectDos}
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
                      selectDos={selectDos}
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
                      selectDos={selectDos}
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
                      selectDos={selectDos}
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
                      selectDos={selectDos}
                    />
                  </Card>
                </div>
              </div>
              {/* potential diagnosis */}
              <div className={`row`}>
                <div className={`col ${styles.box}`}>
                  <Card padding="10px" borderRadius={"10px"}>
                    <PotentialDiagnosis
                      dateRange={dateRange}
                      selectedOrganization={selectedOrganization}
                      selectedValue={selectedValue}
                      customDate={customDate}
                      selectDos={selectDos}
                    />
                  </Card>
                </div>
              </div>
              {/* radiology */}
              <div className={`row ${styles.box}`}>
                <div className={`col-lg-4 `}>
                  <Card padding="10px" borderRadius={"10px"}>
                    <RadiolodyAndLab
                      dateRange={dateRange}
                      selectedOrganization={selectedOrganization}
                      selectDos={selectDos}
                    />
                  </Card>
                </div>
                <div className={`col-lg-8 `}>
                  <Card padding="10px" borderRadius={"10px"}>
                    <Files
                      activeBtn={activeBtn}
                      dateRange={dateRange}
                      selectedOrganization={selectedOrganization}
                      selectedValue={selectedValue}
                      classNames="workflowChart"
                      customDate={customDate}
                      selectDos={selectDos}
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
                      selectDos={selectDos}
                    />
                  </Card>
                </div>
                <div className={`col`}>
                  <Card padding="10px" borderRadius={"10px"}>
                    <TopOIGCodes
                      dateRange={dateRange}
                      selectedOrganization={selectedOrganization}
                      selectDos={selectDos}
                    />
                  </Card>
                </div>
              </div>
            </>
          ) : activeBtn === "Invalid" ? (
            <div className={`row ${styles.box}`}>
              {invalidChartData.map((data, index) => (
                <div className="col-4 mt-3" key={data.id}>
                  <Card padding="10px" borderRadius="10px" height="350px">
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
                        dateRange={dateRange}
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
                        flagNameList={flagNameList}
                        activeBtn={activeBtn}
                      />
                    )}
                  </Card>
                  {index === 0 && (
                    <div className="d-flex gap-3 mt-3">
                      <h5 className="fontWeight3">Data Discrepancies </h5>
                      <div>
                        <div className="font2 text-muted">
                          Current / Overall
                        </div>
                        {invalidLoader ? (
                          <CardSkeleton height={40} />
                        ) : (
                          <div className="fontWeight3 font5">
                            {currentCountSum} / {totalCountSum}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
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
                <div className={`col-lg-3 col-sm-6 `}>
                  <Card padding="10px" borderRadius={"10px"} height="265px">
                    <HeadTitle header="Allocated Status" fontSize="17px" />
                    {allocatedLoader ? (
                      <div>{renderCardSkeleton()}</div>
                    ) : (
                      <PieChartInfo data={allocatedData} header="Allocated" />
                    )}
                  </Card>
                </div>
                <div className={`col-lg-3 col-sm-6 `}>
                  <Card padding="10px" borderRadius={"10px"} height="265px">
                    <HeadTitle header="Reviewer Status" fontSize="17px" />
                    {reviewerLoader ? (
                      <div>{renderCardSkeleton()}</div>
                    ) : (
                      <PieChartInfo data={reviewerData} header="Reviewer" />
                    )}
                  </Card>
                </div>
                <div className={`col-lg-3 col-sm-6 `}>
                  <Card padding="10px" borderRadius={"10px"} height="265px">
                    <HeadTitle header="Sample Auditor Status" fontSize="17px" />
                    {auditorLoader ? (
                      <div>{renderCardSkeleton()}</div>
                    ) : (
                      <PieChartInfo data={auditorData} header="Auditor" />
                    )}
                  </Card>
                </div>
                <div className={`col-lg-3 col-sm-6 `}>
                  <Card padding="10px" borderRadius={"10px"} height="265px">
                    <HeadTitle header="Users" fontSize="17px" />
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
      <Modal
        className=" customReactModal d-flex align-items-center justify-content-center"
        show={isModalOpen}
        onHide={handleOk}
      >
        <Modal.Header closeButton></Modal.Header>
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
            invalidChartData={invalidChartData}
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
    routedBtn: state.tenantAdmin?.patientSync?.backarrowData,
    routedData: state.tenantAdmin?.patientSync?.routedData,
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
    getActiveBtn: allPatientSyncAction.getActiveBtn,
  }
);
export default enhancer(Index);
