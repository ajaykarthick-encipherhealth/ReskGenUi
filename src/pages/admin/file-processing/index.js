import React, { useState, useEffect } from "react";
import { Button, Spinner } from "react-bootstrap";
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
import { notification } from "antd";
import { InputText } from "primereact/inputtext";
import { Paginator } from "primereact/paginator";
import Footer from "../../../jsx/layouts/Footer";
import visitStyles from "../../../styles/visitdata.module.css";
import FileProcessingTable from "../../../components/table/admin/FileProcessing/FileProcessing";
import FileUploading from "./FileUploading";
import Addpatients from "./Addpatiens";
import SpinnerDots from "../../../components/spinner";
import { getPatients } from "../../../store/actions/adminAction/patientsActions";

export default function Patient() {
  const [validated, setValidated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingBtn, setIsLoadingBtn] = useState(false);
  const [addPatient, setAddPatient] = useState(false);
  const [addPatientId, setAddPatientId] = useState(false);
  const [selectFile, setSelectFile] = useState(null);
  const [selectFileRadiology, setSelectFileRadiology] = useState(null);
  const [inputValue, setInputValue] = useState({
    year: "",
    name: "",
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

  const dispatch = useDispatch();
  const sideMenu = useSelector((state) => state.sideMenu);
  const navigate = useRouter();
  useEffect(() => {
    var tenId = localStorage.getItem("tenantId");
    var uId = localStorage.getItem("userId");
    var orgId = localStorage.getItem("orgId");
    setTenantId(tenId);
    setLocalOrgId(orgId);
    setLocalUserId(uId);
    getAllList(uId, pageNo, pageSize);
  }, []);

  const getAllList = async (uId, pageNo, pageSize) => {
    var resoureUrl = `dbservice/patient/getbyuser?userId=${uId}&page=${pageNo}&size=${pageSize}`;
    const response = await axios.get(ENDPOINTS.apiEndoint + resoureUrl);
    if (response.data) {
      var resultMap = [];
      var result = response?.data?.response?.content;
      setTotalElements(response?.data?.response?.totalElements);

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
        });
      });
      var newArray = [];
      newArray = [...patinetListAll, ...resultMap];
      setPatinetListAll(resultMap);
      setIsLoading(false);
      setTableLoading(false);
    }
  };

  const getNameSearch = async (searchtext) => {
    setIsLoading(true);
    if (searchtext) {
      var resoureUrl = `dbservice/patient/compute/search?searchtext=${searchtext}&pageno=${0}&pagesize=${12}`;
      const response = await axios.get(ENDPOINTS.apiEndoint + resoureUrl);
      if (response.data) {
        var resultMap = [];
        var result = response.data?.response?.content;
        setTotalElements(response.data?.response?.totalElements);

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
            createdAt: res.createdAt,
            processedDate: res.processedDate,
          });
        });
        var newArray = [];
        newArray = [...patinetListAll, ...resultMap];
        setPatinetListAll(resultMap);
        setIsLoading(false);
        setTableLoading(false);
      }
    } else {
      getAllList(localUserId, pageNo, pageSize);
    }
  };

  const addPatientFormId = () => {
    setValidated(false);
    setAddPatientId(true);
  };

  const addPatientFile = (data) => {
    inputValue.patientId = data.patientId;
    inputValue.name = data.patientName;
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

  const handleSubmit = (event) => {
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
    inputValuePatientId.patientAllocated = localUserId;
    inputValuePatientId.computing = 0;
    inputValuePatientId.allocatedUserId = localUserId;

    if (form.checkValidity() === true) {
      setIsLoadingBtn(true);
      const response = await axios.post(
        ENDPOINTS.apiEndointFileUploadHcc + `dbservice/patient`,
        inputValuePatientId
      );
      if (response?.status === 200) {
        dispatch(getPatients(0));
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
      getAllList(localUserId, pageNo, pageSize);
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
            <span className={`badge notComputed-text`}>Not Computed</span>
          </div>
        );
      case "COMPUTED":
        return (
          <div className="patient-status">
            <span className={`badge computed-text`}>Computed</span>
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

  const submitPatientFile = async () => {
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
    if (response?.status == 202) {
      getAllList(localUserId, pageNo, pageSize);

      notification.success({
        message: "Patient File Upload Successfully!",
      });
      setAddPatient(false);
      setIsLoadingBtn(false);
    } else {
      setIsLoadingBtn(false);
    }
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
    getAllList(localUserId, e.page, e.rows);
  };

  const rowData = useSelector((state) => state.adminPatient.rowDetails);

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
                        <div className="row filter-contain">
                          {/* <div className="col-xl-2">
                            <label>Search by Name or ID</label>
                            <div class="form-group has-search">
                              <FontAwesomeIcon
                                className="fa fa-search form-control-feedback"
                                icon={faSearch}
                              />
                              <InputText
                                type="text"
                                onChange={(e) => getNameSearch(e.target.value)}
                                className="form-control new-form-control"
                                placeholder="Search"
                              />
                            </div>
                          </div> */}

                          {/* <div className="col-xl-10">
                            <Button
                              onClick={addPatientFormId}
                              className={`btn btn-primary btn-sm ms-2 flr ${visitStyles.addPatientIdBtn}`}
                            >
                              + Add Patient Id
                            </Button>
                          </div> */}
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
                            <FileProcessingTable
                              patinetListAll={patinetListAll}
                              actionBodyTemplate={actionBodyTemplate}
                              statusBodyTemplate={processstatusBodyTemplate}
                              gotoPatientDetails={gotoPatientDetails}
                              patientDetails={patientDetails}
                            />
                            {/* <div>
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
                            </div> */}

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
