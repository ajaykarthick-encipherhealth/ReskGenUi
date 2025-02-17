import React from "react";
import filter from "../../../images/svg/newReport/filter.svg";
import Image from "next/image";
import styles from "./report.module.css";
import { Divider, Popover, Tooltip } from "antd";

const MoreFilter = ({
  checkedList,
  selectedData,
  setSelectedData,
  selectAll,
  setSelectAll,
}) => {
  const handleHeaderCheckboxChange = (e) => {
    setSelectAll(e.target.checked);
    setSelectedData(e.target.checked ? checkedList : []);
  };
  const handleRowCheckboxChange = (row) => {
    const isSelected = selectedData?.some(
      (selectedRow) => selectedRow.id === row?.id
    );
    let updatedRows;

    if (isSelected) {
      updatedRows = selectedData?.filter(
        (selectedRow) => selectedRow.id !== row?.id
      );
    } else {
      updatedRows = [...selectedData, row];
    }

    setSelectedData(updatedRows);
  };

  const PopContent = (
    <>
      <div className="d-flex my-2">
        <input
          id="select-all"
          name="select-all"
          type="checkbox"
          onChange={handleHeaderCheckboxChange}
          className={`${styles.customChecked}`}
          checked={selectedData?.length === checkedList?.length}
        />
        <div style={{ margin: "0 5px" }} className="mx-2">
          Select All
        </div>
      </div>
      <Divider className="p-0 m-0" />
      {checkedList?.map((item, index) => (
        <div key={item?.id} style={{ margin: "10px 0px" }}>
          <input
            name={item.name}
            id={item.name}
            type="checkbox"
            onChange={() => {
              handleRowCheckboxChange(item);
            }}
            className={`${styles.customChecked}`}
            checked={selectedData?.some(
              (selectedRow) => selectedRow?.id === item?.id
            )}
          />{" "}
          <span style={{ margin: "0 5px" }}>{item.name}</span>
        </div>
      ))}
    </>
  );

  return (
    <div className="d-flex" style={{ cursor: "pointer" }}>
      <Tooltip title="More Filters">
        <Popover content={PopContent} trigger="click" placement="bottom">
          <div  id="filter-img"
            name="filter-img">
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
        </Popover>
      </Tooltip>
    </div>
  );
};

export default MoreFilter;
