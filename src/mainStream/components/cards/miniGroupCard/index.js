import React from "react";
import { Empty, Popover, Avatar } from "antd";
import dayjs from "dayjs";
import EditButton from "../../../../images/adminUsers/EditButton";
import { renderUserPrfoileAvatar } from "../../../../components/headerFilters/functions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { createIdGen, formatDateTime } from "../../../../utils/reusable";
import { useRouter } from "next/router";

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
  id,
  activeTab,
}) => {
  const router = useRouter();
  const handleEditClick = (e, item) => {
    e.stopPropagation();
    setSelectedRows(item);
    selectedReport(item);
    setOpenEdit(true);
    if (onEditClick) {
      onEditClick(item?.reportName);
    }
  };

  const MAX_VISIBLE_USERS = 1;
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
                className="cr-pointer d-flex align-items-center justify-content-between"
              >
                <div className={`${styles.pName}`}>
                  {item.reportName}
                  <div className={`${styles.headText}`}>{item._id}</div>
                  <div className="d-flex">
                    <div className={`${styles.dateText}`}>
                      {item?.sendDate
                        ? formatDateTime({ date: item.sendDate })
                        : "---"}
                    </div>
                  </div>
                </div>
                <div
                  id={
                    id
                      ? createIdGen("avatargroup" + index)
                      : createIdGen(
                          "avatargroup " +
                            index +
                           router.pathname.replaceAll("/", " ")
                        )
                  }
                  className={`${styles.text}`}
                >
                  <Avatar.Group>
                    {item?.receivedUsers
                      ?.slice(0, MAX_VISIBLE_USERS)
                      .map((data, index) => {
                        const { firstName, lastName, profileImageUrl } =
                          data?.userDetails || {};
                        if (!firstName && !lastName) return null;

                        return (
                          <div
                            id={
                              id
                                ? createIdGen("avatar" + index)
                                : createIdGen(
                                    "avatar " +
                                      index +
                                     router.pathname.replaceAll("/", " ")
                                  )
                            }
                          >
                            <Popover
                              key={index}
                              content={
                                <div className="d-flex align-items-center justify-content-center flex-column ">
                                  <div
                                    className="d-flex align-items-center"
                                    key={index}
                                  >
                                    <div className="m-2">
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
                          </div>
                        );
                      })}

                    {item?.receivedUsers?.length > MAX_VISIBLE_USERS && (
                      <div
                        id={
                          id
                            ? createIdGen("profile" + index)
                            : createIdGen(
                                "profile " +
                                  index +
                                 router.pathname.replaceAll("/", " ")
                              )
                        }
                      >
                        <Popover
                          content={
                            <div style={{ padding: "10px" }}>
                              {item.receivedUsers
                                .slice(MAX_VISIBLE_USERS)
                                .map((data, index) => {
                                  const {
                                    firstName,
                                    lastName,
                                    profileImageUrl,
                                  } = data?.userDetails || {};
                                  return (
                                    <div
                                      className="d-flex align-items-center"
                                      key={index}
                                    >
                                      <div
                                        id={data?.user}
                                        name={data?.user}
                                        className="m-1"
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
                      </div>
                    )}
                  </Avatar.Group>
                </div>
                <div
                  id={
                    id
                      ? createIdGen("editIcon" + index)
                      : createIdGen(
                          "editIcon " +
                            index +
                           router.pathname.replaceAll("/", " ")
                        )
                  }
                  className={`${styles.dataContainer}`}
                >
                  <div
                    onClick={(e) => handleEditClick(e, item)}
                    id={
                      id
                        ? createIdGen("edit" + index)
                        : createIdGen(
                            "edit " +
                              index +
                             router.pathname.replaceAll("/", " ")
                          )
                    }
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
