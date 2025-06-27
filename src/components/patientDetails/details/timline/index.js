import React, { useEffect, useState } from "react";
import visitStyles from "../../../../styles/visitdata.module.css";
import { Checkbox, Empty, Input, Popover, Select, Tooltip } from "antd";
import styles from "./styles.module.css";
import { CloseCircleFilled } from "@ant-design/icons";
import { getProviderNameTagList } from "../components/function/ProviderHyperlinks";
import { getDateOfServiceBackground } from "../components/function/DateOfServices";
import {
  getSectionHeaderBackground,
  getSectionHeadersBackground,
} from "../components/function/SectionHeader";
import CardSkeleton from "../../../skeleton/card";
import {
  formatDateTime,
  timeLineDateAndTime,
} from "../../../../utils/reusable";
import { connect } from "react-redux";
import { actions as userActions } from "../../../../stores/tenantAdmin/users";
import { actions as detailsActions } from "../../../../stores/patient/details";

export const getStatusColors = (state) => {
  let previousStateColor = "";
  switch (state) {
    case "COMPLETED":
      previousStateColor = "#00BC13";
      break;
    case "PENDING":
      previousStateColor = "#0078D4";
      break;
    case "HOLD":
      previousStateColor = "#3C0AD2";
      break;
    case "DECLINED":
      previousStateColor = "#EB5252";
      break;
    case "AUDITED":
      previousStateColor = "#4AA1AB";
      break;
    case "REAUDIT":
      previousStateColor = "#964B00";
      break;
    case "AUDITHOLD":
      previousStateColor = "#EBAE00";
      break;
    case "AUDIT_PENDING":
      previousStateColor = "#BD3A79";
      break;
    case "AUDIT_DECLINED":
      previousStateColor = "#C21807";
      break;
    default:
      previousStateColor = "";
  }
  return previousStateColor;
};

export const getBadgeClassName = (item, index) => {
  switch (item.action) {
    case "MOVED":
      if (item?.fromState == "VALID" && item?.toState == "DELETED") {
        return "timeline-badge MOVED_VALID_TO_DELETED";
      }
      if (item?.fromState == "VALID" && item?.toState == "SUGGESTED") {
        return "timeline-badge MOVED_VALID_TO_SUGGESTED";
      }
      if (item?.fromState == "SUGGESTED" && item?.toState == "VALID") {
        return "timeline-badge MOVED_SUGGESTED_TO_VALID";
      }
      if (item?.fromState == "SUGGESTED" && item?.toState == "DELETED") {
        return "timeline-badge MOVED_SUGGESTED_TO_DELETED";
      }
      if (item?.fromState == "DELETED" && item?.toState == "VALID") {
        return "timeline-badge MOVED_DELETED_TO_VALID";
      }
      if (item?.fromState == "DELETED" && item?.toState == "SUGGESTED") {
        return "timeline-badge MOVED_VALID_TO_DELETED";
      }
    case "MOVED_INVALID_TO_VALID":
      return "timeline-badge MOVED_INVALID_TO_VALID";
    case "MOVED_SUGGESTED_TO_VALID":
      return "timeline-badge MOVED_SUGGESTED_TO_VALID";
    case "MOVED_VALID_TO_SUGGESTED":
      return "timeline-badge MOVED_VALID_TO_SUGGESTED";
    case "VALID_DISEASE_ADDED":
      return "timeline-badge VALID_DISEASE_ADDED";
    case "MOVED_VALID_TO_DELETED":
      return "timeline-badge MOVED_VALID_TO_DELETED";
    case "COMPLETED":
      return "timeline-badge COMPLETED";
    case "MOVED_DELETED_TO_VALID":
      return "timeline-badge MOVED_DELETED_TO_VALID";
    case "MOVED_DELETED_TO_SUGGESTED":
      return "timeline-badge MOVED_DELETED_TO_SUGGESTED";
    case "MOVED_SUGGESTED_TO_DELETED":
      return "timeline-badge MOVED_SUGGESTED_TO_DELETED";
    case "ENCOUNTER_FILE_UPDATED":
      return "timeline-badge ENCOUNTER_FILE_UPDATED";
    case "ENCOUNTER_FILE_ADDED":
      return "timeline-badge ENCOUNTER_FILE_ADDED";
    case "HOLD":
      return "timeline-badge HOLD";
    case "DECLINED":
      return "timeline-badge DECLINED";
    case "PENDING":
      return "timeline-badge DECLINED";
    default:
      return "timeline-badge DECLINED";
  }
};

export const underScoreRemove = (value) => {
  if (value) {
    let str = value;
    let newStr = str.replace(/_/g, " ");
    return newStr;
  }
};

const Timeline = ({
  timelineData,
  filterDataLoading,
  splitUserName,
  userDetails,
  renderUserDetails,
  showFilter,
  allRoles,
  role,
  setRole,
  localPatientId,
  isDosSelected,
  getTimelineList,
  setFilterDataLoading,
  setTimeLineData,
  getAllRoles,
  getActionList,
  actionList,
  action,
  setAction,
  isViewAll,
  setIsViewAll,
}) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popClickDisCode, setPopClickDisCode] = useState(null);

  const options = allRoles?.content?.map((org, index) => ({
    value: org?.aliasName,
    label: org?.roleName?.split("_")?.join(" "),
  }));
  const actionOptions = actionList?.map((item) => ({
    label: item?.replace(/_/g, " "),
    value: item,
  }));
  const getTimeLineDetails = async () => {
    setFilterDataLoading(true);
    const response = await getTimelineList({
      patientId: localPatientId,
      dos: isViewAll ? "" : isDosSelected,
      role: role,
      action: action,
    });
    var result = response?.response?.content;
    setTimeLineData(result);
    if (response?.status === "SUCCESS") {
      setFilterDataLoading(false);
    } else {
      setFilterDataLoading(false);
    }
  };
  const handleRoleChange = (value) => {
    setRole(value);
  };
  const handleActionChange = (value) => {
    setAction(value);
  };

  const getMeatEditDeatils = (viewValue) => {
    let sectionMapArr = (
      <>
        <div className="d-flex justify-content-end">
          <CloseCircleFilled
            className={styles.deleteIcon}
            onClick={() => {
              setIsPopupOpen(false);
              setPopClickDisCode(null);
            }}
          />
        </div>
        <div className={styles.detailsContainer}>
          <div className={styles.oldCodeContiner}>
            <span className={styles.codeTitle}>OLD</span>
            <div className={styles.details}>
              <div className={styles.detailsHeader}>
                <span className={styles.disCode}>
                  {" "}
                  {viewValue?.previousMeatDetail?.diagnosisCode}
                </span>
                <span className={styles.discription}>
                  {viewValue?.previousMeatDetail?.diseaseName}
                </span>
              </div>
              <div className={styles.detailsHeader}>
                <span className={styles.disCode}>Provider</span>
                <div>
                  {getProviderNameTagList({
                    data: viewValue?.previousMeatDetail?.providerNames,
                  })}
                </div>
              </div>
              <div className={styles.detailsHeader}>
                <span className={styles.disCode}>Encounter Date</span>
                <div>
                  {getDateOfServiceBackground({
                    value: viewValue?.previousMeatDetail?.dateOfService,
                  })}
                </div>
              </div>
              <div className={styles.detailsHeader}>
                <span className={styles.disCode}>Monitor</span>
                <span className={styles.discription}>
                  {viewValue?.previousMeatDetail?.monitorAspect}
                </span>
                <div>
                  {getSectionHeadersBackground({
                    value: viewValue?.previousMeatDetail?.monitorHyperLink,
                  })}
                </div>
              </div>
              <div className={styles.detailsHeader}>
                <span className={styles.disCode}>Evaluate</span>
                <span className={styles.discription}>
                  {viewValue?.previousMeatDetail?.evaluateAspect}
                </span>
                <div>
                  {getSectionHeadersBackground({
                    value: viewValue?.previousMeatDetail?.evaluateHyperLink,
                  })}
                </div>
              </div>
              <div className={styles.detailsHeader}>
                <span className={styles.disCode}>Assessment</span>
                <span className={styles.discription}>
                  {viewValue?.previousMeatDetail?.assessmentAspect}
                </span>
                <div>
                  {getSectionHeadersBackground({
                    value: viewValue?.previousMeatDetail?.assessmentHyperLink,
                  })}
                </div>
              </div>
              <div className={styles.detailsHeader}>
                <span className={styles.disCode}>Treatment</span>
                <span className={styles.discription}>
                  {viewValue?.previousMeatDetail?.treatmentAspect}
                </span>
                <div>
                  {getSectionHeadersBackground({
                    value: viewValue?.previousMeatDetail?.treatmentHyperLink,
                  })}
                </div>
              </div>
            </div>
          </div>
          <div className={styles.editCodeContainer}>
            <span className={styles.editTitle}>NEW</span>
            <div className={styles.details}>
              <div className={styles.detailsHeader}>
                <span className={styles.disCode}>
                  {" "}
                  {viewValue?.changedMeatDetail?.diagnosisCode}
                </span>
                <span className={styles.discription}>
                  {viewValue?.changedMeatDetail?.diseaseName}
                </span>
              </div>
              <div className={styles.detailsHeader}>
                <span className={styles.disCode}>Provider</span>
                <div>
                  {getProviderNameTagList({
                    data: viewValue?.changedMeatDetail?.providerNames,
                  })}
                </div>
              </div>
              <div className={styles.detailsHeader}>
                <span className={styles.disCode}>Encounter Date</span>
                <div>
                  {getDateOfServiceBackground({
                    value: viewValue?.changedMeatDetail?.dateOfService,
                  })}
                </div>
              </div>
              <div className={styles.detailsHeader}>
                <span className={styles.disCode}>Monitor</span>
                <span className={styles.discription}>
                  {viewValue?.changedMeatDetail?.monitorAspect}
                </span>
                <div>
                  {getSectionHeadersBackground({
                    value: viewValue?.changedMeatDetail?.monitorHyperLink,
                  })}
                </div>
              </div>
              <div className={styles.detailsHeader}>
                <span className={styles.disCode}>Evaluate</span>
                <span className={styles.discription}>
                  {viewValue?.changedMeatDetail?.evaluateAspect}
                </span>
                <div>
                  {getSectionHeadersBackground({
                    value: viewValue?.changedMeatDetail?.evaluateHyperLink,
                  })}
                </div>
              </div>
              <div className={styles.detailsHeader}>
                <span className={styles.disCode}>Assessment</span>
                <span className={styles.discription}>
                  {viewValue?.changedMeatDetail?.assessmentAspect}
                </span>
                <div>
                  {getSectionHeadersBackground({
                    value: viewValue?.changedMeatDetail?.assessmentHyperLink,
                  })}
                </div>
              </div>
              <div className={styles.detailsHeader}>
                <span className={styles.disCode}>Treatment</span>
                <span className={styles.discription}>
                  {viewValue?.changedMeatDetail?.treatmentAspect}
                </span>
                <div>
                  {getSectionHeadersBackground({
                    value: viewValue?.changedMeatDetail?.treatmentHyperLink,
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );

    return sectionMapArr;
  };
  const getTimelineHeading = (item, index) => {
    switch (item.action) {
      case "MOVED_INVALID_TO_VALID":
        return (
          <div className="d-flex">
            {item.diagnosisCode} - Moved from{" "}
            <span className={visitStyles.invalidColor}>INVALID</span> to{" "}
            <span className={visitStyles.validColor}> VALID</span>
          </div>
        );
      case "MOVED_SUGGESTED_TO_VALID":
        return (
          <div className="d-flex">
            {item.diagnosisCode} - Moved from{" "}
            <span className={visitStyles.suggestedColor}>
              {/* SUGGESTED */}
              CAREGAP
            </span>{" "}
            to <span className={visitStyles.validColor}> VALID</span>
          </div>
        );
      case "MOVED":
        if (item?.fromState == "VALID" && item?.toState == "SUGGESTED") {
          return (
            <div className="d-flex">
              {item.diagnosisCode} - Moved from{" "}
              <span className={visitStyles.validColor}>HCC</span> to{" "}
              <span className={visitStyles.suggestedColor}>
                {/* SUGGESTED */}
                CAREGAP
              </span>
            </div>
          );
        }
        if (item?.fromState == "VALID" && item?.toState == "DELETED") {
          return (
            <div className="d-flex">
              {item.diagnosisCode} - Moved from{" "}
              <span className={visitStyles.validColor}>HCC</span> to{" "}
              <span className={visitStyles.deletedColor}>DELETED</span>
            </div>
          );
        }
        if (item?.fromState == "VALID" && item?.toState == "POTENTIAL") {
          return (
            <div className="d-flex">
              {item.diagnosisCode} - Moved from{" "}
              <span className={visitStyles.validColor}>HCC</span> to{" "}
              <span className={visitStyles.potentialColor}>POTENTIAL</span>
            </div>
          );
        }
        if (item?.fromState == "SUGGESTED" && item?.toState == "VALID") {
          return (
            <div className="d-flex">
              {item.diagnosisCode} - Moved from{" "}
              <span className={visitStyles.suggestedColor}>
                {/* SUGGESTED */}
                CAREGAP
              </span>{" "}
              to <span className={visitStyles.validColor}> HCC</span>
            </div>
          );
        }
        if (item?.fromState == "INVALID" && item?.toState == "DELETED") {
          return (
            <div className="d-flex">
              {item.diagnosisCode} - Moved from{" "}
              <span className={visitStyles.nonHcc}>NON HCC</span> to
              <span className={visitStyles.deletedColor}> DELETED</span>
            </div>
          );
        }
        if (item?.fromState == "SUGGESTED" && item?.toState == "DELETED") {
          return (
            <div className="d-flex w-100">
              {item.diagnosisCode} - Moved from{" "}
              <span className={visitStyles.suggestedColor}>
                {/* SUGGESTED */}
                CAREGAP
              </span>{" "}
              to <span className={visitStyles.deletedColor}> DELETED</span>
            </div>
          );
        }
        if (item?.fromState == "SUGGESTED" && item?.toState == "POTENTIAL") {
          return (
            <div className="d-flex w-100">
              {item.diagnosisCode} - Moved from{" "}
              <span className={visitStyles.suggestedColor}>CAREGAP</span>
              to <span className={visitStyles.potentialColor}>POTENTIAL</span>
            </div>
          );
        }
        if (item?.fromState == "DELETED" && item?.toState == "VALID") {
          return (
            <div className="d-flex">
              {item.diagnosisCode} - Moved from{" "}
              <span className={visitStyles.deletedColor}>DELETED</span> to{" "}
              <span className={visitStyles.validColor}> HCC</span>
            </div>
          );
        }
        if (item?.fromState == "DELETED" && item?.toState == "SUGGESTED") {
          return (
            <div className="d-flex">
              {item.diagnosisCode} - Moved from{" "}
              <span className={visitStyles.deletedColor}>DELETED</span> to{" "}
              <span className={visitStyles.suggestedColor}>
                {/* SUGGESTED */}
                CAREGAP
              </span>
            </div>
          );
        }
        if (item?.fromState == "DELETED" && item?.toState == "POTENTIAL") {
          return (
            <div className="d-flex">
              {item.diagnosisCode} - Moved from{" "}
              <span className={visitStyles.deletedColor}>DELETED</span> to{" "}
              <span className={visitStyles.potentialColor}>POTENTIAL</span>
            </div>
          );
        }
        if (item?.fromState == "POTENTIAL" && item?.toState == "VALID") {
          return (
            <div className="d-flex">
              {item.diagnosisCode} - Moved from{" "}
              <span className={visitStyles.potentialColor}>POTENTIAL</span> to{" "}
              <span className={visitStyles.validColor}> HCC</span>
            </div>
          );
        }
        if (item?.fromState == "POTENTIAL" && item?.toState == "SUGGESTED") {
          return (
            <div className="d-flex">
              {item.diagnosisCode} - Moved from{" "}
              <span className={visitStyles.potentialColor}>POTENTIAL</span> to{" "}
              <span className={visitStyles.suggestedColor}>CAREGAP</span>
            </div>
          );
        }
        if (item?.fromState == "POTENTIAL" && item?.toState == "DELETED") {
          return (
            <div className="d-flex">
              {item.diagnosisCode} - Moved from{" "}
              <span className={visitStyles.potentialColor}>POTENTIAL</span> to{" "}
              <span className={visitStyles.deletedColor}>DELETED</span>
            </div>
          );
        }
      case "VALID_DISEASE_ADDED":
        return `${item.diagnosisCode} - Disease added`;
      case "MANUALLY_ADDED_DISEASE":
        return `${item.diagnosisCode} - Disease added manually`;
      case "MOVED_VALID_TO_DELETED":
        return (
          <div className="d-flex">
            {item.diagnosisCode} - Moved from{" "}
            <span className={visitStyles.validColor}>VALID</span> to{" "}
            <span className={visitStyles.deletedColor}>DELETED</span>
          </div>
        );
      case "AUDITED":
        return (
          <div className="d-flex">
            Changed from{" "}
            <span
              style={{
                color: getStatusColors(item?.previousProcessedState),
                fontSize: "12px",
                padding: "0 5px",
              }}
            >
              {item?.previousProcessedState}
            </span>{" "}
            to <span className={visitStyles.audited}>AUDITED</span>
          </div>
        );
      case "REAUDIT":
        return (
          <div className="d-flex">
            Changed from{" "}
            <span
              style={{
                color: getStatusColors(item?.previousProcessedState),
                fontSize: "12px",
                padding: "0 5px",
              }}
            >
              {item?.previousProcessedState}
            </span>{" "}
            to <span className={visitStyles.reaudit}>REAUDIT</span>
          </div>
        );
      case "AUDITHOLD":
        return (
          <div className="d-flex">
            Changed from{" "}
            <span
              style={{
                color: getStatusColors(item?.previousProcessedState),
                fontSize: "12px",
                padding: "0 5px",
              }}
            >
              {item?.previousProcessedState}
            </span>{" "}
            to <span className={visitStyles?.audithold}>AUDITHOLD</span>
          </div>
        );
      case "AUDIT_PENDING":
        return (
          <div className="d-flex">
            Changed from{" "}
            <span
              style={{
                color: getStatusColors(item?.previousProcessedState),
                fontSize: "12px",
                padding: "0 5px",
              }}
            >
              {item?.previousProcessedState}
            </span>{" "}
            to <span className={visitStyles?.auditpending}>AUDIT_PENDING</span>
          </div>
        );
      case "AUDIT_DECLINED":
        return (
          <div className="d-flex">
            Changed from{" "}
            <span
              style={{
                color: getStatusColors(item?.previousProcessedState),
                fontSize: "12px",
                padding: "0 5px",
              }}
            >
              {item?.previousProcessedState}
            </span>{" "}
            to{" "}
            <span className={visitStyles?.auditdeclined}>AUDIT_DECLINED</span>
          </div>
        );
      case "MEAT_QUERY_STORED":
        return `Changed from ${item.previousProcessedState} to Meat Query Stored`;
      case "COMPLETED":
        return (
          <div className="d-flex">
            Changed from{" "}
            <span
              style={{
                color: getStatusColors(item?.previousProcessedState),
                fontSize: "12px",
                padding: "0 5px",
              }}
            >
              {item?.previousProcessedState}
            </span>{" "}
            to <span className={visitStyles.completedColor}> COMPLETED</span>
          </div>
        );
      case "MOVED_DELETED_TO_VALID":
        return (
          <div className="d-flex">
            {item.diagnosisCode} - Moved from{" "}
            <span className={visitStyles.deletedColor}>DELETED</span> to{" "}
            <span className={visitStyles.validColor}> VALID</span>
          </div>
        );
      case "MOVED_DELETED_TO_SUGGESTED":
        return (
          <div className="d-flex">
            {item.diagnosisCode} - Moved from{" "}
            <span className={visitStyles.deletedColor}>DELETED</span> to{" "}
            <span className={visitStyles.suggestedColor}>
              {/* SUGGESTED */}
              CAREGAP
            </span>
          </div>
        );
      case "MOVED_SUGGESTED_TO_DELETED":
        return (
          <div className="d-flex w-100">
            {item.diagnosisCode} - Moved from{" "}
            <span className={visitStyles.suggestedColor}>
              {/* SUGGESTED */}
              CAREGAP
            </span>{" "}
            to <span className={visitStyles.deletedColor}> DELETED</span>
          </div>
        );
      case "ENCOUNTER_FILE_UPDATED":
        return `${item.diagnosisCode} - Encounter file updated`;
      case "ENCOUNTER_FILE_ADDED":
        return `${item.diagnosisCode} - Encounter file added`;
      case "MEAT_ADDED":
        return `${item.diagnosisCode} - Meat added`;
      case "DOS_AND_PROVIDER_EDIT":
        return (
          <div className="d-flex w-100 justify-content-between">
            {item?.changedDosProviderInfo?.dateOfService} - DOS AND PROVIDER
            EDIT
            <Popover
              open={popClickDisCode === index ? true : false}
              trigger={["hover"]}
              placement="bottom"
              overlayStyle={{ zIndex: 9999 }}
              content={<>{getEditDosDeatils(item)}</>}
            >
              <span
                className={styles.viewTag}
                onClick={() => onClickPopup(index)}
              >
                View
              </span>{" "}
            </Popover>
          </div>
        );
      case "DISEASE_EDITED":
        return (
          <div className="d-flex w-100 justify-content-between">
            {item.diagnosisCode} - DISEASE EDITED
            <Popover
              open={popClickDisCode === index ? true : false}
              trigger={["hover"]}
              placement="bottom"
              overlayStyle={{ zIndex: 9999 }}
              content={<>{getEditDeatils(item)}</>}
            >
              <span
                className={styles.viewTag}
                onClick={() => onClickPopup(index)}
              >
                View
              </span>{" "}
            </Popover>
          </div>
        );
      case "MEAT_EDITED":
        return (
          <div className="d-flex w-100 justify-content-between">
            {item?.previousMeatDetail?.diagnosisCode} - MEAT EDITED
            <Popover
              open={popClickDisCode === index ? true : false}
              trigger={["hover"]}
              placement="bottom"
              overlayStyle={{ zIndex: 9999 }}
              content={<>{getMeatEditDeatils(item)}</>}
            >
              <span
                className={styles.viewTag}
                onClick={() => onClickPopup(index)}
              >
                View
              </span>{" "}
            </Popover>
          </div>
        );
      case "PROVIDER_EDITED":
        return (
          <div className="d-flex w-100 justify-content-between">
            {getHtmlContent(item?.htmlContent)}
            <Popover
              open={popClickDisCode === index ? true : false}
              trigger={["hover"]}
              placement="bottom"
              overlayStyle={{ zIndex: 9999 }}
              content={<>{getEditDeatils(item)}</>}
            >
              <span
                className={styles.viewTag}
                onClick={() => onClickPopup(index)}
              >
                View
              </span>{" "}
            </Popover>
          </div>
        );
      case "HOLD":
        return (
          <div className="d-flex">
            Changed from{" "}
            <span
              style={{
                color: getStatusColors(item?.previousProcessedState),
                fontSize: "12px",
                padding: "0 5px",
              }}
            >
              {item?.previousProcessedState}
            </span>{" "}
            to <span className={visitStyles.holdColor}>HOLD</span>
          </div>
        );
      case "DECLINED":
        return (
          <div className="d-flex">
            Changed from{" "}
            <span
              style={{
                color: getStatusColors(item?.previousProcessedState),
                fontSize: "12px",
                padding: "0 5px",
              }}
            >
              {item?.previousProcessedState}
            </span>{" "}
            to <span className={visitStyles.declinedColor}> DECLINED</span>
          </div>
        );
      case "PENDING":
        return (
          <div className="d-flex">
            Changed from{" "}
            <span
              style={{
                color: getStatusColors(item?.previousProcessedState),
                fontSize: "12px",
                padding: "0 5px",
              }}
            >
              {item?.previousProcessedState}
            </span>{" "}
            to <span className={visitStyles.pendingColor}> PENDING</span>{" "}
          </div>
        );
      case "FLAG_ADDED":
        return (
          <div className="d-flex">
            Flag Added -{" "}
            {item?.flagDetails?.flagName
              ? item?.flagDetails?.flagName.replaceAll("_", " ")
              : ""}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="23"
              height="23"
              viewBox="0 0 800 800"
              fill={item?.flagDetails?.flagColour}
            >
              <path
                d="M223 100V102H225H696.392L573.304 298.94L572.642 300L573.304 301.06L696.392 498H225H223V500V748H152V52H223V100Z"
                stroke="#000"
                stroke-width="10"
              />
            </svg>
          </div>
        );
      case "FLAG_REMOVED":
        return (
          <div className="d-flex">
            Flag Removed -{" "}
            {item?.flagDetails?.flagName
              ? item?.flagDetails?.flagName.replaceAll("_", " ")
              : ""}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="23"
              height="23"
              viewBox="0 0 800 800"
              fill={item?.flagDetails?.flagColour}
            >
              <path
                d="M223 100V102H225H696.392L573.304 298.94L572.642 300L573.304 301.06L696.392 498H225H223V500V748H152V52H223V100Z"
                stroke="#000"
                stroke-width="10"
              />
            </svg>
          </div>
        );
      case "COMMENT_ADDED":
        return (
          <div className="d-flex w-100 justify-content-between">
            <strong>Comment Added </strong>
            <Popover
              open={popClickDisCode === index}
              trigger={["hover"]}
              placement="bottom"
              overlayStyle={{ zIndex: 9999 }}
              content={
                <div className="d-flex justify-content-between">
                  <span className={`${styles.textContent}`}>
                    {item?.actionNotes}
                  </span>
                  <CloseCircleFilled
                    onClick={() => onClickPopup(null)}
                    className={`${styles.closeIcon}`}
                  />
                </div>
              }
            >
              <span
                className={styles.viewTag}
                onClick={() => onClickPopup(index)}
              >
                View
              </span>
            </Popover>
          </div>
        );
      case "COMMENT_REMOVED":
        return (
          <div className="d-flex w-100 justify-content-between">
            <strong>Comment Removed </strong>
          </div>
        );
      case "NOTES_ADDED":
        return (
          <div className="d-flex w-100 justify-content-between">
            <strong>Notes Added </strong>
            <Popover
              open={popClickDisCode === index}
              trigger={["hover"]}
              placement="bottom"
              overlayStyle={{ zIndex: 9999 }}
              content={
                <div className="d-flex justify-content-between">
                  <span className={`${styles.textContent}`}>
                    {item?.actionNotes}
                  </span>
                  <CloseCircleFilled
                    onClick={() => onClickPopup(null)}
                    className={`${styles.closeIcon}`}
                  />
                </div>
              }
            >
              <span
                className={styles.viewTag}
                onClick={() => onClickPopup(index)}
              >
                View
              </span>
            </Popover>
          </div>
        );
      case "NOTES_REMOVED":
        return (
          <div className="d-flex w-100 justify-content-between">
            <strong>Notes Removed </strong>
          </div>
        );
      default:
        return (
          <div className="d-flex">
            Changed from
            <span
              style={{
                color: getStatusColors(item?.previousProcessedState),
                fontSize: "12px",
                padding: "0 5px",
              }}
            >
              {item?.previousProcessedState}
            </span>
            to {underScoreRemove(item.action)}
          </div>
        );
    }
  };

  const getEditDeatils = (viewValue) => {
    let sectionMapArr = (
      <>
        <div className="d-flex justify-content-end">
          <CloseCircleFilled
            className={styles.deleteIcon}
            onClick={() => {
              setIsPopupOpen(false);
              setPopClickDisCode(null);
            }}
          />
        </div>
        <div className={styles.detailsContainer}>
          <div className={styles.oldCodeContiner}>
            <span className={styles.codeTitle}>OLD</span>
            <div className={styles.details}>
              <div className={styles.detailsHeader}>
                <span className={styles.disCode}>
                  {" "}
                  {viewValue?.previousDiseaseFormat?.diagnosisCode}
                </span>
                <span className={styles.discription}>
                  {viewValue?.previousDiseaseFormat?.dbDescription ||
                    viewValue?.previousDiseaseFormat?.actualDescription}
                </span>
              </div>

              <div className={styles.detailsHeader}>
                <span className={styles.disCode}>Provider</span>
                <div>
                  {getProviderNameTagList({
                    data:
                      viewValue?.previousDiseaseFormat?.providerNames ||
                      viewValue?.previousProviderInfo?.providerName ||
                      [],
                  })}
                </div>
              </div>

              <div className={styles.detailsHeader}>
                <span className={styles.disCode}>Encounter Date</span>
                <div>
                  {getDateOfServiceBackground({
                    value:
                      viewValue?.previousDiseaseFormat?.dateOfServices ||
                      viewValue?.previousProviderInfo?.dateOfService ||
                      [],
                  })}
                </div>
              </div>

              {viewValue?.previousDiseaseFormat?.capturedSections && (
                <div className={styles.detailsHeader}>
                  <span className={styles.disCode}>Section</span>
                  <div>
                    {getSectionHeaderBackground({
                      value: viewValue?.previousDiseaseFormat?.capturedSections,
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className={styles.editCodeContainer}>
            <span className={styles.editTitle}>NEW</span>
            <div className={styles.details}>
              <div className={styles.detailsHeader}>
                <span className={styles.disCode}>
                  {" "}
                  {viewValue?.changedDiseaseFormat?.diagnosisCode}
                </span>
                <span className={styles.discription}>
                  {viewValue?.changedDiseaseFormat?.dbDescription ||
                    viewValue?.previousDiseaseFormat?.actualDescription}
                </span>
              </div>

              <div className={styles.detailsHeader}>
                <span className={styles.disCode}>Provider</span>
                <div>
                  {getProviderNameTagList({
                    data:
                      viewValue?.changedDiseaseFormat?.providerNames ||
                      viewValue?.changedProviderInfo?.providerName ||
                      [],
                  })}
                </div>
              </div>

              <div className={styles.detailsHeader}>
                <span className={styles.disCode}>Encounter Date</span>
                <div>
                  {getDateOfServiceBackground({
                    value:
                      viewValue?.changedDiseaseFormat?.dateOfServices ||
                      viewValue?.changedProviderInfo?.dateOfService ||
                      [],
                  })}
                </div>
              </div>
              {viewValue?.changedDiseaseFormat?.capturedSections && (
                <div className={styles.detailsHeader}>
                  <span className={styles.disCode}>Section</span>
                  <div>
                    {getSectionHeaderBackground({
                      value: viewValue?.changedDiseaseFormat?.capturedSections,
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    );

    return sectionMapArr;
  };
   const getEditDosDeatils = (viewValue) => {
     let sectionMapArr = (
       <>
         <div className="d-flex justify-content-end">
           <CloseCircleFilled
             className={styles.deleteIcon}
             onClick={() => {
               setIsPopupOpen(false);
               setPopClickDisCode(null);
             }}
           />
         </div>
         <div className={styles.detailsContainer}>
           {/* OLD Section */}
           <div className={styles.oldCodeContiner}>
             <span className={styles.codeTitle}>OLD</span>
             <div className={styles.details}>
               <div className={styles.detailRow}>
                 <span className={styles.disCode}>Date of Service:</span>
                 <span className={styles.discription}>
                   {viewValue?.previousDosProviderInfo?.dateOfService}
                 </span>
               </div>

               <div className={styles.detailRow}>
                 <span className={styles.disCode}>Page:</span>
                 <span className={styles.discription}>
                   {viewValue?.previousDosProviderInfo?.startPageNumber} -{" "}
                   {viewValue?.previousDosProviderInfo?.endPagNumber}
                 </span>
               </div>

               <div className={styles.detailRow}>
                 <span className={styles.disCode}>Reference:</span>
                 <span className={styles.discription}>
                   {viewValue?.previousDosProviderInfo?.substring}
                 </span>
               </div>

               <div className={styles.detailRow}>
                 <span className={styles.disCode}>Provider Name:</span>
                 <span className={styles.discription}>
                   {viewValue?.previousDosProviderInfo?.providerName}
                 </span>
               </div>

               <div className={styles.detailRow}>
                 <span className={styles.disCode}>Credential:</span>
                 <span className={styles.discription}>
                   {viewValue?.previousDosProviderInfo?.providerCredentials}
                 </span>
               </div>

               <div className={styles.detailRow}>
                 <span className={styles.disCode}>Page Number:</span>
                 <span className={styles.discription}>
                   {
                     viewValue?.previousDosProviderInfo?.hyperlinks[0]
                       ?.pageNumber
                   }
                 </span>
               </div>

               <div className={styles.detailRow}>
                 <span className={styles.disCode}>Reference:</span>
                 <span className={styles.discription}>
                   {
                     viewValue?.previousDosProviderInfo?.hyperlinks[0]
                       ?.substring
                   }
                 </span>
               </div>

               <div className={styles.detailRow}>
                 <span className={styles.disCode}>Signature:</span>
                 <span className={styles.discription}>
                   {viewValue?.previousDosProviderInfo?.unSigned
                     ? "Not Signed"
                     : "Signed"}
                 </span>
               </div>

               <div className={styles.detailRow}>
                 <span className={styles.disCode}>Face To Face:</span>
                 <span className={styles.discription}>
                   {viewValue?.previousDosProviderInfo?.faceToFace === true
                     ? "Yes"
                     : "No"}
                 </span>
               </div>
               <div className={styles.detailRow}>
                 <span className={styles.disCode}>Visit Type:</span>
                 <span className={styles.discription}>
                   {viewValue?.previousDosProviderInfo?.visitType}
                 </span>
               </div>
               <div className={styles.detailRow}>
                 <span className={styles.disCode}>Reviewer Comments:</span>
                 <span className={styles.discription}>
                   {viewValue?.previousDosProviderInfo?.reviewerComments}
                 </span>
               </div>
               <div className={styles.detailRow}>
                 <span className={styles.disCode}>Physician Inquiry:</span>
                 <span className={styles.discription}>
                   {viewValue?.previousDosProviderInfo?.physicianInquiry}
                 </span>
               </div>
             </div>
           </div>

           {/* NEW Section */}
           <div className={styles.editCodeContainer}>
             <span className={styles.editTitle}>NEW</span>
             <div className={styles.details}>
               <div className={styles.detailRow}>
                 <span className={styles.disCode}>Date of Service:</span>
                 <span className={styles.discription}>
                   {viewValue?.changedDosProviderInfo?.dateOfService}
                 </span>
               </div>

               <div className={styles.detailRow}>
                 <span className={styles.disCode}>Page:</span>
                 <span className={styles.discription}>
                   {viewValue?.changedDosProviderInfo?.startPageNumber} -{" "}
                   {viewValue?.changedDosProviderInfo?.endPagNumber}
                 </span>
               </div>

               <div className={styles.detailRow}>
                 <span className={styles.disCode}>Reference:</span>
                 <span className={styles.discription}>
                   {viewValue?.changedDosProviderInfo?.substring}
                 </span>
               </div>

               <div className={styles.detailRow}>
                 <span className={styles.disCode}>Provider Name:</span>
                 <span className={styles.discription}>
                   {viewValue?.changedDosProviderInfo?.providerName}
                 </span>
               </div>

               <div className={styles.detailRow}>
                 <span className={styles.disCode}>Credential:</span>
                 <span className={styles.discription}>
                   {viewValue?.changedDosProviderInfo?.providerCredentials}
                 </span>
               </div>

               <div className={styles.detailRow}>
                 <span className={styles.disCode}>Page Number:</span>
                 <span className={styles.discription}>
                   {
                     viewValue?.changedDosProviderInfo?.hyperlinks[0]
                       ?.pageNumber
                   }
                 </span>
               </div>

               <div className={styles.detailRow}>
                 <span className={styles.disCode}>Reference:</span>
                 <span className={styles.discription}>
                   {viewValue?.changedDosProviderInfo?.hyperlinks[0]?.substring}
                 </span>
               </div>

               <div className={styles.detailRow}>
                 <span className={styles.disCode}>Signature:</span>
                 <span className={styles.discription}>
                   {viewValue?.changedDosProviderInfo?.unSigned
                     ? "Not Signed"
                     : "Signed"}
                 </span>
               </div>

               <div className={styles.detailRow}>
                 <span className={styles.disCode}>Face To Face:</span>
                 <span className={styles.discription}>
                   {viewValue?.changedDosProviderInfo?.faceToFace === true
                     ? "Yes"
                     : "No"}
                 </span>
               </div>
               <div className={styles.detailRow}>
                 <span className={styles.disCode}>Visit Type:</span>
                 <span className={styles.discription}>
                   {viewValue?.changedDosProviderInfo?.visitType}
                 </span>
               </div>
               <div className={styles.detailRow}>
                 <span className={styles.disCode}>Reviewer Comments:</span>
                 <span className={styles.discription}>
                   {viewValue?.changedDosProviderInfo?.reviewerComments}
                 </span>
               </div>
               <div className={styles.detailRow}>
                 <span className={styles.disCode}>Physician Inquiry:</span>
                 <span className={styles.discription}>
                   {viewValue?.changedDosProviderInfo?.physicianInquiry}
                 </span>
               </div>
             </div>
           </div>
         </div>
       </>
     );

     return sectionMapArr;
   };
  const onClickPopup = (disCode) => {
    setPopClickDisCode(disCode);
    setIsPopupOpen(isPopupOpen ? false : true);
  };
  const getHtmlContent = (item) => {
    return <div dangerouslySetInnerHTML={{ __html: item }} />;
  };

  function renderTimelineItem(item, index) {
    getBadgeClassName(item, index);
    getTimelineHeading(item, index);

    return (
      <li
        key={item?.id}
        id={`tooltip-username-${index}`}
        name={`tooltip-username-${index}`}
      >
        <Tooltip
          id="tooltip-username"
          name="tooltip-username"
          title={item.userName}
          placement="bottom"
        >
          <Popover
            placement="bottom"
            content={userDetails}
            onOpenChange={() => renderUserDetails(item.userName)}
          >
            <div
              className={getBadgeClassName(item, index)}
              id={`user-timeline${index}`}
              name={`user-timeline${index}`}
            >
              {splitUserName(item.userName)}
            </div>
          </Popover>
        </Tooltip>
        <div className="timeline-panel ">
          <div>
            {" "}
            {item?.fullName}{" "}
            {item?.aliasName
              ? `(${item.aliasName?.split("_")?.join(" ")})`
              : ""}
          </div>

          <span className={`${visitStyles.timelineheading} d-flex`}>
            {item?.htmlContent
              ? getHtmlContent(item?.htmlContent)
              : getTimelineHeading(item, index)}
          </span>
          {item?.dos && (
            <span
              className={` text-muted ${visitStyles.timelineDate} mt-1`}
            >{`DOS: ${item?.dos}`}</span>
          )}
          {/* <span className={`text-muted ${visitStyles.timelineDate}`}>
            {formatDateTime({ date: item.createdDate })}
          </span> */}
          {item?.educationalError && (
            <div className="d-flex  align-items-end justify-content-end">
              <span
                className={` rounded-1 d-flex  align-items-center justify-content-center p-3 ${visitStyles.error}`}
              >
                EDU Error
              </span>
            </div>
          )}
          <div
            style={{ fontSize: "11px" }}
            className="d-flex text-muted align-items-end justify-content-end mt-1"
          >
            {timeLineDateAndTime(item?.createdDate)}
          </div>
        </div>
      </li>
    );
  }
  useEffect(() => {
    getTimeLineDetails();
  }, [role, action, isViewAll]);
  useEffect(() => {
    getAllRoles();
    getActionList();
  }, []);
  return (
    <div className={visitStyles.timeLines}>
      {!showFilter ? (
        <div className="p-3">
          <div
            style={{
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              height: "150px",
            }}
          >
            <div className="p-3">
              <div className="row px-1 pb-1">
                <div className="col-6 mb-3">
                  <label>Role</label>
                  <div className="form-group has-search custom-react-select-audit customClear">
                    <Select
                      className={` w-100 ${visitStyles.inputs}`}
                      placeholder="Select Role"
                      options={options}
                      value={role}
                      onChange={handleRoleChange}
                      allowClear
                    ></Select>
                  </div>
                </div>
                <div className="col-6 mb-3">
                  <label>Event Type</label>
                  <div className="form-group has-search custom-react-select-audit customClear">
                    <Select
                      className={` w-100 ${visitStyles.inputs}`}
                      placeholder="Select Event type"
                      allowClear
                      options={actionOptions}
                      value={action}
                      onChange={handleActionChange}
                      filterOption={(input, option) =>
                        (option?.label ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      showSearch={true}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
      {!filterDataLoading ? (
        <div
          className={`widget-timeline ${
            timelineData?.length === 0 ? "no-timeline-line" : ""
          }`}
        >
          <ul className="timeline">
            {timelineData?.length > 0 ? (
              timelineData?.map((item, index) =>
                renderTimelineItem(item, index)
              )
            ) : (
              <div className="no-data-container">
                <h6 className="text-center">
                  <Empty />
                </h6>
              </div>
            )}
          </ul>
        </div>
      ) : (
        <div className="m-3">
          <div className="d-flex flex-column gap-2">
            <CardSkeleton count={6} height={100} />
          </div>
        </div>
      )}
    </div>
  );
};

const enhancer = connect(
  (state) => ({
    allRoles: state?.tenantAdmin?.users?.getUsersRoles?.data?.response,
    actionList: state?.patientDetails?.details?.actionList?.data?.response,
  }),
  {
    getAllRoles: userActions.usersAllRoles,
    getActionList: detailsActions.actionList,
  }
);
export default enhancer(Timeline);
