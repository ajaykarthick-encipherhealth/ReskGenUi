import React from "react";
import moment from "moment";
import { useRouter } from "next/router";
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
import { setStorage } from "../../../../utils/storages";
import { truncateString } from "../../../../components/patientDetails/details/components/function/ReusableFunctions";
import Legends from "../../../../components/legends";
import { formatDateTime } from "../../../../utils/reusable";

function PatientTable({
  patinetListAll,
  statusBodyTemplate,
  setSort,
  handleTableRowClick,
  handlePriorityChange,
  priority,
  bullets,
  badges,
  sort,
}) {


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
            {data.batchName ? data.batchName : "---"}
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
              ? formatDateTime({date: data.auditAllocatedDate})
              : "---"}
          </td>
          <td
            className={TableStyle.childBorder}
            onClick={handleTableRowClick}
            style={{ padding: "0px 30px" }}
          >
            {data.auditDueDate ? formatDateTime({date: data.auditDueDate}) : "---"}
          </td>

          <td className={TableStyle.childBorder} onClick={handleTableRowClick}>
            {data.auditedDate ? formatDateTime({date: data.auditedDate}) : "---"}
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
  const handleSort = (field) => {
    setSort((prev) => {
      const newSortDir = prev[field].sortDir === "DESC" ? "ASC" : "DESC";
      return {
        ...prev,
        [field]: { sortDir: newSortDir, sortField: field },
        sort: { sortDir: newSortDir, sortField: field },
      };
    });
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
              onClick={() => handleSort("auditAllocatedDate")}
            >
              AUDIT ALLOCATED DATE
              <span style={{ padding: "10px", cursor: "pointer" }}>
                {sort?.auditAllocatedDate?.sortDir === "ASC" ? (
                  <ArrowUpOutlined />
                ) : (
                  <ArrowDownOutlined />
                )}
              </span>
            </th>
            <th
              className="text-truncate"
              onClick={() => handleSort("auditDueDate")}
            >
              AUDITED DUE DATE
              <span style={{ padding: "10px", cursor: "pointer" }}>
                {sort?.auditDueDate?.sortDir === "ASC" ? (
                  <ArrowUpOutlined />
                ) : (
                  <ArrowDownOutlined />
                )}
              </span>
            </th>
            <th
              className="text-truncate"
              onClick={() => handleSort("auditedDate")}
            >
              AUDITED DATE
              <span style={{ padding: "10px", cursor: "pointer" }}>
                {sort?.auditedDate?.sortDir === "ASC" ? (
                  <ArrowUpOutlined />
                ) : (
                  <ArrowDownOutlined />
                )}
              </span>
            </th>

            <th className="text-truncate">AUDIT ALLOCATED BY</th>
            <th className="text-truncate">PRIORITY</th>
            <th className="text-truncate" style={{ textAlign: "center" }}>
              <div className="d-flex align-items-center justify-content-center gap-2 text-truncate">
                AUDITED STATUS
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
          </tr>
        </thead>
        <tbody>
          {patinetListAll?.length <= 0 ? (
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
    </div>
  );
}

export default PatientTable;
