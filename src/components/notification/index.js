import React, { useEffect, useState } from "react";
import Chat from "../chat/index";
import { Button, Tooltip } from "antd";
import style from "./styles.module.css";
import moment from "moment";
import { connect } from "react-redux";
import { actions as webSocketActions } from "../../stores/websocket";
import { actions as dashbaordActions } from "../../stores/reviewer/dashboard";
import { getStorage } from "../../utils/storages";
import { getPriorityStyle } from "../../pages/tenantadmin/notifications/noficationCard";
import Card from "../card";
import { formatDateTime } from "../../utils/reusable";
import RegularButton from "../button";

const Notification = ({
  open,
  notificationResponse,
  webSocketData,
  getNotificationData,
  webSocketNotificationData,
  getNotificationList,
}) => {
  const [openMsg, setOpenMsg] = useState(false);
  const notificationData = notificationResponse?.notificationList?.content;
  const [loading, setLoading] = useState(false);


  const splitUserName = (name) => {
    if (name) {
      return name[0]?.toUpperCase();
    }
  };
  
  useEffect(() => {
    if (open) {
      const userId = getStorage("userId");
      getNotificationList(userId);
    }
  }, [open]);

  useEffect(() => {
    if (notificationData) {
      getNotificationData(notificationData);
    }
  }, [notificationData]);

  useEffect(() => {}, [webSocketNotificationData]);

return (
  <div className="card-body chatbox contacts_body p-0" id="DZ_W_Contacts_Body">
    {!openMsg && !loading ? (
      <div className={`d-grid pt-4 align-items-center ${style.cardGrid}`}>
        {notificationData?.map((notification, index) => (
          <div
            key={index}
            className="col-12 m-2 col-md-6 col-lg-6 col-xl-3 col-l-6"
          >
            <Card padding="20px" borderRadius="5px" width="97%">
              <div
                className={`${style.cardContainer} justify-content-between align-items-center`}
              >
                <div>
                  {/* Notification Type + Blue Dot */}
                  <div
                    className="d-flex justify-content-between p-1 fw-bold align-items-center cr-pointer"
                    style={{ color: "#2983E3" }}
                  >
                    <div
                      className={`${style.cardContent} text-gray-600 text-truncate`}
                    >
                      {notification?.notificationType
                        ?.replaceAll("_", " ")
                        .toLowerCase()
                        .replace(/\b\w/g, (c) => c.toUpperCase())}
                    </div>
                    {notification.read === false && (
                      <span
                        className="rounded-circle me-2"
                        style={{
                          width: "10px",
                          height: "10px",
                          backgroundColor: "#3A88F8",
                        }}
                      ></span>
                    )}
                  </div>

                  {/* From User Info */}
                  <div className="d-flex p-1 fw-bold align-items-center cr-pointer">
                    <span
                      className={`${style.cardContent} fw-bold text-gray-600 text-truncate`}
                    >
                      {notification?.fromUserDetails?.firstName}{" "}
                      {notification?.fromUserDetails?.lastName}
                    </span>

                    <div
                      id="table-btn"
                      name="table-btn"
                      className="d-flex mx-4 justify-content-center align-items-center"
                    >
                      <span
                        style={{ borderRadius: "5px", fontSize: "12px" }}
                        data-testid="table-custom"
                        name="table-custom"
                        className="px-2 w-full font1 text-ellipsis tableButton cursor-default pointer-events-none"
                      >
                        {notification?.fromUserDetails?.role
                          ?.map((role) =>
                            role
                              .replaceAll("_", " ")
                              .toLowerCase()
                              .replace(/\b\w/g, (c) => c.toUpperCase())
                          )
                          .join(", ")}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="d-flex p-1 align-items-center cr-pointer">
                    <Tooltip title={notification?.content}>
                      <span
                        className={`${style.cardContent} text-gray-600 text-truncate`}
                      >
                        {notification?.content}
                      </span>
                    </Tooltip>
                  </div>

                  {/* Action and Date */}
                  <div className="d-flex pt-3 justify-content-between align-items-center">
                    <Button
                      className="text-white"
                      style={{ backgroundColor: "#3A88F8" }}
                    >
                      Go to File
                    </Button>
                    <div>
                      {notification?.createdDate
                        ? formatDateTime({
                            date: notification?.createdDate,
                            formatType: "dateTime",
                          })
                        : "---"}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>
    ) : null}

    {/* Chat component always renders */}
    <Chat openMsg={openMsg} offMsg={() => setOpenMsg(false)} />
  </div>
);

};

const enhancer = connect(
  (state) => ({
    notificationResponse:
      state?.reviewer?.dashboard?.notification?.data?.response,
    webSocketData: state?.tenantAdmin?.webSocket?.webSocketDetails?.data,
    webSocketNotificationData:
      state?.tenantAdmin?.webSocket?.webSocketNotificationDetails?.data,
  }),
  {
    getNotificationData: webSocketActions.websocketNotificationAction,
    getNotificationList: dashbaordActions.notificationAction,
  }
);
export default enhancer(Notification);
