import React, { useState, useEffect } from "react";
import { Button, DatePicker, Modal } from "antd";
import dayjs from "dayjs";
import { connect } from "react-redux";
import { actions as allActions } from "../../stores/admin/dashboard";
import { disableFutureDate } from "../headerFilters/functions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-regular-svg-icons";
import styles from "./styles.module.css";
import { disabledDate } from "../../utils/reusable";

const { RangePicker } = DatePicker;

const HeadTitle = ({
  header,
  icon,
  anchorTag,
  handleOpen,
  openPicker,
  setOpenPicker,
  isAdmin = false,
  margin,
  fontSize,
  getDateRange,
  defaultDateRange,
}) => {
  const [tempDates, setTempDates] = useState([]);
  const [backupDates, setBackupDates] = useState([]);
  const [clearFlag, setClearFlag] = useState(false);

  
  useEffect(() => {
    if (defaultDateRange?.startDate && defaultDateRange?.endDate) {
      const start = dayjs(defaultDateRange.startDate);
      const end = dayjs(defaultDateRange.endDate);
      setTempDates([start, end]);
      setBackupDates([start, end]);
    }
  }, [defaultDateRange]);

  const handleDatePickerChange = (date) => {
    if (date) {
      setTempDates(date);
      setClearFlag(false);
    } else {
      setTempDates([]);
      setClearFlag(true);
    }
  };

  const handleOk = () => {
    if (clearFlag) {
      getDateRange(null);
    } else if (tempDates?.length) {
      const dates = {
        startDate: dayjs(tempDates[0]).format("YYYY-MM-DD") + "T00:00:00.000Z",
        endDate: dayjs(tempDates[1]).format("YYYY-MM-DD") + "T23:59:59.000Z",
      };
      getDateRange(dates);
    }
    setBackupDates(tempDates);
    setOpenPicker(false);
  };

  const handleCancel = () => {
    setTempDates(backupDates);
    setClearFlag(false);
    setOpenPicker(false);
  };

  const handleOpenPicker = () => {
    setBackupDates(tempDates);
    setOpenPicker(true);
  };

  return (
    <div
      className={styles.header}
      style={{ display: anchorTag && "flex", margin: margin }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div className={styles.title} style={{ fontSize: fontSize }}>
          {header}
        </div>
        {icon && (
          <div className={`cursor-pointer ${styles.imgContainer}`}>
            <FontAwesomeIcon onClick={handleOpenPicker} icon={faCalendar} />
          </div>
        )}
      </div>
      {anchorTag && (
        <span
          className={styles.anchor}
          onClick={typeof handleOpen === "function" ? handleOpen : undefined}
        >
          View All
        </span>
      )}
      <Modal
        open={openPicker}
        width={650}
        closable={false}
        onCancel={handleCancel}
        footer={
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button onClick={handleCancel} style={{ marginRight: "10px" }}>
              Cancel
            </Button>
            <Button onClick={handleOk} type="primary">
              Ok
            </Button>
          </div>
        }
        className={styles.customModal}
      >
        <div
          className={`${styles.modalDetails} d-flex justify-content-between`}
        >
          <RangePicker
            getPopupContainer={() => document.getElementById("date-popup")}
            value={tempDates?.length ? tempDates : null}
            onChange={handleDatePickerChange}
            onCalendarChange={(val) => setTempDates(val)}
            format="MM-DD-YYYY"
            // disabledDate={(current) => disableFutureDate(current)}
            disabledDate={(currentDate) => disabledDate(currentDate, tempDates)}
            allowClear={true}
            inputReadOnly={true}
            open={openPicker}
          />
        </div>
        <div id="date-popup" style={{ position: "relative" }} />
      </Modal>
    </div>
  );
};

const connector = connect(null, {
  getDateRange: allActions.getDateRange,
});
export default connector(HeadTitle);
