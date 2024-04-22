import React, { useState } from "react";
import Select from "react-select";
import { Button } from "react-bootstrap";
import { DatePicker, Popover, Tooltip } from "antd";
import Image from "next/image";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import styles from "../../pages/reviewer/report/report.module.css";
import allocateStyle from "../../pages/admin/allocateduser/allocate/style.module.css";
import Export from "../../images/svg/Export";
import Legends from "../legends";
import DateRangePicker from "../rangepickers";
import Selector from "../selectors";
import Search from "../search";
import { disableFutureDate, handleRnagePicker2 } from "./functions";
import filter from "../../images/svg/filter.svg";
import warning from "../../images/svg/warning.svg";
import { getFilters } from "../../stores/authflow/actions";

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
  defaultSize = "col-xl-2",
  adminReport,
  addBtn,
  atCorner,
  isNextCreatedBySelector,
  selectReportOptions,
  value,
}) => {
  const dispatch = useDispatch();
  const [showFilters, setShowFilters] = useState(defaultShow);
  let columnClass;
  if (addUser) {
    if (addBtn) {
      columnClass = "col-xl-4";
    } else {
      columnClass = "col-xl-1";
    }
  } else {
    columnClass = "col-xl-4";
  }
  return (
    <>
      <div style={{ height: atCorner && "45px", display: "flex" }}>
        <div
          className="row filter-container"
          style={{ width: atCorner ? "110%" : "100%" }}
        >
          {isSelector && (
            <div className={defaultSize}>
              {" "}
              <Selector
                selectlabel={selectlabel}
                setSelectedOption={setSelectedOption}
                selectOptions={selectOptions}
                defaultSelectValue1={defaultSelectValue1}
                // selectedValue={selectedValue}
              />
            </div>
          )}

          {isRangePicker && (
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
              />
            </div>
          )}
        </div>
        <div>
          {isSearch && (
            <div style={{ display: "flex", flexDirection: "row" }}>
              <div
                className={defaultSize}
                style={{ margin: atCorner && "0 0 0 -20px" }}
              >
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
                />
              </div>
              <div>Export</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default HeaderFilters;
