import { DatePicker } from "antd";
import React from "react";
import { handleRnagePicker } from "../headerFilters/functions";

const { RangePicker } = DatePicker;
const DateRangePicker = ({
  pickerlabel,
  selectedDates,
  setStartDate,
  setEndDate,
  defaultStartDate,
  defaultEndDate,
}) => {
  return (
    <div>
      <label>{pickerlabel}</label>
      <div>
        <RangePicker
          value={selectedDates}
          onChange={handleRnagePicker(
            date,
            dateString,
            setStartDate,
            setEndDate
          )}
          defaultValue={[
            dayjs(defaultStartDate, "MM-DD-YYYY"),
            dayjs(defaultEndDate, "MM-DD-YYYY"),
          ]}
        />
      </div>
    </div>
  );
};

export default DateRangePicker;
