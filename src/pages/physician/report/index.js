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
} from "../../../store/actions/ReportActions";
import SpinnerDots from "../../../components/spinner";
import HeaderFilters from "../../../components/headerFilters";

const { RangePicker } = DatePicker;
const statusOptions = [
  { label: "Completed", value: "COMPLETED" },
  { label: "Pending", value: "PENDING" },
  { label: "Declined", value: "DECLINED" },
  { label: "Hold", value: "HOLD" },
  { label: "All", value: "ALL" },
];

const index = () => {
  const dispatch = useDispatch();
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
  const [coderSearch, setCoderSearch] = useState("");
  const [sentSearch, setSentSearch] = useState("");
  const [receivedSearch, setReceivedSearch] = useState("");
  const [receivedSortOrder, setReceivedSortOrder] = useState("ASC");
  const [sortField, setSortField] = useState(null);

  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    patientId: { value: null, matchMode: FilterMatchMode.CONTAINS },
    patientName: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const performanceSearch = (value) => {
    if (activeTab === "SentReport") {
      setSentSearch(value);
    } else if (activeTab === "ReceivedReport") {
      setReceivedSearch(value);
    } else {
      setCoderSearch(value);
    }
  };
  const debouncedSearch = debounce(performanceSearch, 500);

  const filterChangePatientId = (event) => {
    const value = event.target.value;
    let _filters = { ...filters };
    _filters["patientId"].value = value;
    setFilters(_filters);
    debouncedSearch(value);
  };

  const ExportResponse = useSelector((state) => state.report?.exportRes);

  useEffect(() => {
    setIsLoading(false);
    if (activeTab === "SentReport") {
      dispatch(getSentDetails(sentPageNo, startDate, endDate, sentSearch));
    }
    if (activeTab === "ReceivedReport") {
      dispatch(
        getReceivedDetails(
          receivedPageNo,
          receivedStartDate,
          receivedEndDate,
          receivedSearch,
          sortField,
          receivedSortOrder
        )
      );
    }

    if (activeTab === "CoderReport") {
      dispatch(
        getReportDetails(
          pageNo,
          coderStartDate,
          coderEndDate,
          coderSearch,
          selectedCoderOpt
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
    activeTab,
    ExportResponse,
    selectedCoderOpt,
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
    sortField,
  ]);

  const ReportPatientDetails = useSelector((state) => state.report?.details);
  const SentReportDetails = useSelector((state) => state.report?.sentDetails);
  const ReceivedReportDetails = useSelector(
    (state) => state.report?.receivedDetails
  );
  useEffect(() => {
    setFilteredCoder(ReportPatientDetails?.response);
  }, [ReportPatientDetails]);

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
  const dosOnChange = (selectedOption) => {
    const selectedValue = selectedOption.value;
    setSelectedCoderOpt(selectedValue);
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

  const handleExport = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedRows([]);
    setSelectAll(false);
  };

  const handleDatePickerChange = (date, dateString) => {
    const formattedDates = dateString?.map((date, index) => {
      const formattedDate =
        index === 1
          ? date && `${date}T23:59:59.999Z`
          : date && `${date}T00:00:00.000Z`;
      return formattedDate;
    });
    setStartDate(formattedDates[0]);
    setEndDate(formattedDates[1]);
    setSelectedDates(date);
  };

  const handleReceivedDatePicker = (date, dateString) => {
    const formattedDates = dateString?.map((date, index) => {
      const formattedDate =
        index === 1
          ? date && `${date}T23:59:59.999Z`
          : date && `${date}T00:00:00.000Z`;
      return formattedDate;
    });
    setReceivedStartDate(formattedDates[0]);
    setReceivedEndDate(formattedDates[1]);
    setSelectedDates(date);
  };
  const handleCoderPicker = (date, dateString) => {
    const formattedDates = dateString?.map((date, index) => {
      const formattedDate =
        index === 1
          ? date && `${date}T23:59:59.999Z`
          : date && `${date}T00:00:00.000Z`;
      return formattedDate;
    });
    setSelectedDates(date);
    setCoderStartDate(formattedDates[0]);
    setCoderEndDate(formattedDates[1]);
  };
  const rowsLength = useSelector((state) => state?.report?.row);
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
                            searchlabel="Search by Name"
                            // selector
                            selectlabel="Select Status"
                            isSelector={
                              activeTab === "CoderReport" ? true : false
                            }
                            setSelectedOption={setSelectedCoderOpt}
                            selectOptions={statusOptions}
                            defaultSelectValue1={""}
                            // rangepicker
                            isRangePicker={true}
                            pickerlabel="Select Range"
                            setStartDate={setStartDate}
                            setEndDate={setEndDate}
                            setReceivedStartDate={setReceivedStartDate}
                            setReceivedEndDate={setReceivedEndDate}
                            setCoderStartDate={setCoderStartDate}
                            setCoderEndDate={setCoderEndDate}
                            activeTab={activeTab}
                            rowsLength={rowsLength}
                            setIsModalVisible={setIsModalVisible}
                          />
                        </div>
                        <Export
                          isModalVisible={isModalVisible}
                          closeModal={closeModal}
                          rowsLength={rowsLength}
                          setIsModalVisible={setIsModalVisible}
                          setSelectedRows={setSelectedRows}
                          setSelectAll={setSelectAll}
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
                              <Tab.Container defaultActiveKey="validDiseases">
                                <Nav as="ul" className="nav nav-tabs">
                                  <Nav.Item
                                    as="li"
                                    className="nav-item"
                                    onClick={() => {
                                      setSelectedDates(null);
                                      setActiveTab("CoderReport");
                                    }}
                                  >
                                    <Nav.Link
                                      to="#my-posts"
                                      eventKey="validDiseases"
                                    >
                                      Coder Report
                                    </Nav.Link>
                                  </Nav.Item>
                                  <Nav.Item
                                    as="li"
                                    className="nav-item"
                                    onClick={() => {
                                      setSelectedDates(null);
                                      setActiveTab("SentReport");
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
                                      setSelectedDates(null);
                                      setActiveTab("ReceivedReport");
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
                                        setSortField={setSortField}
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
