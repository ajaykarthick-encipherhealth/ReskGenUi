import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getFileDetails,
  getReceivedDetails,
  getSelectedReportDetails,
} from "../../../store/actions/ReportActions";
import ExcelDisplay, { exportToExcel } from "./ExcelDisplay";
import CSVDisplay from "./CSVDisplay";
import styles from "./receivedReport.module.css";
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
import { debounce } from "../../../pages/physician/report/Export";
import csvToJson from "csvtojson";
import * as XLSX from "xlsx";

const IndividualReceiverReport = ({
  reportUser,
  receivedPageNo,
  receivedStartDate,
  receivedEndDate,
}) => {
  const [sortOrder, setSortOrder] = useState("asc");
  const selectedRow = useSelector((state) => state.report.getReport);
  const [tableData, setTableData] = useState([]);

  const fileUrl = useSelector((state) => state.report);
  const fileExtension = fileUrl?.uploadFile?.split(".").pop();
  const extention = fileExtension?.split("?").shift();

  const ReceivedReportDetails = useSelector(
    (state) => state.report?.receivedDetails
  );

  const [detailsContent, setDetailsContent] = useState(
    ReceivedReportDetails?.content
  );
  useEffect(() => {
    setDetailsContent(ReceivedReportDetails?.content);
    fetchData(fileUrl);
  }, [ReceivedReportDetails?.content]);

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
  const fetchData = async (fileUrl) => {
    try {
      const response = await fetch(fileUrl?.uploadFile);

      if (extention === "csv") {
        const text = await response.text();
        const jsonArray = await csvToJson().fromString(text);

        setTableData(jsonArray);
      } else {
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

  useEffect(() => {
    if (reportUser?.reportId) {
      dispatch(getSelectedReportDetails(reportUser?.reportId));
    }
    if (selectedRow?.reportPath) {
      dispatch(getFileDetails(selectedRow?.reportPath));
    }
    dispatch(
      getReceivedDetails(receivedPageNo, receivedStartDate, receivedEndDate)
    );
  }, [reportUser?.reportId, selectedRow?.reportPath]);

  const performanceSearch = (value) => {
    dispatch(
      getReceivedDetails(
        receivedPageNo,
        receivedStartDate,
        receivedEndDate,
        value
      )
    );
  };
  const debouncedSearch = debounce(performanceSearch, 500);
  const filterChange = (e) => {
    debouncedSearch(e.target.value);
  };
  return (
    <div className={styles.container} style={{ marginTop: "30px" }}>
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
          <div>
            {detailsContent
              ?.filter((item) => item?.reportId !== selectedRow?.reportId)
              .map((item) => (
                <div key={item.reportId}>
                  <div style={{ display: "flex" }}>
                    <div className={styles.user}>
                      {item?.reportName}
                      {item.type && (
                        <div
                          style={{ margin: "5px 0 0 5px" }}
                          className={
                            item.type === "csv"
                              ? styles.csvSTyle
                              : styles.excelStyle
                          }
                        >
                          {item.type}
                        </div>
                      )}
                      {item.role && (
                        <div
                          className={
                            item.role.toLowerCase() === "download"
                              ? styles.download1
                              : styles.read
                          }
                        >
                          {item.role.toLowerCase()}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className={styles.date}>
                    {dayjs(item.receiveDate).format("DD/MM/YYYY")}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
      <div className={styles.tablediv}>
        <div className={styles.container1}>
          <div className={styles.header}>
            {" "}
            <Image src={id} alt="noimg" />
            &nbsp; Id: &nbsp;
            {reportUser?.reportId}
          </div>
          <div>
            {" "}
            <Image src={file} alt="noimg" /> &nbsp;Name:&nbsp;
            {reportUser?.reportName}
          </div>
          <div>
            {" "}
            <Image src={send} alt="noimg" />
            &nbsp;Sender:&nbsp;
            {reportUser?.sender}
          </div>
          <div>
            {" "}
            <Image src={calender} alt="noimg" />
            &nbsp; Date:&nbsp;
            {dayjs(reportUser?.receiveDate).format("DD/MM/YYYY")}
          </div>
          <div>
            <Button
              onClick={() => {
                exportToExcel;
                window.open(fileUrl?.uploadFile);
              }}
              className={styles.download}
            >
              <Image
                src={download}
                alt="noimg"
                style={{ marginRight: "5px" }}
              />
              Download
            </Button>
          </div>
        </div>
        <div>
          <div className={styles.innerFlex}>
            <div
              className={
                extention === "csv" ? styles.csvSTyle : styles.excelStyle
              }
            >
              {selectedRow?.type}
            </div>
          </div>
          <div>
            {extention === "csv" ? (
              <ExcelDisplay tableData={tableData} />
            ) : (
              <CSVDisplay tableData={tableData} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndividualReceiverReport;
