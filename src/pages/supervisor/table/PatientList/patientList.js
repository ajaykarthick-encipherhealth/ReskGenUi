import React, { useState } from "react";
import moment from "moment";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { notification, Select as AntSelect, Empty, Tooltip } from "antd";
import TableStyle from "../../../../components/table/table.module.css";
import { SVGICON } from "../../../../jsx/constant/theme";
import { getPriorityChange } from "../../../../store/actions/PatientsActions";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import {
  renderUserPrfoileAvatar,
  sortFunction,
} from "../../../../components/headerFilters/functions";

function PatientTable({
  patinetListAll,
  statusBodyTemplate,
  patientDetails,
  setSort,
}) {
  const dispatch = useDispatch();
  const navigate = useRouter();
  const [sortDueOrder, setSortDueOrder] = useState("DESC");
  const [sortCompleteOrder, setSortCompleteOrder] = useState("DESC");
  const [sortAuditOrder, setSortAuditOrder] = useState("DESC");

  const priorityOptions = [
    {
      value: "URGENT",
      label: (
        <>
          <i>{SVGICON.alert}</i>{" "}
          <span style={{ fontSize: "13px", color: "red" }}>Urgent</span>{" "}
        </>
      ),
    },
    {
      value: "HIGH",
      label: (
        <>
          <i className={TableStyle.highFlag}>{SVGICON.alert}</i>
          <span style={{ fontSize: "13px", color: "#cf940a" }}>High</span>{" "}
        </>
      ),
    },
    {
      value: "NORMAL",
      label: (
        <>
          <i className={TableStyle.normalFlag}>{SVGICON.alert}</i>
          <span style={{ fontSize: "13px", color: "#4466ff " }}>
            Normal
          </span>{" "}
        </>
      ),
    },
    {
      value: "LOW",
      label: (
        <>
          <i className={TableStyle.lowFlag}>{SVGICON.alert}</i>{" "}
          <span style={{ fontSize: "13px", color: "#87909e" }}>Low</span>{" "}
        </>
      ),
    },
  ];

  const handlePriorityChange = (patientId, selectedValue) => {
    setSelectedPriority((prev) => ({
      ...prev,
      id: patientId,
      value: selectedValue,
    }));
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

  const renderRows = () => {
    return patinetListAll?.length === 0 ? (
      <Empty />
    ) : (
      patinetListAll?.map((data, index) => (
        <tr key={index}>
          <td
            className={TableStyle.firstTdBorder}
            onClick={handleTableRowClick}
          >
            <div> {data.patientId ? data.patientId : "---"} </div>
            <div> {data.patientName ? data.patientName : ""}</div>
          </td>

          <td
            className={TableStyle.childBorder}
            style={{ textAlign: "center" }}
            onClick={handleTableRowClick}
          >
            {data.patientAllocatedFirstName ||
            data.patientAllocatedLastName ||
            data?.patientAllocatedProfileImage ? (
              <div style={{ display: "flex", alignItems: "center" }}>
                {" "}
                <span style={{ marginRight: "10px" }}>
                  {" "}
                  {renderUserPrfoileAvatar(
                    data.patientAllocatedFirstName,
                    data.patientAllocatedLastName,
                    data?.patientAllocatedProfileImage,
                    "header"
                  )}
                </span>
                <span>
                  {data.patientAllocatedFirstName}{" "}
                  {data.patientAllocatedLastName}
                </span>
              </div>
            ) : (
              <div style={{ textAlign: "center" }}>---</div>
            )}
          </td>
          <td 
            className={TableStyle.childBorder}
            style={{ textAlign: "center", textAlign:"center" }}
            onClick={handleTableRowClick}
          >
            {data?.accuracyScore?.correctCount
              ? data?.accuracyScore?.correctCount
              :<div   style={{ textAlign: "center" }}>---</div>}
          </td>
          <td 
            className={TableStyle.childBorder}
            style={{ textAlign: "center" }}
            onClick={handleTableRowClick}
          >
            {data?.accuracyScore?.wrongCount
              ? data?.accuracyScore?.wrongCount
              : <div   style={{ textAlign: "center", textAlign:"center" }}>---</div>}
          </td>

          <td className={TableStyle.childBorder} onClick={handleTableRowClick}>
            {data.auditAllocatedDate
              ? moment(data.auditAllocatedDate).format("MM-DD-YYYY")
              : "---"}
          </td>
          <td className={TableStyle.childBorder} onClick={handleTableRowClick}>
            {data.auditDueDate
              ? moment(data.auditDueDate).format("MM-DD-YYYY")
              : "---"}
          </td>

          <td className={TableStyle.childBorder} onClick={handleTableRowClick}>
            {data.auditedDate
              ? moment(data.auditedDate).format("MM-DD-YYYY")
              : "---"}
          </td>
          <td
            className={TableStyle.childBorder}
            style={{ textAlign: "center" }}
            onClick={handleTableRowClick}
          >
            {data.auditAllocatedByFirstName ||
            data.auditAllocatedByLastName ||
            data?.auditAllocatedByProfileImage ? (
              <div style={{ display: "flex", alignItems: "center" }}>
                {" "}
                <span style={{ marginRight: "10px" }}>
                  {" "}
                  {renderUserPrfoileAvatar(
                    data.auditAllocatedByFirstName,
                    data.auditAllocatedByLastName,
                    data?.auditAllocatedByProfileImage,
                    "header"
                  )}
                </span>
                <span>
                  {data.auditAllocatedByFirstName}{" "}
                  {data.auditAllocatedByLastName}
                </span>
              </div>
            ) : (
              <div style={{ textAlign: "center" }}>---</div>
            )}
          </td>
          <td className={TableStyle.childBorder} style={{ width: "200px" }}>
            <AntSelect
              options={priorityOptions}
              placeholder="Set priority"
              className={`custom-ant-select ${TableStyle.customAntSelect}`}
              showSearch={false}
              defaultValue={data?.priority ? data.priority : "Set Priority"}
              disabled={!data?.priority ? true : false}
              onChange={(value) => {
                handlePriorityChange(data?.patientId, value);
                dispatch(
                  getPriorityChange(
                    data?.patientId,
                    dayjs(data?.lastModifiedDate)?.format("YYYY"),
                    value
                  )
                );
              }}
              style={{ width: "80%" }}
            />
          </td>

          <td className={TableStyle.childBorder} onClick={handleTableRowClick}>
            {statusBodyTemplate(data)}
          </td>
        </tr>
      ))
    );
  };
  return (
    <div className={TableStyle.classContaineer}>
      <table className={TableStyle.classTable}>
        <thead className={TableStyle.classThead}>
          <tr>
            <th>PATIENTS</th>
            <th style={{paddingLeft:'60px'}}>REVIEWER</th>
            <th  style={{ cursor: "pointer", textAlign:"center" }}>
              <Tooltip placement="bottom" title="REVIEWER CHANGES">
                RC
              </Tooltip>
            </th>
            <th  style={{ cursor: "pointer", textAlign:"center" }}>
              {" "}
              <Tooltip placement="bottom" title="REVIEWER CHANGES REJECTION">
                RCR
              </Tooltip>
            </th>

            <th
              onClick={() => {
                sortFunction(
                  sortAuditOrder,
                  setSortAuditOrder,
                  setSort,
                  "auditAllocatedDate"
                );
              }}
            >
              AUDIT ALLOCATED DATE
              <span style={{ padding: "10px", cursor: "pointer" }}>
                {sortAuditOrder === "ASC" ? (
                  <ArrowUpOutlined />
                ) : (
                  <ArrowDownOutlined />
                )}
              </span>
            </th>
            <th
              onClick={() => {
                sortFunction(
                  sortDueOrder,
                  setSortDueOrder,
                  setSort,
                  "auditDueDate"
                );
              }}
            >
              AUDITED DUE DATE
              <span style={{ padding: "10px", cursor: "pointer" }}>
                {sortDueOrder === "ASC" ? (
                  <ArrowUpOutlined />
                ) : (
                  <ArrowDownOutlined />
                )}
              </span>
            </th>
            <th
              onClick={() => {
                sortFunction(
                  sortCompleteOrder,
                  setSortCompleteOrder,
                  setSort,
                  "auditedDate"
                );
              }}
            >
              AUDITED DATE
              <span style={{ padding: "10px", cursor: "pointer" }}>
                {sortCompleteOrder === "ASC" ? (
                  <ArrowUpOutlined />
                ) : (
                  <ArrowDownOutlined />
                )}
              </span>
            </th>

            <th  style={{ paddingLeft: "30px" }}>AUDIT ALLOCATED BY</th>
            <th style={{ paddingLeft: "30px" }}>PRIORITY</th>
            <th className={TableStyle.rowStyle2}>AUDIT STATUS</th>
          </tr>
        </thead>

        <tbody>
          {patinetListAll?.length <= 0 ? (
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

export default PatientTable;
