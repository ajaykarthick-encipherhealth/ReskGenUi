import React from "react";
import Select from "react-select";
import { handleSelector } from "../headerFilters/functions";

const Selector = ({ selectlabel, setSelectedOption, selectOptions,filteratedDashboardData,defaultSelectValue1 }) => {
  return (
    <div>
      <label>{selectlabel}</label>
      <div class="form-group has-search">
        <Select
          onChange={(value) => {
            handleSelector(value,setSelectedOption);
          }}
          options={selectOptions}
          className="custom-react-select"
          isSearchable={false}
          placeholder={
            filteratedDashboardData
              ? filteratedDashboardData?.status?.toUpperCase()
              : "Select Status"
          }
        />
      </div>
    </div>
  );
};

export default Selector;