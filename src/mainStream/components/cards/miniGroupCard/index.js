import React from "react";
import { Empty, Popover, Avatar } from "antd";
import dayjs from "dayjs";
import EditButton from "../../../../images/adminUsers/EditButton";
import { renderUserPrfoileAvatar } from "../../../../components/headerFilters/functions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { formatDateTime } from "../../../../utils/reusable";

const CardComponent = ({
  data,
  selectedCardIndex,
  handleReceiverReport,
  setSelectedRows,
  selectedReport,
  setOpenEdit,
  styles,
  item,
  index,
  onEditClick,
  prefillData
}) => {
  const handleDateFormat = (date) => {
    return dayjs(date).format("MM-DD-YYYY");
  };
  const MAX_VISIBLE_USERS = 1;
  return (
    <div>
      {data?.length > 0 ? (
        <div
          id={data?.reportName}
          name={data?.reportName}
          key={index}
          style={{ marginBottom: "0px" }}
          className={`${styles.card} ${
            index === selectedCardIndex ? styles.selectedCard : ""
          } py-3`}
          onClick={() => handleReceiverReport(item)}
        >
          <div className={styles.contentGroup}>
            <div className="col-12">
              <div
                id="badge"
                className="cr-pointer"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div className={`${styles.pName}`}>
                  {item.reportName}
                  <div className={`${styles.headText}`}>{item._id}</div>
                  <div className="d-flex">
                    <div className={`${styles.dateText}`}>
                      {item.sendDate ? formatDateTime({date: item.sendDate}) : "---"}
                    </div>
                  </div>
                </div>
                <div className={`${styles.text}`}>
                  <Avatar.Group>
                    {item?.receivedUsers
                      ?.slice(0, MAX_VISIBLE_USERS)
                      .map((data, index) => {
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
                                  className="d-flex align-items-center"
                                  key={index}
                                >
                                  <div style={{ marginRight: "10px" }}>
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
                              id={data?.user}
                              name={data?.user}
                              style={{
                                display: "inline-block",
                                marginRight: "5px",
                              }}
                            >
                              {renderUserPrfoileAvatar(
                                firstName,
                                lastName,
                                profileImageUrl,
                                "header"
                              )}
                            </div>
                          </Popover>
                        );
                      })}

                    {item?.receivedUsers?.length > MAX_VISIBLE_USERS && (
                      <Popover
                        content={
                          <div style={{ padding: "10px" }}>
                            {item.receivedUsers
                              .slice(MAX_VISIBLE_USERS)
                              .map((data, index) => {
                                const { firstName, lastName, profileImageUrl } =
                                  data?.userDetails || {};
                                return (
                                  <div
                                    className="d-flex align-items-center"
                                    key={index}
                                  >
                                    <div className="m-1">
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
                                );
                              })}
                          </div>
                        }
                      >
                        <div
                          id="badge"
                          style={{
                            display: "inline-flex",
                            justifyContent: "center",
                            alignItems: "center",
                            fontSize: "14px",
                            cursor: "pointer",
                            height: "28px",
                            width: "28px",
                            borderRadius: "50%",
                            backgroundColor: "#04306f",
                            color: "white",
                          }}
                        >
                          +{item.receivedUsers.length - MAX_VISIBLE_USERS}
                        </div>
                      </Popover>
                    )}
                  </Avatar.Group>
                </div>
                <div className={`${styles.dataContainer}`}>
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedRows(item);
                      selectedReport(item);
                      setOpenEdit(true);
                        if (onEditClick) {
                        onEditClick(item?.reportName);
                      } 
                    }}
                    id="edit-Btn"
                    name="edit-Btn"
                  >
                    {/* <EditButton /> */}
                    <FontAwesomeIcon
                      id="editIcon"
                      name="editIcon"
                      icon={faPenToSquare}
                    />
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
