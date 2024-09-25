import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import moment from "moment";
import { notification, Select as AntSelect, Empty } from "antd";
import TableStyle from "../../traclingTable.module.css";
import {
  renderUserPrfoileAvatar,
  sortFunction,
} from "../../../headerFilters/functions";
import { getStorage, setStorage } from "../../../../utils/storages";

function TrackingTable({
  patinetListAll,
  statusBodyTemplate,
  auditBodyTemplate,
  patientDetails,
  sortOrder,
  setSortOrder,
  setSort,
  page,
  sortAuditOrder,
  setSortAuditOrder,
  sortDueOrder,
  setSortDueOrder,
  sortAuditDueOrder,
  setSortAuditDueOrder,
}) {
  const [detailsContent, setDetailsContent] = useState(patinetListAll);
  const dispatch = useDispatch();
  const navigate = useRouter();

  const gotoPatientDetails = (data) => {
    dispatch(patientDetails(data));
    if (data.computing === 2) {
      const controller = new AbortController();
      const { signal } = controller;
      controller.abort();
      setStorage("patientId", data?.patientId);
      var role = getStorage("role");
      if (role == "tenant_admin") {
        navigate.push({
          pathname: "/tenantAdmin/patients/details",
          query: { ...page, isTenantAdminTracking: true },
        });
      } else {
        navigate.push({
          pathname: "/admin/patients/details",
          query: { ...page, isAdminTracking: true },
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

  useEffect(() => {
    setDetailsContent(patinetListAll);
  }, [patinetListAll]);

  const renderRows = () => {
    return patinetListAll?.map((data, index) => (
      <tr key={index}>
        <td className={TableStyle.firstTdBorder} onClick={handleTableRowClick}>
          <div> {data.patientId} </div> <div> {data.patientName} </div>
        </td>

        <td
          className={TableStyle.childBorder}
          style={{ textAlign: "left" }}
          onClick={handleTableRowClick}
        >
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
        <td
          className={TableStyle.childBorder}
          onClick={handleTableRowClick}
          style={{ textAlign: "center" }}
        >
          {data.allocatedOn
            ? moment(data.allocatedOn).format("MM-DD-YYYY")
            : "---"}
        </td>

        <td
          className={TableStyle.childBorder}
          style={{ textAlign: "left" }}
          onClick={handleTableRowClick}
        >
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
          style={{ textAlign: "left" }}
          onClick={handleTableRowClick}
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
        >
          {data.auditedDate
            ? moment(data.auditedDate).format("MM-DD-YYYY")
            : "---"}
        </td>

        <td
          className={TableStyle.childBorder}
          style={{ textAlign: "left" }}
          onClick={handleTableRowClick}
        >
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
          {data?.processedDate
            ? moment(data?.processedDate).format("MM-DD-YYYY")
            : "---"}
        </td>

        <td
          className={TableStyle.lastBorder}
          onClick={handleTableRowClick}
          style={{ textAlign: "center" }}
        >
          {statusBodyTemplate(data)}
        </td>
        <td
          className={TableStyle.lastBorder}
          onClick={handleTableRowClick}
          style={{ textAlign: "center" }}
        >
          {auditBodyTemplate(data)}
        </td>
      </tr>
    ));
  };

  return (
    <div className={TableStyle.classContaineer}>
      <table className={TableStyle.classTable}>
        <thead className={TableStyle.classThead}>
          <tr>
            <th>PATIENTS</th>
            <th
              style={{ textAlign: "left", paddingLeft: "20px" }}
              className="text-truncate"
            >
              ALLOCATED BY
            </th>
            <th
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
            </th>
            <th style={{ textAlign: "center" }} className="text-truncate">
              AUDIT ALLOCATED BY
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
            </th>
            <th style={{ textAlign: "center" }} className="text-truncate">
              SUPERVISOR
            </th>
            <th
              onClick={() => {
                sortFunction(
                  sortAuditDueOrder,
                  setSortAuditDueOrder,
                  setSort,
                  "auditedDate"
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
            <th style={{ paddingLeft: "45px" }} className="text-truncate">
              REVIEWER
            </th>

            <th
              onClick={() => {
                sortFunction(
                  sortDueOrder,
                  setSortDueOrder,
                  setSort,
                  "processedDate"
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
            </th>

            <th style={{ textAlign: "center" }} className="text-truncate">
              PROCESSED STATUS
            </th>
            <th style={{ textAlign: "center" }} className="text-truncate">
              AUDIT STATUS
            </th>
          </tr>
        </thead>

        <tbody>
          {detailsContent?.length <= 0 ? (
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
      <div></div>
    </div>
  );
}

export default TrackingTable;
