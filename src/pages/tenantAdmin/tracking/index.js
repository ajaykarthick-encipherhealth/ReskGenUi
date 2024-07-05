import React, { useState, useEffect } from "react";
import Header from "../../../jsx/layouts/nav/Header";
import { connect, useSelector } from "react-redux";
import { useRouter } from "next/router";
import styles from "../../../pages/supervisor/dashboard/styles.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "react-facebook-loading/dist/react-facebook-loading.css";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { Popover, Tooltip, notification } from "antd";
import { Paginator } from "primereact/paginator";
import Footer from "../../../jsx/layouts/Footer";
import visitStyles from "../../../styles/visitdata.module.css";
import SpinnerDots from "../../../components/spinner";
import { LoadingOutlined } from "@ant-design/icons";
import HeaderFilters from "./headerFilters";
import TrackingTable from "../../../components/table/tenantTable/trackingList";
import { getTrackingList } from "../../../store/actions/adminAction/patientsActions";
import { generateOptionsList } from "../../../components/headerFilters/functions";
import DailyTask from "./dailytask";
import AuditedTrack from "../../../../src/images/trackingImages/AuditedTrack.png";
import NotAudited from "../../../../src/images/trackingImages/NotAuditedTrack.png";
import AuditHold from "../../../../src/images/trackingImages/AuditHoldTrack.png";
import ReAudit from "../../../../src/images/trackingImages/reAuditTrack.png";
import AuditPending from "../../../../src/images/trackingImages/AuditPending.png";
import Pending from "../../../../src/images/trackingImages/PendingTrack.png";
import Hold from "../../../../src/images/trackingImages/HoldTrack.png";
import Completed from "../../../../src/images/trackingImages/CompletedTrack.png";
import Declined from "../../../../src/images/trackingImages/DeclineTrack.png";
import AuditedDeclineTrack from "../../../../src/images/trackingImages/AuditDeclined.png";
import Abort from "../../../../src/images/trackingImages/Abort.png";
import Image from "next/image";
import { extractLatestData } from "../../supervisor/auditing";
import { patientDetails } from "../../../stores/authflow/actions";
import { actions as tenantAdminAction } from "../../../stores/tenantAdmin";
import Legends from "../../../components/legends";
import warning from "../../../images/svg/warning.svg";
import stylesReport from "../../../pages/reviewer/report/report.module.css";

const bullets = [
  {
    title: "Processed Status",
    option: [
      {
        color: "#0078D4",
        name: "PENDING",
      },
      {
        color: "#3C0AD2",
        name: "HOLD",
      },
      {
        color: "#EB5252",
        name: "DECLINED",
      },
      {
        color: "#00BC13",
        name: "COMPLETED",
      },
    ],
  },
  {
    title: "Audited Status",
    option: [
      {
        color: "#4AA1AB",
        name: "AUDITED",
      },
      {
        color: "#BD3A79",
        name: "AUDIT PENDING",
      },
      {
        color: "#964B00",
        name: "RE AUDIT",
      },
      {
        color: "#EBAE00",
        name: "AUDIT HOLD",
      },
      {
        color: "#C21807",
        name: "AUDIT DECLINED",
      },
    ],
  },
];

const statusOptions = [
  { label: "ALL", value: "" },
  { label: "COMPLETED", value: "COMPLETED", status: 2 },
  { label: "PENDING", value: "PENDING", status: 0 },
  { label: "DECLINED", value: "DECLINED", status: 0 },
  { label: "HOLD", value: "HOLD", status: 0 },
  { label: "ABORTED BY CRON", value: "ABORTED_BY_CRON" },
];

const auditStatusOptions = [
  { label: "ALL", value: "" },
  { label: "AUDITHOLD", value: "AUDITHOLD", status: 2 },
  { label: "REAUDIT", value: "REAUDIT", status: 0 },
  { label: "AUDIT_PENDING", value: "AUDIT_PENDING", status: 0 },
  { label: "NOT_AUDIT", value: "NOT_AUDIT", status: 0 },
  { label: "AUDITED", value: "AUDITED", status: 0 },
  { label: "AUDIT DECLINED", value: "AUDIT_DECLINED", status: 0 },
];

const Patient = ({
  getAllOrganizationList,
  organizationList,
  getAllTrackingList,
  trackingList,
}) => {
  const navigate = useRouter();
  const dispatch = useDispatch();
  const filteredList = useSelector((state) => state.auth.filterList);
  const sideMenu = useSelector((state) => state.sideMenu);
  const response = useSelector((state) => state.adminList.tracking);
  const [validated, setValidated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [addPatient, setAddPatient] = useState(false);
  const [selectedOption, SetSelectedOption] = useState("");
  const [searchTextValue, setSearchTextValue] = useState("");
  const [dueDateStart, setDueDateStart] = useState("");
  const [dueDateEnd, setDueDateEnd] = useState("");
  const [processedStart, setProcessedStart] = useState("");
  const [processedEnd, setProcessedEnd] = useState("");
  const [inputValue, setInputValue] = useState({
    year: "",
    name: "",
    patientId: "",
    processStageId: "",
    patientId: "",
  });
  const [patinetListAll, setPatinetListAll] = useState([]);
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [paginationFirst, setPaginationFirst] = useState(0);
  const [totalElements, setTotalElements] = useState(10);
  const [tableLoading, setTableLoading] = useState(true);
  const [parsedData, setParsedData] = useState([]);
  const [allocatedStartDate, setAllocatedStartDate] = useState("");
  const [allocatedEndDate, setAllocatedEndDate] = useState("");
  const [auditedStartDate, setAuditedStartDate] = useState("");
  const [auditedEndDate, setAuditedEnsDate] = useState("");
  const [auditedDueStartDate, setAuditedDueStartDate] = useState("");
  const [auditedDueEndDate, setAuditedDueEndDate] = useState("");
  const [selAllocatedBy, setSelAllocatedBy] = useState("");
  const [trackChart, setTrackChart] = useState({
    COMPLETED: 0,
    PENDING: 0,
    DECLINED: 0,
    HOLD: 0,
  });
  const [selAllocatedTo, setSelAllocatedTo] = useState("");
  const [auditSelectedOption, setAuditSelectedOption] = useState("");
  const [selAuditAllocatedBy, setSelAuditAllocatedBy] = useState("");
  const [allocatedSortOrder, setAllocatedSortOrder] = useState("DESC");
  const [sort, setSort] = useState({ sortDir: "", sortField: "" });
  const [clear, setClear] = useState(false);
  const [selectedDates, setSelectedDates] = useState();
  const [selectedDates2, setSelectedDates2] = useState();
  const [selectedDates3, setSelectedDates3] = useState();
  const [selectedDates4, setSelectedDates4] = useState();
  const [selectedDates5, setSelectedDates5] = useState();
  const [selectOrgList, setSelectedOrgList] = useState("");
  const [orgAllList, setOrgAllList] = useState([]);
  const [defaultOrgValue, setDefaultOrgValue] = useState(null);
  const [trackInput, setTrackInput] = useState("");

  // new changes

  const [auditSelAllocatedTo, setAuditSelAllocatedTo] = useState("");

  useEffect(() => {
    if (window !== "undefined") {
      setIsLoading(true);
      if (navigate) {
        setPageNo(navigate?.query?.pageNo ? navigate?.query?.pageNo : 0);
        setPaginationFirst(
          navigate?.query?.paginationFirst
            ? navigate?.query?.paginationFirst
            : 0
        );
      }
    }
    setIsLoading(false);
  }, [navigate]);
  getAllOrganizationList,
    organizationList,
    useEffect(() => {
      if (!organizationList?.response) {
        getAllOrganizationList();
      }
    }, []);

  useEffect(() => {
    var orgListArray = [];
    organizationList?.response?.map((res) => {
      orgListArray.push({
        value: res.id,
        label: res.name,
      });
    });
    setOrgAllList(orgListArray);
  }, [organizationList]);
  useEffect(() => {
    const datas = {
      pageNo,
      dueDateStart: clear ? "" : dueDateStart,
      dueDateEnd: clear ? "" : dueDateEnd,
      searchTextValue: clear ? "" : searchTextValue,
      selectedOption: clear ? "" : selectedOption ? selectedOption?.value : "",
      processedStart: clear ? "" : processedStart,
      processedEnd: clear ? "" : processedEnd,
      selAllocatedTo: clear ? "" : selAllocatedTo ? selAllocatedTo?.value : "",
      auditedStartDate: clear ? "" : auditedStartDate,
      auditedEndDate: clear ? "" : auditedEndDate,
      allocatedStartDate: clear ? "" : allocatedStartDate,
      allocatedEndDate: clear ? "" : allocatedEndDate,
      selAllocatedBy: clear ? "" : selAllocatedBy ? selAllocatedBy?.value : "",
      auditedDueStartDate: clear ? "" : auditedDueStartDate,
      auditedDueEndDate: clear ? "" : auditedDueEndDate,
      auditSelectedOption: clear
        ? ""
        : auditSelectedOption
        ? auditSelectedOption?.value
        : "",
      selAuditAllocatedBy: clear
        ? ""
        : selAuditAllocatedBy
        ? selAuditAllocatedBy?.value
        : "",
      auditSelAllocatedTo: clear
        ? ""
        : auditSelAllocatedTo
        ? auditSelAllocatedTo?.value
        : "",
      sort,
      selectOrgId: clear
        ? ""
        : selectOrgList && selectOrgList?.value != "ALL"
        ? selectOrgList?.value
        : "",
    };
    setIsLoading(true);
    getAllTrackingList(datas);
    // setIsLoading(false);
  }, [
    pageNo,
    dueDateStart,
    dueDateEnd,
    searchTextValue,
    processedStart,
    processedEnd,
    selAllocatedTo,
    selectedOption,
    auditedStartDate,
    auditedEndDate,
    allocatedStartDate,
    allocatedEndDate,
    selAllocatedBy,
    auditedDueStartDate,
    auditedDueEndDate,
    auditSelectedOption,
    selAuditAllocatedBy,
    auditSelAllocatedTo,
    sort,
    clear,
    selectOrgList,
  ]);

  useEffect(() => {
    if (trackingList?.data?.response) {
      // setIsLoading(true);
      getAllList(trackingList?.data?.response);
      // setIsLoading(false);
    }
  }, [parsedData, trackingList, pageNo, pageSize]);

  const getAllList = (info) => {
    if (info) {
      var resultMap = [];
      var result = info?.patientDTOList?.content;
      setTotalElements(info?.patientDTOList?.totalElements);
      result?.map((res) => {
        resultMap?.push({
          patientId: res.patientId,
          patientName: res.patientName,
          fileName: res.fileName,
          computing: res.computing,
          createdAt: res.createdAt,
          lastModifiedDate: res.lastModifiedDate,
          dueDate: res.dueDate,
          allocatedBy: res.allocatedBy,
          allocatedOn: res.allocatedOn,
          priority: res.priority,
          processedStatus: res.processedStatus,
          processedDate: res.processedDate,
          auditedDate: res.auditedDate,
          createdAt: res.createdAt,
          patientAllocated: res.patientAllocated,
          allocatedByFirstName: res.allocatedByFirstName,
          allocatedByLastName: res.allocatedByLastName,
          auditAllocatedDate: res.auditAllocatedDate,
          auditedStatus: res.auditedStatus,
          auditAllocatedByFirstName: res.auditAllocatedByFirstName,
          auditAllocatedByLastName: res.auditAllocatedByLastName,
          patientAllocatedFirstName: res.patientAllocatedFirstName,
          patientAllocatedLastName: res.patientAllocatedLastName,
          patientAllocatedProfileImage: res.patientAllocatedProfileImage,
          auditedAssignedFirstName: res.auditedAssignedFirstName,
          auditedAssignedLastName: res.auditedAssignedLastName,
          auditedAssignedProfileImage: res.auditedAssignedProfileImage,
          allocatedByProfileImage: res.allocatedByProfileImage,
          auditAllocatedByProfileImage: res.auditAllocatedByProfileImage,
          auditDueDate: res.auditDueDate,
          declinedNotes: res.declinedNotes,
          auditDeclinedNotes: res.auditDeclinedNotes,
        });
      });
      setTrackChart(info?.processStatusCount);
      var newArray = [];
      newArray = [...patinetListAll, ...resultMap];
      setPatinetListAll(resultMap);

      setIsLoading(false);
      setTableLoading(false);
    }
  };
  const addPatientFile = (data) => {
    inputValue.patientId = data.patientId;
    inputValue.name = data.patientName;
    inputValue.processStageId = data.processStageId;
    inputValue.patientId = data.patientId;
    setValidated(false);
    setAddPatient(true);
    setIsLoadingBtn(false);
  };

  const gotoPatientDetails = (data) => {
    dispatch(patientDetails(data));
    if (data.computing == 2) {
      const controller = new AbortController();
      const { signal } = controller;
      controller.abort();
      localStorage.setItem("patientId", data.patientId);
      navigate.push("/reviewer/patients/details");
    } else {
      notification.warning({
        message: data.patientId + " file not processed Please wait",
      });
    }
  };

  const processstatusBodyTemplate = (rowData) => {
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

  const auditstatusBodyTemplate = (rowData) => {
    const declinedDataFromAudit = extractLatestData(
      rowData?.auditDeclinedNotes
    );

    const declinedDataFromDeclined = extractLatestData(
      rowData?.auditDeclinedNotes
    );

    const declinedData = declinedDataFromAudit || declinedDataFromDeclined;
    switch (rowData.auditedStatus) {
      case "AUDIT_PENDING":
        return (
          <Popover placement="bottom" title="Status: AUDIT PENDING">
            <div className="patient-status">
              <Image
                src={AuditPending}
                style={{ height: "30px", width: "30px" }}
              />
            </div>
          </Popover>
        );

      case "AUDITHOLD":
        return (
          <Popover placement="bottom" title=" Status: AUDIT HOLD">
            <div className="patient-status">
              <Image
                src={AuditHold}
                // className={styles.ImgTrck}
                style={{ height: "30px", width: "30px" }}
              />
            </div>
          </Popover>
        );
      case "REAUDIT":
        return (
          <Popover placement="bottom" title=" Status: REAUDIT">
            <div className="patient-status">
              <Image src={ReAudit} style={{ height: "30px", width: "30px" }} />
            </div>
          </Popover>
        );
      case "AUDITED":
        return (
          <Popover placement="bottom" title=" Status: AUDITED">
            <div className="patient-status">
              <Image
                src={AuditedTrack}
                style={{ height: "30px", width: "30px" }}
              />
            </div>
          </Popover>
        );
      case "AUDITED":
        return (
          <div className="patient-status">
            <Image
              src={AuditedTrack}
              style={{ height: "30px", width: "30px" }}
            />
          </div>
        );

      case "NOT_AUDIT":
        return (
          <Popover placement="bottom" title=" Status: NOT AUDIT">
            <div className="patient-status">
              <Image
                src={NotAudited}
                style={{ height: "30px", width: "30px" }}
              />
            </div>
          </Popover>
        );
      case "AUDIT_DECLINED":
        return (
          <Popover
            placement="bottom"
            title=" Status: AUDIT DECLINED"
            content={`Reason: ${declinedData ? declinedData : "---"}`}
          >
            <div className="patient-status">
              <Image
                src={AuditedDeclineTrack}
                style={{ height: "30px", width: "30px" }}
              />
            </div>
          </Popover>
        );
      case null:
        return <div className="patient-status">---</div>;
    }
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="d-flex ">
        <button
          onClick={() => addPatientFile(rowData)}
          className="btn hegiht10 btn-primary shadow  sharp me-1 action-btn"
        >
          <FontAwesomeIcon icon={faUpload} fontSize={11} />
        </button>
      </div>
    );
  };

  const onPageChange = (e) => {
    setIsLoading(true);
    setPaginationFirst(e.first);
    setPageNo(e.page);
    setPageSize(e.rows);
    setTableLoading(true);
    getAllList(response?.response);
  };

  useEffect(() => {
    if (!organizationList?.response) {
      getAllOrganizationList();
    }
  }, []);

  useEffect(() => {
    var orgListArray = [{ value: "ALL", label: "ALL" }];
    organizationList?.response?.map((res) => {
      orgListArray.push({
        value: res.id,
        label: res.name,
      });
    });
    setOrgAllList(orgListArray);
  }, [organizationList]);

  return (
    <>
      <div className={`show ${sideMenu ? "menu-toggle" : ""}`}>
        <Header />
        <div class="content-body">
          <div className="container-fluid">
            <div className="row">
              <div className="col-xl-12">
                <div className="">
                  <div className="card-body p-0">
                    <div className="table-responsive active-projects task-table">
                      <div className="tbl-caption row d-flex ">
                        <div className="tbl-caption col-xl-10 align-items-center">
                          <HeaderFilters
                            // audioAllocatedTo
                            isAuditAllocatedToSelector={true}
                            auditAllocatedTolabel="Audit Allocated to"
                            auditallocatedToOptoons={generateOptionsList(
                              filteredList
                            )}
                            setAuditSelAllocatedTo={setAuditSelAllocatedTo}
                            setSearch={setSearchTextValue}
                            isSearch={true}
                            search={searchTextValue}
                            searchlabel="Search By Patient Name / ID"
                            // select status
                            selectlabel="Select Status"
                            isSelector={true}
                            setSelectedOption={SetSelectedOption}
                            selectOptions={statusOptions}
                            defaultSelectValue1={"Select Status"}
                            // due date
                            isRangePicker={true}
                            setStartDate={setDueDateStart}
                            setEndDate={setDueDateEnd}
                            pickerlabel="Due date"
                            defaultStartDate={""}
                            defaultEndDate={""}
                            disabled="pastDate"
                            // completed date
                            isAnotherPicker={true}
                            setStartDate2={setProcessedStart}
                            setEndDate2={setProcessedEnd}
                            pickerlabe2="Audited date"
                            defaultStartDate2={""}
                            defaultEndDate2={""}
                            // Audit allocated date
                            pickerlabe5="Audit Allocated Date"
                            defaultStartDate5={""}
                            defaultEndDate5={""}
                            setStartDate5={setAllocatedStartDate}
                            setEndDate5={setAllocatedEndDate}
                            isAnotherPicker5={true}
                            // Auditeddate
                            pickerlabe4="Allocated Date"
                            defaultStartDate4={""}
                            defaultEndDate4={""}
                            setStartDate4={setAuditedStartDate}
                            setEndDate4={setAuditedEnsDate}
                            isAnotherPicker3={true}
                            // allocatedTo
                            isAllocatedToSelector={true}
                            allocatedTolabel="Allocated to"
                            allocatedToOptoons={generateOptionsList(
                              filteredList
                            )}
                            setSelAllocatedTo={setSelAllocatedTo}
                            // defaultAllocateTo="All"
                            tracking={true}
                            // allocated by
                            isAllocatedBySelector={true}
                            allocatedBylabel=" Allocated By"
                            allocatedByOptoons={generateOptionsList(
                              filteredList
                            )}
                            setSelAllocatedBy={setSelAllocatedBy}
                            // defaultAllocatedBy={"All"}
                            bullets={bullets}
                            isNextRow={true}
                            defaultShow={true}
                            defaultSize={"col-xl-2"}
                            auditStatusOptions={auditStatusOptions}
                            setAuditSelectedOption={setAuditSelectedOption}
                            setStartDate6={setAuditedDueStartDate}
                            setEndDate6={setAuditedDueEndDate}
                            setSelAuditAllocatedBy={setSelAuditAllocatedBy}
                            auditAllocatedByOptoons={generateOptionsList(
                              filteredList
                            )}
                            orgAllList={orgAllList}
                            setSelectedOrgList={setSelectedOrgList}
                            selectOrgList={selectOrgList}
                            setClear={setClear}
                            clear={clear}
                            selectedDates={selectedDates}
                            selectedDates2={selectedDates2}
                            selectedDates3={selectedDates3}
                            selectedDates4={selectedDates4}
                            selectedDates5={selectedDates5}
                            setSelectedDates={setSelectedDates}
                            setSelectedDates2={setSelectedDates2}
                            setSelectedDates3={setSelectedDates3}
                            setSelectedDates4={setSelectedDates4}
                            setSelectedDates5={setSelectedDates5}
                            selector7value={selAuditAllocatedBy}
                            selector6value={selAllocatedBy}
                            selector5value={auditSelectedOption}
                            selector4value={selectedOption}
                            selector2value={auditSelAllocatedTo}
                            selectorValue={selAllocatedTo}
                            auditSelAllocatedTo={auditSelAllocatedTo}
                            setPageNo={setPageNo}
                          />
                        </div>
                        <div className="col-xl-2">
                          <DailyTask trackChart={trackChart} />
                        </div>
                      </div>

                      <div
                        id="task-tbl_wrapper"
                        className="dataTables_wrapper no-footer"
                      >
                        {isLoading ? (
                          <div>
                            <SpinnerDots topHeight={"10pc"} />
                          </div>
                        ) : (
                          <>
                            <TrackingTable
                              patinetListAll={patinetListAll}
                              actionBodyTemplate={actionBodyTemplate}
                              statusBodyTemplate={processstatusBodyTemplate}
                              auditBodyTemplate={auditstatusBodyTemplate}
                              gotoPatientDetails={gotoPatientDetails}
                              patientDetails={patientDetails}
                              setSortOrder={setAllocatedSortOrder}
                              sortOrder={allocatedSortOrder}
                              setSort={setSort}
                              page={{ pageNo, paginationFirst }}
                            />
                            <div>
                              <div className="pagination-container">
                                <Paginator
                                  first={pageNo===0?0:paginationFirst}
                                  rows={15}
                                  totalRecords={totalElements}
                                  onPageChange={onPageChange}
                                />
                                <div className="total-pages">
                                  Total count: {totalElements}
                                </div>
                              </div>
                            </div>
                          </>
                        )}
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
const enhancer = connect(
  (state) => ({
    organizationList: state?.tenantAdmin?.allOrganization?.data,
    trackingList: state?.tenantAdmin?.allTracking,
  }),
  {
    getAllOrganizationList: tenantAdminAction.getAllOrganizationAction,
    getAllTrackingList: tenantAdminAction.getAllTrackingAction,
  }
);
export default enhancer(Patient);
