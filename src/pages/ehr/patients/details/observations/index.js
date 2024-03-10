import React, { useEffect, useState } from "react";
import TableStyle from "../../../../../components/table/table.module.css";
import { Empty } from "antd";

const Observations = ({ userList, sortOrder, setSortOrder, setSort }) => {
  const data = [
    {
      measurement: "Respiratory Rate",

      reading: "32 br/min",
      observedBy: [],
    },
    {
      measurement: "Systolic Blood Pressure",
      reading: "150 mmHg",
      observedBy: [],
    },
    {
      measurement: "Diastolic blood pressure",
      reading: "70 mmHg",
      observedBy: [],
    },
    {
      measurement: "BUN",
      reading: "50 mg/dL",
      observedBy: [],
    },
    {
      measurement: "Sodium Lvl",
      reading: "140 mEq/dL",
      observedBy: [],
    },
  ];
  return (
    <div class="table-responsive active-projects task-table">
      <div className={TableStyle.classContaineer}>
        <table className={TableStyle.classTable}>
          <thead className={TableStyle.classThead}>
            <tr>
              <th style={{ textAlign: "center" }}>Measurement</th>
              <th style={{ textAlign: "center" }}>Reading</th>
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
                    {item.measurement}
                  </td>
                  <td
                    style={{ textAlign: "center" }}
                    className={TableStyle.childBorder}
                  >
                    {item.reading}
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

export default Observations;
