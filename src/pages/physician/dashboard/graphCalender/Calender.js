import React, { useState } from "react";
import moment from "moment";
import Card from "../../../../components/card";
import calenderIcon from "../../../../images/physician/calender.svg";
import styles from "./styles.module.css";
import Image from "next/image";
import { DatePicker } from "antd";
import dayjs from 'dayjs'

const Calender = () => {
  const dateFormat = "MMM YYYY";
  const [selectedDate, setSelectedDate] = useState();
  const handleDates = (date, datstring) => {
    setSelectedDate(datstring);
  };
  return (
    <Card
      borderRadius="10px"
      width="100%"
      height="418px"
      display="flex"
      padding="10px"
    >
      <div className={styles.innerWrapper}>
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
            value={selectedDate?dayjs(selectedDate):undefined}
            className="calendarBox"
          />
        </div>
      </div>
    </Card>
  );
};

export default Calender;
