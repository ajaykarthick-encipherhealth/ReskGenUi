import React, { useState, useEffect } from "react";
import Header from "../../../jsx/layouts/nav/Header";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "react-facebook-loading/dist/react-facebook-loading.css";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { Button, Form, Spin, notification } from "antd";
import { Paginator } from "primereact/paginator";
import visitStyles from "../../../styles/visitdata.module.css";
import FileUploading from "../fileprocessing/FileUploading";
import Addpatients from "../fileprocessing/Addpatiens";
import { LoadingOutlined, PlusCircleFilled } from "@ant-design/icons";
import {
  generateOptionsForNewStore,
  validateYear,
} from "../../../components/headerFilters/functions";
import { actions as tenantAdminAction } from "../../../stores/tenantAdmin/patients";
import { connect } from "react-redux";
import AddPatientListTable from "../../../components/table/tenantTable/AddPatients/addPatients";
import { getStorage, setStorage } from "../../../utils/storages";
import { getResponePopup } from "../../../utils/reusable";
import { actions as allocationAction } from "../../../stores/admin/patientAllocation";
import { actions as allActions } from "../../../stores/admin/workqueue";
import TableSkeleton from "../../../components/skeleton/table";
import ReusableFilters from "../../../components/reusableFilters";

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
export const flagOptions = [
  { header: "DOS Count", label: "INVALID DOC", value: "IN_VALID_DOC", id: 1 },
  {
    header: "Televist Count",
    label: "AUDIO VISIT",
    value: "AUDIO_VISIT",
    id: 2,
  },
  {
    header: "Out of Scope",
    label: "OUT OF SCOPE",
    value: "OUT_OF_SCOPE",
    id: 3,
  },
  {
    header: "Invalid Credentails",
    label: "INVALID CREDENTIALS",
    value: "PROVIDER_UNAUTHORIZED",
    id: 4,
  },
  {
    header: "Improper Data",
    label: "IMPROPER DATA",
    value: "IMPROPER_DATA",
    id: 5,
  },
  {
    header: "Multiple Patient Found",
    label: "MULTIPLE PATIENT FOUND",
    value: "MULTIPLE_PATIENT_FOUND",
    id: 6,
  },
  {
    header: "MRN ID Mismatch",
    label: "MRN ID MISMATCH",
    value: "MRN_ID_MISMATCH",
    id: 7,
  },
  {
    header: "Patient DOB Mismatch",
    label: "PATIENT DOB MISMATCH",
    value: "PATIENT_DOB_MISMATCH",
    id: 8,
  },
  {
    header: "Illegial Format",
    label: "ILLEGAL FORMAT",
    value: "ILLEGAL_FORMAT",
    id: 9,
  },
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
  getRetreggerPatient,
  patientDetails,
  getFilters,
  filteredList,
  routedData,
  getAllBatchList,
  batchList,
}) => {
  const commonFilterItems = [
    {
      id: "00001",
      title: "Search",
      type: "search",
      value: null,
      placeholder: "Search",
      header: "Patient ID / Name",
      active: true,
    },
    {
      id: "00002",
      title: "status",
      type: "select",
      value: null,
      placeholder: "Status",
      options: statusOptions,
      active: false,
    },
    {
      id: "00003",
      title: "organization",
      type: "select",
      value: null,
      placeholder: "Organization",
      options: organizationList?.response?.map((item) => ({
        value: item?.id,
        label: `${item?.name}`,
      })),
      active: false,
    },
    {
      id: "00004",
      title: "createdDateRange",
      type: "rangePicker",
      value: null,
      placeholder: "Created Date Range",
      pickerType: "year",
      active: false,
    },
    {
      id: "00005",
      title: "createdBy",
      type: "select",
      value: null,
      placeholder: "Created By",
      options: generateOptionsForNewStore(filteredList?.data?.response),
      active: false,
    },
    {
      id: "00006",
      title: "computedDate",
      type: "rangePicker",
      value: null,
      placeholder: "Computed  Date",
      pickerType: "year",
      active: false,
    },
    {
      id: "00007",
      title: "Batch",
      type: "select",
      value: null,
      showSearch: true,
      placeholder: "Batch",
      options: batchList?.response?.map((item) => ({
        value: item?.id,
        label: `${item?.name}`,
      })),
      active: false,
    },
    {
      id: "00008",
      title: "flag",
      type: "select",
      value: null,
      showSearch: true,
      placeholder: "Flag",
      options: flagOptions,
      active: false,
    },
  ];
  const [sort, setSort] = useState({
    computedDate: {
      sortDir: "DESC",
      sortField: "computedDate",
    },
    createdDate: {
      sortDir: "DESC",
      sortField: "createdDate",
    },
    sort: { sortDir: "DESC", sortField: "" },
  });
  const [form] = Form.useForm();
  const navigate = useRouter();
  const [validated, setValidated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingBtn, setIsLoadingBtn] = useState(true);
  const [addPatient, setAddPatient] = useState(false);
  const [addPatientId, setAddPatientId] = useState(false);
  const [selectFile, setSelectFile] = useState(null);
  const [selectFileRadiology, setSelectFileRadiology] = useState(null);
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
  const [paginationFirst, setPaginationFirst] = useState(0);
  const [parsedData, setParsedData] = useState([]);
  const [emrType, setEmrType] = useState("");
  const [errors, setErrors] = useState({ year: "", emr: "" });
  const [paramsFilter, setParamsFilter] = useState(null);
  const [clear, setClear] = useState(false);
  const [activeFilters, setActiveFilters] = useState(commonFilterItems);
  const [searchText, setSearchText] = useState(null);
  const [selectedOption, setSelectedOption] = useState({});
  const [selectedDateRanges, setSelectedDateRanges] = useState({});
  const [selectedDates, setSelectedDates] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [statusUpdateWebSocket, setStatusUpdateWebSocket] = useState();

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
  const orgAllList = organizationList?.response?.map((item) => ({
    value: item?.id,
    label: `${item?.name}`,
  }));
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

  const handleSubmitPatientId = async (formData, form) => {
    formData.allocatedBy = localUserId;
    formData.computing = 0;
    formData.patientId = formData.patientId.trim();
    try {
      setIsLoadingBtn(true);
      const response = await getPatientId({ obj: formData });
      if (response?.status === "SUCCESS") {
        getAllPatients({
          pageNo,
          selectedOption,
          searchText,
          selectedDateRanges,
          sort: sort?.sort,
        });
        setPageNo(0);
        setAddPatientId(false);
        setIsLoadingBtn(false);
        getResponePopup(response);
        setIsLoadingBtn(false);
        form.resetFields();
        setValidated(true);
      } else {
        setValidated(false);
        getResponePopup(response);
      }
    } catch (Err) {
      getResponePopup(Err?.response);
    }
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
      <div className="d-flex justify-content-center">
        <button
          id="click-upload"
          nam="click-upload"
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
    const formData = new FormData();
    formData.append("file", selectFile);
    formData.append("dos", inputValue?.year);
    formData.append("orgid", localOrgId);
    formData.append("tenantid", tenantId);
    formData.append("userid", localUserId);
    formData.append("patientid", inputValue.patientId);
    formData.append("patientname", inputValue.name);
    formData.append("emrtype", emrType);
    const response = await uploadFiles({ obj: formData });
    if (response?.status === "SUCCESS") {
      form.resetFields();
      setEmrType("");
      setInputValue({});
      getAllPatients({
        pageNo,
        selectedOption,
        searchText,
        selectedDateRanges,
        sort: sort?.sort,
      });
    }
    if (response?.result == "SUCCESS") {
      setAddPatient(false);
      setSelectFile(formData);
      getAllPatients({
        pageNo,
        selectedOption,
        searchText,
        selectedDateRanges,
        sort: sort?.sort,
      });
      setPageNo(0);
      handleClose();
      setIsLoadingBtn(false);
      getResponePopup(response);
      setAddPatient(false);
    } else {
      getResponePopup(response);
      setAddPatient(false);
    }
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
    setSelectFile(formData);
    const response = await uploadFilesRadiology({ obj: formData });
    if (response?.status == 202) {
      setAddPatient(false);
      setIsLoadingBtn(false);
    } else {
      setIsLoadingBtn(false);
    }
    setAddPatient(false);
    setSelectFileRadiology(null);
  };
  const getRetregger = async (data) => {
    try {
      const res = await getRetreggerPatient({ patientId: data.patientId });
      if (res.status == "SUCCESS") {
        getResponePopup(res);
        getAllPatients({
          pageNo,
          selectedOption,
          searchText,
          selectedDateRanges,
          sort: sort?.sort,
        });
      }
    } catch (error) {}
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
    setPaginationFirst(e.first);
    setPageNo(e.page);
    setPageNumber(e.page);
  };

  useEffect(() => {
    if (routedData) {
      const {
        pageNo,
        selectedDates,
        selectedDateRanges,
        selectedOption,
        searchText,
        activeFilters,
        pageNumber,
        paginationFirst,
        sort,
      } = routedData;
      setPageNo(pageNo ? pageNo : 0);
      setSearchText(searchText);
      setSelectedDateRanges(selectedDateRanges);
      setSelectedOption(selectedOption);
      setSelectedDates(selectedDates);
      setActiveFilters(activeFilters);
      setPageNumber(pageNumber);
      setPaginationFirst(paginationFirst);
      setSort(sort);
    }
  }, [routedData]);

  useEffect(() => {
    setParamsFilter("check");
    let tenId = getStorage("tenantId");
    let uId = getStorage("userId");
    let orgId = getStorage("orgId");
    setTenantId(tenId);
    setLocalOrgId(orgId);
    setLocalUserId(uId);
    if (paramsFilter === "check") {
      getAllPatients({
        pageNo,
        selectedOption,
        searchText,
        selectedDateRanges,
        sort: sort?.sort,
      });
    }
  }, [
    pageNo,
    selectedOption,
    searchText,
    selectedDateRanges,
    sort,
    paramsFilter,
  ]);
  useEffect(() => {
    getAllBatchList();
    getAllOrganizationList();
    getFilters({ field: "createdBy" });
  }, []);
  const opt = {
    createdBy: generateOptionsForNewStore(filteredList?.data?.response),
    auditAllocatedBy: generateOptionsForNewStore(filteredList?.data?.response),
    organization: organizationList?.response?.map((item) => ({
      value: item?.id,
      label: `${item?.name}`,
    })),
    Batch: batchList?.response?.map((item) => ({
      value: item?.id,
      label: `${item?.name}`,
    })),
    status: statusOptions,
    flag: flagOptions,
  };
  useEffect(() => {
    if (webSocketData && webSocketData?.webSocketType == "PATIENT_COMPUTE") {
      const patientData =
        allPatientList?.data?.response?.patientDtoList?.content;
      let foundItem = patientData?.find(
        (x) => x.patientId == webSocketData.patientId
      );
      if (foundItem) {
        foundItem.computing = webSocketData?.computing;
        if (webSocketData?.computedDate) {
          foundItem.computedDate = webSocketData?.computedDate;
        }
      }
      setStatusUpdateWebSocket(patientData);
    } else {
      setStatusUpdateWebSocket(
        allPatientList?.data?.response?.patientDtoList?.content
      );
    }
  }, [webSocketData, allPatientList]);

  return (
    <div className={`show `}>
      <Header />
      <div className="content-body">
        <div className="container-fluid table-responsive active-projects task-table">
          <section className="d-flex">
            <div style={{ width: "90%" }}>
              <ReusableFilters
                showFilter={true}
                setActiveFilters={setActiveFilters}
                setSearchText={setSearchText}
                searchText={searchText}
                setSelectedOption={setSelectedOption}
                selectedOption={selectedOption}
                setSelectedDateRanges={setSelectedDateRanges}
                selectedDateRanges={selectedDateRanges}
                FilterItems={activeFilters}
                selectedDates={selectedDates}
                setSelectedDates={setSelectedDates}
                activeFilters={activeFilters}
                setClear={setClear}
                clear={clear}
                addUserForm={addPatientFormId}
                addUser={false}
                btnTitle={"Add Patient"}
                form={form}
                setPageNo={setPageNo}
                opt={opt}
              />
            </div>
            <div
              id="addPatient-btn"
              name="addPatient-btn"
              className="d-flex justify-content-center align-items-center mt-3"
              style={{ width: "10%" }}
            >
              <Button
                data-testid="add-patient"
                name="add-patient"
                onClick={() => {
                  if (form) {
                    form.resetFields();
                  }
                  addPatientFormId();
                }}
                style={{
                  background: "#04306f",
                  color: "#fff",
                  width: "100%",
                  fontSize: "12px",
                }}
                className="btn btn-sm w-full text-ellipsis"
              >
                <PlusCircleFilled /> Add Patient
              </Button>
            </div>
          </section>
          <div id="task-tbl_wrapper" className="dataTables_wrapper no-footer">
            {loading ? (
              <TableSkeleton />
            ) : (
              <div className="mt-2">
                <AddPatientListTable
                  getRetregger={getRetregger}
                  bullets={bullets}
                  patinetListAll={statusUpdateWebSocket}
                  actionBodyTemplate={actionBodyTemplate}
                  statusBodyTemplate={processstatusBodyTemplate}
                  gotoPatientDetails={gotoPatientDetails}
                  patientDetails={patientDetails}
                  setSort={setSort}
                  sort={sort}
                  page={{
                    pageNo,
                    selectedDates,
                    paginationFirst,
                    sort,
                    selectedDates,
                    activeFilters,
                    searchText,
                    selectedOption,
                    selectedDateRanges,
                    pageNumber,
                  }}
                />
                <div>
                  <div className="pagination-container">
                    <Paginator
                      id="patients-paginator"
                      name="patients-paginator"
                      first={pageNo === 0 ? 0 : paginationFirst}
                      rows={15}
                      totalRecords={
                        allPatientList?.data?.response?.patientDtoList
                          ?.totalElements
                      }
                      onPageChange={onPageChange}
                    />
                    <div className="total-pages">
                      Total count:{" "}
                      {
                        allPatientList?.data?.response?.patientDtoList
                          ?.totalElements
                      }
                    </div>
                  </div>
                </div>
              </div>
            )}
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
  );
};

const enhancer = connect(
  (state) => ({
    response: state.admin.workqueue?.patients?.data,
    organizationList: state?.tenantAdmin?.patients?.allOrganization?.data,
    batchList: state?.tenantAdmin?.patients?.allBatch?.data,
    allPatientList: state?.tenantAdmin?.patients?.allPatients,
    webSocketData: state?.tenantAdmin?.webSocket?.webSocketDetails?.data,
    loading: state?.tenantAdmin?.patients?.allPatientsLoading,
    filteredList: state.admin?.patientAllocate?.filtersList,
    routedData: state.tenantAdmin?.patientSync?.routedData,
  }),
  {
    getAllOrganizationList: tenantAdminAction.getAllOrganizationAction,
    getAllBatchList: tenantAdminAction.getAllBatchAction,
    getAllPatients: tenantAdminAction.getAllPatientAction,
    getPatientId: tenantAdminAction.submitPatientId,
    uploadFiles: tenantAdminAction.uploadFiles,
    getFilters: allocationAction.getFiltersList,
    patientDetails: allActions.getPatientDetails,
    uploadFilesRadiology: tenantAdminAction.uploadFilesRadiology,
    getRetreggerPatient: tenantAdminAction.getRetreggerPatient,
  }
);
export default enhancer(Patient);
