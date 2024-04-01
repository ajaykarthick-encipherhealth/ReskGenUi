import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Paginator } from "primereact/paginator";
import { Popover, notification } from "antd";
import "react-facebook-loading/dist/react-facebook-loading.css";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import Header from "../../../jsx/layouts/nav/Header";
import PatientTable from "../table/PatientList/patientList";
import SpinnerDots from "../../../components/spinner";
import HeaderFilters from "../../../components/headerFilters";
import { getWorkListFilter } from "../../../store/actions/l2Action/AuditorAction";
import { generateOptionsList } from "../../../components/headerFilters/functions";
import AuditedTrack from "../../../../src/images/trackingImages/AuditedTrack.png";
import NotAudited from "../../../../src/images/trackingImages/NotAuditedTrack.png";
import AuditHold from "../../../../src/images/trackingImages/AuditHoldTrack.png";
import ReAudit from "../../../../src/images/trackingImages/reAuditTrack.png";
import AuditPending from "../../../../src/images/trackingImages/AuditPending.png";
import AuditeDeclineTrack from "../../../../src/images/trackingImages/AuditDeclined.png";

export function extractLatestData(notes) {
  let declinedData;

  if (notes && typeof notes === "object") {
    const entries = Object.entries(notes);

    const latestKey = Math.max(...entries.map(([key, value]) => parseInt(key)));

    entries.forEach(([key, value]) => {
      if (parseInt(key) === latestKey) {
        declinedData = value;
      }
    });
  }

  return declinedData;
}
import Image from "next/image";
import { patientDetails } from "../../../stores/authflow/actions";
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

const statusOptions = [
  { label: "ALL", value: "" },
  { label: "AUDITED", value: "AUDITED" },
  { label: "AUDIT_PENDING", value: "AUDIT_PENDING" },
  { label: "RE AUDIT", value: "REAUDIT" },
  { label: "AUDIT HOLD", value: "AUDITHOLD" },
  { label: "AUDIT DECLINED", value: "AUDIT_DECLINED" },
];

export default function Patient() {
  const navigate = useRouter();
  const dispatch = useDispatch();
  const sideMenu = useSelector((state) => state.sideMenu);
  const response = useSelector((state) => state.AuditWork.workListFilter);
  const filteredList = useSelector((state) => state.auth.filterList);
  const [validated, setValidated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingBtn, setIsLoadingBtn] = useState(true);
  const [addPatient, setAddPatient] = useState(false);
  const [addPatientId, setAddPatientId] = useState(false);
  const [completedStartDate, setCompletedStartDate] = useState("");
  const [completedEndDate, setCompletedEndDate] = useState("");
  const [computedStartDate, setComputedStartDate] = useState("");
  const [computedEndDate, setComputedEndDate] = useState("");
  const [selectedOption, SetSelectedOption] = useState("");
  const [patientSortOrder, setPatientSortOrder] = useState("ASC");
  const [sort, setSort] = useState({ sortDir: "", sortField: "" });
  const [inputValue, setInputValue] = useState({
    year: "",
    name: "",
    patientId: "",
    processStageId: "",
    patientId: "",
  });
  const [selAllocatedBy, setSelAllocatedBy] = useState("");

  const [patinetListAll, setPatinetListAll] = useState([]);
  const [tenantId, setTenantId] = useState("");
  const [localOrgId, setLocalOrgId] = useState("");
  const [localUserId, setLocalUserId] = useState("");
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [paginationFirst, setPaginationFirst] = useState(0);
  const [totalElements, setTotalElements] = useState(10);
  const [tableLoading, setTableLoading] = useState(true);
  const [parsedData, setParsedData] = useState([]);
  const [search, setSearch] = useState("");
  const [selCreatedBy, setSelCreatedBy] = useState("");

  useEffect(() => {
    let tenId = localStorage.getItem("tenantId");
    let uId = localStorage.getItem("userId");
    let orgId = localStorage.getItem("orgId");
    setTenantId(tenId);
    setLocalOrgId(orgId);
    setLocalUserId(uId);
    const datas = {
      pageNo,
      computedStartDate,
      computedEndDate,
      selectedOption,
      search,
      completedStartDate,
      completedEndDate,
      patientSortOrder,
      selAllocatedBy,
      sort,
      selCreatedBy,
    };

    dispatch(getWorkListFilter(datas));
  }, [
    pageNo,
    computedStartDate,
    computedEndDate,
    selectedOption,
    selAllocatedBy,
    search,
    completedStartDate,
    completedEndDate,
    patientSortOrder,
    sort,
    selCreatedBy,
  ]);

  useEffect(() => {
    if (response?.response?.content) {
      getAllList(response?.response?.content);
    }
  }, [parsedData, response, pageNo, pageSize]);

  const getAllList = (info) => {
    if (response) {
      let resultMap = [];
      let result = response?.response?.content;
      setTotalElements(response?.response?.totalElements);
      result?.map((res) => {
        resultMap.push({
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
          auditedStatus: res.auditedStatus,
          patientAllocated: res.patientAllocated,
          auditAllocatedDate: res.auditAllocatedDate,
          auditDueDate: res.auditDueDate,
          auditedDate: res.auditedDate,
          patientAllocatedFirstName: res.patientAllocatedFirstName,
          patientAllocatedLastName: res.patientAllocatedLastName,
          patientAllocatedProfileImage: res.patientAllocatedProfileImage,
          auditAllocatedByFirstName: res.auditAllocatedByFirstName,
          auditAllocatedByLastName: res.auditAllocatedByLastName,
          auditAllocatedByProfileImage: res.auditAllocatedByProfileImage,
          declinedNotes: res.declinedNotes,
          auditDeclinedNotes: res.auditDeclinedNotes,
          accuracyScore: res.accuracyScore,
        });
      });
      let newArray = [];
      newArray = [...patinetListAll, ...resultMap];
      setPatinetListAll(resultMap);
      setIsLoading(false);
      setTableLoading(false);
    }
  };

  const addPatientFormId = () => {
    setValidated(false);
    setAddPatientId(true);
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

    switch (rowData.auditedStatus) {
      case "AUDIT_PENDING":
        return (
          <Popover placement="bottom" title="Status: AUDIT PENDING">
            <div className="patient-status" style={{ textAlign: "center" }}>
              <Image
                src={AuditPending}
                style={{ height: "25%", width: "25%" }}
              />
            </div>
          </Popover>
        );

      case "DECLINED":
        return (
          <div className="patient-status" style={{ textAlign: "center" }}>
            <span className={`badge failed-text`} style={{ color: "red" }}>
              Declined
            </span>
          </div>
        );

      case "AUDITHOLD":
        return (
          <Popover placement="bottom" title="Status: AUDIT HOLD">
            <div className="patient-status" style={{ textAlign: "center" }}>
              <Image src={AuditHold} style={{ height: "25%", width: "25%" }} />
            </div>
          </Popover>
        );
      case "REAUDIT":
        return (
          <Popover placement="bottom" title="Status: REAUDIT">
            <div className="patient-status" style={{ textAlign: "center" }}>
              <Image src={ReAudit} style={{ height: "25%", width: "25%" }} />
            </div>
          </Popover>
        );
      case "AUDITED":
        return (
          <Popover placement="bottom" title="Status: AUDITED">
            <div className="patient-status" style={{ textAlign: "center" }}>
              <Image
                src={AuditedTrack}
                style={{ height: "25%", width: "25%" }}
              />
            </div>
          </Popover>
        );
      case "AUDIT_DECLINED":
        return (
          <Popover
            placement="bottom"
            title="Status: AUDIT DECLINED"
            content={`Reason: ${declinedData ? declinedData : "---"}`}
          >
            <div className="patient-status" style={{ textAlign: "center" }}>
              <Image
                src={AuditeDeclineTrack}
                style={{ height: "25%", width: "25%" }}
              />
            </div>
          </Popover>
        );
      case "AUDITED":
        return (
          <div className="patient-status" style={{ textAlign: "center" }}>
            <Image src={AuditedTrack} style={{ height: "25%", width: "25%" }} />
          </div>
        );
      case "NOT_AUDIT":
        return (
          <Popover placement="bottom" title=" Status: NOT AUDIT">
            <div className="patient-status" style={{ textAlign: "center" }}>
              <Image src={NotAudited} style={{ height: "25%", width: "25%" }} />
            </div>
          </Popover>
        );
      case null:
        return (
          <div className="patient-status" style={{ textAlign: "center" }}>
            ---
          </div>
        );
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

  return (
    <div className={`show ${sideMenu ? "menu-toggle" : ""}`}>
      <Header />
      <div class="content-body">
        <div className="container-fluid">
          <div className="row">
            <div className="col-xl-12">
              <div className="">
                <div className="card-body p-0">
                  <div className="table-responsive active-projects task-table">
                    <div className="tbl-caption  align-items-center">
                      <div className="tbl-caption  align-items-center">
                        <HeaderFilters
                          setSearch={setSearch}
                          isSearch={true}
                          searchlabel="Search By Patient ID / Name"
                          search={search}
                          // select status
                          selectlabel="Select Audited Status"
                          isSelector={true}
                          setSelectedOption={SetSelectedOption}
                          selectOptions={statusOptions}
                          defaultSelectValue1={"Select Status"}
                          // computation date
                          pickerlabel="Audit Due Date"
                          defaultStartDate={""}
                          defaultEndDate={""}
                          setStartDate={setComputedStartDate}
                          setEndDate={setComputedEndDate}
                          isRangePicker={true}
                          // completed date
                          pickerlabe2="Audited Date"
                          defaultStartDate2={""}
                          defaultEndDate2={""}
                          setStartDate2={setCompletedStartDate}
                          setEndDate2={setCompletedEndDate}
                          isAnotherPicker={true}
                          defaultAllocateTo={"All"}
                          // created by
                          isNextCreatedBySelector={true}
                          createdTolabel="Reviewer"
                          optionKey="patientAllocated"
                          createdByOptoons={generateOptionsList(filteredList)}
                          setSelCreatedBy={setSelCreatedBy}
                          addUser={false}
                          addUserForm={addPatientFormId}
                          bullets={bullets}
                          // isNextRow={true}
                        />
                      </div>
                    </div>

                    <div
                      id="task-tbl_wrapper"
                      className="dataTables_wrapper no-footer"
                    >
                      {isLoading ? (
                        <SpinnerDots />
                      ) : (
                        <>
                          <PatientTable
                            patinetListAll={patinetListAll}
                            actionBodyTemplate={actionBodyTemplate}
                            statusBodyTemplate={processstatusBodyTemplate}
                            gotoPatientDetails={gotoPatientDetails}
                            patientDetails={patientDetails}
                            sort={sort}
                            setSort={setSort}
                          />
                          <div>
                            <div className="pagination-container">
                              <Paginator
                                first={paginationFirst}
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
  );
}
