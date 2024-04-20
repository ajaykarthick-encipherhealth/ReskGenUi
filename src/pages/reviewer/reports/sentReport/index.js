import React, { useState } from "react";
import styles from "../report.module.css";
import { Popover } from "antd";
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
import { Avatar } from "antd";
import Image from "next/image";
import { SVGICON } from "../../../../jsx/constant/theme";
import { renderUserPrfoileAvatar } from "../../../../components/headerFilters/functions";
import EditButton from "../../../../images/adminUsers/EditButton";
import { IMAGES } from "src/jsx/constant/theme.js";

const SentReport = () => {
  const [activeTab, setActiveTab] = useState("Reviewer");
  const [selectedItems, setSelectedItems] = useState([]);

  const data = [
    {
      id: 1,
      report: "Monthly Report",
      edit: "",
      patientId: "2341cdbe-aa40-4efd-96ca-a91dd6c99424",
      date: "03-21-2024",
      profileImageUrl:
        "https://cogentaifiles.blob.core.windows.net/profileimages/c81a62d5-06c6-406a-9bb4-e8940e81aaac.png",
    },
    {
      id: 2,
      report: "Monthly Report",
      edit: "",
      patientId: "2341cdbe-aa40-4efd-96ca-a91dd6c99424",
      date: "03-21-2024",
      profileImageUrl:
        "https://cogentaifiles.blob.core.windows.net/profileimages/c81a62d5-06c6-406a-9bb4-e8940e81aaac.png",
    },
    {
      id: 3,
      report: "Monthly Report",
      edit: "",
      patientId: "2341cdbe-aa40-4efd-96ca-a91dd6c99424",
      date: "03-21-2024",
      profileImageUrl:
        "https://cogentaifiles.blob.core.windows.net/profileimages/c81a62d5-06c6-406a-9bb4-e8940e81aaac.png",
    },
    {
      id: 4,
      report: "Monthly Report",
      edit: "",
      patientId: "2341cdbe-aa40-4efd-96ca-a91dd6c99424",
      date: "03-21-2024",
      profileImageUrl:
        "https://cogentaifiles.blob.core.windows.net/profileimages/c81a62d5-06c6-406a-9bb4-e8940e81aaac.png",
    },
    {
      id: 5,
      report: "Monthly Report",
      edit: "",
      patientId: "2341cdbe-aa40-4efd-96ca-a91dd6c99424",
      date: "03-21-2024",
      profileImageUrl:
        "https://cogentaifiles.blob.core.windows.net/profileimages/c81a62d5-06c6-406a-9bb4-e8940e81aaac.png",
    },
    {
      id: 6,
      report: "Monthly Report",
      edit: "",
      patientId: "2341cdbe-aa40-4efd-96ca-a91dd6c99424",
      date: "03-21-2024",
      profileImageUrl:
        "https://cogentaifiles.blob.core.windows.net/profileimages/c81a62d5-06c6-406a-9bb4-e8940e81aaac.png",
    },
    {
      id: 7,
      report: "Monthly Report",
      edit: "",
      patientId: "2341cdbe-aa40-4efd-96ca-a91dd6c99424",
      date: "03-21-2024",
      profileImageUrl:
        "https://cogentaifiles.blob.core.windows.net/profileimages/c81a62d5-06c6-406a-9bb4-e8940e81aaac.png",
    },
  ];
  const userList = [
    {
      id: 1,
      firstName: "Benjamin",
      lastName: "Mitchell",
      profileImageUrl:
        "https://cogentaifiles.blob.core.windows.net/profileimages/c81a62d5-06c6-406a-9bb4-e8940e81aaac.png",
    },
    {
      id: 2,
      firstName: "Benjamin",
      lastName: "Mitchell",
      profileImageUrl:
        "https://cogentaifiles.blob.core.windows.net/profileimages/c81a62d5-06c6-406a-9bb4-e8940e81aaac.png",
    },
    {
      id: 3,
      firstName: "Benjamin",
      lastName: "Mitchell",
      profileImageUrl:
        "https://cogentaifiles.blob.core.windows.net/profileimages/c81a62d5-06c6-406a-9bb4-e8940e81aaac.png",
    },

    {
      id: 4,
      firstName: "Benjamin",
      lastName: "Mitchell",
      profileImageUrl:
        "https://cogentaifiles.blob.core.windows.net/profileimages/c81a62d5-06c6-406a-9bb4-e8940e81aaac.png",
    },
    {
      id: 5,
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
                                  {item.report}
                                </div>
                                <div
                                  className={`col-xl-2 ${styles.dataContainer}`}
                                >
                                  <span>
                                    <EditButton />
                                  </span>
                                </div>
                              </div>

                              <div
                                style={{
                                  paddingBottom: "5px",
                                }}
                              >
                                <div className={`col-xl-12 ${styles.headText}`}>
                                  {item.patientId}
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
                                  {item.date}
                                </div>
                                <div className={`col-xl-4 ${styles.text}`}>
                                  <Avatar.Group>
                                    <Avatar
                                      style={{
                                        backgroundColor: "#f56a00",
                                      }}
                                      src={item.profileImageUrl}
                                    />

                                    <Avatar
                                      style={{
                                        backgroundColor: "#f56a00",
                                      }}
                                      src={item.profileImageUrl}
                                    />

                                    <Avatar
                                      style={{
                                        backgroundColor: "#f56a00",
                                      }}
                                      src={item.profileImageUrl}
                                    />

                                    <Avatar
                                      style={{
                                        backgroundColor: "#f56a00",
                                      }}
                                      src={item.profileImageUrl}
                                    />

                                    <Avatar
                                      style={{
                                        backgroundColor: "#f56a00",
                                      }}
                                      src={item.profileImageUrl}
                                    />

                                    <Avatar
                                      style={{
                                        backgroundColor: "#f56a00",
                                      }}
                                      src={item.profileImageUrl}
                                    />
                                  </Avatar.Group>
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
                              Monthly Report
                            </div>
                            <div
                              className={styles.headText}
                              style={{ padding: "5px" }}
                            >
                              2341cdbe-aa40-4efd-96ca-a91dd6c99424
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
                              03-21-2024
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
                              05
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
                          {userList.map((item) => (
                            <div key={item.id} style={{ padding: "10px" }}>
                              <span style={{ marginRight: "5px" }}>
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
                          ))}
                        </div>
                        <div className="d-flex mt-20">
                          <div className="p-1">
                            By clicking on the sheet, users can view the
                            detailed report that was sent to them
                          </div>
                          <div className="p-1">{SVGICON?.Sheet}</div>
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
    </>
  );
};

export default SentReport;
