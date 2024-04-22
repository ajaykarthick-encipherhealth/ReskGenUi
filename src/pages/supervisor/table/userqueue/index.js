import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import Image from "next/image";
import { Empty, Select, Badge, Popover } from "antd";
import moment from "moment";
import dayjs from "dayjs";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import TableStyle from "../../../../components/table/table.module.css";
import AuditedTrack from "../../../../../src/images/trackingImages/AuditedTrack.png";

import NotAudited from "../../../../../src/images/trackingImages/NotAuditedTrack.png";
import AuditHold from "../../../../../src/images/trackingImages/AuditHoldTrack.png";
import ReAudit from "../../../../../src/images/trackingImages/reAuditTrack.png";
import AuditPending from "../../../../../src/images/trackingImages/AuditPending.png";
import AuditedDeclineTrack from "../../../../../src/images/trackingImages/AuditDeclined.png";
import {
  priorityOptions,
  renderUserPrfoile,
  renderUserPrfoileAvatar,
  sortFunction,
} from "../../../../components/headerFilters/functions";
import { getPriorityChange } from "../../../../store/actions/l2Action/AuditorAction";
import { extractLatestData } from "../../auditing";

const UserQueueTable = ({ userList, setSort, auditBodyTemplate, page }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [processSort, setProcessSort] = useState("DESC");
  const [auditAllocatedSort, setAuditAllocatedSort] = useState("DESC");
  const [audirDateSort, setAuditDateSort] = useState("DESC");
  const [auditDueSort, setAuditDueSort] = useState("DESC");

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

  const handleTableRowClick = (e, id) => {
    const targetTd = e.target.closest("td");
    if (targetTd) {
      localStorage.setItem("patientId", id);
      // router?.push(`/supervisor/user/details?page=${page}`);
      router.push({
        pathname: "/supervisor/user/details",
        query: { ...page, isSupervisorUser: true },
      });
    }
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
            <span>{data?.patientId}</span>
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
                        ? moment(data.allocatedOn).format("MM-DD-YYYY")
                        : "---"}
                    </div>
                  </div>

                  <div>
                    <span className={TableStyle.subTitle}> Due Date</span>
                    <div>
                      {data.dueDate
                        ? moment(data.dueDate).format("MM-DD-YYYY")
                        : "---"}
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
              {data.processedDate
                ? moment(data.processedDate).format("MM-DD-YYYY")
                : "---"}
            </Popover>
          </td>
          <td
            className={TableStyle.childBorder}
            onClick={(e) => handleTableRowClick(e, data?.patientId)}
          >
            <div className={TableStyle.innerAlignments}>
              {data.auditAllocatedDate
                ? moment(data.auditAllocatedDate).format("MM-DD-YYYY")
                : "---"}
            </div>
          </td>
          <td
            className={TableStyle.childBorder}
            onClick={(e) => handleTableRowClick(e, data?.patientId)}
          >
            <div className={TableStyle.innerAlignments}>
              {data.auditDueDate
                ? moment(data.auditDueDate).format("MM-DD-YYYY")
                : "---"}
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
              {data?.auditedDate
                ? moment(data?.auditedDate).format("MM-DD-YYYY")
                : "---"}
            </Popover>
          </td>

          <td className={TableStyle.childBorder}>
            <Select
              options={priorityOptions}
              placeholder="Set priority"
              className={`custom-ant-select ${TableStyle.customAntSelect}`}
              showSearch={false}
              defaultValue={data?.priority ? data.priority : "Set Priority"}
              disabled={!data?.priority ? true : false}
              onChange={(value) => {
                dispatch(
                  getPriorityChange(
                    data?.patientId,
                    dayjs(data?.lastModifiedDate)?.format("YYYY"),
                    value
                  )
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
              onClick={() => {
                sortFunction(
                  processSort,
                  setProcessSort,
                  setSort,
                  "processedDate"
                );
              }}
            >
              COMPLETED DATE
              <span style={{ cursor: "pointer", padding: "5px" }}>
                {processSort === "DESC" ? (
                  <ArrowDownOutlined />
                ) : (
                  <ArrowUpOutlined />
                )}
              </span>
            </th>
            <th
              onClick={() => {
                sortFunction(
                  auditAllocatedSort,
                  setAuditAllocatedSort,
                  setSort,
                  "auditAllocatedDate"
                );
              }}
            >
              AUDIT ALLOCATED DATE
              <span style={{ padding: "5px", cursor: "pointer" }}>
                {auditAllocatedSort === "DESC" ? (
                  <ArrowDownOutlined />
                ) : (
                  <ArrowUpOutlined />
                )}
              </span>
            </th>
            <th
              onClick={() => {
                sortFunction(
                  auditDueSort,
                  setAuditDueSort,
                  setSort,
                  "auditDueDate"
                );
              }}
            >
              AUDIT DUE DATE
              <span style={{ padding: "5px", cursor: "pointer" }}>
                {auditDueSort === "ASC" ? (
                  <ArrowUpOutlined />
                ) : (
                  <ArrowDownOutlined />
                )}
              </span>
            </th>
            <th>AUDIT ALLOCATED BY</th>
            <th
              onClick={() => {
                sortFunction(
                  audirDateSort,
                  setAuditDateSort,
                  setSort,
                  "auditedDate"
                );
              }}
            >
              AUDITED DATE
              <span style={{ padding: "5px", cursor: "pointer" }}>
                {audirDateSort === "DESC" ? (
                  <ArrowDownOutlined />
                ) : (
                  <ArrowUpOutlined />
                )}
              </span>
            </th>
            {/* <th>ALLOCATED BY</th> */}
            <th style={{ paddingLeft: "30px" }}>PRIORITY</th>
            <th style={{ textAlign: "center" }}>REVIEWED STATUS</th>
            <th style={{ textAlign: "center" }}>AUDITED STATUS</th>
          </tr>
        </thead>

        <tbody>
          {userList?.length <= 0 ? (
            <tr>
              <td colSpan="9">
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
