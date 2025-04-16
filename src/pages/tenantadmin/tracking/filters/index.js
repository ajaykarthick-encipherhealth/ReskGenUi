import React, { useState } from "react";
import styles from "../../../../mainStream/components/moreFilters/report.module.css";
import { Divider, Popover, Tooltip } from "antd";
import Tracking from "../tracking.module.css";
import { connect } from "react-redux";
import { actions as allPatientSyncAction } from "../../../../stores/tenantAdmin/patientSync";
import { useRouter } from "next/router";
import { createIdGen } from "../../../../utils/reusable";
const MoreFilter = ({
  setSelectAll,
  FilterItems,
  setActiveFilters,
  activeFilters,
  handleClearFilters,
  handleClearAllFilters,
  id,
  columns,
}) => {
  
  const router = useRouter();
  const [popoverVisible, setPopoverVisible] = useState(false);

  const handleHeaderCheckboxChange = (val) => {
    setSelectAll(val.target.checked);
    setActiveFilters((prev) => [
  
      ...prev.map((x) => ({
        ...x,
        active: val.target.checked,
      })),
    ]);
  };

  const handleRowCheckboxChange = (filter, e) => {
    setActiveFilters((prev) =>
      prev.map((x) =>
        x.title === filter.title ? { ...x, active: !x.active } : x
      )
    );
  };
  const PopContent = (
    <>
      <div className="d-flex my-2">
        <input
          id="selectAll"
          name="selectAll"
          type="checkbox"
          onChange={handleHeaderCheckboxChange}
          className={`${styles.customChecked}`}
          checked={activeFilters?.every((item) => item.active)}
        />{" "}
        <span style={{ margin: "0 5px" }}>Select All</span>
      </div>
      <Divider className="m-0 p-0" />
      {activeFilters?.map((filter, index) => (
        <div key={filter} style={{ margin: "10px 0px" }}>
          <input
            id={
              id
                ? createIdGen("filtercheckbox " + id)
                : createIdGen(
                    "filtercheckbox " +
                      router.pathname.replaceAll("/", " ") +
                      index
                  )
            }
            type="checkbox"
            onChange={(e) => handleRowCheckboxChange(filter, e)}
            className={`${styles.customChecked}`}
            checked={filter.active}
          />
          <span style={{ margin: "0 5px" }}>{filter.placeholder}</span>
        </div>
      ))}

      <div className="d-flex justify-content-between">
        <div
          style={{ marginTop: "10px", cursor: "pointer", color: "blue" }}
          onClick={handleClearAllFilters}
          id="clear-filters"
          name="clear-filters"
        >
          Clear Filters
        </div>
        <div
          style={{ marginTop: "10px", cursor: "pointer", color: "blue" }}
          onClick={handleClearFilters}
          id="reset-filters"
          name="reset-filters"
        >
          Reset
        </div>
      </div>
    </>
  );

  return (
    <div
      id="filter-icon"
      name="filter-icon"
      className="d-flex"
      style={{ cursor: "pointer" }}
    >
      <Popover
        content={PopContent}
        trigger="click"
        placement="bottom"
        visible={popoverVisible}
        onVisibleChange={setPopoverVisible}
      >
        <Tooltip title={"More Filters"}>
          <div
            id="filter-img"
            name="filter-img"
            className={Tracking.iconBorderFlex}
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
    </div>
  );
};

const enhancer = connect((state) => ({}), {
  getRoutedData: allPatientSyncAction.getRoutedData,
});
export default enhancer(MoreFilter);
