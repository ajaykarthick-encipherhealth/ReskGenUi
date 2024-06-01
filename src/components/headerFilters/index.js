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
import DateRangePicker from "../rangepicker";
import Selector from "../selector";
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
  defaultSize = "col-xl-2",
  adminReport,
  addBtn,
  atCorner,
  isNextCreatedBySelector,
  selectReportOptions,
  value,
  setSelectedManger,
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
      <div style={{ height: atCorner && "45px" }}>
        <div
          className="row filter-contain"
          style={{ width: atCorner ? "110%" : "100%" }}
        >
          {isSearch && (
            <div
              className={defaultSize}
              style={{ margin: atCorner && "0 0 0 -20px" }}
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
              />
            </div>
          )}
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
          {isNextCreatedBySelector && (
            <div
              className={defaultSize}
              onClick={() => {
                dispatch(
                  getFilters(
                    optionKey ? optionKey : "createdBy",
                    null,
                    "audited queue"
                  )
                );
              }}
            >
              <label className={styles.label}>{createdTolabel}</label>
              <div class="form-group has-search">
                <Select
                  onChange={(selectedOption) => {
                    setSelCreatedBy(selectedOption?.value);
                  }}
                  options={createdByOptoons}
                  className="custom-react-select"
                  isSearchable={false}
                  placeholder={defaultCreatedBy}
                />
              </div>
            </div>
          )}

          {selectReportOptions && (
            <div className={defaultSize}>
              <label className={styles.label}>{selectlabel2}</label>
              <div class="form-group has-search">
                <Select
                  value={defaultSelectValue2 ? defaultSelectValue2 : ""}
                  onChange={(selectedOption) => {
                    setSelectedOption2(selectedOption);
                    setSelectedManger("")
                    if (selectedOption?.label === "All") {
                      setSelectedOption3(null);
                    }
                  }}
                  options={selectReportOptions}
                  className="custom-react-select"
                  isSearchable={false}
                />
              </div>
            </div>
          )}
          {selectOptions2 && (
            <div className={defaultSize}>
              <label className={styles.label}>{selectlabel2}</label>
              <div class="form-group has-search">
                <Select
                  // value={defaultSelectValue2}
                  onChange={(selectedOption) => {
                    setSelectedOption2(selectedOption?.value);
                    if(setSelectedManger)
                    setSelectedManger("");
                  }}
                  options={selectOptions2}
                  // placeholder={defaultSelectValue2}
                  className="custom-react-select"
                  isSearchable={false}
                />
              </div>
            </div>
          )}
          {isSelector3 && (
            <div className={defaultSize}>
              <label className={styles.label}>{selectlabel3}</label>
              <div class="form-group has-search">
                <Select
                  showSearch
                  value={value ? value : ""}
                  onChange={(selectedOption) => {
                    if (selectedCoderOptReport?.value === "SUPERVISOR") {
                      setSelectedOption3(selectedOption);
                      setSelect(null);
                    }
                    if (selectedCoderOptReport?.value === "REVIEWER") {
                      setSelect(selectedOption?.value);
                      setSelectedOption3(selectedOption);
                    }
                  }}
                  className="custom-react-select"
                  options={selectOptions3}
                  style={{ backgroundColor: "#F3F3FF", width: "20px" }}
                />
              </div>
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

          {isRangeTimePicker && (
            <>
              <div className={defaultSize} style={{ width: "20%" }}>
                <label className={styles.label}>{timePickerlabel}</label>
                <div>
                  <RangePicker
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
                />
              </div>
            </>
          )}

          {isNextRow && (
            <div
              className={"col-xl-1"}
              style={{
                margin: "30px 0 0 10px",
                cursor: "pointer",
                width: "120px",
              }}
              onClick={() => setShowFilters(!showFilters)}
            >
              <button className={styles.filterBtn}>
                <Image src={filter} /> {showFilters ? "Hide" : "Filter"}
              </button>
            </div>
          )}
          {bullets && (
            <div
              className={`${bullets ? "col-xl-1" : "col-xl-4"}`}
              style={{ margin: "30px 0 0 0px", marginLeft: "39px" }}
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
                <Image
                  src={warning}
                  className="mt-[10px]"
                  style={{ cursor: "pointer" }}
                />
              </Popover>
            </div>
          )}
          {addUser && (
            <div className={columnClass} style={{ marginTop: "29px" }}>
              <Button
                onClick={addUserForm}
                style={{ background: "#04306f" }}
                className="btn btn-sm ms-2 flr width-max-content"
              >
                + {btnTitle}
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
        <div style={{ marginTop: "50px" }}>
          <div
            className="row filter-contain"
            style={{ width: atCorner ? "110%" : "100%" }}
          >
            {isAllocatedBySelector && (
              <div
                className={defaultSize}
                style={{ position: "relative", left: atCorner && "-20px" }}
                onClick={() => {
                  dispatch(
                    getFilters(selectorField ? selectorField : "allocatedBy")
                  );
                }}
              >
                <label className={styles.label}>{allocatedBylabel}</label>
                <div class="form-group has-search">
                  <Select
                    onChange={(selectedOption) => {
                      setSelAllocatedBy(selectedOption?.value);
                    }}
                    options={allocatedByOptoons}
                    className="custom-react-select"
                    isSearchable={false}
                    placeholder={defaultAllocatedBy}
                  />
                </div>
              </div>
            )}
            {isAllocatedToSelector && (
              <div
                className={defaultSize}
                style={{ zIndex: tracking && "2" }}
                onClick={() => {
                  dispatch(getFilters("patientAllocated"));
                }}
              >
                <label className={styles.label}>{allocatedTolabel}</label>
                <div class="form-group has-search">
                  <Select
                    onChange={(selectedOption) => {
                      setSelAllocatedTo(selectedOption?.value);
                    }}
                    options={allocatedToOptoons}
                    className="custom-react-select"
                    isSearchable={false}
                    placeholder={defaultAllocateTo}
                  />
                </div>
              </div>
            )}
            {isCreatedBySelector && (
              <div
                className={defaultSize}
                onClick={() => {
                  dispatch(
                    getFilters(
                      optionKey ? optionKey : "createdBy",
                      null,
                      "audited queue"
                    )
                  );
                }}
              >
                <label className={styles.label}>{createdTolabel}</label>
                <div class="form-group has-search">
                  <Select
                    onChange={(selectedOption) => {
                      setSelCreatedBy(selectedOption?.value);
                    }}
                    options={createdByOptoons}
                    className="custom-react-select"
                    isSearchable={false}
                    placeholder={defaultCreatedBy}
                  />
                </div>
              </div>
            )}
            {isAnotherPicker2 && (
              <>
                <div className={defaultSize}>
                  <label className={styles.label}>{pickerlabe3}</label>
                  <div>
                    <RangePicker
                      format="YYYY-MM-DD"
                      onChange={(date, dateString) => {
                        handleRnagePicker2({
                          date,
                          dateString,
                          setStartDate3,
                          setEndDate3,
                        });
                      }}
                    />
                  </div>
                </div>
              </>
            )}
            {isAnotherPicker3 && (
              <>
                <div className={defaultSize}>
                  <label className={styles.label}>{pickerlabe4}</label>
                  <div>
                    <RangePicker
                      format="YYYY-MM-DD"
                      onChange={(date, dateString) =>
                        handleRnagePicker2({
                          date,
                          dateString,
                          setStartDate4,
                          setEndDate4,
                        })
                      }
                      disabledDate={(current) => disableFutureDate(current)}
                    />
                  </div>
                </div>
              </>
            )}
            {isAnotherPicker5 && (
              <>
                <div className={defaultSize}>
                  <label className={styles.label}>{pickerlabe5}</label>
                  <div>
                    <RangePicker
                      format="YYYY-MM-DD"
                      onChange={(date, dateString) =>
                        handleRnagePicker2({
                          date,
                          dateString,
                          setStartDate5,
                          setEndDate5,
                        })
                      }
                      disabledDate={(current) => disableFutureDate(current)}
                    />
                  </div>
                </div>
              </>
            )}
            {isAnotherPicker6 && (
              <>
                <div className={defaultSize}>
                  <label className={styles.label}>{pickerlabe6}</label>
                  <div>
                    <Select
                      onChange={(selectedOption) => {
                        setPriority(selectedOption?.value);
                      }}
                      options={allocatedToOptoons}
                      className="custom-react-select"
                      isSearchable={false}
                      placeholder={defaultPriority}
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
