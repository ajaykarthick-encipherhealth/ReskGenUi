import React, { useEffect, useState } from "react";
import { Tab, Nav } from "react-bootstrap";
import { Button, Input, Tooltip, Space } from "antd";
import { connect } from "react-redux";
import { actions as allActions } from "../../stores/tenantAdmin/patientAllocations";
import ReusableFilters from "../../components/reusableFilters";
import { priorityOptions } from "../../components/headerFilters/functions";
import { actions as tenantAdminUsersAction } from "../../stores/tenantAdmin/users";
import { actions as tinActions } from "../../stores/tenantAdmin/tin";
import QueryTable from "./queryTable";
import Header from "../../jsx/layouts/nav/Header";
import CardSkeleton from "../../components/skeleton/card";
import { actions as tableAction } from "../../stores/tableView";
import { getResponePopup } from "../../utils/reusable";
import { getStorage, setStorage } from "../../utils/storages";
import { useRouter } from "next/router";

const QueryApproval = ({
  organizationList,
  getAllOrganizationList,
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
  const navigate = useRouter()
  const [activeTab, setActiveTab] = useState();
  const [searchText, setSearchText] = useState(null);
  const [selectedOption, setSelectedOption] = useState({});
  const [selectedDateRanges, setSelectedDateRanges] = useState({});
  const [selectedDates, setSelectedDates] = useState([]);
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [paginationFirst, setPaginationFirst] = useState(0);
  const [paramsFilter, setParamsFilter] = useState(null);
  const [search, setSearch] = useState({});
  const [roleId, setRoleId] = useState(null);
  const [activeStatus, setActiveStatus] = useState("PENDING");
  const [active, setActive] = useState("Pending");
  const [test, setTest] = useState(data?.response?.metaDataDTO);
  const [open, setOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const handleTabChange = (key) => {
    setActiveTab(key);
    setSearchText("");
    setSelectedDateRanges([]);
    setSelectedOption({});
    setPageNo(0);
    setSearch({});
  };

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

  const gotoPatientDetails = (data) => {
    // if (data?.computing === 2) {
    //   const controller = new AbortController();
    //   const { signal } = controller;
    //   controller.abort();
      setStorage("patientId", data?.patientId);
      setStorage("aliasName" , selectedRole)
      var role = getStorage("userRole");
      if (role == "tenant_admin") {
        // getRoutedData(page);
        navigate.push({
          pathname: route ? route : "/tenantadmin/tin/details",
        });
      } 
    // } 
    // else {
    //   notification.warning({
    //     message: data?.patientId + " file not processed. Please wait.",
    //   });
    // }
  };
  const getQueryApproval = async () => {
    const response = await getTableData({
      pageId: "8c1eebaf-eb20-4758-b968-6ae15e6fc031",
      pageNo,
      pageSize,
      roleId,
      queryStatus: activeStatus,
      selectedRole,
    });
  };

  useEffect(() => {
    setParamsFilter("check");
    if (
      window !== "undefined" &&
      paramsFilter &&
      allRoles?.allocationRoles?.length > 0
    ) {
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

  const handleSubmit = async () => {
    const payload = {
      pageId: "8c1eebaf-eb20-4758-b968-6ae15e6fc031",
      headerNames: test
        .filter((col) => col.active)
        .map((col) => col.actualField),
    };

    try {
      const response = await tableDynamicColumn({ payload });
      if (response?.status === "SUCCESS") {
        getQueryApproval();
        onClose();
        getResponePopup(response);
      }
    } catch (error) {
      getResponePopup(error?.response);
    }
  };

  const handleReset = async () => {
    const payload = {
      pageId: "8c1eebaf-eb20-4758-b968-6ae15e6fc031",
    };
    try {
      const response = await tableDynamicColumnReset({ payload });
      if (response?.status === "SUCCESS") {
        getQueryApproval();
        onClose();
        getResponePopup(response);
      }
    } catch (error) {
      getResponePopup(error?.response);
    }
  };
  useEffect(() => {
    const filteredFilters = getFilterOption();
    setActiveFilters(filteredFilters);
  }, [activeTab]);

  const params = {
    pageNo,
    paginationFirst,
    sort,
    activeFilters,
    searchText,
    selectedOption,
    activeTab,
    search,
    activeStatus,
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
                                  // setRoleId(role.roleId);
                                  setSelectedRole(role.aliasName);
                                }}
                                className="mt-4"
                                eventKey={index + 1}
                              >
                                {role?.roleName
                                  ?.replace(/_/g, " ")
                                  ?.replace(/\b\w/g, (c) => c.toUpperCase())}
                              </Nav.Link>
                            </Nav.Item>
                          ))}
                        </Nav>
                      )}

                      <div className="d-flex">
                        <div className="mt-4 w-100">
                          <ReusableFilters
                            showFilter={false}
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
                            opt={opt}
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
                      </div>
                      <Tab.Content>
                        <Tab.Pane eventKey={activeTab}>
                          <QueryTable
                            tableLoader={tableLoader}
                            setActiveStatus={setActiveStatus}
                            active={active}
                            setActive={setActive}
                            gotoPatientDetails={gotoPatientDetails}
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
