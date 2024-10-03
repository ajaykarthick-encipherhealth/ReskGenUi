import React, { useEffect, useState } from "react";
import styles from "./receivedReport.module.css";
import { Empty } from "antd";

const CSVDisplay = ({ tableData, fileUrl, extention, loading }) => {
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
    return dataRows?.map((row, rowIndex) => (
      <tr key={rowIndex}>
        {headers.map((header, cellIndex) => (
          <td key={cellIndex}>{row[header]}</td>
        ))}
      </tr>
    ));
  };
  return (
    <div style={{ width: "100%", height: "100%" }}>
      {loading ? (
        <div className="d-flex align-items-center justify-content-center">
          Loading....
        </div>
      ) : fileUrl && extention && dataRows?.length > 0 ? (
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
      ) : (
        <div className="d-flex align-items-center justify-content-center">
          <Empty />
        </div>
      )}
    </div>
  );
};

export default CSVDisplay;
