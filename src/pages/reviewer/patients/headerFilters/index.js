import React, { useState } from "react";
import { DatePicker, Select, Input } from "antd";
import Image from "next/image";
import styles from "../../../../pages/reviewer/report/report.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import MoreFilter from "../../../tenantadmin/tracking/filters";
import {
  disabledDate,
} from "../../../../utils/reusable";
const { RangePicker } = DatePicker;

export const allFilters = [
  "Select Status",
  "Select Priority",
  "Due Date",
  "Completed Date",
  "Batch",
];

const HeaderFiltersPatients = ({
  activeFilters,
  setActiveFilters,
  value,
  onChange,
  disallowedCharacters = [],
  onChangeStatus,
  statusSelectedStatus,
  orgAllList,
  statusSelectedStatus1,
  onChangeStatus1,
  orgAllList1,
  onchangeRangePicker,
  onchangeRangePicker2,
  setSelectedOption,
  selectedDates,
  setSelectedDates,
  // allocatedBY
  setSelAllocatedBy,
  // allocatedTo
  isAllocatedToSelector,
  setSelAllocatedTo,
  bullets,
  badges,
  defaultSize = "col-2",
  setAuditSelAllocatedTo,
  setAuditSelectedOption,
  setSelAuditAllocatedBy,
  clear,
  setClear,
  selectedDates2,
  setSelectedDates2,
  setSelectedDates3,
  setSelectedDates4,
  setSelectedDates5,
  filtersData,
  getRoutedData,
  setSelectedOptionBatch,
  batchValue,
  selectOptionsBatch,
}) => {
  const [selectAll, setSelectAll] = useState(false);

  const handleClearAllFilters = () => {
    setClear(true);
    setSelectedDates([]);
    setSelectedDates2([]);
  };
  const renderFilter = (filter) => {
    switch (filter) {
      case "Due Date":
        return (
          <div className="" style={{ width: "250px", marginTop: "30px" }}>
            <label className={styles.label}>Due Date</label>
            <div className="dateRangeSize dateRangesHeight">
              <RangePicker
                value={clear ? ["", ""] : selectedDates}
                format="MM-DD-YYYY"
                onChange={onchangeRangePicker}
                onCalendarChange={(val) => setSelectedDates(val)}
                disabledDate={(currentDate) =>
                  disabledDate(currentDate, selectedDates, true)
                }
              />
            </div>
          </div>
        );

      case "Completed Date":
        return (
          <div className="" style={{ width: "250px", marginTop: "30px" }}>
            <label className={styles.label}>Completed Date</label>
            <div className="dateRangeSize dateRangesHeight">
              <RangePicker
                value={clear ? ["", ""] : selectedDates2}
                format="MM-DD-YYYY"
                onChange={onchangeRangePicker2}
                onCalendarChange={(val) => setSelectedDates2(val)}
                // disabledDate={(current) => disableFutureDate(current)}
                disabledDate={(currentDate) =>
                  disabledDate(currentDate, selectedDates2)
                }
              />
            </div>
          </div>
        );
      case "Select Priority":
        return (
          <div
            className={defaultSize}
            style={{ width: "250px", marginTop: "30px" }}
          >
            <label className={styles.label}>Select Priority</label>
            <div class="form-group has-search custom-react-selects reviewerFilterSelect customClear">
              <Select
                value={clear ? null : statusSelectedStatus1 || null}
                onChange={onChangeStatus1}
                options={orgAllList1}
                isSearchable={false}
                placeholder={"Select Priority"}
                allowClear={true}
              />
            </div>
          </div>
        );
      case "Select Status":
        return (
          <div
            className={defaultSize}
            style={{ width: "250px", marginTop: "30px" }}
          >
            <label className={styles.label}>Select Status</label>
            <div class="form-group has-search custom-react-selects reviewerFilterSelect customClear">
              <Select
                value={
                  clear
                    ? null
                    : statusSelectedStatus
                    ? statusSelectedStatus
                    : null
                }
                onChange={onChangeStatus}
                options={orgAllList}
                isSearchable={false}
                placeholder={"Select Status"}
                allowClear={true}
              />
            </div>
          </div>
        );
      case "Batch":
        return (
          <div className={defaultSize}     style={{ width: "250px", marginTop: "30px" }}>
            <label className={styles.label}>Select Batch</label>
            <div class="form-group has-search custom-react-selects reviewerFilterSelect customClear">
              <Select
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                value={batchValue ? batchValue : null}
                onChange={(selectBatch) => {
              
                  setSelectedOptionBatch(selectBatch ? selectBatch : null);
                }}
                showSearch
                options={selectOptionsBatch}
                placeholder="Select Batch"
                allowClear={true}
                id="select-organization"
                name="select-organization"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };


  return (
    <div className="d-flex justify-content-center align-items-center">
      <div className="row " style={{ width: "98%" }}>
        {isAllocatedToSelector && (
          <div
            style={{ width: "250px", marginTop: "30px" }}
            onClick={() => setClear(false)}
          >
            <label className={styles.label}>Patient Name / ID</label>
            <div class="form-group has-search">
              <Input
                value={value}
                onChange={onChange}
                className={"w-100 new-search-control border-none"}
                placeholder="Search"
                maxLength={25}
                onKeyDown={(e) => {
                  if (disallowedCharacters.includes(e.key)) {
                    e.preventDefault();
                  }
                }}
                prefix={
                  <FontAwesomeIcon className="searchPrefix" icon={faSearch} />
                }
                allowClear={true}
              />
            </div>
          </div>
        )}

        {activeFilters?.map((filter) => (
          <React.Fragment key={filter}>{renderFilter(filter)}</React.Fragment>
        ))}
      </div>

      <div
        style={{ width: "2%"}}
        className="d-flex justify-content-end align-items-center mt-3 "
      >
        <MoreFilter
          clear={clear}
          activeFilters={activeFilters}
          setActiveFilters={setActiveFilters}
          allFilters={allFilters}
          selectAll={selectAll}
          setSelectAll={setSelectAll}
          setClear={setClear}
          handleClearAllFilters={handleClearAllFilters}
          getRoutedData={getRoutedData}
        />
      </div>
    </div>
  );
};

export default HeaderFiltersPatients;
