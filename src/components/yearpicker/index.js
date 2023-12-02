import { DatePicker } from "antd";
import React from "react";
import styles from "./style.module.css";
import Image from "next/image";
import arrow from "../../images/workingstatus/downArrow.png";
import dayjs from "dayjs";

const YearPicker = ({ onChange, type, bgColor }) => {
  const currentDate = dayjs().format("YYYY-MM-DD");
  return (
    <div className={styles.pickerBox}>
      <DatePicker
        onChange={onChange}
        picker={type}
        defaultValue={
          type === "year"
            ? dayjs(currentDate, "YYYY")
            : dayjs(currentDate, "mm")
        }
        format={type === "year" ? "YYYY" : "MM"}
        className={styles.picker}
        style={{ backgroundColor: bgColor }}
        suffixIcon={<Image src={arrow} />}
      />
    </div>
  );
};

export default YearPicker;
