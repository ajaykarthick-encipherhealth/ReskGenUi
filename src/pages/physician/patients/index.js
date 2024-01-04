import React, { useState, useEffect } from "react";
import { Button, Spinner } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Select from "react-select";
import Header from "../../../jsx/layouts/nav/Header";
import { useSelector } from "react-redux";
import { Offcanvas } from "react-bootstrap";
import axios from "../../../utility/axiosConfig";
import ENDPOINTS from "../../../utility/enpoints";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "react-facebook-loading/dist/react-facebook-loading.css";
import { faUpload, faSearch } from "@fortawesome/free-solid-svg-icons";
import { DatePicker } from "antd";
import { useDispatch } from "react-redux";
import { patientDetails } from "../../../store/actions/AuthActions";
import { notification } from "antd";
import { InputText } from "primereact/inputtext";
import moment from "moment";
import { Paginator } from "primereact/paginator";
import PatientTable from "../../../components/table/PatientList/patientList";
import dayjs from "dayjs";
import Image from "next/image";
import calender from "../../../images/dashboard/calender.png";
import LoadingSpinner from "../../../components/spinner";
import Footer from "../../../jsx/layouts/Footer";
import visitStyles from "../../../styles/visitdata.module.css";

export default function Patient() {
  const dispatch = useDispatch();
  const sideMenu = useSelector((state) => state.sideMenu);
  const navigate = useRouter();
  const [validated, setValidated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingBtn, setIsLoadingBtn] = useState(false);
  const [addPatient, setAddPatient] = useState(false);
  const [addPatientId, setAddPatientId] = useState(false);
  const [selectFile, setSelectFile] = useState(null);
  const [selectFileRadiology, setSelectFileRadiology] = useState(null);
  const [dates, setDates] = useState(null);
  const [compledtedDate, setCompletedDate] = useState(null);
  const { RangePicker } = DatePicker;
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
  const [modalVisible, setModalVisible] = useState(false);
  const [dueDateStart, setDueDateStart] = useState(null);
  const [dueDateEnd, setDueDateEnd] = useState(null);
  const [processedStart, setProcessedStart] = useState(null);
  const [processedEnd, setProcessedEnd] = useState(null);
  const [statusSelectedValue, setStausSelectedValue] = useState(null);

  const filteratedDashboardData = useSelector(
    (state) => state.patients.filteredList
  );
  const dayDateFormated = filteratedDashboardData?.date
    ? dayjs(filteratedDashboardData?.date).format("MM-DD-YYYY")
    : dayjs(filteratedDashboardData?.dayDate).format("MM-DD-YYYY");
  const [defaultStartDate, setDefaultStartDate] = useState(
    dayjs(dayDateFormated).format("MM-DD-YYYY")
  );
  const [defaultEndDate, setDefaultEndDate] = useState(
    dayjs(dayDateFormated).format("MM-DD-YYYY")
  );

  useEffect(() => {
    setDefaultStartDate(dayjs(dayDateFormated).format("MM-DD-YYYY"));
    setDefaultEndDate(dayjs(dayDateFormated).format("MM-DD-YYYY"));
  }, [dayDateFormated]);

  useEffect(() => {
    var tenId = localStorage.getItem("tenantId");
    var uId = localStorage.getItem("userId");
    var orgId = localStorage.getItem("orgId");
    setTenantId(tenId);
    setLocalOrgId(orgId);
    setLocalUserId(uId);
    // setIsLoading(false);
    getAllList(uId, pageNo, pageSize);
    if (filteratedDashboardData?.dayDate) {
      getFilteApi(
        pageNo,
        pageSize,
        "ALL",
        filteratedDashboardData?.dayDate,
        filteratedDashboardData?.dayDate
      );
    }
    if (filteratedDashboardData?.status) {
      getFilteApi(
        pageNo,
        pageSize,
        filteratedDashboardData?.status.toUpperCase(),
        filteratedDashboardData?.date,
        filteratedDashboardData?.date
      );
    }
  }, []);

  const getAllList = async (uId, pageNo, pageSize) => {
    var resoureUrl = `dbservice/patient/getbyuser?userId=${uId}&page=${pageNo}&size=${pageSize}`;
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

  const getFilteApi = async (
    pageNo,
    pageSize,
    statusValue,
    pStart,
    pEnd,
    dStart,
    dEnd
  ) => {
    setIsLoading(true);
    if (filteratedDashboardData) {
      var resoureUrl = `dbservice/patient/filter?page=${pageNo}&size=${pageSize}`;
      if (filteratedDashboardData?.status &&pStart && pEnd) {
        resoureUrl = `dbservice/patient/filter?page=${pageNo}&size=${pageSize}&processedStatus=${filteratedDashboardData?.status.toUpperCase()}&dueDateStart=${pStart}&dueDateEnd=${pEnd}`;
      } else if (filteratedDashboardData?.dayDate && pStart && pEnd) {
        resoureUrl = `dbservice/patient/filter?page=${pageNo}&size=${pageSize}&dueDateStart=${pStart}&dueDateEnd=${pEnd}`;
      } 
      else if(filteratedDashboardData?.status && statusValue !=="ALL"){
        resoureUrl = `dbservice/patient/filter?page=${pageNo}&size=${pageSize}&processedStatus=${filteratedDashboardData?.status.toUpperCase()}`;
      } else {
        resoureUrl = `dbservice/patient/filter?page=${pageNo}&size=${pageSize}`;
      }
    } else {
      var resoureUrl = `dbservice/patient/filter?page=${pageNo}&size=${pageSize}`;
      if (statusValue != null) {
        if (statusValue === "ALL") {
          resoureUrl = `dbservice/patient/filter?page=${pageNo}&size=${pageSize}`;
        } else {
          resoureUrl = `dbservice/patient/filter?page=${pageNo}&size=${pageSize}&processedStatus=${statusValue}`;
        }
      }
      if (pStart != null && statusValue == null) {
        resoureUrl = `dbservice/patient/filter?page=${pageNo}&size=${pageSize}&processedStart=${pStart}&processedEnd=${pEnd}`;
      }

      if (pStart != null && statusValue != null && statusValue != "ALL") {
        resoureUrl = `dbservice/patient/filter?page=${pageNo}&size=${pageSize}&processedStatus=${statusValue}&processedStart=${pStart}&processedEnd=${pEnd}`;
      }

      if (dStart != null && statusValue != null && statusValue != "ALL") {
        resoureUrl = `dbservice/patient/filter?page=${pageNo}&size=${pageSize}&processedStatus=${statusValue}&dueDateStart=${dStart}&dueDateEnd=${dEnd}`;
      }

      if (
        dStart != null &&
        statusValue == null &&
        pStart == null &&
        statusValue != "ALL"
      ) {
        resoureUrl = `dbservice/patient/filter?userId=${localUserId}&page=${pageNo}&size=${pageSize}&dueDateStart=${dStart}&dueDateEnd=${dEnd}`;
      }

      if (dStart != null && pStart != null) {
        resoureUrl = `dbservice/patient/filter?userId=${localUserId}&page=${pageNo}&size=${pageSize}&dueDateStart=${dStart}&dueDateEnd=${dEnd}&processedStart=${pStart}&processedEnd=${pEnd}`;
      }

      if (
        dStart != null &&
        statusValue != null &&
        pStart != null &&
        statusValue != "ALL"
      ) {
        resoureUrl = `dbservice/patient/filter?userId=${localUserId}&page=${pageNo}&size=${pageSize}&processedStatus=${statusValue}&dueDateStart=${dStart}&dueDateEnd=${dEnd}&processedStart=${pStart}&processedEnd=${pEnd}`;
      }
    }
    // resoureUrl = `dbservice/patient/filter?userId=${localUserId}&page=${pageNo}&size=${pageSize}&processedStatus=${processedStatus}&processedStart=${startDate}&processedEnd=${endDate}`;

    const response = await axios.get(ENDPOINTS.apiEndoint + resoureUrl);
    if (response.data) {
      var resultMap = [];
      var result = response.data.response.content;
      setTotalElements(response.data.response.totalElements);
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
      //     setTimeout(() => {
      //     subscribe(resultMap);
      // }, 3000);
    }
  };

  const getNameSearch = async (searchtext) => {
    setIsLoading(true);

    // dispatch(getSearchPatients(0,searchtext));
    if (searchtext) {
      var resoureUrl = `dbservice/patient/compute/search?searchtext=${searchtext}&pageno=${0}&pagesize=${12}`;
      const response = await axios.get(ENDPOINTS.apiEndoint + resoureUrl);
      if (response.data) {
        var resultMap = [];
        var result = response.data.response.content;
        setTotalElements(response.data.response.totalElements);

        result.map((res) => {
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
    inputValuePatientId.patientAllocated = localUserId;
    inputValuePatientId.computing = 0;
    inputValuePatientId.allocatedUserId = localUserId;

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

  function gotoPage(number) {
    if (canMaxPage > number) {
      setCanNextPage(true);
      setPageIndex(number);
      if (number > 0) {
        setCanPreviousPage(true);
      } else {
        setCanPreviousPage(false);
      }
      setPageCount(number);
    } else {
      setCanNextPage(false);
    }
    var start = number * 10;
    var end = start + 10;
    const records = patinetListAll.slice(start, end);
    setPatinetList(records);
  }
  function nextPage(number) {
    if (canMaxPage > number) {
      setPageCount(number);
      setPageIndex(number);
      setCanPreviousPage(true);
    } else {
      setCanNextPage(false);
    }
    var start = number * 10;
    var end = start + 10;
    const records = patinetListAll.slice(start, end);
    setPatinetList(records);
  }

  function previousPage(number) {
    setCanNextPage(true);
    setPageIndex(number);
    if (number > 0) {
      setCanPreviousPage(true);
    } else {
      setCanPreviousPage(false);
    }
    setPageCount(number);
    var start = number * 10;
    var end = start + 10;
    const records = patinetListAll.slice(start, end);
    setPatinetList(records);
  }

  const subscribe = async (patientResult) => {
    const accessToken = localStorage.getItem("token");
    var uId = localStorage.getItem("userId");
    var tenId = localStorage.getItem("tenantId");
    var processedList = [];

    var resoureUrl = `https://hcc.encipherhealth.com/secure/aiservice/ai/events?userId=${uId}&tenantId=${tenId}`;
    const fetchData = async () => {
      let eventSource = await fetchEventSource(resoureUrl, {
        method: "get",
        mode: "cors",
        signal: signal,
        headers: {
          // Accept: "text/event-stream",
          Authorization: `Bearer ` + accessToken,
          // 'Cache-Control': 'no-cache',
          // 'Connection': 'keep-alive',
          // 'Accept': "text/event-stream",
          "Access-Control-Allow-Origin": "*",
        },
        withCredentials: true,
        onopen(res) {},
        onmessage(event) {
          const parsedData = JSON.parse(event.data);
          processedList = parsedData;
          var checkProcessedValue = [];
          processedList.map((res) => {
            checkProcessedValue.push({
              patientId: res,
            });
          });

          const array1 = patientResult;
          const array2 = checkProcessedValue;
          const hashMap2 = array2.reduce((carry, item) => {
            const { patientId } = item;
            if (!carry[patientId]) {
              carry[patientId] = item;
            }
            return carry;
          }, {});

          const output = array1.map((item) => {
            const newName = hashMap2[item.patientId];
            if (newName) {
              item.computing = 2;
            }
            return item;
          });

          setPatinetListAll(output);
        },
        onclose() {
          controller.abort();
        },
        onerror(err) {
          controller.abort();
        },
      });
    };

    fetchData();
  };

  const statusBodyTemplate = (rowData) => {
    switch (rowData.computing) {
      case 2:
        return (
          <div className="patient-status">
            <span className={`badge processed-text`}>Processed</span>
          </div>
        );

      case 1:
        return (
          <div className="patient-status">
            <span className={`badge processing-text`}>Processing</span>
          </div>
        );

      case 3:
        return (
          <div className="patient-status">
            <span className={`badge failed-text`}>Failed</span>
          </div>
        );

      case 0:
        return (
          <div className="patient-status">
            <span className={`badge not-started-text`}>Not Started</span>
          </div>
        );
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
      <div className="d-flex justify-content-center">
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
    // setIsLoadingBtn(false);
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
    getFilteApi(
      e.page,
      e.rows,
      statusSelectedValue,
      processedStart,
      processedEnd,
      dueDateStart,
      dueDateEnd
    );
  };
  const statusOptions = [
    { label: "ALL", value: "ALL" },
    { label: "COMPLETED", value: "COMPLETED" },
    { label: "PENDING", value: "PENDING" },
    { label: "DECLINED", value: "DECLINED" },
    { label: "HOLD", value: "HOLD" },
  ];
  const dosOnChange = (selectedOption) => {
    const value = selectedOption.value;
    setStausSelectedValue(value);
    getFilteApi(
      0,
      15,
      value,
      processedStart,
      processedEnd,
      dueDateStart,
      dueDateEnd
    );
  };
  const handleDatePickerChange = (dateString) => {
    if (dateString[0] != "") {
      let convertStartDate =
        moment(dateString[0]).format("YYYY-MM-DD") + "T00:00:00.000Z";
      let convertEndDate =
        moment.utc(dateString[1]).format("YYYY-MM-DD") + "T23:59:59.000Z";
      setDueDateStart(convertStartDate);
      setDueDateEnd(convertEndDate);
      getFilteApi(
        0,
        15,
        statusSelectedValue,
        processedStart,
        processedEnd,
        convertStartDate,
        convertEndDate
      );
    } else {
      setDueDateStart(null);
      setDueDateEnd(null);
      getFilteApi(
        0,
        15,
        statusSelectedValue,
        processedStart,
        processedEnd,
        null,
        null
      );
    }
  };

  const handleDatePickerChangeProcesseDate = (dateString) => {
    if (dateString[0] != "") {
      let convertStartDate =
        moment(dateString[0]).format("YYYY-MM-DD") + "T00:00:00.000Z";
      let convertEndDate =
        moment.utc(dateString[1]).format("YYYY-MM-DD") + "T23:59:59.000Z";
      setProcessedStart(convertStartDate);
      setProcessedEnd(convertEndDate);
      getFilteApi(
        0,
        15,
        statusSelectedValue,
        convertStartDate,
        convertEndDate,
        dueDateStart,
        dueDateEnd
      );
    } else {
      setProcessedStart(null);
      setProcessedEnd(null);
      getFilteApi(
        0,
        15,
        statusSelectedValue,
        null,
        null,
        dueDateStart,
        dueDateEnd
      );
    }
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
                        <div className="row filter-contain">
                          <div className="col-xl-2">
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
                          </div>
                          <div className="col-xl-2">
                            <label>Select Status</label>
                            <div class="form-group has-search">
                              <Select
                                onChange={(selectedOption) =>
                                  dosOnChange(selectedOption)
                                }
                                options={statusOptions}
                                className="custom-react-select"
                                isSearchable={false}
                                placeholder={
                                  filteratedDashboardData
                                    ? filteratedDashboardData?.status?.toUpperCase()
                                    : "Select Status"
                                }
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
                                defaultValue={
                                  filteratedDashboardData
                                    ? [
                                        dayjs(defaultStartDate, "MM-DD-YYYY"),
                                        dayjs(defaultEndDate, "MM-DD-YYYY"),
                                      ]
                                    : []
                                }
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

                      <div
                        id="task-tbl_wrapper"
                        className="dataTables_wrapper no-footer"
                      >
                        {isLoading ? (
                          <LoadingSpinner />
                        ) : (
                          <>
                            <PatientTable
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
        <Offcanvas
          onHide={setAddPatient}
          show={addPatient}
          className="offcanvas-end"
          placement="end"
        >
          <div className="offcanvas-header">
            <h5 className="modal-title" id="#gridSystemModal">
              Add Patient Details
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={() => setAddPatient(false)}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div className="offcanvas-body">
            <div className="container-fluid">
              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-xl-12 mb-3">
                    <Form.Label>
                      Patient Id <span className="text-danger">*</span>{" "}
                    </Form.Label>
                    <Form.Control
                      name="patientId"
                      required
                      type="text"
                      value={inputValue.patientId}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-xl-12 mb-3">
                    <Form.Label>
                      Patient Name <span className="text-danger">*</span>{" "}
                    </Form.Label>
                    <Form.Control
                      name="name"
                      required
                      type="text"
                      value={inputValue.name}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-xl-12 mb-3">
                    <Form.Label>
                      File <span className="text-danger">*</span>{" "}
                    </Form.Label>
                    <Form.Control
                      required
                      type="file"
                      accept="application/pdf,text/plain"
                      onChange={(e) => onChangeFile(e.target.files)}
                      disabled={isLoadingBtn ? true : false}
                    />
                  </div>
                  {/* <div className="col-xl-12 mb-3">
<Form.Label>
Radiology
</Form.Label>
<Form.Control
type="file"
accept="application/pdf,text/plain"
onChange={(e) => onChangeFileRadiology(e.target.files)}
disabled={isLoadingBtn ? true : false}
/>
</div> */}
                  <div className="col-xl-12 mb-3">
                    <Form.Label>
                      Year of Service <span className="text-danger">*</span>{" "}
                    </Form.Label>
                    <Form.Control
                      name="year"
                      required
                      type="number"
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <Button type="submit" className="btn btn-primary btn-sm me-1">
                    {isLoadingBtn ? (
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className={visitStyles.btnSpinner}
                      />
                    ) : null}
                    {isLoadingBtn ? "Loading..." : "Submit"}
                  </Button>
                  <Button
                    onClick={() => setAddPatient(false)}
                    className="btn btn-danger btn-sm light ms-1"
                  >
                    Cancel
                  </Button>
                </div>
              </Form>
            </div>
          </div>
        </Offcanvas>
        <Offcanvas
          onHide={setAddPatientId}
          show={addPatientId}
          className="offcanvas-end"
          placement="end"
        >
          <div className="offcanvas-header">
            <h5 className="modal-title" id="#gridSystemModal">
              Add Patient Details
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={() => setAddPatientId(false)}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div className="offcanvas-body">
            <div className="container-fluid">
              <Form
                noValidate
                validated={validated}
                onSubmit={handleSubmitPatientId}
              >
                <div className="row">
                  <div className="col-xl-12 mb-3">
                    <Form.Label>
                      Patient Id <span className="text-danger">*</span>{" "}
                    </Form.Label>
                    <Form.Control
                      name="patientId"
                      required
                      type="text"
                      onChange={handleChangePatientId}
                    />
                  </div>
                  <div className="col-xl-12 mb-3">
                    <Form.Label>
                      Patient Name <span className="text-danger">*</span>{" "}
                    </Form.Label>
                    <Form.Control
                      name="patientName"
                      required
                      type="text"
                      onChange={handleChangePatientId}
                    />
                  </div>
                </div>

                <div>
                  <Button type="submit" className="btn btn-primary btn-sm me-1">
                    {isLoadingBtn ? "Loading..." : "Submit"}
                  </Button>
                  <Button
                    onClick={() => setAddPatientId(false)}
                    className="btn btn-danger btn-sm light ms-1"
                  >
                    Cancel
                  </Button>
                </div>
              </Form>
            </div>
          </div>
        </Offcanvas>
      </div>
    </>
  );
}
