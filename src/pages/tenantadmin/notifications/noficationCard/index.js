import React from "react";
import { Avatar, Popover, Tooltip } from "antd";
import Card from "../../../../components/card";
import style from "../style.module.css";
import { renderUserPrfoileAvatar } from "../../../../components/headerFilters/functions";
import { createIdGen, formatDateTime } from "../../../../utils/reusable";
import { useRouter } from "next/router";
const NotificationCard = ({ notificationList, id }) => {

  const router = useRouter();
  const getPriorityStyle = (priority) => {
    switch (priority) {
      case "HIGH":
        return <div className={`${style.high} px-3 py-1`}>High</div>;

      case "MEDIUM":
        return <div className={`${style.medium} px-3 py-1`}>Medium</div>;

      case "GENERAL":
        return <div className={`${style.general} px-3 py-1`}>General</div>;

      default:
        return <div className={`${style.general} px-3 py-1`}>General</div>;
    }
  };

  const MAX_VISIBLE_USERS = 3;
  return (
    <div className={`d-grid pt-4 gap-3 align-items-center ${style.cardGrid}`}>
      {notificationList?.map((notification, index) => (
        <div
          id={
            id
              ? createIdGen("card " + index)
              : createIdGen("card " + index + router.pathname.replaceAll(" "))
          }
          key={index}
          className="col-12 col-md-6 col-lg-6 col-xl-3 col-l-6"
        >
          <Card padding="20px" borderRadius="5px">
            <div
              className={`${style.cardContainer} d-flex justify-content-between align-items-center`}
            >
              <div>
                <h3 className="text-lg font4">
                  {" "}
                  <div>
                    {notification.userFromDto?.firstName ||
                    notification.userFromDto?.lastName ||
                    notification?.userFromDto?.profileImageUrl ? (
                      <div className="d-flex align-items-center">
                        <span className="me-2">
                          {renderUserPrfoileAvatar(
                            notification.userFromDto?.firstName,
                            notification.userFromDto?.lastName,
                            notification?.userFromDto?.profileImageUrl,
                            "header"
                          )}
                        </span>

                        <div className="d-flex flex-column">
                          <div>
                            {notification.userFromDto?.firstName}{" "}
                            {notification.userFromDto?.lastName}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">---</div>
                    )}
                  </div>
                </h3>
                <div className="d-flex align-items-center cr-pointer">
                  <Tooltip title={notification?.content}>
                    <span
                      className={`${style.cardContent} text-gray-600 text-truncate`}
                    >
                      {notification?.content}
                    </span>
                  </Tooltip>
                  <span
                    style={{ color: "#888888" }}
                    className=" text-truncate text-xs text-gray-500  font1"
                  >
                    <span className="p-1">-</span>
                    {notification?.createdDate
                      ? formatDateTime({
                          date: notification?.createdDate,
                          formatType: "dateTime",
                        })
                      : "---"}
                  </span>
                </div>
              </div>
              <div className="d-flex flex-column align-items-center">
                <div className=" text-center">
                  {getPriorityStyle(notification?.notificationCategories)}
                </div>

                <div
                  className={`mt-2 cr-pointer`}
                  id={
                    id
                      ? createIdGen("avatarBadge " + index)
                      : createIdGen(
                          "avatarBadge" +
                            index +
                            router.pathname.replaceAll(" ")
                        )
                  }
                >
                  <Avatar.Group>
                    {notification?.userToDtoList
                      ?.slice(0, MAX_VISIBLE_USERS)
                      .map((user, idx) => {
                        const { firstName, lastName, profileImageUrl } =
                          user || {};
                        const initials = `${firstName?.charAt(0) || ""}${
                          lastName?.charAt(0) || ""
                        }`;

                        return (
                          <div
                            key={idx}
                            id={
                              id
                                ? createIdGen("avatarPop " + idx)
                                : createIdGen(
                                    "avatarPop-" +
                                      idx +
                                      router.pathname.replaceAll(" ")
                                  )
                            }
                          >
                            <Popover
                              content={
                                <div className="d-flex align-items-center justify-content-center flex-column">
                                  <div className="d-flex align-items-center">
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
                                      className={style.profileImage}
                                    />
                                  )}
                                </div>
                              }
                            >
                              <div
                             
                                className="d-inline-block me-1"
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

                    {notification?.userToDtoList?.length >
                      MAX_VISIBLE_USERS && (
                      <div>
                        <Popover
                          content={
                            <div
                              className="p-2 overflow-auto"
                              style={{ maxHeight: "150px" }}
                            >
                              {notification.userToDtoList
                                .slice(MAX_VISIBLE_USERS)
                                .map((user, idx) => {
                                  const {
                                    firstName,
                                    lastName,
                                    profileImageUrl,
                                  } = user || {};
                                  return (
                                    <div
                                      className="d-flex align-items-center"
                                      key={idx}
                                    >
                                      <div
                                        className="m-1"
                                        id={user?.user}
                                        name={user?.user}
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
                          <div id="badgeCount" className={style.avatarBadge}>
                            +
                            {notification.userToDtoList.length -
                              MAX_VISIBLE_USERS}
                          </div>
                        </Popover>
                      </div>
                    )}
                  </Avatar.Group>
                </div>
              </div>
            </div>
          </Card>
        </div>
      ))}
    </div>
  );
};
export default NotificationCard;
