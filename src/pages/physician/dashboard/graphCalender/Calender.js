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
  const [displayCount, setDisplayCount] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState();
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
      monthDates.push(
        <div key={i} className="dateCell">
          {date.format("D")}
        </div>
      );
    }

    return setDays(monthDates);
  };
  useEffect(() => {
    renderCalendar();
  }, [selectedDate]);
  const chunkArray = (arr, size) =>
    Array.from({ length: Math.ceil(arr?.length / size) }, (_, i) =>
      arr.slice(i * size, i * size + size)
    );

  const weeks = chunkArray(days, 7);
  const count = ["10", "09", "08", "07", "06", "05", "03", "04", "01"];
 
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
              {daysInaWeek?.map((item) => (
                <td style={{ width: "20px" }}>{item}</td>
              ))}
            </tr>
          </thead>
          <tbody>
            {weeks.map((week, index) => (
              <tr key={index}  onMouseLeave={() => {
                setDisplayCount(false);
              }}>
                {week.map((day, dayIndex) => (
                  <td key={dayIndex}>
                    <div
                      className={styles.dateCell}
                      onMouseOver={() => {
                        const dateString = day.props.children;
                        setHoveredIndex(dateString);
                        setDisplayCount(true)
                      }}
                     
                    >
                      {day}
                      {displayCount && hoveredIndex=== day.props.children &&  (
                        <div className={styles.countContainer}>
                          <span>{count[hoveredIndex]?count[hoveredIndex]:0}</span>
                        </div>
                      )}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default Calender;
