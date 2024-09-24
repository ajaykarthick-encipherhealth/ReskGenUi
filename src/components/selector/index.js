import React from "react";
import Select from "react-select";
import { handleSelector, resetPageNumber } from "../headerFilters/functions";

const Selector = ({
  selectlabel,
  setSelectedOption,
  selectOptions,
  isClose = false,
  selectDefaultValue,
  setDefaultValue,
  setPageNo,
  onChanges
}) => {
  return (
    <div>
      <label style={{ marginLeft: "10px" }}>{selectlabel}</label>
      <div class="form-group has-search">
        <Select
          options={selectOptions}
          className="custom-react-select"
          isSearchable={false}
          isClearable={isClose}
          onChange={(value) => {
            handleSelector(value, setSelectedOption);
            setDefaultValue && setDefaultValue(value)
            if(setPageNo){
              resetPageNumber(setPageNo)
            }
            onChanges && onChanges()
          }}
          value={selectDefaultValue && {label:selectDefaultValue,value:selectDefaultValue}}
        />
      </div>
    </div>
  );
};

export default Selector;
