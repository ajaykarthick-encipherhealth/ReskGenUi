import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import "react-facebook-loading/dist/react-facebook-loading.css";
import { notification } from "antd";
import { Paginator } from "primereact/paginator";
import Header from "../../../jsx/layouts/nav/Header";
import { actions as workqueueActions } from "../../../stores/reviewer/workqueue";
import { actions as tenantAdminAction } from "../../../stores/tenantAdmin/patients";
import { priorityOptions } from "../../../components/headerFilters/functions";
import DailyTask from "./dailytask";
import { setStorage } from "../../../utils/storages";
import { actions as allActions } from "../../../stores/reviewer/workqueue";
import { actions as allPatientSyncAction } from "../../../stores/tenantAdmin/patientSync";
import ReusableFilters from "../../../components/reusableFilters";
import AppTable from "../../../components/tables";

export const bullets = [
  {
    color: "#5da9e4",
    name: "PENDING",
  },
  {
    color: "#EB5252",
    name: "DECLINED",
  },
  {
    color: "#00BC13",
    name: "COMPLETED",
  },
  { color: "#3C0AD2", name: "HOLD" },
];
export const reviewedBullets = [
  {
    color: "#EB5252",
    name: "DECLINED",
  },
  {
    color: "#00BC13",
    name: "COMPLETED",
  },
];
export const statusOptions = [
  { label: "COMPLETED", value: "COMPLETED" },
  { label: "PENDING", value: "PENDING" },
  { label: "DECLINED", value: "DECLINED" },
  { label: "HOLD", value: "HOLD" },
];
export const commonFilterItems = [
  {
    id: "01",
    title: "Search",
    type: "search",
    value: null,
    placeholder: "Search",
    header: "Patient Name / ID",
    active: true,
  },
  {
    id: "02",
    title: "Status",
    type: "select",
    value: null,
    placeholder: "Status",
    options: null,
    active: false,
  },
  {
    id: "03",
    title: "dueDate",
    type: "rangePicker",
    value: null,
    placeholder: "Due Date",
    pickerType: "year",
    active: false,
  },
  {
    id: "04",
    title: "completedDate",
    type: "rangePicker",
    value: null,
    placeholder: "Completed  Date",
    pickerType: "year",
    active: false,
  },
  {
    id: "05",
    title: "allocatedDate",
    type: "rangePicker",
    value: null,
    placeholder: "Allocated  Date",
    pickerType: "year",
    active:false
  },
  {
    id: "06",
    title: "Priority",
    type: "select",
    value: null,
    placeholder: "Priority",
    options: null,
    active: false,
  },
  {
    id: "07",
    title: "batch",
    type: "select",
    value: null,
    placeholder: "Batch",
    showSearch: true,
    options: null,
    active: false,
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
  const columns = [
    {
      name: "Patient Id",
      value: "patientId",
    },
    {
      name: "Batch Name",
      value: "batchName",
    },
    {
      name: "File Name",
      value: "fileName",
    },
    {
      name: "HCC Count",
      value: "validDiseaseCount",
    },
    {
      name: "Allocated Date",
      value: "allocatedOn",
      sortable: true,
      isDate: true,
    },
    {
      name: "Due Date",
      value: "dueDate",
      sortable: true,
      isDate: true,
    },
    {
      name: "Completed Date",
      value: "processedDate",
      sortable: true,
      isDate: true,
    },

    {
      name: "Allocated By",
      sortable: true,
      isImage: true,
      value: {
        first: "allocatedByFirstName",
        last: "allocatedBylastName",
        img: "allocatedByProfileImage",
      },
    },
    {
      name: "Priority",
      value: "priority",
    },
    { name: "STATUS", value: "processedStatus", status: true, infoIcon: true },
  ];
  const router = useRouter();
  const [activeFilters, setActiveFilters] = useState(commonFilterItems);
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
  const [totalElements, setTotalElements] = useState("");
  const [clear, setClear] = useState(false);
  const [paramsFilter, setParamsFilter] = useState(null);

  const gotoPatientDetails = (data) => {
    patientDetails(data);
    setStorage("patientId", data.patientId);
    if (data.computing == 2) {
      const controller = new AbortController();
      controller.abort();
      setStorage("patientId", data.patientId);
      setStorage("routeBackTo", "/reviewer/patients");
      getRoutedData(params);
      router.push("/reviewer/patients/details");
    } else {
      notification.warning({
        message: data.patientId + " file not processed Please wait",
      });
    }
  };

  const onPageChange = (e) => {
    setPaginationFirst(e.first);
    setPageNo(e.page);
    setPageNumber(e.page);
    setPageSize(e.rows);
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
      setPageNo(pageNo ? pageNo : 0);
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

  const getReviewerApi = async () => {
    const res = await getFilteApi({
      pageNo,
      pageNumber,
      pageSize,
      selectedOption,
      sort: sort,
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
  const opt = {
    batch: batchList?.map((item) => ({
      value: item?.id,
      label: `${item?.name}`,
    })),
    Status: statusOptions,
    Priority: priorityOptions,
  };
  return (
    <div className={`show `}>
      <Header />
      <div className="content-body">
        <div className="container-fluid table-responsive active-projects task-table">
          <div className="row">
            <div className="col-10">
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
                FilterItems={activeFilters}
                selectedDates={selectedDates}
                setSelectedDates={setSelectedDates}
                activeFilters={activeFilters}
                setClear={setClear}
                clear={clear}
                setPageNo={setPageNo}
                opt={opt}
              />
            </div>
            <div className="col-2 mt-1 mb-1">
              <DailyTask trackChart={trackChart} />
            </div>
          </div>
          <div className="mt-3">
            <AppTable
              data={patinetListAll?.content}
              column={columns}
              loader={loading}
              onRowClick={gotoPatientDetails}
              pagination={false}
              setSort={setSort}
              sort={sort}
              first={pageNo === 0 ? 0 : paginationFirst}
              totalRecords={totalElements}
              row={15}
              onPageChange={onPageChange}
            />
            <div>
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
        ?.patientDTOList,
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
