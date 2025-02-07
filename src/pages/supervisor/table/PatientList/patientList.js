import React, { useState } from "react";
import moment from "moment";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import {
  notification,
  Select as AntSelect,
  Empty,
  Tooltip,
  Popover,
} from "antd";
import TableStyle from "../../../../components/table/table.module.css";
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  InfoCircleFilled,
} from "@ant-design/icons";
import {
  priorityOptions,
  renderUserPrfoileAvatar,
  sortFunction,
} from "../../../../components/headerFilters/functions";
import { removeStorage, setStorage } from "../../../../utils/storages";
import { truncateString } from "../../../../components/patientDetails/details/components/function/ReusableFunctions";
import styles from "../../../reviewer/report/report.module.css";
import Legends from "../../../../components/legends";

function PatientTable({
  patinetListAll,
  statusBodyTemplate,
  patientDetails,
  setSort,
  page,
  sortDueOrder,
  setSortDueOrder,
  sortCompleteOrder,
  setSortCompleteOrder,
  sortAuditOrder,
  setSortAuditOrder,
  params,
  getRoutedData,
  activeFilters,
  setActiveFilters,
  handlePriorityChange,
  priority,
  bullets,
  badges,
}) {
  const navigate = useRouter();

  const gotoPatientDetails = (data) => {
    if (data.computing === 2) {
      const controller = new AbortController();
      const { signal } = controller;
      controller.abort();
      setStorage("patientId", data.patientId);
      removeStorage("SuperVisorfilter");
      setStorage("routeBackTo", "/supervisor/auditing");

      getRoutedData(params);
      navigate.push(
        {
          pathname: "/supervisor/patients/details",
          // query: params,
        }
        // "/supervisor/patients/details"
      );
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
      <tr>
        <td colSpan="9">
          <Empty />
        </td>
      </tr>
    ) : (
      patinetListAll?.map((data, index) => (
        <tr key={index}>
          <td
            className={TableStyle.firstTdBorder}
            onClick={handleTableRowClick}
          >
            <div>
              {" "}
              <Tooltip title={data.patientId}>
                {" "}
                {truncateString(data.patientId, 40)}
              </Tooltip>
            </div>
            <div> {data.patientName ? data.patientName : ""}</div>
          </td>
          <td className={TableStyle.childBorder} onClick={handleTableRowClick}>
            {data.batchName ? data.batchName  : "---" }
          </td>
          <td
            className={`text-truncate ${TableStyle.childBorder}`}
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
              "---"
            )}
          </td>
          <td
            className={`text-truncate ${TableStyle.childBorder}`}
            style={{ textAlign: "center", textAlign: "center" }}
            onClick={handleTableRowClick}
          >
            {data?.accuracyScore?.correctCount
              ? data?.accuracyScore?.correctCount
              : "---"}
          </td>
          <td
            className={`text-truncate ${TableStyle.childBorder}`}
            style={{ textAlign: "center" }}
            onClick={handleTableRowClick}
          >
            {data?.accuracyScore?.wrongCount
              ? data?.accuracyScore?.wrongCount
              : " ---"}
          </td>

          <td
            className={TableStyle.childBorder}
            onClick={handleTableRowClick}
            style={{ padding: "0px 50px" }}
          >
            {data.auditAllocatedDate
              ? moment(data.auditAllocatedDate).format("MM-DD-YYYY")
              : "---"}
          </td>
          <td
            className={TableStyle.childBorder}
            onClick={handleTableRowClick}
            style={{ padding: "0px 30px" }}
          >
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
              value={
                data?.priority
                  ? data?.priority
                  : priority?.patientId === data?.patientId
                  ? priority?.selectedValue
                  : "Set Priority"
              }
              onChange={(value) => {
                handlePriorityChange(data?.patientId, value);
              }}
              style={{ width: "80%" }}
            />
          </td>

          <td
            className={`${TableStyle.childBorder} text-center `}
            onClick={handleTableRowClick}
          >
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
            <th className="text-truncate">BATCH NAME</th>
            <th> REVIEWER</th>
            <th style={{ cursor: "pointer", textAlign: "center" }}>
              <Tooltip placement="bottom" title="REVIEWER CHANGES">
                RC
              </Tooltip>
            </th>
            <th style={{ cursor: "pointer", textAlign: "center" }}>
              <Tooltip placement="bottom" title="REVIEWER CHANGES REJECTION">
                RCR
              </Tooltip>
            </th>

            <th
              className="text-truncate"
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
              className="text-truncate"
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
              className="text-truncate"
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

            <th className="text-truncate">AUDIT ALLOCATED BY</th>
            <th className="text-truncate">PRIORITY</th>
            {/* <th className={`text-truncate`}>AUDIT STATUS</th> */}
            <th className="text-truncate" style={{ textAlign: "center" }}>
              <div className="d-flex align-items-center justify-content-center gap-2">
                AUDIT STATUS
                <span style={{ cursor: "pointer" }}>
                  <Popover
                    content={
                      <>
                        <Legends
                          bullets={bullets}
                          display="block"
                          padding="0 0px 10px 0"
                        />
                        {badges?.length > 0 &&
                          badges?.map((data) => (
                            <div style={{ marginBottom: "10px" }}>
                              <Image src={data.src} width={20} height={30} />
                              <span style={{ marginLeft: "5px" }}>
                                {data?.name}
                              </span>
                            </div>
                          ))}
                      </>
                    }
                    trigger={["click"]}
                    placement="bottom"
                  >
                    <InfoCircleFilled
                      style={{ color: "#fff", fontSize: "14px" }}
                    />
                  </Popover>
                </span>
              </div>
            </th>
            {/* <th className="text-truncate" style={{ textAlign: "center" }}>
              <div className="d-flex align-items-center justify-content-center">
                AUDIT STATUS
                <Popover
                  content={
                    <>
                      <Legends
                        bullets={bullets}
                        display="block"
                        padding="0 0px 10px 0"
                      />
                      {badges?.length > 0 &&
                        badges?.map((data) => (
                          <div style={{ marginBottom: "10px" }}>
                            <Image src={data.src} width={20} height={30} />
                            <span style={{ marginLeft: "5px" }}>
                              {data?.name}
                            </span>
                          </div>
                        ))}
                    </>
                  }
                  trigger={["click"]}
                  placement="bottom"
                >
                  <div className="cursor-pointer">
                    <div className={styles.iconBorder}>
                      <InfoCircleFilled style={{ color: "#fff" }} />
                    </div>
                  </div>
                </Popover>
              </div>
            </th> */}
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
    </div>
  );
}

export default PatientTable;
