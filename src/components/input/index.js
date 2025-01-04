import React, { useCallback, useEffect, useState } from "react";
// import { InputText } from "primereact/inputtext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { resetPageNumber } from "../headerFilters/functions";
import { Input } from "antd";

export const debounce = (func, delay) => {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};

export const disallowedCharacters = [
  "[",
  "{",
  "]",
  "}",
  "|",
  "!",
  ",",
  "%",
  "^",
  "\\",
  "(",
  ")",
  "#",
];

const InputField = ({
  isSearch,
  placeholder,
  setInputValue,
  type,
  isDisabled,
  isInputFiled,
  isTracking,
  trackInput,
  setTrackInput,
  ReportName,
  setSentSearch,
  setReceivedSearch,
  setCoderSearch,
  activeTab,
  setSearchVal,
  searchVal,
  isReport,
  setPageNo,
  id,
  name,
  value,
}) => {
  const [inputStr, setInputStr] = useState(value);

  const debounceFunc = useCallback(
    debounce((text, activeTab) => {
      if (activeTab === "SentReport") {
        setSentSearch(text);
      } else if (activeTab === "ReceivedReport") {
        setReceivedSearch(text);
      } else if (activeTab === "CoderReport") {
        setCoderSearch(text);
      } else {
        setInputValue(text);
      }
    }, 700),
    []
  );

  const handleChange = (event) => {
    const text = event.target.value.trimStart();
    if (isTracking) {
      setTrackInput(text);
    } else {
      if (activeTab) {
        setSearchVal(text);
      } else {
        setInputStr(text);
      }
    }
    if (setPageNo) {
      resetPageNumber(setPageNo);
    }
    debounceFunc(text, activeTab);
  };
  useEffect(() => {
    setInputStr(value);
  }, [value]);

  return (
    <div style={{ height: "45px" }}>
      <Input
        type={type}
        value={
          isTracking
            ? trackInput
            : isReport
            ? ReportName
            : activeTab
            ? searchVal
            : inputStr
        }
        autoComplete="off"
        onChange={handleChange}
        className={`w-100 ${
          isReport ? "new-search-control1" : "new-search-control"
        } border-none`}
        placeholder={placeholder}
        maxLength={25}
        disabled={isDisabled ? true : false}
        onKeyDown={(e) => {
          // Prevent input of backslash ("\")
          if (disallowedCharacters.includes(e.key)) {
            e.preventDefault();
          }
        }}
        prefix={
          isSearch && (
            <FontAwesomeIcon
              className="searchPrefix"
              icon={faSearch}
              data-testid="searchPrefix"
            />
          )
        }
        allowClear={true}
        data-testid="searchPrefix"
        id={id}
        name={name}
      />
    </div>
  );
};

export default InputField;
