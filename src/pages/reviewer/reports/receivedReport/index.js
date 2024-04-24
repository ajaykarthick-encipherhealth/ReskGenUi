import React, { useState, useEffect } from "react";
import styles from "../report.module.css";
import Image from "next/image";
import { SVGICON } from "../../../../jsx/constant/theme";
import { IMAGES } from "src/jsx/constant/theme.js";
import { Paginator } from "primereact/paginator";
import { Empty } from "antd";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import {
  dateFormate,
  getBackgroundColor,
  renderUserPrfoileAvatar,
  sortFunction,
} from "../../../../components/headerFilters/functions";
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
  const data = [
    {
      id: 1,
      report: "Monthly Report",
      access: "Read",
      patientId: "2341cdbe-aa40-4efd-96ca-a91dd6c99424",
      date: "03-21-2024",
      repotee: "SENDER",
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
      repotee: "SENDER",
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
      repotee: "SENDER",
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
      repotee: "SENDER",
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
      repotee: "SENDER",
      firstName: "Benjamin",
      lastName: "Mitchell",
      profileImageUrl:
        "https://cogentaifiles.blob.core.windows.net/profileimages/c81a62d5-06c6-406a-9bb4-e8940e81aaac.png",
    },
    {
      id: 6,
      report: "Monthly Report",
      access: "Download",
      patientId: "2341cdbe-aa40-4efd-96ca-a91dd6c99424",
      date: "03-21-2024",
      repotee: "SENDER",
      firstName: "Benjamin",
      lastName: "Mitchell",
      profileImageUrl:
        "https://cogentaifiles.blob.core.windows.net/profileimages/c81a62d5-06c6-406a-9bb4-e8940e81aaac.png",
    },
    {
      id: 7,
      report: "Monthly Report",
      access: "Read",
      patientId: "2341cdbe-aa40-4efd-96ca-a91dd6c99424",
      date: "03-21-2024",
      repotee: "SENDER",
      firstName: "Benjamin",
      lastName: "Mitchell",
      profileImageUrl:
        "https://cogentaifiles.blob.core.windows.net/profileimages/c81a62d5-06c6-406a-9bb4-e8940e81aaac.png",
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
                              SENDER
                            </div>
                            <div
                              className={styles.headText}
                              style={{ padding: "5px" }}
                            >
                              Benjamin Mitchell
                            </div>
                          </div>
                        </div>
                        <div>
                          <div
                            className={styles.pName}
                            style={{ padding: "10px" }}
                          >
                            Sender
                          </div>
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
