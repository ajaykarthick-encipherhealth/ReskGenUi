// import React, { useEffect, useState } from "react";
// import { Table, Input, InputNumber, Popconfirm, Form } from "antd";

// const EditableCell = ({
//   editing,
//   dataIndex,
//   title,
//   inputType,
//   record,
//   index,
//   children,
//   ...restProps
// }) => {
//   const inputNode = inputType === "number" ? <InputNumber /> : <Input />;
//   return (
//     <td {...restProps}>
//       {editing ? (
//         <Form.Item
//           name={dataIndex}
//           style={{ margin: 0 }}
//           rules={[
//             {
//               required: true,
//               message: `Please Input ${title}!`,
//             },
//           ]}
//         >
//           {inputNode}
//         </Form.Item>
//       ) : (
//         children
//       )}
//     </td>
//   );
// };

// const EditableTable = ({ tableData,fileUrl, extention}) => {
//   console.log(tableData)
//   const [form] = Form.useForm();
//   const [data, setData] = useState([]);
//   useEffect(() => {
//     if (Array.isArray(tableData) && tableData.length > 0) {
//       const columns = tableData[0];
//       const dataRows = tableData?.slice(1)?.map((row, index) => {
//         const obj = {};
//         columns.forEach((column, columnIndex) => {
//           obj[column] = row[columnIndex] ? row[columnIndex] : "-";
//         });
//         obj.key = index;
//         return obj;
//       });

//       setData(dataRows);
//     }
//   }, [tableData]);
//   const [editingKey, setEditingKey] = useState("");

//   const isEditing = (record) => record.key === editingKey;

//   const edit = (record) => {
//     form.setFieldsValue({ ...record });
//     setEditingKey(record.key);
//   };

//   const cancel = () => {
//     setEditingKey("");
//   };

//   const save = async (key) => {
//     try {
//       const row = await form.validateFields();
//       const newData = [...data];
//       const index = newData.findIndex((item) => key === item.key);

//       if (index > -1) {
//         const item = newData[index];
//         newData.splice(index, 1, { ...item, ...row });
//         setData(newData);
//         setEditingKey("");
//       } else {
//         newData.push(row);
//         setData(newData);
//         setEditingKey("");
//       }
//     } catch (errInfo) {
//       console.log("Validate Failed:", errInfo);
//     }
//   };
//   const columns = [
//     {
//       title: "PROCESSEDDATE",
//       dataIndex: "processedDate",
//       editable: true,
//     },
//     {
//       title: "NO OF SUGGESTED CODES",
//       dataIndex: "noOfSuggestedCodes",
//       editable: true,
//       render: (text) => {
//         return <span style={{ textalign: "center" }}>{text}</span>;
//       },
//     },
//     {
//       title: "COMMENTS",
//       dataIndex: "comments",
//       editable: true,
//     },
//     {
//       title: "ACTION",
//       dataIndex: "action",
//       render: (_, record) => {
//         const editable = isEditing(record);

//         return editable ? (
//           <span>
//             <a
//               href="#"
//               onClick={() => save(record.key)}
//               style={{ marginRight: 8 }}
//             >
//               Save
//             </a>
//             <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
//               <a>Cancel</a>
//             </Popconfirm>
//           </span>
//         ) : (
//           <a disabled={editingKey !== ""} onClick={() => edit(record)}>
//             Edit
//           </a>
//         );
//       },
//     },
//   ];

//   const mergedColumns = columns.map((col) => {
//     if (!col.editable) {
//       return col;
//     }

//     return {
//       ...col,
//       onCell: (record) => ({
//         record,
//         dataIndex: col.dataIndex,
//         title: col.title,
//         editing: isEditing(record),
//       }),
//     };
//   });

//   return (
//     <Form form={form} component={false}>
//       {fileUrl && extention? (
//         <Table
//           components={{
//             body: {
//               cell: EditableCell,
//             },
//           }}
//           bordered
//           dataSource={data}
//           columns={mergedColumns}
//           rowClassName="editable-row"
//           pagination={{
//             onChange: cancel,
//           }}
//         />
//       ) : (
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//           }}
//         >
//           loading....
//         </div>
//       )}
//     </Form>
//   );
// };

// export default EditableTable;

import React, { useEffect, useState } from "react";
import styles from "./receivedReport.module.css";
import dayjs from "dayjs";
import Spinner from "../../spinner/spinner";

const ExcelDisplay = ({ tableData,fileUrl, extention }) => {
  const [tableHead, setTableHead] = useState([]);

  useEffect(() => {
    if (Array.isArray(tableData) && tableData.length > 0) {
      const filteredData = tableData?.filter((data) =>
        Object.values(data).some((value) => value !== "")
      );
      setTableHead(filteredData);
    }
  }, [tableData]);

  const headers = tableHead.length > 0 ? tableHead[0] : [];
  const dataRows = tableHead.slice(1);

  // Transform the data
  const transformedData = dataRows.map((row) => {
    if (Array.isArray(row)) {
      const obj = {};
      row.forEach((value, index) => {
        obj[headers[index]] = value;
      });
      return obj;
    }
    // Handle non-array cases if needed
    return null; // Or handle the case in a different way based on your requirements
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
      {!fileUrl && !extention ? (
        <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        loading....
      </div>
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