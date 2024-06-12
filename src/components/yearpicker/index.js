import { DatePicker, Select } from "antd";
import React from "react";
import styles from "./style.module.css";
import Image from "next/image";
import arrow from "../../images/workingstatus/downArrow.png";
import dayjs from "dayjs";
import { monthNames } from "../../pages/admin/dashboard/accuracy";

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
      <div className={hideMonth ? "" :styles.pickerBox}>
      {hideMonth ? (
        <DatePicker
          onChange={onChangeYear}
          picker={"year"}
          value={ val1 && dayjs(val1 ? val1 : currentDate, "YYYY")}
          format={"YYYY"}
          className={className}
          suffixIcon={<Image src={arrow} />}
          disabledDate={disabledDate}
        />
      ) : (
        <div className={styles.pickerBox}>
        <DatePicker
          onChange={onChangeYear}
          picker={"year"}
          allowClear={false}
          value={dayjs(val1 ? val1 : currentYearDate, "YYYY")}
          format={"YYYY"}
          className={`${styles.picker} pickerChnages`}
          style={{ backgroundColor: bgColor }}
          suffixIcon={<Image src={arrow} />}
        />
      </div>
      )}
      </div>
      {type !== "Monthly" && !hideMonth && (
        <div style={{ marginRight: "10px" }}>
          <Select
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
