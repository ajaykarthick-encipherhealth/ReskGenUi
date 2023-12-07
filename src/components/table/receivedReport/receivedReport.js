import React from "react";
import TableStyle from "../table.module.css";
import dayjs from "dayjs";
import { Paginator } from "primereact/paginator";

function ReceivedReport(details,onReceivedPageChange) {
  return (
    <div className={TableStyle.classContaineer}>
      <table className={TableStyle.classTable}>
        <thead className={TableStyle.classThead}>
          <tr>
            <th>REPORT ID</th>
            <th>REPORT NAME</th>
            <th>ACCESS TYPE</th>
            <th>SENDER</th>
            <th>DATE</th>
          </tr>
        </thead>
        <tbody>
          {details?.details?.content?.map((row, index) => {
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
          totalRecords={details?.details?.content?.length}
          onPageChange={onReceivedPageChange}
        />
        <div className="total-pages">
          Total count: {details?.details?.content?.length}
        </div>
      </div>
    </div>
  );
}

export default ReceivedReport;
