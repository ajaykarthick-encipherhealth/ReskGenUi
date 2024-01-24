import React from "react";
import { Tooltip } from "antd";
import { CircularProgressbar } from "react-circular-progressbar";
import TableStyle from "../../../../components/table/table.module.css";
import { useRouter } from "next/router";

const AdminList = ({ userList }) => {
  const router = useRouter();
  return (
    <div className={TableStyle.classContaineer}>
      <table className={TableStyle.classTable}>
        <thead className={TableStyle.classThead}>
          <tr>
            <th>USER ID</th>
            <th>USER NAME</th>
            <th>ALLOCATED</th>
            <th>COMPLETED</th>
            <th>PENDING</th>
            <th>HOLD</th>
            <th>QUALITY</th>
          </tr>
        </thead>
        <tbody>
          {userList?.map((item, index) => (
            <tr
              key={index}
              style={{ height: "35px" }}
              onClick={() =>
                router.push(`user/userQueue?userId=${item?.userId}`)
              }
            >
              {/* user id */}
              <td
                className={TableStyle.childBorder}
                style={{ height: "47px !important" }}
              >
                <span>{item?.userId ? item?.userId : "---"}</span>
              </td>
              {/* user name */}
              <td
                className={TableStyle.childBorder}
                style={{ height: "40px !important" }}
              >
                <span>{item?.userName ? item?.userName : "---"}</span>
              </td>
              {/* allocated */}
              <td
                className={TableStyle.childBorder}
                style={{ height: "40px !important" }}
              >
                <span>
                  {item?.totalFileAllocated ? item?.totalFileAllocated : "---"}
                </span>
              </td>
              {/* completed */}
              <td
                className={TableStyle.childBorder}
                style={{ height: "40px !important" }}
              >
                <span>
                  {item?.totalFileProcessed ? item?.totalFileProcessed : "---"}
                </span>
              </td>
              {/* pending */}
              <td
                className={TableStyle.childBorder}
                style={{ height: "40px !important" }}
              >
                <span>
                  {item?.totalFilePending ? item?.totalFilePending : "---"}
                </span>
              </td>
              {/* hold */}
              <td
                className={TableStyle.lastBorder}
                style={{ height: "40px !important" }}
              >
                <span>{item?.totalFileHold ? item?.totalFileHold : "---"}</span>
              </td>

              {/* quality */}
              <td
                className={TableStyle.lastBorder}
                style={{ height: "40px !important" }}
              >
                <Tooltip title={` Quality : ${90}%`}>
                  <div className="notificationIcon">
                    <div style={{ width: 40, height: 40 }}>
                      <CircularProgressbar value={90} text={`${90}%`} />
                    </div>
                  </div>
                </Tooltip>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminList;
