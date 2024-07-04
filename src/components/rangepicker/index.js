import { DatePicker } from "antd";
import React from "react";
import dayjs from "dayjs";
import {
  disableFutureDate,
  handleRnagePicker2,
  resetPageNumber,
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
  setPageNo
}) => {
  return (
    <div>
      <label style={{ marginLeft: "8px" }}>{pickerlabel}</label>
      <div>
        {/* <RangePicker
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
          defaultValue={
            defaultEndDate && defaultStartDate
              ? [
                  dayjs(defaultStartDate, "YYYY-MM-DD"),
                  dayjs(defaultEndDate, "YYYY-MM-DD"),
                ]
              : []
          }
          disabledDate={(current) => !disabled && disableFutureDate(current)}
          onCalendarClose={() => {
            setSelectedDates([]);
          }}
        /> */}
        <RangePicker
          value={selectedDates ? selectedDates : ""}
          format="MM-DD-YYYY"
          onCalendarChange={(val) => setSelectedDates(val)}
          onChange={(date, dateString) => {
            handleRnagePicker2({
              date,
              dateString,
              setStartDate,
              setEndDate,
            });
            if(setPageNo){
              resetPageNumber(setPageNo)
            }
            // setClear(false);
          }}
        />
      </div>
    </div>
  );
};

export default DateRangePicker;
