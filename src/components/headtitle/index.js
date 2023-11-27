import React, { useState } from "react";
import Image from "next/image";
import styles from "./styles.module.css";
import { DatePicker } from "antd";
const { RangePicker } = DatePicker;
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import { getDateRange } from "../../store/actions/DashboardActions";


export const converDates=(dateString)=>{
  dateString?.map((date) => {
    const formattedDate = dayjs(date)
      .startOf("day")
      .add(6, "hour")
      .add(39, "minute")
      .add(22, "second")
      .add(786, "millisecond")
      .toISOString();
    return formattedDate;
  });
}
const HeadTitle = ({ header, icon, anchorTag, handleOpen }) => {
  const dispatch=useDispatch()
  const handleDatePickerChange = (dateString) => {
    const convertedDates = dateString?.map((date) => {
      const formattedDate = dayjs(date)
        .startOf("day")
        .add(6, "hour")
        .add(39, "minute")
        .add(22, "second")
        .add(786, "millisecond")
        .toISOString();
      return formattedDate;
    });

    const dates={
      startDate:convertedDates[0],
      endDate:convertedDates[1]
    }
    dispatch(getDateRange(dates))
  };

  return (
    <div className={styles.header}>
      <div className={styles.title}>
        {header} &nbsp; &nbsp;
        {icon && (
          <RangePicker
            onChange={handleDatePickerChange}
            suffixIcon={<Image src={icon} alt="Calendar Icon" />}
            className={styles.IMG}
          />
        )}
      </div>
      {anchorTag && (
        <p className={styles.anchor} onClick={handleOpen}>
          view all
        </p>
      )}
    </div>
  );
};

export default HeadTitle;
