import React, { useState } from "react";
import Select from "react-select";
import { Button } from "react-bootstrap";
import { Badge, DatePicker, Popover } from "antd";
import Image from "next/image";
import dayjs from "dayjs";
import styles from "../../../../pages/physician/report/report.module.css";
import allocateStyle from "../../../../pages/admin/allocatedUser/allocate/style.module.css";
import Export from "../../../../images/svg/Export";
import Selector from "../../../../components/selector";
import Search from "../../../../components/search";
import filter from "../../../../images/svg/filter.svg";
import warning from "../../../../images/svg/warning.svg";
import { useDispatch } from "react-redux";
import Legends from "../../../../components/legends";
import DateRangePicker from "../../../../components/rangepicker";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { InputText } from "primereact/inputtext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  disableFutureDate,
  handleRnagePicker2,
  searchFunction,
} from "../../../../components/headerFilters/functions";
import { getFilters } from "../../../../store/actions/AuthActions";

const { RangePicker } = DatePicker;
const HeaderFilters = ({
  // for search
  setSearch,
  isSearch,
  searchlabel,
  searchValue,
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

  // if has audited date oicker
  pickerlabe4,
  setStartDate4,
  setEndDate4,

  // if has audited allocated date oicker
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
}) => {
  const dispatch = useDispatch();
  const [showFilters, setShowFilters] = useState(defaultShow);
 
  return (
    <>
      <div style={{ display: "flex" }}>
        <div className="row filter-contain" style={{ width: "100%" }}>
          {isAllocatedToSelector && (
            <div
              className={defaultSize}
              style={{ zIndex: tracking && "2" }}
              onClick={() => {
                dispatch(getFilters("patientAllocated"));
              }}
            >
              <label className={styles.label}>Reviewer</label>
              <div class="form-group has-search">
                <Select
                  value={clear ? "" : selectorValue}
                  onChange={(selectedOption) => {
                    setSelAllocatedTo(selectedOption);
                    setClear(false);
                  }}
                  options={allocatedToOptoons}
                  className="custom-react-select"
                  isSearchable={false}
                  // placeholder={defaultAllocateTo}
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
              <div class="form-group has-search">
                <Select
                  value={clear ? "" : selector2Value}
                  onChange={(selectedOption) => {
                    setAuditSelAllocatedTo(selectedOption);
                    setClear(false);
                  }}
                  options={auditAllocatedToOptoons}
                  className="custom-react-select"
                  isSearchable={false}
                  placeholder={defaultAllocateTo}
                />
              </div>
            </div>
          )}

          <div className={defaultSize}>
            <label className={styles.label}>{pickerlabe4}</label>
            <div>
              <RangePicker
                value={clear ? "" : selectedDates}
                format="YYYY-MM-DD"
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

          {isAnotherPicker5 && (
            <>
              <div className={defaultSize}>
                <label className={styles.label}>{pickerlabe5}</label>
                <div>
                  <RangePicker
                    value={clear ? ["", ""] : selectedDates2}
                    format="YYYY-MM-DD"
                    onCalendarChange={(val) => setSelectedDates2(val)}
                    onChange={(date, dateString) => {
                      handleRnagePicker2({
                        date,
                        dateString,
                        setStartDate5,
                        setEndDate5,
                      });

                      setClear(false);
                    }}
                    disabledDate={(current) => disableFutureDate(current)}
                  />
                </div>
              </div>
            </>
          )}

          {isAnotherPicker2 && (
            <>
              <div className={defaultSize}>
                <label className={styles.label}>{pickerlabe3}</label>
                <div>
                  <RangePicker
                    value={clear ? ["", ""] : selectedDates3}
                    format="YYYY-MM-DD"
                    onCalendarChange={(val) => setSelectedDates3(val)}
                    onChange={(date, dateString) => {
                      handleRnagePicker2({
                        date,
                        dateString,
                        setStartDate3,
                        setEndDate3,
                      });

                      setClear(false);
                    }}
                  />
                </div>
              </div>
            </>
          )}

          {selectOptions2 && (
            <div className={defaultSize}>
              <label className={styles.label}>{selectlabel2}</label>
              <div class="form-group has-search">
                <Select
                  value={clear ? "" : selector3Value}
                  onChange={(selectedOption) => {
                    setSelectedOption2(selectedOption);
                    setClear(false);
                  }}
                  options={selectOptions2}
                  placeholder={defaultSelectValue2?.label}
                  className="custom-react-select"
                  isSearchable={false}
                />
              </div>
            </div>
          )}

          {isSelector ? (
            <div className={defaultSize}>
              <label className={styles.label}>Processed Status</label>
              <div class="form-group has-search">
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
              {/* <Selector
                selectlabel={"Processed Status"}
                setSelectedOption={setSelectedOption}
                selectOptions={selectOptions}
                defaultSelectValue1={defaultSelectValue1}
                selectorValue={clear?"":selector4value}
                setClear={setClear}
              /> */}
            </div>
          ) : null}

          {isSelector ? (
            <div className={defaultSize}>
              {" "}
              <label className={styles.label}>Audit Status</label>
              <div class="form-group has-search">
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
              {/* <Selector
                selectlabel={"Audit Status"}
                setSelectedOption={setAuditSelectedOption}
                selectOptions={auditStatusOptions}
                defaultSelectValue1={defaultSelectValue1}
                selectorValue={clear ? "" : selector5value}
                setClear={setClear}
              /> */}
            </div>
          ) : null}
        </div>
      </div>
      {showFilters && (
        <div style={{ marginTop: "50px" }}>
          <div className="row filter-contain">
            {isRangePicker && (
              <div className={defaultSize}>
                <label className={styles.label}>{"Reviewer Due Date"}</label>
                <div>
                  <RangePicker
                    value={clear ? ["", ""] : selectedDates4}
                    format="YYYY-MM-DD"
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
                {/* <DateRangePicker
                  selectedDates={clear ? "" : selectedDates}
                  pickerlabel={"Reviewer Due Date"}
                  defaultStartDate={defaultStartDate}
                  defaultEndDate={defaultEndDate}
                  setStartDate={setStartDate}
                  setEndDate={setEndDate}
                  activeTab={activeTab}
                  setSelectedDates={setSelectedDates}
                  setReceivedStartDate={setReceivedStartDate}
                  setReceivedEndDate={setReceivedEndDate}
                  setCoderStartDate={setCoderStartDate}
                  setCoderEndDate={setCoderEndDate}
                  disabled={disable != "Yes" && true}
                /> */}
              </div>
            )}

            {isAnotherPicker && (
              <>
                <div className={defaultSize}>
                  <label className={styles.label}>
                    {"Supervisor Due Date"}
                  </label>
                  <div>
                    <RangePicker
                      value={clear ? ["", ""] : selectedDates5}
                      format="YYYY-MM-DD"
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
              </>
            )}
            {isAllocatedBySelector && (
              <div
                className={defaultSize}
                onClick={() => {
                  dispatch(
                    getFilters(selectorField ? selectorField : "allocatedBy")
                  );
                }}
              >
                <label className={styles.label}>{allocatedBylabel}</label>
                <div class="form-group has-search">
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
            )}

            {isSelector ? (
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
            ) : null}

            {isSearch && (
              <div className={defaultSize}>
                {" "}
                <label style={{ marginLeft: "8px" }}>{searchlabel}</label>
                <div class="form-group has-search">
                  <FontAwesomeIcon
                    className="fa fa-search form-control-feedback"
                    icon={faSearch}
                  />
                  <InputText
                    type="text"
                    value={clear ? "" : searchValue}
                    onChange={(e) => {
                      searchFunction(
                        e,
                        setSearch,
                        setSentSearch,
                        setReceivedSearch,
                        setCoderSearch,
                        activeTab
                      );
                      setClear(false);
                    }}
                    className="form-control new-form-control"
                    placeholder="Search"
                  />
                </div>
                {/* <Search
                  searchlabel={searchlabel}
                  setSearch={setSearch}
                  activeTab={activeTab}
                  setSentSearch={setSentSearch}
                  setReceivedSearch={setReceivedSearch}
                  setCoderSearch={setCoderSearch}
                  searchValue={clear ? "" : searchValue}
                  setClear={setClear}
                /> */}
              </div>
            )}
            <div className={`${bullets ? "col-xl-2" : "col-xl-4"}`}>
              {bullets && (
                <div
                  // className={`${bullets ? "col-xl-1" : "col-xl-4"}`}
                  style={{ margin: "30px 0 0 10px", cursor: "pointer" }}
                >
                  <Popover
                    content={
                      <>
                        <Legends
                          bullets={bullets}
                          display="block"
                          padding="0 0px 10px 0"
                        />
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
                    <Image src={warning} />
                  </Popover>
                </div>
              )}
              <div
                style={{ margin: "-35px 0px 0 40px", cursor: "pointer" }}
                onClick={() => {
                  setClear(true);
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
                }}
              >
                <button className={`${styles.filterBtn} mx-3`}>clear</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HeaderFilters;
