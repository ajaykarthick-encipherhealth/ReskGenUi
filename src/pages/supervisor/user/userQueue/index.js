import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import Image from "next/image";
import { Paginator } from "primereact/paginator";
import { Popover } from "antd";
import styles from "../../../reviewer/report/report.module.css";
import Header from "../../../../jsx/layouts/nav/Header";
import Completed from "../../../../../src/images/trackingImages/CompletedTrack.png";
import Declined from "../../../../../src/images/trackingImages/DeclineTrack.png";
import { extractLatestData } from "../../auditing";
import {
  generateOptionsList,
  generateOptionsListSupervisor,
  renderUserPrfoile,
  renderUserPrfoileAvatar,
} from "../../../../components/headerFilters/functions";
import leftArrow from "../../../../images/svg/leftArrow.svg";
import dayjs from "dayjs";
import userStyles from "./styles.module.css";
import UserQueueTable from "../../table/userqueue";
import { actions as allActions } from "../../../../stores/supervisor/users";
import { actions as allActions2 } from "../../../../stores/supervisor/auditedQueue";
import { renderSkeleton } from "../../../../components/reuseableFunctions";
import UserFilters from "../filters/usersFilters";
import HeaderFilters from "../filters/headerFilters";
import { getStorage } from "../../../../utils/storages";

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

const statusOptions = [
  { label: "COMPLETED", value: "COMPLETED" },
  { label: "DECLINED", value: "DECLINED" },
];
const AuditOptions = [
  { label: "AUDITED", value: "AUDITED" },
  { label: "AUDIT HOLD", value: "AUDITHOLD" },
  { label: "REAUDIT", value: "REAUDIT" },
  { label: "AUDIT PENDING", value: "AUDIT_PENDING" },
  { label: "AUDIT DECLINED", value: "AUDIT_DECLINED" },
  { label: "NOT AUDIT", value: "NOT_AUDIT" },
];
const Index = ({
  getCurrentUserDetails,
  getIndividualUser,
  currentUser,
  usersData,
  loader,
  filteredList,
  getFilters,
}) => {
  const router = useRouter();
  const [processSort, setProcessSort] = useState("DESC");
  const [auditAllocatedSort, setAuditAllocatedSort] = useState("DESC");
  const [audirDateSort, setAuditDateSort] = useState("DESC");
  const [auditDueSort, setAuditDueSort] = useState("DESC");
  const [pageNo, setPageNo] = useState(0);
  const [paginationFirst, setPaginationFirst] = useState(0);
  const [userListAll, setUserListAll] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [completedStartDate, setCompletedStartDate] = useState("");
  const [completedEndDate, setCompletedEndDate] = useState("");
  const [dueStartDate, setDueStartDate] = useState("");
  const [dueEndDate, setDueEndDate] = useState("");
  const [allocatedStartDate, setAllocatedStartDate] = useState("");
  const [allocatedEndDate, setAllocatedEndDate] = useState("");
  const [selAllocatedBy, setSelAllocatedBy] = useState("");
  const [auditedStartDate, setAuditedStartDate] = useState("");
  const [auditedEndDate, setAuditedEnsDate] = useState("");
  const [totalElements, setTotalElements] = useState(10);
  const [search, setSearch] = useState("");
  const [searchTextValue, setSearchTextValue] = useState("");
  const [userName, setUserName] = useState();
  const [selectedAuditOption, setSelectedAuditOption] = useState("");
  const [selAuditAllocatedBy, setSelAuditAllocatedBy] = useState("");
  const [selAuditAllocatedByVal, setSelAuditAllocatedByVal] = useState("");
  const [aduitCompletedStartDate, setAduitCompletedStartDate] = useState("");
  const [aduitCompletedEndDate, setAduitCompletedEndDate] = useState("");
  const [aduitDueStartDate, setAduitDueStartDate] = useState("");
  const [aduitDueEndDate, setAduitDueEndDate] = useState("");
  const [selectedDates, setSelectedDates] = useState([]);
  const [selectedDates2, setSelectedDates2] = useState([]);
  const [selectedDates3, setSelectedDates3] = useState([]);
  const [selectedDates4, setSelectedDates4] = useState([]);
  const [sort, setSort] = useState({
    sortDir:"DESC",
    sortField:"auditDueDate",
  });
  const [clear, setClear] = useState(false);
  const [activeFilters, setActiveFilters] = useState([
    router?.query?.filters || [],
  ]);
  const onPageChange = (e) => {
    setPaginationFirst(e.first);
    setPageNo(e.page);
  };

  useEffect(() => {
    if (usersData) {
      setUserListAll(usersData?.data?.response);
      setTotalElements(usersData?.data?.response?.totalElements);
    }
  }, [usersData]);
  useEffect(() => {
    const uId = getStorage("user");
    setUserName(uId);
    if (uId) {
      const data = {
        uId,
        pageNo,
        search: search,
        selectedOption,
        selAllocatedBy,
        dueStartDate: clear ? "" : dueStartDate,
        dueEndDate: clear ? "" : dueEndDate,
        completedStartDate: clear ? "" : completedStartDate,
        completedEndDate: clear ? "" : completedEndDate,
        auditedStartDate,
        auditedEndDate,
        allocatedStartDate,
        allocatedEndDate,
        selectedAuditOption,
        selAuditAllocatedBy,
        aduitCompletedStartDate: clear ? "" : aduitCompletedStartDate,
        aduitCompletedEndDate: clear ? "" : aduitCompletedEndDate,
        aduitDueStartDate: clear ? "" : aduitDueStartDate,
        aduitDueEndDate: clear ? "" : aduitDueEndDate,
        sort,
      };
      getIndividualUser({ data: data });
      getCurrentUserDetails({ userId: uId });
    }
  }, [
    pageNo,
    searchTextValue,
    selectedOption,
    selAllocatedBy,
    dueStartDate,
    dueEndDate,
    search,
    completedStartDate,
    completedEndDate,
    auditedStartDate,
    auditedEndDate,
    allocatedStartDate,
    allocatedEndDate,
    selectedAuditOption,
    selAuditAllocatedBy,
    aduitCompletedStartDate,
    aduitCompletedEndDate,
    aduitDueStartDate,
    aduitDueEndDate,
    sort,
  ])
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

  useEffect(() => {
    getFilters({ field: "auditAllocatedBy", userName: userName });
  }, [userName]);
  useEffect(() => {
    const decodedParams = JSON.parse(getStorage("supervisorUserEncodedValue"));
    const sessionActiveFilters = JSON.parse(getStorage("supervisorUserFilter"));
    if (decodedParams) {
      setSelectedDates3([
        decodedParams?.dueStartDate ? dayjs(decodedParams?.dueStartDate) : null,
        decodedParams?.dueEndDate ? dayjs(decodedParams?.dueEndDate) : null,
      ]);
      setSelectedDates4([
        decodedParams?.completedStartDate
          ? dayjs(decodedParams?.completedStartDate)
          : null,
        decodedParams?.completedEndDate
          ? dayjs(decodedParams?.completedEndDate)
          : null,
      ]);
      setSelectedDates2([
        decodedParams?.aduitCompletedStartDate
          ? dayjs(decodedParams?.aduitCompletedStartDate)
          : null,
        decodedParams?.aduitCompletedEndDate
          ? dayjs(decodedParams?.aduitCompletedEndDate)
          : null,
      ]);
      setSelectedDates([
        decodedParams?.aduitDueStartDate
          ? dayjs(decodedParams?.aduitDueStartDate)
          : null,
        decodedParams?.aduitDueEndDate
          ? dayjs(decodedParams?.aduitDueEndDate)
          : null,
      ]);
      setSearch(decodedParams?.searchTextValue?decodedParams?.searchTextValue:"");
      setPageNo(decodedParams?.pageNo);
      setPaginationFirst(decodedParams?.paginationFirst);
      setSelectedOption(decodedParams?.selectedOption)
    }
    if (sessionActiveFilters) {
      setActiveFilters(sessionActiveFilters);
    }
  }, []);
  return (
    <div className={`show `}>
      <Header />
      <div class="content-body">
        <div className="container-fluid">
          <div className="row">
            <div
              className={"col-xl-12 d-flex"}
              style={{
                position: "relative",
                // left: "40px",
                bottom: "10px",
                cursor: "pointer",
              }}
            >
              <button
                className={styles.filterBtn}
                onClick={() => {
                  router.push("/supervisor/user");
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
            <div className="col-xl-12">
              <div className="card-body p-0">
                <div className="table-responsive active-projects task-table">
                  <div className="tbl-caption  align-items-center">
                    <HeaderFilters
                      setSearchTextValue={setSearchTextValue}
                      searchlabel="Search By Patient ID / Name"
                      searchVal={search}
                      setSearchVal={setSearch}
                      // auditedStatus
                      selectlabel2="Audit Status"
                      setSelectedOption2={setSelectedAuditOption}
                      selectOptions2={AuditOptions}
                      selectDefaultValue={
                        selectedAuditOption
                          ? selectedAuditOption
                          : "Select Status"
                      }
                      //audit due date
                      audipickerlabel1="Audit Due Date"
                      audidefaultStartDate={""}
                      audidefaultEndDate={""}
                      audisetStartDate={setAduitDueStartDate}
                      audisetEndDate={setAduitDueEndDate}
                      // isAduitDueDate={true}
                      setSelectedDates={setSelectedDates}
                      selectedDates={selectedDates}
                      // audited completed date
                      audipickerlabe2="Audit Completed Date"
                      audidefaultStartDate2={""}
                      audidefaultEndDate2={""}
                      audisetStartDate2={setAduitCompletedStartDate}
                      audisetEndDate2={setAduitCompletedEndDate}
                      // isAuditCompleteDate={true}
                      setSelectedDates2={setSelectedDates2}
                      selectedDates2={selectedDates2}
                      // allocated by
                      // isAuditAllocatedBy={true}
                      audiallocatedBylabel="Audit AllocatedBy"
                      auditallocatedByOptions={generateOptionsListSupervisor(
                        filteredList
                      )}
                      audisetSelAllocatedBy={setSelAuditAllocatedBy}
                      selAuditAllocatedBy={selAuditAllocatedBy}
                      audidefaultAllocatedBy="Select Audit AllocatedBy"
                      // select status
                      selectlabel="Reviewed Status"
                      // isSelector={true}
                      setSelectedOption={setSelectedOption}
                      selectOptions={statusOptions}
                      defaultSelectValue1={"Select Status"}
                      selectedOption={selectedOption}
                      // due date
                      pickerlabel="Due Date"
                      defaultStartDate={""}
                      defaultEndDate={""}
                      setStartDate={setDueStartDate}
                      setEndDate={setDueEndDate}
                      // isRangePicker={true}
                      selectedDueDates={selectedDates3}
                      setSelectedDueDates={setSelectedDates3}
                      // completed date
                      pickerlabe2="Completed Date"
                      defaultStartDate2={""}
                      defaultEndDate2={""}
                      setStartDate2={setCompletedStartDate}
                      setEndDate2={setCompletedEndDate}
                      // isAnotherPicker={true}
                      selectedDates4={selectedDates4}
                      setSelectedDates4={setSelectedDates4}
                      defaultAllocateTo={""}
                      // allocated by
                      // isAllocatedBySelector={true}
                      allocatedBylabel=" AllocatedBy"
                      allocatedByOptoons={generateOptionsList(filteredList)}
                      setSelAllocatedBy={setSelAllocatedBy}
                      defaultAllocatedBy={"All"}
                      // allocated date
                      pickerlabe3="Allocated Date"
                      defaultStartDate3={""}
                      defaultEndDate3={""}
                      setStartDate3={setAllocatedStartDate}
                      setEndDate3={setAllocatedEndDate}
                      // isAllocatedDate={true}
                      // Auditeddate
                      pickerlabe4="Audited Date"
                      defaultStartDate4={""}
                      defaultEndDate4={""}
                      setStartDate4={setAuditedStartDate}
                      setEndDate4={setAuditedEnsDate}
                      isAnotherPicker3={true}
                      addUser={false}
                      bullets={bullets}
                      isNextRow={true}
                      badges={badges}
                      getFilters={getFilters}
                      username={userName}
                      setPageNo={setPageNo}
                      bulletsTitle="Reviewed Status"
                      badgesTitle="Audited Status"
                      selAuditAllocatedByVal={selAuditAllocatedByVal}
                      setSelAuditAllocatedByVal={setSelAuditAllocatedByVal}
                      clear={clear}
                      activeFilters={activeFilters}
                      setActiveFilters={setActiveFilters}
                      setClear={setClear}
                    />
                  </div>
                  <div
                    id="task-tbl_wrapper"
                    className="dataTables_wrapper no-footer"
                  >
                    {loader ? (
                      renderSkeleton()
                    ) : (
                      <UserQueueTable
                        userList={userListAll?.content}
                        sort={sort}
                        setSort={setSort}
                        auditBodyTemplate={auditstatusBodyTemplate}
                        page={{ ...router.query, pageNo, paginationFirst }}
                        auditDueSort={auditDueSort}
                        setAuditDueSort={setAuditDueSort}
                        processSort={processSort}
                        setProcessSort={setProcessSort}
                        auditAllocatedSort={auditAllocatedSort}
                        setAuditAllocatedSort={setAuditAllocatedSort}
                        audirDateSort={audirDateSort}
                        setAuditDateSort={setAuditDateSort}
                        activeFilters={activeFilters}
                        setActiveFilters={setActiveFilters}
                        params={{
                          pageNo,
                          searchTextValue,
                          selectedOption,
                          selAllocatedBy,
                          dueStartDate,
                          dueEndDate,
                          completedStartDate,
                          completedEndDate,
                          auditedStartDate,
                          auditedEndDate,
                          allocatedStartDate,
                          allocatedEndDate,
                          selectedAuditOption,
                          selAuditAllocatedBy,
                          aduitCompletedStartDate,
                          aduitCompletedEndDate,
                          aduitDueStartDate,
                          aduitDueEndDate,
                          sortDirection: sort.sortDir,
                          sortField: sort.sortField,
                          paginationFirst,
                          userName,
                          processSort,
                          auditAllocatedSort,
                          audirDateSort,
                          auditDueSort,
                        }}
                      />
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
    usersData: state.supervisor.users?.getIndividualUsersList,
    loader: state.supervisor.users?.individualUserLoading,
    filteredList: state.supervisor?.audited?.filterUsers,
  }),
  {
    getIndividualUser: allActions.getIndividualUsers,
    getCurrentUserDetails: allActions.getCurrentUserAction,
    getFilters: allActions2.getFilterUsers,
  }
);
export default connector(Index);
