import React, { useEffect, useState } from "react";
import Chat from "../chat/index";
import { Tooltip } from "antd";
import moment from "moment";
import { connect } from "react-redux";
import { getNotificationAlert } from "../../store/actions/NotificationAction";
import { actions as webSocketActions } from "../../stores/websocket";
import { actions as dashbaordActions } from "../../stores/reviewer/dashboard";

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
      const userId = localStorage.getItem("userId");
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
    <div
      className={`card-body chatbox contacts_body p-0`}
      id="DZ_W_Contacts_Body"
    >
      {!openMsg ? (
        <ul className="contacts">
          {!loading && (
            <>
              {webSocketNotificationData?.map((data, i) => (
                <li className="active dlab-chat-user">
                  <div className="d-flex bd-highlight">
                    <Tooltip
                      title={data?.fromUserDetails?.firstName}
                      placement="bottom"
                    >
                      <div className="img_cont">
                        <span>
                          {data?.fromUserDetails?.profileImageUrl ? (
                            <img src={data?.fromUserDetails?.profileImageUrl} />
                          ) : (
                            splitUserName(data?.fromUserDetails?.firstName)
                          )}
                        </span>
                        <span className="online_icon"></span>
                      </div>
                    </Tooltip>
                    <div className="user_info">
                      <div className="d-flex">
                        <span>{data?.content}</span>
                      </div>
                      <p>{moment(data?.createdDate).fromNow()}</p>
                    </div>
                  </div>
                </li>
              ))}
            </>
          )}
        </ul>
      ) : null}

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
