import React, { useState } from "react";
import { Button, DatePicker, Input, Select, Space } from "antd";
import moment from "moment";
import ReusableInput from "./reusableInput";
import MoreFilter from "../../pages/tenantadmin/tracking/filters";
import { useRef } from "react";
import {
  createIdGen,
  disabledDate,
  formatDateForIndex,
} from "../../utils/reusable";
import ReusableMultiInput from "./reusableInput/multiple";
import { useRouter } from "next/router";
import CustomizableDrawer from "../customizeDrawer";
import RegularButton from "../button";
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
  //batchCount
  batchCount,
  setBatchCount,
  setFilterBatchCount,
  setSelectAllChecked,
  setSelectedRowsId,
  getAllReviewerALlocation,
  setSelectedRows,
  showBatchCount,
  selectedRowsId,
  //filters
  showFilter,
  opt,
  id,
  search,
  setSearch,
  columns,
  open,
  onClose,
  selectedColumns,
  setSelectedColumns,
  handleInsert,
  showCustomizeTable,
  showDrawer,
  handleSubmit,
  handleReset,
  isSubmitting,
  isResetting,
}) => {
  const pickerRefs = useRef({});
  const router = useRouter();

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
      prevFilters.map((filter) => ({ ...filter, active: true }))
    );
    setSelectedDateRanges({});
    setSelectedDates([]);
    setSelectedOption({});
    setSearchText(null);
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

  const handleInputChange = (e) => {
    let inputValue = e.target.value.replace(/[^\d]/g, "");
    if (inputValue.length > 5) {
      inputValue = inputValue.slice(0, 5);
    }
    setBatchCount(inputValue);
    if (inputValue.length <= 0) {
      setFilterBatchCount(true);
      setSelectAllChecked(false);
      setSelectedRowsId([]);
      getAllReviewerALlocation();
      setSelectedRows([]);
      setBatchCount("");
    } else {
      setFilterBatchCount(true);
    }
  };

  const handleSelectClick = () => {
    setFilterBatchCount(true);
    setPageNo(0);
    if (batchCount != selectedRowsId.length) {
      setSelectAllChecked(false);
      setSelectedRowsId([]);
      setSelectedRows([]);
    }
    getAllReviewerALlocation();
  };
  return (
    <div className="d-flex gap-5">
      <div className="row" style={{ width: showFilter ? "98%" : "auto" }}>
        {FilterItems?.filter((item) => item?.active).map((item) => {
          switch (item?.type) {
            case "search":
              return (
                <div key={item?.title} className="default-filter-size mb-2">
                  <label className="responsiveLabel">{item?.header}</label>
                  <ReusableInput
                    id={
                      id
                        ? createIdGen("parent " + id)
                        : createIdGen(
                            "parent" +
                              item?.title +
                              router.pathname.replaceAll("/", " ")
                          )
                    }
                    testId={
                      id
                        ? createIdGen("input " + id)
                        : createIdGen(
                            "input" +
                              item?.title +
                              router.pathname.replaceAll("/", " ")
                          )
                    }
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
                      id={
                        id
                          ? createIdGen("parentSelect " + id)
                          : createIdGen(
                              "parentSelect" +
                                item?.title +
                                router.pathname.replaceAll("/", " ")
                            )
                      }
                      className="form-group has-search custom-react-select-audit customClear"
                    >
                      <Select
                        data-testid={
                          id
                            ? createIdGen("select " + id)
                            : createIdGen(
                                "select " +
                                  item?.title +
                                  router.pathname.replaceAll("/", " ")
                              )
                        }
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
                    id={
                      id
                        ? createIdGen("parentPicker " + id)
                        : createIdGen(
                            "parentPicker" +
                              item?.title +
                              router.pathname.replaceAll("/", " ")
                          )
                    }
                  >
                    <RangePicker
                      ref={(node) => {
                        if (node) pickerRefs.current[item?.title] = node;
                      }}
                      className="custom-range-picker"
                      data-testid={
                        id
                          ? createIdGen("picker " + id)
                          : createIdGen(
                              "picker" +
                                item?.title +
                                router.pathname.replaceAll("/", " ")
                            )
                      }
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
                    id={
                      id
                        ? createIdGen("multipleInputParent " + id)
                        : createIdGen(
                            "multipleInputParent" +
                              item?.title +
                              router.pathname.replaceAll("/", " ")
                          )
                    }
                    testId={
                      id
                        ? createIdGen("multipleinput " + id)
                        : createIdGen(
                            "multipleinput" +
                              item?.title +
                              router.pathname.replaceAll("/", " ")
                          )
                    }
                    placeholder={"Search"}
                    value={search}
                    isSearch={true}
                    setSearchText={setSearch}
                    autoComplete="off"
                    setPageNumber={setPageNo}
                  />
                </div>
              );
            default:
              return null;
          }
        })}
        {showBatchCount && (
          <div className="default-filter-size mb-2">
            <label className="responsiveLabel">Batch Count</label>
            <Space.Compact id="batch-count" name="batch-count">
              <div style={{ width: "250px" }} className="batchInput">
                <Input
                  data-testid="batchCount"
                  name="batchCount"
                  type="number"
                  onChange={handleInputChange}
                  value={batchCount}
                  placeholder="Batch Count"
                  onKeyDown={(e) => {
                    if (e.key === "\\") {
                      e.preventDefault();
                    }
                  }}
                  className="batch-form-control"
                />

                <button
                  id="select-btn"
                  name="select-btn"
                  onClick={handleSelectClick}
                  style={{ borderRadius: "0px 10px 10px 0px" }}
                  className="btn btn-outline-secondary py-0 px-2 select-count"
                >
                  Select
                </button>
              </div>
            </Space.Compact>
          </div>
        )}
      </div>
      <div className="d-flex " style={{ alignContent: "flex-end" }}>
        {showFilter && (
          <div
            id="more-filters"
            name="more-filters"
            className="d-flex justify-content-center align-items-center "
          >
            <MoreFilter
              selectAll={selectAll}
              setSelectAll={setSelectAll}
              activeFilters={activeFilters}
              FilterItems={FilterItems}
              setActiveFilters={setActiveFilters}
              setClear={setClear}
              handleClearAllFilters={handleClearAllFilters}
              handleClearFilters={handleClearFilters}
              getRoutedData={getRoutedData}
              addUser={addUser}
              addUserForm={addUserForm}
              btnTitle={btnTitle}
              form={form}
              columns={columns}
            />
          </div>
        )}
        {showCustomizeTable && (
          <>
            <div
              id="addPatient-btn"
              name="addPatient-btn"
              className="d-flex justify-content-center align-items-center   mt-4"
            >
              {/* <RegularButton name={"Table Customize"} onClick={showDrawer} /> */}
              <Button
                data-testid="table-custom"
                name="table-custom"
                onClick={showDrawer}
                style={{
                  background: "#04306f",
                  color: "#fff",
                  width: "100%",
                  fontSize: "12px",
                  marginLeft: "10px",
                }}
                className="btn btn-sm w-full text-ellipsis"
              >
                Table Customize
              </Button>
            </div>
            <div>
              <CustomizableDrawer
                open={open}
                onClose={onClose}
                selectedColumns={selectedColumns}
                setSelectedColumns={setSelectedColumns}
                handleInsert={handleInsert}
                setActiveFilters={setActiveFilters}
                handleSubmit={handleSubmit}
                handleReset={handleReset}
                isSubmitting={isSubmitting}
                isResetting={isResetting}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReusableFilters;
