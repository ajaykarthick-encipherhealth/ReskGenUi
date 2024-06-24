import React, { useState, useEffect } from "react";
import { useSelector, useDispatch, connect } from "react-redux";
import Image from "next/image";
import "react-facebook-loading/dist/react-facebook-loading.css";
import { DatePicker, Empty, Tooltip } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { InputText } from "primereact/inputtext";
import { Paginator } from "primereact/paginator";
import moment from "moment/moment";
import { Tab, Nav } from "react-bootstrap";
import Header from "../../../jsx/layouts/nav/Header";
import axios from "../../../utility/axiosConfig";
import ENDPOINTS from "../../../utility/enpoints";
import AllocatedAdminList from "../../../components/table/admin/allocatedAdminList/allocatedAdminList";
import AllocatedL2AdminList from "../../../components/table/admin/allocatedL2AdminList/allocatedL2AdminList";
import allocateStyle from "./allocate/style.module.css";
import L2AllocateModal from "./l2allocate";
import { actions as tenantAdminAction } from "../../../stores/tenantAdmin";

import styles from "../report/report.module.css";
import reportStyles from "../../reviewer/report/report.module.css";
import SpinnerDots from "../../../components/spinner";
import TableStyle from "../../../components/table/table.module.css";
import leftArrow from "../../../images/svg/leftArrow.svg";
import {
  generateOptionsList,
  disableFutureDate,
  renderUserPrfoile,
} from "../../../components/headerFilters/functions";
import Selector from "../../../components/selector";
import { getFilters } from "../../../stores/authflow/actions";
import AllocateModal from "./allocate";
import { debounce } from "../../../components/input";
import { useCallback } from "react";

const { RangePicker } = DatePicker;
const statusOption = [
  { value: "", label: "ALL" },
  { value: "URGENT", label: "URGENT" },
  { value: "HIGH", label: "HIGH" },
  { value: "NORMAL", label: "NORMAL" },
  { value: "LOW", label: "LOW" },
];

const Patient = ({ getAllOrganizationList, organizationList }) => {
  const [validated, setValidated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
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
  const [patinetListAll, setPatinetListAll] = useState([]);
  const [pageNo, setPageNo] = useState(0);
  const [pageNoL2Patient, setPageNoL2Patient] = useState(0);
  const [pageNoL2User, setPageNoL2User] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [paginationFirst, setPaginationFirst] = useState(0);
  const [totalElements, setTotalElements] = useState(10);
  const [totalElementsPatient, setTotalElementsPatient] = useState(10);
  const [tableLoading, setTableLoading] = useState(true);
  const sideMenu = useSelector((state) => state.sideMenu);
  const [activeTab, setActiveTab] = useState(1);
  const [l2UserListAll, setL2UserListAll] = useState([]);
  const [isPatientList, setIsPatientList] = useState(false);
  const [l2patinetListAll, setL2PatinetListAll] = useState([]);
  const [l2selectUser, setL2selectUser] = useState(null);
  const [sort, setSort] = useState({ sortDir: "", sortField: "" });
  const [totalElementsUser, setTotalElementsUser] = useState(0);
  const [searchString, setSearchString] = useState("");
  const [checkedLoading, setCheckedLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedOptions, setSelectedOptions] = useState("");
  const [allocatedOption, setAllocatedOption] = useState("");
  const [batchCount, setBatchCount] = useState("");
  const [filterBatchCount, setFilterBatchCount] = useState(false);
  const [sortDueOrder, setSortDueOrder] = useState("DESC");
  const [sortCompleteOrder, setSortCompleteOrder] = useState("DESC");
  const filteredList = useSelector((state) => state.auth.filterList);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [searchStr, setSearchStr] = useState("");
  const [selectOrgList, setSelectedOrgList] = useState("");
  const [orgAllList, setOrgAllList] = useState([]);
  const [defaultOrgValue, setDefaultOrgValue] = useState(null);

  const dispatch = useDispatch();

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
    batchCount,
  }) => {
    const uId = localStorage.getItem("userId");
    const orgId = localStorage.getItem("orgId");
    let resoureUrl = `dbservice/patient/admin/computation/filter?page=${pageNo}&size=${pageSize}&userId=${uId}&organizationId=${orgId}&computationStart=${
      startDate ? startDate : ""
    }&computationEnd=${endDate ? endDate : ""}&isAllocation=${
      allocate ? allocate : ""
    }&status=${status}&searchString=${search ? search : ""}&sortdirection=${
      sort?.sortDir ? sort?.sortDir : ""
    }&sortfield=${sort?.sortField ? sort?.sortField : ""}&priority=${
      selectedOption ? selectedOption : ""
    }&batchCount=${batchCount ? batchCount : ""}`;
    const response = await axios.get(ENDPOINTS.apiEndoint + resoureUrl);
    if (response?.data) {
      let resultMap = [];
      let result = response?.data?.response?.content;
      setTotalElements(response?.data?.response?.totalElements);
      result?.map((res) => {
        resultMap.push({
          ...res,
          patientId: res.patientId,
          patientName: res.patientName,
          computedDate: res.computedDate,
        });
      });
      if (result?.length > 0) {
        setPatinetListAll(result);
        setIsLoading(false);
      } else {
        setPatinetListAll([]);
      }

      setTableLoading(false);
    }
  };
  const getAllCheckList = async (sort) => {
    setIsLoading(true);
    const uId = localStorage.getItem("userId");
    const orgId = localStorage.getItem("orgId");
    let resoureUrl = `dbservice/patient/admin/computation/filter?page=${pageNo}&size=${
      batchCount ? batchCount : pageSize
    }&userId=${uId}&organizationId=${orgId}&computationStart=&computationEnd=&isAllocation=true&status=2&searchString=${searchString}&sortdirection=${
      sort?.sortDir
    }&sortfield=${sort?.sortField}&priority=${
      selectedOption ? selectedOption : ""
    }&batchCount=${batchCount}`;
    const response = await axios.get(ENDPOINTS.apiEndoint + resoureUrl);
    if (response.data) {
      let result = response?.data?.response?.content;
      const data = result.map((item) => ({
        id: item.patientId,
        name: item.patientName,
      }));
      setSelectedRowsId(data);
      setHeaderCheckValidation(data);
      setIsLoading(false);
    }
  };

  const onPageChange = (e) => {
    setIsLoading(true);
    setPaginationFirst(e.first);
    setPageNo(e.page);
    setPageSize(e.rows);
    setTableLoading(true);
  };

  const handleReceivedDatePicker = (date, dateString) => {
    console.log(dateString);
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
    setIsLoading(true);
    setPaginationFirst(e.first);
    setPageNoL2Patient(e.page);
    setPageSize(e.rows);
    getL2PatientList(l2selectUser, e.page, sort, "");
    setTableLoading(true);
  };
  const selectTabClick = (number) => {
    setSearchString("");
    setPaginationFirst(0);
    setIsLoading(true);
    setActiveTab(number);
    setSelectedRowsId([]);
    setAllocateClicked(false);
    setSelectedRowsId([]);
    setSelectAllChecked(false);
    setSelectAllCheckedL2(false);
    if (number == 2) {
      getAuditL2List(pageNoL2User, "");
    } else {
      setIsPatientList(false);
      setPageNo(0);
      // getAllList(0, pageSize, "", "", true, 2, "", sort);
    }
  };
  const searchFunction = (search, activeTab) => {
    if (activeTab === 1) {
      setSearchStr(search);
    } else {
      if (!isPatientList) {
        getAuditL2List(pageNo, search);
      } else {
        getL2PatientList(l2selectUser, pageNoL2Patient, sort, search);
      }
    }
  };
  const debounceFunc = useCallback(
    debounce((text, activeTab) => searchFunction(text, activeTab), 900),
    []
  );
  const getNameSearch = (search) => {
    setSearchString(search);
    debounceFunc(search, activeTab);
  };

  const handleOpneModal = () => {
    setValidated(false);
    setAddPatientId(false);
    if (activeTab == 2) {
      setAllocateModalL2(true);
    } else {
      setAllocateModal(true);
    }
  };

  const getAuditL2List = async (pageNo, searchString) => {
    let orgId = localStorage.getItem("orgId");
    let tenantid = localStorage.getItem("tenantId");
    let resoureUrl = `dbservice/l2audit?organizationId=${orgId}&tenantid=${tenantid}&page=${pageNo}&size=${pageSize}&searchstring=${searchString}`;
    const response = await axios.get(ENDPOINTS.apiEndoint + resoureUrl);
    if (response.data) {
      let resultMap = [];
      let result = response?.data?.response?.content;
      setTotalElementsUser(response?.data?.response?.content?.totalElements);
      result?.map((res) => {
        resultMap.push({
          ...res,
          name: res.name,
          userName: res.userName,
          totalFileAudited: res.totalFileAudited,
          totalFileAuditAllocated: res.totalFileAuditAllocated,
          totalFileAuditPending: res.totalFileAuditPending,
          totalFileAuditHold: res.totalFileAuditHold,
          totalFileAuditDeclined: res.totalFileAuditDeclined,
          firstName: res.firstName,
          lastName: res.lastName,
          profileImageUrl: res.profileImageUrl,
        });
      });
      if (result?.length > 0) {
        setL2UserListAll(result);
      } else {
        setL2UserListAll([]);
      }
      setIsLoading(false);
      setTableLoading(false);
    }
  };

  useEffect(() => {
    if (selectAllChecked) {
      if (isPatientList == true) {
        getAllCheckListL2(sort);
      } else {
        getAllCheckList(sort);
      }
    } else {
      setSelectedRowsId([]);
    }
  }, [selectAllChecked, sort, isPatientList]);

  useEffect(() => {
    if (typeof pageNo == "number" && activeTab === 1) {
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
        selectOrgList,
      });
    }
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
  ]);
  useEffect(() => {
    console.log(selectOrgList);
    if (!isPatientList) {
      getAuditL2List(pageNo, searchStr, selectOrgList);
    }
  }, [selectOrgList, searchStr]);
  useEffect(() => {
    if (!organizationList?.response) {
      getAllOrganizationList();
    }
  }, []);
  useEffect(() => {
    var orgListArray = [{ value: "ALL", label: "ALL" }];
    organizationList?.response?.map((res) => {
      orgListArray.push({
        value: res.id,
        label: res.name,
      });
    });
    setOrgAllList(orgListArray);
  }, [organizationList]);
  const renderRows = () => {
    return !tableLoading && l2UserListAll?.length > 0 ? (
      l2UserListAll?.map((data, index) => (
        <tr
          style={{ height: "35px" }}
          key={index}
          onClick={() => {
            getL2PatientList(data, pageNoL2Patient, sort, "");
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
    { label: "ALL", value: "" },
    { label: "COMPLETED", value: "COMPLETED" },
    { label: "DECLINED", value: "DECLINED" },
  ];

  const getL2PatientList = async (
    data,
    pageNoL2Patient,
    sort,
    searchString,
    selectedOptions,
    allocatedOption
  ) => {
    setTableLoading(true);
    setIsLoading(true);
    let dataMap = {
      firstName: data?.firstName,
      lastName: data?.lastName,
      userName: data?.userName,
    };
    setL2selectUser(dataMap);
    let resoureUrl = `dbservice/l2audit/patients?username=${
      data?.userName
    }&page=${pageNoL2Patient}&size=${pageSize}&sortdirection=${
      sort?.sortDir ? sort?.sortDir : "DESC"
    }&sortfield=${
      sort?.sortField ? sort?.sortField : "dueDate"
    }&searchstring=${searchString}&processedStatus=${
      selectedOptions ? selectedOptions : ""
    }&patientAllocated=${allocatedOption ? allocatedOption : ""}`;
    const response = await axios.get(ENDPOINTS.apiEndoint + resoureUrl);
    if (response.data) {
      let resultMap = [];
      let result = response?.data?.response?.content;
      setTotalElementsPatient(response?.data?.response?.totalElements);
      result?.map((res) => {
        resultMap.push({
          ...res,
          patientId: res.patientId,
          patientName: res.patientName,
          computedDate: res.computedDate,
          patientAllocatedFirstName: res.patientAllocatedFirstName,
          patientAllocatedLastName: res.patientAllocatedLastName,
          patientAllocatedProfileImage: res.patientAllocatedProfileImage,
        });
      });
      const data = result.map((item) => ({
        id: item.patientId,
        name: item.patientName,
      }));
      setHeaderCheckValidation(data);
      if (result) {
        setL2PatinetListAll(result);
        setIsPatientList(true);
      } else {
        setL2PatinetListAll([]);
      }
      setTableLoading(false);
      setIsLoading(false);
    }
  };

  const getAllCheckListL2 = async (sort) => {
    setCheckedLoading(true);
    let resoureUrl = `dbservice/l2audit/patients?username=${l2selectUser.userName}&page=0&size=${totalElementsPatient}&sortdirection=${sort?.sortDir}&sortfield=${sort?.sortField}`;
    const response = await axios.get(ENDPOINTS.apiEndoint + resoureUrl);
    if (response.data) {
      let result = response?.data?.response;
      const data = result?.content?.map((item) => ({
        id: item.patientId,
        name: item.patientName,
      }));
      setSelectedRowsId(data);
      setHeaderCheckValidation(data);
    }
    setCheckedLoading(false);
  };
  useEffect(() => {
    setIsLoading(true);
    if (!isPatientList) {
      // getAllList(pageNo, pageSize, "", "", true, 2, "", sort);
    } else {
      getL2PatientList(
        l2selectUser,
        pageNoL2Patient,
        sort,
        "",
        selectedOptions,
        allocatedOption
      );
      setIsLoading(false);
    }
    setAllocateClicked(false);
    setSelectedRowsId([]);
    setSelectAllChecked(false);
    setSelectAllCheckedL2(false);
    setIsLoading(false);
    setFilterBatchCount(false);
  }, [
    isPatientList,
    pageNoL2Patient,
    sort,
    allocateClicked,
    selectedOption,
    filterBatchCount,
    selectedOptions,
    allocatedOption,
  ]);

  useEffect(() => {
    dispatch(getFilters("patientAllocated"));
  }, []);
  return (
    <>
      <div className={`show ${sideMenu ? "menu-toggle" : ""}`}>
        <Header />
        <div class="content-body">
          <div className="container-fluid">
            <div className="row">
              <div className="col-xl-12">
                <div className="">
                  <div className="card-body p-0">
                    <div className="table-responsive active-projects task-table">
                      <div className="tbl-caption  align-items-center">
                        <div className="row filter-contain">
                          <div
                            className={`${isPatientList && "d-flex"} col-xl-2`}
                          >
                            {isPatientList && (
                              <div className={reportStyles.backDiv}>
                                <button
                                  style={{ width: "40px", height: "40px" }}
                                  className={reportStyles.filterBtn}
                                  onClick={() => {
                                    setIsPatientList(false);
                                    setAllocatedOption("");
                                  }}
                                >
                                  <Image src={leftArrow} />
                                </button>
                              </div>
                            )}

                            <div>
                              <label>
                                {!isPatientList && activeTab == 2
                                  ? "Search by Name"
                                  : "Search by Name or ID"}
                              </label>
                              <div class="form-group has-search">
                                <FontAwesomeIcon
                                  className="fa fa-search form-control-feedback"
                                  icon={faSearch}
                                />
                                <InputText
                                  type="text"
                                  onChange={(e) =>
                                    getNameSearch(e.target.value)
                                  }
                                  value={searchString}
                                  className="form-control new-form-control"
                                  placeholder="Search"
                                  maxLength={25}
                                  onKeyDown={(e) => {
                                    // Prevent input of backslash ("\")
                                    if (e.key === "\\") {
                                      e.preventDefault();
                                    }
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                          {(activeTab == 1 ||
                            (!isPatientList && activeTab == 2)) && (
                            <div className="col-xl-2">
                              <div>
                                <Selector
                                  selectlabel={"Select Organization"}
                                  setSelectedOption={setSelectedOrgList}
                                  selectOptions={orgAllList}
                                  selectDefaultValue={defaultOrgValue}
                                  setDefaultValue={setDefaultOrgValue}
                                  // isClose={true}
                                />
                              </div>
                            </div>
                          )}

                          {!isPatientList && activeTab == 1 ? (
                            <>
                              <div className="col-xl-2">
                                <label>Computed Date</label>
                                <div>
                                  <RangePicker
                                    format="MM-DD-YYYY"
                                    onChange={(dates, dateStrings) => {
                                      setDateRange(dateStrings);
                                      handleReceivedDatePicker(
                                        dates,
                                        dateStrings
                                      );
                                    }}
                                    disabledDate={(current) =>
                                      disableFutureDate(current)
                                    }
                                  />
                                </div>
                              </div>
                              <div className="col-xl-2">
                                <div>
                                  <Selector
                                    selectlabel={"Select Priority"}
                                    setSelectedOption={setSelectedOption}
                                    selectOptions={statusOption}
                                    defaultSelectValue1={""}
                                    // isClose={true}
                                  />
                                </div>
                              </div>

                              {/* <div className="col-xl-2">
                                <label>Batch Count</label>
                                <div class="form-group d-flex">
                                  <InputText
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
                                  </button>
                                </div>
                              </div> */}
                            </>
                          ) : !isPatientList && activeTab == 2 ? (
                            <div className="col-xl-6"></div>
                          ) : (
                            <>
                              <div className="col-xl-2">
                                <div>
                                  <Selector
                                    selectlabel={"Reviewer"}
                                    setSelectedOption={setAllocatedOption}
                                    selectOptions={generateOptionsList(
                                      filteredList
                                    )}
                                    defaultSelectValue1={""}
                                    // isClose={true}
                                  />
                                </div>
                              </div>
                              <div className="col-xl-2">
                                <div>
                                  <Selector
                                    selectlabel={"Status"}
                                    setSelectedOption={setSelectedOptions}
                                    selectOptions={statusOptions}
                                    defaultSelectValue1={""}
                                    // isClose={true}
                                  />
                                </div>
                              </div>
                            </>
                          )}
                          <div
                            className={
                              isPatientList && activeTab == 2
                                ? `col-xl-6 mt-4 ${TableStyle.allocateBtn}`
                                : `col-xl-4 mt-4 ${TableStyle.allocateBtn}`
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
                                  {patinetListAll?.length === 0 &&
                                  tableLoading ? (
                                    <SpinnerDots />
                                  ) : (
                                    <>
                                      <AllocatedAdminList
                                        patinetListAll={patinetListAll}
                                        selectAllChecked={selectAllChecked}
                                        setSelectAllChecked={
                                          setSelectAllChecked
                                        }
                                        selectedRowsId={selectedRowsId}
                                        setSelectedRowsId={setSelectedRowsId}
                                        selectedChart={headerCheckValidation}
                                        setSort={setSort}
                                        loading={isLoading}
                                      />
                                      <div>
                                        <div className="pagination-container">
                                          <Paginator
                                            first={paginationFirst}
                                            rows={15}
                                            totalRecords={totalElements}
                                            onPageChange={onPageChange}
                                          />
                                          <div className="total-pages">
                                            Total count: {totalElements}
                                          </div>
                                        </div>
                                      </div>
                                    </>
                                  )}
                                </Tab.Pane>

                                <Tab.Pane id="my-posts" eventKey="team">
                                  {tableLoading ? (
                                    <SpinnerDots />
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
                                                      textAlign: "center",
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
                                                    l2UserListAll?.length
                                                  }
                                                  onPageChange={onPageChange}
                                                />
                                                <div className="total-pages">
                                                  Total count:{" "}
                                                  {l2UserListAll?.length}
                                                </div>
                                              </div>
                                            </div>
                                          </>
                                        ) : (
                                          <>
                                            <AllocatedL2AdminList
                                              patinetListAll={l2patinetListAll}
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
                                              selectedChart={
                                                headerCheckValidation
                                              }
                                              setSort={setSort}
                                              sort={sort}
                                              loading={checkedLoading}
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
                                                    first={paginationFirst}
                                                    rows={15}
                                                    totalRecords={
                                                      totalElementsPatient
                                                    }
                                                    onPageChange={
                                                      onPageChangePatient
                                                    }
                                                  />
                                                  <div className="total-pages">
                                                    Total count:{" "}
                                                    {totalElementsPatient}
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
    organizationList: state?.tenantAdmin?.allOrganization?.data,
  }),
  {
    getAllOrganizationList: tenantAdminAction.getAllOrganizationAction,
  }
);
export default enhancer(Patient);
