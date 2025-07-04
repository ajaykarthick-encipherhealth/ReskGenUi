import React, { useEffect, useState } from "react";
import { Tab, Nav } from "react-bootstrap";
import ReAllocationTable from "./allocationTable";
import { Button, Tooltip } from "antd";
import { connect } from "react-redux";
import { actions as allActions } from "../../stores/tenantAdmin/patientAllocations";
import ReusableFilters from "../../components/reusableFilters";
import { actions as tinActions } from "../../stores/tenantAdmin/tin";
import { actions as tableAction } from "../../stores/tableView";
import CardSkeleton from "../../components/skeleton/card";
import { findMatchesByField, getResponePopup } from "../../utils/reusable";
import { getStorage } from "../../utils/storages";
import Reallocationmodal from "./allocationTable/reallocationmodal";

const ReAllocation = ({
  getAllTabRoles,
  routedData,
  getTableData,
  data,
  allRoles,
  rolesLoader,
  tableLoader,
  tableDynamicColumn,
  tableDynamicColumnReset,
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
  const [selectedRows, setSelectedRows] = useState([]);
  const [allocateModal, setAllocateModal] = useState(false);
  const [selectedChart, setSelectedChart] = useState([]);
  const [selectedRowsId, setSelectedRowsId] = useState([]);
  const [searchText, setSearchText] = useState(null);
  const [selectedOption, setSelectedOption] = useState({});
  const [selectedDateRanges, setSelectedDateRanges] = useState({});
  const [selectedDates, setSelectedDates] = useState([]);
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [roleId, setRoleId] = useState(null);
  const [paginationFirst, setPaginationFirst] = useState(0);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [paramsFilter, setParamsFilter] = useState(null);
  const [selectedUserName, setSelectedUserName] = useState([]);
  const [search, setSearch] = useState(null);
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [open, setOpen] = useState(false);
  const [test, setTest] = useState(data?.response?.metaDataDTO);
  const [checkedHeader, setCheckedHeader] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isAllocate, setIsAllocate] = useState(false);
  const [isFilter, setIsFilter] = useState(true);
  const [clear, setClear] = useState(false);
  const [roleAliasName, setRoleAliasName] = useState("");

  const handleTabChange = (key) => {
    getTableData({ reloadTrue: true });
    setActiveTab(key);
    setSelectedRows([]);
    setSearchText("");
    setSelectedDateRanges([]);
    setSelectedOption({});
    setPageNo(0);
    setSearch(null);
    setSelectedRowsId([]);
    setCheckedHeader(false);
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

 
  const getAllReAllocation = async () => {
    const tin = getStorage("tinNumber");
    const response = await getTableData({
      pageId: "21235203-2ce0-4ebc-b6d3-05a9d8e8fc75",
      pageNo,
      pageSize,
      roleId,
      selectedDateRanges,
      selectedOption,
      searchText,
      sort,
      tin,
      search,
      isAdmin:true,
      isMasterAudit: roleAliasName === "MASTER_AUDIT" ? true : false,
    });
  };
  const handleSubmit = async (data) => {
    setIsSubmitting(true);

    const payload = {
      pageId: "21235203-2ce0-4ebc-b6d3-05a9d8e8fc75",
      headerNames: data.map((col) => col.id),
    };

    try {
      const response = await tableDynamicColumn({ payload });
      if (response?.status === "SUCCESS") {
        setIsFilter(true);
        getAllReAllocation();
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
      pageId: "21235203-2ce0-4ebc-b6d3-05a9d8e8fc75",
    };
    try {
      const response = await tableDynamicColumnReset({ payload });
      if (response?.status === "SUCCESS") {
        setIsFilter(true);
        getAllReAllocation();
        onClose();
        getResponePopup(response);
      }
      setIsResetting(false);
    } catch (error) {
      getResponePopup(error?.response);
    }
  };

  const getRolesList = async () => {
    const res = await getAllTabRoles({pageId:"21235203-2ce0-4ebc-b6d3-05a9d8e8fc75"});
    if (res?.status === "SUCCESS") {
      setRoleId(res?.response?.allocationRoles[0]?.roleId);
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
    setSelectedRowsId(selectedRows);
  }, [selectedRows, setSelectedRowsId]);


  useEffect(() => {
    setParamsFilter("check");
    if (
      window !== "undefined" &&
      paramsFilter &&
      roleId
    ) {
      getAllReAllocation();
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
    roleAliasName
  ]);

  useEffect(() => {
    getRolesList();
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
    <div>
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
                        <CardSkeleton height={50} />
                      ) : (
                        <div className="d-flex justify-content-between align-items-end w-100   custom-tab-header">
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
                                    setSelectedRows([]);
                                    setSelectedRowsId([]);
                                    setSelectedUserName([]);
                                    getTableData({ reloadTrue: true });
                                    setRoleAliasName(role.aliasName);
                                  }}
                                  eventKey={index + 1}
                                >
                                  {role?.aliasName
                                    ?.replace(/_/g, " ")
                                    ?.replace(/\b\w/g, (c) => c.toUpperCase())}
                                </Nav.Link>
                              </Nav.Item>
                            ))}
                          </Nav>

                          <div className="d-flex gap-2 ms-auto  mb-2">
                            <div
                              id="re-allocate-btn"
                              name="re-allocate-btn"
                              className="d-flex justify-content-center align-items-center   mt-4"
                            >
                                <Tooltip
                                  title={
                                    selectedRowsId?.length === 0
                                      ? "Select patients to ReAllocate"
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
                                    ReAllocate
                                  </Button>
                                </Tooltip>
                            </div>
                            <div
                              id="table-btn"
                              name="table-btn"
                              className="d-flex justify-content-center align-items-center   mt-4"
                            >
                              <Button
                                data-testid="table-custom"
                                name="table-custom"
                                onClick={showDrawer}
                                className="btn btn-sm w-full text-ellipsis tableButton"
                              >
                                Table Customization
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                      <div className={` d-flex gap-3 mt-4`}>
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
                        />
                      </div>

                      <Tab.Content>
                        <Tab.Pane eventKey={activeTab}>
                          <ReAllocationTable
                            selectedRowsId={selectedRowsId}
                            setSelectedRows={setSelectedRows}
                            selectedRows={selectedRows}
                            setSelectedRowsId={setSelectedRowsId}
                            pageNo={pageNo}
                            setPageNo={setPageNo}
                            paginationFirst={paginationFirst}
                            setPaginationFirst={setPaginationFirst}
                            selectedUserName={selectedUserName}
                            setSelectedUserName={setSelectedUserName}
                            setSort={setSort}
                            sort={sort}
                            data={data}
                            tableLoader={tableLoader}
                            roleId={roleId}
                            checkedHeader={checkedHeader}
                            setCheckedHeader={setCheckedHeader}
                            statusBodyTemplate={statusBodyTemplate}
                            search={search}
                            searchText={searchText}
                            selectedOption={selectedOption}
                            selectedDateRanges={selectedDateRanges}
                            roleAliasName={roleAliasName}
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

      <Reallocationmodal
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
        selectedRoleId={selectedRoleId}
        getAllReAllocation={getAllReAllocation}
        roleId={roleId}
        isAllocate={isAllocate}
        setIsAllocate={setIsAllocate}
        allocateModal={allocateModal}
        roleAliasName={roleAliasName}
      />
    </div>
  );
};

const connector = connect(
  (state) => ({
    routedData: state.tenantAdmin?.tin?.allocationRoutedData,
    data: state?.tableView?.tableView?.data,
    allRoles: state?.tenantAdmin?.patientsAllocation?.getRoles?.data?.response,
    rolesLoader: state?.tenantAdmin?.patientsAllocation?.rolesLoader,
    tableLoader: state?.tableView?.tableViewLoading,
    pageLoad: state?.tenantAdmin?.tin?.getPageRendering,
  }),
  {
    getAllCheckedReviewers: allActions.getAllCheckedListForReviewer,
    getRoutedData: tinActions.getAllocationRoutedData,
    getTableData: tableAction.tableViewAction,
    getAllTabRoles: allActions.getAllRoles,
    tableDynamicColumn: tableAction.tableDynamicColumn,
    tableDynamicColumnReset: tableAction.tableDynamicColumnReset,
  }
);

export default connector(ReAllocation);
