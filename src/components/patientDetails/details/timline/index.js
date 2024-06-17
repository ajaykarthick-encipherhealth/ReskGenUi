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

  const getProviderNameTagList = ({ data }) => {
    return data.map((res, index) => {
      if (index < 2) {
        var sectionMapArr = (
          <span
            className={`mt-2 text-start ${visitStyles.provider_name}`}
            style={{
              backgroundColor: stringToColour(res) + 33,
              color: stringToColour(res),
            }}
          >
            <i>
              {" "}
              <FontAwesomeIcon
                icon={faCircleUser}
                style={{
                  size: 10,
                  color: stringToColour(res),
                }}
              />
            </i>
            {res}
          </span>
        );
        return sectionMapArr;
      } else if (data.length - 1 == index) {
        var sectionMapArr = (
          <Popover
            overlayStyle={{ zIndex: 99999 }}
            content={
              <>
                {data?.map((item, i) =>
                  i > 1 ? (
                    <span
                      className={`mt-2 text-start ${visitStyles.provider_name}`}
                      style={{
                        backgroundColor: stringToColour(item) + 33,
                        color: stringToColour(item),
                      }}
                    >
                      <i>
                        {" "}
                        <FontAwesomeIcon
                          icon={faCircleUser}
                          style={{
                            size: 10,
                            color: stringToColour(item),
                          }}
                        />
                      </i>
                      {item}
                    </span>
                  ) : null
                )}
              </>
            }
            trigger={["hover"]}
            placement="bottom"
          >
            <span
              style={{ background: "#a6cfa6", color: "#fff" }}
              className={`mt-2 text-start cr-pointer ${visitStyles.captureheader}`}
            >
              {data.length - 2}+
            </span>
          </Popover>
        );

        return sectionMapArr;
      }
    });
  };
  const getDateOfServiceBackground = ({ value }) => {
    return value?.map((res, index) => {
      if (index < 2) {
        var sectionMapArr = res ? (
          <span
            style={{
              borderColor: stringToColour(res) + 33,
              color: stringToColour(res),
              border: "1px solid",
            }}
            className={`cr-pointer mt-2 text-start ${visitStyles.encounterDate}`}
          >
            <i>
              <CalendarOutlined
                className={visitStyles.calenderIconNew}
                style={{
                  size: 10,
                  color: stringToColour(res),
                }}
              />
            </i>
            {moment(res).format("MMM DD")}
          </span>
        ) : (
          ""
        );
        return sectionMapArr;
      } else if (value.length - 1 == index) {
        var sectionMapArr = (
          <Popover
            overlayStyle={{ zIndex: 99999 }}
            content={
              <>
                {value?.map((item, i) =>
                  i > 1 ? (
                    <span
                      style={{
                        borderColor: stringToColour(item) + 33,
                        color: stringToColour(item),
                        border: "1px solid",
                      }}
                      className={`cr-pointer mt-2 text-start ${visitStyles.encounterDate}`}
                    >
                      <i>
                        <CalendarOutlined
                          className={visitStyles.calenderIconNew}
                          style={{
                            size: 10,
                            color: stringToColour(item),
                          }}
                        />
                      </i>
                      {moment(item).format("MMM DD")}
                    </span>
                  ) : null
                )}
              </>
            }
            trigger={["hover"]}
            placement="bottom"
          >
            <span
              style={{
                background: "#a0b1a0",
                color: "#fff",
              }}
              className={`mt-2 text-start cr-pointer ${visitStyles.captureheader}`}
            >
              {value.length - 2}+
            </span>
          </Popover>
        );

        return sectionMapArr;
      }
    });
  };
  const getSectionHeaderBackground = ({ value }) => {
    return value?.map((res, index) => {
      if (index < 2) {
        var sectionMapArr = res ? (
          <span
            style={{
              background: stringToColour(res) + 33,
              color: stringToColour(res),
            }}
            className={`cr-pointer mt-2 text-start ${visitStyles.captureheader}`}
          >
            {res}
          </span>
        ) : (
          ""
        );
        return sectionMapArr;
      } else if (value.length - 1 == index) {
        var sectionMapArr = (
          <Popover
            overlayStyle={{ zIndex: 99999 }}
            content={
              <>
                {value?.map((item, i) =>
                  i > 1 ? (
                    <span
                      style={{
                        background: stringToColour(item) + 33,
                        color: stringToColour(item),
                      }}
                      className={`cr-pointer mt-2 text-start ${visitStyles.captureheader}`}
                    >
                      {item}
                    </span>
                  ) : null
                )}
              </>
            }
            trigger={["hover"]}
            placement="bottom"
          >
            <span
              style={{
                background: "#a0b1a0",
                color: "#fff",
              }}
              className={`mt-2 text-start cr-pointer ${visitStyles.captureheader}`}
            >
              {value.length - 2}+
            </span>
          </Popover>
        );

        return sectionMapArr;
      }
    });
  };

  const providerNameList = [
    "Birendra Bhattarai, MD",
    "Tochukwu Ajalla, PA",
    "Denis Vilchez, MD",
  ];

  const dateOfServiceList = ["2023-06-12", "2023-05-10", "2023-02-02"];
  const sectionList = ["Plan", "Assessment", "Medical History"];
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
            <span className={styles.codeTitle}>CODE</span>
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
            <span className={styles.editTitle}>EDITED CODE</span>
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

  const onClickPopup = (disCode) => {
    setPopClickDisCode(disCode);
    setIsPopupOpen(isPopupOpen ? false : true);
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
        case "EDITED":
          return (
            <div className="d-flex w-100 justify-content-between">
              {item.diagnosisCode} - code been edited
              <Popover
                open={isPopupOpen && item.diagnosisCode == popClickDisCode}
                trigger={["hover"]}
                placement="bottom"
                overlayStyle={{ zIndex: 9999 }}
                content={<>{getEditDeatils(item)}</>}
              >
                <span
                  className={styles.viewTag}
                  onClick={() => onClickPopup(item.diagnosisCode)}
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
