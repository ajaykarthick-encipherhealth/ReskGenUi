import React, { useEffect, useState } from "react";
import { Tab, Nav } from "react-bootstrap";
import ReviewerAllocation from "./reviewerAllocation";
import { Button, Input, Tooltip, Space } from "antd";
import ReviewerAllocationModal from "./reviewerAllocation/reviewerAllocationModal";
import { connect } from "react-redux";
import { actions as allActions } from "../../stores/tenantAdmin/patientAllocations";
import ReusableFilters from "../../components/reusableFilters";
import { priorityOptions } from "../../components/headerFilters/functions";
import { actions as tenantAdminUsersAction } from "../../stores/tenantAdmin/users";
import { actions as tinActions } from "../../stores/tenantAdmin/tin";
import styles from "../../components/tables/table.module.css";
import Header from "../../jsx/layouts/nav/Header";
import RandomSamplingModal from "./reviewerAllocation/randomSamplingModal";
import { actions as tableAction } from "../../stores/tableView";
import CardSkeleton from "../../components/skeleton/card";
import { getResponePopup } from "../../utils/reusable";

const PatientAllocation = ({
  getAllReviewerList,
  organizationList,
  getAllOrganizationList,
  getAllTabRoles,
  routedData,
  getTableData,
  data,
  allRoles,
  rolesLoader,
  tableLoader,
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
  const [selectedRows, setSelectedRows] = useState([]);
  const [allocateModal, setAllocateModal] = useState(false);
  const [selectedChart, setSelectedChart] = useState([]);
  const [selectedRowsId, setSelectedRowsId] = useState([]);
  const [searchText, setSearchText] = useState(null);
  const [selectedOption, setSelectedOption] = useState({});
  const [selectedDateRanges, setSelectedDateRanges] = useState({});
  const [selectedDates, setSelectedDates] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [batchCount, setBatchCount] = useState("");
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [roleId, setRoleId] = useState(null);
  const [paginationFirst, setPaginationFirst] = useState(0);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [paramsFilter, setParamsFilter] = useState(null);
  const [selectedUserName, setSelectedUserName] = useState([]);
  const [filterBatchCount, setFilterBatchCount] = useState(false);
  const [search, setSearch] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [samplingModal, setSamplingModal] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [open, setOpen] = useState(false);
  const [test, setTest] = useState(data?.response?.metaDataDTO);

  const showModal = () => {
    setSamplingModal(true);
  };
  const handleTabChange = (key) => {
    setActiveTab(key);
    setSelectedRows([]);
    setSearchText("");
    setSelectedDateRanges([]);
    setSelectedOption({});
    setBatchCount("");
    setPageNo(0);
    setSearch({});
  };

  const handleOpenModal = () => {
    setAllocateModal(true);
  };

  useEffect(() => {
    setSelectedRowsId(selectedRows);
  }, [selectedRows, setSelectedRowsId]);

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

  const getAllAllocation = async () => {
    const response = await getTableData({
      pageId: "6cd166eb-79ac-4c12-ab0f-07be2983ca70",
      pageNo,
      pageSize,
      roleId,
    });
  };
  const handleSubmit = async () => {
    const payload = {
      pageId: "6cd166eb-79ac-4c12-ab0f-07be2983ca70",
      headerNames: test
        .filter((col) => col.active)
        .map((col) => col.actualField),
    };

    try {
      const response = await tableDynamicColumn({ payload });
      if (response?.status === "SUCCESS") {
        getAllAllocation();
        onClose();
        getResponePopup(response);
      }
    } catch (error) {
      getResponePopup(error?.response);
    }
  };
    const handleReset = async () => {
      const payload = {
        pageId: "6cd166eb-79ac-4c12-ab0f-07be2983ca70",
      };
      try {
        const response = await tableDynamicColumnReset({ payload });
        if (response?.status === "SUCCESS") {
          getAllAllocation();
          onClose();
          getResponePopup(response);
        }
      } catch (error) {
        getResponePopup(error?.response);
      }
    };
  useEffect(() => {
    setParamsFilter("check");
    if (
      window !== "undefined" &&
      paramsFilter &&
      allRoles?.allocationRoles?.length > 0
    ) {
      getAllAllocation();
    }
  }, [
    selectedOption,
    selectedDateRanges,
    searchText,
    pageNo,
    paramsFilter,
    sort,
    paginationFirst,
    search,
    batchCount,
    roleId,
  ]);
  const getFilterOption = () => {
    let filteredItems;

    switch (activeTab) {
      case "1":
        filteredItems = commonFilterItems.filter(
          (filter) => filter.title !== "reviewer" && filter.title !== "status"
        );
        break;
      default:
        filteredItems = commonFilterItems;
    }

    return filteredItems;
  };

  const getRolesList = async () => {
    const res = await getAllTabRoles();
    if (res.status === "SUCCESS") {
      setRoleId(res?.response?.allocationRoles[0]?.roleId);
    }
  };
  const onClose = () => {
    setOpen(false);
  };
  const showDrawer = () => {
    setTest(data?.response?.metaDataDTO);
    setOpen(true);
  };
  useEffect(() => {
    const filteredFilters = getFilterOption();
    setActiveFilters(filteredFilters);
  }, [activeTab]);

  useEffect(() => {
    if (routedData) {
      setActiveTab(routedData?.activeTab);
    } else {
      setActiveTab("1");
      setSearchText("");
      setSelectedOption({});
    }
  }, [routedData]);

  useEffect(() => {
    getRolesList();
    setTest(data?.response?.metaDataDTO);
  }, []);

  useEffect(() => {
    if (allRoles?.allocationRoles?.length > 0) {
      setSelectedRoleId(allRoles.allocationRoles[0].roleId);
    }
  }, [allRoles, activeTab]);

  return (
    <div>
      <Header />
      <div className="content-body">
        <div className="container-fluid" style={{ paddingTop: "5px" }}>
          <div className="table-responsive active-projects task-table">
            <div className="row">
              <div className="col-xl-12">
                <div className="profile-tab">
                  <div className="custom-tab-1">
                    <Tab.Container
                      className="profile-tab"
                      activeKey={activeTab}
                      onSelect={handleTabChange}
                    >
                      {rolesLoader ? (
                        <CardSkeleton />
                      ) : (
                        <Nav
                          as="li"
                          variant="tabs"
                          className="nav nav-tabs profile-tab"
                        >
                          {allRoles?.allocationRoles?.map((role, index) => (
                            <Nav.Item
                              as="li"
                              className="nav-item profile-tab mt-4"
                              key={role}
                            >
                              <Nav.Link
                                className="mt-4"
                                onClick={() => {
                                  setSelectedRoleId(role.roleId);
                                  setRoleId(role.roleId);
                                }}
                                eventKey={index + 1}
                              >
                                {role?.roleName
                                  ?.replace(/_/g, " ")
                                  ?.replace(/\b\w/g, (c) => c.toUpperCase())}
                              </Nav.Link>
                            </Nav.Item>
                          ))}
                          <div
                            className="d-flex align-items-end justify-content-end  "
                            style={{ width: "85%" }}
                          >
                            {allRoles?.allocationEnabledForQa && (
                              <Nav.Item
                                as="li"
                                className="nav-item profile-tab "
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
                                    className={` ${styles.allocate}`}
                                    disabled={selectedRowsId?.length === 0}
                                  >
                                    Allocate
                                  </Button>
                                </Tooltip>
                              </Nav.Item>
                            )}
                            {activeTab === "3" && (
                              <Nav.Item
                                as="li"
                                className="nav-item profile-tab "
                              >
                                <Tooltip
                                  title={
                                    selectedRowsId?.length === 0
                                      ? "Select patients to Random Sampling"
                                      : ""
                                  }
                                >
                                  <Button
                                    data-testid="random-sampling"
                                    name="random-sampling"
                                    onClick={showModal}
                                    type="primary"
                                    className={` ${styles.allocate}`}
                                  >
                                    Random Sampling
                                  </Button>
                                </Tooltip>
                              </Nav.Item>
                            )}
                          </div>
                        </Nav>
                      )}

                      <div
                        className={` d-flex gap-3 mt-4`}
                        // style={{ width: "90%" }}
                      >
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
                          setSelectedRows={setSelectedRows}
                          showBatchCount={true}
                          selectedRowsId={selectedRowsId}
                          setSearch={setSearch}
                          search={search}
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

                      <Tab.Content>
                        <Tab.Pane eventKey={activeTab}>
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
                            data={data}
                            tableLoader={tableLoader}
                            roleId={roleId}
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
        setBatchCount={setBatchCount}
        selectedRoleId={selectedRoleId}
        getAllAllocation={getAllAllocation}
        roleId={roleId}
      />
      <RandomSamplingModal
        activeTab={activeTab}
        selectedRowsId={selectedRowsId}
        setSelectedRowsId={setSelectedRowsId}
        setSelectedRows={setSelectedRows}
        selectedRows={selectedRows}
        open={samplingModal}
        setOpen={setSamplingModal}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        selectedRoleId={selectedRoleId}
        getAllAllocation={getAllAllocation}
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
    routedData: state.tenantAdmin?.tin?.allocationRoutedData,
    data: state?.tableView?.tableView?.data,
    allRoles: state?.tenantAdmin?.patientsAllocation?.getRoles?.data?.response,
    rolesLoader: state?.tenantAdmin?.patientsAllocation?.rolesLoader,
    tableLoader: state?.tableView?.tableViewLoading,
  }),
  {
    getAllOrganizationList: tenantAdminUsersAction?.getAllOrganizationAction,
    getAllReviewerList: allActions.getAllReviewerList,
    getAllCheckedReviewers: allActions.getAllCheckedListForReviewer,
    allocationList: allActions.getAllAllocationList,
    getReviewerList: allActions.getFilterOptions,
    getRoutedData: tinActions.getAllocationRoutedData,
    getTableData: tableAction.tableViewAction,
    getAllTabRoles: allActions.getAllRoles,
    tableDynamicColumn: tableAction.tableDynamicColumn,
        tableDynamicColumnReset: tableAction.tableDynamicColumnReset,
    
  }
);

export default connector(PatientAllocation);
