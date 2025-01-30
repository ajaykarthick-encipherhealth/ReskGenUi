import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { DatePicker, Popover, Select, Tooltip } from "antd";
import Image from "next/image";
import styles from "../../pages/reviewer/report/report.module.css";
import allocateStyle from "../../pages/admin/allocateduser/allocate/style.module.css";
import Export from "../../images/svg/Export";
import Legends from "../legends";
import DateRangePicker from "../rangepicker";
import Selector from "../selector";
import Search from "../search";
import {
  disableFutureDate,
  handleRnagePicker2,
  resetPageNumber,
} from "./functions";
import filter from "../../images/svg/filter.svg";
import {
  PlusCircleFilled,
  InfoCircleFilled,
  FilterFilled,
} from "@ant-design/icons";
const { RangePicker } = DatePicker;

const HeaderFilters = ({
  // Search Props
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
  selectlabel,
  isSelector,
  setSelectedOption,
  selectOptions,
  defaultSelectValue1,
  selectlabel2,
  defaultSelectValue2,
  selectOptions2,
  setSelectedOption2,
  selectlabel3,
  selectOptions3,
  isSelector3,
  setSelectedOption3,

  // Picker Props
  pickerlabel,
  pickerlabe2,
  pickerlabe4,
  pickerlabe5,
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
  defaultStartDate2,
  defaultEndDate2,
  //if has time picker
  isRangeTimePicker,
  timePickerlabel,
  defaultStartTime,
  defaultEndTime,
  setStartTime,
  setEndTime,
  setSelectedTime,
  setReceivedStartTime,
  setReceivedEndTime,
  setCoderStartTime,
  setCoderEndTime,

  // if has allocated date picker
  pickerlabe3,
  defaultStartDate3,
  defaultEndDate3,
  setStartDate3,
  setEndDate3,
  setStartDate4,
  setEndDate4,
  setStartDate5,
  setEndDate5,
  isRangePicker,
  isAnotherPicker,
  isAnotherPicker2,
  isAnotherPicker3,
  isAnotherPicker5,

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
  isAllocatedToSelector,
  allocatedTolabel,
  allocatedToOptoons,
  setSelAllocatedTo,
  defaultAllocateTo,

  //priority
  isAnotherPicker6,
  pickerlabe6,
  setPriority,
  defaultPriority,

  isCreatedBySelector,
  createdTolabel,
  createdByOptoons,
  setSelCreatedBy,
  defaultCreatedBy,
  selectedCoderOptReport,
  bullets,
  isNextRow,
  btnTitle,
  badges,
  setIsModalVisible,
  optionKey,
  disable,
  tracking,
  selectorField,
  defaultShow = false,
  setSelect,
  defaultSize = "col-xl-2 col-md-3",
  adminReport,
  addBtn,
  atCorner,
  isNextCreatedBySelector,
  selectReportOptions,
  value,
  setSelectedManger,

  // selectOrg
  selectlabelOrg,
  isSelectOrg,
  setSelectedOptionOrg,
  selectOptionsOrg,
  defaultSelectValueOrg,
  selectedValueOrg,
  isRangePickerUsers,
  form,
  setMobileNumber,
  setPageNo,
  selectDefaultValue,
  orgValue,
  fromTenantPatients,
  selAllocatedBy
}) => {
  const [showFilters, setShowFilters] = useState(defaultShow);
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
  return (
    <>
      <div style={{ height: "auto" }}>
        <div className="row filter-contain" style={{ width: "100%" }}>
          {isSearch && (
            <div
              className={defaultSize}
              // style={{ margin: atCorner && "0 0 0 -20px" }}
            >
              {" "}
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
              />
            </div>
          )}
          {isSelector && (
            <div className={defaultSize}>
              <label className={`${styles.label} responsiveLabel`}>
                {selectlabel}
              </label>
              <div class="form-group has-search custom-react-select">
                <Select
                id={selectlabel}
                name={selectlabel}
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
                />
              </div>
            </div>
          )}

          {isNextCreatedBySelector && (
            <div className={defaultSize}>
              <label className={`${styles.label} responsiveLabel`}>
                {createdTolabel}
              </label>
              <div class="form-group has-search custom-react-select">
                <Select
                id={createdTolabel}
                name={createdTolabel}
                  onChange={(selectedOption) => {
                    setSelCreatedBy(selectedOption ? selectedOption : "");
                    if (setPageNo) {
                      resetPageNumber(setPageNo);
                    }
                  }}
                  options={createdByOptoons}
                  isSearchable={false}
                  placeholder={defaultCreatedBy}
                  allowClear={true}
                />
              </div>
            </div>
          )}

          {selectReportOptions && (
            <div className={defaultSize}>
              <label className={`${styles.label} responsiveLabel`}>
                {selectlabel2}
              </label>
              <div class="form-group has-search custom-react-select">
                <Select
                id={selectlabel2}
                name={selectlabel2}
                  value={defaultSelectValue2 ? defaultSelectValue2 : ""}
                  onChange={(selectedOption) => {
                    if (setPageNo) {
                      resetPageNumber(setPageNo);
                    }
                    setSelectedOption2(selectedOption ? selectedOption : "");
                    setSelectedManger("");
                    if (!selectedOption) {
                      setSelectedOption3(null);
                    }
                  }}
                  options={selectReportOptions}
                  placeholder={selectlabel2}
                  isSearchable={false}
                  allowClear={true}
                />
              </div>
            </div>
          )}

          {selectOptions2 && (
            <div className={defaultSize}>
              <label className={`${styles.label} responsiveLabel`}>
                {selectlabel2}
              </label>
              <div class="form-group has-search custom-react-select ">
                <Select
                id={selectlabel2}
                name={selectlabel2}
                  // value={defaultSelectValue2}
                  onChange={(selectedOption) => {
                    if (setPageNo) {
                      resetPageNumber(setPageNo);
                    }
                    setSelectedOption2(selectedOption ? selectedOption : "");
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
          {isSelector3 && (
            <div className={defaultSize}>
              <label className={`${styles.label} responsiveLabel`}>
                {selectlabel3}
              </label>
              <div class="form-group has-search custom-react-select">
                <Select
                id={selectlabel3}
                name={selectlabel3}
                  showSearch
                  value={value ? value : ""}
                  onChange={(selectedOption) => {
                    if (setPageNo) {
                      resetPageNumber(setPageNo);
                    }
                    if (selectedCoderOptReport === "SUPERVISOR") {
                      setSelectedOption3(selectedOption ? selectedOption : "");
                      setSelect(null);
                    }
                    if (selectedCoderOptReport === "REVIEWER") {
                      setSelect(selectedOption);
                      setSelectedOption3(selectedOption);
                    }
                  }}
                  options={selectOptions3}
                  style={{ backgroundColor: "#F3F3FF", width: "20px" }}
                  allowClear={true}
                />
              </div>
            </div>
          )}
          {isSelectOrg && (
            <div className={defaultSize}>
              <label className={`${styles.label} responsiveLabel`}>
                {selectlabelOrg}
              </label>
              <div class="form-group has-search custom-react-select">
                <Select
                id={selectlabelOrg}
                name={selectlabelOrg}
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
          )}
          {isRangePickerUsers && (
            <div className={defaultSize}>
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
              />
            </div>
          )}

          {isRangeTimePicker && (
            <>
              <div className={defaultSize} style={{ width: "20%" }}>
                <label className={`${styles.label} responsiveLabel`}>
                  {timePickerlabel}
                </label>
                <div>
                  <RangePicker
                  id={timePickerlabel}
                  name={timePickerlabel}
                    showTime={{ format: "HH:mm" }} // Specify the time format
                    format="YYYY-MM-DD HH:mm" // Specify the combined date and time format
                    // value={dayjs(selectedDates2).format('MM-DD-YYYY')}
                    // onChange={(date, dateString) =>
                    //   handleRnagePicker2({
                    //     date,
                    //     dateString,
                    //     setStartDate2,
                    //     setEndDate2,
                    //   })
                    // }
                    // defaultValue={
                    //   defaultEndDate2 && defaultStartDate2
                    //     ? [
                    //         dayjs(defaultStartDate2, "YYYY-MM-DD"),
                    //         dayjs(defaultEndDate2, "YYYY-MM-DD"),
                    //       ]
                    //     : []
                    // }
                    // disabledDate={(current) => disableFutureDate(current)}
                  />
                </div>
              </div>
            </>
          )}

          {isAnotherPicker && (
            <>
              <div className={defaultSize}>
                <DateRangePicker
                  selectedDates={selectedDates2}
                  pickerlabel={pickerlabe2}
                  defaultStartDate={defaultStartDate}
                  defaultEndDate={defaultEndDate}
                  setStartDate={setStartDate2}
                  setEndDate={setEndDate2}
                  disabled={false}
                  setSelectedDates={setSelectedDates2}
                  setPageNo={setPageNo}
                />
              </div>
            </>
          )}

          {isNextRow && (
            <div
              className={"col-xl-1 d-flex"}
              style={{
                margin: "30px 0 0 0px",
                cursor: "pointer",
                // width: "120px",
              }}
              onClick={() => setShowFilters(!showFilters)}
            >
              <button className={`${styles.filterBtn} d-flex`}>
                <FilterFilled
                  src={filter}
                  className={`${styles.iconStyleColor} py-1 px-1`}
                />{" "}
                {showFilters ? "Hide" : "Filter"}
              </button>
            </div>
          )}
          {bullets && (
            <div
              className={`${
                bullets && addUser
                  ? "col-xl-2"
                  : bullets
                  ? "col-xl-1"
                  : "col-xl-4"
              } d-flex justify-content-center align-items-center`}
              style={{marginTop: "5px"}}
            >
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
                {/* <Image
                  src={warning}
                  className="mt-[10px]"
                  style={{ cursor: "pointer" }}
                /> */}
                <Tooltip placement="top" title="View List of Status">
                  <InfoCircleFilled
                    className={`${styles.iconStyleColor2} mt-4`}
                  />
                </Tooltip>
              </Popover>
            </div>
          )}
          {addUser && (
            <div className={columnClass} style={{ marginTop: "29px" }}>
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

          {isAllocate && (
            <div className="col-xl-2 mt-4">
              <button
                onClick={handleOpneModal}
                className={`btn btn-primary btn-sm mx-4 ms-2 flr ${allocateStyle.modalBtn}`}
                disabled={!selectedRowsId.length > 0}
              >
                Allocate
              </button>
            </div>
          )}
          {activeTab === "CoderReport" && !isSelector3 && (
            <div className={defaultSize}></div>
          )}
          {activeTab === "CoderReport" && (
            <div
              className={`col-xl-${
                !adminReport ? "4" : "2"
              } d-flex justify-content-end`}
            >
              <div className="row flr">
                <Tooltip
                  title={
                    rowsLength?.length === 0 ? "Select report to export" : ""
                  }
                >
                  <button
                    onClick={() => {
                      setIsModalVisible(true);
                    }}
                    className={styles.export}
                    disabled={
                      rowsLength?.length > 0 || rowsLength?.data?.length > 0
                        ? false
                        : true
                    }
                    style={{ color: "#04306f" }}
                  >
                    <Export />
                    Export
                  </button>
                </Tooltip>
              </div>
            </div>
          )}
        </div>
      </div>
      {showFilters && (
        <div style={{ marginTop: "20px" }}>
          <div className="row filter-contain" style={{ width: "100%" }}>
            {isAllocatedBySelector && (
              <div className={defaultSize}>
                <label className={`${styles.label} responsiveLabel`}>
                  {allocatedBylabel}
                </label>
                <div class="form-group has-search custom-react-select">
                  <Select
                  id={allocatedBylabel}
                  name={allocatedBylabel}
                    value={selAllocatedBy ? selAllocatedBy : null}
                    onChange={(selectedOption) => {
                      setSelAllocatedBy(selectedOption ? selectedOption : null);
                      if (setPageNo) {
                        resetPageNumber(setPageNo);
                      }
                    }}
                    options={allocatedByOptoons}
                    isSearchable={false}
                    placeholder={defaultAllocatedBy}
                    allowClear={true}
                  />
                </div>
              </div>
            )}
            {isRangePicker && (
              <div
                className={defaultSize}
                style={{
                  position: "relative",
                  right: fromTenantPatients ? "0px" : "20px",
                }}
              >
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
                />
              </div>
            )}
            {isAllocatedToSelector && (
              <div className={defaultSize} style={{ zIndex: tracking && "2" }}>
                <label className={`${styles.label} responsiveLabel`}>
                  {allocatedTolabel}
                </label>
                <div class="form-group has-search custom-react-select">
                  <Select
                  id={allocatedTolabel}
                  name={allocatedTolabel}
                    onChange={(selectedOption) => {
                      setSelAllocatedTo(selectedOption ? selectedOption : "");
                      if (setPageNo) {
                        resetPageNumber(setPageNo);
                      }
                    }}
                    options={allocatedToOptoons}
                    isSearchable={false}
                    placeholder={defaultAllocateTo}
                    allowClear={true}
                  />
                </div>
              </div>
            )}
            {isCreatedBySelector && (
              <div className={defaultSize}>
                <label className={`${styles.label} responsiveLabel`}>
                  {createdTolabel}
                </label>
                <div class="form-group has-search custom-react-select">
                  <Select
                  id={createdTolabel}
                  name={createdTolabel}
                    onChange={(selectedOption) => {
                      setSelCreatedBy(selectedOption ? selectedOption : "");
                      if (setPageNo) {
                        resetPageNumber(setPageNo);
                      }
                    }}
                    options={createdByOptoons}
                    isSearchable={false}
                    placeholder={defaultCreatedBy}
                    allowClear={true}
                  />
                </div>
              </div>
            )}
            {isAnotherPicker2 && (
              <>
                <div className={defaultSize}>
                  <label className={`${styles.label} responsiveLabel`}>
                    {pickerlabe3}
                  </label>
                  <div>
                    <RangePicker
                    id={pickerlabe3}
                    name={pickerlabe3}
                      format="YYYY-MM-DD"
                      onChange={(date, dateString) => {
                        handleRnagePicker2({
                          date,
                          dateString,
                          setStartDate3,
                          setEndDate3,
                        });
                        if (setPageNo) {
                          resetPageNumber(setPageNo);
                        }
                      }}
                    />
                  </div>
                </div>
              </>
            )}
            {isAnotherPicker3 && (
              <>
                <div className={defaultSize}>
                  <label className={`${styles.label} responsiveLabel`}>
                    {pickerlabe4}
                  </label>
                  <div>
                    <RangePicker
                    id={pickerlabe4}
                    name={pickerlabe4}
                      format="YYYY-MM-DD"
                      onChange={(date, dateString) => {
                        handleRnagePicker2({
                          date,
                          dateString,
                          setStartDate4,
                          setEndDate4,
                        });
                        if (setPageNo) {
                          resetPageNumber(setPageNo);
                        }
                      }}
                      disabledDate={(current) => disableFutureDate(current)}
                    />
                  </div>
                </div>
              </>
            )}
            {isAnotherPicker5 && (
              <>
                <div className={defaultSize}>
                  <label className={`${styles.label} responsiveLabel`}>
                    {pickerlabe5}
                  </label>
                  <div>
                    <RangePicker
                    id={pickerlabe5}
                    name={pickerlabe5}
                      format="YYYY-MM-DD"
                      onChange={(date, dateString) => {
                        handleRnagePicker2({
                          date,
                          dateString,
                          setStartDate5,
                          setEndDate5,
                        });
                        if (setPageNo) {
                          resetPageNumber(setPageNo);
                        }
                      }}
                      disabledDate={(current) => disableFutureDate(current)}
                    />
                  </div>
                </div>
              </>
            )}
            {isAnotherPicker6 && (
              <>
                <div className={defaultSize}>
                  <label className={`${styles.label} responsiveLabel`}>
                    {pickerlabe6}
                  </label>
                  <div className="custom-react-select">
                    <Select
                    id={pickerlabe6}
                    name={pickerlabe6}
                      onChange={(selectedOption) => {
                        setPriority(selectedOption ? selectedOption : "");
                        if (setPageNo) {
                          resetPageNumber(setPageNo);
                        }
                      }}
                      options={allocatedToOptoons}
                      isSearchable={false}
                      placeholder={defaultPriority}
                      allowClear={true}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default HeaderFilters;
