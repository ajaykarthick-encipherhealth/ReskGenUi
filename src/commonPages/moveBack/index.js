import React, { useEffect, useState } from "react";
import { Tab, Nav } from "react-bootstrap";
import Header from "../../jsx/layouts/nav/Header";
import { Button, Input, Tooltip, Space } from "antd";
import { connect } from "react-redux";
import { actions as allActions } from "../../stores/tenantAdmin/patientAllocations";
import ReusableFilters from "../../components/reusableFilters";
import { priorityOptions } from "../../components/headerFilters/functions";
import { actions as tenantAdminUsersAction } from "../../stores/tenantAdmin/users";
import { actions as tinActions } from "../../stores/tenantAdmin/tin";
import styles from "../../components/tables/table.module.css";
import MoveBackModal from "./moveBackModal";
import MoveBackTable from "./moveBackTable";
import { actions as tableAction } from "../../stores/tableView";
import CardSkeleton from "../../components/skeleton/card";
import { getResponePopup } from "../../utils/reusable";

const MoveBack = ({
  tableLoader,
  organizationList,
  getAllOrganizationList,
  rolesLoader,
  routedData,
  getTableData,
  data,
  getAllTabRoles,
  allRoles,
  tableDynamicColumn,
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
  const [selectedChart, setSelectedChart] = useState([]);
  const [selectedRowsId, setSelectedRowsId] = useState([]);
  const [searchText, setSearchText] = useState(null);
  const [selectedOption, setSelectedOption] = useState({});
  const [selectedDateRanges, setSelectedDateRanges] = useState({});
  const [selectedDates, setSelectedDates] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageNo, setPageNo] = useState(0);
  const [paginationFirst, setPaginationFirst] = useState(0);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [paramsFilter, setParamsFilter] = useState(null);
  const [search, setSearch] = useState({});
  const [test, setTest] = useState(data?.response?.metaDataDTO);
  const [open, setOpen] = useState(false);
  const [pageSize, setPageSize] = useState(15);
  const [roleId, setRoleId] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");

  const handleTabChange = (key) => {
    setActiveTab(key);
    setSelectedSupervisor(null);
    setSelectedRows([]);
    setSearchText("");
    setSelectedDateRanges([]);
    setSelectedOption({});
    setPageNo(0);
    setSearch({});
  };

  const handleOpenModal = () => {
    setAllocateModal(true);
  };
  const onClose = () => {
    setOpen(false);
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
  const showDrawer = () => {
    setOpen(true);
  };

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

  const getRolesList = async () => {
    const res = await getAllTabRoles();
    if (res.status === "SUCCESS") {
      setRoleId(res?.response?.allocationRoles[0]?.roleId);
    }
  };
  const getMoveBack = async () => {
    const response = await getTableData({
      pageId: "937b0477-f0cd-46e7-b8ab-fefb38f91859",
      pageNo,
      pageSize,
      roleId,
    });
  };

  const handleSubmit = async () => {
    const payload = {
      pageId: pageId,
      headerNames: test
        .filter((col) => col.active)
        .map((col) => col.actualField),
    };

    try {
      const response = await tableDynamicColumn({ payload });
      if (response?.status === "SUCCESS") {
        getMoveBack();
        onClose();
        getResponePopup(response);
      }
    } catch (error) {
      getResponePopup(error?.response);
    }
  };

  useEffect(() => {
    getRolesList();
  }, []);

  useEffect(() => {
    if (allRoles?.allocationRoles?.length > 0) {
      setSelectedRole(allRoles.allocationRoles[0].aliasName);
    }
  }, [allRoles, activeTab]);

  useEffect(() => {
    setParamsFilter("check");
    if (
      window !== "undefined" &&
      paramsFilter &&
      allRoles?.allocationRoles?.length > 0
    ) {
      getMoveBack();
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
    roleId,
  ]);
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
    const filteredFilters = getFilterOption();
    setActiveFilters(filteredFilters);
  }, [activeTab, selectedSupervisor]);

  return (
    <div>
      <Header />
      <div className="content-body">
        <div className="container-fluid">
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
                                onClick={() => {
                                  setSelectedRole(role.aliasName);
                                  setRoleId(role.roleId);
                                }}
                                className="mt-4"
                                eventKey={index + 1}
                              >
                                {role?.roleName
                                  .replace(/_/g, " ")
                                  .replace(/\b\w/g, (c) => c.toUpperCase())}
                              </Nav.Link>
                            </Nav.Item>
                          ))}
                          <div
                            className="d-flex align-items-end justify-content-end"
                            style={{ width: "85%" }}
                          >
                            <Nav.Item as="li" className="nav-item profile-tab ">
                              <Tooltip
                                title={
                                  selectedRowsId?.length === 0
                                    ? "Select patients to move back"
                                    : ""
                                }
                              >
                                <Button
                                  data-testid="allocate-btn"
                                  name="allocate-btn"
                                  onClick={handleOpenModal}
                                  type="primary"
                                  className={` ${styles.allocate}`}
                                  // disabled={selectedRowsId?.length === 0}
                                >
                                  Move Back
                                </Button>
                              </Tooltip>
                            </Nav.Item>
                          </div>
                        </Nav>
                      )}

                      <div className="d-flex ">
                        <div
                          className={` d-flex gap-3 mt-4`}
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
                            setSelectAllChecked={setSelectAllChecked}
                            setSelectedRowsId={setSelectedRowsId}
                            setSelectedRows={setSelectedRows}
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
                          />
                        </div>
                      </div>
                      <Tab.Content>
                        <Tab.Pane eventKey={activeTab}>
                          <MoveBackTable
                            selectedRowsId={selectedRowsId}
                            setSelectedRows={setSelectedRows}
                            selectedRows={selectedRows}
                            setSelectedRowsId={setSelectedRowsId}
                            pageNo={pageNo}
                            setPageNo={setPageNo}
                            paginationFirst={paginationFirst}
                            setPaginationFirst={setPaginationFirst}
                            setSort={setSort}
                            sort={sort}
                            data={data}
                            tableLoader={tableLoader}
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

      <MoveBackModal
        open={allocateModal}
        setOpen={setAllocateModal}
        setSelectedChart={setSelectedChart}
        selectedChart={selectedChart}
        selectedRowsId={selectedRowsId}
        setSelectedRowsId={setSelectedRowsId}
        setSelectedRows={setSelectedRows}
        selectedRows={selectedRows}
        activeTab={activeTab}
        selectedRole={selectedRole}
        getMoveBack={getMoveBack}
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
    tableLoader: state?.tableView?.tableViewLoading,
    allRoles: state?.tenantAdmin?.patientsAllocation?.getRoles?.data?.response,
    rolesLoader: state?.tenantAdmin?.patientsAllocation?.rolesLoader,
  }),
  {
    getAllOrganizationList: tenantAdminUsersAction?.getAllOrganizationAction,
    getAllReviewerList: allActions.getAllReviewerList,
    getAllCheckedReviewers: allActions.getAllCheckedListForReviewer,
    getReviewerList: allActions.getFilterOptions,
    getRoutedData: tinActions.getAllocationRoutedData,
    getTableData: tableAction.tableViewAction,
    getAllTabRoles: allActions.getAllRoles,
    tableDynamicColumn: tableAction.tableDynamicColumn,
  }
);

export default connector(MoveBack);
