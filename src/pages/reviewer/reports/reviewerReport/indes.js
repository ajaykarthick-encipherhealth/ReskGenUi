import React, { useState } from "react";
import styles from "../report.module.css";
import { Checkbox, Popover } from "antd";
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

import Image from "next/image";
import { SVGICON } from "../../../../jsx/constant/theme";
import { renderUserPrfoileAvatar } from "../../../../components/headerFilters/functions";

const ReviewerReport = () => {
  const [activeTab, setActiveTab] = useState("Reviewer");
  const [selectedItems, setSelectedItems] = useState([]);

  const data = [
    {
      id: 1,
      patientName: "HERZOG, Joan L",
      patientId: "EH-@46",
      flag: SVGICON?.rafFlagSmall,
      rafScore: "2.232",
      auditedStatus: "AUDIT_PENDING",
      processedStatus: "PENDING",
      date: "03-21-2024",
      auditorName: "Benjamin Mitchell",
      patientAllocatedTo: "Benjamin Mitchell",
      firstName: "Benjamin",
      lastName: "Mitchell",
      profileImageUrl:
        "https://cogentaifiles.blob.core.windows.net/profileimages/c81a62d5-06c6-406a-9bb4-e8940e81aaac.png",
    },
    {
      id: 2,
      patientName: "HERZOG, Joan L",
      patientId: "EH-@46",
      flag: SVGICON?.rafFlagSmall,
      rafScore: "2.232",
      auditedStatus: "AUDITHOLD",
      processedStatus: "COMPLETED",
      date: "03-21-2024",
      auditorName: "Benjamin Mitchell",
      patientAllocatedTo: "Benjamin Mitchell",
      firstName: "Benjamin",
      lastName: "Mitchell",
      profileImageUrl:
        "https://cogentaifiles.blob.core.windows.net/profileimages/c81a62d5-06c6-406a-9bb4-e8940e81aaac.png",
    },
    {
      id: 3,
      patientName: "HERZOG, Joan L",
      patientId: "EH-@46",
      flag: SVGICON?.rafFlagSmall,
      rafScore: "2.232",
      auditedStatus: "REAUDIT",
      processedStatus: "DECLINED",
      date: "03-21-2024",
      auditorName: "Benjamin Mitchell",
      patientAllocatedTo: "Benjamin Mitchell",
      firstName: "Benjamin",
      lastName: "Mitchell",
      profileImageUrl:
        "https://cogentaifiles.blob.core.windows.net/profileimages/c81a62d5-06c6-406a-9bb4-e8940e81aaac.png",
    },
    {
      id: 4,
      patientName: "HERZOG, Joan L",
      patientId: "EH-@46",
      flag: SVGICON?.rafFlagSmall,
      rafScore: "2.232",
      auditedStatus: "NOT_AUDIT",
      processedStatus: "HOLD",
      date: "03-21-2024",
      auditorName: "Benjamin Mitchell",
      patientAllocatedTo: "Benjamin Mitchell",
      firstName: "Benjamin",
      lastName: "Mitchell",
      profileImageUrl:
        "https://cogentaifiles.blob.core.windows.net/profileimages/c81a62d5-06c6-406a-9bb4-e8940e81aaac.png",
    },
    {
      id: 5,
      patientName: "HERZOG, Joan L",
      patientId: "EH-@46",
      flag: SVGICON?.rafFlagSmall,
      rafScore: "2.232",
      auditedStatus: "AUDIT_DECLINED",
      processedStatus: "HOLD",
      date: "03-21-2024",
      auditorName: "Benjamin Mitchell",
      patientAllocatedTo: "Benjamin Mitchell",
      firstName: "Benjamin",
      lastName: "Mitchell",
      profileImageUrl:
        "https://cogentaifiles.blob.core.windows.net/profileimages/c81a62d5-06c6-406a-9bb4-e8940e81aaac.png",
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
                style={{ height: "30px", width: "30px" }}
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
                style={{ height: "30px", width: "30px" }}
              />
            </span>
          </Popover>
        );
      case "REAUDIT":
        return (
          <Popover placement="bottom" title=" Status: REAUDIT">
            <span className="patient-status">
              <Image src={ReAudit} style={{ height: "30px", width: "30px" }} />
            </span>
          </Popover>
        );
      case "AUDITED":
        return (
          <Popover placement="bottom" title=" Status: AUDITED">
            <span className="patient-status">
              <Image
                src={AuditedTrack}
                style={{ height: "30px", width: "30px" }}
              />
            </span>
          </Popover>
        );
      case "AUDITED":
        return (
          <span className="patient-status">
            <Image
              src={AuditedTrack}
              style={{ height: "30px", width: "30px" }}
            />
          </span>
        );

      case "NOT_AUDIT":
        return (
          <Popover placement="bottom" title=" Status: NOT AUDIT">
            <span className="patient-status">
              <Image
                src={NotAudited}
                style={{ height: "30px", width: "30px" }}
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
                style={{ height: "30px", width: "30px" }}
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
      // Return a default component or null
      return null; // You can return null or a default component here
    }
    switch (rowData?.processedStatus) {
      case "COMPLETED":
        return (
          <Popover placement="bottom" title="Status: COMPLETED">
            <span className="patient-status" style={{ textAlign: "center" }}>
              <Image
                src={Completed}
                style={{ height: "30px", width: "30px" }}
              />
            </span>
          </Popover>
        );

      case "PENDING":
        return (
          <Popover placement="bottom" title="Status: PENDING">
            <span className="patient-status" style={{ textAlign: "center" }}>
              <Image src={Pending} style={{ height: "30px", width: "30px" }} />
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
              <Image src={Declined} style={{ height: "30px", width: "30px" }} />
            </span>
          </Popover>
        );

      case "NOTCOMPUTED":
        return (
          <Popover placement="bottom" title="Status: NOT COMPUTED">
            <span className="patient-status" style={{ textAlign: "center" }}>
              <Image src={Pending} style={{ height: "30px", width: "30px" }} />
            </span>
          </Popover>
        );
      case "COMPUTED":
        return (
          <Popover placement="bottom" title="Status: PENDING">
            <span className="patient-status" style={{ textAlign: "center" }}>
              <Image src={Pending} style={{ height: "30px", width: "30px" }} />
            </span>
          </Popover>
        );
      case "HOLD":
        return (
          <Popover placement="bottom" title="Status: HOLD">
            <span className="patient-status" style={{ textAlign: "center" }}>
              <Image src={Hold} style={{ height: "30px", width: "30px" }} />
            </span>
          </Popover>
        );
      case "ABORTED_BY_CRON":
        return (
          <Popover placement="bottom" title="Status: ABORTED BY CRON">
            <span className="patient-status" style={{ textAlign: "center" }}>
              <Image src={Abort} style={{ height: "30px", width: "30px" }} />
            </span>
          </Popover>
        );
      case null:
        return (
          <Popover placement="bottom" title="Status: PENDING">
            <span className="patient-status" style={{ textAlign: "center" }}>
              <Image src={Pending} style={{ height: "30px", width: "30px" }} />
            </span>
          </Popover>
        );
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

  return (
    <>
      <div>
        <div className="content-body">
          <div className="container-fluid">
            <div className="row">
              <div>
                <div className=" col-xl-12 d-flex">
                  <div className="col-xl-4">
                    <div className={styles.cardContainer}>
                      {data.map((item) => (
                        <div key={item.id} className={styles.card}>
                          <div className={styles.contentGroup}>
                            <div className={styles.inputContainer}>
                              <Checkbox
                                style={{ width: "20px", height: "20px" }}
                              />
                            </div>
                            <div className="col-xl-12">
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  paddingBottom: "10px",
                                }}
                              >
                                <div className={`col-xl-6 ${styles.pName}`}>
                                  {item.patientName}
                                </div>
                                <div
                                  className={`col-xl-6 ${styles.dataContainer}`}
                                >
                                  <span className={styles.raf}>
                                    {item.rafScore}
                                  </span>
                                  <span>{item.flag}</span>
                                  <span>{auditstatusBodyTemplate(item)}</span>
                                  <span>{processstatusBodyTemplate(item)}</span>
                                </div>
                              </div>

                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-around",
                                  alignItems: "center",
                                  paddingBottom: "10px",
                                }}
                              >
                                <div className={`col-xl-2 ${styles.headText}`}>
                                  {item.patientId}
                                </div>
                                <div className={`col-xl-4 ${styles.headText}`}>
                                  AUDITOR NAME
                                </div>
                                <div className={`col-xl-4 ${styles.headText}`}>
                                  PATIENT ALLOCATE TO
                                </div>
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-around",
                                  alignItems: "center",
                                  paddingBottom: "10px",
                                }}
                              >
                                <div className={`col-xl-2 ${styles.text}`}>
                                  {item.date}
                                </div>
                                <div className={`col-xl-4 ${styles.text}`}>
                                  <span
                                    style={{
                                      marginRight: "10px",
                                    }}
                                  >
                                    {renderUserPrfoileAvatar(
                                      item.firstName,
                                      item.lastName,
                                      item?.profileImageUrl,
                                      "header"
                                    )}
                                  </span>

                                  <span>
                                    {item.firstName} {item.lastName}
                                  </span>
                                </div>
                                <div className={`col-xl-4 ${styles.text}`}>
                                  <span
                                    style={{
                                      marginRight: "10px",
                                    }}
                                  >
                                    {renderUserPrfoileAvatar(
                                      item.firstName,
                                      item.lastName,
                                      item?.profileImageUrl,
                                      "header"
                                    )}
                                  </span>

                                  <span>
                                    {item.firstName} {item.lastName}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="col-xl-8" style={{ marginLeft: "10px" }}>
                    <div className={styles.cardContainer}>
                      <div className={styles.card1}>hj</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReviewerReport;
