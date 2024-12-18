import React, { useState } from "react";
import { Popover, Select, Tooltip } from "antd";
import Image from "next/image";
import styles from "../../../../pages/reviewer/report/report.module.css";
import Legends from "../../../../components/legends";
import DateRangePicker from "../../../../components/rangepicker";
import Search from "../../../../components/search";
import { resetPageNumber } from "../../../../components/headerFilters/functions";
import { InfoCircleFilled } from "@ant-design/icons";
import MoreFilter from "../../../tenantAdmin/tracking/filters";
import { removeStorage } from "../../../../utils/storages";
import dayjs from 'dayjs'
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
}) => {
  const [selectAll, setSelectAll] = useState(false);
  const handleClearAllFilters = () => {
    setClear(true);
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
          <div className="col-xl-2 col-md-4">
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
          <div className="col-xl-2 col-md-4">
            <DateRangePicker
              selectedDates={selectedDates}
              pickerlabel={filter}
              // defaultStartDate={defaultStartDate}
              // defaultEndDate={defaultEndDate}
              setStartDate={setStartDate2}
              setEndDate={setEndDate2}
              disabled={false}
              setSelectedDates={setSelectedDates}
              setPageNo={setPageNo}
              handleMultipleValues={true}
              pickerName={filter?.replace(/\s+/g, "")}
              setSelectedDateRange={setSelectedDateRange}
              selectedDateRange={selectedDateRange}
            />
          </div>
        );

      case "Reviewer Status":
        return (
          <div className="col-xl-2 col-md-4">
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
    <div className="d-flex">
      <div className={`row filter-contain ${styles.containerStyle}`}>
        <div className="col-xl-2 col-md-4">
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
      <div
        className={`d-flex justify-content-end  align-items-center gap-2  ${styles.subDiv}`}
        style={{ width: "5%" }}
      >
        <MoreFilter
          selectAll={selectAll}
          setSelectAll={setSelectAll}
          allFilters={allFilters}
          setClear={setClear}
          setActiveFilters={setActiveFilters}
          handleClearAllFilters={handleClearAllFilters}
          activeFilters={activeFilters}
        />
        <div className="mt-2 cursor-pointer">
          <Popover
            content={
              <>
                <Legends
                  bullets={bullets}
                  display="block"
                  padding="0 0px 10px 0"
                />
                {badges?.length > 0 &&
                  badges?.map((data) => (
                    <div style={{ marginBottom: "10px" }}>
                      <Image src={data.src} width={20} height={30} />
                      <span style={{ marginLeft: "5px" }}>{data?.name}</span>
                    </div>
                  ))}
              </>
            }
            trigger={["click"]}
            placement="bottom"
          >
            <Tooltip placement="top" title="View List of Status">
              <InfoCircleFilled className={`${styles.iconStyleColor2} mt-4`} />
            </Tooltip>
          </Popover>
        </div>
      </div>
    </div>
  );
};

export default Filters;
