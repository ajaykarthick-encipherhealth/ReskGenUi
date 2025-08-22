import { Tab, Nav } from "react-bootstrap";
import { useEffect, useState } from "react";
import {
  findItemWithTrueKey,
  findMatchesByField,
  getResponePopup,
  tableCustomFilterClearCheck,
} from "../../utils/reusable";
import Tabs from "../../mainStream/components/tags";
import { connect } from "react-redux";
import { actions as tinActions } from "../../stores/tenantAdmin/tin";
import { actions as tableAction } from "../../stores/tableView";
import ReusableFilters from "../../components/reusableFilters";
import AppTable from "../../components/tables";
import GenateReportModal from "../../commonPages/reports/generateReportDownload";
import { Button } from "antd";
import { actions as reportActions } from "../../stores/tenantAdmin/report";
import CardSkeleton from "../../components/skeleton/card";
import styles from "./style.module.css";
import {
  generatedReportsPageId,
  generateViewPageId,
} from "../../utils/pageIds";

const Reports = ({
  getProjectActiveTab,
  activeTabName,
  getTableData,
  tableLoader,
  routedData,
  data,
  tableDynamicColumn,
  tableDynamicColumnReset,
  pageLoad,
  downloadReport,
  reportKill,
  reportTabs,
  reportTabList,
  tabLoader,
}) => {
  const [pageNo, setPageNo] = useState(0);
  const [paginationFirst, setPaginationFirst] = useState(0);
  const [paramsFilter, setParamsFilter] = useState(null);
  const [clear, setClear] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);
  const [searchText, setSearchText] = useState(null);
  const [selectedOption, setSelectedOption] = useState({});
  const [selectedDateRanges, setSelectedDateRanges] = useState({});
  const [selectedDates, setSelectedDates] = useState([]);
  const [open, setOpen] = useState(false);
  const [test, setTest] = useState(data?.response?.metaDataDTO);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilter, setIsFilter] = useState(true);
  const [loading, setLoading] = useState(false);
  const [reportTab, setReportTab] = useState("");
  const [activeTab, setActiveTab] = useState("");
  const [rowTinNumber, setRowTinNumber] = useState("");

  const [sort, setSort] = useState({
    computedDate: {
      sortDir: "DESC",
      sortField: "computedDate",
    },
    createdDate: {
      sortDir: "DESC",
      sortField: "createdDate",
    },
    sort: { sortDir: "DESC", sortField: "" },
  });
  const handleTabs = (name) => {
    getTableData({ reloadTrue: true });
    getProjectActiveTab({
      reportTab: name,
    });
    setSelectedRows([]);
    setSearchText("");
    setSelectedDateRanges({});
    setSelectedOption({});
    setPageNo(0);
    setSelectedDates([]);
    setReportTab(reportTabList?.tabMenuList2?.[0]);
    setActiveTab(name);
    setRowTinNumber("");
  };
  const handleTabChange = (key) => {
    setReportTab(key);
    getTableData({ reloadTrue: true });
    setSelectedRows([]);
    setSearchText("");
    setSelectedDateRanges({});
    setSelectedOption({});
    setPageNo(0);
    setSelectedDates([]);
    setRowTinNumber("");
  };

  const onPageChange = (e) => {
    setPaginationFirst(e.first);
    setPageNo(e.page);
  };

  const onClose = () => {
    setOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const showDrawer = () => {
    setTest(data?.response?.metaDataDTO);
    setOpen(true);
  };
  const handleRowCheckboxChange = async ({ e, row }) => {
    if (e.target?.checked) {
      setSelectedRows([row.id]);
      setRowTinNumber(row.tinNumber);
    } else {
      setSelectedRows([]);
      setRowTinNumber("");
    }
  };
  const generateBtnClick = () => {
    setIsModalOpen(true);
  };
  const getReports = async () => {
    let pageId =
      activeTab === "Financial Report"
        ? generatedReportsPageId
        : reportTab === "Generate View"
        ? generateViewPageId
        : reportTab === "Generated Reports"
        ? generatedReportsPageId
        : generatedReportsPageId;

    const response = await getTableData({
      pageId,
      pageNo,
      pageSize: 15,
      roleId: "",
      allTinIds: false,
      sort,
      selectedDateRanges,
      selectedOption,
      searchText,
      tincompleted: true,
      reportCategory:
        activeTab === "ACO Report" && reportTab === "Generated Reports"
          ? "ACO"
          : activeTab === "MA Report" && reportTab === "Generated Reports"
          ? "MA"
          : activeTab === "Financial Report"
          ? "FINANCIAL_SUMMARY"
          : "",
    });
  };
  const handleSubmitInsert = async (data) => {
    setIsSubmitting(true);
    let pageId =
      activeTab === "Financial Report"
        ? generatedReportsPageId
        : reportTab === "Generate View"
        ? generateViewPageId
        : reportTab === "Generated Reports"
        ? generatedReportsPageId
        : generatedReportsPageId;
    const payload = {
      pageId: pageId,
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
          getReports();
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
    let pageId =
      activeTab === "Financial Report"
        ? generatedReportsPageId
        : reportTab === "Generate View"
        ? generateViewPageId
        : reportTab === "Generated Reports"
        ? generatedReportsPageId
        : generatedReportsPageId;
    const payload = {
      pageId,
    };
    try {
      const response = await tableDynamicColumnReset({ payload });
      if (response?.status === "SUCCESS") {
        setIsFilter(true);
        getReports();
        onClose();
        getResponePopup(response);
      }
      setIsResetting(false);
    } catch (error) {
      getResponePopup(error?.response);
    }
  };
  const handleReportDownload = async (reportId) => {
    setLoading(true);
    const response = await downloadReport({
      reportInfoId: reportId,
      reportCategory:
        activeTab === "ACO Report" && reportTab === "Generated Reports"
          ? "ACO"
          : activeTab === "MA Report" && reportTab === "Generated Reports"
          ? "MA"
          : activeTab === "Financial Report"
          ? "FINANCIAL_SUMMARY"
          : "",
    });

    if (response?.status === "SUCCESS" && response?.response) {
      getResponePopup(response);
      setSelectedRows([]);
      setRowTinNumber("");
      const link = document.createElement("a");
      link.href = response.response;
      link.setAttribute("download", "report.xlsx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      getResponePopup(response);
      setLoading(false);
    }
    setLoading(false);
  };
  const progressCancelIcon = async (id) => {
    const response = await reportKill({
      reportInfoId: id,
    });
    if (response?.status === "SUCCESS") {
      getResponePopup({
        status: "SUCCESS",
        message: "Successfully Killed the file",
      });
      getReports();
    } else {
      getResponePopup(response);
    }
  };
  useEffect(() => {
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
    if (paramsFilter === "check" && activeTab) {
      getReports();
    }
  }, [
    pageNo,
    selectedOption,
    searchText,
    selectedDateRanges,
    sort,
    paramsFilter,
    pageLoad,
    reportTab,
    activeTab,
  ]);

  useEffect(() => {
    if (reportTabList?.tabMenuList?.length > 0 && !activeTab) {
      const defaultTab = reportTabList.tabMenuList[0];
      setActiveTab(defaultTab);
    }
    if (reportTabList?.tabMenuList2?.length > 0 && !reportTab) {
      setReportTab(reportTabList.tabMenuList2[0]);
    }
  }, [reportTabList]);
  useEffect(() => {
    reportTabs();
  }, []);

  return (
    <div className="show">
      <div className="text-center" style={{ paddingTop: "80px" }}>
        {tabLoader ? (
          <div className="d-flex align-items-center justify-content-center ">
            <div className={styles.tabWidth}>
              <CardSkeleton height={70} />
            </div>
          </div>
        ) : (
          <Tabs
            icon
            activeTab={activeTab}
            handleTabs={handleTabs}
            tabs={reportTabList?.tabMenuList}
          />
        )}
      </div>
      <Tab.Container activeKey={reportTab} onSelect={handleTabChange}>
        <div className="d-flex justify-content-between align-items-end w-100  border-bottom px-3">
          {activeTab !== "Financial Report" && (
            <Nav variant="tabs" className="profile-tab">
              {reportTabList?.tabMenuList2?.map((tab) => (
                <Nav.Item key={tab} className="nav-item profile-tab mt-4">
                  <Nav.Link
                    eventKey={tab}
                    id="badge"
                    className="mt-4 ant-badge"
                  >
                    {tab}
                  </Nav.Link>
                </Nav.Item>
              ))}
            </Nav>
          )}
          <div className="d-flex gap-2 ms-auto  mb-2">
            {
              reportTab == "Generated Reports" || (
                <>
                  {activeTab !== "Financial Report" && (
                    <div className=" font2 d-flex align-items-end justify-content-end gap-2">
                      <span className="text-danger "> *</span> You can choose
                      only one TIN at a time to generate the report
                    </div>
                  )}

                  <div className="d-flex justify-content-center align-items-center   mt-4">
                    <Button
                      onClick={generateBtnClick}
                      style={{
                        background: "#04306f",
                        color: "#fff",
                        width: "100%",
                        fontSize: "12px",
                        marginLeft: "10px",
                      }}
                      className="btn btn-sm w-full text-ellipsis cursor-pointer"
                      disabled={ activeTab !== "Financial Report" && selectedRows?.length === 0 || data?.response?.pageResponse?.content?.length == 0}
                    >
                      Generate Report
                    </Button>
                  </div>
                </>
              )
              // ))
            }
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
                    cursor: tableLoader ? "not-allowed" : "pointer",
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

        <Tab.Content className="mt-3">
          {reportTabList?.tabMenuList2?.map((tab) => (
            <Tab.Pane eventKey={tab} key={tab}>
              <div className="content-body">
                <div
                  className="container-fluid table-responsive active-projects task-table"
                  style={{ paddingTop: "5px" }}
                >
                  <section className="d-flex mt-2">
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
                        //customize table
                        open={open}
                        onClose={onClose}
                        selectedColumns={test}
                        setSelectedColumns={setTest}
                        showCustomizeTable={false}
                        showDrawer={showDrawer}
                        handleSubmit={handleSubmitInsert}
                        handleReset={handleReset}
                        isSubmitting={isSubmitting}
                        isResetting={isResetting}
                        selectedRows={selectedRows}
                        setIsModalOpen={setIsModalOpen}
                        tableLoader={tableLoader}
                      />
                    </div>
                  </section>
                  <div
                    id="task-tbl_wrapper"
                    className="dataTables_wrapper no-footer"
                  >
                    <div className="mt-4">
                      <AppTable
                        data={data?.response?.pageResponse?.content}
                        column={data?.response?.metaDataDTO.filter(
                          (item) => item.active
                        )}
                        loader={tableLoader}
                        sort={sort}
                        setSort={setSort}
                        first={pageNo === 0 ? 0 : paginationFirst}
                        totalRecords={
                          data?.response?.pageResponse?.totalElements
                        }
                        row={15}
                        onPageChange={onPageChange}
                        isGenerateReport={false}
                        handleRowCheckboxChange={handleRowCheckboxChange}
                        selectedRows={selectedRows}
                        isCheckBox={
                          reportTab === "Generated Reports" ||
                          activeTab === "Financial Report"
                            ? false
                            : findItemWithTrueKey(
                                data?.response?.staticDesign,
                                "checkBox"
                              )
                        }
                        idKey={"id"}
                        disabled={true}
                        handleReportDownload={handleReportDownload}
                        cancelIcon={true}
                        progressCancelIcon={progressCancelIcon}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Tab.Pane>
          ))}
        </Tab.Content>
      </Tab.Container>
      <GenateReportModal
        getReports={getReports}
        setSelectedRows={setSelectedRows}
        setIsModalOpen={setIsModalOpen}
        selectedRows={selectedRows}
        open={isModalOpen}
        handleCancel={handleCancel}
        activeTab={activeTab}
        rowTinNumber={rowTinNumber}
        setRowTinNumber={setRowTinNumber}
      />
    </div>
  );
};

const enhancer = connect(
  (state) => ({
    activeTabName: state.tenantAdmin.tin?.activeTabRoutedData?.reportTab,
    routedData: state.tenantAdmin?.patientSync?.routedData,
    data: state?.tableView?.tableView?.data,
    tableLoader: state?.tableView?.tableViewLoading,
    pageLoad: state?.tenantAdmin?.tin?.getPageRendering,
    reportTabList:
      state?.tenantAdmin?.tenantAdmin?.reportTabList?.data?.response,
    tabLoader: state?.tenantAdmin?.tenantAdmin?.reportTabList?.loading,
  }),
  {
    getProjectActiveTab: tinActions.getProjectActiveTab,
    getTableData: tableAction.tableViewAction,
    tableDynamicColumn: tableAction.tableDynamicColumn,
    tableDynamicColumnReset: tableAction.tableDynamicColumnReset,
    downloadReport: reportActions.reportDownload,
    reportKill: reportActions.reportKill,
    reportTabs: reportActions.reportTabList,
  }
);

export default enhancer(Reports);