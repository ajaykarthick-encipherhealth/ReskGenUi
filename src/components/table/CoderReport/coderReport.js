import React from "react";
import { Badge } from "antd";
import TableStyle from "../table.module.css";
function CoderReport({ setModal, reportListAll }) {
  const auditLength = reportListAll?.filter((item) => item.auditedBy);
  return (
    <div className={TableStyle.classContaineer}>
      <table className={TableStyle.classTable}>
        <thead className={TableStyle.classTTotalhead}>
          <tr>
            {auditLength?.length > 0 && <th></th>}
            <th>PATIENT ID</th>
            <th>PATIENT NAME</th>
            <th>HCC </th>
            <th>COMPLETE DATE </th>
            <th>COMMENTS </th>
            <th>AUDITOR NAME </th>
            <th>Flag </th>
            <th>
              {" "}
              <div style={{ display: "flex", justifyContent: "space-around" }}>
                {/* <span s>All</span>{" "} */}
                <input
                  type="checkbox"
                  onChange={() => {}}
                  style={{
                    paddingTop: "10px",
                    width: "20px",
                    height: "20px",
                    flexhrink: "0",
                    borderRadius: "4px",

                    backgroundColor: "pink",
                  }}
                />
              </div>
            </th>
          </tr>
        </thead>

        <tbody className={TableStyle.bodytable}>
          {reportListAll?.length > 0 &&
            reportListAll?.map((row, index) => (
              <tr key={index} style={{ padding: " 22px!important" }}>
                {row?.auditedBy && (
                  <td className={TableStyle.firstTdBorder}>
                    <Badge.Ribbon
                      text="Audited"
                      color="#58bad7"
                      placement="start"
                    ></Badge.Ribbon>
                  </td>
                )}

                <td
                  style={{
                    borderTop: "0.2px solid #e1e1e1",

                    borderBottom: "  0.2px solid #e1e1e1",
                  }}
                  className={TableStyle.childBorder}
                >
                  {row?.patientId ? row?.patientId : "---"}
                </td>
                <td className={TableStyle.childBorder}>
                  {row?.patientName ? row?.patientName : "---"}
                </td>
                <td className={TableStyle.childBorder}>
                  {row?.validDisease ? row?.validDisease : "---"}
                </td>

                <td
                  onClick={setModal(false)}
                  className={TableStyle.childBorder}
                >
                  {row?.completedDate ? row?.completedDate : "---"}
                </td>
                <td className={TableStyle.childBorder}>
                  {row?.comments ? row?.comments : "---"}
                </td>
                <td className={TableStyle.childBorder}>
                  {row?.auditedBy ? row?.auditedBy : "---"}
                </td>
                <td className={TableStyle.childBorder}>
                  {row?.flag ? row?.flag : "---"}
                </td>
                <td className={TableStyle.lastBorder}>
                  <input
                    type="checkbox"
                    onChange={() => {
                      /* Handle checkbox change */
                    }}
                    style={{
                      width: "20px",
                      height: "20px",
                      flexhrink: "0",
                      borderRadius: "4px",

                      backgroundColor: "pink",
                    }}
                  />
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default CoderReport;
