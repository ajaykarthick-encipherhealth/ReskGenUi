import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getFileDetails,
  getReceivedDetails,
  getSelectedReportDetails,
  selectedReport,
} from "../../../store/actions/ReportActions";
import ExcelDisplay, {
  exportToExcel,
} from "../../../components/table/receivedReport/ExcelDisplay";
import CSVDisplay from "../../../components/table/receivedReport/CSVDisplay";
import styles from "../../../components/table/receivedReport/receivedReport.module.css";
import { InputText } from "primereact/inputtext";
import dayjs from "dayjs";
import search from "../../../images/report/search.svg";
import sort from "../../../images/report/sort.svg";
import id from "../../../images/report/id.svg";
import file from "../../../images/report/file.svg";
import calender from "../../../images/report/calender.svg";
import send from "../../../images/report/send.svg";
import download from "../../../images/report/download.svg";
import Image from "next/image";
import { Button } from "antd";
import { debounce } from "../report/Export";
import csvToJson from "csvtojson";
import * as XLSX from "xlsx";
import Header from "../../../jsx/layouts/nav/Header";
import Footer from "../../../jsx/layouts/Footer";

const IndividualReceiverReport = () => {
  const [sortOrder, setSortOrder] = useState("asc");
  const [tableData, setTableData] = useState([]);
  const [csvTableData, setCSVTableData] = useState([]);
  const [searchValue, setSearchValue] = useState(null);
  const url = useSelector((state) => state.report.uploadFile);

  const reportDatas = useSelector((state) => state.report.receivedDetails);
  const [reportInfo, setReportInfo] = useState();
  const [detailsContent, setDetailsContent] = useState(
    reportDatas?.response?.content
  );
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("reportId");
    dispatch(getReceivedDetails(0, null, null, null));
    dispatch(getSelectedReportDetails(id));
  }, []);
  useEffect(() => {
    if (url) {
      fetchData(url);
    }
  }, [url]);
  useEffect(() => {
    if (reportDatas) {
      const id = new URLSearchParams(window.location.search).get("reportId");
      const ReportData = reportDatas?.response?.content?.filter(
        (item) => item?.reportId === id
      );
      setReportInfo(ReportData[0]);
      setDetailsContent(reportDatas?.response?.content);
    }
  }, [reportDatas]);

  const fetchData = async (url) => {
    try {
      const response = await fetch(url?.path);
      if (url?.extention === "csv") {
        const text = await response.text();
        const jsonArray = await csvToJson().fromString(text);
        setCSVTableData(jsonArray);
      }
      if (url?.extention === "xlsx") {
        const arrayBuffer = await response.arrayBuffer();
        const data = new Uint8Array(arrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });

        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        setTableData(jsonData);
      }
    } catch (error) {
      console.error("Error fetching CSV data:", error);
    }
  };

  const sortTableByDate = () => {
    const sortedContent = [...detailsContent];
    if (sortOrder === "asc") {
      sortedContent.sort((a, b) =>
        dayjs(a.receiveDate).diff(dayjs(b.receiveDate))
      );
      setSortOrder("desc");
    } else {
      sortedContent.sort((a, b) =>
        dayjs(b.receiveDate).diff(dayjs(a.receiveDate))
      );
      setSortOrder("asc");
    }
    setDetailsContent(sortedContent);
  };

  const dispatch = useDispatch();

  const performanceSearch = (value) => {
    setSearchValue(value);
    dispatch(getReceivedDetails(0, null, null, value));
  };
  const debouncedSearch = debounce(performanceSearch, 500);
  const filterChange = (e) => {
    debouncedSearch(e.target.value);
  };

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
              <div className={styles.divContainer}>
                <InputText
                  type="text"
                  onChange={(e) => filterChange(e)}
                  placeholder="Search"
                  className={styles.search}
                />
                <Image src={search} alt="noimg" style={{ marginTop: "5px" }} />
              </div>
              <div className={styles.sort} onClick={sortTableByDate}>
                <Image src={sort} alt="noimg" style={{ marginTop: "5px" }} />
              </div>
            </div>

            {/* users */}
            <div className={styles.list}>
              {searchValue !== null && detailsContent?.length === 0 ? (
                <div style={{marginTop:"60px"}}>
                  No data Found
                </div>
              ) : (
                <>
                  {detailsContent
                    // ?.filter((item) => item?.reportId !== selectedRow?.reportId)
                    ?.map((item) => (
                      <div key={item.reportId}>
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
                              getSelectedReportDetails(item?.reportId, item)
                            );
                          }}
                        >
                          <div className={styles.user}>
                            <div>{item?.reportName}</div>
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
                          {dayjs(item?.receiveDate).format("DD/MM/YYYY")}
                        </div>
                      </div>
                    ))}
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
              {reportInfo?.reportId}
            </div>
            <div>
              {" "}
              <Image src={file} alt="noimg" /> &nbsp;Name:&nbsp;
              {reportInfo?.reportName}
            </div>
            <div>
              {" "}
              <Image src={send} alt="noimg" />
              &nbsp;Sender:&nbsp;
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
                    exportToExcel;
                    window.open(url);
                  }}
                  className={styles.download}
                  disabled={
                    csvTableData?.length === 0 && tableData?.length === 0
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
              {url?.extention === "csv" ? (
                <CSVDisplay
                  tableData={csvTableData}
                  fileUrl={url?.path}
                  extention={url?.extention}
                />
              ) : (
                <ExcelDisplay
                  tableData={tableData}
                  fileUrl={url?.path}
                  extention={url?.extention}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default IndividualReceiverReport;
