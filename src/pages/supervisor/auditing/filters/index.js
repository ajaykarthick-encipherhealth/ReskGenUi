import React, { useState } from "react";
import { Popover, Select, Tooltip } from "antd";
import Image from "next/image";
import styles from "../../../../pages/reviewer/report/report.module.css";
import Legends from "../../../../components/legends";
import DateRangePicker from "../../../../components/rangepicker";
import Search from "../../../../components/search";
import { resetPageNumber } from "../../../../components/headerFilters/functions";
import { InfoCircleFilled } from "@ant-design/icons";
import MoreFilter from "../../../tenantadmin/tracking/filters";
import { removeStorage } from "../../../../utils/storages";
import dayjs from "dayjs";
export const allFilters = [
  "Reviewer Status",
  "Select Audited Status",
  "Audited Date",
  "Audited Due Date",
];

const Filters = ({
  setSearch,
  searchlabel,
  coderSearch,
  receivedSearch,
  sentSearch,
  search,
  searchVal,
  setSearchVal,
  // Report Props
  setSentSearch,
  setReceivedSearch,
  setCoderSearch,
  // Select Props
  selectlabel,
  setSelectedOption,
  selectOptions,
  selectedOption,
  pickerlabe2,
  activeTab,
  setSelectedDates,
  selectedDates2,
  setSelectedDates2,
  defaultStartDate,
  defaultEndDate,
  setStartDate,
  setEndDate,
  setStartDate2,
  setEndDate2,
  addUser,
  createdTolabel,
  createdByOptoons,
  setSelCreatedBy,
  bullets,
  badges,
  addBtn,
  isSelectOrg,
  setPageNo,
  selCreatedBy,
  setClear,
  activeFilters,
  setActiveFilters,
  setSelectedDateRange,
  selectedDateRange,
  selectedDates,
  getRoutedData,
}) => {
  const [selectAll, setSelectAll] = useState(false);
  const handleClearAllFilters = () => {
    setClear(true);
    getRoutedData("");
    setStartDate([]);
    setEndDate([]);
    setSearch("");
    setSelectedDates([]);
    setSelectedDates2([]);
    setSelectedOption();
    setSelCreatedBy("");
  };
  let columnClass;
  if (addUser) {
    if (addBtn) {
      columnClass = isSelectOrg ? "col-xl-2" : "col-xl-4";
    } else {
      columnClass = "col-xl-1";
    }
  } else {
    columnClass = "col-xl-4";
  }

  const renderFilter = (filter) => {
    switch (filter) {
      case "Select Audited Status":
        return (
          <div style={{ width: "250px"}}>
            <label className={`${styles.label} responsiveLabel`}>
              {selectlabel}
            </label>
            <div class="form-group has-search custom-react-select">
              <Select
                onChange={(selectOptions) => {
                  setSelectedOption(selectOptions ? selectOptions : "");
                  if (setPageNo) {
                    resetPageNumber(setPageNo);
                  }
                  setClear(false);
                  removeStorage("supervisorStatus");
                  getRoutedData(null);
                }}
                options={selectOptions}
                isSearchable={false}
                placeholder="Select"
                allowClear={true}
                value={selectedOption ? selectedOption : null}
              />
            </div>
          </div>
        );
      case "Audited Date":
      case "Audited Due Date":
        return (
          <div style={{ width: "250px"}}>
            <DateRangePicker
              selectedDates={selectedDates}
              pickerlabel={filter}
              setStartDate={setStartDate2}
              setEndDate={setEndDate2}
              disabled={false}
              setSelectedDates={setSelectedDates}
              setPageNo={setPageNo}
              handleMultipleValues={true}
              pickerName={filter?.replace(/\s+/g, "")}
              setSelectedDateRange={setSelectedDateRange}
              selectedDateRange={selectedDateRange}
              getRoutedData={getRoutedData}
              isDueDate={filter === "Audited Due Date"} 
            />
          </div>
        );

      case "Reviewer Status":
        return (
          <div style={{ width: "250px"}}>
            <label className={`${styles.label} responsiveLabel`}>
              {createdTolabel}
            </label>
            <div class="form-group has-search custom-react-select">
              <Select
                onChange={(selectedOption) => {
                  setSelCreatedBy(selectedOption ? selectedOption : "");
                  setClear(false);
                  if (setPageNo) {
                    resetPageNumber(setPageNo);
                  }
                  getRoutedData(null);
                }}
                options={createdByOptoons}
                isSearchable={false}
                placeholder="Select"
                allowClear={true}
                value={selCreatedBy ? selCreatedBy : null}
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };
  return (

    <div className="d-flex justify-content-start " style={{marginLeft:"22px"}}>
      <div className="row " style={{ width: "98%" }}>
      <div style={{ width: "250px"}}>
          <Search
            searchlabel={searchlabel}
            search={search}
            value={search}
            setSearch={setSearchVal}
            setPageNo={setPageNo}
          />
        </div>
        
        {activeFilters?.map((filter) => (
          <React.Fragment key={filter}>{renderFilter(filter)}</React.Fragment>
        ))}
      </div>
      {/* <div
        className={`d-flex justify-content-center  align-items-center gap-2  ${styles.subDiv}`}
      > */}
        <MoreFilter
          selectAll={selectAll}
          setSelectAll={setSelectAll}
          activeFilters={activeFilters}
          setActiveFilters={setActiveFilters}
          allFilters={allFilters}
          setClear={setClear}
          handleClearAllFilters={handleClearAllFilters}
          getRoutedData={getRoutedData}
        />
      </div>
    // </div>
  );
};

export default Filters;
