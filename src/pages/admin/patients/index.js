import React, { useState, useEffect } from "react";
import { Button, Spinner } from "react-bootstrap";
import Select from "react-select";

import Header from "../../../jsx/layouts/nav/Header";
import { useSelector } from "react-redux";
import axios from "../../../utility/axiosConfig";
import ENDPOINTS from "../../../utility/enpoints";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "react-facebook-loading/dist/react-facebook-loading.css";
import { faUpload, faSearch } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { patientDetails } from "../../../store/actions/AuthActions";
import { DatePicker, Spin, notification } from "antd";
import { InputText } from "primereact/inputtext";
import { Paginator } from "primereact/paginator";
import Footer from "../../../jsx/layouts/Footer";
import visitStyles from "../../../styles/visitdata.module.css";
import AddPatientListTable from "../../../components/table/admin/AddPatients/addPatients";
import { getMessagesList } from "../../../store/actions/adminAction/fileProcessingActions";
import { getPatients } from "../../../store/actions/adminAction/patientsActions";
import FileUploading from "../file-processing/FileUploading";
import Addpatients from "../file-processing/Addpatiens";
import SpinnerDots from "../../../components/spinner";
import { LoadingOutlined } from "@ant-design/icons";
import { eventStreming } from "../../../components/table/admin/FileProcessing/FileProcessing";

export default function Patient() {
  const navigate = useRouter();
  const [validated, setValidated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingBtn, setIsLoadingBtn] = useState(true);
  const [addPatient, setAddPatient] = useState(false);
  const [addPatientId, setAddPatientId] = useState(false);
  const [selectFile, setSelectFile] = useState(null);
  const [selectFileRadiology, setSelectFileRadiology] = useState(null);
  const [dates, setDates] = useState(null);
  const [compledtedDate, setCompletedDate] = useState(null);
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
  const { RangePicker } = DatePicker;
  const dispatch = useDispatch();
  const sideMenu = useSelector((state) => state.sideMenu);
  const response = useSelector((state) => state.adminList.patients);

  const statusOptions = [
    { label: "ALL", value: "ALL" },
    { label: "PROCESSING", value: "PROCESSING", status: 1 },
    { label: "COMPUTED", value: "COMPUTED", status: 2 },
    { label: "NOT COMPUTED", value: "NOT COMPUTED", status: 0 },
  ];

  useEffect(() => {
    var tenId = localStorage.getItem("tenantId");
    var uId = localStorage.getItem("userId");
    var orgId = localStorage.getItem("orgId");
    // var resoureUrl = `dbservice/patient/getbyuser?userId=${uId}&page=${pageNo}&size=${pageSize}`;
    setTenantId(tenId);
    setLocalOrgId(orgId);
    setLocalUserId(uId);
    // setIsLoading(false);
    dispatch(getPatients(pageNo, "", "", selectedOption, search));
  }, [pageNo, pageSize, search, selectedOption]);

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
        });
      });
      var newArray = [];
      newArray = [...patinetListAll, ...resultMap];
      setPatinetListAll(resultMap);

      setIsLoading(false);
      setTableLoading(false);
      //     setTimeout(() => {
      //     subscribe(resultMap);
      // }, 3000);
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

  const onChangeFile = (e) => {
    setSelectFile(e[0]);
  };

  const handleChange = async (e) => {
    const key = e.target.name;
    const value = e.target.value;
    setInputValue({ ...inputValue, [key]: value });
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
      setIsLoadingBtn(true);
      const response = await axios.post(
        ENDPOINTS.apiEndointFileUploadHcc + `dbservice/patient`,
        inputValuePatientId
      );
      if (response?.status == 200) {
        if (response.data.message == "patient Already Present") {
          setIsLoadingBtn(false);
          notification.warning({
            message: "Patient Id Already Present",
            duration: 1,
          });
        } else {
          notification.success({
            message: "Patient Id Created Successfully!",
            duration: 1,
          });
          setAddPatientId(false);
          setIsLoadingBtn(false);
        }
      } else {
        setIsLoadingBtn(false);
      }
      // setAddPatientId(false);
      getAllList(response?.response);
    }

    setValidated(true);
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
        : "Not Computed";
    // console.log(isFinished)
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
                : "#F1DEDA",
            color:
              rowStatus === "Computed"
                ? " #285563"
                : rowStatus === "Processing"
                ? "#452b90"
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
          className="btn hegiht10 btn-primary shadow  sharp me-1 action-btn"
        >
          <FontAwesomeIcon icon={faUpload} fontSize={11} />
        </button>
      </div>
    );
  };
  const getNameSearch = async (searchtext) => {
    setIsLoading(true);
    setSearch(searchtext);
    // dispatch(getSearchPatients(0,searchtext));
    // if (searchtext?.length > 0) {
    //   var resoureUrl = `dbservice/patient/compute/search?searchtext=${searchtext}&pageno=${0}&pagesize=${12}`;
    //   const response = await axios.get(ENDPOINTS.apiEndoint + resoureUrl);
    //   if (response.data) {
    //     var resultMap = [];
    //     var result = response.data.response.content;
    //     setTotalElements(response.data.response.totalElements);

    //     result.map((res) => {
    //       resultMap.push({
    //         patientId: res.patientId,
    //         patientName: res.patientName,
    //         fileName: res.fileName,
    //         computing: res.computing,
    //         createdAt: res.createdAt,
    //         lastModifiedDate: res.lastModifiedDate,
    //         dueDate: res.dueDate,
    //         allocatedBy: res.allocatedBy,
    //         allocatedOn: res.allocatedOn,
    //         priority: res.priority,
    //         processedStatus: res.processedStatus,
    //         createdAt: res.createdAt,
    //         processedDate: res.processedDate,
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
    // } else {
    //   getAllList(response?.response);
    // }
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
    const headers = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    setSelectFile(formData);
    const response = await axios.post(
      ENDPOINTS.apiEndointFileUploadHcc +
        `aiservice/ai/upload
      `,
      formData,
      headers
    );
    if (response?.status === 200) {
      getAllList(response);

      notification.success({
        message: "Patient File Upload Successfully!",
      });
      // navigate.push("/admin/file-processing");
      dispatch(getPatients(pageNo, pageSize));
      eventStreming(
        ENDPOINTS,
        setParsedData,
        pageNo,
        pageSize,
        getPatients,
        dispatch
      );
      setAddPatient(false);
      setAddPatient(false);
      setIsLoadingBtn(false);
      // dispatch(getMessagesList())
    } else {
      setIsLoadingBtn(false);
    }
    setAddPatient(false);
    setIsLoadingBtn(false);
    getAllList(localUserId);
  };
  const submitRadiology = async () => {
    const formData = new FormData();
    formData.append("file", selectFileRadiology);
    formData.append("orgid", localOrgId);
    formData.append("tenantid", tenantId);
    formData.append("userid", localUserId);
    formData.append("patientid", inputValue.patientId);
    formData.append("patientname", inputValue.name);
    const headers = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    setSelectFile(formData);
    const response = await axios.post(
      ENDPOINTS.apiEndointFileUploadHcc +
        `aiservice/ai/upload/radiology
    `,
      formData,
      headers
    );
    if (response?.status == 202) {
      getAllList(localUserId, pageNo, pageSize);
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
                          <div className="row filter-contain">
                            <div className="col-xl-2">
                              <label>Search by Name</label>
                              <div class="form-group has-search">
                                <FontAwesomeIcon
                                  className="fa fa-search form-control-feedback"
                                  icon={faSearch}
                                />
                                <InputText
                                  type="text"
                                  onChange={(e) =>
                                    getNameSearch(e.target.value)
                                  }
                                  className="form-control new-form-control"
                                  placeholder="Search"
                                />
                              </div>
                            </div>
                            <div className="col-xl-2">
                              <label>Select Status</label>
                              <div class="form-group has-search">
                                <Select
                                  onChange={(value) => {
                                    console.log(value);
                                    SetSelectedOption(value?.status);
                                  }}
                                  options={statusOptions}
                                  className="custom-react-select"
                                  isSearchable={false}
                                  placeholder={"Select Status"}
                                />
                              </div>
                            </div>
                            <div className="col-xl-2">
                              <label>Due Date</label>
                              <div>
                                <RangePicker
                                  format="MM-DD-YYYY"
                                  onChange={(dates, dateStrings) => {
                                    handleDatePickerChange(dateStrings);
                                  }}
                                />
                              </div>
                            </div>

                            <div className="col-xl-2">
                              <label>Completed Date</label>
                              <div>
                                <RangePicker
                                  format="MM-DD-YYYY"
                                  onChange={(dates, dateStrings) => {
                                    handleDatePickerChangeProcesseDate(
                                      dateStrings
                                    );
                                  }}
                                />
                              </div>
                            </div>

                            <div className="col-xl-4">
                              <label></label>
                              <div
                                className={visitStyles.flags_patientsList}
                                style={{ marginTop: "15px" }}
                              >
                                <div className={visitStyles.flags}>
                                  <span
                                    className={visitStyles.completed}
                                    style={{ background: "#3a9b94 !important" }}
                                  ></span>
                                  <span className={visitStyles.flagCodes}>
                                    Completed
                                  </span>
                                </div>
                                <div className={visitStyles.flags}>
                                  <span className={visitStyles.pending}></span>
                                  <span className={visitStyles.flagCodes}>
                                    Pending
                                  </span>
                                </div>
                                <div className={visitStyles.flags}>
                                  <span className={visitStyles.hold}></span>
                                  <span className={visitStyles.flagCodes}>
                                    Hold
                                  </span>
                                </div>
                                <div className={visitStyles.flags}>
                                  <span className={visitStyles.declined}></span>
                                  <span className={visitStyles.flagCodes}>
                                    Declined
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
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
                            <AddPatientListTable
                              patinetListAll={patinetListAll}
                              actionBodyTemplate={actionBodyTemplate}
                              statusBodyTemplate={processstatusBodyTemplate}
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
        <FileUploading
          addPatient={addPatient}
          setAddPatient={setAddPatient}
          validated={validated}
          handleSubmit={handleSubmit}
          inputValue={inputValue}
          handleChange={handleChange}
          isLoadingBtn={isLoadingBtn}
          onChangeFile={onChangeFile}
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
}
