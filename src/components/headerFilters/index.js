import React, { useState } from "react";
import Select from "react-select";
import { Button } from "react-bootstrap";
import { Badge, DatePicker, Popover } from "antd";
import Image from "next/image";
import styles from "../../pages/physician/report/report.module.css";
import allocateStyle from "../../pages/admin/allocatedUser/allocate/style.module.css";
import Export from "../../images/svg/Export";
import Legends from "../legends";
import DateRangePicker from "../rangepicker";
import Selector from "../selector";
import Search from "../search";
import { handleRnagePicker2 } from "./functions";
import filter from "../../images/svg/filter.svg";
import warning from "../../images/svg/warning.svg";

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
  // for report
  setReceivedStartDate,
  setReceivedEndDate,
  setCoderStartDate,
  setCoderEndDate,

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
  isAnotherPicker2,

  // if has audited date oicker
  pickerlabe4,
  setStartDate4,
  setEndDate4,
  defaultStartDate4,
  defaultEndDate4,
  isAnotherPicker3,

  // conditions to display extra components
  addUser,
  handleExport,
  rowsLength,
  addUserForm,
  selectedRowsId,
  handleOpneModal,
  isAllocate,

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

  // createdTo
  isCreatedBySelector,
  createdTolabel,
  createdByOptoons,
  setSelCreatedBy,
  defaultCreatedBy,

  bullets,
  isNextRow,
  btnTitle,
  badges,
  setIsModalVisible
}) => {
  const [showFilters, setShowFilters] = useState(false);
  return (
    <>
      <div style={{ display: "flex" }}>
        <div className="row filter-contain" style={{ width: "98%" }}>
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
          {selectOptions2 && (
            <div className="col-xl-2">
              <label>{selectlabel2}</label>
              <div class="form-group has-search">
                <Select
                  onChange={(selectedOption) => {
                    setSelectedOption2(selectedOption?.value);
                  }}
                  options={selectOptions2}
                  defaultValue={defaultSelectValue2}
                  className="custom-react-select"
                  isSearchable={false}
                />
              </div>
            </div>
          )}
          {isRangePicker && (
            <div className="col-xl-2">
              <DateRangePicker
                selectedDates={selectedDates}
                pickerlabel={pickerlabel}
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
              />
            </div>
          )}

          {isAnotherPicker && (
            <>
              <div className="col-xl-2">
                <label>{pickerlabe2}</label>
                <div>
                  <RangePicker
                    format="MM-DD-YYYY"
                    value={selectedDates2}
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
                            dayjs(defaultStartDate2, "MM-DD-YYYY"),
                            dayjs(defaultEndDate2, "MM-DD-YYYY"),
                          ]
                        : []
                    }
                  />
                </div>
              </div>
            </>
          )}

          {isNextRow && (
            <div
              className={"col-xl-1"}
              style={{ margin: "30px 0 0 10px", cursor: "pointer" }}
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
                   {badges?.length>0 && badges?.map(data=>(
                    <div style={{marginBottom:"10px"}}> 
                       <Image src={data.src} width={20} height={30}/>
                       <span style={{marginLeft:"5px"}}>{data?.name}</span>
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
          {addUser && (
            <div
              className={`${bullets ? "col-xl-1" : "col-xl-4"}`}
              style={{ marginTop: "20px" }}
            >
              <Button
                onClick={addUserForm}
                className="btn btn-primary btn-sm ms-2 flr width-max-content"
              >
                + {btnTitle}
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
            <div className="col-xl-6  d-flex justify-content-end">
              <div className="row flr mt-3">
                <button
                  onClick={()=>{setIsModalVisible(true)}}
                  className={
                    rowsLength?.length === 0 ? styles.csv : styles.export
                  }
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
      </div>
      {showFilters && (
        <div style={{ marginTop: "50px" }}>
          <div className="row filter-contain">
            {isAllocatedBySelector && (
              <div className="col-xl-2">
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
            {isAllocatedToSelector && (
              <div className="col-xl-2">
                <label>{allocatedTolabel}</label>
                <div class="form-group has-search">
                  <Select
                    onChange={(selectedOption) => {
                      setSelAllocatedTo(selectedOption?.value);
                    }}
                    options={allocatedToOptoons}
                    className="custom-react-select"
                    isSearchable={false}
                    placeholder={defaultAllocateTo}
                  />
                </div>
              </div>
            )}
            {isCreatedBySelector && (
              <div className="col-xl-2">
                <label>{createdTolabel}</label>
                <div class="form-group has-search">
                  <Select
                    onChange={(selectedOption) => {
                      setSelCreatedBy(selectedOption?.value);
                    }}
                    options={createdByOptoons}
                    className="custom-react-select"
                    isSearchable={false}
                    placeholder={defaultCreatedBy}
                  />
                </div>
              </div>
            )}
            {isAnotherPicker2 && (
              <>
                <div className="col-xl-2">
                  <label>{pickerlabe3}</label>
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
                      }}
                    />
                  </div>
                </div>
              </>
            )}
            {isAnotherPicker3 && (
              <>
                <div className="col-xl-2">
                  <label>{pickerlabe4}</label>
                  <div>
                    <RangePicker
                      format="MM-DD-YYYY"
                      onChange={(date, dateString) =>
                        handleRnagePicker2({
                          date,
                          dateString,
                          setStartDate4,
                          setEndDate4,
                        })
                      }
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default HeaderFilters;
