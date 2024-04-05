import { DatePicker } from "antd";
import React from "react";
import dayjs from "dayjs";
import {
  disableFutureDate,
  handleRnagePicker,
} from "../headerFilters/functions";

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
  disabled,
}) => {
  return (
    <div>
      <label style={{ marginLeft: "8px" }}>{pickerlabel}</label>
      <div>
        <RangePicker
          value={selectedDates ? selectedDates : ""}
          format="YYYY-MM-DD"
          onCalendarChange={(val) => setSelectedDates(val)}
          onChange={(date, dateString) =>
            handleRnagePicker({
              date,
              dateString,
              setStartDate,
              setEndDate,
              activeTab,
              setReceivedStartDate,
              setReceivedEndDate,
              setCoderStartDate,
              setCoderEndDate,
            })
          }
          disabledDate={(current) => disableFutureDate(current)}
          onCalendarClose={() => {
            setSelectedDates([]);
          }}
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
