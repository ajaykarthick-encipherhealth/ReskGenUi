import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "../report.module.css";
import {
  Checkbox,
  Popover,
  Col,
  Row,
  Tooltip,
  Empty,
  notification,
} from "antd";
import { extractLatestData } from "../../../pages/supervisor/auditing";
import AuditedTrack from "../../../../src/images/trackingImages/AuditedTrack.png";
import NotAudited from "../../../../src/images/trackingImages/NotAuditedTrack.png";
import AuditHold from "../../../../src/images/trackingImages/AuditHoldTrack.png";
import ReAudit from "../../../../src/images/trackingImages/reAuditTrack.png";
import AuditPending from "../../../../src/images/trackingImages/AuditPending.png";
import Hold from "../../../../src/images/trackingImages/HoldTrack.png";
import Pending from "../../../../src/images/trackingImages/PendingTrack.png";
import Completed from "../../../../src/images/trackingImages/CompletedTrack.png";
import Declined from "../../../../src/images/trackingImages/DeclineTrack.png";
import AuditedDeclineTrack from "../../../../src/images/trackingImages/AuditDeclined.png";
import Abort from "../../../../src/images/trackingImages/Abort.png";
import declineIcon from "../../.../../../images/trackingImages/DeclineTrack.png";
import reAuditIcon from "../../.../../../images/trackingImages/AuditPending.png";
import auditHoldIcon from "../../.../../../images/trackingImages/AuditHoldTrack.png";
import auditedIcon from "../../.../../../images/trackingImages/AuditedTrack.png";
import reeAuditIcon from "../../.../../../images/trackingImages/reAuditTrack.png";
import notAudited from "../../.../../../images/trackingImages/NotAuditedTrack.png";
import auditDeclined from "../../.../../../images/trackingImages/AuditDeclined.png";
import { Paginator } from "primereact/paginator";
import TableStyle from "../../../components/table/table.module.css";
import { useSelector } from "react-redux";
import Image from "next/image";
import { SVGICON } from "../../../jsx/constant/theme";
import {
  renderUserPrfoileAvatar,
  dateFormate,
} from "../../../components/headerFilters/functions";
import { selectedRow } from "../../../store/actions/ReportActions";
import { useDispatch } from "react-redux";
import dayjs from "dayjs";
import { getFlag, getFlags } from "../../../components/reuseableFunctions";
import { connect } from "react-redux";
import SpinnerDots from "../../../components/spinner";
import ContentGroupCard from "../../../mainStream/components/cards/contentGroupCard";
import SubCard from "../../../mainStream/components/cards/subcard";
import MiniCards from "../../../mainStream/components/miniCards";
import Flags from "../../../mainStream/components/flagCount";
import AllocationCount from "../../../mainStream/components/allocationCount";

const TeamReport = ({
  // setModal,
  // modal,
  patientDetails,
  paginationFirst,
  ReportPatientDetails,
  onPageChange,
  // comments,
  // setComments,
  selectedRows,
  setSelectedRows,
  selectAll,
  setSelectAll,
  // sortOrder,
  // setSortOrder,
  // setSort,
  reportListAll,
  page,
  getFlagsData,
  isAdmin
}) => {

  const dispatch = useDispatch();
  const navigate = useRouter();
  const handleHeaderCheckboxChange = () => {
    setSelectAll(!selectAll);
    const updatedRows = selectAll ? [] : reportListAll?.response?.response?.data;
    setSelectedRows(updatedRows);
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
      charts: reportListAll?.response?.processedStatusCount?.processedStatus
        ? reportListAll?.response?.processedStatusCount?.processedStatus.COMPLETED
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
      title: "Decline",
      charts: reportListAll?.response?.processedStatusCount?.processedStatus
        ? reportListAll?.response?.processedStatusCount?.processedStatus.DECLINED
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
    {
      id: 6,
      icon: notAudited,
      title: "Not Audited",
      charts: reportListAll?.response?.processedStatusCount?.auditedStatus
        ? reportListAll?.response?.processedStatusCount?.auditedStatus.NOT_AUDIT
        : "0",

      bg: "#FBE7D0",
    },
    {
      id: 7,
      icon: reeAuditIcon,
      title: "Re Audit",
      charts: reportListAll?.response?.processedStatusCount?.auditedStatus
        ? reportListAll?.response?.processedStatusCount?.auditedStatus.REAUDIT
        : "0",

      bg: "#FFDBB8",
    },
    {
      id: 8,
      icon: reAuditIcon,
      title: "Audit pending",
      charts: reportListAll?.response?.processedStatusCount?.auditedStatus
        ? reportListAll?.response?.processedStatusCount?.auditedStatus.PENDING
        : "0",

      bg: "#F3D8E5",
    },
    {
      id: 9,
      icon: auditHoldIcon,
      title: "Audit hold",
      charts: reportListAll?.response?.processedStatusCount?.auditedStatus
        ? reportListAll?.response?.processedStatusCount?.auditedStatus.AUDITHOLD
        : "0",

      bg: "#FFF2CC",
    },
    {
      id: 10,
      icon: auditDeclined,
      title: "Audit decline",
      charts: reportListAll?.response?.processedStatusCount?.auditedStatus
        ? reportListAll?.response?.processedStatusCount?.auditedStatus.DECLINED
        : "0",

      bg: "#FDD2CE",
    },
  ];
  const subCardData = [
    {
      title: "No of charts",
      value: reportListAll?.response?.totalElements,
    },
    {
      title: "Avg RAF score",
      value: reportListAll?.rafAverage?.toFixed(4),
    },
    {
      title: "HCC Count",
      value: reportListAll?.totalHccCount,
    },
  ];
  const auditstatusBodyTemplate = (rowData) => {
    const declinedDataFromAudit = extractLatestData(
      rowData?.auditDeclinedNotes
    );

    const declinedDataFromDeclined = extractLatestData(
      rowData?.auditDeclinedNotes
    );

    const declinedData = declinedDataFromAudit || declinedDataFromDeclined;
    switch (rowData.auditedStatus) {
      case "AUDIT_PENDING":
        return (
          <Popover placement="bottom" title="Status: AUDIT PENDING">
            <span className="patient-status">
              <Image src={AuditPending} className={styles.imgSize} />
            </span>
          </Popover>
        );

      case "AUDITHOLD":
        return (
          <Popover placement="bottom" title=" Status: AUDIT HOLD">
            <span className="patient-status">
              <Image src={AuditHold} className={styles.imgSize} />
            </span>
          </Popover>
        );
      case "REAUDIT":
        return (
          <Popover placement="bottom" title=" Status: REAUDIT">
            <span className="patient-status">
              <Image src={ReAudit} className={styles.imgSize} />
            </span>
          </Popover>
        );
      case "AUDITED":
        return (
          <Popover placement="bottom" title=" Status: AUDITED">
            <span className="patient-status">
              <Image src={AuditedTrack} className={styles.imgSize} />
            </span>
          </Popover>
        );
      case "AUDITED":
        return (
          <span className="patient-status">
            <Image src={AuditedTrack} className={styles.imgSize} />
          </span>
        );

      case "NOT_AUDIT":
        return (
          <Popover placement="bottom" title=" Status: NOT AUDIT">
            <span className="patient-status">
              <Image src={NotAudited} className={styles.imgSize} />
            </span>
          </Popover>
        );
      case "AUDIT_DECLINED":
        return (
          <Popover
            placement="bottom"
            title=" Status: AUDIT DECLINED"
            content={`Reason: ${declinedData ? declinedData : "---"}`}
          >
            <span className="patient-status">
              <Image src={AuditedDeclineTrack} className={styles.imgSize} />
            </span>
          </Popover>
        );
      case null:
        return <span className="patient-status">---</span>;
    }
  };
  const processstatusBodyTemplate = (rowData) => {
    const declinedDataFromAudit = extractLatestData(
      rowData?.auditDeclinedNotes
    );

    const declinedDataFromDeclined = extractLatestData(rowData?.declinedNotes);

    const declinedData = declinedDataFromAudit || declinedDataFromDeclined;
    if (!rowData?.processedStatus) {
      return null;
    }
    switch (rowData?.processedStatus) {
      case "COMPLETED":
        return (
          <Popover placement="bottom" title="Status: COMPLETED">
            <span className={`patient-status ${styles.textCenter}`}>
              <Image src={Completed} className={styles.imgSize} />
            </span>
          </Popover>
        );

      case "PENDING":
        return (
          <Popover placement="bottom" title="Status: PENDING">
            <span className={`patient-status ${styles.textCenter}`}>
              <Image src={Pending} className={styles.imgSize} />
            </span>
          </Popover>
        );

      case "DECLINED":
        return (
          <Popover
            placement="bottom"
            title="Status: DECLINED"
            content={`Reason: ${declinedData ? declinedData : "---"}`}
          >
            <span className={`patient-status ${styles.textCenter}`}>
              <Image src={Declined} className={styles.imgSize} />
            </span>
          </Popover>
        );

      case "NOTCOMPUTED":
        return (
          <Popover placement="bottom" title="Status: NOT COMPUTED">
            <span className={`patient-status ${styles.textCenter}`}>
              <Image src={Pending} className={styles.imgSize} />
            </span>
          </Popover>
        );
      case "COMPUTED":
        return (
          <Popover placement="bottom" title="Status: PENDING">
            <span className={`patient-status ${styles.textCenter}`}>
              <Image src={Pending} className={styles.imgSize} />
            </span>
          </Popover>
        );
      case "HOLD":
        return (
          <Popover placement="bottom" title="Status: HOLD">
            <span className={`patient-status ${styles.textCenter}`}>
              <Image src={Hold} className={styles.imgSize} />
            </span>
          </Popover>
        );
      case "ABORTED_BY_CRON":
        return (
          <Popover placement="bottom" title="Status: ABORTED BY CRON">
            <span className={`patient-status ${styles.textCenter}`}>
              <Image src={Abort} className={styles.imgSize} />
            </span>
          </Popover>
        );
      case null:
        return (
          <Popover placement="bottom" title="Status: PENDING">
            <span className={`patient-status ${styles.textCenter}`}>
              <Image src={Pending} className={styles.imgSize} />
            </span>
          </Popover>
        );
    }
  };

  const gotoPatientDetails = (data) => {
    dispatch(patientDetails(data));

    if (data?.processedStatus === "COMPLETED") {
      const controller = new AbortController();
      const currentRole=localStorage.getItem("userRole");
      controller.abort();
      localStorage.setItem("patientId", data.patientId);
      navigate.push({ pathname: `/${currentRole}/patients/details`, query: page });
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
          {!reportListAll?.response?.response?.data ? (
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
                {reportListAll?.response?.response?.data?.length > 0 && (
                  <>
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
                  </>
                )}
              </div>
              <div className="row">
                <div>
                  <div className=" col-xl-12 d-flex">
                    {reportListAll?.response?.response?.data?.length === 0 ? (
                      <div
                        className={`col-xl-6 ${styles.card}`}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Empty />
                      </div>
                    ) : (
                      <>
                        <div className="col-xl-6">
                          <div className={styles.cardContainer}>
                            {reportListAll?.response?.response?.data?.map((item, id) => (
                               <ContentGroupCard
                               content={reportListAll?.response?.data}
                               key={id}
                               item={item}
                               flag={item?.flag}
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
                             />
                            ))}
                          </div>
                        </div>
                      </>
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
                          <div className="col-xl-12  d-flex mt-2">
                            <Row className={styles.carddiv}>
                              {card1Data?.map((data) => (
                                <MiniCards
                                  backgroundColor={data.bg}
                                  icon={data?.icon}
                                  title={data.title}
                                  charts={data.charts}
                                  styles={styles}
                                />
                              ))}
                            </Row>
                          </div>
                          <div className="col-xl-12  d-flex mt-1">
                            <Flags
                              flagsData={getFlagsData?.response}
                              styles={styles}
                            />
                            {allocationCountData.map((item, index) => (
                              <AllocationCount
                                key={index}
                                title={item.title}
                                allocationCount={item.allocationCount}
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

      <div className="pagination-container">
        <Paginator
          first={paginationFirst}
          rows={8}
          totalRecords={ReportPatientDetails?.response?.response?.totalElements}
          onPageChange={onPageChange}
        />
        <div className="total-pages">
          Total count: {ReportPatientDetails?.response?.response?.totalElements}
        </div>
      </div>
    </>
  );
};

const enhancer = connect((state) => ({
  getFlagsData: state?.reviewer?.workQueue?.flags?.data,
}));
export default enhancer(TeamReport);
