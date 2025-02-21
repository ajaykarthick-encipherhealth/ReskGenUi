import React, { useCallback, useState } from "react";
import { DatePicker, Popover, Input, Select, Tooltip } from "antd";
import Image from "next/image";
import dayjs from "dayjs";
import warning from "../../../../images/svg/warning.svg";
import styles from "../../../reviewer/report/report.module.css";
import Legends from "../../../../components/legends";
import DateRangePicker from "../../../../components/rangepicker";
import Selector from "../../../../components/selector";
import {
  disableFutureDate,
  handleRnagePicker2,
  priorityOptions,
  resetPageNumber,
} from "../../../../components/headerFilters/functions";
import { debounce, disallowedCharacters } from "../../../../components/input";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import { InfoCircleFilled } from "@ant-design/icons";
import MoreFilter from "../../../tenantadmin/tracking/filters";
import { disabledDate } from "../../../../utils/reusable";

const { RangePicker } = DatePicker;

export const allFilters = [
  "Audit Due Date",
  "Audit Completed Date",
  "Audited AllocatedBy",
  "Reviewed Status",
  "Due Date",
  "Completed Date",
  "Priority",
];
const HeaderFilters = ({
  setSearchVal,
  searchVal,
  searchlabel,
  setSearchTextValue,

  // for select
  selectlabel,
  isSelector,
  setSelectedOption,
  selectOptions,
  defaultSelectValue1,
  selectDefaultValue,

  // if has 2 selectors
  isSelector2,
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

  // if has allocated date picker
  pickerlabe3,
  defaultStartDate3,
  defaultEndDate3,
  setStartDate3,
  setEndDate3,
  isAllocatedDate,

  // allocatedBY
  isAllocatedBySelector,
  allocatedBylabel,
  allocatedByOptoons,
  setSelAllocatedBy,
  defaultAllocatedBy,
  selAuditAllocatedBy,

  //   auditallocated by
  audidefaultAllocatedBy,
  isAuditAllocatedBy,
  audiallocatedBylabel,
  audisetSelAllocatedBy,
  auditallocatedByOptions,

  //   audit duedate
  audipickerlabel1,
  audidefaultStartDate,
  audidefaultEndDate,
  audisetStartDate,
  audisetEndDate,
  isAduitDueDate,
  setSelectedAuditDueDates,
  selectedAuditDueDates,
  selectedAuditDates,
  setSelectedAuditDates,
  setSelectedDueDates,
  selectedDueDates,

  // audit complete date
  isAuditCompleteDate,
  audipickerlabe2,
  audidefaultStartDate2,
  audidefaultEndDate2,
  audisetStartDate2,
  audisetEndDate2,
  bullets,
  isNextRow,
  badges,
  username,
  setPageNo,
  bulletsTitle,
  badgesTitle,
  selectedDates4,
  setSelectedDates4,
  setSelectedDates2,
  selectedOption,
  selAuditAllocatedByVal,
  setSelAuditAllocatedByVal,
  setClear,
  clear,
  activeFilters,
  setActiveFilters,
  getRoutedData,
  selectedPriority,
  setSelectedPriority
}) => {
  const router = useRouter();
  // const [activeFilters, setActiveFilters] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [popoverVisible, setPopoverVisible] = useState(false);
  const debounceText = useCallback(
    debounce((val) => {
      return setSearchTextValue(val);
    }, 900),
    []
  );
  const getNameSearch = async (e) => {
    setSearchVal(e.target.value);
    debounceText(e.target.value);
    resetPageNumber(setPageNo);
  };
  const handleClearAllFilters = () => {
    setClear(true);
    getRoutedData("");
    setStartDate([]);
    setEndDate([]);
    setSelectedDates([]);
    setSelectedDates2([]);
    setSelectedOption(null);
    setPopoverVisible(false);
    setSearchVal("");
    setStartDate2([]);
    setEndDate2([]);
    setSelectedDates4("");
    setSelectedDueDates("");
    setSelAuditAllocatedByVal("")
    audisetSelAllocatedBy("")
  };

  const renderFilter = (filter) => {
    switch (filter) {
      case "Audit Due Date":
        return (
          <div className="default-filter-size">
            <DateRangePicker
              pickerlabel={audipickerlabel1}
              defaultStartDate={audidefaultStartDate}
              defaultEndDate={audidefaultEndDate}
              setStartDate={audisetStartDate}
              setEndDate={audisetEndDate}
              disabled={true}
              selectedDates={selectedDates}
              setSelectedDates={setSelectedDates}
              setPageNo={setPageNo}
            />
          </div>
        );
      case "Audit Completed Date":
        return (
          <div className="default-filter-size">
            <DateRangePicker
              pickerlabel={audipickerlabe2}
              defaultStartDate={audidefaultStartDate2}
              defaultEndDate={audidefaultEndDate2}
              setStartDate={audisetStartDate2}
              setEndDate={audisetEndDate2}
              selectedDates={selectedDates2}
              setSelectedDates={setSelectedDates2}
              setPageNo={setPageNo}
            />
          </div>
        );
      case "Priority":
        return (
          <div className="default-filter-size">
            <label className="responsiveLabel">Priority</label>
            <div class="form-group has-search custom-react-select-audit">
              <Select
                onChange={(selectedOption) => {
                  setSelectedPriority(selectedOption ? selectedOption : []);
                  if (setPageNo) {
                    resetPageNumber(setPageNo);
                  }
                }}
                options={priorityOptions}
                value={selectedPriority}
                className="custom-react-select-audit w-100"
                isSearchable={false}
                placeholder={"Select Priority"}
                allowClear={true}
              />
            </div>
          </div>
        );
      case "Audited AllocatedBy":
        return (
          <div className="default-filter-size">
            <label className="responsiveLabel">{audiallocatedBylabel}</label>
            <div class="form-group has-search custom-react-select-audit">
              <Select
                onChange={(selectedOption) => {
                  audisetSelAllocatedBy(selectedOption ? selectedOption : null);
                  setSelAuditAllocatedByVal(
                    selectedOption ? selectedOption :null
                  );
                  if (setPageNo) {
                    resetPageNumber(setPageNo);
                  }
                    setClear(false);
                  getRoutedData(null);
                }}
                options={auditallocatedByOptions}
                value={selAuditAllocatedByVal?selAuditAllocatedByVal:null}
                className="custom-react-select-audit w-100"
                isSearchable={false}
                placeholder={audidefaultAllocatedBy}
                allowClear={true}
              />
            </div>
          </div>
        );
      case "Reviewed Status":
        return (
          <div className="default-filter-size">
            <Selector
              selectlabel={selectlabel}
              setSelectedOption={setSelectedOption}
              selectOptions={selectOptions}
              defaultSelectValue1={defaultSelectValue1}
              setPageNo={setPageNo}
              selectDefaultValue={selectedOption}
            />
          </div>
        );
      case "Due Date":
        return (
          <div className="default-filter-size">
            <DateRangePicker
              pickerlabel={pickerlabel}
              defaultStartDate={defaultStartDate}
              defaultEndDate={defaultEndDate}
              setStartDate={setStartDate}
              setEndDate={setEndDate}
              // disabled="pastDate"
              selectedDates={selectedDueDates}
              setSelectedDates={setSelectedDueDates}
              disabled={true}
              setPageNo={setPageNo}
            />
          </div>
        );
      case "Completed Date":
        return (
          <div className="default-filter-size">
            <label className="responsiveLabel">{pickerlabe2}</label>
            <div>
              <RangePicker
                format="MM-DD-YYYY"
                value={selectedDates4}
                onCalendarChange={(val) => setSelectedDates4(val)}
                onChange={(date, dateString) => {
                  handleRnagePicker2({
                    date,
                    dateString,
                    setStartDate2,
                    setEndDate2,
                  });
                  setClear(false);
                  if (setPageNo) {
                    resetPageNumber(setPageNo);
                  }
                }}
                defaultValue={
                  defaultEndDate2 && defaultStartDate2
                    ? [
                        dayjs(defaultStartDate2, "YYYY-MM-DD"),
                        dayjs(defaultEndDate2, "YYYY-MM-DD"),
                      ]
                    : []
                }
                // disabledDate={(current) => disableFutureDate(current)}
                disabledDate={(currentDate) =>
                  disabledDate(currentDate, selectedDates4)
                }
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className="d-flex justify-content-start "
      style={{ marginLeft: "22px" }}
    >
      <div className="row " style={{ width: "98%" }}>
        <div className="default-filter-size">
          <label className="responsiveLabel">{searchlabel}</label>
          <Input
            value={searchVal}
            onChange={(e) => getNameSearch(e)}
            className={"w-100 new-search border-none"}
            placeholder={"Search"}
            maxLength={25}
            onKeyDown={(e) => {
              if (disallowedCharacters.includes(e.key)) {
                e.preventDefault();
              }
            }}
            prefix={
              <FontAwesomeIcon className="searchPrefix" icon={faSearch} />
            }
            allowClear={true}
          />
        </div>

        {activeFilters?.map((filter) => (
          <React.Fragment key={filter}>{renderFilter(filter)}</React.Fragment>
        ))}
      </div>
      <div className="mt-4">
        <MoreFilter
          selectAll={selectAll}
          setSelectAll={setSelectAll}
          allFilters={allFilters}
          setClear={setClear}
          setActiveFilters={setActiveFilters}
          handleClearAllFilters={handleClearAllFilters}
          activeFilters={activeFilters}
          getRoutedData={getRoutedData}
        />
      </div>
    </div>
  );
};

export default HeaderFilters;
