import React, { useState, useEffect } from "react";
import { Empty, Popover, Tooltip, DatePicker } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faSearch } from "@fortawesome/free-solid-svg-icons";
import { InputText } from "primereact/inputtext";
import { Paginator } from "primereact/paginator";
import { useSelector, useDispatch } from "react-redux";
import moment, { months } from "moment";
import Image from "next/image";
import { getPatients } from "../../../../../../store/actions/adminAction/patientsActions";
import { patientListFilter } from "../../../../../../services/PatientsListSevice";
import visitStyles from "../../../../../../styles/visitdata.module.css";
import LoadingSpinner from "../../../../../../components/loadingSpinner";
import { IMAGES, SVGICON } from "../../../../../../jsx/constant/theme";
import Legends from "../../../../../../components/legends";
import { disableFutureDate } from "../../../../../../components/headerFilters/functions";

export function extractLatestData(notes) {
  let declinedData;
  if (notes && typeof notes === "object") {
    const entries = Object.entries(notes);
    const latestKey = Math.max(...entries.map(([key, value]) => parseInt(key)));
    entries.forEach(([key, value]) => {
      if (parseInt(key) === latestKey) {
        declinedData = value;
      }
    });
  }

  return declinedData;
}

const AdminWorkList = ({ localUserId, setWorkListPatientId,setIsModalComments }) => {
  const dispatch = useDispatch();
  const result = useSelector((state) => state.adminList.patients);
  const { RangePicker } = DatePicker;
  const [showIcons, setShowIcons] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [openPicker, setOpenPicker] = useState(false);
  const [openPicker2, setOpenPicker2] = useState(false);
  const [patientList, setPatientList] = useState([]);
  const [pageNo, setPageNo] = useState(0);
  const [paginationFirst, setPaginationFirst] = useState(0);
  const [totalElements, setTotalElements] = useState(10);
  const [filterDataLoading, setFilterDataLoading] = useState(true);
  const [patientSortOrder, setPatientSortOrder] = useState("ASC");
  const [sort, setSort] = useState({ sortDir: "", sortField: "" });
  const [selCreatedBy, setSelCreatedBy] = useState("");
  const [selAllocatedBy, setSelAllocatedBy] = useState("");
  const [completedStartDate, setCompletedStartDate] = useState("");
  const [completedEndDate, setCompletedEndDate] = useState("");
  const [computedStartDate, setComputedStartDate] = useState("");
  const [computedEndDate, setComputedEndDate] = useState("");
  const [selectedOption, SetSelectedOption] = useState("");
  const [search, setSearch] = useState("");
  const [closeSlider, setCloseSlider] = useState(true);
  const [selAllocatedTo, setSelAllocatedTo] = useState("");

  const getWorkList = async () => {
    setPatientList(result?.response?.content);
    setTotalElements(result?.response?.totalElements);
    setFilterDataLoading(false);
  };

  const filterChangePatientId = async (e) => {
    setSearch(e.target.value);
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
    setCloseSlider(false);
  };
  const handleShowCard = () => {
    setShowCard(!showCard);
    setShowCard(true);
  };

  const getPatientListToDetails = (id) => {
    setWorkListPatientId(id);
    setIsModalComments(false)
  };

  const handleDatePickerChange = async (dateString) => {
    let convertStartDate =
      moment(dateString[0]).format("YYYY-MM-DD") + "T00:00:00.000Z";
    let convertEndDate =
      moment.utc(dateString[1]).format("YYYY-MM-DD") + "T23:59:59.000Z";
    setComputedStartDate(convertStartDate);
    setComputedEndDate(convertEndDate);
    setOpenPicker(false);
  };

  const handleChangeprocessedDate = async (dateString) => {
    let convertStartDate =
      moment(dateString[0]).format("YYYY-MM-DD") + "T00:00:00.000Z";
    let convertEndDate =
      moment.utc(dateString[1]).format("YYYY-MM-DD") + "T23:59:59.000Z";
    setCompletedStartDate(convertStartDate);
    setCompletedEndDate(convertEndDate);
    setOpenPicker2(false);
  };
  const getFiltePatientListStatus = async (value) => {
    SetSelectedOption(value);
    setOpenPicker(false);
    setOpenPicker2(false);
  };

  const statusOptions = [
    { label: "ALL", value: "" },
    { label: "PROCESSING", value: "1", status: 1 },
    { label: "COMPUTED", value: "2", status: 2 },
    { label: "FAILED", value: "3", status: 3 },
    { label: "NOT COMPUTED", value: "0", status: 0 },
  ];

  const bullets = [
    {
      color: "#34ace8",
      name: "Computed",
    },
    {
      color: "#452b90",
      name: "Processing",
    },
    {
      color: "#be3144",
      name: "Not Computed",
    },
    {
      color: "#e88d8d",
      name: "Failed",
    },
  ];

  const processstatusBodyTemplate = (rowData) => {
    const isFinished =
      patientList?.length > 0 &&
      patientList?.find(
        (data) =>
          data?.patientId === rowData?.patientId &&
          data?.processStageChart === "FINISHED"
      ) !== undefined;

    const rowStatus =
      rowData?.computing === 0 && patientList?.length === 0
        ? "Not Computed"
        : rowData?.computing == 1
        ? "Processing"
        : isFinished || rowData?.computing == 2
        ? "Computed"
        : rowData?.computing == 3
        ? "Failed"
        : "Not Computed";
    return (
      <div className="patient-status">
        <div
          className={visitStyles.roleStyleWQ}
          style={{
            backgroundColor:
              rowStatus === "Computed"
                ? " #34ace8"
                : rowStatus === "Processing"
                ? "#452b90"
                : rowStatus === "Failed"
                ? "#e88d8d"
                : "#be3144",
          }}
        ></div>
      </div>
    );
  };

  useEffect(() => {
    getWorkList();
  }, [result, pageNo]);

  useEffect(() => {
    dispatch(
      getPatients(
        pageNo,
        computedStartDate,
        computedEndDate,
        selectedOption,
        search,
        completedStartDate,
        completedEndDate,
        selAllocatedTo,
        selAllocatedBy,
        selCreatedBy,
        sort
      )
    );
  }, [
    pageNo,
    computedStartDate,
    computedEndDate,
    selectedOption,
    search,
    completedStartDate,
    completedEndDate,
    patientSortOrder,
    selAllocatedBy,
    sort,
    selCreatedBy,
    closeSlider,
  ]);

  return (
    <>
      <div className={`row ${visitStyles.patientListHead}`}>
        <div
          className={visitStyles.flags}
          style={{ marginTop: "15px", marginBottom: "20px" }}
        >
          <Legends bullets={bullets} display="ruby" padding="0 0px 10px 0" />
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
                <Tooltip title="Computed Date" placement="left">
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
                <Tooltip title="Created Date" placement="left">
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
                  {statusOptions.map((status, index) => (
                    <li
                      onClick={() => getFiltePatientListStatus(status.value)}
                      className={visitStyles.nameList}
                      key={index}
                    >
                      {status.label}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        {result?.response?.content ? (
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
                    {processstatusBodyTemplate(data)}
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

export default AdminWorkList;
