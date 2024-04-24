import React, { useState, useEffect } from "react";
import Header from "../../../jsx/layouts/nav/Header";
import styles from "./report.module.css";
import ReviewerReport from "./reviewerReport";
import SentRewiewer from "./sentReport";
import ReceivedReport from "./receivedReport";
import HeaderFilters from "../../../components/headerFilter";
import { Modal, DatePicker } from "antd";
import { getActiveTab } from "../../../store/actions/l2Action/AuditReportAction";

import {
  getReceivedDetails,
  getReportDetails,
  getSentDetails,
} from "../../../store/actions/ReportActions";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import SentReport from "./sentReport";

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
  const [activeTab, setActiveTab] = useState(
    reportActiveTab ? reportActiveTab : "Reviewer"
  );

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
  const [receivedSortOrder, setReceivedSortOrder] = useState("DESC");
  const [sentSortOrder, setSentSortOrder] = useState("DESC");
  const [coderSortOrder, setCoderSortOrder] = useState("DESC");
  const [sort, setSort] = useState({ sortDir: "", sortField: "" });

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
    setIsLoading(false);
    if (reportActiveTab === "Sent") {
      dispatch(
        getSentDetails(sentPageNo, startDate, endDate, sentSearch, sort)
      );
    }
    if (reportActiveTab === "Received") {
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

    if (!reportActiveTab || reportActiveTab === "Reviewer") {
      dispatch(
        getReportDetails(
          pageNo,
          coderStartDate,
          coderEndDate,
          coderSearch,
          selectedCoderOpt,
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
    reportActiveTab,
    // activeTab,
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
    sort,
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

  const backRender = () => {
    const user = localStorage.getItem("userRole");
    if (user == "reviewer") {
      route.push("/reviewer/report?page=0&limit=0");
    }
  };

  return (
    <>
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
                          reportActiveTab === "Reviewer"
                            ? `${styles.active}`
                            : ""
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
                          reportActiveTab === "Received"
                            ? `${styles.active}`
                            : ""
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
                    {/* <HeaderFilters
                  
                      isSearch={true}
                      
                      selectlabel=" Status"
                      isSelector={
                        !reportActiveTab || reportActiveTab === "Reviewer" ? true : false
                      }
                      isRangePicker={true}
                      pickerlabel="Date"
                    
                    /> */}
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
                          setSelectedRows={setSelectedRows}
                          selectedRows={selectedRows}
                          setSelectAll={setSelectAll}
                          selectAll={selectAll}
                          setSortOrder={setCoderSortOrder}
                          sortOrder={coderSortOrder}
                          setSort={setSort}
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
                                      <div
                                        key={index}
                                        className={styles.comment}
                                      >
                                        <p>{comment.comment}</p>
                                      </div>
                                    ))}
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
    </>
  );
};

export default Reports;
