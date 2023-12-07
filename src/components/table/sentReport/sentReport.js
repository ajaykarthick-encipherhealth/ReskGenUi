import React from "react";
import TableStyle from "../table.module.css";
import { Paginator } from "primereact/paginator";
import { Modal } from "antd";
function SentReportTable(details, onSentPageChange) {
  const displayReceivedUsers = (list) => {
    console.log(list);
  };
  return (
    <div className={TableStyle.classContaineer}>
      <table className={TableStyle.classTable}>
        <thead className={TableStyle.classThead}>
          <tr>
            <th>REPORT ID</th>
            <th>REPORT NAME</th>
            <th>SENDER</th>
            <th>USER LIST</th>
            <th>DATE</th>
          </tr>
        </thead>
        <tbody>
          {details?.details?.map((row, index) => {
            const formattedDate = row.receiveDate
              ? dayjs(row.receiveDate).format("DD/MM/YY")
              : "Invalid Date";

            return (
              <tr key={index}>
                <td
                  style={{
                    borderTop: "  0.2px solid #e1e1e1",
                    borderLeft: "  0.2px solid #e1e1e1",
                    borderBottom: "  0.2px solid #e1e1e1",
                  }}
                >
                  {row._id}
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
                  {row.sender}
                </td>

                <td
                  style={{
                    borderTop: "  0.2px solid #e1e1e1",

                    borderBottom: "  0.2px solid #e1e1e1",
                    borderRight: "  0.2px solid #e1e1e1",
                  }}
                  onClick={() => displayReceivedUsers(row.receivedUsers)}
                >
                  ...
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
          totalRecords={details?.details?.content?.length}
          onPageChange={
            <div className="pagination-container">
              <Paginator
                // first={paginationFirst}
                rows={15}
                totalRecords={details?.details?.content?.length}
                onPageChange={onSentPageChange}
              />
              <div className="total-pages">
                Total count: {details?.details?.content?.length}
              </div>
            </div>
          }
        />
        <div className="total-pages">
          Total count:{" "}
          {details?.details?.content?.length > 0
            ? details?.details?.content?.length
            : 0}
        </div>
      </div>
    </div>
  );
}

export default SentReportTable;
