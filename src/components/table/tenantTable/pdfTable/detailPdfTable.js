import React, { useEffect, useState } from "react";
import { Empty, Progress } from "antd";
import { Paginator } from "primereact/paginator";
import dayjs from "dayjs";
import Image from "next/image";
import processing from "../../../../images/fihr/processing.svg";
import completed from "../.././../../images/fihr/completed.svg";
import refresh from "../.././../../images/fihr/detailedFhirRefresh.svg";
import failed from "../.././../../images/fihr/failed.svg";
import TableStyle from "../../table.module.css";
import styles from "../../../../pages/tenantAdmin/patientSync/fhir.module.css";
import PropTypes from "prop-types";
import { renderSkeleton } from "../../../reuseableFunctions";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faCircleXmark,
} from "@fortawesome/free-regular-svg-icons";
import { faClockRotateLeft } from "@fortawesome/free-solid-svg-icons";

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
}) => {
  const [progressMap, setProgressMap] = useState(5);
  const [socketData, setSocketData] = useState(tableData);
  // DetailedPdfTable.propTypes = {
  //   paginationFirst: PropTypes.any.isRequired,
  //   onPageChange: PropTypes.func.isRequired,
  //   tableData: PropTypes.array.isRequired,
  // };

  useEffect(() => {
    if (socketData) {
      const interval = setInterval(() => {
        setProgressMap((prevCount) => (prevCount + 5) % 100);
      }, 500);

      return () => clearInterval(interval);
    }
  }, [socketData]);

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
            processStage: webSocketData?.processStageChart||'PROCESSING' ,
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
                <th>FILE ID</th>
                <th>FILE NAME</th>
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
                    <tr key={row?.patientId} style={{ height: "40px" }}>
                      <td className={TableStyle.childBorder}>
                        {row?.fileId ? row?.fileId : "---"}
                      </td>
                      <td className={TableStyle.childBorder}>
                        {row?.fileName ? row?.fileName : "---"}
                      </td>
                      <td className={`${TableStyle.childBorder} text-center`}>
                        {row?.patientId ? row?.patientId : "---"}
                      </td>
                      <td className={`${TableStyle.childBorder} text-center`}>
                        {row?.patientName ? row?.patientName : "---"}
                      </td>
                      <td
                        className={TableStyle.childBorder}
                        style={{ textAlign: "center" }}
                      >
                        {row?.computedDateTime
                          ? dayjs(row?.computedDateTime).format(
                              "MM/DD/YYYY hh:mm A"
                            )
                          : "---"}
                      </td>
                      <td className={`${TableStyle.childBorder} text-center`} style={{width:"200px"}}>
                        <div
                          className="text-capitalize"
                          style={{
                            fontSize: "14px",
                            display: "flex",
                            margin: "auto",
                            justifyContent: "start",
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
                          {row?.processStage?.replace(/_/g, " ")
                            ?.slice(0, 1)
                            .toUpperCase() +
                            row?.processStage?.replace(/_/g, " ")
                              .slice(1)
                              .toLowerCase()||""}
                          {/* {errStatus?.includes("FAILED")&& (
                          <div className={styles.refreshBtn}>
                            <Image src={refresh} width={15} height={15} />
                          </div>
                        )} */}
                        </div>
                        <div
                          className={`d-flex justify-content-center batchProgressBar`}
                        >
                          <Progress
                            percent={
                              errStatus?.includes("FAILED")
                                ? 5
                                : row?.processStage === "FINISHED" ||
                                  row?.processStage === "PROCESSED"
                                ? 100
                                : progressMap
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
                            }`}
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
    </div>
  );
};
const connector = connect((state) => ({
  webSocketData: state?.tenantAdmin?.webSocket?.webSocketDetails?.data,
}));

export default connector(DetailedPdfTable);