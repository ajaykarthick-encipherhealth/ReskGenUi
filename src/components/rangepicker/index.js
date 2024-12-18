import { DatePicker } from "antd";
import React from "react";
import dayjs from "dayjs";
import {
  disableFutureDate,
  handleRnagePicker2,
  resetPageNumber,
} from "../headerFilters/functions";
import moment from "moment";

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
  setPageNo,
  id = "select-date-range",
  name = "select-date-range",
  handleMultipleValues,
  pickerName,
  setSelectedDateRange,
  selectedDateRange,
}) => {

  return (
    <>
      <label style={{ marginLeft: "8px" }} className="responsiveLabel">
        {pickerlabel}
      </label>
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
        {handleMultipleValues ? (
          <RangePicker
            value={selectedDates ? selectedDates[pickerName] : ""}
            format="MM-DD-YYYY"
            onCalendarChange={(val) => {
              setSelectedDates((prev) => ({
                ...prev,
                [pickerName]: val,
              }));
            }}
            onChange={(date, dateString) => {
              // handleRnagePicker2({
              //   date,
              //   dateString,
              //   setStartDate,
              //   setEndDate,
              // });
              const formattedDates = dateString?.map((date, index) => {
                const formattedDate =
                  index === 1
                    ? date &&
                      `${moment(date, "MM-DD-YYYY").format(
                        "YYYY-MM-DD"
                      )}T23:59:59.999Z`
                    : date &&
                      `${moment(date, "MM-DD-YYYY").format(
                        "YYYY-MM-DD"
                      )}T00:00:00.000Z`;
                return formattedDate;
              });

              setSelectedDateRange((prevOptions) => ({
                ...prevOptions,
                [pickerName]: {
                  startDate: formattedDates[0],
                  endDate: formattedDates[1],
                },
              }));
              if (setPageNo) {
                resetPageNumber(setPageNo);
              }
              // setClear(false);
            }}
            disabledDate={(current) => {
              let customDate = moment().format("MM-DD-YYYY");
              return current && current > moment(customDate, "MM-DD-YYYY");
            }}
            id={id}
            name={name}
          />
        ) : (
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
              if (setPageNo) {
                resetPageNumber(setPageNo);
              }
              // setClear(false);
            }}
            disabledDate={(current) => {
              let customDate = moment().format("MM-DD-YYYY");
              return current && current > moment(customDate, "MM-DD-YYYY");
            }}
            id={id}
            name={name}
          />
        )}
      </div>
    </>
  );
};

export default DateRangePicker;
