import React, { useState } from "react";
import { DatePicker, Popover, Tooltip, Select } from "antd";
import Image from "next/image";
import styles from "../../../../pages/reviewer/report/report.module.css";
import Tracking from "../../tracking/tracking.module.css";
import Legends from "../../../../components/legends";
import {
  disableFutureDate,
  handleRnagePicker2,
  resetPageNumber,
  searchFunction,
} from "../../../../components/headerFilters/functions";
import InputField from "../../../../components/input";
import { InfoCircleFilled, PlusCircleFilled } from "@ant-design/icons";
import MoreFilter from "../../tracking/filters";
import { Button } from "react-bootstrap";

const { RangePicker } = DatePicker;

const allFilters = ["Status", "Organization", "Created date Range"];

const HeaderFilters = ({
  setSearch,
  isSearch,
  search,
  isSelector,
  setSelectedOption,
  selectOptions,
  selectlabel2,
  selectOptions2,
  setSelectedOption2,
  selectedDates,
  setSelectedDates,
  setStartDate,
  setEndDate,
  bullets,
  badges,
  defaultSize = "col-2",
  clear,
  setClear,
  selector4value,
  setSelectedManger,
  setPageNo,
  setSelectedOptionOrg,
  selectOptionsOrg,
  orgValue,
  selectedValue,
  addUser,
  btnTitle,
  form,
  setMobileNumber,
  addUserForm,
  selectedValue2,
}) => {
  const [trackInput, setTrackInput] = useState("");
  const [activeFilters, setActiveFilters] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [popoverVisible, setPopoverVisible] = useState(false);

  const handleClearAllFilters = () => {
    setClear(true);
    setStartDate([]);
    setEndDate([]);
    setSelectedDates([]);
    setSearch("");
    setTrackInput("");
    setSelectedOption(null);
    setSelectedOption2(null);
    setSelectedOptionOrg(null);
    setPopoverVisible(false);
  };

  const renderFilter = (filter) => {
    switch (filter) {
      case "Status":
        return (
          <div className="col-xl-2 col-md-3">
            <label className={styles.label}>Status</label>
            <div class="form-group has-search custom-react-select">
              <Select
                value={clear ? null : selector4value}
                onChange={(selectedOption) => {
                  setSelectedOption(selectedOption);
                  setClear(false);
                }}
                options={selectOptions}
                placeholder={"Status"}
                isSearchable={false}
                allowClear={true}
              />
            </div>
          </div>
        );

      case "Created date Range":
        return (
          <div className="col-xl-2 col-md-3">
            <label className={styles.label}>Created Date Range</label>
            <div className="dateRangeSize">
              <RangePicker
                value={clear ? ["", ""] : selectedDates}
                format="MM-DD-YYYY"
                onCalendarChange={(val) => setSelectedDates(val)}
                onChange={(date, dateString) => {
                  handleRnagePicker2({
                    date,
                    dateString,
                    setStartDate,
                    setEndDate,
                  });
                  setClear(false);
                }}
                disabledDate={(current) => disableFutureDate(current)}
              />
            </div>
          </div>
        );

      case "Organization":
        return (
          <div className="col-xl-2 col-md-3">
            <label className={`${styles.label}`}>Select Organization</label>

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
          <div className="col-xl-2 col-md-3" onClick={() => setClear(false)}>
            <label style={{ marginLeft: "8px" }}>Search By Username</label>
            <div class="form-group has-search">
              <InputField
                isSearch={true}
                placeholder="Search"
                inputValue={search}
                setInputValue={setSearch}
                delay={1000}
                type="text"
                isDisabled={false}
                isInputFiled={false}
                isTracking={true}
                trackInput={trackInput}
                setTrackInput={setTrackInput}
              />
            </div>
          </div>
        )}

        {isSelector && (
          <div className="col-xl-2 col-md-3">
            <label className={styles.label}>Role</label>
            <div class="form-group has-search custom-react-select">
              <Select
                value={selectedValue2}
                onChange={(selectedOption) => {
                  if (setPageNo) {
                    resetPageNumber(setPageNo);
                  }
                  setSelectedOption2(selectedOption ? selectedOption : null);
                  if (setSelectedManger) setSelectedManger("");
                }}
                options={selectOptions2}
                placeholder={selectlabel2}
                isSearchable={false}
                allowClear={true}
              />
            </div>
          </div>
        )}

        {activeFilters.map((filter) => (
          <React.Fragment key={filter}>{renderFilter(filter)}</React.Fragment>
        ))}
      </div>

      <div
        className={`d-flex justify-content-end ${{ Tracking }}`}
        style={{ width: "5%" }}
      >
        <div>
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

          {bullets && (
            <div style={{ cursor: "pointer" }}>
              <Popover
                content={
                  <>
                    <Legends bullets={bullets} display="block" />
                    {badges?.length > 0 &&
                      badges?.map((data) => (
                        <div style={{ marginBottom: "10px" }}>
                          <Image src={data.src} width={20} height={30} />
                          <span style={{ marginLeft: "5px" }}>
                            {data?.name}
                          </span>
                        </div>
                      ))}
                  </>
                }
                trigger={["click"]}
                placement="bottom"
              >
                <Tooltip title="Click here for status information.">
                  <div className={Tracking.iconBorderFlex}>
                    <InfoCircleFilled />
                  </div>
                </Tooltip>
              </Popover>
            </div>
          )}
        </div>
      </div>
      {addUser && (
        <div style={{ marginTop: "29px" }}>
          <Button
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
