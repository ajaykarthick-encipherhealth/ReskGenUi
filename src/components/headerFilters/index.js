import React, { useState } from "react";
import Select from "react-select";
import { Button } from "react-bootstrap";
import { DatePicker } from "antd";
import visitStyles from "../../styles/visitdata.module.css";
import styles from "../../pages/physician/report/report.module.css";
import allocateStyle from "../../pages/admin/allocatedUser/allocate/style.module.css";
import Export from "../../images/svg/Export";
import Legends from "../legends";
import DateRangePicker from "../rangepicker";
import Selector from "../selector";
import Search from "../search";
import { handleRnagePicker2 } from "./functions";
import { UpCircleOutlined, DownCircleOutlined } from "@ant-design/icons";

const { RangePicker } = DatePicker;
const HeaderFilters = ({
  // for search
  setSearch,
  isSearch,
  searchlabel,

  // for select
  selectlabel,
  isSelector,
  setSelectedOption,
  selectOptions,
  defaultSelectValue1,

  // if has 2 selectors
  selectlabel2,
  defaultSelectValue2,
  selectOptions2,
  setSelectedOption2,

  // for picker
  pickerlabel,
  activeTab,
  selectedDates,
  setSelectedDates,
  defaultStartDate,
  defaultEndDate,
  setStartDate,
  setEndDate,
  isRangePicker,

  // if has 2 pickers
  pickerlabe2,
  setStartDate2,
  setEndDate2,
  selectedDates2,
  defaultStartDate2,
  defaultEndDate2,
  isAnotherPicker,

  // conditions to display extra components
  addUser,
  handleExport,
  rowsLength,
  addUserForm,
  selectedRowsId,
  handleOpneModal,
  isAllocate,

  // allocatedBY
  isAllocatedBySelector,
  allocatedBylabel,
  allocatedByOptoons,
  setSelAllocatedBy,
  defaultAllocatedBy,

  // allocatedTo
  isAllocatedToSelector,
  allocatedTolabel,
  allocatedToOptoons,
  setSelAllocatedTo,
  defaultAllocateTo,

  // createdTo
  isCreatedBySelector,
  createdTolabel,
  createdByOptoons,
  setSelCreatedBy,
  defaultCreatedBy,

  bullets,
  isNextRow,
  btnTitle
}) => {
  const [showFilters, setShowFilters] = useState(false);
  // const bullets = [
  //   {
  //     color: "#FFB54D",
  //     name: "Pending",
  //   },
  //   {
  //     color: "#AD94FA",
  //     name: "Hold",
  //   },
  //   {
  //     color: "#EB5252",
  //     name: "Declined",
  //   },
  //   {
  //     color: "#B4EFBA",
  //     name: "Completed",
  //   },
  // ];
  return (
    <>
      <div style={{ display: "flex" }}>
        <div className="row filter-contain" style={{ width: "98%" }}>
          {isSearch && (
            <div className="col-xl-2">
              {" "}
              <Search searchlabel={searchlabel} setSearch={setSearch} />
            </div>
          )}
          {isSelector ? (
            <div className="col-xl-2" style={{ zIndex: "999" }}>
              {" "}
              <Selector
                selectlabel={selectlabel}
                setSelectedOption={setSelectedOption}
                selectOptions={selectOptions}
                defaultSelectValue1={defaultSelectValue1}
              />
            </div>
          ) : null}
          {selectOptions2 && (
            <div className="col-xl-2">
              <label>{selectlabel2}</label>
              <div class="form-group has-search">
                <Select
                  onChange={(selectedOption) => {
                    setSelectedOption2(selectedOption?.value);
                  }}
                  options={selectOptions2}
                  defaultValue={defaultSelectValue2}
                  className="custom-react-select"
                  isSearchable={false}
                />
              </div>
            </div>
          )}
          {isRangePicker && (
            <div className="col-xl-2">
              <DateRangePicker
                selectedDates={selectedDates}
                pickerlabel={pickerlabel}
                defaultStartDate={defaultStartDate}
                defaultEndDate={defaultEndDate}
                setStartDate={setStartDate}
                setEndDate={setEndDate}
                setSelectedDates={setSelectedDates}
              />
            </div>
          )}

          {isAnotherPicker && (
            <>
              <div className="col-xl-2">
                <label>{pickerlabe2}</label>
                <div>
                  <RangePicker
                    format="MM-DD-YYYY"
                    value={selectedDates2}
                    onChange={(date, dateString) =>
                      handleRnagePicker2({
                        date,
                        dateString,
                        setStartDate2,
                        setEndDate2,
                      })
                    }
                    defaultValue={
                      defaultEndDate2 && defaultStartDate2
                        ? [
                            dayjs(defaultStartDate2, "MM-DD-YYYY"),
                            dayjs(defaultEndDate2, "MM-DD-YYYY"),
                          ]
                        : []
                    }
                  />
                </div>
              </div>
            </>
          )}

          {bullets && (
            <div className={`${bullets ? "col-xl-3" : "col-xl-4"}`}>
              <div
                className={visitStyles.flags_patientsList}
                style={{ margin: "35px 0 0 0px" }}
              >
                <Legends bullets={bullets} />
              </div>
            </div>
          )}
          {addUser && (
            <div
              className={`${bullets ? "col-xl-1" : "col-xl-4"}`}
              style={{ marginTop: "20px" }}
            >
              <Button
                onClick={addUserForm}
                className="btn btn-primary btn-sm ms-2 flr width-max-content"
              >
                + {btnTitle}
              </Button>
            </div>
          )}
          {isAllocate && (
            <div className="col-xl-8 mt-4">
              <button
                onClick={handleOpneModal}
                className={`btn btn-primary btn-sm mx-4 ms-2 flr ${allocateStyle.modalBtn}`}
                disabled={!selectedRowsId.length > 0}
              >
                Allocate
              </button>
            </div>
          )}
          {activeTab === "CoderReport" && (
            <div className="col-xl-8  d-flex justify-content-end">
              <div className="row flr">
                <button
                  onClick={handleExport}
                  className={
                    rowsLength?.length === 0 ? styles.csv : styles.export
                  }
                  disabled={
                    rowsLength?.length > 0 || rowsLength?.data?.length > 0
                      ? false
                      : true
                  }
                >
                  <Export />
                  Export
                </button>
              </div>
            </div>
          )}
        </div>

        {isNextRow && (
          <div
            style={{ width: "2%", margin: "10px 0 0 10px", cursor: "pointer" }}
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? (
              <UpCircleOutlined
                style={{ fontSize: "26px", color: "#888888" }}
              />
            ) : (
              <DownCircleOutlined
                style={{ fontSize: "26px", color: "#888888" }}
              />
            )}
          </div>
        )}
      </div>
      {showFilters && (
        <div style={{ marginTop: "50px" }}>
          <div className="row filter-contain">
            {isAllocatedBySelector && (
              <div className="col-xl-2">
                <label>{allocatedBylabel}</label>
                <div class="form-group has-search">
                  <Select
                    onChange={(selectedOption) => {
                      setSelAllocatedBy(selectedOption?.value);
                    }}
                    options={allocatedByOptoons}
                    className="custom-react-select"
                    isSearchable={false}
                    placeholder={defaultAllocatedBy}
                  />
                </div>
              </div>
            )}
            {isAllocatedToSelector && (
              <div className="col-xl-2">
                <label>{allocatedTolabel}</label>
                <div class="form-group has-search">
                  <Select
                    onChange={(selectedOption) => {
                      setSelAllocatedTo(selectedOption?.value);
                    }}
                    options={allocatedToOptoons}
                    className="custom-react-select"
                    isSearchable={false}
                    placeholder={defaultAllocateTo}
                  />
                </div>
              </div>
            )}
            {isCreatedBySelector && (
              <div className="col-xl-2">
                <label>{createdTolabel}</label>
                <div class="form-group has-search">
                  <Select
                    onChange={(selectedOption) => {
                      setSelCreatedBy(selectedOption?.value);
                    }}
                    options={createdByOptoons}
                    className="custom-react-select"
                    isSearchable={false}
                    placeholder={defaultCreatedBy}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default HeaderFilters;
