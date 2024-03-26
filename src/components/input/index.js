import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const InputField = ({
  isSearch,
  placeholder,
  inputValue,
  setInputValue,
  delay,
  type,
  isDisabled,
  isInputFiled,
}) => {

const handleChange = (e) => {
  const value = e.target.value;
    setInputValue(value);
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
        value={inputValue}
        onChange={handleChange}
        className={isInputFiled?"form-control new-inputform-control":"form-control new-form-control"}
        placeholder={placeholder}
        maxLength={25}
        disabled={isDisabled?true:false}
      />
    </div>
  );
};

export default InputField;
