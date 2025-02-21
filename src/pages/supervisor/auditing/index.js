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
import { generateOptionsListSupervisor } from "../../../components/headerFilters/functions";
import AuditedTrack from "../../../../src/images/trackingImages/audited.webp";
import NotAudited from "../../../../src/images/trackingImages/notaudited.webp";
import AuditHold from "../../../../src/images/trackingImages/audithold.webp";
import ReAudit from "../../../../src/images/trackingImages/reaudited.webp";
import AuditPending from "../../../../src/images/trackingImages/auditpending.webp";
import AuditeDeclineTrack from "../../../../src/images/trackingImages/auditdeclined.webp";
import { actions as allActions } from "../../../stores/supervisor/auditedQueue";
import { actions as allPatientSyncAction } from "../../../stores/tenantAdmin/patientSync";
import { actions as supervisorActions } from '../../../stores/supervisor/auditedQueue'
import { actions as tenantAdminAction } from "../../../stores/tenantAdmin/patients";

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
import Image from "next/image";
import { patientDetails } from "../../../stores/authflow/actions";
import { renderSkeleton } from "../../../components/reuseableFunctions";
import { getStorage, setStorage } from "../../../utils/storages";
import Filters, { allFilters } from "./filters";
import moment from "moment";
import {
  getResponePopup,
  getSpacesWithUnderscoresAuditing,

} from "../../../utils/reusable";
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
}) => {
  const navigate = useRouter();
  const [validated, setValidated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingBtn, setIsLoadingBtn] = useState(true);
  const [addPatient, setAddPatient] = useState(false);
  const [addPatientId, setAddPatientId] = useState(false);
  const [completedStartDate, setCompletedStartDate] = useState("");
  const [completedEndDate, setCompletedEndDate] = useState("");
  const [computedStartDate, setComputedStartDate] = useState("");
  const [computedEndDate, setComputedEndDate] = useState("");
  const [selectedOption, SetSelectedOption] = useState("");
  const [patientSortOrder, setPatientSortOrder] = useState("ASC");
  const [sort, setSort] = useState({ sortDir: "", sortField: "" });
  const [selecteddates2, setSelectedDate2s] = useState([]);
  const [inputValue, setInputValue] = useState({
    year: "",
    name: "",
    patientId: "",
    processStageId: "",
    patientId: "",
  });
  const [selAllocatedBy, setSelAllocatedBy] = useState("");
  const [patinetListAll, setPatinetListAll] = useState([]);
  const [tenantId, setTenantId] = useState("");
  const [localOrgId, setLocalOrgId] = useState("");
  const [localUserId, setLocalUserId] = useState("");
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [paginationFirst, setPaginationFirst] = useState(0);
  const [totalElements, setTotalElements] = useState(10);
  const [tableLoading, setTableLoading] = useState(true);
  const [parsedData, setParsedData] = useState([]);
  const [search, setSearch] = useState("");
  const [selCreatedBy, setSelCreatedBy] = useState("");
  const [selectedDates, setSelectedDates] = useState([]);
  const [selectedDateRange, setSelectedDateRange] = useState([]);
  const [sortDueOrder, setSortDueOrder] = useState("DESC");
  const [sortCompleteOrder, setSortCompleteOrder] = useState("DESC");
  const [sortAuditOrder, setSortAuditOrder] = useState("DESC");
  const [clear, setClear] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);
  const [paramsFilter, setParamsFilter] = useState(null);
  const [priority, setPriority] = useState(null);
  const [selectBatchList, setSelectedBatchList] = useState(null);
  const [batchAllList, setBatchAllList] = useState([]);
  const[selectedPriority,setSelectedPriority]=useState(null)
  const getAllList = () => {
    if (response) {
      let resultMap = [];
      let result = response?.data?.response?.content;
      setTotalElements(response?.data?.response?.totalElements);
      result?.map((res) => {
        resultMap.push({
          patientId: res.patientId,
          patientName: res.patientName,
          fileName: res.fileName,
          computing: res.computing,
          createdAt: res.createdAt,
          lastModifiedDate: res.lastModifiedDate,
          dueDate: res.dueDate,
          allocatedBy: res.allocatedBy,
          allocatedOn: res.allocatedOn,
          priority: res.priority,
          processedStatus: res.processedStatus,
          processedDate: res.processedDate,
          auditedStatus: res.auditedStatus,
          patientAllocated: res.patientAllocated,
          auditAllocatedDate: res.auditAllocatedDate,
          auditDueDate: res.auditDueDate,
          auditedDate: res.auditedDate,
          patientAllocatedFirstName: res.patientAllocatedFirstName,
          patientAllocatedLastName: res.patientAllocatedLastName,
          patientAllocatedProfileImage: res.patientAllocatedProfileImage,
          auditAllocatedByFirstName: res.auditAllocatedByFirstName,
          auditAllocatedByLastName: res.auditAllocatedByLastName,
          auditAllocatedByProfileImage: res.auditAllocatedByProfileImage,
          declinedNotes: res.declinedNotes,
          auditDeclinedNotes: res.auditDeclinedNotes,
          accuracyScore: res.accuracyScore,
        });
      });
      let newArray = [];
      newArray = [...patinetListAll, ...resultMap];
      setPatinetListAll(resultMap);
      setIsLoading(false);
      setTableLoading(false);
    }
  };

  const addPatientFormId = () => {
    setValidated(false);
    setAddPatientId(true);
  };

  const addPatientFile = (data) => {
    inputValue.patientId = data.patientId;
    inputValue.name = data.patientName;
    inputValue.processStageId = data.processStageId;
    inputValue.patientId = data.patientId;
    setValidated(false);
    setAddPatient(true);
    setIsLoadingBtn(false);
  };

  const gotoPatientDetails = (data) => {
    if (data.computing == 2) {
      const controller = new AbortController();
      const { signal } = controller;
      controller.abort();
      setStorage("patientId", data.patientId);
      navigate.push("/supervisor/patients/details");
    } else {
      notification.warning({
        message: data.patientId + " file not processed Please wait",
      });
    }
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

  const onPageChange = (e) => {
    setIsLoading(true);
    setPaginationFirst(e.first);
    setPageNo(e.page);
    setPageSize(e.rows);
    setTableLoading(true);
  };

  useEffect(() => {
    let tenId = getStorage("tenantId");
    let orgId = getStorage("orgId");
    setTenantId(tenId);
    setLocalOrgId(orgId);
    setLocalUserId(uId);
    const uId = getStorage("user");
    setParamsFilter("check");
    const data = {
      pageNo: "",
      auditDueDateStart: clear
        ? ""
        : selectedDateRange?.AuditedDueDate?.startDate || "",
      auditDueDateEnd: clear
        ? ""
        : selectedDateRange?.AuditedDueDate?.endDate || "",
      selectedOption: clear ? "" : selectedOption,
      search: clear ? "" : search,
      auditDateStart: clear
        ? ""
        : selectedDateRange?.AuditedDate?.startDate || "",
      auditDateEnd: clear ? "" : selectedDateRange?.AuditedDate?.endDate || "",
      sort,
      selCreatedBy: clear ? "" : selCreatedBy,
      selectBatchList: clear ? "" : selectBatchList,
      priority:clear ? "" : selectedPriority||""
    };
    if (window !== "undefined" && paramsFilter) {
      getWorkListFilter({ data: data });
      getFilters({ field: "patientAllocated" });
      getAllBatchList();
    }
  }, [
    pageNo,
    selectedOption,
    search,
    selectedDateRange,
    sort,
    selCreatedBy,
    paramsFilter,
    selectBatchList,
    selectedPriority
  ]);
  useEffect(() => {
    if (response?.data?.response?.content) {
      getAllList();
    }
  }, [parsedData, response, pageNo, pageSize]);
  useEffect(() => {
    if (routedData) {
      const dates = routedData?.selectedDates ? routedData?.selectedDates : [];
      const AuditedDate = dates?.AuditedDate?.map((date) => dayjs(date));
      const AuditedDueDate = dates?.AuditedDueDate?.map((date) => dayjs(date));

      setParamsFilter("check");
      setSelectedDates(
        routedData?.selectedDates ? routedData?.selectedDates : []
      );
      setSelectedDateRange(
        routedData?.selectedDateRange ? routedData?.selectedDateRange : ""
      );
      SetSelectedOption(
        routedData?.selectedOption
          ? getSpacesWithUnderscoresAuditing(routedData?.selectedOption)
          : ""
      );
      setSearch(routedData?.search ? routedData?.search : "");
      setSelCreatedBy(routedData?.selCreatedBy ? routedData?.selCreatedBy : "");
      setPageNo(routedData?.pageNo ? routedData?.pageNo : 0);
      setPaginationFirst(
        routedData?.paginationFirst ? routedData?.paginationFirst : 0
      );
      setActiveFilters(
        routedData?.activeFilters ? routedData?.activeFilters : []
      );
      setSelectedBatchList(routedData?.selectBatchList || "");
      setSelectedPriority(routedData?.selectedPriority||null)
    }
  }, []);

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
      let tenId = getStorage("tenantId");
      let orgId = getStorage("orgId");
      setTenantId(tenId);
      setLocalOrgId(orgId);
      setLocalUserId(uId);
      const uId = getStorage("user");
      setParamsFilter("check");
      const data = {
        pageNo: "",
        auditDueDateStart: clear
          ? ""
          : selectedDateRange?.AuditedDueDate?.startDate || "",
        auditDueDateEnd: clear
          ? ""
          : selectedDateRange?.AuditedDueDate?.endDate || "",
        selectedOption: clear ? "" : selectedOption,
        search: clear ? "" : search,
        auditDateStart: clear
          ? ""
          : selectedDateRange?.AuditedDate?.startDate || "",
        auditDateEnd: clear
          ? ""
          : selectedDateRange?.AuditedDate?.endDate || "",
        sort,
        selCreatedBy: clear ? "" : selCreatedBy,
        selectBatchList: clear ? "" : selectBatchList,
        priority:clear ? "" : selectedPriority||""
      };
      if (window !== "undefined" && paramsFilter) {
        getWorkListFilter({ data: data });
      }
    }
  };
  useEffect(() => {
    var batchListArray = [];
    batchList?.response?.map((res) => {
      batchListArray.push({
        value: res.id,
        label: res.name,
      });
    });
    setBatchAllList(batchListArray);
  }, [batchList]);
  useEffect(() => {
    if (!batchList?.response) {
      getAllBatchList();
    }
  }, []);
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
                      <Filters
                        setSearch={setSearch}
                        selectedOption={selectedOption}
                        // isSearch={true}
                        searchlabel="Search By Patient ID / Name"
                        search={search}
                        // select status
                        selectlabel="Select Audited Status"
                        // isSelector={true}
                        setSelectedOption={SetSelectedOption}
                        selectOptions={statusOptions}
                        defaultSelectValue1={"Select Status"}
                        // computation date
                        pickerlabel="Audit Due Date"
                        defaultStartDate={""}
                        defaultEndDate={""}
                        setStartDate={setComputedStartDate}
                        setEndDate={setComputedEndDate}
                        isRangePicker={true}
                        selectedDates={selectedDates}
                        setSelectedDates={setSelectedDates}
                        // completed date
                        pickerlabe2="Audited Date"
                        defaultStartDate2={""}
                        defaultEndDate2={""}
                        setStartDate2={setCompletedStartDate}
                        setEndDate2={setCompletedEndDate}
                        // isAnotherPicker={true}
                        defaultAllocateTo={"All"}
                        selectedDates2={selecteddates2}
                        setSelectedDates2={setSelectedDate2s}
                        // created by
                        isNextCreatedBySelector={true}
                        createdTolabel="Reviewer"
                        optionKey="patientAllocated"
                        createdByOptoons={generateOptionsListSupervisor(
                          filteredList
                        )}
                        setSelCreatedBy={setSelCreatedBy}
                        selCreatedBy={selCreatedBy}
                        addUser={false}
                        addUserForm={addPatientFormId}
                        bullets={bullets}
                        setPageNo={setPageNo}
                        defaultCreatedBy={"Select Reviewer"}
                        // selectBatch
                        setSelectedOptionBatch={setSelectedBatchList}
                        selectOptionsBatch={batchAllList}
                        defaultSelectValueBatch={""}
                        selectedValueBatch={selectBatchList}
                        selectlabelBatch="Select Batch"
                        isSelectBatch={true}
                        batchValue={selectBatchList}
                        // isNextRow={true}
                        clear={clear}
                        activeFilters={activeFilters}
                        setActiveFilters={setActiveFilters}
                        setClear={setClear}
                        setSelectedDateRange={setSelectedDateRange}
                        selectedDateRange={selectedDateRange}
                        searchVal={search}
                        setSearchVal={setSearch}
                        getRoutedData={getRoutedData}
                        // priority
                        setSelectedPriority={setSelectedPriority}
                        selectedPriority={selectedPriority}
                        setSelectedBatchList={setSelectedBatchList}
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
                            bullets={bullets}
                            patinetListAll={patinetListAll}
                            actionBodyTemplate={actionBodyTemplate}
                            statusBodyTemplate={processstatusBodyTemplate}
                            gotoPatientDetails={gotoPatientDetails}
                            patientDetails={patientDetails}
                            sort={sort}
                            setSort={setSort}
                            page={{ pageNo, paginationFirst }}
                            sortDueOrder={sortDueOrder}
                            setSortDueOrder={setSortDueOrder}
                            sortCompleteOrder={sortCompleteOrder}
                            setSortCompleteOrder={setSortCompleteOrder}
                            sortAuditOrder={sortAuditOrder}
                            setSortAuditOrder={setSortAuditOrder}
                            setActiveFilters={setActiveFilters}
                            activeFilters={activeFilters}
                            getRoutedData={getRoutedData}
                            params={{
                              pageNo,
                              selectedDates,
                              selectedOption,
                              search,
                              selectedDateRange,
                              sort,
                              selCreatedBy,
                              activeFilters,
                              selectedPriority,
                              selectBatchList
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
  }),
  {
    getWorkListFilter: allActions.getWorkListFilter,
    getFilters: allActions.getFilterUsers,
    getRoutedData: allPatientSyncAction.getRoutedData,
    supervisorPriority: supervisorActions.getPriorityChange,
    getAllBatchList: tenantAdminAction.getAllBatchAction,
  }
);
export default connector(Patient);
