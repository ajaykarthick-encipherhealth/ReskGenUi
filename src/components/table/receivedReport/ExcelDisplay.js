import React from "react";
import styles from "./receivedReport.module.css";
import dayjs from "dayjs";

const ExcelDisplay = ({ tableData }) => {
  const renderRows = () => {
    return tableData?.map((data, index) => (
      <tr key={index}>
        <td>{data.patientId}</td>
        <td>{data.patientName}</td>
        <td>{data.noOfValidCodes}</td>
        <td>{dayjs(data?.processedDate).format("DD/MM/YYYY")}</td>
        <td>{data.comments ? data.comments : ""}</td>
        <td>{data.auditorname ? data.auditorname : ""}</td>
        <td>{data.rafscore ? data.rafscore : ""}</td>
        <td>{data.flag ? data.flag : ""}</td>
      </tr>
    ));
  };
  return (
    <div style={{ width: "100%" }}>
      <table className={styles.exceltable}>
        <thead>
        <tr>
          <th>PATIENT ID</th>
          <th>PATIENT NAME</th>
          <th>HCC</th>
          <th>COMPLETED DATE</th>
          <th>COMMENTS</th>
          <th>AUDITOR NAME</th>
          <th>Raf score</th>
          <th>Flag</th>
        </tr>
        </thead>
        <tbody>{renderRows()}</tbody>
      </table>
    </div>
  );
};

export default ExcelDisplay;
