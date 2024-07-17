import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import csvToJson from "csvtojson";
import * as XLSX from "xlsx";
import dayjs from "dayjs";
import { Button, Empty } from "antd";
import Image from "next/image";
import { InputText } from "primereact/inputtext";
import {
  getReceivedDetails,
  getSelectedReportDetails,
  selectedReport,
  getSentDetails,
} from "../../../../store/actions/ReportActions";
import ExcelDisplay from "../../../../components/table/receivedReport/ExcelDisplay";
import CSVDisplay from "../../../../components/table/receivedReport/CSVDisplay";
import styles from "../../../../components/table/receivedReport/receivedReport.module.css";
import reportStyles from "../../../reviewer/report/report.module.css";
import search from "../../../../images/report/search.svg";
import sortImg from "../../../../images/report/sort.svg";
import id from "../../../../images/report/id.svg";
import file from "../../../../images/report/file.svg";
import calender from "../../../../images/report/calender.svg";
import send from "../../../../images/report/send.svg";
import download from "../../../../images/report/download.svg";
import Header from "../../../../jsx/layouts/nav/Header";
import SpinnerDots from "../../../../components/spinner";
import leftArrow from "../../../../images/svg/leftArrow.svg";
import { getActiveTab } from "../../../../store/actions/l2Action/AuditReportAction";
import { useRouter } from "next/router";
import { debounce } from "../../../admin/reports/Export";
import { getReportActiveTab } from "../../../../store/actions/adminAction/ReportActions";

const IndividualReceiverReport = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const url = useSelector((state) => state?.AuditReport?.uploadFile);
  const reportDatas = useSelector(
    (state) => state?.AuditReport?.receivedDetails
  );
  const sentReportDatas = useSelector(
    (state) => state?.adminReport?.sentDetails
  );
  const [tableData, setTableData] = useState([]);
  const [csvTableData, setCSVTableData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [reportInfo, setReportInfo] = useState();
  const [sort, setSort] = useState({ sortDir: "", sortField: "" });
  const [receivedSort, setReceivedSort] = useState("DESC");
 const [currentRole,setCurrentRole]=useState()
  const [loading, setLoading] = useState(false);
  const [isSentReport, setIsSentReport] = useState(false);
  const [isAdminPage, setIsAdminPage] = useState(false);

  const [detailsContent, setDetailsContent] = useState();

  const fetchData = async (url) => {
    setLoading(true);
    try {
      const response = await fetch(url?.path);
      if (url?.extention === "csv") {
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
      dispatch(getSentDetails(0, "", "", searchValue, sort));
      dispatch(getSelectedReportDetails(id));
    } else {
      dispatch(getReceivedDetails(0, "", "", searchValue, sort));
      dispatch(getSelectedReportDetails(id));
    }
    setCurrentRole(localStorage.getItem("userRole"))
  }, [searchValue, sort, router]);
  useEffect(() => {
    if (url) {
      fetchData(url);
    }
  }, [url]);

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
      const sentdata = sentReportDatas?.data?.response?.receivedReportDTOList?.data?.filter(
        (item) => item?._id === id
      );

      // setReportInfo(!isSentReport ? reportdata[0] : sentdata[0]);
    }
  }, [reportDatas, sentReportDatas, isSentReport]);


  useEffect(() => {
    if (router?.query?.reportId) {
      const filter = detailsContent?.find((item) => item?._id == router?.query?.reportId);
      setReportInfo(filter)
    }
    
  }, [detailsContent, router])

  return (
    <div style={{ backgroundColor: "#F0F6FE" }}>
      <Header />

      <div
        className={styles.container}
        style={{ margin: "30px 0px 50px 0px", height: "auto" }}
      >
        <div className={styles.cont1}>
          <div>
            <div className={styles.container}>
              <div
                className={"col-xl-1 d-flex"}
                style={{ cursor: "pointer", marginLeft: "10px" }}
              >
                <button
                  style={{ width: "40px", height: "30px" }}
                  className={reportStyles.filterBtn}
                  onClick={() => {
                    if (currentRole !=="supervisor") {
                      if(currentRole ==  "tenant_admin"){
                        router?.push(`/tenantAdmin/report?sent=true`);
                      }else{
                        router?.push(`/${currentRole}/report`);
                      }
                    } else {
                      const page = new URLSearchParams(
                        window.location.search
                      ).get("page");
                      const limit = new URLSearchParams(
                        window.location.search
                      ).get("limit");
                      router?.push(
                        `/supervisor/report?page=${page}&limit=${limit}`
                      );
                    }

                    dispatch(
                      getActiveTab(
                        isSentReport ? "SentReport" : "ReceivedReport"
                      )
                    );
                    dispatch(
                      getReportActiveTab(
                        isSentReport ? "SentReport" : "ReceivedReport"
                      )
                    );
                    setLoading(true);
                    setIsSentReport(false);
                  }}
                >
                  <Image src={leftArrow} />
                </button>
              </div>
              <div className={styles.divContainer}>
                <InputText
                  type="text"
                  onChange={(e) => filterChange(e)}
                  placeholder="Search"
                  className={styles.search}
                  maxLength={25}
                  onKeyDown={(e) => {
                    // Prevent input of backslash ("\")
                    if (e.key === "\\") {
                      e.preventDefault();
                    }
                  }}
                />
                <Image src={search} alt="noimg" style={{ marginTop: "5px" }} />
              </div>
              <div className={styles.sort} onClick={sortTableByDate}>
                <Image src={sortImg} alt="noimg" style={{ marginTop: "5px" }} />
              </div>
            </div>

            {/* users */}
            <div className={styles.list}>
              {!searchValue && detailsContent?.length === 0 ? (
                <div style={{ marginTop: "60px" }}>
                  <SpinnerDots />
                </div>
              ) : (
                <>
                  {searchValue && detailsContent?.length === 0 ? (
                    <div>No data</div>
                  ) : (
                    
                    detailsContent?.map((item) => (
                      <div key={item.reportId ? item.reportId : item._d}>
                        <div
                          style={{
                            display: "flex",
                            cursor: "pointer",
                            marginBottom: "10px",
                          }}
                          onClick={() => {
                            dispatch(selectedReport({ reportUser: item }));
                            setReportInfo(item);
                            dispatch(
                              getSelectedReportDetails(
                                isSentReport ? item?._id : item?.reportId,
                                item
                              )
                            );
                          }}
                        >
                          <div className={styles.user}>
                            <div
                              style={{
                                color:
                                  reportInfo?.reportName === item?.reportName
                                    ? "#04306f"
                                    : "black",
                                fontWeight:
                                  reportInfo?.reportName === item?.reportName
                                    ? "bold"
                                    : "normal",
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
                    ))
                  )}
                </>
              )}
            </div>
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
                    window.open(url?.path);
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
                  url?.extention === "csv" ? styles.csvSTyle : styles.excelStyle
                }
              >
                {url?.extention === "xlsx" ? "Excel" : "CSV"}
              </div>
            </div>
            <div
              style={{
                width: "100%",
                overflowX: "scroll",
              }}
            >
              {loading && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  loading....
                </div>
              )}
              {url?.extention === "csv" && !loading && (
                <CSVDisplay
                  tableData={csvTableData}
                  fileUrl={url?.path}
                  extention={url?.extention}
                  loading={loading}
                />
              )}
              {(url?.extention === "xlsx" &&
                tableData?.length > 0 &&
                !loading) ? (
                  <ExcelDisplay
                    tableData={tableData}
                    fileUrl={url?.path}
                    extention={url?.extention}
                    loading={loading}
                  />
                ) : !loading && <Empty />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndividualReceiverReport;
