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
import { extractLatestData } from "../../../supervisor/auditing";
import AuditedTrack from "../../../../../src/images/trackingImages/AuditedTrack.png";
import NotAudited from "../../../../../src/images/trackingImages/NotAuditedTrack.png";
import AuditHold from "../../../../../src/images/trackingImages/AuditHoldTrack.png";
import ReAudit from "../../../../../src/images/trackingImages/reAuditTrack.png";
import AuditPending from "../../../../../src/images/trackingImages/AuditPending.png";
import Hold from "../../../../../src/images/trackingImages/HoldTrack.png";
import Pending from "../../../../../src/images/trackingImages/PendingTrack.png";
import Completed from "../../../../../src/images/trackingImages/CompletedTrack.png";
import Declined from "../../../../../src/images/trackingImages/DeclineTrack.png";
import AuditedDeclineTrack from "../../../../../src/images/trackingImages/AuditDeclined.png";
import Abort from "../../../../../src/images/trackingImages/Abort.png";
import declineIcon from "../../.../../../../images/trackingImages/DeclineTrack.png";
import reAuditIcon from "../../.../../../../images/trackingImages/AuditPending.png";
import auditHoldIcon from "../../.../../../../images/trackingImages/AuditHoldTrack.png";
import auditedIcon from "../../.../../../../images/trackingImages/AuditedTrack.png";
import reeAuditIcon from "../../.../../../../images/trackingImages/reAuditTrack.png";
import notAudited from "../../.../../../../images/trackingImages/NotAuditedTrack.png";
import auditDeclined from "../../.../../../../images/trackingImages/AuditDeclined.png";
import { Paginator } from "primereact/paginator";
import TableStyle from "../../../../components/table/table.module.css";
import { useSelector } from "react-redux";
import Image from "next/image";
import { SVGICON } from "../../../../jsx/constant/theme";
import {
  renderUserPrfoileAvatar,
  dateFormate,
} from "../../../../components/headerFilters/functions";
import { selectedRow } from "../../../../store/actions/ReportActions";
import { useDispatch } from "react-redux";
import dayjs from "dayjs";
import { workStatusApiAdmin } from "../../../../services/adminServices/DashboardService";
import { getFlag, getFlags } from "../../../../components/reuseableFunctions";
import { connect } from "react-redux";

const ReviewerReport = ({
  setModal,
  modal,
  patientDetails,
  paginationFirst,
  ReportPatientDetails,
  onPageChange,
  comments,
  setComments,
  selectedRows,
  setSelectedRows,
  selectAll,
  setSelectAll,
  sortOrder,
  setSortOrder,
  setSort,
  reportListAll,
  page,
  getFlagsData,
}) => {
  const [activeTab, setActiveTab] = useState("Reviewer");
  const [selectedItems, setSelectedItems] = useState([]);
  const router = useRouter();
  const dispatch = useDispatch();
  const navigate = useRouter();

  const worlFlowData = useSelector(
    (state) => state?.AdminDashboardReducers?.data
  );
  console.log(getFlagsData, "getFLag");
  const [dateRange, setDateRange] = useState({
    processedStatus: {
      PENDING: 0,
      COMPLETED: 0,
      HOLD: 0,
      DECLINED: 0,
    },
    auditedStatus: {
      AUDIT_PENDING: 0,
      DECLINED: 0,
      AUDITED: 0,
      AUDITHOLD: 0,
    },
  });
  const [chartValue, setChartValue] = useState({
    totalAuditedAssigned: 0,
    totalPatients: 0,
    totalPatientsAllocated: 0,
  });

  const handleHeaderCheckboxChange = () => {
    setSelectAll(!selectAll);
    const updatedRows = selectAll ? [] : reportListAll?.response?.data;
    setSelectedRows(updatedRows);
  };

  const handleRowCheckboxChange = (row) => {
    const isSelected = selectedRows?.some(
      (selectedRow) => selectedRow.patientId === row?.patientId
    );
    let updatedRows;
    console.log(selectedRows, "rw");
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
      title: "Decline",
      charts: reportListAll?.processedStatusCount?.processedStatus
        ? reportListAll?.processedStatusCount?.processedStatus.DECLINED
        : "0",
      bg: "#FAD1D1",
    },
    {
      id: 5,
      icon: auditedIcon,
      title: "Audited",
      charts: reportListAll?.processedStatusCount?.auditedStatus
        ? reportListAll?.processedStatusCount?.auditedStatus.AUDITED
        : "0",

      bg: "#DBEEF0",
    },
    {
      id: 6,
      icon: notAudited,
      title: "Not Audited",
      charts: reportListAll?.processedStatusCount?.auditedStatus
        ? reportListAll?.processedStatusCount?.auditedStatus.NOT_AUDIT
        : "0",

      bg: "#FBE7D0",
    },
    {
      id: 7,
      icon: reeAuditIcon,
      title: "Re Audit",
      charts: reportListAll?.processedStatusCount?.auditedStatus
        ? reportListAll?.processedStatusCount?.auditedStatus.REAUDIT
        : "0",

      bg: "#FFDBB8",
    },
    {
      id: 8,
      icon: reAuditIcon,
      title: "Audit pending",
      charts: reportListAll?.processedStatusCount?.auditedStatus
        ? reportListAll?.processedStatusCount?.auditedStatus.PENDING
        : "0",

      bg: "#F3D8E5",
    },
    {
      id: 9,
      icon: auditHoldIcon,
      title: "Audit hold",
      charts: reportListAll?.processedStatusCount?.auditedStatus
        ? reportListAll?.processedStatusCount?.auditedStatus.AUDITHOLD
        : "0",

      bg: "#FFF2CC",
    },
    {
      id: 10,
      icon: auditDeclined,
      title: "Audit decline",
      charts: reportListAll?.processedStatusCount?.auditedStatus
        ? reportListAll?.processedStatusCount?.auditedStatus.DECLINED
        : "0",

      bg: "#FDD2CE",
    },
  ];

  const flagData = [
    {
      id: 1,
      flags: "PATIENT_NAME_MISSED",
      count: "10",
    },
    {
      id: 2,
      flags: "PATIENT_DOB_MISSED",
      count: "10",
    },
    {
      id: 3,
      flags: "MRN_ID_MISMATCH",
      count: "10",
    },
    {
      id: 4,
      flags: "PROVIDER_SIGN_MISSED",
      count: "10",
    },
    {
      id: 5,
      flags: "PROVIDER_SIGNATURE_MISSED",
      count: "10",
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
              <Image
                src={AuditPending}
                style={{ height: "24px", width: "24px" }}
              />
            </span>
          </Popover>
        );

      case "AUDITHOLD":
        return (
          <Popover placement="bottom" title=" Status: AUDIT HOLD">
            <span className="patient-status">
              <Image
                src={AuditHold}
                // className={styles.ImgTrck}
                style={{ height: "24px", width: "24px" }}
              />
            </span>
          </Popover>
        );
      case "REAUDIT":
        return (
          <Popover placement="bottom" title=" Status: REAUDIT">
            <span className="patient-status">
              <Image src={ReAudit} style={{ height: "24px", width: "24px" }} />
            </span>
          </Popover>
        );
      case "AUDITED":
        return (
          <Popover placement="bottom" title=" Status: AUDITED">
            <span className="patient-status">
              <Image
                src={AuditedTrack}
                style={{ height: "24px", width: "24px" }}
              />
            </span>
          </Popover>
        );
      case "AUDITED":
        return (
          <span className="patient-status">
            <Image
              src={AuditedTrack}
              style={{ height: "24px", width: "24px" }}
            />
          </span>
        );

      case "NOT_AUDIT":
        return (
          <Popover placement="bottom" title=" Status: NOT AUDIT">
            <span className="patient-status">
              <Image
                src={NotAudited}
                style={{ height: "24px", width: "24px" }}
              />
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
              <Image
                src={AuditedDeclineTrack}
                style={{ height: "24px", width: "24px" }}
              />
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
            <span className="patient-status" style={{ textAlign: "center" }}>
              <Image
                src={Completed}
                style={{ height: "24px", width: "24px" }}
              />
            </span>
          </Popover>
        );

      case "PENDING":
        return (
          <Popover placement="bottom" title="Status: PENDING">
            <span className="patient-status" style={{ textAlign: "center" }}>
              <Image src={Pending} style={{ height: "24px", width: "24px" }} />
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
            <span className="patient-status" style={{ textAlign: "center" }}>
              <Image src={Declined} style={{ height: "24px", width: "24px" }} />
            </span>
          </Popover>
        );

      case "NOTCOMPUTED":
        return (
          <Popover placement="bottom" title="Status: NOT COMPUTED">
            <span className="patient-status" style={{ textAlign: "center" }}>
              <Image src={Pending} style={{ height: "24px", width: "24px" }} />
            </span>
          </Popover>
        );
      case "COMPUTED":
        return (
          <Popover placement="bottom" title="Status: PENDING">
            <span className="patient-status" style={{ textAlign: "center" }}>
              <Image src={Pending} style={{ height: "24px", width: "24px" }} />
            </span>
          </Popover>
        );
      case "HOLD":
        return (
          <Popover placement="bottom" title="Status: HOLD">
            <span className="patient-status" style={{ textAlign: "center" }}>
              <Image src={Hold} style={{ height: "24px", width: "24px" }} />
            </span>
          </Popover>
        );
      case "ABORTED_BY_CRON":
        return (
          <Popover placement="bottom" title="Status: ABORTED BY CRON">
            <span className="patient-status" style={{ textAlign: "center" }}>
              <Image src={Abort} style={{ height: "24px", width: "24px" }} />
            </span>
          </Popover>
        );
      case null:
        return (
          <Popover placement="bottom" title="Status: PENDING">
            <span className="patient-status" style={{ textAlign: "center" }}>
              <Image src={Pending} style={{ height: "24px", width: "24px" }} />
            </span>
          </Popover>
        );
    }
  };

  const gotoPatientDetails = (data) => {
    console.log(data, "data");
    dispatch(patientDetails(data));

    if (data?.processedStatus === "COMPLETED") {
      // console.log(data?.reportListAll?.response?.data?.processedStatus, "t");

      const controller = new AbortController();
      const { signal } = controller;
      controller.abort();
      localStorage.setItem("patientId", data.patientId);
      navigate.push({ pathname: "/reviewer/patients/details", query: page });
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

  useEffect(() => {
    dispatch(selectedRow(selectedRows));
  }, [selectedRows]);
  console.log(reportListAll, "te");

  console.log(reportListAll?.response?.data, "test");

  return (
    <>
      <div>
        <div className="content-body">
          <div className="container-fluid">
            <div
              style={{
                display: "flex",
                marginLeft: "10px",
                paddingBottom: "10px",
              }}
            >
              {" "}
              {reportListAll?.response?.data?.length > 0 && (
                <>
                  <div>
                    <input
                      type="checkbox"
                      onChange={handleHeaderCheckboxChange}
                      className={selectAll ? TableStyle.customChecked : ""}
                      style={{
                        width: "22px",
                        height: "22px",
                        flexShrink: "0",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                      checked={selectAll}
                    />
                  </div>
                  <span
                    className={styles.pName}
                    style={{ paddingLeft: "20px", textAlign: "center" }}
                  >
                    All
                  </span>
                </>
              )}
            </div>
            <div className="row">
              <div>
                <div className=" col-xl-12 d-flex">
                  {reportListAll?.response?.data?.length === 0 ? (
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
                          {reportListAll?.response?.data?.map((item, id) => (
                            <div key={id} className={styles.card}>
                              <div
                                className={styles.contentGroup}
                                // onClick={handleCardRowClick}
                                style={{ cursor: "pointer" }}
                              >
                                <div className={styles.inputContainer}>
                                  <input
                                    type="checkbox"
                                    onChange={() => {
                                      handleRowCheckboxChange(item);
                                    }}
                                    className={TableStyle.customChecked}
                                    checked={selectedRows?.some(
                                      (selectedRow) =>
                                        selectedRow.patientId === item.patientId
                                    )}
                                  />
                                </div>
                                <div
                                  className="col-xl-12"
                                  style={{ marginLeft: "10px" }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      alignItems: "center",
                                      paddingBottom: "5px",
                                    }}
                                  >
                                    <div className={`col-xl-6 ${styles.pName}`}>
                                      {item.patientName
                                        ? item.patientName
                                        : "---"}
                                    </div>
                                    <div
                                      className={`col-xl-6 ${styles.dataContainer}`}
                                    >
                                      <span className={styles.raf}>
                                        <Tooltip
                                          title={"Raf Score"}
                                          placement="bottom"
                                        >
                                          {" "}
                                          {item.rafSum ? item.rafSum : "---"}
                                        </Tooltip>
                                      </span>
                                      <span style={{ marginRight: "10px" }}>
                                        {item?.flag ? (
                                          getFlags(item.flag)
                                        ) : (
                                          <div>{SVGICON?.emptyFlag}</div>
                                        )}
                                      </span>
                                      <span style={{ marginRight: "10px" }}>
                                        {auditstatusBodyTemplate(item)}
                                      </span>
                                      <span>
                                        {processstatusBodyTemplate(item)}
                                      </span>
                                    </div>
                                  </div>

                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "space-around",
                                      alignItems: "center",
                                      paddingBottom: "5px",
                                    }}
                                  >
                                    <div
                                      className={`col-xl-2 ${styles.headText}`}
                                      onClick={() => handleTableRowClick(id)}
                                    >
                                      {item.patientId ? item.patientId : ""}
                                    </div>
                                    <div
                                      className={`col-xl-2 ${styles.headText}`}
                                    >
                                      HCC
                                    </div>
                                    <div
                                      className={`col-xl-4 ${styles.headText}`}
                                    >
                                      SUPERVISOR
                                    </div>
                                    <div
                                      className={`col-xl-4 ${styles.headText}`}
                                    >
                                      REVIEWER
                                    </div>
                                  </div>
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "space-around",
                                      alignItems: "center",
                                    }}
                                  >
                                    <div className={`col-xl-2 ${styles.text}`}>
                                      {dateFormate(dayjs, item?.processedDate)}
                                    </div>
                                    <div className={`col-xl-2 ${styles.text}`}>
                                      {item.validDiseaseCount
                                        ? item.validDiseaseCount
                                        : "---"}
                                    </div>
                                    <div className={`col-xl-4 ${styles.text}`}>
                                      {item.auditedByFirstName ||
                                      item.auditedByLastName ||
                                      item.auditedByProfileImage ? (
                                        <div
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                          }}
                                        >
                                          <span style={{ marginRight: "10px" }}>
                                            {renderUserPrfoileAvatar(
                                              item.auditedByFirstName,
                                              item.auditedByLastName,
                                              item.auditedByProfileImage,
                                              "header"
                                            )}
                                          </span>
                                          <span>
                                            {item.auditedByFirstName}{" "}
                                            {item.auditedByLastName}
                                          </span>
                                        </div>
                                      ) : (
                                        <div>---</div>
                                      )}
                                    </div>
                                    <div className={`col-xl-4 ${styles.text}`}>
                                      {item.patientAllocatedFirstName ||
                                      item.patientAllocatedLastName ||
                                      item.patientAllocatedProfileImage ? (
                                        <div
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                          }}
                                        >
                                          <span style={{ marginRight: "10px" }}>
                                            {renderUserPrfoileAvatar(
                                              item.patientAllocatedFirstName,
                                              item.patientAllocatedLastName,
                                              item.patientAllocatedProfileImage,
                                              "header"
                                            )}
                                          </span>
                                          <span>
                                            {item.patientAllocatedFirstName}{" "}
                                            {item.patientAllocatedLastName}
                                          </span>
                                        </div>
                                      ) : (
                                        <div>---</div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                  {console.log(
                    reportListAll?.supervisorAllocationCount,
                    "supervisor"
                  )}
                  <div className="col-xl-6" style={{ marginLeft: "10px" }}>
                    <div className={styles.cardContainer}>
                      <div className={styles.card1}>
                        <div className={styles.summaryText}>Summary</div>
                        <div className="col-xl-12  d-flex mt-4">
                          <div className={`col-xl-2 ${styles.subCard}`}>
                            <div>
                              <div>No of charts</div>
                              <h4>{reportListAll?.response?.totalElements}</h4>
                            </div>
                          </div>
                          <div className={`col-xl-2 ${styles.subCard}`}>
                            <div>Completed date</div>
                            <div className={styles.dateContainer}>
                              <div style={{ fontSize: "10px", padding: "5px" }}>
                                03/04/2024 - 03/04/2024
                              </div>
                            </div>
                          </div>

                          <div className={`col-xl-2 ${styles.subCard}`}>
                            {" "}
                            <div>
                              <div>Avg RAF score</div>
                              <h4>{reportListAll?.rafAverage?.toFixed(4)}</h4>
                            </div>
                          </div>
                          <div className={`col-xl-2 ${styles.subCard}`}>
                            {" "}
                            <div>
                              <div>HCC Count</div>
                              <h4>{reportListAll?.totalHccCount}</h4>
                            </div>
                          </div>
                        </div>
                        <div className={` pt-2 ${styles.summaryText}`}>
                          Status
                        </div>
                        <div className="col-xl-12  d-flex mt-2">
                          <Row
                            className={styles.carddiv}
                            style={{ height: "80%" }}
                          >
                            {card1Data?.map((data) => (
                              <Col
                                span={5}
                                style={{
                                  backgroundColor: data.bg,
                                  borderRadius: "10px",
                                  height: "100px",
                                  width: "191px",
                                  padding: "10px",
                                  marginRight: "25px",
                                  marginBottom: "10px",
                                }}
                                className={styles.colData}
                              >
                                <div className={styles.header}>
                                  <Image
                                    src={data?.icon}
                                    className={styles.Img}
                                    style={{ height: "25px", width: "25px" }}
                                  />
                                  <div className={styles.heading}>
                                    {data.title}
                                  </div>
                                </div>

                                <h4>{data?.charts ? data?.charts : "0"}</h4>
                              </Col>
                            ))}
                          </Row>
                        </div>
                        <div className="col-xl-12  d-flex mt-4">
                          <div className={`col-xl-4 ${styles.flags}`}>
                            <div className={styles.cardHead}>Flags</div>
                            {flagData.map((flagItem) => (
                              <div
                                className={styles.contentGroups}
                                key={flagItem.id}
                              >
                                <div className={styles.count}>
                                  {flagItem.count}
                                </div>
                                <div>{getFlag(flagItem)}</div>
                              </div>
                            ))}
                          </div>
                          <div className={`col-xl-4 ${styles.flags}`}>
                            <div className={styles.cardHead}>
                              Supervisor
                              {reportListAll?.supervisorAllocationCount?.map(
                                (item) => (
                                  <div
                                    className={styles.contentAuditor}
                                    key={item.id}
                                  >
                                    <div className={styles.avatar}>
                                      {item.userNameDTO?.firstName ||
                                      item?.userNameDTO?.lastName ||
                                      item?.userNameDTO?.profileImageUrl ? (
                                        <>
                                          <span style={{ marginRight: "10px" }}>
                                            {renderUserPrfoileAvatar(
                                              item.userNameDTO?.firstName,
                                              item?.userNameDTO?.lastName,
                                              item?.userNameDTO
                                                ?.profileImageUrl,
                                              "header"
                                            )}
                                          </span>
                                          <span style={{ fontSize: "12px" }}>
                                            {item.userNameDTO?.firstName}{" "}
                                            {item?.userNameDTO?.lastName}
                                          </span>
                                        </>
                                      ) : (
                                        <div
                                          style={{
                                            textAlign: "center",
                                            height: "30px",
                                            width: "148px",
                                          }}
                                        >
                                          ---
                                        </div>
                                      )}
                                    </div>

                                    <div className={styles.count}>
                                      {item.count}
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                          <div className={`col-xl-4 ${styles.flags}`}>
                            <div className={styles.cardHead}>
                              Reviewer
                              {reportListAll?.reviewerAllocationCount?.map(
                                (item) => (
                                  <div
                                    className={styles.contentAuditor}
                                    key={item.id}
                                  >
                                    <div className={styles.avatar}>
                                      <span style={{ marginRight: "10px" }}>
                                        {renderUserPrfoileAvatar(
                                          item.userNameDTO?.firstName,
                                          item?.userNameDTO?.lastName,
                                          item?.userNameDTO?.profileImageUrl,
                                          "header"
                                        )}
                                      </span>
                                      <span style={{ fontSize: "12px" }}>
                                        {item.userNameDTO?.firstName}{" "}
                                        {item?.userNameDTO?.lastName}
                                      </span>
                                    </div>

                                    <div className={styles.count}>
                                      {item.count}
                                    </div>
                                  </div>
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
            </div>
          </div>
        </div>
      </div>
      <div className="pagination-container">
        <Paginator
          first={paginationFirst}
          rows={8}
          totalRecords={ReportPatientDetails?.response?.totalElements}
          onPageChange={onPageChange}
        />
        <div className="total-pages">
          Total count: {ReportPatientDetails?.response?.totalElements}
        </div>
      </div>
    </>
  );
};

const enhancer = connect(
  (state) => ({
    getFlagsData: state?.reviewer?.workQueue?.flags?.data,
  })
  // {
  //   workFgetFlagsowData: workflowActions.flagsAction,
  // }
);
export default enhancer(ReviewerReport);
