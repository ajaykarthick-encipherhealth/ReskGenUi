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
import GenateReportModal from "../generateReportDownload";

const GenerateView = ({
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
  const handleRowCheckboxChange = async ({ e, row, }) => {
    if (e.target?.checked) {
      setSelectedRows([row.id]);
    }  
     else {
      setSelectedRows([]);
    }
  };


  const getGenerateReport = async () => {
    let pageId = "51ccafdf-f18e-4100-8811-63236a79a441";
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
      tincompleted:true,
    });
  };



  const handleSubmitInsert = async (data) => {
    setIsSubmitting(true);
    let pageId = "51ccafdf-f18e-4100-8811-63236a79a441";
    const payload = {
      pageId,
      headerNames: data.map((col) => col.id),
    };

    try {
      const response = await tableDynamicColumn({ payload });
      if (response?.status === "SUCCESS") {
        setIsFilter(true);
        getGenerateReport();
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
    let pageId = "51ccafdf-f18e-4100-8811-63236a79a441";
    const payload = {
      pageId,
    };
    try {
      const response = await tableDynamicColumnReset({ payload });
      if (response?.status === "SUCCESS") {
        setIsFilter(true);
        getGenerateReport();
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
      setPaginationFirst(paginationFirst);
      setSort(sort);
    }
  }, [routedData]);
  useEffect(() => {
    setParamsFilter("check");
    if (paramsFilter === "check") {
      getGenerateReport();
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
      {/* <Header /> */}
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
                showCustomizeTable={true}
                showDrawer={showDrawer}
                handleSubmit={handleSubmitInsert}
                handleReset={handleReset}
                isSubmitting={isSubmitting}
                isResetting={isResetting}
                showGenerateReport={true}
                selectedRows={selectedRows}
                setIsModalOpen={setIsModalOpen}
                btnName={"Generate Report"}
                tableLoader={tableLoader}
              />
            </div>
          </section>
          <div className=" font2 d-flex align-items-end justify-content-end gap-2">
            <span className="text-danger "> *</span> You can choose only one TIN
            at a time to generate the report
          </div>
          <div id="task-tbl_wrapper" className="dataTables_wrapper no-footer">
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
                totalRecords={data?.response?.pageResponse?.totalElements}
                row={15}
                onPageChange={onPageChange}
                isGenerateReport={false}
                handleRowCheckboxChange={handleRowCheckboxChange}
                selectedRows={selectedRows}
                isCheckBox={findItemWithTrueKey(
                  data?.response?.staticDesign,
                  "checkBox"
                )}
                idKey={"id"}
                disabled={true}
              />
            </div>
          </div>
          <GenateReportModal
            getGenerateReport={getGenerateReport}
            setSelectedRows={setSelectedRows}
            setIsModalOpen={setIsModalOpen}
            selectedRows={selectedRows}
            open={isModalOpen}
            handleCancel={handleCancel}
          />
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
export default enhancer(GenerateView);
