import React, { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./styles.module.css";
import { Button, DatePicker, Modal } from "antd";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import { getDateRange } from "../../store/actions/DashboardActions";

const { RangePicker } = DatePicker;

const HeadTitle = ({
  header,
  icon,
  anchorTag,
  handleOpen,
  openPicker,
  setOpenPicker,
}) => {
  const dispatch = useDispatch();
  const [selectedDates, setSelectedDates] = useState([]);
  const [dateValues, setDates] = useState();
  const currentDate = dayjs();
  const startOfMonth = currentDate.startOf("month");
  useEffect(() => {
    setSelectedDates([
      dayjs(currentDate).format("MM/DD/YYYY"),
      dayjs(startOfMonth).format("MM/DD/YYYY"),
    ]);
  }, []);

  const handleDatePickerChange = (date) => {
    if (date) {
      const convertedDates =
        date &&
        date?.map((date) => {
          const formattedDate =
            date &&
            dayjs(date)
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
      setDates(dates);
      // dispatch(getDateRange(dates));
    }
  };

  const last30thDate = currentDate.subtract(31, "day");
  const lastDateWithTime = currentDate.endOf("day").toISOString();

  return (
    <div className={styles.header} style={{ display: anchorTag && "flex" }}>
      <div
        style={{
          display: "flex",
          with: "100%",
          height: "100%",
          justifyContent: "space-between",
        }}
      >
        <div className={styles.title}>{header}</div>
        {icon && (
          <div className={styles.imgContainer}>
            <Image
              src={icon}
              alt="Calendar Icon"
              onClick={() => {
                setOpenPicker(!openPicker);
                if (!openPicker) {
                  setSelectedDates([]);
                }
              }}
              className={styles.IMG}
            />
          </div>
        )}
      </div>
      {anchorTag && (
        <span className={styles.anchor} onClick={handleOpen}>
          view all
        </span>
      )}
      <Modal
        open={openPicker}
        mask={false}
        width="34.5%"
        closable={false}
        style={{ left: "-20%", top: "18%" }}
        onOk={() => {
          dispatch(getDateRange(dateValues));
          setOpenPicker(false);
        }}
        onCancel={() => {
          setOpenPicker(false);
        }}
      >
        <div className={styles.modalDetails}>
          <RangePicker
            getPopupContainer={() => document.getElementById("date-popup")}
            popupStyle={{
              marginTop: "-259px",
              marginLeft: "-78px",
            }}
            placeholder={[
              dayjs(currentDate).format("MM/DD/YYYY"),
              dayjs(startOfMonth).format("MM/DD/YYYY"),
            ]}
            open={openPicker}
            value={selectedDates}
            onChange={(dates, dateStrings) => {
              setSelectedDates(dates);
              handleDatePickerChange(dateStrings);
            }}
            suffixIcon={false}
            className={styles.datepicker}
          />
          <span
            style={{
              cursor: "pointer",
              position: "relative",
              left: "280px",
              top: "-40px",
            }}
            onClick={() => {
              const dates = {
                startDate: last30thDate.toISOString(),
                endDate: lastDateWithTime,
              };
              dispatch(getDateRange(dates));
              // setOpenPicker(false);
              setSelectedDates([]);
            }}
          >
            <Button>Clear</Button>
          </span>
        </div>
        <div id="date-popup" style={{ position: "relative" }} />
      </Modal>
    </div>
  );
};

export default HeadTitle;
