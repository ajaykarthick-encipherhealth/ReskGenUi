import React, { useCallback, useEffect, useState } from "react";
import { Input } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

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
  testId
}) => {
  const [localStr, setLocalStr] = useState("");
  const debounceFunc = useCallback(
    debounce((text) => {
      setSearchText && setSearchText(text);
      setPageNumber && setPageNumber(0);
    }, 700),
    []
  );

  const handleChange = (text) => {
    setLocalStr(text);
    if (!text) {
      setSearchText && setSearchText(null);
    }
    if (isSearch && !handleInputStr) {
      debounceFunc(text);
    } else {
      handleInputStr(text);
    }
  };

  useEffect(() => {
    setLocalStr(value || "");
  }, [value]);

  return (
    <div id="reusableInput" name="reusableInput" className="reusableInput">
      <Input
        data-testid={testId}
        {...props}
        placeholder={placeholder}
        value={localStr || value}
        onChange={(e) => {
          handleChange(e.target.value);
        }}
        prefix={<FontAwesomeIcon className="searchPrefix" icon={faSearch} />}
        name={name}
        allowClear={true}
        disabled={disabled}
        autoComplete="off"
        className={"w-100 reusableInput new-search border-none"}
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
