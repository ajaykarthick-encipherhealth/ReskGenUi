import React from "react";
import { SVGICON } from "../../../jsx/constant/theme";
import { Badge } from "antd";
import TableStyle from "../table.module.css"
function CoderReport({ setModal }) {
  const data = [
    {
      patientId: "Ab01465",
      patientName: "Patient ",
      hcc: "0",
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
      hcc: "0",
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
      hcc: "0",
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
      hcc: "0",
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
      hcc: "0",
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
      hcc: "0",
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
      hcc: "0",
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
      hcc: "0",
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
    <div  className={TableStyle.classContaineer}>
      <table className={TableStyle.classTable}>
       
           <thead className={TableStyle.classThead} >
          <tr>
            <th></th>
            <th>PATIENT ID</th>
            <th>PATIENT NAME</th>
            <th>HCC </th>
            <th>SUGGESTION </th>
            <th>DELETED </th>
            <th>TOTAL CODES </th>
            <th>COMPLETE DATE </th>
            <th>COMMENTS </th>
            <th>AUDITOR NAME </th>
            <th>Flag </th>
            <th style={{ display: "flex", justifyContent: "space-around" }}>
              {" "}
              <span>All</span>{" "}
            
            </th>
          </tr>
        </thead>
    
       
        <tbody className={TableStyle.bodytable}>
          {data.map((row, index) => (
            <tr key={index} style={{   padding:" 22px!important"}}>
              <td
             
                className={TableStyle.firstTdBorder}
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
                className={TableStyle.childBorder}
              >
                {row.patientId}
              </td>
              <td
               className={TableStyle.childBorder}
              >
                {row.patientName}
              </td>
              <td
                className={TableStyle.childBorder}
              >
                {row.hcc}
              </td>
              <td
                 className={TableStyle.childBorder}
              >
                {row.suggestion}
              </td>
              <td
              className={TableStyle.childBorder}
              >
                {row.deleted}
              </td>
              <td
                className={TableStyle.childBorder}
              >
                {row.totalCodes}
              </td>
              <td
                onClick={setModal(false)}
                className={TableStyle.childBorder}
              >
                {row.completedDate}
              </td>
              <td
                className={TableStyle.childBorder}
              >
                {row.comments}
              </td>
              <td
                className={TableStyle.childBorder}
              >
                {row.auditorName}
              </td>
              <td
                className={TableStyle.childBorder}
              >
                {row.flag}
              </td>
              <td
               
                className={TableStyle.lastBorder}
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
