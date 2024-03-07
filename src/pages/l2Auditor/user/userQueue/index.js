import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import Image from "next/image";
import { useSelector } from "react-redux";
import { Paginator } from "primereact/paginator";
import styles from "../../../physician/report/report.module.css";
import Header from "../../../../jsx/layouts/nav/Header";
import HeaderFilters from "../../../../components/headerFilters";
import SpinnerDots from "../../../../components/spinner";
import Footer from "../../../../jsx/layouts/Footer";
import UserQueue from "../../table/adminList/userQueue";
import AuditeDeclineTrack from "../../../../../src/images/trackingImages/AuditDeclined.png";
import AuditedTrack from "../../../../../src/images/trackingImages/AuditedTrack.png";
import NotAudited from "../../../../../src/images/trackingImages/NotAuditedTrack.png";
import AuditHold from "../../../../../src/images/trackingImages/AuditHoldTrack.png";
import ReAudit from "../../../../../src/images/trackingImages/reAuditTrack.png";
import AuditPending from "../../../../../src/images/trackingImages/AuditPending.png";
import { Popover } from "antd";

import {
  generateOptionsList,
  getFilteredOption,
} from "../../../../components/headerFilters/functions";
import audited from "../../../../images/svg/audited.svg";
import reAudit from "../../../../images/svg/reAudit.svg";
import auditHold from "../../../../images/svg/auditHold.svg";
import auditPending from "../../../../images/svg/auditPending.svg";
import { getCurrentUserDetails, getL2IndividualUser } from "../../../../store/actions/l2Action/userActions";
import leftArrow from "../../../../images/svg/leftArrow.svg";
import AuditHeaderFilters from "../../../../components/headerFilters/auditHeaderFilters";
import userStyles from "./styles.module.css";
import {
  getCurrentUser,
  getFilters,
} from "../../../../store/actions/AuthActions";

const bullets = [
  {
    color: "rgba(209, 56, 56, 1)",
    name: "Decline",
  },
  {
    color: "rgba(58, 155, 148, 1)",
    name: "Completed",
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
  { label: "AUDITHOLD", value: "AUDITHOLD" },
  { label: "REAUDIT", value: "REAUDIT" },
  { label: "AUDIT PENDING", value: "AUDIT_PENDING" },
  { label: "AUDIT DECLINED", value: "AUDIT_DECLINED" },

];
const index = () => {
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
      // dispatch(getFilters("allocatedBy"))
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
        // auditor values
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
    const latestKey =
      rowData?.auditDeclinedNotes?.length > 0 &&
      Math.max(
        ...rowData?.auditDeclinedNotes?.map((obj) => parseInt(Object.keys(obj)[0]))
      );
    let declinedData;

    if (rowData?.auditDeclinedNotes && rowData?.auditDeclinedNotes?.length > 0) {
      rowData?.auditDeclinedNotes?.forEach((obj) => {
        if (obj[latestKey]) {
          declinedData = obj[latestKey];
        }
      });
    }
    switch (rowData.auditedStatus) {
      case "AUDIT_PENDING":
        return (
          <Popover placement="bottom" title="Status: AUDIT PENDING">
            <div className="patient-status">
              <Image
                src={AuditPending}
                className={styles.ImgTrck}
                style={{ height: "35px", width: "35px" }}
              />
            </div>
          </Popover>
        );

      case "DECLINED":
        return (
          <div className="patient-status">
            <span className={`badge failed-text`} style={{ color: "red" }}>
              Declined
            </span>
          </div>
        );

      case "AUDITHOLD":
        return (
          <Popover placement="bottom" title=" Status: AUDIT HOLD">
            <div className="patient-status">
              <Image
                src={AuditHold}
                className={styles.ImgTrck}
                style={{ height: "35px", width: "35px" }}
              />
            </div>
          </Popover>
        );
      case "REAUDIT":
        return (
          <Popover placement="bottom" title=" Status: REAUDIT">
            <div className="patient-status">
              <Image
                src={ReAudit}
                className={styles.ImgTrck}
                style={{ height: "35px", width: "35px" }}
              />
            </div>
          </Popover>
        );
      case "AUDITED":
        return (
          <Popover placement="bottom" title=" Status: AUDITED">
            <div className="patient-status">
              <Image
                src={AuditedTrack}
                className={styles.ImgTrck}
                style={{ height: "35px", width: "35px" }}
              />
            </div>
          </Popover>
        );
      case "AUDITED":
        return (
          <div className="patient-status">
            <Image
              src={AuditedTrack}
              //  style={{ height: "25%", width: "39%" }}
            />
          </div>
        );

      case "NOT_AUDIT":
        return (
          <Popover placement="bottom" title=" Status: NOT AUDIT">
            <div className="patient-status">
              <Image
                src={NotAudited}
                className={styles.ImgTrck}
                style={{ height: "35px", width: "35px" }}
              />
            </div>
          </Popover>
        );
      case "AUDIT_DECLINED":
        return (
          <Popover placement="bottom" title=" Status: AUDIT DECLINED"
          content={`Reason: ${rowData.auditDeclinedNotes ? declinedData : "---"}`}>
            <div className="patient-status">
              <Image
                src={AuditeDeclineTrack}
                style={{ height: "35px", width: "35px" }}
              />
            </div>
          </Popover>
        );
      case null:
        return <div className="patient-status">---</div>;
    }
  };
  return (
    <>
      <div className={`show ${sideMenu ? "menu-toggle" : ""}`}>
        <Header />

        <div class="content-body">
          <div className="container-fluid">
            <div className="row">
              <div
                className={"col-xl-12 d-flex"}
                style={{ margin: "0px 0 8px 0px", cursor: "pointer" }}
              >
                <button
                  style={{ width: "40px" }}
                  className={styles.filterBtn}
                  onClick={() => {
                    router.push("/l2Auditor/user");
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
                      marginRight: "10px",
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
                        searchlabel="Search By Patient Id / Name"
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
                        // audidefaultAllocatedBy={""}
                        // select status
                        selectlabel="processed Status"
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
    </>
  );
};

export default index;
