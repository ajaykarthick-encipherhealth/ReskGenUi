import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { DatePicker, Popover, Select, Tooltip } from "antd";
import Image from "next/image";
import styles from "../../../pages/reviewer/report/report.module.css";
import allocateStyle from "../../../pages/admin/allocateduser/allocate/style.module.css";
import Export from "../../../images/svg/Export";
import Legends from "../../../components/legends";
import DateRangePicker from "../../../components/rangepicker";
import Search from "../../../components/search";
import { resetPageNumber } from "../../../components/headerFilters/functions";
import filter from "../../../images/svg/filter.svg";
import {
  PlusCircleFilled,
  InfoCircleFilled,
  FilterFilled,
} from "@ant-design/icons";
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
  isSelector3,
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
          </div>
        </div>
      )}
    </>
  );
};

export default HeaderFilters;
