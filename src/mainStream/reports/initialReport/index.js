import React, { useEffect } from "react";
import { useRouter } from "next/router";
import styles from "../report.module.css";
import { Empty, notification } from "antd";
import Hold from "../../../../src/images/trackingImages/hold.webp";
import Pending from "../../../../src/images/trackingImages/pending.webp";
import Completed from "../../../../src/images/trackingImages/completed.webp";
import declineIcon from "../../.../../../images/trackingImages/declined.webp";
import reAuditIcon from "../../.../../../images/trackingImages/auditpending.webp";
import auditedIcon from "../../.../../../images/trackingImages/audited.webp";
import TableStyle from "../../../components/table/table.module.css";
import { renderUserPrfoileAvatar } from "../../../components/headerFilters/functions";
import { connect } from "react-redux";
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
import CardSkeleton from "../../../components/skeleton/card";

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
    setSelectAll,
    selectAllFlags
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
    } = apiCall.admin;
    if (activeTab === "Reviewer") {
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
    } else if (activeTab === "Admin" ) {
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
      });
      if (res?.status === "SUCCESS") {
        getSelectedRow(res?.response?.patientIds);
        setSelectedRows(res?.response?.patientIds);
      }
    } 
  };

  const handleRowCheckboxChange = (row) => {
    const isSelected = selectedRows?.some(
      (selectedRow) => selectedRow === row.patientId
    );

    let updatedRows;
    if (isSelected) {
      updatedRows = selectedRows?.filter(
        (selectedRow) => selectedRow !== row.patientId
      );
    } else {
      updatedRows = selectedRows
        ? [...selectedRows, row.patientId]
        : [row.patientId];
    }

    setSelectedRows(updatedRows);
    getSelectedRow(updatedRows);
    setSelectAll(
      reportListAll?.response?.totalElements === updatedRows?.length
    );
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
      navigate.push(
        {
          pathname: `/${currentRole}/report/reportdetails`,
          query: { ...page, fromReport: currentRole },
        },
        `/${currentRole}/report/reportdetails`
      );
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
const handleSelectAllChange = () => {
  const updatedSelectAll = !selectAll;
  setSelectAll(updatedSelectAll);

  if (!updatedSelectAll) {
    setSelectedRows([]);
  } else {
    handleHeaderCheckboxChange(
      activeTab,
      updatedSelectAll,
      setSelectAll,
      selectAllFlags
    );
  }
};
  useEffect(() => {
    getSelectedRow(selectedRows);
  }, [selectedRows]);


  return (
    <>
      <div>
        <div className="content-body">
          <div className={`container-fluid py-4 px-2`}>
            <div className="d-flex mx-2 mb-2">
              <div className="d-flex me-3">
                <input
                  id="check-all"
                  name="check-all"
                  type="checkbox"
                  onChange={handleSelectAllChange}
                  checked={
                    (selectAll ||
                      reportListAll?.response?.totalElements ===
                        selectedRows?.length) &&
                    reportListAll?.response?.totalElements !== 0
                  }
                  className={
                    styles.checkAlign +
                    ((selectAll ||
                      reportListAll?.response?.totalElements ===
                        selectedRows?.length) &&
                    reportListAll?.response?.totalElements !== 0
                      ? " " + TableStyle.customChecked
                      : "")
                  }
                  disabled={reportListAll?.response?.totalElements === 0}
                  // checked={
                  //   selectedRows.length > 0 &&
                  //   selectedRows.length ===
                  //     reportListAll?.response?.data?.length
                  // }
                />

                <span className={`pl-0 text-start ${styles.pName}`}>All</span>
              </div>

              <div className="col-4 d-flex">
                <input
                  id="check-allFlags"
                  name="check-allFlags"
                  type="checkbox"
                  onChange={handleHeaderCheckbox}
                  className={
                    styles.checkAlign +
                    (selectAllFlags ? " " + TableStyle.customChecked : "")
                  }
                  disabled={reportListAll?.response?.totalElements === 0}
                  checked={selectAllFlags}
                />

                <span className={`pl-4 text-start ${styles.pName}`}>
                  All Flags
                </span>
              </div>

              {/* </>
                // )} */}
            </div>

            {/* {loader ? (
              <div className="mt-4">
            <TableSkeleton/>
            </div> */}
            {/* ) : ( */}
            <div className="row">
              <div>
                <div className=" col-12 d-flex">
                  <div className={`col-6 ${styles.cardDiv}`}>
                    {loader ? (
                      <div className="mt-4">
                        <CardSkeleton count={6} width={900} height={100} />
                      </div>
                    ) : reportListAll?.response?.data?.length > 0 ? (
                      <div id="initial-report" name="initial-report" className={styles.cardContainer}>
                        {reportListAll?.response?.data?.map((item, index) => (
                          <ContentGroupCard
                          id={index}
                           activeTab={activeTab}
                            content={reportListAll?.response?.data}
                            key={item?.id}
                            item={item}
                            flag={
                              item?.patientFlagResponseDTOs
                                ? item?.patientFlagResponseDTOs
                                : []
                            }
                            page={{ ...page, selectedRows }}
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
                            auditedByProfileImage={item?.auditedByProfileImage}
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
                    {loader ? (
                      <div className="mt-4">
                        <CardSkeleton count={6} width={900} height={100} />
                      </div>
                    ) : (
                      <div className={styles.cardContainer} id="admin-card" >
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
                          <div className=" col-12 d-flex mt-3">
                            <Flags
                              reportListAll={reportListAll}
                              styles={styles}
                              activeTab={activeTab}
                            />
                          </div>
                          <div className="col-xl-12   d-flex mt-3">
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
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* )} */}
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
