import React, { useState, useEffect, useCallback } from "react";
import Header from "../../jsx/layouts/nav/Header";
import styles from "./report.module.css";
import ReviewerReport from "./reviewerReport";
import ReceivedReport from "./receivedReport";
import { getActiveTab } from "../../store/actions/l2Action/AuditReportAction";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode } from "primereact/api";
import Select from "react-select";
import { Modal, DatePicker, Tooltip } from "antd";
import ExportImg from "../../images/svg/Export";
import { debounce } from "../../pages/admin/reports/Export";
import { disableFutureDate } from "../../components/headerFilters/functions";
import { patientDetails } from "../../stores/authflow/actions";
import {
  getReceivedDetails,
  getReportDetails,
  getSentDetails,
} from "../../store/actions/ReportActions";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import SentReport from "./sentReport";
import MoreFilter from "./MoreFilter";
import Export from "./Export";
import TabNavigation from "../../../mainStream/components/tags";

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
  const [activeRole, setActiveRole] = useState();

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

  useEffect(() => {
    const coderSearchString = searchVal.find(
      (item) => item.field === "initialSearch"
    )?.search;
    setIsLoading(false);
    const userRole = localStorage.getItem("userRole");
    setActiveRole(userRole);
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
  }, [
    dispatch,
    reportActiveTab,
    sentPageNo,
    selectedDateRanges,
    pageNo,
    receivedPageNo,
    selectedOptions?.reviewerStatus,
    sort,
  ]);

  const handleFilterChange = (event) => {
    setSearch(event.target.value);
    setFilters({
      ...filters,
      global: { ...filters.global, value: event.target.value },
    });
  };

  const statusChange = (selectedOption) => {
    const selectStatus = selectedOption ? selectedOption : statusOptions[0];
    setSelectedOptions((prevOptions) => ({
      ...prevOptions,
      reviewerStatus: selectStatus.value,
    }));
  };

  const debouncedFilterChange = useCallback(debounce(handleFilterChange, 300), [
    filters,
  ]);

  const handleExport = () => {
    const isSelectAllCheckBoxes =
      selectAllCheckBoxes &&
      rowsLength === selectedRows.length &&
      selectedRows.length > 1;
    dispatch(
      getExportReports({
        ids: isSelectAllCheckBoxes ? null : selectedRows,
        allRecords: isSelectAllCheckBoxes ? true : false,
        activeTab: reportActiveTab,
      })
    ).then(() => {
      setModal(true);
      setSelectedRows([]);
      setSelectAllCheckBoxes(false);
    });
  };

  const handleTabChange = (tab) => {
    setSelectedDates({});
    setSelectedOptions({});
    setSearch("");
    setFilters({
      ...filters,
      global: { ...filters.global, value: "" },
    });
    handleTabs(tab);
  };

  return (
    <div className={styles.main}>
      <Header pageTitle={"Reports"} />
      <TabNavigation tabs={["Reviewer", "Sent", "Received"]} />

      {reportActiveTab === "Reviewer" ? (
        <ReviewerReport
          selectedDates={selectedDates}
          handleCoderPicker={handleCoderPicker}
          statusOptions={statusOptions}
          selectedOptions={selectedOptions}
          statusChange={statusChange}
          filters={filters}
          debouncedFilterChange={debouncedFilterChange}
          search={search}
          ExportResponse={ExportResponse}
          setModal={setModal}
          setSelectedRows={setSelectedRows}
          setSelectAllCheckBoxes={setSelectAllCheckBoxes}
          closeModal={closeModal}
          onPageChange={onPageChange}
          paginationFirst={paginationFirst}
          pageNo={pageNo}
        />
      ) : reportActiveTab === "Sent" ? (
        <SentReport
          selectedDates={selectedDates}
          handleCoderPicker={handleCoderPicker}
          selectedOptions={selectedOptions}
          filters={filters}
          debouncedFilterChange={debouncedFilterChange}
          search={search}
          ExportResponse={ExportResponse}
          setModal={setModal}
          setSelectedRows={setSelectedRows}
          setSelectAllCheckBoxes={setSelectAllCheckBoxes}
          closeModal={closeModal}
          onSentPageChange={onSentPageChange}
          paginationSentFirst={paginationSentFirst}
          sentPageNo={sentPageNo}
          SentOptions={SentOptions}
        />
      ) : (
        <ReceivedReport
          selectedDates={selectedDates}
          handleCoderPicker={handleCoderPicker}
          selectedOptions={selectedOptions}
          filters={filters}
          debouncedFilterChange={debouncedFilterChange}
          search={search}
          ExportResponse={ExportResponse}
          setModal={setModal}
          setSelectedRows={setSelectedRows}
          setSelectAllCheckBoxes={setSelectAllCheckBoxes}
          closeModal={closeModal}
          onReceivedPageChange={onReceivedPageChange}
          paginationReceivedFirst={paginationReceivedFirst}
          receivedPageNo={receivedPageNo}
          ReceivedOptions={ReceivedOptions}
        />
      )}

      <Export
        ExportResponse={ExportResponse}
        modal={modal}
        setModal={setModal}
      />
    </div>
  );
};

export default Reports;
