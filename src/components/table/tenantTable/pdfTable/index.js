import React, { useEffect, useState } from "react";
import { Empty, Popover, Progress } from "antd";
import TableStyle from "../../table.module.css";
import { Paginator } from "primereact/paginator";
import { connect } from "react-redux";
import dayjs from "dayjs";
import styles from "../../../../pages/tenantAdmin/patientSync/fhir.module.css";
import FhirDrawer from "../../../../pages/tenantAdmin/patientSync/modals/PdfDrawer";
import { useRouter } from "next/router";
import refreshIcon from "../../../../images/fihr/refresh.png";
import { renderSkeleton } from "../../../reuseableFunctions";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";
import { faCircleInfo, faRotateLeft } from "@fortawesome/free-solid-svg-icons";
import { actions as allActions } from "../../../../stores/admin/report";
import { actions as patientSyncAction } from "../../../../stores/tenantAdmin/patientSync";
import { getResponePopup } from "../../../../utils/reusable";

function PdfTable({
  paginationFirst,
  onPageChange,
  tableData,
  setSelectedBatch,
  selectedBatch,
  loader,
  webSocketData,
  openUpload,
  setOpenUpload,
  // selectedRow,
  activeTab,
  getActiveTab,
  getTriggerBatch,
  getAllBatches,
  pageNo,
  setViewDetailedBatch,
}) {
  const router = useRouter();
  const [filelList, setFileList] = useState();
  const [socketData, setSocketData] = useState(tableData);
  const [triggeredBatch, setTriggeredBatch] = useState({
    status: false,
    id: null,
  });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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

  const handleUploadButtonClick = (e, row) => {
    e.stopPropagation();
    setIsDrawerOpen(!isDrawerOpen);
    setSelectedBatch(row);
    setFileList();
  };
  const getStatusStyles = ({ status, isBorder }) => {
    // const isProcessing = status === "PROCESSING";
    return {
      background: status === "PROCESSING" ? "#FFE0CB" : "#CFE5FC",
      color: status === "PROCESSING" ? "#FF7D2A" : "#1B67B3",
      border: isBorder
        ? `1px solid ${status === "PROCESSING" ? "#FF7D2A" : "#1B67B3"}`
        : "none",
    };
  };
  const handleBatchTrigger = async (data) => {
    const triggerData = {
      batchId: data?.id,
      ftpRequestFrom: "COGENT_AI",
    };
    const res = await getTriggerBatch({ obj: triggerData });
    if (res.status === "SUCCESS") {
      getResponePopup(res);
      getAllBatches({ page: pageNo });
    }
  };

  useEffect(() => {
    if (webSocketData && webSocketData?.webSocketType === "BATCH_STATUS") {
      const updatedTableData = socketData?.content?.map((item) => {
        if (item.id === webSocketData?.id) {
          return {
            ...item,
            batchUploadStatus: webSocketData?.batchUploadStatus,
          };
        }
        return item;
      });
      setSocketData((prevState) => ({
        ...prevState,
        content: updatedTableData,
      }));
    } else {
      setSocketData(tableData);
    }
  }, [webSocketData, socketData?.content, tableData]);

  return (
    <div className={TableStyle.classContaineer}>
      {loader ? (
        renderSkeleton()
      ) : (
        <>
          <table className={TableStyle.classTable}>
            <thead className={TableStyle.classTTotalhead}>
              <tr>
                <th className="text-truncate">BATCH DETAILS</th>
                <th>COUNT</th>

                <th className="text-center text-truncate">YEAR OF SERVICE</th>
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
                <th style={{ paddingLeft: "70px" }}>STATUS </th>
              </tr>
            </thead>
            <tbody className={TableStyle.bodytable}>
              {socketData?.content?.length > 0 ? (
                socketData?.content?.map((row, index) => (
                  <tr
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      const encodedParams = btoa(
                        JSON.stringify({
                          batchId: row?.id,
                          pageNo: pageNo,
                        })
                      );
                      getActiveTab("PDF");

                      row?.batchUploadStatus &&
                        setViewDetailedBatch({ status: true, data: row });
                      // router?.push({
                      //   pathname: `/tenantAdmin/patientSync/pdfTable`,
                      //   search: `params=${encodedParams}`,
                      // });
                    }}
                  >
                    <td className={TableStyle.childBorder}>
                      <div className="font-bold">
                        {row?.name ? row?.name : "---"}
                      </div>
                      <div>{row?.id ? row?.id : "---"}</div>
                    </td>
                    <td className={TableStyle.childBorder}>
                      {row?.totalFileCount ? (
                        <div className="d-flex">
                          <div style={{ width: "25px" }}>
                            {row?.totalFileCount}{" "}
                          </div>
                          <Popover
                            content={
                              <>
                                Computed:{row?.totalSuccessCount}
                                <br />
                                Failed:{row?.totalFailedCount}
                                <br />
                                Processing:
                                {row?.totalFileCount -
                                  (row?.totalSuccessCount +
                                    row?.totalFailedCount)}
                              </>
                            }
                          >
                            <FontAwesomeIcon
                              icon={faCircleInfo}
                              style={{ color: "#04306f" }}
                              className="mx-1 d-flex justify-content-center align-items-center pt-1"
                              placement="rightBottom"
                            />
                          </Popover>{" "}
                        </div>
                      ) : (
                        "---"
                      )}
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
                              className="px-4 py-1 rounded-1 font-semibold d-flex justify-content-center align-items-center"
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

                              {row?.batchUploadStatus.charAt(0).toUpperCase() +
                                row?.batchUploadStatus.slice(1).toLowerCase()}
                            </div>
                          ) : (
                            <div className="w-100 d-flex justify-content-center align-items-center">
                              <button
                                className={`w-100 ${
                                  row?.source === "CogentUpload"
                                    ? styles.uploadButton
                                    : styles.triggerButton
                                } d-flex justify-content-center align-items-center`}
                                onClick={(e) => {
                                  e.stopPropagation();

                                  setTriggeredBatch({
                                    status: true,
                                    id: row?.batchID,
                                  });
                                  if (row?.source === "CogentUpload") {
                                    setOpenUpload({
                                      status: !openUpload?.status,
                                      data: row,
                                    });
                                  }
                                  if (
                                    row?.batchUploadStatus == null &&
                                    row?.source !== "CogentUpload"
                                  ) {
                                    handleBatchTrigger(row);
                                  }
                                }}
                              >
                                {row?.source === "CogentUpload"
                                  ? "Upload"
                                  : !row?.batchUploadStatus
                                  ? "Trigger"
                                  : ""}
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
const connector = connect(
  (state) => ({
    webSocketData: state?.tenantAdmin?.webSocket?.webSocketDetails?.data,
  }),
  {
    selectedRow: allActions.selectedRow,
    getActiveTab: allActions.activeTab,
    getTriggerBatch: patientSyncAction.getTriggerBatch,
    getAllBatches: patientSyncAction.getAllBatches,
  }
);

export default connector(PdfTable);
