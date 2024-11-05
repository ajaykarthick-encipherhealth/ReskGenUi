import React, { useState } from "react";
import { DatePicker, Popover, Select, Tooltip } from "antd";
import Image from "next/image";
import styles from "../../../../pages/reviewer/report/report.module.css";
import Legends from "../../../../components/legends";
import DateRangePicker from "../../../../components/rangepicker";
import Search from "../../../../components/search";
import { resetPageNumber } from "../../../../components/headerFilters/functions";
import { InfoCircleFilled } from "@ant-design/icons";
import MoreFilter from "../../../tenantAdmin/tracking/filters";

const { RangePicker } = DatePicker;
const allFilters = ["Reviewer Status", "Select Audited Status", "Audited Date"];

const Filters = ({
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
  selectedOption,

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
  selAllocatedBy,
  clear,
  selCreatedBy,
  setClear,
  activeFilters,setActiveFilters
}) => {
  const [selectAll, setSelectAll] = useState(false);
  const [popoverVisible, setPopoverVisible] = useState(false);

  const handleClearAllFilters = () => {
    setClear(true);
    setStartDate([]);
    setEndDate([]);
    setSearch("");
    setSelectedDates([]);
    setSelectedDates2([]);
    setSelectedOption();
    setPopoverVisible(false);
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
          <div className="col-2">
            <label className={`${styles.label} responsiveLabel`}>
              {selectlabel}
            </label>
            <div class="form-group has-search custom-react-select">
              <Select
                onChange={(selectOptions) => {
                  setSelectedOption(selectOptions ? selectOptions : null);

                  if (setPageNo) {
                    resetPageNumber(setPageNo);
                  }
                  setClear(false);
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
        return (
          <div className="col-2">
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
        );
      case "Reviewer Status":
        return (
          <div className="col-2">
            <label className={`${styles.label} responsiveLabel`}>
              {createdTolabel}
            </label>
            <div class="form-group has-search custom-react-select">
              <Select
                onChange={(selectedOption) => {
                  setSelCreatedBy(selectedOption ? selectedOption : null);
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
        <div className="col-2">
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
        {activeFilters.map((filter) => (
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
