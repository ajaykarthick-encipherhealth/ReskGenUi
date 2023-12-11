import React, { useState } from "react";
import TableStyle from "../table.module.css";
import dayjs from "dayjs";
import { Paginator } from "primereact/paginator";
import { ArrowUpOutlined,ArrowDownOutlined } from '@ant-design/icons';

function ReceivedReport(details, onReceivedPageChange) {
  const [sortOrder, setSortOrder] = useState("asc");
  const [detailsContent, setDetailsContent] = useState(
    details?.details
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

  return (
    <div className={TableStyle.classContaineer}>
      <table className={TableStyle.classTable}>
        <thead className={TableStyle.classThead}>
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
        <tbody>
          { details?.details?.map((row, index) => {
            const formattedDate = row.receiveDate
              ? dayjs(row.sendDate).format("DD/MM/YY")
              : "Invalid Date";

            return (
              <tr key={index}>
                <td
                  style={{
                    borderTop: "0.2px solid #e1e1e1",
                    borderLeft: "0.2px solid #e1e1e1",
                    borderBottom: "  0.2px solid #e1e1e1",
                  }}
                >
                  {row.reportId}
                </td>
                <td
                  style={{
                    borderTop: "  0.2px solid #e1e1e1",

                    borderBottom: "  0.2px solid #e1e1e1",
                  }}
                >
                  {row.reportName}
                </td>
                <td
                  style={{
                    borderTop: "  0.2px solid #e1e1e1",

                    borderBottom: "  0.2px solid #e1e1e1",
                  }}
                >
                  {row.role}
                </td>
                <td
                  style={{
                    borderTop: "  0.2px solid #e1e1e1",

                    borderBottom: "  0.2px solid #e1e1e1",
                  }}
                >
                  {row.sender}
                </td>
                <td
                  style={{
                    borderTop: "  0.2px solid #e1e1e1",

                    borderBottom: "  0.2px solid #e1e1e1",
                    borderRight: "  0.2px solid #e1e1e1",
                  }}
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
          totalRecords={details?.details.length}
          onPageChange={onReceivedPageChange}
        />
        <div className="total-pages">
          Total count: {details?.details?.length}
        </div>
      </div>
    </div>
  );
}

export default ReceivedReport;
