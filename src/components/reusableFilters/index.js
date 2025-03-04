import React, { useState } from "react";
import {  DatePicker, Select } from "antd";
import moment from "moment";
import ReusableInput from "./reusableInput";
import MoreFilter from "../../pages/tenantadmin/tracking/filters";
import { useRef } from "react";
import { disabledDate } from "../../utils/reusable";
const { RangePicker } = DatePicker;

const ReusableFilters = ({
  FilterItems,
  //search
  setSearchText,
  searchText,
  setPageNo,
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
  // button
  addUser,
  addUserForm,
  btnTitle,
  form,

  //filters
  showFilter,
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
  const handleClearFilters = () => {
    setSelectAll(false);
    setActiveFilters(["Search", "Reviewer", "Supervisor"]);
    setClear(true);
    setSearchText(null);
    setSelectedDateRanges({});
    setSelectedDates([]);
    setSelectedOption({});
  };
  const handleRangePicker = (dates, dateString, tabName) => {
    const formattedDates = dateString?.map((date, index) => {
      const formattedDate =
        index === 1
          ? date &&
            `${moment(date, "MM-DD-YYYY").format("YYYY-MM-DD")}T23:59:59.999Z`
          : date &&
            `${moment(date, "MM-DD-YYYY").format("YYYY-MM-DD")}T00:00:00.000Z`;
      return formattedDate;
    });

    setSelectedDates((prevOptions) => ({
      ...prevOptions,
      [tabName]: dates,
    }));
    setSelectedDateRanges((prevOptions) => ({
      ...prevOptions,
      [tabName]: { startDate: formattedDates[0], endDate: formattedDates[1] },
    }));
    setPageNo && setPageNo(0);
  };
  return (
    <div className="d-flex">
      <div className="row" style={{ width: "97%" }}>
        {FilterItems?.filter((item) =>
          activeFilters?.includes(item?.placeholder)
        ).map((item) => {
          switch (item?.type) {
            case "search":
              return (
                <div key={item?.title} className="default-filter-size mb-2">
                  <label className="responsiveLabel">{item?.header}</label>
                  <ReusableInput
                    testId={`${item?.title}-${item?.type}`}
                    name={`${item?.title}-${item?.type}`}
                    placeholder={"Search"}
                    value={searchText}
                    isSearch={true}
                    setSearchText={setSearchText}
                    autoComplete="off"
                    setPageNumber={setPageNo}
                  />
                </div>
              );
            case "select":
              return (
                <div key={item?.title} className="default-filter-size mb-2">
                  <label className="responsiveLabel">{item?.placeholder}</label>
                  <div>
                    <div
                      id={`${item?.title}-${item?.type}`}
                      name={`${item?.title}-${item?.type}`}
                      className="form-group has-search custom-react-select-audit customClear"
                    >
                      <Select
                        data-testid={item?.title}
                        name={item?.title}
                        filterOption={(input, option) =>
                          (option?.label ?? "")
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                        showSearch={item?.showSearch || false}
                        className="custom-react-select-audit w-100"
                        options={item?.options}
                        placeholder={item?.placeholder}
                        value={selectedOption?.[item?.title] || null}
                        onChange={(value) => {
                          setSelectedOption((prevOptions) => ({
                            ...prevOptions,
                            [item?.title]: value,
                          }));
                          setPageNo && setPageNo(0);
                        }}
                        allowClear
                      />
                    </div>
                  </div>
                </div>
              );
            case "rangePicker":
              return (
                <div key={item?.title} className="default-filter-size mb-2">
                  <label className="responsiveLabel">{item?.placeholder}</label>
                  <div
                    id={`${item?.title}-${item?.type}`}
                    name={`${item?.title}-${item?.type}`}
                  >
                    <RangePicker
                      ref={(node) => {
                        if (node) pickerRefs.current[item?.title] = node;
                      }}
                      data-testid={`${item?.title}-${item?.type}`}
                      name={`${item?.title}-${item?.type}`}
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
                          item?.title === "dueDate" ||
                            item?.title == "auditedDueDate" ||
                            item?.title == "auditDueDate"
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
      <div
        className="d-flex justify-content-center align-items-center mt-3"
        style={{ width: "3%" }}
      >
        {showFilter && (
          <MoreFilter
            selectAll={selectAll}
            setSelectAll={setSelectAll}
            activeFilters={activeFilters}
            allFilters={FilterItems?.map((x) => x.placeholder)}
            setActiveFilters={setActiveFilters}
            setClear={setClear}
            handleClearAllFilters={handleClearAllFilters}
            handleClearFilters={handleClearFilters}
            getRoutedData={getRoutedData}
            addUser={addUser}
            addUserForm={addUserForm}
            btnTitle={btnTitle}
            form={form}
          />
        )}
      </div>
    </div>
  );
};

export default ReusableFilters;
