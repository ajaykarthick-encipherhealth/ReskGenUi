import React from "react";
import Select from "react-select";
import { handleSelector } from "../headerFilters/functions";

const Selector = ({
  selectlabel,
  setSelectedOption,
  selectOptions,
  defaultSelectValue1,
}) => {
  return (
    <div>
      <label>{selectlabel}</label>
      <div class="form-group has-search">
        <Select
          onChange={(value) => {
            handleSelector(value, setSelectedOption);
          }}
          options={selectOptions}
          className="custom-react-select"
          isSearchable={false}
          placeholder={defaultSelectValue1?.label}
        />
      </div>
    </div>
  );
};

export default Selector;
