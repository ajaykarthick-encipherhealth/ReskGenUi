import { DatePicker } from "antd";
import React from "react";
import {
  disableFutureDate,
  disablePastDate,
  handleRnagePicker,
} from "../headerFilters/functions";
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
  disabled,
}) => {
  return (
    <div>
      <label style={{ marginLeft: "10px" }}>{pickerlabel}</label>
      <div>
        <RangePicker
          format={"YYYY-MM-DD"}
          value={selectedDates && selectedDates}
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
          disabledDate={(current) =>
            disabled === "pastDate"
              ? disablePastDate(current)
              : disableFutureDate(current)
          }
        />
      </div>
    </div>
  );
};

export default DateRangePicker;
