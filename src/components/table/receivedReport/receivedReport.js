import React from "react";
import TableStyle from "../table.module.css"
function ReceivedReport() {
  const data = [
    {
      reportID: "Ab01465",
      reportType: "Coder ",
      userList: "William",
      date: "22/12/22 ",
    },
    {
      reportID: "Ab01465",
      reportType: "Patient ",
      userList: "William",
      date: "22/12/22 ",
    },
    {
      reportID: "Ab01465",
      reportType: "Coder ",
      userList: "William",
      date: "22/12/22 ",
    },
    {
      reportID: "Ab01465",
      reportType: "Patient ",
      userList: "William",
      date: "22/12/22 ",
    },
    {
      reportID: "Ab01465",
      reportType: "Coder ",
      userList: "William",
      date: "22/12/22 ",
    },
    {
      reportID: "Ab01465",
      reportType: "Patient ",
      userList: "William",
      date: "22/12/22 ",
    },
    {
      reportID: "Ab01465",
      reportType: "Coder ",
      userList: "William",
      date: "22/12/22 ",
    },
    {
      reportID: "Ab01465",
      reportType: "Patient ",
      userList: "William",
      date: "22/12/22 ",
    },
    // Add more data objects as needed
  ];
  return (
    <div  className={TableStyle.classContaineer}>
      <table className={TableStyle.classTable} >
        <thead className={TableStyle.classThead}>
          <tr>
            <th>REPORT ID</th>
            <th>REPORT TYPE</th>
            <th>Names</th>
            <th>DATE</th>
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
                {row.reportID}
              </td>
              <td
                style={{
                  borderTop: "  0.2px solid #e1e1e1",

                  borderBottom: "  0.2px solid #e1e1e1",
                }}
              >
                {row.reportType}
              </td>
              <td
                style={{
                  borderTop: "  0.2px solid #e1e1e1",

                  borderBottom: "  0.2px solid #e1e1e1",
                }}
              >
                {row.userList}
              </td>
              <td
                style={{
                  borderTop: "  0.2px solid #e1e1e1",

                  borderBottom: "  0.2px solid #e1e1e1",
                  borderRight: "  0.2px solid #e1e1e1",
                }}
              >
                {row.date}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ReceivedReport;
