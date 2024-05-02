import React, { useState, useEffect } from "react";
import styles from "../report.module.css";
import Image from "next/image";
import { SVGICON } from "../../../../jsx/constant/theme";
import { IMAGES } from "src/jsx/constant/theme.js";
import { Paginator } from "primereact/paginator";
import { Popover, Col, Row, Tooltip, Empty } from "antd";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
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
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import visitStyles from "../../../../styles/visitdata.module.css";
import { workStatusApiAdmin } from "../../../../services/adminServices/DashboardService";

import {
  dateFormate,
  getBackgroundColor,
  renderUserPrfoileAvatar,
  sortFunction,
} from "../../../../components/headerFilters/functions";
import { getFlag } from "../../../../components/reuseableFunctions";

const ReceivedReport = ({
  details,
  onPageChange,
  receivedPageNo,
  receivedStartDate,
  receivedEndDate,
  paginationFirst,
  sortOrder,
  setSortOrder,
  setSort,
  isPhysician,
}) => {
  const [activeTab, setActiveTab] = useState("Reviewer");
  const [selectedItems, setSelectedItems] = useState([]);
  const [detailsContent, setDetailsContent] = useState(details?.content);
  const dispatch = useDispatch();
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
  useEffect(() => {
    setDetailsContent(details?.content);
  }, [details]);

  const router = useRouter();
  const handleReceiverReport = (row) => {
    const info = {
      reportUser: row,
      receivedPageNo: receivedPageNo,
      receivedStartDate: receivedStartDate,
      receivedEndDate: receivedEndDate,
    };
    dispatch(selectedReport(info));
    if (isPhysician) {
      router?.push(
        `/reviewer/report/individualreport?reportId=${info?.reportUser?.reportId}&page=${receivedPageNo}&limit=${paginationFirst}`
      );
    } else {
      router?.push(
        `/reviewer/report/individualreport?reportId=${
          info?.reportUser?.reportId
        }&isAdminPage=${true}&page=${receivedPageNo}&limit=${paginationFirst}`
      );
    }
  };
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

  const accessTemplate = (item) => {
    switch (item?.role) {
      case "READ":
        return <span className={styles.readStyle}>Read</span>;

      case "DOWNLOAD":
        return <span className={styles.downloadStyle}>Download</span>;

      default:
        return null;
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleCheckboxChange = (id) => {
    const index = selectedItems.indexOf(id);
    if (index === -1) {
      setSelectedItems([...selectedItems, id]);
    } else {
      const updatedSelectedItems = [...selectedItems];
      updatedSelectedItems.splice(index, 1);
      setSelectedItems(updatedSelectedItems);
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

  return (
    <>
      <div>
        <div className="content-body">
          <div className="container-fluid">
            <div className="row">
              <div>
                <div className=" col-xl-12 d-flex">
       
                  <div className="col-xl-6">
                    <div className={styles.cardContainer}>
                      <div className={styles.cardContainer}>
                        {detailsContent?.map((item, index) => {
                          const formattedDate = dateFormate(
                            dayjs,
                            item?.receiveDate
                          );
                          return (
                            <div key={index} className={styles.card}>
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

                                    <div className={`col-xl-2 `}>
                                      {accessTemplate(item)}
                                    </div>
                                  </div>

                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      alignItems: "center",
                                      paddingBottom: "5px",
                                    }}
                                  >
                                    <div
                                      className={`col-xl-8 ${styles.headText}`}
                                    >
                                      {item.id}
                                    </div>
                                    <div
                                      className={`col-xl-4 ${styles.headText}`}
                                    >
                                      {item.repotee}
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
                                      {item.senderDetails?.firstName ||
                                      item.senderDetails?.lastName ||
                                      item?.senderDetails?.profileImageUrl ? (
                                        <div
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                          }}
                                        >
                                          {" "}
                                          <span style={{ marginRight: "10px" }}>
                                            {" "}
                                            {renderUserPrfoileAvatar(
                                              item.senderDetails?.firstName,
                                              item.senderDetails?.lastName,
                                              item?.senderDetails
                                                ?.profileImageUrl,
                                              "header"
                                            )}
                                          </span>
                                          <span>
                                            {item.senderDetails?.firstName}{" "}
                                            {item.senderDetails?.lastName}
                                          </span>
                                        </div>
                                      ) : (
                                        <div style={{ textAlign: "center" }}>
                                          ---
                                        </div>
                                      )}

                                      <span>
                                        {item.firstName} {item.lastName}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

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
          onPageChange={onPageChange}
        />
        <div className="total-pages">
          Total count: {details?.totalElements > 0 ? details?.totalElements : 0}
        </div>
      </div>
    </>
  );
};

export default ReceivedReport;
