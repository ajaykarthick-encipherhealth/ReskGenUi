import React, { useState } from "react";
import Select from "react-select";
import { DatePicker, Popover } from "antd";
import Image from "next/image";
import dayjs from "dayjs";
import styles from "../../pages/physician/report/report.module.css";
import Legends from "../legends";
import DateRangePicker from "../rangepicker";
import Selector from "../selector";
import Search from "../search";
import { handleRnagePicker2 } from "./functions";
import filter from "../../images/svg/filter.svg";
import warning from "../../images/svg/warning.svg";
import { getFilters } from "../../store/actions/AuthActions";
import { useDispatch } from "react-redux";

const { RangePicker } = DatePicker;
const AuditHeaderFilters = ({
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
  username
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
              />
            </div>
          )}
          {isSelector2 ? (
            <div className="col-xl-2" style={{ zIndex: "999" }}>
              {" "}
              <Selector
                selectlabel={selectlabel2}
                setSelectedOption={setSelectedOption2}
                selectOptions={selectOptions2}
                defaultSelectValue1={defaultSelectValue2}
              />
            </div>
          ) : null}
          {isAduitDueDate && (
            <div className="col-xl-2">
              <DateRangePicker
                selectedDates={""}
                pickerlabel={audipickerlabel1}
                defaultStartDate={audidefaultStartDate}
                defaultEndDate={audidefaultEndDate}
                setStartDate={audisetStartDate}
                setEndDate={audisetEndDate}
              />
            </div>
          )}
          {isAuditCompleteDate && (
            <div className="col-xl-2">
              <DateRangePicker
                selectedDates={""}
                pickerlabel={audipickerlabe2}
                defaultStartDate={audidefaultStartDate2}
                defaultEndDate={audidefaultEndDate2}
                setStartDate={audisetStartDate2}
                setEndDate={audisetEndDate2}
              />
            </div>
          )}
          {isAuditAllocatedBy && (
            <div
              className="col-xl-2"
              style={{zIndex:"999"}}
              onClick={() => {
                dispatch(getFilters("auditAllocatedBy",username));
              }}
            >
              <label>{audiallocatedBylabel}</label>
              <div class="form-group has-search">
                <Select
                  onChange={(selectedOption) => {
                    audisetSelAllocatedBy(selectedOption?.value);
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
              style={{ margin: "30px 0 0 0px", cursor: "pointer" }}
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
              style={{ margin: "30px 0 0 0px", cursor: "pointer" }}
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
      {showFilters && (
        <div style={{ margin: "50px 0px 0px -4px" }}>
          <div className="row filter-contain">
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

            {isRangePicker && (
              <div className="col-xl-2">
                <DateRangePicker
                  selectedDates={selectedDates}
                  pickerlabel={pickerlabel}
                  defaultStartDate={defaultStartDate}
                  defaultEndDate={defaultEndDate}
                  setStartDate={setStartDate}
                  setEndDate={setEndDate}
                />
              </div>
            )}

            {isAnotherPicker && (
              <>
                <div className="col-xl-2">
                  <label>{pickerlabe2}</label>
                  <div>
                    <RangePicker
                      format="YYYY-MM-DD"
                      // value={dayjs(selectedDates2).format('MM-DD-YYYY')}
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
                              dayjs(defaultStartDate2, "YYYY-MM-DD"),
                              dayjs(defaultEndDate2, "YYYY-MM-DD"),
                            ]
                          : []
                      }
                    />
                  </div>
                </div>
              </>
            )}
            {isAllocatedDate && (
              <>
                <div className="col-xl-2">
                  <label>{pickerlabe3}</label>
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
            {isAllocatedBySelector && (
              <div
                className="col-xl-2"
                onClick={() => {
                  dispatch(getFilters("allocatedBy",username));
                }}
              >
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
          </div>
        </div>
      )}
    </>
  );
};

export default AuditHeaderFilters;
