import React, { useEffect, useState } from "react";
import { Tab, Nav } from "react-bootstrap";
import Header from "../../jsx/layouts/nav/Header";
import { Button, Input, Tooltip, Space } from "antd";
import { connect } from "react-redux";
import { actions as allActions } from "../../stores/tenantAdmin/patientAllocations";
import ReusableFilters from "../../components/reusableFilters";
import { actions as tenantAdminUsersAction } from "../../stores/tenantAdmin/users";
import { actions as tinActions } from "../../stores/tenantAdmin/tin";
import MoveBackModal from "./moveBackModal";
import MoveBackTable from "./moveBackTable";
import { actions as tableAction } from "../../stores/tableView";
import CardSkeleton from "../../components/skeleton/card";
import {
  findMatchesByField,
  getResponePopup,
  tableCustomFilterClearCheck,
} from "../../utils/reusable";
import { getStorage } from "../../utils/storages";
import { moveBackPageId } from "../../utils/pageIds";
import MoreFilter from "../../pages/tenantadmin/tracking/filters";

const MoveBack = ({
  tableLoader,
  organizationList,
  rolesLoader,
  routedData,
  getTableData,
  data,
  getAllTabRoles,
  allRoles,
  tableDynamicColumn,
  tableDynamicColumnReset,
  moveBackLevel,
  pageLoad,
  statusBodyTemplate,
}) => {
  const [activeFilters, setActiveFilters] = useState([]);
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [moveBackLoader, setIsMoveBackLoader] = useState(false);
  const [isFilter, setIsFilter] = useState(true);
  const [clear, setClear] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const handleClearAllFilters = () => {
    setClear(true);
    setSearchText(null);
    setSelectedDateRanges({});
    setSelectedDates([]);
    setSelectedOption({});
  };
  const handleClearFilters = () => {
    setSelectAll(false);
    setActiveFilters((prevFilters) =>
      prevFilters.map((filter) => ({ ...filter, active: true }))
    );
    setSelectedDateRanges({});
    setSelectedDates([]);
    setSelectedOption({});
    setSearchText(null);
  };
  const handleTabChange = (key) => {
    getTableData({ reloadTrue: true });
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

  const showDrawer = () => {
    setTest(data?.response?.metaDataDTO);
    setOpen(true);
  };

  const getRolesList = async () => {
    const res = await getAllTabRoles({
      pageId: moveBackPageId,
    });
    if (res?.status === "SUCCESS") {
      setRoleId(res?.response?.allocationRoles[0]?.roleId);
    }
  };
  const getMoveBack = async () => {
    const tin = getStorage("tinNumber");
    const response = await getTableData({
      pageId: moveBackPageId,
      pageNo,
      pageSize,
      roleId,
      selectedRole,
      selectedDateRanges,
      selectedOption,
      searchText,
      sort,
      tin,
    });
  };
  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    const payload = {
      pageId: moveBackPageId,
      headerNames: data.map((col) => col.id),
    };
    try {
      const response = await tableDynamicColumn({ payload });
      if (response?.status === "SUCCESS") {
        setIsFilter(true);
        const filterCheck = tableCustomFilterClearCheck({
          searchText,
          selectedDateRanges,
          selectedDates,
          selectedOption,
          setSearchText,
          setSelectedDateRanges,
          setSelectedDates,
          setSelectedOption,
          data,
        });
        if (filterCheck) {
          getMoveBack();
        }

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
      pageId: moveBackPageId,
    };
    try {
      const response = await tableDynamicColumnReset({ payload });
      if (response?.status === "SUCCESS") {
        setIsFilter(true);
        getMoveBack();
        onClose();
        getResponePopup(response);
      }
      setIsResetting(false);
    } catch (error) {
      getResponePopup(error?.response);
    }
  };

  useEffect(() => {
    getRolesList();
  }, []);

  useEffect(() => {
    setParamsFilter("check");
    if (window !== "undefined" && paramsFilter && roleId) {
      getMoveBack();
      // setSelectedRows([])
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
    roleId,
    pageLoad,
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
    setSelectedRowsId(selectedRows);
  }, [selectedRows, setSelectedRowsId]);

  useEffect(() => {
    if (
      window !== "undefined" &&
      paramsFilter &&
      allRoles?.allocationRoles?.length > 0
    ) {
      moveBackLevel({
        roleId: roleId,
      });
    }
  }, [roleId]);

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
                            as="li"
                            variant="tabs"
                            className="nav nav-tabs profile-tab"
                          >
                            {allRoles?.allocationRoles?.map((role, index) => (
                              <Nav.Item
                                as="li"
                                className="nav-item profile-tab"
                                key={role}
                              >
                                <Nav.Link
                                  onClick={() => {
                                    setRoleId(role.roleId);
                                    getTableData({ reloadTrue: true });
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

                          <div className="d-flex ms-auto gap-2 mb-2 me-2">
                            <div className="mt-2">
                              <MoreFilter
                                selectAll={selectAll}
                                setSelectAll={setSelectAll}
                                activeFilters={activeFilters}
                                FilterItems={activeFilters}
                                setActiveFilters={setActiveFilters}
                                setClear={setClear}
                                handleClearAllFilters={handleClearAllFilters}
                                handleClearFilters={handleClearFilters}
                              />
                            </div>
                            <Nav.Item as="li" className="nav-item profile-tab">
                              <div
                                id="random-btn"
                                name="random-btn"
                                className="d-flex justify-content-center align-items-center   mt-4"
                              >
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
                                    className="tableButton"
                                    disabled={selectedRowsId?.length === 0}
                                  >
                                    Move Back
                                  </Button>
                                </Tooltip>
                              </div>
                            </Nav.Item>
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
                      {/* {tableLoader ? (
                        <CardSkeleton height={50} />
                      ) : ( */}
                      <div className="d-flex ">
                        <div
                          style={{ width: "100%" }}
                          className={` d-flex gap-3 mt-1 `}
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
                            FilterItems={activeFilters}
                            selectedDates={selectedDates}
                            setSelectedDates={setSelectedDates}
                            activeFilters={activeFilters}
                            setPageNo={setPageNo}
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
                            roleId={roleId}
                            selectedRole={selectedRole}
                            statusBodyTemplate={statusBodyTemplate}
                            searchText={searchText}
                            selectedOption={selectedOption}
                            selectedDateRanges={selectedDateRanges}
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
        moveBackLoader={moveBackLoader}
        setIsMoveBackLoader={setIsMoveBackLoader}
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
    pageLoad: state?.tenantAdmin?.tin?.getPageRendering,
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
    tableDynamicColumnReset: tableAction.tableDynamicColumnReset,
    moveBackLevel: allActions.getMoveBackLevel,
  }
);

export default connector(MoveBack);
