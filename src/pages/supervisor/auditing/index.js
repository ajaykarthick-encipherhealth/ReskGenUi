import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Paginator } from "primereact/paginator";
import { Popover, notification } from "antd";
import "react-facebook-loading/dist/react-facebook-loading.css";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import Header from "../../../jsx/layouts/nav/Header";
import dayjs from "dayjs";
import PatientTable from "../table/PatientList/patientList";
import {
  generateOptionsListSupervisor,
  priorityOptions,
} from "../../../components/headerFilters/functions";
import AuditedTrack from "../../../../src/images/trackingImages/audited.webp";
import NotAudited from "../../../../src/images/trackingImages/notaudited.webp";
import AuditHold from "../../../../src/images/trackingImages/audithold.webp";
import ReAudit from "../../../../src/images/trackingImages/reaudited.webp";
import AuditPending from "../../../../src/images/trackingImages/auditpending.webp";
import AuditeDeclineTrack from "../../../../src/images/trackingImages/auditdeclined.webp";
import { actions as allActions } from "../../../stores/supervisor/auditedQueue";
import { actions as allPatientSyncAction } from "../../../stores/tenantAdmin/patientSync";
import { actions as supervisorActions } from "../../../stores/supervisor/auditedQueue";
import { actions as tenantAdminAction } from "../../../stores/tenantAdmin/patients";
import Image from "next/image";
import { patientDetails } from "../../../stores/authflow/actions";
import { renderSkeleton } from "../../../components/reuseableFunctions";
import { getStorage, setStorage } from "../../../utils/storages";
import { getResponePopup } from "../../../utils/reusable";
import ReusableFilters from "../../../components/reusableFilters";

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
const bullets = [
  {
    color: "#377880",
    name: "AUDITED",
  },
  {
    color: "#c33772",
    name: "AUDIT PENDING",
  },
  {
    color: "#964B00",
    name: "RE AUDIT",
  },

  {
    color: "#CE9900",
    name: "AUDIT HOLD",
  },
  {
    color: "#C21807",
    name: "AUDIT DECLINED",
  },
];

const statusOptions = [
  { label: "AUDITED", value: "AUDITED" },
  { label: "AUDIT PENDING", value: "AUDIT_PENDING" },
  { label: "RE AUDIT", value: "REAUDIT" },
  { label: "AUDIT HOLD", value: "AUDITHOLD" },
  { label: "AUDIT DECLINED", value: "AUDIT_DECLINED" },
];
export const commonFilterItems = [
  {
    id: "0001",
    title: "Search",
    type: "search",
    value: null,
    placeholder: "Search",
    header: "Patient Name / ID",
    active: true,
  },
  {
    id: "0002",
    title: "Reviewer",
    type: "select",
    value: null,
    placeholder: "Reviewer",
    options: null,
    active: false,
  },
  {
    id: "0003",
    title: "Status",
    type: "select",
    value: null,
    placeholder: "Audited Status",
    options: statusOptions,
    active: false,
  },
  {
    id: "0004",
    title: "auditedDate",
    type: "rangePicker",
    value: null,
    placeholder: "Audited Date",
    pickerType: "year",
    active: false,
  },
  {
    id: "0005",
    title: "auditedDueDate",
    type: "rangePicker",
    value: null,
    placeholder: "Audited Due Date",
    pickerType: "year",
    active: false,
  },
  {
    id: "006",
    title: "batch",
    type: "select",
    value: null,
    showSearch: true,
    placeholder: "Batch",
    options: null,
    active: false,
  },
  {
    id: "0007",
    title: "Priority",
    type: "select",
    value: null,
    placeholder: "Priority",
    options: null,
    active: false,
  },
];

const Patient = ({
  getWorkListFilter,
  response,
  loader,
  filteredList,
  getFilters,
  routedData,
  getRoutedData,
  supervisorPriority,
  getAllBatchList,
  batchList,
  getAuditQueue,
  auditiQueueList,
  patinetListAll,
}) => {
  const router = useRouter();
 
  const [sort, setSort] = useState({
    auditAllocatedDate: {
      sortDir: "DESC",
      sortField: "auditAllocatedDate",
    },
    auditDueDate: {
      sortDir: "DESC",
      sortField: "auditDueDate",
    },
    auditedDate: {
      sortDir: "DESC",
      sortField: "auditedDate",
    },
    sort: { sortDir: "DESC", sortField: "" },
  });
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [paginationFirst, setPaginationFirst] = useState(0);
  const [totalElements, setTotalElements] = useState(10);
  const [clear, setClear] = useState(false);
  const [activeFilters, setActiveFilters] = useState(commonFilterItems);
  const [paramsFilter, setParamsFilter] = useState(null);
  const [priority, setPriority] = useState(null);
  const [searchText, setSearchText] = useState(null);
  const [selectedOption, setSelectedOption] = useState({});
  const [selectedDateRanges, setSelectedDateRanges] = useState({});
  const [selectedDates, setSelectedDates] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);

  const addPatientFile = (data) => {
    inputValue.patientId = data.patientId;
    inputValue.name = data.patientName;
    inputValue.processStageId = data.processStageId;
    inputValue.patientId = data.patientId;
    setValidated(false);
    setAddPatient(true);
    setIsLoadingBtn(false);
  };

  const processstatusBodyTemplate = (rowData) => {
    const declinedDataFromAudit = extractLatestData(
      rowData?.auditDeclinedNotes
    );
    const declinedDataFromDeclined = extractLatestData(rowData?.declinedNotes);
    const declinedData = declinedDataFromAudit || declinedDataFromDeclined;
    switch (rowData.auditedStatus) {
      case "AUDIT_PENDING":
        return (
          <Popover placement="bottom" title="Status: AUDIT PENDING">
            <span className="patient-status" style={{ textAlign: "center" }}>
              <Image
                src={AuditPending}
                style={{ height: "30px", width: "30px" }}
              />
            </span>
          </Popover>
        );

      case "AUDITHOLD":
        return (
          <Popover placement="bottom" title="Status: AUDIT HOLD">
            <span className="patient-status" style={{ textAlign: "center" }}>
              <Image
                src={AuditHold}
                style={{ height: "30px", width: "30px" }}
              />
            </span>
          </Popover>
        );
      case "REAUDIT":
        return (
          <Popover placement="bottom" title="Status: REAUDIT">
            <span className="patient-status" style={{ textAlign: "center" }}>
              <Image src={ReAudit} style={{ height: "30px", width: "30px" }} />
            </span>
          </Popover>
        );
      case "AUDITED":
        return (
          <Popover placement="bottom" title="Status: AUDITED">
            <span className="patient-status" style={{ textAlign: "center" }}>
              <Image
                src={AuditedTrack}
                style={{ height: "30px", width: "30px" }}
              />
            </span>
          </Popover>
        );
      case "AUDIT_DECLINED":
        return (
          <Popover
            placement="bottom"
            title="Status: AUDIT DECLINED"
            content={`Reason: ${declinedData ? declinedData : "---"}`}
          >
            <span className="patient-status" style={{ textAlign: "center" }}>
              <Image
                src={AuditeDeclineTrack}
                style={{ height: "30px", width: "30px" }}
              />
            </span>
          </Popover>
        );
      case "AUDITED":
        return (
          <span className="patient-status" style={{ textAlign: "center" }}>
            <Image
              src={AuditedTrack}
              style={{ height: "30px", width: "30px" }}
            />
          </span>
        );
      case "NOT_AUDIT":
        return (
          <Popover placement="bottom" title=" Status: NOT AUDIT">
            <span className="patient-status" style={{ textAlign: "center" }}>
              <Image
                src={NotAudited}
                style={{ height: "30px", width: "30px" }}
              />
            </span>
          </Popover>
        );
      case null:
        return (
          <span className="patient-status" style={{ textAlign: "center" }}>
            ---
          </span>
        );
    }
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="d-flex ">
        <button
          onClick={() => addPatientFile(rowData)}
          className="btn hegiht10 btn-primary shadow  sharp me-1 action-btn"
        >
          <FontAwesomeIcon icon={faUpload} fontSize={11} />
        </button>
      </div>
    );
  };
  const gotoPatientDetails = (data) => {
    if (data.computing == 2) {
      const controller = new AbortController();
      const { signal } = controller;
      controller.abort();
      setStorage("patientId", data.patientId);
      router.push("/supervisor/patients/details");
    } else {
      notification.warning({
        message: data.patientId + " file not processed Please wait",
      });
    }
  };

  const handleTableRowClick = (e) => {
    const targetTd = e.target.closest("td");
    if (targetTd) {
      setStorage("routeBackTo", "/supervisor/auditing");
      getRoutedData(params);
      router?.push("/supervisor/patients/details");
      const dataIndex = targetTd.parentElement.rowIndex - 1;
      const clickedData = patinetListAll[dataIndex];
      gotoPatientDetails(clickedData);
    }
  };

  const onPageChange = (e) => {
    setPaginationFirst(e.first);
    setPageNo(e.page);
    setPageSize(e.rows);
  };

  const handlePriorityChange = async (
    patientId,
    selectedValue,
    lastModifiedDate
  ) => {
    const res = await supervisorPriority({
      patientId: patientId,
      year: dayjs(lastModifiedDate).format("YYYY"),
      priority: selectedValue,
    });
    getResponePopup(res);
    setPriority({ selectedValue: selectedValue, patientId: patientId });
    if (res.status === "SUCCESS") {
      auditQueue();
      setParamsFilter("check");
    }
  };

  const auditQueue = async () => {
    const res = await getAuditQueue({
      pageNo,
      pageNumber,
      pageSize,
      selectedOption,
      sort: sort?.sort,
      selectedDateRanges,
      searchText: searchText,
    });
    if (res?.status == "SUCCESS") {
      setTotalElements(res.response?.totalElements);
    }
  };

  useEffect(() => {
    setParamsFilter("check");
    if (window !== "undefined" && paramsFilter) {
      auditQueue();
      getFilters({ field: "patientAllocated" });
      getAllBatchList();
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
  const opt = {
    Status: statusOptions,
    Priority: priorityOptions,
    Reviewer: generateOptionsListSupervisor(filteredList),
    batch: batchList?.response?.map((item) => ({
      value: item?.id,
      label: `${item?.name}`,
    })),
  };
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
                    <div>
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
                    <div
                      id="task-tbl_wrapper"
                      className="dataTables_wrapper no-footer"
                    >
                      {loader ? (
                        renderSkeleton()
                      ) : (
                        <div className="mt-3">
                          <PatientTable
                            auditiQueueList={auditiQueueList}
                            bullets={bullets}
                            patinetListAll={patinetListAll}
                            actionBodyTemplate={actionBodyTemplate}
                            statusBodyTemplate={processstatusBodyTemplate}
                            handleTableRowClick={handleTableRowClick}
                            patientDetails={patientDetails}
                            sort={sort}
                            setSort={setSort}
                            page={{ pageNo, paginationFirst }}
                            setActiveFilters={setActiveFilters}
                            activeFilters={activeFilters}
                            getRoutedData={getRoutedData}
                            params={{
                              pageNo,
                              paginationFirst,
                              selectedDates,
                              selectedOption,
                              searchText,
                              selectedDateRanges,
                              sort,
                              activeFilters,
                              pageNumber,
                            }}
                            getWorkListFilter={getWorkListFilter}
                            handlePriorityChange={handlePriorityChange}
                            priority={priority}
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

const connector = connect(
  (state) => ({
    response: state.supervisor?.audited?.filteredList,
    filteredList: state.supervisor?.audited?.filterUsers,
    loader: state.supervisor?.audited?.loading,
    routedData: state.tenantAdmin?.patientSync?.routedData,
    batchList: state?.tenantAdmin?.patients?.allBatch?.data,
    patinetListAll:
      state?.supervisor?.audited?.auditQueue?.data?.response?.content,
  }),
  {
    getWorkListFilter: allActions.getWorkListFilter,
    getFilters: allActions.getFilterUsers,
    getRoutedData: allPatientSyncAction.getRoutedData,
    supervisorPriority: supervisorActions.getPriorityChange,
    getAllBatchList: tenantAdminAction.getAllBatchAction,
    getAuditQueue: allActions.getAuditQueueList,
  }
);
export default connector(Patient);
