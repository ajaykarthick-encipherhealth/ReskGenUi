import React, { useState } from "react";
import { DatePicker, Popover, Tooltip, Select } from "antd";
import styles from "../../../../pages/reviewer/report/report.module.css";
import Tracking from "../../tracking/tracking.module.css";
import {
  handleRnagePicker2,
  resetPageNumber,
} from "../../../../components/headerFilters/functions";
import { Button } from "react-bootstrap";
import { PlusCircleFilled } from "@ant-design/icons";
import MoreFilter from "../../tracking/filters";
import DateRangePicker from "../../../../components/rangepicker";
import Search from "../../../../components/search";
import { disabledDate } from "../../../../utils/reusable";

const { RangePicker } = DatePicker;

export const allFilters = [
  "Select Status",
  "Select Organization",
  "Created Date",
  "Created By",
  "Computed Date",
  "Batch",
  "Flag"
];

const HeaderFilters = ({
  setSearch,
  isSearch,
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
  setSelectedOption,
  selectOptions,
  // Picker Props
  pickerlabel,
  pickerlabe2,
  activeTab,
  selectedDates,
  setSelectedDates,
  selectedDates2,
  setSelectedDates2,
  defaultStartDate,
  defaultEndDate,
  setStartDate,
  setEndDate,
  setReceivedStartDate,
  setReceivedEndDate,
  setCoderStartDate,
  setCoderEndDate,
  setStartDate2,
  setEndDate2,
  isRangePicker,
  isAnotherPicker,

  // Additional Props
  addUser,
  rowsLength,
  addUserForm,
  selectedRowsId,
  handleOpneModal,
  isAllocate,
  isAllocatedBySelector,
  allocatedBylabel,
  allocatedByOptoons,
  setSelAllocatedBy,
  defaultAllocatedBy,
  bullets,
  isNextRow,
  btnTitle,
  badges,
  setIsModalVisible,
  disable,
  defaultShow = false,
  defaultSize = "col-xl-2 col-md-3",
  adminReport,
  addBtn,
  // selectOrg
  selectlabelOrg,
  isSelectOrg,
  setSelectedOptionOrg,
  selectOptionsOrg,
  form,
  setMobileNumber,
  setPageNo,
  selectDefaultValue,
  orgValue,
  fromTenantPatients,
  selAllocatedBy,
  clear,
  setClear,
  selector6value,
  selector4value,
  setSelectAll,
  selectAll,
  activeFilters,
  setActiveFilters,
  setSelectedOptionBatch,
  batchValue,
  selectOptionsBatch,
  flagOptions,
  flagList,
  setFlagList
}) => {
  const [trackInput, setTrackInput] = useState("");
  const [popoverVisible, setPopoverVisible] = useState(false);
  const handleClearAllFilters = () => {
    setClear(true);
    setStartDate([]);
    setEndDate([]);
    setSearch("");
    setSearchVal("");
    setSelectedDates([]);
    setSelectedDates2([]);
    setSelectedOption(null);
    setSelAllocatedBy(null);
    setSelectedOptionOrg(null);
    setTrackInput("");
    setPopoverVisible(false);
    setStartDate2(null);
    setEndDate2(null);
    setFlagList(null)
  };
  const renderFilter = (filter) => {
    switch (filter) {
      case "Processed Status":
        return (
          <div className=" default-filter">
            <label className={styles.label}>Processed Status</label>
            <div class="form-group has-search custom-react-select">
              <Select
                value={clear ? null : selector4value}
                onChange={(selectedOption) => {
                  setSelectedOption(selectedOption);
                  setClear(false);
                }}
                options={selectOptions}
                placeholder={"Select Processed Status"}
                isSearchable={false}
                allowClear={true}
                id="processed-status"
                name="processed-status"
              />
            </div>
          </div>
        );
      case "Select Status":
        return (
          <div className=" default-filter">
            <label className={styles.label}>Select Status</label>
            <div class="form-group has-search custom-react-select">
              <Select
                value={selectDefaultValue}
                onChange={(selectOptions) => {
                  setSelectedOption(selectOptions ? selectOptions : "");
                  if (setPageNo) {
                    resetPageNumber(setPageNo);
                  }
                }}
                options={selectOptions}
                isSearchable={false}
                placeholder={"Select"}
                allowClear={true}
                id="status"
                name="status"
              />
            </div>
          </div>
        );
      case "Created Date":
        return (
          <div className=" default-filter">
            <label className={styles.label}>Created Date Range</label>
            <div className="dateRangeSize">
              <RangePicker
                value={clear ? ["", ""] : selectedDates2}
                format="MM-DD-YYYY"
                onCalendarChange={(val) => setSelectedDates2(val)}
                onChange={(date, dateString) => {
                  handleRnagePicker2({
                    date,
                    dateString,
                    setStartDate2,
                    setEndDate2,
                  });
                  setClear(false);
                }}
                // disabledDate={(current) => disableFutureDate(current)}
                disabledDate={(currentDate) =>
                  disabledDate(currentDate, selectedDates2)
                }
                id="create-date"
                name="create-date"
              />
            </div>
          </div>
        );

      case "Created By":
        return (
          <div className=" default-filter">
            <label className={styles.label}>Created By</label>
            <div class="form-group has-search custom-react-select">
              <Select
                value={clear ? null : selAllocatedBy}
                onChange={(selectedOption) => {
                  setSelAllocatedBy(selectedOption);
                  setClear(false);
                }}
                options={allocatedByOptoons}
                isSearchable={false}
                placeholder={"Select Created By"}
                allowClear={true}
                id="created-by"
                name="created-by"
              />
            </div>
          </div>
        );

      case "Computed Date":
        return (
          <div className=" default-filter">
            <div className="dateRangeSize">
              <DateRangePicker
                selectedDates={selectedDates}
                pickerlabel={pickerlabel}
                defaultStartDate={defaultStartDate}
                defaultEndDate={defaultEndDate}
                setStartDate={setStartDate}
                setEndDate={setEndDate}
                activeTab={activeTab}
                setSelectedDates={setSelectedDates}
                setReceivedStartDate={setReceivedStartDate}
                setReceivedEndDate={setReceivedEndDate}
                setCoderStartDate={setCoderStartDate}
                setCoderEndDate={setCoderEndDate}
                disabled={disable != "Yes" ? true : false}
                setPageNo={setPageNo}
                id="select-date-range"
                name="select-date-range"
              />
            </div>
          </div>
        );
        case "Flag":
          return (
            <div className=" default-filter">
              <label className={styles.label}>Select Flag</label>
              <div class="form-group has-search custom-react-select">
                <Select
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                
                  value={flagList ? flagList : null}
                  onChange={(selectFlag) => {
                    if (setPageNo) {
                      resetPageNumber(setPageNo);
                    }
                    setFlagList(selectFlag ? selectFlag : null);
                  }}
                  showSearch
                  options={flagOptions}
                  placeholder="Select Flag"
                  allowClear={true}
                  id="select-flag"
                  name="select-flag"
                />
              </div>
            </div>
          );
  
      case "Batch":
        return (
          <div className=" default-filter">
            <label className={styles.label}>Select Batch</label>
            <div class="form-group has-search custom-react-select">
              <Select
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
              
                value={batchValue ? batchValue : null}
                onChange={(selectBatch) => {
                  if (setPageNo) {
                    resetPageNumber(setPageNo);
                  }
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

      case "Select Organization":
        return (
          <div className=" default-filter">
            <label className={styles.label}>Select Organization</label>
            <div class="form-group has-search custom-react-select">
              <Select
                value={orgValue ? orgValue : null}
                onChange={(selectOrg) => {
                  if (setPageNo) {
                    resetPageNumber(setPageNo);
                  }
                  setSelectedOptionOrg(selectOrg ? selectOrg : null);
                }}
                options={selectOptionsOrg}
                isSearchable={false}
                placeholder="Select Organization"
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
    <div style={{ display: "flex", alignItems: "center" }}>
      <div className="row filter-contain" style={{ width: "95%" }}>
        {isSearch && (
             <div className="default-filter" onClick={() => setClear(false)}>
            <div class="form-group has-search">
              <Search
                searchlabel={searchlabel}
                setSearch={setSearch}
                activeTab={activeTab}
                setSentSearch={setSentSearch}
                setReceivedSearch={setReceivedSearch}
                setCoderSearch={setCoderSearch}
                coderSearch={coderSearch}
                receivedSearch={receivedSearch}
                sentSearch={sentSearch}
                search={search}
                searchVal={searchVal}
                setSearchVal={setSearchVal}
                setPageNo={setPageNo}
                id="search"
                name="search"
              />
            </div>
          </div>
        )}

        {activeFilters?.map((filter) => (
          <React.Fragment key={filter}>{renderFilter(filter)}</React.Fragment>
        ))}
      </div>

      <div
        className={`d-flex justify-content-end ${{ Tracking }}`}
        style={{ width: "5%" }}
      >
        <div className="d-flex">
          <MoreFilter
            clear={clear}
            activeFilters={activeFilters}
            setActiveFilters={setActiveFilters}
            allFilters={allFilters}
            selectAll={selectAll}
            setSelectAll={setSelectAll}
            setClear={setClear}
            handleClearAllFilters={handleClearAllFilters}
          />
        </div>
      </div>
      {addUser && (
        <div style={{ marginTop: "29px" }}>
          <Button
          id={btnTitle}
          name={btnTitle}
            onClick={() => {
              if (form || setMobileNumber) {
                form.resetFields();
                setMobileNumber("");
              }
              addUserForm();
            }}
            style={{ background: "#04306f" }}
            className="btn btn-sm ms-2 flr width-max-content"
          >
            <PlusCircleFilled /> {btnTitle}
          </Button>
        </div>
      )}
    </div>
  );
};

export default HeaderFilters;
