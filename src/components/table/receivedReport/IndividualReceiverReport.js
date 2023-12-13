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
import { CSVLink } from "react-csv";
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
  const ReceivedReportDetails = useSelector(
    (state) => state.report?.receivedDetails
  );
  const [sortOrder, setSortOrder] = useState("asc");
  const selectedRow = useSelector((state) => state.report.getReport);
  const [tableData,setTableData]=useState([])
  const usersList = ReceivedReportDetails?.content?.filter(
    (item) => item?.reportId !== selectedRow?.reportId
  );
  const [detailsContent, setDetailsContent] = useState(usersList);
  const sortTableByDate = () => {
    const sortedContent = [...detailsContent];
    if (sortOrder === "asc") {
      sortedContent.sort((a, b) => dayjs(a.sendDate).diff(dayjs(b.sendDate)));
      setSortOrder("desc");
    } else {
      sortedContent.sort((a, b) => dayjs(b.sendDate).diff(dayjs(a.sendDate)));
      setSortOrder("asc");
    }
    setDetailsContent(sortedContent);
  };

  const dispatch = useDispatch();
  useEffect(() => {
    if (reportUser?.reportId) {
      dispatch(getSelectedReportDetails(reportUser?.reportId));
    }
    if (selectedRow?.reportPath) {
      dispatch(getFileDetails(selectedRow?.reportPath));
    }
  }, [reportUser?.reportId, selectedRow?.reportPath]);

  const data = [
    // Define data to be exported as CSV
    { name: "John", age: 30 },
    { name: "Jane", age: 25 },
    // Add more data as needed
  ];

  const headers = [
    // Define headers for CSV columns
    { label: "Name", key: "name" },
    { label: "Age", key: "age" },
    // Add more headers according to your data structure
  ];

  const performanceSearch = (value) => {
    console.log(value);
    // dispatch(
    //   getReceivedDetails(
    //     receivedPageNo,
    //     receivedStartDate,
    //     receivedEndDate,
    //     value
    //   )
    // );
  };
  const debouncedSearch = debounce(performanceSearch, 500);
  const filterChange = (e) => {
    debouncedSearch(e.target.value);
  };

  const fileUrl = useSelector((state) => state.report);
  const fileExtension = fileUrl?.uploadFile?.split(".").pop();
  const extention = fileExtension?.split("?").shift();

  useEffect(() => {
    async function fetchData() {
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
    }

    fetchData();
  }, [extention, fileUrl]);

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
          {detailsContent?.map((item) => (
            <>
              <div className={styles.user}>{item?.reportName}</div>
              <div className={styles.date}>
                {dayjs(item.receiveDate).format("DD/MM/YYYY")}
              </div>
            </>
          ))}
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
            <Button onClick={()=>{
                exportToExcel
                window.open(fileUrl?.uploadFile)}} className={styles.download}>
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
                selectedRow?.type === "CSV"
                  ? styles.csvSTyle
                  : styles.excelStyle
              }
            >
              {selectedRow?.type}
            </div>
          </div>
          <div>
            {selectedRow?.type === "CSV" ? (
              <ExcelDisplay tableData={tableData} />
            ) : (
              <CSVDisplay tableData={tableData}/>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndividualReceiverReport;
