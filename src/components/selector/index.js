import React from "react";
import Select from "react-select";
import { handleSelector } from "../headerFilters/functions";

const Selector = ({
  selectlabel,
  setSelectedOption,
  selectOptions,
  defaultSelectValue1,
  isClose = false
}) => {
  return (
    <div>
      <label style={{marginLeft:"10px"}}>{selectlabel}</label>
      <div class="form-group has-search">
        <Select
          onChange={(value) => {
            handleSelector(value, setSelectedOption);
          }}
          options={selectOptions}
          className="custom-react-select"
          isSearchable={false}
          isClearable={isClose}
          placeholder={defaultSelectValue1?.label}
        />
      </div>
    </div>
  );
};

export default Selector;
