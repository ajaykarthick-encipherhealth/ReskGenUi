import React from "react";
import Select from "react-select";

const Selector = ({ selectlabel, onSelectChange, selectOptions,filteratedDashboardData,defaultSelectValue1 }) => {
  return (
    <div>
      <label>{selectlabel}</label>
      <div class="form-group has-search">
        <Select
          onChange={(value) => {
            onSelectChange(value);
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