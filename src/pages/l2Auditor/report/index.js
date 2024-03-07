import styles from "./report.module.css";
import React, { useState, useEffect } from "react";
import { Modal, DatePicker } from "antd";
import Header from "../../../jsx/layouts/nav/Header";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Tab, Nav } from "react-bootstrap";
import Select from "react-select";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { FilterMatchMode } from "primereact/api";
import { InputText } from "primereact/inputtext";
import "react-circular-progressbar/dist/styles.css";
import SentReportTable from "../table/sentReport/sentReport";
import ReceivedReport from "../table/receivedReport/receivedReport";
import CoderReport from "../table/CoderReport/coderReport";
import Export, { debounce } from "./Export";
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

const statusOptions = [
  { label: "All", value: "ALL" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Pending", value: "PENDING" },
  { label: "Declined", value: "DECLINED" },
  { label: "Hold", value: "HOLD" },
];
const index = () => {
  const dispatch = useDispatch();
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
  const [activeTab, setActiveTab] = useState("AuditReport");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [filteredCOder, setFilteredCoder] = useState([]);
  const [filteredTeam, setFilteredTeam] = useState([]);
  const [comments, setComments] = useState();
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [pageNo, setPageNo] = useState(0);
  const [sentPageNo, setSentPageNo] = useState(0);
  const [receivedPageNo, setReceivedPageNo] = useState(0);

  const [paginationFirst, setPaginationFirst] = useState(0);
  const [paginationReceivedFirst, setPaginationReceivedFirst] = useState(0);
  const [paginationSentFirst, setPaginationSentFirst] = useState(0);

  const [tableLoading, setTableLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const { RangePicker } = DatePicker;

  const [modalVisible, setModalVisible] = useState(false);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [receivedStartDate, setReceivedStartDate] = useState();
  const [receivedEndDate, setReceivedEndDate] = useState();
  const [coderStartDate, setCoderStartDate] = useState();
  const [coderEndDate, setCoderEndDate] = useState();
  const [selectedDates, setSelectedDates] = useState(null);
  const [selectedCoderOpt, setSelectedCoderOpt] = useState("");
  const [coderSearch, setCoderSearch] = useState("");
  const [sentSearch, setSentSearch] = useState("");
  const [receivedSearch, setReceivedSearch] = useState("");
  const [receivedSortOrder, setReceivedSortOrder] = useState("DESC");
  const [sentSortOrder, setSentSortOrder] = useState("DESC");
  const [coderSortOrder, setCoderSortOrder] = useState("DESC");
  const [teamSortOrder, setTeamSortOrder] = useState("DESC");
  const [sort, setSort] = useState({ sortDir: "", sortField: "" });

  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    patientId: { value: null, matchMode: FilterMatchMode.CONTAINS },
    patientName: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const performanceSearch = (value) => {
    if (activeTab === "SentReport") {
      setSentSearch(value);
    } else if (activeTab === "ReceivedReport") {
      setReceivedSearch(value);
    } else {
      setCoderSearch(value);
    }
  };
  const debouncedSearch = debounce(performanceSearch, 500);

  const filterChangePatientId = (event) => {
    const value = event.target.value;
    let _filters = { ...filters };
    _filters["patientId"].value = value;
    setFilters(_filters);
    debouncedSearch(value);
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

  const handleExport = () => {
    setIsModalVisible(true);
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
    setActiveTab(name);
  };
  useEffect(() => {
    setIsLoading(false);

    if (activeTab === "SentReport") {
      dispatch(
        getSentDetails(sentPageNo, startDate, endDate, sentSearch, sort)
      );
    }
    if (activeTab === "ReceivedReport") {
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

    if (activeTab === "AuditReport") {
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

    if (activeTab === "TeamReport") {
      dispatch(
        getTeamReportDetails(
          pageNo,
          coderStartDate,
          coderEndDate,
          coderSearch,
          selectedCoderOpt,
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
    activeTab,
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
    sort
  ]);

  useEffect(() => {
    setFilteredCoder(ReportPatientDetails?.response);
  }, [ReportPatientDetails, reportActiveTab]);

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
                                />
                              </div>
                            </div>
                            {activeTab === "AuditReport" ? (
                              <div className="col-xl-2">
                                <label>Select Status</label>
                                <div class="form-group has-search">
                                  {/* <InputText
                                  type="text"
                                  onChange={(e) => filterChangePatientName(e)}
                                  className="form-control new-form-control"
                                  placeholder="Status"
                                /> */}
                                  {activeTab === "AuditReport" && (
                                    <Select
                                      onChange={(selectedOption) => {
                                        dosOnChange(selectedOption);
                                      }}
                                      options={statusOptions}
                                      className="custom-react-select"
                                      isSearchable={false}
                                    />
                                  )}
                                </div>
                              </div>
                            ) : null}

                            <div className="col-xl-2">
                              <label>Select Range</label>
                              <div>
                                <RangePicker
                                  value={selectedDates}
                                  onChange={
                                    activeTab === "SentReport"
                                      ? handleDatePickerChange
                                      : activeTab === "ReceivedReport"
                                      ? handleReceivedDatePicker
                                      : handleCoderPicker
                                  }
                                  disabledDate={(current) => 
                                    disableFutureDate(current)
                                  } 
                                />
                              </div>
                            </div>
                            {activeTab === "AuditReport" && (
                              <div className="col-xl-6">
                                <div className="row flr">
                                  <button
                                    onClick={handleExport}
                                    className={
                                      rowsLength?.length === 0
                                        ? styles.csv
                                        : styles.export
                                    }
                                    disabled={
                                      rowsLength?.length > 0 ||
                                      rowsLength?.data?.length > 0
                                        ? false
                                        : true
                                    }
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="15"
                                      height="15"
                                      viewBox="0 0 20 20"
                                      fill="none"
                                      className="me-2"
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
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        <Export
                          isModalVisible={isModalVisible}
                          closeModal={closeModal}
                          rowsLength={rowsLength}
                          setIsModalVisible={setIsModalVisible}
                          setSelectedRows={setSelectedRows}
                          setSelectAll={setSelectAll}
                        />

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
                                        onPageChange={onPageChange}
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
        </div>
      </div>
    </>
  );
};

export default index;
