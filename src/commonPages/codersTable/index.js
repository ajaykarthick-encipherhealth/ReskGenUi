import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import "react-facebook-loading/dist/react-facebook-loading.css";
import { notification } from "antd";
import { actions as tenantAdminAction } from "../../stores/tenantAdmin/patients";
import { actions as tableAction } from "../../stores/tableView";
import { getStorage, setStorage } from "../../utils/storages";
import { actions as allActions } from "../../stores/reviewer/workqueue";
import { actions as allPatientSyncAction } from "../../stores/tenantAdmin/patientSync";
import ReusableFilters from "../../components/reusableFilters";
import AppTable from "../../components/tables";
import { actions as allReportActions } from "../../stores/admin/report";
import { Tab, Nav } from "react-bootstrap";
import Header from "../../jsx/layouts/nav/Header";
import { findMatchesByField, getResponePopup } from "../../utils/reusable";
import SubNavBar from "../../components/subNavBar";
export const bullets = [
  {
    color: "#00BC13",
    name: ` COMPLETED`,
  },
  {
    color: "#5da9e4",
    name: `PENDING`,
  },
  {
    color: "#EB5252",
    name: `DECLINED`,
  },
  { color: "#3C0AD2", name: ` HOLD` },
];

const CodersTable = ({
  patientDetails,
  routedData,
  getRoutedData,
  getActiveTab,
  pageLoad,
  tableLoader,
  getTableData,
  tableDynamicColumn,
  pageId,
  data,
  isQueried,
  isReAssigned,
  patientAllocated,
  tableDynamicColumnReset,
  tableStatus,
  getTableStatus,
  route,
  backRoute,
  roleId,
}) => {
  const router = useRouter();
  const proxyRole = getStorage("proxyRole");
  const tin = getStorage("tinNumber");
  const [proxy, setProxy] = useState(null);
  const [searchText, setSearchText] = useState(null);
  const [selectedOption, setSelectedOption] = useState({});
  const [selectedDateRanges, setSelectedDateRanges] = useState({});
  const [selectedDates, setSelectedDates] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [paginationFirst, setPaginationFirst] = useState(0);
  const [clear, setClear] = useState(false);
  const [paramsFilter, setParamsFilter] = useState(null);
  const [test, setTest] = useState(data?.response?.metaDataDTO);
  const [open, setOpen] = useState(false);
  const [activeStatus, setActiveStatus] = useState("PENDING");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isFilter, setIsFilter] = useState(true);
  const [activeFilters, setActiveFilters] = useState(
    data?.response?.metaDataDTO.filter((item) => item.active)
  );
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

  const gotoPatientDetails = (data) => {
    patientDetails(data);
    setStorage("patientId", data.patientId);
    if (data.computing == 2) {
      const controller = new AbortController();
      controller.abort();
      setStorage("patientId", data.patientId);
      setStorage("routeBackTo", backRoute ? backRoute : "/reviewer/patients");
      getRoutedData(params);
      router.push({
        pathname: route ? route : "/reviewer/patients/details",
      });
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
    setTest(data?.response?.metaDataDTO);
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  const getCodersApi = async () => {
    const res = await getTableData({
      pageNo,
      pageNumber,
      pageSize: 15,
      selectedOption,
      sort: sort,
      selectedDateRanges,
      searchText: searchText,
      activeStatus,
      pageId,
      isReAssigned,
      isQueried,
      patientAllocated,
      tin,
      roleId,
    });
  };

  const handleTabs = (name) => {
    getActiveTab(name);
    setActiveStatus(name);
  };

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    const payload = {
      pageId: pageId,
      headerNames: data.map((col) => col.id),
    };
    try {
      const response = await tableDynamicColumn({ payload });
      if (response?.status === "SUCCESS") {
        setIsFilter(true);
        getCodersApi();
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

    const payload = {
      pageId: pageId,
    };
    try {
      const response = await tableDynamicColumnReset({ payload });
      if (response?.status === "SUCCESS") {
        setIsFilter(true);
        getCodersApi();
        onClose();
        getResponePopup(response);
      }
      setIsResetting(false);
    } catch (error) {
      getResponePopup(error?.response);
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
  useEffect(() => {
    setParamsFilter("check");
    if (window !== "undefined" && paramsFilter) {
      getTableStatus({
        pageNo,
        pageNumber,
        pageSize: 15,
        selectedOption,
        sort: sort,
        selectedDateRanges,
        searchText: searchText,
        activeStatus,
        pageId,
        isReAssigned,
        isQueried,
        patientAllocated,
        tin,
        roleId,
      });
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
    pageLoad,
  ]);
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

  useEffect(() => {
    setProxy(proxyRole);
  }, [proxy]);
  return (
    <div className={`show `}>
      <Header />
      {proxy === "QA" ? (
        <div>
          <SubNavBar hideBackArrow={false} />
        </div>
      ) : (
        ""
      )}

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
                //customize table
                open={open}
                onClose={onClose}
                selectedColumns={test}
                setSelectedColumns={setTest}
                showCustomizeTable={true}
                showDrawer={showDrawer}
                handleSubmit={handleSubmit}
                handleReset={handleReset}
                isSubmitting={isSubmitting}
                isResetting={isResetting}
              />
            </div>
          </div>
          {/* )} */}
          <div className="profile-tab  mt-3">
            {pageId === "a9d5c555-7954-4382-a2ef-3f66b292cf8f" ? (
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
                        PENDING -{" "}
                        {tableStatus?.mciPatientCountDTO?.pendingCount || 0}{" "}
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item
                      as="li"
                      className="nav-item"
                      onClick={() => {
                        handleTabs("APPROVED");
                      }}
                    >
                      <Nav.Link
                        id="completed"
                        name="completed"
                        to="#my-posts"
                        eventKey="APPROVED"
                      >
                        APPROVED -{" "}
                        {tableStatus?.mciPatientCountDTO?.approvedCount || 0}{" "}
                      </Nav.Link>
                    </Nav.Item>{" "}
                    <Nav.Item
                      as="li"
                      className="nav-item"
                      onClick={() => {
                        handleTabs("REJECTED");
                      }}
                    >
                      <Nav.Link
                        id="declined"
                        name="declined"
                        to="#my-posts"
                        eventKey="REJECTED"
                      >
                        REJECTED -{" "}
                        {tableStatus?.mciPatientCountDTO?.rejectedCount || 0}
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
                          totalRecords={
                            data?.response?.pageResponse?.totalElements
                          }
                          row={15}
                          onPageChange={onPageChange}
                        />
                      </div>
                    </Tab.Pane>
                  </Tab.Content>
                </Tab.Container>
              </div>
            ) : (
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
                        PENDING -{" "}
                        {tableStatus?.mciPatientCountDTO?.pendingCount || 0}{" "}
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
                        COMPLETED -{" "}
                        {tableStatus?.mciPatientCountDTO?.approvedCount || 0}{" "}
                      </Nav.Link>
                    </Nav.Item>{" "}
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
                          totalRecords={
                            data?.response?.pageResponse?.totalElements
                          }
                          row={15}
                          onPageChange={onPageChange}
                        />
                      </div>
                    </Tab.Pane>
                  </Tab.Content>
                </Tab.Container>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
const enhancer = connect(
  (state) => ({
    routedData: state.tenantAdmin?.patientSync?.routedData,
    status:
      state?.reviewer?.workQueue?.getStatus?.data?.response?.processStatusCount,
    tableLoader: state?.tableView?.tableViewLoading,
    data: state?.tableView?.tableView?.data,
    tableStatus: state?.tableView?.TableStatusView?.data?.response,
    pageLoad: state?.tenantAdmin?.tin?.getPageRendering,
  }),
  {
    patientDetails: allActions.getPatientDetails,
    getRoutedData: allPatientSyncAction.getRoutedData,
    getActiveTab: allReportActions.activeTab,
    getStatus: allActions.getStatusAction,
    getTableStatus: tableAction.getTableStatusAction,
    getTableData: tableAction.tableViewAction,
    tableDynamicColumn: tableAction.tableDynamicColumn,
    tableDynamicColumnReset: tableAction.tableDynamicColumnReset,
  }
);
export default enhancer(CodersTable);
