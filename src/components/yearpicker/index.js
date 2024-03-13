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

  return (
    <>
      {/* {type !== "Monthly" && ( */}
        <div className={styles.pickerBox}>
          <DatePicker
            onChange={onChangeYear}
            picker={"year"}
            value={dayjs(val1?val1:currentDate, "YYYY")}
            format={"YYYY"}
            className={styles.picker}
            style={{ backgroundColor: bgColor }}
            suffixIcon={<Image src={arrow} />}
          />
        </div>
      {/* )} */}

      {type !== "Monthly" && 
      <div className={styles.pickerBox}>
        <DatePicker
          onChange={onChangeMonth}
          picker={"month"}
          value={dayjs(val?val:currentDate, "mm")}
          format={"MM"}
          className={styles.picker}
          style={{ backgroundColor: bgColor }}
          suffixIcon={<Image src={arrow} />}
        />
      </div>
}
    </>
  );
};

export default YearPicker;
