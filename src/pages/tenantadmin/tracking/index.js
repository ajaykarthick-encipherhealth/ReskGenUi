import React, { useState, useEffect } from "react";
import Header from "../../../jsx/layouts/nav/Header";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "react-facebook-loading/dist/react-facebook-loading.css";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { Popover } from "antd";
import { Paginator } from "primereact/paginator";
import TrackingTable from "../../../components/table/tenantTable/trackingList";
import {
  generateOptionsForNewStore,
  priorityOptions,
} from "../../../components/headerFilters/functions";
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
import { actions as allActions } from "../../../stores/admin/patientAllocation";
import { actions as workFlowActions } from "../../../stores/admin/workqueue";
import { actions as allPatientSyncAction } from "../../../stores/tenantAdmin/patientSync";
import TableSkeleton from "../../../components/skeleton/table";
import ReusableFilters from "../../../components/reusableFilters";
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
        name: "AUDITED",
      },
      {
        color: "#BD3A79",
        name: "AUDIT PENDING",
      },
      {
        color: "#964B00",
        name: "RE AUDIT",
      },
      {
        color: "#FFEBAD",
        name: "AUDIT HOLD",
      },
      {
        color: "#C21807",
        name: "AUDIT DECLINED",
      },
      {
        color: "#E69021",
        name: "NOT AUDIT",
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
  const commonFilterItems = [
    {
      id: 1,
      title: "Search",
      type: "search",
      value: null,
      placeholder: "Search",
      pickerType: "search",
      header: "Patient Name / ID",
    },
    {
      id: 2,
      title: "Reviewer",
      type: "select",
      value: null,
      placeholder: "Reviewer",
      options: generateOptionsForNewStore(
        patientAllocatedFilters?.data?.response
      ),
    },
    {
      id: 3,
      title: "supervisor",
      type: "select",
      value: null,
      placeholder: "Supervisor",
      options: generateOptionsForNewStore(auditAssignedFilters?.data?.response),
    },
    {
      id: 4,
      title: "allocatedDate",
      type: "rangePicker",
      value: null,
      placeholder: "Allocated  Date",
      pickerType: "year",
    },
    {
      id: 5,
      title: "auditAllocatedDate",
      type: "rangePicker",
      value: null,
      placeholder: "Audit Allocated  Date",
      pickerType: "year",
    },
    {
      id: 6,
      title: "processedStatus",
      type: "select",
      value: null,
      placeholder: " Processed Status",
      options: statusOptions,
    },
    {
      id: 7,
      title: "auditStatus",
      type: "select",
      value: null,
      placeholder: " Audit Status",
      options: auditStatusOptions,
    },
    {
      id: 8,
      title: "reviewedDate",
      type: "rangePicker",
      value: null,
      placeholder: "Reviewed Date",
      pickerType: "year",
    },
    {
      id: 9,
      title: "auditedDate",
      type: "rangePicker",
      value: null,
      placeholder: "Audited Date",
      pickerType: "year",
    },
    {
      id: 10,
      title: "allocatedBy",
      type: "select",
      value: null,
      placeholder: "Allocated By",
      options: generateOptionsForNewStore(allocatedByFilters?.data?.response),
    },
    {
      id: 11,
      title: "auditAllocatedBy",
      type: "select",
      value: null,
      placeholder: "Audit Allocated By",
      options: generateOptionsForNewStore(filteredList?.data?.response),
    },
    {
      id: 12,
      title: "organization",
      type: "select",
      value: null,
      placeholder: "Organization",
      options: organizationList?.response?.map((item) => ({
        value: item?.id,
        label: `${item?.name}`,
      })),
    },
    {
      id: 13,
      title: "priority",
      type: "select",
      value: null,
      placeholder: "Priority",
      options: priorityOptions,
    },
  ];
  const [pageNo, setPageNo] = useState(0);
  const [paginationFirst, setPaginationFirst] = useState(0);
  const [sort, setSort] = useState({
    allocatedOn: {
      sortDir: "DESC",
      sortField: "allocatedOn",
    },
    dueDate: {
      sortDir: "DESC",
      sortField: "dueDate",
    },
    auditAllocatedDate: {
      sortDir: "DESC",
      sortField: "auditAllocatedDate",
    },
    auditDueDate: {
      sortDir: "DESC",
      sortField: "auditDueDate",
    },
    sort: { sortDir: "DESC", sortField: "" },
  });
  const [clear, setClear] = useState(false);
  const [orgAllList, setOrgAllList] = useState([]);
  const [activeFilters, setActiveFilters] = useState([
    "Search"
  ]);
  const [paramsFilter, setParamsFilter] = useState(null);
  const [searchText, setSearchText] = useState(null);
  const [selectedOption, setSelectedOption] = useState({});
  const [selectedDateRanges, setSelectedDateRanges] = useState({});
  const [selectedDates, setSelectedDates] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);

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
  };

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

  useEffect(() => {
    setParamsFilter("check");
    if (paramsFilter === "check") {
      getAllTrackingList({
        pageNo,
        pageNumber,
        selectedOption,
        sort: sort?.sort,
        selectedDateRanges,
        searchText: searchText,
      });
    }
  }, [
    pageNo,
    searchText,
    sort,
    selectedDateRanges,
    selectedOption,
    paramsFilter,
  ]);

  useEffect(() => {
    getFilters({ field: "auditAllocatedBy" });
    getPatientAllocatedList({ field: "patientAllocated" });
    getAuditAssignedList({ field: "auditedAssigned" });
    getAllocatedByList({ field: "allocatedBy" });
  }, []);

  return (
    <div className={`show `}>
      <Header />
      <div className="content-body">
        <div className="container-fluid">
          <div className="table-responsive active-projects task-table">
            <div className="row ">
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
              <div className="col-2 d-flex align-items-center justify-content-center">
                <div className="row">
                  <DailyTask trackChart={trackingList?.processStatusCount} />
                </div>
              </div>
            </div>

            <div id="task-tbl_wrapper" className="dataTables_wrapper no-footer">
              {loader ? (
                <div>
                  {" "}
                  <TableSkeleton />
                </div>
              ) : (
                <div div className="mt-3">
                  <TrackingTable
                    patinetListAll={trackingList?.patientDTOList?.content}
                    actionBodyTemplate={actionBodyTemplate}
                    statusBodyTemplate={processstatusBodyTemplate}
                    auditBodyTemplate={auditstatusBodyTemplate}
                    patientDetails={patientDetails}
                    setSort={setSort}
                    page={{
                      pageNo,
                      paginationFirst,
                      selectedDates,
                      selectedDateRanges,
                      selectedOption,
                      searchText,
                      sort,
                      clear,
                      activeFilters,
                    }}
                    loader={loader}
                    bullets={bullets}
                    badges={badges}
                    sort={sort}
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
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
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