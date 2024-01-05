import React, { useEffect, useState } from "react";
import styles from "./receivedReport.module.css";

const CSVDisplay = ({ tableData,fileUrl, extention }) => {
  const [tableHead, setTableHead] = useState([]);
  useEffect(() => {
    if (Array.isArray(tableData) && tableData.length > 0) {
      const filteredData = tableData.filter((data) =>
        Object.values(data).some((value) => value !== "")
      );
      setTableHead(filteredData);
    }
  }, [tableData]);

  const headers = tableHead.length > 0 ? Object.keys(tableHead[0]) : [];
  const dataRows = tableHead;

  const renderRows = () => {
    return dataRows?.length > 0 ? (
      dataRows?.map((row, rowIndex) => (
        <tr key={rowIndex}>
          {headers.map((header, cellIndex) => (
            <td key={cellIndex}>{row[header]}</td>
          ))}
        </tr>
      ))
    ) : (
      <tr>
        <td style={{ textAlign: "center" }}>No datas Found</td>
      </tr>
    );
  };
  return (
    <div style={{ width: "100%", height: "100%" }}>
      {!fileUrl && !extention ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          loading....
        </div>
      ) : (
        <table className={styles.exceltable}>
          <thead>
            <tr>
              {headers?.map((header, index) => (
                <th key={index}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody className={styles.csvBody}>{renderRows()}</tbody>
        </table>
      )}
    </div>
  );
};

export default CSVDisplay;
