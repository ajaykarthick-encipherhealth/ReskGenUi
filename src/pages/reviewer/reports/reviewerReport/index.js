import React, { useState, useEffect } from "react";
import styles from "../report.module.css";
import { Checkbox, Popover, Col, Row, Tooltip, Empty } from "antd";
import { extractLatestData } from "../../../supervisor/auditing";
import AuditedTrack from "../../../../../src/images/trackingImages/AuditedTrack.png";
import NotAudited from "../../../../../src/images/trackingImages/NotAuditedTrack.png";
import AuditHold from "../../../../../src/images/trackingImages/AuditHoldTrack.png";
import ReAudit from "../../../../../src/images/trackingImages/reAuditTrack.png";
import AuditPending from "../../../../../src/images/trackingImages/AuditPending.png";
import Hold from "../../../../../src/images/trackingImages/HoldTrack.png";
import Pending from "../../../../../src/images/trackingImages/PendingTrack.png";
import Completed from "../../../../../src/images/trackingImages/CompletedTrack.png";
import Declined from "../../../../../src/images/trackingImages/DeclineTrack.png";
import AuditedDeclineTrack from "../../../../../src/images/trackingImages/AuditDeclined.png";
import Abort from "../../../../../src/images/trackingImages/Abort.png";
import declineIcon from "../../.../../../../images/trackingImages/DeclineTrack.png";
import reAuditIcon from "../../.../../../../images/trackingImages/AuditPending.png";
import auditHoldIcon from "../../.../../../../images/trackingImages/AuditHoldTrack.png";
import auditedIcon from "../../.../../../../images/trackingImages/AuditedTrack.png";
import reeAuditIcon from "../../.../../../../images/trackingImages/reAuditTrack.png";
import notAudited from "../../.../../../../images/trackingImages/NotAuditedTrack.png";
import auditDeclined from "../../.../../../../images/trackingImages/AuditDeclined.png";
import { Paginator } from "primereact/paginator";
import TableStyle from "../../../../components/table/table.module.css";

import Image from "next/image";
import { SVGICON } from "../../../../jsx/constant/theme";
import {
  renderUserPrfoileAvatar,
  dateFormate,
} from "../../../../components/headerFilters/functions";
import visitStyles from "../../../../styles/visitdata.module.css";
import { selectedRow } from "../../../../store/actions/ReportActions";
import { useDispatch } from "react-redux";
import dayjs from "dayjs";

const ReviewerReport = ({
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
}) => {
  const [activeTab, setActiveTab] = useState("Reviewer");
  const [selectedItems, setSelectedItems] = useState([]);
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
  const data = [
    {
      id: 1,
      patientName: "HERZOG, Joan L",
      patientId: "EH-@46",
      flag: SVGICON?.rafFlagSmall,
      rafScore: "2.232",
      auditedStatus: "AUDIT_PENDING",
      processedStatus: "PENDING",
      date: "03-21-2024",
      hcc: "44",
      auditorName: "Benjamin Mitchell",
      patientAllocatedTo: "Benjamin Mitchell",
      firstName: "Benjamin",
      lastName: "Mitchell",
      profileImageUrl:
        "https://cogentaifiles.blob.core.windows.net/profileimages/c81a62d5-06c6-406a-9bb4-e8940e81aaac.png",
    },
    {
      id: 2,
      patientName: "HERZOG, Joan L",
      patientId: "EH-@46",
      flag: SVGICON?.rafFlagSmall,
      rafScore: "2.232",
      auditedStatus: "AUDITHOLD",
      processedStatus: "COMPLETED",
      date: "03-21-2024",
      hcc: "44",
      auditorName: "Benjamin Mitchell",
      patientAllocatedTo: "Benjamin Mitchell",
      firstName: "Benjamin",
      lastName: "Mitchell",
      profileImageUrl:
        "https://cogentaifiles.blob.core.windows.net/profileimages/c81a62d5-06c6-406a-9bb4-e8940e81aaac.png",
    },
    {
      id: 3,
      patientName: "HERZOG, Joan L",
      patientId: "EH-@46",
      flag: SVGICON?.rafFlagSmall,
      rafScore: "2.232",
      auditedStatus: "REAUDIT",
      processedStatus: "DECLINED",
      date: "03-21-2024",
      hcc: "44",
      auditorName: "Benjamin Mitchell",
      patientAllocatedTo: "Benjamin Mitchell",
      firstName: "Benjamin",
      lastName: "Mitchell",
      profileImageUrl:
        "https://cogentaifiles.blob.core.windows.net/profileimages/c81a62d5-06c6-406a-9bb4-e8940e81aaac.png",
    },
    {
      id: 4,
      patientName: "HERZOG, Joan L",
      patientId: "EH-@46",
      flag: SVGICON?.rafFlagSmall,
      rafScore: "2.232",
      auditedStatus: "NOT_AUDIT",
      processedStatus: "HOLD",
      date: "03-21-2024",
      hcc: "44",
      auditorName: "Benjamin Mitchell",
      patientAllocatedTo: "Benjamin Mitchell",
      firstName: "Benjamin",
      lastName: "Mitchell",
      profileImageUrl:
        "https://cogentaifiles.blob.core.windows.net/profileimages/c81a62d5-06c6-406a-9bb4-e8940e81aaac.png",
    },
    {
      id: 5,
      patientName: "HERZOG, Joan L",
      patientId: "EH-@46",
      flag: SVGICON?.rafFlagSmall,
      rafScore: "2.232",
      auditedStatus: "AUDIT_DECLINED",
      processedStatus: "HOLD",
      date: "03-21-2024",
      hcc: "44",
      auditorName: "Benjamin Mitchell",
      patientAllocatedTo: "Benjamin Mitchell",
      firstName: "Benjamin",
      lastName: "Mitchell",
      profileImageUrl:
        "https://cogentaifiles.blob.core.windows.net/profileimages/c81a62d5-06c6-406a-9bb4-e8940e81aaac.png",
    },
    {
      id: 6,
      patientName: "HERZOG, Joan L",
      patientId: "EH-@46",
      flag: SVGICON?.rafFlagSmall,
      rafScore: "2.232",
      auditedStatus: "NOT_AUDIT",
      processedStatus: "HOLD",
      date: "03-21-2024",
      hcc: "44",
      auditorName: "Benjamin Mitchell",
      patientAllocatedTo: "Benjamin Mitchell",
      firstName: "Benjamin",
      lastName: "Mitchell",
      profileImageUrl:
        "https://cogentaifiles.blob.core.windows.net/profileimages/c81a62d5-06c6-406a-9bb4-e8940e81aaac.png",
    },
    {
      id: 7,
      patientName: "HERZOG, Joan L",
      patientId: "EH-@46",
      flag: SVGICON?.rafFlagSmall,
      rafScore: "2.232",
      auditedStatus: "AUDIT_DECLINED",
      processedStatus: "HOLD",
      date: "03-21-2024",
      hcc: "44",
      auditorName: "Benjamin Mitchell",
      patientAllocatedTo: "Benjamin Mitchell",
      firstName: "Benjamin",
      lastName: "Mitchell",
      profileImageUrl:
        "https://cogentaifiles.blob.core.windows.net/profileimages/c81a62d5-06c6-406a-9bb4-e8940e81aaac.png",
    },
  ];
  const card1Data = [
    {
      id: 1,
      icon: Completed,
      title: "Completed",

      bg: "#CCFFD1",
    },
    {
      id: 2,
      icon: Pending,
      title: "Pending",

      bg: "#CCE9FF",
    },
    {
      id: 3,
      icon: Hold,
      title: "Hold",

      bg: "#DACEFD",
    },
    {
      id: 4,
      icon: declineIcon,
      title: "Decline",

      bg: "#FAD1D1",
    },
    {
      id: 5,
      icon: auditedIcon,
      title: "Audited",
      bg: "#DBEEF0",
    },
    {
      id: 6,
      icon: notAudited,
      title: "Not Audited",

      bg: "#FBE7D0",
    },
    {
      id: 7,
      icon: reeAuditIcon,
      title: "Re Audit",

      bg: "#FFDBB8",
    },
    {
      id: 8,
      icon: reAuditIcon,
      title: "Audit pending",

      bg: "#F3D8E5",
    },
    {
      id: 9,
      icon: auditHoldIcon,
      title: "Audit hold",

      bg: "#FFF2CC",
    },
    {
      id: 10,
      icon: auditDeclined,
      title: "Audit decline",

      bg: "#FDD2CE",
    },
  ];

  const flagData = [
    {
      id: 1,
      flags: "PATIENT_NAME_MISSED",

      count: "10",
    },
    {
      id: 2,
      flags: "PATIENT_DOB_MISSED",
      count: "10",
    },
    {
      id: 3,
      flags: "MRN_ID_MISMATCH",
      count: "10",
    },
    {
      id: 4,
      flags: "PROVIDER_SIGN_MISSED",
      count: "10",
    },
    {
      id: 5,
      flags: "PROVIDER_SIGNATURE_MISSED",
      count: "10",
    },
  ];
  const auditor = [
    {
      id: 1,
      firstName: "Benjamin",
      lastName: "Mitchell",
      profileImageUrl:
        "https://cogentaifiles.blob.core.windows.net/profileimages/c81a62d5-06c6-406a-9bb4-e8940e81aaac.png",
      count: "10",
    },
    {
      id: 2,
      firstName: "Benjamin",
      lastName: "Mitchell",
      profileImageUrl:
        "https://cogentaifiles.blob.core.windows.net/profileimages/c81a62d5-06c6-406a-9bb4-e8940e81aaac.png",
      count: "10",
    },
    {
      id: 3,
      firstName: "Benjamin",
      lastName: "Mitchell",
      profileImageUrl:
        "https://cogentaifiles.blob.core.windows.net/profileimages/c81a62d5-06c6-406a-9bb4-e8940e81aaac.png",
      count: "10",
    },
    {
      id: 4,
      firstName: "Benjamin",
      lastName: "Mitchell",
      profileImageUrl:
        "https://cogentaifiles.blob.core.windows.net/profileimages/c81a62d5-06c6-406a-9bb4-e8940e81aaac.png",
      count: "10",
    },
    {
      id: 5,
      firstName: "Benjamin",
      lastName: "Mitchell",
      profileImageUrl:
        "https://cogentaifiles.blob.core.windows.net/profileimages/c81a62d5-06c6-406a-9bb4-e8940e81aaac.png",
      count: "10",
    },
  ];
  const reviewer = [
    {
      id: 1,
      firstName: "Benjamin",
      lastName: "Mitchell",
      profileImageUrl:
        "https://cogentaifiles.blob.core.windows.net/profileimages/c81a62d5-06c6-406a-9bb4-e8940e81aaac.png",
      count: "10",
    },
    {
      id: 2,
      firstName: "Benjamin",
      lastName: "Mitchell",
      profileImageUrl:
        "https://cogentaifiles.blob.core.windows.net/profileimages/c81a62d5-06c6-406a-9bb4-e8940e81aaac.png",
      count: "10",
    },
    {
      id: 3,
      firstName: "Benjamin",
      lastName: "Mitchell",
      profileImageUrl:
        "https://cogentaifiles.blob.core.windows.net/profileimages/c81a62d5-06c6-406a-9bb4-e8940e81aaac.png",
      count: "10",
    },
    {
      id: 4,
      firstName: "Benjamin",
      lastName: "Mitchell",
      profileImageUrl:
        "https://cogentaifiles.blob.core.windows.net/profileimages/c81a62d5-06c6-406a-9bb4-e8940e81aaac.png",
      count: "10",
    },
    {
      id: 5,
      firstName: "Benjamin",
      lastName: "Mitchell",
      profileImageUrl:
        "https://cogentaifiles.blob.core.windows.net/profileimages/c81a62d5-06c6-406a-9bb4-e8940e81aaac.png",
      count: "10",
    },
  ];
  const getFlags = (data) => {
    if (!data || !data["2023"]) return null;
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
  const getFlag = (data) => {
    switch (data.flag) {
      case "PATIENT_NAME_MISSED":
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div className={visitStyles.name_missed}>
              {SVGICON.emptyFlagSmallLarge}
            </div>
            <div
              style={{ fontSize: "12px", marginLeft: "5px" }}
              className={visitStyles.name_missed}
            >
              Patient name missed
            </div>
          </div>
        );
      case "PATIENT_DOB_MISSED":
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div className={visitStyles.dob_missed}>
              {SVGICON.emptyFlagSmallLarge}
            </div>
            <div
              style={{ fontSize: "12px", marginLeft: "5px" }}
              className={visitStyles.name_missed}
            >
              Patient dob missed
            </div>
          </div>
        );
      case "MRN_ID_MISMATCH":
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div className={visitStyles.id_missed}>
              {SVGICON.emptyFlagSmallLarge}
            </div>
            <div
              style={{ fontSize: "12px", marginLeft: "5px" }}
              className={visitStyles.name_missed}
            >
              MRN id Mismatch
            </div>
          </div>
        );
      case "PROVIDER_SIGN_MISSED":
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div className={visitStyles.sign_missed}>
              {SVGICON.emptyFlagSmallLarge}
            </div>
            <div
              style={{ fontSize: "12px", marginLeft: "5px" }}
              className={visitStyles.name_missed}
            >
              Provider Sign Missed
            </div>
          </div>
        );
      case "PROVIDER_SIGNATURE_MISSED":
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {" "}
            <div className={visitStyles.signature_missed}>
              {SVGICON.emptyFlagSmallLarge}
            </div>
            <div
              style={{ fontSize: "12px", marginLeft: "5px" }}
              className={visitStyles.name_missed}
            >
              Provider Signature Missed
            </div>
          </div>
        );
      case "PROVIDER_CREDENTIAL_MISSED":
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {" "}
            <div className={visitStyles.cred_missed}>
              {SVGICON.emptyFlagSmallLarge}
            </div>
            <div
              style={{ fontSize: "12px", marginLeft: "5px" }}
              className={visitStyles.name_missed}
            >
              Provider Credential Missed
            </div>
          </div>
        );

      case "PROVIDER_SIGN_STATUS_PENDING":
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {" "}
            <div className={visitStyles.sign_status}>
              {SVGICON.emptyFlagSmallLarge}
            </div>
            <div
              style={{ fontSize: "12px", marginLeft: "5px" }}
              className={visitStyles.name_missed}
            >
              Provider Sign Status Pending
            </div>
          </div>
        );

      case "NO_HCC_FOUND":
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {" "}
            <div className={visitStyles.no_hcc_found}>
              {SVGICON.emptyFlagSmallLarge}
            </div>
            <div
              style={{ fontSize: "12px", marginLeft: "5px" }}
              className={visitStyles.name_missed}
            >
              No HCC Found
            </div>
          </div>
        );

      case "NO_VALID_DOCUMENT_FOUND":
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {" "}
            <div className={visitStyles.no_doc_found}>
              {SVGICON.emptyFlagSmallLarge}
            </div>
            <div
              style={{ fontSize: "12px", marginLeft: "5px" }}
              className={visitStyles.name_missed}
            >
              No Valid Document Found
            </div>
          </div>
        );

      case "PATIENT_DISEASED":
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {" "}
            <div className={visitStyles.patient_diseased}>
              {SVGICON.emptyFlagSmallLarge}
            </div>
            <div
              style={{ fontSize: "12px", marginLeft: "5px" }}
              className={visitStyles.name_missed}
            >
              Patient Diseased
            </div>
          </div>
        );

      case "PATIENT_INACTIVE":
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {" "}
            <div className={visitStyles.patient_inactive}>
              {SVGICON.emptyFlagSmallLarge}
            </div>
            <div
              style={{ fontSize: "12px", marginLeft: "5px" }}
              className={visitStyles.name_missed}
            >
              Patient Inactive
            </div>
          </div>
        );
      case "":
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {" "}
            <div className={visitStyles.patient_inactive}>
              {SVGICON.emptyFlag}
            </div>
            <div
              style={{ fontSize: "12px", marginLeft: "5px" }}
              className={visitStyles.name_missed}
            >
              None
            </div>
          </div>
        );
    }
  };
  const auditstatusBodyTemplate = (rowData) => {
    const declinedDataFromAudit = extractLatestData(
      rowData?.auditDeclinedNotes
    );

    const declinedDataFromDeclined = extractLatestData(
      rowData?.auditDeclinedNotes
    );

    const declinedData = declinedDataFromAudit || declinedDataFromDeclined;
    switch (rowData.auditedStatus) {
      case "AUDIT_PENDING":
        return (
          <Popover placement="bottom" title="Status: AUDIT PENDING">
            <span className="patient-status">
              <Image
                src={AuditPending}
                style={{ height: "24px", width: "24px" }}
              />
            </span>
          </Popover>
        );

      case "AUDITHOLD":
        return (
          <Popover placement="bottom" title=" Status: AUDIT HOLD">
            <span className="patient-status">
              <Image
                src={AuditHold}
                // className={styles.ImgTrck}
                style={{ height: "24px", width: "24px" }}
              />
            </span>
          </Popover>
        );
      case "REAUDIT":
        return (
          <Popover placement="bottom" title=" Status: REAUDIT">
            <span className="patient-status">
              <Image src={ReAudit} style={{ height: "24px", width: "24px" }} />
            </span>
          </Popover>
        );
      case "AUDITED":
        return (
          <Popover placement="bottom" title=" Status: AUDITED">
            <span className="patient-status">
              <Image
                src={AuditedTrack}
                style={{ height: "24px", width: "24px" }}
              />
            </span>
          </Popover>
        );
      case "AUDITED":
        return (
          <span className="patient-status">
            <Image
              src={AuditedTrack}
              style={{ height: "24px", width: "24px" }}
            />
          </span>
        );

      case "NOT_AUDIT":
        return (
          <Popover placement="bottom" title=" Status: NOT AUDIT">
            <span className="patient-status">
              <Image
                src={NotAudited}
                style={{ height: "24px", width: "24px" }}
              />
            </span>
          </Popover>
        );
      case "AUDIT_DECLINED":
        return (
          <Popover
            placement="bottom"
            title=" Status: AUDIT DECLINED"
            content={`Reason: ${declinedData ? declinedData : "---"}`}
          >
            <span className="patient-status">
              <Image
                src={AuditedDeclineTrack}
                style={{ height: "24px", width: "24px" }}
              />
            </span>
          </Popover>
        );
      case null:
        return <span className="patient-status">---</span>;
    }
  };
  const processstatusBodyTemplate = (rowData) => {
    const declinedDataFromAudit = extractLatestData(
      rowData?.auditDeclinedNotes
    );

    const declinedDataFromDeclined = extractLatestData(rowData?.declinedNotes);

    const declinedData = declinedDataFromAudit || declinedDataFromDeclined;
    if (!rowData?.processedStatus) {
      return null;
    }
    switch (rowData?.processedStatus) {
      case "COMPLETED":
        return (
          <Popover placement="bottom" title="Status: COMPLETED">
            <span className="patient-status" style={{ textAlign: "center" }}>
              <Image
                src={Completed}
                style={{ height: "24px", width: "24px" }}
              />
            </span>
          </Popover>
        );

      case "PENDING":
        return (
          <Popover placement="bottom" title="Status: PENDING">
            <span className="patient-status" style={{ textAlign: "center" }}>
              <Image src={Pending} style={{ height: "24px", width: "24px" }} />
            </span>
          </Popover>
        );

      case "DECLINED":
        return (
          <Popover
            placement="bottom"
            title="Status: DECLINED"
            content={`Reason: ${declinedData ? declinedData : "---"}`}
          >
            <span className="patient-status" style={{ textAlign: "center" }}>
              <Image src={Declined} style={{ height: "24px", width: "24px" }} />
            </span>
          </Popover>
        );

      case "NOTCOMPUTED":
        return (
          <Popover placement="bottom" title="Status: NOT COMPUTED">
            <span className="patient-status" style={{ textAlign: "center" }}>
              <Image src={Pending} style={{ height: "24px", width: "24px" }} />
            </span>
          </Popover>
        );
      case "COMPUTED":
        return (
          <Popover placement="bottom" title="Status: PENDING">
            <span className="patient-status" style={{ textAlign: "center" }}>
              <Image src={Pending} style={{ height: "24px", width: "24px" }} />
            </span>
          </Popover>
        );
      case "HOLD":
        return (
          <Popover placement="bottom" title="Status: HOLD">
            <span className="patient-status" style={{ textAlign: "center" }}>
              <Image src={Hold} style={{ height: "24px", width: "24px" }} />
            </span>
          </Popover>
        );
      case "ABORTED_BY_CRON":
        return (
          <Popover placement="bottom" title="Status: ABORTED BY CRON">
            <span className="patient-status" style={{ textAlign: "center" }}>
              <Image src={Abort} style={{ height: "24px", width: "24px" }} />
            </span>
          </Popover>
        );
      case null:
        return (
          <Popover placement="bottom" title="Status: PENDING">
            <span className="patient-status" style={{ textAlign: "center" }}>
              <Image src={Pending} style={{ height: "24px", width: "24px" }} />
            </span>
          </Popover>
        );
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleCheckboxChange = (id) => {
    const index = selectedItems.indexOf(id);
    if (index === -1) {
      setSelectedItems([...selectedItems, id]);
    } else {
      const updatedSelectedItems = [...selectedItems];
      updatedSelectedItems.splice(index, 1);
      setSelectedItems(updatedSelectedItems);
    }
  };
  useEffect(() => {
    dispatch(selectedRow(selectedRows));
  }, [selectedRows]);
  console.log(reportListAll?.data, "reportList");
  return (
    <>
      <div>
        <div className="content-body">
          <div className="container-fluid">
            <div className="row">
              <div>
                <div className=" col-xl-12 d-flex">
                  {reportListAll?.data?.length === 0 ? (
                    <div
                      className={`col-xl-6 ${styles.card}`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Empty />
                    </div>
                  ) : (
                    <div className="col-xl-6">
                      <div className={styles.cardContainer}>
                        {reportListAll?.data?.map((item, id) => (
                          <div key={id} className={styles.card}>
                            {console.log(item, "item")}
                            <div className={styles.contentGroup}>
                              <div className={styles.inputContainer}>
                                <input
                                  type="checkbox"
                                  onChange={() => {
                                    handleRowCheckboxChange(item);
                                  }}
                                  className={TableStyle.customChecked}
                                  checked={selectedRows?.some(
                                    (selectedRow) =>
                                      selectedRow.patientId === item.patientId
                                  )}
                                />
                              </div>
                              <div
                                className="col-xl-12"
                                style={{ marginLeft: "10px" }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    paddingBottom: "5px",
                                  }}
                                >
                                  <div className={`col-xl-6 ${styles.pName}`}>
                                    {item.patientName
                                      ? item.patientName
                                      : "---"}
                                  </div>
                                  <div
                                    className={`col-xl-6 ${styles.dataContainer}`}
                                  >
                                    <span className={styles.raf}>
                                      {item.rafSum ? item.rafSum : "---"}
                                    </span>
                                    <span style={{ marginRight: "10px" }}>
                                      {item?.flag ? (
                                        getFlags(item.flag)
                                      ) : (
                                        <div>{SVGICON?.emptyFlag}</div>
                                      )}
                                    </span>
                                    <span style={{ marginRight: "10px" }}>
                                      {auditstatusBodyTemplate(item)}
                                    </span>
                                    <span>
                                      {processstatusBodyTemplate(item)}
                                    </span>
                                  </div>
                                </div>

                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-around",
                                    alignItems: "center",
                                    paddingBottom: "5px",
                                  }}
                                >
                                  <div
                                    className={`col-xl-2 ${styles.headText}`}
                                  >
                                    {item.patientId ? item.patientId : ""}
                                  </div>
                                  <div
                                    className={`col-xl-2 ${styles.headText}`}
                                  >
                                    HCC
                                  </div>
                                  <div
                                    className={`col-xl-4 ${styles.headText}`}
                                  >
                                    AUDITOR NAME
                                  </div>
                                  <div
                                    className={`col-xl-4 ${styles.headText}`}
                                  >
                                    PATIENT ALLOCATE TO
                                  </div>
                                </div>
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-around",
                                    alignItems: "center",
                                  }}
                                >
                                  <div className={`col-xl-2 ${styles.text}`}>
                                    {dateFormate(dayjs, item?.processedDate)}
                                  </div>
                                  <div className={`col-xl-2 ${styles.text}`}>
                                    {item.validDiseaseCount
                                      ? item.validDiseaseCount
                                      : "---"}
                                  </div>
                                  <div className={`col-xl-4 ${styles.text}`}>
                                    {item.auditedByFirstName ||
                                    item.auditedByLastName ||
                                    item.auditedByProfileImage ? (
                                      <div
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                        }}
                                      >
                                        <span style={{ marginRight: "10px" }}>
                                          {renderUserPrfoileAvatar(
                                            item.auditedByFirstName,
                                            item.auditedByLastName,
                                            item.auditedByProfileImage,
                                            "header"
                                          )}
                                        </span>
                                        <span>
                                          {item.auditedByFirstName}{" "}
                                          {item.auditedByLastName}
                                        </span>
                                      </div>
                                    ) : (
                                      <div>---</div>
                                    )}
                                  </div>
                                  <div className={`col-xl-4 ${styles.text}`}>
                                    {item.patientAllocatedFirstName ||
                                    item.patientAllocatedLastName ||
                                    item.patientAllocatedProfileImage ? (
                                      <div
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                        }}
                                      >
                                        <span style={{ marginRight: "10px" }}>
                                          {renderUserPrfoileAvatar(
                                            item.patientAllocatedFirstName,
                                            item.patientAllocatedLastName,
                                            item.patientAllocatedProfileImage,
                                            "header"
                                          )}
                                        </span>
                                        <span>
                                          {item.patientAllocatedFirstName}{" "}
                                          {item.patientAllocatedLastName}
                                        </span>
                                      </div>
                                    ) : (
                                      <div>---</div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="col-xl-6" style={{ marginLeft: "10px" }}>
                    <div className={styles.cardContainer}>
                      <div className={styles.card1}>
                        <div className={styles.summaryText}>Summary</div>
                        <div className="col-xl-12  d-flex mt-4">
                          <div className={`col-xl-2 ${styles.subCard}`}>
                            <div>
                              <div>No of charts</div>
                              <h4>60</h4>
                            </div>
                          </div>
                          <div className={`col-xl-2 ${styles.subCard}`}>
                            <div>Completed date</div>
                            <div className={styles.dateContainer}>
                              <div className={styles.bullet}></div>
                              <div style={{ fontSize: "10px" }}>03/04/2024</div>
                            </div>

                            <div className={styles.dateContainer}>
                              <div className={styles.bullet}></div>
                              <div style={{ fontSize: "10px" }}>03/04/2024</div>
                            </div>
                          </div>

                          <div className={`col-xl-2 ${styles.subCard}`}>
                            {" "}
                            <div>
                              <div>Avg RAF score</div>
                              <h4>1.025</h4>
                            </div>
                          </div>
                          <div className={`col-xl-2 ${styles.subCard}`}>
                            {" "}
                            <div>
                              <div>HCC Count</div>
                              <h4>175</h4>
                            </div>
                          </div>
                        </div>
                        <div className={` pt-2 ${styles.summaryText}`}>
                          Status
                        </div>
                        <div className="col-xl-12  d-flex mt-2">
                          <Row
                            className={styles.carddiv}
                            style={{ height: "80%" }}
                          >
                            {card1Data?.map((data) => (
                              <Col
                                span={5}
                                style={{
                                  backgroundColor: data.bg,
                                  borderRadius: "10px",
                                  height: "100px",
                                  width: "191px",
                                  padding: "10px",
                                  marginRight: "25px",
                                  marginBottom: "10px",
                                }}
                                className={styles.colData}
                              >
                                <div className={styles.header}>
                                  <Image
                                    src={data?.icon}
                                    className={styles.Img}
                                    style={{ height: "25px", width: "25px" }}
                                  />
                                  <div className={styles.heading}>
                                    {data.title}
                                  </div>
                                </div>

                                <h4>40</h4>
                              </Col>
                            ))}
                          </Row>
                        </div>
                        <div className="col-xl-12  d-flex mt-4">
                          <div className={`col-xl-4 ${styles.flags}`}>
                            <div className={styles.cardHead}>Flags</div>
                            {flagData.map((flagItem) => (
                              <div
                                className={styles.contentGroups}
                                key={flagItem.id}
                              >
                                <div className={styles.count}>
                                  {flagItem.count}
                                </div>
                                <div>{getFlag(flagItem.flags)}</div>
                              </div>
                            ))}
                          </div>
                          <div className={`col-xl-4 ${styles.flags}`}>
                            <div className={styles.cardHead}>
                              Auditor
                              {auditor.map((item) => (
                                <div
                                  className={styles.contentAuditor}
                                  key={item.id}
                                >
                                  <div className={`col-xl-4 ${styles.avatar}`}>
                                    <span style={{ marginRight: "10px" }}>
                                      {renderUserPrfoileAvatar(
                                        item.firstName,
                                        item.lastName,
                                        item.profileImageUrl,
                                        "header"
                                      )}
                                    </span>
                                    <span>
                                      {item.firstName} {item.lastName}
                                    </span>
                                  </div>

                                  <div className={styles.count}>
                                    {item.count}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className={`col-xl-4 ${styles.flags}`}>
                            <div className={styles.cardHead}>
                              Reviewer
                              {reviewer.map((item) => (
                                <div
                                  className={styles.contentAuditor}
                                  key={item.id}
                                >
                                  <div className={`col-xl-4 ${styles.avatar}`}>
                                    <span style={{ marginRight: "10px" }}>
                                      {renderUserPrfoileAvatar(
                                        item.firstName,
                                        item.lastName,
                                        item.profileImageUrl,
                                        "header"
                                      )}
                                    </span>
                                    <span>
                                      {item.firstName} {item.lastName}
                                    </span>
                                  </div>

                                  <div className={styles.count}>
                                    {item.count}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="pagination-container">
        <Paginator
          first={paginationFirst}
          rows={8}
          totalRecords={ReportPatientDetails?.totalElements}
          onPageChange={onPageChange}
        />
        <div className="total-pages">
          Total count: {ReportPatientDetails?.totalElements}
        </div>
      </div>
    </>
  );
};

export default ReviewerReport;
