import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Badge, Empty, Tooltip, Popover } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import TableStyle from "../../../../components/table/table.module.css";
import { SVGICON } from "../../../../jsx/constant/theme";
import { Paginator } from "primereact/paginator";
import { selectedRow } from "../../../../store/actions/ReportActions";
import {
  dateFormate,
  renderUserPrfoileAvatar,
  sortFunction,
} from "../../../../components/headerFilters/functions";
import visitStyles from "../../../../styles/visitdata.module.css";
import AuditedTrack from "../../../../../src/images/trackingImages/AuditedTrack.png";
import NotAudited from "../../../../../src/images/trackingImages/NotAuditedTrack.png";
import AuditHold from "../../../../../src/images/trackingImages/AuditHoldTrack.png";
import ReAudit from "../../../../../src/images/trackingImages/reAuditTrack.png";
import AuditPending from "../../../../../src/images/trackingImages/AuditPending.png";
import AuditedDeclineTrack from "../../../../../src/images/trackingImages/AuditDeclined.png";
import { extractLatestData } from "../../../supervisor/auditing";

import Image from "next/image";
function TeamReport({
  setModal,
  modal,
  paginationFirst,
  ReportPatientDetails,
  onPageChange,
  setComments,
  setSelectedRows,
  selectedRows,
  selectAll,
  setSelectAll,
  sortOrder,
  setSortOrder,
  setSort,
}) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(selectedRow(selectedRows));
  }, [selectedRows]);

  const auditstatusBodyTemplate = (rowData) => {
    const declinedDataFromAudit = extractLatestData(rowData?.auditDeclineNotes);

    const declinedDataFromDeclined = extractLatestData(
      rowData?.auditDeclineNotes
    );

    const declinedData = declinedDataFromAudit || declinedDataFromDeclined;
    switch (rowData.auditedStatus) {
      case "AUDIT_PENDING":
        return (
          <Popover placement="bottom" title="Status: AUDIT PENDING">
            <div className="patient-status">
              <Image
                src={AuditPending}
                style={{ height: "30px", width: "30px" }}
              />
            </div>
          </Popover>
        );

      case "AUDITHOLD":
        return (
          <Popover placement="bottom" title=" Status: AUDIT HOLD">
            <div className="patient-status">
              <Image
                src={AuditHold}
                style={{ height: "30px", width: "30px" }}
              />
            </div>
          </Popover>
        );
      case "REAUDIT":
        return (
          <Popover placement="bottom" title=" Status: REAUDIT">
            <div className="patient-status">
              <Image src={ReAudit} style={{ height: "30px", width: "30px" }} />
            </div>
          </Popover>
        );
      case "AUDITED":
        return (
          <Popover placement="bottom" title=" Status: AUDITED">
            <div className="patient-status">
              <Image
                src={AuditedTrack}
                style={{ height: "30px", width: "30px" }}
              />
            </div>
          </Popover>
        );
      case "AUDITED":
        return (
          <div className="patient-status">
            <Image
              src={AuditedTrack}
              style={{ height: "30px", width: "30px" }}
            />
          </div>
        );

      case "NOT_AUDIT":
        return (
          <Popover placement="bottom" title=" Status: NOT AUDIT">
            <div className="patient-status">
              <Image
                src={NotAudited}
                style={{ height: "30px", width: "30px" }}
              />
            </div>
          </Popover>
        );
      case "AUDIT_DECLINED":
        return (
          <Popover
            placement="bottom"
            title=" Status: AUDIT DECLINED"
            content={`Reason: ${declinedData ? declinedData : "---"}`}
          >
            <div className="patient-status">
              <Image
                src={AuditedDeclineTrack}
                style={{ height: "30px", width: "30px" }}
              />
            </div>
          </Popover>
        );
      case null:
        return <div className="patient-status">---</div>;
    }
  };

  const badgeDisplay = (row) => {
    if (row?.auditedStatus === "AUDITED") {
      return (
        <Badge.Ribbon
          text="Audited"
          color="#377880"
          placement="start"
        ></Badge.Ribbon>
      );
    } else if (row.auditedStatus === "REAUDIT") {
      return (
        <Badge.Ribbon
          text="Re Audit"
          color="#FFBE00"
          placement="start"
          height={10}
        ></Badge.Ribbon>
      );
    } else if (row.auditedStatus === "AUDITEDHOLD") {
      return (
        <Badge.Ribbon
          text="Audite Hold"
          color="#964B00"
          placement="start"
        ></Badge.Ribbon>
      );
    } else return null;
  };
  const getFlag = (data) => {
    switch (data["2023"][0]?.flag) {
      case "PATIENT_NAME_MISSED":
        return (
          <Tooltip title="PATIENT_NAME_MISSED" placement="bottom">
            <i className={visitStyles.name_missed}>
              {SVGICON.emptyFlagSmallLarge}
            </i>
          </Tooltip>
        );
      case "PATIENT_DOB_MISSED":
        return (
          <Tooltip title="PATIENT_DOB_MISSED" placement="bottom">
            <i className={visitStyles.dob_missed}>
              {SVGICON.emptyFlagSmallLarge}
            </i>
          </Tooltip>
        );
      case "MRN_ID_MISMATCH":
        return (
          <Tooltip title="MRN_ID_MISMATCH" placement="bottom">
            <i className={visitStyles.id_missed}>
              {SVGICON.emptyFlagSmallLarge}
            </i>
          </Tooltip>
        );
      case "PROVIDER_SIGN_MISSED":
        return (
          <Tooltip title="PROVIDER_SIGN_MISSED" placement="bottom">
            <i className={visitStyles.sign_missed}>
              {SVGICON.emptyFlagSmallLarge}
            </i>
          </Tooltip>
        );
      case "PROVIDER_SIGNATURE_MISSED":
        return (
          <Tooltip title="PROVIDER_SIGNATURE_MISSED" placement="bottom">
            <i className={visitStyles.signature_missed}>
              {SVGICON.emptyFlagSmallLarge}
            </i>
          </Tooltip>
        );
      case "PROVIDER_CREDENTIAL_MISSED":
        return (
          <Tooltip title="PROVIDER_CREDENTIAL_MISSED" placement="bottom">
            <i className={visitStyles.cred_missed}>
              {SVGICON.emptyFlagSmallLarge}
            </i>
          </Tooltip>
        );

      case "PROVIDER_SIGN_STATUS_PENDING":
        return (
          <Tooltip title="PROVIDER_SIGN_STATUS_PENDING" placement="bottom">
            <i className={visitStyles.sign_status}>
              {SVGICON.emptyFlagSmallLarge}
            </i>
          </Tooltip>
        );

      case "NO_HCC_FOUND":
        return (
          <Tooltip title="NO_HCC_FOUND" placement="bottom">
            <i className={visitStyles.no_hcc_found}>
              {SVGICON.emptyFlagSmallLarge}
            </i>
          </Tooltip>
        );

      case "NO_VALID_DOCUMENT_FOUND":
        return (
          <Tooltip title="NO_VALID_DOCUMENT_FOUND" placement="bottom">
            <i className={visitStyles.no_doc_found}>
              {SVGICON.emptyFlagSmallLarge}
            </i>
          </Tooltip>
        );

      case "PATIENT_DISEASED":
        return (
          <Tooltip title="PATIENT_DISEASED" placement="bottom">
            <i className={visitStyles.patient_diseased}>
              {SVGICON.emptyFlagSmallLarge}
            </i>
          </Tooltip>
        );

      case "PATIENT_INACTIVE":
        return (
          <Tooltip title="PATIENT_INACTIVE" placement="bottom">
            <i className={visitStyles.patient_inactive}>
              {SVGICON.emptyFlagSmallLarge}
            </i>
          </Tooltip>
        );
      case "":
        return (
          <Tooltip title="" placement="bottom">
            <i className={visitStyles.patient_inactive}>{SVGICON.emptyFlag}</i>
          </Tooltip>
        );
    }
  };

  return (
    <div className={TableStyle.classContaineer}>
      {ReportPatientDetails?.data?.length === 0 ? (
        <Empty />
      ) : (
        <table className={TableStyle.classTable}>
          <thead className={TableStyle.classTTotalhead}>
            <tr>
              <th className={TableStyle.rowStyle3}>PATIENT ID</th>
              <th>PATIENT NAME</th>
              <th className={TableStyle.rowStyle2}>REVIEWER</th>
              <th
                style={{ cursor: "pointer" }}
                onClick={() => {
                  sortFunction(
                    sortOrder,
                    setSortOrder,
                    setSort,
                    "processedDate"
                  );
                }}
              >
                COMPLETED DATE{" "}
                {sortOrder === "ASC" ? (
                  <ArrowUpOutlined />
                ) : (
                  <ArrowDownOutlined />
                )}
              </th>
              <th>COMMENTS </th>
              <th className={TableStyle.rowStyle2}>SUPERVISOR NAME </th>
              <th>RAF SCORE </th>
              <th>HCC </th>
              <th>FLAG </th>
              <th className={TableStyle.rowStyle2}>AUDIT STATUS</th>
            </tr>
          </thead>

          <tbody className={TableStyle.bodytable}>
            {ReportPatientDetails?.data?.length > 0 &&
              ReportPatientDetails?.data?.map((row, index) => (
                <tr key={index}>
                  <td className={TableStyle.firstTdBorder}>
                    {row?.auditedStatus ? (
                      <span
                        style={{
                          position: "relative",
                          left: "0px",
                          top: "10px",
                        }}
                      >
                        {badgeDisplay(row)}
                      </span>
                    ) : null}
                    <span
                      style={{
                        paddingLeft: "70px",
                      }}
                    >
                      {row?.patientId}
                    </span>
                  </td>

                  <td className={TableStyle.childBorder}>
                    {row?.patientName ? row?.patientName : "---"}
                  </td>
                  <td
                    className={TableStyle.childBorder}
                    style={{ textAlign: "center" }}
                  >
                    {row.patientAllocatedFirstName ||
                    row.patientAllocatedLastName ||
                    row?.patientAllocatedProfileImage ? (
                      <div style={{ display: "flex", alignItems: "center" }}>
                        {" "}
                        <span style={{ marginRight: "10px" }}>
                          {" "}
                          {renderUserPrfoileAvatar(
                            row.patientAllocatedFirstName,
                            row.patientAllocatedLastName,
                            row?.patientAllocatedProfileImage,
                            "header"
                          )}
                        </span>
                        <span>
                          {row.patientAllocatedFirstName}{" "}
                          {row.patientAllocatedLastName}
                        </span>
                      </div>
                    ) : (
                      <div style={{ textAlign: "center" }}>---</div>
                    )}
                  </td>

                  <td className={TableStyle.childBorder}>
                    {dateFormate(dayjs, row?.processedDate)}
                  </td>
                  <td className={TableStyle.childBorder}>
                    <div
                      disabled={row?.comment ? false : true}
                      onClick={() => {
                        if (row?.comment) {
                          setComments(row?.comment);
                          setModal(!modal);
                        }
                      }}
                    >
                      {row?.comment ? SVGICON.comment : SVGICON.emptyComments}
                    </div>
                  </td>
                  <td
                    className={TableStyle.childBorder}
                    style={{ textAlign: "left", paddingLeft: "50px" }}
                  >
                    {row.auditedByFirstName ||
                    row.auditedByLastName ||
                    row?.auditedByProfileImage ? (
                      <>
                        <span style={{ marginRight: "10px" }}>
                          {renderUserPrfoileAvatar(
                            row.auditedByFirstName,
                            row.auditedByLastName,
                            row?.auditedByProfileImage,
                            "header"
                          )}
                        </span>
                        <span>
                          {row.auditedByFirstName} {row.auditedByLastName}
                        </span>
                      </>
                    ) : (
                      <div style={{ paddingLeft: "50px" }}>---</div>
                    )}
                  </td>

                  <td className={TableStyle.childBorder}>
                    {row?.rafSum ? row?.rafSum : "000"}{" "}
                  </td>
                  <td className={TableStyle.childBorder}>
                    {row?.validDiseaseCount ? row?.validDiseaseCount : "000"}
                  </td>
                  <td className={TableStyle.childBorder}>
                    {row?.flag ? (
                      getFlag(row?.flag)
                    ) : (
                      <div>{SVGICON.emptyFlag}</div>
                    )}
                  </td>
                  <td
                    className={TableStyle.lastBorder}
                    style={{ textAlign: "center" }}
                  >
                    {auditstatusBodyTemplate(row)}{" "}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
      <div className="pagination-container">
        <Paginator
          first={paginationFirst}
          rows={15}
          totalRecords={ReportPatientDetails?.totalElements}
          onPageChange={onPageChange}
        />
        <div className="total-pages">
          Total count: {ReportPatientDetails?.totalElements}
        </div>
      </div>
    </div>
  );
}

export default TeamReport;
