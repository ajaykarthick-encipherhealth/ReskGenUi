import React from "react";
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

const { RangePicker } = DatePicker;
const HeaderFilters = ({
  selectlabel,
  searchlabel,
  pickerlabel,
  handleSearch,
  activeTab,
  onSelectChange,
  selectOptions,
  handleDatePickerChange,
  handleReceivedDatePicker,
  handleCoderPicker,
  selectedDates,
  isSelector,
  filteratedDashboardData,
  handleDatePickerChange2,
  addUser,
  handleExport,
  rowsLength,
  addUserForm,
  defaultSelectValue1,
  defaultSelectValue2,
  selectOptions2,
  onSelectChange2,
  selectlabel2,
  isbullets,
  selectedRowsId,
  handleOpneModal,
  isAllocate,
  isSearch,
  // bullets
}) => {
  const bullets = [
    {
      color: "#FFB54D",
      name: "Pending",
    },
    {
      color: "#AD94FA",
      name: "Hold",
    },
    {
      color: "#EB5252",
      name: "Declined",
    },
    {
      color: "#B4EFBA",
      name: "Completed",
    },
  ];
  return (
    <div className="row filter-contain">
      {isSearch && (
        <div className="col-xl-2">
          {" "}
          <Search searchlabel={searchlabel} handleSearch={handleSearch} />
        </div>
      )}
      {isSelector ? (
        <div className="col-xl-2">
          {" "}
          <Selector
            selectlabel={selectlabel}
            onSelectChange={onSelectChange}
            selectOptions={selectOptions}
            filteratedDashboardData={filteratedDashboardData}
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
                onSelectChange2(selectedOption);
              }}
              options={selectOptions2}
              defaultValue={defaultSelectValue2}
              className="custom-react-select"
              isSearchable={false}
            />
          </div>
        </div>
      )}
      <div className="col-xl-2">
        <DateRangePicker
          selectedDates={selectedDates}
          activeTab={activeTab}
          pickerlabel={pickerlabel}
          handleDatePickerChange={handleDatePickerChange}
          handleReceivedDatePicker={handleReceivedDatePicker}
          handleCoderPicker={handleCoderPicker}
          filteratedDashboardData={filteratedDashboardData}
        />
      </div>

      {handleDatePickerChange2 && (
        <>
          <div className="col-xl-2">
            <label>Completed Date</label>
            <div>
              <RangePicker
                format="MM-DD-YYYY"
                onChange={(dates, dateStrings) => {
                  handleDatePickerChange2(dateStrings);
                }}
              />
            </div>
          </div>

          <div className={`${isbullets ? "col-xl-4" : "col-xl-4"}`}>
            <div
              className={visitStyles.flags_patientsList}
              style={{ margin: "35px 0 0 20px" }}
            >
              <Legends bullets={bullets} />
            </div>
          </div>
        </>
      )}

      {addUser && (
        <div className={`${isbullets ? "col-xl-2" : "col-xl-6"}`}>
          <Button
            onClick={addUserForm}
            className="btn btn-primary btn-sm ms-2 flr"
          >
            + Add User
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
              className={rowsLength?.length === 0 ? styles.csv : styles.export}
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
  );
};

export default HeaderFilters;
