import React from "react";
import TableStyle from "./tenantSettings.module.css";

const TenantSettingsTable = ({ columns, data, loading }) => {
  const allSortedContent = [];

  const genderValue = (value) => {
    switch (value) {
      case "MALE":
        return "Male";
      case "FEMALE":
        return "Female";
      case "OTHERS":
        return "Others";
      case "DEFAULT":
        return "Default";
    }
  };

  const typeValue = (value) => {
    switch (value) {
      case "PRE_DEFINED":
        return "Pre Defined";
      case "CODE":
        return "Code";
      case "DESCRIPTION":
        return "Description";
      case "DEFAULT":
        return "Default";
      default:
        return value;
    }
  };

  const yearValue = (value) => {

    if (value?.length > 2) {
      return (
        <div className="d-flex">
          <>{value?.join(",")}</>
        </div>
      );
    } else return value?.join(", ");
  };

  for (const row in data) {
    const sortedRowValues = [];
    columns.forEach((header) => {
      const value = data[row][header?.dataIndex];
      if (header?.dataIndex === "gender") {
        sortedRowValues.push(
          <td className={TableStyle.lastBorder}>{genderValue(value)}</td>
        );
      } else if (header?.dataIndex === "type") {
        sortedRowValues.push(
          <td className={TableStyle.lastBorder}>{typeValue(value)}</td>
        );
      } else if (header?.dataIndex === "years") {
        sortedRowValues.push(
          <td className={TableStyle.lastBorder}>{yearValue(value)}</td>
        );
      } else {
        sortedRowValues.push(
          <td className={TableStyle.lastBorder}>{value}</td>
        );
      }
    });
    allSortedContent.push(
      <tr style={{ height: "40px" }}>{sortedRowValues}</tr>
    );
  }
  return (
    <div className={TableStyle.classContaineer}>
      <table className={TableStyle.classTable}>
        <thead className={TableStyle.classTTotalhead}>
          <tr style={{ height: "40px" }}>
            {columns.map((item) => (
              <th>{item?.title}</th>
            ))}
          </tr>
        </thead>

        <tbody className={TableStyle.bodytable}>{allSortedContent}</tbody>
      </table>
    </div>
  );
};

export default TenantSettingsTable;
