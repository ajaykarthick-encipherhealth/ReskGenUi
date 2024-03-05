import React, { useEffect, useState } from "react";
import TableStyle from "../../../../../components/table/table.module.css";
import { Empty } from "antd";

const Appointments = ({ userList, sortOrder, setSortOrder, setSort }) => {
  return (
    <div class="table-responsive active-projects task-table">
      <div className={TableStyle.classContaineer}>
        <table className={TableStyle.classTable}>
          <thead className={TableStyle.classThead}>
            <tr>
              <th style={{ textAlign: "center" }}>Appointments Type</th>
              <th style={{ textAlign: "center" }}>Type</th>
              <th style={{ textAlign: "center" }}>Hospital</th>
              <th style={{ textAlign: "center" }}>Practitioner</th>
              <th style={{ textAlign: "center" }}>Date</th>
              <th style={{ textAlign: "center" }}>Status</th>
              <th style={{ textAlign: "center" }}>SSN</th>
              <th style={{ textAlign: "center" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={8}>
                <Empty />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Appointments;
