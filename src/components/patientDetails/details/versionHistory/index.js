import React, { useState } from "react";
import visitStyles from "../../../../styles/visitdata.module.css";
import { Popconfirm, Popover, Tooltip } from "antd";
import styles from "../timline/styles.module.css";
import { CloseCircleFilled } from "@ant-design/icons";
import { getProviderNameTagList } from "../components/function/ProviderHyperlinks";
import { getDateOfServiceBackground } from "../components/function/DateOfServices";
import {
  getSectionHeaderBackground,
  getSectionHeadersBackground,
} from "../components/function/SectionHeader";
import CardSkeleton from "../../../skeleton/card";
import { formatDateTime, getResponePopup } from "../../../../utils/reusable";
import { getBadgeClassName, getTimelineHeading } from "../timline";
import { getStorage } from "../../../../utils/storages";

const VersionHistory = ({
  getRevertDetails,
  revertLoading,
  confirmRevert,
  userDetails,
  renderUserDetails,
  isDosSelected,
  dosYearDefalutSelect,
  getPatientListToDetails,
  setIsModalComments,
  getpatientDetailsData,
}) => {
  const userId = getStorage("patientId");
  const handleConfirm = async (item) => {
    const response = await confirmRevert({
      dos: isDosSelected,
      year: dosYearDefalutSelect?.value,
      versionHistory: item,
    });
    if (response?.status == "SUCCESS") {
      setIsModalComments(false);
      getResponePopup(response);
      getpatientDetailsData(userId,dosYearDefalutSelect?.value,isDosSelected);
    }
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
        {!item?.isCurrentVersion ? (
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
