import React, { useState, useEffect } from "react";
import Header from "../../../jsx/layouts/nav/Header";
import { useSelector, connect } from "react-redux";
import axios from "../../../utility/axiosConfig";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "react-facebook-loading/dist/react-facebook-loading.css";
import { faFileArrowUp } from "@fortawesome/free-solid-svg-icons";
import { Spin, notification } from "antd";
import { Paginator } from "primereact/paginator";
import visitStyles from "../../../styles/visitdata.module.css";
import AddPatientListTable from "../../../components/table/admin/AddPatients/addPatients";
import FileUploading from "../fileprocessing/FileUploading";
import Addpatients from "../fileprocessing/Addpatiens";
import { LoadingOutlined } from "@ant-design/icons";
import HeaderFilters from "../../../components/headerFilters";
import {
  generateOptionsForNewStore,
  validateYear,
} from "../../../components/headerFilters/functions";
import { actions as allActions } from "../../../stores/admin/workqueue";
import { renderSkeleton } from "../../../components/reuseableFunctions";
import { getStorage, setStorage } from "../../../utils/storages";
import { actions as allocationAction } from "../../../stores/admin/patientAllocation";
import { getResponePopup } from "../../../utils/reusable";
import { enc } from "crypto-js/core";
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
    color: "#E69021",
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
  getPatients,
  loader,
  response,
  patientDetails,
  getFilters,
  filteredList,
  getAddPatient,
  getUploadFile,
  getUploadRadiologyFile,
}) => {
  const navigate = useRouter();
  const sideMenu = useSelector((state) => state.sideMenu);
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
  const [tenantId, setTenantId] = useState("");
  const [localOrgId, setLocalOrgId] = useState("");
  const [localUserId, setLocalUserId] = useState("");
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [paginationFirst, setPaginationFirst] = useState(0);
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
  const [searchVal, setSearchVal] = useState("");
  const [sort, setSort] = useState({ sortDir: "", sortField: "" });
  const [errors, setErrors] = useState({ year: "" });

  // useEffect(() => {
  //   if (response?.response?.content?.length>0) {
  //     getAllList(response?.response);
  //   }
  // }, [response]);

  // const getAllList = (info) => {
  //   if (info.content?.length>0) {
  //     var resultMap = [];
  //     var result = info?.content;
  //     console.log(result)
  //     setTotalElements(info?.totalElements);
  //      result?.length>0 && result?.map((res) => {
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
  //     setPatinetListAll(info?.content);

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

  const handleChange = async (e) => {
    const key = e.target.name;
    const value = e.target.value;
    if (e.target.name === "year") {
      const validateYearField = validateYear(e.target.value, setErrors);
      if (validateYearField) {
        setErrors({ year: "" });
        setInputValue({ ...inputValue, [key]: value });
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
    if (form.checkValidity() === true) {
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
    setValidated(true);
  };

  const handleSubmitPatientId = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    inputValuePatientId.allocatedBy = localUserId;
    inputValuePatientId.computing = 0;
    // inputValuePatientId.allocatedUserId = localUserId;

    if (form.checkValidity() === true) {
      try {
        setIsLoadingBtn(true);
        const response = await getAddPatient({ data: inputValuePatientId });
        if (response?.status == "SUCCESS") {
          const data = {
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
          };
          getPatients({ data: data });
          setAddPatientId(false);
          setIsLoadingBtn(false);
          getResponePopup(response);
        } else {
          setIsLoadingBtn(false);
        }
      } catch (Err) {
        getResponePopup(Err);
      }
    }

    setValidated(true);
  };

  const gotoPatientDetails = (data) => {
    patientDetails(data);
    if (data.computing == 2) {
      const controller = new AbortController();
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
          className="btn hegiht10 shadow  sharp me-1 action-btn"
          style={{ background: "#04306f" }}
        >
          {/* <FontAwesomeIcon
            icon={faUpload}
            fontSize={11}
            style={{ color: "#ffff" }}
          /> */}
          <FontAwesomeIcon
            icon={faFileArrowUp}
            className={visitStyles.fontAwesomeIconColor}
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

    // getUploadFile
    // const headers = {
    //   headers: {
    //     "Content-Type": "multipart/form-data",
    //   },
    // };
    setSelectFile(formData);
    const response = await getUploadFile({ data: formData });
    //  await axios.post(
    //   ENDPOINTS.apiEndoint +
    //     `aiservice/ai/upload
    //   `,
    //   formData,
    //   headers
    // );
    if (response?.status === "SUCCESS") {
      // getAllList(response);

      getResponePopup(response);
      const data = {
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
      };
      getPatients({ data: data });
      setAddPatient(false);
      setAddPatient(false);
      setIsLoadingBtn(false);
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
    // const headers = {
    //   headers: {
    //     "Content-Type": "multipart/form-data",
    //   },
    // };
    setSelectFile(formData);
    const response = await getUploadRadiologyFile({ data: formData });
    // await axios.post(
    //   ENDPOINTS.apiEndoint +
    //     `aiservice/ai/upload/radiology
    // `,
    //   formData,
    //   headers
    // );
    if (response?.status == "SUCCESS") {
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

  const onPageChange = (e) => {
    setIsLoading(true);
    setPaginationFirst(e.first);
    setPageNo(e.page);
    setPageSize(e.rows);
    setTableLoading(true);
    // getAllList(response?.response);
  };

  const handleGetCall = async(
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
    sort
  ) => {
    // console.log("getCall", search);
    const data = {
      pageNo,
      computedStartDate,
      computedEndDate,
      selectedOption,
      search: searchVal || "",
      completedStartDate,
      completedEndDate,
      selAllocatedTo,
      selAllocatedBy,
      selCreatedBy,
      sort,
    };
    const response=await getPatients({ data: data });
    if(response.status=="SUCCESS"){
      console.log(response?.response?.content,"response")
    }
  };


  useEffect(() => {
    var tenId = getStorage("tenantId");
    var uId = getStorage("userId");
    var orgId = getStorage("orgId");
    setTenantId(tenId);
    setLocalOrgId(orgId);
    setLocalUserId(uId);
    handleGetCall(
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
      sort
    );
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
    searchVal
  ]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const query = navigate?.query;
      const encodedString = query?.encodedValue;
      if (encodedString && typeof encodedString === "string") {
        try {
          const decodedParams = JSON.parse(
            atob(encodedString?.replace(/-/g, "+").replace(/_/g, "/"))
          );
          // console.log(decodedParams);
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
          setSelAllocatedBy(decodedParams?.selAllocatedBy || "");
          setSelAllocatedTo(decodedParams?.setSelAllocatedTo || "");
          setSelCreatedBy(decodedParams?.createdBy || "");
          setSelectedDates(
            decodedParams?.completedStartDate && [
              dayjs(decodedParams?.completedStartDate),
              dayjs(decodedParams?.completedEndDate),
            ]
          );
          setSelectedDate2s(
            (decodedParams?.computedStartDate && [
              dayjs(decodedParams?.computedStartDate),
              dayjs(decodedParams?.computedEndDate),
            ]) ||
              []
          );
        } catch (error) {
          console.error("Error decoding or parsing query:", error);
        }
      } else {
        console.error(
          "Encoded value not found or not a string:",
          encodedString
        );
      }
    }
  }, []);
  useEffect(() => {
    getFilters({ field: "createdBy" });
  }, []);
  // console.log("search", response?.response?.content);
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
                            searchlabel="Search By Patient ID / Name"
                            search={search}
                            searchVal={searchVal}
                            setSearchVal={setSearchVal}
                            activeTab={"pateints"}
                            // select status
                            selectlabel="Status"
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
                            isRangePickerUsers={true}
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
                            setSelAllocatedBy={setSelAllocatedBy}
                            selectorField="CreatedBy"
                            // defaultAllocatedBy={"All"}
                            defaultAllocatedBy={"Select CreatedBy"}
                            setSelCreatedBy={setSelCreatedBy}
                            addUser={true}
                            addUserForm={addPatientFormId}
                            bullets={bullets}
                            isNextRow={true}
                            btnTitle="Add Patient"
                            atCorner={true}
                            setPageNo={setPageNo}
                          />
                        </div>
                      </div>

                      <div
                        id="task-tbl_wrapper"
                        className="dataTables_wrapper no-footer"
                      >
                        {loader ? (
                          renderSkeleton()
                        ) : (
                          <>
                            <AddPatientListTable
                              patinetListAll={response?.response?.content}
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
                                    response?.response?.totalElements
                                  }
                                  onPageChange={onPageChange}
                                />
                                <div className="total-pages">
                                  Total count:{" "}
                                  {response?.response?.totalElements}
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
        />
        <Addpatients
          addPatientId={addPatientId}
          setAddPatientId={setAddPatientId}
          validated={validated}
          handleSubmitPatientId={handleSubmitPatientId}
          handleChangePatientId={handleChangePatientId}
          isLoadingBtn={isLoadingBtn}
        />
      </div>
    </>
  );
};
const connector = connect(
  (state) => ({
    response: state.admin.workqueue?.patients?.data,
    loader: state.admin?.workqueue?.patientsLoading,
    filteredList: state.admin.patientAllocate?.filtersList,
  }),
  {
    getPatients: allActions.patientsAction,
    patientDetails: allActions.getPatientDetails,
    getFilters: allocationAction.getFiltersList,
    getAddPatient: allActions.getAddPatient,
    getUploadFile: allActions.getUploadFile,
    getUploadRadiologyFile: allActions.getUploadRadiologyFile,
  }
);
export default connector(Patient);
