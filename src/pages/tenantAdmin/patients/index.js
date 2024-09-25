import React, { useState, useEffect } from "react";
import Header from "../../../jsx/layouts/nav/Header";
import { useSelector, useDispatch } from "react-redux";
import axios from "../../../utility/axiosConfig";
import ENDPOINTS from "../../../utility/enpoints";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "react-facebook-loading/dist/react-facebook-loading.css";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { Spin, notification } from "antd";
import { Paginator } from "primereact/paginator";
import visitStyles from "../../../styles/visitdata.module.css";
import FileUploading from "../fileprocessing/FileUploading";
import Addpatients from "../fileprocessing/Addpatiens";
import SpinnerDots from "../../../components/spinner";
import { LoadingOutlined } from "@ant-design/icons";
import HeaderFilters from "../../../components/headerFilters";
import {
  generateOptionsList,
  validateYear,
} from "../../../components/headerFilters/functions";
import { getFilters, patientDetails } from "../../../stores/authflow/actions";
import { actions as tenantAdminAction } from "../../../stores/tenantAdmin/patients";
import { connect } from "react-redux";
import AddPatientListTable from "../../../components/table/tenantTable/AddPatients/addPatients";
import { renderSkeleton } from "../../../components/reuseableFunctions";
import { getStorage, setStorage } from "../../../utils/storages";
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
    name: "Failed",
  },
  {
    color: "#e88d8d",
    name: "Not Computed",
  },
];

const statusOptions = [
  { label: "ALL", value: "" },
  { label: "PROCESSING", value: "1", status: 1 },
  { label: "COMPUTED", value: "2", status: 2 },
  { label: "FAILED", value: "3", status: 3 },
  { label: "NOT COMPUTED", value: "0", status: 0 },
];

const Patient = ({
  getAllOrganizationList,
  organizationList,
  getAllPatients,
  allPatientList,
  webSocketData,
  loading,
}) => {
  const navigate = useRouter();
  const dispatch = useDispatch();
  const sideMenu = useSelector((state) => state.sideMenu);
  const response = useSelector((state) => state.adminList.patients);
  const filteredList = useSelector((state) => state.filters.createdBy);
  const [validated, setValidated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingBtn, setIsLoadingBtn] = useState(true);
  const [addPatient, setAddPatient] = useState(false);
  const [addPatientId, setAddPatientId] = useState(false);
  const [selectFile, setSelectFile] = useState(null);
  const [selectFileRadiology, setSelectFileRadiology] = useState(null);
  const [completedStartDate, setCompletedStartDate] = useState("");
  const [completedEndDate, setCompletedEndDate] = useState("");
  const [computedStartDate, setComputedStartDate] = useState("");
  const [computedEndDate, setComputedEndDate] = useState("");
  const [selectedOption, SetSelectedOption] = useState("");
  const [inputValue, setInputValue] = useState({
    year: "",
    name: "",
    patientId: "",
    processStageId: "",
    patientId: "",
  });
  const [inputValuePatientId, setInputValuePatientId] = useState({
    patientId: "",
    patientName: "",
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
  const [search, setSearch] = useState("");
  const [selAllocatedTo, setSelAllocatedTo] = useState("");
  const [selAllocatedBy, setSelAllocatedBy] = useState("");
  const [selCreatedBy, setSelCreatedBy] = useState("");
  const [computedSortOrder, setComputedSortOrder] = useState("DESC");
  const [sortCompleteOrder, setSortCompleteOrder] = useState("DESC");
  const [selecteddates, setSelectedDates] = useState([]);
  const [selecteddates2, setSelectedDate2s] = useState([]);
  const [emrType, setEmrType] = useState("");
  const [sort, setSort] = useState({ sortDir: "", sortField: "" });
  const [errors, setErrors] = useState({ year: "", emr: "" });
  const [selectOrgList, setSelectedOrgList] = useState("");
  const [orgAllList, setOrgAllList] = useState([]);

  useEffect(() => {
    if (window !== "undefined") {
      if (navigate) {
        setPageNo(navigate?.query?.pageNo ? navigate?.query?.pageNo : 0);
        setPaginationFirst(
          navigate?.query?.paginationFirst
            ? navigate?.query?.paginationFirst
            : 0
        );
      }
    }
  }, [navigate]);

  useEffect(() => {
    var tenId = getStorage("tenantId");
    var uId = getStorage("userId");
    var orgId = getStorage("orgId");
    // var resoureUrl = `dbservice/patient/getbyuser?userId=${uId}&page=${pageNo}&size=${pageSize}`;
    setTenantId(tenId);
    setLocalOrgId(orgId);
    setLocalUserId(uId);
    getAllPatients(
      pageNo,
      computedStartDate,
      computedEndDate,
      selectedOption,
      search,
      completedStartDate,
      completedEndDate,
      selAllocatedTo,
      selAllocatedBy,
      selCreatedBy,
      sort,
      (orgId = selectOrgList?.value)
    );
    dispatch(getFilters("createdBy"));
  }, [
    pageNo,
    computedStartDate,
    computedEndDate,
    selectedOption,
    search,
    completedStartDate,
    completedEndDate,
    selAllocatedTo,
    selAllocatedBy,
    selCreatedBy,
    sort,
    selectOrgList,
  ]);

  // useEffect(() => {
  //   if (allPatientList?.data?.response) {
  //     getAllList(allPatientList?.data?.response);
  //   }
  // }, [parsedData, allPatientList, pageNo, pageSize]);

  useEffect(() => {
    if (!organizationList?.response) {
      getAllOrganizationList();
    }
  }, []);

  useEffect(() => {
    var orgListArray = [{ value: "", label: "ALL" }];
    organizationList?.response?.map((res) => {
      orgListArray.push({
        value: res.id,
        label: res.name,
      });
    });
    setOrgAllList(orgListArray);
  }, [organizationList]);

  // const getAllList = (info) => {
  //   if (info) {
  //     var resultMap = [];
  //     var result = info?.content;
  //     setTotalElements(info?.totalElements);
  //     result?.map((res) => {
  //       resultMap?.push({
  //         ...res,
  //         patientId: res.patientId,
  //         patientAllocated: res.patientAllocated,
  //         computing: res.computing,
  //         processStageChart: res.processStageChart,
  //         processStageRadiology: res.processStageRadiology,
  //         processStageLab: res.processStageLab,
  //         processStageId: res.processStageId,
  //         processStageIdRadiology: res.processStageIdRadiology,
  //         processStageIdLab: res.processStageIdLab,
  //         allocatedUserId: res.allocatedUserId,
  //         allocatedOn: res.allocatedOn,
  //         allocatedBy: res.allocatedBy,
  //         patientName: res.patientName,
  //         dueDate: res.dueDate,
  //         processedStatus: res.processedStatus,
  //         auditedStatus: res.auditedStatus,
  //         auditedBy: res.auditedBy,
  //         auditedDate: res.auditedDate,
  //         priority: res.priority,
  //         computedDate: res.computedDate,
  //         lastModifiedDate: res.lastModifiedDate,
  //         createdDate: res.createdDate,
  //         createdBy: res.createdBy,
  //         allocatedByFirstName: res.allocatedByFirstName,
  //         allocatedByLastName: res.allocatedByLastName,
  //         allocatedByProfileImage: res.allocatedByProfileImage,
  //         createdByFirstName: res.createdByFirstName,
  //         createdByLastName: res.createdByLastName,
  //         createdByProfileImage: res.createdByProfileImage,
  //         totalPages: res.totalPages,
  //       });
  //     });
  //     var newArray = [];
  //     newArray = [...patinetListAll, ...resultMap];
  //     setPatinetListAll(resultMap);

  //     setIsLoading(false);
  //     setTableLoading(false);
  //     //     setTimeout(() => {
  //     //     subscribe(resultMap);
  //     // }, 3000);
  //   }
  // };

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

  const onChangeFile = (e) => {
    setSelectFile(e[0]);
  };

  const handleChange = async (e, name) => {
    const key =  name == "dos" ? "dos" : e.target.name;
    const value = name == "dos" ? e : e.target.value;
    if (e?.target?.name === "year") {
      const validateYearField = validateYear(e.target.value, setErrors);
      if (validateYearField) {
        setErrors({ ...errors, year: "" });
        setInputValue({ ...inputValue, [key]: value });
      } else {
        console.log(validateYearField);
      }
    } else if (name == "dos") {
      if (value) {
        setInputValue({ ...inputValue, [key]: value });
        setErrors({ ...errors, emr: "" });
      } else {
        setErrors({ ...errors, emr: "Please Select EMR Type" });
      }
    } else {
      setInputValue({ ...inputValue, [key]: value });
    }
  };

  const handleChangePatientId = async (e) => {
    const key = e.target.name;
    const value = e.target.value;
    setInputValuePatientId({ ...inputValuePatientId, [key]: value });
  };

  const handleSubmit = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === true && emrType) {
      setIsLoadingBtn(true);
      event.preventDefault();
      event.stopPropagation();
      if (selectFile != null) {
        submitPatientFile();
      }
      if (selectFileRadiology != null) {
        submitRadiology();
      }
    } else if (!emrType) {
      setErrors({ ...errors, emr: "Please Select EMR Type" });
    }
    setValidated(true);
  };

  const handleSubmitPatientId = async (form) => {
    var orgId = selectOrgList?.value;
    form.allocatedBy = localUserId;
    form.computing = 0;
    form.patientId = form.patientId.trim();
    try {
      setIsLoadingBtn(true);
      const response = await axios.post(
        ENDPOINTS.apiEndoint + `dbservice/patient`,
        form
      );
      if (response?.data?.status == "SUCCESS") {
        getAllPatients(
          pageNo,
          computedStartDate,
          computedEndDate,
          selectedOption,
          search,
          completedStartDate,
          completedEndDate,
          selAllocatedTo,
          selAllocatedBy,
          selCreatedBy,
          sort,
          orgId
        );
        setAddPatientId(false);
        setIsLoadingBtn(false);
        notification.success({
          message: "Patients added successfully.",
          duration: 1,
        });
      } else {
        setIsLoadingBtn(false);
      }
    } catch (Err) {
      notification.error({
        message: Err?.response?.data?.message,
        duration: 1,
      });
    }

    setValidated(true);
  };

  const gotoPatientDetails = (data) => {
    dispatch(patientDetails(data));
    if (data.computing == 2) {
      const controller = new AbortController();
      const { signal } = controller;
      controller.abort();
      setStorage("patientId", data.patientId);
      navigate.push("/admin/patients/details");
    } else {
      notification.warning({
        message: data.patientId + " file not processed Please wait",
      });
    }
  };

  const processstatusBodyTemplate = (rowData) => {
    const isFinished =
      parsedData?.length > 0 &&
      parsedData?.find(
        (data) =>
          data?.patientId === rowData?.patientId &&
          data?.processStageChart === "FINISHED"
      ) !== undefined;

    const rowStatus =
      rowData?.computing === 0 && parsedData?.length === 0
        ? "Not Computed"
        : rowData?.computing == 1
        ? "Processing"
        : isFinished || rowData?.computing == 2
        ? "Computed"
        : rowData?.computing == 3
        ? "Failed"
        : "Not Computed";
    return (
      <div className="patient-status">
        <div
          className={visitStyles.roleStyle}
          style={{
            backgroundColor:
              rowStatus === "Computed"
                ? "#cceeff "
                : rowStatus === "Processing"
                ? "#dfd8f3"
                : rowStatus === "Failed"
                ? "#e88d8d"
                : "#F1DEDA",
            color:
              rowStatus === "Computed"
                ? " #285563"
                : rowStatus === "Processing"
                ? "#452b90"
                : rowStatus === "Failed"
                ? "red"
                : "#BA704F",
          }}
        >
          {rowStatus === "Processing" && (
            <Spin
              indicator={
                <LoadingOutlined
                  style={{
                    fontSize: 16,
                  }}
                  spin
                />
              }
              style={{ color: "#452b90", margin: "0 10px 0 0" }}
            />
          )}
          {rowStatus}
        </div>
      </div>
    );
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="d-flex ">
        <button
          onClick={() => addPatientFile(rowData)}
          className="btn hegiht10  sharp me-1 action-btn"
          style={{ background: "#04306f" }}
        >
          <FontAwesomeIcon
            icon={faUpload}
            fontSize={11}
            style={{ color: "#ffff" }}
          />
        </button>
      </div>
    );
  };

  const submitPatientFile = async () => {
    // setIsLoadingBtn(false);
    // setAddPatient(false);
    const formData = new FormData();
    formData.append("file", selectFile);
    formData.append("dos", inputValue.year);
    formData.append("orgid", localOrgId);
    formData.append("tenantid", tenantId);
    formData.append("userid", localUserId);
    formData.append("patientid", inputValue.patientId);
    formData.append("patientname", inputValue.name);
    formData.append("emrtype", emrType);
    const headers = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    setSelectFile(formData);
    const response = await axios.post(
      ENDPOINTS.apiEndoint +
        `aiservice/ai/upload
      `,
      formData,
      headers
    );
    if (response?.status === 200) {
      // getAllList(response);

      notification.success({
        message: "Patient File Upload Successfully!",
      });
      var orgId = selectOrgList?.value;
      getAllPatients(
        pageNo,
        computedStartDate,
        computedEndDate,
        selectedOption,
        search,
        completedStartDate,
        completedEndDate,
        selAllocatedTo,
        selAllocatedBy,
        selCreatedBy,
        sort,
        orgId
      );
      handleClose()
      setAddPatient(false);
      setAddPatient(false);
      setIsLoadingBtn(false);
      // dispatch(getMessagesList())
    } else {
      setIsLoadingBtn(false);
    }
    setAddPatient(false);
    setIsLoadingBtn(false);
    // getAllList(localUserId);
  };
  const submitRadiology = async () => {
    const formData = new FormData();
    formData.append("file", selectFileRadiology);
    formData.append("orgid", localOrgId);
    formData.append("tenantid", tenantId);
    formData.append("userid", localUserId);
    formData.append("patientid", inputValue.patientId);
    formData.append("patientname", inputValue.name);
    formData.append("emrtype", emrType);
    const headers = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    setSelectFile(formData);
    const response = await axios.post(
      ENDPOINTS.apiEndoint +
        `aiservice/ai/upload/radiology
    `,
      formData,
      headers
    );
    if (response?.status == 202) {
      // getAllList(localUserId, pageNo, pageSize);
      setAddPatient(false);
      setIsLoadingBtn(false);
    } else {
      setIsLoadingBtn(false);
    }
    setAddPatient(false);
    // setIsLoadingBtn(false);
    setSelectFileRadiology(null);
  };

  const handleClose = () => {
    setAddPatient(false);
    setErrors({ year: "", emr: "" })
    setEmrType('')
  }

  const onPageChange = (e) => {
    setIsLoading(true);
    setPaginationFirst(e.first);
    setPageNo(e.page);
    setPageSize(e.rows);
    setTableLoading(true);
    // getAllList(allPatientList?.data?.response);
  };

  const statusUpdateWebSockt = (result) => {
    var resultMap = [];
    result?.map((res) => {
      resultMap?.push({
        ...res,
        patientId: res.patientId,
        patientAllocated: res.patientAllocated,
        computing: res.computing,
        processStageChart: res.processStageChart,
        processStageRadiology: res.processStageRadiology,
        processStageLab: res.processStageLab,
        processStageId: res.processStageId,
        processStageIdRadiology: res.processStageIdRadiology,
        processStageIdLab: res.processStageIdLab,
        allocatedUserId: res.allocatedUserId,
        allocatedOn: res.allocatedOn,
        allocatedBy: res.allocatedBy,
        patientName: res.patientName,
        dueDate: res.dueDate,
        processedStatus: res.processedStatus,
        auditedStatus: res.auditedStatus,
        auditedBy: res.auditedBy,
        auditedDate: res.auditedDate,
        priority: res.priority,
        computedDate: res.computedDate,
        lastModifiedDate: res.lastModifiedDate,
        createdDate: res.createdDate,
        createdBy: res.createdBy,
        allocatedByFirstName: res.allocatedByFirstName,
        allocatedByLastName: res.allocatedByLastName,
        allocatedByProfileImage: res.allocatedByProfileImage,
        createdByFirstName: res.createdByFirstName,
        createdByLastName: res.createdByLastName,
        createdByProfileImage: res.createdByProfileImage,
        totalPages: res.totalPages,
      });
    });
    var newArray = [];
    newArray = [...patinetListAll, ...resultMap];
    setPatinetListAll(resultMap);
  };

  useEffect(() => {
    if (webSocketData && webSocketData?.webSocketType == "PATIENT_COMPUTE") {
      const patientData = allPatientList?.data?.response?.content;
      var foundItem = patientData?.find(
        (x) => x.patientId == webSocketData.patientId
      );
      if (foundItem) {
        foundItem.computing = webSocketData?.computing;
        if (webSocketData?.computedDate) {
          foundItem.computedDate = webSocketData?.computedDate;
        }
      }
      statusUpdateWebSockt(patientData);
    }
  }, [webSocketData]);

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
                        <div className="tbl-caption2  align-items-center">
                          <HeaderFilters
                            setSearch={setSearch}
                            isSearch={true}
                            searchlabel="Search By Patient ID / Name"
                            search={search}
                            // select status
                            selectlabel="Select Status"
                            isSelector={true}
                            setSelectedOption={SetSelectedOption}
                            selectOptions={statusOptions}
                            defaultSelectValue1={"Select Status"}
                            // computation date
                            pickerlabel="Computed Date"
                            defaultStartDate={""}
                            defaultEndDate={""}
                            setStartDate={setComputedStartDate}
                            setEndDate={setComputedEndDate}
                            isRangePicker={true}
                            disable="Yes"
                            selectedDates={selecteddates}
                            setSelectedDates={setSelectedDates}
                            // created date
                            pickerlabe2="Created Date"
                            defaultStartDate2={""}
                            defaultEndDate2={""}
                            setStartDate2={setCompletedStartDate}
                            setEndDate2={setCompletedEndDate}
                            isAnotherPicker={true}
                            selectedDates2={selecteddates2}
                            setSelectedDates2={setSelectedDate2s}
                            // defaultAllocateTo={"All"}
                            // allocated by
                            isAllocatedBySelector={true}
                            allocatedBylabel="Created By"
                            allocatedByOptoons={generateOptionsList(
                              filteredList
                            )}
                            setSelAllocatedBy={setSelAllocatedBy}
                            selectorField="CreatedBy"
                            // defaultAllocatedBy={"All"}
                            setSelCreatedBy={setSelCreatedBy}
                            addUser={true}
                            addUserForm={addPatientFormId}
                            bullets={bullets}
                            isNextRow={true}
                            btnTitle="Add Patient"
                            atCorner={true}
                            // selectOrg
                            selectlabelOrg="Select Organization"
                            isSelectOrg={true}
                            setSelectedOptionOrg={setSelectedOrgList}
                            selectOptionsOrg={orgAllList}
                            defaultSelectValueOrg={""}
                            selectedValueOrg={selectOrgList}
                            setPageNo={setPageNo}
                          />
                        </div>
                      </div>

                      <div
                        id="task-tbl_wrapper"
                        className="dataTables_wrapper no-footer"
                      >
                        {loading ? (
                          renderSkeleton()
                        ) : (
                          <>
                            <AddPatientListTable
                              patinetListAll={
                                allPatientList?.data?.response?.content
                              }
                              actionBodyTemplate={actionBodyTemplate}
                              statusBodyTemplate={processstatusBodyTemplate}
                              gotoPatientDetails={gotoPatientDetails}
                              patientDetails={patientDetails}
                              setSortOrder={setComputedSortOrder}
                              sortOrder={computedSortOrder}
                              setSort={setSort}
                              page={{ pageNo, paginationFirst }}
                              sortCompleteOrder={sortCompleteOrder}
                              setSortCompleteOrder={setSortCompleteOrder}
                            />
                            <div>
                              <div className="pagination-container">
                                <Paginator
                                  first={pageNo === 0 ? 0 : paginationFirst}
                                  rows={15}
                                  totalRecords={
                                    allPatientList?.data?.response
                                      ?.totalElements
                                  }
                                  onPageChange={onPageChange}
                                />
                                <div className="total-pages">
                                  Total count:{" "}
                                  {
                                    allPatientList?.data?.response
                                      ?.totalElements
                                  }
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
        <FileUploading
          addPatient={addPatient}
          setAddPatient={setAddPatient}
          validated={validated}
          handleSubmit={handleSubmit}
          inputValue={inputValue}
          handleChange={handleChange}
          isLoadingBtn={isLoadingBtn}
          onChangeFile={onChangeFile}
          errors={errors}
          setEmrType={setEmrType}
          emrType={emrType}
          handleClose={handleClose}
        />
        <Addpatients
          addPatientId={addPatientId}
          setAddPatientId={setAddPatientId}
          validated={validated}
          handleSubmitPatientId={handleSubmitPatientId}
          handleChangePatientId={handleChangePatientId}
          isLoadingBtn={isLoadingBtn}
          orgAllList={orgAllList}
        />
      </div>
    </>
  );
};

const enhancer = connect(
  (state) => ({
    organizationList: state?.tenantAdmin?.patients?.allOrganization?.data,
    allPatientList: state?.tenantAdmin?.patients?.allPatients,
    webSocketData: state?.tenantAdmin?.webSocket?.webSocketDetails?.data,
    loading: state?.tenantAdmin?.patients?.allPatientsLoading,
  }),
  {
    getAllOrganizationList: tenantAdminAction.getAllOrganizationAction,
    getAllPatients: tenantAdminAction.getAllPatientAction,
  }
);
export default enhancer(Patient);
