import React, { useEffect, useState } from "react";
import { Tab, Nav } from "react-bootstrap";
import { Button, Input, Tooltip, Space } from "antd";
import { connect } from "react-redux";
import { actions as allActions } from "../../stores/tenantAdmin/patientAllocations";
import ReusableFilters from "../../components/reusableFilters";
import { actions as tenantAdminUsersAction } from "../../stores/tenantAdmin/users";
import { actions as tinActions } from "../../stores/tenantAdmin/tin";
import QueryTable from "./queryTable";
import Header from "../../jsx/layouts/nav/Header";
import CardSkeleton from "../../components/skeleton/card";
import { actions as tableAction } from "../../stores/tableView";
import { findMatchesByField, getResponePopup } from "../../utils/reusable";
import { getStorage, setStorage } from "../../utils/storages";
import { useRouter } from "next/router";

const QueryApproval = ({
  organizationList,
  getTableData,
  getAllTabRoles,
  routedData,
  allRoles,
  rolesLoader,
  tableLoader,
  data,
  tableDynamicColumn,
  tableDynamicColumnReset,
  route,
  pageLoad,
  statusBodyTemplate,
  backRoute,
  getRoutedData,
}) => {
  const [activeFilters, setActiveFilters] = useState([]);
  const [sort, setSort] = useState({
    computedDate: {
      sortDir: "DESC",
      sortField: "computedDate",
    },
  });
  const navigate = useRouter();
  const [activeTab, setActiveTab] = useState();
  const [searchText, setSearchText] = useState(null);
  const [selectedOption, setSelectedOption] = useState({});
  const [selectedDateRanges, setSelectedDateRanges] = useState({});
  const [selectedDates, setSelectedDates] = useState([]);
  const [pageNo, setPageNo] = useState(0);
  const [paginationFirst, setPaginationFirst] = useState(0);
  const [paramsFilter, setParamsFilter] = useState(null);
  const [search, setSearch] = useState({});
  const [roleId, setRoleId] = useState(null);
  const [activeStatus, setActiveStatus] = useState("PENDING");
  const [active, setActive] = useState("Pending");
  const [test, setTest] = useState(data?.response?.metaDataDTO);
  const [open, setOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isFilter, setIsFilter] = useState(true);
  const [clear, setClear] = useState(false);

  const handleTabChange = (key) => {
    var data = {
      activeTab: key,
    };
     getTableData({ reloadTrue: true });
    getRoutedData(data);
    setActiveTab(key);
    setSearchText("");
    setSelectedDateRanges([]);
    setSelectedOption({});
    setPageNo(0);
    setSearch({});
  };

  const page = {
    pageNo,
    selectedDates,
    paginationFirst,
    sort,
    activeFilters,
    searchText,
    selectedOption,
    selectedDateRanges,
    activeTab,
  };

  const gotoPatientDetails = (data) => {
    setStorage("patientId", data?.patientId);
    setStorage("aliasName", selectedRole);
    setStorage(
      "routeBackTo",
      backRoute ? backRoute : "/tenantadmin/tin/tindetails?tab=Query+Approval"
    );
    getRoutedData(page);
    navigate.push({
      pathname: route ? route : "/tenantadmin/tin/details",
    });
  };
  const getQueryApproval = async () => {
    const tin = getStorage("tinNumber");
    const response = await getTableData({
      pageId: "8c1eebaf-eb20-4758-b968-6ae15e6fc031",
      pageNo,
      roleId,
      queryStatus: activeStatus,
      selectedRole,
      selectedDateRanges,
      selectedOption,
      searchText,
      sort,
      tin,
    });
  };

  const getRolesList = async () => {
    const res = await getAllTabRoles({pageId:"8c1eebaf-eb20-4758-b968-6ae15e6fc031"});
    if (res?.status === "SUCCESS") {
      setRoleId(res?.response?.allocationRoles[0]?.roleId);
      setSelectedRole(res?.response?.allocationRoles[0]?.aliasName);
    }
  };
  const showDrawer = () => {
    setTest(data?.response?.metaDataDTO);
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (data) => {
    setIsSubmitting(true);

    const payload = {
      pageId: "8c1eebaf-eb20-4758-b968-6ae15e6fc031",
      headerNames: data.map((col) => col.id),
    };

    try {
      const response = await tableDynamicColumn({ payload });
      if (response?.status === "SUCCESS") {
        setIsFilter(true);
        getQueryApproval();
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
      pageId: "8c1eebaf-eb20-4758-b968-6ae15e6fc031",
    };
    try {
      const response = await tableDynamicColumnReset({ payload });
      if (response?.status === "SUCCESS") {
        setIsFilter(true);
        getQueryApproval();
        onClose();
        getResponePopup(response);
      }
      setIsResetting(false);
    } catch (error) {
      getResponePopup(error?.response);
    }
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

  useEffect(() => {
    getRolesList();
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
        paginationFirst,
        sort,
      } = routedData;
      setPageNo(pageNo ? pageNo : 0);
      setSearchText(searchText);
      setSelectedDateRanges(selectedDateRanges);
      setSelectedOption(selectedOption);
      setSelectedDates(selectedDates);
      setActiveFilters(activeFilters);
      setPaginationFirst(paginationFirst);
      setSort(sort);
    }
  }, [routedData]);

  useEffect(() => {
    setParamsFilter("check");
    if (window !== "undefined" && paramsFilter && roleId) {
      getQueryApproval();
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
    activeStatus,
    roleId,
    active,
    selectedRole,
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
  return (
    <div>
      {/* <Header /> */}
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
                        <div className="d-flex justify-content-between align-items-end w-100 border-bottom custom-tab-header">
                          <Nav
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
                                    getTableData({ reloadTrue: true });
                                    setSelectedRole(role.aliasName);
                                    setRoleId(role.roleId);
                                    setActive("Pending");
                                    setActiveStatus("PENDING");
                                  }}
                                  className="mt-4"
                                  eventKey={index + 1}
                                >
                                  {role?.aliasName
                                    ?.replace(/_/g, " ")
                                    ?.replace(/\b\w/g, (c) => c.toUpperCase())}
                                </Nav.Link>
                              </Nav.Item>
                            ))}
                          </Nav>

                          <div className="d-flex align-items-center gap-2 me-3 mb-2">
                            <div
                              id="table-btn"
                              name="table-btn"
                              className="d-flex justify-content-center align-items-center   mt-4"
                            >
                              <Button
                                data-testid="table-custom"
                                name="table-custom"
                                onClick={showDrawer}
                                style={{
                                  cursor: {
                                    cursor: tableLoader
                                      ? "not-allowed"
                                      : "pointer",
                                  },
                                }}
                                className="btn-sm w-full text-ellipsis tableButton"
                                disabled={tableLoader ? true : false}
                              >
                                Table Customization
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="d-flex">
                        <div className="mt-4 w-100">
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
                            setPageNo={setPageNo}
                            setSearch={setSearch}
                            search={search}
                            //customize table

                            open={open}
                            onClose={onClose}
                            selectedColumns={test}
                            setSelectedColumns={setTest}
                            showCustomizeTable={false}
                            showDrawer={showDrawer}
                            handleSubmit={handleSubmit}
                            handleReset={handleReset}
                            isSubmitting={isSubmitting}
                            isResetting={isResetting}
                            setClear={setClear}
                            tableLoader={tableLoader}
                          />
                        </div>
                      </div>
                      <Tab.Content>
                        <Tab.Pane eventKey={activeTab}>
                          <QueryTable
                            tableLoader={tableLoader}
                            setActiveStatus={setActiveStatus}
                            active={active}
                            setActive={setActive}
                            gotoPatientDetails={gotoPatientDetails}
                            setSort={setSort}
                            sort={sort}
                            statusBodyTemplate={statusBodyTemplate}
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
    allRoles: state?.tenantAdmin?.patientsAllocation?.getRoles?.data?.response,
    rolesLoader: state?.tenantAdmin?.patientsAllocation?.rolesLoader,
    tableLoader: state?.tableView?.tableViewLoading,
    data: state?.tableView?.tableView?.data,
    pageLoad: state?.tenantAdmin?.tin?.getPageRendering,
  }),
  {
    getAllOrganizationList: tenantAdminUsersAction?.getAllOrganizationAction,
    getAllReviewerList: allActions.getAllReviewerList,
    getAllCheckedReviewers: allActions.getAllCheckedListForReviewer,
    allocationList: allActions.getAllAllocationList,
    getReviewerList: allActions.getFilterOptions,
    getRoutedData: tinActions.getAllocationRoutedData,
    getAllTabRoles: allActions.getAllRoles,
    getTableData: tableAction.tableViewAction,
    tableDynamicColumn: tableAction.tableDynamicColumn,
    tableDynamicColumnReset: tableAction.tableDynamicColumnReset,
  }
);

export default connector(QueryApproval);
