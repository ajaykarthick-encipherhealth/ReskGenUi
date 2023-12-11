import React, { useState } from "react";
import moment from "moment";
import TableStyle from "../table.module.css";
import {
  faSort,
  faSortUp,
  faSortDown,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar, Tooltip, notification, Select as AntSelect } from "antd";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import AllocatedUserCard from "../../allocatedUserDetails/AllocatedUserCard";
import visitStyles from "../../../styles/visitdata.module.css";
import { SVGICON } from "../../../jsx/constant/theme";

const { Option } = AntSelect;

function PatientTable({
  patinetListAll,
  actionBodyTemplate,
  statusBodyTemplate,
  patientDetails,
}) {
  const dispatch = useDispatch();
  const navigate = useRouter();

  const priorityOptions = [
    {
      value: "Urgent",
      label: (
        <>
          <i className={visitStyles.name_missed}>{SVGICON.alert}</i> Urgent{" "}
        </>
      ),
    },
    {
      value: "High",
      label: (
        <>
          <i className={visitStyles.name_missed}>{SVGICON.alert}</i> High{" "}
        </>
      ),
    },
    {
      value: "Normal",
      label: (
        <>
          <i className={visitStyles.name_missed}>{SVGICON.alert}</i> Normal{" "}
        </>
      ),
    },
    {
      value: "Low",
      label: (
        <>
          <i className={visitStyles.name_missed}>{SVGICON.alert}</i> Low{" "}
        </>
      ),
    },
  ];

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: null,
  });
  const [hoveredAvatar, setHoveredAvatar] = useState(null);
  const [selectedPriority, setSelectedPriority] = useState([]);

  const handlePriorityChange = (patientId, selectedValue) => {
    setSelectedPriority((prev) => ({ ...prev, [patientId]: selectedValue }));
  };

  const handleAvatarHover = (data) => {
    setHoveredAvatar(data);
  };

  const handleAvatarClick = (data) => {
    gotoPatientDetails(data);
  };

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

  const TickMark = () => (
    <div style={{ marginLeft: "5pc", textAlign: "end" }}>✓</div>
  );

  const renderRows = () => {
    return patinetListAll?.map((data, index) => (
      <tr key={index}>
        <td
          className={TableStyle.firstTdBorder}
          onClick={handleTableRowClick}
        >
          {data.patientId}
        </td>
        <td
          className={TableStyle.childBorder}
          onClick={handleTableRowClick}
        >
          {data.patientName}
        </td>
        <td
          className={TableStyle.childBorder}
          onClick={handleTableRowClick}
        >
          {data.dueDate
            ? moment(data.dueDate).format("MM-DD-YYYY")
            : "MM-DD-YYYY"}
        </td>
        <td
          className={TableStyle.childBorder}
          onClick={handleTableRowClick}
        >
          {data.lastModifiedDate
            ? moment(data.lastModifiedDate).format("MM-DD-YYYY")
            : "MM-DD-YYYY"}
        </td>
        <td
          className={TableStyle.childBorder}
          onClick={handleTableRowClick}
        >
          {data.allocatedOn
            ? moment(data.allocatedOn).format("MM-DD-YYYY")
            : "MM-DD-YYYY"}
        </td>
        <td className={TableStyle.childBorder}>
          <Tooltip title="Uvais">
            <Avatar
              style={{
                backgroundColor: "#fde3cf",
                color: "#f56a00",
                cursor: "pointer",
              }}
            >
              U
            </Avatar>
          </Tooltip>
        </td>
        <td className={TableStyle.childBorder}>
          <AntSelect
            options={priorityOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
            className="custom-ant-select"
            showSearch={true}
            value={selectedPriority[data.patientId]}
            onChange={(value) =>
              handlePriorityChange(data.patientId, value)
            }
            style={{ width: "100%" }}
          />
        </td>
        <td
          className={TableStyle.childBorder}
          onClick={handleTableRowClick}
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
            <th
              onClick={() => requestSort("lastModifiedDate")}
            >
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
            <th>ALLOCATED USER</th>
            <th>PRIORITY</th>
            <th>STATUS</th>
          </tr>
        </thead>
        <tbody>{renderRows()}</tbody>
      </table>
    </div>
  );
}

export default PatientTable;
