import React from "react";
import moment from "moment";
import TableStyle from "../table.module.css";

function PatientTable({ patinetListAll, actionBodyTemplate }) {
  const renderRows = () => {
    return patinetListAll.map((data, index) => (
      <tr key={index}>
        <td className={TableStyle.firstTdBorder}>{data.patientId}</td>
        <td className={TableStyle.childBorder}>{data.patientName}</td>
        <td className={TableStyle.childBorder}>{data.status}</td>
        <td className={TableStyle.childBorder}>
          {moment(data.dueDate).format("MM-DD-YYYY")}
        </td>
        <td className={TableStyle.childBorder}>
          {moment(data.lastModifiedDate).format("MM-DD-YYYY")}
        </td>
        <td className={TableStyle.lastBorder}>{actionBodyTemplate(data)}</td>
      </tr>
    ));
  };

  return (
    <div className={TableStyle.classContaineer}>
      <table className={TableStyle.classTable}>
        <thead className={TableStyle.classThead}>
          <tr>
            <th>Patient Id</th>
            <th>Patient Name</th>
            <th>Status</th>
            <th>Due Date</th>
            <th>Completed Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>{renderRows()}</tbody>
      </table>
    </div>
  );
}

export default PatientTable;
