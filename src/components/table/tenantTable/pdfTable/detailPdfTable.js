import React, { useEffect, useState } from "react";
import { Empty, notification, Progress } from "antd";
import { Paginator } from "primereact/paginator";
import dayjs from "dayjs";
import processing from "../../../../images/fihr/processing.svg";
import completed from "../.././../../images/fihr/completed.svg";
import failed from "../.././../../images/fihr/failed.svg";
import TableStyle from "../../table.module.css";
import styles from "../../../../pages/tenantAdmin/patientSync/fhir.module.css";
import { renderSkeleton } from "../../../reuseableFunctions";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faCircleXmark,
} from "@fortawesome/free-regular-svg-icons";
import { useRouter } from "next/router";
import { setStorage } from "../../../../utils/storages";
import { faRotate } from "@fortawesome/free-solid-svg-icons";
import UploadModal from "../../../../pages/tenantAdmin/patientSync/uploadFile/uploadModal";

export const getColors = (rowStatus) => {
  let strokeColor;
  let progressTextClass;
  let textColor;
  let imageSrc;
  const status = rowStatus?.toLowerCase();

  switch (status) {
    case "computed":
    case "already_present":
    case "completed":
      strokeColor = "rgba(11, 96, 176, 1)";
      progressTextClass = "fihrComputedProgressText";
      textColor = "rgba(11, 96, 176, 1)";
      imageSrc = completed;
      break;
    case "failed":
      strokeColor = "red";
      progressTextClass = "fihrFailedProgressText";
      textColor = "red";
      imageSrc = failed;
      break;
    case "processing":
    case "processed":
      strokeColor = "rgba(252, 103, 54, 1)";
      progressTextClass = "fihrProgressText";
      textColor = "rgba(252, 103, 54, 1)";
      imageSrc = processing;
      break;

    default:
      strokeColor = "";
      progressTextClass = "";
      textColor = "";
      imageSrc = "";
  }

  return { strokeColor, progressTextClass, textColor, imageSrc };
};
const DetailedPdfTable = ({
  paginationFirst,
  onPageChange,
  tableData,
  loader,
  webSocketData,
  params,
  currentId
}) => {
  const navigate = useRouter();
  const [socketData, setSocketData] = useState(tableData);
  const [fileList, setFileList] = useState([]);
  const [openUpload, setOpenUpload] = useState({ status: false, data: null });
  const [fileLoading, setFileLoading] = useState(false);
  const [uploadAction, setUploadAction] = useState(null);
  // DetailedPdfTable.propTypes = {
  //   paginationFirst: PropTypes.any.isRequired,
  //   onPageChange: PropTypes.func.isRequired,
  //   tableData: PropTypes.array.isRequired,
  // };
  const gotoPatientDetails = (row) => {
    if (row?.processStage === "FINISHED") {
      setStorage("patientId", row?.patientId);
      const encodedValue = btoa(JSON.stringify(params));
      setStorage("patientSyncEncodedValue", JSON.stringify(encodedValue));
      setStorage("fromPatientSync", true);
      navigate.push({
        pathname: "/tenantAdmin/patientSync/batchFilesView",
      });
    } else {
      notification.warning({
        message: row?.patientId + " file not processed. Please wait.",
      });
    }
  };

  // useEffect(() => {
  //   if (tableData?.content) {
  //     const interval = setInterval(() => {
  //       setProgressMap((prevCount) => (prevCount + 5) % 100);
  //     }, 500);

  //     return () => clearInterval(interval);
  //   }
  // }, [tableData?.content]);

  useEffect(() => {
    if (
      webSocketData &&
      webSocketData?.webSocketType === "PROCESS_STAGE" &&
      tableData?.content
    ) {
      const updatedTableData = socketData?.content?.map((item) => {
        if (item.patientId === webSocketData?.patientId) {
          return {
            ...item,
            processStage: webSocketData?.processStageChart || "PROCESSING",
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
  }, [webSocketData, socketData?.content, tableData?.content]);

  return (
    <div className={TableStyle.classContaineer}>
      {loader ? (
        renderSkeleton()
      ) : (
        <>
          <table className={TableStyle.classTable}>
            <thead className={TableStyle.classTTotalhead}>
              <tr>
                <th>FILE ID</th>
                <th className="text-start">FILE NAME</th>
                <th className="text-center">PATIENT ID</th>
                <th className="text-center">PATIENT NAME</th>
                <th className="text-center"> COMPUTED DATE TIME</th>
                <th className="text-center">STATUS </th>
              </tr>
            </thead>

            <tbody className={TableStyle.bodytable}>
              {socketData?.content?.length > 0 ? (
                socketData?.content?.map((row) => {
                  const errStatus = row?.processStage?.split("_");
                  return (
                    <tr
                      key={row?.patientId}
                      style={{ height: "40px" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        gotoPatientDetails(row);
                      }}
                    >
                      <td className={`${TableStyle.childBorder} px-1`}>
                        {row?.fileId ? row?.fileId : "---"}
                      </td>
                      <td className={`${TableStyle.childBorder} px-0`}>
                        {row?.fileName ? row?.fileName : "---"}
                      </td>
                      <td
                        className={`${TableStyle.childBorder} text-center px-2`}
                      >
                        {row?.patientId ? row?.patientId : "---"}
                      </td>
                      <td className={`${TableStyle.childBorder} text-center`}>
                        {row?.patientName ? row?.patientName : "---"}
                      </td>
                      <td
                        className={TableStyle.childBorder}
                        style={{ textAlign: "center" }}
                      >
                        {row?.createdDate
                          ? dayjs(row?.createdDate).format("MM/DD/YYYY hh:mm A")
                          : "---"}
                      </td>
                      <td
                        className={`${TableStyle.childBorder} text-center px-2`}
                        style={{ width: "200px" }}
                      >
                        <div
                          className="d-flex text-capitalize pt-2 m-auto justify-content-start"
                          style={{
                            color:
                              row?.processStage === "FINISHED" ||
                              row?.processStage === "PROCESSED"
                                ? "green"
                                : errStatus?.includes("FAILED")
                                ? "red"
                                : "rgba(11, 96, 176, 1)",
                          }}
                        >
                          {/* <Image
                          src={getColors(row?.processStage)?.imageSrc}
                          style={{ paddingRight: "5px" }}
                        /> */}
                          {row?.processStage === "FINISHED" ||
                          row?.processStage === "PROCESSED" ? (
                            <FontAwesomeIcon
                              icon={faCircleCheck}
                              className="p-1"
                              style={{ color: "green" }}
                            />
                          ) : errStatus?.includes("FAILED") ? (
                            <FontAwesomeIcon
                              icon={faCircleXmark}
                              className="p-1"
                              style={{ color: "red" }}
                            />
                          ) : (
                            ""
                          )}
                          {row?.processStage
                            ?.replace(/_/g, " ")
                            ?.slice(0, 1)
                            .toUpperCase() +
                            row?.processStage
                              ?.replace(/_/g, " ")
                              .slice(1)
                              .toLowerCase() || ""}
                          {row?.fileStatus === "FAILED" && (
                            <div
                              className={`${styles.refreshBtn} mx-2`}
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenUpload({
                                  status: !openUpload?.status,
                                  data: row,
                                });
                                setUploadAction("uploadFile");
                              }}
                            >
                              <FontAwesomeIcon
                                icon={faRotate}
                                className="text-red px-2"
                              />
                            </div>
                          )}
                        </div>
                        <div
                          className={`d-flex justify-content-center batchProgressBar`}
                        >
                          <Progress
                            percent={
                              // errStatus?.includes("FAILED")
                              //   ? 5
                              //   : row?.processStage === "FINISHED" ||
                              //     row?.processStage === "PROCESSED"
                              //   ? 100
                              //   : progressMap
                              row?.percentage
                            }
                            strokeColor={
                              row?.processStage === "FINISHED" ||
                              row?.processStage === "PROCESSED"
                                ? "green"
                                : errStatus?.includes("FAILED")
                                ? "red"
                                : "rgba(11, 96, 176, 1)"
                            }
                            className={`${styles.progreddBr} ${
                              getColors(row?.processStage)?.progressTextClass
                            } pb-2`}
                            showInfo={true}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })
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
      <UploadModal
        openUpload={openUpload}
        setOpenUpload={setOpenUpload}
        setUploadAction={setUploadAction}
        setFileLoading={setFileLoading}
        fileList={fileList}
        setFileList={setFileList}
        fileLoading={fileLoading}
        uploadAction={uploadAction}
        pageNo={params?.pageNo}
        singleUpload={true}
        currentId={currentId}
      />
    </div>
  );
};
const connector = connect((state) => ({
  webSocketData: state?.tenantAdmin?.webSocket?.webSocketDetails?.data,
}));

export default connector(DetailedPdfTable);
