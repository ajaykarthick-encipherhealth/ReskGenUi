import React, { useEffect, useState } from "react";
import styles from "./receivedReport.module.css";
import dayjs from "dayjs";
import Spinner from "../../spinner/spinner";

const ExcelDisplay = ({ tableData }) => {
  const [tableHead, setTableHead] = useState([]);

  useEffect(() => {
    if (Array.isArray(tableData) && tableData.length > 0) {
      const filteredData = tableData.filter((data) =>
        Object.values(data).some((value) => value !== "")
      );
      setTableHead(filteredData);
    }
  }, [tableData]);

  const headers = tableHead.length > 0 ? tableHead[0] : [];
  const dataRows = tableHead.slice(1);

  // Transform the data
  const transformedData = dataRows.map((row) => {
    const obj = {};
    row.forEach((value, index) => {
      obj[headers[index]] = value;
    });
    return obj;
  });

  const header = Object.keys(
    transformedData.length > 0 ? transformedData[0] : {}
  );

  const renderRows = () => {
    return transformedData.map((row, rowIndex) => (
      <tr key={rowIndex}>
        {header.map((header, cellIndex) => (
          <td key={cellIndex}>{row[header]}</td>
        ))}
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
              {header &&
                header?.map((header, index) => <th key={index}>{header}</th>)}
            </tr>
          </thead>
          <tbody>{renderRows()}</tbody>
        </table>
      )}
    </div>
  );
};

export default ExcelDisplay;
