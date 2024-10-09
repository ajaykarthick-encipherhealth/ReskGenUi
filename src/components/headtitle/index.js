import React, { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./styles.module.css";
import { Button, DatePicker, Modal, Popover } from "antd";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import { getDateRange } from "../../store/actions/DashboardActions";
import moment from "moment";
import { disableFutureDate } from "../headerFilters/functions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-regular-svg-icons";

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
}) => {
  const dispatch = useDispatch();
  const [selectedDates, setSelectedDates] = useState([]);
  const [dateValues, setDates] = useState();
  const currentDate = dayjs();
  const startOfMonth = currentDate.startOf("month");

  const handleDatePickerChange = (date) => {
    if (date) {
      const dates = {
        startDate:
          moment(date[0], "MM-DD-YYYY").format("YYYY-MM-DD") + "T00:00:00.000Z",
        endDate:
          moment(date[1], "MM-DD-YYYY").format("YYYY-MM-DD") + "T23:59:59.000Z",
      };
      setDates(dates);
    }
  };

  const last3thDate = currentDate.subtract(2, "day");
  const lastDateWithTime = currentDate.endOf("day").toISOString();

  return (
    <div
      className={styles.header}
      style={{ display: anchorTag && "flex", margin: margin }}
    >
      <div
        style={{
          display: "flex",
          with: "100%",
          height: "100%",
          justifyContent: "space-between",
        }}
      >
        <div className={styles.title} style={{ fontSize: fontSize }}>
          {header}
        </div>
        {icon && (
          <div className={styles.imgContainer}>
            <div className="cursor-pointer">
              <Popover
                placement="bottom"
                trigger="click"
                content={
                  <>
                    <div
                      className={`w-100 ${styles.modalDetails} d-flex justify-content-between`}
                    >
                      <RangePicker
                        getPopupContainer={() =>
                          document.getElementById("date-popup")
                        }
                        placeholder={[
                          dayjs(currentDate).format("MM-DD-YYYY"),
                          dayjs(startOfMonth).format("MM-DD-YYYY"),
                        ]}
                        open={true}
                        value={selectedDates?.length > 0 ? selectedDates : null}
                        onChange={(dates, dateStrings) => {
                          setSelectedDates(dates);
                          handleDatePickerChange(dateStrings);
                        }}
                        format="MM-DD-YYYY"
                        suffixIcon={false}
                        disabledDate={(current) => disableFutureDate(current)}
                        inputReadOnly={true}
                      />
                    </div>
                    <div id="date-popup" style={{ position: "relative" }} />
                  </>
                }
              >
                <FontAwesomeIcon
                  onClick={() => {
                    setOpenPicker(!openPicker);
                    if (!openPicker) {
                      setSelectedDates([]);
                    }
                  }}
                  icon={faCalendar}
                />
              </Popover>
            </div>
          </div>
        )}
      </div>
      {anchorTag && (
        <span className={styles.anchor} onClick={handleOpen}>
          View All
        </span>
      )}
    </div>
  );
};

export default HeadTitle;
