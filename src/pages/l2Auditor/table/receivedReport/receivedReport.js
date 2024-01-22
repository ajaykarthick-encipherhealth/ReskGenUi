import React, { useEffect, useState } from "react";
import TableStyle from "../../../../components/table/table.module.css";
import dayjs from "dayjs";
import { Paginator } from "primereact/paginator";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { selectedReport } from "../../../../store/actions/ReportActions";


import { Empty } from "antd";
import Footer from "../../../../jsx/layouts/Footer";
import { dateFormate } from "../../../../components/headerFilters/functions";
import SpinnerDots from "../../../../components/spinner";

function ReceivedReport({
  details,
  onPageChange,
  receivedPageNo,
  receivedStartDate,
  receivedEndDate,
  paginationFirst,
  loading,
}) {
  const [sortOrder, setSortOrder] = useState("asc");
  const [detailsContent, setDetailsContent] = useState(details?.content);

  const dispatch = useDispatch();
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
      `/physician/report/individualreport?reportId=${info?.reportUser?.reportId}`
    );
  };

  return (
    <div className={TableStyle.classContaineer}>
      {loading ? (
        <SpinnerDots />
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
      {/* <Modal
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
      </Modal> */}
      <Footer />
    </div>
  );
}

export default ReceivedReport;
