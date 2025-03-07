import React, { useState } from "react";
import { DatePicker, Select } from "antd";
import moment from "moment";
import { disableFutureDates } from "../../components/headerFilters/functions";
import ReusableInput from "./reusableInput";
import MoreFilter from "../../pages/tenantadmin/notifications/filters";
import { useRef } from "react";
import { disabledDate, formatDateForIndex } from "../../utils/reusable";
const { RangePicker } = DatePicker;

const ReusableFilters = ({
  FilterItems,
  //search
  setSearchText,
  searchText,
  //select
  setSelectedOption,
  selectedOption,
  //dateRange
  setSelectedDateRanges,
  setSelectedDates,
  selectedDates,
  // disabledDate,
  setPageNumber,
  activeFilters,
  setActiveFilters,
  setClear,
  getRoutedData,
}) => {
  const pickerRefs = useRef({});

  const handleFocusPicker = (title) => {
    setTimeout(() => pickerRefs.current[title]?.focus(), 100);
  };

  const [selectAll, setSelectAll] = useState(false);
  const handleClearAllFilters = () => {
    setClear(true);
    setSearchText(null);
    setSelectedDateRanges({});
    setSelectedDates([]);
    setSelectedOption({});
  };
  const handleRangePicker = (dates, dateString, tabName) => {
    // const formattedDates = dateString?.map((date, index) => {
    //   const formattedDate =
    //     index === 1
    //       ? date &&
    //         `${moment(date, "MM-DD-YYYY").format("YYYY-MM-DD")}T23:59:59.999Z`
    //       : date &&
    //         `${moment(date, "MM-DD-YYYY").format("YYYY-MM-DD")}T00:00:00.000Z`;
    //   return formattedDate;
    // });
    const formattedDates = dateString?.map((date, index) =>
      formatDateForIndex({ date: date, index: index })
    );


    setSelectedDates((prevOptions) => ({
      ...prevOptions,
      [tabName]: dates,
    }));
    setSelectedDateRanges((prevOptions) => ({
      ...prevOptions,
      [tabName]: { startDate: formattedDates[0], endDate: formattedDates[1] },
    }));
    setPageNumber && setPageNumber(0);
  };

  return (
    <div className="d-flex " style={{ width: "100%" }}>
      <div className=" d-flex gap-3 py-4" style={{ width: "95%" }}>
        {FilterItems?.filter((item) =>
          activeFilters.includes(item?.placeholder)
        ).map((item) => {
          switch (item?.type) {
            case "search":
              return (
                <div key={item?.title} className="d-flex">
                  <label className="labelStyle d-flex  p-3">
                    {item?.placeholder}
                  </label>
                  <div
                    className="custom-reportInput"
                    id={item?.id}
                    name={item?.id}
                  >
                    <ReusableInput
                      name={item?.id}
                      placeholder={item?.placeholder}
                      value={searchText}
                      isSearch={true}
                      setSearchText={setSearchText}
                      autoComplete="off"
                      setPageNumber={setPageNumber}
                    />
                  </div>
                </div>
              );
            case "select":
              return (
                <div key={item?.title}>
                  <div className="d-flex w-100">
                    <label className="labelStyle d-flex m-auto  p-2">
                      {item?.title}
                    </label>
                    <div className="form-group has-search w-100 custom-react-report-select custom-react-report-status">
                      <div
                        id={item?.id}
                        name={item?.id}
                        className="form-group has-search w-100 custom-react-report-select custom-react-report-status"
                      >
                        <Select
                          id={item?.id}
                          name={item?.id}
                          className="custom-react-select-audit w-100"
                          options={item?.options}
                          placeholder={item?.placeholder}
                          value={selectedOption?.[item?.title] || null}
                          onChange={(value) => {
                            setSelectedOption((prevOptions) => ({
                              ...prevOptions,
                              [item?.title]: value,
                            }));
                            setPageNumber && setPageNumber(0);
                          }}
                          allowClear
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            case "rangePicker":
              return (
                <div key={item?.title} className="d-flex ">
                  <label className="labelStyle labelStyleDate d-flex m-0 p-2">
                    {item?.placeholder}
                  </label>
                  <div
                    id={item?.id}
                    name={item?.id}
                    className="newReportPicker"
                  >
                    <RangePicker
                      ref={(node) => {
                        if (node) pickerRefs.current[item?.title] = node;
                      }}
                      id={item?.id}
                      name={item?.id}
                      style={{ borderRadius: "0px 10px 10px 0px !important" }}
                      className=" notificationPicker w-100"
                      format="MM-DD-YYYY"
                      value={selectedDates?.[item?.title]}
                      onCalendarChange={(val) => {
                        setSelectedDates((prev) => ({
                          ...prev,
                          [item?.title]: val,
                        }));
                      }}
                      onChange={(date, dateString) => {
                        if (!date || date.length === 0) {
                          handleFocusPicker(item?.title);
                        }
                        handleRangePicker(date, dateString, item?.title);
                      }}
                      allowClear={true}
                      disabledDate={(currentDate) =>
                        disabledDate(
                          currentDate,
                          selectedDates?.[item?.title],
                          item?.title === "dueDate"
                        )
                      }
                    />
                  </div>
                </div>
              );
            default:
              return null;
          }
        })}
      </div>
      <div className="align-self-center" style={{ width: "5%" }}>
        <MoreFilter
          selectAll={selectAll}
          setSelectAll={setSelectAll}
          activeFilters={activeFilters}
          allFilters={FilterItems?.map((x) => x.placeholder)}
          setActiveFilters={setActiveFilters}
          setClear={setClear}
          handleClearAllFilters={handleClearAllFilters}
          getRoutedData={getRoutedData}
        />
      </div>
    </div>
  );
};

export default ReusableFilters;
