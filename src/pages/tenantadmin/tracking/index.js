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
    Reviewer: null
  });
  const [orgAllList, setOrgAllList] = useState([]);
  const [activeFilters, setActiveFilters] = useState([]);
  const [paramsFilter, setParamsFilter] = useState(null);
  // useEffect(() => {
  //   if (trackingList?.data?.response) {
  //     // setIsLoading(true);
  //     getAllList(trackingList?.data?.response);
  //     // setIsLoading(false);
  //   }
  // }, [parsedData, trackingList, pageNo, pageSize]);

  // const getAllList = (info) => {
  //   if (info) {
  //     var resultMap = [];
  //     var result = info?.patientDTOList?.content;
  //     setTotalElements(info?.patientDTOList?.totalElements);
  //     result?.map((res) => {
  //       resultMap?.push({
  //         patientId: res.patientId,
  //         patientName: res.patientName,
  //         fileName: res.fileName,
  //         computing: res.computing,
  //         createdAt: res.createdAt,
  //         lastModifiedDate: res.lastModifiedDate,
  //         dueDate: res.dueDate,
  //         allocatedBy: res.allocatedBy,
  //         allocatedOn: res.allocatedOn,
  //         priority: res.priority,
  //         processedStatus: res.processedStatus,
  //         processedDate: res.processedDate,
  //         auditedDate: res.auditedDate,
  //         createdAt: res.createdAt,
  //         patientAllocated: res.patientAllocated,
  //         allocatedByFirstName: res.allocatedByFirstName,
  //         allocatedByLastName: res.allocatedByLastName,
  //         auditAllocatedDate: res.auditAllocatedDate,
  //         auditedStatus: res.auditedStatus,
  //         auditAllocatedByFirstName: res.auditAllocatedByFirstName,
  //         auditAllocatedByLastName: res.auditAllocatedByLastName,
  //         patientAllocatedFirstName: res.patientAllocatedFirstName,
  //         patientAllocatedLastName: res.patientAllocatedLastName,
  //         patientAllocatedProfileImage: res.patientAllocatedProfileImage,
  //         auditedAssignedFirstName: res.auditedAssignedFirstName,
  //         auditedAssignedLastName: res.auditedAssignedLastName,
  //         auditedAssignedProfileImage: res.auditedAssignedProfileImage,
  //         allocatedByProfileImage: res.allocatedByProfileImage,
  //         auditAllocatedByProfileImage: res.auditAllocatedByProfileImage,
  //         auditDueDate: res.auditDueDate,
  //         declinedNotes: res.declinedNotes,
  //         auditDeclinedNotes: res.auditDeclinedNotes,
  //       });
  //     });
  //     var newArray = [];
  //     newArray = [...patinetListAll, ...resultMap];
  //     setPatinetListAll(resultMap);

  //     setIsLoading(false);
  //     setTableLoading(false);
  //   }
  // };
  const addPatientFile = (data) => {
    inputValue.patientId = data.patientId;
    inputValue.name = data.patientName;
    inputValue.processStageId = data.processStageId;
    inputValue.patientId = data.patientId;
    // setIsLoadingBtn(false);
  };

  // const gotoPatientDetails = (data) => {
  //   patientDetails({ data: data });
  //   if (data.computing == 2) {
  //     const controller = new AbortController();
  //     const { signal } = controller;
  //     controller.abort();
  //     const params={
  //       pageNo,
  //       dueDateStart,
  //       dueDateEnd,
  //       searchTextValue,
  //       processedStart,
  //       processedEnd,
  //       selAllocatedTo,
  //       selectedOption,
  //       auditedStartDate,
  //       auditedEndDate,
  //       allocatedStartDate,
  //       allocatedEndDate,
  //       selAllocatedBy,
  //       auditedDueStartDate,
  //       auditedDueEndDate,
  //       auditSelectedOption,
  //       selAuditAllocatedBy,
  //       auditSelAllocatedTo,
  //       sort,
  //       clear,
  //       selectOrgList,
  //     }
  //     setStorage("patientId", data.patientId);
  //     setStorage("routeBackTo", "/tenantAdmin/tracking");
  //     getRoutedData(params)
  //     navigate.push("/tenantAdmin/patients/details");
  //   } else {
  //     notification.warning({
  //       message: data.patientId + " file not processed Please wait",
  //     });
  //   }
  // };

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
            <div className="patient-status" style={{ textAlign: "center" }}>
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
            <div className="patient-status" style={{ textAlign: "center" }}>
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
            <div className="patient-status" style={{ textAlign: "center" }}>
              <Image src={Declined} style={{ height: "30px", width: "30px" }} />
            </div>
          </Popover>
        );

      case "NOTCOMPUTED":
        return (
          <Popover placement="bottom" title="Status: NOT COMPUTED">
            <div className="patient-status" style={{ textAlign: "center" }}>
              <Image src={Pending} style={{ height: "30px", width: "30px" }} />
            </div>
          </Popover>
        );
      case "COMPUTED":
        return (
          <Popover placement="bottom" title="Status: PENDING">
            <div className="patient-status" style={{ textAlign: "center" }}>
              <Image src={Pending} style={{ height: "30px", width: "30px" }} />
            </div>
          </Popover>
        );
      case "HOLD":
        return (
          <Popover placement="bottom" title="Status: HOLD">
            <div className="patient-status" style={{ textAlign: "center" }}>
              <Image src={Hold} style={{ height: "30px", width: "30px" }} />
            </div>
          </Popover>
        );
      case "ABORTED_BY_CRON":
        return (
          <Popover placement="bottom" title="Status: ABORTED BY CRON">
            <div className="patient-status" style={{ textAlign: "center" }}>
              <Image src={Abort} style={{ height: "30px", width: "30px" }} />
            </div>
          </Popover>
        );
      case null:
        return (
          <Popover placement="bottom" title="Status: PENDING">
            <div className="patient-status" style={{ textAlign: "center" }}>
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
            <div className="patient-status">
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
            <div className="patient-status">
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
            <div className="patient-status">
              <Image src={ReAudit} style={{ height: "30px", width: "30px" }} />
            </div>
          </Popover>
        );
      case "AUDITED":
        return (
          <Popover placement="bottom" title=" Status: AUDITED">
            <div className="patient-status">
              <Image
                src={AuditedTrack}
                style={{ height: "30px", width: "30px" }}
              />
            </div>
          </Popover>
        );
      case "AUDITED":
        return (
          <div className="patient-status">
            <Image
              src={AuditedTrack}
              style={{ height: "30px", width: "30px" }}
            />
          </div>
        );

      case "NOT_AUDIT":
        return (
          <Popover placement="bottom" title=" Status: NOT AUDIT">
            <div className="patient-status">
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
            <div className="patient-status">
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

  // useEffect(() => {
  //   // if (window !== "undefined") {
  //   //   setIsLoading(true);
  //   //   if (navigate) {
  //   //     setPageNo(navigate?.query?.pageNo ? navigate?.query?.pageNo : 0);
  //   //     setPaginationFirst(
  //   //       navigate?.query?.paginationFirst
  //   //         ? navigate?.query?.paginationFirst
  //   //         : 0
  //   //     );
  //   //   }
  //   // }
  //   // setIsLoading(false);
  //   const encodedVal = JSON.parse(getStorage("TeantAdminTrackingEncodedValue"));
  //   if (encodedVal) {
  //     setPageNo(encodedVal?.pageNo || 0);
  //     setPaginationFirst(encodedVal?.paginationFirst || 0);
  //   }
  // }, []);
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
                        <div className="col-2">
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
                          <div>{renderSkeleton()}</div>
                        ) : (
                          <>
                            <TrackingTable
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
