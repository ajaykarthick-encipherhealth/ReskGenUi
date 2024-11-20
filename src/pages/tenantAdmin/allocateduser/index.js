import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import Image from "next/image";
import "react-facebook-loading/dist/react-facebook-loading.css";
import { Button, DatePicker, Empty, Input, Select, Space, Tooltip } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { Paginator } from "primereact/paginator";
import moment from "moment/moment";
import { Tab, Nav } from "react-bootstrap";
import Header from "../../../jsx/layouts/nav/Header";
import AllocatedAdminList from "../../../components/table/admin/allocatedAdminList/allocatedAdminList";
import AllocatedL2AdminList from "../../../components/table/admin/allocatedL2AdminList/allocatedL2AdminList";
import L2AllocateModal from "./l2allocate";
import styles from "../report/report.module.css";
import reportStyles from "../../reviewer/report/report.module.css";
import SpinnerDots from "../../../components/spinner";
import TableStyle from "../../../components/table/table.module.css";
import leftArrow from "../../../images/svg/leftArrow.svg";
import {
  generateOptionsList,
  disableFutureDate,
  renderUserPrfoile,
  resetPageNumber,
  generateOptionsForNewStore,
} from "../../../components/headerFilters/functions";
import Selector from "../../../components/selector";
import AllocateModal from "./allocate";
import { debounce } from "../../../components/input";
import { useCallback } from "react";
import { actions as tenantAdminUsersAction } from "../../../stores/tenantAdmin/users";
import { actions as allActions } from "../../../stores/admin/patientAllocation";
import { renderSkeleton } from "../../../components/reuseableFunctions";
import { getStorage } from "../../../utils/storages";
import { getResponePopup } from "../../../utils/reusable";

const { RangePicker } = DatePicker;
const statusOption = [
  { value: "URGENT", label: "Urgent" },
  { value: "HIGH", label: "High" },
  { value: "NORMAL", label: "Normal" },
  { value: "LOW", label: "Low" },
];

const Patient = ({
  getAllOrganizationList,
  organizationList,
  allocatedGetList,
  reviewerResponse,
  loader,
  getSupervisorsList,
  loader2,
  supervisorResponse,
  getSelectedSupervisorList,
  selectedSupervisors,
  loader3,
  getFilters,
  filteredList,
  getAllCheckedListForReviewer,
  allCheckBoxLoader,
  getAllCheckedListForSupervisor,
  supervisorCheckBoxLoader,
}) => {
  const [validated, setValidated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [addPatientId, setAddPatientId] = useState(false);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [selectAllCheckedL2, setSelectAllCheckedL2] = useState(false);
  const [selectedRowsId, setSelectedRowsId] = useState([]);
  const [dateRange, setDateRange] = useState([]);
  const [allocateClicked, setAllocateClicked] = useState(false);
  const [allocateModal, setAllocateModal] = useState(false);
  const [allocateModalL2, setAllocateModalL2] = useState(false);
  const [selectedChart, setSelectedChart] = useState([]);
  const [headerCheckValidation, setHeaderCheckValidation] = useState([]);
  const [pageNo, setPageNo] = useState(0);
  const [pageNoL2Patient, setPageNoL2Patient] = useState(0);
  const [pageNoL2User, setPageNoL2User] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [supervisorPageSize, setSupervisorPageSize] = useState(15);

  const [paginationFirst, setPaginationFirst] = useState(0);
  const [tableLoading, setTableLoading] = useState(true);

  const [activeTab, setActiveTab] = useState(1);
  const [isPatientList, setIsPatientList] = useState(false);
  const [l2selectUser, setL2selectUser] = useState(null);
  const [sort, setSort] = useState({ sortDir: "", sortField: "" });
  const [searchString, setSearchString] = useState("");
  const [selectedSupervisorSearch, setSelectedSupervisorSearch] = useState("");
  const [checkedLoading, setCheckedLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [allocatedOption, setAllocatedOption] = useState(null);
  const [batchCount, setBatchCount] = useState("");
  const [filterBatchCount, setFilterBatchCount] = useState(false);
  const [sortDueOrder, setSortDueOrder] = useState("DESC");
  const [sortCompleteOrder, setSortCompleteOrder] = useState("DESC");
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [searchStr, setSearchStr] = useState("");
  const [selectOrgList, setSelectedOrgList] = useState([]);
  const [orgAllList, setOrgAllList] = useState([]);
  const getAllList = async ({
    pageNo = 0,
    pageSize = 15,
    startDate,
    endDate,
    allocate = true,
    status = 2,
    search,
    sort,
    selectedOption,
    selectOrgList = "",
    batchCount,
  }) => {
    const uId = getStorage("userId");
    let resoureUrl = `page=${pageNo}&size=${pageSize}&userId=${uId}&computationStart=${
      startDate ? startDate : ""
    }&computationEnd=${endDate ? endDate : ""}&isAllocation=${
      allocate ? allocate : ""
    }&status=${status}&searchString=${search ? search : ""}&sortdirection=${
      sort?.sortDir ? sort?.sortDir : ""
    }&sortfield=${sort?.sortField ? sort?.sortField : ""}&priority=${
      selectedOption ? selectedOption : ""
    }&batchCount=${
      batchCount ? batchCount : ""
    }&organizationId=${selectOrgList}`;
    allocatedGetList({ url: resoureUrl });
  };
  const getAllCheckList = async (sort) => {
    try {
      const response = await getAllCheckedListForReviewer({
        batchCount,
        totalElements: batchCount
          ? batchCount
          : reviewerResponse?.response?.totalElements,
        sort,
        selectedOption,
        searchString,
        fromTenant: true,
      });
      if (response?.status === "SUCCESS") {
        setIsLoading(false);
        setCheckedLoading(false);
        let result = response?.response?.content;
        const data = result.map((item) => ({
          id: item.patientId,
          name: item.patientName,
        }));
        setSelectedRowsId(data);
        setHeaderCheckValidation(data);
      }
    } catch (err) {
      getResponePopup(err);
    }
  };

  const onPageChange = (e) => {
    setIsLoading(false);
    setPaginationFirst(e.first);
    setPageNo(e.page);
    setPageSize(e.rows);
    setTableLoading(true);
  };

  const handleReceivedDatePicker = (date, dateString) => {
    if (date === null || (Array.isArray(date) && date.length === 0)) {
      setStartDate("");
      setEndDate("");
    }

    const formattedDates =
      dateString?.length > 0 &&
      dateString?.map((data, index) => {
        const formattedDate =
          index === 1
            ? data &&
              `${moment(data, "MM-DD-YYYY").format("YYYY-MM-DD")}T23:59:59.999Z`
            : data &&
              `${moment(data, "MM-DD-YYYY").format(
                "YYYY-MM-DD"
              )}T00:00:00.000Z`;
        return formattedDate;
      });
    setStartDate(formattedDates[0]);
    setEndDate(formattedDates[1]);
  };
  const onPageChangePatient = (e) => {
    setIsLoading(false);
    setPaginationFirst(e.first);
    setPageNoL2Patient(e.page);
    setPageSize(e.rows);
    setSupervisorPageSize(e.rows);
    // getL2PatientList({
    //   data: l2selectUser,
    //   pageNoL2Patient: e.page,
    //   sort: sort,
    //   searchString:selectedSupervisorSearch,
    //   selectedOptions: selectedOptions,
    //   allocatedOption: allocatedOption,
    // });
    getL2PatientList({
      data: l2selectUser,
      pageNoL2Patient: e.page,
      // sort: sort,
      pageSize: e.rows,
      // searchString: selectedSupervisorSearch,
      // selectedOptions: selectedOptions,
      // allocatedOption: allocatedOption,
    });
    setTableLoading(true);
  };

  const selectTabClick = (number) => {
    setSearchString("");
    setSelectedSupervisorSearch("");
    setPaginationFirst(0);
    setIsLoading(false);
    setActiveTab(number);
    setSelectedRowsId([]);
    setAllocateClicked(false);
    setSelectedRowsId([]);
    setSelectAllChecked(false);
    setSelectAllCheckedL2(false);
    setSelectedOption([]);
    setSelectedOptions([]);
    setPageNo(0);
    setPageNoL2Patient(0);
    if (number == 2) {
      getAuditL2List(pageNoL2User, "");
    } else {
      setIsPatientList(false);
      setPageNo(0);
      // getAllList(0, pageSize, "", "", true, 2, "", sort);
    }
  };
  const searchFunction = (search, activeTab, isPatientList, l2selectUser) => {
    if (activeTab == 1) {
      setSearchStr(search);
    } else {
      if (!isPatientList && activeTab == 2) {
        getAuditL2List(pageNo, search);
      } else {
        getL2PatientList({
          data: l2selectUser,
          pageNoL2Patient: pageNoL2Patient,
          sort: sort,
          searchString: search,
          selectedOptions: selectedOptions,
          allocatedOption: allocatedOption,
        });
      }
    }
  };
  const debounceFunc = useCallback(
    debounce(
      (text, activeTab, isPatientList, l2selectUser) =>
        searchFunction(text, activeTab, isPatientList, l2selectUser),
      900
    ),
    []
  );
  const getNameSearch = (search, activeTab, isPatientList, l2selectUser) => {
    if (activeTab == 2 && isPatientList) {
      setSelectedSupervisorSearch(search);
      // setSearchString("");
    } else {
      setSelectedSupervisorSearch("");
      setSearchString(search);
    }
    debounceFunc(search, activeTab, isPatientList, l2selectUser);
  };

  const handleOpneModal = () => {
    setValidated(false);
    setAddPatientId(false);
    if (        batchCount,
      activeTab == 2) {
      setAllocateModalL2(true);
    } else {
      setAllocateModal(true);
    }
  };

  const getAuditL2List = async (pageNo, searchString) => {
    let orgId = getStorage("orgId");
    let tenantid = getStorage("tenantId");
    let resoureUrl = `dbservice/l2audit?tenantid=${tenantid}&page=${pageNo}&size=${pageSize}&searchstring=${searchString}&orgId=${
      selectOrgList || ""
    }`;
    getSupervisorsList({ url: resoureUrl });
  };

  useEffect(() => {
    if (selectAllChecked) {
      if (isPatientList && activeTab == 2) {
        getAllCheckListL2(sort);
      } else {
        getAllCheckList(sort);
      }
    } else {
      setSelectedRowsId([]);
    }
  }, [selectAllChecked, sort, isPatientList,  activeTab]);

  useEffect(() => {
    if (typeof pageNo == "number" && activeTab == 1 && !isPatientList) {
      getAllList({
        pageNo: pageNo,
        pageSize: pageSize,
        startDate: startDate,
        endDate: endDate,
        allocate: true,
        status: 2,
        search: searchStr,
        sort: sort,
        selectedOption: selectedOption,
        selectOrgList: selectOrgList,
      });
    }
    if (activeTab == 2 && !isPatientList) {
      getAuditL2List(pageNo, searchStr || searchString);
    }
    getFilters({ field: "patientAllocated" });
  }, [
    pageNo,
    pageSize,
    sort,
    activeTab,
    startDate,
    endDate,
    searchStr,
    selectedOption,
    selectOrgList,
    isPatientList,
    selectedSupervisorSearch
  ]);

  useEffect(() => {
    if (!organizationList?.response) {
      getAllOrganizationList();
    }
  }, []);
  useEffect(() => {
    // var orgListArray = [];
    const orgListArray =
      organizationList?.response?.length > 0
        ? [
            ...organizationList?.response?.map((res) => ({
              value: res.id,
              label: res.name,
            })),
          ].filter(Boolean)
        : [];
    // organizationList?.response?.map((res) => {
    //   orgListArray.push({
    //     value: res.id,
    //     label: res.name,
    //   });
    // });
    setOrgAllList(orgListArray);
  }, [organizationList]);
  const renderRows = () => {
    return supervisorResponse?.response?.content?.length > 0 ? (
      supervisorResponse?.response?.content?.map((data, index) => (
        <tr
          style={{ height: "35px" }}
          key={index}
          onClick={() => {
            getL2PatientList({
              data,
              pageNoL2Patient: pageNoL2Patient,
              sort: sort,
              selectedOptions: selectedOptions,
              allocatedOption: allocatedOption,
            });
            setIsPatientList(true);
            setL2selectUser(data);
            setSelectedSupervisorSearch("");
          }}
        >
          <td
            className={TableStyle.childBorder}
            style={{ textAlign: "center" }}
          >
            {data.firstName || data.lastName || data?.profileImageUrl ? (
              <div style={{ display: "flex", alignItems: "center" }}>
                {" "}
                <span style={{ marginRight: "10px" }}>
                  {" "}
                  {renderUserPrfoile(
                    data?.firstName,
                    data?.lastName,
                    data?.profileImageUrl,
                    null,
                    "30px",
                    "30px"
                  )}
                </span>
                <span>
                  {data.firstName} {data.lastName}
                </span>
              </div>
            ) : (
              <div style={{ textAlign: "center" }}>---</div>
            )}
          </td>
          <td
            className={TableStyle.childBorder}
            style={{ textAlign: "center" }}
          >
            {data.totalFileAuditAllocated
              ? data.totalFileAuditAllocated
              : "---"}
          </td>
          <td
            className={TableStyle.childBorder}
            style={{ textAlign: "center" }}
          >
            {data.totalFileAudited ? data.totalFileAudited : "---"}
          </td>

          <td
            className={TableStyle.childBorder}
            style={{ textAlign: "center" }}
          >
            {data.totalFileAuditPending ? data.totalFileAuditPending : "---"}
          </td>
          <td
            className={TableStyle.childBorder}
            style={{ textAlign: "center" }}
          >
            {data.totalFileAuditHold ? data.totalFileAuditHold : "---"}
          </td>
          <td
            className={TableStyle.childBorder}
            style={{ textAlign: "center" }}
          >
            {data.totalFileAuditDeclined ? data.totalFileAuditDeclined : "---"}
          </td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan="9">
          <Empty />
        </td>
      </tr>
    );
  };
  const statusOptions = [
    { label: "Completed", value: "COMPLETED" },
    { label: "Declined", value: "DECLINED" },
  ];

  const getL2PatientList = async ({
    data,
    pageNoL2Patient,
    sort,
    searchString,
    selectedOptions,
    allocatedOption,
  }) => {
    setTableLoading(true);
    // setIsLoading(true);
    let dataMap = {
      firstName: data?.firstName,
      lastName: data?.lastName,
      userName: data?.userName,
    };
    setL2selectUser(dataMap);
    let resoureUrl = `dbservice/l2audit/patients?username=${
      data?.userName
    }&page=${pageNoL2Patient}&size=${15}&sortdirection=${
      sort?.sortDir ? sort?.sortDir : "DESC"
    }&sortfield=${sort?.sortField ? sort?.sortField : "dueDate"}&searchstring=${
      searchString ? searchString : ""
    }&processedStatus=${
      selectedOptions ? (selectedOptions === "ALL" ? "" : selectedOptions) : ""
    }&patientAllocated=${
      allocatedOption ? (allocatedOption === "All" ? "" : allocatedOption) : ""
    }`;
    getSelectedSupervisorList({ url: resoureUrl });
  };

  const getAllCheckListL2 = async (sort) => {
    try {
      const response = await getAllCheckedListForSupervisor({
        userName: l2selectUser?.userName,
        pageNo: pageNoL2Patient,
        sort,
        selectedOption: selectedOptions,
        allocatedOption: allocatedOption,
        searchString: selectedSupervisorSearch,
        fromTenant: true,
        pageSize:
          selectedSupervisors?.response?.totalElements < supervisorPageSize
            ? selectedSupervisors?.response?.totalElements
            : supervisorPageSize,
      });
      if (response.status === "SUCCESS") {
        let result = response?.response;
        const data = result?.content?.map((item) => ({
          id: item.patientId,
          name: item.patientName,
        }));
        setSelectedRowsId(data);
        setHeaderCheckValidation(data);
      }
      setCheckedLoading(false);
    } catch (Err) {
      getResponePopup(Err);
    }
  };

  useEffect(() => {
    getFilters({ field: "patientAllocated" });
  }, []);

  useEffect(() => {
    if (activeTab == 2 && isPatientList) {
      getL2PatientList({
        data: l2selectUser,
        sort: sort,
        pageSize: supervisorPageSize,
        pageNoL2Patient: pageNoL2Patient,
        selectedOptions: selectedOptions,
        allocatedOption: allocatedOption,
       
      });
    }
   
  }, [selectedOptions, allocatedOption, isPatientList, supervisorPageSize]);
  return (
    <>
      <div className={`show `}>
        <Header />
        <div class="content-body">
          <div className="container-fluid">
            <div className="row">
              <div className="col-xl-12">
                <div className="">
                  <div className="card-body p-0">
                    <div className="table-responsive active-projects task-table supervisor-table">
                      <div className="tbl-caption  align-items-center">
                        <div className="row filter-contain">
                          <div
                            className={`${isPatientList && "d-flex"} col-2`}
                          >
                            {isPatientList && activeTab !== 1 && (
                              <div className={reportStyles.backDiv}>
                                <button
                                  style={{ width: "40px", height: "40px" }}
                                  className={`${reportStyles.filterBtn} d-flex justify-content-center align-item-end`}
                                  onClick={() => {
                                    setIsPatientList(false);
                                    setAllocatedOption("");
                                    setSelectAllChecked(false);
                                  }}
                                >
                                  <Image src={leftArrow} />
                                </button>
                              </div>
                            )}

                            <div>
                              <label className="responsiveLabel">
                                {!isPatientList && activeTab == 2
                                  ? "Search by Name"
                                  : "Search by Name or ID"}
                              </label>
                              <div style={{ height: "42px" }}>
                                <Input
                                  type="text"
                                  onChange={(e) => {
                                    resetPageNumber(setPageNo);
                                    getNameSearch(
                                      e.target.value,
                                      activeTab,
                                      isPatientList,
                                      l2selectUser
                                    );
                                    setPageNoL2Patient(0);
                                  }}
                                  value={
                                    activeTab == 2 && isPatientList
                                      ? selectedSupervisorSearch
                                      : searchString
                                  }
                                  className={
                                    "w-100 new-search-control border-none"
                                  }
                                  placeholder="Search"
                                  maxLength={25}
                                  onKeyDown={(e) => {
                                    // Prevent input of backslash ("\")
                                    if (e.key === "\\") {
                                      e.preventDefault();
                                    }
                                  }}
                                  prefix={
                                    <FontAwesomeIcon
                                      className="searchPrefix"
                                      icon={faSearch}
                                    />
                                  }
                                  allowClear={true}
                                />
                              </div>
                            </div>
                          </div>
                          {(activeTab == 1 ||
                            (!isPatientList && activeTab == 2)) && (
                            <div className="col-2">
                              <div>
                                {/* <Selector
                                    selectlabel={"Select Organization"}
                                    setSelectedOption={setSelectedOrgList}
                                    selectOptions={orgAllList}
                                    selectDefaultValue={defaultOrgValue}
                                    // setDefaultValue={setDefaultOrgValue}
                                    // isClose={true}
                                    setPageNo={setPageNo}
                                  /> */}
                                <label>Select Organization</label>
                                <div class="form-group has-search custom-react-select-admin">
                                  <Select
                                    options={orgAllList}
                                    style={{ width: "100%", height: "42px" }}
                                    placeholder={"Select Organization"}
                                    allowClear
                                    onChange={(e) => {
                                      setSelectedOrgList(e);
                                      setSelectedRowsId([]);
                                      setSelectAllChecked(false);
                                    }}
                                    value={selectOrgList}
                                  />
                                </div>
                              </div>
                            </div>
                          )}

                          {!isPatientList && activeTab == 1 ? (
                            <>
                              <div className="col-2">
                                <label>Computed Date</label>
                                <div>
                                  <RangePicker
                                    format="MM-DD-YYYY"
                                    onChange={(dates, dateStrings) => {
                                      resetPageNumber(setPageNo);
                                      setDateRange(dateStrings);
                                      handleReceivedDatePicker(
                                        dates,
                                        dateStrings
                                      );
                                      setSelectedRowsId([]);
                                      setSelectAllChecked(false);
                                    }}
                                    disabledDate={(current) =>
                                      disableFutureDate(current)
                                    }
                                  />
                                </div>
                              </div>
                              <div className="col-2">
                                <div>
                                  {/* <Selector
                                    selectlabel={"Select Priority"}
                                    setSelectedOption={setSelectedOption}
                                    selectOptions={statusOption}
                                    defaultSelectValue1={""}
                                    // isClose={true}
                                    setPageNo={setPageNo}
                                    selectDefaultValue={selectedOption}
                                  /> */}
                                  <label>Select Priority</label>
                                  <div class="form-group has-search custom-react-select-admin">
                                    <Select
                                      options={statusOption}
                                      style={{ width: "100%", height: "42px" }}
                                      placeholder={"Select Priority"}
                                      allowClear
                                      onChange={(e) => {
                                        setSelectedOption(e);
                                        setSelectedRowsId([]);
                                        setSelectAllChecked(false);
                                      }}
                                      value={selectedOption}
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="col-2">
                                <label>Batch Count</label>
                                <div class="form-group d-flex">
                                  {/* <InputText
                                    type="text"
                                    onChange={(e) => {
                                      setBatchCount(e.target.value);
                                      if (e.target.value.length <= 0) {
                                        setFilterBatchCount(true);
                                      }
                                      const inputValue = e.target.value.replace(
                                        /[^\d]/g,
                                        ""
                                      );
                                      setBatchCount(inputValue);
                                      if (inputValue.length <= 0) {
                                        setFilterBatchCount(true);
                                      }
                                    }}
                                    value={batchCount}
                                    className="form-control new-form-controls"
                                    placeholder="Batch Count"
                                    style={{ width: "60%" }}
                                    maxLength={3}
                                    onKeyDown={(e) => {
                                      // Prevent input of backslash ("\")
                                      if (e.key === "\\") {
                                        e.preventDefault();
                                      }
                                    }}
                                  />
                                  <button
                                    onClick={() => setFilterBatchCount(true)}
                                    className="btn btn-outline-secondary py-0 px-2 select-count"
                                  >
                                    Select
                                  </button> */}
                                  <Space.Compact style={{ width: "100%" }}>
                                    <Input
                                      type="number"
                                      onChange={(e) => {
                                        let inputValue = e.target.value.replace(
                                          /[^\d]/g,
                                          ""
                                        );
                                        if (inputValue.length > 3) {
                                          inputValue = inputValue.slice(0, 3);
                                        }
                                        setBatchCount(inputValue);
                                        if (inputValue.length <= 0) {
                                          setFilterBatchCount(true);
                                          getAllList({
                                            batchCount: "",
                                            selectOrgList: selectOrgList,
                                          });
                                          setBatchCount("");
                                        } else if (inputValue.length > 0) {
                                          setFilterBatchCount(true);
                                        }
                                      }}
                                      value={batchCount}
                                      placeholder="Batch Count"
                                      onKeyDown={(e) => {
                                        if (e.key === "\\") {
                                          e.preventDefault();
                                        }
                                      }}
                                      className="batch-form-control"
                                    />
                                    <button
                                      onClick={() => {
                                        setFilterBatchCount(true);
                                        getAllList({
                                          batchCount: batchCount,
                                          selectOrgList: selectOrgList,
                                        });
                                      }}
                                      style={{
                                        borderRadius: "0px 10px 10px 0px",
                                      }}
                                      className="btn btn-outline-secondary py-0 px-2 select-count"
                                    >
                                      Select
                                    </button>
                                  </Space.Compact>
                                </div>
                              </div>
                            </>
                          ) : !isPatientList && activeTab == 2 ? (
                            <div className="col-6"></div>
                          ) : (
                            <>
                              <div className="col-2">
                                <div>
                                  <Selector
                                    selectlabel={"Reviewer"}
                                    setSelectedOption={setAllocatedOption}
                                    selectOptions={generateOptionsForNewStore(
                                      filteredList?.data?.response
                                    )}
                                    selectDefaultValue={allocatedOption}
                                    defaultSelectValue1={""}
                                    // isClose={true}
                                    setPageNo={setPageNo}
                                    onChanges={() => {
                                      setPageNoL2Patient(0);
                                      setSupervisorPageSize(15)

                                    }}
                                  />
                                </div>
                              </div>
                              <div className="col-6">
                                <div className="col-4">
                                  <Selector
                                    selectlabel={"Status"}
                                    setSelectedOption={setSelectedOptions}
                                    selectOptions={statusOptions}
                                    defaultSelectValue1={""}
                                    selectDefaultValue={selectedOptions}
                                    setPageNo={setPageNo}
                                    // isClose={true}
                                    onChanges={() => {
                                      setPageNoL2Patient(0);
                                      setSupervisorPageSize(15)
                                    }}
                                  />
                                </div>
                              </div>
                            </>
                          )}
                          <div
                            className={
                              isPatientList && activeTab == 2
                                ? `col-xl-2 mt-4 ${TableStyle.allocateBtn}`
                                : `col-xl-2 mt-4 ${TableStyle.allocateBtn}`
                            }
                          >
                            {isPatientList || activeTab === 1 ? (
                              <>
                                <Tooltip
                                  title={
                                    selectedRowsId?.length === 0
                                      ? "Select patients to Allocate"
                                      : ""
                                  }
                                >
                                  {" "}
                                  <button
                                    onClick={handleOpneModal}
                                    className={styles.export}
                                    style={{
                                      backgroundColor: "#133dd426",
                                      cursor:
                                        selectedRowsId?.length === 0
                                          ? "not-allowed"
                                          : "",
                                    }}
                                    disabled={
                                      selectedRowsId?.length > 0 ||
                                      selectedRowsId?.data?.length > 0
                                        ? false
                                        : true
                                    }
                                  >
                                    Allocate
                                  </button>
                                </Tooltip>
                              </>
                            ) : null}
                          </div>
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
                            <Tab.Container defaultActiveKey="validDiseases">
                              <Nav as="ul" className="nav nav-tabs">
                                <Nav.Item
                                  as="li"
                                  className="nav-item"
                                  onClick={() => {
                                    setSort({ sortDir: "", sortField: "" });
                                    setSortCompleteOrder("DESC");
                                    setSortDueOrder("DESC");
                                    selectTabClick(1);
                                    setActiveTab(1);
                                    setSelectedOrgList([]);
                                    setSearchString("");
                                    setSearchStr("");
                                  }}
                                >
                                  <Nav.Link
                                    to="#my-posts"
                                    eventKey="validDiseases"
                                  >
                                    Reviewer Allocation
                                  </Nav.Link>
                                </Nav.Item>
                                <Nav.Item
                                  as="li"
                                  className="nav-item"
                                  onClick={() => {
                                    setSort({ sortDir: "", sortField: "" });
                                    setSortCompleteOrder("DESC");
                                    setSortDueOrder("DESC");
                                    selectTabClick(2);
                                    setActiveTab(2);
                                    setSelectedOrgList([]);
                                    setSearchString("");
                                    setSearchStr("");
                                  }}
                                >
                                  <Nav.Link
                                    to="#my-posts"
                                    eventKey="team"
                                    onClick={() => {
                                      setTableLoading(true);
                                    }}
                                  >
                                    Supervisor Allocation
                                  </Nav.Link>
                                </Nav.Item>
                              </Nav>

                              <Tab.Content>
                                <Tab.Pane
                                  id="my-posts"
                                  eventKey="validDiseases"
                                >
                                  {loader && activeTab == 1 ? (
                                    renderSkeleton()
                                  ) : (
                                    <>
                                      <AllocatedAdminList
                                        patinetListAll={
                                          reviewerResponse?.response?.content
                                        }
                                        selectAllChecked={selectAllChecked}
                                        setSelectAllChecked={
                                          setSelectAllChecked
                                        }
                                        selectedRowsId={selectedRowsId}
                                        setSelectedRowsId={setSelectedRowsId}
                                        selectedChart={headerCheckValidation}
                                        setSort={setSort}
                                        loading={allCheckBoxLoader}
                                        sortCompleteOrder={sortCompleteOrder}
                                        setSortCompleteOrder={
                                          setSortCompleteOrder
                                        }
                                      />
                                      <div>
                                        <div className="pagination-container">
                                          <Paginator
                                            first={
                                              pageNo === 0 ? 0 : paginationFirst
                                            }
                                            rows={15}
                                            totalRecords={
                                              reviewerResponse?.response
                                                ?.totalElements
                                            }
                                            onPageChange={onPageChange}
                                          />
                                          <div className="total-pages">
                                            Total count:{" "}
                                            {
                                              reviewerResponse?.response
                                                ?.totalElements
                                            }
                                          </div>
                                        </div>
                                      </div>
                                    </>
                                  )}
                                </Tab.Pane>

                                <Tab.Pane id="my-posts" eventKey="team">
                                  {loader2 && activeTab == 2 ? (
                                    renderSkeleton()
                                  ) : (
                                    <>
                                      <div
                                        className={TableStyle.classContaineer}
                                      >
                                        {!isPatientList ? (
                                          <>
                                            <table
                                              className={TableStyle.classTable}
                                            >
                                              <thead
                                                className={
                                                  TableStyle.classThead
                                                }
                                              >
                                                <tr>
                                                  <th
                                                    style={{
                                                      paddingLeft:
                                                        "46px !important",
                                                    }}
                                                  >
                                                    NAME
                                                  </th>

                                                  <th
                                                    style={{
                                                      textAlign: "center",
                                                    }}
                                                  >
                                                    AUDIT ALLOCATED
                                                  </th>
                                                  <th
                                                    style={{
                                                      textAlign: "center",
                                                    }}
                                                  >
                                                    AUDIT PROCESSED
                                                  </th>

                                                  <th
                                                    style={{
                                                      textAlign: "center",
                                                    }}
                                                  >
                                                    AUDIT PENDING
                                                  </th>
                                                  <th
                                                    style={{
                                                      textAlign: "center",
                                                    }}
                                                  >
                                                    AUDIT HOLD
                                                  </th>
                                                  <th
                                                    style={{
                                                      textAlign: "center",
                                                    }}
                                                  >
                                                    AUDIT INVALID
                                                  </th>
                                                </tr>
                                              </thead>

                                              <tbody>{renderRows()}</tbody>
                                            </table>
                                            <div>
                                              <div className="pagination-container">
                                                <Paginator
                                                  first={paginationFirst}
                                                  rows={100}
                                                  totalRecords={
                                                    supervisorResponse?.response
                                                      ?.totalElements
                                                  }
                                                  onPageChange={onPageChange}
                                                />
                                                <div className="total-pages">
                                                  Total count:{" "}
                                                  {
                                                    supervisorResponse?.response
                                                      ?.totalElements
                                                  }
                                                </div>
                                              </div>
                                            </div>
                                          </>
                                        ) : !loader2 &&
                                          loader3 &&
                                          activeTab == 2 ? (
                                          <SpinnerDots />
                                        ) : (
                                          <>
                                            <AllocatedL2AdminList
                                            setBatchCount={setBatchCount}
                                              patinetListAll={
                                                selectedSupervisors?.response
                                                  ?.content
                                              }
                                              selectAllChecked={
                                                selectAllChecked
                                              }
                                              setSelectAllChecked={
                                                setSelectAllChecked
                                              }
                                              selectedRowsId={selectedRowsId}
                                              setSelectedRowsId={
                                                setSelectedRowsId
                                              }
                                              totalElements={selectedSupervisors?.response
                                                ?.totalElements}
                                              selectedChart={
                                                headerCheckValidation
                                              }
                                              setSupervisorPageSize={setSupervisorPageSize}
                                              setSort={setSort}
                                              sort={sort}
                                              loading={supervisorCheckBoxLoader}
                                              sortDueOrder={sortDueOrder}
                                              setSortDueOrder={setSortDueOrder}
                                              sortCompleteOrder={
                                                sortCompleteOrder
                                              }
                                              setSortCompleteOrder={
                                                setSortCompleteOrder
                                              }
                                            />
                                            <div>
                                              <div>
                                                <div className="pagination-container">
                                                  <Paginator
                                                    first={
                                                      pageNoL2Patient === 0
                                                        ? 0
                                                        : paginationFirst
                                                    }
                                                    rows={15}
                                                    totalRecords={
                                                      selectedSupervisors
                                                        ?.response
                                                        ?.totalElements
                                                    }
                                                    onPageChange={
                                                      onPageChangePatient
                                                    }
                                                  />
                                                  <div className="total-pages">
                                                    Total count:{" "}
                                                    {
                                                      selectedSupervisors
                                                        ?.response
                                                        ?.totalElements
                                                    }
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </>
                                        )}
                                      </div>
                                    </>
                                  )}
                                </Tab.Pane>
                              </Tab.Content>
                            </Tab.Container>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AllocateModal
        open={allocateModal}
        setOpen={setAllocateModal}
        selectedRowsId={selectedRowsId}
        setSelectedRowsId={setSelectedRowsId}
        setAllocateClicked={setAllocateClicked}
        setSelectAllChecked={setSelectAllChecked}
        setSelectedChart={setSelectedChart}
        selectedChart={selectedChart}
        getAllList={getAllList}
      />
      <L2AllocateModal
        open={allocateModalL2}
        setOpen={setAllocateModalL2}
        selectedRowsId={selectedRowsId}
        setSelectedRowsId={setSelectedRowsId}
        setAllocateClicked={setAllocateClicked}
        setSelectAllChecked={setSelectAllChecked}
        setSelectedChart={setSelectedChart}
        selectedChart={selectedChart}
        selectedUser={l2selectUser}
      />
    </>
  );
};
const enhancer = connect(
  (state) => ({
    organizationList: state?.tenantAdmin?.users?.allOrganization?.data,
    reviewerResponse: state.admin.patientAllocate?.allocatedList?.data,
    loader: state.admin?.patientAllocate?.loader,
    loader2: state.admin?.patientAllocate?.l2Loader,
    loader3: state.admin?.patientAllocate?.supervisorLoader,
    supervisorResponse: state.admin?.patientAllocate?.l2AllocatedList?.data,
    selectedSupervisors:
      state.admin?.patientAllocate?.selectedSupervisors?.data,
    filteredList: state.admin.patientAllocate?.filtersList,
    allCheckBoxLoader: state.admin.patientAllocate.allCheckBoxLoader,
    supervisorCheckBoxLoader:
      state.admin.patientAllocate.allSupervisorCheckBoxLoader,
  }),
  {
    getAllOrganizationList: tenantAdminUsersAction?.getAllOrganizationAction,
    allocatedGetList: allActions?.getAllList,
    getSupervisorsList: allActions?.getSupervisorsList,
    getSelectedSupervisorList: allActions?.getSelectedSupervisorList,
    getFilters: allActions.getFiltersList,
    getAllCheckedListForReviewer: allActions.getAllCheckedListForReviewer,
    getAllCheckedListForSupervisor: allActions.getAllCheckedListForSupervisor,
  }
);
export default enhancer(Patient);
