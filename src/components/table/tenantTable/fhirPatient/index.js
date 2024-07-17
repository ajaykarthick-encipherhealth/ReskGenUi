import React, { useState } from "react";
import { Empty, Popover, Progress, Tooltip } from "antd";
import styles from "../../../../pages/tenantAdmin/patientSync/fhir.module.css";
import TableStyle from "../../table.module.css";
import { Paginator } from "primereact/paginator";
import dayjs from "dayjs";
import {
  dateFormate,
  renderUserPrfoileAvatar,
} from "../../../headerFilters/functions";
import moment from "moment";
import Image from "next/image";
import { useRouter } from "next/router";
import refreshIcon from "../../../../images/fihr/refresh.png";

function FIHRPatinetTable({
  reportListAll,
  paginationFirst,
  onPageChange,
  tableData,
}) {
  const router = useRouter();
  const [triggeredBatch, setTriggeredBatch] = useState({
    status: false,
    id: null,
  });

  const dateFormateAlign = (dates) => {
    return dates?.map((res, index) => {
      if (index < 1) {
        let sectionMapArr = <span>{moment(res).year()}</span>;
        return sectionMapArr;
      } else if (dates.length - 1 == index) {
        let sectionMapArr = (
          <Popover
            content={
              <>
                {dates?.map((item, i) =>
                  i > 0 ? (
                    <div className="text-center">{moment(item).year()}</div>
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

  const handleRow = (row) => {
    router?.push("/tenantAdmin/patientSync/details");
  };

  return (
    <div className={TableStyle.classContaineer}>
      {reportListAll?.data?.length === 0 ? (
        <Empty />
      ) : (
        <table className={TableStyle.classTable}>
          <thead className={TableStyle.classTTotalhead}>
            <tr>
              <>
                <th>BATCH NAME & ID</th>
                <th>PATIENT COUNT</th>
                <th style={{ paddingLeft: "40px" }}>STATUS </th>
                <th>YEAR OF SERVICE</th>
                <th className={TableStyle.rowAudited}>INITIATED BY </th>
                <th style={{ textAlign: "center" }}>BATCH INITIATED </th>
              </>
            </tr>
          </thead>

          <tbody className={TableStyle.bodytable}>
            {tableData?.length > 0 ? (
              tableData?.map((row, index) => (
                <tr
                  key={index}
                  onClick={() => {
                    handleRow(row);
                  }}
                  style={{ height: "40px" }}
                >
                  <>
                    <td className={TableStyle.childBorder}>
                      <span style={{ fontSize: "14px" }}>
                        {row?.batchID ? row?.batchID : "---"}
                      </span>
                      <br />
                      <span style={{ fontSize: "12px" }}>
                        {row?.batchName ? row?.batchName : "---"}
                      </span>
                    </td>

                    <td className={TableStyle.childBorder}>
                      {row?.patientCount ? row?.patientCount : "---"}
                    </td>
                    <td
                      className={`${TableStyle.childBorder}`}
                      style={{ width: "20%" }}
                    >
                      <div style={{ width: "100%", display: "flex" }}>
                        {triggeredBatch?.id !== row?.batchID && (
                          <button
                            className={styles.triggerButton}
                            onClick={(e) => {
                              e.stopPropagation();
                              setTriggeredBatch({
                                status: true,
                                id: row?.batchID,
                              });
                            }}
                          >
                            Trigger
                          </button>
                        )}
                        {triggeredBatch?.status &&
                          triggeredBatch?.id === row?.batchID && (
                            <>
                              <div
                                style={{ width: "80%" }}
                                className={`d-flex ${styles.progressDIv} ${
                                  row?.status === "processing"||
                                    row?.status === "failed"
                                    ? "progressText"
                                    : "completedText"
                                }`}
                              >
                                <Progress
                                  percent={80}
                                  strokeColor={
                                    row?.status === "processing"||
                                    row?.status === "failed"
                                      ? "#0078D4"
                                      : "#00940F"
                                  }
                                  className={`${styles.progreddBr}`}
                                />
                              </div>
                              {row?.status === "failed" && (
                                <div
                                  className={`d-flex`}
                                  style={{ width: "20%" }}
                                >
                                  <span className={styles.legendStyle}></span>
                                  <Image
                                    src={refreshIcon}
                                    alt="noImage"
                                    height={20}
                                    width={20}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                    }}
                                  />
                                </div>
                              )}
                            </>
                          )}
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
                      {row?.initiatedByFirstName ||
                      row?.initiatedByLastName ||
                      row?.auditedByProfileImage ? (
                        <div style={{ display: "flex", alignItems: "center" }}>
                          {" "}
                          <span style={{ marginRight: "10px" }}>
                            {" "}
                            {renderUserPrfoileAvatar(
                              row?.initiatedByFirstName,
                              row?.initiatedByLastName,
                              row?.auditedByProfileImage,
                              "header",
                              true
                            )}
                          </span>
                          <span>
                            {row.initiatedByFirstName} {row.initiatedByLastName}
                          </span>
                        </div>
                      ) : (
                        <div style={{ paddingLeft: "70px" }}>---</div>
                      )}
                    </td>
                    <td
                      className={TableStyle.childBorder}
                      style={{ textAlign: "center" }}
                    >
                      {dateFormate(dayjs, row?.initialedDate)}
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
          totalRecords={tableData?.length}
          onPageChange={onPageChange}
        />
        <div className="total-pages">Total count: {tableData?.length}</div>
      </div>
    </div>
  );
}

export default FIHRPatinetTable;
