import React from "react";
import visitStyles from "../../../../../styles/visitdata.module.css";
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
    var str = value;
    var newStr = str.replace(/_/g, " ");
    return newStr;
  };
  return (
    <div className={visitStyles.timeLine}>
      {!filterDataLoading ? (
        <>
          <div className="widget-timeline">
            <ul className="timeline">
              {timelineData?.map((item, index) => (
                <li>
                  {item.action == "MOVED_INVALID_TO_VALID" ? (
                    <Tooltip title={item.userName} placement="bottom">
                      <Popover placement="bottom" content={userDetails}>
                        <div className="timeline-badge MOVED_INVALID_TO_VALID">
                          {splitUserName(item.userName)}
                        </div>
                      </Popover>
                    </Tooltip>
                  ) : item.action == "MOVED_SUGGESTED_TO_VALID" ? (
                    <Tooltip title={item.userName} placement="bottom">
                      <Popover
                        placement="bottom"
                        content={userDetails}
                        onOpenChange={() => renderUserDetails(item.userName)}
                      >
                        <div className="timeline-badge MOVED_SUGGESTED_TO_VALID">
                          {splitUserName(item.userName)}
                        </div>
                      </Popover>
                    </Tooltip>
                  ) : item.action == "MOVED_VALID_TO_SUGGESTED" ? (
                    <Tooltip title={item.userName} placement="bottom">
                      <Popover
                        placement="bottom"
                        content={userDetails}
                        onOpenChange={() => renderUserDetails(item.userName)}
                      >
                        <div className="timeline-badge MOVED_VALID_TO_SUGGESTED">
                          {splitUserName(item.userName)}
                        </div>
                      </Popover>
                    </Tooltip>
                  ) : item.action == "VALID_DISEASE_ADDED" ? (
                    <Tooltip title={item.userName} placement="bottom">
                      <Popover
                        placement="bottom"
                        content={userDetails}
                        onOpenChange={() => renderUserDetails(item.userName)}
                      >
                        <div className="timeline-badge VALID_DISEASE_ADDED">
                          {splitUserName(item.userName)}
                        </div>
                      </Popover>
                    </Tooltip>
                  ) : item.action == "MOVED_VALID_TO_DELETED" ? (
                    <Tooltip title={item.userName} placement="bottom">
                      <Popover
                        placement="bottom"
                        content={userDetails}
                        onOpenChange={() => renderUserDetails(item.userName)}
                      >
                        <div className="timeline-badge MOVED_VALID_TO_DELETED">
                          {splitUserName(item.userName)}
                        </div>
                      </Popover>
                    </Tooltip>
                  ) : item.action == "COMPLETED" ? (
                    <Tooltip title={item.userName} placement="bottom">
                      <Popover
                        placement="bottom"
                        content={userDetails}
                        onOpenChange={() => renderUserDetails(item.userName)}
                      >
                        <div className="timeline-badge COMPLETED">
                          {splitUserName(item.userName)}
                        </div>
                      </Popover>
                    </Tooltip>
                  ) : item.action == "MOVED_DELETED_TO_VALID" ? (
                    <Tooltip title={item.userName} placement="bottom">
                      <Popover
                        placement="bottom"
                        content={userDetails}
                        onOpenChange={() => renderUserDetails(item.userName)}
                      >
                        <div className="timeline-badge MOVED_DELETED_TO_VALID">
                          {splitUserName(item.userName)}
                        </div>
                      </Popover>
                    </Tooltip>
                  ) : item.action == "MOVED_DELETED_TO_SUGGESTED" ? (
                    <Tooltip title={item.userName} placement="bottom">
                      <Popover
                        placement="bottom"
                        content={userDetails}
                        onOpenChange={() => renderUserDetails(item.userName)}
                      >
                        <div className="timeline-badge MOVED_DELETED_TO_SUGGESTED">
                          {splitUserName(item.userName)}
                        </div>
                      </Popover>
                    </Tooltip>
                  ) : item.action == "MOVED_SUGGESTED_TO_DELETED" ? (
                    <Tooltip title={item.userName} placement="bottom">
                      <Popover
                        placement="bottom"
                        content={userDetails}
                        onOpenChange={() => renderUserDetails(item.userName)}
                      >
                        <div className="timeline-badge MOVED_SUGGESTED_TO_DELETED">
                          {splitUserName(item.userName)}
                        </div>
                      </Popover>
                    </Tooltip>
                  ) : item.action == "ENCOUNTER_FILE_UPDATED" ? (
                    <Tooltip title={item.userName} placement="bottom">
                      <Popover
                        placement="bottom"
                        content={userDetails}
                        onOpenChange={() => renderUserDetails(item.userName)}
                      >
                        <div className="timeline-badge ENCOUNTER_FILE_UPDATED">
                          {splitUserName(item.userName)}
                        </div>
                      </Popover>
                    </Tooltip>
                  ) : item.action == "ENCOUNTER_FILE_ADDED" ? (
                    <Tooltip title={item.userName} placement="bottom">
                      <Popover
                        placement="bottom"
                        content={userDetails}
                        onOpenChange={() => renderUserDetails(item.userName)}
                      >
                        <div className="timeline-badge ENCOUNTER_FILE_ADDED">
                          {splitUserName(item.userName)}
                        </div>
                      </Popover>
                    </Tooltip>
                  ) : item.action == "HOLD" ? (
                    <Tooltip title={item.userName} placement="bottom">
                      <Popover
                        placement="bottom"
                        content={userDetails}
                        onOpenChange={() => renderUserDetails(item.userName)}
                      >
                        <div className="timeline-badge HOLD">
                          {splitUserName(item.userName)}
                        </div>
                      </Popover>
                    </Tooltip>
                  ) : item.action == "DECLINED" ? (
                    <Tooltip title={item.userName} placement="bottom">
                      <Popover
                        placement="bottom"
                        content={userDetails}
                        onOpenChange={() => renderUserDetails(item.userName)}
                      >
                        <div className="timeline-badge DECLINED">
                          {splitUserName(item.userName)}
                        </div>
                      </Popover>
                    </Tooltip>
                  ) : item.action == "PENDING" ? (
                    <Tooltip title={item.userName} placement="bottom">
                      <Popover
                        placement="bottom"
                        content={userDetails}
                        onOpenChange={() => renderUserDetails(item.userName)}
                      >
                        <div className="timeline-badge DECLINED">
                          {splitUserName(item.userName)}
                        </div>
                      </Popover>
                    </Tooltip>
                  ) : (
                    <Tooltip title={item.userName} placement="bottom">
                      <Popover
                        placement="bottom"
                        content={userDetails}
                        onOpenChange={() => renderUserDetails(item.userName)}
                      >
                        <div className="timeline-badge DECLINED">
                          {splitUserName(item.userName)}
                        </div>
                      </Popover>
                    </Tooltip>
                  )}
                  <a className="timeline-panel text-muted">
                    {item.action == "MOVED_INVALID_TO_VALID" ? (
                      <span className={visitStyles.timelineheading}>
                        {item.diagnosisCode} - Moved from invalid to valid
                      </span>
                    ) : item.action == "MOVED_SUGGESTED_TO_VALID" ? (
                      <span className={visitStyles.timelineheading}>
                        {item.diagnosisCode} - Moved from Suggested to valid
                      </span>
                    ) : item.action == "MOVED_VALID_TO_SUGGESTED" ? (
                      <span className={visitStyles.timelineheading}>
                        {item.diagnosisCode} - Moved from valid to suggested
                      </span>
                    ) : item.action == "VALID_DISEASE_ADDED" ? (
                      <span className={visitStyles.timelineheading}>
                        {item.diagnosisCode} - Valid from disease added
                      </span>
                    ) : item.action == "MOVED_VALID_TO_DELETED" ? (
                      <span className={visitStyles.timelineheading}>
                        {item.diagnosisCode} - Moved from valid to deleted
                      </span>
                    ) : item.action == "AUDITED" ? (
                      <span className={visitStyles.timelineheading}>
                        Changed from {""}
                        {item.previousProcessedState} to AUDITED
                      </span>
                    ) : item.action == "REAUDIT" ? (
                      <span className={visitStyles.timelineheading}>
                        Changed from {""}
                        {item.previousProcessedState} to REAUDIT
                      </span>
                    ) : item.action == "AUDITHOLD" ? (
                      <span className={visitStyles.timelineheading}>
                        Changed from {""}
                        {item.previousProcessedState} to AUDITHOLD
                      </span>
                    ) : item.action == "AUDITPENDING" ? (
                      <span className={visitStyles.timelineheading}>
                        Changed from {""}
                        {item.previousProcessedState} to AUDITPENDING
                      </span>
                    ) : item.action == "MEAT_QUERY_STORED" ? (
                      <span className={visitStyles.timelineheading}>
                        Changed from {""}
                        {item.previousProcessedState} to Meat Query Stored
                      </span>
                    ) : item.action == "COMPLETED" ? (
                      <span
                        className={visitStyles.timelineheading}
                        style={{ display: "flex" }}
                      >
                        {`Changed from`}
                        <span
                          style={{
                            padding: "0 5px 0 5px",
                            color:
                              item?.previousProcessedState === "COMPLETED"
                                ? "#5da934"
                                : item?.previousProcessedState === "PENDING"
                                ? "#3a9b94"
                                : item?.previousProcessedState === "HOLD"
                                ? "#ad94fa"
                                : "",
                            fontWeight: "700",
                          }}
                        >
                          {item.previousProcessedState}
                        </span>
                        {` to`}
                        <span
                          style={{
                            color: "#5da934",
                            fontWeight: "700",
                            paddingLeft: "5px",
                          }}
                        >
                          COMPLETED
                        </span>
                        {/* Changed from
                        {item.previousProcessedState} to COMPLETD */}
                      </span>
                    ) : item.action == "MOVED_DELETED_TO_VALID" ? (
                      <span className={visitStyles.timelineheading}>
                        {item.diagnosisCode} - Moved from deleted to valid
                      </span>
                    ) : item.action == "MOVED_DELETED_TO_SUGGESTED" ? (
                      <span className={visitStyles.timelineheading}>
                        {item.diagnosisCode} - Moved from deleted to suggested
                      </span>
                    ) : item.action == "MOVED_SUGGESTED_TO_DELETED" ? (
                      <span className={visitStyles.timelineheading}>
                        {item.diagnosisCode} - Moved from suggested to deleted
                      </span>
                    ) : item.action == "ENCOUNTER_FILE_UPDATED" ? (
                      <span className={visitStyles.timelineheading}>
                        {item.diagnosisCode} - Encounter file updated
                      </span>
                    ) : item.action == "ENCOUNTER_FILE_ADDED" ? (
                      <span className={visitStyles.timelineheading}>
                        {item.diagnosisCode} - Encounter file added
                      </span>
                    ): item.action == "MEAT_ADDED" ? (
                      <span className={visitStyles.timelineheading}>
                        {item.diagnosisCode} - Meat added
                      </span>
                    )  : item.action == "HOLD" ? (
                      <span
                        className={visitStyles.timelineheading}
                        style={{ display: "flex" }}
                      >
                        {`Changed from`}
                        <span
                          style={{
                            padding: "0 5px 0 5px",
                            color:
                              item?.previousProcessedState === "COMPLETED"
                                ? "#5da934"
                                : item?.previousProcessedState === "PENDING"
                                ? "#3a9b94"
                                : item?.previousProcessedState === "HOLD"
                                ? "#ad94fa"
                                : "",
                            fontWeight: "700",
                          }}
                        >
                          {item.previousProcessedState}
                        </span>
                        {` to`}
                        <span
                          style={{
                            color: "#ad94fa",
                            fontWeight: "700",
                            paddingLeft: "5px",
                          }}
                        >
                          HOLD
                        </span>
                      </span>
                    ) : item.action == "DECLINED" ? (
                      <span
                        className={visitStyles.timelineheading}
                        style={{ display: "flex" }}
                      >
                        {`Changed from`}
                        <span
                          style={{
                            padding: "0 5px 0 5px",
                            fontWeight: "700",
                            color:
                              item?.previousProcessedState === "COMPLETED"
                                ? "#5da934"
                                : item?.previousProcessedState === "PENDING"
                                ? "#3a9b94"
                                : item?.previousProcessedState === "HOLD"
                                ? "#ad94fa"
                                : "",
                          }}
                        >
                          {item.previousProcessedState}
                        </span>
                        {` to`}
                        <span
                          style={{
                            color: "red",
                            fontWeight: "700",
                            paddingLeft: "5px",
                          }}
                        >
                          DECLINED
                        </span>
                        {/* Changed from
                      {item.previousProcessedState} to
                      DECLINED */}
                      </span>
                    ) : item.action == "PENDING" ? (
                      <span
                        className={visitStyles.timelineheading}
                        style={{ display: "flex" }}
                      >
                        {`Changed from`}
                        <span
                          style={{
                            padding: "0 5px 0 5px",
                            fontWeight: "700",
                            color:
                              item?.previousProcessedState === "COMPLETED"
                                ? "#5da934"
                                : item?.previousProcessedState === "PENDING"
                                ? "#3a9b94"
                                : item?.previousProcessedState === "HOLD"
                                ? "#ad94fa"
                                : "",
                          }}
                        >
                          {item.previousProcessedState}
                        </span>
                        {` to`}
                        <span
                          style={{
                            color: "#3a9b94",
                            fontWeight: "700",
                            paddingLeft: "5px",
                          }}
                        >
                          PENDING
                        </span>
                        {/* Changed from
                        {item.previousProcessedState} to DECLINED */}
                      </span>
                    ) : <span className={visitStyles.timelineheading}>
                    Changed from {""}
                    {item.previousProcessedState} to {underScoreRemove(item.action)}
                  </span>}
                    <span className={visitStyles.timelineDate}>
                      {moment(item.createdDate).format("MM-DD-YYYY hh:mm:A")}
                    </span>
                  </a>
                </li>
              ))}
              {timelineData?.length == 0 ? (
                <h6 className="text-center">NO DATA</h6>
              ) : null}
            </ul>
          </div>
        </>
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
