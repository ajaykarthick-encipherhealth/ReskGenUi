import React, { useEffect, useState } from "react";
import csvToJson from "csvtojson";
import * as XLSX from "xlsx";
import dayjs from "dayjs";
import { Button, Empty, Input } from "antd";
import Image from "next/image";
import ExcelDisplay from "../../../../components/table/receivedReport/ExcelDisplay";
import CSVDisplay from "../../../../components/table/receivedReport/CSVDisplay";
import styles from "../../../../components/table/receivedReport/receivedReport.module.css";
import sortImg from "../../../../images/report/sort.svg";
import id from "../../../../images/report/id.svg";
import file from "../../../../images/report/file.svg";
import calender from "../../../../images/report/calender.svg";
import send from "../../../../images/report/send.svg";
import download from "../../../../images/report/download.svg";
import Header from "../../../../jsx/layouts/nav/Header";
import leftArrow from "../../../../images/svg/leftArrow.svg";
import { useRouter } from "next/router";
import { getStorage } from "../../../../utils/storages";
import { debounce } from "../../../../components/input";
import { connect } from "react-redux";
import { actions as allActions } from "../../../../stores/supervisor/report";
import { getFileDetailsReport } from "../../../../stores/supervisor/report/network";
import { actions as allReportActions } from "../../../.././stores/admin/report";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { createIdGen } from "../../../../utils/reusable";

const IndividualReceiverReport = ({
  getReceivedDetails,
  getSentDetails,
  sentReportDatas,
  reportDatas,
  uploadFile,
  getSelectedReportDetails,
  getActiveTab,
  setViewIndividualReport,
  viewIndividualReport,
  id,
}) => {
  const router = useRouter();
  const [tableData, setTableData] = useState([]);
  const [csvTableData, setCSVTableData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [reportInfo, setReportInfo] = useState({ data: null, id: null });
  const [sort, setSort] = useState({ sortDir: "", sortField: "" });
  const [receivedSort, setReceivedSort] = useState("DESC");
  const [currentRole, setCurrentRole] = useState();
  const [loading, setLoading] = useState(false);
  const [isSentReport, setIsSentReport] = useState(false);
  const [isAdminPage, setIsAdminPage] = useState(false);
  const [fileResult, setFileResult] = useState(null);
  const [reportPath, setReportPath] = useState(null);
  const [detailsContent, setDetailsContent] = useState();
  const [loadingList, setLoadingList] = useState(true);

  const fetchData = async (url) => {
    setLoading(true);
    try {
      const response = await fetch(url?.path);
      if (fileResult?.extention === "csv") {
        const text = await response.text();
        const jsonArray = await csvToJson().fromString(text);
        setCSVTableData(jsonArray);
        setLoading(false);
      }
      if (url?.extention === "xlsx") {
        const arrayBuffer = await response.arrayBuffer();
        const data = new Uint8Array(arrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });

        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        setTableData(jsonData);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);

      console.error("Error fetching CSV data:", error);
    }
  };

  const sortTableByDate = () => {
    setReceivedSort(receivedSort === "ASC" ? "DESC" : "ASC");
    setSort({
      sortDir: receivedSort === "ASC" ? "DESC" : "ASC",
      sortField: "receiveDate",
    });
  };
  const handleReportClick = () => {
    setViewIndividualReport({
      status: false,
      data: viewIndividualReport,
    });
    setLoading(true);
    setIsSentReport(false);
    getActiveTab(viewIndividualReport?.data?.sentreport ? "Sent" : "Received");
    setReportInfo({ data: null, id: null });
  };

  <button onClick={handleReportClick}>View Report</button>;

  const performanceSearch = (value) => {
    setSearchValue(value);
  };
  const debouncedSearch = debounce(performanceSearch, 500);
  const filterChange = (e) => {
    debouncedSearch(e.target.value);
  };
  const getFetchPathUrl = async (url) => {
    var result = await getFileDetailsReport(url);
    var data = {
      extention: "xlsx",
      path: result?.response,
    };
    setFileResult(data);
    fetchData(data);
  };
  const callGetFileApi = async ({ reportConfirm, searchValue, id }) => {
    setLoadingList(true);
    if (reportConfirm) {
      setIsSentReport(true);
      getSentDetails(
        viewIndividualReport?.data?.page || 0,
        "",
        "",
        searchValue,
        sort
      );
      const res = await getSelectedReportDetails(id);
      if (res?.status === "SUCCESS") {
        setReportPath(res?.response);
        setLoadingList(false);
      }
    } else {
      getReceivedDetails(
        viewIndividualReport?.data?.page || 0,
        "",
        "",
        searchValue || "",
        sort
      );
      const res = await getSelectedReportDetails(id);
      if (res?.status === "SUCCESS") {
        setReportPath(res?.response);
        setLoadingList(false);
      }
    }
    setCurrentRole(getStorage("userRole"));
  };
  useEffect(() => {
    if (reportDatas?.data || (sentReportDatas?.data && isSentReport)) {
      setDetailsContent(
        isSentReport
          ? sentReportDatas?.data?.response?.receivedReportDTOList?.data
          : reportDatas?.data?.response?.reportStatusDTOList?.content
      );
      if (!reportInfo?.id) {
        const id = viewIndividualReport?.data?.reportId;
        // new URLSearchParams(window.location.search).get("reportId");
        const reportConfirm = viewIndividualReport?.data?.sentreport;
        // new URLSearchParams(window.location.search).get(
        //   "sentreport"
        // );
        if (id) {
          const reportDataId =
            reportDatas?.data?.response?.reportStatusDTOList?.content?.find(
              (item) => item?.reportId == id
            )?.reportId;
          const sentDataId =
            sentReportDatas?.data?.response?.receivedReportDTOList?.data?.find(
              (item) => item?._id == id
            )?._id;
          const reportData =
            reportDatas?.data?.response?.reportStatusDTOList?.content?.find(
              (item) => item?.reportId == id
            );
          const sentData =
            sentReportDatas?.data?.response?.receivedReportDTOList?.data?.find(
              (item) => item?._id == id
            );
          setReportInfo({
            data: reportConfirm ? sentData : reportData,
            id: reportConfirm ? sentDataId : reportDataId,
          });
        }
      }
    }
  }, [reportDatas, sentReportDatas, isSentReport, viewIndividualReport?.data]);

  useEffect(() => {
    // if (window.location.search) {
    setLoadingList(true);
    const id = viewIndividualReport?.data?.reportId;
    // new URLSearchParams(window.location.search).get("reportId");
    const reportConfirm = viewIndividualReport?.data?.sentreport;
    // new URLSearchParams(window.location.search).get(
    //   "sentreport"
    // );
    setIsSentReport(reportConfirm);
    const isAdminPage = viewIndividualReport?.data?.isAdminPage;
    // new URLSearchParams(window.location.search).get(
    //   "isAdminPage"
    // );
    setIsAdminPage(isAdminPage);
    callGetFileApi({
      reportConfirm: reportConfirm,
      searchValue: searchValue,
      id: id,
    });
    // }
  }, [searchValue, sort, viewIndividualReport?.data]);

  useEffect(() => {
    if (reportPath) {
      getFetchPathUrl(reportPath?.reportPath);
    }
  }, [reportPath]);

  return (
    <div style={{ backgroundColor: "#F0F6FE" }}>
      {/* <Header /> */}
      <div
        className={`${styles.container}`}
        style={{ margin: "30px 0px 50px 0px", height: "auto" }}
      >
        <div className={`${styles.cont1} text-truncate`}>
          <div className={styles.sideContainer}>
            <div
              id="arrow-btn"
              name="arrow-btn"
              className={`${styles.divContainer} individualReportSearch`}
            >
              <button
                id="left-arrow"
                name="left-arrow"
                className="border-0 bg-white text-white"
                onClick={handleReportClick}
                allowClear
              >
                <Image src={leftArrow} />
              </button>
              <div id="individual-search" name="individual-search">
                <Input
                  data-testid="report-input"
                  name="report-input"
                  type="text"
                  onChange={(e) => filterChange(e)}
                  placeholder="Search"
                  className={`${styles.search}`}
                  maxLength={25}
                  onKeyDown={(e) => {
                    // Prevent input of backslash ("\")
                    if (e.key === "\\") {
                      e.preventDefault();
                    }
                  }}
                  style={{ height: "100%" }}
                  suffix={
                    <FontAwesomeIcon className="searchPrefix" icon={faSearch} />
                  }
                  allowClear={true}
                />
              </div>
              {/* <Image src={search} alt="noimg" style={{ marginTop: "5px" }} /> */}
            </div>

            <div
              id="report-sort"
              name="report-sort"
              className={styles.sort}
              onClick={sortTableByDate}
            >
              <Image
                data-testid="sort-img"
                name="sort-img"
                src={sortImg}
                alt="noimg"
                style={{ marginTop: "5px" }}
              />
            </div>
          </div>
          {/* users */}
          <div
            id={
              id
                ? createIdGen("supervisor-list" + id)
                : createIdGen(
                    "supevisor-list " +router.pathname.replaceAll("/", " ")
                  )
            }
            className={styles.list}
          >
            {loadingList ? (
              <div className={styles.sideContainer}>Loading...</div>
            ) : detailsContent?.length > 0 ? (
              detailsContent?.map((item, index) => {
                const id = item?._id ? item?._id : item?.reportId;
                return (
                  <div
                    id={
                      id
                        ? createIdGen("supervisordetails" + index)
                        : createIdGen(
                            "supervisordetails " +
                              index +
                             router.pathname.replaceAll("/", " ")
                          )
                    }
                    key={id}
                    onClick={() => {
                      setReportInfo({ data: item, id: id });
                      callGetFileApi({
                        reportConfirm: isSentReport,
                        id: id,
                      });
                    }}
                  >
                    <div className="d-flex mb-2" style={{ cursor: "pointer" }}>
                      <div className={`${styles.user}`}>
                        <div
                          className="text-truncate"
                          style={{
                            color: reportInfo?.id == id ? "#04306f" : "black",
                            fontWeight:
                              reportInfo?.id == id ? "bold" : "normal",
                            cursor: "pointer",
                          }}
                        >
                          {item?.reportName}
                        </div>

                        <div>
                          {item?.type && (
                            <div
                              style={{ margin: "5px 0 0 5px" }}
                              className={
                                item.type === "EXCEL"
                                  ? styles.excelStyle
                                  : styles.csvSTyle
                              }
                            >
                              {item?.type}
                            </div>
                          )}
                          {item?.role && (
                            <div
                              className={
                                item.role.toLowerCase() === "download"
                                  ? styles.download1
                                  : styles.read
                              }
                            >
                              {item?.role.toLowerCase()}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className={styles.date}>
                      {viewIndividualReport?.data?.sentreport
                        ? dayjs(item?.sendDate).format("MM-DD-YYYY")
                        : dayjs(item?.receiveDate).format("MM-DD-YYYY")}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className={styles.sideContainer}>No data</div>
            )}
          </div>
        </div>
        <div className={styles.tablediv}>
          <div className={styles.container1}>
            <div className={`${styles.header}`}>
              {" "}
              <Image src={id} alt="noimg" />
              Id:
              {reportInfo?.id || "---"}
            </div>
            <div className="d-flex">
              {" "}
              <Image src={file} alt="noimg" /> Name:
              {reportInfo?.data?.reportName}
            </div>
            <div className="d-flex">
              {" "}
              <Image src={send} alt="noimg" />
              {viewIndividualReport?.data?.sentreport ? "Receiver" : "Sender"}:
              {reportInfo?.data?.sender}
            </div>
            <div className="d-flex">
              {" "}
              <Image src={calender} alt="noimg" />
              Date:
              {viewIndividualReport?.data?.sentreport
                ? dayjs(reportInfo?.sendDate).format("MM-DD-YYYY")
                : dayjs(reportInfo?.receiveDate).format("MM-DD-YYYY")}
            </div>
            <div>
              {reportInfo?.data?.role === "DOWNLOAD" ? (
                <div id="download-report" name="download-report">
                  <Button
                    data-testid="report-downloadBtn"
                    name="report-downloadBtn"
                    onClick={() => {
                      window.open(fileResult?.path);
                    }}
                    className={styles.download}
                    disabled={
                      csvTableData?.length === 0 || tableData?.length === 0
                        ? true
                        : false
                    }
                  >
                    <Image src={download} alt="noimg" className="m-2" />
                    Download
                  </Button>
                </div>
              ) : (
                reportInfo?.data?.role === "read" && (
                  <div id="read-report" name="read-report">
                    <Button
                      data-testid="report-readBtn"
                      name="report-readBtn"
                      className={styles.readOption}
                    >
                      Read
                    </Button>
                  </div>
                )
              )}
            </div>
          </div>
          <div>
            <div className={styles.innerFlex}>
              <div
                className={
                  fileResult?.extention === "csv"
                    ? styles.csvSTyle
                    : styles.excelStyle
                }
              >
                {fileResult?.extention === "xlsx" ? "Excel" : "CSV"}
              </div>
            </div>
            <div
              style={{
                width: "100%",
                overflowX: "scroll",
                height: "70vh",
              }}
            >
              {fileResult?.extention === "csv" && (
                <CSVDisplay
                  tableData={csvTableData}
                  fileUrl={fileResult?.path}
                  extention={fileResult?.extention}
                  loading={loading}
                />
              )}
              {fileResult?.extention === "xlsx" && (
                <ExcelDisplay
                  tableData={tableData}
                  fileUrl={fileResult?.path}
                  extention={fileResult?.extention}
                  loading={loading}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const connector = connect(
  (state) => ({
    sentReportDatas: state.supervisor?.report?.sentReportDatas,
    reportDatas: state.supervisor?.report?.reportDatas,
    uploadFile: state.supervisor?.report?.uploadFile?.data?.response,
  }),
  {
    getReceivedDetails: allActions.getReceivedDetails,
    getSentDetails: allActions.getSentDetails,
    getSelectedReportDetails: allActions.getSelectedReportDetails,
    getActiveTab: allReportActions.activeTab,
  }
);
export default connector(IndividualReceiverReport);
