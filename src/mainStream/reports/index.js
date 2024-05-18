import React, { useState, useEffect, useCallback } from "react";
import Header from "../../jsx/layouts/nav/Header";
import styles from "./report.module.css";
import { getActiveTab } from "../../store/actions/l2Action/AuditReportAction";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode } from "primereact/api";
import Select from "react-select";
import { Modal, DatePicker, Tooltip } from "antd";
import ExportImg from "../../images/svg/Export";
import { debounce } from "../../../src/pages/admin/reports/Export";
import { disableFutureDate } from "../../components/headerFilters/functions";
import { patientDetails } from "../../stores/authflow/actions";
import { connect, useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import InitialCard from "../../mainStream/reports/initialReport";
import SentReport from "../../mainStream/reports/sentReport";
import ReceivedReport from "../../mainStream/reports/receivedReport";
import Export from "../../resusablereport/reports/Export";
import { actions as workflowActions } from "../../stores/reviewer/workqueue";
import { actions as reviewerAction } from "../../stores/reviewer/report";
import { selectedReport } from "../../store/actions/adminAction/ReportActions";
import Tab from "../components/tags";

const statusOptions = [
  { label: "All", value: "ALL" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Pending", value: "PENDING" },
  { label: "Declined", value: "DECLINED" },
  { label: "Hold", value: "HOLD" },
];

const Reports = ({
  workFgetFlagsowData,
  reviewerReport,
  ReportPatientDetails,
  reviewerLoader,
  SentReportDetails,
  sentReport,
  ReceivedReportDetails,
  receivedReport,
  receivedLoader,
  sentLoader
}) => {
  const dispatch = useDispatch();
  const ExportResponse = useSelector((state) => state.report?.exportRes);
  const rowsLength = useSelector((state) => state?.report?.row);
  const reportActiveTab = useSelector((state) => state.AuditReport?.activetab);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [filteredCOder, setFilteredCoder] = useState([]);
  const [comments, setComments] = useState();
  const [selectedRows, setSelectedRows] = useState([]);
  const [pageNo, setPageNo] = useState(0);
  const [sentPageNo, setSentPageNo] = useState(0);
  const [receivedPageNo, setReceivedPageNo] = useState(0);
  const [selectAll, setSelectAll] = useState(false);
  const [paginationFirst, setPaginationFirst] = useState(0);
  const [paginationReceivedFirst, setPaginationReceivedFirst] = useState(0);
  const [paginationSentFirst, setPaginationSentFirst] = useState(0);
  const [modal, setModal] = useState(false);
  const [selectedDates, setSelectedDates] = useState([]);
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
      [tabName]: { from: formattedDates[0], to: formattedDates[1] },
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
    workFgetFlagsowData();
  }, []);
  useEffect(() => {
    const coderSearchString = searchVal.find(
      (item) => item.field === "initialSearch"
    )?.search;
    setIsLoading(false);
    const activeTabFromStorage = localStorage.getItem("activeTab");
    const activeTab = activeTabFromStorage ? activeTabFromStorage : "Reviewer";
    dispatch(getActiveTab(activeTab));

    if (activeTab === "Sent") {
      sentReport({
        pagenum: sentPageNo,
        startDate: selectedDateRanges?.Sent?.from,
        endDate: selectedDateRanges?.Sent?.to,
        search: coderSearchString ? coderSearchString : "",
        sort: sort,
      });
    } else if (activeTab === "Received") {
      receivedReport({
        pagenum: receivedPageNo,
        startDate: selectedDateRanges?.Received?.from,
        endDate: selectedDateRanges?.Received?.to,
        search: coderSearchString ? coderSearchString : "",
        sort: sort,
      });
    } else {
      reviewerReport({
        pagenum: pageNo,
        startDate: selectedDateRanges?.Reviewer?.from,
        endDate: selectedDateRanges?.Reviewer?.to,
        search: coderSearchString ? coderSearchString : "",
        filter: selectedOptions?.reviewerStatus,
        sort: sort,
      });
    }

    if (ExportResponse) {
      setIsModalVisible(false);
    }
  }, [
    pageNo,
    sentPageNo,
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
  console.log(receivedLoader,"se")
  return (
    <div>
      <Header />
      <div className="content-body">
        <div className="container-fluid">
          <div className="row">
            <div className="col-xl-12">
              <div>
                <Tab
                  activeTab={reportActiveTab}
                  handleTabs={handleTabs}
                  tabs={["Reviewer", "Sent", "Received"]}
                />
                <div className="tbl-caption  align-items-center">
                  <div className="tbl-caption  align-items-center">
                    <div className={`row filter-contain mt-4 mb-0`}>
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

                      {!reportActiveTab || reportActiveTab === "Reviewer" ? (
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
                              className="newReportPicker"
                            />
                          </div>
                        </div>
                      </div>

                      {!reportActiveTab || reportActiveTab === "Reviewer" ? (
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
                                  dispatch(selectedReport(null));
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
                  {reportActiveTab === "Reviewer" && (
                    <div>
                      <InitialCard
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
                        loader={reviewerLoader}
                      />
                    </div>
                  )}
                  {reportActiveTab === "Sent" && (
                    <div>
                      <SentReport
                        paginationFirst={paginationSentFirst}
                        details={SentReportDetails?.data?.response}
                        onSentPageChange={onSentPageChange}
                        loading={SentReportDetails?.loading}
                        setSortOrder={setSentSortOrder}
                        sortOrder={sentSortOrder}
                        setSort={setSort}
                        receivedPageNo={sentPageNo}
                        receivedStartDate={selectedDateRanges?.Sent?.from}
                        receivedEndDate={selectedDateRanges?.Sent?.to}
                        isPhysician={true}
                        loader={sentLoader}
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
                        receivedStartDate={selectedDateRanges?.Reviewer?.from}
                        receivedEndDate={selectedDateRanges?.Reviewer?.to}
                        loading={ReceivedReportDetails?.loading}
                        setSortOrder={setReceivedSortOrder}
                        sortOrder={receivedSortOrder}
                        setSort={setSort}
                        isPhysician={true}
                        loader={receivedLoader}
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
    ReportPatientDetails: state?.reviewer?.report?.reviewer?.data,
    reviewerLoader: state?.reviewer?.report?.reviewerLoader,
    SentReportDetails: state?.reviewer?.report?.sent,
    sentLoader: state?.reviewer?.report?.senntLoader,
    ReceivedReportDetails: state?.reviewer?.report?.received,
    receivedLoader: state?.reviewer?.report?.receivedLoader,
  }),
  {
    workFgetFlagsowData: workflowActions.flagsAction,
    reviewerReport: reviewerAction.reviewerReport,
    sentReport: reviewerAction.sentReport,
    receivedReport: reviewerAction.receivedReport,
  }
);
export default enhancer(Reports);
