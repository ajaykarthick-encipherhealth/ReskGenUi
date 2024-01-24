import React, { useState, useEffect } from "react";
import Select from "react-select";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "react-facebook-loading/dist/react-facebook-loading.css";
import { faUpload, faSearch } from "@fortawesome/free-solid-svg-icons";
import { DatePicker } from "antd";
import { useDispatch } from "react-redux";
import { notification } from "antd";
import { InputText } from "primereact/inputtext";
import moment from "moment";
import dayjs from "dayjs";
import { Paginator } from "primereact/paginator";
import visitStyles from "../../../styles/visitdata.module.css";
import Header from "../../../jsx/layouts/nav/Header";
import { patientDetails } from "../../../store/actions/AuthActions";
import PatientTable from "../../../components/table/PatientList/patientList";
import LoadingSpinner from "../../../components/spinner";
import Footer from "../../../jsx/layouts/Footer";
import { getpatientsListFilter } from "../../../store/actions/PatientsActions";
import { processstatusBodyTemplate } from "../../../components/headerFilters/functions";

const { RangePicker } = DatePicker;
export default function Patient() {
  const dispatch = useDispatch();
  const sideMenu = useSelector((state) => state.sideMenu);
  const navigate = useRouter();
  const [validated, setValidated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [inputValue, setInputValue] = useState({
    year: "",
    name: "",
    patientId: "",
  });
  const filteratedDashboardData = useSelector(
    (state) => state.patients.filteredList
  );
  const [patinetListAll, setPatinetListAll] = useState([]);
  const [tenantId, setTenantId] = useState("");
  const [localOrgId, setLocalOrgId] = useState("");
  const [localUserId, setLocalUserId] = useState("");

  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [paginationFirst, setPaginationFirst] = useState(0);
  const [totalElements, setTotalElements] = useState(10);
  const [tableLoading, setTableLoading] = useState(true);
  const dueStartDate = filteratedDashboardData?.date
    ? filteratedDashboardData?.date
    : filteratedDashboardData?.dayDate
    ? filteratedDashboardData?.dayDate
    : "";
  const [dueDateStart, setDueDateStart] = useState(dueStartDate);
  const [dueDateEnd, setDueDateEnd] = useState(dueStartDate);
  const [processedStart, setProcessedStart] = useState("");
  const [processedEnd, setProcessedEnd] = useState("");
  const [statusSelectedValue, setStausSelectedValue] = useState(
    filteratedDashboardData?.status
      ? filteratedDashboardData?.status.toUpperCase()
      : ""
  );
  const [searchTextValue, setSearchTextValue] = useState("");

  const patientsListFilter = useSelector(
    (state) => state.patients.patientsListFilter
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
    getFilteApi(
      pageNo,
      pageSize,
      statusSelectedValue,
      dueDateStart,
      dueDateEnd,
      processedStart,
      processedEnd
    );
  }, [filteratedDashboardData]);

  useEffect(() => {
    if (patientsListFilter) {
      var resultMap = [];
      var result = patientsListFilter?.response?.content;
      setTotalElements(patientsListFilter?.response?.totalElements);
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
  }, [patientsListFilter]);

  const getFilteApi = async (
    pageNo,
    pageSize,
    statusValue,
    dStart,
    dEnd,
    pStart,
    pEnd
  ) => {
    setIsLoading(true);
    var uId = localStorage.getItem("userId");
    var resoureUrl = `dbservice/patient/filter?patientAllocated=${uId}&page=${pageNo}&size=${pageSize}&processedStatus=${statusValue}&dueDateStart=${dStart}&dueDateEnd=${dEnd}&processedStart=${pStart}&processedEnd=${pEnd}&searchString=${searchTextValue}`;
    dispatch(getpatientsListFilter(resoureUrl));
  };

  const getNameSearch = async (searchtext) => {
    setIsLoading(true);
    setSearchTextValue(searchtext);
    var resoureUrl = `dbservice/patient/filter?patientAllocated=${localUserId}&page=0&size=${pageSize}&processedStatus=${statusSelectedValue}&dueDateStart=${dueDateStart}&dueDateEnd=${dueDateEnd}&processedStart=${processedStart}&processedEnd=${processedEnd}&searchString=${searchtext}`;
    dispatch(getpatientsListFilter(resoureUrl));
  };

  const addPatientFile = (data) => {
    inputValue.patientId = data.patientId;
    inputValue.name = data.patientName;
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

const onPageChange = (e) => {
  setIsLoading(true);
  setPaginationFirst(e.first);
  setPageNo(e.page);
  setPageSize(e.rows);
  setTableLoading(true);
  console.log(e,"test");
  getFilteApi(
    e.page,
  15,
    statusSelectedValue,
    dueDateStart,
    dueDateEnd,
    processedStart,
    processedEnd,
   
  );
};


  const statusOptions = [
    { label: "ALL", value: "ALL" },
    { label: "COMPLETED", value: "COMPLETED" },
    { label: "PENDING", value: "PENDING" },
    { label: "COMPUTED", value: "COMPUTED" },
    { label: "DECLINED", value: "DECLINED" },
    { label: "HOLD", value: "HOLD" },
  ];
  const onChangeStatus = (selectedOption) => {
    var value = selectedOption.value;
    if (value == "ALL") {
      value = "";
    }
    setStausSelectedValue(value);
    getFilteApi(
      0,
      pageSize,
      value,
      dueDateStart,
      dueDateEnd,
      processedStart,
      processedEnd,
      
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
        pageSize,
        statusSelectedValue,
        convertStartDate,
        convertEndDate,
        processedStart,
        processedEnd,
      
      );
    } else {
      setDueDateStart("");
      setDueDateEnd("");
      getFilteApi(
        0,
        pageSize,
        statusSelectedValue,
        "",
        "",
        processedStart,
        processedEnd,
       
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
        pageSize,
        statusSelectedValue,
        convertStartDate,
        convertEndDate,
        dueDateStart,
        dueDateEnd
      );
    } else {
      setProcessedStart("");
      setProcessedEnd("");
      getFilteApi(
        0,
        pageSize,
        statusSelectedValue,
        dueDateStart,
        dueDateEnd,
        "",
        "",
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
                                  onChangeStatus(selectedOption)
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
      </div>
    </>
  );
}
