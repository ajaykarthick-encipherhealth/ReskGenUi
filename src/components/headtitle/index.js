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
  const [dateValues, setDates] = useState();

  useEffect(() => {
    // Log defaultDateRange and selectedDates for debugging
    console.log("defaultDateRange:", defaultDateRange);
    console.log("selectedDates before setting:", selectedDates);

    if (defaultDateRange?.startDate && defaultDateRange?.endDate) {
      setSelectedDates([
        dayjs(defaultDateRange.startDate),
        dayjs(defaultDateRange.endDate),
      ]);
    }
  }, [defaultDateRange]);

  const handleDatePickerChange = (date) => {
    if (date) {
      const dates = {
        startDate: dayjs(date[0]).format("YYYY-MM-DD") + "T00:00:00.000Z",
        endDate: dayjs(date[1]).format("YYYY-MM-DD") + "T23:59:59.000Z",
      };
      setDates(dates);
    }
  };

  const handleRefresh = () => {
    setSelectedDates([]);
    setDates(null);
    getDateRange(null);
  };

  return (
    <div
      className={styles.header}
      style={{ display: anchorTag && "flex", margin: margin }}
    >
      <div
        style={{
          display: "flex",
          width: "100%",
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
        <span className={styles.anchor} onClick={handleOpen}>
          View All
        </span>
      )}
      <Modal
        open={openPicker}
        width={640}
        closable={false}
        onOk={() => {
          getDateRange(dateValues);
          setOpenPicker(false);
        }}
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
            value={selectedDates?.length ? selectedDates : null} // Set selected dates if available
            onChange={(dates, dateStrings) => {
              setSelectedDates(dates);
              handleDatePickerChange(dateStrings);
            }}
            format="MM-DD-YYYY"
            disabledDate={(current) => disableFutureDate(current)}
            inputReadOnly={true}
            open={openPicker}
          />
        </div>
        <div
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
            style={{ marginLeft: "10px", marginRight:"20px" }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              getDateRange(dateValues);
              setOpenPicker(false);
            }}
            type="primary"
          >
            OK
          </Button>
        </div>
        <div id="date-popup" style={{ position: "relative" }} />
        <div
          className="modal-footer"
          style={{ textAlign: "right", marginTop: "20px" }}
        ></div>
      </Modal>
    </div>
  );
};

const connector = connect(null, {
  getDateRange: allActions.getDateRange,
});
export default connector(HeadTitle);
