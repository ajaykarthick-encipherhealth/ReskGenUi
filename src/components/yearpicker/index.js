import { DatePicker, Select } from "antd";
import React from "react";
import styles from "./style.module.css";
import Image from "next/image";
import dayjs from "dayjs";
import { monthNames } from "../../pages/admin/dashboard/accuracy";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";

const YearPicker = ({
  onChangeMonth,
  onChangeYear,
  type,
  bgColor,
  val,
  val1,
  hideMonth,
  className,
  disabledDate,
}) => {
  const currentDate = dayjs().format("MM");
  const currentYearDate = dayjs().format("DD/MM/YYYY");

  return (
    <>
      <div className={hideMonth ? "" : styles.pickerBox}>
        {hideMonth ? (
          <div id="custom-picker1" name="custom-picker1">
            <DatePicker
              data-testid="date-picker1"
              name="date-picker1"
              onChange={onChangeYear}
              picker={"year"}
              value={val1 && dayjs(val1 ? val1 : currentDate, "YYYY")}
              format={"YYYY"}
              className={className}
              suffixIcon={<FontAwesomeIcon icon={faAngleDown} />}
              disabledDate={disabledDate}
            />
          </div>
        ) : (
          <div
            id="custom-picker2"
            name="custom-picker2"
            className={styles.pickerBox}
          >
            <DatePicker
              data-testid="date-picker2"
              name="date-picker2"
              onChange={onChangeYear}
              picker={"year"}
              allowClear={false}
              value={dayjs(val1 ? val1 : currentYearDate, "YYYY")}
              format={"YYYY"}
              className={`${styles.picker} pickerChnages`}
              style={{ backgroundColor: bgColor }}
              suffixIcon={<FontAwesomeIcon icon={faAngleDown} />}
              disabledDate={(current) => {
                let customDate = moment().format("YYYY");
                return current && current > moment(customDate, "YYYY");
              }}
            />
          </div>
        )}
      </div>
      {type !== "Monthly" && !hideMonth && (
        <div
          id="chart-select"
          name="chart-select"
          style={{ marginRight: "10px" }}
        >
          <Select
            data-testid="select-month"
            id="select-month"
            value={
              val
                ? { label: val < 10 ? `0${val}` : val, value: val }
                : { label: currentDate, value: currentDate }
            }
            onChange={(e) => onChangeMonth(e)}
            className={`${
              bgColor === "#F3F3FF"
                ? "custom_MonthSelect2"
                : "custom_MonthSelect"
            } ${styles.monthSelect}`}
            options={monthNames?.map((item, index) => ({
              label: item,
              value: index + 1,
            }))}
            style={{ borderRadius: "10px", height: "35px" }}
          />
        </div>
      )}
    </>
  );
};

export default YearPicker;
