import React, { useEffect, useState } from "react";
import Image from "next/image";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import Card from "../../../../components/card";
import calenderIcon from "../../../../images/physician/calender.svg";
import styles from "./styles.module.css";

const daysInaWeek = ["S", "M", "T", "W", "T", "F", "S"];
const Calender = () => {
  const dateFormat = "MMM YYYY";
  const initialSelectedDate = dayjs().format(dateFormat);
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
  const count = ["10", "09", "08", "07", "06", "05", "03", "04", "01"];

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
                        : index === 6
                        ? "0 8px 8px 0"
                        : "",
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
                  const cellClassName = `${styles.dateCell} ${
                    dayjs(dateString, "D/MM/YYYY").isSame(currentDate, "day") ||
                    dayjs(dateString, "D/MM/YYYY").isBefore(currentDate, "day")
                      ? styles.hoverdate
                      : ""
                  }`;

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
                        style={{ textAlign: "center" }}
                      >
                        {day?.dateIndex}

                        <div className={styles.countContainer}>
                          {console.log(count[day?.dateIndex])}
                          {(dayjs(dateString, "D/MM/YYYY").isSame(
                            currentDate,
                            "day"
                          ) ||
                            dayjs(dateString, "D/MM/YYYY").isBefore(
                              currentDate,
                              "day"
                            )) && (
                            <span>
                              {count[day?.dateIndex]
                                ? count[day?.dateIndex]
                                : 0}
                            </span>
                          )}
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
