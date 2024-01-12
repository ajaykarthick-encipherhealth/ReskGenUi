import React from "react";
import moment from "moment";
import TableStyle from "../../table.module.css";
import Footer from "../../../../jsx/layouts/Footer";

export default function AdminList({ userList }) {
  return (
    <div className={TableStyle.classContaineer}>
      <table className={TableStyle.classTable}>
        <thead className={TableStyle.classThead}>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>User Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Date Created</th>
          </tr>
        </thead>
        <tbody>
          {userList?.map((item, index) => (
            <tr key={index} style={{ height: "35px" }}>
              <td
                className={TableStyle.childBorder}
                style={{ height: "47px !important" }}
              >
                <span>{item.firstName ? item.firstName : "---"}</span>
              </td>
              <td
                className={TableStyle.childBorder}
                style={{ height: "40px !important" }}
              >
                <span>{item.lastName ? item.lastName : "---"}</span>
              </td>
              <td
                className={TableStyle.childBorder}
                style={{ height: "40px !important" }}
              >
                <span>{item.userName ? item.userName : "---"}</span>
              </td>
              <td
                className={TableStyle.childBorder}
                style={{ height: "40px !important" }}
              >
                <span>{item.email ? item.email : "---"}</span>
              </td>
              <td
                className={TableStyle.childBorder}
                style={{ height: "40px !important" }}
              >
                <span>{item?.role[0] ? item?.role[0] : "---"}</span>
              </td>

              <td
                className={TableStyle.lastBorder}
                style={{ height: "40px !important" }}
              >
                <span>
                  {moment(item.createdDate).format("DD/MM/YYYY hh:mm A")}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Footer />
    </div>
  );
}
