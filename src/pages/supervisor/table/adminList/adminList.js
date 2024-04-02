import React from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { Empty, Tooltip } from "antd";
import { CircularProgressbar } from "react-circular-progressbar";
import TableStyle from "../../../../components/table/table.module.css";
import { storeUserValues } from "../../../../store/actions/l2Action/userActions";

const AdminList = ({ userList }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const gotoUserQueue = (item) => {
    dispatch(storeUserValues(item)),
      router.push(`user/userQueue?userId=${item?.userName}`);
  };
  return (
    <div className={TableStyle.classContaineer}>
      <table className={TableStyle.classTable}>
        <thead className={TableStyle.classThead}>
          <tr>
            <th>USERNAME</th>
            <th>ALLOCATED</th>
            <th>COMPLETED</th>
            <th>PENDING</th>
            <th>HOLD</th>
            <th>INVALID</th>
            <th>QUALITY</th>
          </tr>
        </thead>
        <tbody>
          {userList?.length > 0 ? (
            userList?.map((item, index) => (
              <tr
                key={index}
                style={{ height: "35px" }}
                onClick={() => gotoUserQueue(item)}
              >
                <td
                  className={TableStyle.childBorder}
                  style={{ height: "47px !important" }}
                >
                  <img
                    src={item?.profileImageUrl}
                    alt="User Avatar"
                    width={35}
                    height={35}
                    style={{
                      borderRadius: "50%",
                      marginRight: "10px",
                    }}
                  />
                  <span>
                    {item?.firstName
                      ? item?.firstName + " " + item.lastName
                      : "---"}
                  </span>
                </td>

                <td
                  className={TableStyle.childBorder}
                  style={{ height: "40px !important" }}
                >
                  <span>
                    {item?.totalFileAllocated
                      ? item?.totalFileAllocated
                      : "---"}
                  </span>
                </td>
                <td
                  className={TableStyle.childBorder}
                  style={{ height: "40px !important" }}
                >
                  <span>
                    {item?.totalFileProcessed
                      ? item?.totalFileProcessed
                      : "---"}
                  </span>
                </td>
                <td
                  className={TableStyle.childBorder}
                  style={{ height: "40px !important" }}
                >
                  <span>
                    {item?.totalFilePending ? item?.totalFilePending : "---"}
                  </span>
                </td>

                <td
                  className={TableStyle.lastBorder}
                  style={{ height: "40px !important" }}
                >
                  <span>
                    {item?.totalFileHold ? item?.totalFileHold : "---"}
                  </span>
                </td>

                <td
                  className={TableStyle.childBorder}
                  style={{ height: "40px !important" }}
                >
                  <span>
                    {item?.totalFileDeclined ? item?.totalFileDeclined : "---"}
                  </span>
                </td>

                <td
                  className={TableStyle.lastBorder}
                  style={{ height: "40px !important", width: "30px" }}
                >
                  <Tooltip title={` Quality : ${Math.round(item?.accuracy)}%`}>
                    <div className="notificationIcon">
                      <div style={{ width: 40, height: 40 }}>
                        <CircularProgressbar
                          value={Math.round(item?.accuracy)}
                          text={`${Math.round(item?.accuracy)}%`}
                        />
                      </div>
                    </div>
                  </Tooltip>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={10}>
                <Empty />
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminList;
