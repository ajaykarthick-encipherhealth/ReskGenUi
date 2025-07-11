import React, { useEffect, useState } from "react";
import { Tab, Nav } from "react-bootstrap";
import { Button, Tooltip } from "antd";
import { connect } from "react-redux";
import { actions as allActions } from "../../../stores/tenantAdmin/patientAllocations";
import { actions as tinActions } from "../../../stores/tenantAdmin/tin";
import { actions as tableAction } from "../../../stores/tableView";
import { findMatchesByField, getResponePopup } from "../../../utils/reusable";
import { getStorage } from "../../../utils/storages";
import ReusableFilters from "../../../components/reusableFilters";
import CardSkeleton from "../../../components/skeleton/card";
import AppTable from "../../../components/tables";

const Productivity = ({
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
  const [selectedRowsId, setSelectedRowsId] = useState([]);
  const [searchText, setSearchText] = useState(null);
  const [selectedOption, setSelectedOption] = useState({});
  const [selectedDateRanges, setSelectedDateRanges] = useState({});
  const [selectedDates, setSelectedDates] = useState([]);
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [roleId, setRoleId] = useState(null);
  const [paginationFirst, setPaginationFirst] = useState(0);
  const [paramsFilter, setParamsFilter] = useState(null);
  const [search, setSearch] = useState(null);
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [open, setOpen] = useState(false);
  const [test, setTest] = useState(data?.response?.metaDataDTO);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isFilter, setIsFilter] = useState(true);
  const [roleAliasName, setRoleAliasName] = useState("");
  const [clear, setClear] = useState(false);
  const [totalDatas, setTotalDatas] = useState(null);
  const handleTabChange = (key) => {
    setTotalDatas(null);
    getTableData({ reloadTrue: true });
    setActiveTab(key);
    setSelectedRows([]);
    setSearchText("");
    setSelectedDateRanges([]);
    setSelectedOption({});
    setPageNo(0);
    setSearch(null);
    setSelectedRowsId([]);
  };

  const onClose = () => {
    setOpen(false);
  };
  const showDrawer = () => {
    setTest(data?.response?.metaDataDTO);
    setOpen(true);
  };

  const getAllAllocation = async () => {
    const tin = getStorage("tinNumber");
    const projectId = getStorage("project");
    const clientId = getStorage("client");
    const response = await getTableData({
      pageId: "73b15fb8-41cf-4e58-9d9b-a3256bbb79b0",
      pageNo,
      pageSize,
      roleId,
      selectedDateRanges,
      selectedOption,
      searchText,
      sort,
      tin,
      search,
      isMasterAudit: roleAliasName === "MASTER_AUDIT" ? true : false,
      allClient: false,
      allProject: false,
      allTin: true,
      clientId: clientId,
      projectId: projectId,
      tinIds: tin,
    });
  };
  const onPageChange = (e) => {
    setPaginationFirst(e.first);
    setPageNo(e.page);
  };

  const handleSubmit = async (data) => {
    setIsSubmitting(true);

    const payload = {
      pageId: "73b15fb8-41cf-4e58-9d9b-a3256bbb79b0",
      headerNames: data.map((col) => col.id),
    };

    try {
      const response = await tableDynamicColumn({ payload });
      if (response?.status === "SUCCESS") {
        setIsFilter(true);
        getAllAllocation();
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
      pageId: "73b15fb8-41cf-4e58-9d9b-a3256bbb79b0",
    };
    try {
      const response = await tableDynamicColumnReset({ payload });
      if (response?.status === "SUCCESS") {
        setIsFilter(true);
        getAllAllocation();
        onClose();
        getResponePopup(response);
      }
      setIsResetting(false);
    } catch (error) {
      getResponePopup(error?.response);
    }
  };

  const getRolesList = async () => {
    const res = await getAllTabRoles({
      pageId: "73b15fb8-41cf-4e58-9d9b-a3256bbb79b0",
    });
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
    if (window !== "undefined" && paramsFilter && roleId) {
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
    roleId,
    pageLoad,
    roleAliasName,
    selectedRoleId,
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
    if(data?.response?.pageResponse?.content){
 setTotalDatas([
      ...(data?.response?.pageResponse?.content || []),
      data?.response?.totalResponse || [],
    ]);
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
                  <div className="custom-tab-1" style={{ marginTop: "25px" }}>
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

                      <Tab.Content>
                        <Tab.Pane eventKey={activeTab}>
                          <div className="mt-2">
                            <AppTable
                              data={totalDatas}
                              column={data?.response?.metaDataDTO.filter(
                                (item) => item.active && item?.columnActive
                              )}
                              loader={tableLoader}
                              pagination={false}
                              setSort={setSort}
                              sort={sort}
                              tableId="tracking_table"
                              first={pageNo === 0 ? 0 : paginationFirst}
                              totalRecords={
                                data?.response?.pageResponse?.totalElements
                              }
                              row={15}
                              onPageChange={onPageChange}
                              totalCountHead={true}
                              totalCountData={data?.response?.totalResponse}
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
        </div>
      </div>
    </div>
  );
};

const connector = connect(
  (state) => ({
    loader: state.tenantAdmin?.patientsAllocation?.loader,
    routedData: state.tenantAdmin?.tin?.allocationRoutedData,
    data: state?.tableView?.tableView?.data,
    allRoles: state?.tenantAdmin?.patientsAllocation?.getRoles?.data?.response,
    rolesLoader: state?.tenantAdmin?.patientsAllocation?.rolesLoader,
    tableLoader: state?.tableView?.tableViewLoading,
    pageLoad: state?.tenantAdmin?.tin?.getPageRendering,
  }),
  {
    getRoutedData: tinActions.getAllocationRoutedData,
    getTableData: tableAction.tableViewAction,
    getAllTabRoles: allActions.getAllRoles,
    tableDynamicColumn: tableAction.tableDynamicColumn,
    tableDynamicColumnReset: tableAction.tableDynamicColumnReset,
  }
);

export default connector(Productivity);
