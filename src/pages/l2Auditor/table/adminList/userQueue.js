import React, { useState } from "react";
import { Empty, Select, Tooltip, Badge, Popover } from "antd";
import moment from "moment";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import TableStyle from "../../../../components/table/table.module.css";
import {
  priorityOptions,
  processstatusBodyTemplate,
  renderUserPrfoile,
} from "../../../../components/headerFilters/functions";
import { getPriorityChange } from "../../../../store/actions/l2Action/AuditorAction";

const UserQueue = ({ userList, setSort }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [processSort, setProcessSort] = useState("ASC");
  const [auditAllocatedSort, setAuditAllocatedSort] = useState("ASC");
  const [audirDateSort, setAuditDateSort] = useState("ASC");
  const [auditDueSort, setAuditDueSort] = useState("DESC");
  const badgeDisplay = (data) => {
    if (data?.auditedStatus === "AUDITED") {
      return (
        <Badge.Ribbon
          text="Audited"
          color="#377880"
          placement="start"
        ></Badge.Ribbon>
      );
    } else if (data.auditedStatus === "REAUDIT") {
      return (
        <Badge.Ribbon
          text="Re Audit"
          color="#FFBE00"
          placement="start"
          height={10}
        ></Badge.Ribbon>
      );
    } else if (data.auditedStatus === "AUDITHOLD") {
      return (
        <Badge.Ribbon
          text="Audit Hold"
          color="#964B00"
          placement="start"
          style={{ fontSize: "10px" }}
        ></Badge.Ribbon>
      );
    } else if (data.auditedStatus === "AUDIT_PENDING") {
      return (
        <Badge.Ribbon
          text="Audit Pending"
          color="#F28585"
          placement="start"
          style={{ fontSize: "10px" }}
        ></Badge.Ribbon>
      );
    } else return null;
  };

  const handleTableRowClick = (e, id) => {
    const targetTd = e.target.closest("td");
    if (targetTd) {
      localStorage.setItem("patientId", id);
      router?.push("details");
    }
  };
  const dummyProfileImageUrl =
    "https://avatars.githubusercontent.com/u/68529028?s=64&v=4";
  const nullImg =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTA78Na63ws7B7EAWYgTr9BxhX_Z8oLa1nvOA&usqp=CAU";
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
            {data?.auditedStatus ? (
              <span style={{ position: "relative", left: "0px", top: "10px" }}>
                {badgeDisplay(data)}
              </span>
            ) : null}
            <span
              style={{
                paddingLeft: "70px",
              }}
            >
              {data?.patientId}
            </span>
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
                      {data.allocatedBy ? (
                        <>
                          {renderUserPrfoile(
                            data?.allocatedByFirstName,
                            data?.allocatedByLastName,
                            data?.allocatedByProfileImage
                          )}
                          {data.allocatedBy ? (
                            <>
                              {
                                data?.allocatedBy
                                
                              }
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
          {/* Audited details */}
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

          <td className={TableStyle.childBorder} style={{textAlign:"left"}}>
            <div className={TableStyle.innerAlignments}>
              {data.auditAllocatedBy ? (
                <Tooltip title={data.auditAllocatedBy}>  
                  {renderUserPrfoile(
                    data?.auditedAssignedFirstName,
                    data?.auditedAssignedLastName,
                    data?.auditAllocatedByProfileImage,
                    null,
                    "30px",
                    "30px"
                  )}
                  {data.auditAllocatedBy ? (
                    <>
                      {data.auditAllocatedBy
                        .split("@")[0]
                        .charAt(0)
                        .toUpperCase() +
                        data.auditAllocatedBy.split("@")[0].slice(1)}
                    </>
                  ) : (
                    "---"
                  )}
                </Tooltip>
              ) : (
                "---"
              )}
            </div>
          </td>
          <td
            className={TableStyle.childBorder}
            onClick={(e) => handleTableRowClick(e, data?.patientId)}
          >
            
            <Popover
              content={
                data.auditedDate &&
                renderUserPrfoile(
                data?.firstName,
                data?.lastName,
                data?.profileImageUrl,
                null,
                "30px",
                "30px"
              )}
            >
              {data.auditedDate
                ? moment(data.auditedDate).format("MM-DD-YYYY")
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
            onClick={(e) => handleTableRowClick(e, data?.patientId)}
          >
            {processstatusBodyTemplate(data)}
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
            <th style={{ paddingLeft: "80px" }}>PATIENT ID</th>
            <th>PATIENT NAME</th>
            <th
              onClick={() => {
                setProcessSort(processSort === "ASC" ? "DESC" : "ASC");
                setSort({
                  sortDir: processSort,
                  sortField: "processedDate",
                });
              }}
            >
              COMPLETED DATE
              <span style={{ cursor: "pointer" }}>
                {processSort === "ASC" ? (
                     <ArrowDownOutlined />
                ) : (
                  <ArrowUpOutlined />

                )}
              </span>
            </th>
            <th
              onClick={() => {
                setAuditAllocatedSort(
                  auditAllocatedSort === "ASC" ? "DESC" : "ASC"
                );
                setSort({
                  sortDir: auditAllocatedSort,
                  sortField: "auditAllocatedDate",
                });
              }}
            >
              AUDIT ALLOCATED DATE
              <span style={{ padding: "5px", cursor: "pointer" }}>
                {auditAllocatedSort === "ASC" ? (
                 <ArrowDownOutlined />
                ) : (
                 
                  <ArrowUpOutlined />
                )}
              </span>
            </th>
            <th
              onClick={() => {
                setAuditDueSort(auditDueSort === "ASC" ? "DESC" : "ASC");
                setSort({ sortDir: auditDueSort, sortField: "auditDueDate" });
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
                setAuditDateSort(audirDateSort === "ASC" ? "DESC" : "ASC");
                setSort({ sortDir: audirDateSort, sortField: "auditedDate" });
              }}
            >
              AUDITED DATE
              <span style={{ padding: "5px", cursor: "pointer" }}>
                {audirDateSort === "ASC" ? (
                 <ArrowDownOutlined />
                ) : (
                  
                  <ArrowUpOutlined />
                )}
              </span>
            </th>
            {/* <th>ALLOCATED BY</th> */}
            <th style={{ paddingLeft: "30px" }}>PRIORITY</th>
            <th>PROCESSED STATUS</th>
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

export default UserQueue;
