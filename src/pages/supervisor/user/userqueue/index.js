import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import Image from "next/image";
import Header from "../../../../jsx/layouts/nav/Header";
import {
  generateOptionsListSupervisor,
  priorityOptions,
  renderUserPrfoileAvatar,
} from "../../../../components/headerFilters/functions";
import leftArrow from "../../../../images/svg/leftArrow.svg";
import dayjs from "dayjs";
import userStyles from "./styles.module.css";
import { actions as allActions } from "../../../../stores/supervisor/users";
import { actions as allActions2 } from "../../../../stores/supervisor/auditedQueue";
import { getStorage, setStorage } from "../../../../utils/storages";
import { actions as supervisorActions } from "../../../../stores/supervisor/auditedQueue";
import { actions as allPatientSyncAction } from "../../../../stores/tenantAdmin/patientSync";
import ReusableFilters from "../../../../components/reusableFilters";
import { useRouter } from "next/router";
import AppTable from "../../../../components/tables";


const bullets = [
  {
    color: "#EB5252",
    name: "Declined",
  },
  {
    color: "#B4EFBA",
    name: "Completed",
  },
];
export const statusOptions = [
  { label: "COMPLETED", value: "COMPLETED" },
  { label: "DECLINED", value: "DECLINED" },
];
const badges = [
  {
    color: "#4AA1AB",
    name: "Audited",
  },
  {
    color: "#964B00",
    name: "Re Audit",
  },
  {
    color: "#EBAE00",
    name: "Audit Hold",
  },
  {
    color: "#BD3A79",
    name: "Audit Pending",
  },
  {
    color: "#C21807",
    name: "Audit Declined",
  },
  {
    color: "#EC8E27",
    name: "Not Audit",
  },
];

const Index = ({
  getCurrentUserDetails,
  currentUser,
  usersData,
  loader,
  filteredList,
  getFilters,
  routedData,
  getRoutedData,
  supervisorPriority,
  setViewUsers,
  userParams,
  viewUsers,
  getUserQueueList,
}) => {
  const commonFilterItems = [
    {
      id: "001",
      title: "Search",
      type: "search",
      value: null,
      placeholder: "Search",
      header: "Patient Name / ID",
      active: true,
    },
    {
      id: "002",
      title: "auditDueDate",
      type: "rangePicker",
      value: null,
      placeholder: "Audit Due Date",
      pickerType: "year",
      active: false,
    },
    {
      id: "003",
      title: "auditCompletedDate",
      type: "rangePicker",
      value: null,
      placeholder: "Audit Completed Date",
      pickerType: "year",
      active: false,
    },
    {
      id: "004",
      title: "auditAlloactedBy",
      type: "select",
      value: null,
      placeholder: "Audit Allocated By",
      options: generateOptionsListSupervisor(filteredList),
      active: false,
    },

    {
      id: "005",
      title: "Status",
      type: "select",
      value: null,
      placeholder: "Reviewed Status",
      options: statusOptions,
      active: false,
   
    },
    {
      id: "006",
      title: "dueDate",
      type: "rangePicker",
      value: null,
      placeholder: "Due Date",
      pickerType: "year",
      active: false,
    },
    {
      id: "007",
      title: "completedDate",
      type: "rangePicker",
      value: null,
      placeholder: "Completed  Date",
      pickerType: "year",
      active: false,
    },
    {
      id: "008",
      title: "Priority",
      type: "select",
      value: null,
      placeholder: "Select Priority",
      options: priorityOptions,
      active: false,
    },
  ];
  const columns = [
    {
      name: "Patient ID",
      value: "patientId",
    },
    {
      name: "Patient Name",
      value: "patientName",
    },
    {
      name: " Compeleted Date",
      value: "auditAllocatedDate",
      sortable: true,
      isDate: true,
      
    },
    {
      name: "Audit Allocated Date",
      value: "auditAllocatedDate",
      sortable: true,
      isDate: true,
      
    },
    {
      name: "Audit Due Date",
      value: "auditDueDate",
      sortable: true,
      isDate: true,
    },
    {
      name: "Audit Allocated By",
      isImage: true,
      value: {
        first: "auditAllocatedByFirstName",
        last: "auditAllocatedByLastName",
        img: "auditAllocatedByProfileImage",
      },
    },
    {
      name: "Audited Date",
      value: "auditedDate",
      sortable: true,
      isDate: true,
    },

    {
      name: "priority",
      value: "priority",
    },
    { name: "REVIEWED STATUS", value: "processedStatus", status: true,   infoIcon:true },
    { name: "Audited STATUS", value: "auditedStatus", auditedStatus: true ,   infoIcon:true},
  ];
  const router = useRouter();
  const [sort, setSort] = useState({
    processedDate: {
      sortDir: "DESC",
      sortField: "processedDate",
    },
    auditAllocatedDate: {
      sortDir: "DESC",
      sortField: "auditAllocatedDate",
    },
    auditDueDate: {
      sortDir: "DESC",
      sortField: "auditDueDate",
    },
    auditedDate: {
      sortDir: "DESC",
      sortField: "auditedDate",
    },
    sort: { sortDir: "DESC", sortField: "" },
  });
  const [pageNo, setPageNo] = useState(0);
  const [paginationFirst, setPaginationFirst] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [pageNumber, setPageNumber] = useState(0);
  const [searchText, setSearchText] = useState(null);
  const [selectedOption, setSelectedOption] = useState({});
  const [selectedDateRanges, setSelectedDateRanges] = useState({});
  const [selectedDates, setSelectedDates] = useState([]);
  const [userListAll, setUserListAll] = useState([]);
  const [clear, setClear] = useState(false);
  const [activeFilters, setActiveFilters] = useState(commonFilterItems);
  const [paramsFilter, setParamsFilter] = useState(null);
  const [userName, setUserName] = useState();
  const [totalElements, setTotalElements] = useState("");

  const onPageChange = (e) => {
    setPaginationFirst(e.first);
    setPageNo(e.page);
    setPageSize(e.rows);
  };
  const handleTableRowClick = (id) => {
    setStorage("patientId", id?.patientId);
    setStorage("routeBackTo", "/supervisor/user");
    getRoutedData({ params: params, userData: userParams, viewUsers });
    router?.push("/supervisor/user/details");
};


  const handlePriorityChange = async (
    patientId,
    selectedValue,
    lastModifiedDate
  ) => {
    await supervisorPriority({
      patientId: patientId,
      year: dayjs(lastModifiedDate).format("YYYY"),
      priority: selectedValue,
    });
    getuserQueueApi();
  };

  const params = {
    pageNo,
    selectedDates,
    paginationFirst,
    sort,
    activeFilters,
    searchText,
    selectedOption,
    selectedDateRanges,
    pageNumber,
  };
  useEffect(() => {
    if (routedData?.params) {
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
      } = routedData?.params;
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
    getFilters({ field: "auditAllocatedBy", username: userName });
  }, [userName]);
  useEffect(() => {
    if (usersData) {
      setUserListAll(usersData?.data?.response);
      setTotalElements(usersData?.data?.response?.totalElements);
    }
  }, [usersData]);
  useEffect(() => {
    const uId = getStorage("user");
    getCurrentUserDetails({ userId: uId });
  }, []);
  const getuserQueueApi = async () => {
    const uId = getStorage("user");
    setUserName(uId);
    await getUserQueueList({
      uId,
      pageNo,
      pageNumber,
      pageSize,
      selectedOption,
      sort: sort,
      selectedDateRanges,
      searchText: searchText,
    });
  };
  useEffect(() => {
    const uId = getStorage("user");
    setParamsFilter("check");
    setUserName(uId);
    if (window !== "undefined" && paramsFilter) {
      getuserQueueApi();
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
    paginationFirst,
  ]);
  const opt = {
    Status: statusOptions,
    Priority: priorityOptions,
    auditAlloactedBy: generateOptionsListSupervisor(filteredList),
  };
  return (
    <div className={`show `}>
      <Header />
      <div className="content-body">
        <div className="container-fluid">
          <div>
            <div className={" mx-3 col-12 d-flex"}>
              <button
                className={userStyles.filterBtn}
                onClick={() => {
                  setViewUsers(null);
                  getRoutedData({
                    params: null,
                    userData: userParams,
                  });
                }}
              >
                <Image src={leftArrow} />
              </button>
              <div className={userStyles.userNameContainer}>
                {renderUserPrfoileAvatar(
                  currentUser?.data?.response?.firstName,
                  currentUser?.data?.response?.lastName,
                  currentUser?.data?.response?.profileImageUrl,
                  "header"
                )}
                <span className="mt-1">
                  {currentUser?.data?.response?.firstName}{" "}
                  {currentUser?.data?.response?.lastName}
                </span>
              </div>
            </div>
            <div className="col-12">
              <div className="card-body p-0">
                <div className="table-responsive active-projects task-table">
                  <div className="mt-2">
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
                      setClear={setClear}
                      clear={clear}
                      setPageNo={setPageNo}
                      opt={opt}
                    />
                  </div>
                  <div
                    id="task-tbl_wrapper"
                    className="dataTables_wrapper no-footer"
                  >
                    <div className="mt-2">
                      <AppTable
                        data={userListAll?.content}
                        column={columns}
                        loader={loader}
                        onRowClick={handleTableRowClick}
                        pagination={false}
                        setSort={setSort}
                        sort={sort}
                        handlePriorityChange={handlePriorityChange}
                        tableId="Supervisor-userqueue-table"
                        first={pageNo === 0 ? 0 : paginationFirst}
                        totalRecords={totalElements}
                        row={15}
                        onPageChange={onPageChange}
                      />
                    </div>
                    <div>
                    </div>
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
    currentUser: state.supervisor.users?.user,
    usersData: state.supervisor.users?.workQueueList,
    loader: state.supervisor.users?.individualUserLoading,
    filteredList: state.supervisor?.audited?.filterUsers,
    routedData: state.tenantAdmin?.patientSync?.routedData,
  }),
  {
    getIndividualUser: allActions.getIndividualUsers,
    getCurrentUserDetails: allActions.getCurrentUserAction,
    getFilters: allActions2.getFilterUsers,
    getRoutedData: allPatientSyncAction.getRoutedData,
    supervisorPriority: supervisorActions.getPriorityChange,
    getUserQueueList: allActions.getWorkQueueList,
  }
);
export default connector(Index);
