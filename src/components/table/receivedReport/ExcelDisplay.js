import React from "react";
import styles from "./receivedReport.module.css";
import dayjs from "dayjs";
import Spinner from "../../spinner/spinner";

const ExcelDisplay = ({ tableData }) => {
  const renderRows = () => {
    const filteredData = tableData.filter((data) =>
      data.some((value) => value !== "")
    );

    return filteredData.map((data, index) => (
      <tr key={index}>
        <td>{data[0] || ""}</td>
        <td>{data[1] || ""}</td>
        <td>{data[2] || ""}</td>
        <td>{data[3] ? dayjs(data[3]).format("DD/MM/YYYY") : ""}</td>
        <td>{data[4] || ""}</td>
        <td>{data[5] || ""}</td>
        <td>{data[6] || ""}</td>
        <td>{data[7] || ""}</td>
      </tr>
    ));
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      {tableData?.length === 0 ? (
        <Spinner />
      ) : (
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
      )}
    </div>
  );
};

export default ExcelDisplay;
