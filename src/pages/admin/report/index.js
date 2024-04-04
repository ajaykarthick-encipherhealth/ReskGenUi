import React, { useState, useEffect } from "react";
import { Modal, DatePicker } from "antd";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Tab, Nav } from "react-bootstrap";
import Select from "react-select";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { FilterMatchMode } from "primereact/api";
import { InputText } from "primereact/inputtext";
import "react-circular-progressbar/dist/styles.css";
import styles from "./report.module.css";
import Header from "../../../jsx/layouts/nav/Header";
import SentReportTable from "../../../components/table/sentReport/sentReport";
import ReceivedReport from "../../../components/table/receivedReport/receivedReport";
import CoderReport from "../../../components/table/CoderReport/coderReport";
import Export, { debounce } from "./Export";
import {
  getReceivedDetails,
  getReportDetails,
  getSentDetails,
} from "../../../store/actions/adminAction/ReportActions";
import { getSelectUserList } from "../../../store/actions/adminAction/DashboardAction";
import SpinnerDots from "../../../components/spinner";
import HeaderFilters from "../../../components/headerFilters";
import { getActiveTab } from "../../../store/actions/l2Action/AuditReportAction";
import { useRouter } from "next/router";

const statusOptions = [
  { label: "All", value: "ALL" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Pending", value: "PENDING" },
  { label: "Declined", value: "DECLINED" },
  { label: "Hold", value: "HOLD" },
];

const index = () => {
  const dispatch = useDispatch();
  const route = useRouter()
  const ExportResponse = useSelector((state) => state.adminReport?.exportRes);

  const ReportPatientDetails = useSelector(
    (state) => state.adminReport?.details
  );
  const SentReportDetails = useSelector(
    (state) => state.adminReport?.sentDetails
  );

  const ReceivedReportDetails = useSelector(
    (state) => state.adminReport?.receivedDetails
  );

  const rowsLength = useSelector((state) => state?.report?.row);
  const reportActiveTab = useSelector((state) => state.AuditReport?.activetab);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("CoderReport");
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
  const [selectedCoderOptReport, setSelectedCoderOptReport] = useState("");
  const [coderSearch, setCoderSearch] = useState("");
  const [sentSearch, setSentSearch] = useState("");
  const [receivedSearch, setReceivedSearch] = useState("");
  const [receivedSortOrder, setReceivedSortOrder] = useState("DESC");
  const [sentSortOrder, setSentSortOrder] = useState("DESC");
  const [coderSortOrder, setCoderSortOrder] = useState("DESC");
  const [sort, setSort] = useState({ sortDir: "", sortField: "" });
  const [isindividual, setIsindividual] = useState(false);
  const [selectMemberType, setSelectMemberType] = useState("");
  const [selectUser, setSelectUser] = useState([]);
  const [selectManager, setSelectedManger] = useState("");
  const [select, setSelect] = useState(null);

  const ReceivedOptions = [];
  ReceivedReportDetails?.data?.response?.content?.map((item) => {
    return ReceivedOptions?.push({ label: item.sender, value: item.sender });
  });
  const SentOptions = [];
  const uniqueRoles = new Set();

  const completedDatas = useSelector(
    (state) => state?.AdminDashboardReducers?.completedStatus
  );
  const selectUserList = useSelector(
    (state) => state?.AdminDashboardReducers?.selectedUsers
  );

  const activeTabs = useSelector((state) => state?.adminReport?.activetab);

  SentReportDetails?.data?.response?.data?.forEach((data) => {
    data?.receivedUsers?.forEach((item) => {
      const role = item.role;
      if (!uniqueRoles.has(role)) {
        SentOptions.push({ label: role, value: role });
        uniqueRoles.add(role);
      }
    });
  });
  const memberTypeChanges = (e) => {
    setSelectMemberType(e);
    setIsindividual(false);
    setSelectUser([]);
    if (e != "All") {
      setIsindividual(true);
    }
  };

  const onPageChange = (e) => {
    setPaginationFirst(e.first);
    setPageNo(e.page);
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
    // setActiveTab(name);
    dispatch(getActiveTab(name));
  };
  useEffect(() => {
    dispatch(getSelectUserList(selectMemberType));
  }, [selectMemberType]);
  useEffect(() => {
    setIsLoading(false);
    if (reportActiveTab === "SentReport") {
      dispatch(
        getSentDetails(sentPageNo, startDate, endDate, sentSearch, sort)
      );
    }
    if (reportActiveTab === "ReceivedReport") {
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

    if (!reportActiveTab || reportActiveTab === "CoderReport") {
      dispatch(
        getReportDetails(
          pageNo,
          coderStartDate,
          coderEndDate,
          coderSearch,
          selectedCoderOpt,
          selectedCoderOptReport?.value ? selectedCoderOptReport?.value : "",
          sort,
          selectManager?.value && selectedCoderOptReport?.value !== "All"
            ? selectManager?.value
            : ""
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
    ExportResponse,
    selectedCoderOpt,
    selectedCoderOptReport,
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
    selectManager,
    select,
  ]);

  useEffect(() => {
    setFilteredCoder(ReportPatientDetails?.response);
  }, [ReportPatientDetails]);
  useEffect(() => {
    if (selectedCoderOptReport && !select) {
      dispatch(
        getSelectUserList(
          selectedCoderOptReport === null &&
            selectedCoderOptReport?.value === "All"
            ? ""
            : selectedCoderOptReport?.value
        )
      );
    }
  }, [selectedCoderOptReport]);
  const options = [
    { value: "", label: "All" },
    { value: "REVIEWER", label: "REVIEWER" },
    { value: "SUPERVISOR", label: "SUPERVISOR" },
  ];

  const optionsUser =
    selectUserList?.data?.response?.map((res) => ({
      value: res.userName,
      label: res.firstName + " " + res.lastName,
    })) || [];

  if (optionsUser.length > 0) {
    optionsUser.unshift({ value: "", label: "All" });
  }

  useEffect(() => {
    if (reportActiveTab) {
      dispatch(getActiveTab(reportActiveTab));
    }
  }, [reportActiveTab]);

  useEffect(() => {
    const page = new URLSearchParams(window.location.search).get("page");
    const limit = new URLSearchParams(window.location.search).get("limit");
    if (reportActiveTab === "ReceivedReport" && page) {
      setReceivedPageNo(page)
      setPaginationReceivedFirst(limit)
    } else if (reportActiveTab === "SentReport" && page) {
      setSentPageNo(page)
      setPaginationSentFirst(limit)
    } 
  }, [reportActiveTab])


  const backRender = () => {
    const user = localStorage.getItem('userRole')
    if (user == 'admin') {
      route.push('/admin/report?page=0&limit=0')
    }
  }

  return (
    <>
      <Header />
      <div className={styles.maincontainer}>
        <div class="content-body">
          {!ReportPatientDetails?.response ? (
            <SpinnerDots />
          ) : (
            <div className="container-fluid">
              <div className="row">
                <div className="col-xl-12">
                  <div className="">
                    <div className="card-body p-0">
                      <div className="table-responsive active-projects task-table">
                        <div className="tbl-caption  align-items-center">
                          <HeaderFilters
                            // search
                            setSentSearch={setSentSearch}
                            setReceivedSearch={setReceivedSearch}
                            setCoderSearch={setCoderSearch}
                            isSearch={true}
                            coderSearch={coderSearch}
                            receivedSearch={receivedSearch}
                            sentSearch={sentSearch}
                            searchlabel="Search by Name"
                            // selector
                            selectlabel="Select Status"
                            isSelector={
                              !reportActiveTab ||
                              reportActiveTab === "CoderReport"
                                ? true
                                : false
                            }
                            setSelectedOption={setSelectedCoderOpt}
                            selectOptions={statusOptions}
                            defaultSelectValue1={""}
                            // selector

                            selectlabel2="Select User Role"
                            selectReportOptions={
                              !reportActiveTab ||
                              reportActiveTab === "CoderReport"
                                ? options
                                : null
                            }
                            setSelectedOption2={setSelectedCoderOptReport}
                            defaultSelectValue2={selectedCoderOptReport}
                            // selector3
                            isSelector3={
                              selectUserList?.data?.response?.length
                                ? true
                                : false
                            }
                            selectedCoderOptReport={selectedCoderOptReport}
                            selectlabel3="Select User"
                            selectOptions3={optionsUser}
                            setSelectedOption3={setSelectedManger}
                            defaultSelectValue3="All"
                            value={selectManager}
                            // rangepicker
                            isRangePicker={true}
                            pickerlabel={
                              reportActiveTab === "ReceivedReport"
                                ? "Received Date"
                                : reportActiveTab === "SentReport"
                                ? "Sent Date"
                                : "Select Date"
                            }
                            setStartDate={setStartDate}
                            setEndDate={setEndDate}
                            setReceivedStartDate={setReceivedStartDate}
                            setReceivedEndDate={setReceivedEndDate}
                            setCoderStartDate={setCoderStartDate}
                            setCoderEndDate={setCoderEndDate}
                            activeTab={
                              !reportActiveTab ? "CoderReport" : reportActiveTab
                            }
                            rowsLength={rowsLength}
                            setIsModalVisible={setIsModalVisible}
                            selectedDates={selectedDates}
                            setSelectedDates={setSelectedDates}
                            disable="Yes"
                            setSelect={setSelect}
                            adminReport={true}
                          />
                        </div>
                        <Export
                          isModalVisible={isModalVisible}
                          closeModal={closeModal}
                          rowsLength={rowsLength}
                          setIsModalVisible={setIsModalVisible}
                          setSelectedRows={setSelectedRows}
                          setSelectAll={setSelectAll}
                          // selectedRows={selectedRows}
                        />

                        <div
                          id="task-tbl_wrapper"
                          className="dataTables_wrapper no-footer"
                        >
                          <div
                            className="profile-tab "
                            style={{ marginTop: "20px" }}
                          >
                            <div className="custom-tab-1">
                              <Tab.Container
                                defaultActiveKey={
                                  reportActiveTab === "ReceivedReport"
                                    ? "meatCriteria"
                                    : reportActiveTab === "SentReport"
                                    ? "comboDiseases"
                                    : "validDiseases"
                                }
                              >
                                <Nav as="ul" className="nav nav-tabs">
                                  <Nav.Item
                                    as="li"
                                    className="nav-item"
                                    onClick={() => {
                                      handleTabs("CoderReport");
                                      backRender()
                                    }}
                                  >
                                    <Nav.Link
                                      to="#my-posts"
                                      eventKey="validDiseases"
                                    >
                                      Admin Report
                                    </Nav.Link>
                                  </Nav.Item>
                                  <Nav.Item
                                    as="li"
                                    className="nav-item"
                                    onClick={() => {
                                      handleTabs("SentReport");
                                      backRender()
                                    }}
                                  >
                                    <Nav.Link
                                      to="#my-posts"
                                      eventKey="comboDiseases"
                                    >
                                      Sent Report
                                    </Nav.Link>
                                  </Nav.Item>
                                  <Nav.Item
                                    as="li"
                                    className="nav-item"
                                    onClick={() => {
                                      handleTabs("ReceivedReport");
                                      backRender()
                                    }}
                                  >
                                    <Nav.Link
                                      to="#my-posts"
                                      eventKey="meatCriteria"
                                    >
                                      Received Report
                                    </Nav.Link>
                                  </Nav.Item>
                                </Nav>
                                <Tab.Content>
                                  <Tab.Pane
                                    id="my-posts"
                                    eventKey="validDiseases"
                                  >
                                    <CoderReport
                                      setModal={setModal}
                                      modal={modal}
                                      reportListAll={filteredCOder}
                                      paginationFirst={paginationFirst}
                                      ReportPatientDetails={
                                        ReportPatientDetails?.response
                                      }
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
                                    />
                                  </Tab.Pane>
                                  <Tab.Pane
                                    id="my-posts"
                                    eventKey="nonhcc"
                                  ></Tab.Pane>
                                  <Tab.Pane
                                    id="my-posts"
                                    eventKey="comboDiseases"
                                  >
                                    <SentReportTable
                                      paginationFirst={paginationSentFirst}
                                      details={
                                        SentReportDetails?.data?.response
                                      }
                                      onSentPageChange={onSentPageChange}
                                      loading={SentReportDetails?.loading}
                                      setSortOrder={setSentSortOrder}
                                      sortOrder={sentSortOrder}
                                      setSort={setSort}
                                      receivedPageNo={sentPageNo}
                                      receivedStartDate={startDate}
                                      receivedEndDate={endDate}
                                      isAdmin={true}
                                    />
                                  </Tab.Pane>
                                  <Tab.Pane
                                    id="my-posts"
                                    eventKey="meatCriteria"
                                  >
                                    {ReceivedReportDetails?.data?.response
                                      ?.content && (
                                      <ReceivedReport
                                        paginationFirst={
                                          paginationReceivedFirst
                                        }
                                        details={
                                          ReceivedReportDetails?.data?.response
                                        }
                                        onPageChange={onReceivedPageChange}
                                        receivedPageNo={receivedPageNo}
                                        receivedStartDate={receivedStartDate}
                                        receivedEndDate={receivedEndDate}
                                        loading={ReceivedReportDetails?.loading}
                                        setSortOrder={setReceivedSortOrder}
                                        sortOrder={receivedSortOrder}
                                        setSort={setSort}
                                        isAdmin={true}
                                      />
                                    )}
                                  </Tab.Pane>
                                  <Tab.Pane
                                    id="my-posts"
                                    eventKey="RafScore"
                                  ></Tab.Pane>
                                  <Tab.Pane
                                    id="my-posts"
                                    eventKey="file"
                                  ></Tab.Pane>
                                </Tab.Content>
                              </Tab.Container>
                            </div>
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
                                    <span className={styles.headText}>
                                      Hcc codes
                                    </span>
                                  </div>
                                  <div className={styles.data}>
                                    {comments && comments ? (
                                      Object.entries(comments).map(
                                        ([year, commentsArray]) => (
                                          <div key={year}>
                                            <div className={styles.datas}>
                                              {year}
                                            </div>
                                            {commentsArray.map(
                                              (comment, index) => (
                                                <div
                                                  key={index}
                                                  className={styles.comment}
                                                >
                                                  <p>{comment.comment}</p>
                                                </div>
                                              )
                                            )}
                                          </div>
                                        )
                                      )
                                    ) : (
                                      <p>Comments not found</p>
                                    )}
                                    {/* <div className={styles.datas}>
                                      Visit Data
                                    </div>
                                    <div className={styles.description}>
                                      Lorem Ipsum is simply dummy text of the
                                      printing and typesetting industry.
                                    </div>
                                  </div>
                                  <div className={styles.data}>
                                    <div className={styles.datas}>
                                      Combination codes
                                    </div>
                                    <div className={styles.description}>
                                      Lorem Ipsum is simply dummy text of the
                                      printing and typesetting industry.
                                    </div>
                                  </div>
                                  <div className={styles.data}>
                                    <div className={styles.datas}>
                                      M.E.A.T criteria
                                    </div>
                                    <div className={styles.description}>
                                      Lorem Ipsum is simply dummy text of the
                                      printing and typesetting industry.
                                    </div>
                                  </div>
                                  <div className={styles.heads}>
                                    <span className={styles.headText}>
                                      Radiology{" "}
                                    </span>
                                  </div>
                                  <div className={styles.data}>
                                    <div className={styles.datas}>
                                      Visit Data
                                    </div>
                                    <div className={styles.description}>
                                      Lorem Ipsum is simply dummy text of the
                                      printing and typesetting industry.
                                    </div>
                                  </div>
                                  <div className={styles.data}>
                                    <div className={styles.datas}>
                                      Combination codes
                                    </div>
                                    <div className={styles.description}>
                                      Lorem Ipsum is simply dummy text of the
                                      printing and typesetting industry.
                                    </div> */}
                                  </div>
                                </div>
                              </div>
                            </Modal>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default index;
