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
import HeaderFilters, { allFilters } from "../filters/headerFilters";
import { getStorage } from "../../../../utils/storages";
import { actions as supervisorActions } from "../../../../stores/supervisor/auditedQueue";
import { actions as allPatientSyncAction } from "../../../../stores/tenantAdmin/patientSync";
import { getResponePopup } from "../../../../utils/reusable";

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
  routedData,
  getRoutedData,
  supervisorPriority
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
  const [selAuditAllocatedByVal, setSelAuditAllocatedByVal] = useState([]);
  const [aduitCompletedStartDate, setAduitCompletedStartDate] = useState("");
  const [aduitCompletedEndDate, setAduitCompletedEndDate] = useState("");
  const [aduitDueStartDate, setAduitDueStartDate] = useState("");
  const [aduitDueEndDate, setAduitDueEndDate] = useState("");
  const [selectedDates, setSelectedDates] = useState([]);
  const [selectedDates2, setSelectedDates2] = useState([]);
  const [selectedDates3, setSelectedDates3] = useState([]);
  const [selectedDates4, setSelectedDates4] = useState([]);
  const [priority,setPriority]=useState(null)

  const [sort, setSort] = useState({
    sortDir: "DESC",
    sortField: "auditDueDate",
  });
  const [clear, setClear] = useState(false);
  const [activeFilters, setActiveFilters] = useState([[]]);
  const [paramsFilter, setParamsFilter] = useState(null);

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
    setParamsFilter("check");
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
      if (window !== "undefined" && paramsFilter) {
        getIndividualUser({ data: data });
        getCurrentUserDetails({ userId: uId });
      }
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
    paramsFilter,
    paginationFirst,
  ]);
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
    getFilters({ field: "auditAllocatedBy", username: userName });
  }, [userName]);
  useEffect(() => {
    if (routedData) {
      setParamsFilter("check");
      setSelectedDates(routedData?.selectedDates || []);
      setSelectedDates2(routedData?.selectedDates2 || []);
      setSelectedDates3(routedData?.selectedDates3 || []);
      setSelectedDates4(routedData?.selectedDates4 || []);
      setSelAuditAllocatedByVal(routedData?.selAuditAllocatedBy || []);
      setAduitDueStartDate(routedData?.aduitDueStartDate || "");
      setAduitDueEndDate(routedData?.aduitDueEndDate || "");
      setAduitCompletedStartDate(routedData?.aduitCompletedStartDate || "");
      setAduitCompletedEndDate(routedData?.aduitCompletedEndDate || "");
      setDueStartDate(routedData?.dueStartDate || "");
      setDueEndDate(routedData?.dueEndDate || "");
      setCompletedStartDate(routedData?.processedStart || "");
      setCompletedEndDate(routedData?.processedEnd || "");
      setSearch(routedData?.searchTextValue ? routedData?.searchTextValue : "");
      setPageNo(routedData?.pageNo ? routedData?.pageNo : 0);
      setPaginationFirst(
        routedData?.paginationFirst ? routedData?.paginationFirst : ""
      );
      setSelectedOption(
        routedData?.selectedOption ? routedData?.selectedOption : ""
      );
      setActiveFilters(
        routedData?.allFilters ? routedData?.allFilters : []
      );
    }
  }, []);

  
  const handlePriorityChange = async (
    patientId,
    selectedValue,
    lastModifiedDate
  ) => {
    const res = await supervisorPriority({
      patientId: patientId,
      year: dayjs(lastModifiedDate).format("YYYY"),
      priority: selectedValue,
    });
    setPriority({selectedValue:selectedValue,patientId:patientId});
    if (res.status === "SUCCESS") {
      const uId = getStorage("user");
      setParamsFilter("check");
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
        if (window !== "undefined" && paramsFilter) {
          getIndividualUser({ data: data });
        }
      }
    }
  };

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
                      audiallocatedBylabel="Audit Allocated By"
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
                      getRoutedData={getRoutedData}
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
                        userName={userName}
                        sort={sort}
                        setSort={setSort}
                        auditBodyTemplate={auditstatusBodyTemplate}
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
                        getRoutedData={getRoutedData}
                        getIndividualUser={getIndividualUser}
                        handlePriorityChange={handlePriorityChange}
                        priority={priority}
                        params={{
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
                          selectedDates3,
                          selectedDates,
                          selectedDates2,
                          selectedDates4,
                          paginationFirst,
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
    routedData: state.tenantAdmin?.patientSync?.routedData,
  }),
  {
    getIndividualUser: allActions.getIndividualUsers,
    getCurrentUserDetails: allActions.getCurrentUserAction,
    getFilters: allActions2.getFilterUsers,
    getRoutedData: allPatientSyncAction.getRoutedData,
    supervisorPriority: supervisorActions.getPriorityChange,
  }
);
export default connector(Index);
