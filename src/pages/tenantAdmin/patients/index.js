import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import Header from "../../../jsx/layouts/nav/Header";
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
import {
  generateOptionsForNewStore,
  validateYear,
} from "../../../components/headerFilters/functions";
import { actions as tenantAdminAction } from "../../../stores/tenantAdmin/patients";
import { connect } from "react-redux";
import AddPatientListTable from "../../../components/table/tenantTable/AddPatients/addPatients";
import { renderSkeleton } from "../../../components/reuseableFunctions";
import { getStorage, setStorage } from "../../../utils/storages";
import { getResponePopup } from "../../../utils/reusable";
import { actions as allocationAction } from "../../../stores/admin/patientAllocation";
import { actions as allActions } from "../../../stores/admin/workqueue";
import HeaderFilters from "./headerFilters";

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
  getPatientId,
  uploadFiles,
  uploadFilesRadiology,
  response,
  patientDetails,
  getFilters,
  filteredList,
}) => {
  const navigate = useRouter();
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
  const [selAllocatedTo, setSelAllocatedTo] = useState(null);
  const [selAllocatedBy, setSelAllocatedBy] = useState(null);
  const [selCreatedBy, setSelCreatedBy] = useState(null);
  const [computedSortOrder, setComputedSortOrder] = useState("DESC");
  const [sortCompleteOrder, setSortCompleteOrder] = useState("DESC");
  const [selecteddates, setSelectedDates] = useState([]);
  const [selecteddates2, setSelectedDate2s] = useState([]);
  const [emrType, setEmrType] = useState("");
  const [sort, setSort] = useState({ sortDir: "", sortField: "" });
  const [errors, setErrors] = useState({ year: "", emr: "" });
  const [selectOrgList, setSelectedOrgList] = useState(null);
  const [orgAllList, setOrgAllList] = useState([]);
  const [searchVal, setSearchVal] = useState("");
  const [paramsFilter, setParamsFilter] = useState(null);
  const [clear, setClear] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);

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
    const key = name == "dos" ? "dos" : name == "year" ? "year" : e.target.name;
    const value = name == "dos" || name == "year" ? e : e.target.value;
    if (name === "year") {
      const validateYearField = validateYear(e, setErrors);
      if (validateYearField) {
        setErrors({ ...errors, year: "" });
        setInputValue({ ...inputValue, [key]: value });
      } else {
        setInputValue({ ...inputValue, year: "" });
        setErrors({ ...errors, year: "Please select year" });
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
    if (form.checkValidity() === true && emrType && inputValue.year) {
      setIsLoadingBtn(true);
      event.preventDefault();
      event.stopPropagation();
      if (selectFile != null) {
        submitPatientFile();
      }
      if (selectFileRadiology != null) {
        submitRadiology();
      }
    }
    if (!emrType) {
      setErrors((prev) => ({ ...prev, emr: "Please select EMR type" }));
    }
    if (!inputValue.year) {
      setErrors((prev) => ({ ...prev, year: "Please select year" }));
    }
    setValidated(true);
  };

  const handleSubmitPatientId = async (form) => {
    var orgId = selectOrgList;
    form.allocatedBy = localUserId;
    form.computing = 0;
    form.patientId = form.patientId.trim();
    try {
      setIsLoadingBtn(true);
      const response = await getPatientId({ obj: form });
      getAllPatients(
        pageNo,
        computedStartDate,
        computedEndDate,
        selectedOption,
        search,
        completedStartDate || "",
        completedEndDate || "",
        selAllocatedTo || "",
        selAllocatedBy || "",
        selCreatedBy || "",
        sort,
        orgId
      );

      setAddPatientId(false);
      setIsLoadingBtn(false);
      getResponePopup(response);
      setIsLoadingBtn(false);
      form.resetFields();
    } catch (Err) {
      getResponePopup(Err?.response);
    }
    setValidated(true);
  };

  const gotoPatientDetails = (data) => {
    patientDetails(data);
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
          onClick={() => {
            if (rowData?.processedStatus !== "PROCESSING") {
              addPatientFile(rowData);
            }
          }}
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
    formData.append("dos", inputValue?.year);
    formData.append("orgid", localOrgId);
    formData.append("tenantid", tenantId);
    formData.append("userid", localUserId);
    formData.append("patientid", inputValue.patientId);
    formData.append("patientname", inputValue.name);
    formData.append("emrtype", emrType);
    // const headers = {
    //   headers: {
    //     "Content-Type": "multipart/form-data",
    //   },
    // };
    setSelectFile(formData);
    const response = await uploadFiles({ obj: formData });

    // axios.post(
    //   ENDPOINTS.apiEndoint +
    //     `aiservice/ai/upload
    //   `,
    //   formData,
    //   headers
    // );

    var orgId = selectOrgList;
    getAllPatients(
      pageNo,
      computedStartDate,
      computedEndDate,
      selectedOption,
      search || "",
      completedStartDate || "",
      completedEndDate || "",
      selAllocatedTo || "",
      selAllocatedBy || "",
      selCreatedBy || "",
      sort,
      orgId
    );
    handleClose();
    setAddPatient(false);
    setAddPatient(false);
    setIsLoadingBtn(false);
    getResponePopup(response);

    setAddPatient(false);
    setIsLoadingBtn(false);
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
    // const headers = {
    //   headers: {
    //     "Content-Type": "multipart/form-data",
    //   },
    // };
    setSelectFile(formData);
    const response = await uploadFilesRadiology({ obj: formData });

    // axios.post(
    //   ENDPOINTS.apiEndoint +
    //     `aiservice/ai/upload/radiology
    // `,
    //   formData,
    //   headers
    // );
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
    setErrors({ year: "", emr: "" });
    setEmrType("");
    setInputValue({
      year: "",
      name: "",
      patientId: "",
      processStageId: "",
      patientId: "",
    });
  };

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
    const encodedString = navigate.query;
    // getStorage("TenantAdminPatientsEncodedValue");
    if (encodedString && typeof encodedString === "string") {
      try {
        setParamsFilter("check");
        const decodedParams = JSON.parse(
          atob(encodedString?.replace(/-/g, "+").replace(/_/g, "/"))
        );
        setPageNo(decodedParams?.pageNo ? decodedParams?.pageNo : 0);
        setPaginationFirst(
          decodedParams?.paginationFirst ? decodedParams?.paginationFirst : 0
        );
        setCompletedStartDate(decodedParams?.completedStartDate);
        setCompletedEndDate(decodedParams?.completedEndDate || "");
        SetSelectedOption(decodedParams?.selectedOption || "");
        setSearch(decodedParams?.search || null);
        setSearchVal(decodedParams?.search || null);
        setComputedStartDate(decodedParams?.computedStartDate || "");
        setComputedEndDate(decodedParams?.computedEndDate || "");
        setSelAllocatedBy(decodedParams?.selAllocatedBy || null);
        setSelAllocatedTo(decodedParams?.setSelAllocatedTo || "");
        setSelCreatedBy(decodedParams?.createdBy || null);
        setSelectedDate2s(
          decodedParams?.completedStartDate && [
            dayjs(decodedParams?.completedStartDate),
            dayjs(decodedParams?.completedEndDate),
          ]
        );
        setSelectedDates(
          (decodedParams?.computedStartDate && [
            dayjs(decodedParams?.computedStartDate),
            dayjs(decodedParams?.computedEndDate),
          ]) ||
            []
        );
        setSelectedOrgList(decodedParams?.selectOrgList || "");
        setActiveFilters(decodedParams?.activeFilters || []);
      } catch (error) {
        console.error("Error decoding or parsing query:", error);
      }
    } else {
      console.error("Encoded value not found or not a string:", encodedString);
    }
    // }
  }, []);

  useEffect(() => {
    setParamsFilter("check");
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
      searchVal || "",
      completedStartDate || "",
      completedEndDate || "",
      selAllocatedTo || "",
      selAllocatedBy || "",
      selCreatedBy || "",
      sort,
      (orgId = selectOrgList)
    );
    getFilters({ field: "createdBy" });
  }, [
    pageNo,
    computedStartDate,
    computedEndDate,
    selectedOption,
    searchVal,
    completedStartDate,
    completedEndDate,
    selAllocatedTo,
    selAllocatedBy,
    selCreatedBy,
    sort,
    selectOrgList,
    paramsFilter,
  ]);

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
      <div className={`show `}>
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
                            searchlabel=" Patient ID / Name"
                            search={search}
                            searchVal={searchVal}
                            setSearchVal={setSearchVal}
                            activeTab={"pateints"}
                            // select status
                            selectlabel="Select Status"
                            isSelector={true}
                            setSelectedOption={SetSelectedOption}
                            selectOptions={statusOptions}
                            defaultSelectValue1={"Select Status"}
                            selectDefaultValue={
                              statusOptions?.find(
                                (item) => item?.value === selectedOption
                              )?.label
                            }
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
                            allocatedByOptoons={generateOptionsForNewStore(
                              filteredList?.data?.response
                            )}
                            defaultAllocatedBy={"Select Created By"}
                            setSelAllocatedBy={setSelAllocatedBy}
                            selectorField="CreatedBy"
                            fromTenantPatients={true}
                            // defaultAllocatedBy={"All"}
                            setSelCreatedBy={setSelCreatedBy}
                            addUser={true}
                            addUserForm={addPatientFormId}
                            bullets={bullets}
                            isNextRow={true}
                            btnTitle="Add Patient"
                            atCorner={true}
                            selAllocatedBy={selAllocatedBy}
                            // selectOrg
                            selectlabelOrg="Select Organization"
                            isSelectOrg={true}
                            setSelectedOptionOrg={setSelectedOrgList}
                            selectOptionsOrg={orgAllList}
                            defaultSelectValueOrg={""}
                            selectedValueOrg={selectOrgList}
                            setPageNo={setPageNo}
                            orgValue={selectOrgList}
                            setClear={setClear}
                            clear={clear}
                            selectAll={selectAll}
                            setSelectAll={setSelectAll}
                            activeFilters={activeFilters}
                            setActiveFilters={setActiveFilters}
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
                              page={{
                                pageNo,
                                paginationFirst,
                                computedStartDate,
                                computedEndDate,
                                selectedOption,
                                search,
                                completedStartDate,
                                completedEndDate,
                                selAllocatedTo,
                                selAllocatedBy,
                                selCreatedBy,
                                selectOrgList,
                                activeFilters,
                              }}
                              sortCompleteOrder={sortCompleteOrder}
                              setSortCompleteOrder={setSortCompleteOrder}
                            />
                            <div>
                              <div className="pagination-container">
                                <Paginator
                                  first={
                                    paginationFirst == 0
                                      ? pageNo
                                      : paginationFirst
                                  }
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
          isUpload={true}
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
    response: state.admin.workqueue?.patients?.data,
    organizationList: state?.tenantAdmin?.patients?.allOrganization?.data,
    allPatientList: state?.tenantAdmin?.patients?.allPatients,
    webSocketData: state?.tenantAdmin?.webSocket?.webSocketDetails?.data,
    loading: state?.tenantAdmin?.patients?.allPatientsLoading,
    filteredList: state.admin?.patientAllocate?.filtersList,
  }),
  {
    getAllOrganizationList: tenantAdminAction.getAllOrganizationAction,
    getAllPatients: tenantAdminAction.getAllPatientAction,
    getPatientId: tenantAdminAction.submitPatientId,
    uploadFiles: tenantAdminAction.uploadFiles,
    getFilters: allocationAction.getFiltersList,
    patientDetails: allActions.getPatientDetails,
    uploadFilesRadiology: tenantAdminAction.uploadFilesRadiology,
  }
);
export default enhancer(Patient);
