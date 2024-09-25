import React, { useState, useEffect, useCallback } from "react";
import Select from "react-select";
import { useSelector, useDispatch, connect } from "react-redux";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "react-facebook-loading/dist/react-facebook-loading.css";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { DatePicker, Popover, Skeleton, notification } from "antd";
import moment from "moment";
import dayjs from "dayjs";
import { Paginator } from "primereact/paginator";
import Header from "../../../jsx/layouts/nav/Header";
import PatientTable from "../../../components/table/PatientList/patientList";
import LoadingSpinner from "../../../components/spinner";
import Pending from "../../../../src/images/trackingImages/PendingTrack.png";
import Hold from "../../../../src/images/trackingImages/HoldTrack.png";
import Completed from "../../../../src/images/trackingImages/CompletedTrack.png";
import Declined from "../../../../src/images/trackingImages/DeclineTrack.png";
import Abort from "../../../../src/images/trackingImages/Abort.png";
import { actions as workqueueActions } from "../../../stores/reviewer/workqueue";
import {
  disableFutureDate,
  disableFutureDates,
  priorityOptions,
  resetPageNumber,
} from "../../../components/headerFilters/functions";
import DailyTask from "./dailytask";
import HeaderFilters from "../../../components/headerFilters";
import Image from "next/image";
import styles from "../report/report.module.css";
import filter from "../../../images/svg/filter.svg";
import { extractLatestData } from "../../supervisor/auditing";
import InputField, {
  debounce,
  disallowedCharacters,
} from "../../../components/input";
import { patientDetails } from "../../../stores/authflow/actions";
// import SkeletonLoading from "../../../jsx/components/skeleton/skeleton";
import { renderSkeleton } from "../../../components/reuseableFunctions";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { InputText } from "primereact/inputtext";
import { getStorage, setStorage } from "../../../utils/storages";

const { RangePicker } = DatePicker;

const statusOptions = [
  { label: "ALL", value: "ALL" },
  { label: "COMPLETED", value: "COMPLETED" },
  { label: "PENDING", value: "PENDING" },
  // { label: "COMPUTED", value: "COMPUTED" },
  { label: "DECLINED", value: "DECLINED" },
  { label: "HOLD", value: "HOLD" },
  // { label: "ABORTED BY CRON", value: "ABORTED_BY_CRON" },
];
const bullets = [
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
      {
        color: "#3B3486",
        name: "ABORTED BY CRON",
      },
    ],
  },
];

const Patient = ({ patientsListFilter, getpatientsListFilter, loading }) => {
  const dispatch = useDispatch();
  const sideMenu = useSelector((state) => state.sideMenu);
  const navigate = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const inputValue = {
    year: "",
    name: "",
    patientId: "",
  };
  const filteratedDashboardData = useSelector(
    (state) => state.patients.filteredList
  );
  const [patinetListAll, setPatinetListAll] = useState([]);
  const [localUserId, setLocalUserId] = useState("");
  const [searchVal, setSearchVal] = useState(navigate.query.searchTextValue);
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [paginationFirst, setPaginationFirst] = useState(0);
  const [totalElements, setTotalElements] = useState(10);
  const [trackChart, setTrackChart] = useState({
    COMPLETED: 0,
    PENDING: 0,
    DECLINED: 0,
    HOLD: 0,
  });
  const [selectedPriority, setSelectedPriority] = useState();
  const [showFilters, setShowFilters] = useState(
    navigate?.query ? true : false
  );
  const dueStartDate = filteratedDashboardData?.dayDate
    ? moment(filteratedDashboardData?.dayDate)?.format("YYYY-MM-DD") +
      "T00:00:00.000Z"
    : "";

  const dueEndDate = filteratedDashboardData?.dayDate
    ? moment(filteratedDashboardData?.dayDate)?.format("YYYY-MM-DD") +
      "T23:59:59.000Z"
    : "";

  const [dueDateStart, setDueDateStart] = useState(dueStartDate);
  const [dueDateEnd, setDueDateEnd] = useState(dueEndDate);
  const [processedStart, setProcessedStart] = useState("");
  const [processedEnd, setProcessedEnd] = useState("");
  const [statusSelectedStatus, setStatusSelectedStatus] = useState(
    navigate.query?.statusSelectedStatus
  );
  const [searchTextValue, setSearchTextValue] = useState(
    navigate.query?.searchTextValue
  );

  const dayDateFormated = filteratedDashboardData?.date
    ? dayjs(filteratedDashboardData?.date).format("MM-DD-YYYY")
    : dayjs(filteratedDashboardData?.dayDate).format("MM-DD-YYYY");
  const [defaultStartDate, setDefaultStartDate] = useState(
    dayjs(dayDateFormated).format("MM-DD-YYYY") + "T00:00:00.000Z"
  );
  const [defaultEndDate, setDefaultEndDate] = useState(
    dayjs(dayDateFormated).format("MM-DD-YYYY") + "T23:59:59.000Z"
  );
  const [sort, setSort] = useState({
    sortDir: navigate?.query?.sortDir ? navigate?.query?.sortDir : "",
    sortField: navigate?.query?.sortField ? navigate?.query?.sortField : "",
  });
  const [sortDueOrder, setSortDueOrder] = useState(
    navigate?.query?.sortDueOrder ? navigate?.query?.sortDueOrder : "DESC"
  );
  const [sortCompleteOrder, setSortCompleteOrder] = useState(
    navigate?.query?.sortCompleteOrder
      ? navigate?.query?.sortCompleteOrder
      : "DESC"
  );
  const [sortAllocateOrder, setSortAllocateOrder] = useState(
    navigate?.query?.sortAllocateOrder
      ? navigate?.query?.sortAllocateOrder
      : "DESC"
  );

  const [selectedDates, setSelectedDates] = useState([
    navigate?.query?.dueDateStart ? dayjs(navigate?.query?.dueDateStart) : "",
    navigate?.query?.dueDateEnd ? dayjs(navigate?.query?.dueDateEnd) : "",
  ]);
  const [selectedDates2, setSelectedDates2] = useState([
    navigate?.query?.processedStart
      ? dayjs(navigate?.query?.processedStart)
      : "",
    navigate?.query?.processedEnd ? dayjs(navigate?.query?.processedEnd) : "",
  ]);
  useEffect(() => {
    setDefaultStartDate(
      dayjs(dayDateFormated).format("MM-DD-YYYY") + "T00:00:00.000Z"
    );
    setDefaultEndDate(
      dayjs(dayDateFormated).format("MM-DD-YYYY") + "T23:59:59.000Z"
    );
  }, [dayDateFormated]);

  useEffect(() => {
    if (window !== "undefined") {
      if (navigate.query) {
        setIsLoading(true);
        setPageNo(navigate?.query?.pageNo ? navigate?.query?.pageNo : 0);
        setPaginationFirst(
          navigate?.query?.paginationFirst
            ? navigate?.query?.paginationFirst
            : 0
        );
        // setSearchVal(navigate.query?.searchTextValue);
        // setSelectedPriorityValue(navigate.query?.selectedPriority);
        // setStatusSelectedStatus(navigate.query?.statusSelectedValue);
      }
    }
  }, [navigate]);

  useEffect(() => {
    const uId = sessionStorage.getItem("userId");
    setLocalUserId(uId);
    if (window !== "undefined") {
      getFilteApi(
        pageNo,
        pageSize,
        statusSelectedStatus,
        dueDateStart,
        dueDateEnd,
        processedStart,
        processedEnd,
        sort,
        selectedPriority,
        searchTextValue
      );
    }
  }, [
    filteratedDashboardData,
    pageNo,
    sort,
    selectedPriority,
    searchTextValue,
    dueDateStart,
    processedStart,
    processedEnd,
    statusSelectedStatus,
    navigate.query,
    searchVal,
  ]);

  // const getPatientRes = async (
  //   pageNo,
  //   pageSize,
  //   statusSelectedStatus,
  //   dueDateStart,
  //   dueDateEnd,
  //   processedStart,
  //   processedEnd,
  //   sort,
  //   selectedPriority,
  //   searchTextValue
  // ) => {
  //   try {
  //     const res = await getFilteApi(
  //       pageNo,
  //       pageSize,
  //       statusSelectedStatus,
  //       dueDateStart,
  //       dueDateEnd,
  //       processedStart,
  //       processedEnd,
  //       sort,
  //       selectedPriority,
  //       searchTextValue
  //     );
  //     if (res.status == "SUCCESS") {
  //       setTotalElements(res.response?.patientDTOList?.totalElements);
  //       setTrackChart(res?.response?.processStatusCount);
  //       setPatinetListAll(res?.response?.patientDTOList?.content);
  //     }
  //   } catch (error) {}
  // };

  const getFilteApi = async (
    pageNo,
    pageSize,
    statusValue,
    dStart,
    dEnd,
    pStart,
    pEnd,
    sort,
    selectedPriority,
    searchTextValue
  ) => {
    const uId = getStorage("userId");
    const resoureUrl = `patientAllocated=${uId}&page=${
      pageNo ? pageNo : 0
    }&size=${pageSize ? pageSize : 15}&processedStatus=${
      statusValue ? statusValue : ""
    }&dueDateStart=${dStart ? dStart : ""}&dueDateEnd=${
      dEnd ? dEnd : ""
    }&processedStart=${pStart ? pStart : ""}&processedEnd=${
      pEnd ? pEnd : ""
    }&searchString=${searchTextValue ? searchTextValue : ""}&sortfield=${
      sort?.sortField ? sort?.sortField : ""
    }&sortdirection=${sort?.sortDir ? sort?.sortDir : ""}&priority=${
      selectedPriority ? selectedPriority : ""
    }`;
    const res = await getpatientsListFilter({ url: resoureUrl });
    if (res.status == "SUCCESS") {
      setTotalElements(res.response?.patientDTOList?.totalElements);
      setTrackChart(res?.response?.processStatusCount);
      setPatinetListAll(res?.response?.patientDTOList?.content);
    }
  };

  const debounceText = useCallback(
    debounce((val) => {
      return setSearchTextValue(val);
    }, 700),
    []
  );
  const getNameSearch = async (e) => {
    setIsLoading(true);
    setSearchVal(e.target.value);
    debounceText(e.target.value);

    // const resoureUrl = `dbservice/patient/filter?patientAllocated=${localUserId}&page=0&size=${pageSize}&processedStatus=${statusSelectedValue}&dueDateStart=${dueDateStart}&dueDateEnd=${dueDateEnd}&processedStart=${processedStart}&processedEnd=${processedEnd}&searchString=${val}`;
    // dispatch(getpatientsListFilter(resoureUrl));
    // getpatientsListFilter({ url: resoureUrl });
    resetPageNumber(setPageNo);
  };

  const addPatientFile = (data) => {
    inputValue.patientId = data.patientId;
    inputValue.name = data.patientName;
    setAddPatient(true);
    setIsLoadingBtn(false);
  };

  const gotoPatientDetails = (data) => {
    dispatch(patientDetails(data));
    if (data.computing == 2) {
      const controller = new AbortController();
      controller.abort();
      setStorage("patientId", data.patientId);
      navigate.push("/reviewer/patients/details");
    } else {
      notification.warning({
        message: data.patientId + " file not processed Please wait",
      });
    }
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="d-flex justify-content-center">
        <button
          onClick={() => addPatientFile(rowData)}
          className="btn hegiht10 btn-primary shadow  sharp me-1 action-btn"
        >
          <FontAwesomeIcon icon={faUpload} fontSize={11} />
        </button>
      </div>
    );
  };

  const onPageChange = (e) => {
    setIsLoading(true);
    setPaginationFirst(e.first);
    setPageNo(e.page);
    setPageSize(e.rows);
    // getFilteApi(
    //   e.page,
    //   15,
    //   statusSelectedValue,
    //   dueDateStart,
    //   dueDateEnd,
    //   processedStart,
    //   processedEnd
    // );
  };

  const onChangeStatus = (selectedOption) => {
    let value = selectedOption.value;
    if (value == "ALL") {
      value = "";
    }
    setStatusSelectedStatus(value);
    // getFilteApi(
    //   0,
    //   pageSize,
    //   value,
    //   dueDateStart,
    //   dueDateEnd,
    //   processedStart,
    //   processedEnd
    // );
  };
  const onChangePriority = (selectedOption) => {
    let value = selectedOption?.value;
    if (value == "All") {
      value = "";
    }
    setSelectedPriority(value);
  };
  const handleDatePickerChange = (dateString) => {
    if (dateString[0] != "") {
      let convertStartDate =
        moment(dateString[0]).format("YYYY-MM-DD") + "T00:00:00.000Z";
      let convertEndDate =
        moment.utc(dateString[1]).format("YYYY-MM-DD") + "T23:59:59.000Z";
      setDueDateStart(convertStartDate);
      setDueDateEnd(convertEndDate);
    } else {
      setDueDateStart("");
      setDueDateEnd("");
    }
  };

  const handleDatePickerChangeProcesseDate = (dateString) => {
    if (dateString[0] !== "") {
      let convertStartDate =
        moment(dateString[0]).format("YYYY-MM-DD") + "T00:00:00.000Z";
      let convertEndDate =
        moment.utc(dateString[1]).format("YYYY-MM-DD") + "T23:59:59.000Z";
      setProcessedStart(convertStartDate);
      setProcessedEnd(convertEndDate);
    } else {
      setProcessedStart("");
      setProcessedEnd("");
    }
  };

  const processstatusBodyTemplate = (rowData) => {
    const declinedDataFromDeclined = extractLatestData(rowData?.declinedNotes);

    switch (rowData.processedStatus) {
      case "COMPLETED":
        return (
          <Popover placement="bottom" title="Status: COMPLETED">
            <div className="patient-status" style={{ textAlign: "center" }}>
              <Image src={Completed} style={{ height: "18%", width: "18%" }} />
            </div>
          </Popover>
        );

      case "PENDING":
        return (
          <Popover placement="bottom" title="Status: PENDING">
            <div className="patient-status" style={{ textAlign: "center" }}>
              <Image src={Pending} style={{ height: "18%", width: "18%" }} />
            </div>
          </Popover>
        );

      case "DECLINED":
        return (
          <Popover
            placement="bottom"
            title="Status: DECLINED"
            content={`Reason: ${
              declinedDataFromDeclined ? declinedDataFromDeclined : "---"
            }`}
          >
            <div className="patient-status" style={{ textAlign: "center" }}>
              <Image src={Declined} style={{ height: "18%", width: "18%" }} />
            </div>
          </Popover>
        );
      case "NOTCOMPUTED":
        return (
          <Popover placement="bottom" title="Status: NOT COMPUTED">
            <div className="patient-status" style={{ textAlign: "center" }}>
              <Image src={Pending} style={{ height: "18%", width: "18%" }} />
            </div>
          </Popover>
        );
      case "COMPUTED":
        return (
          <Popover placement="bottom" title="Status: COMPUTED">
            <div className="patient-status" style={{ textAlign: "center" }}>
              <Image src={Pending} style={{ height: "18%", width: "18%" }} />
            </div>
          </Popover>
        );
      case "HOLD":
        return (
          <Popover placement="bottom" title="Status: HOLD">
            <div className="patient-status" style={{ textAlign: "center" }}>
              <Image src={Hold} style={{ height: "18%", width: "18%" }} />
            </div>
          </Popover>
        );
      case "ABORTED_BY_CRON":
        return (
          <Popover placement="bottom" title="Status: ABORTED BY CRON">
            <div className="patient-status" style={{ textAlign: "center" }}>
              <Image src={Abort} style={{ height: "18%", width: "18%" }} />
            </div>
          </Popover>
        );
      case null:
        return (
          <Popover placement="bottom" title="">
            <div className="patient-status" style={{ textAlign: "center" }}>
              <Image src={Pending} style={{ height: "18%", width: "18%" }} />
            </div>
          </Popover>
        );
    }
  };
  // const renderSkeleton = () => (
  //   <div className="skeleton-table">
  //     <div className="skeleton-header">
  //       <Skeleton.Input style={{ width: 2000 }} active />
  //     </div>

  //     {Array.from({ length: 6 }).map((_, index) => (
  //       <div key={index} className="skeleton-row">
  //         <Skeleton.Input style={{ width: 2000 }} active />
  //       </div>
  //     ))}
  //   </div>
  // );

  const options = [{ label: "All", value: "" }, ...priorityOptions];

  return (
    <>
      <div className={`show ${sideMenu ? "menu-toggle" : ""}`}>
        <Header />
        <div class="content-body">
          <div className="container-fluid">
            <div className="row">
              <div className="col-xl-12">
                <div className="">
                  <div className="card-body p-0">
                    <div className="table-responsive active-projects task-table">
                      <div className="tbl-caption  align-items-center">
                        <div className="row filter-contain">
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              flexDirection: "row",
                            }}
                          >
                            <div className="col-xl-2">
                              <label>Search by Name or ID</label>
                              {/* <InputField
                                inputValue={searchTextValue}
                                setInputValue={setSearchTextValue}
                                delay={1000}
                                type="text"
                                onChange={getNameSearch}
                                placeholder="Search"
                                isSearch={true}
                              /> */}
                              <div className="form-group has-search">
                                <FontAwesomeIcon
                                  className="fa fa-search form-control-feedback"
                                  icon={faSearch}
                                />

                                <InputText
                                  value={searchVal}
                                  onChange={(e) => getNameSearch(e)}
                                  className={
                                    "form-control new-form-control new-item-control"
                                  }
                                  placeholder={"Search"}
                                  maxLength={25}
                                  onKeyDown={(e) => {
                                    if (disallowedCharacters.includes(e.key)) {
                                      e.preventDefault();
                                    }
                                  }}
                                />
                              </div>
                            </div>
                            <div className="col-xl-2">
                              <label>Select Status</label>
                              <div class="form-group has-search">
                                <Select
                                  onChange={(selectedOption) => {
                                    onChangeStatus(selectedOption);
                                    resetPageNumber(setPageNo);
                                  }}
                                  value={
                                    statusSelectedStatus && {
                                      label: statusSelectedStatus,
                                      value: statusSelectedStatus,
                                    }
                                  }
                                  options={statusOptions}
                                  className="custom-react-select"
                                  isSearchable={false}
                                  placeholder={
                                    filteratedDashboardData
                                      ? filteratedDashboardData?.status?.toUpperCase()
                                      : "Select Status"
                                  }
                                />
                              </div>
                            </div>
                            <div className="col-xl-2">
                              <label>Select Priority</label>
                              <div class="form-group has-search">
                                <Select
                                  onChange={(selectedOption) => {
                                    onChangePriority(selectedOption);
                                    resetPageNumber(setPageNo);
                                  }}
                                  value={
                                    selectedPriority && {
                                      label: selectedPriority,
                                      value: selectedPriority,
                                    }
                                  }
                                  options={options}
                                  className="custom-react-select"
                                  isSearchable={false}
                                  placeholder={
                                    filteratedDashboardData
                                      ? filteratedDashboardData?.status?.toUpperCase()
                                      : "Select Status"
                                  }
                                />
                              </div>
                            </div>

                            <div className="col-xl-2">
                              <label>Due Date</label>
                              <div>
                                <RangePicker
                                  format="MM-DD-YYYY"
                                  onChange={(dates, dateStrings) => {
                                    handleDatePickerChange(dateStrings);
                                    resetPageNumber(setPageNo);
                                  }}
                                  value={selectedDates}
                                  onCalendarChange={(val) =>
                                    setSelectedDates(val)
                                  }
                                  defaultValue={
                                    filteratedDashboardData
                                      ? [
                                          dayjs(defaultStartDate, "MM-DD-YYYY"),
                                          dayjs(defaultEndDate, "MM-DD-YYYY"),
                                        ]
                                      : []
                                  }
                                  disabledDate={(current) =>
                                    disableFutureDates(current)
                                  }
                                />
                              </div>
                            </div>
                            <div
                              className={"col-xl-1"}
                              style={{
                                margin: "30px 0 0 10px",
                                cursor: "pointer",
                                width: "100px",
                              }}
                              onClick={() => setShowFilters(!showFilters)}
                            >
                              <button className={styles.filterBtn}>
                                <Image src={filter} />{" "}
                                {showFilters ? "Hide" : "Filter"}
                              </button>
                            </div>
                            <HeaderFilters bullets={bullets} />

                            <div className="col-xl-2">
                              <DailyTask trackChart={trackChart} />
                            </div>
                          </div>
                          {showFilters && (
                            <div
                              style={{
                                display: "flex",
                                marginTop: "-30px",
                                flexDirection: "row",
                              }}
                            >
                              <div className="col-xl-2 ">
                                <label>Completed Date</label>
                                <div>
                                  <RangePicker
                                    format="MM-DD-YYYY"
                                    value={selectedDates2}
                                    onCalendarChange={(val) =>
                                      setSelectedDates2(val)
                                    }
                                    onChange={(dates, dateStrings) => {
                                      handleDatePickerChangeProcesseDate(
                                        dateStrings
                                      );
                                      resetPageNumber(setPageNo);
                                    }}
                                    disabledDate={(current) =>
                                      disableFutureDate(current)
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div
                        id="task-tbl_wrapper"
                        className="dataTables_wrapper no-footer"
                      >
                        {loading ? (
                          renderSkeleton()
                        ) : (
                          <>
                            <PatientTable
                              patinetListAll={patinetListAll}
                              actionBodyTemplate={actionBodyTemplate}
                              statusBodyTemplate={processstatusBodyTemplate}
                              gotoPatientDetails={gotoPatientDetails}
                              patientDetails={patientDetails}
                              setSelectedPriority={setSelectedPriority}
                              sort={sort}
                              setSort={setSort}
                              getFilteApi={getFilteApi}
                              page={{ pageNo, paginationFirst }}
                              sortDueOrder={sortDueOrder}
                              setSortDueOrder={setSortDueOrder}
                              sortCompleteOrder={sortCompleteOrder}
                              setSortCompleteOrder={setSortCompleteOrder}
                              sortAllocateOrder={sortAllocateOrder}
                              setSortAllocateOrder={setSortAllocateOrder}
                              userId={localUserId}
                              params={{
                                statusSelectedStatus,
                                dueDateStart,
                                dueDateEnd,
                                processedStart,
                                processedEnd,
                                sort,
                                selectedPriority,
                                searchTextValue,
                                pageNo,
                                paginationFirst,
                                sortDueOrder,
                                sortCompleteOrder,
                                sortAllocateOrder,
                                sortDir: sort?.sortDir,
                                sortField: sort?.sortField,
                              }}
                            />
                            <div>
                              <div className="pagination-container">
                                <Paginator
                                  first={pageNo === 0 ? 0 : paginationFirst}
                                  rows={15}
                                  totalRecords={totalElements}
                                  onPageChange={onPageChange}
                                />
                                <div className="total-pages">
                                  Total count: {totalElements}
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
const enhancer = connect(
  (state) => ({
    patientsListFilter: state?.reviewer?.workQueue?.patients,
    loading: state?.reviewer?.workQueue?.patientsLoading,
  }),
  {
    getpatientsListFilter: workqueueActions.patientsAction,
  }
);
export default enhancer(Patient);
