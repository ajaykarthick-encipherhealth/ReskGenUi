import React from 'react';
import { CSVLink } from 'react-csv';
import styles from './receivedReport.module.css';

const CSVDisplay = () => {
  const data = [
    // Define data to be exported as CSV
    { name: 'John', age: 30 },
    { name: 'Jane', age: 25 },
    // Add more data as needed
  ];

  const headers = [
    // Define headers for CSV columns
    { label: 'Name', key: 'name' },
    { label: 'Age', key: 'age' },
    // Add more headers according to your data structure
  ];

  return (
    <div  style={{width:"100%"}}>
      <table className={styles.csvTable}>
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
              {headers.map((header, index) => (
                <td key={index}>{row[header.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {/* <CSVLink data={data} headers={headers} filename={'export.csv'}>
        Export to CSV
      </CSVLink> */}
    </div>
  );
};

export default CSVDisplay;
