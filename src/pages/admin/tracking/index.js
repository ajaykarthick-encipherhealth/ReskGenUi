import React, { useState, useEffect } from "react";
import Header from "../../../jsx/layouts/nav/Header";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "react-facebook-loading/dist/react-facebook-loading.css";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { patientDetails } from "../../../store/actions/AuthActions";
import { Spin, notification } from "antd";
import { Paginator } from "primereact/paginator";
import Footer from "../../../jsx/layouts/Footer";
import visitStyles from "../../../styles/visitdata.module.css";
import SpinnerDots from "../../../components/spinner";
import { LoadingOutlined } from "@ant-design/icons";
import HeaderFilters from "../../../components/headerFilters";
import TrackingTable from "../../../components/table/admin/trackingList";
import { getTrackingList } from "../../../store/actions/adminAction/patientsActions";
import { generateOptionsList } from "../../../components/headerFilters/functions";

const bullets = [
  {
    color: "#34ace8",
    name: "Computed",
  },
  {
    color: "#452b90",
    name: "Processing",
  },
  {
    color: "#be3144",
    name: "Not Computed",
  },
];

const statusOptions = [
  { label: "ALL", value: "" },
  { label: "PROCESSING", value: "1", status: 1 },
  { label: "COMPUTED", value: "2", status: 2 },
  { label: "NOT COMPUTED", value: "0", status: 0 },
];

export default function Patient() {
  const navigate = useRouter();
  const dispatch = useDispatch();
  const filteredList = useSelector((state) => state.auth.filterList);
  const sideMenu = useSelector((state) => state.sideMenu);
  const response = useSelector((state) => state.adminList.tracking);
  const [validated, setValidated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingBtn, setIsLoadingBlasttn] = useState(true);
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
  const [tenantId, setTenantId] = useState("");
  const [localOrgId, setLocalOrgId] = useState("");
  const [localUserId, setLocalUserId] = useState("");
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [paginationFirst, setPaginationFirst] = useState(0);
  const [totalElements, setTotalElements] = useState(10);
  const [tableLoading, setTableLoading] = useState(true);
  const [parsedData, setParsedData] = useState([]);

  const [selAllocatedTo, setSelAllocatedTo] = useState("");

  const allocatedToOptions = [
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
      getTrackingList(
        pageNo,
        dueDateStart,
        dueDateEnd,
        searchTextValue,
        selectedOption,
        processedStart,
        processedEnd,
        selAllocatedTo
      )
    );
  }, [
    pageNo,
    dueDateStart,
    dueDateEnd,
    searchTextValue,
    processedStart,
    processedEnd,
    selAllocatedTo,
    selectedOption,
  ]);

  useEffect(() => {
    if (response?.response) {
      getAllList(response?.response);
    }
  }, [parsedData, response, pageNo, pageSize]);

  const getAllList = (info) => {
    if (info) {
      var resultMap = [];
      var result = info?.content;
      setTotalElements(info?.totalElements);
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


        });
      });
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
      navigate.push("/physician/patients/details");
    } else {
      notification.warning({
        message: data.patientId + " file not processed Please wait",
      });
    }
  };

  const processstatusBodyTemplate = (rowData) => {
    switch (rowData.processedStatus) {
      case "COMPLETED":
        return (
          <div className="patient-status">
            <span className={`badge processed-text`}>Completed</span>
          </div>
        );

      case "PENDING":
        return (
          <div className="patient-status">
            <span className={`badge processing-text`}>Pending</span>
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

      case "NOTCOMPUTED":
        return (
          <div className="patient-status">
            <span className={`badge processing-text`}>Pending</span>
          </div>
        );
      case "COMPUTED":
        return (
          <div className="patient-status">
            <span className={`badge processing-text`}>Pending</span>
          </div>
        );
      case "HOLD":
        return (
          <div className="patient-status">
            <span className={`badge hold-text`}>Hold</span>
          </div>
        );
      case null:
        return (
          <div className="patient-status">
            <span className={`badge processing-text`}>Pending</span>
          </div>
        );
    }
  };
  const auditstatusBodyTemplate = (rowData) => {
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
                            setSearch={setSearchTextValue}
                            isSearch={true}
                            searchlabel="Search By Patient Name"
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
                            // completed date
                            isAnotherPicker={true}
                            setStartDate2={setProcessedStart}
                            setEndDate2={setProcessedEnd}
                            pickerlabe2="Audited date"
                            // allocatedTo
                            isAllocatedToSelector={true}
                            allocatedTolabel="Allocated to"
                            allocatedToOptoons={ generateOptionsList(filteredList)}
                            setSelAllocatedTo={setSelAllocatedTo}
                            defaultAllocateTo="All"
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
                            <TrackingTable
                              patinetListAll={patinetListAll}
                              actionBodyTemplate={actionBodyTemplate}
                              statusBodyTemplate={processstatusBodyTemplate}
                              auditBodyTemplate={auditstatusBodyTemplate}
                              gotoPatientDetails={gotoPatientDetails}
                              patientDetails={patientDetails}
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
