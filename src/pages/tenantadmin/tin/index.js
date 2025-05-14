import React, { useEffect, useState } from "react";
import Header from "../../../jsx/layouts/nav/Header";
import { actions as tinActions } from "../../../stores/tenantAdmin/tin";
import Tab from "../../../mainStream/components/tags";
import { connect } from "react-redux";
import RegularButton from "../../../components/button";
import CustomizableDrawer from "../../../components/customizeDrawer";
import { useRouter } from "next/router";
import ReusableFilters from "../../../components/reusableFilters";
import AppTable from "../../../components/tables";
import { actions as allActions } from "../../../stores/reviewer/workqueue";
import { getStorage, setStorage } from "../../../utils/storages";
import { statusOptions } from "../../reviewer/patients";
import visitStyles from "../../../styles/visitdata.module.css";
import { actions as supervisorActions } from "../../../stores/supervisor/auditedQueue";

import {
  findItemWithTrueKey,
  findMatchesByField,
  getAccessTabItems,
  getResponePopup,
} from "../../../utils/reusable";
import { actions as tableAction } from "../../../stores/tableView";
import styles from "../../../styles/visitdata.module.css";
import { Button, Popconfirm, Spin } from "antd";
import { LoadingOutlined, PlusCircleFilled } from "@ant-design/icons";
import {
  generateOptionsForNewStore,
  priorityOptions,
} from "../../../components/headerFilters/functions";

const commonFilterItems = [
  {
    id: "01",
    title: "Tin",
    type: "search",
    value: null,
    placeholder: "Search",
    pickerType: "search",
    header: "Tin Name / ID",
    active: true,
  },
  {
    id: "02",
    title: "Priority",
    type: "select",
    value: null,
    placeholder: "Priority",
    options: null,
    active: true,
  },
];
const columns = [
  {
    id: 1,
    title: "Search",
    type: "search",
    value: null,
    placeholder: "Search",
    pickerType: "search",
    header: "Tin",
    active: true,
  },
  {
    id: 2,
    title: "Search",
    type: "search",
    value: null,
    placeholder: "Search",
    pickerType: "search",
    header: "Batch Name",
    active: true,
  },
  {
    name: "Providers",
    value: "fileName",
    isShow: true,
  },
  {
    name: "Patients",
    value: "validDiseaseCount",
    isShow: true,
  },
  {
    name: "Not Assigned",
    value: "allocatedOn",
    isShow: true,
    filterKey: "allocatedDate",
  },
  {
    name: "Downloading",
    value: "dueDate",

    isDate: true,
    isShow: true,
    filterKey: "dueDate",
  },
  {
    name: "Coder 1",
    value: "processedDate",
    isDate: true,
    isShow: true,
    filterKey: "completedDate",
  },

  {
    name: "Coder 2",
    isShow: true,
  },
  {
    name: "QA",
    value: "",
    isShow: true,
    filterKey: "Priority",
  },
  {
    name: "Downloader Not Complete",
    value: "statusProxy",
    isShow: true,
    filterKey: "Status",
  },
  {
    name: "Complete",
    value: "statusProxy",
    isShow: true,
    filterKey: "Status",
  },
  {
    name: "priority",
    value: "",
    isShow: true,
    filterKey: "",
  },
];
export const getPageId = (activeTab) => {
  switch (activeTab) {
    case "Active":
      return "2d7cb7f7-6dad-41fb-970b-d805fb3f195f";
    case "InActive":
      return "6579b31a-aa46-42bf-abbb-c1e17e987a3a";
    case "Providers":
      return "32e9eea6-095c-4bd3-abee-17835ea53cdc";
    default:
      return "";
  }
};
const Tin = ({
  getProjectActiveTab,
  activeTabName,
  tableDynamicColumn,
  tableDynamicColumnReset,
  tableLoader,
  routedData,
  getTableData,
  data,
  pageLoad,
  getTinCountData,
  tinCount,
  setTinStatus,
  getTableDataChecked,
  tinPriority,
}) => {
  const tabs = getAccessTabItems({ page: "Tin", tabsMenu: "tabMenuList" });
  const activeTab = activeTabName || tabs?.[0] || "Active";
  const router = useRouter();
  const [activeFilters, setActiveFilters] = useState([]);
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

  const [switchStates, setSwitchStates] = useState({});
  const [selectedOption, setSelectedOption] = useState({});
  const [pageNo, setPageNo] = useState(0);
  const [paginationFirst, setPaginationFirst] = useState(0);
  const [paramsFilter, setParamsFilter] = useState(null);
  const [open, setOpen] = useState(false);
  const [test, setTest] = useState(data?.response?.metaDataDTO);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [searchText, setSearchText] = useState(null);
  const [selectedDateRanges, setSelectedDateRanges] = useState({});
  const [selectedDates, setSelectedDates] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [clear, setClear] = useState(false);
  const [selectedRowsId, setSelectedRowsId] = useState([]);
  const [selectedUserName, setSelectedUserName] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [checkedLoader, setCheckedLoader] = useState(false);
  const [checkedHeader, setCheckedHeader] = useState(false);
  const [parsedData, setParsedData] = useState([]);
  const [pageSize, setPageSize] = useState(15);
  const [priority, setPriority] = useState(null);
  const [isFilter, setIsFilter] = useState(true);

  const gotoPatientDetails = (rowData) => {
    setStorage("patientId", rowData.patientId);
    setStorage("tinNumber", rowData.tinNumber);
    setStorage("routeBackTo", "/tenantadmin/tin");
    setStorage("activeTabTin", activeTab);
    router.push("/tenantadmin/tin/tindetails?tab=Patients");
  };

  const handleTabs = (name) => {
    setSort("");
    setSelectedOption({});
    getProjectActiveTab({ tinTabName: name });
    setPageNo(0);
    getAllTins(name);
    setSelectedRowsId([]);
    setSelectedRows([]);
  };
  const onPageChange = (e) => {
    setPaginationFirst(e.first);
    setPageNo(e.page);
    setPageSize(e.rows);
  };
  const showDrawer = () => {
    setTest(data?.response?.metaDataDTO);
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  const pageIds =
    activeTab === "Active"
      ? "2d7cb7f7-6dad-41fb-970b-d805fb3f195f"
      : activeTab === "InActive"
      ? "6579b31a-aa46-42bf-abbb-c1e17e987a3a"
      : activeTab === "Providers"
      ? "32e9eea6-095c-4bd3-abee-17835ea53cdc"
      : "";
  const handleRowCheckboxChange = async ({ e, row, singleCheck, checked }) => {
    if (!singleCheck) {
      if (checked) {
        setCheckedLoader(true);
        setCheckedHeader(true);

        const response = await getTableDataChecked({
          allTinIds: checked,
          pageId: pageIds,
          pageNo: 0,
          pageSize: 15,
        });

        if (response?.status === "SUCCESS") {
          const result = response.response.tinNumbers?.map((patient) => {
            return {
              patientId: patient,
            };
          });

          // setSelectedRows(result.map((patient) => patient));
          setSelectedRows(
            result.map((patient) => {
              return patient.patientId;
            })
          );
          setSelectedRowsId(result);
          setSelectedUserName(result);
        }
        setCheckedLoader(false);
      } else {
        setSelectedRows([]);
        setSelectedRowsId([]);
        setSelectedUserName([]);
        setCheckedLoader(false);
        setCheckedHeader(false);
      }
    } else {
      setSelectedUserName((prev) => {
        let updatedSelection = e.target.checked
          ? [...prev, { ids: row.id }]
          : prev.filter((user) => user.id !== row.id);
        return updatedSelection;
      });
      setSelectedRows((prev) => {
        let updatedSelection = e.target.checked
          ? [...prev, row.id]
          : prev.filter((id) => id !== row.id);

        setSelectedRowsId(
          updatedSelection.map((id) => ({
            patientId: id,
            patientName: row.patientName,
          }))
        );
        return updatedSelection;
      });
    }
  };

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    const payload = {
      pageId: pageIds,
      headerNames: data.map((col) => col.id),
    };

    try {
      const response = await tableDynamicColumn({ payload });
      if (response?.status === "SUCCESS") {
        setIsFilter(true);
        getAllTins();
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
      pageId: pageIds,
    };

    try {
      const response = await tableDynamicColumnReset({ payload });
      if (response?.status === "SUCCESS") {
        setIsFilter(true);
        getAllTins();
        onClose();
        getResponePopup(response);
      }
      setIsResetting(false);
    } catch (error) {
      getResponePopup(error?.response);
    }
  };
  const processstatusBodyTemplate = (rowData) => {
    const isFinished =
      parsedData?.length > 0 &&
      parsedData?.find(
        (data) =>
          data?.patientId === rowData?.patientId &&
          data?.processStageChart === "FINISHED"
      ) !== undefined;

    const rowStatus =
      rowData?.computing === 0 && parsedData?.length === 0
        ? "Not Computed"
        : rowData?.computing == 1
        ? "Processing"
        : isFinished || rowData?.computing == 2
        ? "Computed"
        : rowData?.computing == 3
        ? "Failed"
        : "Not Computed";
    return (
      <div className="patient-status">
        <div
          className={visitStyles.roleStyle}
          style={{
            backgroundColor:
              rowStatus === "Computed"
                ? "#cceeff "
                : rowStatus === "Processing"
                ? "#dfd8f3"
                : rowStatus === "Failed"
                ? "#e88d8d"
                : "#F1DEDA",
            color:
              rowStatus === "Computed"
                ? " #285563"
                : rowStatus === "Processing"
                ? "#452b90"
                : rowStatus === "Failed"
                ? "red"
                : "#BA704F",
          }}
        >
          {rowStatus === "Processing" && (
            <Spin
              indicator={
                <LoadingOutlined
                  style={{
                    fontSize: 16,
                  }}
                  spin
                  className="ant-badge"
                />
              }
              style={{ color: "#452b90", margin: "0 10px 0 0" }}
            />
          )}
          {rowStatus}
        </div>
      </div>
    );
  };
  const handleTinStatus = async () => {
    const payload = {
      ids: selectedRows,
      isActive: activeTab === "InActive" ? true : false,
    };

    try {
      const response = await setTinStatus({ payload });
      if (response?.status === "SUCCESS") {
        getAllTins();
        getTinCountData();
        onClose();
        getResponePopup(response);
      }
    } catch (error) {
      getResponePopup(error?.response);
    }
  };
  const opt = {
    priority: priorityOptions,
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
    }
  }, [routedData]);
  const params = {
    pageNo,
    paginationFirst,
    sort,
    activeFilters,
    selectedOption,
  };
  useEffect(() => {
    if (routedData) {
      const { pageNo, selectedOption, activeFilters, paginationFirst, sort } =
        routedData;
      setPageNo(pageNo ? pageNo : 0);
      setSelectedOption(selectedOption);
      setActiveFilters(activeFilters);
      setPaginationFirst(paginationFirst);
      setSort(sort);
    }
  }, [routedData]);

  const getAllTins = async (tabOverride) => {
    const currentTab = tabOverride || activeTab;
    const pageId = getPageId(currentTab);
    const projectId = getStorage("project");

    await getTableData({
      pageId,
      pageNo,
      pageSize: 15,
      roleId: "",
      projectId: "test",
      allTinIds: false,
      sort,
      selectedDateRanges,
      selectedOption,
      searchText,
    });
  };
  // const handlePriorityChange = async (
  //   patientId,
  //   selectedValue,
  // ) => {
  //   console.log(patientId, selectedValue,"tin");
  //   const tinNumber = getStorage("tinNumber");
  //   cosnole.log(priority, "priority");

  //   const data = {
  //     tin: tinNumber,
  //     priority: selectedValue,
  //   };
  //   console.log(data, "data");
  //   const res = await supervisorPriority(data);
  //   getResponePopup(res);
  //   setPriority({ selectedValue: selectedValue});
  //   if (res.status === "SUCCESS") {
  //     getAllTins();
  //     setParamsFilter("check");
  //   }
  // };
  const handlePriorityChange = async (tinNumber, selectedValue) => {
    console.log(tinNumber, selectedValue, "tin");
    const data = {
      tin: tinNumber,
      priority: selectedValue,
    };
    console.log(data, "data");

    try {
      const res = await tinPriority(data);
      getResponePopup(res);

      if (res?.status === "SUCCESS") {
        setPriority((prev) => ({ ...prev, [tinNumber]: selectedValue }));
        getAllTins();
        setParamsFilter("check");
      }
    } catch (error) {
      console.error("Failed to update priority", error);
    }
  };

  const handleSwitchToggle = async (item, checked) => {};

  useEffect(() => {
    setParamsFilter("check");
    if (paramsFilter === "check") {
      getAllTins();
      getTinCountData();
    }
  }, [
    pageNo,
    paramsFilter,
    pageLoad,
    selectedDateRanges,
    selectedOption,
    sort,
    searchText,
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

  // useEffect(() => {
  //   if (data?.response?.pageResponse?.content) {
  //     const initialSwitchStates = {};
  //     data?.response?.pageResponse?.content.forEach((user) => {
  //       initialSwitchStates[user.providerNpi] = user.active;
  //     });
  //     setSwitchStates(initialSwitchStates);
  //   }
  // }, [data?.response?.pageResponse?.content]);

  return (
    <div className={`show`}>
      <Header />
      <div
        className="d-flex justify-content-end position-relative"
        style={{ marginTop: "5%", width: "100%" }}
      >
        <div
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <Tab
            activeTab={activeTab}
            handleTabs={handleTabs}
            tabs={tabs}
            margin={"0"}
            width={"100%"}
            padding={"50px"}
          />
        </div>
        {activeTab !== "Providers" && (
          <div className="d-flex align-items-center justify-content-end gap-4">
            <div className={styles.font}>
              Total Tin : {tinCount?.totalTin ? tinCount?.totalTin : 0}
            </div>
            <div className={styles.font}>
              Active Tin : {tinCount?.activeTin ? tinCount?.activeTin : 0}
            </div>
            <div className={styles.font}>
              InActive Tin : {tinCount?.inactiveTin ? tinCount?.inactiveTin : 0}
            </div>

            <div className="p-3">
              <Popconfirm
                title={`Are you sure you want to mark this as ${
                  activeTab === "InActive" ? "Active" : "InActive"
                }?`}
                onConfirm={handleTinStatus}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  data-testid="activeBtn"
                  name="activeBtn"
                  className="tableButton"
                  disabled={selectedRowsId?.length === 0}
                >
                  Change to {activeTab === "InActive" ? "Active" : "InActive"}
                </Button>
              </Popconfirm>
            </div>
          </div>
        )}
      </div>

      <div className=" mt-3  container-fluid table-responsive active-projects task-table">
        <div className="d-flex">
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
              FilterItems={activeFilters}
              selectedDates={selectedDates}
              setSelectedDates={setSelectedDates}
              activeFilters={activeFilters}
              setClear={setClear}
              clear={clear}
              setPageNo={setPageNo}
              opt={opt}
              //customize table
              open={open}
              onClose={onClose}
              selectedColumns={test}
              setSelectedColumns={setTest}
              showCustomizeTable={true}
              showDrawer={showDrawer}
              commonFilterItems={commonFilterItems}
              handleSubmit={handleSubmit}
              handleReset={handleReset}
              isSubmitting={isSubmitting}
              isResetting={isResetting}
            />
          </div>
        </div>
        <div className="profile-tab  mt-3">
          <div className="mt-3">
            {activeTab === "Active" && (
              <AppTable
                data={data?.response?.pageResponse?.content}
                column={data?.response?.metaDataDTO.filter(
                  (item) => item.active
                )}
                loader={tableLoader}
                // onRowClick={gotoPatientDetails}
                pagination={false}
                setSort={setSort}
                sort={sort}
                first={pageNo === 0 ? 0 : paginationFirst}
                totalRecords={data?.response?.pageResponse?.totalElements}
                row={15}
                onPageChange={onPageChange}
                isCheckBox={findItemWithTrueKey(
                  data?.response?.staticDesign,
                  "checkBox"
                )}
                checkedHeader={
                  selectedRows?.length ===
                    data?.response?.pageResponse?.totalElements &&
                  data?.response?.pageResponse?.totalElements !== 0
                }
                selectedRowsId={selectedRowsId}
                setSelectedRowsId={setSelectedRowsId}
                setSelectedRows={setSelectedRows}
                selectedUserName={selectedUserName}
                handleRowCheckboxChange={handleRowCheckboxChange}
                onRowClick={gotoPatientDetails}
                selectedRows={selectedRows}
                idKey={"id"}
                checkBoxLoader={checkedLoader}
                setCheckedHeader={setCheckedHeader}
                statusBodyTemplate={processstatusBodyTemplate}
                handlePriorityChange={handlePriorityChange}
              />
            )}
            {activeTab === "InActive" && (
              <AppTable
                data={data?.response?.pageResponse?.content}
                column={data?.response?.metaDataDTO.filter(
                  (item) => item.active
                )}
                loader={tableLoader}
                // onRowClick={gotoPatientDetails}
                pagination={false}
                setSort={setSort}
                sort={sort}
                first={pageNo === 0 ? 0 : paginationFirst}
                totalRecords={data?.response?.pageResponse?.totalElements}
                row={15}
                onPageChange={onPageChange}
                isCheckBox={findItemWithTrueKey(
                  data?.response?.staticDesign,
                  "checkBox"
                )}
                checkedHeader={
                  selectedRows?.length ===
                    data?.response?.pageResponse?.totalElements &&
                  data?.response?.pageResponse?.totalElements !== 0
                }
                selectedRowsId={selectedRowsId}
                setSelectedRowsId={setSelectedRowsId}
                setSelectedRows={setSelectedRows}
                selectedUserName={selectedUserName}
                handleRowCheckboxChange={handleRowCheckboxChange}
                setCheckedHeader={setCheckedHeader}
                selectedRows={selectedRows}
                idKey={"id"}
                checkBoxLoader={checkedLoader}
                statusBodyTemplate={processstatusBodyTemplate}
              />
            )}
            {activeTab === "Providers" && (
              <AppTable
                data={data?.response?.pageResponse?.content}
                column={data?.response?.metaDataDTO.filter(
                  (item) => item.active
                )}
                loader={tableLoader}
                pagination={false}
                setSort={setSort}
                sort={sort}
                first={pageNo === 0 ? 0 : paginationFirst}
                totalRecords={data?.response?.pageResponse?.totalElements}
                row={15}
                onPageChange={onPageChange}
                onSwitchToggle={handleSwitchToggle}
                switchStates={switchStates}
                isCheckBox={findItemWithTrueKey(
                  data?.response?.staticDesign,
                  "checkBox"
                )}
                checkedHeader={
                  selectedRows?.length ===
                    data?.response?.pageResponse?.totalElements &&
                  data?.response?.pageResponse?.totalElements !== 0
                }
                selectedRowsId={selectedRowsId}
                setSelectedRowsId={setSelectedRowsId}
                setSelectedRows={setSelectedRows}
                selectedUserName={selectedUserName}
                statusBodyTemplate={processstatusBodyTemplate}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const enhancer = connect(
  (state) => ({
    activeTabName: state.tenantAdmin.tin?.activeTabRoutedData?.tinTabName,
    routedData: state.tenantAdmin?.tin?.activeTabRoutedData?.tinFilter,
    data: state?.tableView?.tableView?.data,
    tableLoader: state?.tableView?.tableViewLoading,
    pageLoad: state?.tenantAdmin?.tin?.getPageRendering,
    tinCount: state?.tableView?.TinCountView?.data?.response,
  }),
  {
    getProjectActiveTab: tinActions.getProjectActiveTab,
    getFilteApi: allActions.getReviewerPatients,
    getTableData: tableAction.tableViewAction,
    tableDynamicColumn: tableAction.tableDynamicColumn,
    tableDynamicColumnReset: tableAction.tableDynamicColumnReset,
    getTinCountData: tableAction.getTinCountAction,
    setTinStatus: tableAction.setTinStatus,
    getTableDataChecked: tableAction.tinDynamicChecked,
    tinPriority: supervisorActions.getPriorityChange,
  }
);

export default enhancer(Tin);
