import React, { useState } from "react";
import moment from "moment";
import TableStyle from "../table.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSort,
  faSortUp,
  faSortDown,
} from "@fortawesome/free-solid-svg-icons";
import { SVGICON } from "../../../jsx/constant/theme";
import { Avatar } from "antd";

function PatientTable({
  patinetListAll,
  actionBodyTemplate,
  statusBodyTemplate,
}) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getClassNamesFor = (name) => {
    if (!sortConfig) {
      return;
    }
    return sortConfig.key === name ? sortConfig.direction : undefined;
  };

  const sortedData = patinetListAll.sort((a, b) => {
    if (sortConfig.direction === "asc") {
      return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
    }
    if (sortConfig.direction === "desc") {
      return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
    }
    return 0;
  });

  const renderRows = () => {
    return patinetListAll.map((data, index) => (
      <tr key={index}>
        <td className={TableStyle.firstTdBorder}>{data.patientId}</td>
        <td className={TableStyle.childBorder}>{data.patientName}</td>

        <td className={TableStyle.childBorder}>
          {data.dueDate
            ? moment(data.dueDate).format("MM-DD-YYYY")
            : "MM-DD-YYYY"}
        </td>
        <td className={TableStyle.childBorder}>
          {data.lastModifiedDate
            ? moment(data.lastModifiedDate).format("MM-DD-YYYY")
            : "MM-DD-YYYY"}
        </td>
        <td className={TableStyle.childBorder}>
          {data.allocatedOn
            ? moment(data.allocatedOn).format("MM-DD-YYYY")
            : "MM-DD-YYYY"}
        </td>
        <td className={TableStyle.childBorder}><Avatar  style={{
        backgroundColor: '#fde3cf',
        color: '#f56a00',
      }}>U</Avatar></td>
        <td className={TableStyle.childBorder}>{SVGICON.alert}</td>
        <td className={TableStyle.childBorder}>{statusBodyTemplate(data)}</td>
        <td className={TableStyle.lastBorder}>{actionBodyTemplate(data)}</td>
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

            <th onClick={() => requestSort("dueDate")}>
              DUE DATE
              <span style={{ padding: "10px" }}>
                <FontAwesomeIcon
                  icon={
                    getClassNamesFor("dueDate") === "asc"
                      ? faSortUp
                      : faSortDown
                  }
                />
              </span>
            </th>
            <th onClick={() => requestSort("lastModifiedDate")}>
              COMPLETED DATE
              <span style={{ padding: "10px" }}>
                <FontAwesomeIcon
                  icon={
                    getClassNamesFor("lastModifiedDate") === "asc"
                      ? faSortUp
                      : faSortDown
                  }
                />
              </span>
            </th>
            <th>ALLOCATED DATE</th>
            <th> ALLOCATED USER</th>
            <th>PRIORITY</th>
            <th>STATUS</th>
            <th>ACTION</th>
          </tr>
        </thead>
        <tbody>{renderRows()}</tbody>
      </table>
    </div>
  );
}

export default PatientTable;
