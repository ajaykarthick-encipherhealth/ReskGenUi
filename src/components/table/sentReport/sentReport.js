import React, { useState } from "react";
import { Paginator } from "primereact/paginator";
import { Empty, Popover } from "antd";
import { Avatar } from "antd";
import dayjs from "dayjs";
import EditButton from "../../../images/adminUsers/EditButton";
import SpinnerDots from "../../spinner";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import Export from "../../../pages/admin/report/Export";
import TableStyle from "../table.module.css";
import { selectedReport } from "../../../store/actions/adminAction/ReportActions";
import {
  dateFormate,
  getBackgroundColor,
  renderUserPrfoileAvatar,
  sortFunction,
} from "../../headerFilters/functions";

function SentReportTable({
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
}) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const displayReceivedUsers = (list) => {
    setSelectedUsers(list);
  };

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
          }&sentreport=${true}`
        )
      : router?.push(
          `/admin/report/individualreport?reportId=${
            row?._id
          }&sentreport=${true}`
        );
  };
  const closeModal = () => {
    setOpenEdit(false);
  };
  return (
    <div className={TableStyle.classContaineer}>
      {!details?.data ? (
        <SpinnerDots />
      ) : (
        <>
          <table className={TableStyle.classTable}>
            <thead className={TableStyle.classTTotalhead}>
              <tr>
                <th>REPORT ID</th>
                <th>REPORT NAME</th>
                <th style={{ textAlign: "center" }}>USER LIST</th>
                <th
                  className={TableStyle.rowStyle}
                  style={{ cursor: "pointer", paddingLeft: "15px" }}
                  onClick={() => {
                    sortFunction(sortOrder, setSortOrder, setSort, "sendDate");
                  }}
                >
                  DATE{" "}
                  {sortOrder === "ASC" ? (
                    <ArrowUpOutlined />
                  ) : (
                    <ArrowDownOutlined />
                  )}
                </th>
                <th style={{ textAlign: "center" }}>ACTION</th>
              </tr>
            </thead>

            <tbody>
              {details?.data?.length > 0 ? (
                details?.data?.map((row, index) => {
                  const formattedDate = dateFormate(dayjs, row?.sendDate);

                  return (
                    <tr key={index} style={{ height: "40px" }}>
                      <td
                        style={{
                          borderTop: "  0.2px solid #e1e1e1",
                          borderLeft: "  0.2px solid #e1e1e1",
                          borderBottom: "  0.2px solid #e1e1e1",
                        }}
                        className={TableStyle.childBorder}
                        onClick={() => handleReceiverReport(row)}
                      >
                        {row._id}
                      </td>
                      <td
                        style={{
                          borderTop: "  0.2px solid #e1e1e1",

                          borderBottom: "  0.2px solid #e1e1e1",
                        }}
                        className={TableStyle.childBorder}
                        onClick={() => handleReceiverReport(row)}
                      >
                        {row.reportName}
                      </td>

                      <td
                        style={{
                          borderTop: "  0.2px solid #e1e1e1",
                          cursor: "pointer",
                          borderBottom: "  0.2px solid #e1e1e1",
                          textAlign: "center",
                        }}
                        className={TableStyle.childBorder}
                        onClick={() => handleReceiverReport(row)}
                      >
                        <Popover
                          content={popCOntent}
                          style={{ position: "relative", left: "-330px" }}
                        >
                          <div
                            onMouseOver={() =>
                              displayReceivedUsers(row.receivedUsers)
                            }
                          >
                            <Avatar.Group maxCount={2}>
                              {row?.receivedUsers?.map((data, index) => (
                                <div key={index}>
                                  {data?.userDetails?.profileImageUrl ? (
                                    <Avatar
                                      style={{ objectFit: "unset" }}
                                      src={data.userDetails.profileImageUrl}
                                    />
                                  ) : (
                                    <Avatar
                                      style={{
                                        backgroundColor: backgroundColor,
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
                              ))}
                            </Avatar.Group>
                          </div>
                        </Popover>
                      </td>
                      <td
                        style={{
                          borderTop: "  0.2px solid #e1e1e1",
                        }}
                        className={TableStyle.childBorder}
                        onClick={() => handleReceiverReport(row)}
                      >
                        {formattedDate}
                      </td>
                      <td
                        style={{
                          textAlign: "center",
                          borderTop: " 0.2px solid #e1e1e1",
                          borderBottom: " 0.2px solid #e1e1e1",
                          borderRight: " 0.2px solid #e1e1e1",
                        }}
                      >
                        <div
                          onClick={() => {
                            setSelectedRows(row);
                            setOpenEdit(true);
                          }}
                        >
                          <EditButton />
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4}>
                    <Empty />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </>
      )}
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
    </div>
  );
}

export default SentReportTable;
