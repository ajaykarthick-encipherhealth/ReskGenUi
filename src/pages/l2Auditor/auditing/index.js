import React, { useState, useEffect } from "react";
import Header from "../../../jsx/layouts/nav/Header";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "react-facebook-loading/dist/react-facebook-loading.css";
import { faUpload, faSearch } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { patientDetails } from "../../../store/actions/AuthActions";
import { DatePicker, Spin, notification } from "antd";
import { Paginator } from "primereact/paginator";
import Footer from "../../../jsx/layouts/Footer";
import PatientTable from "../table/PatientList/patientList";
import SpinnerDots from "../../../components/spinner";
import HeaderFilters from "../../../components/headerFilters";
import { getWorkListFilter } from "../../../store/actions/l2Action/AuditorAction";

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
];

const statusOptions = [
  { label: "ALL", value: "" },
  { label: "AUDITED", value: "AUDITED" },
  { label: "PENDING", value: "AUDIT_PENDING" },
  { label: "RE AUDIT", value: "REAUDIT" },
  { label: "DECLINED", value: "DECLINED" },
  { label: "AUDIT HOLD", value: "AUDITHOLD" },
];

export default function Patient() {
  const navigate = useRouter();
  const dispatch = useDispatch();
  const sideMenu = useSelector((state) => state.sideMenu);
  const response = useSelector((state) => state.AuditWork.workListFilter);
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
  const [sortField, setSortField] = useState(null);
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

  const allocatedByOptionsSet = new Set();

  const createdByOptions = [
    { label: "All", value: "All" },
    ...patinetListAll
      ?.map((item) =>
        item?.patientAllocated
          ? { label: item?.patientAllocated, value: item?.patientAllocated }
          : null
      )
      .filter(Boolean),
  ];
  useEffect(() => {
    var tenId = localStorage.getItem("tenantId");
    var uId = localStorage.getItem("userId");
    var orgId = localStorage.getItem("orgId");
    setTenantId(tenId);
    setLocalOrgId(orgId);
    setLocalUserId(uId);

    dispatch(
      getWorkListFilter(
        pageNo,
        computedStartDate,
        computedEndDate,
        selectedOption,
        selAllocatedBy,
        search,
        completedStartDate,
        completedEndDate,
        patientSortOrder,
        sortField
      )
    );
  }, [
    pageNo,
    computedStartDate,
    computedEndDate,
    selectedOption,
    selAllocatedBy,
    search,
    completedStartDate,
    completedEndDate,
    sortField,
    patientSortOrder,
  ]);

  useEffect(() => {
    if (response?.response?.content) {
      getAllList(response?.response?.content);
    }
  }, [parsedData, response, pageNo, pageSize]);

  const getAllList = (info) => {
    if (response) {
      var resultMap = [];
      var result = response?.response?.content;
      console.log(result, "result");
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
          createdAt: res.createdAt,
          auditedStatus: res.auditedStatus,
          patientAllocated: res.patientAllocated,
        });
      });
      var newArray = [];
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
      navigate.push("/physician/patients/details");
    } else {
      notification.warning({
        message: data.patientId + " file not processed Please wait",
      });
    }
  };

  const processstatusBodyTemplate = (rowData) => {
    switch (rowData.auditedStatus) {
      case "AUDIT_PENDING":
        return (
          <div className="patient-status">
            <span
              className={`badge Auditprocessing-text`}
              style={{ color: "#E28213", background: "#FBE7D0 !important" }}
            >
              Pending
            </span>
          </div>
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
          <div className="patient-status">
            <span
              className={`badge Audithold-text`}
              style={{ color: "#CE9900" }}
            >
              Audit Hold
            </span>
          </div>
        );
      case "REAUDIT":
        return (
          <div className="patient-status">
            <span className={`badge reAudit-text`} style={{ color: "#964B00" }}>
              Re Audit
            </span>
          </div>
        );
      case "AUDITED":
        return (
          <div className="patient-status">
            <span className={`badge audited-text`} style={{ color: "#377880" }}>
              Audited
            </span>
          </div>
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
                      <div className="tbl-caption  align-items-center">
                        <div className="tbl-caption  align-items-center">
                          <HeaderFilters
                            setSearch={setSearch}
                            isSearch={true}
                            searchlabel="Search By Patient Id / Name"
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
                            isCreatedBySelector={true}
                            createdTolabel="Select L1 Auditor"
                            createdByOptoons={createdByOptions}
                            setSelCreatedBy={setSelCreatedBy}
                            addUser={false}
                            addUserForm={addPatientFormId}
                            bullets={bullets}
                            isNextRow={true}
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
                              setSortOrder={setPatientSortOrder}
                              sortOrder={patientSortOrder}
                              setSortField={setSortField}
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
                            <Footer />
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
}
