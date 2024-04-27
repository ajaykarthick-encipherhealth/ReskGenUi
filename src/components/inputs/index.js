import React, { useCallback, useState } from "react";
import { InputText } from "primereact/inputtext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

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
}) => {
  const [inputStr, setInputStr] = useState("");

  const debounceFunc = useCallback(
    debounce((text) => setInputValue(text), 900),
    []
  );

  const handleChange = (event) => {
    const text = event.target.value;
    setInputStr(text);
    debounceFunc(text);
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
        value={inputStr}
        onChange={handleChange}
        className={
          isInputFiled
            ? "form-control new-inputform-control"
            : "form-control "
        }
        placeholder={placeholder}
        maxLength={25}
        disabled={isDisabled ? true : false}
        onKeyDown={(e) => {
          // Prevent input of backslash ("\")
          if (e.key === "\\") {
            e.preventDefault();
          }
        }}
      />
      
    </div>
  );
};

export default InputField;
