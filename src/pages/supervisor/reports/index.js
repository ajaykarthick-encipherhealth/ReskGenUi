import React, { useState, useEffect, useCallback } from "react";
import Header from "../../../jsx/layouts/nav/Header";
import styles from "../../../resusablereport/reports/report.module.css";
import {
  getActiveTab,
  getReportDetails,
  getTeamReportDetails,
} from "../../../store/actions/l2Action/AuditReportAction";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode } from "primereact/api";
import Select from "react-select";
import { Modal, DatePicker, Tooltip } from "antd";
import ExportImg from "../../../images/svg/Export";
import { debounce } from "../../admin/report/Export";
import { disableFutureDate } from "../../../components/headerFilters/functions";
import { patientDetails } from "../../../stores/authflow/actions";
import {
  getReceivedDetails,
  getSentDetails,
} from "../../../store/actions/ReportActions";
import { connect, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import MoreFilter from "../../../resusablereport/reports/MoreFilter";
import ReviewerReport from "../../../resusablereport/reports/reviewerReport";
import SentReport from "../../../resusablereport/reports/sentReport";
import ReceivedReport from "../../../resusablereport/reports/receivedReport";
import Export from "../../../resusablereport/reports/Export";
import TeamReport from "../../../resusablereport/reports/teamReport";
import { actions as workflowActions } from "../../../stores/reviewer/workqueue";

const statusOptions = [
  { label: "All", value: "ALL" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Pending", value: "PENDING" },
  { label: "Declined", value: "DECLINED" },
  { label: "Hold", value: "HOLD" },
];

const Reports = ({ workFgetFlagsowData }) => {
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
  const [isLoading, setIsLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [filteredCOder, setFilteredCoder] = useState([]);
  const [comments, setComments] = useState();
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAllCheckBoxes, setSelectAllCheckBoxes] = useState(false);
  const [pageNo, setPageNo] = useState(0);
  const [sentPageNo, setSentPageNo] = useState(0);
  const [receivedPageNo, setReceivedPageNo] = useState(0);
  const [selectedData, setSelectedData] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [paginationFirst, setPaginationFirst] = useState(0);
  const [paginationReceivedFirst, setPaginationReceivedFirst] = useState(0);
  const [paginationSentFirst, setPaginationSentFirst] = useState(0);
  const [teamPageNo, setTeamPageNo] = useState(0);
  const [modal, setModal] = useState(false);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [receivedStartDate, setReceivedStartDate] = useState();
  const [receivedEndDate, setReceivedEndDate] = useState();
  const [selectedDates, setSelectedDates] = useState([]);
  const [teamStartDate, setTeamStartDate] = useState();
  const [teamSearch, setTeamSearch] = useState("");
  const [teamEndDate, setTeamEndDate] = useState();
  const [receivedSortOrder, setReceivedSortOrder] = useState("DESC");
  const [sentSortOrder, setSentSortOrder] = useState("DESC");
  const [coderSortOrder, setCoderSortOrder] = useState("DESC");
  const [sort, setSort] = useState({ sortDir: "", sortField: "" });
  const [searchVal, setSearchVal] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [search, setSearch] = useState();
  const { RangePicker } = DatePicker;
  const [selectedDateRanges, setSelecteddateRanges] = useState([]);
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

  const handleCoderPicker = (date, dateString, tabName) => {
    const nameString = tabName?.split(" ").join("");
    const formattedDates = dateString?.map((date, index) => {
      const formattedDate =
        index === 1
          ? date && `${date}T23:59:59.999Z`
          : date && `${date}T00:00:00.000Z`;
      return formattedDate;
    });

    setSelectedDates((prevOptions) => ({
      ...prevOptions,
      [tabName]: date,
    }));
    setSelecteddateRanges((prevOptions) => ({
      ...prevOptions,
      [nameString]: { from: formattedDates[0], to: formattedDates[1] },
    }));
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

  const handleTabs = (name) => {
    setSelectedDates(null);
    setSelecteddateRanges([]);
    localStorage.setItem("activeTab", name);
    dispatch(getActiveTab(name));
    setSearch();
    setSearchVal([]);
  };

  useEffect(() => {
    setIsLoading(false);
    const coderSearchString = searchVal.find(
      (item) => item.field === "initialSearch"
    )?.search;
    setIsLoading(false);
    const activeTabFromStorage = localStorage.getItem("activeTab");
    const activeTab = activeTabFromStorage
      ? activeTabFromStorage
      : "Audit Report";
    dispatch(getActiveTab(activeTab));

    if (activeTab === "Sent") {
      dispatch(
        getSentDetails(
          sentPageNo,
          selectedDateRanges?.Sent?.from,
          selectedDateRanges?.Sent?.to,
          coderSearchString ? coderSearchString : "",
          sort
        )
      );
    } else if (activeTab === "Received") {
      dispatch(
        getReceivedDetails(
          receivedPageNo,
          selectedDateRanges?.Received?.from,
          selectedDateRanges?.Received?.to,
          coderSearchString ? coderSearchString : "",
          sort
        )
      );
    } else {
      dispatch(
        getReportDetails(
          pageNo,
          selectedDateRanges?.AuditReport?.from,
          selectedDateRanges?.AuditReport?.to,
          coderSearchString ? coderSearchString : "",
          selectedOptions?.reviewerStatus
            ? selectedOptions?.reviewerStatus
            : "",
          sort
        )
      );
    }
    if (reportActiveTab === "TeamReport") {
      dispatch(
        getTeamReportDetails(
          teamPageNo,
          selectedDateRanges?.TeamReport?.from,
          selectedDateRanges?.TeamReport?.to,
          coderSearchString ? coderSearchString : "",
          sort
        )
      );
    }

    if (ExportResponse) {
      setIsModalVisible(false);
    }
    workFgetFlagsowData();
  }, [
    pageNo,
    sentPageNo,
    receivedPageNo,
    receivedPageNo,
    receivedSortOrder,
    sort,
    searchVal,
    selectedOptions,
    selectedDateRanges,
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

  const gotoPatientDetails = (data) => {
    dispatch(patientDetails(data));
    if (data.computing == 2) {
      const controller = new AbortController();
      const { signal } = controller;
      controller.abort();
      localStorage.setItem("patientId", data.patientId);
      navigate.push("/reviewer/patients/details");
    } else {
      notification.warning({
        message: data.patientId + " file not processed Please wait",
      });
    }
  };

  const dosOnChange = (selectedOption, name) => {
    const nameString = name?.split(" ").join("");
    setSelectedOptions((prevOptions) => ({
      ...prevOptions,
      [nameString]: selectedOption?.value,
    }));
  };

  const debouncedSearch = useCallback(
    debounce(
      (
        text,

        setSearchVal,
        field
      ) => {
        setSearchVal((prev) => {
          const existingIndex = prev.findIndex((item) => item.field === field);
          if (existingIndex !== -1) {
            return prev.map((item, index) => {
              if (index === existingIndex) {
                return { ...item, search: text };
              }
              return item;
            });
          } else {
            return [...prev, { search: text, field: field }];
          }
        });
      },
      700
    ),
    []
  );
  const filterChangePatientId = (event) => {
    const value = event.target.value;

    let _filters = { ...filters };
    _filters["patientId"].value = value;
    setFilters(_filters);
    setSearch({
      name: event.target.name,
      searchval: value,
    });

    const field = event.target.name;
    debouncedSearch(value, setSearchVal, field);
  };
  return (
    <div>
      <Header />
      <div className="content-body">
        <div className="container-fluid">
          <div className="row">
            <div className="col-xl-12">
              <div>
                <div
                  className={styles.buttonContainer}
                  style={{ width: "40% !important" }}
                >
                  <div className={styles.group}>
                    <button
                      className={
                        reportActiveTab === "Audit Report"
                          ? `${styles.active}`
                          : ""
                      }
                      onClick={() => {
                        handleTabs("Audit Report");
                      }}
                    >
                      Audit Report
                    </button>
                    <button
                      className={
                        reportActiveTab === "Team Report"
                          ? `${styles.active}`
                          : ""
                      }
                      onClick={() => {
                        handleTabs("Team Report");
                      }}
                    >
                      Team Report
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
                        reportActiveTab === "Received" ? `${styles.active}` : ""
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
                      className={`row filter-contain mt-4 mb-${
                        selectedData?.length > 0 ? "3" : "0"
                      } `}
                    >
                      <div className="col-xl-2">
                        <div className="d-flex w-100">
                          <label className="labelStyle d-flex m-auto">
                            {" "}
                            Search
                          </label>
                          <div class="form-group has-search2 w-100">
                            <FontAwesomeIcon
                              className="fa fa-search form-control-feedback"
                              icon={faSearch}
                            />

                            <InputText
                              name="initialSearch"
                              type="text"
                              onChange={(e) => filterChangePatientId(e)}
                              className="form-control new-form-control reportInput"
                              placeholder="Search"
                              maxLength={25}
                              value={search ? search?.searchVal : ""}
                              onKeyDown={(e) => {
                                // Prevent input of backslash ("\")
                                if (e.key === "\\") {
                                  e.preventDefault();
                                }
                              }}
                            />

                            {/* )} */}
                          </div>
                        </div>
                      </div>

                      {!reportActiveTab ||
                      reportActiveTab === "Audit Report" ? (
                        <div className="col-xl-2">
                          <div className="d-flex w-100">
                            <label className="labelStyle d-flex m-auto">
                              {" "}
                              Status
                            </label>
                            <div class="form-group has-search w-100">
                              <Select
                                onChange={(selectedOption) => {
                                  dosOnChange(
                                    selectedOption,
                                    "reviewer Status"
                                  );
                                }}
                                options={statusOptions}
                                className={`custom-react-select`}
                                isSearchable={false}
                              />
                              {/* )} */}
                            </div>
                          </div>
                        </div>
                      ) : null}

                      <div className="col-xl-2 d-flex">
                        <div className="d-flex w-100">
                          <label className="labelStyle d-flex m-auto">
                            {" "}
                            Date
                          </label>
                          <div>
                            <RangePicker
                              style={{
                                borderRadius: "0 5px 5px 0",
                                width: "100%",
                              }}
                              value={
                                selectedDates
                                  ? selectedDates[reportActiveTab]
                                  : undefined
                              }
                              onChange={(date, dateString) =>
                                handleCoderPicker(
                                  date,
                                  dateString,
                                  reportActiveTab
                                )
                              }
                              disabledDate={(current) =>
                                disableFutureDate(current)
                              }
                            />
                          </div>
                        </div>
                      </div>
                      {!reportActiveTab ||
                      reportActiveTab === "Audit Report" ? (
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
                      ) : null}
                    </div>
                  </div>
                </div>

                <div>
                  {reportActiveTab === "Audit Report" && (
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
                        patientDetails={patientDetails}
                        setSelectedRows={setSelectedRows}
                        selectedRows={selectedRows}
                        setSelectAll={setSelectAll}
                        selectAll={selectAll}
                        setSortOrder={setCoderSortOrder}
                        sortOrder={coderSortOrder}
                        setSort={setSort}
                        gotoPatientDetails={gotoPatientDetails}
                        page={{ pageNo, paginationFirst }}
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
                  {reportActiveTab === "Team Report" && (
                    <div>
                      {}{" "}
                      <TeamReport
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
                                    <div key={index} className={styles.comment}>
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
  );
};
const enhancer = connect(
  (state) => ({
    getFlagsData: state?.reviewer?.workQueue?.flags?.data,
  }),
  {
    workFgetFlagsowData: workflowActions.flagsAction,
  }
);
export default enhancer(Reports);
