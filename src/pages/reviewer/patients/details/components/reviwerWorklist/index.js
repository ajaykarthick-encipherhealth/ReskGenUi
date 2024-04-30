import React, { useState, useEffect } from "react";
import { Tooltip, DatePicker } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faSearch } from "@fortawesome/free-solid-svg-icons";
import { InputText } from "primereact/inputtext";
import { Paginator } from "primereact/paginator";
import moment from "moment";
import { patientListFilter } from "../../../../../../services/PatientsListSevice";
import visitStyles from "../../../../../../styles/visitdata.module.css";
import LoadingSpinner from "../../../../../../components/loadingSpinner";
import { SVGICON } from "../../../../../../jsx/constant/theme";
import { disableFutureDate } from "../../../../../../components/headerFilters/functions";

const ReviwerWorkList = ({ localUserId, setWorkListPatientId }) => {
  const { RangePicker } = DatePicker;
  const [showIcons, setShowIcons] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [openPicker, setOpenPicker] = useState(false);
  const [openPicker2, setOpenPicker2] = useState(false);
  const [patientList, setPatientList] = useState([]);
  const [processedStatus, setProcessedStatus] = useState("");
  const [searchtext, setSearchtext] = useState("");
  const [dueDateStart, setDueDateStart] = useState("");
  const [dueDateEnd, setDueDateEnd] = useState("");
  const [processedStart, setProcessedStart] = useState("");
  const [processedEnd, setProcessedEnd] = useState("");
  const [pageNo, setPageNo] = useState(0);
  const [paginationFirst, setPaginationFirst] = useState(0);
  const [totalElements, setTotalElements] = useState(10);
  const [filterDataLoading, setFilterDataLoading] = useState(true);

  const getWorkList = async () => {
    var result = await patientListFilter(
      localUserId,
      processedStatus,
      searchtext,
      dueDateStart,
      dueDateEnd,
      processedStart,
      processedEnd,
      pageNo
    );
    setOpenPicker(false);
    setOpenPicker2(false);
    setPatientList(result?.response?.patientDTOList?.content);
    setTotalElements(result?.response?.patientDTOList?.totalElements);
    setFilterDataLoading(false);
  };

  const filterChangePatientId = async (e) => {
    setSearchtext(e.target.value);
  };
  const onPageChange = async (e) => {
    setPaginationFirst(e.first);
    setPageNo(e.page);
  };

  const handleFilterClick = () => {
    setShowIcons(!showIcons);
  };
  const closeFilterIcons = async () => {
    setShowIcons(false);
    setOpenPicker(false);
    setOpenPicker2(false);
    var result = await patientListFilter(
      localUserId,
      "",
      "",
      "",
      "",
      "",
      "",
      0
    );
    setPatientList(result?.response?.patientDTOList?.content);
    setTotalElements(result?.response?.patientDTOList?.totalElements);
  };
  const handleShowCard = () => {
    setShowCard(!showCard);
    setShowCard(true);
  };

  const getPatientListToDetails = (id) => {
    setWorkListPatientId(id);
  };

  const handleDatePickerChange = async (dateString) => {
    let convertStartDate =
      moment(dateString[0]).format("YYYY-MM-DD") + "T00:00:00.000Z";
    let convertEndDate =
      moment.utc(dateString[1]).format("YYYY-MM-DD") + "T23:59:59.000Z";
    setDueDateStart(convertStartDate);
    setDueDateEnd(convertEndDate);
    setOpenPicker(false);
  };

  const handleChangeprocessedDate = async (dateString) => {
    let convertStartDate =
      moment(dateString[0]).format("YYYY-MM-DD") + "T00:00:00.000Z";
    let convertEndDate =
      moment.utc(dateString[1]).format("YYYY-MM-DD") + "T23:59:59.000Z";
    setProcessedStart(convertStartDate);
    setProcessedEnd(convertEndDate);
    setOpenPicker2(false);
  };
  const getFiltePatientListStatus = async (value) => {
    if (value == "ALL") {
      value = "";
    }
    setProcessedStatus(value);
    setOpenPicker(false);
    setOpenPicker2(false);
  };

  const statuses = ["ALL","PENDING", "COMPLETED", "HOLD", "DECLINED"];

  useEffect(() => {
    getWorkList();
  }, [
    processedStatus,
    searchtext,
    dueDateStart,
    dueDateEnd,
    processedStart,
    processedEnd,
    pageNo,
  ]);

  return (
    <>
      <div className={`row ${visitStyles.patientListHead}`}>
        <div
          className={visitStyles.flags}
          style={{ marginTop: "15px", marginBottom: "20px" }}
        >
          <div className={visitStyles.flags}>
            <span
              className={visitStyles.completed}
              style={{ background: "#3a9b94 !important" }}
            ></span>
            <span className={visitStyles.flagCodes}>Completed</span>
          </div>
          <div className={visitStyles.flags}>
            <span className={visitStyles.pending}></span>
            <span className={visitStyles.flagCodes}>Pending</span>
          </div>
          <div className={visitStyles.flags}>
            <span className={visitStyles.hold}></span>
            <span className={visitStyles.flagCodes}>Hold</span>
          </div>
          <div className={visitStyles.flags}>
            <span className={visitStyles.declined}></span>
            <span className={visitStyles.flagCodes}>Declined</span>
          </div>
        </div>
        <div className="col-xl-9">
          <div class="form-group has-search">
            <FontAwesomeIcon
              className="fa fa-search form-control-feedback"
              icon={faSearch}
            />
            <InputText
              type="text"
              onChange={(e) => filterChangePatientId(e)}
              className="form-control new-form-control"
              placeholder="Search"
              maxLength={25}
              onKeyDown={(e) => {
                // Prevent input of backslash ("\")
                if (e.key === "\\") {
                  e.preventDefault();
                }
              }}
            />
            <RangePicker
              open={openPicker}
              onChange={(dates, dateStrings) => {
                handleDatePickerChange(dateStrings);
              }}
              suffixIcon={false}
              className={visitStyles.datepicker}
              disabledDate={(current) => disableFutureDate(current)}
            />
            <RangePicker
              open={openPicker2}
              onChange={(dates, dateStrings) => {
                handleChangeprocessedDate(dateStrings);
              }}
              suffixIcon={false}
              className={visitStyles.datepicker}
              disabledDate={(current) => disableFutureDate(current)}
            />
          </div>
        </div>

        <div className="col-xl-3">
          <div className={visitStyles.content}>
            <span
              className={visitStyles.circleCard}
              onClick={handleFilterClick}
            >
              <span></span>
              {showIcons ? (
                <FontAwesomeIcon
                  icon={faClose}
                  height={30}
                  width={30}
                  color="#A20404"
                  onClick={() => {
                    closeFilterIcons(false);
                    setOpenPicker(false);
                    setOpenPicker2(false);
                  }}
                />
              ) : (
                SVGICON.filter
              )}
            </span>
            {showIcons && (
              <div className={visitStyles.iconContainer}>
                <Tooltip title="Status" placement="left">
                  <span
                    className={visitStyles.circleCard}
                    onClick={handleShowCard}
                  >
                    {SVGICON.dashboard}
                  </span>
                </Tooltip>
                <Tooltip title="Due Date" placement="left">
                  <span
                    className={visitStyles.circleCard}
                    onClick={() => {
                      setOpenPicker(!openPicker);
                      setOpenPicker2(false);
                    }}
                  >
                    {SVGICON.dateIcon}
                  </span>
                </Tooltip>
                <Tooltip title="Completed Date" placement="left">
                  <span
                    className={visitStyles.circleCard}
                    onClick={() => {
                      setOpenPicker2(!openPicker2);
                      setOpenPicker(false);
                    }}
                  >
                    {SVGICON.dateIcon}
                  </span>
                </Tooltip>
              </div>
            )}
            {showCard && (
              <div
                className={visitStyles.menuCard}
                onMouseEnter={() => setShowCard(true)}
                onMouseLeave={() => setShowCard(false)}
              >
                <ul>
                  {statuses.map((status, index) => (
                    <li
                      onClick={() => getFiltePatientListStatus(status)}
                      className={visitStyles.nameList}
                      key={index}
                    >
                      {status}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        {!filterDataLoading ? (
          <>
            <div className={visitStyles.patientListHead}>
              <ul className={`${visitStyles.patientDetailsHead}`}>
                {patientList?.map((data, index) => (
                  <li
                    className={`${visitStyles.nameList} ${visitStyles.patientList}`}
                    key={index}
                    onClick={() => getPatientListToDetails(data.patientId)}
                  >
                    {data.patientId} - {data.patientName}
                    {data.processedStatus == "COMPLETED" ? (
                      <span
                        className={visitStyles.completed}
                        style={{
                          background: "#3a9b94 !important",
                        }}
                      ></span>
                    ) : data.processedStatus == "PENDING" ||
                      data.processedStatus == "COMPUTED" ? (
                      <span className={visitStyles.pending}></span>
                    ) : data.processedStatus == "HOLD" ? (
                      <span className={visitStyles.hold}></span>
                    ) : data.processedStatus == "DECLINED" ? (
                      <span className={visitStyles.declined}></span>
                    ) : null}
                  </li>
                ))}
                {patientList?.length == 0 ? (
                  <h5 className="text-center">NO DATA</h5>
                ) : null}
              </ul>
            </div>
          </>
        ) : (
          <div
            className={`${visitStyles.userDetailsCard} ${visitStyles.loadingContainer}`}
          >
            <LoadingSpinner />
          </div>
        )}
      </div>
      <div className={visitStyles.paginationContiner}>
      <div className="patient-filte-page">
        <Paginator
          first={paginationFirst}
          rows={15}
          totalRecords={totalElements}
          onPageChange={onPageChange}
        />
      </div>
      </div>
   
    </>
  );
};

export default ReviwerWorkList;
