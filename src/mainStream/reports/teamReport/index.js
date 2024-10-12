import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "../report.module.css";
import { Row, Empty, notification, Spin } from "antd";
import Hold from "../../../../src/images/trackingImages/HoldTrack.png";
import Pending from "../../../../src/images/trackingImages/PendingTrack.png";
import Completed from "../../../../src/images/trackingImages/CompletedTrack.png";
import declineIcon from "../../.../../../images/trackingImages/DeclineTrack.png";
import reAuditIcon from "../../.../../../images/trackingImages/AuditPending.png";
import auditedIcon from "../../.../../../images/trackingImages/AuditedTrack.png";
import { Paginator } from "primereact/paginator";
import TableStyle from "../../../components/table/table.module.css";
import { renderUserPrfoileAvatar } from "../../../components/headerFilters/functions";
import { selectedRow } from "../../../store/actions/ReportActions";
import { useDispatch, connect } from "react-redux";
import SpinnerDots from "../../../components/spinner";
import ContentGroupCard from "../../../mainStream/components/cards/contentGroupCard";
import SubCard from "../../../mainStream/components/cards/subcard";
import MiniCards from "../../../mainStream/components/miniCards";
import Flags from "../../../mainStream/components/flagCount";
import AllocationCount from "../../../mainStream/components/allocationCount";
import {
  auditstatusBodyTemplate,
  processstatusBodyTemplate,
} from "../../components/chartUtils";
import { actions as supervisorAction } from "../../../stores/supervisor/report";
import { getStorage, setStorage } from "../../../utils/storages";
const TeamReport = ({
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
  getFlagsData,
  isAdmin,
  loader,
  activeTab,
  auditReport,
  teamReport,
  handleHeaderCheckbox,
  selectAllFlags,
  userRole,
  auditCheckedLoader,
  teamCheckedLoader,
  auditCHeckList,
  teamCHeckList,
}) => {
  const dispatch = useDispatch();
  const navigate = useRouter();

  const handleHeaderCheckboxChange = async (
    activeTab,
    selectAll,
    setSelectAll
  ) => {
    // setSelectAll(!selectAll);
    // const updatedRows = selectAll
    //   ? []
    //   : reportListAll?.response?.response?.data;
    // setSelectedRows(updatedRows);
    // const orgId = getStorage("orgId");
    if (activeTab === "Audit" && selectAll) {
      // auditReport({
      //   pagenum: 0,
      //   size: ReportPatientDetails?.response?.response?.totalElements,
      // });
      // setIsLoading(true);
      // try {
      //   setIsLoading(true);
      //   const res = await fetch(
      //     ENDPOINTS.apiEndoint +
      //       `dbservice/patient/auditor/assinedreport?pageno=0&size=${
      //         ReportPatientDetails?.response?.response?.totalElements
      //       }&orgid=${orgId}&allPatientIds=${
      //         selectAll ? false : true
      //       }&allFlags=${selectAllFlags}`,
      //     {
      //       headers: { Authorization: `Bearer ${await getStorage("token")}` },
      //     }
      //   ).then((res) => res.json());
      //   // const seletedAll =res?.response?.response?.data?.map(item=>item?.patientId);
      //   const seletedAll = res?.response?.patientIds;
      //   setSelectedRows(seletedAll ? seletedAll : []);
      //   setIsLoading(false);
      // } catch (error) {
      //   setIsLoading(false);
      // }
      const res = await auditCHeckList({
        totalElements: ReportPatientDetails?.response?.response?.totalElements,
        selectAllFlags,
        selectAll,
      });
      if (res.status === "SUCCESS") {
        console.log(res);
        setSelectAll(true);
        setSelectedRows(res?.response?.patientIds);
      }
    } else if (activeTab === "Team" && selectAll) {
      // teamReport({
      //   pagenum: 0,
      //   size: ReportPatientDetails?.response?.response?.totalElements,
      // });
      // setIsLoading(true);
      // try {
      //   const res = await fetch(
      //     ENDPOINTS.apiEndoint +
      //       `dbservice/patient/auditorreport?pageno=0&size=${
      //         ReportPatientDetails?.response?.response?.totalElements
      //       }&orgid=${orgId}&allPatientIds=${
      //         selectAll ? false : true
      //       }&allFlags=${selectAllFlags}`,
      //     {
      //       headers: { Authorization: `Bearer ${await getStorage("token")}` },
      //     }
      //   ).then((res) => res.json());
      //   const seletedAll = res?.response?.patientIds;
      //   //  res?.response?.response?.data?.map(
      //   //   (item) => item?.patientId
      //   // );
      //   setSelectedRows(seletedAll ? seletedAll : []);
      //   setIsLoading(false);
      // } catch (error) {}

      const res = await teamCHeckList({
        totalElements: ReportPatientDetails?.response?.response?.totalElements,
        selectAllFlags,
        selectAll,
      });
      if (res?.status === "SUCCESS") {
        setSelectAll(true);
        setSelectedRows(res?.response?.patientIds);
      }
    } else {
      setSelectAll(false);
      setSelectedRows([]);
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
  };

  const card1Data = [
    {
      id: 1,
      icon: Completed,
      title: "Completed",
      charts: reportListAll?.response?.processedStatusCount?.processedStatus
        ? reportListAll?.response?.processedStatusCount?.processedStatus
            .COMPLETED
        : "0",
      bg: "#CCFFD1",
    },
    {
      id: 2,
      icon: Pending,
      title: "Pending",
      charts: reportListAll?.response?.processedStatusCount?.processedStatus
        ? reportListAll?.response?.processedStatusCount?.processedStatus.PENDING
        : "0",

      bg: "#CCE9FF",
    },
    {
      id: 3,
      icon: Hold,
      title: "Hold",
      charts: reportListAll?.response?.processedStatusCount?.processedStatus
        ? reportListAll?.response?.processedStatusCount?.processedStatus.HOLD
        : "0",

      bg: "#DACEFD",
    },
    {
      id: 4,
      icon: declineIcon,
      title: "Declined",
      charts: reportListAll?.response?.processedStatusCount?.processedStatus
        ? reportListAll?.response?.processedStatusCount?.processedStatus
            .DECLINED
        : "0",
      bg: "#FAD1D1",
    },
    {
      id: 5,
      icon: auditedIcon,
      title: "Audited",
      charts: reportListAll?.response?.processedStatusCount?.auditedStatus
        ? reportListAll?.response?.processedStatusCount?.auditedStatus.AUDITED
        : "0",

      bg: "#DBEEF0",
    },
    // {
    //   id: 6,
    //   icon: notAudited,
    //   title: "Not Audited",
    //   charts: reportListAll?.response?.processedStatusCount?.auditedStatus
    //     ? reportListAll?.response?.processedStatusCount?.auditedStatus.NOT_AUDIT
    //     : "0",

    //   bg: "#FBE7D0",
    // },
    // {
    //   id: 7,
    //   icon: reeAuditIcon,
    //   title: "Re Audit",
    //   charts: reportListAll?.response?.processedStatusCount?.auditedStatus
    //     ? reportListAll?.response?.processedStatusCount?.auditedStatus.REAUDIT
    //     : "0",

    //   bg: "#FFDBB8",
    // },
    {
      id: 6,
      icon: reAuditIcon,
      title: "Audit pending",
      charts: reportListAll?.response?.processedStatusCount?.auditedStatus
        ? reportListAll?.response?.processedStatusCount?.auditedStatus.PENDING
        : "0",

      bg: "#F3D8E5",
    },
    // {
    //   id: 9,
    //   icon: auditHoldIcon,
    //   title: "Audit hold",
    //   charts: reportListAll?.response?.processedStatusCount?.auditedStatus
    //     ? reportListAll?.response?.processedStatusCount?.auditedStatus.AUDITHOLD
    //     : "0",

    //   bg: "#FFF2CC",
    // },
    // {
    //   id: 10,
    //   icon: auditDeclined,
    //   title: "Audit decline",
    //   charts: reportListAll?.response?.processedStatusCount?.auditedStatus
    //     ? reportListAll?.response?.processedStatusCount?.auditedStatus.DECLINED
    //     : "0",

    //   bg: "#FDD2CE",
    // },
  ];
  const subCardData = [
    {
      title: "No of charts",
      value: reportListAll?.response?.response?.totalElements,
    },
    {
      title: "Total RAF score",
      value: reportListAll?.response?.totalRafScore
        ? reportListAll?.response?.totalRafScore?.toFixed(4)
        : 0,
    },
    {
      title: "HCC Count",
      value: reportListAll?.response?.totalHccCount,
    },
  ];
  const gotoPatientDetails = (data) => {
    dispatch(patientDetails(data));

    if (data?.processedStatus === "COMPLETED") {
      const controller = new AbortController();
      const currentRole = getStorage("userRole");
      controller.abort();
      setStorage("patientId", data.patientId);
      navigate.push({
        pathname: `/${currentRole}/patients/details`,
        query: page,
      });
    } else {
      notification.warning({
        message: data?.patientId + " file not processed. Please wait.",
      });
    }
  };

  const handleTableRowClick = (id) => {
    const clickedData = reportListAll?.response?.response?.data?.[id];
    gotoPatientDetails(clickedData);
  };
  const allocationCountData = [
    {
      title: "Supervisor",
      allocationCount: reportListAll?.response?.supervisorAllocationCount,
    },
    {
      title: "Reviewer",
      allocationCount: reportListAll?.response?.reviewerAllocationCount,
    },
  ];
  useEffect(() => {
    dispatch(selectedRow(selectedRows));
  }, [selectedRows]);

  return (
    <>
      <div>
        <div className="content-body">
          {loader ? (
            <SpinnerDots />
          ) : (
            <div className={`container-fluid py-4 px-2`}>
              <div
                style={{
                  display: "flex",
                  marginLeft: "10px",
                  paddingBottom: "10px",
                }}
              >
                {" "}
                {/* { */}
                {/* reportListAll?.response?.response?.data?.length > 0 && (
                    // (isLoading ? (
                    //   <Spin />
                    // ) : (
                    <> */}
                <div className="col-xl-1 d-flex">
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
                <div className="col-xl-2 d-flex pt-0">
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
                  )
                  // ))
                } */}
              </div>
              <div className="row">
                <div>
                  <div className=" col-xl-12 d-flex" style={{ height: "100%" }}>
                    {reportListAll?.response?.response?.data?.length === 0 ? (
                      <div className={`col-xl-6 ${styles.card1}`}>
                        <div className={` ${styles.emptyCard}`}>
                          <Empty />
                        </div>
                      </div>
                    ) : (
                      <div className={`col-xl-6 ${styles.cardDiv}`}>
                        <div className={styles.cardContainer}>
                          {reportListAll?.response?.response?.data?.map(
                            (item, id) => (
                              <ContentGroupCard
                                content={reportListAll?.response?.data}
                                key={id}
                                item={item}
                                flag={item?.patientFlagResponseDTOs}
                                page={page}
                                handleRowCheckboxChange={
                                  handleRowCheckboxChange
                                }
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
                                  activeTab === "Audit"
                                    ? auditCheckedLoader
                                    : teamCheckedLoader
                                }
                              />
                            )
                          )}
                        </div>
                      </div>
                    )}

                    <div className={`col-xl-6 ${styles.cardSeperation}`}>
                      <div className={styles.cardContainer}>
                        <div className={styles.card1}>
                          <div className={styles.summaryText}>Summary</div>
                          <div className="col-xl-12 d-flex mt-4">
                            {subCardData.map((card, index) => (
                              <SubCard
                                key={index}
                                title={card.title}
                                value={card.value}
                              />
                            ))}
                          </div>
                          <div className={` pt-2 ${styles.summaryText}`}>
                            Overall Status
                          </div>
                          <div className="col-xl-12 d-flex mt-2">
                            <div className="row g-2" style={{ width: "100%" }}>
                              {card1Data?.map((data) => (
                                <MiniCards
                                  key={data?.id}
                                  backgroundColor={data.bg}
                                  icon={data?.icon}
                                  title={data.title}
                                  charts={data.charts}
                                  styles={styles}
                                />
                              ))}
                            </div>
                          </div>
                          <div className="col-xl-12  d-flex mt-4">
                            <Flags
                              reportListAll={reportListAll?.response}
                              styles={styles}
                            />
                            {allocationCountData.map((item, index) =>
                              userRole === "supervisor" ? (
                                ""
                              ) : (
                                <AllocationCount
                                  key={index}
                                  title={item.title}
                                  allocationCount={item.allocationCount}
                                  renderUserPrfoileAvatar={
                                    renderUserPrfoileAvatar
                                  }
                                  styles={styles}
                                />
                              )
                            )}
                          </div>
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
      {reportListAll?.response?.response?.data?.length > 0 ? (
        <div className="pagination-container">
          <Paginator
            first={page?.teamPageNo === 0 ? 0 : paginationFirst}
            rows={8}
            totalRecords={
              ReportPatientDetails?.response?.response?.totalElements
            }
            onPageChange={onPageChange}
          />
          <div className="total-pages">
            Total count:{" "}
            {ReportPatientDetails?.response?.response?.totalElements}
          </div>
        </div>
      ) : null}
    </>
  );
};

const enhancer = connect(
  (state) => ({
    getFlagsData: state?.reviewer?.workQueue?.flags?.data,
    auditCheckedLoader: state?.supervisor?.report?.checkedLoader,
    teamCheckedLoader: state?.supervisor?.report?.teamCheckedLoader,
  }),
  {
    teamReport: supervisorAction.teamReport,
    auditReport: supervisorAction.auditReport,

    auditCHeckList: supervisorAction.auditCHeckList,
    teamCHeckList: supervisorAction.teamCHeckList,
  }
);
export default enhancer(TeamReport);
