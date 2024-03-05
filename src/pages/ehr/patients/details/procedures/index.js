import React, { useEffect, useState } from "react";
import TableStyle from "../../../../../components/table/table.module.css";
import { Empty } from "antd";

const Procedures = ({ userList, sortOrder, setSortOrder, setSort }) => {
  var data = [
    {
      procedureName: "Appendectomy",
      date: "2022-02-21T10:30:00.000Z",
      performer: "John Smith",
    },
    {
      procedureName: "Knee Arthroscopy",
      date: "2022-02-23T10:30:00.000Z",
      performer: "John Smith",
    },
    {
      procedureName: "Colonoscopy",
      date: "2022-02-24T12:15:00.000Z",
      performer: "Emily Johnson",
    },
    {
      procedureName: "Cataract Extraction",
      date: "2022-02-21T14:00:00.000Z",
      performer: "Emily Johnson",
    },
  ];
  return (
    <div class="table-responsive active-projects task-table">
      <div className={TableStyle.classContaineer}>
        <table className={TableStyle.classTable}>
          <thead className={TableStyle.classThead}>
            <tr>
              <th style={{ textAlign: "center" }}>Procedure Name</th>
              <th style={{ textAlign: "center" }}>Performer</th>
              <th style={{ textAlign: "center" }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {data?.length > 0 ? (
              data?.map((item) => (
                <tr
                  style={{
                    height: "35px",
                  }}
                  className={TableStyle.trDiv}
                >
                  <td
                    style={{ textAlign: "center" }}
                    className={TableStyle.childBorder}
                  >
                    {item.procedureName}
                  </td>
                  <td
                    style={{ textAlign: "center" }}
                    className={TableStyle.childBorder}
                  >
                    {item.performer}
                  </td>
                  <td
                    style={{ textAlign: "center" }}
                    className={TableStyle.childBorder}
                  >
                    {item.date}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8}>
                  <Empty />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Procedures;
