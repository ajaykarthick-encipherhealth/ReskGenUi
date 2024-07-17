import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "../report.module.css";
import { Empty, Spin, notification } from "antd";
import Hold from "../../../../src/images/trackingImages/HoldTrack.png";
import Pending from "../../../../src/images/trackingImages/PendingTrack.png";
import Completed from "../../../../src/images/trackingImages/CompletedTrack.png";
import declineIcon from "../../.../../../images/trackingImages/DeclineTrack.png";
import reAuditIcon from "../../.../../../images/trackingImages/AuditPending.png";
import auditHoldIcon from "../../.../../../images/trackingImages/AuditHoldTrack.png";
import auditedIcon from "../../.../../../images/trackingImages/AuditedTrack.png";
import reeAuditIcon from "../../.../../../images/trackingImages/reAuditTrack.png";
import notAudited from "../../.../../../images/trackingImages/NotAuditedTrack.png";
import auditDeclined from "../../.../../../images/trackingImages/AuditDeclined.png";
import TableStyle from "../../../components/table/table.module.css";
import { renderUserPrfoileAvatar } from "../../../components/headerFilters/functions";
import { selectedRow } from "../../../store/actions/ReportActions";
import { useDispatch, connect } from "react-redux";
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
import { getReportDetails } from "../../../store/actions/adminAction/ReportActions";
import ENDPOINTS from "../../../utility/enpoints";
import { getStorage } from "../../../utils/storages";

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
}) => {
  const dispatch = useDispatch();
  const navigate = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const handleHeaderCheckboxChange = async () => {
    // console.log(selectAll);
    setSelectAll(!selectAll);
    // const updatedRows = selectAll ? [] : reportListAll?.response?.data;
    // setSelectedRows(updatedRows);
    if (activeTab === "Reviewer") {
      if (!selectAll) {
        try {
          setIsLoading(true);
          const res = await reviewerReport({
            pagenum: 0,
            size: reportListAll?.response?.totalElements,
          });
          const seletedAll = res?.response?.response?.data;

          setSelectedRows(seletedAll ? seletedAll : []);
          setIsLoading(false);
        } catch (error) {}
      } else setSelectedRows([]);
    }
    if (activeTab === "Admin") {
      if (!selectAll) {
        try {
          setIsLoading(true);
          const res = await fetch(
            ENDPOINTS.apiEndoint +
              `/dbservice/patient/adminreport?pageno=0&size=${reportListAll?.response?.totalElements}`,
            {
              headers: { Authorization: `Bearer ${await getStorage("token")}` },
            }
          ).then((res) => res.json());
          const seletedAll = res?.response?.response?.data;

          setSelectedRows(seletedAll ? seletedAll : []);
          setIsLoading(false);
        } catch (error) {}
      } else setSelectedRows([]);

      // dispatch(
      //   getReportDetails({
      //     pagenum: 0,
      //     size: reportListAll?.response?.totalElements,
      //   })
      // );
    }
  };

  const handleRowCheckboxChange = (row) => {
    const isSelected = selectedRows?.some(
      (selectedRow) => selectedRow.patientId === row?.patientId
    );
    let updatedRows;
    if (isSelected) {
      updatedRows = selectedRows?.filter(
        (selectedRow) => selectedRow.patientId !== row?.patientId
      );
    } else {
      updatedRows = [...selectedRows, row];
    }

    setSelectedRows(updatedRows);
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
    dispatch(patientDetails(data));

    if (data?.processedStatus === "COMPLETED") {
      const controller = new AbortController();
      const currentRole = localStorage.getItem("userRole");
      controller.abort();
      localStorage.setItem("patientId", data.patientId);
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
    dispatch(selectedRow(selectedRows));
  }, [selectedRows]);

  return (
    <>
      <div>
        <div className="content-body">
          {loader && !selectAll ? (
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
                {
                  reportListAll?.response?.data?.length > 0 && (
                    // (isLoading ? (
                    //   <Spin />
                    // ) : (
                    <>
                      <div className="col-xl-1 d-flex">
                        <div>
                          <input
                            type="checkbox"
                            onChange={handleHeaderCheckboxChange}
                            className={
                              styles.checkAlign +
                              (selectAll ? " " + TableStyle.customChecked : "")
                            }
                            checked={selectAll}
                          />
                        </div>
                        <span className={`pl-4 text-center ${styles.pName}`}>
                          All
                        </span>
                      </div>

                      <div className="col-xl-1 d-flex">
                        <div>
                          <input
                            type="checkbox"
                            onChange={handleHeaderCheckbox}
                            className={
                              styles.checkAlign +
                              (selectAllFlags
                                ? " " + TableStyle.customChecked
                                : "")
                            }
                            checked={selectAllFlags}
                          />
                        </div>
                        <span className={`pl-4 text-center ${styles.pName}`}>
                          All Flags
                        </span>
                      </div>
                    </>
                  )
                  // ))
                }
              </div>
              <div className="row">
                <div>
                  <div className=" col-xl-12 d-flex">
                    {reportListAll?.response?.data?.length === 0 ? (
                      <div className={`col-xl-6 ${styles.emptyCard}`}>
                        <Empty />
                      </div>
                    ) : (
                      <div className={`col-xl-6 ${styles.cardDiv}`}>
                        <div className={styles.cardContainer}>
                          {reportListAll?.response?.data?.map((item, id) => (
                            <ContentGroupCard
                              content={reportListAll?.response?.data}
                              key={item?.id}
                              item={item}
                              flag={item?.patientFlagResponseDTOs}
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
                              loading={isLoading}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    <div className={`col-xl-6 ${styles.cardSeperation}`}>
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
            </div>
          )}
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
    adminLoader: state?.admin?.report,
  }),
  {
    reviewerReport: reviewerAction.reviewerCheckAllReport,
  }
);
export default enhancer(InitialCard);
