import React, { useEffect, useState } from "react";
import Spreadsheet from "react-spreadsheet";
import { Empty } from "antd";

const ExcelDisplay = ({ tableData, loading, extention }) => {
  const [data, setData] = useState();

  useEffect(() => {
    if (Array.isArray(tableData) && tableData?.length > 0) {
      const fieldNames = tableData[0];
      const transformedData = tableData?.slice(1).map((row) => {
        const rowData = {};
        fieldNames?.forEach((fieldName, index) => {
          rowData[fieldName] = row[index];
        });
        return rowData;
      });

      const formattedData = transformedData?.map((row) => {
        const values = Object.values(row);
        return values?.map((value) => ({ value }));
      });
      const reactFormatData = tableData[0]?.map((key) => {
        return {
          value: key || "",
        };
      });

      setData([reactFormatData, ...formattedData]);
    } else {
      setData([]);
    }
  }, [tableData]);
  const allEmpty = data?.every((row) =>
    row?.every((cell) => cell?.value === "")
  );

  return (
    <div style={{ width: "100%", height: "100%" }}>
      {loading ? (
        <div className="d-flex align-items-center justify-content-center">
          Loading....
        </div>
      ) : Array.isArray(data) && data?.length > 0 ? (
        <Spreadsheet data={data} onChange={setData} />
      ) : (
        <div className="d-flex align-items-center justify-content-center">
          <Empty />
        </div>
      )}
    </div>
  );
};

export default ExcelDisplay;
