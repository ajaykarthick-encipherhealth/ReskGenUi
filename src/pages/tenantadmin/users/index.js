import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import "react-facebook-loading/dist/react-facebook-loading.css";
import { actions as tableAction } from "../../../stores/tableView";
import { getStorage, setStorage } from "../../../utils/storages";
import ReusableFilters from "../../../components/reusableFilters";
import AppTable from "../../../components/tables";
import Header from "../../../jsx/layouts/nav/Header";
import { getResponePopup } from "../../../utils/reusable";
import CardSkeleton from "../../../components/skeleton/card";
import { Button } from "antd";
import Usersmodal from "./usersmodal";

const Users = ({
  pageLoad,
  tableLoader,
  getTableData,
  tableDynamicColumn,
  pageId,
  data,
  isQueried,
  isReAssigned,
  patientAllocated,
  tableDynamicColumnReset,
}) => {
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
  const [searchText, setSearchText] = useState(null);
  const [selectedOption, setSelectedOption] = useState({});
  const [selectedDateRanges, setSelectedDateRanges] = useState({});
  const [selectedDates, setSelectedDates] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [paginationFirst, setPaginationFirst] = useState(0);
  const [paramsFilter, setParamsFilter] = useState(null);
  const [test, setTest] = useState(data?.response?.metaDataDTO);
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [usersModal, setUsersModal] = useState(false);

  const onPageChange = (e) => {
    setPaginationFirst(e.first);
    setPageNo(e.page);
    setPageNumber(e.page);
    setPageSize(e.rows);
  };
  const handleOpenModal = () => {
    setUsersModal(true);
  };

  const showDrawer = () => {
    setTest(data?.response?.metaDataDTO);
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  const getUsersAPi = async () => {
    const res = await getTableData({
      pageNo,
      pageNumber,
      pageSize: 15,
      selectedOption,
      sort: sort,
      selectedDateRanges,
      searchText: searchText,
      pageId:"8e4f1d2a-7b3c-45e6-9f1d-2a7b3c45e6f1",
    });
  };

  useEffect(() => {
    setParamsFilter("check");
    if (window !== "undefined" && paramsFilter) {
      getUsersAPi();
    }
  }, [
    selectedOption,
    selectedDateRanges,
    searchText,
    pageSize,
    pageNo,
    paramsFilter,
    sort,
    pageNumber,
    pageLoad,
  ]);

  const handleSubmit = async () => {
    setIsSubmitting(true);

    const payload = {
      pageId: "8e4f1d2a-7b3c-45e6-9f1d-2a7b3c45e6f1",
      headerNames: test
        .filter((col) => col.active)
        .map((col) => col.actualField),
    };

    try {
      const response = await tableDynamicColumn({ payload });
      if (response?.status === "SUCCESS") {
        getUsersAPi();
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
      pageId: "8e4f1d2a-7b3c-45e6-9f1d-2a7b3c45e6f1",
    };
    try {
      const response = await tableDynamicColumnReset({ payload });
      if (response?.status === "SUCCESS") {
        getUsersAPi();
        onClose();
        getResponePopup(response);
      }
      setIsResetting(false);
    } catch (error) {
      getResponePopup(error?.response);
    }
  };

  useEffect(() => {
    setActiveFilters(
      data?.response?.metaDataDTO.filter(
        (item) => item.active && item?.filter?.style
      )
    );
  }, [data?.response?.metaDataDTO]);

  return (
    <div className={`show `}>
      <Header />
      <div className="content-body">
        <div className="container-fluid table-responsive active-projects task-table">
          {tableLoader ? (
            <CardSkeleton />
          ) : (
            <div className="d-flex mt-4 ">
              <div className="p-2" style={{ width: "90%" }}>
                <ReusableFilters
                  showFilter={true}
                  setActiveFilters={setActiveFilters}
                  setSearchText={setSearchText}
                  searchText={searchText}
                  setSelectedOption={setSelectedOption}
                  selectedOption={selectedOption}
                  setSelectedDateRanges={setSelectedDateRanges}
                  selectedDateRanges={selectedDateRanges}
                  setPageNumber={setPageNumber}
                  FilterItems={activeFilters}
                  selectedDates={selectedDates}
                  setSelectedDates={setSelectedDates}
                  activeFilters={activeFilters}
                  setPageNo={setPageNo}
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
              <div
                id="assign-btn"
                name="assign-btn" 
                className="d-flex justify-content-center align-items-center  mt-4"
              >
                <Button
                  data-testid="assign-user"
                  className="btn btn-sm w-full text-ellipsis tableButton"
                  onClick={handleOpenModal}
                >
                  Assign User
                </Button>
              </div>
            </div>
          )}

          <div className="mt-4">
            <AppTable
              data={data?.response?.pageResponse?.content}
              column={data?.response?.metaDataDTO.filter((item) => item.active)}
              loader={tableLoader}
              setSort={setSort}
              sort={sort}
              first={pageNo === 0 ? 0 : paginationFirst}
              totalRecords={data?.response?.pageResponse?.totalElements}
              row={15}
              onPageChange={onPageChange}
            />
          </div>
          <div>
            <Usersmodal getUsersAPi={getUsersAPi} open={usersModal} setOpen={setUsersModal} />
          </div>
        </div>
      </div>
    </div>
  );
};
const enhancer = connect(
  (state) => ({
    tableLoader: state?.tableView?.tableViewLoading,
    data: state?.tableView?.tableView?.data,
    tableStatus: state?.tableView?.TableStatusView?.data?.response,
    pageLoad: state?.tenantAdmin?.tin?.getPageRendering,
  }),
  {
    getTableData: tableAction.tableViewAction,
    tableDynamicColumn: tableAction.tableDynamicColumn,
    tableDynamicColumnReset: tableAction.tableDynamicColumnReset,
  }
);
export default enhancer(Users);
