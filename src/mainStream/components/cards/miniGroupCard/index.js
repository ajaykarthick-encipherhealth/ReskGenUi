import React from "react";
import { Empty, Popover, Avatar } from "antd";
import dayjs from "dayjs";
import EditButton from "../../../../images/adminUsers/EditButton";
import { renderUserPrfoileAvatar } from "../../../../components/headerFilters/functions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";

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
    <div>
      {data?.length > 0 ? (
        <div
          key={index}
          style={{ marginBottom: "0px", cursor: "pointer" }}
          className={`${styles.card} ${
            index === selectedCardIndex ? styles.selectedCard : ""
          } py-3`}
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
                <div className={`${styles.pName}`}>
                  {item.reportName}
                  
                    <div className={`${styles.headText}`}>
                      {item._id}
                    </div>
                  
                  <div className="d-flex">
                    <div className={`${styles.dateText}`}>
                      {handleDateFormat(item.sendDate)}
                    </div>
                  </div>
                </div>
                <div className={`${styles.text}`}>
                  <Avatar.Group maxCount={2}>
                    {item?.receivedUsers?.map((data, index) => {
                      const { firstName, lastName, profileImageUrl } =
                        data?.userDetails || {};
                      if (!firstName && !lastName) return null;
                      return (
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
                                {firstName} {lastName}
                              </div>
                              {profileImageUrl && (
                                <img
                                  src={profileImageUrl}
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
                                    firstName,
                                    lastName,
                                    profileImageUrl,
                                    "header"
                                  )}
                                </div>

                                <div>
                                  {firstName} {lastName}
                                </div>
                              </div>
                            )}
                          </div>
                        </Popover>
                      );
                    })}
                  </Avatar.Group>
                </div>
                <div className={`${styles.dataContainer}`}>
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedRows(item);
                      dispatch(selectedReport(item));
                      setOpenEdit(true);
                    }}
                  >
                    {/* <EditButton /> */}
                    <FontAwesomeIcon icon={faPenToSquare} />
                  </div>
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
