import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getFileDetails,
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

const IndividualReceiverReport = ({ reportUser, ReceivedDetails }) => {
  const [sortOrder, setSortOrder] = useState("asc");
  const usersList = ReceivedDetails?.content?.filter(
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
    dispatch(getSelectedReportDetails(reportUser?.reportId));
    // dispatch(getFileDetails(reportUser?.reportPath))
  }, [reportUser?.reportId, reportUser?.reportPath]);

  const type = "EXCEL";
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
  const selectedRow = useSelector((state) => state.report.getReport);

  const filterChange = (e) => {
    console.log(e);
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
          <div>
            {" "}
            <Image src={id} alt="noimg" />
            &nbsp; Id: &nbsp;
            {selectedRow?.reportName}
          </div>
          <div>
            {" "}
            <Image src={file} alt="noimg" /> &nbsp;Name:&nbsp;
            {selectedRow?.reportName}
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
            {type === "EXCEL" ? (
              <Button onClick={exportToExcel} className={styles.download}>
                <Image
                  src={download}
                  alt="noimg"
                  style={{ marginRight: "5px" }}
                />
                Download
              </Button>
            ) : (
              <CSVLink
                data={data}
                headers={headers}
                filename={"export.csv"}
                className={styles.downlaod}
              >
                <Image
                  src={download}
                  alt="noimg"
                  style={{ marginRight: "5px" }}
                />
                Download
              </CSVLink>
            )}
          </div>
        </div>
        <div>
          <div className={styles.innerFlex}>
            <div
              className={type === "EXCEL" ? styles.excelStyle : styles.csvStyle}
            >
              {type}
            </div>
          </div>
          <div>
            {type === "EXCEL" ? (
              <ExcelDisplay headers={headers} data={data} />
            ) : (
              <CSVDisplay />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndividualReceiverReport;
