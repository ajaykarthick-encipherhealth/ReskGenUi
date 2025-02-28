import React, { useCallback, useEffect, useState } from "react";
import { Input } from "antd";

const ReusableInput = ({
  setPageNumber,
  disabled,
  placeholder,
  value,
  isSearch,
  handleInputStr,
  name,
  setSearchText,
  props,
}) => {
  const [localStr, setLocalStr] = useState("");
  const debounceFunc = useCallback(
    debounce((text) => setSearchText && setSearchText(text), 1600),
    []
  );

  const handleChange = (text) => {
    setLocalStr(text);
    if (isSearch && !handleInputStr) {
      debounceFunc(text);
    } else {
      handleInputStr(text);
    }
    setPageNumber && setPageNumber(0);
  };

  useEffect(() => {
    setLocalStr(value || "");
  }, [value]);

  return (
    <div
      style={{ height: "43px" }}
      className="custom-reportInput"
    >
      <Input
        id="search"
        {...props}
        placeholder={placeholder}
        value={localStr || value}
        onChange={(e) => {
          handleChange(e.target.value);
        }}
        name={name}
        allowClear={true}
        disabled={disabled}
        autoComplete="off"
        className={"w-100 new-search-control2 border-none "}
      />
    </div>
  );
};

export default ReusableInput;

export const debounce = (func, delay) => {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};

export const handleSearch = (setSearchText, setPageNumber) => {
  return useCallback(
    debounce((name) => {
      setSearchText(name);
      setPageNumber(0);
    }, 1000),
    [setSearchText, setPageNumber]
  );
};
