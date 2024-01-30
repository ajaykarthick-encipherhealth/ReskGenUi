import React, { useState, useEffect } from "react";
import { Button, Spinner } from "react-bootstrap";
import Header from "../../../jsx/layouts/nav/Header";
import { useSelector } from "react-redux";
import axios from "../../../utility/axiosConfig";
import ENDPOINTS from "../../../utility/enpoints";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "react-facebook-loading/dist/react-facebook-loading.css";
import { faUpload, faSearch } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { patientDetails } from "../../../store/actions/AuthActions";
import { DatePicker, Empty } from "antd";
import { InputText } from "primereact/inputtext";
import { Paginator } from "primereact/paginator";
import Footer from "../../../jsx/layouts/Footer";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import visitStyles from "../../../styles/visitdata.module.css";
import AddPatientListTable from "../../../components/table/admin/AddPatients/addPatients";
import { getMessagesList } from "../../../store/actions/adminAction/fileProcessingActions";
import { getPatients } from "../../../store/actions/adminAction/patientsActions";
import FileUploading from "../file-processing/FileUploading";
import Addpatients from "../file-processing/Addpatiens";
import AllocatedAdminList from "../../../components/table/admin/allocatedAdminList/allocatedAdminList";
import AllocatedL2AdminList from "../../../components/table/admin/allocatedL2AdminList/allocatedL2AdminList";
import allocateStyle from "./allocate/style.module.css";
import AllocateModal from "./allocate";
import L2AllocateModal from "./l2allocate";
import LoadingSpinner from "../../../components/spinner";
import reportStyles from "../../physician/report/report.module.css";
import moment from "moment/moment";
import { Tab, Nav } from "react-bootstrap";
import SpinnerDots from "../../../components/spinner";
import L2AllocatedAdminList from "./table/l2AuditedTable";
import TableStyle from "../../../components/table/table.module.css";
import Image from "next/image";
import leftArrow from "../../../images/svg/leftArrow.svg";

const { RangePicker } = DatePicker;
export default function Patient() {
  const navigate = useRouter();
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
  const [totalElementsUser, setTotalElementsUser] = useState(10);
  const [totalElementsPatient, setTotalElementsPatient] = useState(10);
  const [tableLoading, setTableLoading] = useState(true);
  const sideMenu = useSelector((state) => state.sideMenu);
  const [activeTab, setActiveTab] = useState(1);
  const [l2UserListAll, setL2UserListAll] = useState([]);
  const [isPatientList, setIsPatientList] = useState(false);
  const [l2patinetListAll, setL2PatinetListAll] = useState([]);
  const [l2selectUser, setL2selectUser] = useState(null);
  const [l2patinetLisSelected, setl2patinetLisSelected] = useState([]);

  useEffect(() => {
    if (typeof pageNo == "number") {
      getAllList(pageNo, pageSize, "", "", true, 2);
    }
  }, [pageNo, pageSize]);

  const getAllList = async (
    pageNo = 0,
    pageSize = 15,
    startDate = "",
    endDate = "",
    allocate = true,
    status = 2,
    search = ""
  ) => {
    var resoureUrl = `dbservice/patient/admin/computation/filter?page=${pageNo}&size=${pageSize}&userId=uavis01@encipherhealth.onmicrosoft.com&computationStart=${startDate}&computationEnd=${endDate}&isAllocation=${allocate}&status=${status}&searchString=${search}`;
    const response = await axios.get(ENDPOINTS.apiEndoint + resoureUrl);
    if (response.data) {
      var resultMap = [];
      var result = response?.data?.response?.content;
      setTotalElements(response?.data?.response?.totalElements);
      result?.map((res) => {
        resultMap.push({
          ...res,
          patientId: res.patientId,
          patientName: res.patientName,
          computedDate: res.computedDate,
        });
      });
      if (result.length > 0) {
        setPatinetListAll(result);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        setPatinetListAll([]);
      }

      // setIsLoading(false);
      setTableLoading(false);
    }
  };
  const getAllCheckList = async () => {
    var resoureUrl = `dbservice/patient/admin/computation/filter?page=0&size=${totalElements}&userId=uavis01@encipherhealth.onmicrosoft.com&computationStart=&computationEnd=&isAllocation=true&status=2`;
    const response = await axios.get(ENDPOINTS.apiEndoint + resoureUrl);
    if (response.data) {
      var result = response?.data?.response?.content;
      const data = result.map((item) => ({
        id: item.patientId,
        name: item.patientName,
      }));
      setSelectedRowsId(data);
      setHeaderCheckValidation(data);
    }
  };

  useEffect(() => {
    if (selectAllChecked) {
      if (isPatientList == true) {
        getAllCheckListL2();
      } else {
        getAllCheckList();
      }
    } else {
      setSelectedRowsId([]);
    }
  }, [selectAllChecked]);

  const handleReceivedDatePicker = (date, dateString) => {
    if (dateString[0] == "") {
      getAllList(pageNo, pageSize, "", "", true, 2);
    } else if (dateString.length > 1) {
      const formattedDates = dateString?.map((date, index) => {
        const formattedDate =
          index === 1
            ? `${moment(date).format("YYYY-MM-DD")}T23:59:59.999Z`
            : `${moment(date).format("YYYY-MM-DD")}T00:00:00.000Z`;
        return formattedDate;
      });
      if (dateString.length > 0) {
        getAllList(
          pageNo,
          pageSize,
          formattedDates[0],
          formattedDates[1],
          true,
          2
        );
      }
    }
  };

  const getNameSearch = (search) => {
    getAllList(
      pageNo,
      pageSize,
      dateRange ? dateRange[0] : "",
      dateRange ? dateRange[1] : "",
      true,
      2,
      search
    );
  };

  const onPageChange = (e) => {
    setIsLoading(true);
    setPaginationFirst(e.first);
    setPageNo(e.page);
    setPageSize(e.rows);
    setTableLoading(true);
  };

  const onPageChangePatient = (e) => {
    setIsLoading(true);
    setPaginationFirst(e.first);
    setPageNoL2Patient(e.page);
    setPageSize(e.rows);
    getL2PatientList(l2selectUser, e.page);
    setTableLoading(true);
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
  const selectTabClick = (number) => {
    setPaginationFirst(0);
    setIsLoading(true);
    setActiveTab(number);
    setSelectedRowsId([]);
    setAllocateClicked(false);
    setSelectedRowsId([]);
    setSelectAllChecked(false);
    setSelectAllCheckedL2(false);
    if (number == 2) {
      getAuditL2List(pageNoL2User);
    } else {
      setIsPatientList(false);
      setPageNo(0);
      getAllList(0, pageSize, "", "", true, 2);
    }
  };
  const getAuditL2List = async (pageNo) => {
    var orgId = localStorage.getItem("orgId");
    var tenantid = localStorage.getItem("tenantId");
    var resoureUrl = `dbservice/l2audit?orgid=${orgId}&tenantid=${tenantid}&page=${pageNo}&size=${pageSize}`;
    const response = await axios.get(ENDPOINTS.apiEndoint + resoureUrl);
    if (response.data) {
      var resultMap = [];
      var result = response?.data?.response;
      // setTotalElementsUser(response?.data?.response?.totalElements);
      result?.map((res) => {
        resultMap.push({
          ...res,
          name: res.name,
          userName: res.userName,
        });
      });
      if (result?.length > 0) {
        setL2UserListAll(result);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        setL2UserListAll([]);
      }
      setTableLoading(false);
    }
  };

  const renderRows = () => {
    return l2UserListAll?.map((data, index) => (
      <tr
        style={{ height: "35px" }}
        key={index}
        onClick={() => {
          getL2PatientList(data, pageNoL2Patient);
        }}
      >
        <td className={TableStyle.firstTdBorder}>{data.name}</td>
        <td className={TableStyle.childBorder}>{data.userName}</td>
      </tr>
    ));
  };

  const getL2PatientList = async (data, pageNoL2Patient) => {
    setIsLoading(true);
    var dataMap = {
      firstName: data.name,
      userName: data.userName,
    };
    setL2selectUser(dataMap);
    var resoureUrl = `dbservice/l2audit/patients?username=${data.userName}&page=${pageNoL2Patient}&size=${pageSize}`;
    const response = await axios.get(ENDPOINTS.apiEndoint + resoureUrl);
    if (response.data) {
      var resultMap = [];
      var result = response?.data?.response?.content;
      setTotalElementsPatient(response?.data?.response?.totalElements);
      result?.map((res) => {
        resultMap.push({
          ...res,
          patientId: res.patientId,
          patientName: res.patientName,
          computedDate: res.computedDate,
        });
      });
      const data = result.map((item) => ({
        id: item.patientId,
        name: item.patientName,
      }));
      setHeaderCheckValidation(data);
      if (result?.length > 0) {
        setL2PatinetListAll(result);
        setIsPatientList(true);
        setIsLoading(false);
      } else {
        setL2PatinetListAll([]);
        setIsLoading(false);
      }
    }
    // dispatch(getL2PatientListAll(value));
  };

  const getAllCheckListL2 = async (value) => {
    var resoureUrl = `dbservice/l2audit/patients?username=${l2selectUser.userName}&page=0&size=${totalElementsPatient}`;
    const response = await axios.get(ENDPOINTS.apiEndoint + resoureUrl);
    if (response.data) {
      var resultMap = [];
      var result = response?.data?.response;
      const data = result?.content?.map((item) => ({
        id: item.patientId,
        name: item.patientName,
      }));
      setSelectedRowsId(data);
      setHeaderCheckValidation(data);
    }
    // dispatch(getL2PatientListAll(value));
  };
  useEffect(() => {
    if (allocateClicked) {
      setIsLoading(true);
      if (!isPatientList) {
        getAllList(pageNo, pageSize, "", "", true, 2);
      } else {
        getL2PatientList(l2selectUser, pageNoL2Patient);
      }
      setAllocateClicked(false);
      setSelectedRowsId([]);
      setSelectAllChecked(false);
      setSelectAllCheckedL2(false);
    }
  }, [allocateClicked]);
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
                          <div className="col-xl-2 d-flex">
                            <div className={reportStyles.backDiv}>
                              {isPatientList && (
                                <button
                                  style={{ width: "40px", height: "40px" }}
                                  className={reportStyles.filterBtn}
                                  onClick={() => setIsPatientList(false)}
                                >
                                  <Image src={leftArrow} />
                                </button>
                              )}
                            </div>
                            <div>
                              <label>Search by Name or ID</label>
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
                                  className="form-control new-form-control"
                                  placeholder="Search"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-xl-2">
                            <label>Computed Date</label>
                            <div>
                              <RangePicker
                                format="MM-DD-YYYY"
                                onChange={(dates, dateStrings) => {
                                  setDateRange(dateStrings);
                                  handleReceivedDatePicker(dates, dateStrings);
                                }}
                              />
                            </div>
                          </div>
                          <div className="col-xl-8 mt-4">
                            {isPatientList || activeTab===1 ? (
                              <>
                                <button
                                  onClick={handleOpneModal}
                                  className={`btn btn-primary btn-sm mx-4 ms-2 flr ${allocateStyle.modalBtn}`}
                                  disabled={!selectedRowsId.length > 0}
                                >
                                  Allocate
                                </button>
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
                                    selectTabClick(1);
                                  }}
                                >
                                  <Nav.Link
                                    to="#my-posts"
                                    eventKey="validDiseases"
                                  >
                                    L1 Auditor Allocation
                                  </Nav.Link>
                                </Nav.Item>
                                <Nav.Item
                                  as="li"
                                  className="nav-item"
                                  onClick={() => {
                                    selectTabClick(2);
                                  }}
                                >
                                  <Nav.Link to="#my-posts" eventKey="team">
                                    L2 Auditor Allocation
                                  </Nav.Link>
                                </Nav.Item>
                              </Nav>

                              <Tab.Content>
                                <Tab.Pane
                                  id="my-posts"
                                  eventKey="validDiseases"
                                >
                                  {isLoading ? (
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

                                      <Footer />
                                    </>
                                  )}
                                </Tab.Pane>
                                <Tab.Pane id="my-posts" eventKey="team">
                                  {isLoading ? (
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
                                                  <th>NAME</th>
                                                  <th>USER NAME</th>
                                                </tr>
                                              </thead>

                                              <tbody>
                                                {l2UserListAll?.length <= 0 ? (
                                                  <tr>
                                                    <td colSpan="9">
                                                      <Empty />
                                                    </td>
                                                  </tr>
                                                ) : (
                                                  renderRows()
                                                )}
                                              </tbody>
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

                                      <Footer />
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
}
