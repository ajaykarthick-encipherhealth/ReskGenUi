import React, { useEffect, useState } from "react";
import { Empty, Popover } from "antd";
import TableStyle from "../../table.module.css";
import { Paginator } from "primereact/paginator";
import { selectedRow } from "../../../../store/actions/ReportActions";
import { useDispatch } from "react-redux";
import dayjs from "dayjs";
import {
  dateFormate,
  renderUserPrfoileAvatar,
} from "../../../headerFilters/functions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import FhirDrawer from "../../../../pages/tenantAdmin/patientSync/modals/PdfDrawer";
import { useRouter } from "next/router";
import { getActiveTab } from "../../../../store/actions/l2Action/AuditReportAction";
import SpinnerDots from "../../../spinner";

function PdfTable({
  paginationFirst,
  onPageChange,
  selectedRows,
  tableData,
  setSelectedBatch,
  selectedBatch,
  loader,
}) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [filelList, setFileList] = useState();
  useEffect(() => {
    dispatch(selectedRow(selectedRows));
  }, [selectedRows]);

  const dateFormateAlign = (dates) => {
    return dates?.map((res, index) => {
      if (index < 3) {
        // let sectionMapArr = <span>{dayjs(res).format("YYYY")}</span>;
        return `${res}${index / 2 == 0 ? "," : ""}`;
      } else if (dates.length - 1 == index) {
        let sectionMapArr = (
          <Popover
            content={
              <>
                {dates?.map((item, i) =>
                  i > 0 ? (
                    <div className="text-center">{`${item}${
                      i / 2 == 0 ? "," : ""
                    }`}</div>
                  ) : null
                )}
              </>
            }
            placement="bottom"
          >
            <span
              style={{ fontSize: "10px" }}
              className={`border border-success-subtle mx-1 p-1 rounded-circle font`}
            >
              {dates.length - 1}+
            </span>
          </Popover>
        );
        return sectionMapArr;
      }
    });
  };
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleUploadButtonClick = (e, row) => {
    e.stopPropagation();
    setIsDrawerOpen(!isDrawerOpen);
    setSelectedBatch(row);
    setFileList();
  };
  return (
    <div className={TableStyle.classContaineer}>
      {loader ? (
        <SpinnerDots />
      ) : (
        <>
          {tableData?.content?.length === 0 ? (
            <Empty />
          ) : (
            <table className={TableStyle.classTable}>
              <thead className={TableStyle.classTTotalhead}>
                <tr>
                  <>
                    <th>BATCH NAME</th>
                    <th>PATIENT COUNT</th>
                    <th>STATUS </th>
                    <th>YEAR OF SERVICE</th>
                    <th className={TableStyle.rowAudited}>INITIATED BY </th>
                    <th>BATCH INITIATED DATE </th>
                  </>
                </tr>
              </thead>

              <tbody className={TableStyle.bodytable}>
                {tableData?.content?.length > 0 ? (
                  tableData?.content?.map((row, index) => (
                    <tr
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        const encodedParams = btoa(
                          JSON.stringify({
                            batchId: row?.id,
                          })
                        );
                        dispatch(getActiveTab("PDF"));
                        router?.push({
                          pathname: `/tenantAdmin/patientSync/pdfTable`,
                          search: `params=${encodedParams}`,
                        });
                      }}
                    >
                      <>
                        <td className={TableStyle.childBorder}>
                          {row?.name ? row?.name : "---"}
                        </td>

                        <td className={TableStyle.childBorder}>
                          {row?.totalFileCount ? row?.totalFileCount : "---"}
                        </td>
                        <td className={TableStyle.childBorder}>
                          <div>
                            <span
                              className="text-capitalize mx-2"
                              style={{
                                color:
                                  row.batchUploadStatus === "processing"
                                    ? "#2D6187"
                                    : row.batchUploadStatus === "completed"
                                    ? "#008A0E"
                                    : "black",
                              }}
                            >
                              {row.batchUploadStatus
                                ? row.batchUploadStatus
                                : "---"}
                            </span>
                          </div>
                        </td>

                        <td className={TableStyle.childBorder}>
                          {row?.yearOfService
                            ? dateFormateAlign(row?.yearOfService)
                            : "000"}
                        </td>
                        <td
                          className={TableStyle.childBorder}
                          style={{ textAlign: "left", paddingLeft: "110px" }}
                        >
                          {row.initiatedByFirstName ||
                          row.initiatedByLastName ||
                          row.auditedByProfileImage ? (
                            <div
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              {" "}
                              <span style={{ marginRight: "10px" }}>
                                {" "}
                                {renderUserPrfoileAvatar(
                                  row.initiatedByFirstName,
                                  row.initiatedByLastName,
                                  row.auditedByProfileImage,
                                  "header"
                                )}
                              </span>
                              <span>
                                {row.initiatedByFirstName}{" "}
                                {row.initiatedByLastName}
                              </span>
                            </div>
                          ) : (
                            <div style={{ paddingLeft: "70px" }}>---</div>
                          )}
                        </td>
                        <td className={TableStyle.childBorder}>
                          <div className="d-flex justify-content-between">
                            {dateFormate(dayjs, row?.initialedDate)}
                            <div name="upload">
                              <div
                                onClick={(e) => handleUploadButtonClick(e, row)}
                                className="btn hegiht10  sharp me-1 action-btn"
                                style={{ background: "#04306f" }}
                              >
                                <FontAwesomeIcon
                                  icon={faUpload}
                                  fontSize={12}
                                  style={{ color: "#ffff", paddingTop: "3px" }}
                                />
                              </div>
                            </div>
                          </div>
                        </td>
                      </>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={11}>
                      <Empty />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
          <div className="pagination-container">
            <Paginator
              first={paginationFirst}
              rows={15}
              totalRecords={tableData?.totalElements}
              onPageChange={onPageChange}
            />
            <div className="total-pages">
              Total count: {tableData?.totalElements}
            </div>
          </div>
        </>
      )}
      <FhirDrawer
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
        uploadType="upload"
        fileList={filelList}
        setFileList={setFileList}
        selectedBatch={selectedBatch}
        setSelectedBatch={setSelectedBatch}
      />
    </div>
  );
}

export default PdfTable;
