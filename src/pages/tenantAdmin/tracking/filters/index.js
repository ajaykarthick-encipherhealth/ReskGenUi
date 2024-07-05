import React, { useState } from "react";
import styles from "../../../../resusablereport/reports/report.module.css";
import { Popover, Tooltip } from "antd";
import Tracking from "../tracking.module.css";

const MoreFilter = ({
  selectAll,
  setSelectAll,
  allFilters,
  setActiveFilters,
  activeFilters,
  setClear,
  handleClearAllFilters,
}) => {
  const [popoverVisible, setPopoverVisible] = useState(false);

  const handleHeaderCheckboxChange = () => {
    const updatedSelectAll = !selectAll;
    setSelectAll(updatedSelectAll);
    const updatedFilters = updatedSelectAll ? allFilters : [];
    setActiveFilters(updatedFilters);
  };

  const handleRowCheckboxChange = (filter) => {
    const isSelected = activeFilters?.includes(filter);
    const updatedFilters = isSelected
      ? activeFilters.filter((f) => f !== filter)
      : [...activeFilters, filter];
    setActiveFilters(updatedFilters);
  };

  const handleClearFilters = () => {
    setSelectAll(false);
    setActiveFilters([]);
    setClear(true);
  };

  const PopContent = (
    <>
      <input
        type="checkbox"
        onChange={handleHeaderCheckboxChange}
        className={`${styles.customChecked}`}
        checked={selectAll}
      />{" "}
      <span style={{ margin: "0 5px" }}>Select All</span>
      {allFilters?.map((filter, index) => (
        <div key={filter} style={{ margin: "10px 0px" }}>
          <input
            type="checkbox"
            onChange={() => handleRowCheckboxChange(filter)}
            className={`${styles.customChecked}`}
            checked={activeFilters.includes(filter)}
          />{" "}
          <span style={{ margin: "0 5px" }}>{filter}</span>
        </div>
      ))}
      <div
        style={{ marginTop: "10px", cursor: "pointer", color: "blue" }}
        onClick={handleClearAllFilters}
      >
        Clear Filters
      </div>
    </>
  );

  return (
    <div className="d-flex" style={{ cursor: "pointer" }}>
      <Popover
        content={PopContent}
        trigger="click"
        placement="bottom"
        visible={popoverVisible}
        onVisibleChange={setPopoverVisible}
      >
        <Tooltip title={"More Filters"}>
          <div
            className={Tracking.iconBorder}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="#03316f"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="#03316f"
              className="size-11"
              style={{ width: "24px", height: "24px" }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z"
              />
            </svg>
          </div>
        </Tooltip>
      </Popover>
      <span></span>
    </div>
  );
};

export default MoreFilter;
