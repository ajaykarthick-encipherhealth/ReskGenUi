import React, { useState } from "react";
import Select from "react-select";
import { DatePicker, Popover, Tooltip } from "antd";
import Image from "next/image";
import styles from "../../../../pages/reviewer/report/report.module.css";
import Tracking from "../../tracking/tracking.module.css";
import { useDispatch } from "react-redux";
import Legends from "../../../../components/legends";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPalette,faChartSimple } from "@fortawesome/free-solid-svg-icons";
import {
  disableFutureDate,
  handleRnagePicker2,
  searchFunction,
} from "../../../../components/headerFilters/functions";
import InputField from "../../../../components/input";
import { getFilters } from "../../../../stores/authflow/actions";
import MoreFilter from "../filters";
import { InfoCircleFilled } from "@ant-design/icons";

const { RangePicker } = DatePicker;

const allFilters = [
  "Allocated Date",
  "Audit Allocated Date",
  "Processed Status",
  "Audit Status",
  "Reviewed Date",
  "Audited Date",
  "Allocated By",
  "Audit Allocated By",
  "Select Organization",
  "Search By Patient Name / ID",
];

const HeaderFilters = ({
  // for search
  setSearch,
  isSearch,
  searchlabel,
  searchValue,
  search,
  // for report
  setSentSearch,
  setReceivedSearch,
  setCoderSearch,

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
  disabled,
  // for report
  setReceivedStartDate,
  setReceivedEndDate,
  setCoderStartDate,
  setCoderEndDate,

  // if has 2 pickers
  isAnotherPicker,

  // if has allocated date picker
  pickerlabe3,
  setStartDate3,
  setEndDate3,
  isAnotherPicker2,

  // if has audited date picker
  pickerlabe4,
  setStartDate4,
  setEndDate4,

  // if has audited allocated date picker
  pickerlabe5,
  setStartDate5,
  setEndDate5,
  isAnotherPicker5,

  setStartDate6,
  setEndDate6,
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
  bullets,
  badges,
  disable,
  tracking,
  selectorField,
  defaultShow = false,
  defaultSize = "col-xl-2",
  setAuditSelAllocatedTo,
  isAuditAllocatedToSelector,
  auditAllocatedToOptoons,
  auditStatusOptions,
  setAuditSelectedOption,
  auditAllocatedByOptoons,
  setSelAuditAllocatedBy,
  clear,
  setClear,
  selectorValue,
  selector2Value,
  selector3Value,
  selector4value,
  selector5value,
  selector6value,
  selector7value,
  selectedDates2,
  selectedDates3,
  selectedDates4,
  selectedDates5,
  setSelectedDates2,
  setSelectedDates3,
  setSelectedDates4,
  setSelectedDates5,
  auditallocatedToOptoons,
  auditSelAllocatedTo,
  selectOrgList,
  orgAllList,
  setSelectedOrgList,
}) => {
  const dispatch = useDispatch();
  const [trackInput, setTrackInput] = useState("");
  const [activeFilters, setActiveFilters] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [popoverVisible, setPopoverVisible] = useState(false);

  const handleClearAllFilters = () => {
    setClear(true);
    setStartDate([]);
    setEndDate([]);
    setStartDate4([]);
    setEndDate4([]);
    setStartDate5([]);
    setEndDate5([]);
    setStartDate6([]);
    setEndDate6([]);
    setSearch("");
    setSelectedDates([]);
    setSelectedDates2([]);
    setSelectedDates3([]);
    setSelectedDates4([]);
    setSelectedDates5([]);
    setSelAllocatedTo("");
    setAuditSelAllocatedTo("");
    setSelectedOption("");
    setAuditSelectedOption("");
    setSelAllocatedBy("");
    setSelAuditAllocatedBy("");
    setTrackInput("");
    setPopoverVisible(false);
  };
  const renderFilter = (filter) => {
    switch (filter) {
      case "Processed Status":
        return (
          <div className={defaultSize}>
            <label className={styles.label}>Processed Status</label>
            <div className="form-group has-search">
              <Select
                value={clear ? "" : selector4value}
                onChange={(selectedOption) => {
                  setSelectedOption(selectedOption);
                  setClear(false);
                }}
                options={selectOptions}
                className="custom-react-select"
                isSearchable={false}
              />
            </div>
          </div>
        );
      case "Audit Status":
        return (
          <div className={defaultSize}>
            <label className={styles.label}>Audit Status</label>
            <div className="form-group has-search">
              <Select
                value={clear ? "" : selector5value}
                onChange={(selectedOption) => {
                  setAuditSelectedOption(selectedOption);
                  setClear(false);
                }}
                options={auditStatusOptions}
                className="custom-react-select"
                isSearchable={false}
              />
            </div>
          </div>
        );
      case "Reviewed Date":
        return (
          <div className={defaultSize}>
            <label className={styles.label}>Reviewed Date</label>
            <div className="dateRangeSize">
              <RangePicker
                value={clear ? ["", ""] : selectedDates4}
                format="MM-DD-YYYY"
                onCalendarChange={(val) => setSelectedDates4(val)}
                onChange={(date, dateString) => {
                  handleRnagePicker2({
                    date,
                    dateString,
                    setStartDate,
                    setEndDate,
                  });
                  setClear(false);
                }}
              />
            </div>
          </div>
        );
      case "Audited Date":
        return (
          <div className={defaultSize}>
            <label className={styles.label}>Audited Date</label>
            <div className="dateRangeSize">
              <RangePicker
                value={clear ? ["", ""] : selectedDates5}
                format="MM-DD-YYYY"
                onCalendarChange={(val) => setSelectedDates5(val)}
                onChange={(date, dateString) => {
                  handleRnagePicker2({
                    date,
                    dateString,
                    setStartDate6,
                    setEndDate6,
                  });
                  setClear(false);
                }}
              />
            </div>
          </div>
        );
      case "Allocated By":
        return (
          <div
            className={defaultSize}
            onClick={() => {
              dispatch(
                getFilters(selectorField ? selectorField : "allocatedBy")
              );
            }}
          >
            <label className={styles.label}>Allocated By</label>
            <div className="form-group has-search">
              <Select
                value={clear ? "" : selector6value}
                onChange={(selectedOption) => {
                  setSelAllocatedBy(selectedOption);
                  setClear(false);
                }}
                options={allocatedByOptoons}
                className="custom-react-select"
                isSearchable={false}
                placeholder={defaultAllocatedBy}
              />
            </div>
          </div>
        );
      case "Select Organization":
        return (
          <div
            className={defaultSize}
            onClick={() => {
              dispatch(getFilters("organization"));
            }}
          >
            <label className={styles.label}>Select Organization</label>
            <div className="form-group has-search">
              <Select
                value={clear ? "" : selectOrgList}
                onChange={(selectedOption) => {
                  setSelectedOrgList(selectedOption);
                  setClear(false);
                }}
                options={orgAllList}
                className="custom-react-select-tenant"
                isSearchable={false}
                placeholder={defaultAllocatedBy}
              />
            </div>
          </div>
        );
      case "Allocated Date":
        return (
          <div className={defaultSize}>
            <label className={styles.label}> Allocated Date</label>
            <div className="dateRangeSize">
              <RangePicker
                value={clear ? "" : selectedDates3}
                format="MM-DD-YYYY"
                onCalendarChange={(val) => setSelectedDates3(val)}
                onChange={(date, dateString) => {
                  handleRnagePicker2({
                    date,
                    dateString,
                    setStartDate4,
                    setEndDate4,
                  });

                  setClear(false);
                }}
              />
            </div>
          </div>
        );

      case "Audit Allocated Date":
        return (
          <div className={defaultSize}>
            <label className={styles.label}>Audit Allocated Date</label>
            <div className="dateRangeSize">
              <RangePicker
                value={clear ? "" : selectedDates}
                format="MM-DD-YYYY"
                onCalendarChange={(val) => setSelectedDates(val)}
                onChange={(date, dateString) => {
                  handleRnagePicker2({
                    date,
                    dateString,
                    setStartDate4,
                    setEndDate4,
                  });

                  setClear(false);
                }}
                disabledDate={(current) => disableFutureDate(current)}
                onCalendarClose={() => {
                  setSelectedDates([]);
                }}
              />
            </div>
          </div>
        );
      case "Audit Allocated By":
        return (
          <div
            className={defaultSize}
            onClick={() => {
              dispatch(getFilters("auditAllocatedBy"));
            }}
          >
            <label className={styles.label}>{"Audit Allocated By"}</label>
            <div class="form-group has-search">
              <Select
                value={clear ? "" : selector7value}
                onChange={(selectedOption) => {
                  setSelAuditAllocatedBy(selectedOption);
                  setClear(false);
                }}
                options={auditAllocatedByOptoons}
                className="custom-react-select"
                isSearchable={false}
                placeholder={defaultAllocatedBy}
              />
            </div>
          </div>
        );
      case "Search By Patient Name / ID":
        return (
          <div className={defaultSize} onClick={() => setClear(false)}>
            <label style={{ marginLeft: "8px" }}> Patient Name / ID</label>
            <div class="form-group has-search">
              <InputField
                isSearch={true}
                placeholder="Search"
                inputValue={search}
                setInputValue={setSearch}
                delay={1000}
                type="text"
                isDisabled={false}
                isInputFiled={false}
                isTracking={true}
                trackInput={trackInput}
                setTrackInput={setTrackInput}
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <div className="row filter-contain" style={{ width: "95%" }}>
        {isAllocatedToSelector && (
          <div
            className={defaultSize}
            style={{ zIndex: tracking && "2" }}
            onClick={() => {
              dispatch(getFilters("patientAllocated"));
            }}
          >
            <label className={styles.label}>Reviewer</label>
            <div className="form-group has-search">
              <Select
                value={selectorValue ? selectorValue : ""}
                onChange={(selectedOption) => {
                  setClear(false);
                  setSelAllocatedTo(selectedOption);
                }}
                options={allocatedToOptoons}
                className="custom-react-select"
                isSearchable={false}
              />
            </div>
          </div>
        )}

        {isAuditAllocatedToSelector && (
          <div
            className={defaultSize}
            style={{ zIndex: tracking && "2" }}
            onClick={() => {
              dispatch(getFilters("auditedAssigned"));
            }}
          >
            <label className={styles.label}>Supervisor</label>
            <div className="form-group has-search">
              <Select
                value={auditSelAllocatedTo ? auditSelAllocatedTo : ""}
                onChange={(selectedOption) => {
                  setClear(false);
                  setAuditSelAllocatedTo(selectedOption);
                }}
                options={auditallocatedToOptoons}
                className="custom-react-select"
                isSearchable={false}
              />
            </div>
          </div>
        )}

        {activeFilters.map((filter) => (
          <React.Fragment key={filter}>{renderFilter(filter)}</React.Fragment>
        ))}
      </div>

      <div
        className={Tracking}
        style={{ width: "5%", display: "flex", justifyContent: "end" }}
      >
        <div>
          <MoreFilter
            clear={clear}
            activeFilters={activeFilters}
            setActiveFilters={setActiveFilters}
            allFilters={allFilters}
            selectAll={selectAll}
            setSelectAll={setSelectAll}
            setClear={setClear}
            handleClearAllFilters={handleClearAllFilters}
          />

          {bullets && (
            <div style={{ cursor: "pointer" }}>
              <Popover
                content={
                  <>
                    <Legends bullets={bullets} display="block" />
                    {badges?.length > 0 &&
                      badges?.map((data) => (
                        <div style={{ marginBottom: "10px" }}>
                          <Image src={data.src} width={20} height={30} />
                          <span style={{ marginLeft: "5px" }}>
                            {data?.name}
                          </span>
                        </div>
                      ))}
                  </>
                }
                trigger={["click"]}
                placement="bottom"
              >
                <Tooltip title="Click here for status information.">
                  <div className={Tracking.iconBorder}>
                    <InfoCircleFilled />
                  </div>
                </Tooltip>
              </Popover>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeaderFilters;
