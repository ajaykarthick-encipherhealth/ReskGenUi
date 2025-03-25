import React, { useState } from "react";
import { DatePicker, Select } from "antd";
import moment from "moment";
import ReusableInput from "./reusableInput";
import MoreFilter from "../../pages/tenantadmin/tracking/filters";
import { useRef } from "react";
import { disabledDate, formatDateForIndex } from "../../utils/reusable";
import ReusableMultiInput from "./reusableInput/multiple";
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
  opt,

  search,
  setSearch,
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
    setActiveFilters((prevFilters) =>
      prevFilters.map((filter) =>
        filter.type === "search"
          ? { ...filter, active: true }
          : { ...filter, active: false }
      )
    );
    setSelectedDateRanges({});
    setSelectedDates([]);
    setSelectedOption({});
    setSearchText(null)
  };

  const handleRangePicker = (dates, dateString, tabName) => {
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
    setPageNo && setPageNo(0);
  };
  return (
    <div className="d-flex">
      <div className="row" style={{ width: showFilter ? "98%" : "auto" }}>
        {FilterItems?.filter((item) => item?.active).map((item) => {
          switch (item?.type) {
            case "search":
              return (
                <div key={item?.title} className="default-filter-size mb-2">
                  <label className="responsiveLabel">{item?.header}</label>
                  <ReusableInput
                    testId={item?.title}
                    name={`patientId-${item?.title}`}
                    placeholder={"Search"}
                    value={searchText}
                    isSearch={true}
                    setSearchText={setSearchText}
                    autoComplete="off"
                    setPageNumber={setPageNo}
                    id={`${item?.title}-${item?.type}`}
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
                        options={opt[item?.title] || []}
                        placeholder={`Select ${item?.placeholder}`}
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
                      className="custom-range-picker"
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
            case "search1":
              return (
                <div key={item?.title} className="default-filter-size mb-2">
                  <label className="responsiveLabel">{item?.header}</label>
                  <ReusableMultiInput
                    testId={item?.title}
                    name={`${item?.title.toLowerCase().replaceAll(" ", "")}`}
                    placeholder={"Search"}
                    value={search}
                    isSearch={true}
                    setSearchText={setSearch}
                    autoComplete="off"
                    setPageNumber={setPageNo}
                    id={`${item?.title}-${item?.type}`}
                  />
                </div>
              );
            default:
              return null;
          }
        })}
      </div>

      {showFilter && (
        <div
          id="more-filters"
          name="more-filters"
          className="d-flex justify-content-center align-items-center mt-3"
          style={{ width: "2%" }}
        >
          <MoreFilter
            selectAll={selectAll}
            setSelectAll={setSelectAll}
            activeFilters={activeFilters}
            allFilters={FilterItems}
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
        </div>
      )}
    </div>
  );
};

export default ReusableFilters;
