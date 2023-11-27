import { DatePicker } from "antd";
import React from "react";
import styles from "./style.module.css";
import { CalendarOutlined } from "@ant-design/icons";
import Image from "next/image";
import arrow from '../../images/workingstatus/downArrow.png'

const YearPicker = ({onChange,type}) => {
  const currentYear = new Date().getFullYear();

  return (
    <div className={styles.pickerBox}>
      <DatePicker
        onChange={onChange}
        picker={type}
        placeholder={currentYear}
        className={styles.picker}
        suffixIcon={<CalendarOutlined style={{ display: "none" }} />} 
      />
      <div className={styles.suffixIcon}>
        <Image src={arrow}/>
      </div>
    </div>
  );
};

export default YearPicker;
