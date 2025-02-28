import React from "react";
import { Avatar, Tooltip } from "antd";
import Card from "../../../../components/card";
import style from "../style.module.css";
import {
  getBackgroundColor,
  renderUserPrfoileAvatar,
} from "../../../../components/headerFilters/functions";
const NotificationCard = ({ priority, notificationList, loader }) => {
  const getRandomColor = (name) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const randomNumber = (Math.abs(hash) % 6) + 1;
    return getBackgroundColor(randomNumber);
  };

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case "High":
        return (
          <div
            className="p-1"
            style={{
              backgroundColor: "#FADBDB",
              color: "#E43232",
              borderRadius: "2px",
            }}
          >
            High
          </div>
        );

      case "Medium":
        return (
          <div
            className="p-1"
            style={{
              backgroundColor: "  #DFF3FB",
              color: "#126889",
              borderRadius: "2px",
            }}
          >
            Medium
          </div>
        );
      case "General":
        return (
          <div
            className="p-1"
            style={{
              backgroundColor: "#F8EDDD",
              color: "#82691C",
              borderRadius: "2px",
            }}
          >
            General
          </div>
        );
      default:
        return (
          <div
            className="p-1"
            style={{
              backgroundColor: "#F8EDDD",
              color: "#82691C",
              borderRadius: "2px",
            }}
          >
            General
          </div>
        );
    }
  };
  return (
    
    <div className={`d-grid pt-4 gap-3 align-items-center ${style.cardGrid}`}>
      {notificationList?.map((notification, index) => (
        <div key={index} className="col-12 col-md-6 col-lg-6 col-xl-3 col-l-6">
          <Card padding="20px" borderRadius="5px">
            <div
              style={{ marginRight: "20px" }}
              className="  d-flex justify-content-between align-items-center"
            >
              <div>
                <h3 className="text-lg font4">
                  {" "}
                  <div>
                    {notification.userFromDto?.firstName ||
                    notification.userFromDto?.lastName ||
                    notification?.userFromDto?.profileImageUrl ? (
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <span style={{ marginRight: "10px" }}>
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
                      <div style={{ textAlign: "center" }}>---</div>
                    )}
                  </div>
                </h3>
                <div className="d-flex align-items-center cr-pointer">
                  <Tooltip title={notification?.content}>
                    <span
                      style={{ maxWidth: "348px" }}
                      className="text-gray-600   text-truncate"
                    >
                      {notification?.content}
                    </span>
                  </Tooltip>
                  <span
                    style={{ color: "#888888" }}
                    className=" text-truncate text-xs text-gray-500 p-2 font1"
                  >
                    {" "}
                    - {notification?.createdDate}
                  </span>
                </div>
              </div>

              <div>
                <span className=" text-center">
                  {getPriorityStyle(priority)}
                </span>

                <div className="mt-4 cr-pointer">
                  <Avatar.Group
                    maxCount={3}
                    size="medium"
                    style={{ cursor: "pointer" }}
                    overlayStyle={{
                      maxHeight: "50px !important",
                      maxWidth: "30px !important",
                      overflowY: "scroll !important",
                    }}
                  >
                    {notification.userToDtoList?.map((user, index) => {
                      const initials = `${user.firstName?.charAt(0) || ""}${
                        user.lastName?.charAt(0) || ""
                      }`;
                      return (
                        <Tooltip
                          key={index}
                          title={`${user.firstName} ${user.lastName}`}
                          placement="top"
                        >
                          {user.profileImageUrl ? (
                            <Avatar
                              src={user.profileImageUrl}
                              alt={user.firstName}
                              style={{ cursor: "pointer", marginTop: "10px" }}
                            />
                          ) : (
                            <Avatar
                              style={{
                                backgroundColor: getRandomColor(user.firstName),
                                color: "#fff",
                                cursor: "pointer",
                                marginBottom: "10px",
                              }}
                            >
                              {initials.toUpperCase()}
                            </Avatar>
                          )}
                        </Tooltip>
                      );
                    })}
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
