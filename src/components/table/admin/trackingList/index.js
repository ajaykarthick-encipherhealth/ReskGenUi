import React, { useState } from "react";
import moment from "moment";
import TableStyle from "../../table.module.css";

import {
  Avatar,
  Tooltip,
  notification,
  Select as AntSelect,
  Empty,
} from "antd";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";

import dayjs from "dayjs";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import { useEffect } from "react";
import { renderUserPrfoileAvatar } from "../../../headerFilters/functions";

function TrackingTable({
  patinetListAll,
  statusBodyTemplate,
  auditBodyTemplate,
  patientDetails,
}) {
  const [sortDueOrder, setSortDueOrder] = useState("asc");
  const [sortCompleteOrder, setSortCompleteOrder] = useState("asc");
  const [detailsContent, setDetailsContent] = useState(patinetListAll);
  const [userName, setUserName] = useState("");
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
      navigate.push("/physician/patients/details");
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

  const sortTableByDate = (value) => {
    const sortedContent = [...detailsContent];
    if (value === "dueDate") {
      if (sortDueOrder === "asc") {
        sortedContent.sort((a, b) => dayjs(a.dueDate).diff(dayjs(b.dueDate)));
        setSortDueOrder("desc");
      } else {
        sortedContent.sort((a, b) => dayjs(b.dueDate).diff(dayjs(a.dueDate)));
        setSortDueOrder("asc");
      }
    }
    if (value === "completeDate") {
      if (sortCompleteOrder === "asc") {
        sortedContent.sort((a, b) =>
          dayjs(a.lastModifiedDate).diff(dayjs(b.lastModifiedDate))
        );
        setSortCompleteOrder("desc");
      } else {
        sortedContent.sort((a, b) =>
          dayjs(b.lastModifiedDate).diff(dayjs(a.lastModifiedDate))
        );
        setSortCompleteOrder("asc");
      }
    }
    setDetailsContent(sortedContent);
  };
  useEffect(() => {
    setDetailsContent(patinetListAll);
  }, [patinetListAll]);

  const getInitials = (firstName, lastName) => {
    const firstNameInitial = firstName?.charAt(0) || "";
    const secondNameInitial = lastName?.charAt(0) || "";
    return firstNameInitial?.toUpperCase() + secondNameInitial?.toUpperCase();
  };
  const renderUserName = (firstName, lastName) => {
    const userName = firstName ? firstName + " " + lastName : "Praveen";
    return userName;
  };

  const renderRows = () => {
    return patinetListAll?.map((data, index) => (
      <tr key={index}>
        <td className={TableStyle.firstTdBorder} onClick={handleTableRowClick}>
          {data.patientId}
        </td>
        <td className={TableStyle.childBorder} onClick={handleTableRowClick}>
          {data.patientName}
        </td>

        <td className={TableStyle.childBorder} style={{ textAlign: "left" }}>
          {data.allocatedByFirstName ||
          data.allocatedByLastName ||
          data.allocatedByProfileImage ? (
            <div style={{ display: "flex", alignItems: "center" }}>
              {" "}
              <span style={{ marginRight: "10px" }}>
                {" "}
                {renderUserPrfoileAvatar(
                  data.allocatedByFirstName,
                  data.allocatedByLastName,
                  data.allocatedByProfileImage,
                  "header"
                )}
              </span>
              <span>
                {data.allocatedByFirstName} {data.allocatedByLastName}
              </span>
            </div>
          ) : (
            <div style={{ textAlign: "center" }}>---</div>
          )}
        </td>

        <td className={TableStyle.childBorder} style={{ textAlign: "left" }}>
          {data.patientAllocatedFirstName ||
          data.patientAllocatedLastName ||
          data.patientAllocatedProfileImage ? (
            <div style={{ display: "flex", alignItems: "center" }}>
              {" "}
              <span style={{ marginRight: "10px" }}>
                {" "}
                {renderUserPrfoileAvatar(
                  data.patientAllocatedFirstName,
                  data.patientAllocatedLastName,
                  data.patientAllocatedProfileImage,
                  "header"
                )}
              </span>
              <span>
                {data.patientAllocatedFirstName} {data.patientAllocatedLastName}
              </span>
            </div>
          ) : (
            <div style={{ textAlign: "center" }}>---</div>
          )}
        </td>
        <td
          className={TableStyle.childBorder}
          onClick={handleTableRowClick}
          style={{ textAlign: "center" }}
        >
          {data.allocatedOn
            ? moment(data.allocatedOn).format("MM-DD-YYYY")
            : "---"}
        </td>
        <td className={TableStyle.childBorder} style={{ textAlign: "left" }}>
          {data.auditAllocatedByFirstName ||
          data.auditAllocatedByLastName ||
          data.auditAllocatedByProfileImage ? (
            <div style={{ display: "flex", alignItems: "center" }}>
              {" "}
              <span style={{ marginRight: "10px" }}>
                {" "}
                {renderUserPrfoileAvatar(
                  data.auditAllocatedByFirstName,
                  data.auditAllocatedByLastName,
                  data.auditAllocatedByProfileImage,
                  "header"
                )}
              </span>
              <span>
                {data.auditAllocatedByFirstName} {data.auditAllocatedByLastName}
              </span>
            </div>
          ) : (
            <div style={{ textAlign: "center" }}>---</div>
          )}
        </td>
        <td
          className={TableStyle.childBorder}
          onClick={handleTableRowClick}
          style={{ textAlign: "center" }}
        >
          {data.auditAllocatedDate
            ? moment(data.auditAllocatedDate).format("MM-DD-YYYY")
            : "---"}
        </td>

        <td
          className={TableStyle.childBorder}
          onClick={handleTableRowClick}
          style={{ textAlign: "center" }}
        >
          {data.dueDate ? moment(data.dueDate).format("MM-DD-YYYY") : "---"}
        </td>
        <td
          className={TableStyle.lastBorder}
          onClick={handleTableRowClick}
          style={{ textAlign: "center" }}
        >
          {auditBodyTemplate(data)}
        </td>
        <td
          className={TableStyle.lastBorder}
          onClick={handleTableRowClick}
          style={{ textAlign: "center" }}
        >
          {statusBodyTemplate(data)}
        </td>
      </tr>
    ));
  };

  return (
    <div className={TableStyle.classContaineer}>
      <table className={TableStyle.classTable}>
        <thead className={TableStyle.classThead}>
          <tr>
            <th>PATIENT ID</th>
            <th>PATIENT NAME</th>
            <th style={{ textAlign: "left",paddingLeft:"20px" }}>ALLOCATED BY</th>
            <th style={{ textAlign: "left",paddingLeft:"20px" }}>ALLOCATED TO</th>
            <th style={{ textAlign: "center" }}>ALLOCATED DATE</th>
            <th style={{ textAlign: "center" }}>AUDIT ALLOCATED BY</th>
            <th style={{ textAlign: "center" }}>AUDIT ALLOCATED DATE</th>
            <th
              style={{ textAlign: "center" }}
              onClick={() => {
                requestSort("dueDate");
                sortTableByDate("dueDate");
              }}
            >
              DUE DATE
              {/* <span style={{ padding: "10px", cursor: "pointer" }}>
                {sortDueOrder === "asc" ? (
                  <ArrowUpOutlined />
                ) : (
                  <ArrowDownOutlined />
                )}
              </span> */}
            </th>
            <th style={{ textAlign: "center" }}>AUDIT STATUS</th>
            <th style={{ textAlign: "center" }}>STATUS</th>
          </tr>
        </thead>

        <tbody>
          {detailsContent.length <= 0 ? (
            <tr>
              <td colSpan="10">
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

export default TrackingTable;
