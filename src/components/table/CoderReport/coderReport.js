import React from "react";
import { SVGICON } from "../../../jsx/constant/theme";
import { Badge } from "antd";

function CoderReport({ setModal }) {
  const data = [
    {
      patientId: "Ab01465",
      patientName: "Patient ",
      hcc: "William",
      suggestion: "0 ",
      deleted: "0",
      totalCodes: "23",
      completedDate: "22/12/22",
      comments: SVGICON.comment,
      auditorName: "Auditor name",
      flag: SVGICON.flag,
    },
    {
      patientId: "Ab01465",
      patientName: "Patient ",
      hcc: "William",
      suggestion: "0",
      deleted: "0",
      totalCodes: "23",
      completedDate: "22/12/22",
      comments: SVGICON.comment,
      auditorName: "Auditor name",
      flag: SVGICON.redFlag,
    },
    {
      patientId: "Ab01465",
      patientName: "Patient ",
      hcc: "William",
      suggestion: "0",
      deleted: "0",
      totalCodes: "23",
      completedDate: "22/12/22",
      comments: SVGICON.comment,
      auditorName: "Auditor name",
      flag: SVGICON.flag,
    },
    {
      patientId: "Ab01465",
      patientName: "Patient ",
      hcc: "William",
      suggestion: "0",
      deleted: "0",
      totalCodes: "23",
      completedDate: "22/12/22",
      comments: SVGICON.comment,
      auditorName: "Auditor name",
      flag: SVGICON.redFlag,
    },
    {
      patientId: "Ab01465",
      patientName: "Patient ",
      hcc: "William",
      suggestion: "0",
      deleted: "0",
      totalCodes: "23",
      completedDate: "22/12/22",
      comments: SVGICON.comment,
      auditorName: "Auditor name",
      flag: SVGICON.flag,
    },
    {
      patientId: "Ab01465",
      patientName: "Patient ",
      hcc: "William",
      suggestion: "0",
      deleted: "0",
      totalCodes: "23",
      completedDate: "22/12/22",
      comments: SVGICON.comment,
      auditorName: "Auditor name",
      flag: SVGICON.redFlag,
    },
    {
      patientId: "Ab01465",
      patientName: "Patient ",
      hcc: "William",
      suggestion: "0",
      deleted: "0",
      totalCodes: "23",
      completedDate: "22/12/22",
      comments: SVGICON.comment,
      auditorName: "Auditor name",
      flag: SVGICON.flag,
    },
    {
      patientId: "Ab01465",
      patientName: "Patient ",
      hcc: "William",
      suggestion: "0",
      deleted: "0",
      totalCodes: "23",
      completedDate: "22/12/22",
      comments: SVGICON.comment,
      auditorName: "Auditor name",
      flag: SVGICON.redFlag,
    },
    // Add more data objects as needed
  ];
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>PATIENT ID</th>
            <th>PATIENT NAME</th>
            <th>HCC </th>
            <th>SUGGESTION </th>
            <th>DELETED </th>
            <th>TOTAL CODES </th>
            <th>COMPLETE DATE </th>
            <th>AUDITOR NAME </th>
            <th>Flag </th>
            <th style={{ display: "flex", justifyContent: "space-around" }}>
              {" "}
              <span>All</span>{" "}
              <input
                type="checkbox"
                onChange={() => {
                  /* Handle checkbox change */
                }}
              />{" "}
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              <td
                style={{
                  borderTop: "0.2px solid #e1e1e1",
                  borderLeft: "0.2px solid #e1e1e1",
                  borderBottom: "  0.2px solid #e1e1e1",
                }}
              >
                <Badge.Ribbon
                  text="Audited"
                  color="#58bad7"
                  placement="start"
                ></Badge.Ribbon>
              </td>

              <td
                style={{
                  borderTop: "0.2px solid #e1e1e1",

                  borderBottom: "  0.2px solid #e1e1e1",
                }}
              >
                {row.patientId}
              </td>
              <td
                style={{
                  borderTop: "  0.2px solid #e1e1e1",

                  borderBottom: "  0.2px solid #e1e1e1",
                }}
              >
                {row.patientName}
              </td>
              <td
                style={{
                  borderTop: "  0.2px solid #e1e1e1",

                  borderBottom: "  0.2px solid #e1e1e1",
                }}
              >
                {row.hcc}
              </td>
              <td
                style={{
                  borderTop: "  0.2px solid #e1e1e1",

                  borderBottom: "  0.2px solid #e1e1e1",
                }}
              >
                {row.suggestion}
              </td>
              <td
                style={{
                  borderTop: "  0.2px solid #e1e1e1",

                  borderBottom: "  0.2px solid #e1e1e1",
                }}
              >
                {row.totalCodes}
              </td>
              <td
                style={{
                  borderTop: "  0.2px solid #e1e1e1",

                  borderBottom: "  0.2px solid #e1e1e1",
                }}
              >
                {row.completedDate}
              </td>
              <td
                onClick={setModal(false)}
                style={{
                  borderTop: "  0.2px solid #e1e1e1",

                  borderBottom: "  0.2px solid #e1e1e1",
                }}
              >
                {row.comments}
              </td>
              <td
                style={{
                  borderTop: "  0.2px solid #e1e1e1",

                  borderBottom: "  0.2px solid #e1e1e1",
                }}
              >
                {row.auditorName}
              </td>
              <td
                style={{
                  borderTop: "  0.2px solid #e1e1e1",

                  borderBottom: "  0.2px solid #e1e1e1",
                }}
              >
                {row.flag}
              </td>
              <td
                style={{
                  borderTop: "  0.2px solid #e1e1e1",
                  borderBottom: "  0.2px solid #e1e1e1",
                  borderRight: "  0.2px solid #e1e1e1",
                }}
              >
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
