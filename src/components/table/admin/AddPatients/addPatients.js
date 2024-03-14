import React, { useState } from "react";
import moment from "moment";
import TableStyle from "../../table.module.css";
import { notification, Select as AntSelect, Empty } from "antd";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import { selectedRoWDetails } from "../../../../store/actions/adminAction/fileProcessingActions";
import {
  renderUserPrfoileAvatar,
  sortFunction,
} from "../../../headerFilters/functions";

function AddPatientListTable({
  patinetListAll,
  actionBodyTemplate,
  statusBodyTemplate,
  patientDetails,
  sortOrder,
  setSortOrder,
  setSort,
}) {
  const [detailsContent, setDetailsContent] = useState(patinetListAll);
  const [sortCompleteOrder, setSortCompleteOrder] = useState("DESC");

  const dispatch = useDispatch();
  const navigate = useRouter();

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: null,
  });

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const gotoPatientDetails = (data) => {
    dispatch(patientDetails(data));
    if (data.computing === 2) {
      const controller = new AbortController();
      const { signal } = controller;
      controller.abort();
      localStorage.setItem("patientId", data.patientId);
      navigate.push("/reviewer/patients/details");
    } else {
      notification.warning({
        message: data.patientId + " file not processed. Please wait.",
      });
    }
  };

  const handleTableRowClick = (e) => {
    const targetTd = e.target.closest("td");
    if (targetTd) {
      const dataIndex = targetTd.parentElement.rowIndex - 1;
      const clickedData = patinetListAll[dataIndex];
      gotoPatientDetails(clickedData);
    }
  };

  const sortTableByDate = () => {
    const sortedContent = [...detailsContent];

    if (sortDueOrder === "asc") {
      sortedContent.sort((a, b) =>
        dayjs(a.processedDate).diff(dayjs(b.processedDate))
      );
      setSortDueOrder("desc");
    } else {
      sortedContent.sort((a, b) =>
        dayjs(b.processedDate).diff(dayjs(a.processedDate))
      );
      setSortDueOrder("asc");
    }

    setDetailsContent(sortedContent);
  };

  const renderRows = () => {
    return patinetListAll?.length === 0 ? (
      <tr>
        <td colSpan="9">
          <Empty />
        </td>
      </tr>
    ) : (
      <>
        {patinetListAll?.map((data, index) => (
          <tr
            key={index}
            onClick={() => {
              dispatch(
                selectedRoWDetails({
                  patientId: data?.patientId,
                  processStageId: data?.processStageId,
                })
              );
            }}
          >
            <td
              className={TableStyle.firstTdBorder}
              onClick={handleTableRowClick}
            >
              {data.patientId ? data.patientId : "---"}
            </td>
            <td
              className={TableStyle.childBorder}
              onClick={handleTableRowClick}
            >
              {data.patientName ? data.patientName : <div>---</div>}
            </td>

            <td
              className={TableStyle.childBorder}
              style={{ textAlign: "left" }}
              onClick={handleTableRowClick}
            >
              {data.createdByFirstName ||
              data.createdByLastName ||
              data.createdByProfileImage ? (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span style={{ marginRight: "10px" }}>
                    {renderUserPrfoileAvatar(
                      data.createdByFirstName,
                      data.createdByLastName,
                      data.createdByProfileImage,
                      "header"
                    )}
                  </span>
                  <span>
                    {data.createdByFirstName} {data.createdByLastName}
                  </span>
                </div>
              ) : (
                <div style={{ paddingLeft: "50px" }}>---</div>
              )}
            </td>
            <td
              style={{ textAlign: "center" }}
              className={TableStyle.childBorder}
              onClick={handleTableRowClick}
            >
              {data.computedDate
                ? moment(data.computedDate).format("MM-DD-YYYY")
                : "---"}
            </td>
            <td
              style={{ textAlign: "center" }}
              className={TableStyle.childBorder}
              onClick={handleTableRowClick}
            >
              {data.createdDate
                ? moment(data.createdDate).format("MM-DD-YYYY")
                : "---"}
            </td>
            <td
              style={{ marginLeft: "10px" }}
              className={TableStyle.childBorder}
              onClick={handleTableRowClick}
            >
              {statusBodyTemplate(data)}
            </td>
            <td
              className={TableStyle.lastBorder}
              style={{ textAlign: "center" }}
            >
              {actionBodyTemplate(data)}
            </td>
          </tr>
        ))}
      </>
    );
  };

  return (
    <div className={TableStyle.classContaineer}>
      <table className={TableStyle.classTable}>
        <thead className={TableStyle.classThead}>
          <tr>
            <th>PATIENT ID</th>
            <th>PATIENT NAME</th>

            <th className={TableStyle.rowStyle}>CREATED BY</th>

            <th
              style={{
                cursor: "pointer",
                paddingLeft: "15px",
                textAlign: "center",
              }}
              onClick={() => {
                sortFunction(sortOrder, setSortOrder, setSort, "computedDate");
              }}
            >
              COMPUTED DATE{" "}
              {sortOrder === "ASC" ? (
                <ArrowUpOutlined />
              ) : (
                <ArrowDownOutlined />
              )}
            </th>
            <th
              onClick={() => {
                sortFunction(
                  sortCompleteOrder,
                  setSortCompleteOrder,
                  setSort,
                  "createdDate"
                );
              }}
              style={{ textAlign: "center" }}
            >
              CREATED DATE
              <span
                style={{
                  padding: "10px",
                  cursor: "pointer",
                  textAlign: "center",
                  paddingLeft: "15px",
                }}
              >
                {sortCompleteOrder === "ASC" ? (
                  <ArrowUpOutlined />
                ) : (
                  <ArrowDownOutlined />
                )}
              </span>
            </th>

            <th style={{ paddingLeft: "55px" }}>STATUS</th>
            <th>UPLOAD</th>
          </tr>
        </thead>

        <tbody>
          {detailsContent.length <= 0 ? (
            <tr>
              <td colSpan="9">
                <Empty />
              </td>
            </tr>
          ) : (
            renderRows()
          )}
        </tbody>
      </table>
      <div></div>
    </div>
  );
}

export default AddPatientListTable;
