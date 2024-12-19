import React, { useEffect, useState } from "react";
import { DatePicker, Popover, Tooltip, Select } from "antd";
import Image from "next/image";
import styles from "../../../../pages/reviewer/report/report.module.css";
import Tracking from "../../tracking/tracking.module.css";
import Legends from "../../../../components/legends";
import {
  disableFutureDate,
} from "../../../../components/headerFilters/functions";
import InputField from "../../../../components/input";
import MoreFilter from "../filters";
import { InfoCircleFilled } from "@ant-design/icons";
import moment from "moment";

const { RangePicker } = DatePicker;

const allFilters = [
  "Reviewer",
  "Supervisor",
  "Allocated Date",
  "Audit Allocated Date",
  "Processed Status",
  "Audit Status",
  "Reviewed Date",
  "Audited Date",
  "Allocated By",
  "Audit Allocated By",
  "Organization",
  "Search By Patient Name / ID",
];

const HeaderFilters = ({
  // for search
  setSearch,
  search,
  selectOptions,
  selectedDates,
  setSelectedDates,
  // allocatedBY
  allocatedByOptoons,
  allocatedToOptoons,
  bullets,
  badges,
  defaultSize = "col-2",
  auditStatusOptions,
  auditAllocatedByOptoons,
  clear,
  setClear,
  setSelectedDateRange,
  auditallocatedToOptoons,
  orgAllList,
  getRoutedData,
  selectedOptions,
  setSelectedOptions,
  activeFilters, setActiveFilters,
  searchTextValue
}) => {
  const [trackInput, setTrackInput] = useState("");
  const [selectAll, setSelectAll] = useState(false);

  const handleClearAllFilters = () => {
    setClear(true);
    getRoutedData("");
    setSearch("");
    setSelectedDates([]);
    setTrackInput(null);
  };

  const getOptions = (name) => {
    switch (name) {
      case "Allocated By":
        return allocatedByOptoons;
      case "Processed Status":
        return selectOptions;
      case "Audit Status":
        return auditStatusOptions;
      case "Organization":
        return orgAllList;
      case "Audit Allocated By":
        return auditAllocatedByOptoons;
      case "Reviewer":
        return allocatedToOptoons;
      case "Supervisor":
        return auditallocatedToOptoons;
      default:
        return [];
    }
  };
  const renderFilter = (filter) => {
    const pickerName = filter?.replace(/\s+/g, "");
    switch (filter) {
      case "Reviewed Date":
      case "Audited Date":
      case "Allocated Date":
      case "Audit Allocated Date":
        return (
          <div className={defaultSize}>
            <label className={styles.label}>{filter}</label>
            <div className="dateRangeSize">
              <RangePicker
                value={
                  clear
                    ? ["", ""]
                    : selectedDates
                    ? selectedDates[pickerName]
                    : []
                }
                format="MM-DD-YYYY"
                onCalendarChange={(val) =>
                  setSelectedDates((prev) => ({
                    ...prev,
                    [pickerName]: val,
                  }))
                }
                onChange={(date, dateString) => {
                  const formattedDates = dateString?.map((date, index) => {
                    const formattedDate =
                      index === 1
                        ? date &&
                          `${moment(date, "MM-DD-YYYY").format(
                            "YYYY-MM-DD"
                          )}T23:59:59.999Z`
                        : date &&
                          `${moment(date, "MM-DD-YYYY").format(
                            "YYYY-MM-DD"
                          )}T00:00:00.000Z`;
                    return formattedDate;
                  });

                  setSelectedDateRange((prevOptions) => ({
                    ...prevOptions,
                    [pickerName]: {
                      startDate: formattedDates[0],
                      endDate: formattedDates[1],
                    },
                  }));

                  setClear(false);
                }}
                disabledDate={(current) => disableFutureDate(current)}
              />
            </div>
          </div>
        );
      case "Allocated By":
      case "Organization":
      case "Audit Allocated By":
      case "Processed Status":
      case "Audit Status":
      case "Reviewer":
      case "Supervisor":
        return (
          <div className={defaultSize}>
            <label className={styles.label}>{filter}</label>
            <div class="form-group has-search custom-react-select">
              <Select
                value={clear ? null : selectedOptions[pickerName]}
                onChange={(selectedOption) => {
                  setSelectedOptions((prevOptions) => ({
                    ...prevOptions,
                    [pickerName]: selectedOption,
                  }));
                  setClear(false);
                }}
                options={getOptions(filter)}
                isSearchable={false}
                placeholder={`Select ${filter}`}
                allowClear={true}
              />
            </div>
          </div>
        );
      case "Search By Patient Name / ID":
        return (
          <div className={defaultSize} onClick={() => setClear(false)}>
            <label style={{ marginLeft: "8px", color: "black" }}>
              {" "}
              Patient Name / ID
            </label>
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

  useEffect(()=>{
    setTrackInput(searchTextValue)
  },[searchTextValue])

  return (
    <div style={{ display: "flex" }}>
      <div className="row filter-contain" style={{ width: "95%" }}>
        {activeFilters?.map((filter) => (
          <React.Fragment key={filter}>{renderFilter(filter)}</React.Fragment>
        ))}
      </div>

      <div
        className={`d-flex justify-content-end ${{ Tracking }}`}
        style={{ width: "5%" }}
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
            getRoutedData={getRoutedData}
            handleClearAllFilters={handleClearAllFilters}
            byDefault={2}
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
