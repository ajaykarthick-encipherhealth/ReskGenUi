import React from "react";
import { Empty, Popover, Avatar } from "antd";
import dayjs from "dayjs";
import EditButton from "../../../../images/adminUsers/EditButton";
import { renderUserPrfoileAvatar } from "../../../../components/headerFilters/functions";

const CardComponent = ({
  data,
  selectedCardIndex,
  handleReceiverReport,
  setSelectedRows,
  dispatch,
  selectedReport,
  setOpenEdit,
  styles,
  item,
  index,
}) => {
  const handleDateFormat = (date) => {
    return dayjs(date).format("MM-DD-YYYY");
  };
  return (
    <div className={styles.cardContainer}>
      {data?.length > 0 ? (
        <div
          key={index}
          style={{ marginBottom: "10px" }}
          className={`${styles.card} ${
            index === selectedCardIndex ? styles.selectedCard : ""
          }`}
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
                  <div
                    onClick={() => {
                      setSelectedRows(item);
                      dispatch(selectedReport(item));
                      setOpenEdit(true);
                    }}
                  >
                    <EditButton />
                  </div>
                </div>
              </div>
              <div style={{ paddingBottom: "5px" }}>
                <div className={`col-xl-12 ${styles.headText}`}>{item._id}</div>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <div className={`col-xl-2 ${styles.text}`}>
                  {handleDateFormat(item.sendDate)}
                </div>
                <div className={`col-xl-4 ${styles.text}`}>
                  <Avatar.Group maxCount={2}>
                    {item?.receivedUsers?.map((data, index) => (
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
                              {data?.userDetails?.firstName}{" "}
                              {data?.userDetails?.lastName}
                            </div>
                            {data?.userDetails?.profileImageUrl && (
                              <img
                                src={data.userDetails.profileImageUrl}
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
                          {item.receivedUsers.length === 1 && (
                            <div className="d-flex justify-content-center align-items-center">
                              <div
                                style={{
                                  marginRight: "10px",
                                }}
                              >
                                {renderUserPrfoileAvatar(
                                  data?.userDetails?.firstName,
                                  data?.userDetails?.lastName,
                                  data?.userDetails?.profileImageUrl,
                                  "header"
                                )}
                              </div>

                              <div>
                                {data?.userDetails?.firstName}{" "}
                                {data?.userDetails?.lastName}
                              </div>
                            </div>
                          )}
                        </div>
                      </Popover>
                    ))}
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

export default CardComponent;
