import React, { useState } from "react";
import { Button, DatePicker, Input, Select, Space } from "antd";
import ReusableInput from "./reusableInput";
import MoreFilter from "../../pages/tenantadmin/tracking/filters";
import { useRef } from "react";
import {
  createIdGen,
  disabledDate,
  formatDateForIndex,
  generateOptions,
  generateOptionsObject,
} from "../../utils/reusable";
import { useRouter } from "next/router";
import CustomizableDrawer from "../customizeDrawer";
import ReusableIntegerInput from "./reusableInput/integerInput";
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
  setSelectedRows,
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
  showGenerateReport,
  selectedRows,
  setIsModalOpen,
  //btn
  btnName
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
    setSearch(null);
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
    setSearch(null);
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
    <div className="d-flex  w-100">
      <div className="row " style={{ width: showFilter ? "98%" : "auto" }}>
        {FilterItems?.filter((item) => item?.active).map((item) => {
          switch (item?.filter?.style) {
            case "SEARCH":
              return (
                <div
                  key={item?.headerName}
                  className="default-filter-size mb-2"
                >
                  <label className="responsiveLabel">{item?.headerName}</label>
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
                    placeholder={`Search ${item?.headerName}`}
                    value={searchText ? searchText[item?.actualField] : ""}
                    isSearch={true}
                    setSearchText={(val) => {
                      setSearchText((prev) => ({
                        ...prev,
                        [item?.actualField]: val,
                      }));
                      setPageNo(1);
                    }}
                    autoComplete="off"
                    setPageNumber={setPageNo}
                  />
                </div>
              );
            case "DROP_DOWN":
              return (
                <div
                  key={item?.headerName}
                  className="default-filter-size mb-2"
                >
                  <label className="responsiveLabel">{item?.headerName}</label>
                  <div>
                    <div
                      id={
                        id
                          ? createIdGen("parentSelect " + id)
                          : createIdGen(
                              "parentSelect" +
                                item?.headerName +
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
                                  item?.headerName +
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
                        options={
                          item?.filter?.nameOptions
                            ? generateOptionsObject(item?.filter?.nameOptions)
                            : generateOptions(item?.filter?.options) || []
                        }
                        placeholder={`Select ${item?.headerName}`}
                        value={selectedOption?.[item?.actualField] || null}
                        onChange={(value) => {
                          setSelectedOption((prevOptions) => ({
                            ...prevOptions,
                            [item?.actualField]: value,
                          }));
                          setPageNo && setPageNo(0);
                        }}
                        allowClear
                      />
                    </div>
                  </div>
                </div>
              );
            case "DATE":
              return (
                <div
                  key={item?.headerName}
                  className="default-filter-size mb-2"
                >
                  <label className="responsiveLabel">{item?.headerName}</label>
                  <div
                    id={
                      id
                        ? createIdGen("parentPicker " + id)
                        : createIdGen(
                            "parentPicker" +
                              item?.headerName +
                              router.pathname.replaceAll("/", " ")
                          )
                    }
                  >
                    <RangePicker
                      ref={(node) => {
                        if (node) pickerRefs.current[item?.actualField] = node;
                      }}
                      className="custom-range-picker"
                      data-testid={
                        id
                          ? createIdGen("picker " + id)
                          : createIdGen(
                              "picker" +
                                item?.headerName +
                                router.pathname.replaceAll("/", " ")
                            )
                      }
                      format="MM-DD-YYYY"
                      value={selectedDates?.[item?.actualField]}
                      // onCalendarChange={(val) => {
                      //   setSelectedDates((prev) => ({
                      //     ...prev,
                      //     [item?.actualField]: val,
                      //   }));
                      // }}
                      onChange={(date, dateString) => {
                        if (!date || date.length === 0) {
                          handleFocusPicker(item?.actualField);
                        }
                        handleRangePicker(date, dateString, item?.actualField);
                      }}
                      allowClear={true}
                      disabledDate={(currentDate) =>
                        disabledDate(
                          currentDate,
                          selectedDates?.[item?.actualField],
                          item?.actualField === "coder1DueDate" ||
                            item?.actualField == "coder2DueDate" ||
                            item?.actualField == "qaDueDate" ||
                            item?.actualField == "downloaderDueDate" ||
                            item?.actualField == "ownerDueDate"
                        )
                      }
                      inputReadOnly
                    />
                  </div>
                </div>
              );
            case "SEARCH_INT":
              return (
                <div key={item?.title} className="default-filter-size mb-2">
                  <label className="responsiveLabel">{item?.headerName}</label>
                  <ReusableIntegerInput
                    id={
                      id
                        ? createIdGen("integerInputParent " + id)
                        : createIdGen(
                            "integerInputParent" +
                              item?.title +
                              router.pathname.replaceAll("/", " ")
                          )
                    }
                    testId={
                      id
                        ? createIdGen("integerInput " + id)
                        : createIdGen(
                            "integerInput" +
                              item?.title +
                              router.pathname.replaceAll("/", " ")
                          )
                    }
                    placeholder={`Search ${item?.headerName}`}
                    value={search ? search[item?.actualField] : ""}
                    isSearch={true}
                    setSearchText={(val) => {
                      setSearch((prev) => ({
                        ...prev,
                        [item?.actualField]: val,
                      }));
                      setPageNo(1);
                      setSelectedRows([]);
                    }}
                    autoComplete="off"
                    setPageNumber={setPageNo}
                  />
                </div>
              );
            default:
              return null;
          }
        })}
      </div>
      <div className="d-flex " style={{ alignContent: "flex-end" }}>
        {showFilter && columns?.length != 0 && activeFilters?.length ? (
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
        ) : (
          ""
        )}
        {showCustomizeTable && (
          <>
            <div
              id="addPatient-btn"
              name="addPatient-btn"
              className="d-flex justify-content-center align-items-center   mt-4"
            >
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
                Table Customization
              </Button>
            </div>
          </>
        )}
        {showGenerateReport && (
          <>
            <div
              id="addPatient-btn"
              name="addPatient-btn"
              className="d-flex justify-content-center align-items-center   mt-4"
            >
              <Button
                data-testid="table-custom"
                name="table-custom"
                onClick={() => {
                  setIsModalOpen(true);
                }}
                style={{
                  background: "#04306f",
                  color: "#fff",
                  width: "100%",
                  fontSize: "12px",
                  marginLeft: "10px",
                }}
                className="btn btn-sm w-full text-ellipsis"
                disabled={selectedRows?.length == 0 ? true : false}
              >
                {btnName}
                {/* Generate Report */}
              </Button>
            </div>
          </>
        )}
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
            setSearchText={setSearchText}
            setSelectedDateRanges={setSelectedDateRanges}
            setSelectedDates={setSelectedDates}
            setSelectedOption={setSelectedOption}
            setSearch={setSearch}
          />
        </div>
      </div>
    </div>
  );
};

export default ReusableFilters;
