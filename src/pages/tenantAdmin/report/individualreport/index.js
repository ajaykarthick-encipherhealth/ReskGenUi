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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { actions as allReportActions } from "../../../.././stores/admin/report";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const IndividualReceiverReport = ({
  getReceivedDetails,
  getSentDetails,
  sentReportDatas,
  reportDatas,
  uploadFile,
  getSelectedReportDetails,
  getActiveTab,
}) => {
  const router = useRouter();
  const [tableData, setTableData] = useState([]);
  const [csvTableData, setCSVTableData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [reportInfo, setReportInfo] = useState(null);
  const [sort, setSort] = useState({ sortDir: "", sortField: "" });
  const [receivedSort, setReceivedSort] = useState("DESC");
  const [currentRole, setCurrentRole] = useState();
  const [loading, setLoading] = useState(false);
  const [isSentReport, setIsSentReport] = useState(false);
  const [isAdminPage, setIsAdminPage] = useState(false);
  const [fileResult, setFileResult] = useState(null);
  const [detailsContent, setDetailsContent] = useState();

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

  const performanceSearch = (value) => {
    setSearchValue(value);
  };
  const debouncedSearch = debounce(performanceSearch, 500);
  const filterChange = (e) => {
    debouncedSearch(e.target.value);
  };

  const getFetchPathUrl = async (url) => {
    const fileId = url?.reportPath ? url?.reportPath : url;
    var result = await getFileDetailsReport(fileId || "");
    var data = {
      extention: "xlsx",
      path: result?.response,
    };
    setFileResult(data);
    fetchData(data);
  };

  useEffect(() => {
    if (reportDatas?.data || (sentReportDatas?.data && isSentReport)) {
      setDetailsContent(
        isSentReport
          ? sentReportDatas?.data?.response?.receivedReportDTOList?.data
          : reportDatas?.data?.response?.reportStatusDTOList?.content
      );
      const id = new URLSearchParams(window.location.search).get("reportId");
      const reportdata =
        reportDatas?.data?.response?.reportStatusDTOList?.content?.filter(
          (item) => item?.reportId === id
        );
      const sentdata =
        sentReportDatas?.data?.response?.receivedReportDTOList?.data?.filter(
          (item) => item?._id === id
        );

      setReportInfo(!isSentReport ? reportdata[0] : sentdata[0]);
    }
  }, [reportDatas, sentReportDatas, isSentReport]);

  useEffect(() => {
    if (router?.query?.reportId) {
      const filter = detailsContent?.find(
        (item) => item?._id == router?.query?.reportId
      );
      setReportInfo(filter);
    }
  }, [detailsContent, router]);
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("reportId");
    const reportConfirm = new URLSearchParams(window.location.search).get(
      "sentreport"
    );
    const isAdminPage = new URLSearchParams(window.location.search).get(
      "isAdminPage"
    );
    setIsAdminPage(isAdminPage);
    if (reportConfirm) {
      setIsSentReport(true);
      getSentDetails(0, "", "", searchValue, sort);
      getSelectedReportDetails(id);
    } else {
      getReceivedDetails(0, "", "", searchValue, sort);
      getSelectedReportDetails(id);
    }
    setCurrentRole(getStorage("userRole"));
  }, [searchValue, sort, router]);
  useEffect(() => {
    if (reportInfo) {
      getFetchPathUrl(reportInfo?._id);
    }
  }, [reportInfo]);

  return (
    <div style={{ backgroundColor: "#F0F6FE" }}>
      <Header />

      <div
        className={styles.container}
        style={{ margin: "30px 0px 50px 0px", height: "auto" }}
      >
        <div className={styles.cont1}>
          <div className={styles.container}>
            <div className={`${styles.divContainer} individualReportSearch`}>
              <button
                // style={{ width: "40px", height: "30px" }}
                // className={reportStyles.filterBtnArrow}
                className="border-0 bg-white text-white"
                onClick={() => {
                  const page = new URLSearchParams(window.location.search).get(
                    "page"
                  );
                  const limit = new URLSearchParams(window.location.search).get(
                    "limit"
                  );
                  router?.push(
                    `/supervisor/report?page=${page}&limit=${limit}`
                  );
                  setLoading(true);
                  setIsSentReport(false);
                  getActiveTab(isSentReport ? "Sent" : "Received");
                }}
                allowClear
              >
                <Image src={leftArrow} />
              </button>
              <Input
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
              {/* <Image src={search} alt="noimg" style={{ marginTop: "5px" }} /> */}
            </div>

            <div className={styles.sort} onClick={sortTableByDate}>
              <Image src={sortImg} alt="noimg" style={{ marginTop: "5px" }} />
            </div>
          </div>

          {/* users */}
          <div className={styles.list}>
            {detailsContent?.length > 0 ? (
              detailsContent?.map((item) => {
                const id = item?._id ? item?._id : item?.reportId;
                const reportId = reportInfo?._id
                  ? reportInfo?._id
                  : reportInfo?.reportId;
                return (
                  <div
                    key={id}
                    onClick={() => {
                      setReportInfo(item);
                    }}
                  >
                    <div className="d-flex mb-2" style={{ cursor: "pointer" }}>
                      <div className={styles.user}>
                        <div
                          style={{
                            color: reportId === id ? "#04306f" : "black",
                            fontWeight: reportId === id ? "bold" : "normal",
                            cursor: "pointer",
                          }}
                        >
                          {item?.reportName}
                        </div>

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
                    <div className={styles.date}>
                      {dayjs(item?.receiveDate).format("MM-DD-YYYY")}
                    </div>
                  </div>
                );
              })
            ) : (
              <div>No data</div>
            )}
          </div>
        </div>
        <div className={styles.tablediv}>
          <div className={styles.container1}>
            <div className={styles.header}>
              {" "}
              <Image src={id} alt="noimg" />
              &nbsp; Id: &nbsp;
              {reportInfo?.reportId ? reportInfo?.reportId : reportInfo?._id}
            </div>
            <div>
              {" "}
              <Image src={file} alt="noimg" /> &nbsp;Name:&nbsp;
              {reportInfo?.reportName}
            </div>
            <div>
              {" "}
              <Image src={send} alt="noimg" />
              &nbsp;{isSentReport ? "Reciever" : "Sender"}:&nbsp;
              {reportInfo?.sender}
            </div>
            <div>
              {" "}
              <Image src={calender} alt="noimg" />
              &nbsp; Date:&nbsp;
              {dayjs(reportInfo?.receiveDate).format("DD/MM/YYYY")}
            </div>
            <div>
              {reportInfo?.role === "DOWNLOAD" ? (
                <Button
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
                  <Image
                    src={download}
                    alt="noimg"
                    style={{ marginRight: "5px" }}
                  />
                  Download
                </Button>
              ) : (
                reportInfo?.role === "read" && (
                  <Button className={styles.readOption}>Read</Button>
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
