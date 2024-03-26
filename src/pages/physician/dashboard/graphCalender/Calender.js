import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import styles from "./styles.module.css";
import { CalenderData } from "../../../../services/physicianService/DashbaordServices";
import Card from "../../../../components/card";
import calenderIcon from "../../../../images/physician/calender.svg";

const daysInaWeek = ["S", "M", "T", "W", "T", "F", "S"];
const Calender = () => {
  const dispatch = useDispatch();
  const dateFormat = "MMM YYYY";
  const initialSelectedDate = dayjs().format(dateFormat);
  const calInfo = useSelector(
    (state) => state?.physicianDashbaord?.calenderData
  );
  const [selectedDate, setSelectedDate] = useState(initialSelectedDate);
  const [days, setDays] = useState();
  const [hoveredIndex, setHoveredIndex] = useState();

  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState();
  const handleDates = (date, datstring) => {
    setSelectedDate(datstring);
  };
  const renderCalendar = () => {
    if (!selectedDate) return null;

    const selectedMonth = dayjs(selectedDate).startOf("month");
    const daysInMonth = selectedMonth.daysInMonth();
    const monthDates = [];

    for (let i = 1; i <= daysInMonth; i++) {
      const date = selectedMonth.date(i);
      monthDates?.push({
        dateIndex: date.format("D"),
        date: `${date.format("D")}/${dayjs(selectedDate).format("MM/YYYY")}`,
      });
    }

    return setDays(monthDates);
  };

  const chunkArray = (arr, size) =>
    Array.from({ length: Math.ceil(arr?.length / size) }, (_, i) =>
      arr.slice(i * size, i * size + size)
    );

  const weeks = chunkArray(days, 7);

  const handleDateSelection = (dateString) => {
    const date = `${dateString}/${dayjs(selectedDate).format("MM/YYYY")}`;
    if (!fromDate && !toDate) {
      setFromDate({
        date: date,
        dateIndex: dateString,
      });
    } else {
      if (fromDate && !toDate) {
        setToDate({
          date: date,
          dateIndex: dateString,
        });
      }
    }
  };

  useEffect(() => {
    renderCalendar();
    const dateObj = new Date(selectedDate);
    const monthName = dateObj.toLocaleString("en-US", { month: "long" });

    dispatch(
      CalenderData(
        "ID-001",
        monthName?.toUpperCase(),
        dayjs(selectedDate).format("YYYY")
      )
    );
  }, [selectedDate]);

  return (
    <Card borderRadius="10px" width="100%" height="418px" padding="10px">
      <div className={styles.innerWrapper} style={{ marginBottom: "10px" }}>
        <div className={styles.calHeader}>
          <Image src={calenderIcon} alt="noimg" />
          <span>Calender</span>
        </div>
        <div>
          <DatePicker
            picker="month"
            format={dateFormat}
            onChange={handleDates}
            suffixIcon={false}
            value={selectedDate ? dayjs(selectedDate) : undefined}
            className="calendarBox"
          />
        </div>
      </div>
      <div style={{ width: "100%" }}>
        <table className={styles.caletdertable}>
          <thead className={styles.calenderHeader}>
            <tr>
              {daysInaWeek?.map((item, index) => (
                <td
                  style={{
                    borderRadius:
                      index === 0
                        ? "8px 0 0 8px"
                        : index === 6 && "0 8px 8px 0",
                  }}
                >
                  {item}
                </td>
              ))}
            </tr>
          </thead>
          <tbody style={{ marginTop: "20px" }}>
            {weeks?.map((week, index) => (
              <tr
                key={index}
                onMouseLeave={() => {
                  setHoveredIndex();
                }}
              >
                {week?.map((day, dayIndex) => {
                  const dateString = day?.date;
                  const currentDate = dayjs().startOf("day");
                  let cellClassName;

                  const dateComparison = dayjs(dateString, "D/MM/YYYY");

                  if (dateComparison.isBefore(currentDate, "day")) {
                    cellClassName = `${styles.dateCell} ${styles.hoverdate}`;
                  } else if (dateComparison.isSame(currentDate, "day")) {
                    cellClassName = `${styles.dateCell} ${styles.hoverCurrentDate}`;
                  } else {
                    cellClassName = `${styles.dateCell} ${styles.futureHoverdate}`;
                  }
                  const convertedDate = dayjs(day?.date, "D/MM/YYYY").format(
                    "YYYY-MM-DD[T]HH:mm:ss[Z]"
                  );

                  const targetData = calInfo?.data?.response?.find(
                    (item) => item?.date === convertedDate
                  );

                  return (
                    <td key={dayIndex}>
                      <div
                        className={cellClassName}
                        onMouseOver={() => {
                          const dateString = day.dateIndex;
                          setHoveredIndex(dateString);
                        }}
                        onClick={() =>
                          handleDateSelection(
                            hoveredIndex === day.dateIndex ? day.dateIndex : ""
                          )
                        }
                        style={{
                          textAlign: "center",
                          paddingTop: "3px",
                          color:
                            dayjs(dateString, "D/MM/YYYY").isSame(
                              currentDate,
                              "day"
                            ) && "#fff",
                        }}
                      >
                        {day?.dateIndex}

                        <div className={styles.countContainer}>
                          <span
                            className={
                              dayjs(dateString, "D/MM/YYYY").isSame(
                                currentDate,
                                "day"
                              )
                                ? styles.CurrentSTyle
                                : styles.textContainer
                            }
                          >
                            {targetData?.patientCount
                              ? targetData?.patientCount
                              : 0}
                          </span>
                        </div>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default Calender;
