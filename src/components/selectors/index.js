import React, { useRef } from "react";
import Select from "react-select";
import { handleSelector } from "../headerFilters/functions";

const Selector = ({
  selectlabel,
  setSelectedOption,
  selectOptions,
  isClose = false,
}) => {
  const selectRef = useRef(null);

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <label htmlFor="select-label" className="labelStyle responsiveLabel">
        {selectlabel}
      </label>
      <div className="form-group has-search">
        <Select
        ref={selectRef}
          options={selectOptions}
          className="custom-react-select"
          isSearchable={false}
          isClearable={isClose}
          onChange={(value) => {
            handleSelector(value, setSelectedOption);
          }}
          aria-labelledby="select-label" 
          inputId="select-label" 
        />
      </div>
    </div>
  );
};

export default Selector;
