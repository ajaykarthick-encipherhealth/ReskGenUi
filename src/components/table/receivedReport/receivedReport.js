import React, { useEffect, useState } from "react";
import TableStyle from "../table.module.css";
import dayjs from "dayjs";
import styles from "./receivedReport.module.css";
import { Paginator } from "primereact/paginator";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import IndividualReceiverReport from "./IndividualReceiverReport";
import Footer from "../../../jsx/layouts/Footer";
import Spinner from "../../spinner/spinner";

function ReceivedReport({
  details,
  onReceivedPageChange,
  receivedPageNo,
  receivedStartDate,
  receivedEndDate,
}) {
  const [sortOrder, setSortOrder] = useState("asc");
  const [reportUser, setReportUser] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [detailsContent, setDetailsContent] = useState(details?.content);

  useEffect(() => {
    setDetailsContent(details?.content);
  }, [details]);

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

  const handleReceiverReport = (row) => {
    setReportUser(row);
    setOpenModal(true);
  };

  return (
    <div className={TableStyle.classContaineer}>
      {detailsContent?.length === 0 ? (
        <Spinner />
      ) : (
        <table className={TableStyle.classTable}>
          <thead className={TableStyle.classTTotalhead}>
            <tr>
              <th>REPORT ID</th>
              <th>REPORT NAME</th>
              <th>ACCESS TYPE</th>
              <th>SENDER</th>
              <th style={{ cursor: "pointer" }} onClick={sortTableByDate}>
                DATE{" "}
                {sortOrder === "asc" ? (
                  <ArrowUpOutlined />
                ) : (
                  <ArrowDownOutlined />
                )}
              </th>
            </tr>
          </thead>
          <tbody>
            {detailsContent?.map((row, index) => {
              const formattedDate = row.receiveDate
                ? dayjs(row.sendDate).format("DD/MM/YY")
                : "Invalid Date";

              return (
                <tr
                  key={index}
                  style={{ height: "40px" }}
                  onClick={() => handleReceiverReport(row)}
                >
                  <td
                    style={{
                      borderTop: "0.2px solid #e1e1e1",
                      borderLeft: "0.2px solid #e1e1e1",
                      borderBottom: "  0.2px solid #e1e1e1",
                    }}
                    className={TableStyle.childBorder}
                  >
                    {row.reportId}
                  </td>
                  <td
                    style={{
                      borderTop: "  0.2px solid #e1e1e1",

                      borderBottom: "  0.2px solid #e1e1e1",
                    }}
                    className={TableStyle.childBorder}
                  >
                    {row.reportName}
                  </td>
                  <td
                    style={{
                      borderTop: "  0.2px solid #e1e1e1",

                      borderBottom: "  0.2px solid #e1e1e1",
                    }}
                    className={TableStyle.childBorder}
                  >
                    {row.role}
                  </td>
                  <td
                    style={{
                      borderTop: "  0.2px solid #e1e1e1",

                      borderBottom: "  0.2px solid #e1e1e1",
                    }}
                    className={TableStyle.childBorder}
                  >
                    {row.sender}
                  </td>
                  <td
                    style={{
                      borderTop: "  0.2px solid #e1e1e1",

                      borderBottom: "  0.2px solid #e1e1e1",
                      borderRight: "  0.2px solid #e1e1e1",
                    }}
                    className={TableStyle.childBorder}
                  >
                    {formattedDate}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      <div className="pagination-container">
        <Paginator
          // first={paginationFirst}
          rows={15}
          totalRecords={details?.totalElements}
          onPageChange={onReceivedPageChange}
        />
        <div className="total-pages">Total count: {details?.totalElements}</div>
      </div>
      <Modal
        open={openModal}
        footer={false}
        className={styles.classModal}
        onCancel={() => setOpenModal(false)}
      >
        <IndividualReceiverReport
          reportUser={reportUser}
          // ReceivedDetails={details}
          setReportUser={setReportUser}
          receivedPageNo={receivedPageNo}
          receivedStartDate={receivedStartDate}
          receivedEndDate={receivedEndDate}
        />
      </Modal>
      <Footer />
    </div>
  );
}

export default ReceivedReport;
