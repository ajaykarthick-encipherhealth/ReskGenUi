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
}) => {
  return (
    <div>
      <label>{pickerlabel}</label>
      <div>
        <RangePicker
          value={selectedDates}
          onChange={(date, dateString) =>
            handleRnagePicker({
              date,
              dateString,
              setStartDate,
              setEndDate,
              setSelectedDates,
            })
          }
          defaultValue={
            defaultEndDate && defaultStartDate
              ? [
                  dayjs(defaultStartDate, "MM-DD-YYYY"),
                  dayjs(defaultEndDate, "MM-DD-YYYY"),
                ]
              : []
          }
        />
      </div>
    </div>
  );
};

export default DateRangePicker;
