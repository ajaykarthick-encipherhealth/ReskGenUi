import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Paginator } from "primereact/paginator";
import TableStyle from "../../../../components/table/table.module.css";
import Header from "../../../../jsx/layouts/nav/Header";
import HeaderFilters from "../../../../components/headerFilters";
import SpinnerDots from "../../../../components/spinner";
import Footer from "../../../../jsx/layouts/Footer";
import { getL2Users } from "../../../../store/actions/l2Actions/userActions";
import UserQueue from "../../table/adminList/userQueue";
import { generateOptionsList } from "../../../../components/headerFilters/functions";
import audited from '../../../../images/svg/audited.svg'
import reAudit from '../../../../images/svg/reAudit.svg'
import auditHold from '../../../../images/svg/auditHold.svg'

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
    src:audited
  },
  {
    color: "#FFBE00",
    name: "Re Audit",
    src:reAudit
  },
  {
    color: "#964B00",
    name: "Audit Hold",
    src:auditHold
  },
];

const statusOptions = [
  { label: "ALL", value: "" },
  { label: "COMPLETED", value: "2", status: 2 },
  { label: "DECLINE", value: "0", status: 0 },
];
const index = () => {
  const dispatch = useDispatch();
  const usersData = useSelector((state) => state.l1User.data);
  const sideMenu = useSelector((state) => state.sideMenu);
  const [pageNo, setPageNo] = useState(0);
  const [paginationFirst, setPaginationFirst] = useState(0);
  const [userListAll, setUserListAll] = useState([]);
  const [selectedOption, setSelectedOption] = useState();
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

  const onPageChange = (e) => {
    setPaginationFirst(e.first);
    setPageNo(e.page);
  };

  useEffect(() => {
    if (usersData) {
      setUserListAll(usersData);
      setTotalElements(usersData?.response?.totalElements);
    }
  }, [usersData]);

  useEffect(() => {
    var orgId = localStorage.getItem("orgId");
    // getFilteApi(
    //   0,
    //   pageNo,
    //   search,
    //   selectedOption,
    //   selAllocatedBy,
    //   dueStartDate,
    //   dueEndDate,
    //   completedStartDate,
    //   completedEndDate,
    //   auditedStartDate,
    //   auditedEndDate,
    //   allocatedStartDate,
    //   allocatedEndDate
    // );
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
  ]);

  const response = {
    status: "SUCCESS",
    message: "Success!!",
    response: [
      {
        active: true,
        allocatedBy: "henry@encipherhealth.onmicrosoft.com",
        allocatedOn: "2024-01-20T16:16:20.104Z",
        auditedBy: "henry@encipherhealth.onmicrosoft.com",
        auditedDate: "2024-01-20T13:00:53.461Z",
        auditedStatus: null,
        computedDate: "2024-01-20T13:08:06.815Z",
        computing: 2,
        createdAt: "2024-01-20T13:00:53.461Z",
        createdBy: "ranjith01@encipherhealth.onmicrosoft.com",
        createdDate: "2024-01-20T13:00:53.461Z",
        dueDate: "2024-01-22T00:00:00Z",
        fileName: null,
        lastModifiedDate: "2024-01-20T16:16:21.181Z",
        patientAllocated: "ranjith01@encipherhealth.onmicrosoft.com",
        patientId: "logesh-100",
        patientName: "logesh",
        priority: "URGENT",
        isAudited:true,
        processStageChart: "FINISHED",
        processStageId: "338c3432-d594-4434-9700-08a2e36e159b",
        processStageIdLab: null,
        processStageIdRadiology: null,
        processStageLab: null,
        processStageRadiology: null,
        processedDate: null,
        processedStatus: "PENDING",
        rafScore: 1.149,
        updatedAt: "2024-01-20T16:16:21.181Z",
        updatedBy: "anonymousUser",
        version: null,
      },
      {
        active: true,
        allocatedBy: "mars@encipherhealth.onmicrosoft.com",
        allocatedOn: "2024-01-20T16:16:20.104Z",
        auditedBy: "henry@encipherhealth.onmicrosoft.com",
        auditedDate: "2024-01-20T13:00:53.461Z",
        auditedStatus: null,
        computedDate: "2024-01-20T13:08:06.815Z",
        computing: 2,
        createdAt: "2024-01-20T13:00:53.461Z",
        createdBy: "ranjith01@encipherhealth.onmicrosoft.com",
        createdDate: "2024-01-20T13:00:53.461Z",
        dueDate: "2024-01-22T00:00:00Z",
        fileName: null,
        lastModifiedDate: "2024-01-20T16:16:21.181Z",
        patientAllocated: "ranjith01@encipherhealth.onmicrosoft.com",
        patientId: "logesh-100",
        patientName: "logesh",
        priority: "URGENT",
        isReAudited:true,
        processStageChart: "FINISHED",
        processStageId: "338c3432-d594-4434-9700-08a2e36e159b",
        processStageIdLab: null,
        processStageIdRadiology: null,
        processStageLab: null,
        processStageRadiology: null,
        processedDate: null,
        processedStatus: "PENDING",
        rafScore: 1.149,
        updatedAt: "2024-01-20T16:16:21.181Z",
        updatedBy: "anonymousUser",
        version: null,
      },
    ],
  };

  return (
    <>
      <div className={`show ${sideMenu ? "menu-toggle" : ""}`}>
        <Header />
        <div class="content-body">
          <div className="container-fluid">
            <div className="row">
              <div className="col-xl-12">
                <div className="card-body p-0">
                  <div className="table-responsive active-projects task-table">
                    <div className="tbl-caption  align-items-center">
                      <HeaderFilters
                        setSearch={setSearch}
                        isSearch={true}
                        searchlabel="Search By Patient Id / Name"
                        // select status
                        selectlabel="Select Status"
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
                        defaultAllocateTo={"All"}
                        // allocated by
                        isAllocatedBySelector={true}
                        allocatedBylabel="Select AllocatedBy"
                        allocatedByOptoons={generateOptionsList(
                          response?.response,
                          "allocatedBy",
                          "All"
                        )}
                        setSelAllocatedBy={setSelAllocatedBy}
                        defaultAllocatedBy={"All"}
                        // allocated date
                        pickerlabe3="Allocated Date"
                        defaultStartDate3={""}
                        defaultEndDate3={""}
                        setStartDate3={setAllocatedStartDate}
                        setEndDate3={setAllocatedEndDate}
                        isAnotherPicker2={true}
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
                      />
                    </div>
                    <div
                      id="task-tbl_wrapper"
                      className="dataTables_wrapper no-footer"
                    >
                      {userListAll?.loading ? (
                        <SpinnerDots />
                      ) : (
                        <UserQueue
                          userList={response?.response}
                         
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
      <Footer />
    </>
  );
};

export default index;
