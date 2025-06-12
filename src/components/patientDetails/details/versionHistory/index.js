import React, { useState } from "react";
import visitStyles from "../../../../styles/visitdata.module.css";
import { Popconfirm, Popover, Tooltip } from "antd";
import styles from "../timline/styles.module.css";
import { CloseCircleFilled } from "@ant-design/icons";
import { getProviderNameTagList } from "../components/function/ProviderHyperlinks";
import { getDateOfServiceBackground } from "../components/function/DateOfServices";
import { getSectionHeaderBackground, getSectionHeadersBackground } from "../components/function/SectionHeader";
import CardSkeleton from "../../../skeleton/card";
import { formatDateTime, getResponePopup } from "../../../../utils/reusable";
import { getBadgeClassName, getStatusColors, underScoreRemove } from "../timline";
import { getStorage } from "../../../../utils/storages";

const VersionHistory = ({
  getRevertDetails,
  revertLoading,
  confirmRevert,
  userDetails,
  renderUserDetails,
  isDosSelected,
  dosYearDefalutSelect,
  patientIdDetailsData,
  setIsModalComments,
  getpatientDetailsData,
  patientDetailsResult
}) => {
  const userId = getStorage("patientId");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popClickDisCode, setPopClickDisCode] = useState(null);
  const onClickPopup = (disCode) => {
    setPopClickDisCode(disCode);
    setIsPopupOpen(isPopupOpen ? false : true);
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

  const handleConfirm = async (item) => {
    const response = await confirmRevert({
      dos: isDosSelected,

      year: dosYearDefalutSelect.value
        ? dosYearDefalutSelect.value
        : dosYearDefalutSelect,
      versionHistory: item,
    });
    if (response?.status == "SUCCESS") {
      setIsModalComments(false);
      getResponePopup(response);
      getpatientDetailsData(userId, dosYearDefalutSelect?.value, isDosSelected);
    }
  };

  const getHtmlContent = (item) => {
    return <div dangerouslySetInnerHTML={{ __html: item }} />;
  };
  const isDisabled =
  patientIdDetailsData?.data?.response?.workflow?.[0]?.status !== "PENDING" || patientDetailsResult?.data?.response?.workflow?.[0]
  ?.status == "COMPLETED";

  function renderTimelineItem(item, index) {
    getBadgeClassName(item, index);
    getTimelineHeading(item, index);

    return (
      <li
        key={item?.id}
        id={`tooltip-username-${index}`}
        name={`tooltip-username-${index}`}
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
            {item?.revertHistory}
          </div>
        </Popover>
        {!item?.isCurrentVersion && !isDisabled ? (
          <Popconfirm
            className="custom-pop"
            placement="bottom"
            title={"Confirm Revert to this Version"}
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleConfirm(item.revertHistory)}
          >
            <div className="timeline-panel cr-pointer text-muted">
              <span
                className={`${visitStyles.timelineheading} ant-badge cursor-pointer d-flex`}
              >
                {item?.htmlContent
                  ? getHtmlContent(item?.htmlContent)
                  : getTimelineHeading(item, index)}
              </span>
              {item?.dos && (
                <span className={`${visitStyles.timelineDate} mt-1`}>
                  {`DOS: ${item?.dos}`}
                </span>
              )}
              <span className={visitStyles.timelineDate}>
                {formatDateTime({ date: item.createdDate })}
              </span>
            </div>
          </Popconfirm>
        ) : (
          <div
            className="timeline-panel text-muted"
            style={{ cursor: "not-allowed", opacity: 0.5 }}
          >
            <span className={`${visitStyles.timelineheading} ant-badge d-flex`}>
              {item?.htmlContent
                ? getHtmlContent(item?.htmlContent)
                : getTimelineHeading(item, index)}
            </span>
            {item?.dos && (
              <span className={`${visitStyles.timelineDate} mt-1`}>
                {`DOS: ${item?.dos}`}
              </span>
            )}
            <span className={visitStyles.timelineDate}>
              {formatDateTime({ date: item.createdDate })}
            </span>
          </div>
          
        )}
      </li>
    );
  }
  return (
    <div className={visitStyles.timeLines}>
      {!revertLoading ? (
        <div className={`widget-timeline ${visitStyles.timeLineScroll}`}>
          <ul className="timeline">
            {getRevertDetails?.length > 0 ? (
              getRevertDetails?.map((item, index) =>
                renderTimelineItem(item, index)
              )
            ) : (
              <div className="no-data-container">
                <h6 className="text-center">NO DATA</h6>
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

export default VersionHistory;
