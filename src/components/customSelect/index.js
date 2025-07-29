import React, { useEffect, useRef, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Divider, Input, Select, Space } from "antd";
import { getResponePopup } from "../../utils/reusable";
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
    const value = event.target.value.trimStart();
    setName(value);
  };

  const addItem = (e) => {
    e.preventDefault();
    const trimmedName = name?.trim();
    if (!trimmedName) return;
    const isDuplicate = options.some(
      (option) => option.value.toLowerCase() === trimmedName.toLowerCase()
    );
    if (isDuplicate) {
      getResponePopup({
        status: "FAILED",
        message: "Item already exists!",
        duration: 5,
      });
      return;
    }

    setOptions([...options, { label: trimmedName, value: trimmedName }]);
    setName("");
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
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
              onMouseDown={(e) => e.stopPropagation()}
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
