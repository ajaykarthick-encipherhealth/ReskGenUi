import React, { useState } from "react";
import { DatePicker, Popover, Tooltip, Select, Input } from "antd";
import Image from "next/image";
import styles from "../../../../pages/reviewer/report/report.module.css";
// import Tracking from "../../tracking/tracking.module.css";
import Legends from "../../../../components/legends";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPalette,
  faChartSimple,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import {
  disableFutureDate,
  handleRnagePicker2,
  searchFunction,
} from "../../../../components/headerFilters/functions";
import InputField from "../../../../components/input";
import { getFilters } from "../../../../stores/authflow/actions";
// import MoreFilter from "../filters";
import { InfoCircleFilled } from "@ant-design/icons";
import MoreFilter from "../../../tenantAdmin/tracking/filters";
import HeaderFilters from "../../../../components/headerFilters";

const { RangePicker } = DatePicker;

const allFilters = [
  "Select Status",
  "Select Priority",
  "Due Date",
  "Completed Date",
];

const HeaderFiltersPatients = ({
  activeFilters,
  setActiveFilters,
  value,
  onChange,
  disallowedCharacters = [],
  onChangeStatus,
  statusSelectedStatus,
  orgAllList,
  statusSelectedStatus1,
  onChangeStatus1,
  orgAllList1,
  onchangeRangePicker,
  onchangeRangePicker2,
  setSelectedOption,
  selectedDates,
  setSelectedDates,

  // allocatedBY

  setSelAllocatedBy,

  // allocatedTo
  isAllocatedToSelector,

  setSelAllocatedTo,

  bullets,
  badges,

  defaultSize = "col-xl-2",
  setAuditSelAllocatedTo,

  setAuditSelectedOption,

  setSelAuditAllocatedBy,
  clear,
  setClear,

  selectedDates2,

  setSelectedDates2,
  setSelectedDates3,
  setSelectedDates4,
  setSelectedDates5,
}) => {
  const [trackInput, setTrackInput] = useState("");

  const [selectAll, setSelectAll] = useState(false);
  const [popoverVisible, setPopoverVisible] = useState(false);

  const handleClearAllFilters = () => {
    setClear(true);
    setSelectedDates([]);
    setSelectedDates2([]);

    // setStartDate([]);
    // setEndDate([]);
    // setStartDate4([]);
    // setEndDate4([]);
    // setStartDate5([]);
    // setEndDate5([]);
    // setStartDate6([]);
    // setEndDate6([]);
    // setSearch("");
    // setSelectedDates([]);
    // setSelectedDates2([]);
    // setSelectedDates3([]);
    // setSelectedDates4([]);
    // setSelectedDates5([]);
    // setSelAllocatedTo(null);
    // setAuditSelAllocatedTo(null);
    // setSelectedOption(null);
    // setAuditSelectedOption(null);
    // setSelAllocatedBy(null);
    // setSelAuditAllocatedBy(null);
    // setTrackInput(null);
    // setPopoverVisible(false);
  };
  const renderFilter = (filter) => {
    switch (filter) {
      case "Due Date":
        return (
          <div className={defaultSize}>
            <label className={styles.label} style={{ marginTop: "40px" }}>
              Due Date
            </label>
            <div className="dateRangeSize dateRangesHeight">
              <RangePicker
                value={clear ? ["", ""] : selectedDates}
                format="MM-DD-YYYY"
                onChange={onchangeRangePicker}
                onCalendarChange={(val) => setSelectedDates(val)}
                disabledDate={(current) => disableFutureDate(current)}
              />
            </div>
          </div>
        );

      case "Completed Date":
        return (
          <div className={defaultSize}>
            <label className={styles.label} style={{ marginTop: "40px" }}>
              Completed Date
            </label>
            <div className="dateRangeSize dateRangesHeight">
              <RangePicker
                value={clear ? ["", ""] : selectedDates2}
                format="MM-DD-YYYY"
                onChange={onchangeRangePicker2}
                onCalendarChange={(val) => setSelectedDates2(val)}
                disabledDate={(current) => disableFutureDate(current)}
              />
            </div>
          </div>
        );
      case "Select Priority":
        return (
          <div className={defaultSize}>
            <label className={styles.label} style={{ marginTop: "40px" }}>
              Select Priority
            </label>
            <div class="form-group has-search custom-react-selects">
              <Select
                value={clear ? null : statusSelectedStatus1}
                onChange={onChangeStatus1}
                options={orgAllList1}
                isSearchable={false}
                placeholder={"Select Priority"}
                allowClear={true}
              />
            </div>
          </div>
        );
      case "Select Status":
        return (
          <div className={defaultSize}>
            <label className={styles.label} style={{ marginTop: "40px" }}>
              Select Status
            </label>
            <div class="form-group has-search custom-react-selects">
              <Select
                value={clear ? "" : statusSelectedStatus}
                onChange={onChangeStatus}
                options={orgAllList}
                isSearchable={false}
                placeholder={"Select Status"}
                allowClear={true}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const bulletsIcon = [
    {
      title: "Processed Status",
      option: [
        {
          color: "#5da9e4",
          name: "Pending",
        },
        {
          color: "red",
          name: "Declined",
        },
        {
          color: "#3a9b94",
          name: "Completed",
        },
        { color: "#AD94FA", name: "Hold" },
        // {
        //   color: "#3B3486",
        //   name: "ABORTED BY CRON",
        // },
      ],
    },
  ];

  return (
    <div style={{ display: "flex" }}>
      <div className="row filter-contain" style={{ width: "95%" }}>
        {isAllocatedToSelector && (
          <div className={defaultSize} onClick={() => setClear(false)}>
            <label style={{ marginLeft: "8px", marginTop: "40px" }}>
              {" "}
              Patient Name / ID
            </label>
            <div class="form-group has-search">
              <Input
                value={value}
                onChange={onChange}
                className={"w-100 new-search-control border-none"}
                placeholder="Search"
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
          </div>
        )}

        {activeFilters?.map((filter) => (
          <React.Fragment key={filter}>{renderFilter(filter)}</React.Fragment>
        ))}
      </div>

      <div
        // className={Tracking}
        style={{ width: "5%", display: "flex", justifyContent: "end" }}
      >
        <div style={{ marginTop: "30px" }}>
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
          <div style={{ marginLeft: "12px" }}>
            {" "}
            <HeaderFilters bullets={bulletsIcon} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderFiltersPatients;
