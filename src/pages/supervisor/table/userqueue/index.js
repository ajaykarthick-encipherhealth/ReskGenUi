import React from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { Empty, Select as AntSelect, Popover, Tooltip } from "antd";
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  InfoCircleFilled,
} from "@ant-design/icons";
import TableStyle from "../../../../components/table/table.module.css";
import AuditedTrack from "../../../../../src/images/trackingImages/audited.webp";
import NotAudited from "../../../../../src/images/trackingImages/notaudited.webp";
import AuditHold from "../../../../../src/images/trackingImages/audithold.webp";
import ReAudit from "../../../../../src/images/trackingImages/reaudited.webp";
import AuditPending from "../../../../../src/images/trackingImages/auditpending.webp";
import AuditedDeclineTrack from "../../../../../src/images/trackingImages/auditdeclined.webp";
import {
  priorityOptions,
  renderUserPrfoile,
  renderUserPrfoileAvatar,
} from "../../../../components/headerFilters/functions";
import { extractLatestData } from "../../auditing";
import {  setStorage } from "../../../../utils/storages";
import { truncateString } from "../../../../components/patientDetails/details/components/function/ReusableFunctions";
import Legends from "../../../../components/legends";
import styles from "../../../reviewer/report/report.module.css";
import { formatDateTime } from "../../../../utils/reusable";

const UserQueueTable = ({
  userList,
  badges,
  bullets,
  auditBodyTemplate,
  params,
  getRoutedData,
  userParams,
  handleTableRowClick,
  handlePriorityChange,
  priority,
  badgesTitle,
  bulletsTitle,
  viewUsers,
  sort,
  setSort
}) => {
  const router=useRouter()
  const auditstatusBodyTemplate = (rowData) => {
    const declinedDataFromAudit = extractLatestData(
      rowData?.auditDeclinedNotes
    );

    const declinedDataFromDeclined = extractLatestData(
      rowData?.auditDeclinedNotes
    );

    const declinedData = declinedDataFromAudit || declinedDataFromDeclined;
    switch (rowData.auditedStatus) {
      case "AUDIT_PENDING":
        return (
          <Popover placement="bottom" title="Status: AUDIT PENDING">
            <div className="patient-status">
              <Image
                src={AuditPending}
                style={{ height: "30px", width: "30px" }}
              />
            </div>
          </Popover>
        );

      case "AUDITHOLD":
        return (
          <Popover placement="bottom" title=" Status: AUDIT HOLD">
            <div className="patient-status">
              <Image
                src={AuditHold}
                // className={styles.ImgTrck}
                style={{ height: "30px", width: "30px" }}
              />
            </div>
          </Popover>
        );
      case "REAUDIT":
        return (
          <Popover placement="bottom" title=" Status: REAUDIT">
            <div className="patient-status">
              <Image src={ReAudit} style={{ height: "30px", width: "30px" }} />
            </div>
          </Popover>
        );
      case "AUDITED":
        return (
          <Popover placement="bottom" title=" Status: AUDITED">
            <div className="patient-status">
              <Image
                src={AuditedTrack}
                style={{ height: "30px", width: "30px" }}
              />
            </div>
          </Popover>
        );
      case "AUDITED":
        return (
          <div className="patient-status">
            <Image
              src={AuditedTrack}
              style={{ height: "30px", width: "30px" }}
            />
          </div>
        );

      case "NOT_AUDIT":
        return (
          <Popover placement="bottom" title=" Status: NOT AUDIT">
            <div className="patient-status">
              <Image
                src={NotAudited}
                style={{ height: "30px", width: "30px" }}
              />
            </div>
          </Popover>
        );
      case "AUDIT_DECLINED":
        return (
          <Popover
            placement="bottom"
            title=" Status: AUDIT DECLINED"
            content={`Reason: ${declinedData ? declinedData : "---"}`}
          >
            <div className="patient-status">
              <Image
                src={AuditedDeclineTrack}
                style={{ height: "30px", width: "30px" }}
              />
            </div>
          </Popover>
        );
      case null:
        return <div className="patient-status">---</div>;
    }
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


  const renderRows = () => {
    return userList?.length === 0 ? (
      <Empty />
    ) : (
      userList?.map((data, index) => (
        <tr key={index}>
          <td
            className={TableStyle.firstTdBorder}
            onClick={(e) => handleTableRowClick(e, data?.patientId)}
          >
            <Tooltip title={data?.patientId}>
              {" "}
              {truncateString(data?.patientId, 20)}
            </Tooltip>
          </td>
          <td
            className={TableStyle.childBorder}
            onClick={(e) => handleTableRowClick(e, data?.patientId)}
          >
            {data.patientName}
          </td>

          <td
            className={TableStyle.childBorder}
            onClick={(e) => handleTableRowClick(e, data?.patientId)}
          >
            <Popover
              content={
                <>
                  <div>
                    <span className={TableStyle.subTitle}> Allocated Date</span>
                    <div>
                      {data.allocatedOn
                        ? formatDateTime({date: data.allocatedOn})
                        : "---"}
                    </div>
                  </div>

                  <div>
                    <span className={TableStyle.subTitle}> Due Date</span>
                    <div>
                      {data.dueDate ? formatDateTime({date: data.dueDate}) : "---"}
                    </div>
                  </div>
                  <div>
                    <span className={TableStyle.subTitle}> Allocated By</span>
                    <div>
                      {data?.allocatedBy ? (
                        <>
                          {renderUserPrfoile(
                            data?.allocatedByFirstName,
                            data?.allocatedByLastName,
                            data?.allocatedByProfileImage
                          )}
                          {data.allocatedBy ? (
                            <>
                              &nbsp;{data?.allocatedByFirstName}
                              &nbsp;&nbsp;{data?.allocatedByLastName}
                            </>
                          ) : (
                            "---"
                          )}
                        </>
                      ) : (
                        "---"
                      )}
                    </div>
                  </div>
                </>
              }
            >
              {data.processedDate ? formatDateTime({date: data.processedDate}) : "---"}
            </Popover>
          </td>
          <td
            className={TableStyle.childBorder}
            onClick={(e) => handleTableRowClick(e, data?.patientId)}
          >
            <div className={TableStyle.innerAlignments}>
              {data.auditAllocatedDate
                ? formatDateTime({date: data.auditAllocatedDate})
                : "---"}
            </div>
          </td>
          <td
            className={TableStyle.childBorder}
            onClick={(e) => handleTableRowClick(e, data?.patientId)}
          >
            <div className={TableStyle.innerAlignments}>
              {data.auditDueDate ? formatDateTime({date: data.auditDueDate}) : "---"}
            </div>
          </td>

          <td
            className={TableStyle.childBorder}
            style={{ textAlign: "center" }}
            onClick={(e) => handleTableRowClick(e, data?.patientId)}
          >
            {data.auditAllocatedByFirstName ||
              data.auditAllocatedByLastName ||
              data?.auditAllocatedByProfileImage ? (
              <div
                style={{ display: "flex", alignItems: "center" }}
                onClick={(e) => handleTableRowClick(e, data?.patientId)}
              >
                {" "}
                <span style={{ marginRight: "9px" }}>
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
          <td
            className={TableStyle.childBorder}
            onClick={(e) => handleTableRowClick(e, data?.patientId)}
          >
            <Popover
              content={
                data?.auditedDate &&
                (data?.auditedByFirstName ||
                  data?.auditedByLastName ||
                  data?.auditedByProfileImage) && (
                  <>
                    {renderUserPrfoile(
                      data?.auditedByFirstName,
                      data?.auditedByLastName,
                      data?.auditedByProfileImage,
                      null,
                      "30px",
                      "30px"
                    )}
                    {data.auditedDate ? (
                      <>
                        &nbsp;{data?.auditedByFirstName}&nbsp;&nbsp;
                        {data?.auditedByLastName}
                      </>
                    ) : (
                      "---"
                    )}
                  </>
                )
              }
            >
              {data?.auditedDate ? formatDateTime({date: data?.auditedDate}) : "---"}
            </Popover>
          </td>
          <td className={TableStyle.childBorder}>
            <AntSelect
              style={{ width: "100px" }}
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
                handlePriorityChange(
                  data?.patientId,
                  value,
                  data?.lastModifiedDate
                );
              }}
            />
          </td>

          <td
            className={TableStyle.childBorder}
            style={{ textAlign: "center" }}
            onClick={(e) => handleTableRowClick(e, data?.patientId)}
          >
            {auditBodyTemplate(data)}
          </td>
          <td
            className={TableStyle.lastBorder}
            onClick={handleTableRowClick}
            style={{ textAlign: "center" }}
          >
            {auditstatusBodyTemplate(data)}
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
            <th>PATIENT ID</th>
            <th>PATIENT NAME</th>
            <th
              className="text-truncate"
              onClick={() => handleSort("processedDate")}
            >
              COMPLETED DATE
              <span style={{ cursor: "pointer", padding: "5px" }}>
                {sort?.processedDate?.sortDir === "ASC" ? (
                  <ArrowUpOutlined />
                ) : (
                  <ArrowDownOutlined />
                )}
              </span>
            </th>
            <th
              className="text-truncate"
              onClick={() => handleSort("auditAllocatedDate")}
            >
              AUDIT ALLOCATED DATE
              <span style={{ padding: "5px", cursor: "pointer" }}>
                {sort?.auditAllocatedDate?.sortDir === "ASC" ? (
                  <ArrowDownOutlined />
                ) : (
                  <ArrowUpOutlined />
                )}
              </span>
            </th>
            <th
              className="text-truncate"
              onClick={() => handleSort("auditDueDate")}
            >
              AUDIT DUE DATE
              <span style={{ padding: "5px", cursor: "pointer" }}>
                {sort?.auditDueDate?.sortDir === "ASC" ? (
                  <ArrowUpOutlined />
                ) : (
                  <ArrowDownOutlined />
                )}
              </span>
            </th>
            <th className="text-truncate">AUDIT ALLOCATED BY</th>
            <th
              className="text-truncate"
              onClick={() => handleSort("auditedDate")}
            >
              AUDITED DATE
              <span style={{ padding: "5px", cursor: "pointer" }}>
                {sort?.auditedDate?.sortDir === "ASC" ? (
                  <ArrowUpOutlined />
                ) : (
                  <ArrowDownOutlined />
                )}
              </span>
            </th>
            <th>PRIORITY</th>
            <th style={{ textAlign: "center" }}>
              <div className="d-flex align-items-center justify-content-center gap-2 text-truncate">
                REVIEWED STATUS
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
              <div className="d-flex align-items-center justify-content-center gap-2 text-truncate">
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

        <tbody>
          {userList?.length <= 0 ? (
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
};

export default UserQueueTable;
