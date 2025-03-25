import React, { useCallback, useEffect, useState } from "react";
import { Input } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const ReusableMultiInput = ({
  setPageNumber,
  disabled,
  placeholder,
  value,
  isSearch,
  handleInputStr,
  name,
  setSearchText,
  props,
  testId,
  id,
}) => {
  const [localStr, setLocalStr] = useState({});

  const debounceFunc = useCallback(
    debounce((text, name) => {
      setSearchText && setSearchText((prev) => ({ ...prev, [name]: text }));
      setPageNumber && setPageNumber(0);
    }, 700),
    []
  );

  const handleChange = (e) => {
    const text = e.target.value;
    const name = e.target.name;

    setLocalStr((prev) => ({ ...prev, [name]: text }));

    if (!text) {
      setSearchText &&
        setSearchText((prev) => {
          const updated = { ...prev };
          delete updated[name];
          return updated;
        });
    }

    if (isSearch && !handleInputStr) {
      debounceFunc(text, name);
    } else {
      handleInputStr(text);
    }
  };

  useEffect(() => {
    setLocalStr(value || {});
  }, [value]);

  return (
    <div id={id} name={name} className="reusableInput">
      <Input
        data-testid={testId}
        {...props}
        placeholder={placeholder}
        value={localStr[name] || (value ? value[name] : "")}
        onChange={handleChange}
        prefix={<FontAwesomeIcon className="searchPrefix" icon={faSearch} />}
        name={name}
        allowClear={true}
        disabled={disabled}
        autoComplete="off"
        className="w-100 reusableInput new-search border-none"
      />
    </div>
  );
};

export default ReusableMultiInput;


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
