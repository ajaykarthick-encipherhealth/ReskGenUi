import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import TableStyle from "../../../../components/table/table.module.css";
import dayjs from "dayjs";
import { Empty } from "antd";
import { Paginator } from "primereact/paginator";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import { selectedReport } from "../../../../store/actions/ReportActions";
import {
  dateFormate,
  renderUserPrfoileAvatar,
  sortFunction,
} from "../../../../components/headerFilters/functions";
import SpinnerDots from "../../../../components/spinner";
import { renderSkeleton } from "../../../../components/reuseableFunctions";

function ReceivedReport({
  details,
  onPageChange,
  receivedPageNo,
  receivedStartDate,
  receivedEndDate,
  paginationFirst,
  loading,
  sortOrder,
  setSortOrder,
  setSort,
}) {
  const [detailsContent, setDetailsContent] = useState(details?.content);

  const dispatch = useDispatch();
  useEffect(() => {
    setDetailsContent(details?.content);
  }, [details]);

  const router = useRouter();
  const handleReceiverReport = (row) => {
    const info = {
      reportUser: row,
      receivedPageNo: receivedPageNo,
      receivedStartDate: receivedStartDate,
      receivedEndDate: receivedEndDate,
    };
    dispatch(selectedReport(info));
    router?.push(
      `/supervisor/report/individualreport?reportId=${info?.reportUser?.reportId}&page=${receivedPageNo}&limit=${paginationFirst}`
    );
  };

  return (
    <div className={TableStyle.classContaineer}>
      {loading ? (
        renderSkeleton()
      ) : (
        <>
          {detailsContent?.length === 0 ? (
            <Empty />
          ) : (
            <table className={TableStyle.classTable}>
              <thead className={TableStyle.classTTotalhead}>
                <tr>
                  <th>REPORT ID</th>
                  <th>REPORT NAME</th>
                  <th>ACCESS TYPE</th>
                  <th style={{ textAlign: "center" }}>SENDER</th>
                  <th
                    className={TableStyle.rowStyle}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      sortFunction(
                        sortOrder,
                        setSortOrder,
                        setSort,
                        "receiveDate"
                      );
                    }}
                  >
                    DATE{" "}
                    {sortOrder === "ASC" ? (
                      <ArrowUpOutlined />
                    ) : (
                      <ArrowDownOutlined />
                    )}
                  </th>
                </tr>
              </thead>
              <tbody>
                {detailsContent?.map((row, index) => {
                  const formattedDate = dateFormate(dayjs, row?.sendDate);

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
                        className={TableStyle.childBorder}
                        style={{
                          borderTop: "  0.2px solid #e1e1e1",

                          borderBottom: "  0.2px solid #e1e1e1",
                          paddingLeft: "280px",
                        }}
                        onClick={() => handleReceiverReport(row)}
                      >
                        {row.senderDetails?.firstName ||
                        row.senderDetails?.lastName ||
                        row?.senderDetails?.profileImageUrl ? (
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <span style={{ marginRight: "10px" }}>
                              {renderUserPrfoileAvatar(
                                row.senderDetails?.firstName,
                                row.senderDetails?.lastName,
                                row?.senderDetails?.profileImageUrl,
                                "header"
                              )}
                            </span>
                            <span>
                              {row.senderDetails?.firstName}{" "}
                              {row.senderDetails?.lastName}
                            </span>
                          </div>
                        ) : (
                          <div style={{ textAlign: "center" }}>---</div>
                        )}
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
        </>
      )}
      <div className="pagination-container">
        <Paginator
          first={paginationFirst}
          rows={15}
          totalRecords={details?.totalElements}
          onPageChange={onPageChange}
        />
        <div className="total-pages">
          Total count: {details?.totalElements > 0 ? details?.totalElements : 0}
        </div>
      </div>
    </div>
  );
}

export default ReceivedReport;
