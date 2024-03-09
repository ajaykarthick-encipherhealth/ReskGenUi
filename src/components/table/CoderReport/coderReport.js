import React, { useEffect } from "react";
import { Badge, Empty, Popover, Tooltip } from "antd";
import TableStyle from "../table.module.css";
import { SVGICON } from "../../../jsx/constant/theme";
import { Paginator } from "primereact/paginator";
import { selectedRow } from "../../../store/actions/ReportActions";
import { useDispatch } from "react-redux";
import Footer from "../../../jsx/layouts/Footer";
import dayjs from "dayjs";
import { dateFormate, sortFunction } from "../../headerFilters/functions";
import visitStyles from "../../../styles/visitdata.module.css";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import AuditedTrack from "../../../../src/images/trackingImages/AuditedTrack.png";
import NotAudited from "../../../../src/images/trackingImages/NotAuditedTrack.png";
import AuditHold from "../../../../src/images/trackingImages/AuditHoldTrack.png";
import ReAudit from "../../../../src/images/trackingImages/reAuditTrack.png";
import AuditPending from "../../../../src/images/trackingImages/AuditPending.png";
import Pending from "../../../../src/images/trackingImages/PendingTrack.png";
import Hold from "../../../../src/images/trackingImages/HoldTrack.png";
import Completed from "../../../../src/images/trackingImages/CompletedTrack.png";
import Declined from "../../../../src/images/trackingImages/DeclineTrack.png";
import AuditedDeclineTrack from "../../../../src/images/trackingImages/AuditDeclined.png";
import Abort from "../../../../src/images/trackingImages/Abort.png";
import { extractLatestData } from "../../../pages/l2Auditor/auditing";
import Image from "next/image";

function CoderReport({
  setModal,
  modal,
  reportListAll,
  paginationFirst,
  ReportPatientDetails,
  onPageChange,
  comments,
  setComments,
  selectedRows,
  setSelectedRows,
  selectAll,
  setSelectAll,
  sortOrder,
  setSortOrder,
  setSort,
}) {
  const dispatch = useDispatch();

  const handleHeaderCheckboxChange = () => {
    setSelectAll(!selectAll);
    const updatedRows = selectAll ? [] : reportListAll?.data;
    setSelectedRows(updatedRows);
  };

  const handleRowCheckboxChange = (row) => {
    const isSelected = selectedRows?.some(
      (selectedRow) => selectedRow.patientId === row?.patientId
    );
    let updatedRows;

    if (isSelected) {
      updatedRows = selectedRows?.filter(
        (selectedRow) => selectedRow.patientId !== row?.patientId
      );
    } else {
      updatedRows = [...selectedRows, row];
    }

    setSelectedRows(updatedRows);
  };

  const processstatusBodyTemplate = (rowData) => {
    const declinedDataFromAudit = extractLatestData(
      rowData?.auditDeclinedNotes
    );

    const declinedDataFromDeclined = extractLatestData(rowData?.declineNotes);

    const declinedData = declinedDataFromAudit || declinedDataFromDeclined;

    switch (rowData.processedStatus) {
      case "COMPLETED":
        return (
          <Popover placement="bottom" title="Status: COMPLETED">
            <div className="patient-status" style={{ textAlign: "center" }}>
              <Image src={Completed} style={{ height: "30px", width: "30px" }} />
            </div>
          </Popover>
        );

      case "PENDING":
        return (
          <Popover placement="bottom" title="Status: PENDING">
            <div className="patient-status" style={{ textAlign: "center" }}>
              <Image src={Pending} style={{ height: "30px", width: "30px" }} />
            </div>
          </Popover>
        );

      case "DECLINED":
        return (
          <Popover
            placement="bottom"
            title="Status: DECLINED"
            content={`Reason: ${declinedData ? declinedData : "---"}`}
          >
            <div className="patient-status" style={{ textAlign: "center" }}>
              <Image src={Declined} style={{ height: "30px", width: "30px" }} />
            </div>
          </Popover>
        );

      case "NOTCOMPUTED":
        return (
          <Popover placement="bottom" title="Status: NOT COMPUTED">
            <div className="patient-status" style={{ textAlign: "center" }}>
              <Image src={Pending} style={{ height: "30px", width: "30px" }} />
            </div>
          </Popover>
        );
      case "COMPUTED":
        return (
          <Popover placement="bottom" title="Status: PENDING">
            <div className="patient-status" style={{ textAlign: "center" }}>
              <Image src={Pending} style={{ height: "30px", width: "30px" }} />
            </div>
          </Popover>
        );
      case "HOLD":
        return (
          <Popover placement="bottom" title="Status: HOLD">
            <div className="patient-status" style={{ textAlign: "center" }}>
              <Image src={Hold} style={{ height: "30px", width: "30px" }} />
            </div>
          </Popover>
        );
      case "ABORTED_BY_CRON":
        return (
          <Popover placement="bottom" title="Status: ABORTED BY CRON">
            <div className="patient-status" style={{ textAlign: "center" }}>
              <Image src={Abort} style={{ height: "30px", width: "30px" }} />
            </div>
          </Popover>
        );
      case null:
        return (
          <Popover placement="bottom" title="Status: PENDING">
            <div className="patient-status" style={{ textAlign: "center" }}>
              <Image src={Pending} style={{ height: "30px", width: "30px" }} />
            </div>
          </Popover>
        );
    }
  };

  const getFlag = (data) => {
    switch (data["2023"][data["2023"]?.length - 1]?.flag) {
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

  useEffect(() => {
    dispatch(selectedRow(selectedRows));
  }, [selectedRows]);

  return (
    <div className={TableStyle.classContaineer}>
      {reportListAll?.data?.length === 0 ? (
        <Empty />
      ) : (
        <table className={TableStyle.classTable}>
          <thead className={TableStyle.classTTotalhead}>
            <tr>
              <>
                <th></th>
                <th className={TableStyle.rowStyle2}>PATIENT ID</th>
                <th>PATIENT NAME</th>
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
                  COMPLETE DATE{" "}
                  {sortOrder === "ASC" ? (
                    <ArrowUpOutlined />
                  ) : (
                    <ArrowDownOutlined />
                  )}
                </th>
                <th>COMMENTS </th>
                <th className={TableStyle.rowAudited}>AUDITOR NAME </th>
                <th>RAF SCORE </th>
                <th>HCC </th>
                <th>FLAG </th>
                <th className={TableStyle.rowStyle2}>STATUS</th>
                <th>
                  <div
                    style={{ display: "flex", justifyContent: "space-around" }}
                  >
                    <input
                      type="checkbox"
                      onChange={handleHeaderCheckboxChange}
                      className={selectAll ? TableStyle.customChecked2 : ""}
                      style={{
                        width: "22px",
                        height: "22px",
                        flexhrink: "0",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                      checked={selectAll}
                    />
                  </div>
                </th>
              </>
            </tr>
          </thead>

          <tbody className={TableStyle.bodytable}>
            {reportListAll?.data?.length > 0 ? (
              reportListAll?.data?.map((row, index) => (
                <tr key={index}>
                  {row?.auditedBy && (
                    <td className={TableStyle.firstTdBorder}>
                      <Badge.Ribbon
                        text="Audited"
                        color="#58bad7"
                        placement="start"
                      ></Badge.Ribbon>
                    </td>
                  )}
                  {row?.auditedBy ? (
                    <>
                      <td
                        style={{
                          borderTop: "0.2px solid #e1e1e1",
                          borderBottom: "  0.2px solid #e1e1e1",
                          paddingLeft: "60px",
                        }}
                        className={TableStyle.childBorder}
                      >
                        {row?.patientId ? row?.patientId : "---"}
                      </td>
                      <td className={TableStyle.childBorder}>
                        {row?.patientName ? row?.patientName : "---"}
                      </td>

                      <td
                        // onClick={setModal(false)}
                        className={TableStyle.childBorder}
                      >
                        {/* {row?.processedDate} */}
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
                          disbaled={true}
                        >
                          {row?.comment
                            ? SVGICON.comment
                            : SVGICON.emptyComments}
                        </div>
                      </td>
                      <td className={TableStyle.childBorder}>
                        <div className={TableStyle.rowAlignment}>
                          {row?.auditedBy ? row?.auditedBy : "---"}
                        </div>
                      </td>
                      <td className={TableStyle.childBorder}>
                        {row?.rafSum ? row?.rafSum : "000"}
                      </td>
                      <td className={TableStyle.childBorder}>
                        {row?.validDisease ? row?.validDisease : "000"}
                      </td>
                      <td className={TableStyle.childBorder}>
                        {row?.flag ? (
                          getFlag(row?.flag)
                        ) : (
                          <div>{SVGICON?.emptyFlag}</div>
                        )}
                      </td>
                      <td className={TableStyle.childBorder}>
                        {processstatusBodyTemplate(row)}
                      </td>

                      <td
                        className={TableStyle.lastBorder}
                        style={{ textAlign: "center" }}
                      >
                        <input
                          type="checkbox"
                          onChange={() => {
                            handleRowCheckboxChange(row);
                          }}
                          checked={selectedRows?.some(
                            (selectedRow) =>
                              selectedRow.patientId === row.patientId
                          )}
                          className={TableStyle.customChecked}
                        />
                      </td>
                    </>
                  ) : (
                    <>
                      <td className={TableStyle.firstTdBorder}></td>
                      <td
                        style={{
                          borderTop: "0.2px solid #e1e1e1",
                          borderBottom: "  0.2px solid #e1e1e1",
                          paddingLeft: "60px",
                        }}
                        className={TableStyle.childBorder}
                      >
                        {row?.patientId ? row?.patientId : "---"}
                      </td>
                      <td className={TableStyle.childBorder}>
                        {row?.patientName ? row?.patientName : "---"}
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
                          {row?.comment
                            ? SVGICON.comment
                            : SVGICON.emptyComments}
                        </div>
                      </td>
                      <td className={TableStyle.childBorder}>
                        <div className={TableStyle.rowAlignment}>
                          {row?.auditedBy ? row?.auditedBy : "---"}
                        </div>
                      </td>
                      <td className={TableStyle.childBorder}>
                        {row?.rafSum ? row?.rafSum : "000"}{" "}
                      </td>
                      <td className={TableStyle.childBorder}>
                        {row?.validDiseaseCount
                          ? row?.validDiseaseCount
                          : "000"}
                      </td>
                      <td className={TableStyle.childBorder}>
                        {row?.flag ? (
                          getFlag(row?.flag)
                        ) : (
                          <div>{SVGICON?.emptyFlag}</div>
                        )}
                      </td>
                      <td className={TableStyle.childBorder}>
                        {processstatusBodyTemplate(row)}{" "}
                      </td>
                      <td
                        className={TableStyle.lastBorder}
                        style={{ textAlign: "center" }}
                      >
                        <input
                          type="checkbox"
                          onChange={() => {
                            handleRowCheckboxChange(row);
                          }}
                          className={TableStyle.customChecked}
                          checked={selectedRows?.some(
                            (selectedRow) =>
                              selectedRow.patientId === row.patientId
                          )}
                        />
                      </td>
                    </>
                  )}
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

export default CoderReport;
