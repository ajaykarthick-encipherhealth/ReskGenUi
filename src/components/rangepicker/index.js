import { DatePicker } from "antd";
import React from "react";

const { RangePicker } = DatePicker;
const DateRangePicker = ({
  pickerlabel,
  activeTab,
  handleDatePickerChange,
  handleReceivedDatePicker,
  handleCoderPicker,
  selectedDates,
  filteratedDashboardData,
}) => {
  return (
    <div>
      <label>{pickerlabel}</label>
      <div>
        <RangePicker
          value={selectedDates}
          onChange={
            activeTab === "SentReport"
              ? handleDatePickerChange
              : activeTab === "ReceivedReport"
              ? handleReceivedDatePicker
              : handleCoderPicker
          }
          defaultValue={
            filteratedDashboardData
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