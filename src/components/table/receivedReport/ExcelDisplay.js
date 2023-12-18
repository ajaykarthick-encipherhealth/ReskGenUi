import React, { useEffect, useState } from "react";
import { Table, Input, InputNumber, Popconfirm, Form } from "antd";

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === "number" ? <InputNumber /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const EditableTable = ({ tableData }) => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  useEffect(() => {
    if (Array.isArray(tableData) && tableData.length > 0) {
      const columns = tableData[0];
      const dataRows = tableData?.slice(1)?.map((row, index) => {
        const obj = {};
        columns.forEach((column, columnIndex) => {
          obj[column] = row[columnIndex] ? row[columnIndex] : "-";
        });
        obj.key = index; // Assign a unique identifier to the 'key' property
        return obj;
      });

      setData(dataRows);
    }
  }, [tableData]);
  const [editingKey, setEditingKey] = useState("");

  const isEditing = (record) => record.key === editingKey;


  const edit = (record) => {
    form.setFieldsValue({ ...record });
    setEditingKey(record.key);
  };
  
  const cancel = () => {
    setEditingKey("");
  };
  
  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
  
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setData(newData);
        setEditingKey("");
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };
  const columns = [
    {
      title: "ProcessedDate",
      dataIndex: "processedDate",
      editable: true,
    },
    {
      title: "NoOfSuggestedCodes",
      dataIndex: "noOfSuggestedCodes",
      editable: true,
    },
    {
      title: "Comments",
      dataIndex: "comments",
      editable: true,
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_, record) => {
        const editable = isEditing(record);
        console.log(editable,data)
        return editable ? (
          <span>
            <a
              href="#"
              onClick={() => save(record.key)}
              style={{ marginRight: 8 }}
            >
              Save
            </a>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <a disabled={editingKey !== ""} onClick={() => edit(record)}>
            Edit
          </a>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
  
    return {
      ...col,
      onCell: (record) => ({
        record,
        // inputType: col.dataIndex === "age" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record), 
      }),
    };
  });

  return (
    <Form form={form} component={false}>
      <Table
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        bordered
        dataSource={data}
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={{
          onChange: cancel,
        }}
      />
    </Form>
  );
};

export default EditableTable;
