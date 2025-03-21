import React from "react";
import { Empty, Popover, Avatar } from "antd";
import dayjs from "dayjs";
import { renderUserPrfoileAvatar } from "../../../../components/headerFilters/functions";
import { createIdGen, formatDateTime } from "../../../../utils/reusable";
import { useRouter } from "next/router";

const GroupCard = ({
  data,
  handleReceiverReport,
  styles,
  item,
  index,
  id,
  activeTab,
}) => {
  const router = useRouter();

  const accessTemplate = (item) => {
    switch (item?.role) {
      case "READ":
        return (
          <span id="read-btn" name="read-btn" className={styles.readStyle}>
            Read
          </span>
        );

      case "DOWNLOAD":
        return (
          <span
            id="download-btn"
            name="download-btn"
            className={styles.downloadStyle}
          >
            Download
          </span>
        );

      default:
        return null;
    }
  };
  return (
    <div>
      {data?.length > 0 ? (
        <div
          id={
            id
              ? createIdGen("card" + activeTab + index)
              : createIdGen(
                  "card " +
                    activeTab +
                    index +
                   router.pathname.replaceAll("/", " ")
                )
          }
          style={{ marginBottom: "0px" }}
          className={`${styles.card} ${styles.selectedCard} py-3`}
          onClick={() => handleReceiverReport(item)}
        >
          <div className={` ${styles.contentGroup}`}>
            <div className="col-12 responsive_report">
              <div
                id="badge"
                className="cr-pointer"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingBottom: "5px",
                }}
              >
                <div className={`${styles.pName}`}>
                  {item.reportName}
                  <div className={`${styles.headText}`}>{item._id}</div>
                  <div className="d-flex">
                    <div className={`${styles.dateText}`}>
                      {/* {handleDateFormat(item.sendDate)} */}
                      {item.sendDate
                        ? formatDateTime({ date: item.sendDate })
                        : "---"}
                    </div>
                  </div>
                </div>
                <div className={`${styles.text}`}>
                  <Avatar.Group maxCount={2}>
                    <div
                      id={
                        id
                          ? createIdGen("avatar" + activeTab + index)
                          : createIdGen(
                              "avatar " +
                                activeTab +
                                index +
                               router.pathname.replaceAll("/", " ")
                            )
                      }
                    >
                      <Popover
                        key={index}
                        content={
                          <div className="d-flex justify-content-center align-items-center gap-2">
                            {item?.senderDetails?.firstName ||
                            item?.senderDetails?.lastName ||
                            item?.senderDetails?.profileImageUrl
                              ? renderUserPrfoileAvatar(
                                  item?.senderDetails?.firstName,
                                  item?.senderDetails?.lastName,
                                  item?.senderDetails?.profileImageUrl,
                                  "header"
                                )
                              : "---"}
                            {item?.senderDetails?.firstName}{" "}
                            {item?.senderDetails?.lastName}
                          </div>
                        }
                      >
                        <div
                          style={{
                            display: "inline-block",
                            marginRight: "5px",
                          }}
                        >
                          <div className="d-flex justify-content-center align-items-center">
                            <div
                              style={{
                                marginRight: "10px",
                              }}
                            >
                              {item?.senderDetails?.firstName ||
                              item?.senderDetails?.lastName ||
                              item?.senderDetails?.profileImageUrl
                                ? renderUserPrfoileAvatar(
                                    item?.senderDetails?.firstName,
                                    item?.senderDetails?.lastName,
                                    item?.senderDetails?.profileImageUrl,
                                    "header"
                                  )
                                : "---"}
                            </div>

                            <div>
                              {item?.senderDetails?.firstName}{" "}
                              {item?.senderDetails?.lastName}
                            </div>
                          </div>
                        </div>
                      </Popover>
                    </div>
                  </Avatar.Group>
                </div>
                <div
                  id={
                    id
                      ? createIdGen("access" + activeTab + index)
                      : createIdGen(
                          "access " +
                            activeTab +
                            index +
                           router.pathname.replaceAll("/", " ")
                        )
                  }
                  className={`${styles.dataContainer}`}
                >
                  <div>{accessTemplate(item)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Empty />
      )}
    </div>
  );
};

export default GroupCard;
