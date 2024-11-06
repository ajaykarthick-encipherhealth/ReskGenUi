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
  resetPageNumber,
} from "../../../../components/headerFilters/functions";
import { debounce, disallowedCharacters } from "../../../../components/input";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import { InfoCircleFilled } from "@ant-design/icons";
import MoreFilter from "../../../tenantAdmin/tracking/filters";

const { RangePicker } = DatePicker;

const allFilters = [
  "Audit Due Date",
  "Audit Completed Date",
  "Audited AllocatedBy",
  "Reviewed Status",
  "Due Date",
  "Completed Date",
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
}) => {
  const router = useRouter();
  // const [activeFilters, setActiveFilters] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [popoverVisible, setPopoverVisible] = useState(false);
  const debounceText = useCallback(
    debounce((val) => {
      return setSearchTextValue(val);
    }, 700),
    []
  );
  const getNameSearch = async (e) => {
    setSearchVal(e.target.value);
    debounceText(e.target.value);
    resetPageNumber(setPageNo);
  };
  const handleClearAllFilters = () => {
    setClear(true);
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
  };

  const renderFilter = (filter) => {
    switch (filter) {
      case "Audit Due Date":
        return (
          <div className="col-xl-2 col-md-4">
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
          <div className="col-xl-2 col-md-4">
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

      case "Audited AllocatedBy":
        return (
          <div className="col-xl-2 col-md-4">
            <label className={styles.label}>{audiallocatedBylabel}</label>
            <div class="form-group has-search custom-react-select-audit">
              <Select
                onChange={(selectedOption) => {
                  audisetSelAllocatedBy(selectedOption ? selectedOption : "");
                  setSelAuditAllocatedByVal(selectedOption?.label);
                  if (setPageNo) {
                    resetPageNumber(setPageNo);
                  }
                }}
                options={auditallocatedByOptions}
                value={selAuditAllocatedByVal ? selAuditAllocatedBy : null}
                className="custom-react-select-audit"
                isSearchable={false}
                placeholder={audidefaultAllocatedBy}
                allowClear={true}
              />
            </div>
          </div>
        );
      case "Reviewed Status":
        return (
          <div className="col-xl-2 col-md-4">
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
          <div className="col-xl-2 col-md-4">
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
          <div className="col-xl-2 col-md-4">
            <label className={styles.label}>{pickerlabe2}</label>
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
                disabledDate={(current) => disableFutureDate(current)}
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="d-flex">
           <div className={`row filter-contain ${styles.mainDiv}`}>
        <div className="col-xl-2 col-md-4">
          <label style={{ marginLeft: "8px" }} className="responsiveLabel">
            {searchlabel}
          </label>
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
      <div
        className={`d-flex justify-content-end  align-items-center `}
        style={{ width: "10%" ,flexDirection: "column" }}
      >
        <MoreFilter
          selectAll={selectAll}
          setSelectAll={setSelectAll}
          allFilters={allFilters}
          setClear={setClear}
          setActiveFilters={setActiveFilters}
          handleClearAllFilters={handleClearAllFilters}
          activeFilters={activeFilters}
        />
        <Popover
          content={
            <>
              {bulletsTitle && (
                <label className={styles.label} style={{ fontWeight: "700" }}>
                  {bulletsTitle}
                </label>
              )}
              <Legends
                bullets={bullets}
                display="block"
                padding="0 0px 10px 0"
              />
              {badgesTitle && (
                <label className={styles.label} style={{ fontWeight: "700" }}>
                  {badgesTitle}
                </label>
              )}
              <Legends
                bullets={badges}
                display="block"
                padding="0 0px 10px 0"
              />
            </>
          }
          trigger={["click"]}
          placement="bottom"
        >
         
        </Popover>
        <div className=" cursor-pointer">
        <div className={styles.iconBorder}>
                    <InfoCircleFilled />
                  </div>
          </div>
      </div>
    </div>
  );
};

export default HeaderFilters;
