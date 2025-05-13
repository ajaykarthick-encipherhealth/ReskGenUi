import React, { useState, useEffect } from "react";
import Header from "../../../jsx/layouts/nav/Header";
import { useRouter } from "next/router";
import "react-facebook-loading/dist/react-facebook-loading.css";
import {
  Button,
  Form,
} from "antd";
import {  PlusCircleFilled } from "@ant-design/icons";
import { actions as tenantAdminAction } from "../../../stores/tenantAdmin/patients";
import { connect } from "react-redux";
import { getStorage, setStorage } from "../../../utils/storages";
import { findItemWithTrueKey, findMatchesByField, getResponePopup } from "../../../utils/reusable";
import { actions as allocationAction } from "../../../stores/admin/patientAllocation";
import { actions as allActions } from "../../../stores/admin/workqueue";
import ReusableFilters from "../../../components/reusableFilters";
import AppTable from "../../../components/tables";
import { actions as allPatientSyncAction } from "../../../stores/tenantAdmin/patientSync";
import { actions as workflowActions } from "../../../stores/reviewer/workqueue";
import { actions as tableAction } from "../../../stores/tableView";


const GeneratedReports = ({
  allPatientList,
  webSocketData,
  tableLoader,

  getFilters,
  routedData,
  getRoutedData,
  getAllFlags,
  getTableData,
  data,
  tableDynamicColumn,
  tableDynamicColumnReset,
  pageLoad,
}) => {
  const [sort, setSort] = useState({
    computedDate: {
      sortDir: "DESC",
      sortField: "computedDate",
    },
    createdDate: {
      sortDir: "DESC",
      sortField: "createdDate",
    },
    sort: { sortDir: "DESC", sortField: "" },
  });
  const [form] = Form.useForm();
  const navigate = useRouter();
  const [tenantId, setTenantId] = useState("");
  const [localOrgId, setLocalOrgId] = useState("");
  const [localUserId, setLocalUserId] = useState("");
  const [pageNo, setPageNo] = useState(0);
  const [paginationFirst, setPaginationFirst] = useState(0);
  const [paramsFilter, setParamsFilter] = useState(null);
  const [clear, setClear] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);
  const [searchText, setSearchText] = useState(null);
  const [selectedOption, setSelectedOption] = useState({});
  const [selectedDateRanges, setSelectedDateRanges] = useState({});
  const [selectedDates, setSelectedDates] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [statusUpdateWebSocket, setStatusUpdateWebSocket] = useState();
  const [open, setOpen] = useState(false);
  const [test, setTest] = useState(data?.response?.metaDataDTO);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isFilter, setIsFilter] = useState(true);

  const onPageChange = (e) => {
    setPaginationFirst(e.first);
    setPageNo(e.page);
    setPageNumber(e.page);
  };

  const onClose = () => {
    setOpen(false);
  };
  const showDrawer = () => {
    setTest(data?.response?.metaDataDTO);
    setOpen(true);
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

  

  const getPatients = async () => {
    const tin = getStorage("tinNumber");
    const userId = getStorage("userId");
    let pageId = "d80f80fd-aab8-496e-a9fc-89677d5ac174";

    if (navigate.pathname === "/tenantadmin/project") {
      pageId = "c41d4ea9-6da4-495c-84f4-95b25d6c13b4";
    }

    const response = await getTableData({
      pageId,
      pageNo,
      pageSize: 15,
      roleId: "",
      tin,
      patientAllocated: userId,
      isAdmin: true,
      selectedOption,
      selectedDateRanges,
      searchText,
      sort,
    });
  };

  useEffect(() => {
    setParamsFilter("check");
    let tenId = getStorage("tenantId");
    let uId = getStorage("userId");
    let orgId = getStorage("orgId");
    setTenantId(tenId);
    setLocalOrgId(orgId);
    setLocalUserId(uId);
    if (paramsFilter === "check") {
      getPatients();
    }
  }, [
    pageNo,
    selectedOption,
    searchText,
    selectedDateRanges,
    sort,
    paramsFilter,
    pageLoad,
  ]);
  useEffect(() => {
    getFilters({ field: "createdBy" });
  }, []);
 
  const handleSubmitInsert = async (data) => {
    setIsSubmitting(true);
    let pageId = "d80f80fd-aab8-496e-a9fc-89677d5ac174";

    if (navigate.pathname === "/tenantadmin/project") {
      pageId = "c41d4ea9-6da4-495c-84f4-95b25d6c13b4";
    }
    const payload = {
      pageId,
      headerNames: data.map((col) => col.id),
    };

    try {
      const response = await tableDynamicColumn({ payload });
      if (response?.status === "SUCCESS") {
        setIsFilter(true);
        getPatients();
        onClose();
        getResponePopup(response);
      }
      setIsSubmitting(false);
    } catch (error) {
      getResponePopup(error?.response);
    }
  };
  const handleReset = async () => {
    setIsResetting(true);
    let pageId = "d80f80fd-aab8-496e-a9fc-89677d5ac174";

    if (navigate.pathname === "/tenantadmin/project") {
      pageId = "c41d4ea9-6da4-495c-84f4-95b25d6c13b4";
    }
    const payload = {
      pageId,
    };
    try {
      const response = await tableDynamicColumnReset({ payload });
      if (response?.status === "SUCCESS") {
        getPatients();
        onClose();
        getResponePopup(response);
      }
      setIsResetting(false);
    } catch (error) {
      getResponePopup(error?.response);
    }
  };
  useEffect(() => {
    if (webSocketData && webSocketData?.webSocketType == "PATIENT_COMPUTE") {
      const patientData =
        allPatientList?.data?.response?.patientDtoList?.content;
      let foundItem = patientData?.find(
        (x) => x.patientId == webSocketData.patientId
      );
      if (foundItem) {
        foundItem.computing = webSocketData?.computing;
        if (webSocketData?.computedDate) {
          foundItem.computedDate = webSocketData?.computedDate;
        }
      }
      setStatusUpdateWebSocket(patientData);
    } else {
      setStatusUpdateWebSocket(
        allPatientList?.data?.response?.patientDtoList?.content
      );
    }
  }, [webSocketData, allPatientList]);

  useEffect(() => {
    const handleBackButton = (event) => {
      getRoutedData(routedData);
    };
    window.addEventListener("popstate", handleBackButton);
    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, [navigate, routedData]);
  useEffect(() => {
    getAllFlags();
    setTest(data?.response?.metaDataDTO);
  }, []);

    useEffect(() => {
      if (
        (isFilter && data?.response?.metaDataDTO) ||
        !findMatchesByField(activeFilters, data?.response?.metaDataDTO)
      ) {
        setActiveFilters(
          data?.response?.metaDataDTO.filter(
            (item) => item.active && item?.filter?.style
          )
        );
        setIsFilter(false);
      }
    }, [data?.response?.metaDataDTO]);

  return (
    <div className={`show `}>
      <Header />
      <div className="content-body">
        <div
          className="container-fluid table-responsive active-projects task-table"
          style={{ paddingTop: "5px" }}
        >
          <section className="d-flex mt-5">
            <div style={{ width: "100%" }}>
              <ReusableFilters
                showFilter={true}
                setActiveFilters={setActiveFilters}
                setSearchText={setSearchText}
                searchText={searchText}
                setSelectedOption={setSelectedOption}
                selectedOption={selectedOption}
                setSelectedDateRanges={setSelectedDateRanges}
                selectedDateRanges={selectedDateRanges}
                FilterItems={activeFilters}
                selectedDates={selectedDates}
                setSelectedDates={setSelectedDates}
                activeFilters={activeFilters}
                setClear={setClear}
                clear={clear}
                setPageNo={setPageNo}
                //customize table
                open={open}
                onClose={onClose}
                selectedColumns={test}
                setSelectedColumns={setTest}
                showCustomizeTable={true}
                showDrawer={showDrawer}
                handleSubmit={handleSubmitInsert}
                handleReset={handleReset}
                isSubmitting={isSubmitting}
                isResetting={isResetting}
              />
            </div>
          </section>
          <div id="task-tbl_wrapper" className="dataTables_wrapper no-footer">
            <div className="mt-4">
              <AppTable
                data={
                  statusUpdateWebSocket
                    ? statusUpdateWebSocket
                    : data?.response?.pageResponse?.content
                }
                column={data?.response?.metaDataDTO.filter(
                  (item) => item.active
                )}
                loader={tableLoader}
                pagination={false}
                sort={sort}
                setSort={setSort}
                first={pageNo === 0 ? 0 : paginationFirst}
                totalRecords={data?.response?.pageResponse?.totalElements}
                row={15}
                onPageChange={onPageChange}
                isGenerateReportDownload={true}
              />
              <div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const enhancer = connect(
  (state) => ({
    response: state.admin.workqueue?.patients?.data,
    organizationList: state?.tenantAdmin?.patients?.allOrganization?.data,
    batchList: state?.tenantAdmin?.patients?.allBatch?.data,
    allPatientList: state?.tenantAdmin?.patients?.allPatients,
    webSocketData: state?.tenantAdmin?.webSocket?.webSocketDetails?.data,
    loading: state?.tenantAdmin?.patients?.allPatientsLoading,
    filteredList: state.admin?.patientAllocate?.filtersList,
    routedData: state.tenantAdmin?.patientSync?.routedData,
    getFlagsData: state?.reviewer?.workQueue?.flags?.data,
    data: state?.tableView?.tableView?.data,
    tableLoader: state?.tableView?.tableViewLoading,
    pageLoad: state?.tenantAdmin?.tin?.getPageRendering,
  }),
  {
    getPatientId: tenantAdminAction.submitPatientId,
    uploadFiles: tenantAdminAction.uploadFiles,
    getFilters: allocationAction.getFiltersList,
    getRoutedData: allPatientSyncAction.getRoutedData,
    getAllFlags: workflowActions.flagsAction,
    getTableData: tableAction.tableViewAction,
    getAllTabRoles: allActions.getAllRoles,
    tableDynamicColumn: tableAction.tableDynamicColumn,
    tableDynamicColumnReset: tableAction.tableDynamicColumnReset,
  }
);
export default enhancer(GeneratedReports);
