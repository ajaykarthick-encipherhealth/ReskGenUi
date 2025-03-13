import React from "react";
import { handleSelector, resetPageNumber } from "../headerFilters/functions";
import { Select } from "antd";

const Selector = ({
  selectlabel,
  setSelectedOption,
  selectOptions,
  selectDefaultValue,
  setDefaultValue,
  setPageNo,
  onChanges,
  defaultSelectValue1,
  parentId,
  parentName
}) => {
  const labelId = `select-label-${selectlabel}`;
  return (
    <div>
      <label
        id={labelId}
        style={{ marginLeft: "10px" }}
        className="responsiveLabel"
      >
        {selectlabel}
      </label>
      <div id={parentId} name={parentName} class="form-group has-search custom-react-select">
        <Select
        name={selectlabel}
        id={selectlabel}
          options={selectOptions}
          aria-labelledby={labelId}
          placeholder={selectlabel || defaultSelectValue1}
          onChange={(value) => {
            handleSelector(value, setSelectedOption);
            setDefaultValue && setDefaultValue(value ? value : "");
            if (setPageNo) {
              resetPageNumber(setPageNo);
            }
            onChanges && onChanges();
          }}
          value={selectDefaultValue ? selectDefaultValue : null}
          allowClear={true}
        />
      </div>
    </div>
  );
};

export default Selector;
