import React, { useState, useEffect, useCallback } from "react";
import Header from "../../jsx/layouts/nav/Header";
import styles from "./report.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faFileExport } from "@fortawesome/free-solid-svg-icons";
import { FilterMatchMode } from "primereact/api";
import { Modal, DatePicker, Tooltip, Select, Input } from "antd";
import {
  disableFutureDate,
  resetPageNumber,
} from "../../components/headerFilters/functions";
import { patientDetails } from "../../stores/authflow/actions";
import { connect } from "react-redux";
import InitialCard from "../../mainStream/reports/initialReport";
import SentReport from "../../mainStream/reports/sentReport";
import ReceivedReport from "../../mainStream/reports/receivedReport";
import Export from "./Export";
import { actions as workflowActions } from "../../stores/reviewer/workqueue";
import { actions as reviewerAction } from "../../stores/reviewer/report";
import { actions as supervisorAction } from "../../stores/supervisor/report";
import moment from "moment";
import Tab from "../components/tags";
import MoreFilter from "../components/moreFilters/MoreFilter";
import TeamReport from "./teamReport";
import { getStorage, setStorage } from "../../utils/storages";
import { debounce } from "../../components/input";
import { actions as allActions } from "../../stores/admin/report";
import { actions as adminActions } from "../../stores/admin/dashboard";
import { actions as allPatientActions } from "../../stores/admin/workqueue";
import IndividualReceiverReport from "../../pages/reviewer/report/individualreport";
import AdminIndividualReport from "../../pages/admin/report/individualreport";
import SupervisorIndividualReport from "../../pages/supervisor/report/individualreport";
import TenantAdminIndividualReport from "../../pages/tenantAdmin/report/individualreport";
import { useRouter } from "next/router";
import dayjs from "dayjs";

const statusOptions = [
  { label: "Completed", value: "COMPLETED" },
  { label: "Pending", value: "PENDING" },
  { label: "Declined", value: "DECLINED" },
  { label: "Hold", value: "HOLD" },
];
const options = [
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
  supervisorReportDetails,
  teamReport,
  auditeReportLoading,
  AdminReportDetails,
  selectedReport,
  activeTabName,
  tab,
  AdminReportLoader,
  selectUserList,
  selectedRow,
  ExportResponse,
  getReportDetails,
  getActiveTab,
  teamReportLoading,
  getSelectUserListReport,
}) => {
  const router = useRouter();
  const rowsLength = selectedRow;
  const activeTab = activeTabName ? activeTabName : tab;
  const [userRole, setUserRole] = useState("");
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
  const [selectedData, setSelectedData] = useState([]);
  const [selectAllCheckBoxes, setSelectAllCheckBoxes] = useState(false);
  const [teamPageNo, setTeamPageNo] = useState(0);
  const [paginationTeamFirst, setPaginationTeamFirst] = useState(0);
  const [selectAllFlags, setSelectAllFlags] = useState(false);
  const [flagPatientsList, setFlagPatientsList] = useState("");
  const [viewIndividualReport, setViewIndividualReport] = useState({
    status: false,
    data: null,
  });

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
    const reportStatus =
      name === "Sent" ? { sentreport: true } : { isAdminPage: true };
    setSelectedDates(null);
    setSelecteddateRanges([]);
    getActiveTab(name);
    setSearch(null);
    setSearchVal(null);
    setFlagPatientsList();
    setSelectAllFlags(false);
    setSelectAll(false);
    if (name !== "Admin") {
      setSelectedData([]);
      setSelectAllCheckBoxes(false);
    }
    setSelectedRows([]);
    setSelectAll(false);
    setViewIndividualReport({
      status: false,
      data: { page: 0, limit: 0, reportId: "", ...reportStatus },
    });
  };
  const dosOnChange = (selectedOption, name, tabName) => {
    const nameString = name?.split(" ").join("");
    if (name == "User Role" && !selectedOption) {
      setSelectedOptions((prevOptions) => ({
        ...prevOptions,
        UserRole: undefined,
        User: undefined,
      }));
    } else {
      setSelectedOptions((prevOptions) => ({
        ...prevOptions,
        [tabName]: selectedOption,
      }));
    }
  };

  const debouncedSearch = useCallback(
    debounce((text, setSearchVal, field) => {
      // setSearchVal((prev) => {
      //   const existingIndex = prev.findIndex((item) => item.field === field);
      //   if (existingIndex !== -1) {
      //     return prev.map((item, index) => {
      //       if (index === existingIndex) {
      //         return { ...item, search: text };
      //       }
      //       return item;
      //     });
      //   } else {
      //     return [...prev, { search: text, field: field }];
      //   }
      // });
      setSearchVal(text);
    }, 700),
    []
  );
  const filterChangePatientId = (event) => {
    const value = event.target.value;

    let _filters = { ...filters };
    _filters["patientId"].value = value;
    setFilters(_filters);
    // setSearch({
    //   name: event.target.name,
    //   searchval: value,
    // });
    setSearch(value);

    const field = event.target.name;
    debouncedSearch(value, setSearchVal, field);
  };
  const onTeamPageChange = (e) => {
    setPaginationTeamFirst(e.first);
    setTeamPageNo(e.page);
  };

  const getTabsForRole = (role) => {
    switch (role?.toLowerCase()) {
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

  const optionsUser = selectedOptions?.UserRole
    ? selectUserList?.data?.response?.map((res) => ({
        value: res.userName,
        label: res.firstName + " " + res.lastName,
      }))
    : [];

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
    resetPageNumber(resetPageState);
    setSelectAllFlags(!selectAllFlags);
    // if (activeTab === "Team" || activeTab === "Audit") {
    //   const updatedRows = selectAllFlags
    //     ? []
    //     : TeamReportDetails?.data?.response?.flagIdCountDTOs?.flatMap(
    //         (item) => item?.patientIds
    //       );
    //   setFlagPatientsList(updatedRows?.join(","));
    // } else if (activeTab === "Admin") {
    //   const updatedRows = selectAllFlags
    //     ? []
    //     : AdminReportPatientDetails?.data?.response?.flagIdCountDTOs?.flatMap(
    //         (item) => item?.patientIds
    //       );
    //   setFlagPatientsList(updatedRows?.join(","));
    // } else {
    //   const updatedRows = selectAllFlags
    //     ? []
    //     : ReportPatientDetails?.response?.flagIdCountDTOs?.flatMap(
    //         (item) => item?.patientIds
    //       );
    //   setFlagPatientsList(updatedRows?.join(","));
    // }
  };

  const gotoPatientDetails = (data) => {
    patientDetails(data);
    if (data.computing == 2) {
      const controller = new AbortController();
      const { signal } = controller;
      controller.abort();
      setStorage("patientId", data.patientId);
      navigate.push("/reviewer/patients/details");
    } else {
      notification.warning({
        message: data.patientId + " file not processed Please wait",
      });
    }
  };

  const resetPageState =
    activeTab === "Sent"
      ? setSentPageNo
      : activeTab === "Received"
      ? setReceivedPageNo
      : activeTab === "Audit"
      ? setTeamPageNo
      : setPageNo;

  const renderIndividualReport = () => {
    const currentRole = userRole
      ?.split("_")
      .map((item, index) =>
        index === 0 ? item : item.charAt(0).toUpperCase() + item?.slice(1)
      )
      .join("");

    switch (currentRole.toLowerCase()) {
      case "reviewer":
        return (
          <IndividualReceiverReport
            setViewIndividualReport={setViewIndividualReport}
            viewIndividualReport={viewIndividualReport}
          />
        );
      case "admin":
        return (
          <AdminIndividualReport
            setViewIndividualReport={setViewIndividualReport}
            viewIndividualReport={viewIndividualReport}
          />
        );
      case "supervisor":
        return (
          <SupervisorIndividualReport
            setViewIndividualReport={setViewIndividualReport}
            viewIndividualReport={viewIndividualReport}
          />
        );
      case "tenantadmin":
        return (
          <TenantAdminIndividualReport
            setViewIndividualReport={setViewIndividualReport}
            viewIndividualReport={viewIndividualReport}
          />
        );
      default:
        return <></>;
    }
  };

  useEffect(() => {
    workFgetFlagsowData();
  }, []);

  useEffect(() => {
    // const coderSearchString = searchVal?.find(
    //   (item) => item.field === "initialSearch"
    // )?.search;
    // console.log(selectedDateRanges,searchVal,"fil")
    if (activeTab === "Sent") {
      sentReport({
        pagenum: sentPageNo,
        startDate: selectedDateRanges?.Sent?.from,
        endDate: selectedDateRanges?.Sent?.to,
        search: searchVal ? searchVal : "",
        sort: sort,
      });
    } else if (activeTab === "Received") {
      receivedReport({
        pagenum: receivedPageNo,
        startDate: selectedDateRanges?.Received?.from,
        endDate: selectedDateRanges?.Received?.to,
        search: searchVal ? searchVal : "",
        sort: sort,
      });
    } else if (activeTab === "Admin") {
      getReportDetails({
        pagenum: pageNo,
        startDate: selectedDateRanges?.Admin?.from,
        endDate: selectedDateRanges?.Admin?.to,
        search: searchVal ? searchVal : "",
        filter: selectedOptions?.Status,
        userName: selectedOptions?.UserRole ? selectedOptions?.UserRole : "",
        sort: sort,
        selectManager:
          selectedOptions?.User && selectedOptions?.UserRole !== ""
            ? selectedOptions?.User
            : "",
        flagsList: selectAllFlags,
        allPatientIds: false,
      });
    } else if (activeTab === "Audit") {
      auditReport({
        pagenum: teamPageNo,
        startDate: selectedDateRanges?.Audit?.from,
        endDate: selectedDateRanges?.Audit?.to,
        search: searchVal ? searchVal : "",
        filter:  selectedOptions
          ?  selectedOptions[activeTab]
          : "",
        sort: sort,
        flagsList: selectAllFlags,
      });
    } else if (activeTab === "Team") {
      teamReport({
        pagenum: teamPageNo,
        startDate: selectedDateRanges?.Team?.from,
        endDate: selectedDateRanges?.Team?.to,
        search: searchVal ? searchVal : "",
        filter:  selectedOptions
          ?  selectedOptions[activeTab]
          : "",
        sort: sort,
        flagsList: selectAllFlags,
      });
    } else if (activeTab === "Reviewer") {
      reviewerReport({
        pagenum: pageNo,
        startDate: selectedDateRanges?.Reviewer?.from,
        endDate: selectedDateRanges?.Reviewer?.to,
        search: searchVal ? searchVal : "",
        filter: selectedOptions?selectedOptions[activeTab]:"",
        sort: sort,
        flagsList: selectAllFlags,
      });
    }
    if (ExportResponse) {
      setIsModalVisible(false);
    }
  }, [
    teamPageNo,
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
    setFilteredCoder(AdminReportDetails?.data?.response);
  }, [AdminReportDetails]);

  useEffect(() => {
    const page = viewIndividualReport?.data?.page;
    // new URLSearchParams(window.location.search).get("page");
    const limit = viewIndividualReport?.data?.limit;
    // new URLSearchParams(window.location.search).get("limit");
    if (activeTab === "Received" && page && !router.query) {
      setReceivedPageNo(page);
      setPaginationReceivedFirst(limit);
      setSelectedDates(viewIndividualReport?.data?.selectedDates);
      setSearchVal(viewIndividualReport?.data?.searchVal);
      setSelecteddateRanges({
        sent: {
          from: viewIndividualReport?.data?.receivedStartDate,
          t0: viewIndividualReport?.data?.receivedEndDate,
        },
      });
      setSearch(viewIndividualReport?.data?.searchVal);
    } else if (activeTab === "Sent" && page && !router.query) {
      setSentPageNo(page);
      setPaginationSentFirst(limit);
      setSelectedDates(viewIndividualReport?.data?.selectedDates);
      setSearchVal(viewIndividualReport?.data?.searchVal);
      setSelecteddateRanges({
        sent: {
          from: viewIndividualReport?.data?.receivedStartDate,
          t0: viewIndividualReport?.data?.receivedEndDate,
        },
      });
      setSearch(viewIndividualReport?.data?.searchVal);
    }
    setUserRole(getStorage("userRole"));
  }, [activeTab, viewIndividualReport?.data]);

  useEffect(() => {
    if (selectedOptions?.UserRole) {
      getSelectUserListReport({ role: selectedOptions?.UserRole || "" });
    }
  }, [selectedOptions?.UserRole]);

  useEffect(() => {
    const routeData = router?.query;
    if (routeData) {
      const dates = routeData?.selectedDates
        ? JSON.parse(routeData?.selectedDates)
        : [];
      setPageNo(routeData?.pageNo ? JSON.parse(routeData?.pageNo) : 0);
      setPaginationFirst(
        routeData?.paginationFirst ? JSON.parse(routeData?.paginationFirst) : 0
      );
      setSelectedDates(dates);
      setSearchVal(routeData?.searchVal);
      setSelecteddateRanges(
        routeData?.selectedDateRanges
          ? JSON.parse(routeData?.selectedDateRanges)
          : null
      );
      setSearch(routeData?.searchVal);
      setSelectAllFlags(
        routeData?.selectAllFlags
          ? JSON.parse(routeData?.selectAllFlags)
          : false
      );
      setSelectedOptions(
        routeData?.selectedOptions
          ? JSON.parse(routeData?.selectedOptions)
          : null
      );
    }
  }, [router]);

  return viewIndividualReport?.status ? (
    renderIndividualReport()
  ) : (
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
                        <div className={`w-100 row mb-0 d-flex gap-4`}>
                          <div className="col-2">
                            <div className="d-flex w-100">
                              <label className="labelStyle d-flex m-auto p-3">
                                {" "}
                                Search
                              </label>
                              <div style={{ height: "43px" }}>
                                <Input
                                  name="initialSearch"
                                  type="text"
                                  onChange={(e) => {
                                    filterChangePatientId(e);
                                    resetPageNumber(resetPageState);
                                  }}
                                  autoComplete="off"
                                  className={
                                    "w-100 new-search-control2 border-none "
                                  }
                                  placeholder="Search"
                                  maxLength={25}
                                  value={search ? search : null}
                                  onKeyDown={(e) => {
                                    // Prevent input of backslash ("\")
                                    if (e.key === "\\") {
                                      e.preventDefault();
                                    }
                                  }}
                                  onPaste={(e) => {
                                    filterChangePatientId(e);
                                  }}
                                  prefix={
                                    <FontAwesomeIcon
                                      className="searchPrefix"
                                      icon={faSearch}
                                    />
                                  }
                                  allowClear={true}
                                />

                                {/* )} */}
                              </div>
                            </div>
                          </div>

                          {!activeTab ||
                          activeTab === "Reviewer" ||
                          userRole == "supervisor" ? (
                            <div className="col-2">
                              <div className="d-flex w-100">
                                <label className="labelStyle d-flex m-auto  p-2">
                                  {" "}
                                  Status
                                </label>
                                <div className="form-group has-search w-100 custom-react-report-select">
                                  <Select
                                    onChange={(selectedOption) => {
                                      dosOnChange(
                                        selectedOption,
                                        "reviewer Status",
                                        activeTab
                                      );
                                      resetPageNumber(resetPageState);
                                    }}
                                    placeholder="Select Status"
                                    options={statusOptions}
                                    // className={`custom-react-report-select`}
                                    isSearchable={false}
                                    allowClear={true}
                                    value={
                                      selectedOptions
                                        ? selectedOptions[activeTab]
                                        : null
                                    }
                                    style={{width:"150px"}}
                                  />
                                </div>
                                {/* </div> */}
                              </div>
                            </div>
                          ) : null}

                          <div className="col-3 d-flex">
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
                                      ? selectedDates[activeTab]?.map((info) =>
                                          dayjs(info)
                                        )
                                      : []
                                  }
                                  onChange={(date, dateString) => {
                                    handleCoderPicker(
                                      date,
                                      dateString,
                                      activeTab
                                    );
                                    resetPageNumber(resetPageState);
                                  }}
                                  disabledDate={(current) =>
                                    disableFutureDate(current)
                                  }
                                  className="newReportPicker"
                                />
                              </div>
                            </div>
                          </div>

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
                                  <div className="form-group has-search2 w-100 custom-react-report-select">
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
                                          resetPageNumber(resetPageState);
                                        }}
                                        placeholder={`Select ${info.name}`}
                                        options={
                                          info?.name === "User"
                                            ? optionsUser
                                            : info?.options
                                        }
                                        // className={`custom-react-report-select`}
                                        isSearchable={false}
                                        value={selectedOptions[info?.name]}
                                        allowClear={true}
                                        style={{width:"150px"}}
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
                                              ? selectedDates[info?.name]?.map(
                                                  (item) => dayjs(item)
                                                )
                                              : undefined
                                          }
                                          onChange={(date, dateString) => {
                                            handleCoderPicker(
                                              date,
                                              dateString,
                                              info?.name
                                            );
                                            resetPageNumber(resetPageState);
                                          }}
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
                                        onChange={(e) => {
                                          filterChangePatientId(e);
                                          resetPageNumber(resetPageState);
                                        }}
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
                                selectedReport(null);
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
                                // <ExportImg />
                                <FontAwesomeIcon
                                  icon={faFileExport}
                                  className={styles.iconReplaced}
                                  style={{
                                    color:
                                      rowsLength?.data?.length > 0
                                        ? "gray"
                                        : "#04306f",
                                  }}
                                />
                              ) : (
                                <FontAwesomeIcon
                                  icon={faFileExport}
                                  className={styles.iconReplaced}
                                  style={{
                                    color:
                                      rowsLength?.data?.length > 0
                                        ? "#04306f"
                                        : "gray",
                                  }}
                                />
                                // SVGICON.exportDisable
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
                        // gotoPatientDetails={gotoPatientDetails}
                        page={{
                          pageNo,
                          paginationFirst,
                          searchVal,
                          selectedDateRanges:
                            JSON.stringify(selectedDateRanges),
                          selectedDates: JSON.stringify(selectedDates),
                          selectedOptions: JSON.stringify(selectedOptions),
                          sort,
                          selectAllFlags,
                        }}
                        loader={AdminReportLoader}
                        activeTab={activeTab}
                        handleHeaderCheckbox={handleHeaderCheckboxChange}
                        selectAllFlags={selectAllFlags}
                        apiCall={{
                          admin: {
                            pagenum: pageNo,
                            startDate: selectedDateRanges?.Admin?.from
                              ? selectedDateRanges?.Admin?.from
                              : "",
                            endDate: selectedDateRanges?.Admin?.to
                              ? selectedDateRanges?.Admin?.to
                              : "",
                            search: searchVal || "",
                            filter: selectedOptions?.Status?.value
                              ? selectedOptions?.Status?.value
                              : "",
                            userName: selectedOptions?.UserRole?.value
                              ? selectedOptions?.UserRole?.value
                              : "",
                            sort: sort ? sort : "",
                            selectManager:
                              selectedOptions?.User?.value &&
                              selectedOptions?.UserRole?.value !== "All"
                                ? selectedOptions?.User?.value
                                : "",
                            flagsList: flagPatientsList ? flagPatientsList : "",
                            allPatientIds: true,
                          },
                        }}
                      />
                    </div>
                  )}
                  {(activeTab === "Team" || activeTab === "Audit") && (
                    <TeamReport
                      setModal={setModal}
                      modal={modal}
                      reportListAll={
                        activeTab === "Team"
                          ? TeamReportDetails?.data
                          : supervisorReportDetails?.data
                      }
                      paginationFirst={paginationTeamFirst}
                      ReportPatientDetails={
                        activeTab === "Team"
                          ? TeamReportDetails?.data
                          : supervisorReportDetails?.data
                      }
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
                      // gotoPatientDetails={gotoPatientDetails}
                      page={{
                        pageNo: teamPageNo,
                        paginationFirst: paginationTeamFirst,
                        searchVal,
                        selectedDateRanges: JSON.stringify(selectedDateRanges),
                        selectedDates: JSON.stringify(selectedDates),
                        selectedOptions,
                        sort,
                        selectAllFlags,
                      }}
                      loader={
                        activeTab === "Team"
                          ? teamReportLoading
                          : auditeReportLoading
                      }
                      activeTab={activeTab}
                      handleHeaderCheckbox={handleHeaderCheckboxChange}
                      selectAllFlags={selectAllFlags}
                      userRole={userRole}
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
                        setReceivedPageNo={setSentPageNo}
                        setPaginationFirst={setPaginationSentFirst}
                        receivedStartDate={selectedDateRanges?.Sent?.from}
                        receivedEndDate={selectedDateRanges?.Sent?.to}
                        isPhysician={true}
                        loader={sentLoader}
                        userRole={userRole}
                        setViewIndividualReport={setViewIndividualReport}
                        viewIndividualReport={viewIndividualReport}
                        searchVal={searchVal}
                        selectedDates={selectedDates}
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
                        setReceivedPageNo={setReceivedPageNo}
                        setPaginationFirst={setPaginationReceivedFirst}
                        receivedStartDate={selectedDateRanges?.Reviewer?.from}
                        receivedEndDate={selectedDateRanges?.Reviewer?.to}
                        loading={ReceivedReportDetails?.loading}
                        setSortOrder={setReceivedSortOrder}
                        sortOrder={receivedSortOrder}
                        setSort={setSort}
                        isPhysician={true}
                        loader={receivedLoader}
                        setViewIndividualReport={setViewIndividualReport}
                        viewIndividualReport={viewIndividualReport}
                        searchVal={searchVal}
                        selectedDates={selectedDates}
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
    sentLoader: state?.reviewer?.report?.sentLoader,
    ReceivedReportDetails: state?.reviewer?.report?.received,
    receivedLoader: state?.reviewer?.report?.receivedLoader,
    supervisorReportDetails: state?.supervisor?.report?.auditReport,
    auditeReportLoading: state?.supervisor?.report?.auditeReportLoading,
    TeamReportDetails: state?.supervisor?.report?.teamReport,
    AdminReportDetails: state?.admin?.report?.admin,
    AdminReportLoader: state?.admin?.report?.adminLoader,
    activeTabName: state.admin.report?.activeTab,
    selectUserList: state?.admin?.dashboard?.managersList,
    selectedRow: state?.admin?.report?.selectedRow,
    ExportResponse: state?.admin?.report?.exportData,
    teamReportLoading: state?.supervisor?.report?.teamReportLoading,
  }),
  {
    workFgetFlagsowData: workflowActions.flagsAction,
    reviewerReport: reviewerAction.reviewerReport,
    sentReport: reviewerAction.sentReport,
    receivedReport: reviewerAction.receivedReport,
    teamReport: supervisorAction.teamReport,
    auditReport: supervisorAction.auditReport,
    selectedReport: allActions.selectedReport,
    getReportDetails: allActions.adminReport,
    getSelectUserListReport: adminActions.getSelectUserList,
    patientDetails: allPatientActions.getPatientDetails,
    getActiveTab: allActions.activeTab,
    getExportDetails: allActions.getExportDetails,
  }
);
export default enhancer(Reports);
