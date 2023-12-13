import React, { useState } from "react";
import TableStyle from "../table.module.css";
import { Paginator } from "primereact/paginator";
import { Modal, Popover } from "antd";
import Footer from "../../../jsx/layouts/Footer";

function SentReportTable({ details, onSentPageChange ,paginationFirst}) {
  const [selectedUsers, setSelectedUsers] = useState([]);

  const displayReceivedUsers = (list) => {
    setSelectedUsers(list);
  };

  const popCOntent = (
    <div style={{ width: "100%" }}>
      <table className={TableStyle.classTable}>
        <thead className={TableStyle.classThead}>
          <tr>
            <th>USER</th>
            <th>ROLE</th>
          </tr>
        </thead>
        <tbody>
          {selectedUsers?.map((row, index) => {
            return (
              <tr key={index}>
                <td
                  style={{
                    borderTop: "  0.2px solid #e1e1e1",
                    borderLeft: "  0.2px solid #e1e1e1",
                    borderBottom: "  0.2px solid #e1e1e1",
                  }}
                >
                  {row.user}
                </td>
                <td
                  style={{
                    borderTop: "  0.2px solid #e1e1e1",
                    borderBottom: "  0.2px solid #e1e1e1",
                  }}
                >
                  {row.role}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
  return (
    <div className={TableStyle.classContaineer}>
      <table className={TableStyle.classTable}>
        <thead className={TableStyle.classTTotalhead}>
          <tr>
            <th>REPORT ID</th>
            <th>REPORT NAME</th>
            {/* <th>SENDER</th> */}
            <th> RECEIVED USERS LIST</th>
            <th>DATE</th>
          </tr>
        </thead>

        <tbody>
          {details?.data?.map((row, index) => {
            const formattedDate = row.receiveDate
              ? dayjs(row.receiveDate).format("DD/MM/YY")
              : "Invalid Date";

            return (
              <tr key={index} style={{ height: "40px" }}>
                <td
                  style={{
                    borderTop: "  0.2px solid #e1e1e1",
                    borderLeft: "  0.2px solid #e1e1e1",
                    borderBottom: "  0.2px solid #e1e1e1",
                  }}
                  className={TableStyle.childBorder}
                >
                  {row._id}
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
                    cursor: "pointer",
                    borderBottom: "  0.2px solid #e1e1e1",
                  }}
                  className={TableStyle.childBorder}
                >
                  <Popover trigger="click" content={popCOntent}>
                    <div
                      onClick={() => displayReceivedUsers(row.receivedUsers)}
                    >
                      ...
                    </div>
                  </Popover>
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
          first={paginationFirst}
          rows={15}
          totalRecords={details?.totalElements}
          onPageChange={onSentPageChange}
        />
        <div className="total-pages">

          Total count: {details?.totalElements > 0 ? details?.totalElements : 0}

        </div>
      </div>
      <Footer />
    </div>
  );
}

export default SentReportTable;
