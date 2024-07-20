import React, { useCallback, useState } from "react";
import { InputText } from "primereact/inputtext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { resetPageNumber } from "../headerFilters/functions";

export const debounce = (func, delay) => {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};

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
  setPageNo
}) => {
  const [inputStr, setInputStr] = useState("");
  const disallowedCharacters = ['[', '{', ']', '}', '|', '!', ',', '%', '^', "\\", "(", ")", "#"];
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
    const text = event.target.value;
    if (isTracking) {
      setTrackInput(text);
    } else {
      if (activeTab) {
        setSearchVal(text);
      } else {
        setInputStr(text);
      }
    }
    if(setPageNo){
      resetPageNumber(setPageNo)
    }
    debounceFunc(text, activeTab);
  };

  return (
    <div className="form-group has-search">
      {isSearch && (
        <FontAwesomeIcon
          className="fa fa-search form-control-feedback"
          icon={faSearch}
        />
      )}
      <InputText
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
        onChange={handleChange}
        className={
          isInputFiled
            ? "form-control new-inputform-control"
            : "form-control new-form-control new-item-control"
        }
        placeholder={placeholder}
        maxLength={25}
        disabled={isDisabled ? true : false}
        onKeyDown={(e) => {
          // Prevent input of backslash ("\")
          if (disallowedCharacters.includes(e.key)) {
            e.preventDefault();
          }
        }}
        su
      />
    </div>
  );
};

export default InputField;
