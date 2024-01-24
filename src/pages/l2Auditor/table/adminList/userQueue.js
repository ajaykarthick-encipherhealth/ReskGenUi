import React from "react";
import { Empty, Select, Tooltip, Badge } from "antd";
import TableStyle from "../../../../components/table/table.module.css";
import moment from "moment";
import {
  priorityOptions,
  processstatusBodyTemplate,
} from "../../../../components/headerFilters/functions";
import { useRouter } from "next/router";

const UserQueue = ({ userList }) => {
  const router=useRouter()
  const badgeDisplay = (data) => {
    if (data?.isAudited) {
      return (
        <Badge.Ribbon
          text="Audited"
          color="#377880"
          placement="start"
        ></Badge.Ribbon>
      );
    } else if (data.isReAudited) {
      return (
        <Badge.Ribbon
          text="Re Audit"
          color="#FFBE00"
          placement="start"
        ></Badge.Ribbon>
      );
    } else if (data.isAuditHold) {
      return (
        <Badge.Ribbon
          text="Audite Hold"
          color="#964B00"
          placement="start"
        ></Badge.Ribbon>
      );
    } else return null;
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
        <tr key={index} onClick={()=>router.push("details")}>
          <td className={TableStyle.firstTdBorder}>
            {data?.isAudited || data?.isReAudited || data?.isAuditHold ? (
              <span style={{ position: "relative", left: "0px", top: "10px" }}>
                {badgeDisplay(data)}
              </span>
            ) : null}
            <span
              style={{
                paddingLeft: "40px",
              }}
            >
              {data.patientId}
            </span>
          </td>
          <td className={TableStyle.childBorder}>{data.patientName}</td>
          <td className={TableStyle.childBorder}>
            {data.allocatedOn
              ? moment(data.allocatedOn).format("MM-DD-YYYY")
              : "---"}
          </td>
          <td className={TableStyle.childBorder}>
            {data.dueDate ? moment(data.dueDate).format("MM-DD-YYYY") : "---"}
          </td>
          <td className={TableStyle.childBorder}>
            {data.processedDate
              ? moment(data.processedDate).format("MM-DD-YYYY")
              : "---"}
          </td>
          <td className={TableStyle.childBorder}>
            {data.auditedDate
              ? moment(data.auditedDate).format("MM-DD-YYYY")
              : "---"}
          </td>
          <td className={TableStyle.childBorder}>
            {data.allocatedBy ? (
              <Tooltip title={data.allocatedBy}>
                {data.allocatedBy ? (
                  <img
                    src={dummyProfileImageUrl}
                    alt="User Avatar"
                    width={30}
                    height={30}
                    style={{ borderRadius: "50%", marginRight: "5px" }}
                  />
                ) : (
                  <img
                    src={nullImg}
                    alt="User Avatar"
                    width={30}
                    height={30}
                    style={{ borderRadius: "50%", marginRight: "10px" }}
                  />
                )}
                {data.allocatedBy ? (
                  <>
                    {data.allocatedBy.split("@")[0].charAt(0).toUpperCase() +
                      data.allocatedBy.split("@")[0].slice(1)}
                  </>
                ) : (
                  "---"
                )}
              </Tooltip>
            ) : (
              "---"
            )}
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
                console.log(value);
              }}
              style={{ width: "80%" }}
            />
          </td>

          <td className={TableStyle.childBorder}>
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
            <th style={{ paddingLeft: "60px" }}>PATIENT ID</th>
            <th>PATIENT NAME</th>
            <th>ALLOCATED DATE</th>
            <th>DUE DATE</th>
            <th>COMPLETED DATE</th>
            <th>AUDITED DATE</th>
            <th>ALLOCATED BY</th>
            <th>PRIORITY</th>
            <th style={{ paddingLeft: "40px" }}>STATUS</th>
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
