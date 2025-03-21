import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { actions as detailsActions } from "../../../../../stores/patient/details";
import { DatePicker, Popover, Select } from "antd";
import { SVGICON } from "../../../../../jsx/constant/theme";
import visitStyles from "../../../../../styles/visitdata.module.css";
import HeaderFilters from "../../../../headerFilters";
import Selector from "../../../../selector";
import DateRangePicker from "../../../../rangepicker";
import moment from "moment";
import RegularButton from "../../../../button";
import { disableFutureDate } from "../../../../headerFilters/functions";
import { formatDateForIndex } from "../../../../../utils/reusable";
import { useRef } from "react";
const { Option } = Select;
const { RangePicker } = DatePicker;

const MyWorkQueueFilter = ({
  setComputedStartDate,
  setComputedEndDate,
  setCompletedStartDate,
  setCompletedEndDate,
  completedStartDate,
  completedEndDate,
  computedStartDate,
  computedEndDate,
  selectedOption,
  setSelectedOption,
  statusOptions,
  selectCompletedPicker,
  setSelectCompletedPicker,
  selectComputedPicker,
  setSelectComputedPicker,
  datePicker1Lable,
  datePicker2Lable,
  filterModalOpen,
  setFilterModalOpen,
}) => {
  // const handleDatePickerChange = async (dates, dateString) => {
  //   if (dates) {
  //     setSelectComputedPicker(dates);
  //     let convertStartDate =
  //       moment(dateString[0]).format("YYYY-MM-DD") + "T00:00:00.000Z";
  //     let convertEndDate =
  //       moment.utc(dateString[1]).format("YYYY-MM-DD") + "T23:59:59.000Z";
  //     setComputedStartDate(convertStartDate);
  //     setComputedEndDate(convertEndDate);
  //     setFilterModalOpen(false);
  //   } else {
  //     setSelectComputedPicker("");
  //     setComputedStartDate("");
  //     setComputedEndDate("");
  //     setFilterModalOpen(false);
  //   }
  // };

  // const handleChangeprocessedDate = async (dates, dateString) => {
  //   if (dates) {
  //     setSelectCompletedPicker(dates);
  //     let convertStartDate =
  //       moment(dateString[0]).format("YYYY-MM-DD") + "T00:00:00.000Z";
  //     let convertEndDate =
  //       moment.utc(dateString[1]).format("YYYY-MM-DD") + "T23:59:59.000Z";
  //     setCompletedStartDate(convertStartDate);
  //     setCompletedEndDate(convertEndDate);
  //     setFilterModalOpen(false);
  //   } else {
  //     setCompletedStartDate("");
  //     setCompletedEndDate("");
  //     setSelectCompletedPicker("");
  //     setFilterModalOpen(false);
  //   }
  // };

  const pickerRef = useRef();
  const pickerRef1 = useRef();

  const handleDatePickerChange = async (dates, dateString) => {
    if (dates) {
      setSelectComputedPicker(dates);
      setComputedStartDate(
        formatDateForIndex({ date: dateString[0], index: 0 })
      );
      setComputedEndDate(formatDateForIndex({ date: dateString[1], index: 1 }));
      setFilterModalOpen(false);
    } else {
      setSelectComputedPicker("");
      setComputedStartDate("");
      setComputedEndDate("");
      setFilterModalOpen(false);
    }
  };

  const handleChangeprocessedDate = async (dates, dateString) => {
    if (dates) {
      setSelectCompletedPicker(dates);
      setCompletedStartDate(
        formatDateForIndex({ date: dateString[0], index: 0 })
      );
      setCompletedEndDate(
        formatDateForIndex({ date: dateString[1], index: 1 })
      );
      setFilterModalOpen(false);
    } else {
      setCompletedStartDate("");
      setCompletedEndDate("");
      setSelectCompletedPicker("");
      setFilterModalOpen(false);
    }
  };

  const filterIconClick = () => {
    setFilterModalOpen(filterModalOpen ? false : true);
  };

  return (
    <div
      className={styles.container}
      id="myworkqueue-container"
      name="myworkqueue-container"
    >
      <div
        onClick={filterIconClick}
        id="myworkqueue-filter-icon"
        name="myworkqueue-filter-icon"
      >
        <span className={visitStyles.circleCard}>{SVGICON.filter}</span>
      </div>
      {filterModalOpen && (
        <div
          className={styles.popover}
          id="myworkqueue-popover"
          name="myworkqueue-popover"
        >
          <div
            className={styles.popover_inner}
            id="myworkqueue-popover-inner"
            name="myworkqueue-popover-inner"
          >
            {/* <h6 className={styles.popover_title}>Filter</h6> */}
            <div
              className={styles.popover_content}
              id="myworkqueue-popover-content"
              name="myworkqueue-popover-content"
            >
              <div
                className={`myworkqueue_filter ${styles.detailsContainer}`}
                id="myworkqueue-details-filter"
                name="myworkqueue-details-filter"
              >
                <div
                  className="row"
                  id="myworkqueue-filter-row"
                  name="myworkqueue-filter-row"
                >
                  <div
                    className="col-xl-12 mb-2"
                    id="myworkqueue-status"
                    name="myworkqueue-status"
                  >
                    <label>Status</label>
                    <Select
                      data-testid="myworkqueue-status-status"
                      placeholder="Select Status"
                      options={statusOptions}
                      style={{ height: "42px", width: "100%" }}
                      className="myworkqueue_filter"
                      onChange={(e) => {
                        setSelectedOption(e), setFilterModalOpen(false);
                      }}
                      defaultValue={selectedOption}
                    />
                  </div>
                  <div
                    className="col-xl-12 mb-2"
                    id={datePicker1Lable}
                    name={datePicker1Lable}
                  >
                    <label>{datePicker1Lable}</label>
                    <div id="myworkqueue-selectCompletedPicker">
                      <RangePicker
                        data-testid="myworkqueue-selectCompletedPicker"
                        ref={pickerRef}
                        format="MM-DD-YYYY"
                        onChange={(dates, dateStrings) => {
                          handleChangeprocessedDate(dates, dateStrings);
                          if (!dates || dates.length === 0) {
                            setTimeout(() => pickerRef.current?.focus(), 100);
                          }
                        }}
                        disabledDate={(current) => disableFutureDate(current)}
                        value={selectCompletedPicker}
                      />
                    </div>
                  </div>
                  <div
                    className="col-xl-12 mb-4"
                    id={datePicker2Lable}
                    name={datePicker2Lable}
                  >
                    <label>{datePicker2Lable}</label>
                    <div id="myworkqueue-selectComputedPicker">
                      <RangePicker
                        data-testid="myworkqueue-selectComputedPicker"
                        ref={pickerRef1}
                        format="MM-DD-YYYY"
                        onChange={(dates, dateStrings) => {
                          handleDatePickerChange(dates, dateStrings);
                          if (!dates || dates.length === 0) {
                            setTimeout(() => pickerRef1.current?.focus(), 100);
                          }
                        }}
                        disabledDate={(current) => disableFutureDate(current)}
                        value={selectComputedPicker}
                      />
                    </div>
                  </div>
                  <div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyWorkQueueFilter;
