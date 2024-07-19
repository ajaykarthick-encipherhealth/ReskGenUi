import React, { useEffect, useRef, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Divider, Input, Select, Space } from "antd";
let index = 0;
const CustomSelect = ({
  options,
  onChange,
  setOptions,
  value,
  disabled,
  placeholder,
}) => {
  //   const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const inputRef = useRef(null);
  const onNameChange = (event) => {
    setName(event.target.value);
  };
  const addItem = (e) => {
    e.preventDefault();
    if (name?.length > 0) {
      setOptions([...options, { lable: name, value: name }]);
      setName("");
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  };

  return (
    <Select
      disabled={disabled}
      size="large"
      placeholder={placeholder ? placeholder : ""}
      dropdownRender={(menu) => (
        <>
          {menu}
          <Divider style={{ margin: "8px 0" }} />
          <div
            style={{ padding: "0 8px 4px", width: "100%" }}
            className="d-flex"
          >
            <Input
              placeholder="Please enter item"
              value={name}
              onChange={onNameChange}
              onKeyDown={(e) => e.stopPropagation()}
              style={{ width: "70%" }}
            />
            <Button
              type="text"
              size="large"
              style={{
                backgroundColor: "black",
                margin: "0 10px",
                color: "#fff",
              }}
              icon={<PlusOutlined twoToneColor="#fff" />}
              onClick={addItem}
            >
              Add item
            </Button>
          </div>
        </>
      )}
      options={options}
      onChange={onChange}
      value={value}
    />
  );
};
export default CustomSelect;
