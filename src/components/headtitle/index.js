import React, { useEffect, useState } from "react";
import { Button, DatePicker, Modal } from "antd";
import dayjs from "dayjs";
import { connect } from "react-redux";
import { actions as allActions } from "../../stores/admin/dashboard";
import { disableFutureDate } from "../headerFilters/functions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-regular-svg-icons";
import styles from "./styles.module.css";

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
  const [selectedDates, setSelectedDates] = useState(
    defaultDateRange
      ? [dayjs(defaultDateRange.startDate), dayjs(defaultDateRange.endDate)]
      : []
  );
  useEffect(() => {
    if (defaultDateRange?.startDate && defaultDateRange?.endDate) {
      setSelectedDates([
        dayjs(defaultDateRange.startDate),
        dayjs(defaultDateRange.endDate),
      ]);
    }
  }, [defaultDateRange]);

  const handleDatePickerChange = (date, dateStrings) => {
    if (date) {
      const dates = {
        startDate: dayjs(date[0]).format("YYYY-MM-DD") + "T00:00:00.000Z",
        endDate: dayjs(date[1]).format("YYYY-MM-DD") + "T23:59:59.000Z",
      };
      setSelectedDates(date);
      getDateRange(dates);
      setOpenPicker(false);
    } else {
      setSelectedDates([]);
      getDateRange(null);
      setOpenPicker(false);
    }
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
          <div className={styles.imgContainer}>
            <FontAwesomeIcon
              onClick={() => setOpenPicker(!openPicker)}
              icon={faCalendar}
            />
          </div>
        )}
      </div>
      {anchorTag && (
        <span className={styles.anchor} onClick={typeof handleOpen === "function" ?handleOpen:undefined}>
          View All
        </span>
      )}
      <Modal
        open={openPicker}
        width={650}
        closable={false}
        onCancel={() => {
          setOpenPicker(false);
          setSelectedDates([]);
        }}
        footer={null}
        className={styles.customModal}
      >
        <div
          className={`${styles.modalDetails} d-flex justify-content-between`}
        >
          <RangePicker
            getPopupContainer={() => document.getElementById("date-popup")}
            value={selectedDates?.length ? selectedDates : null}
            onChange={handleDatePickerChange}
            format="MM-DD-YYYY"
            disabledDate={(current) => disableFutureDate(current)}
            inputReadOnly={true}
            open={openPicker}
          />
        </div>
        {/* <div
          className="modal-footer"
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "20px",
          }}
        >
          <Button
            onClick={handleRefresh}
            type="default"
            style={{ marginRight: "10px" }}
          >
            Refresh
          </Button>
          <Button
            onClick={() => setOpenPicker(false)}
            style={{ marginLeft: "10px", marginRight: "20px" }}
          >
            Cancel
          </Button>
        </div> */}
        <div id="date-popup" style={{ position: "relative" }} />
      </Modal>
    </div>
  );
};

const connector = connect(null, {
  getDateRange: allActions.getDateRange,
});
export default connector(HeadTitle);
