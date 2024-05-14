import React, { useState, useEffect, useCallback } from "react";
import Header from "../../../jsx/layouts/nav/Header";
import styles from "../../../resusablereport/reports/report.module.css";
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
import { patientDetails } from "../../../stores/authflow/actions";
import {
  getReceivedDetails,
  getReportDetails,
  getSentDetails,
} from "../../../store/actions/ReportActions";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import MoreFilter from "../../../resusablereport/reports/MoreFilter";
import ReviewerReport from "../../../resusablereport/reports/reviewerReport";
import SentReport from "../../../resusablereport/reports/sentReport";
import ReceivedReport from "../../../resusablereport/reports/receivedReport";
import Export from "../../../resusablereport/reports/Export";

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
  console.log(SentReportDetails, "sennt")
  console.log(ReceivedReportDetails, "received")
  const rowsLength = useSelector((state) => state?.report?.row);
  const reportActiveTab = useSelector((state) => state.AuditReport?.activetab);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [filteredCOder, setFilteredCoder] = useState([]);
  const [comments, setComments] = useState();
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAllCheckBoxes, setSelectAllCheckBoxes] = useState(false);
  const [pageNo, setPageNo] = useState(7);
  const [sentPageNo, setSentPageNo] = useState(0);
  const [receivedPageNo, setReceivedPageNo] = useState(0);
  const [selectedData, setSelectedData] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
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
  const [selectedDates, setSelectedDates] = useState([]);
  const [selectedCoderOpt, setSelectedCoderOpt] = useState("");
  const [coderSearch, setCoderSearch] = useState("");
  const [sentSearch, setSentSearch] = useState("");
  const [receivedSearch, setReceivedSearch] = useState("");
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
    const coderSearchString = searchVal.find(
      (item) => item.field === "initialSearch"
    )?.search;
    setIsLoading(false);
    const activeTabFromStorage = localStorage.getItem("activeTab");
    const activeTab = activeTabFromStorage ? activeTabFromStorage : "Reviewer";
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
          selectedDateRanges?.Reviewer?.from,
          selectedDateRanges?.Reviewer?.to,
          coderSearchString ? coderSearchString : "",
          selectedOptions?.reviewerStatus,
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

  const backRender = () => {
    const user = localStorage.getItem("userRole");
    if (user == "reviewer") {
      route.push("/reviewer/report?page=0&limit=0");
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

  const checkedList = [
    {
      id: 1,
      name: "Audited Status",
      isSelect: true,
    },
    {
      id: 2,
      name: "Flag",
      isSelect: true,
    },
    {
      id: 3,
      name: "Raf Score",
      isSelect: false,
      isSearch: true,
    },
    {
      id: 4,
      name: "Patient name",
      isSearch: true,
    },
    {
      id: 12,
      name: "Flag",
      isRangePikcer: true,
    },
    {
      id: 13,
      name: "Raf Score",
      isSelect: false,
      isSearch: true,
    },
    {
      id: 14,
      name: "Patient name",
      isSearch: true,
    },
    {
      id: 22,
      name: "Flag",
      isSelect: true,
    },
    {
      id: 32,
      name: "Raf Score",
      isSelect: false,
      isRangePikcer: true,
    },
    {
      id: 42,
      name: "Patient name",
      isSearch: true,
    },
  ];

  return (
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
                        reportActiveTab === "Reviewer" ? `${styles.active}` : ""
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
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-2">
                        <MoreFilter
                          checkedList={checkedList}
                          selectAll={selectAllCheckBoxes}
                          setSelectAll={setSelectAllCheckBoxes}
                          selectedData={selectedData}
                          setSelectedData={setSelectedData}
                        />
                      </div>
                      { !reportActiveTab || reportActiveTab === "Reviewer" ? 
                        <div className="col-xl-4">
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
                        </div> : null
                      }
                    </div>
                    <div className="row filter-contain">
                      {selectedData?.length > 0 &&
                        selectedData?.map((info) => (
                          <div className="col-xl-2 mt-3">
                            <div className="d-flex w-100">
                              <label className="labelStyle d-flex m-auto">
                                {" "}
                                {info.name}
                              </label>
                              <div className="form-group has-search2 w-100">
                                {info?.isSearch && (
                                  <FontAwesomeIcon
                                    className="fa fa-search form-control-feedback"
                                    icon={faSearch}
                                  />
                                )}
                                {info?.isSelect ? (
                                  <Select
                                    onChange={(selectedOption) => {
                                      dosOnChange(selectedOption, info.name);
                                    }}
                                    options={statusOptions}
                                    className={`custom-react-select`}
                                    isSearchable={false}
                                  />
                                ) : info?.isRangePikcer ? (
                                  <RangePicker
                                    style={{
                                      borderRadius: "0 5px 5px 0",
                                      width: "100%",
                                    }}
                                    value={
                                      selectedDates
                                        ? selectedDates[info?.name]
                                        : undefined
                                    }
                                    onChange={(date, dateString) =>
                                      handleCoderPicker(
                                        date,
                                        dateString,
                                        info?.name
                                      )
                                    }
                                    disabledDate={(current) =>
                                      disableFutureDate(current)
                                    }
                                  />
                                ) : (
                                  <InputText
                                    name={info?.name}
                                    type="text"
                                    onChange={(e) => filterChangePatientId(e)}
                                    className="form-control new-form-control reportInput"
                                    placeholder="Search"
                                    maxLength={25}
                                    value={search?.searchVal}
                                    onKeyDown={(e) => {
                                      // Prevent input of backslash ("\")
                                      if (e.key === "\\") {
                                        e.preventDefault();
                                      }
                                    }}
                                  />
                                )}
                                {/* )} */}
                              </div>
                            </div>
                          </div>
                        ))}
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
                  {console.log(reportActiveTab,"tab")}
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

export default Reports;
