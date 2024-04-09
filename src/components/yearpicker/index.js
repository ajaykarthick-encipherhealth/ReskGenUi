import { DatePicker } from "antd";
import React from "react";
import styles from "./style.module.css";
import Image from "next/image";
import arrow from "../../images/workingstatus/downArrow.png";
import dayjs from "dayjs";

const YearPicker = ({
  onChangeMonth,
  onChangeYear,
  type,
  bgColor,
  val,
  val1,
}) => {
  const currentDate = dayjs().format("YYYY-MM-DD");
  const currentYear = new Date().getFullYear();
  const selectedYear = dayjs(val1).format("YYYY");
  return (
    <>
      <div className={styles.pickerBox}>
        <DatePicker
          onChange={onChangeYear}
          picker={"year"}
          value={dayjs(val1 ? val1 : currentDate, "YYYY")}
          format={"YYYY"}
          className={`${styles.picker} pickerChnages`}
          style={{ backgroundColor: bgColor }}
          suffixIcon={<Image src={arrow} />}
        />
      </div>

      {type !== "Monthly" && (
        <div className={styles.pickerBox}>
          <DatePicker
            onChange={onChangeMonth}
            picker={"month"}
            value={
              currentYear === parseInt(selectedYear)
                ? dayjs(currentDate, "mm")
                : currentYear !== parseInt(selectedYear)
                ? dayjs(val1, "mm")
                : dayjs(val, "mm")
            }
            format={"MM"}
            className={`${styles.picker} pickerChnages`}
            style={{ backgroundColor: bgColor }}
            suffixIcon={<Image src={arrow} />}
          />
        </div>
      )}
    </>
  );
};

export default YearPicker;
