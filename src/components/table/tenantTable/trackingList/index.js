import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  InfoCircleFilled,
} from "@ant-design/icons";
import moment from "moment";
import {
  notification,
  Select as AntSelect,
  Empty,
  Tooltip,
  Popover,
} from "antd";
import TableStyle from "../../traclingTable.module.css";
import {
  priorityStatus,
  renderUserPrfoileAvatar,
  sortFunction,
} from "../../../headerFilters/functions";
import { renderSkeleton } from "../../../reuseableFunctions";
import { getStorage, setStorage } from "../../../../utils/storages";
import { actions as allActions } from "../../../../stores/admin/users";
import { actions as patientSyncActions } from "../../../../stores/tenantAdmin/patientSync";
import Legends from "../../../legends";
import styles from "../../../../pages/reviewer/report/report.module.css";
import { formatDateTime } from "../../../../utils/reusable";

function TrackingTable({
  patinetListAll,
  statusBodyTemplate,
  auditBodyTemplate,
  patientDetails,
  sortOrder,
  setSortOrder,
  setSort,
  page,
  loader,
  sortAuditOrder,
  setSortAuditOrder,
  sortDueOrder,
  setSortDueOrder,
  sortAuditDueOrder,
  setSortAuditDueOrder,
  getRoutedData,
  bulletsTitle,
  badgesTitle,
  bullets,
  badges,
}) {
  const navigate = useRouter();

  const gotoPatientDetails = (data) => {
    patientDetails(data);
    if (data.computing === 2) {
      const controller = new AbortController();
      const { signal } = controller;
      controller.abort();
      setStorage("patientId", data?.patientId);
      //       setStorage("fromPatientSync", false);
      var role = getStorage("userRole");
      // setStorage("fromPatientSync", false);
      if (role == "tenant_admin") {
        setStorage("patientId", data.patientId);
        setStorage("routeBackTo", "/tenantadmin/tracking");
        getRoutedData(page);
        // setStorage("isTenantAdminTracking", true);
        // setStorage("tenantAdminTrackingEncodedValue", JSON.stringify(page));
        navigate.push("/tenantadmin/tracking/details");
      } else {
        setStorage("isAdminTracking", true);
        setStorage("adminTrackingEncodedValue", JSON.stringify(page));
        navigate.push({
          pathname: "/admin/patients/details",
          // query: { ...page, isAdminTracking: true },
        });
      }
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
  const getMaskData = (value) => {
    if (value) {
      return value.split("").splice(0, 10).join("") + "....";
    }
  };
  const renderRows = () => {
    return patinetListAll?.map((data, index) => (
      <tr key={index}>
        <td
          className={TableStyle.firstTdBorder}
          style={{ padding: "2px 15px" }}
          onClick={handleTableRowClick}
          id={data.patientId}
          name={data.patientId}
        >
          <Tooltip title={data.patientId}>
            <div>{getMaskData(data.patientId)}</div>
          </Tooltip>
          <div className={TableStyle.name}> {data.patientName} </div>
        </td>
        <td
          className={TableStyle.childBorder}
          style={{ textAlign: "left", height: "100%" }}
          onClick={handleTableRowClick}
          id={data.patientId}
          name={data.patientId}
        >
          {data.allocatedByFirstName ||
          data.allocatedByLastName ||
          data.allocatedByProfileImage ? (
            <div
              style={{
                width: "80%",
                margin: "auto",
                display: "flex",
                alignItems: "center",
              }}
            >
              <span style={{ marginRight: "10px" }}>
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
          <div
            className="text-center"
            style={{
              width: "80%",
              margin: "auto",
            }}
          >
            {data.allocatedOn
              ? formatDateTime({date: data.allocatedOn})
              : "---"}
          </div>
        </td>
        {/* <td
          className={TableStyle.childBorder}
          onClick={handleTableRowClick}
          style={{ textAlign: "center" }}
          id={data.patientId}
          name={data.patientId}
        >
          {data.allocatedOn
            ? moment(data.allocatedOn).format("MM-DD-YYYY")
            : "---"}
        </td> */}
        <td
          className={TableStyle.childBorder}
          style={{ textAlign: "left" }}
          onClick={handleTableRowClick}
          id={data.patientId}
          name={data.patientId}
        >
          {data.patientAllocatedFirstName ||
          data.patientAllocatedLastName ||
          data.patientAllocatedProfileImage ? (
            <div
              className="text-truncate"
              style={{
                width: "95%",
                margin: "auto",
                display: "flex",
                alignItems: "center",
              }}
            >
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
          <div className="text-center" style={{ width: "95%", margin: "auto" }}>
            {data.processedDate ? formatDateTime({date: data.processedDate}) : "---"}
          </div>
        </td>

        {/* <td
          className={TableStyle.childBorder}
          onClick={handleTableRowClick}
          style={{ textAlign: "center" }}
          id={data.patientId}
          name={data.patientId}
        >
          {data.processedDate
            ? moment(data.processedDate).format("MM-DD-YYYY")
            : "---"}
        </td> */}
        <td
          className={`${TableStyle.childBorder} text-truncate`}
          style={{ textAlign: "left" }}
          onClick={handleTableRowClick}
          id={data.patientId}
          name={data.patientId}
        >
          {data.auditAllocatedByFirstName ||
          data.auditAllocatedByLastName ||
          data.auditAllocatedByProfileImage ? (
            <div
              style={{
                width: "68%",
                margin: "auto",
                display: "flex",
                alignItems: "center",
              }}
            >
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
          <div className="text-center" style={{ width: "68%", margin: "auto" }}>
            {" "}
            {data.auditAllocatedDate
              ? formatDateTime({date: data.auditAllocatedDate})
              : "---"}
          </div>
        </td>
        {/* <td
          className={TableStyle.childBorder}
          onClick={handleTableRowClick}
          style={{ textAlign: "center" }}
          id={data.patientId}
          name={data.patientId}
        >
          {data.auditAllocatedDate
            ? moment(data.auditAllocatedDate).format("MM-DD-YYYY")
            : "---"}
        </td> */}

        <td
          className={`text-truncate ${TableStyle.childBorder}`}
          style={{ textAlign: "left" }}
          onClick={handleTableRowClick}
          id={data.patientId}
          name={data.patientId}
        >
          {data.auditedAssignedFirstName ||
          data.auditedAssignedLastName ||
          data.auditedAssignedProfileImage ? (
            <div style={{ display: "flex", alignItems: "center" }}>
              {" "}
              <span style={{ marginRight: "10px" }}>
                {" "}
                {renderUserPrfoileAvatar(
                  data.auditedAssignedFirstName,
                  data.auditedAssignedLastName,
                  data.auditedAssignedProfileImage,
                  "header"
                )}
              </span>
              <span>
                {data.auditedAssignedFirstName} {data.auditedAssignedLastName}
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
          id={data.patientId}
          name={data.patientId}
        >
          {data.auditedDate ? formatDateTime({date: data.auditedDate}) : "---"}
        </td>
        <td
          className={TableStyle.childBorder}
          onClick={handleTableRowClick}
          style={{ textAlign: "center" }}
          id={data.patientId}
          name={data.patientId}
        >
          {data?.priority ? priorityStatus(data?.priority) : "--"}
        </td>
        <td
          className={TableStyle.lastBorder}
          onClick={handleTableRowClick}
          style={{ textAlign: "center" }}
          id={data.patientId}
          name={data.patientId}
        >
          {statusBodyTemplate(data)}
        </td>
        <td
          className={TableStyle.lastBorder}
          onClick={handleTableRowClick}
          style={{ textAlign: "center" }}
          id={data.patientId}
          name={data.patientId}
        >
          {auditBodyTemplate(data)}
        </td>
      </tr>
    ));
  };

  return (
    <div className={TableStyle.classContaineer}>
      {loader ? (
        renderSkeleton()
      ) : (
        <table className={TableStyle.classTable}>
          <thead className={TableStyle.tenantAdminclassThead}>
            <tr>
              <th>PATIENTS</th>
              <th
                style={{ textAlign: "left", paddingLeft: "20px" }}
                className="text-truncate"
                onClick={() => {
                  sortFunction(sortOrder, setSortOrder, setSort, "allocatedOn");
                }}
              >
                ALLOCATED BY | DATE
                {sortOrder === "ASC" ? (
                  <ArrowUpOutlined />
                ) : (
                  <ArrowDownOutlined />
                )}
              </th>
              {/* <th
                id="allocated-Date"
                name="allocated-Date"
                style={{
                  cursor: "pointer",
                  paddingLeft: "15px",
                  textAlign: "center",
                }}
                onClick={() => {
                  sortFunction(sortOrder, setSortOrder, setSort, "allocatedOn");
                }}
                className="text-truncate"
              >
                ALLOCATED DATE{" "}
                {sortOrder === "ASC" ? (
                  <ArrowUpOutlined />
                ) : (
                  <ArrowDownOutlined />
                )}
              </th> */}
              <th
                onClick={() => {
                  sortFunction(
                    sortDueOrder,
                    setSortDueOrder,
                    setSort,
                    "dueDate"
                  );
                }}
              >
                REVIEWER | DATE
                {sortDueOrder === "ASC" ? (
                  <ArrowUpOutlined />
                ) : (
                  <ArrowDownOutlined />
                )}
              </th>

              {/* <th
                id="reviewer-date"
                name="reviewer-date"
                onClick={() => {
                  sortFunction(
                    sortDueOrder,
                    setSortDueOrder,
                    setSort,
                    "dueDate"
                  );
                }}
                style={{ textAlign: "center" }}
                className="text-truncate"
              >
                REVIEWED DATE
                <span
                  style={{
                    cursor: "pointer",
                    paddingLeft: "3px",
                    textAlign: "center",
                  }}
                >
                  {sortDueOrder === "ASC" ? (
                    <ArrowUpOutlined />
                  ) : (
                    <ArrowDownOutlined />
                  )}
                </span>
              </th> */}
              <th
                style={{ textAlign: "center" }}
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
                AUDIT ALLOCATED BY | DATE
                {sortAuditOrder === "ASC" ? (
                  <ArrowUpOutlined />
                ) : (
                  <ArrowDownOutlined />
                )}
              </th>
              {/* <th
                id="audit-allocated"
                name="audit-allocated"
                onClick={() => {
                  sortFunction(
                    sortAuditOrder,
                    setSortAuditOrder,
                    setSort,
                    "auditAllocatedDate"
                  );
                }}
                style={{ textAlign: "center" }}
                className="text-truncate"
              >
                AUDIT ALLOCATED DATE
                <span
                  style={{
                    cursor: "pointer",
                    paddingLeft: "3px",
                    textAlign: "center",
                  }}
                >
                  {sortAuditOrder === "ASC" ? (
                    <ArrowUpOutlined />
                  ) : (
                    <ArrowDownOutlined />
                  )}
                </span>
              </th> */}
              <th style={{ textAlign: "center" }} className="text-truncate">
                SUPERVISOR
              </th>
              <th
                id="audited-date"
                name="audited-date"
                onClick={() => {
                  sortFunction(
                    sortAuditDueOrder,
                    setSortAuditDueOrder,
                    setSort,
                    "auditDueDate"
                  );
                }}
                style={{ textAlign: "center" }}
                className="text-truncate"
              >
                AUDITED DATE
                <span
                  style={{
                    cursor: "pointer",
                    paddingLeft: "3px",
                    textAlign: "center",
                  }}
                >
                  {sortAuditDueOrder === "ASC" ? (
                    <ArrowUpOutlined />
                  ) : (
                    <ArrowDownOutlined />
                  )}
                </span>
              </th>
              <th>PRIORITY</th>
              <th style={{ textAlign: "center" }}>
                <div className="text-truncate d-flex align-items-center justify-content-center gap-2">
                  PROCESSED STATUS
                  <span style={{ cursor: "pointer" }}>
                    <Popover
                      content={
                        <>
                          <Legends display="block" padding="0 0px 10px 0" />
                          {bulletsTitle && (
                            <label
                              className={styles.label}
                              style={{ fontWeight: "700" }}
                            >
                              {bulletsTitle}
                            </label>
                          )}
                          <Legends
                            bullets={bullets}
                            display="block"
                            padding="0 0px 10px 0"
                          />
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
              <th style={{ textAlign: "center" }}>
                <div className="text-truncate d-flex align-items-center justify-content-center gap-2">
                  AUDITED STATUS
                  <span style={{ cursor: "pointer" }}>
                    <Popover
                      content={
                        <>
                          <Legends display="block" padding="0 0px 10px 0" />
                          {badgesTitle && (
                            <label
                              className={styles.label}
                              style={{ fontWeight: "700" }}
                            >
                              {badgesTitle}
                            </label>
                          )}
                          <Legends
                            bullets={badges}
                            display="block"
                            padding="0 0px 10px 0"
                          />
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
            </tr>
          </thead>

          <tbody style={{ overflowX: "scroll" }}>
            {!loader && patinetListAll?.length <= 0 ? (
              <tr>
                <td colSpan="11">
                  <Empty />
                </td>
              </tr>
            ) : (
              renderRows()
            )}
          </tbody>
        </table>
      )}
      <div></div>
    </div>
  );
}

const connector = connect((state) => ({}), {
  patientDetails: allActions.getPatientDetails,
  getRoutedData: patientSyncActions.getRoutedData,
});
export default connector(TrackingTable);
