import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import "react-facebook-loading/dist/react-facebook-loading.css";
import { notification, Table } from "antd";
import { actions as workqueueActions } from "../../stores/reviewer/workqueue";
import { actions as tenantAdminAction } from "../../stores/tenantAdmin/patients";
import { actions as tableAction } from "../../stores/tableView";
import { priorityOptions } from "../../components/headerFilters/functions";
import { getStorage, setStorage } from "../../utils/storages";
import { actions as allActions } from "../../stores/reviewer/workqueue";
import { actions as allPatientSyncAction } from "../../stores/tenantAdmin/patientSync";
import ReusableFilters from "../../components/reusableFilters";
import AppTable from "../../components/tables";
import { actions as allReportActions } from "../../stores/admin/report";
import { Tab, Nav } from "react-bootstrap";
import Header from "../../jsx/layouts/nav/Header";
import { getResponePopup } from "../../utils/reusable";
const role = getStorage("proxyRole");
export const bullets = [
  {
    color: "#00BC13",
    name: `${role} COMPLETED`,
  },
  {
    color: "#5da9e4",
    name: `${role} PENDING`,
  },
  {
    color: "#EB5252",
    name: `${role} DECLINED`,
  },
  { color: "#3C0AD2", name: `${role} HOLD` },
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
  { label: "CODER 1 COMPLETED", value: "COMPLETED" },
  { label: "CODER 1 PENDING", value: "PENDING" },
  { label: "CODER 1 DECLINED", value: "DECLINED" },
  { label: "CODER 1 HOLD", value: "HOLD" },
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
    active: true,
  },
  {
    id: "06",
    title: "Priority",
    type: "select",
    value: null,
    placeholder: "Priority",
    options: null,
    active: true,
  },
  {
    id: "07",
    title: "batch",
    type: "select",
    value: null,
    placeholder: "Batch",
    showSearch: true,
    options: null,
    active: true,
  },
];
const CodersTable = ({
  patientDetails,
  routedData,
  getRoutedData,
  getAllBatchList,
  batchList,
  getActiveTab,
  status,
  tableLoader,
  getTableData,
  tableDynamicColumn,
  pageId,
  data,
  isQueried,
  isReAssigned,
  patientAllocated,
}) => {
  const columns = [
    {
      name: "Patient Id",
      value: "patientId",
      isShow: true,
      filterKey: "Search",
    },
    {
      name: "Batch Name",
      value: "batchName",
      isShow: true,
      filterKey: "batch",
    },
    {
      name: "File Name",
      value: "fileName",
      isShow: true,
    },
    {
      name: "HCC Count",
      value: "validDiseaseCount",
      isShow: true,
    },
    {
      name: "Allocated Date",
      value: "allocatedOn",
      sortable: true,
      isDate: true,
      isShow: true,
      filterKey: "allocatedDate",
    },
    {
      name: "Due Date",
      value: "dueDate",
      sortable: true,
      isDate: true,
      isShow: true,
      filterKey: "dueDate",
    },
    {
      name: "Completed Date",
      value: "processedDate",
      sortable: true,
      isDate: true,
      isShow: true,
      filterKey: "completedDate",
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
      isShow: true,
    },
    {
      name: "Priority",
      value: "priority",
      isShow: true,
      filterKey: "Priority",
    },
    {
      name: "Status",
      value: "statusProxy",
      proxcystatus: true,
      infoIcon: true,
      isShow: true,
      filterKey: "Status",
    },
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
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [paginationFirst, setPaginationFirst] = useState(0);
  const [totalElements, setTotalElements] = useState("");
  const [clear, setClear] = useState(false);
  const [paramsFilter, setParamsFilter] = useState(null);
  const [test, setTest] = useState(data?.response?.metaDataDTO);
  const [open, setOpen] = useState(false);
  const [activeStatus, setActiveStatus] = useState("PENDING");

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

  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  const getCodersApi = async () => {
    const res = await getTableData({
      pageNo,
      pageNumber,
      pageSize,
      selectedOption,
      sort: sort,
      selectedDateRanges,
      searchText: searchText,
      activeStatus,
      pageId,
      isReAssigned,
      isQueried,
      patientAllocated,
    });
    if (res?.status == "SUCCESS") {
      setTotalElements(res.response?.patientDTOList?.totalElements);
    }
  };
  useEffect(() => {
    setParamsFilter("check");
    if (window !== "undefined" && paramsFilter) {
      getCodersApi();
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
    activeStatus,
  ]);

  const opt = {
    batch: batchList?.map((item) => ({
      value: item?.id,
      label: `${item?.name}`,
    })),
    Status: statusOptions,
    Priority: priorityOptions,
  };
  const handleTabs = (name) => {
    getActiveTab(name);
    setActiveStatus(name);
  };

 const handleSubmit = async () => {
    const payload = {
      pageId: pageId,
      headerNames: test
        .filter((col) => col.active)
        .map((col) => col.actualField),
    };

    try {
      const response = await tableDynamicColumn({payload});
      if (response?.status === "SUCCESS"){
        getCodersApi()
        onClose()
        getResponePopup(response);
      }
    } catch (error) {
      getResponePopup(error?.response);
    }
  };
  useEffect(() => {
    getAllBatchList();
  }, []);

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
    activeStatus,
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
        activeStatus,
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
      setActiveStatus(activeStatus);
    }
  }, [routedData]);

  return (
    <div className={`show `}>
      <Header />
      <div className="content-body">
        <div className="container-fluid table-responsive active-projects task-table">
          <div className="d-flex p-3">
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
                setPageNumber={setPageNumber}
                FilterItems={activeFilters}
                selectedDates={selectedDates}
                setSelectedDates={setSelectedDates}
                activeFilters={activeFilters}
                setClear={setClear}
                clear={clear}
                setPageNo={setPageNo}
                opt={opt}
                columns={columns}
                //customize table
                open={open}
                onClose={onClose}
                selectedColumns={test}
                setSelectedColumns={setTest}
                commonFilterItems={commonFilterItems}
                showCustomizeTable={true}
                showDrawer={showDrawer}
                handleSubmit={handleSubmit}
              />
            </div>
          </div>
          <div className="profile-tab  mt-3">
            <div className="custom-tab-1">
              <Tab.Container
                defaultActiveKey={
                  routedData?.activeStatus
                    ? routedData?.activeStatus
                    : "PENDING"
                }
              >
                <Nav as="ul" className="nav nav-tabs">
                  <Nav.Item
                    as="li"
                    className="nav-item"
                    onClick={() => {
                      handleTabs("PENDING");
                    }}
                  >
                    <Nav.Link
                      id="pending"
                      name="pending"
                      to="#my-posts"
                      eventKey="PENDING"
                    >
                      PENDING - {status?.PENDING || 0}
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item
                    as="li"
                    className="nav-item"
                    onClick={() => {
                      handleTabs("COMPLETED");
                    }}
                  >
                    <Nav.Link
                      id="completed"
                      name="completed"
                      to="#my-posts"
                      eventKey="COMPLETED"
                    >
                      COMPLETED - {status?.COMPLETED || 0}
                    </Nav.Link>
                  </Nav.Item>{" "}
                  <Nav.Item
                    as="li"
                    className="nav-item"
                    onClick={() => {
                      handleTabs("HOLD");
                    }}
                  >
                    <Nav.Link
                      id="hold"
                      name="hold"
                      to="#my-posts"
                      eventKey="HOLD"
                    >
                      HOLD - {status?.HOLD || 0}
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item
                    as="li"
                    className="nav-item"
                    onClick={() => {
                      handleTabs("DECLINED");
                    }}
                  >
                    <Nav.Link
                      id="declined"
                      name="declined"
                      to="#my-posts"
                      eventKey="DECLINED"
                    >
                      DECLINED - {status?.DECLINED || 0}
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
                <Tab.Content>
                  <Tab.Pane eventKey={activeStatus}>
                    <div className="mt-3">
                      <AppTable
                        data={data?.response?.pageResponse?.content}
                        column={data?.response?.metaDataDTO.filter(
                          (item) => item.active
                        )}
                        loader={tableLoader}
                        onRowClick={gotoPatientDetails}
                        pagination={false}
                        setSort={setSort}
                        sort={sort}
                        first={pageNo === 0 ? 0 : paginationFirst}
                        totalRecords={totalElements}
                        row={15}
                        onPageChange={onPageChange}
                      />
                    </div>
                  </Tab.Pane>
                </Tab.Content>
              </Tab.Container>
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
    statusActiveTab: state.admin?.report?.activeTab,
    status:
      state?.reviewer?.workQueue?.getStatus?.data?.response?.processStatusCount,
      tableLoader:state?.tableView?.tableViewLoading,
      data: state?.tableView?.tableView?.data,
  }),
  {
    getpatientsListFilter: workqueueActions.patientsAction,
    patientDetails: allActions.getPatientDetails,
    getRoutedData: allPatientSyncAction.getRoutedData,
    getAllBatchList: tenantAdminAction.getAllBatchAction,
    getFilteApi: allActions.getReviewerPatients,
    getActiveTab: allReportActions.activeTab,
    getStatus: allActions.getStatusAction,
    getTableData: tableAction.tableViewAction,
    tableDynamicColumn: tableAction.tableDynamicColumn,
  }
);
export default enhancer(CodersTable);
