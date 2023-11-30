import styles from "./report.module.css";
import React, { useState, useRef, useEffect, useMemo } from "react";
import { Button } from "react-bootstrap";
import { ProgressBar } from "primereact/progressbar";
import { Badge, Modal, DatePicker } from "antd";
import Header from "../../../jsx/layouts/nav/Header";
import { useSelector } from "react-redux";

import axios from "../../../utility/axiosConfig";
import ENDPOINTS from "../../../utility/enpoints";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Progress } from "antd";
import { Tab, Nav } from "react-bootstrap";
import Select from "react-select";

import {
  faClose,
  faUpload,
  faCheck,
  faBan,
  faSearch,
  faComment,
} from "@fortawesome/free-solid-svg-icons";
import { Spin } from "antd";
import { useDispatch } from "react-redux";
import { patientDetails } from "../../../store/actions/AuthActions";
import { notification } from "antd";
import { DataTable } from "primereact/datatable";
import { FilterMatchMode } from "primereact/api";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import moment from "moment";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { Paginator } from "primereact/paginator";
import { Calendar } from "primereact/calendar";
import { ProgressSpinner } from "primereact/progressspinner";
import { SVGICON } from "../../../jsx/constant/theme";
import {
  CircularProgressbar,
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import SentReportTable from "../../../components/table/sentReport/sentReport";
import ReceivedReport from "../../../components/table/receivedReport/receivedReport";
import CoderReport from "../../../components/table/CoderReport/coderReport";

const index = () => {
  const dispatch = useDispatch();

  const controller = new AbortController();
  const signal = controller.signal;

  const navigate = useRouter();
  const [validated, setValidated] = useState(false);
  const [dataValidationList, setDataValidationList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingBtn, setIsLoadingBtn] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [flagClicked, setFlagClicked] = useState(false);
  const [activeTabHead, setActiveTabHead] = useState("Visit Data");

  const recordsPage = 10;
  const lastIndex = currentPage * recordsPage;
  const firstIndex = lastIndex - recordsPage;

  const [addPatient, setAddPatient] = useState(false);
  const [addPatientId, setAddPatientId] = useState(false);
  const [selectFile, setSelectFile] = useState(null);
  const [selectFileRadiology, setSelectFileRadiology] = useState(null);
  const [dates, setDates] = useState(null);
  const [compledtedDate, setCompletedDate] = useState(null);

  const [inputValue, setInputValue] = useState({
    year: "",
    name: "",
    patientId: "",
  });
  const [inputValuePatientId, setInputValuePatientId] = useState({
    patientId: "",
    patientName: "",
  });

  const [pageCount, setPageCount] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [canPreviousPage, setCanPreviousPage] = useState(false);
  const [canNextPage, setCanNextPage] = useState(true);
  const [canMaxPage, setCanMaxPage] = useState(10);

  const [patinetList, setPatinetList] = useState([]);
  const [patinetListAll, setPatinetListAll] = useState([]);
  const [tenantId, setTenantId] = useState("");
  const [localOrgId, setLocalOrgId] = useState("");
  const [localUserId, setLocalUserId] = useState("");

  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [paginationFirst, setPaginationFirst] = useState(0);

  const [totalElements, setTotalElements] = useState(10);
  const [tableLoading, setTableLoading] = useState(true);
  const [flagStates, setFlagStates] = useState([]);
  const [modal, setModal] = useState(false);
  const { RangePicker } = DatePicker;

  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    patientId: { value: null, matchMode: FilterMatchMode.CONTAINS },
    patientName: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const statusMessage = {
    subscribed: "Subscribed",
    unsubscribed: "Unsubscribed",
  };

  const filterChangePatientId = (event) => {
    const value = event.target.value;
    let _filters = { ...filters };
    _filters["patientId"].value = value;
    setFilters(_filters);
  };
  const filterChangePatientName = (event) => {
    const value = event.target.value;
    let _filters = { ...filters };
    _filters["patientName"].value = value;
    setFilters(_filters);
  };

  useEffect(() => {
    var tenId = localStorage.getItem("tenantId");
    var uId = localStorage.getItem("userId");
    var orgId = localStorage.getItem("orgId");
    setTenantId(tenId);
    setLocalOrgId(orgId);
    setLocalUserId(uId);
    // setIsLoading(false);
    getAllList(uId, pageNo, pageSize);
    // fetchData();
  }, []);

  const getAllList = async (uId, pageNo, pageSize) => {
    var resoureUrl = `dbservice/patient/getbyuser?userId=${uId}&page=${pageNo}&size=${pageSize}`;
    const response = await axios.get(ENDPOINTS.apiEndoint + resoureUrl);
    if (response.data) {
      var resultMap = [];
      var result = response.data.content;
      setTotalElements(response.data.totalElements);

      result.map((res) => {
        resultMap.push({
          patientId: res.patientId,
          patientName: res.patientName,
          fileName: res.fileName,
          computing: res.computing,
          createdAt: res.createdAt,
          lastModifiedDate: res.lastModifiedDate,
          dueDate: res.dueDate,
          processedStatus: res.processedStatus,
          createdAt: res.createdAt,
        });
      });
      var newArray = [];
      newArray = [...patinetListAll, ...resultMap];
      setPatinetListAll(resultMap);

      // console.log(newArray)
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
  const handleFlagClick = (index) => {
    const newFlagStates = [...flagStates];
    newFlagStates[index] = !newFlagStates[index];
    setFlagStates(newFlagStates);
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
  const handleCloseModal = () => {
    setModal(false);
  };

  const navigetPageDetails = (pageTitle) => {
    // setIsLoadingDos(true);
    setActiveTabHead("file");
    setSideNavLabelActiveKey(pageTitle);
    setIsLoading(true);

    setIsLoading(false);
  };
  const statusOptions = [
    { label: 'Completed', value: 'completed' },
    { label: 'Pending', value: 'pending' },
    { label: 'Declined', value: 'declined' },
    { label: 'Hold', value: 'hold' },
  ];
  const dosOnChange = (selectedOption) => {
    const selectedValue = selectedOption.value;
    // Do something with the selected value
    console.log(selectedValue);
  };
  const statusBodyTemplate = (rowData) => {
    //   console.log(rowData.computing)
    //   return <span className={`badge badge-success`}>
    //   Processed
    //   <FontAwesomeIcon className='ml-2 ms-1 ' icon={faCheck} />
    // </span>;

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
    //   console.log(rowData.computing)
    //   return <span className={`badge badge-success`}>
    //   Processed
    //   <FontAwesomeIcon className='ml-2 ms-1 ' icon={faCheck} />
    // </span>;

    switch (rowData.processedStatus) {
      case "COMPLETED":
        return (
          <div className="patient-status">
            <span className={`badge badge-success`}>
              COMPLETED
              <FontAwesomeIcon className="ml-2 ms-1 " icon={faCheck} />
            </span>
          </div>
        );

      case "PENDING":
        return (
          <div className="patient-status">
            <span className={`badge badge-primary`}>
              PENDING
              <Spin
                className="ml-2 processingSpin ms-1 text-white"
                size="small"
              />
            </span>
          </div>
        );

      case "DECLINE":
        return (
          <div className="patient-status">
            <span className={`badge badge-danger`}>
              DECLINE
              <FontAwesomeIcon className="ml-2 ms-1 " icon={faClose} />
            </span>
          </div>
        );

      case "NOTCOMPUTED":
        return (
          <div className="patient-status">
            <span className={`badge btn-notstarted`}>
              NOTCOMPUTED
              <FontAwesomeIcon className="ml-2 ms-1 " icon={faBan} />
            </span>
          </div>
        );
    }
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="d-flex justify-content-center">
        {rowData.computing == 2 ? (
          <button
            onClick={() => gotoPatientDetails(rowData)}
            className="btn hegiht10 btn-notstarted shadow  sharp me-1 action-btn"
          >
            <EyeOutlined className="text-white" />
          </button>
        ) : (
          <button
            disabled
            className="btn hegiht10 btn-notstarted shadow  sharp me-1 action-btn"
          >
            <EyeInvisibleOutlined className="text-white" />
          </button>
        )}
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
    console.log(dates);
    console.log(compledtedDate);
    console.log(e);
    setPaginationFirst(e.first);
    setPageNo(e.page);
    setPageSize(e.rows);
    setTableLoading(true);
    getAllList(localUserId, e.page, e.rows);
    console.log("test");
  };

  function calculateColor(percentage) {
    // Define your color ranges based on the percentage
    if (percentage <= 10) {
      return "#E03838";
    } else if (percentage <= 30) {
      return "#E07E38";
    } else if (percentage <= 50) {
      return "#E0A738";
    } else if (percentage <= 80) {
      return "#387BE0";
    } else if (percentage <= 100) {
      return "#289A00";
    } else {
      return "#E0A738"; // Default color for percentages greater than 50
    }
  }

  return (
    <>
      <Header />
      <div className={styles.maincontainer}>
        <div class="content-body">
          {/* {isLoading ? (
            <LoadingSpinner />
          ) : ( */}
          <div className="container-fluid">
            <div className="row">
              <div className="col-xl-12">
                <div className="">
                  <div className="card-body p-0">
                    <div className="table-responsive active-projects task-table">
                      <div className="tbl-caption  align-items-center">
                        <div className="row filter-contain">
                          <div className="col-xl-2">
                            <div class="form-group has-search">
                              <FontAwesomeIcon
                                className="fa fa-search form-control-feedback"
                                icon={faSearch}
                              />
                              <InputText
                                type="text"
                                onChange={(e) => filterChangePatientId(e)}
                                className="form-control new-form-control"
                                placeholder="Search"
                              />
                            </div>
                          </div>
                          <div className="col-xl-2"  style={{ zIndex: "999"}}>
                              <div class="form-group has-search">
                                {/* <InputText
                                  type="text"
                                  onChange={(e) => filterChangePatientName(e)}
                                  className="form-control new-form-control"
                                  placeholder="Status"
                                /> */}
                                 <Select
                                     onChange={(selectedOption) => dosOnChange(selectedOption)}
                                    options={statusOptions}
                                    className="custom-react-select"
                                    isSearchable={false}
                                   
                                  />
                              </div>
                            </div>
                       
                            <div className="col-xl-2">
                             
                               
                                <RangePicker />  
                            </div>
                           
                        
                        
                          <div className="col-xl-6">
                            <div className="row flr">
                              <Button
                                onClick={addPatientFormId}
                                className={styles.export}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="20"
                                  height="20"
                                  viewBox="0 0 20 20"
                                  fill="none"
                                >
                                  <path
                                    d="M13.7 7.41699C16.7 7.67533 17.925 9.21699 17.925 12.592V12.7003C17.925 16.4253 16.4333 17.917 12.7083 17.917H7.28332C3.55832 17.917 2.06665 16.4253 2.06665 12.7003V12.592C2.06665 9.24199 3.27498 7.70032 6.22498 7.42532"
                                    stroke="#133DD4"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  />
                                  <path
                                    d="M10 12.4999V3.0166"
                                    stroke="#133DD4"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  />
                                  <path
                                    d="M12.7916 4.87467L9.9999 2.08301L7.20825 4.87467"
                                    stroke="#133DD4"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  />
                                </svg>
                                Export
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div
                        id="task-tbl_wrapper"
                        className="dataTables_wrapper no-footer"
                      >
                          <div
                            className="profile-tab " style={{marginTop:"20px"}}
                          >
                            <div className="custom-tab-1">
                          <Tab.Container defaultActiveKey="validDiseases">
                            <Nav as="ul" className="nav nav-tabs">
                              <Nav.Item as="li" className="nav-item">
                                <Nav.Link
                                  to="#my-posts"
                                  eventKey="validDiseases"
                                >
                                  Coder Report
                                </Nav.Link>
                              </Nav.Item>
                              <Nav.Item as="li" className="nav-item">
                                <Nav.Link
                                  to="#my-posts"
                                  eventKey="comboDiseases"
                                >
                                  Sent Report
                                </Nav.Link>
                              </Nav.Item>
                              <Nav.Item as="li" className="nav-item">
                                <Nav.Link
                                  to="#my-posts"
                                  eventKey="meatCriteria"
                                >
                                  Received Report
                                </Nav.Link>
                              </Nav.Item>
                            </Nav>
                            <Tab.Content>
                              <Tab.Pane id="my-posts" eventKey="validDiseases">
                                {/* <DataTable
                                  value={patinetListAll}
                                  paginator={false}
                                  rows={10}
                                  rowsPerPageOptions={[10, 25, 50, 100]}
                                  dataKey="id"
                                  filters={filters}
                                  filterDisplay="menu"
                                  className="custom-table"
                                  rowClassName="custom-row"
                                >
                                  {/* <Column
                            header="SI.NO"
                            headerStyle={{ width: "3rem" }}
                            body={(data, options) =>
                              paginationFirst + options.rowIndex + 1
                            }
                            bodyStyle={{
                              borderLeft: "  0.2px solid #e1e1e1",
                              borderTop: "  0.2px solid #e1e1e1",
                              borderBottom: "  0.2px solid #e1e1e1",
                            }}
                          ></Column> */}

                                  {/* <Column
                                    field="patientId"
                                    header="Patient Id"
                                    bodyStyle={{
                                      borderTop: "  0.2px solid #e1e1e1",
                                      borderLeft: "  0.2px solid #e1e1e1",
                                      borderBottom: "  0.2px solid #e1e1e1",
                                    }}
                                  />
                                  <Column
                                    field="patientName"
                                    header="Patient Name"
                                    bodyStyle={{
                                      borderTop: "  0.2px solid #e1e1e1",
                                      borderBottom: "  0.2px solid #e1e1e1",
                                    }}
                                  /> */}
                                  {/* <Column
                            field="fileName"
                            header="File Name"
                            bodyStyle={{
                              borderTop: "  0.2px solid #e1e1e1",
                              borderBottom: "  0.2px solid #e1e1e1",
                            }}
                          /> */}

                                  {/* <Column
                                    field="hcc"
                                    header="HCC "
                                    body={(data) => (
                                      <div>
                                        {data.hcc ? (
                                          <span>{data.hcc}</span>
                                        ) : (
                                          <span>0</span>
                                        )}
                                      </div>
                                    )}
                                    bodyStyle={{
                                      borderTop: "  0.2px solid #e1e1e1",
                                      borderBottom: "  0.2px solid #e1e1e1",
                                    }}
                                  /> */}

                                  {/* <Column
                                    field="suggestionCodes"
                                    header="Suggestion  "
                                    body={(data) => (
                                      <div>
                                        {data.suggestionCodes ? (
                                          <span>{data.suggestionCodes}</span>
                                        ) : (
                                          <span>0</span>
                                        )}
                                      </div>
                                    )}
                                    bodyStyle={{
                                      borderTop: "  0.2px solid #e1e1e1",
                                      borderBottom: "  0.2px solid #e1e1e1",
                                    }}
                                  /> */}
                                  {/* <Column
                                    field="deletedCodes"
                                    header="Deleted "
                                    body={(data) => (
                                      <div>
                                        {data.deletedCodes ? (
                                          <span>{data.deletedCodes}</span>
                                        ) : (
                                          <span>0</span>
                                        )}
                                      </div>
                                    )}
                                    bodyStyle={{
                                      borderTop: "  0.2px solid #e1e1e1",
                                      borderBottom: "  0.2px solid #e1e1e1",
                                    }}
                                  /> */}
                                  {/* <Column
                                    field="totalCodes"
                                    header="Total Codes"
                                    body={(data) => (
                                      <div>
                                        {data.deletedCodes ? (
                                          <span>{data.deletedCodes}</span>
                                        ) : (
                                          <span>0</span>
                                        )}
                                      </div>
                                    )}
                                    bodyStyle={{
                                      borderTop: "  0.2px solid #e1e1e1",
                                      borderBottom: "  0.2px solid #e1e1e1",
                                    }}
                                  />
                                  <Column
                                    field="dateReceived"
                                    body={(data) =>
                                      moment(data.dueDate).format(
                                        "MM-DD-YYYY hh:MM:A"
                                      )
                                    }
                                    sortable
                                    header="Date Received"
                                    bodyStyle={{
                                      borderTop: "  0.2px solid #e1e1e1",
                                      borderBottom: "  0.2px solid #e1e1e1",
                                    }}
                                  /> */}
                                  {/* <Column
                            field="quality"
                            header="Quality"
                            body={(data) => {
                              const percentage = 40; // Replace with the actual percentage from your data
                              const color = calculateColor(percentage);

                              return (
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <CircularProgressbar
                                    value={percentage}
                                    text={`${percentage}%`}
                                    styles={{
                                      root: { width: 40 },
                                      path: {
                                        stroke: color,
                                        strokeLinecap: "butt",
                                        transition:
                                          "stroke-dashoffset 0.5s ease 0s",
                                      },
                                      trail: {
                                        stroke: "#D9D9D9",
                                      },
                                      text: {
                                        fill: "#000000",
                                        fontSize: "30px",
                                      },
                                    }}
                                  />
                                </div>
                              );
                            }}
                            bodyStyle={{
                              borderTop: " 0.2px solid #e1e1e1",
                              borderBottom: " 0.2px solid #e1e1e1",
                            }}
                          /> */}

                                  {/* <Column
                                    field="comments"
                                    body={(data) => (
                                      <div
                                        className={styles.commentsIcon}
                                        onClick={() => setModal(true)}
                                      >
                                        {SVGICON.comment}
                                      </div>
                                    )}
                                    header="Comments"
                                    bodyStyle={{
                                      borderTop: " 0.2px solid #e1e1e1",
                                      borderBottom: " 0.2px solid #e1e1e1",
                                    }}
                                  /> */}

                                  {/* <Column
                                    field="patientName"
                                    header="Coder Name"
                                    bodyStyle={{
                                      borderTop: "  0.2px solid #e1e1e1",
                                      borderBottom: "  0.2px solid #e1e1e1",
                                    }}
                                  />
                                  <Column
                                    field="patientName"
                                    header="Flag"
                                    body={(data, { rowIndex }) => (
                                      <div>
                                        {flagStates[rowIndex] ? (
                                          <span
                                            onClick={() =>
                                              handleFlagClick(rowIndex)
                                            }
                                          >
                                            {SVGICON.redFlag}
                                          </span>
                                        ) : (
                                          <span
                                            onClick={() =>
                                              handleFlagClick(rowIndex)
                                            }
                                          >
                                            {SVGICON.flag}
                                          </span>
                                        )}
                                      </div>
                                    )}
                                    bodyStyle={{
                                      borderTop: " 0.2px solid #e1e1e1",
                                      borderBottom: " 0.2px solid #e1e1e1",
                                      borderRight: " 0.2px solid #e1e1e1",
                                    }}
                                  /> */}
                                 {/* </DataTable>  */}
                                 <CoderReport setModal={setModal} />
                              </Tab.Pane> 
                              <Tab.Pane
                                id="my-posts"
                                eventKey="nonhcc"
                              ></Tab.Pane>
                              <Tab.Pane id="my-posts" eventKey="comboDiseases">
                                <SentReportTable />
                              </Tab.Pane>
                              <Tab.Pane id="my-posts" eventKey="meatCriteria">
                                <ReceivedReport />
                              </Tab.Pane>
                              <Tab.Pane
                                id="my-posts"
                                eventKey="RafScore"
                              ></Tab.Pane>
                              <Tab.Pane
                                id="my-posts"
                                eventKey="file"
                              ></Tab.Pane>
                            </Tab.Content>
                          </Tab.Container>
                        </div>
                          </div>
                        
                        {/* <div className="pagination-container">
                          <Paginator
                            first={paginationFirst}
                            rows={10}
                            totalRecords={totalElements}
                            onPageChange={onPageChange}
                          />
                        </div> */}
                        <div className="pagination-container">
                            <Paginator
                              first={paginationFirst}
                              rows={10}
                              totalRecords={totalElements}
                              onPageChange={onPageChange}
                            />
                            <div className="total-pages">
                              Total Pages: 8
                            </div>
                          </div>
                        {modal && (
                          <Modal
                            title="Comments"
                            centered
                            open={modal}
                            onOk={handleCloseModal}
                            onCancel={handleCloseModal}
                            footer={null}
                          >
                            <div className="offcanvas-body">
                              <div className="container-fluid">
                                <div className={styles.heads}>
                                  <span className={styles.headText}>
                                    Hcc codes
                                  </span>
                                </div>
                                <div className={styles.data}>
                                  <div className={styles.datas}>Visit Data</div>
                                  <div className={styles.description}>
                                    Lorem Ipsum is simply dummy text of the
                                    printing and typesetting industry.
                                  </div>
                                </div>
                                <div className={styles.data}>
                                  <div className={styles.datas}>
                                    Combination codes
                                  </div>
                                  <div className={styles.description}>
                                    Lorem Ipsum is simply dummy text of the
                                    printing and typesetting industry.
                                  </div>
                                </div>
                                <div className={styles.data}>
                                  <div className={styles.datas}>
                                    M.E.A.T criteria
                                  </div>
                                  <div className={styles.description}>
                                    Lorem Ipsum is simply dummy text of the
                                    printing and typesetting industry.
                                  </div>
                                </div>
                                <div className={styles.heads}>
                                  <span className={styles.headText}>
                                    Radiology{" "}
                                  </span>
                                </div>
                                <div className={styles.data}>
                                  <div className={styles.datas}>Visit Data</div>
                                  <div className={styles.description}>
                                    Lorem Ipsum is simply dummy text of the
                                    printing and typesetting industry.
                                  </div>
                                </div>
                                <div className={styles.data}>
                                  <div className={styles.datas}>
                                    Combination codes
                                  </div>
                                  <div className={styles.description}>
                                    Lorem Ipsum is simply dummy text of the
                                    printing and typesetting industry.
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Modal>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* )} */}
        </div>
      </div>
    </>
  );
};

export default index;
