import React from "react";
import { handleSelector, resetPageNumber } from "../headerFilters/functions";
import { Select } from "antd";

const Selector = ({
  selectlabel,
  setSelectedOption,
  selectOptions,
  isClose = false,
  selectDefaultValue,
  setDefaultValue,
  setPageNo,
  onChanges,
  defaultSelectValue1
  
}) => {
  return (
    <div>
      <label style={{ marginLeft: "10px" }} className="responsiveLabel">{selectlabel}</label>
      <div class="form-group has-search custom-react-select">
        <Select
          // className="custom-react-select"
          options={selectOptions}
          // isSearchable={false}
          // isClearable={isClose}
          placeholder={selectlabel||defaultSelectValue1}
          onChange={(value) => {
            handleSelector(value, setSelectedOption);
            setDefaultValue && setDefaultValue(value?value:"")
            if(setPageNo){
              resetPageNumber(setPageNo)
            }
            onChanges && onChanges()
          }}
          value={selectDefaultValue ?selectDefaultValue:null}
          allowClear={true}
        />
      </div>
    </div>
  );
};

export default Selector;
