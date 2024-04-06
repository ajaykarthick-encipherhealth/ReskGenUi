import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import Image from "next/image";
import { Paginator } from "primereact/paginator";
import { Popover } from "antd";
import styles from "../../../reviewer/report/report.module.css";
import Header from "../../../../jsx/layouts/nav/Header";
import SpinnerDots from "../../../../components/spinner";
import UserQueue from "../../table/adminList/userQueue";
import Completed from "../../../../../src/images/trackingImages/CompletedTrack.png";
import Declined from "../../../../../src/images/trackingImages/DeclineTrack.png";
import { extractLatestData } from "../../auditing";
import { generateOptionsList } from "../../../../components/headerFilters/functions";
import audited from "../../../../images/svg/audited.svg";
import reAudit from "../../../../images/svg/reAudit.svg";
import auditHold from "../../../../images/svg/auditHold.svg";
import auditPending from "../../../../images/svg/auditPending.svg";
import {
  getCurrentUserDetails,
  getL2IndividualUser,
} from "../../../../store/actions/l2Action/userActions";
import leftArrow from "../../../../images/svg/leftArrow.svg";
import AuditHeaderFilters from "../../../../components/headerFilters/auditHeaderFilters";
import userStyles from "./styles.module.css";
import { getFilters } from "../../../../stores/authflow/actions";

const bullets = [
  {
    color: "#377880",
    name: "AUDITED",
  },
  {
    color: "#E28213",
    name: "AUDIT PENDING",
  },
  {
    color: "#964B00",
    name: "RE AUDIT",
  },
  {
    color: "red",
    name: "DECLINED",
  },
  {
    color: "#CE9900",
    name: "AUDIT HOLD",
  },
  {
    color: "#C21807",
    name: "AUDIT DECLINED",
  },
];
const badges = [
  {
    color: "#377880",
    name: "Audited",
    src: audited,
  },
  {
    color: "#FFBE00",
    name: "Re Audit",
    src: auditHold,
  },
  {
    color: "#964B00",
    name: "Audit Hold",
    src: reAudit,
  },
  {
    color: "#F28585",
    name: "Audit Pending",
    src: auditPending,
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
];
const Index = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const usersData = useSelector((state) => state.l2User?.userData);
  const sideMenu = useSelector((state) => state.sideMenu);
  const filteredList = useSelector((state) => state.auth.filterList);
  const currentUser = useSelector((state) => state.l2User.currentUserDetails);
  const [pageNo, setPageNo] = useState(0);
  const [paginationFirst, setPaginationFirst] = useState(0);
  const [userListAll, setUserListAll] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
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
  const [userName, setUserName] = useState();
  const [selectedAuditOption, setSelectedAuditOption] = useState("");
  const [selAuditAllocatedBy, setSelAuditAllocatedBy] = useState("");
  const [aduitCompletedStartDate, setAduitCompletedStartDate] = useState("");
  const [aduitCompletedEndDate, setAduitCompletedEndDate] = useState("");
  const [aduitDueStartDate, setAduitDueStartDate] = useState("");
  const [aduitDueEndDate, setAduitDueEndDate] = useState("");
  const [selectedDates, setSelectedDates] = useState([]);
  const [selectedDates2, setSelectedDates2] = useState([]);
  const [selectedDates3, setSelectedDates3] = useState([]);

  const [sort, setSort] = useState({
    sortDir: "DESC",
    sortField: "auditDueDate",
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
    const searchParams = new URLSearchParams(window.location.search);
    setUserName(searchParams.get("userId"));
    if (searchParams.get("userId")) {
      const uId = searchParams.get("userId");
      const datas = {
        uId,
        pageNo,
        search,
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
      dispatch(getL2IndividualUser(datas));
      dispatch(getCurrentUserDetails(uId));
    }
  }, [
    pageNo,
    search,
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
                    <AuditHeaderFilters
                      setSearch={setSearch}
                      isSearch={true}
                      search={search}
                      searchlabel="Search By Patient ID / Name"
                      // auditedStatus
                      selectlabel2="Audit Status"
                      isSelector2={true}
                      setSelectedOption2={setSelectedAuditOption}
                      selectOptions2={AuditOptions}
                      defaultSelectValue2={"Select Status"}
                      //audit due date
                      audipickerlabel1="Audit Due Date"
                      audidefaultStartDate={""}
                      audidefaultEndDate={""}
                      audisetStartDate={setAduitDueStartDate}
                      audisetEndDate={setAduitDueEndDate}
                      isAduitDueDate={true}
                      setSelectedAuditDueDates={setSelectedDates}
                      selectedAuditDueDates={selectedDates}
                      setSelectedAuditDates={setSelectedDates2}
                      selectedAuditDates={selectedDates2}
                      // audited completed date
                      audipickerlabe2="Audit Completed Date"
                      audidefaultStartDate2={""}
                      audidefaultEndDate2={""}
                      audisetStartDate2={setAduitCompletedStartDate}
                      audisetEndDate2={setAduitCompletedEndDate}
                      isAuditCompleteDate={true}
                      // allocated by
                      isAuditAllocatedBy={true}
                      audiallocatedBylabel="Audit AllocatedBy"
                      auditallocatedByOptions={generateOptionsList(
                        filteredList
                      )}
                      audisetSelAllocatedBy={setSelAuditAllocatedBy}
                      // select status
                      selectlabel="Reviewed Status"
                      isSelector={true}
                      setSelectedOption={setSelectedOption}
                      selectOptions={statusOptions}
                      defaultSelectValue1={"Select Status"}
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
                      // defaultAllocateTo={""}
                      // allocated by
                      isAllocatedBySelector={true}
                      allocatedBylabel=" AllocatedBy"
                      allocatedByOptoons={generateOptionsList(filteredList)}
                      setSelAllocatedBy={setSelAllocatedBy}
                      // defaultAllocatedBy={"All"}
                      // allocated date
                      pickerlabe3="Allocated Date"
                      defaultStartDate3={""}
                      defaultEndDate3={""}
                      setStartDate3={setAllocatedStartDate}
                      setEndDate3={setAllocatedEndDate}
                      isAllocatedDate={true}
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
                    />
                  </div>
                  <div
                    id="task-tbl_wrapper"
                    className="dataTables_wrapper no-footer"
                  >
                    {!userListAll?.content ? (
                      <SpinnerDots />
                    ) : (
                      <UserQueue
                        userList={userListAll?.content}
                        sort={sort}
                        setSort={setSort}
                        auditBodyTemplate={auditstatusBodyTemplate}
                      />
                    )}
                    <div>
                      <div className="pagination-container">
                        <Paginator
                          first={paginationFirst}
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

export default Index;
