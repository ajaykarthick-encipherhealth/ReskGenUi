import React, { useState } from "react";
import styles from "../report.module.css";
import { Paginator } from "primereact/paginator";
import dayjs from "dayjs";

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
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { Avatar } from "antd";
import Image from "next/image";
import { SVGICON } from "../../../../jsx/constant/theme";
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

const SentReport = ({
  details,
  onSentPageChange,
  paginationFirst,
  loading,
  sortOrder,
  setSortOrder,
  setSort,
  receivedPageNo,
  receivedStartDate,
  receivedEndDate,
  isPhysician,
  isAdmin,
}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Reviewer");
  const [selectedItems, setSelectedItems] = useState([]);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const displayReceivedUsers = (list) => {
    setSelectedUsers(list);
  };
  console.log(details, "data");
  const hashes = selectedUsers.map((user) => {
    const hash = (user?.userDetails?.firstName.charCodeAt(0) % 6) + 1;
    return hash;
  });
  const mostCommonHash = getBackgroundColor(hashes);
  const backgroundColor = getBackgroundColor(mostCommonHash);

  const popCOntent = (
    <div style={{ width: "100%" }}>
      <table className={TableStyle.classTable}>
        <thead style={{ padding: "10px", height: "30px", color: "white" }}>
          <tr>
            <th style={{ padding: "10px" }}>USER</th>
            <th>ROLE</th>
          </tr>
        </thead>
        <tbody>
          {selectedUsers?.map((row, index) => {
            return (
              <tr key={index}>
                <td
                  className={TableStyle.childBorder}
                  style={{ textAlign: "center" }}
                >
                  {row?.userDetails?.firstName ||
                  row?.userDetails?.lastName ||
                  row?.userDetails?.profileImageUrl ? (
                    <div style={{ display: "flex", alignItems: "center" }}>
                      {" "}
                      <span style={{ marginRight: "10px" }}>
                        {" "}
                        {renderUserPrfoileAvatar(
                          row?.userDetails?.firstName,
                          row?.userDetails?.lastName,
                          row?.userDetails?.profileImageUrl,
                          "header"
                        )}
                      </span>
                      <span>
                        {row?.userDetails?.firstName}{" "}
                        {row?.userDetails?.lastName}
                      </span>
                    </div>
                  ) : (
                    <div style={{ textAlign: "center" }}>---</div>
                  )}
                </td>
                <td
                  style={{
                    borderTop: "  0.2px solid #e1e1e1",
                    borderBottom: "  0.2px solid #e1e1e1",
                  }}
                >
                  {row.role}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  const handleReceiverReport = (row) => {
    const info = {
      reportUser: row,
      receivedPageNo: receivedPageNo,
      receivedStartDate: receivedStartDate,
      receivedEndDate: receivedEndDate,
    };
    dispatch(selectedReport(info));
    isPhysician
      ? router?.push(
          `/reviewer/report/individualreport?reportId=${
            row?._id
          }&sentreport=${true}&page=${receivedPageNo}&limit=${paginationFirst}`
        )
      : router?.push(
          `/admin/report/individualreport?reportId=${
            row?._id
          }&sentreport=${true}&isAdmin=${isAdmin}&page=${receivedPageNo}&limit=${paginationFirst}`
        );
  };
  const closeModal = () => {
    setOpenEdit(false);
  };

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
  console.log(details?.data, "datsa");
  return (
    <>
      <div>
        <div className="content-body">
          <div className="container-fluid">
            <div className="row">
              <div>
                <div className=" col-xl-12 d-flex">
                  <div className="col-xl-4">
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
                                          (data, index) => (
                                            <div key={index}>
                                              {data?.userDetails
                                                ?.profileImageUrl ? (
                                                <Avatar
                                                  style={{ objectFit: "unset" }}
                                                  src={
                                                    data.userDetails
                                                      .profileImageUrl
                                                  }
                                                />
                                              ) : (
                                                <Avatar
                                                  style={{
                                                    backgroundColor:
                                                      backgroundColor,
                                                  }}
                                                >
                                                  {`${
                                                    data?.userDetails?.firstName?.charAt(
                                                      0
                                                    ) || ""
                                                  }${
                                                    data?.userDetails?.lastName?.charAt(
                                                      0
                                                    ) || ""
                                                  }`}
                                                </Avatar>
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
