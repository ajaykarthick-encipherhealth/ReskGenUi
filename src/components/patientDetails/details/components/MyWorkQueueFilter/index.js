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
}) => {
  const dateFormat = "MM-DD-YYYY";
  const [filterModalOpen, setFilterModalOpen] = useState(false);

  const handleDatePickerChange = async (dates, dateString) => {
    if (dates) {
      setSelectComputedPicker(dates);
      let convertStartDate =
        moment(dateString[0]).format("YYYY-MM-DD") + "T00:00:00.000Z";
      let convertEndDate =
        moment.utc(dateString[1]).format("YYYY-MM-DD") + "T23:59:59.000Z";
      setComputedStartDate(convertStartDate);
      setComputedEndDate(convertEndDate);
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
      let convertStartDate =
        moment(dateString[0]).format("YYYY-MM-DD") + "T00:00:00.000Z";
      let convertEndDate =
        moment.utc(dateString[1]).format("YYYY-MM-DD") + "T23:59:59.000Z";
      setCompletedStartDate(convertStartDate);
      setCompletedEndDate(convertEndDate);
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
    <>
      <div className={styles.container}>
        <div onClick={filterIconClick}>
          <span className={visitStyles.circleCard}>{SVGICON.filter}</span>
        </div>
        {filterModalOpen && (
          <div className={styles.popover}>
            <div className={styles.popover_inner}>
              {/* <h6 className={styles.popover_title}>Filter</h6> */}
              <div className={styles.popover_content}>
                <div
                  className={`myworkqueue_filter ${styles.detailsContainer}`}
                >
                  <div className="row">
                    <div className="col-xl-12 mb-2">
                      <label>Status</label>
                      <Select
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
                    <div className="col-xl-12 mb-2">
                      <label>{datePicker1Lable}</label>
                      <RangePicker
                        format="MM-DD-YYYY"
                        onChange={(dates, dateStrings) => {
                          handleChangeprocessedDate(dates, dateStrings);
                        }}
                        disabledDate={(current) => disableFutureDate(current)}
                        value={selectCompletedPicker}
                      />
                    </div>
                    <div className="col-xl-12 mb-4">
                      <label>{datePicker2Lable}</label>

                      <RangePicker
                        format="MM-DD-YYYY"
                        onChange={(dates, dateStrings) => {
                          handleDatePickerChange(dates, dateStrings);
                        }}
                        disabledDate={(current) => disableFutureDate(current)}
                        value={selectComputedPicker}
                      />
                    </div>
                    <div></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MyWorkQueueFilter;
