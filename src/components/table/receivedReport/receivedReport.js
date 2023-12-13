import React, { useState } from "react";
import TableStyle from "../table.module.css";
import dayjs from "dayjs";
import { Paginator } from "primereact/paginator";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import Footer from "../../../jsx/layouts/Footer";

function ReceivedReport(details, onReceivedPageChange) {
  const [sortOrder, setSortOrder] = useState("asc");
  const [detailsContent, setDetailsContent] = useState(
    details?.details?.content
  );

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

  console.log(details);
  return (
    <div className={TableStyle.classContaineer}>
      <table className={TableStyle.classTable}>
        <thead className={TableStyle.classTTotalhead}>
          <tr>
            <th>REPORT ID</th>
            <th>REPORT NAME</th>
            <th>ACCESS TYPE</th>
            <th>SENDER</th>
            <th style={{ cursor: "pointer" }} onClick={sortTableByDate}>
              DATE{" "}
              {/* {sortOrder === "asc" ? <ArrowUpOutlined /> : <ArrowDownOutlined />} */}
            </th>
          </tr>
        </thead>
        <tbody className={TableStyle.bodytable}>
          {details?.details?.content?.map((row, index) => {
            const formattedDate = row.receiveDate
              ? dayjs(row.sendDate).format("DD/MM/YY")
              : "Invalid Date";

            return (
              <tr key={index} style={{ height: "40px" }}>
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
      <div className="pagination-container">
        <Paginator
          // first={paginationFirst}
          rows={15}
          totalRecords={details?.details?.totalElements}
          onPageChange={onReceivedPageChange}
        />
        <div className="total-pages">
          Total count: {details?.details?.totalElements}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ReceivedReport;
