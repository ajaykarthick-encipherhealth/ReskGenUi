import React from "react";
import filter from "../../images/svg/newReport/filter.svg";
import Image from "next/image";
import styles from "./report.module.css";
import { Popover } from "antd";

const MoreFilter = ({
  checkedList,
  selectedData,
  setSelectedData,
  selectAll,
  setSelectAll,
}) => {
  const handleHeaderCheckboxChange = () => {
    setSelectAll(!selectAll);
    const updatedRows = selectAll ? [] : checkedList;
    setSelectedData(updatedRows);
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
      <input
        type="checkbox"
        onChange={handleHeaderCheckboxChange}
        className={`${styles.customChecked}`}
        checked={selectAll}
      />{" "}
      <span style={{ margin: "0 5px" }}>Select All</span>
      {checkedList?.map((item, index) => (
        <div key={item?.id} style={{ margin: "10px 0px" }}>
          <input
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
      <Popover content={PopContent} trigger="click" placement="bottom">
        <span className={`${styles.moreStyle} text-truncate`}>More Filters</span>
      </Popover>
      <span>
        <Image src={filter} alt="noimg" height="30" />
      </span>
    </div>
  );
};

export default MoreFilter;
