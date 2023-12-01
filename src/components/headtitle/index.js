import React from "react";
import Image from "next/image";
import styles from "./styles.module.css";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import { getDateRange } from "../../store/actions/DashboardActions";
const { RangePicker } = DatePicker;

export const converDates = (dateString) => {
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
};
const HeadTitle = ({
  header,
  icon,
  anchorTag,
  handleOpen,
  openPicker,
  setOpenPicker,
}) => {
  const dispatch = useDispatch();
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

    const dates = {
      startDate: convertedDates[0],
      endDate: convertedDates[1],
    };
    dispatch(getDateRange(dates));
    setTimeout(() => {
      setOpenPicker(false);
    }, 500);
  };

  return (
    <div className={styles.header}>
      <div
        style={{
          display: "flex",
          with: "100%",
          justifyContent: "space-between",
        }}
      >
        <div className={styles.title}>{header}</div>
        {icon && (
          <div style={{ width: "10%" }}>
            <Image
              src={icon}
              alt="Calendar Icon"
              onClick={() => setOpenPicker(!openPicker)}
              className={styles.IMG}
            />
            <RangePicker
              open={openPicker}
              onChange={handleDatePickerChange}
              suffixIcon={false}
              className={styles.datepicker}
            />
          </div>
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
