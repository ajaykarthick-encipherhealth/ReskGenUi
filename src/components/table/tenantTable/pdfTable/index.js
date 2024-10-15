import React, { useEffect, useState } from "react";
import { Empty, Popover, Progress } from "antd";
import TableStyle from "../../table.module.css";
import { Paginator } from "primereact/paginator";
import { selectedRow } from "../../../../store/actions/ReportActions";
import { connect, useDispatch } from "react-redux";
import dayjs from "dayjs";
import styles from "../../../../pages/tenantAdmin/patientSync/fhir.module.css";
import FhirDrawer from "../../../../pages/tenantAdmin/patientSync/modals/PdfDrawer";
import { useRouter } from "next/router";
import { getActiveTab } from "../../../../store/actions/l2Action/AuditReportAction";
import refreshIcon from "../../../../images/fihr/refresh.png";
import { renderSkeleton } from "../../../reuseableFunctions";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";
import { faRotateLeft } from "@fortawesome/free-solid-svg-icons";
import { getColors } from "./detailPdfTable";

function PdfTable({
  paginationFirst,
  onPageChange,
  selectedRows,
  tableData,
  setSelectedBatch,
  selectedBatch,
  loader,
  webSocketData,
}) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [filelList, setFileList] = useState();
  const [triggeredBatch, setTriggeredBatch] = useState({
    status: false,
    id: null,
  });
  useEffect(() => {
    dispatch(selectedRow(selectedRows));
  }, [selectedRows]);

  const dateFormateAlign = (dates) => (
    <div className="d-flex justify-content-center align-items-center">
      {dates?.map((res, index) => {
        if (index < 1) {
          // let sectionMapArr = <span>{dayjs(res).format("YYYY")}</span>;
          return (
            <div className="text-center">{`${res}${
              (index + 1) / 2 == 0 ? "," : ""
            }`}</div>
          );
        } else if (dates?.length - 1 == index) {
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
                style={{ width: "22px", height: "22px" }}
                className={`border border-success-subtle rounded-circle text-center mx-1`}
              >
                {dates.length - 1}+
              </span>
            </Popover>
          );
          return sectionMapArr;
        }
      })}
    </div>
  );
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleUploadButtonClick = (e, row) => {
    e.stopPropagation();
    setIsDrawerOpen(!isDrawerOpen);
    setSelectedBatch(row);
    setFileList();
  };
  const getStatusStyles = ({ status, isBorder }) => {
    const isProcessing = status === "PROCESSING";
    return {
      background: isProcessing ? "#FFE0CB" : "#CFE5FC",
      color: isProcessing ? "#FF7D2A" : "#1B67B3",
      border: isBorder
        ? `1px solid ${isProcessing ? "#FF7D2A" : "#1B67B3"}`
        : "none",
    };
  };

  console.log(webSocketData, "webSocketData");
  return (
    <div className={TableStyle.classContaineer}>
      {loader ? (
        renderSkeleton()
      ) : (
        <>
          {tableData?.content?.length === 0 ? (
            <Empty />
          ) : (
            <table className={TableStyle.classTable}>
              <thead className={TableStyle.classTTotalhead}>
                <tr>
                  <>
                    <th className="text-truncate">BATCH DETAILS</th>
                    <th>COUNT</th>

                    <th className="text-center text-truncate">
                      YEAR OF SERVICE
                    </th>
                    <th className="text-center">EMR </th>
                    <th className="text-center">SOURCE </th>
                    <th
                      className={`${TableStyle.rowAudited} text-center text-truncate`}
                    >
                      INITIATED BY{" "}
                    </th>
                    <th className="text-center text-truncate">
                      BATCH INITIATED DATE{" "}
                    </th>
                    <th style={{ paddingLeft: "60px" }}>STATUS </th>
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
                          <div className="font-bold">
                            {row?.name ? row?.name : "---"}
                          </div>
                          <div>{row?.id ? row?.id : "---"}</div>
                        </td>
                        <td className={TableStyle.childBorder}>
                          {row?.totalFileCount ? row?.totalFileCount : "---"}
                        </td>

                        <td className={TableStyle.childBorder}>
                          {row?.yearOfService
                            ? dateFormateAlign(row?.yearOfService)
                            : "000"}
                        </td>

                        <td className={`${TableStyle.childBorder} text-center`}>
                          {row?.emrType ? row?.emrType : "---"}
                        </td>
                        <td className={`${TableStyle.childBorder} text-center`}>
                          {row?.source ? row?.source : "---"}
                        </td>
                        <td
                          className={TableStyle.childBorder}
                          // style={{ textAlign: "left", paddingLeft: "110px" }}
                        >
                          {row?.createdBy ? (
                            <div className="text-center">{row?.createdBy}</div>
                          ) : (
                            <div className="text-center">---</div>
                          )}
                        </td>
                        <td
                          className={`${TableStyle.childBorder} text-center`}
                          // style={{ textAlign: "left", paddingLeft: "110px" }}
                        >
                          {row?.createdDate
                            ? dayjs(row?.createdDate).format("MM-DD-YYYY")
                            : "---"}
                        </td>

                        <td className={`${TableStyle.childBorder} text-center`}>
                          <div className="w-100 text-center d-flex justify-content-center align-items-center">
                            <div
                              style={{ width: "50%" }}
                              className="d-flex justify-content-center align-items-center"
                            >
                              {row?.batchUploadStatus ? (
                                <div
                                  style={{
                                    width: "100%",
                                    ...getStatusStyles({
                                      status: row?.batchUploadStatus,
                                      isBorder: true,
                                    }),
                                  }}
                                  className="px-2 py-1 rounded-1 font-semibold d-flex justify-content-center align-items-center"
                                >
                                  <FontAwesomeIcon
                                    className="mx-1"
                                    icon={
                                      row?.batchUploadStatus === "PROCESSING"
                                        ? faRotateLeft
                                        : faCircleCheck
                                    }
                                    style={getStatusStyles({
                                      status: row?.batchUploadStatus,
                                    })}
                                  />
                                  {row?.batchUploadStatus
                                    .charAt(0)
                                    .toUpperCase() +
                                    row?.batchUploadStatus
                                      .slice(1)
                                      .toLowerCase()}
                                </div>
                              ) : (
                                <div className="w-100 d-flex justify-content-center align-items-center">
                                  <button
                                    className={`w-100 ${
                                      row?.source === "cogentUpload"
                                        ? styles.uploadButton
                                        : styles.triggerButton
                                    } d-flex justify-content-center align-items-center`}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setTriggeredBatch({
                                        status: true,
                                        id: row?.batchID,
                                      });
                                    }}
                                  >
                                    {row?.source === "cogentUpload"
                                      ? "Upload"
                                      : "Trigger"}
                                  </button>
                                </div>
                              )}
                            </div>
                            <div
                              style={{ width: "30%" }}
                              className="d-flex justify-content-start align-items-center"
                            >
                              {["processing", "failed"].includes(
                                row?.batchUploadStatus?.toLowerCase()
                              ) && (
                                <div className="d-flex mx-2">
                                  <Popover content={"Files are failed"}>
                                    <span className={styles.legendStyle}></span>
                                  </Popover>
                                  <Image
                                    src={refreshIcon}
                                    alt="noImage"
                                    height={20}
                                    width={20}
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                </div>
                              )}
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

const connector = connect((state) => ({
  webSocketData: state?.tenantAdmin?.webSocket?.webSocketDetails?.data,
}));
export default connector(PdfTable);
