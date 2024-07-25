import React, { useState } from "react";
import Select from "react-select";
import { DatePicker, Popover } from "antd";
import Image from "next/image";
import dayjs from "dayjs";
import styles from "../../pages/reviewer/report/report.module.css";
import Legends from "../legends";
import DateRangePicker from "../rangepicker";
import Selector from "../selector";
import Search from "../search";
import { disableFutureDate, handleRnagePicker2, resetPageNumber } from "./functions";
import filter from "../../images/svg/filter.svg";
import warning from "../../images/svg/warning.svg";
import { useDispatch } from "react-redux";
import { getFilters } from "../../stores/authflow/actions";

const { RangePicker } = DatePicker;
const AuditHeaderFilters = ({
  // for search
  setSearch,
  isSearch,
  searchlabel,
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
  badgesTitle
}) => {
  const dispatch = useDispatch();
  const [showFilters, setShowFilters] = useState(false);
  return (
    <>
      <div style={{ display: "flex" }}>
        <div className="row filter-contain" style={{ width: "100%" }}>
          {isSearch && (
            <div className="col-xl-2">
              {" "}
              <Search
                searchlabel={searchlabel}
                setSearch={setSearch}
                activeTab={activeTab}
                setSentSearch={setSentSearch}
                setReceivedSearch={setReceivedSearch}
                setCoderSearch={setCoderSearch}
                search={search}
                setPageNo={setPageNo}
              />
            </div>
          )}
          {isSelector2 ? (
            <div className="col-xl-2">
              {" "}
              <Selector
                selectlabel={selectlabel2}
                setSelectedOption={setSelectedOption2}
                selectOptions={selectOptions2}
                defaultSelectValue1={defaultSelectValue2}
                setPageNo={setPageNo}
              />
            </div>
          ) : null}
          {isAduitDueDate && (
            <div className="col-xl-2">
              <DateRangePicker
                pickerlabel={audipickerlabel1}
                defaultStartDate={audidefaultStartDate}
                defaultEndDate={audidefaultEndDate}
                setStartDate={audisetStartDate}
                setEndDate={audisetEndDate}
                disabled={true}
                selectedDates={selectedAuditDueDates}
                setSelectedDates={setSelectedAuditDueDates}
                setPageNo={setPageNo}
              />
            </div>
          )}
          {isAuditCompleteDate && (
            <div className="col-xl-2">
              <DateRangePicker
                pickerlabel={audipickerlabe2}
                defaultStartDate={audidefaultStartDate2}
                defaultEndDate={audidefaultEndDate2}
                setStartDate={audisetStartDate2}
                setEndDate={audisetEndDate2}
                selectedDates={selectedAuditDates}
                setSelectedDates={setSelectedAuditDates}
                setPageNo={setPageNo}
              />
            </div>
          )}
          {isAuditAllocatedBy && (
            <div
              className="col-xl-2"
              // onClick={() => {
              //   dispatch(getFilters("auditAllocatedBy", username));
              // }}
            >
              <label className={styles.label}>{audiallocatedBylabel}</label>
              <div class="form-group has-search">
                <Select
                  onChange={(selectedOption) => {
                    audisetSelAllocatedBy(selectedOption?.value);
                    if(setPageNo){
                      resetPageNumber(setPageNo)
                    }
                  }}
                  options={auditallocatedByOptions}
                  className="custom-react-select"
                  isSearchable={false}
                  placeholder={audidefaultAllocatedBy}
                />
              </div>
            </div>
          )}
          {isNextRow && (
            <div
              className={"col-xl-1"}
              style={{
                margin: "30px 0 0 0px",
                cursor: "pointer",
                width: "107px",
              }}
              onClick={() => setShowFilters(!showFilters)}
            >
              <button className={styles.filterBtn}>
                <Image src={filter} /> {showFilters ? "Hide" : "Filter"}
              </button>
            </div>
          )}
          {bullets && (
            <div
              className={`${bullets ? "col-xl-1" : "col-xl-4"}`}
              style={{ margin: "30px 0 0 20px", cursor: "pointer" }}
            >
              <Popover
                content={
                  <>
                  {bulletsTitle && <label className={styles.label} style={{fontWeight:"700"}}>{bulletsTitle}</label>}
                    <Legends
                      bullets={bullets}
                      display="block"
                      padding="0 0px 10px 0"
                    />
                    {badgesTitle && <label className={styles.label} style={{fontWeight:"700"}}>{badgesTitle}</label>}
                    <Legends
                      bullets={badges}
                      display="block"
                      padding="0 0px 10px 0"
                    />
                    {/* {badges?.length > 0 &&
                      badges?.map((data) => (
                        <div style={{ marginBottom: "10px" }}>
                          <Image src={data.src} width={20} height={30} />
                          <span style={{ marginLeft: "5px" }}>
                            {data?.name}
                          </span>
                        </div>
                      ))} */}
                  </>
                }
                trigger={["click"]}
                placement="bottom"
              >
                <Image src={warning} />
              </Popover>
            </div>
          )}
        </div>
      </div>
      {showFilters && (
        <div style={{ margin: "50px 0px 0px -4px" }}>
          <div className="row filter-contain">
            {isSelector ? (
              <div className="col-xl-2">
                {" "}
                <Selector
                  selectlabel={selectlabel}
                  setSelectedOption={setSelectedOption}
                  selectOptions={selectOptions}
                  defaultSelectValue1={defaultSelectValue1}
                  setPageNo={setPageNo}
                />
              </div>
            ) : null}

            {isRangePicker && (
              <div className="col-xl-2">
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
            )}

            {isAnotherPicker && (
              <>
                <div className="col-xl-2">
                  <label className={styles.label}>{pickerlabe2}</label>
                  <div>
                    <RangePicker
                      format="MM-DD-YYYY"
                      // value={dayjs(selectedDates2).format('MM-DD-YYYY')}
                      onChange={(date, dateString) =>{
                        handleRnagePicker2({
                          date,
                          dateString,
                          setStartDate2,
                          setEndDate2,
                        })
                        if(setPageNo){
                          resetPageNumber(setPageNo)
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
              </>
            )}
            {isAllocatedDate && (
              <>
                <div className="col-xl-2">
                  <label className={styles.label}>{pickerlabe3}</label>
                  <div>
                    <RangePicker
                      format="MM-DD-YYYY"
                      onChange={(date, dateString) => {
                        handleRnagePicker2({
                          date,
                          dateString,
                          setStartDate3,
                          setEndDate3,
                        });
                        if(setPageNo){
                          resetPageNumber(setPageNo)
                        }
                      }}
                      disabledDate={(current) => disableFutureDate(current)}
                    />
                  </div>
                </div>
              </>
            )}
            {isAllocatedBySelector && (
              <div
                className="col-xl-2"
                // onClick={() => {
                //   dispatch(getFilters("allocatedBy", username));
                // }}
                style={{ zIndex: "2" }}
              >
                <label className={styles.label}>{allocatedBylabel}</label>
                <div class="form-group has-search">
                  <Select
                    onChange={(selectedOption) => {
                      setSelAllocatedBy(selectedOption?.value);
                      if(setPageNo){
                        resetPageNumber(setPageNo)
                      }
                    }}
                    options={allocatedByOptoons}
                    className="custom-react-select"
                    isSearchable={false}
                    placeholder={defaultAllocatedBy}
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

export default AuditHeaderFilters;
