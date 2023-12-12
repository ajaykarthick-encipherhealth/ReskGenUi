import React from 'react';
import * as XLSX from 'xlsx';
import styles from './receivedReport.module.css'

export const exportToExcel = ({data}) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    const excelBuffer = XLSX.write(wb, {
      bookType: 'xlsx',
      type: 'array',
      compression: true,
    });

    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const dataExcel = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = dataExcel;
    link.download = 'export.xlsx';
    link.click();
  };

const ExcelDisplay = ({headers,data}) => {

  return (
    <div style={{width:"100%"}}>
      <table className={styles.exceltable}>
        <thead>
          <tr>
          {headers.map((header, index) => (
              <th key={index}>{header.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {Object.values(row).map((value, index) => (
                <td key={index}>{value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {/* <button onClick={exportToExcel}>Export to Excel</button> */}
    </div>
  );
};

export default ExcelDisplay;
