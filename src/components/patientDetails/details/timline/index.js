import React from "react";
import visitStyles from "../../../../styles/visitdata.module.css";
import { Popover, Tooltip } from "antd";
import moment from "moment";

const Timeline = ({
  timelineData,
  filterDataLoading,
  splitUserName,
  userDetails,
  renderUserDetails,
}) => {
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
  function renderTimelineItem(item) {
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
              <span className={visitStyles.suggestedColor}>SUGGESTED</span> to{" "}
              <span className={visitStyles.validColor}> VALID</span>
            </div>
          );
        case "MOVED":
          if (item?.fromState == "VALID" && item?.toState == "SUGGESTED") {
            return (
              <div className="d-flex">
                {item.diagnosisCode} - Moved from{" "}
                <span className={visitStyles.validColor}>HCC</span> to{" "}
                <span className={visitStyles.suggestedColor}>SUGGESTED</span>
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
                <span className={visitStyles.suggestedColor}>SUGGESTED</span> to{" "}
                <span className={visitStyles.validColor}> HCC</span>
              </div>
            );
          }
          if (item?.fromState == "SUGGESTED" && item?.toState == "DELETED") {
            return (
              <div className="d-flex w-100">
                {item.diagnosisCode} - Moved from{" "}
                <span className={visitStyles.suggestedColor}>SUGGESTED</span> to{" "}
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
                <span className={visitStyles.suggestedColor}>SUGGESTED</span>
              </div>
            );
          }
        case "VALID_DISEASE_ADDED":
          return `${item.diagnosisCode} - Valid from disease added`;
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
              <span className={visitStyles.suggestedColor}>SUGGESTED</span>
            </div>
          );
        case "MOVED_SUGGESTED_TO_DELETED":
          return (
            <div className="d-flex w-100">
              {item.diagnosisCode} - Moved from{" "}
              <span className={visitStyles.suggestedColor}>SUGGESTED</span> to{" "}
              <span className={visitStyles.deletedColor}> DELETED</span>
            </div>
          );
        case "ENCOUNTER_FILE_UPDATED":
          return `${item.diagnosisCode} - Encounter file updated`;
        case "ENCOUNTER_FILE_ADDED":
          return `${item.diagnosisCode} - Encounter file added`;
        case "MEAT_ADDED":
          return `${item.diagnosisCode} - Meat added`;
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
    <div className={visitStyles.timeLine}>
      {!filterDataLoading ? (
        <div className="widget-timeline">
          <ul className="timeline">
            {timelineData?.length > 0 ? (
              timelineData?.map((item) => renderTimelineItem(item))
            ) : (
              <h6 className="text-center">NO DATA</h6>
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
