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
      value: "URGENT",
      label: (
        <>
          <i>{SVGICON.alert}</i>{" "}
          <span style={{ fontSize: "13px", color:'red' }}>Urgent</span>{" "}
        </>
      ),
    },
    {
      value: "HIGH",
      label: (
        <>
          <i className={TableStyle.highFlag}>{SVGICON.alert}</i>
          <span style={{ fontSize: "13px", color:'#cf940a'  }}>High</span>{" "}
        </>
      ),
    },
    {
      value: "NORMAL",
      label: (
        <>
          <i className={TableStyle.normalFlag}>{SVGICON.alert}</i>
          <span style={{ fontSize: "13px", color:"#4466ff "}}>Normal</span>{" "}
        </>
      ),
    },
    {
      value: "LOW",
      label: (
        <>
          <i className={TableStyle.lowFlag}>{SVGICON.alert}</i>{" "}
          <span style={{ fontSize: "13px", color:"#87909e" }}>Low</span>{" "}
        </>
      ),
    },
  ];
  const getPriorityLabel = (priority) => {
    const priorityMap = {
      HIGH: (
        <>
          <i className={TableStyle.highFlag}>{SVGICON.alert}</i>
          <span style={{ fontSize: "13px" }}>High</span>{" "}
        </>
      ),
      URGENT: (
        <>
          <i>{SVGICON.alert}</i>{" "}
          <span style={{ fontSize: "13px" }}>Urgent</span>{" "}
        </>
      ),
      LOW: (
        <>
          <i className={TableStyle.lowFlag}>{SVGICON.alert}</i>{" "}
          <span style={{ fontSize: "13px" }}>Low</span>{" "}
        </>
      ),
      NORMAL: (
        <>
          <i className={TableStyle.normalFlag}>{SVGICON.alert}</i>
          <span style={{ fontSize: "13px" }}>Normal</span>{" "}
        </>
      ),
    };

    return priorityMap[priority] || priorityMap.NORMAL;
  };

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: null,
  });
  const [hoveredAvatar, setHoveredAvatar] = useState(null);
  const [selectedPriority, setSelectedPriority] = useState({
    id: "meat-01",
    value: "HIGH",
  });

  const handlePriorityChange = (patientId, selectedValue) => {
    setSelectedPriority((prev) => ({
      ...prev,
      id: patientId,
      value: selectedValue,
    }));
  };

  const handleAvatarHover = (data) => {
    setHoveredAvatar(data);
  };

  const handleAvatarClick = (data) => {
    gotoPatientDetails(data);
  };

  const requestSort = (key) => {
    console.log(key)
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

  console.log(selectedPriority);
  const renderRows = () => {
    return patinetListAll?.map((data, index) => (
      <tr key={index}>
        <td className={TableStyle.firstTdBorder} onClick={handleTableRowClick}>
          {data.patientId}
        </td>
        <td className={TableStyle.childBorder} onClick={handleTableRowClick}>
          {data.patientName}
        </td>
        <td className={TableStyle.childBorder} onClick={handleTableRowClick}>
          {data.allocatedOn
            ? moment(data.allocatedOn).format("MM-DD-YYYY")
            : "---"}
        </td>
        <td className={TableStyle.childBorder} onClick={handleTableRowClick}>
          {data.dueDate
            ? moment(data.dueDate).format("MM-DD-YYYY")
            : "---"}
        </td>
        <td className={TableStyle.childBorder} onClick={handleTableRowClick}>
          {data.processedStatus === "COMPLETED"
            ? moment(data.processedDate).format("MM-DD-YYYY")
            : "---"}
        </td>
      
        <td className={TableStyle.childBorder}>
          <Tooltip title={data.allocatedBy ? data.allocatedBy : "null"}>
            <Avatar
              style={{
                backgroundColor: "#fde3cf",
                color: "#f56a00",
                cursor: "pointer",
              }}
            >
              {data.allocatedBy
                ? data.allocatedBy.slice(0, 2).toUpperCase()
                : "N"}
            </Avatar>
          </Tooltip>
        </td>
        <td className={TableStyle.childBorder}>
          <AntSelect
            options={priorityOptions}
            placeholder="Set priority"
            className={`custom-ant-select ${TableStyle.customAntSelect}`}
            showSearch={false}
            defaultValue={
              data?.priority
                ? data.priority
                : {
                    label: (
                      <>
                        <i className={TableStyle.lowFlag}>{SVGICON.alert}</i>{" "}
                        <span style={{ fontSize: "13px", color:"#87909e" }}>Low</span>{" "}
                      </>
                    ),
                    value: "low", // Set the actual value based on your priorityOptions
                  }
            }
          />
        </td>

        <td className={TableStyle.childBorder} onClick={handleTableRowClick}>
          {statusBodyTemplate(data)}
        </td>
        <td className={TableStyle.lastBorder} >{actionBodyTemplate(data)}</td>
      </tr>
    ));
  };
  console.log(selectedPriority, "priority");

  return (
    <div className={TableStyle.classContaineer}>
      <table className={TableStyle.classTable}>
        <thead className={TableStyle.classThead}>
          <tr>
            <th>PATIENT ID</th>
            <th>PATIENT NAME</th>
            <th>ALLOCATED DATE</th>
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
           
            <th>ALLOCATED BY</th>
            <th>PRIORITY</th>
            <th>STATUS</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody >{renderRows()}</tbody>
      </table>
    </div>
  );
}

export default PatientTable;
