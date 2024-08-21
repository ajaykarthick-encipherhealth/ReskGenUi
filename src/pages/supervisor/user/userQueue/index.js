import React, { useState, useEffect } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import Image from "next/image";
import { Paginator } from "primereact/paginator";
import { Popover } from "antd";
import styles from "../../../reviewer/report/report.module.css";
import Header from "../../../../jsx/layouts/nav/Header";
import Completed from "../../../../../src/images/trackingImages/CompletedTrack.png";
import Declined from "../../../../../src/images/trackingImages/DeclineTrack.png";
import { extractLatestData } from "../../auditing";
import { generateOptionsList } from "../../../../components/headerFilters/functions";
import leftArrow from "../../../../images/svg/leftArrow.svg";
import dayjs from "dayjs";
import userStyles from "./styles.module.css";
import { getFilters } from "../../../../stores/authflow/actions";
import UserQueueTable from "../../table/userqueue";
import { actions as allActions } from "../../../../stores/supervisor/users";
import { renderSkeleton } from "../../../../components/reuseableFunctions";
import UserFilters from "../filters/usersFilters";

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
  { label: "ALL", value: "" },
  { label: "COMPLETED", value: "COMPLETED" },
  { label: "DECLINED", value: "DECLINED" },
];
const AuditOptions = [
  { label: "ALL", value: "" },
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
}) => {
  const router = useRouter();
  const sideMenu = useSelector((state) => state?.sideMenu);
  const filteredList = useSelector((state) => state?.filters?.auditAllocatedBy);
  const [processSort, setProcessSort] = useState(
    router.query?.processSort ? router.query?.processSort : "DESC"
  );
  const [auditAllocatedSort, setAuditAllocatedSort] = useState(
    router.query?.auditAllocatedSort ? router.query?.auditAllocatedSort : "DESC"
  );
  const [audirDateSort, setAuditDateSort] = useState(
    router.query?.audirDateSort ? router.query?.audirDateSort : "DESC"
  );
  const [auditDueSort, setAuditDueSort] = useState(
    router.query?.auditDueSort ? router.query?.auditDueSort : "DESC"
  );
  const [pageNo, setPageNo] = useState(0);
  const [paginationFirst, setPaginationFirst] = useState(0);
  const [userListAll, setUserListAll] = useState([]);
  const [selectedOption, setSelectedOption] = useState(
    router?.query?.selectedOption ? router?.query?.selectedOption : ""
  );
  const [completedStartDate, setCompletedStartDate] = useState(
    router?.query?.completedStartDate ? router?.query?.completedStartDate : ""
  );
  const [completedEndDate, setCompletedEndDate] = useState(
    router?.query?.completedEndDate ? router?.query?.completedEndDate : ""
  );
  const [dueStartDate, setDueStartDate] = useState(
    router?.query?.dueStartDate ? router?.query?.dueStartDate : ""
  );
  const [dueEndDate, setDueEndDate] = useState(
    router?.query?.dueEndDate ? router?.query?.dueEndDate : ""
  );
  const [allocatedStartDate, setAllocatedStartDate] = useState(
    router?.query?.allocatedStartDate ? router?.query?.allocatedStartDate : ""
  );
  const [allocatedEndDate, setAllocatedEndDate] = useState(
    router?.query?.allocatedEndDate ? router?.query?.allocatedEndDate : ""
  );
  const [selAllocatedBy, setSelAllocatedBy] = useState("");
  const [auditedStartDate, setAuditedStartDate] = useState(
    router?.query?.auditedStartDate ? router?.query?.auditedStartDate : ""
  );
  const [auditedEndDate, setAuditedEnsDate] = useState(
    router?.query?.auditedEndDate ? router?.query?.auditedEndDate : ""
  );
  const [totalElements, setTotalElements] = useState(10);
  const [search, setSearch] = useState(
    router?.query?.searchTextValue ? router?.query?.searchTextValue : ""
  );
  const [searchTextValue, setSearchTextValue] = useState(
    router?.query?.searchTextValue ? router?.query?.searchTextValue : ""
  );
  const [userName, setUserName] = useState();
  const [selectedAuditOption, setSelectedAuditOption] = useState(
    router?.query?.selectedAuditOption ? router?.query?.selectedAuditOption : ""
  );
  const [selAuditAllocatedBy, setSelAuditAllocatedBy] = useState(
    router?.query?.selAuditAllocatedBy ? router?.query?.selAuditAllocatedBy : ""
  );
  const [aduitCompletedStartDate, setAduitCompletedStartDate] = useState(
    router?.query?.aduitCompletedStartDate
      ? router?.query?.aduitCompletedStartDate
      : ""
  );
  const [aduitCompletedEndDate, setAduitCompletedEndDate] = useState(
    router?.query?.aduitCompletedEndDate
      ? router?.query?.aduitCompletedEndDate
      : ""
  );
  const [aduitDueStartDate, setAduitDueStartDate] = useState(
    router?.query?.aduitDueStartDate ? router?.query?.aduitDueStartDate : ""
  );
  const [aduitDueEndDate, setAduitDueEndDate] = useState(
    router?.query?.aduitDueEndDate ? router?.query?.aduitDueEndDate : ""
  );
  const [selectedDates, setSelectedDates] = useState([
    router?.query?.aduitDueStartDate
      ? dayjs(router?.query?.aduitDueStartDate)
      : "",
    router?.query?.aduitDueEndDate ? dayjs(router?.query?.aduitDueEndDate) : "",
  ]);
  const [selectedDates2, setSelectedDates2] = useState([
    router?.query?.aduitCompletedStartDate
      ? dayjs(router?.query?.aduitCompletedStartDate)
      : "",
    router?.query?.aduitCompletedEndDate
      ? dayjs(router?.query?.aduitCompletedEndDate)
      : "",
  ]);
  const [selectedDates3, setSelectedDates3] = useState([
    router?.query?.dueStartDate ? dayjs(router?.query?.dueStartDate) : "",
    router?.query?.dueEndDate ? dayjs(router?.query?.dueEndDate) : "",
  ]);

  const [selectedDates4, setSelectedDates4] = useState([
    router?.query?.completedStartDate
      ? dayjs(router?.query?.completedStartDate)
      : "",
    router?.query?.completedEndDate
      ? dayjs(router?.query?.completedEndDate)
      : "",
  ]);

  const dispatch = useDispatch();
  const [sort, setSort] = useState({
    sortDir: router?.query?.sortDirection
      ? router?.query?.sortDirection
      : "DESC",
    sortField: router?.query?.sortField
      ? router?.query?.sortField
      : "auditDueDate",
  });

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
    if (window !== "undefined") {
      if (router.query) {
        setPageNo(router?.query?.pageNo ? router?.query?.pageNo : 0);
        setPaginationFirst(
          router?.query?.paginationFirst ? router?.query?.paginationFirst : 0
        );
      }
    }
  }, [router]);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const uId = searchParams.get("userId")
      ? searchParams.get("userId")
      : router.query.userName;
    setUserName(uId);
    if (uId) {
      const data = {
        uId,
        pageNo,
        search: searchTextValue,
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
    dispatch(getFilters("auditAllocatedBy", userName));
  }, [userName]);

  return (
    <div className={`show ${sideMenu ? "menu-toggle" : ""}`}>
      <Header />

      <div class="content-body">
        <div className="container-fluid">
          <div className="row">
            <div
              className={"col-xl-12 d-flex"}
              style={{
                position: "relative",
                left: "40px",
                bottom: "10px",
                cursor: "pointer",
              }}
            >
              <button
                style={{ width: "40px", height: "40px" }}
                className={styles.filterBtn}
                onClick={() => {
                  router.push("/supervisor/user");
                }}
              >
                <Image src={leftArrow} />
              </button>
              <div className={userStyles.userNameContainer}>
                <img
                  src={currentUser?.data?.response?.profileImageUrl}
                  alt="User Avatar"
                  width={35}
                  height={35}
                  style={{
                    borderRadius: "50%",
                    marginRight: "5px",
                  }}
                />
                <span>
                  {currentUser?.data?.response?.firstName}{" "}
                  {currentUser?.data?.response?.lastName}
                </span>
              </div>
            </div>
            <div className="col-xl-12">
              <div className="card-body p-0">
                <div className="table-responsive active-projects task-table">
                  <div className="tbl-caption  align-items-center">
                    <UserFilters
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
                      isAduitDueDate={true}
                      setSelectedDates={setSelectedDates}
                      selectedDates={selectedDates}
                      // audited completed date
                      audipickerlabe2="Audit Completed Date"
                      audidefaultStartDate2={""}
                      audidefaultEndDate2={""}
                      audisetStartDate2={setAduitCompletedStartDate}
                      audisetEndDate2={setAduitCompletedEndDate}
                      isAuditCompleteDate={true}
                      setSelectedDates2={setSelectedDates2}
                      selectedDates2={selectedDates2}
                      // allocated by
                      isAuditAllocatedBy={true}
                      audiallocatedBylabel="Audit AllocatedBy"
                      auditallocatedByOptions={generateOptionsList(
                        filteredList
                      )}
                      audisetSelAllocatedBy={setSelAuditAllocatedBy}
                      selAuditAllocatedBy={selAuditAllocatedBy}
                      // select status
                      selectlabel="Reviewed Status"
                      isSelector={true}
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
                      isRangePicker={true}
                      selectedDueDates={selectedDates3}
                      setSelectedDueDates={setSelectedDates3}
                      // completed date
                      pickerlabe2="Completed Date"
                      defaultStartDate2={""}
                      defaultEndDate2={""}
                      setStartDate2={setCompletedStartDate}
                      setEndDate2={setCompletedEndDate}
                      isAnotherPicker={true}
                      selectedDates4={selectedDates4}
                      setSelectedDates4={setSelectedDates4}
                      // defaultAllocateTo={""}
                      // allocated by
                      // isAllocatedBySelector={true}
                      // allocatedBylabel=" AllocatedBy"
                      // allocatedByOptoons={generateOptionsList(filteredList)}
                      // setSelAllocatedBy={setSelAllocatedBy}
                      // defaultAllocatedBy={"All"}
                      // allocated date
                      // pickerlabe3="Allocated Date"
                      // defaultStartDate3={""}
                      // defaultEndDate3={""}
                      // setStartDate3={setAllocatedStartDate}
                      // setEndDate3={setAllocatedEndDate}
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
    currentUser: state.supervisor.users?.currentUser,
    usersData: state.supervisor.users?.getIndividualUsersList,
    loader: state.supervisor.users?.individualUserLoading,
  }),
  {
    getIndividualUser: allActions.getIndividualUsers,
    getCurrentUserDetails: allActions.getCurrentUserInfo,
  }
);
export default connector(Index);
