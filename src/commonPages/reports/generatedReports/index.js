import React, { useState, useEffect } from "react";
import Header from "../../../jsx/layouts/nav/Header";
import "react-facebook-loading/dist/react-facebook-loading.css";
import { actions as tenantAdminAction } from "../../../stores/tenantAdmin/patients";
import { connect } from "react-redux";
import { getStorage } from "../../../utils/storages";
import {
  findItemWithTrueKey,
  findMatchesByField,
  getResponePopup,
} from "../../../utils/reusable";
import { actions as allocationAction } from "../../../stores/admin/patientAllocation";
import ReusableFilters from "../../../components/reusableFilters";
import AppTable from "../../../components/tables";
import { actions as workflowActions } from "../../../stores/reviewer/workqueue";
import { actions as tableAction } from "../../../stores/tableView";
import GenateReportModal from "../generateReportDownload";

const GeneratedReports = ({
  tableLoader,
  routedData,
  getTableData,
  data,
  tableDynamicColumn,
  tableDynamicColumnReset,
  pageLoad,
}) => {
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
  const handleRowCheckboxChange = async ({ e, row, singleCheck, checked }) => {
    if (e.target?.checked) {
      setSelectedRows([row.id]);
    } else {
      setSelectedRows([]);
    }
  };


  const getPatients = async () => {
    const tin = getStorage("tinNumber");
    const userId = getStorage("userId");
    let pageId = "d80f80fd-aab8-496e-a9fc-89677d5ac174";
    const response = await getTableData({
      pageId,
      pageNo,
      pageSize: 15,
      roleId: "",
      tin,
      patientAllocated: userId,
      isAdmin: true,
      selectedOption,
      selectedDateRanges,
      searchText,
      sort,
    });
  };



  const handleSubmitInsert = async (data) => {
    setIsSubmitting(true);
    let pageId = "d80f80fd-aab8-496e-a9fc-89677d5ac174";
    const payload = {
      pageId,
      headerNames: data.map((col) => col.id),
    };

    try {
      const response = await tableDynamicColumn({ payload });
      if (response?.status === "SUCCESS") {
        setIsFilter(true);
        getPatients();
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
    let pageId = "d80f80fd-aab8-496e-a9fc-89677d5ac174";
    const payload = {
      pageId,
    };
    try {
      const response = await tableDynamicColumnReset({ payload });
      if (response?.status === "SUCCESS") {
        setIsFilter(true);
        getPatients();
        onClose();
        getResponePopup(response);
      }
      setIsResetting(false);
    } catch (error) {
      getResponePopup(error?.response);
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
  useEffect(() => {
    setParamsFilter("check");
    if (paramsFilter === "check") {
      getPatients();
    }
  }, [
    pageNo,
    selectedOption,
    searchText,
    selectedDateRanges,
    sort,
    paramsFilter,
    pageLoad,
  ]);

  return (
    <div className={`show `}>
      <Header />
      <div className="content-body">
        <div
          className="container-fluid table-responsive active-projects task-table"
          style={{ paddingTop: "5px" }}
        >
          <section className="d-flex mt-5">
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
                showCustomizeTable={true}
                showDrawer={showDrawer}
                handleSubmit={handleSubmitInsert}
                handleReset={handleReset}
                isSubmitting={isSubmitting}
                isResetting={isResetting}
                selectedRows={selectedRows}
                setIsModalOpen={setIsModalOpen}
                showGenerateReport={false}
              />
            </div>
          </section>
          <div id="task-tbl_wrapper" className="dataTables_wrapper no-footer">
            <div className="mt-4">
              <AppTable
                data={data?.response?.pageResponse?.content}
                column={data?.response?.metaDataDTO.filter(
                  (item) => item.active
                )}
                loader={tableLoader}
                pagination={false}
                sort={sort}
                setSort={setSort}
                first={pageNo === 0 ? 0 : paginationFirst}
                totalRecords={data?.response?.pageResponse?.totalElements}
                row={15}
                onPageChange={onPageChange}
                isGenerateReport={true}
                handleRowCheckboxChange={handleRowCheckboxChange}
                selectedRows={selectedRows}
                isCheckBox={findItemWithTrueKey(
                  data?.response?.staticDesign,
                  "checkBox"
                )}
                isGenerateReportDownload={true}
              />
              <div></div>
            </div>
          </div>
          <GenateReportModal open={isModalOpen} handleCancel={handleCancel} />
        </div>
      </div>
    </div>
  );
};

const enhancer = connect(
  (state) => ({
    routedData: state.tenantAdmin?.patientSync?.routedData,
    data: state?.tableView?.tableView?.data,
    tableLoader: state?.tableView?.tableViewLoading,
    pageLoad: state?.tenantAdmin?.tin?.getPageRendering,
  }),
  {
    getTableData: tableAction.tableViewAction,
    tableDynamicColumn: tableAction.tableDynamicColumn,
    tableDynamicColumnReset: tableAction.tableDynamicColumnReset,
  }
);
export default enhancer(GeneratedReports);
