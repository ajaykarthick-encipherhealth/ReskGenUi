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
  setSearchText,
  props,
  testId,
  id,
}) => {
  const [localStr, setLocalStr] = useState(null);
  const debounceFunc = useCallback(
    debounce((text) => {
      setSearchText && setSearchText(text?text.trim():null);
      setPageNumber && setPageNumber(0);
    }, 700),
    []
  );

  const handleChange = (text) => {
    setLocalStr(text.trimStart());
    if (isSearch && !handleInputStr ) {
      debounceFunc(text);
    }
    if (handleInputStr) {
      handleInputStr(text);
    }
  };

  useEffect(() => {
    setLocalStr(value?.trimStart() || "");
  }, [value]);
  return (
    <div id={id} className="reusableInput">
      <Input
        data-testid={testId}
        {...props}
        placeholder={placeholder}
        // value={localStr || value}
        value={localStr}
        onChange={(e) => {
          handleChange(e.target.value);
        }}
        prefix={<FontAwesomeIcon className="searchPrefix" icon={faSearch} />}
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
