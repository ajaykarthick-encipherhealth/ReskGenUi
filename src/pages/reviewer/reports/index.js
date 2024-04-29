import React, { useState, useEffect, useCallback } from "react";
import Header from "../../../jsx/layouts/nav/Header";
import styles from "./report.module.css";
import ReviewerReport from "./reviewerReport";
import SentRewiewer from "./sentReport";
import ReceivedReport from "./receivedReport";
import { getActiveTab } from "../../../store/actions/l2Action/AuditReportAction";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode } from "primereact/api";
import Select from "react-select";
import { Modal, DatePicker, Tooltip } from "antd";
import ExportImg from "../../../images/svg/Export";
import { debounce } from "../../admin/report/Export";
import { disableFutureDate } from "../../../components/headerFilters/functions";

import {
  getReceivedDetails,
  getReportDetails,
  getSentDetails,
} from "../../../store/actions/ReportActions";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import SentReport from "./sentReport";
import Export from "../report/Export";

const statusOptions = [
  { label: "All", value: "ALL" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Pending", value: "PENDING" },
  { label: "Declined", value: "DECLINED" },
  { label: "Hold", value: "HOLD" },
];

const Reports = () => {
  const dispatch = useDispatch();
  const route = useRouter();
  const ExportResponse = useSelector((state) => state.report?.exportRes);
  const ReportPatientDetails = useSelector((state) => state.report?.details);
  const SentReportDetails = useSelector((state) => state.report?.sentDetails);
  const ReceivedReportDetails = useSelector(
    (state) => state.report?.receivedDetails
  );
  const rowsLength = useSelector((state) => state?.report?.row);
  const reportActiveTab = useSelector((state) => state.AuditReport?.activetab);

  console.log(reportActiveTab,"active")

  const [isLoading, setIsLoading] = useState(true);
  // const [activeTab, setActiveTab] = useState(
  //   reportActiveTab ? reportActiveTab : "Reviewer"
  // );

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [filteredCOder, setFilteredCoder] = useState([]);
  const [comments, setComments] = useState();
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const [pageNo, setPageNo] = useState(0);
  const [sentPageNo, setSentPageNo] = useState(0);
  const [receivedPageNo, setReceivedPageNo] = useState(0);

  const [paginationFirst, setPaginationFirst] = useState(0);
  const [paginationReceivedFirst, setPaginationReceivedFirst] = useState(0);
  const [paginationSentFirst, setPaginationSentFirst] = useState(0);

  const [modal, setModal] = useState(false);
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
  const [sort, setSort] = useState({ sortDir: "", sortField: "" });
  const [searchVal, setSearchVal] = useState("");

  const [search, setSearch] = useState();
  const { RangePicker } = DatePicker;

  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    patientId: { value: null, matchMode: FilterMatchMode.CONTAINS },
    patientName: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

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

  const onPageChange = (e) => {
    setPaginationFirst(e.first);
    setPageNo(e.page);
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
  const onReceivedPageChange = (e) => {
    setPaginationReceivedFirst(e.first);
    setReceivedPageNo(e.page);
  };
  const onSentPageChange = (e) => {
    setPaginationSentFirst(e.first);
    setSentPageNo(e.page);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedRows([]);
    setSelectAll(false);
  };

  // const handleTabs = (name) => {
  //   setSelectedDates(null);

  //   dispatch(getActiveTab(name));

  // };
  const handleTabs = (name) => {
    setSelectedDates(null);
    localStorage.setItem("activeTab", name);
    dispatch(getActiveTab(name));
  };
  useEffect(() => {
    setIsLoading(false);
    if (reportActiveTab === "Sent") {
      dispatch(
        getSentDetails(sentPageNo, startDate, endDate, sentSearch, sort)
      );
    }
    if (reportActiveTab === "Received") {
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

    if (!reportActiveTab || reportActiveTab === "Reviewer") {
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
    if (ExportResponse) {
      setIsModalVisible(false);
    }
  }, [
    pageNo,
    sentPageNo,
    receivedPageNo,
    reportActiveTab,
    // activeTab,
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
    receivedSortOrder,
    sort,
  ]);
  useEffect(() => {
    setIsLoading(false);
    const activeTabFromStorage = localStorage.getItem("activeTab");
    const activeTab = activeTabFromStorage ? activeTabFromStorage : "Reviewer";
    dispatch(getActiveTab(activeTab));

    if (activeTab === "Sent") {
      dispatch(
        getSentDetails(sentPageNo, startDate, endDate, sentSearch, sort)
      );
    } else if (activeTab === "Received") {
      dispatch(
        getReceivedDetails(
          receivedPageNo,
          receivedStartDate,
          receivedEndDate,
          receivedSearch,
          sort
        )
      );
    } else {
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

    if (ExportResponse) {
      setIsModalVisible(false);
    }
  }, [
    pageNo,
    sentPageNo,
    receivedPageNo,
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
    receivedSortOrder,
    sort,
  ]);

  useEffect(() => {
    setFilteredCoder(ReportPatientDetails?.response);
  }, [ReportPatientDetails]);

  useEffect(() => {
    const page = new URLSearchParams(window.location.search).get("page");
    const limit = new URLSearchParams(window.location.search).get("limit");
    if (reportActiveTab === "Received" && page) {
      setReceivedPageNo(page);
      setPaginationReceivedFirst(limit);
    } else if (reportActiveTab === "Sent" && page) {
      setSentPageNo(page);
      setPaginationSentFirst(limit);
    }
  }, [reportActiveTab]);
  // const gotoPatientDetails = (data) => {
  //   dispatch(patientDetails(data));
  //   if (data.computing == 2) {
  //     const controller = new AbortController();
  //     controller.abort();
  //     localStorage.setItem("patientId", data.patientId);
  //     navigate.push("/reviewer/patients/details");
  //   } else {
  //     notification.warning({
  //       message: data.patientId + " file not processed Please wait",
  //     });
  //   }
  // };
  const backRender = () => {
    const user = localStorage.getItem("userRole");
    if (user == "reviewer") {
      route.push("/reviewer/report?page=0&limit=0");
    }
  };
  const dosOnChange = (selectedOption) => {
    const selectedValue = selectedOption.value;
    setSelectedCoderOpt(selectedValue);
  };
  const debouncedSearch = useCallback(
    debounce((text, reportActiveTab) => {
      if (reportActiveTab === "Sent") {
        setSentSearch(text);
      } else if (reportActiveTab === "Received") {
        setReceivedSearch(text);
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

  return (
    <>
      <div>
        <Header />
        <div className="content-body">
          <div className="container-fluid">
            <div className="row">
              <div className="col-xl-12">
                <div>
                  <div className={styles.buttonContainer}>
                    <div className={styles.group}>
                      <button
                        className={
                          reportActiveTab === "Reviewer"
                            ? `${styles.active}`
                            : ""
                        }
                        onClick={() => {
                          handleTabs("Reviewer");
                        }}
                      >
                        Reviewer
                      </button>
                      <button
                        className={
                          reportActiveTab === "Sent" ? `${styles.active}` : ""
                        }
                        onClick={() => {
                          handleTabs("Sent");
                        }}
                      >
                        Sent
                      </button>
                      <button
                        className={
                          reportActiveTab === "Received"
                            ? `${styles.active}`
                            : ""
                        }
                        onClick={() => {
                          handleTabs("Received");
                        }}
                      >
                        Received
                      </button>
                    </div>
                  </div>

                  <div className="tbl-caption  align-items-center">
                    <div className="tbl-caption  align-items-center">
                      <div
                        className="row filter-contain"
                        style={{ marginTop: "47px" }}
                      >
                        <div className="col-xl-2" style={{ display: "flex" }}>
                          <label className="labelStyle">Search </label>
                          <div class="form-group has-search">
                            <FontAwesomeIcon
                              className="fa fa-search form-control-feedback"
                              icon={faSearch}
                            />
                            <InputText
                              style={{ borderRadius: "0 5px 5px 0" }}
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
                        {!reportActiveTab || reportActiveTab === "Reviewer" ? (
                          <div
                            className="col-xl-2"
                            style={{ display: "flex", width: "214px" }}
                          >
                            <label className="labelStyle"> Status</label>
                            <div class="form-group has-search">
                              <Select
                                onChange={(selectedOption) => {
                                  dosOnChange(selectedOption);
                                }}
                                options={statusOptions}
                                className={`custom-react-select`}
                                isSearchable={false}
                              />
                              {/* )} */}
                            </div>
                          </div>
                        ) : null}

                        <div className="col-xl-2" style={{ display: "flex" }}>
                          <label className="labelStyle"> Date</label>
                          <div>
                            <RangePicker
                              style={{
                                borderRadius: "0 5px 5px 0",
                                width: "125%",
                              }}
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
                          reportActiveTab === "Reviewer") && (
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
                  </div>

                  <div>
                    {reportActiveTab === "Reviewer" && (
                      <div>
                        <ReviewerReport
                          setModal={setModal}
                          modal={modal}
                          reportListAll={filteredCOder}
                          paginationFirst={paginationFirst}
                          ReportPatientDetails={ReportPatientDetails?.response}
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
                          // gotoPatientDetails={gotoPatientDetails}
                        />
                      </div>
                    )}
                    {reportActiveTab === "Sent" && (
                      <div>
                        {}{" "}
                        <SentReport
                          paginationFirst={paginationSentFirst}
                          details={SentReportDetails?.data?.response}
                          onSentPageChange={onSentPageChange}
                          loading={SentReportDetails?.loading}
                          setSortOrder={setSentSortOrder}
                          sortOrder={sentSortOrder}
                          setSort={setSort}
                          receivedPageNo={sentPageNo}
                          receivedStartDate={startDate}
                          receivedEndDate={endDate}
                          isPhysician={true}
                        />
                      </div>
                    )}
                    {reportActiveTab === "Received" && (
                      <div>
                        <ReceivedReport
                          paginationFirst={paginationReceivedFirst}
                          details={ReceivedReportDetails?.data?.response}
                          onPageChange={onReceivedPageChange}
                          receivedPageNo={receivedPageNo}
                          receivedStartDate={receivedStartDate}
                          receivedEndDate={receivedEndDate}
                          loading={ReceivedReportDetails?.loading}
                          setSortOrder={setReceivedSortOrder}
                          sortOrder={receivedSortOrder}
                          setSort={setSort}
                          isPhysician={true}
                        />
                      </div>
                    )}
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
                            <span className={styles.headText}>Hcc codes</span>
                          </div>
                          <div className={styles.data}>
                            {comments && comments ? (
                              Object.entries(comments).map(
                                ([year, commentsArray]) => (
                                  <div key={year}>
                                    <div className={styles.datas}>{year}</div>
                                    {commentsArray.map((comment, index) => (
                                      <div
                                        key={index}
                                        className={styles.comment}
                                      >
                                        <p>{comment.comment}</p>
                                      </div>
                                    ))}
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Reports;
