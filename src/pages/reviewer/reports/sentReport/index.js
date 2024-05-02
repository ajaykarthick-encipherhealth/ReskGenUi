import React, { useState, useEffect } from "react";
import styles from "../report.module.css";
import { Paginator } from "primereact/paginator";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { Avatar, Col, Row, Tooltip, Empty } from "antd";
import Image from "next/image";
import { SVGICON } from "../../../../jsx/constant/theme";
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
import visitStyles from "../../../../styles/visitdata.module.css";
import { workStatusApiAdmin } from "../../../../services/adminServices/DashboardService";

import {
  dateFormate,
  getBackgroundColor,
  renderUserPrfoileAvatar,
  sortFunction,
} from "../../../../components/headerFilters/functions";
import EditButton from "../../../../images/adminUsers/EditButton";
import { IMAGES } from "src/jsx/constant/theme.js";
import SpinnerDots from "../../../../components/spinner";
import Export from "../../../admin/report/Export";
import TableStyle from "../../../../components/table/table.module.css";
import { selectedReport } from "../../../../store/actions/adminAction/ReportActions";
import { useSelector } from "react-redux";
import { getFlag } from "../receivedReport";

const SentReport = ({
  details,
  onSentPageChange,
  paginationFirst,
  receivedPageNo,
  receivedStartDate,
  receivedEndDate,
  isPhysician,
  isAdmin,
}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const DateRanges = useSelector((state) => state?.workFlow?.dateRange);
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
  const [selectedCardIndex, setSelectedCardIndex] = useState(0);
  const [selectedCard, setSelectedCard] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const hashes = selectedUsers.map((user) => {
    const hash = (user?.userDetails?.firstName.charCodeAt(0) % 6) + 1;
    return hash;
  });

  const mostCommonHash = getBackgroundColor(hashes);
  const backgroundColor = getBackgroundColor(mostCommonHash);
  const card1Data = [
    {
      id: 1,
      icon: Completed,
      title: "Completed",
      charts: dateRange.processedStatus
        ? dateRange.processedStatus.COMPLETED
        : "0",
      bg: "#CCFFD1",
    },
    {
      id: 2,
      icon: Pending,
      title: "Pending",
      charts: dateRange.processedStatus
        ? dateRange.processedStatus.PENDING
        : "0",

      bg: "#CCE9FF",
    },
    {
      id: 3,
      icon: Hold,
      title: "Hold",
      charts: dateRange.processedStatus ? dateRange.processedStatus.HOLD : "0",

      bg: "#DACEFD",
    },
    {
      id: 4,
      icon: declineIcon,
      title: "Decline",
      charts: dateRange.processedStatus
        ? dateRange.processedStatus.DECLINED
        : "0",
      bg: "#FAD1D1",
    },
    {
      id: 5,
      icon: auditedIcon,
      title: "Audited",
      charts: dateRange.auditedStatus ? dateRange.auditedStatus.AUDITED : "0",

      bg: "#DBEEF0",
    },
    {
      id: 6,
      icon: notAudited,
      title: "Not Audited",
      charts: dateRange.auditedStatus ? dateRange.auditedStatus.NOT_AUDIT : "0",

      bg: "#FBE7D0",
    },
    {
      id: 7,
      icon: reeAuditIcon,
      title: "Re Audit",
      charts: dateRange.auditedStatus ? dateRange.auditedStatus.REAUDIT : "0",

      bg: "#FFDBB8",
    },
    {
      id: 8,
      icon: reAuditIcon,
      title: "Audit pending",
      charts: dateRange.auditedStatus ? dateRange.auditedStatus.PENDING : "0",

      bg: "#F3D8E5",
    },
    {
      id: 9,
      icon: auditHoldIcon,
      title: "Audit hold",
      charts: dateRange.auditedStatus ? dateRange.auditedStatus.HOLD : "0",

      bg: "#FFF2CC",
    },
    {
      id: 10,
      icon: auditDeclined,
      title: "Audit decline",
      charts: dateRange.auditedStatus ? dateRange.auditedStatus.DECLINED : "0",

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
  const auditor = [
    {
      id: 1,
      firstName: "Benjamin",
      lastName: "Mitchell",
      profileImageUrl:
        "https://cogentaifiles.blob.core.windows.net/profileimages/c81a62d5-06c6-406a-9bb4-e8940e81aaac.png",
      count: "10",
    },
    {
      id: 2,
      firstName: "Benjamin",
      lastName: "Mitchell",
      profileImageUrl:
        "https://cogentaifiles.blob.core.windows.net/profileimages/c81a62d5-06c6-406a-9bb4-e8940e81aaac.png",
      count: "10",
    },
    {
      id: 3,
      firstName: "Benjamin",
      lastName: "Mitchell",
      profileImageUrl:
        "https://cogentaifiles.blob.core.windows.net/profileimages/c81a62d5-06c6-406a-9bb4-e8940e81aaac.png",
      count: "10",
    },
    {
      id: 4,
      firstName: "Benjamin",
      lastName: "Mitchell",
      profileImageUrl:
        "https://cogentaifiles.blob.core.windows.net/profileimages/c81a62d5-06c6-406a-9bb4-e8940e81aaac.png",
      count: "10",
    },
    {
      id: 5,
      firstName: "Benjamin",
      lastName: "Mitchell",
      profileImageUrl:
        "https://cogentaifiles.blob.core.windows.net/profileimages/c81a62d5-06c6-406a-9bb4-e8940e81aaac.png",
      count: "10",
    },
  ];
  const reviewer = [
    {
      id: 1,
      firstName: "Benjamin",
      lastName: "Mitchell",
      profileImageUrl:
        "https://cogentaifiles.blob.core.windows.net/profileimages/c81a62d5-06c6-406a-9bb4-e8940e81aaac.png",
      count: "10",
    },
    {
      id: 2,
      firstName: "Benjamin",
      lastName: "Mitchell",
      profileImageUrl:
        "https://cogentaifiles.blob.core.windows.net/profileimages/c81a62d5-06c6-406a-9bb4-e8940e81aaac.png",
      count: "10",
    },
    {
      id: 3,
      firstName: "Benjamin",
      lastName: "Mitchell",
      profileImageUrl:
        "https://cogentaifiles.blob.core.windows.net/profileimages/c81a62d5-06c6-406a-9bb4-e8940e81aaac.png",
      count: "10",
    },
    {
      id: 4,
      firstName: "Benjamin",
      lastName: "Mitchell",
      profileImageUrl:
        "https://cogentaifiles.blob.core.windows.net/profileimages/c81a62d5-06c6-406a-9bb4-e8940e81aaac.png",
      count: "10",
    },
    {
      id: 5,
      firstName: "Benjamin",
      lastName: "Mitchell",
      profileImageUrl:
        "https://cogentaifiles.blob.core.windows.net/profileimages/c81a62d5-06c6-406a-9bb4-e8940e81aaac.png",
      count: "10",
    },
  ];
  const getFlags = (data) => {
    if (!data || !data["2023"]) return null;
    switch (data["2023"][data["2023"]?.length - 1]?.flag) {
      case "PATIENT_NAME_MISSED":
        return (
          <Tooltip title="PATIENT_NAME_MISSED" placement="bottom">
            <i className={visitStyles.name_missed}>
              {SVGICON.emptyFlagSmallLarge}
            </i>
          </Tooltip>
        );
      case "PATIENT_DOB_MISSED":
        return (
          <Tooltip title="PATIENT_DOB_MISSED" placement="bottom">
            <i className={visitStyles.dob_missed}>
              {SVGICON.emptyFlagSmallLarge}
            </i>
          </Tooltip>
        );
      case "MRN_ID_MISMATCH":
        return (
          <Tooltip title="MRN_ID_MISMATCH" placement="bottom">
            <i className={visitStyles.id_missed}>
              {SVGICON.emptyFlagSmallLarge}
            </i>
          </Tooltip>
        );
      case "PROVIDER_SIGN_MISSED":
        return (
          <Tooltip title="PROVIDER_SIGN_MISSED" placement="bottom">
            <i className={visitStyles.sign_missed}>
              {SVGICON.emptyFlagSmallLarge}
            </i>
          </Tooltip>
        );
      case "PROVIDER_SIGNATURE_MISSED":
        return (
          <Tooltip title="PROVIDER_SIGNATURE_MISSED" placement="bottom">
            <i className={visitStyles.signature_missed}>
              {SVGICON.emptyFlagSmallLarge}
            </i>
          </Tooltip>
        );
      case "PROVIDER_CREDENTIAL_MISSED":
        return (
          <Tooltip title="PROVIDER_CREDENTIAL_MISSED" placement="bottom">
            <i className={visitStyles.cred_missed}>
              {SVGICON.emptyFlagSmallLarge}
            </i>
          </Tooltip>
        );

      case "PROVIDER_SIGN_STATUS_PENDING":
        return (
          <Tooltip title="PROVIDER_SIGN_STATUS_PENDING" placement="bottom">
            <i className={visitStyles.sign_status}>
              {SVGICON.emptyFlagSmallLarge}
            </i>
          </Tooltip>
        );

      case "NO_HCC_FOUND":
        return (
          <Tooltip title="NO_HCC_FOUND" placement="bottom">
            <i className={visitStyles.no_hcc_found}>
              {SVGICON.emptyFlagSmallLarge}
            </i>
          </Tooltip>
        );

      case "NO_VALID_DOCUMENT_FOUND":
        return (
          <Tooltip title="NO_VALID_DOCUMENT_FOUND" placement="bottom">
            <i className={visitStyles.no_doc_found}>
              {SVGICON.emptyFlagSmallLarge}
            </i>
          </Tooltip>
        );

      case "PATIENT_DISEASED":
        return (
          <Tooltip title="PATIENT_DISEASED" placement="bottom">
            <i className={visitStyles.patient_diseased}>
              {SVGICON.emptyFlagSmallLarge}
            </i>
          </Tooltip>
        );

      case "PATIENT_INACTIVE":
        return (
          <Tooltip title="PATIENT_INACTIVE" placement="bottom">
            <i className={visitStyles.patient_inactive}>
              {SVGICON.emptyFlagSmallLarge}
            </i>
          </Tooltip>
        );
      case "":
        return (
          <Tooltip title="" placement="bottom">
            <i className={visitStyles.patient_inactive}>{SVGICON.emptyFlag}</i>
          </Tooltip>
        );
    }
  };

  const startDate = DateRanges?.startDate
    ? new Date(DateRanges?.startDate).toISOString()
    : "";
  const endDate = DateRanges?.endDate
    ? new Date(DateRanges?.endDate).toISOString()
    : "";
  const getWorkFlow = async () => {
    try {
      const data = await workStatusApiAdmin(startDate, endDate, router);
      setDateRange(data.response?.processedStatusCount);
      setChartValue(data.response);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getWorkFlow();
  }, [startDate, endDate, router]);
  useEffect(() => {
    // Automatically select the first card and display its content on mount
    if (details?.data && details.data.length > 0) {
      handleCardSelection(details.data[0], 0);
    }
  }, [details]);

  const handleCardSelection = (item, index) => {
    setSelectedCardIndex(index);
    setSelectedCard(item);
  };

  const closeModal = () => {
    setOpenEdit(false);
  };
  const handleReceiverReport = (item) => {
    const info = {
      reportUser: item,
      receivedPageNo: receivedPageNo,
      receivedStartDate: receivedStartDate,
      receivedEndDate: receivedEndDate,
    };
    dispatch(selectedReport(info));
    isPhysician
      ? router?.push(
          `/reviewer/report/individualreport?reportId=${
            item?._id
          }&sentreport=${true}&page=${receivedPageNo}&limit=${paginationFirst}`
        )
      : router?.push(
          `/admin/report/individualreport?reportId=${
            item?._id
          }&sentreport=${true}&isAdmin=${isAdmin}&page=${receivedPageNo}&limit=${paginationFirst}`
        );
  };

  return (
    <>
      <div>
        <div className="content-body">
          <div className="container-fluid">
            <div className="row">
              <div>
                <div className=" col-xl-12 d-flex">
                  <div className="col-xl-6">
                    {!details?.data ? (
                      <SpinnerDots />
                    ) : (
                      <div className={styles.cardContainer}>
                        {details?.data?.map((item, index) => {
                          const formattedDate = dateFormate(
                            dayjs,
                            item?.sendDate
                          );
                          return (
                            <div
                              key={index}
                              className={`${styles.card} ${
                                index === selectedCardIndex
                                  ? styles.selectedCard
                                  : ""
                              }`}
                              onClick={() => handleCardSelection(item, index)}
                            >
                              <div className={styles.contentGroup}>
                                <div className="col-xl-12">
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      alignItems: "center",
                                      paddingBottom: "5px",
                                    }}
                                  >
                                    <div className={`col-xl-6 ${styles.pName}`}>
                                      {item.reportName}
                                    </div>
                                    <div
                                      className={`col-xl-2 ${styles.dataContainer}`}
                                    >
                                      <div
                                        onClick={() => {
                                          setSelectedRows(item);
                                          setOpenEdit(true);
                                        }}
                                      >
                                        <EditButton />
                                      </div>
                                    </div>
                                  </div>

                                  <div
                                    style={{
                                      paddingBottom: "5px",
                                    }}
                                  >
                                    <div
                                      className={`col-xl-12 ${styles.headText}`}
                                    >
                                      {item._id}
                                    </div>
                                  </div>
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      alignItems: "center",
                                    }}
                                  >
                                    <div className={`col-xl-2 ${styles.text}`}>
                                      {formattedDate}
                                    </div>
                                    <div className={`col-xl-4 ${styles.text}`}>
                                      <Avatar.Group maxCount={2}>
                                        {item?.receivedUsers?.map(
                                          (data, index) =>
                                            selectedCard?.receivedUsers
                                              .length === 1 ? (
                                              <div
                                                key={index}
                                                style={{
                                                  display: "flex",
                                                  alignItems: "center",
                                                }}
                                              >
                                                <span
                                                  style={{ marginRight: "5px" }}
                                                >
                                                  {renderUserPrfoileAvatar(
                                                    data?.userDetails
                                                      ?.firstName,
                                                    data?.userDetails?.lastName,
                                                    data?.userDetails
                                                      ?.profileImageUrl,
                                                    "header"
                                                  )}
                                                </span>
                                                <span>
                                                  {data?.userDetails?.firstName}{" "}
                                                  {data?.userDetails?.lastName}
                                                </span>
                                              </div>
                                            ) : (
                                              <div key={index}>
                                                {data?.userDetails
                                                  ?.profileImageUrl && (
                                                  <Avatar
                                                    style={{
                                                      objectFit: "unset",
                                                    }}
                                                    src={
                                                      data.userDetails
                                                        .profileImageUrl
                                                    }
                                                  />
                                                )}
                                              </div>
                                            )
                                        )}
                                      </Avatar.Group>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  {/* <div className="col-xl-8" style={{ marginLeft: "10px" }}>
                    <div className={styles.cardContainer}>
                      <div className={styles.card1}>
                        <div className="header-logo ">
                          <Image src={IMAGES.headerLogo} />
                        </div>
                        <div className="col-xl-12 d-flex mt-4">
                          <div className={`col-xl-6 ${styles.details}`}>
                            <div
                              className={styles.pName}
                              style={{ padding: "5px" }}
                            >
                              {selectedCard && selectedCard.reportName}
                            </div>
                            <div
                              className={styles.headText}
                              style={{ padding: "5px" }}
                            >
                              {selectedCard && selectedCard._id}
                            </div>
                          </div>
                          <div className={`col-xl-3 ${styles.details}`}>
                            <div
                              className={styles.pName}
                              style={{ padding: "5px" }}
                            >
                              DATE
                            </div>
                            <div
                              className={styles.headText}
                              style={{ padding: "5px" }}
                            >
                              {selectedCard &&
                                dateFormate(dayjs, selectedCard.sendDate)}
                            </div>
                          </div>
                          <div className={`col-xl-3 ${styles.details}`}>
                            <div
                              className={styles.pName}
                              style={{ padding: "5px" }}
                            >
                              NO OF USERS
                            </div>
                            <div
                              className={styles.headText}
                              style={{ padding: "5px" }}
                            >
                              {selectedCard &&
                                selectedCard.receivedUsers.length}
                            </div>
                          </div>
                        </div>
                        <div>
                          <div
                            className={styles.pName}
                            style={{ padding: "10px" }}
                          >
                            User List
                          </div>
                          {selectedCard && (
                            <>
                              {selectedCard.receivedUsers.map((item, index) => (
                                <div
                                  key={index}
                                  style={{ padding: "10px", display: "flex" }}
                                >
                                  <span style={{ marginRight: "5px" }}>
                                    {renderUserPrfoileAvatar(
                                      item?.userDetails?.firstName,
                                      item?.userDetails?.lastName,
                                      item?.userDetails?.profileImageUrl,
                                      "header"
                                    )}
                                  </span>
                                  <span>
                                    {item?.userDetails?.firstName}{" "}
                                    {item?.userDetails?.lastName}
                                  </span>
                                </div>
                              ))}
                            </>
                          )}
                        </div>
                        <div className="d-flex mt-20">
                          <div className="p-1">
                            By clicking on the sheet, users can view the
                            detailed report that was sent to them
                          </div>
                          <div
                            className="p-1"
                            // onClick={() => handleReceiverReport(item)}
                          >
                            {SVGICON?.Sheet}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div> */}
                  <div className="col-xl-6" style={{ marginLeft: "10px" }}>
                    <div className={styles.cardContainer}>
                      <div className={styles.card1}>
                        <div className={styles.summaryText}>Summary</div>
                        <div className="col-xl-12  d-flex mt-4">
                          <div className={`col-xl-2 ${styles.subCard}`}>
                            <div>
                              <div>No of charts</div>
                              <h4>60</h4>
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
                              <h4>1.025</h4>
                            </div>
                          </div>
                          <div className={`col-xl-2 ${styles.subCard}`}>
                            {" "}
                            <div>
                              <div>HCC Count</div>
                              <h4>175</h4>
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
                              Auditor
                              {auditor.map((item) => (
                                <div
                                  className={styles.contentAuditor}
                                  key={item.id}
                                >
                                  <div className={`col-xl-4 ${styles.avatar}`}>
                                    <span style={{ marginRight: "10px" }}>
                                      {renderUserPrfoileAvatar(
                                        item.firstName,
                                        item.lastName,
                                        item.profileImageUrl,
                                        "header"
                                      )}
                                    </span>
                                    <span>
                                      {item.firstName} {item.lastName}
                                    </span>
                                  </div>

                                  <div className={styles.count}>
                                    {item.count}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className={`col-xl-4 ${styles.flags}`}>
                            <div className={styles.cardHead}>
                              Reviewer
                              {reviewer.map((item) => (
                                <div
                                  className={styles.contentAuditor}
                                  key={item.id}
                                >
                                  <div className={`col-xl-4 ${styles.avatar}`}>
                                    <span style={{ marginRight: "10px" }}>
                                      {renderUserPrfoileAvatar(
                                        item.firstName,
                                        item.lastName,
                                        item.profileImageUrl,
                                        "header"
                                      )}
                                    </span>
                                    <span>
                                      {item.firstName} {item.lastName}
                                    </span>
                                  </div>

                                  <div className={styles.count}>
                                    {item.count}
                                  </div>
                                </div>
                              ))}
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
          rows={15}
          totalRecords={details?.totalElements}
          onPageChange={onSentPageChange}
        />
        <div className="total-pages">
          Total count: {details?.totalElements > 0 ? details?.totalElements : 0}
        </div>
      </div>
      {openEdit && (
        <Export
          isModalVisible={openEdit}
          closeModal={closeModal}
          setIsModalVisible={setOpenEdit}
          setSelectedRows={setSelectedRows}
          setSelectAll={setSelectAll}
          selectedRows={selectedRows}
          isSent={true}
        />
      )}
    </>
  );
};

export default SentReport;
