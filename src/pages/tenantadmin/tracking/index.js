import React, { useState, useEffect } from "react";
import Header from "../../../jsx/layouts/nav/Header";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "react-facebook-loading/dist/react-facebook-loading.css";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { Popover, notification } from "antd";
import { Paginator } from "primereact/paginator";
import HeaderFilters from "./headerFilters";
import TrackingTable from "../../../components/table/tenantTable/trackingList";
import { generateOptionsForNewStore } from "../../../components/headerFilters/functions";
import DailyTask from "./dailytask";
import AuditedTrack from "../../../../src/images/trackingImages/audited.webp";
import NotAudited from "../../../../src/images/trackingImages/notaudited.webp";
import AuditHold from "../../../../src/images/trackingImages/audithold.webp";
import ReAudit from "../../../../src/images/trackingImages/reaudited.webp";
import AuditPending from "../../../../src/images/trackingImages/auditpending.webp";
import Pending from "../../../../src/images/trackingImages/pending.webp";
import Hold from "../../../../src/images/trackingImages/hold.webp";
import Completed from "../../../../src/images/trackingImages/completed.webp";
import Declined from "../../../../src/images/trackingImages/declined.webp";
import AuditedDeclineTrack from "../../../../src/images/trackingImages/auditdeclined.webp";
import Abort from "../../../../src/images/trackingImages/abort.webp";
import Image from "next/image";
import { extractLatestData } from "../../supervisor/auditing";
import { actions as tenantAdminAction } from "../../../stores/tenantAdmin/tracking";
import { actions as tenantUserAdminAction } from "../../../stores/tenantAdmin/users";
import { renderSkeleton } from "../../../components/reuseableFunctions";
import { getStorage, setStorage } from "../../../utils/storages";
import { actions as allActions } from "../../../stores/admin/patientAllocation";
import { actions as workFlowActions } from "../../../stores/admin/workqueue";
import { actions as allPatientSyncAction } from "../../../stores/tenantAdmin/patientSync";
import TableSkeleton from "../../../components/skeleton/table";
const bullets = [
  {
    title: "Processed Status",
    option: [
      {
        color: "#0078D4",
        name: "PENDING",
      },
      {
        color: "#3C0AD2",
        name: "HOLD",
      },
      {
        color: "#EB5252",
        name: "DECLINED",
      },
      {
        color: "#00BC13",
        name: "COMPLETED",
      },
    ],
  },
];
const badges = [
  {
    title: "Audited Status",
    option: [
      {
        color: "#4AA1AB",
        name: "Audited",
      },
      {
        color: "#964B00",
        name: "Re Audit",
      },
      {
        color: "#EBAE00",
        name: "Audit Hold",
      },
      {
        color: "#BD3A79",
        name: "Audit Pending",
      },
      {
        color: "#C21807",
        name: "Audit Declined",
      },
      {
        color: "#EC8E27",
        name: "Not Audit",
      },
    ],
  },
];

const statusOptions = [
  { label: "COMPLETED", value: "COMPLETED", status: 2 },
  { label: "PENDING", value: "PENDING", status: 0 },
  { label: "DECLINED", value: "DECLINED", status: 0 },
  { label: "HOLD", value: "HOLD", status: 0 },
  // { label: "ABORTED BY CRON", value: "ABORTED_BY_CRON" },
];

const auditStatusOptions = [
  { label: "AUDITHOLD", value: "AUDITHOLD", status: 2 },
  { label: "REAUDIT", value: "REAUDIT", status: 0 },
  { label: "AUDIT_PENDING", value: "AUDIT_PENDING", status: 0 },
  { label: "NOT_AUDIT", value: "NOT_AUDIT", status: 0 },
  { label: "AUDITED", value: "AUDITED", status: 0 },
  { label: "AUDIT DECLINED", value: "AUDIT_DECLINED", status: 0 },
];

const Patient = ({
  getAllOrganizationList,
  organizationList,
  getAllTrackingList,
  trackingList,
  loader,
  filteredList,
  getFilters,
  patientDetails,
  patientAllocatedFilters,
  auditAssignedFilters,
  allocatedByFilters,
  getPatientAllocatedList,
  getAuditAssignedList,
  getAllocatedByList,
  getRoutedData,
  routedData,
}) => {
  const navigate = useRouter();
  const [searchTextValue, setSearchTextValue] = useState("");
  const inputValue = {
    year: "",
    name: "",
    patientId: "",
    processStageId: "",
    patientId: "",
  };
  const [pageNo, setPageNo] = useState(0);
  const [paginationFirst, setPaginationFirst] = useState(0);
  const [sortAuditOrder, setSortAuditOrder] = useState("DESC");
  const [sortDueOrder, setSortDueOrder] = useState("DESC");
  const [sortAuditDueOrder, setSortAuditDueOrder] = useState("DESC");
  const [allocatedSortOrder, setAllocatedSortOrder] = useState("DESC");
  const [sort, setSort] = useState({ sortDir: "", sortField: "" });
  const [clear, setClear] = useState(false);
  const [selectedDates, setSelectedDates] = useState();
  const [selectedDateRange, setSelectedDateRange] = useState({});
  const [selectedOptions, setSelectedOptions] = useState({
    Supervisor: null,
    Reviewer: null,
  });
  const [orgAllList, setOrgAllList] = useState([]);
  const [activeFilters, setActiveFilters] = useState([]);
  const [paramsFilter, setParamsFilter] = useState(null);

  const processstatusBodyTemplate = (rowData) => {
    const declinedDataFromAudit = extractLatestData(
      rowData?.auditDeclinedNotes
    );

    const declinedDataFromDeclined = extractLatestData(rowData?.declinedNotes);

    const declinedData = declinedDataFromAudit || declinedDataFromDeclined;

    switch (rowData.processedStatus) {
      case "COMPLETED":
        return (
          <Popover placement="bottom" title="Status: COMPLETED">
            <div
              className="patient-status"
              id="tracking-completed"
              name="tracking-completed"
              style={{ textAlign: "center" }}
            >
              <Image
                src={Completed}
                style={{ height: "30px", width: "30px" }}
              />
            </div>
          </Popover>
        );

      case "PENDING":
        return (
          <Popover placement="bottom" title="Status: PENDING">
            <div
              className="patient-status"
              id="tracking-pending"
              name="tracking-pending"
              style={{ textAlign: "center" }}
            >
              <Image src={Pending} style={{ height: "30px", width: "30px" }} />
            </div>
          </Popover>
        );

      case "DECLINED":
        return (
          <Popover
            placement="bottom"
            title="Status: DECLINED"
            content={`Reason: ${declinedData ? declinedData : "---"}`}
          >
            <div
              className="patient-status"
              id="tracking-declined"
              name="tracking-declined"
              style={{ textAlign: "center" }}
            >
              <Image src={Declined} style={{ height: "30px", width: "30px" }} />
            </div>
          </Popover>
        );

      case "NOTCOMPUTED":
        return (
          <Popover placement="bottom" title="Status: NOT COMPUTED">
            <div
              className="patient-status"
              id="tracking-notComputed"
              name="tracking-notComputed"
              style={{ textAlign: "center" }}
            >
              <Image src={Pending} style={{ height: "30px", width: "30px" }} />
            </div>
          </Popover>
        );
      case "COMPUTED":
        return (
          <Popover placement="bottom" title="Status: PENDING">
            <div
              className="patient-status"
              id="tracking-computed"
              name="tracking-computed"
              style={{ textAlign: "center" }}
            >
              <Image src={Pending} style={{ height: "30px", width: "30px" }} />
            </div>
          </Popover>
        );
      case "HOLD":
        return (
          <Popover placement="bottom" title="Status: HOLD">
            <div
              className="patient-status"
              id="tracking-hold"
              name="tracking-hold"
              style={{ textAlign: "center" }}
            >
              <Image src={Hold} style={{ height: "30px", width: "30px" }} />
            </div>
          </Popover>
        );
      case "ABORTED_BY_CRON":
        return (
          <Popover placement="bottom" title="Status: ABORTED BY CRON">
            <div
              className="patient-status"
              id="tracking-abort"
              name="tracking-abort"
              style={{ textAlign: "center" }}
            >
              <Image src={Abort} style={{ height: "30px", width: "30px" }} />
            </div>
          </Popover>
        );
      case null:
        return (
          <Popover placement="bottom" title="Status: PENDING">
            <div
              className="patient-status"
              id="tracking-null"
              name="tracking-null"
              style={{ textAlign: "center" }}
            >
              <Image src={Pending} style={{ height: "30px", width: "30px" }} />
            </div>
          </Popover>
        );
    }
  };

  const auditstatusBodyTemplate = (rowData) => {
    const declinedDataFromAudit = extractLatestData(
      rowData?.auditDeclinedNotes
    );

    const declinedDataFromDeclined = extractLatestData(
      rowData?.auditDeclinedNotes
    );

    const declinedData = declinedDataFromAudit || declinedDataFromDeclined;
    switch (rowData.auditedStatus) {
      case "AUDIT_PENDING":
        return (
          <Popover placement="bottom" title="Status: AUDIT PENDING">
            <div
              id="tracking-auditPending"
              name="tracking-auditPending"
              className="patient-status"
            >
              <Image
                src={AuditPending}
                style={{ height: "30px", width: "30px" }}
              />
            </div>
          </Popover>
        );

      case "AUDITHOLD":
        return (
          <Popover placement="bottom" title=" Status: AUDIT HOLD">
            <div
              id="tracking-auditHold"
              name="tracking-auditHold"
              className="patient-status"
            >
              <Image
                src={AuditHold}
                // className={styles.ImgTrck}
                style={{ height: "30px", width: "30px" }}
              />
            </div>
          </Popover>
        );
      case "REAUDIT":
        return (
          <Popover placement="bottom" title=" Status: REAUDIT">
            <div
              id="tracking-reAudit"
              name="tracking-reAudit"
              className="patient-status"
            >
              <Image src={ReAudit} style={{ height: "30px", width: "30px" }} />
            </div>
          </Popover>
        );
      case "AUDITED":
        return (
          <Popover placement="bottom" title=" Status: AUDITED">
            <div
              id="tracking-audited"
              name="tracking-audited"
              className="patient-status"
            >
              <Image
                src={AuditedTrack}
                style={{ height: "30px", width: "30px" }}
              />
            </div>
          </Popover>
        );
      case "NOT_AUDIT":
        return (
          <Popover placement="bottom" title=" Status: NOT AUDIT">
            <div
              id="tracking-notAudit"
              name="tracking-notAudit"
              className="patient-status"
            >
              <Image
                src={NotAudited}
                style={{ height: "30px", width: "30px" }}
              />
            </div>
          </Popover>
        );
      case "AUDIT_DECLINED":
        return (
          <Popover
            placement="bottom"
            title=" Status: AUDIT DECLINED"
            content={`Reason: ${declinedData ? declinedData : "---"}`}
          >
            <div
              id="tracking-auditDeclined"
              name="tracking-auditDeclined"
              className="patient-status"
            >
              <Image
                src={AuditedDeclineTrack}
                style={{ height: "30px", width: "30px" }}
              />
            </div>
          </Popover>
        );
      case null:
        return <div className="patient-status">---</div>;
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
    setPaginationFirst(e.first);
    setPageNo(e.page);
    // getAllList(response?.response);
  };

  useEffect(() => {
    if (!organizationList?.response) {
      getAllOrganizationList();
    }
  }, []);

  useEffect(() => {
    var orgListArray = [];
    organizationList?.response?.map((res) => {
      orgListArray.push({
        value: res.id,
        label: res.name,
      });
    });
    setOrgAllList(orgListArray);
  }, [organizationList]);

  useEffect(() => {
    if (!organizationList?.response) {
      getAllOrganizationList();
    }
  }, []);

  useEffect(() => {
    var orgListArray = [];
    organizationList?.response?.map((res) => {
      orgListArray.push({
        value: res.id,
        label: res.name,
      });
    });
    setOrgAllList(orgListArray);
  }, [organizationList]);
  useEffect(() => {
    if (routedData) {
      setParamsFilter("check");
      setPageNo(routedData?.pageNo);
      setPaginationFirst(routedData?.paginationFirst);
      setSearchTextValue(routedData?.searchTextValue);
      setSelectedDateRange(routedData?.selectedDateRange);
      setSelectedDates(routedData?.selectedDates);
      setSelectedOptions(routedData?.selectedOptions);
      setSort(routedData?.sort);
      setClear(routedData?.clear);
      setActiveFilters(
        routedData?.activeFilters ? routedData?.activeFilters : activeFilters
      );
    }
  }, []);
  useEffect(() => {
    setParamsFilter("check");
    if (window !== "undefined" && paramsFilter) {
      const data = {
        pageNo,
        dueDateStart: clear
          ? ""
          : selectedDateRange?.ReviewedDate?.startDate || "",
        dueDateEnd: clear ? "" : selectedDateRange?.ReviewedDate?.endDate || "",
        searchTextValue: clear ? "" : searchTextValue || "",
        selectedOption: clear ? "" : selectedOptions?.ProcessedStatus || "",
        // processedStart: clear ? "" : "",
        // processedEnd: clear ? "" : "",
        selAllocatedTo: clear ? "" : selectedOptions?.Reviewer || "",
        auditedStartDate: clear
          ? ""
          : selectedDateRange?.AuditAllocatedDate?.startDate || "",
        auditedEndDate: clear
          ? ""
          : selectedDateRange?.AuditAllocatedDate?.endDate || "",
        allocatedStartDate: clear
          ? ""
          : selectedDateRange?.AllocatedDate?.startDate || "",
        allocatedEndDate: clear
          ? ""
          : selectedDateRange?.AllocatedDate?.endDate || "",
        selAllocatedBy: clear ? "" : selectedOptions?.AllocatedBy || "",
        auditedDueStartDate: clear
          ? ""
          : selectedDateRange?.AuditedDate?.startDate || "",
        auditedDueEndDate: clear
          ? ""
          : selectedDateRange?.AuditedDate?.endDate || "",
        auditSelectedOption: clear ? "" : selectedOptions?.AuditStatus || "",
        selAuditAllocatedBy: clear
          ? ""
          : selectedOptions?.AuditAllocatedBy || "",
        auditSelAllocatedTo: clear ? "" : selectedOptions?.Supervisor || "",
        sort,
        selectOrgId: clear ? "" : selectedOptions?.Organization || "",
      };
      getAllTrackingList(data);
      getFilters({ field: "auditAllocatedBy" });
      getPatientAllocatedList({ field: "patientAllocated" });
      getAuditAssignedList({ field: "auditedAssigned" });
      getAllocatedByList({ field: "allocatedBy" });
    }
    // setIsLoading(false);
  }, [
    pageNo,
    searchTextValue,
    sort,
    clear,
    selectedDateRange,
    selectedOptions,
    paramsFilter,
  ]);

  return (
    <>
      <div className={`show `}>
        <Header />
        <div class="content-body">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12">
                <div className="">
                  <div className="card-body p-0">
                    <div className="table-responsive active-projects task-table">
                      <div className="tbl-caption row d-flex ">
                        <div
                          className="tbl-caption2 col-xl-10 align-items-center"
                          style={{ padding: "20px 0px 20px 20px" }}
                        >
                          <HeaderFilters
                            auditallocatedToOptoons={generateOptionsForNewStore(
                              auditAssignedFilters?.data?.response
                            )}
                            setSearch={setSearchTextValue}
                            isSearch={true}
                            search={searchTextValue}
                            selectOptions={statusOptions}
                            allocatedToOptoons={generateOptionsForNewStore(
                              patientAllocatedFilters?.data?.response
                            )}
                            allocatedByOptoons={generateOptionsForNewStore(
                              allocatedByFilters?.data?.response
                            )}
                            // defaultAllocatedBy={"All"}
                            bullets={bullets}
                            isNextRow={true}
                            defaultShow={true}
                            defaultSize={"col-2"}
                            auditAllocatedByOptoons={generateOptionsForNewStore(
                              filteredList?.data?.response
                            )}
                            orgAllList={orgAllList}
                            setClear={setClear}
                            clear={clear}
                            selectedDates={selectedDates}
                            selectedDateRange={selectedDateRange}
                            setSelectedDateRange={setSelectedDateRange}
                            setSelectedDates={setSelectedDates}
                            selectedOptions={selectedOptions}
                            setSelectedOptions={setSelectedOptions}
                            setPageNo={setPageNo}
                            getRoutedData={getRoutedData}
                            auditStatusOptions={auditStatusOptions}
                            activeFilters={activeFilters}
                            setActiveFilters={setActiveFilters}
                            searchTextValue={searchTextValue}
                          />
                        </div>
                        <div className="col-xl-2 col-sm-3">
                          <DailyTask
                            trackChart={trackingList?.processStatusCount}
                          />
                        </div>
                      </div>

                      <div
                        id="task-tbl_wrapper"
                        className="dataTables_wrapper no-footer"
                      >
                        {loader ? (
                          <div>
                            {" "}
                            <TableSkeleton />
                          </div>
                        ) : (
                          <>
                            <TrackingTable
                              bullets={bullets}
                              badges={badges}
                              patinetListAll={
                                trackingList?.patientDTOList?.content
                              }
                              actionBodyTemplate={actionBodyTemplate}
                              statusBodyTemplate={processstatusBodyTemplate}
                              auditBodyTemplate={auditstatusBodyTemplate}
                              // gotoPatientDetails={gotoPatientDetails}
                              patientDetails={patientDetails}
                              setSortOrder={setAllocatedSortOrder}
                              sortOrder={allocatedSortOrder}
                              setSort={setSort}
                              page={{
                                pageNo,
                                paginationFirst,
                                selectedDates,
                                selectedDateRange,
                                selectedOptions,
                                searchTextValue,
                                sort,
                                clear,
                                activeFilters,
                              }}
                              loader={loader}
                              sortAuditOrder={sortAuditOrder}
                              setSortAuditOrder={setSortAuditOrder}
                              sortDueOrder={sortDueOrder}
                              setSortDueOrder={setSortDueOrder}
                              sortAuditDueOrder={sortAuditDueOrder}
                              setSortAuditDueOrder={setSortAuditDueOrder}
                            />
                            <div>
                              <div className="pagination-container">
                                <Paginator
                                  id="tracking-paginator"
                                  name="tracking-paginator"
                                  first={pageNo === 0 ? 0 : paginationFirst}
                                  rows={15}
                                  totalRecords={
                                    trackingList?.patientDTOList?.totalElements
                                  }
                                  onPageChange={onPageChange}
                                />
                                <div className="total-pages">
                                  Total count:{" "}
                                  {trackingList?.patientDTOList?.totalElements}
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
    organizationList: state?.tenantAdmin?.users?.allOrganization?.data,
    trackingList: state?.tenantAdmin?.tracking?.allTracking?.data?.response,
    loader: state?.tenantAdmin?.tracking?.allTrackingLoader,
    filteredList: state.admin.patientAllocate?.filtersList,
    patientAllocatedFilters:
      state.admin.patientAllocate.patientAllocatedFilters,
    auditAssignedFilters: state.admin.patientAllocate.auditAssignedFilters,
    allocatedByFilters: state.admin.patientAllocate.allocatedByFilters,
    routedData: state.tenantAdmin?.patientSync?.routedData,
  }),
  {
    getAllOrganizationList: tenantUserAdminAction.getAllOrganizationAction,
    getAllTrackingList: tenantAdminAction.getAllTrackingAction,
    getFilters: allActions.getFiltersList,
    getPatientAllocatedList: allActions.getPatientAllocatedList,
    getAuditAssignedList: allActions.getAuditAssignedList,
    getAllocatedByList: allActions.getAllocatedByList,
    patientDetails: workFlowActions.getPatientDetails,
    getRoutedData: allPatientSyncAction.getRoutedData,
  }
);
export default enhancer(Patient);
