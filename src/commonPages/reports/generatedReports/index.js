import React, { useState, useEffect } from "react";
import Header from "../../../jsx/layouts/nav/Header";
import "react-facebook-loading/dist/react-facebook-loading.css";
import { connect } from "react-redux";
import { getStorage } from "../../../utils/storages";
import {
  findItemWithTrueKey,
  findMatchesByField,
  getResponePopup,
} from "../../../utils/reusable";
import ReusableFilters from "../../../components/reusableFilters";
import AppTable from "../../../components/tables";
import { actions as tableAction } from "../../../stores/tableView";
import ExportReportModal from "../exportReport";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilter, setIsFilter] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);

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

  const getPatients = async () => {
    const tin = getStorage("tinNumber");
    const userId = getStorage("userId");
    let pageId = "5792cd13-73f5-42c0-b0ca-5db81db947ad";
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
    let pageId = "5792cd13-73f5-42c0-b0ca-5db81db947ad";
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
    let pageId = "5792cd13-73f5-42c0-b0ca-5db81db947ad";
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
  const handleReportDownload = () => {
    let fileName =
      "https://mcibeforeocrdev.blob.core.windows.net/test/Patient%20Roaster.xlsx?sp=r&st=2025-05-12T05:29:09Z&se=2026-05-12T13:29:09Z&spr=https&sv=2024-11-04&sr=b&sig=ianNxwle85tYi3TGVPz5RLD26zBJkRYGU%2FgfrrHFAZM%3D";
    const link = document.createElement("a");
    link.href = `${fileName}`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // const downloadExcels = async () => {
  //   setDownloadLoader(true);
  //   try {
  //     const type =
  //       activeButton === "Queried" && typeBtn === "TypeReport"
  //         ? "QUERY_TYPE_REPORT"
  //         : activeButton === "Needback" && typeBtn === "TypeReport"
  //         ? "NEEDBACK_TYPE_REPORT"
  //         : activeButton === "Queried"
  //         ? "QUERY"
  //         : activeButton.toUpperCase().replaceAll(" ", "_");
  //     setDownloadLoader(true);
  //     const result = await fetch(`${portalUrl}conradai/report/download`, {
  //       method: "POST",
  //       headers: {
  //         Authorization: `Bearer ${getStorage("token")}`,
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         reportType: type,
  //         reportName: "#VIEW#",
  //         startDate: generate.select?.startDate
  //           ? generate.select?.startDate
  //           : "",
  //         endDate: generate.select?.endDate ? generate.select?.endDate : "",
  //         patientIds: [],
  //       }),
  //     });

  //     if (result.status === 200) {
  //       const blob = await result.blob();
  //       const url = window.URL.createObjectURL(blob);
  //       const a = document.createElement("a");
  //       a.href = url;
  //       a.download = `${type}_${moment(new Date()).format(
  //         "MM-DD-YYYY-hh:mm"
  //       )}_report.xlsx`;
  //       document.body.appendChild(a);
  //       a.click();
  //       document.body.removeChild(a);
  //       window.URL.revokeObjectURL(url);
  //       setDownloadLoader(false);
  //     } else {
  //       getResponsePopup({ status: "FAILED", message: "File Not Fetched!" });
  //       setDownloadLoader(false);
  //     }
  //   } catch (error) {
  //     console.error("Error downloading Excel file:", error);
  //     setDownloadLoader(false);
  //     getResponsePopup({ status: "FAILED", message: "An error occurred!" });
  //   }
  // };
  const handleRowCheckboxChange = async ({ e, row }) => {
    if (e.target?.checked) {
      setSelectedRows([row.id]);
    } else {
      setSelectedRows([]);
    }
  };
  const progressCancel = () => {
    console.log("progress");
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
                setIsModalOpen={setIsModalOpen}
                showGenerateReport={true}
                //btn
                btnName={"Export"}
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
                // isGenerateReportDownload={true}
                // handleReportDownload={handleReportDownload}
                handleRowCheckboxChange={handleRowCheckboxChange}
                selectedRows={selectedRows}
                showCancelIcon={true}
                progressCancel={progressCancel}
                isCheckBox={findItemWithTrueKey(
                  data?.response?.staticDesign,
                  "checkBox"
                )}
                idKey={"id"}
                disabled={true}
              />
              <div></div>
            </div>
          </div>
          <ExportReportModal open={isModalOpen} handleCancel={handleCancel}/>
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
