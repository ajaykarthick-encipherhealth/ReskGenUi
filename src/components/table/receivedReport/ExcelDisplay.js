import React from "react";
import * as XLSX from "xlsx";
import styles from "./receivedReport.module.css";

// export const exportToExcel = ({ data }) => {
//   const ws = XLSX.utils.json_to_sheet(data);
//   const wb = XLSX.utils.book_new();
//   XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

//   const excelBuffer = XLSX.write(wb, {
//     bookType: "xlsx",
//     type: "array",
//     compression: true,
//   });

//   const blob = new Blob([excelBuffer], {
//     type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//   });
//   const dataExcel = URL.createObjectURL(blob);
//   const link = document.createElement("a");
//   link.href = dataExcel;
//   link.download = "export.xlsx";
//   link.click();
// };

const ExcelDisplay = ({ tableData }) => {
  return (
    <div style={{ width: "100%" }}>
      <table className={styles.exceltable}>
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

export default ExcelDisplay;
