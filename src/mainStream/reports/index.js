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
import { connect, useDispatch, useSelector } from "react-redux";
import InitialCard from "../../mainStream/reports/initialReport";
import SentReport from "../../mainStream/reports/sentReport";
import ReceivedReport from "../../mainStream/reports/receivedReport";
import Export from "./Export";
import { actions as workflowActions } from "../../stores/reviewer/workqueue";
import { actions as reviewerAction } from "../../stores/reviewer/report";
import { actions as supervisorAction } from "../../stores/supervisor/report";
import moment from "moment";
import TableStyle from "../../components/table/table.module.css";
import dayjs from "dayjs";

import {
  selectedReport,
  getReportDetails,
  getSelectUserListReport,
} from "../../store/actions/adminAction/ReportActions";
import Tab from "../components/tags";
import MoreFilter from "../../resusablereport/reports/MoreFilter";
import { SVGICON } from "../../jsx/constant/theme";
import TeamReport from "./teamReport";
import { forEachChild } from "typescript";
import moment from "moment";

const statusOptions = [
  { label: "All", value: "" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Pending", value: "PENDING" },
  { label: "Declined", value: "DECLINED" },
  { label: "Hold", value: "HOLD" },
];
const options = [
  { value: "", label: "All" },
  { value: "REVIEWER", label: "REVIEWER" },
  { value: "SUPERVISOR", label: "SUPERVISOR" },
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
  sentLoader,
  auditReport,
  TeamReportDetails,
  teamReport,
  auditeReportLoading,
}) => {
  const dispatch = useDispatch();
  const ExportResponse = useSelector((state) => state.report?.exportRes);
  const rowsLength = useSelector((state) => state?.report?.row);
  const activeTab = useSelector((state) => state.AuditReport.activetab);

  const AdminReportPatientDetails = useSelector(
    (state) => state.report?.details
  );
  const selectUserList = useSelector(
    (state) => state?.adminReport?.selectedUsers
  );
  const [userRole, setUserRole] = useState(activeTab);
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
  const [selectedDates, setSelectedDates] = useState(null);
  const [receivedSortOrder, setReceivedSortOrder] = useState("DESC");
  const [sentSortOrder, setSentSortOrder] = useState("DESC");
  const [coderSortOrder, setCoderSortOrder] = useState("DESC");
  const [sort, setSort] = useState({ sortDir: "", sortField: "" });
  const [searchVal, setSearchVal] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [search, setSearch] = useState();
  const { RangePicker } = DatePicker;
  const [selectedDateRanges, setSelecteddateRanges] = useState([]);
  const [selectedData, setSelectedData] = useState([]);
  const [selectAllCheckBoxes, setSelectAllCheckBoxes] = useState(false);
  const [teamPageNo, setTeamPageNo] = useState(0);
  const [paginationTeamFirst, setPaginationTeamFirst] = useState(0);
  const [selectAllFlags, setSelectAllFlags] = useState(false);
  const [flagPatientsList, setFlagPatientsList] = useState("");

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
          ? date &&
            `${moment(date, "MM-DD-YYYY").format("YYYY-MM-DD")}T23:59:59.999Z`
          : date &&
            `${moment(date, "MM-DD-YYYY").format("YYYY-MM-DD")}T00:00:00.000Z`;
      return formattedDate;
    });
    setSelectedDates((prevDates) => ({
      ...prevDates,
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

    dispatch(getActiveTab(name));
    setSearch();
    setSearchVal([]);
    setFlagPatientsList();
    setSelectAllFlags(false);
    if (name !== "Admin") {
      setSelectedData([]);
      setSelectAllCheckBoxes(false);
    }
  };
  const dosOnChange = (selectedOption, name) => {
    const nameString = name?.split(" ").join("");
    setSelectedOptions((prevOptions) => ({
      ...prevOptions,
      [nameString]: selectedOption,
    }));
  };

  const debouncedSearch = useCallback(
    debounce((text, setSearchVal, field) => {
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
    }, 700),
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
  const onTeamPageChange = (e) => {
    setPaginationTeamFirst(e.first);
    setTeamPageNo(e.page);
  };

  const getTabsForRole = (role) => {
    switch (role) {
      case "reviewer":
        return ["Reviewer", "Sent", "Received"];
      case "admin":
        return ["Admin", "Sent", "Received"];
      case "tenant_admin":
        return ["Admin", "Sent", "Received"];
      case "supervisor":
        return ["Audit", "Team", "Sent", "Received"];
      default:
        return [];
    }
  };

  const tabs = getTabsForRole(userRole);

  const optionsUser =
    selectUserList?.data?.response?.map((res) => ({
      value: res.userName,
      label: res.firstName + " " + res.lastName,
    })) || [];
  if (optionsUser.length > 0) {
    optionsUser.unshift({ value: "", label: "All" });
  }
  const checkedList = [
    {
      id: 1,
      name: "Status",
      isSelect: !activeTab || activeTab === "Admin" ? true : false,
      options: statusOptions,
    },
    {
      id: 2,
      name: "User Role",
      isSelect: true,
      options: !activeTab || activeTab === "Admin" ? options : null,
    },
    {
      id: 3,
      name: "User",
      isSelect: true,
      options: optionsUser,
    },
  ];

  const handleHeaderCheckboxChange = () => {
    setSelectAllFlags(!selectAllFlags);
    if (activeTab === "Team" || activeTab === "Audit") {
      const updatedRows = selectAllFlags
        ? []
        : TeamReportDetails?.data?.response?.flagIdCountDTOs?.flatMap(
            (item) => item?.patientIds
          );
      setFlagPatientsList(updatedRows?.join(","));
    } else if (activeTab === "Admin") {
      const updatedRows = selectAllFlags
        ? []
        : AdminReportPatientDetails?.response?.flagIdCountDTOs?.flatMap(
            (item) => item?.patientIds
          );
      setFlagPatientsList(updatedRows?.join(","));
    } else {
      const updatedRows = selectAllFlags
        ? []
        : ReportPatientDetails?.response?.flagIdCountDTOs?.flatMap(
            (item) => item?.patientIds
          );
      setFlagPatientsList(updatedRows?.join(","));
    }
  };

  useEffect(() => {
    workFgetFlagsowData();
  }, []);

  useEffect(() => {
    const coderSearchString = searchVal.find(
      (item) => item.field === "initialSearch"
    )?.search;
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
    } else if (activeTab === "Admin") {
      dispatch(
        getReportDetails({
          startDate: selectedDateRanges?.Admin?.from,
          endDate: selectedDateRanges?.Admin?.to,
          search: coderSearchString ? coderSearchString : "",
          filter: selectedOptions?.Status?.value,
          userName: selectedOptions?.UserRole?.value
            ? selectedOptions?.UserRole?.value
            : "",
          sort: sort,
          selectManager:
            selectedOptions?.User?.value &&
            selectedOptions?.UserRole?.value !== "All"
              ? selectedOptions?.User?.value
              : "",
          flagsList: flagPatientsList ? flagPatientsList : "",
        })
      );
    } else if (activeTab === "Audit") {
      auditReport({
        pagenum: pageNo,
        startDate: selectedDateRanges?.Audit?.from,
        endDate: selectedDateRanges?.Audit?.to,
        search: coderSearchString ? coderSearchString : "",
        filter: selectedOptions?.reviewerStatus?.value
          ? selectedOptions?.reviewerStatus?.value
          : "",
        sort: sort,
        flagsList: flagPatientsList ? flagPatientsList : "",
      });
    } else if (activeTab === "Team") {
      teamReport({
        pagenum: teamPageNo,
        startDate: selectedDateRanges?.Team?.from,
        endDate: selectedDateRanges?.Team?.to,
        search: coderSearchString ? coderSearchString : "",
        sort: sort,
        flagsList: flagPatientsList ? flagPatientsList : "",
      });
    } else if (activeTab === "Reviewer") {
      reviewerReport({
        pagenum: pageNo,
        startDate: selectedDateRanges?.Reviewer?.from,
        endDate: selectedDateRanges?.Reviewer?.to,
        search: coderSearchString ? coderSearchString : "",
        filter: selectedOptions?.reviewerStatus?.value,
        sort: sort,
        flagsList: flagPatientsList ? flagPatientsList : "",
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
    activeTab,
    selectAllFlags,
  ]);

  useEffect(() => {
    setFilteredCoder(ReportPatientDetails?.response);
  }, [ReportPatientDetails]);

  useEffect(() => {
    setFilteredCoder(AdminReportPatientDetails?.response);
  }, [AdminReportPatientDetails]);

  useEffect(() => {
    const page = new URLSearchParams(window.location.search).get("page");
    const limit = new URLSearchParams(window.location.search).get("limit");
    if (activeTab === "Received" && page) {
      setReceivedPageNo(page);
      setPaginationReceivedFirst(limit);
    } else if (activeTab === "Sent" && page) {
      setSentPageNo(page);
      setPaginationSentFirst(limit);
    }
    setUserRole(localStorage.getItem("userRole"));
  }, [activeTab]);

  useEffect(() => {
    if (selectedOptions?.UserRole?.value) {
      dispatch(getSelectUserListReport(selectedOptions?.UserRole?.value));
    }
  }, [selectedOptions?.UserRole]);
  const today = dayjs();


  return (
    <div>
      <Header />
      <div className="content-body">
        <div className="container-fluid">
          <div className="row">
            <div className="col-xl-12">
              <div>
                <Tab
                  activeTab={activeTab}
                  handleTabs={handleTabs}
                  tabs={tabs}
                />

                <div className="tbl-caption  align-items-center">
                  <div className="tbl-caption  align-items-center">
                    <div className={`row filter-contain mt-4 mb-0 d-flex`}>
                      <div className="col-xl-10 d-flex">
                        <div className={`w-100 row mb-0 d-flex`}>
                          <div className="col-xl-2">
                            <div className="d-flex w-100">
                              <label className="labelStyle d-flex m-auto p-2">
                                {" "}
                                Search
                              </label>
                              <div className="form-group has-search2 w-100">
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

                          {!activeTab || activeTab === "Reviewer" ? (
                            <div className="col-xl-2">
                              <div className="d-flex w-100">
                                <label className="labelStyle d-flex m-auto  p-2">
                                  {" "}
                                  Status
                                </label>
                                <div className="form-group has-search w-100">
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
                                </div>
                              </div>
                            </div>
                          ) : null}

                          <div className="col-xl-2 d-flex">
                            <div className="d-flex w-100">
                              <label className="labelStyle d-flex  p-2">
                                {" "}
                                Date
                              </label>
                              <div>
                                <RangePicker
                                  style={{
                                    borderRadius: "0 5px 5px 0",
                                    width: "100%",
                                  }}
                                  format="MM-DD-YYYY"
                                  value={
                                    selectedDates
                                      ? selectedDates[activeTab]
                                      : [today, today]
                                  }
                                  onChange={(date, dateString) =>
                                    handleCoderPicker(
                                      date,
                                      dateString,
                                      activeTab
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
                          {(!activeTab ||
                            activeTab === "Admin" ||
                            activeTab === "Audit" ||
                            activeTab === "Team" ||
                            activeTab === "Reviewer") && (
                            <div className="col-xl-2 d-flex pt-2">
                              <div>
                                <input
                                  type="checkbox"
                                  onChange={handleHeaderCheckboxChange}
                                  className={
                                    styles.checkAlign +
                                    (selectAllFlags
                                      ? " " + TableStyle.customChecked
                                      : "")
                                  }
                                  checked={selectAllFlags}
                                />
                              </div>
                              <span
                                className={`pl-4 text-center ${styles.pName}`}
                              >
                                All Flags
                              </span>
                            </div>
                          )}
                          {selectedData?.length > 0 &&
                            selectedData?.map((info) => (
                              <div className="col-xl-2" key={info.id}>
                                <div className="d-flex w-100">
                                  {info?.name && (
                                    <label className="labelStyle d-flex m-auto p-2">
                                      {" "}
                                      {info.name}
                                    </label>
                                  )}
                                  <div className="form-group has-search2 w-100">
                                    {info?.isSearch && (
                                      <FontAwesomeIcon
                                        className="fa fa-search form-control-feedback"
                                        icon={faSearch}
                                      />
                                    )}
                                    {info?.isSelect && (
                                      <Select
                                        onChange={(selectedOption) => {
                                          dosOnChange(
                                            selectedOption,
                                            info?.name
                                          );
                                        }}
                                        options={
                                          info?.name === "User"
                                            ? optionsUser
                                            : info?.options
                                        }
                                        className={`custom-react-select`}
                                        isSearchable={false}
                                        value={selectedOptions[info?.name]}
                                      />
                                    )}
                                    {info?.isRangePikcer && (
                                      <div className="dateRangeSize">
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
                                          className="newReportPicker"
                                        />
                                      </div>
                                    )}

                                    {info?.isSearch && (
                                      <InputText
                                        name={info?.name}
                                        type="text"
                                        onChange={(e) =>
                                          filterChangePatientId(e)
                                        }
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

                      <div
                        className={`
                      col-xl-2
                        d-flex justify-content-end`}
                      >
                        <div>
                          {activeTab === "Admin" && (
                            <div
                              className={`col-xl-${
                                selectedData?.length === 0 ? "10" : "0"
                              }py-2`}
                            >
                              <MoreFilter
                                checkedList={checkedList}
                                selectAll={selectAllCheckBoxes}
                                setSelectAll={setSelectAllCheckBoxes}
                                selectedData={selectedData}
                                setSelectedData={setSelectedData}
                              />
                            </div>
                          )}
                        </div>

                        {(!activeTab ||
                          activeTab === "Admin" ||
                          activeTab === "Audit" ||
                          activeTab === "Team" ||
                          activeTab === "Reviewer") && (
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
                              className={`${
                                rowsLength?.length > 0 ||
                                rowsLength?.data?.length > 0
                                  ? styles.export
                                  : styles.exportDisable
                              } `}
                              disabled={rowsLength?.length > 0 ? false : true}
                              style={{
                                color:
                                  rowsLength?.length > 0 ||
                                  rowsLength?.data?.length > 0
                                    ? "#04306f"
                                    : "inherit",
                                display: "flex",
                                padding: "10px",
                                margin: "-10px 0 0 10px",
                              }}
                            >
                              {rowsLength?.length > 0 ||
                              rowsLength?.data?.length > 0 ? (
                                <ExportImg />
                              ) : (
                                SVGICON.exportDisable
                              )}
                              <span style={{ marginTop: "-3px" }}>Export</span>
                            </button>
                          </Tooltip>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  {(activeTab === "Reviewer" || activeTab === "Admin") && (
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
                        activeTab={activeTab}
                      />
                    </div>
                  )}
                  {(activeTab === "Team" || activeTab === "Audit") && (
                    <TeamReport
                      setModal={setModal}
                      modal={modal}
                      reportListAll={TeamReportDetails?.data}
                      paginationFirst={paginationTeamFirst}
                      ReportPatientDetails={TeamReportDetails?.data}
                      onPageChange={onTeamPageChange}
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
                      page={{ teamPageNo, paginationTeamFirst }}
                      loader={auditeReportLoading}
                      activeTab={activeTab}
                    />
                  )}
                  {activeTab === "Sent" && (
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
                  {activeTab === "Received" && (
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
    supervisorReportDetails: state?.supervisor?.report?.auditReport,
    auditeReportLoading: state?.supervisor?.report?.auditeReportLoading,
    TeamReportDetails: state?.supervisor?.report?.teamReport,
    AdminReportDetails: state?.admin?.report?.admin,
  }),
  {
    workFgetFlagsowData: workflowActions.flagsAction,
    reviewerReport: reviewerAction.reviewerReport,
    sentReport: reviewerAction.sentReport,
    receivedReport: reviewerAction.receivedReport,
    teamReport: supervisorAction.teamReport,
    auditReport: supervisorAction.auditReport,
  }
);
export default enhancer(Reports);
