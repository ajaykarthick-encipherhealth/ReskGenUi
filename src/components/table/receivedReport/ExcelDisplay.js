import React, { useEffect, useState } from "react";
import styles from "./receivedReport.module.css";
import dayjs from "dayjs";
import Spreadsheet, { CellBase, Matrix } from "react-spreadsheet";

const ExcelDisplay = ({ tableData }) => {
  const [data, setData] = useState();
  useEffect(() => {
    if (Array.isArray(tableData) && tableData.length > 0) {
      const fieldNames = tableData[0];
      const transformedData = tableData.slice(1).map((row) => {
        const rowData = {};
        fieldNames.forEach((fieldName, index) => {
          rowData[fieldName] = row[index];
        });
        return rowData;
      });

      const formattedData = transformedData.map((row) => {
        const values = Object.values(row);
        return values.map((value) => ({ value }));
      });

      setData(formattedData);
    } else {
      setData([]);
    }
  }, [tableData]);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      {tableData?.length > 0 ? (
        data && <Spreadsheet data={data} onChange={setData} />
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {data?.length === 0 ? "No data Found" : "loading...."}
        </div>
      )}
    </div>
  );
};

export default ExcelDisplay;
