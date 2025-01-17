import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "../report.module.css";
import { Empty, Spin, notification } from "antd";
import Hold from "../../../../src/images/trackingImages/hold.webp";
import Pending from "../../../../src/images/trackingImages/pending.webp";
import Completed from "../../../../src/images/trackingImages/completed.webp";
import declineIcon from "../../.../../../images/trackingImages/declined.webp";
import reAuditIcon from "../../.../../../images/trackingImages/auditpending.webp";
import auditedIcon from "../../.../../../images/trackingImages/audited.webp";
import TableStyle from "../../../components/table/table.module.css";
import { renderUserPrfoileAvatar } from "../../../components/headerFilters/functions";
import { connect } from "react-redux";
import SpinnerDots from "../../../components/spinner";
import ContentGroupCard from "../../../mainStream/components/cards/contentGroupCard";
import AllocationCount from "../../../mainStream/components/allocationCount";
import Flags from "../../../mainStream/components/flagCount";
import MiniCards from "../../../mainStream/components/miniCards";
import Pagination from "../../components/pagination";
import SubCard from "../../../mainStream/components/cards/subcard";
import { actions as reviewerAction } from "../../../stores/reviewer/report";
import {
  auditstatusBodyTemplate,
  processstatusBodyTemplate,
} from "../../components/chartUtils";
import { actions as adminActions } from "../../../stores/admin/report";
import { actions as patientsActions } from "../../../stores/admin/workqueue";
import { getStorage, setStorage } from "../../../utils/storages";

const InitialCard = ({
  patientDetails,
  paginationFirst,
  ReportPatientDetails,
  onPageChange,
  selectedRows,
  setSelectedRows,
  selectAll,
  setSelectAll,
  reportListAll,
  page,
  loader,
  activeTab,
  reviewerReport,
  handleHeaderCheckbox,
  selectAllFlags,
  adminLoader,
  apiCall,
  checkAllApi,
  checkedLoader,
  adminCheckedLoader,
  getAdminChecKAll,
  getSelectedRow,
}) => {
  const navigate = useRouter();
  const handleHeaderCheckboxChange = async (
    activeTab,
    selectAll,
    setSelectAll
  ) => {
    const {
      filter,
      pagenum,
      size,
      startDate,
      endDate,
      search,
      sort,
      userName,
      selectManager,
      flagsList,
      allPatientIds,
    } = apiCall.admin;

    // const updatedRows = selectAll ? [] : reportListAll?.response?.data;
    // setSelectedRows(updatedRows);
    if (activeTab === "Reviewer" && selectAll) {
      // setIsLoading(true);
      // const {
      //   filter,
      //   pagenum,
      //   size,
      //   startDate,
      //   endDate,
      //   search,
      //   sort,
      //   flagsList,
      //   allPatientIds,
      // } = apiCall.admin;
      // try {
      // const url = `dbservice/patient/coderreport?pageno=${pagenum}&size=${
      //   size ? size : 7
      // }&startdate=${startDate}&enddate=${endDate}&status=${
      //   filter ? filter : ""
      // }&searchstring=${search ? search : ""}&sortfield=${
      //   sort?.sortField ? sort?.sortField : ""
      // }&sortdirection=${sort?.sortDir ? sort?.sortDir : ""}&allPatientIds=${
      //   selectAll ? false : true
      // }&allFlags=${selectAllFlags}`;
      const res = await checkAllApi({
        pagenum,
        startDate,
        endDate,
        search,
        filter,
        sort,
        size,
        selectAllFlags,
        selectAll,
      });
      if (res.status === "SUCCESS") {
        setSelectAll(true);
        setSelectedRows(res?.response?.patientIds);
        getSelectedRow(res?.response?.patientIds);
      }
      // } catch (error) {}
    } else if (activeTab === "Admin" && selectAll) {
      // setIsLoading(true);

      // try {
      // setIsLoading(true);
      // const orgId = getStorage("orgId");
      // const role = getStorage("userRole");
      // const searchValue = filter === "ALL" ? "" : filter;
      // const url = `dbservice/patient/adminreport?pageno=${0}&size=${
      //   size ? size : 7
      // }&startdate=${startDate}&enddate=${endDate}&status=${searchValue}&searchstring=${search}&sortfield=${
      //   sort?.sortField ? sort?.sortField : ""
      // }&sortdirection=${sort?.sortDir ? sort?.sortDir : ""}&username=${
      //   userName === "REVIEWER" ? selectManager : ""
      // }&managerid=${userName === "SUPERVISOR" ? selectManager : ""}&orgid=${
      //   role == "tenant_admin" ? "" : orgId
      // }&allPatientIds=${selectAll ? false : true}&allFlags=${selectAllFlags}`;

      const searchValue = filter === "ALL" ? "" : filter;

      const res = await getAdminChecKAll({
        pagenum: 0,
        startDate,
        endDate,
        search,
        searchValue,
        sort,
        size,
        selectAllFlags,
        selectManager,
        selectAll,
        userName,
      }); // fetch(
      //   ENDPOINTS.apiEndoint + url,
      //   // `/dbservice/patient/adminreport?pageno=0&size=${reportListAll?.response?.totalElements}`,
      //   {
      //     headers: { Authorization: `Bearer ${await getStorage("token")}` },
      //   }
      // ).then((res) => res.json());
      if (res.status === "SUCCESS") {
        setSelectAll(true);
        getSelectedRow(res?.response?.patientIds);
        setSelectedRows(res?.response?.patientIds);
      }
    } else {
      setSelectAll(false);
      setSelectedRows([]);
      getSelectedRow([]);
    }
  };

  const handleRowCheckboxChange = (row) => {
    const isSelected = selectedRows?.some(
      (selectedRow) => selectedRow === row?.patientId
    );
    let updatedRows;
    if (isSelected) {
      updatedRows = selectedRows?.filter(
        (selectedRow) => selectedRow !== row?.patientId
      );
    } else {
      updatedRows = [...selectedRows, row?.patientId];
    }

    setSelectedRows(updatedRows);
    getSelectedRow(updatedRows);
  };

  const card1Data = [
    {
      id: 1,
      icon: Completed,
      title: "Completed",
      charts: reportListAll?.processedStatusCount?.processedStatus
        ? reportListAll?.processedStatusCount?.processedStatus.COMPLETED
        : "0",
      bg: "#CCFFD1",
    },
    {
      id: 2,
      icon: Pending,
      title: "Pending",
      charts: reportListAll?.processedStatusCount?.processedStatus
        ? reportListAll?.processedStatusCount?.processedStatus.PENDING
        : "0",

      bg: "#CCE9FF",
    },
    {
      id: 3,
      icon: Hold,
      title: "Hold",
      charts: reportListAll?.processedStatusCount?.processedStatus
        ? reportListAll?.processedStatusCount?.processedStatus.HOLD
        : "0",

      bg: "#DACEFD",
    },
    {
      id: 4,
      icon: declineIcon,
      title: "Declined",
      charts: reportListAll?.processedStatusCount?.processedStatus
        ? reportListAll?.processedStatusCount?.processedStatus.DECLINED
        : "0",
      bg: "#FAD1D1",
    },

    // {
    //   id: 6,
    //   icon: notAudited,
    //   title: "Sample Not Audited",
    //   charts: reportListAll?.processedStatusCount?.auditedStatus
    //     ? reportListAll?.processedStatusCount?.auditedStatus.NOT_AUDIT
    //     : "0",

    //   bg: "#FBE7D0",
    // },
    // {
    //   id: 7,
    //   icon: reeAuditIcon,
    //   title: "Sample Re Audit",
    //   charts: reportListAll?.processedStatusCount?.auditedStatus
    //     ? reportListAll?.processedStatusCount?.auditedStatus.REAUDIT
    //     : "0",

    //   bg: "#FFDBB8",
    // },

    // {
    //   id: 9,
    //   icon: auditHoldIcon,
    //   title: "Sample Audit hold",
    //   charts: reportListAll?.processedStatusCount?.auditedStatus
    //     ? reportListAll?.processedStatusCount?.auditedStatus.AUDITHOLD
    //     : "0",

    //   bg: "#FFF2CC",
    // },
    // {
    //   id: 10,
    //   icon: auditDeclined,
    //   title: "Sample Audit decline",
    //   charts: reportListAll?.processedStatusCount?.auditedStatus
    //     ? reportListAll?.processedStatusCount?.auditedStatus.DECLINED
    //     : "0",

    //   bg: "#FDD2CE",
    // },
  ];

  const accuracyStatus = [
    {
      id: 5,
      icon: auditedIcon,
      title: " Sample Audit",
      charts: reportListAll?.processedStatusCount?.auditedStatus
        ? reportListAll?.processedStatusCount?.auditedStatus.AUDITED
        : "0",

      bg: "#DBEEF0",
    },
    {
      id: 8,
      icon: reAuditIcon,
      title: "Sample Audit pending",
      charts: reportListAll?.processedStatusCount?.auditedStatus
        ? reportListAll?.processedStatusCount?.auditedStatus.AUDIT_PENDING
        : "0",

      bg: "#F3D8E5",
    },
  ];
  const gotoPatientDetails = (data) => {
    patientDetails(data);

    if (data?.processedStatus === "COMPLETED") {
      const controller = new AbortController();
      const currentRole = getStorage("userRole");
      controller.abort();
      setStorage("patientId", data.patientId);
      navigate.push({
        pathname: `/${currentRole}/report/reportdetails`,
        query: {...page,fromReport:currentRole},
      }, `/${currentRole}/report/reportdetails`);
    } else {
      notification.warning({
        message: data?.patientId + " file not processed. Please wait.",
      });
    }
  };

  const handleTableRowClick = (id) => {
    const clickedData = reportListAll?.response?.data?.[id];
    gotoPatientDetails(clickedData);
  };

  const subCardData = [
    {
      title: "No of charts",
      value: reportListAll?.response?.totalElements,
    },
    {
      title: "Total RAF score",
      value: reportListAll?.totalRafScore
        ? reportListAll?.totalRafScore?.toFixed(4)
        : 0,
    },
    {
      title: "HCC Count",
      value: reportListAll?.totalHccCount ? reportListAll?.totalHccCount : 0,
    },
  ];
  const allocationCountData = [
    {
      title: "Supervisor",
      allocationCount: reportListAll?.supervisorAllocationCount,
    },
    {
      title: "Reviewer",
      allocationCount: reportListAll?.reviewerAllocationCount,
    },
  ];

  useEffect(() => {
    getSelectedRow(selectedRows);
  }, [selectedRows]);

  return (
    <>
      <div>
        <div className="content-body">
          <div className={`container-fluid py-4 px-2`}>
            <div
              style={{
                display: "flex",
                marginLeft: "10px",
                paddingBottom: "10px",
              }}
            >
              {/* {reportListAll?.response?.data?.length > 0 && (
                  <> */}
              <div className="d-flex me-3">
                <div>
                  <input
                    type="checkbox"
                    onChange={() => {
                      setSelectAll((prevState) => {
                        const updatedSelectAll = !prevState;
                        handleHeaderCheckboxChange(
                          activeTab,
                          updatedSelectAll,
                          setSelectAll
                        );
                        return updatedSelectAll;
                      });
                    }}
                    className={
                      styles.checkAlign +
                      (selectAll ? " " + TableStyle.customChecked : "")
                    }
                    checked={selectAll && selectedRows?.length > 0}
                  />
                </div>
                <span className={`pl-0 text-start ${styles.pName}`}>All</span>
              </div>
              <div className="col-4 d-flex">
                <div>
                  <input
                    type="checkbox"
                    onChange={handleHeaderCheckbox}
                    className={
                      styles.checkAlign +
                      (selectAllFlags ? " " + TableStyle.customChecked : "")
                    }
                    checked={selectAllFlags}
                  />
                </div>
                <span className={`pl-4 text-start ${styles.pName}`}>
                  All Flags
                </span>
              </div>
              {/* </>
                // )} */}
            </div>
            {loader ? (
              <SpinnerDots />
            ) : (
              <div className="row">
                <div>
                  <div className=" col-12 d-flex">
                    <div className={`col-6 ${styles.cardDiv}`}>
                      {reportListAll?.response?.data?.length > 0 ? (
                        <div className={styles.cardContainer}>
                          {reportListAll?.response?.data?.map((item, id) => (
                            <ContentGroupCard
                              content={reportListAll?.response?.data}
                              key={item?.id}
                              item={item}
                              flag={
                                item?.patientFlagResponseDTOs
                                  ? item?.patientFlagResponseDTOs
                                  : []
                              }
                              page={page}
                              handleRowCheckboxChange={handleRowCheckboxChange}
                              selectedRows={selectedRows}
                              handleTableRowClick={handleTableRowClick}
                              auditstatusBodyTemplate={auditstatusBodyTemplate(
                                item
                              )}
                              processstatusBodyTemplate={processstatusBodyTemplate(
                                item
                              )}
                              rafSum={item.rafSum}
                              patientName={item.patientName}
                              processedDate={item?.processedDate}
                              patientId={item?.patientId}
                              validDiseaseCount={item?.validDiseaseCount}
                              auditedByFirstName={item?.auditedByFirstName}
                              auditedByLastName={item?.auditedByLastName}
                              auditedByProfileImage={
                                item?.auditedByProfileImage
                              }
                              patientAllocatedFirstName={
                                item?.patientAllocatedFirstName
                              }
                              patientAllocatedLastName={
                                item?.patientAllocatedLastName
                              }
                              patientAllocatedProfileImage={
                                item?.patientAllocatedProfileImage
                              }
                              loading={
                                activeTab === "Reviewer"
                                  ? checkedLoader
                                  : adminCheckedLoader
                              }
                              patientDetails={patientDetails}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className={styles.card}>
                          <Empty />
                        </div>
                      )}
                    </div>

                    <div className={`col-6 ${styles.cardSeperation}`}>
                      <div className={styles.cardContainer}>
                        <div className={styles.card1}>
                          <div className={styles.summaryText}>Summary</div>
                          <div className="col-xl-12 d-flex mt-0">
                            {subCardData.map((card, index) => (
                              <SubCard
                                key={card?.id}
                                title={card.title}
                                value={card.value}
                              />
                            ))}
                          </div>
                          <div className={` pt-2 ${styles.summaryText}`}>
                            Production Status
                          </div>
                          <div className="row g-3">
                            {card1Data?.map((data) => (
                              <MiniCards
                                key={data?.id}
                                backgroundColor={data.bg}
                                icon={data?.icon}
                                title={data.title}
                                charts={data.charts}
                                styles={styles}
                                activeTab={activeTab}
                              />
                            ))}
                          </div>
                          <div className={` pt-2 ${styles.summaryText}`}>
                            Audit Status
                          </div>

                          <div className="row g-3">
                            {accuracyStatus?.map((data) => (
                              <MiniCards
                                key={data?.id}
                                backgroundColor={data.bg}
                                icon={data?.icon}
                                title={data.title}
                                charts={data.charts}
                                styles={styles}
                                activeTab={activeTab}
                              />
                            ))}
                          </div>
                          <div className="col-xl-12  d-flex mt-3">
                            <Flags
                              reportListAll={reportListAll}
                              styles={styles}
                              activeTab={activeTab}
                            />
                            {activeTab === "Reviewer"
                              ? ""
                              : allocationCountData.map((item, index) => (
                                  <AllocationCount
                                    key={item?.id}
                                    title={item?.title}
                                    allocationCount={item?.allocationCount}
                                    renderUserPrfoileAvatar={
                                      renderUserPrfoileAvatar
                                    }
                                    styles={styles}
                                  />
                                ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {reportListAll?.response?.data?.length > 0 ? (
        <Pagination
          first={page?.pageNo === 0 ? 0 : paginationFirst}
          totalRecords={reportListAll?.response?.totalElements}
          onPageChange={onPageChange}
        />
      ) : null}
    </>
  );
};

const enhancer = connect(
  (state) => ({
    getFlagsData: state?.reviewer?.workQueue?.flags?.data,
    ReportPatientDetails: state?.reviewer?.report?.reviewer?.data,
    adminLoader: state?.admin?.report.adminLoader,
    checkedLoader: state.reviewer?.report?.checkedLoader,
    adminCheckedLoader: state.admin.report?.checkedLoader,
  }),
  {
    reviewerReport: reviewerAction.reviewerCheckAllReport,
    checkAllApi: reviewerAction.reviewerCheckAllReport,
    getAdminChecKAll: adminActions.adminCheckAllReport,
    getSelectedRow: adminActions.selectedRow,
    patientDetails: patientsActions.getPatientDetails,
  }
);
export default enhancer(InitialCard);
