import React, { useEffect, useState } from "react";
import TableStyle from "../../../../../components/table/table.module.css";
import { Empty } from "antd";

const Conditions = ({ userList, sortOrder, setSortOrder, setSort }) => {
  var data = [
    {
      disease: "Cerebrovascular disease",
      date: "2014-01-01T00:00:00.000Z",
    },
    {
      disease: "Dementia",
      date: "2014-01-01T00:00:00.000Z",
    },
    {
      disease: "Chronic obstructive pulmonary disease",
      date: "2014-01-01T00:00:00.000Z",
    },
    {
      disease: "Hepatic cirrhosis",
      date: "2014-01-01T00:00:00.000Z",
    },
    {
      disease: "Cancer",
      date: "2014-01-01T00:00:00.000Z",
    },
  ];
  return (
    <div class="table-responsive active-projects task-table">
      <div className={TableStyle.classContaineer}>
        <table className={TableStyle.classTable}>
          <thead className={TableStyle.classThead}>
            <tr>
              <th style={{ textAlign: "center" }}>Disease</th>
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
                    {item.disease}
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

export default Conditions;
