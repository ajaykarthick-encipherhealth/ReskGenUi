import React from "react";
import { Tooltip, Skeleton } from "antd";

import Image from "next/image";
import visitStyles from "../../../src/styles/visitdata.module.css";
import { IMAGES, SVGICON } from "../../jsx/constant/theme";
import Completed from "../../images/trackingImages/completed.webp";
import Pending from "../../images/trackingImages/pending.webp";
import Hold from "../../images/trackingImages/hold.webp";
import Declined from "../../images/trackingImages/declined.webp";
import AuditedTrack from "../../images/trackingImages/audited.webp";
import NotAudited from "../../images/trackingImages/notaudited.webp";
import AuditHold from "../../images/trackingImages/audithold.webp";
import ReAudit from "../../images/trackingImages/reaudited.webp";
import AuditPending from "../../images/trackingImages/auditpending.webp";
import AuditedDeclineTrack from "../../images/trackingImages/auditdeclined.webp";
import Abort from "../../images/trackingImages/abort.webp";
import {
  FilterOutlined,
  MonitorOutlined,
  UndoOutlined,
} from "@ant-design/icons";
export const getFlag = (data) => {
  switch (data.flags) {
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
export const getFlags = (data) => {
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
          <i className={visitStyles.id_missed}>{SVGICON.emptyFlagSmallLarge}</i>
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
export const getStatusIcon = (status) => {
  switch (status) {
    case "COMPLETED":
      return (
        <Tooltip placement="bottom" title="COMPLETED">
          <div>
            <Image
              alt="completed"
              src={Completed}
              style={{ height: "20px", width: "20px", marginTop: "1px" }}
            />
          </div>
        </Tooltip>
      );

    case "QUERIED":
      return (
        <Tooltip placement="bottom" title="COMPLETED">
          <div>
            <Image src={IMAGES.queried} />
          </div>
        </Tooltip>
      );
    case "PENDING":
      return (
        <Tooltip placement="bottom" title="PENDING">
          <div>
            <Image
              alt="pending"
              src={Pending}
              style={{ height: "20px", width: "20px", marginTop: "1px" }}
            />
          </div>
        </Tooltip>
      );

    case "DECLINED":
      return (
        <Tooltip placement="bottom" title="DECLINED">
          <div>
            <Image
              alt="declined"
              src={Declined}
              style={{ height: "20px", width: "20px", marginTop: "1px" }}
            />
          </div>
        </Tooltip>
      );

    case "NOTCOMPUTED":
      return (
        <Tooltip placement="bottom" title="NOT COMPUTED">
          <div>
            <Image
              alt="notComputed"
              src={Pending}
              style={{ height: "20px", width: "20px", marginTop: "1px" }}
            />
          </div>
        </Tooltip>
      );
    case "COMPUTED":
      return (
        <Tooltip placement="bottom" title="PENDING">
          <div>
            <Image
              alt="computed"
              src={Pending}
              style={{ height: "20px", width: "20px", marginTop: "1px" }}
            />
          </div>
        </Tooltip>
      );
    case "HOLD":
      return (
        <Tooltip placement="bottom" title="HOLD">
          <div>
            <Image
              alt="hold"
              src={Hold}
              style={{ height: "20px", width: "20px", marginTop: "1px" }}
            />
          </div>
        </Tooltip>
      );
    case "ABORTED_BY_CRON":
      return (
        <Tooltip placement="bottom" title="ABORTED BY CRON">
          <div>
            <Image
              alt="abort"
              src={Abort}
              style={{ height: "20px", width: "20px", marginTop: "1px" }}
            />
          </div>
        </Tooltip>
      );
    case "AUDIT_PENDING":
      return (
        <Tooltip placement="bottom" title="AUDIT PENDING">
          <div>
            <Image
              alt="auditPending"
              src={AuditPending}
              style={{ height: "20px", width: "20px", marginTop: "1px" }}
            />
          </div>
        </Tooltip>
      );

    case "AUDITHOLD":
      return (
        <Tooltip placement="bottom" title=" AUDIT HOLD">
          <div>
            <Image
              alt="auditHold"
              src={AuditHold}
              style={{ height: "20px", width: "20px", marginTop: "1px" }}
            />
          </div>
        </Tooltip>
      );
    case "REAUDIT":
      return (
        <Tooltip placement="bottom" title=" REAUDIT">
          <div>
            <Image
              alt="reAudit"
              src={ReAudit}
              style={{ height: "20px", width: "20px", marginTop: "1px" }}
            />
          </div>
        </Tooltip>
      );
    case "AUDITED":
      return (
        <Tooltip placement="bottom" title=" AUDITED">
          <div>
            <Image
              alt="audited"
              src={AuditedTrack}
              style={{ height: "20px", width: "20px", marginTop: "1px" }}
            />
          </div>
        </Tooltip>
      );
    case "NOT_AUDIT":
      return (
        <Tooltip placement="bottom" title=" NOT AUDIT">
          <div>
            <Image
              alt="notAudit"
              src={NotAudited}
              style={{ height: "20px", width: "20px", marginTop: "1px" }}
            />
          </div>
        </Tooltip>
      );
    case "AUDIT_DECLINED":
      return (
        <Tooltip placement="bottom" title=" AUDIT DECLINED">
          <div>
            <Image
              alt="auditDeclined"
              src={AuditedDeclineTrack}
              style={{ height: "20px", width: "20px", marginTop: "1px" }}
            />
          </div>
        </Tooltip>
      );
    case null:
      return <div className="patient-status"></div>;
  }
};
export const selectTab = (num,setFlagTagActive,setActiveTabHead,setActiveComboTree,setPopoverVisible,setActiveMeatTitle) => {
  setFlagTagActive(false);
  setActiveTabHead(num);
  if (num == 2) {
    setFlagTagActive(true);
  }
  if (num == 4) {
    setActiveMeatTitle && setActiveMeatTitle(null);
  }
  if (num == 3) {
    setActiveComboTree(null);
  }
  setPopoverVisible(false);
};

export const renderSkeleton = () => (
  <div className="skeleton-table">
    <div className="skeleton-header">
      <Skeleton.Input style={{ width: 2000 }} active />
    </div>

    {Array.from({ length: 6 }).map((_, index) => (
      <div key={index} className="skeleton-row">
        <Skeleton.Input style={{ width: 2000 }} active />
      </div>
    ))}
  </div>
);
export const renderSkeletonHold = () => (
  <div className="skeleton-table">
    <div className="skeleton-header">
      <Skeleton.Input style={{ width: 510 }} active />
    </div>

    {Array.from({ length: 6 }).map((_, index) => (
      <div key={index} className="skeleton-row">
        <Skeleton.Input style={{ width: 510 }} active />
      </div>
    ))}
  </div>
);
