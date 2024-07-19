import React from "react";
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
import SpinnerDots from "../../../spinner";
import { renderSkeleton } from "../../../reuseableFunctions";

export const getColors = (rowStatus) => {
  let strokeColor;
  let progressTextClass;
  let textColor;
  let imageSrc;
  const status = rowStatus?.toLowerCase();

  switch (status) {
    case "computed":
    case "already_present":
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
      strokeColor = "rgba(252, 103, 54, 1)";
      progressTextClass = "fihrProgressText";
      textColor = "rgba(252, 103, 54, 1)";
      imageSrc = processing;
      break;

    default:
      strokeColor = "rgba(252, 103, 54, 1)";
      progressTextClass = "fihrProgressText";
      textColor = "rgba(252, 103, 54, 1)";
      imageSrc = completed;
  }

  return { strokeColor, progressTextClass, textColor, imageSrc };
};
const DetailedPdfTable = ({
  paginationFirst,
  onPageChange,
  tableData,
  loader,
}) => {
  DetailedPdfTable.propTypes = {
    paginationFirst: PropTypes.any.isRequired,
    onPageChange: PropTypes.func.isRequired,
    tableData: PropTypes.array.isRequired,
  };


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
                <th>PATIENT ID</th>
                <th>PATIENT NAME</th>
                <th style={{ textAlign: "center" }}> COMPUTED DATE TIME</th>
                <th style={{ textAlign: "center" }}>STATUS </th>
              </tr>
            </thead>

            <tbody className={TableStyle.bodytable}>
              {tableData?.content?.length > 0 ? (
                tableData?.content?.map((row) => (
                  <tr key={row?.patientId} style={{ height: "40px" }}>
                    <td className={TableStyle.childBorder}>
                      {row?.fileId ? row?.fileId : "---"}
                    </td>
                    <td className={TableStyle.childBorder}>
                      {row?.fileName ? row?.fileName : "---"}
                    </td>
                    <td className={TableStyle.childBorder}>
                      {row?.patientId ? row?.patientId : "---"}
                    </td>
                    <td className={TableStyle.childBorder}>
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
                    <td
                      className={TableStyle.childBorder}
                      style={{ textAlign: "center" }}
                    >
                      <div>
                        <div
                          className="text-capitalize mx-2"
                          style={{
                            fontSize: "14px",
                            display: "flex",
                            margin: "auto",
                            justifyContent: "start",
                            color: getColors(row?.fileStatus)?.textColor,
                          }}
                        >
                          <Image
                            src={getColors(row?.fileStatus)?.imageSrc}
                            style={{ paddingRight: "5px" }}
                          />
                          {row?.fileStatus}
                          {row?.fileStatus === "FAILED" && (
                            <div className={styles.refreshBtn}>
                              <Image src={refresh} width={15} height={15} />
                            </div>
                          )}
                        </div>
                        <div className={styles.progressDIv}>
                          <Progress
                            percent={80}
                            strokeColor={getColors(row?.fileStatus)?.strokeColor}
                            className={`${styles.progreddBr} ${
                              getColors(row?.fileStatus)?.progressTextClass
                            }`}
                          />
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
    </div>
  );
};

export default DetailedPdfTable;
