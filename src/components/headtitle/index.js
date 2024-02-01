import React, { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./styles.module.css";
import { Button, DatePicker, Modal } from "antd";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import { getDateRange } from "../../store/actions/DashboardActions";
import moment from "moment";

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
  const [isDisabled,setIsDisabled]=useState(true)
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
      const dates = {
        startDate: moment(date[0])?.format("YYYY-MM-DD") + "T00:00:00.000Z",
        endDate: moment(date[1])?.format("YYYY-MM-DD") + "T23:59:59.000Z",
      };
      setDates(dates);
    }
  };

  const last30thDate = currentDate.subtract(30, "day");
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
          setIsDisabled(false)
        }}
        onCancel={() => {
          setOpenPicker(false);
          setIsDisabled(false)
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
              setIsDisabled(false)
              setSelectedDates(dates);
              handleDatePickerChange(dateStrings);
            }}
            suffixIcon={false}
            className={styles.datepicker}
          />
          <div
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
                clear:true
              };
              dispatch(getDateRange(dates));
              setOpenPicker(false);
              setSelectedDates([]);
            }}
          >
            <Button 
            disabled={isDisabled? true : false}
            >
              Clear
            </Button>
          </div>
        </div>
        <div id="date-popup" style={{ position: "relative" }} />
      </Modal>
    </div>
  );
};

export default HeadTitle;
