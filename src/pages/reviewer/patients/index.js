import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "react-facebook-loading/dist/react-facebook-loading.css";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { Popover, notification } from "antd";
import { Paginator } from "primereact/paginator";
import Header from "../../../jsx/layouts/nav/Header";
import PatientTable from "../../../components/table/PatientList/patientList";
import Pending from "../../../../src/images/trackingImages/pending.webp";
import Hold from "../../../../src/images/trackingImages/hold.webp";
import Completed from "../../../../src/images/trackingImages/completed.webp";
import Declined from "../../../../src/images/trackingImages/declined.webp";
import Abort from "../../../../src/images/trackingImages/abort.webp";
import { actions as workqueueActions } from "../../../stores/reviewer/workqueue";
import { actions as tenantAdminAction } from "../../../stores/tenantAdmin/patients";
import { priorityOptions } from "../../../components/headerFilters/functions";
import DailyTask from "./dailytask";
import Image from "next/image";
import { extractLatestData } from "../../supervisor/auditing";
import { setStorage } from "../../../utils/storages";
import { actions as allActions } from "../../../stores/reviewer/workqueue";
import { actions as allPatientSyncAction } from "../../../stores/tenantAdmin/patientSync";
import TableSkeleton from "../../../components/skeleton/table";
import ReusableFilters from "../../../components/reusableFilters";

const bullets = [
  {
    title: "Processed Status",
    option: [
      {
        color: "#5da9e4",
        name: "Pending",
      },
      {
        color: "#EB5252",
        name: "Declined",
      },
      {
        color: "#00BC13",
        name: "Completed",
      },
      { color: "#3C0AD2", name: "Hold" },
    ],
  },
];

const Patient = ({
  getFilteApi,
  loading,
  patinetListAll,
  patientDetails,
  routedData,
  getRoutedData,
  getAllBatchList,
  batchList,
}) => {
  const commonFilterItems = [
    {
      id: "01",
      title: "Search",
      type: "search",
      value: null,
      placeholder: "Search",
      header:"Patient Name / ID"
    },
    {
      id: "02",
      title: "Status",
      type: "select",
      value: null,
      placeholder: "Status",
      options: [
        { label: "COMPLETED", value: "COMPLETED" },
        { label: "PENDING", value: "PENDING" },
        { label: "DECLINED", value: "DECLINED" },
        { label: "HOLD", value: "HOLD" },
      ],
    },
    {
      id: "03",
      title: "dueDate",
      type: "rangePicker",
      value: null,
      placeholder: "Due Date",
      pickerType: "year",
    },
    {
      id: "04",
      title: "completedDate",
      type: "rangePicker",
      value: null,
      placeholder: "Completed  Date",
      pickerType: "year",
    },
    {
      id: "05",
      title: "Priority",
      type: "select",
      value: null,
      placeholder: "Priority",
      options: priorityOptions,
    },
    {
      id: "06",
      title: "batch",
      type: "select",
      value: null,
      placeholder: "Batch",
      showSearch:true,
      options: batchList?.map((item) => ({
        value: item?.id,
        label: `${item?.name}`,
      })),
    },
  ];
  const router = useRouter();
  const [activeFilters, setActiveFilters] = useState(["Search"]);
  const [sort, setSort] = useState({
    allocatedOn: {
      sortDir: "DESC",
      sortField: "allocatedOn",
    },
    dueDate: {
      sortDir: "DESC",
      sortField: "dueDate",
    },
    processedDate: {
      sortDir: "DESC",
      sortField: "processedDate",
    },
  });
  const [searchText, setSearchText] = useState(null);
  const [selectedOption, setSelectedOption] = useState({});
  const [selectedDateRanges, setSelectedDateRanges] = useState({});
  const [selectedDates, setSelectedDates] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [trackChart, setTrackChart] = useState({
    COMPLETED: 0,
    PENDING: 0,
    DECLINED: 0,
    HOLD: 0,
  });
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [paginationFirst, setPaginationFirst] = useState(0);
  const [totalElements, setTotalElements] = useState(10);
  const [clear, setClear] = useState(false);
  const [paramsFilter, setParamsFilter] = useState(null);

  const addPatientFile = (data) => {
    inputValue.patientId = data.patientId;
    inputValue.name = data.patientName;
    setAddPatient(true);
  };

  const gotoPatientDetails = (data) => {
    patientDetails(data);
    setStorage("patientId", data.patientId);
    if (data.computing == 2) {
      const controller = new AbortController();
      controller.abort();
      setStorage("patientId", data.patientId);
      router.push("/reviewer/patients/details");
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
    setPaginationFirst(e.first);
    setPageNo(e.page);
    setPageNumber(e.page);
    setPageSize(e.rows);
  };
  const processstatusBodyTemplate = (rowData) => {
    const declinedDataFromDeclined = extractLatestData(rowData?.declinedNotes);

    switch (rowData.processedStatus) {
      case "COMPLETED":
        return (
          <Popover placement="bottom" title="Status: COMPLETED">
            <span className="patient-status text-center">
              <Image
                src={Completed}
                style={{ height: "30px", width: "30px" }}
              />
            </span>
          </Popover>
        );

      case "PENDING":
        return (
          <Popover placement="bottom" title="Status: PENDING">
            <span className="patient-status text-center">
              <Image src={Pending} style={{ height: "30px", width: "30px" }} />
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
              <Image src={Declined} style={{ height: "30px", width: "30px" }} />
            </span>
          </Popover>
        );
      case "NOTCOMPUTED":
        return (
          <Popover placement="bottom" title="Status: NOT COMPUTED">
            <span className="patient-status text-center">
              <Image src={Pending} style={{ height: "30px", width: "30px" }} />
            </span>
          </Popover>
        );
      case "COMPUTED":
        return (
          <Popover placement="bottom" title="Status: COMPUTED">
            <span className="patient-status text-center">
              <Image src={Pending} style={{ height: "30px", width: "30px" }} />
            </span>
          </Popover>
        );
      case "HOLD":
        return (
          <Popover placement="bottom" title="Status: HOLD">
            <span className="patient-status text-center">
              <Image src={Hold} style={{ height: "30px", width: "30px" }} />
            </span>
          </Popover>
        );
      case "ABORTED_BY_CRON":
        return (
          <Popover placement="bottom" title="Status: ABORTED BY CRON">
            <span className="patient-status text-center">
              <Image src={Abort} style={{ height: "30px", width: "30px" }} />
            </span>
          </Popover>
        );
      case null:
        return (
          <Popover placement="bottom" title="">
            <span className="patient-status text-center">
              <Image src={Pending} style={{ height: "30px", width: "30px" }} />
            </span>
          </Popover>
        );
    }
  };
  const params = {
    pageNo,
    selectedDates,
    paginationFirst,
    sort,
    selectedDates,
    activeFilters,
    searchText,
    selectedOption,
    selectedDateRanges,
    pageNumber,
  };
  const handleTableRowClick = (e) => {
    const targetTd = e.target.closest("td");
    if (targetTd) {
      setStorage("routeBackTo", "/reviewer/patients");
      getRoutedData(params);
      router?.push("/reviewer/patients/details");
      const dataIndex = targetTd.parentElement.rowIndex - 1;
      const clickedData = patinetListAll[dataIndex];
      gotoPatientDetails(clickedData);
    }
  };
  useEffect(() => {
    if (routedData) {
      const {
        pageNo,
        selectedDates,
        selectedDateRanges,
        selectedOption,
        searchText,
        activeFilters,
        pageNumber,
        paginationFirst,
        sort,
      } = routedData;
      setPageNo(pageNo?pageNo:0);
      setSearchText(searchText);
      setSelectedDateRanges(selectedDateRanges);
      setSelectedOption(selectedOption);
      setSelectedDates(selectedDates);
      setActiveFilters(activeFilters);
      setPageNumber(pageNumber);
      setPaginationFirst(paginationFirst);
      setSort(sort);
    }
  }, [routedData]);
console.log(routedData,"paginationFirst")
  const getReviewerApi = async () => {
    const res = await getFilteApi({
      pageNo,
      pageNumber,
      pageSize,
      selectedOption,
      sort: sort?.sort,
      selectedDateRanges,
      searchText: searchText,
    });
    if (res?.status == "SUCCESS") {
      setTotalElements(res.response?.patientDTOList?.totalElements);
      setTrackChart(res?.response?.processStatusCount);
    }
  };
  useEffect(() => {
    setParamsFilter("check");
    if (window !== "undefined" && paramsFilter) {
      getReviewerApi();
    }
  }, [
    selectedOption,
    selectedDateRanges,
    searchText,
    pageSize,
    pageNo,
    paramsFilter,
    sort,
    pageNumber,
  ]);

  useEffect(() => {
    getAllBatchList();
  }, []);
  return (
    <div className={`show `}>
      <Header />
      <div class="content-body">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="">
                <div className="card-body p-0">
                  <div className="table-responsive active-projects task-table">
                    <div className="row">
                      <div className="col-10 ">
                        <ReusableFilters
                        showFilter={true}
                          setActiveFilters={setActiveFilters}
                          setSearchText={setSearchText}
                          searchText={searchText}
                          setSelectedOption={setSelectedOption}
                          selectedOption={selectedOption}
                          setSelectedDateRanges={setSelectedDateRanges}
                          selectedDateRanges={selectedDateRanges}
                          setPageNumber={setPageNumber}
                          FilterItems={commonFilterItems}
                          selectedDates={selectedDates}
                          setSelectedDates={setSelectedDates}
                          activeFilters={activeFilters}
                          setClear={setClear}
                          clear={clear}
                          setPageNo={setPageNo}
                        />
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
                        <TableSkeleton />
                      ) : (
                        <div className="mt-3">
                          <PatientTable
                            handleTableRowClick={handleTableRowClick}
                            pageNumber={pageNumber}
                            patinetListAll={patinetListAll}
                            activeFilters={activeFilters}
                            actionBodyTemplate={actionBodyTemplate}
                            statusBodyTemplate={processstatusBodyTemplate}
                            gotoPatientDetails={gotoPatientDetails}
                            patientDetails={patientDetails}
                            sort={sort}
                            setSort={setSort}
                            getFilteApi={getFilteApi}
                            page={{ pageNo, paginationFirst }}
                            getRoutedData={getRoutedData}
                            bullets={bullets}
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
                        </div>
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
    batchList: state?.tenantAdmin?.patients?.allBatch?.data?.response,
    patinetListAll:
      state?.reviewer?.workQueue?.getReviewerPatients?.data?.response
        ?.patientDTOList?.content,
  }),
  {
    getpatientsListFilter: workqueueActions.patientsAction,
    patientDetails: allActions.getPatientDetails,
    getRoutedData: allPatientSyncAction.getRoutedData,
    getAllBatchList: tenantAdminAction.getAllBatchAction,
    getFilteApi: allActions.getReviewerPatients,
  }
);
export default enhancer(Patient);
