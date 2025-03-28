import React, { useEffect, useState } from "react";
import { Tab, Nav } from "react-bootstrap";
import ReviewerAllocation from "./reviewerAllocation";
import SupervisorAllocation from "./supervisorAllocation";
import Header from "../../../jsx/layouts/nav/Header";
import { Button, Input, Tooltip, Space } from "antd";
import ReviewerAllocationModal from "./reviewerAllocation/reviewerAllocationModal";
import { connect } from "react-redux";
import { actions as allActions } from "../../../stores/tenantAdmin/patientAllocations";
import ReusableFilters from "../../../components/reusableFilters";
import { priorityOptions } from "../../../components/headerFilters/functions";
import { actions as tenantAdminUsersAction } from "../../../stores/tenantAdmin/users";
import { actions as allPatientSyncAction } from "../../../stores/tenantAdmin/patientSync";
import Supervisorlist from "./supervisorlist";
import styles from '../../../components/tables/table.module.css'


const PatientAllocation = ({
  getAllReviewerList,
  organizationList,
  getAllOrganizationList,
  getAllSupervisorList,
  getReviewerList,
  routedData,
}) => {
  const commonFilterItems = [
    {
      id: 1,
      title: "Search",
      type: "search",
      value: null,
      placeholder: "Search",
      header: "Patient Name / ID",
      active: true,
    },
    {
      id: 2,
      title: "Search by Code",
      type: "search1",
      value: null,
      placeholder: "Search",
      header: "Search by Code",
      active: true,
    },
    {
      id: 3,
      title: "Search by Description",
      type: "search1",
      value: null,
      placeholder: "Search",
      header: "Search by Description",
      active: true,
    },
    {
      id: 4,
      title: "organization",
      type: "select",
      value: null,
      placeholder: "Organization",
      options: organizationList?.response?.map((item) => ({
        value: item?.id,
        label: `${item?.name}`,
      })),
      active: true,
    },
    {
      id: 5,
      title: "computedDate",
      type: "rangePicker",
      value: null,
      placeholder: "Computed  Date",
      pickerType: "year",
      active: true,
    },
    {
      id: 6,
      title: "priority",
      type: "select",
      value: null,
      placeholder: "Priority",
      options: priorityOptions,
      active: true,
    },
  ];
  const [activeFilters, setActiveFilters] = useState(commonFilterItems);
  const [sort, setSort] = useState({
    computedDate: {
      sortDir: "DESC",
      sortField: "computedDate",
    },
  });
  const [activeTab, setActiveTab] = useState();
  const [selectedSupervisor, setSelectedSupervisor] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [allocateModal, setAllocateModal] = useState(false);
  const [allocateModalL2, setAllocateModalL2] = useState(false);
  const [selectedChart, setSelectedChart] = useState([]);
  const [selectedRowsId, setSelectedRowsId] = useState([]);
  const [searchText, setSearchText] = useState(null);
  const [selectedOption, setSelectedOption] = useState({});
  const [selectedDateRanges, setSelectedDateRanges] = useState({});
  const [selectedDates, setSelectedDates] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [batchCount, setBatchCount] = useState("");
  const [pageNo, setPageNo] = useState(0);
  const [paginationFirst, setPaginationFirst] = useState(0);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [paramsFilter, setParamsFilter] = useState(null);
  const [selectedUserName, setSelectedUserName] = useState([]);
  const [filterBatchCount, setFilterBatchCount] = useState(false);
  const [search, setSearch] = useState({});
  const [viewDetailSuperisor, setViewDetailSupervisor] = useState(null);

  const handleTabChange = (key) => {
    setActiveTab(key);
    setSelectedSupervisor(null);
    setSelectedRows([]);
    setSearchText("");
    setSelectedDateRanges([]);
    setSelectedOption({});
    setBatchCount("");
    setPageNo(0);
    setSearch({});
  };

  const handleOpenModal = () => {
    if (activeTab === "2") {
      setAllocateModalL2(true);
    } else {
      setAllocateModal(true);
    }
  };

  useEffect(() => {
    setSelectedRowsId(selectedRows);
  }, [selectedRows, setSelectedRowsId]);

  useEffect(() => {}, [allocateModalL2]);
  useEffect(() => {
    if (!organizationList?.response) {
      getAllOrganizationList();
    }
  }, []);
  const opt = {
    organization: organizationList?.response?.map((item) => ({
      value: item?.id,
      label: `${item?.name}`,
    })),
    priority: priorityOptions,
  };

  const getAllReviewerALlocation = async () => {
    const res = await getAllReviewerList({
      pageNo,
      pageNumber,
      selectedOption,
      sort,
      selectedDateRanges,
      search: searchText,
      batchCount: batchCount,
      searchList: search,
    });
  };

  const getAllSupervisorAllocation = async () => {
    const res = await getAllSupervisorList({
      pageNo,
      pageNumber,
      selectedOption,
      sort,
      selectedDateRanges,
      searchText,
      search,
    });
  };

  useEffect(() => {
    setParamsFilter("check");
    if (window !== "undefined" && paramsFilter) {
      if (activeTab == "1") {
        getAllReviewerALlocation();
      } else {
        getAllSupervisorAllocation();
      }
    }
  }, [
    selectedOption,
    selectedDateRanges,
    searchText,
    pageNo,
    paramsFilter,
    sort,
    paginationFirst,
    selectedSupervisor,
    search,
  ]);
  const getFilterOption = () => {
    let filteredItems;

    switch (activeTab) {
      case "1":
        filteredItems = commonFilterItems.filter(
          (filter) => filter.title !== "reviewer" && filter.title !== "status"
        );
        break;

      case "2":
        filteredItems = commonFilterItems
          .filter((filter) => filter.id == 4 || filter.id == 1)
          .map((filter) =>
            filter.id == 1 ? { ...filter, header: "Search by Name" } : filter
          );
        break;

      default:
        filteredItems = commonFilterItems;
    }

    return filteredItems;
  };

  useEffect(() => {
    const filteredFilters = getFilterOption();
    setActiveFilters(filteredFilters);
  }, [activeTab, selectedSupervisor]);

  const params = {
    pageNo,
    paginationFirst,
    sort,
    activeFilters,
    searchText,
    selectedOption,
    activeTab,
    search,
  };

  useEffect(() => {
    if (routedData) {
      setActiveTab(routedData?.activeTab);
    } else {
      setActiveTab("1");
      setSearchText("");
      setSelectedOption({});
    }
  }, [routedData]);

  return viewDetailSuperisor ? (
    <Supervisorlist
      setAllocateModalL2={setAllocateModalL2}
      selectedRows={selectedRows}
      setSelectedRowsId={setSelectedRowsId}
      setSelectedRows={setSelectedRows}
      setSelectedSupervisor={setSelectedSupervisor}
      handleOpenModal={handleOpenModal}
      selectedSupervisor={selectedSupervisor}
      setAllocateModal={setAllocateModal}
      selectedUserName={selectedUserName}
      setViewDetailSupervisor={setViewDetailSupervisor}
      viewDetailSuperisor={viewDetailSuperisor}
    />
  ) : (
    <div>
      <Header />
      <div className="content-body">
        <div className="container-fluid">
          <div className="table-responsive active-projects task-table">
            <div className="d-flex">
              <div className={` d-flex gap-3`} style={{ width: "90%" }}>
                <ReusableFilters
                  showFilter={false}
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
                  setPageNo={setPageNo}
                  opt={opt}
                  batchCount={batchCount}
                  setBatchCount={setBatchCount}
                  setFilterBatchCount={setFilterBatchCount}
                  setSelectAllChecked={setSelectAllChecked}
                  setSelectedRowsId={setSelectedRowsId}
                  getAllReviewerALlocation={getAllReviewerALlocation}
                  setSelectedRows={setSelectedRows}
                  showBatchCount={activeTab === "1" ? true : false}
                  selectedRowsId={selectedRowsId}
                  setSearch={setSearch}
                  search={search}
                />
              </div>

              {activeTab === "1" ? (
                <div
                  className="d-flex align-items-center justify-content-end"
                  style={{ width: "10%" }}
                >
                  <Tooltip
                    title={
                      selectedRowsId?.length === 0
                        ? "Select patients to Allocate"
                        : ""
                    }
                  >
                    <Button
                      data-testid="allocate-btn"
                      name="allocate-btn"
                      onClick={handleOpenModal}
                      type="primary"
                      className={`mb-3 ${styles.allocate}`}
                      disabled={selectedRowsId?.length === 0}
                    >
                      Allocate
                    </Button>
                  </Tooltip>
                </div>
              ) : null}
            </div>
            <div className="row">
              <div className="col-xl-12">
                <div className="profile-tab" style={{ marginTop: "20px" }}>
                  <div className="custom-tab-1">
                    <Tab.Container
                      className="profile-tab"
                      activeKey={activeTab}
                      onSelect={handleTabChange}
                    >
                      <Nav variant="tabs" className="nav nav-tabs profile-tab">
                        <Nav.Item className="nav-item profile-tab">
                          <Nav.Link eventKey="1">Reviewer Allocation</Nav.Link>
                        </Nav.Item>
                        <Nav.Item className="nav-item profile-tab">
                          <Nav.Link eventKey="2">
                            Supervisor Allocation
                          </Nav.Link>
                        </Nav.Item>
                      </Nav>

                      <Tab.Content>
                        <Tab.Pane eventKey="1">
                          <ReviewerAllocation
                            selectedRowsId={selectedRowsId}
                            setSelectedRows={setSelectedRows}
                            selectedRows={selectedRows}
                            setSelectedRowsId={setSelectedRowsId}
                            setBatchCount={setBatchCount}
                            pageNo={pageNo}
                            setPageNo={setPageNo}
                            paginationFirst={paginationFirst}
                            setPaginationFirst={setPaginationFirst}
                            selectedUserName={selectedUserName}
                            setSelectedUserName={setSelectedUserName}
                            setSort={setSort}
                            sort={sort}
                            batchCount={batchCount}
                          />
                        </Tab.Pane>

                        <Tab.Pane eventKey="2">
                          <SupervisorAllocation
                            selectedSupervisor={selectedSupervisor}
                            setSelectedSupervisor={setSelectedSupervisor}
                            selectedRows={selectedRows}
                            setSelectedRows={setSelectedRows}
                            setSelectedRowsId={setSelectedRowsId}
                            pageNo={pageNo}
                            setPageNo={setPageNo}
                            paginationFirst={paginationFirst}
                            setPaginationFirst={setPaginationFirst}
                            params={params}
                            setSearchText={setSearchText}
                            setSelectedOption={setSelectedOption}
                            searchText={searchText}
                            setActiveTab={setActiveTab}
                            activeTab={activeTab}
                            handleOpenModal={handleOpenModal}
                            setSelectedUserName={setSelectedUserName}
                            setViewDetailSupervisor={setViewDetailSupervisor}
                          />
                        </Tab.Pane>
                      </Tab.Content>
                    </Tab.Container>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ReviewerAllocationModal
        getAllReviewerList={getAllReviewerList}
        open={allocateModal}
        setOpen={setAllocateModal}
        setSelectedChart={setSelectedChart}
        selectedChart={selectedChart}
        selectedRowsId={selectedRowsId}
        setSelectedRowsId={setSelectedRowsId}
        setSelectedRows={setSelectedRows}
        selectedRows={selectedRows}
        activeTab={activeTab}
        selectedUserName={selectedUserName}
        setSelectedUserName={setSelectedUserName}
        getAllReviewerALlocation={getAllReviewerALlocation}
      />
    </div>
  );
};

const connector = connect(
  (state) => ({
    organizationList: state?.tenantAdmin?.users?.allOrganization?.data,
    reviewersData:
      state.tenantAdmin?.patientsAllocation?.reviewersList?.data?.response
        ?.patientDtoList,
    loader: state.tenantAdmin?.patientsAllocation?.loader,
    reviewerList:
      state.tenantAdmin?.patientsAllocation?.filterOptions?.data?.response,
    routedData: state.tenantAdmin?.patientSync?.routedData,
  }),
  {
    getAllOrganizationList: tenantAdminUsersAction?.getAllOrganizationAction,
    getAllReviewerList: allActions.getAllReviewerList,
    getAllCheckedReviewers: allActions.getAllCheckedListForReviewer,
    getAllSupervisorList: allActions.getAllSupervisorList,
    allocationList: allActions.getAllAllocationList,
    getReviewerList: allActions.getFilterOptions,
    getRoutedData: allPatientSyncAction.getRoutedData,
  }
);

export default connector(PatientAllocation);
