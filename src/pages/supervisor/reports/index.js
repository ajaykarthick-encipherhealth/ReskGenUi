import styles from "../report/report.module.css";
import { useSelector, useDispatch } from "react-redux";
import { Tab, Nav } from "react-bootstrap";
import Select from "react-select";
import React, { useState, useEffect, useCallback } from "react";
import { Modal, DatePicker, Tooltip } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FilterMatchMode } from "primereact/api";
import { InputText } from "primereact/inputtext";
import "react-circular-progressbar/dist/styles.css";
import Header from "../../../jsx/layouts/nav/Header";
import SentReportTable from "../table/sentReport/sentReport";
import ReceivedReport from "../table/receivedReport/receivedReport";
import CoderReport from "../table/CoderReport/coderReport";
import Export from "./Export";
import ExportImg from "../../../images/svg/Export";
import {
  getActiveTab,
  getReceivedDetails,
  getReportDetails,
  getSentDetails,
  getTeamReportDetails,
} from "../../../store/actions/l2Action/AuditReportAction";
import SpinnerDots from "../../../components/spinner";
import TeamReport from "../table/TeamReport/teamReport";
import { disableFutureDate } from "../../../components/headerFilters/functions";
import { debounce } from "../../admin/reports/Export";
import { useRouter } from "next/router";
import { selectedReport } from "../../../store/actions/adminAction/ReportActions";

const statusOptions = [
  { label: "All", value: "ALL" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Pending", value: "PENDING" },
  { label: "Declined", value: "DECLINED" },
  { label: "Hold", value: "HOLD" },
];
const Index = () => {
  const dispatch = useDispatch();
  const route = useRouter();
  const TeamReportDetails = useSelector(
    (state) => state.AuditReport?.teamDetails
  );

  const ReportPatientDetails = useSelector(
    (state) => state.AuditReport?.details
  );
  const SentReportDetails = useSelector(
    (state) => state.AuditReport?.sentDetails
  );
  const ReceivedReportDetails = useSelector(
    (state) => state.AuditReport?.receivedDetails
  );
  const ExportResponse = useSelector((state) => state.AuditReport?.exportRes);
  const reportActiveTab = useSelector((state) => state.AuditReport?.activetab);
  const rowsLength = useSelector((state) => state?.report?.row);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [filteredCOder, setFilteredCoder] = useState([]);
  const [comments, setComments] = useState();
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [pageNo, setPageNo] = useState(0);
  const [sentPageNo, setSentPageNo] = useState(0);
  const [receivedPageNo, setReceivedPageNo] = useState(0);
  const [teamPageNo, setTeamPageNo] = useState(0);
  const [paginationFirst, setPaginationFirst] = useState(0);
  const [paginationReceivedFirst, setPaginationReceivedFirst] = useState(0);
  const [paginationSentFirst, setPaginationSentFirst] = useState(0);
  const [tableLoading, setTableLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const { RangePicker } = DatePicker;
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [receivedStartDate, setReceivedStartDate] = useState();
  const [receivedEndDate, setReceivedEndDate] = useState();
  const [coderStartDate, setCoderStartDate] = useState();
  const [coderEndDate, setCoderEndDate] = useState();
  const [teamStartDate, setTeamStartDate] = useState();
  const [teamEndDate, setTeamEndDate] = useState();
  const [selectedDates, setSelectedDates] = useState(null);
  const [selectedCoderOpt, setSelectedCoderOpt] = useState("");
  const [selectedTeamOpt, setSelectedTeamOpt] = useState("");
  const [coderSearch, setCoderSearch] = useState("");
  const [sentSearch, setSentSearch] = useState("");
  const [teamSearch, setTeamSearch] = useState("");
  const [receivedSearch, setReceivedSearch] = useState("");
  const [receivedSortOrder, setReceivedSortOrder] = useState("DESC");
  const [sentSortOrder, setSentSortOrder] = useState("DESC");
  const [coderSortOrder, setCoderSortOrder] = useState("DESC");
  const [teamSortOrder, setTeamSortOrder] = useState("DESC");
  const [sort, setSort] = useState({ sortDir: "", sortField: "" });
  const [search, setSearch] = useState();

  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    patientId: { value: null, matchMode: FilterMatchMode.CONTAINS },
    patientName: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const debouncedSearch = useCallback(
    debounce((text, reportActiveTab) => {
      if (reportActiveTab === "SentReport") {
        setSentSearch(text);
      } else if (reportActiveTab === "ReceivedReport") {
        setReceivedSearch(text);
      } else if (reportActiveTab === "TeamReport") {
        setTeamSearch(text);
      } else {
        setCoderSearch(text);
      }
    }, 700),
    []
  );

  const filterChangePatientId = (event) => {
    const value = event.target.value;
    let _filters = { ...filters };
    _filters["patientId"].value = value;
    setFilters(_filters);
    setSearch(value);
    debouncedSearch(value, reportActiveTab);
  };

  const ReceivedOptions = [];
  ReceivedReportDetails?.data?.response?.content?.map((item) => {
    return ReceivedOptions?.push({ label: item.sender, value: item.sender });
  });
  const SentOptions = [];
  const uniqueRoles = new Set();

  SentReportDetails?.data?.response?.data?.forEach((data) => {
    data?.receivedUsers?.forEach((item) => {
      const role = item.role;
      if (!uniqueRoles.has(role)) {
        SentOptions.push({ label: role, value: role });
        uniqueRoles.add(role);
      }
    });
  });
  const dosOnChange = (selectedOption) => {
    const selectedValue = selectedOption.value;
    setSelectedCoderOpt(selectedValue);
  };

  const onPageChange = (e) => {
    setPaginationFirst(e.first);
    setPageNo(e.page);
    setTableLoading(true);
  };
  const onReceivedPageChange = (e) => {
    setPaginationReceivedFirst(e.first);
    setReceivedPageNo(e.page);
  };
  const onSentPageChange = (e) => {
    setPaginationSentFirst(e.first);
    setSentPageNo(e.page);
  };
  const onTeamPageChange = (e) => {
    setPaginationSentFirst(e.first);
    setTeamPageNo(e.page);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedRows([]);
    setSelectAll(false);
  };

  const handleDatePickerChange = (date, dateString) => {
    const formattedDates = dateString?.map((date, index) => {
      const formattedDate =
        index === 1
          ? date && `${date}T23:59:59.999Z`
          : date && `${date}T00:00:00.000Z`;
      return formattedDate;
    });
    setStartDate(formattedDates[0]);
    setEndDate(formattedDates[1]);
    setSelectedDates(date);
  };

  const handleReceivedDatePicker = (date, dateString) => {
    const formattedDates = dateString?.map((date, index) => {
      const formattedDate =
        index === 1
          ? date && `${date}T23:59:59.999Z`
          : date && `${date}T00:00:00.000Z`;
      return formattedDate;
    });
    setReceivedStartDate(formattedDates[0]);
    setReceivedEndDate(formattedDates[1]);
    setSelectedDates(date);
  };
  const handleTeamPicker = (date, dateString) => {
    const formattedDates = dateString?.map((date, index) => {
      const formattedDate =
        index === 1
          ? date && `${date}T23:59:59.999Z`
          : date && `${date}T00:00:00.000Z`;
      return formattedDate;
    });
    setTeamStartDate(formattedDates[0]);
    setTeamEndDate(formattedDates[1]);
    setSelectedDates(date);
  };
  const handleCoderPicker = (date, dateString) => {
    const formattedDates = dateString?.map((date, index) => {
      const formattedDate =
        index === 1
          ? date && `${date}T23:59:59.999Z`
          : date && `${date}T00:00:00.000Z`;
      return formattedDate;
    });
    setSelectedDates(date);
    setCoderStartDate(formattedDates[0]);
    setCoderEndDate(formattedDates[1]);
  };

  const handleTabs = (name) => {
    setSelectedDates(null);
    dispatch(getActiveTab(name));
    setSearch("");
    setReceivedSearch("");
    setSentSearch("");
    setTeamSearch("");
    setCoderSearch("");
    setSelectedCoderOpt("")
  };
  useEffect(() => {
    setIsLoading(false);

    if (reportActiveTab === "SentReport") {
      dispatch(
        getSentDetails(sentPageNo, startDate, endDate, sentSearch, sort)
      );
    }
    if (reportActiveTab === "ReceivedReport") {
      dispatch(
        getReceivedDetails(
          receivedPageNo,
          receivedStartDate,
          receivedEndDate,
          receivedSearch,
          sort
        )
      );
    }

    if (!reportActiveTab || reportActiveTab === "AuditReport") {
      dispatch(
        getReportDetails(
          pageNo,
          coderStartDate,
          coderEndDate,
          coderSearch,
          selectedCoderOpt,
          sort
        )
      );
    }

    if (reportActiveTab === "TeamReport") {
      dispatch(
        getTeamReportDetails(
          teamPageNo,
          teamStartDate,
          teamEndDate,
          teamSearch,
          sort
        )
      );
    }

    if (ExportResponse) {
      setIsModalVisible(false);
    }
  }, [
    pageNo,
    sentPageNo,
    receivedPageNo,
    reportActiveTab,
    ExportResponse,
    selectedCoderOpt,
    coderSearch,
    coderStartDate,
    coderEndDate,
    startDate,
    endDate,
    sentSearch,
    receivedPageNo,
    receivedStartDate,
    receivedEndDate,
    receivedSearch,
    reportActiveTab,
    sort,
    teamSearch,
    teamEndDate,
    teamStartDate,
    teamPageNo,
  ]);

  useEffect(() => {
    setFilteredCoder(ReportPatientDetails?.response);
  }, [ReportPatientDetails, reportActiveTab]);

  useEffect(() => {
    const page = new URLSearchParams(window.location.search).get("page");
    const limit = new URLSearchParams(window.location.search).get("limit");
    if (reportActiveTab === "ReceivedReport" && page) {
      setReceivedPageNo(page);
      setPaginationReceivedFirst(limit);
    } else if (reportActiveTab === "SentReport" && page) {
      setSentPageNo(page);
      setPaginationSentFirst(limit);
    } else if (reportActiveTab === "TeamReport" && page) {
      setTeamPageNo(page);
      setPaginationSentFirst(limit);
    }
  }, [reportActiveTab]);

  const backRender = () => {
    const user = localStorage.getItem("userRole");
    if (user == "supervisor") {
      route.push("/supervisor/report?page=0&limit=0");
    }
  };

  return (
    <>
      <Header />
      <div className={styles.maincontainer}>
        <div class="content-body">
          {!ReportPatientDetails?.response ? (
            <SpinnerDots />
          ) : (
            <div className="container-fluid">
              <div className="row">
                <div className="col-xl-12">
                  <div className="">
                    <div className="card-body p-0">
                      <div className="table-responsive active-projects task-table">
                        <div className="tbl-caption  align-items-center">
                          <div className="row filter-contain">
                            <div className="col-xl-2">
                              <label>Search by Name / ID</label>
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
                                  maxLength={25}
                                  value={search}
                                  onKeyDown={(e) => {
                                    // Prevent input of backslash ("\")
                                    if (e.key === "\\") {
                                      e.preventDefault();
                                    }
                                  }}
                                />
                              </div>
                            </div>
                            {!reportActiveTab ||
                            reportActiveTab === "AuditReport" ? (
                              <div className="col-xl-2">
                                <label>Select Status</label>
                                <div class="form-group has-search">
                                  {/* <InputText
                                  type="text"
                                  onChange={(e) => filterChangePatientName(e)}
                                  className="form-control new-form-control"
                                  placeholder="Status"
                                /> */}
                                  {/* {reportActiveTab  === "AuditReport" && ( */}
                                  <Select
                                    onChange={(selectedOption) => {
                                      dosOnChange(selectedOption);
                                    }}
                                    options={statusOptions}
                                    className="custom-react-react-select"
                                    isSearchable={false}
                                  />
                                  {/* )} */}
                                </div>
                              </div>
                            ) : null}

                            <div className="col-xl-2">
                              <label>
                                {" "}
                                {reportActiveTab === "ReceivedReport"
                                  ? "Received Date"
                                  : reportActiveTab === "SentReport"
                                  ? "Sent Date"
                                  : !reportActiveTab ||
                                    reportActiveTab === "AuditReport"
                                  ? "Audit Date"
                                  : "Select Date"}
                              </label>
                              <div>
                                <RangePicker
                                  value={selectedDates}
                                  onChange={
                                    reportActiveTab === "SentReport"
                                      ? handleDatePickerChange
                                      : reportActiveTab === "ReceivedReport"
                                      ? handleReceivedDatePicker
                                      : reportActiveTab === "TeamReport"
                                      ? handleTeamPicker
                                      : handleCoderPicker
                                  }
                                  disabledDate={(current) =>
                                    disableFutureDate(current)
                                  }
                                />
                              </div>
                            </div>

                            {(!reportActiveTab ||
                              reportActiveTab === "AuditReport") && (
                              <div className="col-xl-6">
                                <div className="row flr">
                                  <Tooltip
                                    title={
                                      rowsLength?.length === 0
                                        ? "Select report to export"
                                        : ""
                                    }
                                  >
                                    <button
                                      onClick={() => {
                                        setIsModalVisible(true);
                                      }}
                                      className={styles.export}
                                      disabled={
                                        rowsLength?.length > 0 ||
                                        rowsLength?.data?.length > 0
                                          ? false
                                          : true
                                      }
                                      style={{ color: "#04306f" }}
                                    >
                                      <ExportImg />
                                      Export
                                    </button>
                                  </Tooltip>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <div
                          id="task-tbl_wrapper"
                          className="dataTables_wrapper no-footer"
                        >
                          <div
                            className="profile-tab"
                            style={{ marginTop: "20px" }}
                          >
                            <div className="custom-tab-1">
                              <Tab.Container
                                defaultActiveKey={
                                  reportActiveTab === "ReceivedReport"
                                    ? "meatCriteria"
                                    : reportActiveTab === "SentReport"
                                    ? "comboDiseases"
                                    : "validDiseases"
                                }
                              >
                                <Nav as="ul" className="nav nav-tabs">
                                  <Nav.Item
                                    as="li"
                                    className="nav-item"
                                    onClick={() => {
                                      handleTabs("AuditReport");
                                      backRender();
                                      dispatch(selectedReport(null));
                                    }}
                                  >
                                    <Nav.Link
                                      to="#my-posts"
                                      eventKey="validDiseases"
                                    >
                                      Audit Report
                                    </Nav.Link>
                                  </Nav.Item>
                                  <Nav.Item
                                    as="li"
                                    className="nav-item"
                                    onClick={() => {
                                      handleTabs("TeamReport");
                                      backRender();
                                    }}
                                  >
                                    <Nav.Link to="#my-posts" eventKey="team">
                                      Team Report
                                    </Nav.Link>
                                  </Nav.Item>
                                  <Nav.Item
                                    as="li"
                                    className="nav-item"
                                    onClick={() => {
                                      handleTabs("SentReport");
                                      backRender();
                                    }}
                                  >
                                    <Nav.Link
                                      to="#my-posts"
                                      eventKey="comboDiseases"
                                    >
                                      Sent Report
                                    </Nav.Link>
                                  </Nav.Item>
                                  <Nav.Item
                                    as="li"
                                    className="nav-item"
                                    onClick={() => {
                                      handleTabs("ReceivedReport");
                                      backRender();
                                    }}
                                  >
                                    <Nav.Link
                                      to="#my-posts"
                                      eventKey="meatCriteria"
                                    >
                                      Received Report
                                    </Nav.Link>
                                  </Nav.Item>
                                </Nav>
                                <Tab.Content>
                                  <Tab.Pane
                                    id="my-posts"
                                    eventKey="validDiseases"
                                  >
                                    <CoderReport
                                      setModal={setModal}
                                      modal={modal}
                                      reportListAll={filteredCOder}
                                      paginationFirst={paginationFirst}
                                      ReportPatientDetails={
                                        ReportPatientDetails?.response
                                      }
                                      onPageChange={onPageChange}
                                      comments={comments}
                                      setComments={setComments}
                                      setSelectedRows={setSelectedRows}
                                      selectedRows={selectedRows}
                                      setSelectAll={setSelectAll}
                                      selectAll={selectAll}
                                      setSortOrder={setCoderSortOrder}
                                      sortOrder={coderSortOrder}
                                      setSort={setSort}
                                      l2Auditor={true}
                                    />
                                  </Tab.Pane>
                                  <Tab.Pane id="my-posts" eventKey="team">
                                    {TeamReportDetails?.response?.data && (
                                      <TeamReport
                                        setModal={setModal}
                                        modal={modal}
                                        paginationFirst={paginationFirst}
                                        ReportPatientDetails={
                                          TeamReportDetails?.response
                                        }
                                        onPageChange={onTeamPageChange}
                                        comments={comments}
                                        setComments={setComments}
                                        setSelectedRows={setSelectedRows}
                                        selectedRows={selectedRows}
                                        setSelectAll={setSelectAll}
                                        selectAll={selectAll}
                                        setSortOrder={setTeamSortOrder}
                                        sortOrder={teamSortOrder}
                                        setSort={setSort}
                                      />
                                    )}
                                  </Tab.Pane>
                                  <Tab.Pane
                                    id="my-posts"
                                    eventKey="nonhcc"
                                  ></Tab.Pane>
                                  <Tab.Pane
                                    id="my-posts"
                                    eventKey="comboDiseases"
                                  >
                                    <SentReportTable
                                      paginationFirst={paginationSentFirst}
                                      details={
                                        SentReportDetails?.data?.response
                                      }
                                      onSentPageChange={onSentPageChange}
                                      loading={SentReportDetails?.loading}
                                      setSortOrder={setSentSortOrder}
                                      sortOrder={sentSortOrder}
                                      setSort={setSort}
                                      receivedPageNo={sentPageNo}
                                      receivedStartDate={startDate}
                                      receivedEndDate={endDate}
                                      setSelectedRows={setSelectedRows}
                                      selectedRows={selectedRows}
                                    />
                                  </Tab.Pane>
                                  <Tab.Pane
                                    id="my-posts"
                                    eventKey="meatCriteria"
                                  >
                                    {ReceivedReportDetails?.data?.response
                                      ?.content && (
                                      <ReceivedReport
                                        paginationFirst={
                                          paginationReceivedFirst
                                        }
                                        details={
                                          ReceivedReportDetails?.data?.response
                                        }
                                        onPageChange={onReceivedPageChange}
                                        receivedPageNo={receivedPageNo}
                                        receivedStartDate={receivedStartDate}
                                        receivedEndDate={receivedEndDate}
                                        loading={ReceivedReportDetails?.loading}
                                        setSortOrder={setReceivedSortOrder}
                                        sortOrder={receivedSortOrder}
                                        setSort={setSort}
                                      />
                                    )}
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

                          {modal && (
                            <Modal
                              title="Comments"
                              centered
                              open={modal}
                              onOk={() => {
                                setModal(false);
                              }}
                              onCancel={() => {
                                setModal(false);
                              }}
                              footer={null}
                            >
                              <div
                                className="offcanvas-body"
                                style={{ height: "400px", overflowY: "scroll" }}
                              >
                                <div className="container-fluid">
                                  <div className={styles.heads}>
                                    <span className={styles.headText}>
                                      Hcc codes
                                    </span>
                                  </div>
                                  <div className={styles.data}>
                                    {comments && comments ? (
                                      Object.entries(comments).map(
                                        ([year, commentsArray]) => (
                                          <div key={year}>
                                            <div className={styles.datas}>
                                              {year}
                                            </div>
                                            {commentsArray.map(
                                              (comment, index) => (
                                                <div
                                                  key={index}
                                                  className={styles.comment}
                                                >
                                                  <p>{comment.comment}</p>
                                                </div>
                                              )
                                            )}
                                          </div>
                                        )
                                      )
                                    ) : (
                                      <p>Comments not found</p>
                                    )}
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
          )}
          <Export
            isModalVisible={isModalVisible}
            closeModal={closeModal}
            rowsLength={rowsLength}
            setIsModalVisible={setIsModalVisible}
            setSelectedRows={setSelectedRows}
            selectedRows={selectedRows}
            setSelectAll={setSelectAll}
          />
        </div>
      </div>
    </>
  );
};

export default Index;
