import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import Image from "next/image";
import { Paginator } from "primereact/paginator";
import { Popover } from "antd";
import Header from "../../../../jsx/layouts/nav/Header";
import Completed from "../../../../../src/images/trackingImages/completed.webp";
import Declined from "../../../../../src/images/trackingImages/declined.webp";
import { extractLatestData } from "../../auditing";
import {
  generateOptionsListSupervisor,
  priorityOptions,
  renderUserPrfoileAvatar,
} from "../../../../components/headerFilters/functions";
import leftArrow from "../../../../images/svg/leftArrow.svg";
import dayjs from "dayjs";
import userStyles from "./styles.module.css";
import UserQueueTable from "../../table/userqueue";
import { actions as allActions } from "../../../../stores/supervisor/users";
import { actions as allActions2 } from "../../../../stores/supervisor/auditedQueue";
import { getStorage, setStorage } from "../../../../utils/storages";
import { actions as supervisorActions } from "../../../../stores/supervisor/auditedQueue";
import { actions as allPatientSyncAction } from "../../../../stores/tenantAdmin/patientSync";
import TableSkeleton from "../../../../components/skeleton/table";
import ReusableFilters from "../../../../components/reusableFilters";
import { useRouter } from "next/router";

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
  getIndividualUser,
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
    },
    {
      id: "002",
      title: "auditDueDate",
      type: "rangePicker",
      value: null,
      placeholder: "Audit Due Date",
      pickerType: "year",
    },
    {
      id: "003",
      title: "auditCompletedDate",
      type: "rangePicker",
      value: null,
      placeholder: "Audit Completed Date",
      pickerType: "year",
    },
    {
      id: "004",
      title: "auditAlloactedBy",
      type: "select",
      value: null,
      placeholder: "Audit Allocated By",
      options: generateOptionsListSupervisor(filteredList),
    },

    {
      id: "005",
      title: "Status",
      type: "select",
      value: null,
      placeholder: "Reviewed Status",
      options: [
        { label: "COMPLETED", value: "COMPLETED" },
        { label: "DECLINED", value: "DECLINED" },
      ],
    },
    {
      id: "006",
      title: "dueDate",
      type: "rangePicker",
      value: null,
      placeholder: "Due Date",
      pickerType: "year",
    },
    {
      id: "007",
      title: "completedDate",
      type: "rangePicker",
      value: null,
      placeholder: "Completed  Date",
      pickerType: "year",
    },
    {
      id: "008",
      title: "Priority",
      type: "select",
      value: null,
      placeholder: "Select Priority",
      options: priorityOptions,
    },
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
  const [activeFilters, setActiveFilters] = useState(["Search"]);
  const [paramsFilter, setParamsFilter] = useState(null);
  const [userName, setUserName] = useState();
  const [totalElements, setTotalElements] = useState(10);
  // const [priority, setPriority] = useState(null);

  const onPageChange = (e) => {
    setPaginationFirst(e.first);
    setPageNo(e.page);
    setPageSize(e.rows);
  };

  const auditstatusBodyTemplate = (rowData) => {
    const declinedDataFromAudit = extractLatestData(
      rowData?.auditDeclinedNotes
    );

    const declinedDataFromDeclined = extractLatestData(rowData?.declinedNotes);

    const declinedData = declinedDataFromAudit || declinedDataFromDeclined;

    switch (rowData.processedStatus) {
      case "COMPLETED":
        return (
          <Popover placement="bottom" title="Status: COMPLETED">
            <div className="patient-status" style={{ textAlign: "center" }}>
              <Image
                src={Completed}
                style={{ height: "30px", width: "30px" }}
              />
            </div>
          </Popover>
        );

      case "PENDING":
        return (
          <Popover placement="bottom" title="Status: PENDING">
            <div className="patient-status" style={{ textAlign: "center" }}>
              <Image src={Pending} style={{ height: "30px", width: "30px" }} />
            </div>
          </Popover>
        );

      case "DECLINED":
        return (
          <Popover
            placement="bottom"
            title="Status: DECLINED"
            content={`Reason: ${declinedData ? declinedData : "---"}`}
          >
            <div className="patient-status" style={{ textAlign: "center" }}>
              <Image src={Declined} style={{ height: "30px", width: "30px" }} />
            </div>
          </Popover>
        );

      case "NOTCOMPUTED":
        return (
          <Popover placement="bottom" title="Status: NOT COMPUTED">
            <div className="patient-status" style={{ textAlign: "center" }}>
              <Image src={Pending} style={{ height: "30px", width: "30px" }} />
            </div>
          </Popover>
        );
      case "COMPUTED":
        return (
          <Popover placement="bottom" title="Status: PENDING">
            <div className="patient-status" style={{ textAlign: "center" }}>
              <Image src={Pending} style={{ height: "30px", width: "30px" }} />
            </div>
          </Popover>
        );
      case "HOLD":
        return (
          <Popover placement="bottom" title="Status: HOLD">
            <div className="patient-status" style={{ textAlign: "center" }}>
              <Image src={Hold} style={{ height: "30px", width: "30px" }} />
            </div>
          </Popover>
        );
      case "ABORTED_BY_CRON":
        return (
          <Popover placement="bottom" title="Status: ABORTED BY CRON">
            <div className="patient-status" style={{ textAlign: "center" }}>
              <Image src={Abort} style={{ height: "30px", width: "30px" }} />
            </div>
          </Popover>
        );
      case null:
        return (
          <Popover placement="bottom" title="Status: PENDING">
            <div className="patient-status" style={{ textAlign: "center" }}>
              <Image src={Pending} style={{ height: "30px", width: "30px" }} />
            </div>
          </Popover>
        );
    }
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
    // setPriority({ selectedValue: selectedValue, patientId: patientId });
    getuserQueueApi();
  };
  const getuserQueueApi = async () => {
    const uId = getStorage("user");
    setUserName(uId);
    await getUserQueueList({
      uId,
      pageNo,
      pageNumber,
      pageSize,
      selectedOption,
      sort: sort?.sort,
      selectedDateRanges,
      searchText: searchText,
    });
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
  const handleTableRowClick = (e, id) => {
    const targetTd = e.target.closest("td");
    if (targetTd) {
      setStorage("patientId", id);
      setStorage("routeBackTo", "/supervisor/user");
      getRoutedData({ params: params, userData: userParams, viewUsers });
      router?.push("/supervisor/user/details");
    }
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
                  // router.push("/supervisor/user");
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
                      FilterItems={commonFilterItems}
                      selectedDates={selectedDates}
                      setSelectedDates={setSelectedDates}
                      activeFilters={activeFilters}
                      setClear={setClear}
                      clear={clear}
                      setPageNo={setPageNo}
                    />
                  </div>
                  <div
                    id="task-tbl_wrapper"
                    className="dataTables_wrapper no-footer"
                  >
                    {loader ? (
                      <div className="mt-1">
                        <TableSkeleton />
                      </div>
                    ) : (
                      <div className="mt-2">
                        <UserQueueTable
                          bullets={bullets}
                          badges={badges}
                          bulletsTitle="Reviewed Status"
                          badgesTitle="Audited Status"
                          userList={userListAll?.content}
                          userName={userName}
                          sort={sort}
                          setSort={setSort}
                          auditBodyTemplate={auditstatusBodyTemplate}
                          activeFilters={activeFilters}
                          setActiveFilters={setActiveFilters}
                          getRoutedData={getRoutedData}
                          getIndividualUser={getIndividualUser}
                          handlePriorityChange={handlePriorityChange}
                          handleTableRowClick={handleTableRowClick}
                        />
                      </div>
                    )}
                    <div>
                      <div className="pagination-container">
                        <Paginator
                          first={pageNo === 0 ? 0 : paginationFirst}
                          rows={15}
                          totalRecords={totalElements}
                          onPageChange={onPageChange}
                        />
                        <div className="total-pages">
                          Total count: {totalElements ? totalElements : 0}
                        </div>
                      </div>
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
