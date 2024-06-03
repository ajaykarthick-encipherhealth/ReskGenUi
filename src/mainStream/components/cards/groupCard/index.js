import React from "react";
import { Empty, Popover, Avatar } from "antd";
import dayjs from "dayjs";
import { renderUserPrfoileAvatar } from "../../../../components/headerFilters/functions";

const GroupCard = ({ data, handleReceiverReport, styles, item, index }) => {
  const handleDateFormat = (date) => {
    return dayjs(date).format("MM-DD-YYYY");
  };

  const accessTemplate = (item) => {
    switch (item?.role) {
      case "READ":
        return <span className={styles.readStyle}>Read</span>;

      case "DOWNLOAD":
        return <span className={styles.downloadStyle}>Download</span>;

      default:
        return null;
    }
  };

  return (
    <div className={styles.cardContainer}>
      {data?.length > 0 ? (
        <div
          style={{ marginBottom: "10px" }}
          className={`${styles.card} ${styles.selectedCard}`}
          onClick={() => handleReceiverReport(item)}
        >
          <div className={styles.contentGroup}>
            <div className="col-xl-12">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingBottom: "5px",
                }}
              >
                <div className={`col-xl-6 ${styles.pName}`}>
                  {item.reportName}
                </div>
                <div className={`col-xl-2 ${styles.dataContainer}`}>
                  <div className={`col-xl-2 `}>{accessTemplate(item)}</div>
                </div>
              </div>
              <div style={{ paddingBottom: "5px" }}>
                <div className={`col-xl-12 ${styles.headText}`}>{item.id}</div>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <div className={`col-xl-2 ${styles.text}`}>
                  {handleDateFormat(item.sendDate)}
                </div>
                <div className={`col-xl-4 ${styles.text}`}>
                  <Avatar.Group maxCount={2}>
                    <Popover
                      key={index}
                      content={
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            flexDirection: "column",
                          }}
                        >
                          <div
                            style={{
                              padding: "10px",
                            }}
                          >
                            {item?.senderDetails?.firstName}{" "}
                            {item?.senderDetails?.lastName}
                          </div>
                          {item?.senderDetails?.profileImageUrl && (
                            <img
                              src={item.senderDetails.profileImageUrl}
                              alt="Profile"
                              style={{
                                maxWidth: "100px",
                                maxHeight: "100px",
                              }}
                            />
                          )}
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
                            {renderUserPrfoileAvatar(
                              item?.senderDetails?.firstName,
                              item?.senderDetails?.lastName,
                              item?.senderDetails?.profileImageUrl,
                              "header"
                            )}
                          </div>

                          <div>
                            {item?.senderDetails?.firstName}{" "}
                            {item?.senderDetails?.lastName}
                          </div>
                        </div>
                      </div>
                    </Popover>
                  </Avatar.Group>
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
