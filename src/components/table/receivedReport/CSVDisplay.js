import React from "react";
import styles from "./receivedReport.module.css";

const CSVDisplay = ({ tableData }) => {
  return (
    <div style={{ width: "100%" }}>
      <table className={styles.csvTable}>
        <thead>
          <tr>
            {tableData.map((header, index) =>
              Object.keys(header).map((value, index) => (
                <th key={index}>{value}</th>
              ))
            )}
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {Object.values(row).map((value, index) => (
                <td key={index}>{value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CSVDisplay;
