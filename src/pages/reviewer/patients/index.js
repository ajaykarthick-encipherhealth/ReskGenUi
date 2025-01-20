import React, { useState, useEffect, useCallback } from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "react-facebook-loading/dist/react-facebook-loading.css";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { DatePicker, Popover, notification } from "antd";
import moment from "moment";
import dayjs from "dayjs";
import { Paginator } from "primereact/paginator";
import Header from "../../../jsx/layouts/nav/Header";
import PatientTable from "../../../components/table/PatientList/patientList";
import Pending from "../../../../src/images/trackingImages/pending.webp";
import Hold from "../../../../src/images/trackingImages/hold.webp";
import Completed from "../../../../src/images/trackingImages/completed.webp";
import Declined from "../../../../src/images/trackingImages/declined.webp";
import Abort from "../../../../src/images/trackingImages/abort.webp";
import { actions as workqueueActions } from "../../../stores/reviewer/workqueue";
import {
  priorityOptions,
  resetPageNumber,
} from "../../../components/headerFilters/functions";
import DailyTask from "./dailytask";
import Image from "next/image";
import { extractLatestData } from "../../supervisor/auditing";
import InputField, { debounce } from "../../../components/input";
import { renderSkeleton } from "../../../components/reuseableFunctions";
import { getStorage, removeStorage, setStorage } from "../../../utils/storages";
import { actions as allActions } from "../../../stores/reviewer/workqueue";
import HeaderFiltersPatients, { allFilters } from "./headerFilters";
import { actions as allPatientSyncAction } from "../../../stores/tenantAdmin/patientSync";

const { RangePicker } = DatePicker;

const statusOptions = [
  { label: "COMPLETED", value: "COMPLETED" },
  { label: "PENDING", value: "PENDING" },
  { label: "DECLINED", value: "DECLINED" },
  { label: "HOLD", value: "HOLD" },
];
// const bullets = [
//   {
//     title: "Processed Status",
//     option: [
//       {
//         color: "#5da9e4",
//         name: "Pending",
//       },
//       {
//         color: "red",
//         name: "Declined",
//       },
//       {
//         color: "#3a9b94",
//         name: "Completed",
//       },
//       { color: "#AD94FA", name: "Hold" },
//     ],
//   },
// ];

const Patient = ({
  patientsListFilter,
  getpatientsListFilter,
  loading,
  patientDetails,
  filtersData,
  routedData,
  getRoutedData,
}) => {
  const navigate = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const inputValue = {
    year: "",
    name: "",
    patientId: "",
  };
  const [patinetListAll, setPatinetListAll] = useState([]);
  const [localUserId, setLocalUserId] = useState("");
  const [searchVal, setSearchVal] = useState("");
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [paginationFirst, setPaginationFirst] = useState(0);
  const [totalElements, setTotalElements] = useState(10);
  const [clear, setClear] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);
  const [trackChart, setTrackChart] = useState({
    COMPLETED: 0,
    PENDING: 0,
    DECLINED: 0,
    HOLD: 0,
  });
  const [selectedPriority, setSelectedPriority] = useState(null);
  const [dueDateStart, setDueDateStart] = useState(null);
  const [dueDateEnd, setDueDateEnd] = useState(null);
  const [processedStart, setProcessedStart] = useState(null);
  const [processedEnd, setProcessedEnd] = useState(null);
  const [statusSelectedStatus, setStatusSelectedStatus] = useState(null);
  const [searchTextValue, setSearchTextValue] = useState("");
  const [sort, setSort] = useState({
    sortDir: "",
    sortField: "",
  });
  const [sortDueOrder, setSortDueOrder] = useState("DESC");
  const [sortCompleteOrder, setSortCompleteOrder] = useState("DESC");
  const [sortAllocateOrder, setSortAllocateOrder] = useState("DESC");
  const [selectedDates, setSelectedDates] = useState([]);
  const [selectedDates2, setSelectedDates2] = useState([]);
  const [paramsFilter, setParamsFilter] = useState(null);

  const getFilteApi = async ({
    pageNo,
    pageSize,
    statusValue,
    dStart,
    dEnd,
    pStart,
    pEnd,
    sort,
    selectedPriority,
    searchTextValue,
  }) => {
    const uId = getStorage("userId");
    const resoureUrl = `patientAllocated=${uId}&page=${
      pageNo ? pageNo : 0
    }&size=${pageSize ? pageSize : 15}&processedStatus=${
      statusValue ? statusValue.toUpperCase() : ""
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
    if (res?.status == "SUCCESS") {
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
    resetPageNumber(setPageNo);
  };

  const addPatientFile = (data) => {
    inputValue.patientId = data.patientId;
    inputValue.name = data.patientName;
    setAddPatient(true);
    setIsLoadingBtn(false);
  };

  const gotoPatientDetails = (data) => {
    // getpatientsListFilter(data);
    patientDetails(data);
    setStorage("patientId", data.patientId);
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
  };

  const onChangeStatus = (selectedOption) => {
    let value = selectedOption;
    setStatusSelectedStatus(value);
    removeStorage("reviewerDueDate");
    removeStorage("reviewerDate");
  };
  const onChangePriority = (selectedOption) => {
    let value = selectedOption;
    setSelectedPriority(value);
  };

  const handleDatePickerChange = (dates, dateString) => {
    setSelectedDates(dates);
    if (dateString[0] != "") {
      let convertStartDate =
        moment(dateString[0]).format("YYYY-MM-DD") + "T00:00:00.000Z";
      let convertEndDate =
        moment(dateString[1]).format("YYYY-MM-DD") + "T23:59:59.000Z";
      setDueDateStart(convertStartDate);
      setDueDateEnd(convertEndDate);
    } else {
      setDueDateStart("");
      setDueDateEnd("");
      removeStorage("reviewerDueDate");
      removeStorage("reviewerDate");
    }
  };

  const handleDatePickerChangeProcesseDate = (dates, dateString) => {
    setSelectedDates2(dates);
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
            <span className="patient-status text-center">
              <Image src={Completed}  style={{ height: "30px", width: "30px" }} />
            </span>
          </Popover>
        );

      case "PENDING":
        return (
          <Popover placement="bottom" title="Status: PENDING">
            <span className="patient-status text-center">
              <Image src={Pending}  style={{ height: "30px", width: "30px" }} />
            </span>
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
            <span className="patient-status text-center">
              <Image src={Declined}  style={{ height: "30px", width: "30px" }}/>
            </span>
          </Popover>
        );
      case "NOTCOMPUTED":
        return (
          <Popover placement="bottom" title="Status: NOT COMPUTED">
            <span className="patient-status text-center">
              <Image src={Pending}  style={{ height: "30px", width: "30px" }} />
            </span>
          </Popover>
        );
      case "COMPUTED":
        return (
          <Popover placement="bottom" title="Status: COMPUTED">
            <span className="patient-status text-center">
              <Image src={Pending}  style={{ height: "30px", width: "30px" }} />
            </span>
          </Popover>
        );
      case "HOLD":
        return (
          <Popover placement="bottom" title="Status: HOLD">
            <span className="patient-status text-center">
              <Image src={Hold}  style={{ height: "30px", width: "30px" }} />
            </span>
          </Popover>
        );
      case "ABORTED_BY_CRON":
        return (
          <Popover placement="bottom" title="Status: ABORTED BY CRON">
            <span className="patient-status text-center">
              <Image src={Abort}  style={{ height: "30px", width: "30px" }} />
            </span>
          </Popover>
        );
      case null:
        return (
          <Popover placement="bottom" title="">
            <span className="patient-status text-center">
              <Image src={Pending}  style={{ height: "30px", width: "30px" }} />
            </span>
          </Popover>
        );
    }
  };

  const options = [...priorityOptions];
  useEffect(() => {
    if (filtersData) {
      setActiveFilters(filtersData);
    }
  }, []);

  useEffect(() => {
    if (routedData) {
      setParamsFilter("check");
      setPageNo(routedData?.pageNo ? routedData?.pageNo : 0);
      setPaginationFirst(routedData?.paginationFirst);
      setSearchTextValue(routedData?.searchTextValue);
      setSelectedDates(routedData?.selectedDates || []);
      setSort(routedData?.sort);
      setClear(routedData?.clear);
      setSelectedPriority(routedData?.selectedPriority);
      setActiveFilters(
        routedData?.activeFilters ? routedData?.activeFilters : []
      );
      setDueDateStart(routedData?.dueDateStart || null);
      setDueDateEnd(routedData?.dueDateEnd || null);
      setProcessedStart(routedData?.processedStart || null);
      setProcessedEnd(routedData?.processedEnd || null);
      setStatusSelectedStatus(routedData?.statusSelectedStatus?.toUpperCase());
      setSearchVal(
        routedData?.searchTextValue ? routedData?.searchTextValue : ""
      );
      setSort(routedData?.sort);
      setSortDueOrder(routedData?.sortDueOrder);
      setSortCompleteOrder(routedData?.sortCompleteOrder);
      setSortAllocateOrder(routedData?.sortAllocateOrder);
      setSelectedDates2(routedData?.selectedDates2 || []);
    }
  }, []);
  useEffect(() => {
    setParamsFilter("check");
    if (window !== "undefined" && paramsFilter) {
      getFilteApi({
        pageNo,
        pageSize,
        statusValue: clear ? "" : statusSelectedStatus,
        dStart: clear ? "" : dueDateStart,
        dEnd: clear ? "" : dueDateEnd,
        pStart: clear ? "" : processedStart,
        pEnd: clear ? "" : processedEnd,
        sort,
        selectedPriority: clear ? "" : selectedPriority,
        searchTextValue: clear ? "" : searchTextValue,
      });
    }
  }, [
    pageNo,
    sort,
    selectedPriority,
    searchTextValue,
    dueDateStart,
    dueDateEnd,
    processedStart,
    processedEnd,
    statusSelectedStatus,
    navigate.query,
    clear,
    paramsFilter,
  ]);

  return (
    <div className={`show `}>
      <Header />
      <div class="content-body">
        <div className="container-fluid">
          <div className="row">
            <div className="col-xl-12">
              <div className="">
                <div className="card-body p-0">
                  <div className="table-responsive active-projects task-table">
                    <div className="row">
                      <div className="col-10">
                        <div className="">
                          <HeaderFiltersPatients
                            activeFilters={activeFilters}
                            setActiveFilters={setActiveFilters}
                            isAllocatedToSelector={true}
                            value={searchVal}
                            onChange={(e) => getNameSearch(e)}
                            orgAllList={statusOptions}
                            onChangeStatus={(selectedOption) => {
                              onChangeStatus(selectedOption);
                              resetPageNumber(setPageNo);
                              setClear(false);
                            }}
                            statusSelectedStatus={statusSelectedStatus}
                            statusSelectedStatus1={selectedPriority}
                            onChangeStatus1={(selectedOption) => {
                              onChangePriority(selectedOption);
                              resetPageNumber(setPageNo);
                              setClear(false);
                            }}
                            orgAllList1={options}
                            selectedDates={selectedDates}
                            setSelectedDates={setSelectedDates}
                            onchangeRangePicker={(dates, dateStrings) => {
                              handleDatePickerChange(dates, dateStrings);
                              resetPageNumber(setPageNo);
                              setClear(false);
                            }}
                            selectedDates2={selectedDates2}
                            setSelectedDates2={setSelectedDates2}
                            onchangeRangePicker2={(dates, dateStrings) => {
                              handleDatePickerChangeProcesseDate(
                                dates,
                                dateStrings
                              );
                              resetPageNumber(setPageNo);
                              setClear(false);
                            }}
                            setClear={setClear}
                            clear={clear}
                            getRoutedData={getRoutedData}
                          />
                        </div>
                      </div>
                      <div className="col-2">
                        <div className="row">
                          <div className=" mt-1 mb-1">
                            <DailyTask trackChart={trackChart} />
                          </div>
                        </div>
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
                            activeFilters={activeFilters}
                            setActiveFilters={setActiveFilters}
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
                              selectedDates,
                              paginationFirst,
                              sortDueOrder,
                              sortCompleteOrder,
                              sortAllocateOrder,
                              sortDir: sort?.sortDir,
                              sortField: sort?.sortField,
                              selectedDates2,
                              selectedDates,
                              activeFilters,
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
  );
};
const enhancer = connect(
  (state) => ({
    patientsListFilter: state?.reviewer?.workQueue?.patients,
    loading: state?.reviewer?.workQueue?.patientsLoading,
    filtersData: state.reviewer?.workQueue?.reviewerPatientFilterList,
    routedData: state.tenantAdmin?.patientSync?.routedData,
  }),
  {
    getpatientsListFilter: workqueueActions.patientsAction,
    patientDetails: allActions.getPatientDetails,
    getRoutedData: allPatientSyncAction.getRoutedData,
  }
);
export default enhancer(Patient);
