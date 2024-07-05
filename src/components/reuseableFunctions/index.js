import React from "react";
import { Tooltip, Skeleton } from "antd";

import Image from "next/image";
import visitStyles from "../../../src/styles/visitdata.module.css";
import { SVGICON } from "../../jsx/constant/theme";
import Completed from "../../images/trackingImages/CompletedTrack.png";
import Pending from "../../images/trackingImages/PendingTrack.png";
import Hold from "../../images/trackingImages/HoldTrack.png";
import Declined from "../../images/trackingImages/DeclineTrack.png";
import AuditedTrack from "../../images/trackingImages/AuditedTrack.png";
import NotAudited from "../../images/trackingImages/NotAuditedTrack.png";
import AuditHold from "../../images/trackingImages/AuditHoldTrack.png";
import ReAudit from "../../images/trackingImages/reAuditTrack.png";
import AuditPending from "../../images/trackingImages/AuditPending.png";
import AuditedDeclineTrack from "../../images/trackingImages/AuditDeclined.png";
import Abort from "../../images/trackingImages/Abort.png";

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
          <Image
            src={Completed}
            style={{ height: "20px", width: "20px", marginTop: "4px" }}
          />
        </Tooltip>
      );

    case "PENDING":
      return (
        <Tooltip placement="bottom" title="PENDING">
          <Image
            src={Pending}
            style={{ height: "20px", width: "20px", marginTop: "4px" }}
          />
        </Tooltip>
      );

    case "DECLINED":
      return (
        <Tooltip placement="bottom" title="DECLINED">
          <Image
            src={Declined}
            style={{ height: "20px", width: "20px", marginTop: "4px" }}
          />
        </Tooltip>
      );

    case "NOTCOMPUTED":
      return (
        <Tooltip placement="bottom" title="NOT COMPUTED">
          <Image
            src={Pending}
            style={{ height: "20px", width: "20px", marginTop: "4px" }}
          />
        </Tooltip>
      );
    case "COMPUTED":
      return (
        <Tooltip placement="bottom" title="PENDING">
          <Image
            src={Pending}
            style={{ height: "20px", width: "20px", marginTop: "4px" }}
          />
        </Tooltip>
      );
    case "HOLD":
      return (
        <Tooltip placement="bottom" title="HOLD">
          <Image
            src={Hold}
            style={{ height: "20px", width: "20px", marginTop: "4px" }}
          />
        </Tooltip>
      );
    case "ABORTED_BY_CRON":
      return (
        <Tooltip placement="bottom" title="ABORTED BY CRON">
          <Image
            src={Abort}
            style={{ height: "20px", width: "20px", marginTop: "4px" }}
          />
        </Tooltip>
      );
    case "AUDIT_PENDING":
      return (
        <Tooltip placement="bottom" title="AUDIT PENDING">
          <Image
            src={AuditPending}
            style={{ height: "20px", width: "20px", marginTop: "4px" }}
          />
        </Tooltip>
      );

    case "AUDITHOLD":
      return (
        <Tooltip placement="bottom" title=" AUDIT HOLD">
          <Image
            src={AuditHold}
            style={{ height: "20px", width: "20px", marginTop: "4px" }}
          />
        </Tooltip>
      );
    case "REAUDIT":
      return (
        <Tooltip placement="bottom" title=" REAUDIT">
          <Image
            src={ReAudit}
            style={{ height: "20px", width: "20px", marginTop: "4px" }}
          />
        </Tooltip>
      );
    case "AUDITED":
      return (
        <Tooltip placement="bottom" title=" AUDITED">
          <Image
            src={AuditedTrack}
            style={{ height: "20px", width: "20px", marginTop: "4px" }}
          />
        </Tooltip>
      );
    case "NOT_AUDIT":
      return (
        <Tooltip placement="bottom" title=" NOT AUDIT">
          <Image
            src={NotAudited}
            style={{ height: "20px", width: "20px", marginTop: "4px" }}
          />
        </Tooltip>
      );
    case "AUDIT_DECLINED":
      return (
        <Tooltip placement="bottom" title=" AUDIT DECLINED">
          <Image
            src={AuditedDeclineTrack}
            style={{ height: "20px", width: "20px", marginTop: "4px" }}
          />
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
      <Skeleton.Input style={{ width: 600 }} active />
    </div>

    {Array.from({ length: 6 }).map((_, index) => (
      <div key={index} className="skeleton-row">
        <Skeleton.Input style={{ width: 600 }} active />
      </div>
    ))}
  </div>
);
