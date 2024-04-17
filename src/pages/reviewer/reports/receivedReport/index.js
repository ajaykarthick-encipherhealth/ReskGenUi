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
import { Avatar } from "antd";
import Image from "next/image";
import { SVGICON } from "../../../../jsx/constant/theme";
import { renderUserPrfoileAvatar } from "../../../../components/headerFilters/functions";
import EditButton from "../../../../images/adminUsers/EditButton";

const ReceivedReport = () => {
  const [activeTab, setActiveTab] = useState("Reviewer");
  const [selectedItems, setSelectedItems] = useState([]);

  const data = [
    {
      id: 1,
      report: "Monthly Report",
      access: "Read",
      patientId: "2341cdbe-aa40-4efd-96ca-a91dd6c99424",
      date: "03-21-2024",
     repotee:"SENDER",
      firstName: "Benjamin",
      lastName: "Mitchell",
      profileImageUrl:
        "https://cogentaifiles.blob.core.windows.net/profileimages/c81a62d5-06c6-406a-9bb4-e8940e81aaac.png",
    },
    {
      id: 2,
      report: "Monthly Report",
      access: "Download",
      patientId: "2341cdbe-aa40-4efd-96ca-a91dd6c99424",
      date: "03-21-2024",
      repotee:"SENDER",
      firstName: "Benjamin",
      lastName: "Mitchell",
      profileImageUrl:
        "https://cogentaifiles.blob.core.windows.net/profileimages/c81a62d5-06c6-406a-9bb4-e8940e81aaac.png",
    },
    {
      id: 3,
      report: "Monthly Report",
      access: "Read",
      patientId: "2341cdbe-aa40-4efd-96ca-a91dd6c99424",
      date: "03-21-2024",
      repotee:"SENDER",
      firstName: "Benjamin",
      lastName: "Mitchell",
      profileImageUrl:
        "https://cogentaifiles.blob.core.windows.net/profileimages/c81a62d5-06c6-406a-9bb4-e8940e81aaac.png",
    },
    {
      id: 4,
      report: "Monthly Report",
      access: "Download",
      patientId: "2341cdbe-aa40-4efd-96ca-a91dd6c99424",
      date: "03-21-2024",
      repotee:"SENDER",
      firstName: "Benjamin",
      lastName: "Mitchell",
      profileImageUrl:
        "https://cogentaifiles.blob.core.windows.net/profileimages/c81a62d5-06c6-406a-9bb4-e8940e81aaac.png",
    },
    {
      id: 5,
      report: "Monthly Report",
      access: "Read",
      patientId: "2341cdbe-aa40-4efd-96ca-a91dd6c99424",
      date: "03-21-2024",
      repotee:"SENDER",
      firstName: "Benjamin",
      lastName: "Mitchell",
      profileImageUrl:
        "https://cogentaifiles.blob.core.windows.net/profileimages/c81a62d5-06c6-406a-9bb4-e8940e81aaac.png",
    },
  ];

  const accessTemplate = (rowData) => {
    switch (rowData?.access) {
      case "Read":
        return <span className={styles.readStyle}>Read</span>;

      case "Download":
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
                                  paddingBottom: "10px",
                                }}
                              >
                                <div className={`col-xl-6 ${styles.pName}`}>
                                  {item.report}
                                </div>
                                <div className={`col-xl-2 `}>
                                  <span>{accessTemplate(item)}</span>
                                </div>
                              </div>

                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  paddingBottom: "10px",
                                }}
                              >
                                <div className={`col-xl-8 ${styles.headText}`}>
                                  {item.patientId}
                                </div>
                                <div className={`col-xl-4 ${styles.headText}`}>
                                  {item.repotee}
                                </div>
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
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

export default ReceivedReport;
