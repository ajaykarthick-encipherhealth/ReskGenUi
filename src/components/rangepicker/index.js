import { DatePicker } from "antd";
import React from "react";
import { handleRnagePicker } from "../headerFilters/functions";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;
const DateRangePicker = ({
  pickerlabel,
  selectedDates,
  setStartDate,
  setEndDate,
  defaultStartDate,
  defaultEndDate,
  setSelectedDates,
  activeTab,
  setReceivedStartDate,
  setReceivedEndDate,
  setCoderStartDate,
  setCoderEndDate,
}) => {
  return (
    <div>
      <label>{pickerlabel}</label>
      <div>
        <RangePicker
          value={selectedDates}
          onChange={(date, dateString) =>
            handleRnagePicker(
              date,
              dateString,
              setStartDate,
              setEndDate,
              setSelectedDates,
              activeTab,
              setReceivedStartDate,
              setReceivedEndDate,
              setCoderStartDate,
              setCoderEndDate
            )
          }
          defaultValue={
            defaultEndDate && defaultStartDate
              ? [
                  dayjs(defaultStartDate, "YYYY-MM-DD"),
                  dayjs(defaultEndDate, "YYYY-MM-DD"),
                ]
              : []
          }
        />
      </div>
    </div>
  );
};

export default DateRangePicker;
