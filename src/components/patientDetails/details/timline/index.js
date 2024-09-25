import React, { useState } from "react";
import visitStyles from "../../../../styles/visitdata.module.css";
import { Popover, Tooltip } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import moment from "moment";
import styles from "./styles.module.css";
import { stringToColour } from "../components/function/ReusableFunctions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { CloseCircleFilled } from "@ant-design/icons";
import { getProviderNameTagList } from "../components/function/ProviderHyperlinks";
import { getDateOfServiceBackground } from "../components/function/DateOfServices";
import {
  getSectionHeaderBackground,
  getSectionHeadersBackground,
} from "../components/function/SectionHeader";

const Timeline = ({
  timelineData,
  filterDataLoading,
  splitUserName,
  userDetails,
  renderUserDetails,
}) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popClickDisCode, setPopClickDisCode] = useState(null);

  const underScoreRemove = (value) => {
    if (value) {
      let str = value;
      let newStr = str.replace(/_/g, " ");
      return newStr;
    }
  };

  const getStatusColors = (state) => {
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

  const getEditDeatils = (viewValue) => {
    var sectionMapArr = (
      <>
        <div className="d-flex justify-content-end">
          <CloseCircleFilled
            className={styles.deleteIcon}
            onClick={() => {
              setIsPopupOpen(false), setPopClickDisCode(null);
            }}
          />
        </div>
        <div className={styles.detailsContainer}>
          <div className={styles.oldCodeContiner}>
            <span className={styles.codeTitle}>OLD CODE</span>
            <div className={styles.details}>
              <div className={styles.detailsHeader}>
                <span className={styles.disCode}>
                  {" "}
                  {viewValue?.previousDiseaseFormat?.diagnosisCode}
                </span>
                <span className={styles.discription}>
                  {viewValue?.previousDiseaseFormat?.dbDescription}
                </span>
              </div>
              <div className={styles.detailsHeader}>
                <span className={styles.disCode}>Provider</span>
                <div>
                  {getProviderNameTagList({
                    data: viewValue?.previousDiseaseFormat?.providerNames,
                  })}
                </div>
              </div>
              <div className={styles.detailsHeader}>
                <span className={styles.disCode}>Encounter Date</span>
                <div>
                  {getDateOfServiceBackground({
                    value: viewValue?.previousDiseaseFormat?.dateOfServices,
                  })}
                </div>
              </div>
              <div className={styles.detailsHeader}>
                <span className={styles.disCode}>Section</span>
                <div>
                  {getSectionHeaderBackground({
                    value: viewValue?.previousDiseaseFormat?.capturedSections,
                  })}
                </div>
              </div>
            </div>
          </div>
          <div className={styles.editCodeContainer}>
            <span className={styles.editTitle}>NEW CODE</span>
            <div className={styles.details}>
              <div className={styles.detailsHeader}>
                <span className={styles.disCode}>
                  {" "}
                  {viewValue?.changedDiseaseFormat?.diagnosisCode}
                </span>
                <span className={styles.discription}>
                  {viewValue?.changedDiseaseFormat?.dbDescription}
                </span>
              </div>
              <div className={styles.detailsHeader}>
                <span className={styles.disCode}>Provider</span>
                <div>
                  {getProviderNameTagList({
                    data: viewValue?.changedDiseaseFormat?.providerNames,
                  })}
                </div>
              </div>
              <div className={styles.detailsHeader}>
                <span className={styles.disCode}>Encounter Date</span>
                <div>
                  {getDateOfServiceBackground({
                    value: viewValue?.changedDiseaseFormat?.dateOfServices,
                  })}
                </div>
              </div>
              <div className={styles.detailsHeader}>
                <span className={styles.disCode}>Section</span>
                <div>
                  {getSectionHeaderBackground({
                    value: viewValue?.changedDiseaseFormat?.capturedSections,
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

  const getMeatEditDeatils = (viewValue) => {
    var sectionMapArr = (
      <>
        <div className="d-flex justify-content-end">
          <CloseCircleFilled
            className={styles.deleteIcon}
            onClick={() => {
              setIsPopupOpen(false), setPopClickDisCode(null);
            }}
          />
        </div>
        <div className={styles.detailsContainer}>
          <div className={styles.oldCodeContiner}>
            <span className={styles.codeTitle}>OLD CODE</span>
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
            <span className={styles.editTitle}>NEW CODE</span>
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

  const onClickPopup = (disCode) => {
    setPopClickDisCode(disCode);
    setIsPopupOpen(isPopupOpen ? false : true);
  };
  function renderTimelineItem(item, index) {
    const getBadgeClassName = () => {
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

    const getTimelineHeading = () => {
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
                </span> to{" "}
              <span className={visitStyles.validColor}> VALID</span>
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
          if (item?.fromState == "SUGGESTED" && item?.toState == "VALID") {
            return (
              <div className="d-flex">
                {item.diagnosisCode} - Moved from{" "}
                <span className={visitStyles.suggestedColor}>
                  {/* SUGGESTED */}
                  CAREGAP
                  </span> to{" "}
                <span className={visitStyles.validColor}> HCC</span>
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
                  </span> to{" "}
                <span className={visitStyles.deletedColor}> DELETED</span>
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
              to{" "}
              <span className={visitStyles?.auditpending}>AUDIT_PENDING</span>
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
                </span> to{" "}
              <span className={visitStyles.deletedColor}> DELETED</span>
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

    return (
      <li key={item?.id}>
        <Tooltip title={item.userName} placement="bottom">
          <Popover
            placement="bottom"
            content={userDetails}
            onOpenChange={() => renderUserDetails(item.userName)}
          >
            <div className={getBadgeClassName()}>
              {splitUserName(item.userName)}
            </div>
          </Popover>
        </Tooltip>
        <div className="timeline-panel text-muted">
          <span className={`${visitStyles.timelineheading} d-flex`}>
            {getTimelineHeading()}
          </span>
          <span className={visitStyles.timelineDate}>
            {moment(item.createdDate).format("MM-DD-YYYY hh:mm:A")}
          </span>
        </div>
      </li>
    );
  }
  return (
<div className={visitStyles.timeLines}>
  {!filterDataLoading ? (
    <div className="widget-timeline">
      <ul className="timeline" style={{ height: "99vh", overflow: "scroll" }}>
        {timelineData?.length > 0 ? (
          timelineData?.map((item, index) => renderTimelineItem(item, index))
        ) : (
          <div className="no-data-container">
            <h6 className="text-center">NO DATA</h6>
          </div>
        )}
      </ul>
    </div>
  ) : (
    <div className={visitStyles.userDetailsCard}>
      <div className="bouncing-loader">
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  )}
</div>

  );
};

export default Timeline;
