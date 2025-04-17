import React, { useState, useEffect } from "react";
import Header from "../../../jsx/layouts/nav/Header";
import { connect } from "react-redux";
import "react-facebook-loading/dist/react-facebook-loading.css";
import { notification } from "antd";
import {
  generateOptionsForNewStore,
  priorityOptions,
} from "../../../components/headerFilters/functions";
import DailyTask from "./dailytask";
import { actions as tenantAdminAction } from "../../../stores/tenantAdmin/tracking";
import { actions as tenantUserAdminAction } from "../../../stores/tenantAdmin/users";
import { actions as allActions } from "../../../stores/admin/patientAllocation";
import { actions as workFlowActions } from "../../../stores/admin/workqueue";
import { actions as allPatientSyncAction } from "../../../stores/tenantAdmin/patientSync";
import ReusableFilters from "../../../components/reusableFilters";
import AppTable from "../../../components/tables";
import { getStorage, setStorage } from "../../../utils/storages";
import { useRouter } from "next/router";
import { actions as tableAction } from "../../../stores/tableView";
import { getResponePopup } from "../../../utils/reusable";

const statusOptions = [
  { label: "COMPLETED", value: "COMPLETED", status: 2 },
  { label: "PENDING", value: "PENDING", status: 0 },
  { label: "DECLINED", value: "DECLINED", status: 0 },
  { label: "HOLD", value: "HOLD", status: 0 },
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
  getTableData,
  data,
  tableDynamicColumn,
  tableDynamicColumnReset,
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
      active: true,
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
      active: false,
    },
    {
      id: 3,
      title: "supervisor",
      type: "select",
      value: null,
      placeholder: "Supervisor",
      options: generateOptionsForNewStore(auditAssignedFilters?.data?.response),
      active: false,
    },
    {
      id: 4,
      title: "allocatedDate",
      type: "rangePicker",
      value: null,
      placeholder: "Allocated  Date",
      pickerType: "year",
      active: false,
    },
    {
      id: 5,
      title: "auditAllocatedDate",
      type: "rangePicker",
      value: null,
      placeholder: "Audit Allocated  Date",
      pickerType: "year",
      active: false,
    },
    {
      id: 6,
      title: "processedStatus",
      type: "select",
      value: null,
      placeholder: " Processed Status",
      options: statusOptions,
      active: false,
    },
    {
      id: 7,
      title: "auditStatus",
      type: "select",
      value: null,
      placeholder: " Audit Status",
      options: auditStatusOptions,
      active: false,
    },
    {
      id: 8,
      title: "reviewedDate",
      type: "rangePicker",
      value: null,
      placeholder: "Reviewed Date",
      pickerType: "year",
      active: false,
    },
    {
      id: 9,
      title: "auditedDate",
      type: "rangePicker",
      value: null,
      placeholder: "Audited Date",
      pickerType: "year",
      active: false,
    },
    {
      id: 10,
      title: "allocatedBy",
      type: "select",
      value: null,
      placeholder: "Allocated By",
      options: generateOptionsForNewStore(allocatedByFilters?.data?.response),
      active: false,
    },
    {
      id: 11,
      title: "auditAllocatedBy",
      type: "select",
      value: null,
      placeholder: "Audit Allocated By",
      options: generateOptionsForNewStore(filteredList?.data?.response),
      active: false,
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
      active: false,
    },
    {
      id: 13,
      title: "priority",
      type: "select",
      value: null,
      placeholder: "Priority",
      options: priorityOptions,
      active: false,
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
  const columns = [
    {
      name: "Patients",
      value: "patientId",
    },
    {
      name: "Allocated By | Date",
      value1: {
        first: "allocatedByFirstName",
        last: "allocatedByLastName",
        img: "allocatedByProfileImage",
      },
      value: "allocatedOn",
      clumpseTwoFields: true,
      sortable: true,
    },
    {
      name: "Reviewer | Date",
      value1: {
        first: "patientAllocatedFirstName",
        last: "patientAllocatedLastName",
        img: "patientAllocatedProfileImage",
      },
      clumpseTwoFields: true,
      value: "processedDate",
      sortable: true,
    },
    {
      name: "Audit Allocated By | Date",
      value1: {
        first: "auditAllocatedByFirstName",
        last: "auditAllocatedByLastName",
        img: "auditAllocatedByProfileImage",
      },
      value: "auditAllocatedDate",
      clumpseTwoFields: true,
      sortable: true,
    },
    {
      name: "Supervisor",
      value: {
        first: "auditedAssignedFirstName",
        last: "auditedAssignedLastName",
        img: "auditedAssignedProfileImage",
      },
      isImage: true,
    },
    {
      name: "Audited Date",
      value: "auditedDate",
      sortable: true,
      isDate: true,
    },
    {
      name: "Priority",
      value: "priority",
    },
    {
      name: " PROCESSED STATUS",
      value: "processedStatus",
      status: true,
      infoIcon: true,
    },
    {
      name: "Audited STATUS",
      value: "auditedStatus",
      auditedStatus: true,
      infoIcon: true,
    },
  ];
  const navigate = useRouter();
  const [clear, setClear] = useState(false);
  const [orgAllList, setOrgAllList] = useState([]);
  const [activeFilters, setActiveFilters] = useState(commonFilterItems);
  const [paramsFilter, setParamsFilter] = useState(null);
  const [searchText, setSearchText] = useState(null);
  const [selectedOption, setSelectedOption] = useState({});
  const [selectedDateRanges, setSelectedDateRanges] = useState({});
  const [selectedDates, setSelectedDates] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [open, setOpen] = useState(false);
  const [test, setTest] = useState(data?.response?.metaDataDTO);

  const onPageChange = (e) => {
    setPaginationFirst(e.first);
    setPageNo(e.page);
  };
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  const handleSubmit = async () => {
    const payload = {
      pageId: "ea046971-08de-4ee2-bf47-10c62c0eaa18",
      headerNames: test
        .filter((col) => col.active)
        .map((col) => col.actualField),
    };

    try {
      const response = await tableDynamicColumn({ payload });
      if (response?.status === "SUCCESS") {
        getAllTracking();
        onClose();
        getResponePopup(response);
      }
    } catch (error) {
      getResponePopup(error?.response);
    }
  };
  const handleReset = async () => {
    const payload = {
      pageId: "ea046971-08de-4ee2-bf47-10c62c0eaa18",
    };

    try {
      const response = await tableDynamicColumnReset({ payload });
      if (response?.status === "SUCCESS") {
        getAllTracking();
        onClose();
        getResponePopup(response);
      }
    } catch (error) {
      getResponePopup(error?.response);
    }
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
  const page = {
    pageNo,
    paginationFirst,
    selectedDates,
    selectedDateRanges,
    selectedOption,
    searchText,
    sort,
    clear,
    activeFilters,
  };
  const gotoPatientDetails = (data) => {
    patientDetails(data);
    if (data.computing === 2) {
      const controller = new AbortController();
      const { signal } = controller;
      controller.abort();
      setStorage("patientId", data?.patientId);
      var role = getStorage("userRole");
      if (role == "tenant_admin") {
        setStorage("patientId", data.patientId);
        setStorage("routeBackTo", "/tenantadmin/tracking");
        getRoutedData(page);
        navigate.push("/tenantadmin/tracking/details");
      } else {
        navigate.push({
          pathname: "/admin/patients/details",
        });
      }
    } else {
      notification.warning({
        message: data.patientId + " file not processed. Please wait.",
      });
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
  const getAllTracking = async () => {
    const response = await getTableData({
      pageId: "ea046971-08de-4ee2-bf47-10c62c0eaa18",
      pageNo,
      pageSize: 15,
      roleId: "",
    });
  };
  useEffect(() => {
    setParamsFilter("check");
    if (paramsFilter === "check") {
      // getAllTrackingList({
      //   pageNo,
      //   pageNumber,
      //   selectedOption,
      //   sort: sort,
      //   selectedDateRanges,
      //   searchText: searchText,
      // });
      getAllTracking();
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

  const opt = {
    Reviewer: generateOptionsForNewStore(
      patientAllocatedFilters?.data?.response
    ),
    supervisor: generateOptionsForNewStore(
      auditAssignedFilters?.data?.response
    ),
    processedStatus: statusOptions,
    auditStatus: auditStatusOptions,
    allocatedBy: generateOptionsForNewStore(allocatedByFilters?.data?.response),
    auditAllocatedBy: generateOptionsForNewStore(filteredList?.data?.response),
    organization: organizationList?.response?.map((item) => ({
      value: item?.id,
      label: `${item?.name}`,
    })),
    priority: priorityOptions,
  };
  return (
    <div className={`show `}>
      <Header />
      <div className="content-body">
        <div className="container-fluid">
          <div className="table-responsive active-projects task-table">
            <div className="row p-3 ">
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
                  FilterItems={activeFilters}
                  selectedDates={selectedDates}
                  setSelectedDates={setSelectedDates}
                  activeFilters={activeFilters}
                  setClear={setClear}
                  clear={clear}
                  setPageNo={setPageNo}
                  opt={opt}
                  //customize table
                  open={open}
                  onClose={onClose}
                  selectedColumns={test}
                  setSelectedColumns={setTest}
                  commonFilterItems={commonFilterItems}
                  showCustomizeTable={true}
                  showDrawer={showDrawer}
                  handleSubmit={handleSubmit}
                  handleReset={handleReset}
                />
              </div>
              <div className="col-2 d-flex align-items-center justify-content-center">
                <div className="row">
                  <DailyTask trackChart={trackingList?.processStatusCount} />
                </div>
              </div>
            </div>

            <div id="task-tbl_wrapper" className="dataTables_wrapper no-footer">
              <div className="mt-3">
                <AppTable
                  data={data?.response?.pageResponse?.content}
                  column={data?.response?.metaDataDTO.filter(
                    (item) => item.active
                  )}
                  loader={loader}
                  onRowClick={gotoPatientDetails}
                  pagination={false}
                  setSort={setSort}
                  sort={sort}
                  tableId="tracking_table"
                  first={pageNo === 0 ? 0 : paginationFirst}
                  totalRecords={data?.response?.pageResponse?.totalElements}
                  row={15}
                  onPageChange={onPageChange}
                />
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
    organizationList: state?.tenantAdmin?.users?.allOrganization?.data,
    trackingList: state?.tenantAdmin?.tracking?.allTracking?.data?.response,
    loader: state?.tenantAdmin?.tracking?.allTrackingLoader,
    filteredList: state.admin.patientAllocate?.filtersList,
    patientAllocatedFilters:
      state.admin.patientAllocate.patientAllocatedFilters,
    auditAssignedFilters: state.admin.patientAllocate.auditAssignedFilters,
    allocatedByFilters: state.admin.patientAllocate.allocatedByFilters,
    routedData: state.tenantAdmin?.patientSync?.routedData,
    data: state?.tableView?.tableView?.data,
    tableLoader: state?.tableView?.tableViewLoading,
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
    getTableData: tableAction.tableViewAction,
    tableDynamicColumn: tableAction.tableDynamicColumn,
    tableDynamicColumnReset: tableAction.tableDynamicColumnReset,
  }
);
export default enhancer(Patient);
