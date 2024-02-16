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
import {
  disableFutureDate,
  handleRnagePicker2,
} from "../../../../components/headerFilters/functions";
import { getFilters } from "../../../../store/actions/AuthActions";

const { RangePicker } = DatePicker;
const HeaderFilters = ({
  // for search
  setSearch,
  isSearch,
  searchlabel,
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
  setSelAuditAllocatedBy
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
                  onChange={(selectedOption) => {
                    setSelAllocatedTo(selectedOption?.value);
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
                  onChange={(selectedOption) => {
                    setAuditSelAllocatedTo(selectedOption?.value);
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
                    format="YYYY-MM-DD"
                    onChange={(date, dateString) =>
                      handleRnagePicker2({
                        date,
                        dateString,
                        setStartDate4,
                        setEndDate4,
                      })
                    }
                    disabledDate={(current) => disableFutureDate(current)}
                  />
                </div>
              </div>


          {isAnotherPicker5 && (
            <>
              <div className={defaultSize}>
                <label className={styles.label}>{pickerlabe5}</label>
                <div>
                  <RangePicker
                    format="YYYY-MM-DD"
                    onChange={(date, dateString) =>
                      handleRnagePicker2({
                        date,
                        dateString,
                        setStartDate5,
                        setEndDate5,
                      })
                    }
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
                    format="YYYY-MM-DD"
                    onChange={(date, dateString) => {
                      handleRnagePicker2({
                        date,
                        dateString,
                        setStartDate3,
                        setEndDate3,
                      });
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
                  onChange={(selectedOption) => {
                    setSelectedOption2(selectedOption?.value);
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
              {" "}
              <Selector
                selectlabel={"Processed Status"}
                setSelectedOption={setSelectedOption}
                selectOptions={selectOptions}
                defaultSelectValue1={defaultSelectValue1}
              />
            </div>
          ) : null}

          {isSelector ? (
            <div className={defaultSize}>
              {" "}
              <Selector
                selectlabel={"Audit Status"}
                setSelectedOption={setAuditSelectedOption}
                selectOptions={auditStatusOptions}
                defaultSelectValue1={defaultSelectValue1}
              />
            </div>
          ) : null}
        </div>
      </div>
      {showFilters && (
        <div style={{ marginTop: "50px" }}>
          <div className="row filter-contain">
            {isRangePicker && (
              <div className={defaultSize}>
                <DateRangePicker
                  selectedDates={selectedDates}
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
                />
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
                      format="YYYY-MM-DD"
                      onChange={(date, dateString) => {
                        handleRnagePicker2({
                          date,
                          dateString,
                          setStartDate6,
                          setEndDate6,
                        });
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

            {isSelector ? (
               <div
               className={defaultSize}
               onClick={() => {
                 dispatch(
                   getFilters('auditAllocatedBy')
                 );
               }}
             >
               <label className={styles.label}>{"Audit Allocated By"}</label>
               <div class="form-group has-search">
                 <Select
                   onChange={(selectedOption) => {
                    setSelAuditAllocatedBy(selectedOption?.value);
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
                <Search
                  searchlabel={searchlabel}
                  setSearch={setSearch}
                  activeTab={activeTab}
                  setSentSearch={setSentSearch}
                  setReceivedSearch={setReceivedSearch}
                  setCoderSearch={setCoderSearch}
                />
              </div>
            )}
            {bullets && (
              <div
                className={`${bullets ? "col-xl-1" : "col-xl-4"}`}
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
          </div>
        </div>
      )}
    </>
  );
};

export default HeaderFilters;
