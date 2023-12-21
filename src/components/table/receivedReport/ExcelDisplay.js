import React, { useEffect, useState } from "react";
import styles from "./receivedReport.module.css";
import dayjs from "dayjs";
import Spinner from "../../spinner/spinner";
import Spreadsheet, { CellBase, Matrix } from "react-spreadsheet";

const ExcelDisplay = ({ tableData }) => {
  const[data,setData]=useState()
  const fieldNames = tableData[0];
  const transformedData = tableData?.slice(1)?.map((row) => {
    const rowData = {};
    fieldNames.forEach((fieldName, index) => {
      rowData[fieldName] = row[index];
    });
    return rowData;
  });

  const formattedData = transformedData?.map((row) => {
    const values = Object.values(row);
    return values?.map((value) => ({ value }));
  });
  useEffect(()=>{
    setData(formattedData)
  },[tableData])

  return (
    <div style={{ width: "100%", height: "100%" }}>
      {tableData?.length > 0 ? (
        <Spreadsheet data={data} onChange={setData} />
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          loading....
        </div>
      )}
    </div>
  );
};

export default ExcelDisplay;
