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
import { setStorage } from "../../../utils/storages";
import { statusOptions } from "../../reviewer/patients";
import { getAccessTabItems, getResponePopup } from "../../../utils/reusable";
import { actions as tableAction } from "../../../stores/tableView";
import styles from "../../../styles/visitdata.module.css";
import { Button } from "antd";


const commonFilterItems = [
  {
    id: "01",
    title: "Tin",
    type: "select",
    value: null,
    placeholder: "Tin",
    options: null,
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
    name: "Tin",
    value: "patientId",
    isShow: true,
    filterKey: "Search",
  },
  {
    name: "Progress",
    value: "batchName",
    isShow: true,
    filterKey: "batch",
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
  getFilteApi,
  loading,
  tableDynamicColumn,
  tableDynamicColumnReset,
  tableLoader,
  routedData,
  getTableData,
  data,
  pageLoad
}) => {
  const tabs = getAccessTabItems({ page: "Tin", tabsMenu: "tabMenuList" });
  const activeTab = activeTabName || tabs?.[0] || "Active";
  const router = useRouter();
  const [activeFilters, setActiveFilters] = useState(commonFilterItems);
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

  const [selectedOption, setSelectedOption] = useState({});
  const [pageNo, setPageNo] = useState(0);
  const [paginationFirst, setPaginationFirst] = useState(0);
  const [paramsFilter, setParamsFilter] = useState(null);
  const [open, setOpen] = useState(false);
  const [test, setTest] = useState(data?.response?.metaDataDTO);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

const gotoPatientDetails = (rowData) => {
  setStorage("patientId", rowData.patientId);
  setStorage("tinNumber", rowData.tinNumber); 
  setStorage("routeBackTo", "/tenantadmin/tin");
  setStorage("activeTabTin", activeTab);

console.log(rowData, "rowData");
  getProjectActiveTab({
    tinFilter: params,
  });

  router.push("/tenantadmin/tin/tindetails?tab=Patients");
};

  // const handleTabs = (name) => {
  //   getProjectActiveTab({
  //     tinTabName: name,
  //   });
  //   setSelectedOption({});
  // };
  const handleTabs = (name) => {
    setSelectedOption({});
    getProjectActiveTab({ tinTabName: name }); 
    setPageNo(0); 
    getAllTins(name); 
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
  // const getPageIdByTab = (tab) => {
  //   switch (tab) {
  //     case "Active":
  //       return "2d7cb7f7-6dad-41fb-970b-d805fb3f195f";
  //     case "InActive":
  //       return "6579b31a-aa46-42bf-abbb-c1e17e987a3a";
  //     case "Providers":
  //       return "32e9eea6-095c-4bd3-abee-17835ea53cdc";
  //     default:
  //       return "";
  //   }
  // };

  const pageIds =
    activeTab === "Active"
      ? "2d7cb7f7-6dad-41fb-970b-d805fb3f195f"
      : activeTab === "InActive"
      ? "6579b31a-aa46-42bf-abbb-c1e17e987a3a"
      : activeTab === "Providers"
      ? "32e9eea6-095c-4bd3-abee-17835ea53cdc"
      : "";
      console.log(pageIds, activeTab, "pageIds");
      
  const handleSubmit = async () => {
    setIsSubmitting(true);
    const payload = {
      pageId: pageIds,
      headerNames: test
        .filter((col) => col.active)
        .map((col) => col.actualField),
    };

    try {
      const response = await tableDynamicColumn({ payload });
      if (response?.status === "SUCCESS") {
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
        getAllTins();
        onClose();
        getResponePopup(response);
      }
      setIsResetting(false);
    } catch (error) {
      getResponePopup(error?.response);
    }
  };


  const opt = {
    Priority: statusOptions,
  };

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

  await getTableData({
    pageId,
    pageNo,
    pageSize: 15,
    roleId: "",
    projectId: "test",
  });
};
  const handleSwitchToggle = async (item, checked) => {
 
  };



  useEffect(() => {
    setParamsFilter("check");
    if (paramsFilter === "check") {
      getAllTins();
    }
  }, [pageNo, paramsFilter,pageLoad]);
console.log(pageLoad,"pageLoad")

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

        <div className="d-flex align-items-center justify-content-end gap-4">
          <div className={styles.font}>Total Tin : 45</div>
          <div className={styles.font}>Active Tin : 45</div>
          <div className={styles.font}>InActive Tin : 45</div>
          <Button
            data-testid="activeBtn"
            name="activeBtn"
            className="btn btn-sm   tableButton"
          >
            Change to Inactive
          </Button>
        </div>
      </div>

      <div className=" mt-3  container-fluid table-responsive active-projects task-table">
        <div className="d-flex">
          <div style={{ width: "100%" }}>
            <ReusableFilters
              showFilter={true}
              setActiveFilters={setActiveFilters}
              setSelectedOption={setSelectedOption}
              selectedOption={selectedOption}
              FilterItems={activeFilters}
              activeFilters={activeFilters}
              setPageNo={setPageNo}
              opt={opt}
              columns={columns}
              commonFilterItems={commonFilterItems}
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
        <div className="profile-tab  mt-3">
          <div className="mt-3">
            {activeTab === "Active" && (
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
                totalRecords={data?.response?.pageResponse?.totalElements}
                row={15}
                onPageChange={onPageChange}
              />
            )}
            {activeTab === "InActive" && (
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
                totalRecords={data?.response?.pageResponse?.totalElements}
                row={15}
                onPageChange={onPageChange}
              />
            )}
            {activeTab === "Providers" && (
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
                onSwitchToggle={handleSwitchToggle}
              />
            )}
          </div>
        </div>
        <div>
          <CustomizableDrawer
            open={open}
            onClose={onClose}
            options={columns}
            selectedColumns={test}
            setSelectedColumns={setTest}
            setActiveFilters={setActiveFilters}
          />
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
  }),
  {
    getProjectActiveTab: tinActions.getProjectActiveTab,
    getFilteApi: allActions.getReviewerPatients,
    getTableData: tableAction.tableViewAction,
    tableDynamicColumn: tableAction.tableDynamicColumn,
    tableDynamicColumnReset: tableAction.tableDynamicColumnReset,
  }
);

export default enhancer(Tin);
