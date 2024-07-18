import { Button, Divider, Input, Select, Space } from "antd";
import React, { useRef, useState } from "react";
import { PlusOutlined } from '@ant-design/icons';

const CustomSelector = () => {
  let index = 0;

  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const inputRef = useRef(null);

  const onNameChange = (event) => {
    setName(event.target.value);
  };

  const addItem = (e) => {
    e.preventDefault();
    setItems([...items, name || `New item ${index++}`]);
    setName("");
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  return (
    <Select
      style={{
        width: "100%",
      }}
      size="large"
      placeholder="MRN Number"
      dropdownRender={(menu) => (
        <>
          {menu}
          <Divider
            style={{
              margin: "8px 0",
            }}
          />
          <Space
            style={{
              padding: "0 8px 4px",
            }}
          >
            <Input
              placeholder="Please enter item"
              ref={inputRef}
              value={name}
              onChange={onNameChange}
              onMouseDown={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
            />
            <Button
              type="text"
              icon={<PlusOutlined />}
              onMouseDown={(e) => e.preventDefault()}
              onClick={addItem}
            >
              Add item
            </Button>
          </Space>
        </>
      )}
      options={items.map((item) => ({
        label: item,
        value: item,
      }))}
    />
  );
};

export default CustomSelector;
