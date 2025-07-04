import React, { useEffect, useState } from "react";
import Chat from "../chat/index";
import { Button, Empty, notification, Tooltip } from "antd";
import style from "./styles.module.css";
import moment from "moment";
import { connect } from "react-redux";
import { actions as webSocketActions } from "../../stores/websocket";
import { actions as dashbaordActions } from "../../stores/reviewer/dashboard";
import { getStorage, setStorage } from "../../utils/storages";
import { getPriorityStyle } from "../../pages/tenantadmin/notifications/noficationCard";
import Card from "../card";
import { formatDateTime, reusableEllipses } from "../../utils/reusable";
import RegularButton from "../button";
import { actions as allActions } from "../../stores/admin/workqueue";
import { actions as allPatientSyncAction } from "../../stores/tenantAdmin/patientSync";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckDouble } from "@fortawesome/free-solid-svg-icons";
import CardSkeleton from "../skeleton/card";

const Notification = ({
  open,
  notificationResponse,
  webSocketData,
  getNotificationData,
  webSocketNotificationData,
  getNotificationList,
  patientDetails,
  backRoute,
  getRoutedData,
  notificationLoading,
  postUnReadCount,
}) => {
  const [openMsg, setOpenMsg] = useState(false);
  const notificationData = notificationResponse?.notificationList?.content;
  const [loading, setLoading] = useState(false);
  const navigate = useRouter();
  const splitUserName = (name) => {
    if (name) {
      return name[0]?.toUpperCase();
    }
  };
  const gotoPatientDetails = (data) => {
    patientDetails(data);
    // if (data?.computing === 2) {
    const controller = new AbortController();
    const { signal } = controller;
    controller.abort();
    setStorage("patientId", data?.notificationInfoExtended?.patients[0]);
    setStorage("routeBackTo", backRoute ? backRoute : "/tenantadmin/project");

    navigate.push({
      pathname: "/tenantadmin/project/details",
    });
  };


 const handleRead = async () => {
  const userId = getStorage("userId");

  try {
    const response = await postUnReadCount();
    if (response?.status === "SUCCESS") {
      getNotificationList(userId);
    } else {
      console.warn("Failed to mark all as read", response);
    }
  } catch (error) {
    console.error("Error in marking all as read", error);
  }
};


const handleIdRead = async (notification) => {
  const id = notification?.id;
  const notificationType = notification?.read;
  const userId = getStorage("userId");

  try {
    const response = await postUnReadCount({ id });

     if (response?.status === "SUCCESS" && notificationType === false) {
       getNotificationList(userId);
     } else {
       console.warn("Mark as read failed", response);
     }
  } catch (error) {
    console.error("Error marking notification as read", error);
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
    <div
      className="card-body chatbox contacts_body p-0"
      id="DZ_W_Contacts_Body"
    >
      {!openMsg && !loading ? (
        webSocketNotificationData?.length <= 0 ? (
          <div className="d-flex alignn-items-center justify-content-center">
            <Empty />
          </div>
        ) : (
          <>
            <div className="d-flex justify-content-end me-3">
              <div
                className="cr-pointer  text-decoration-underline d-flex align-items-center"
                style={{ color: "#3A88F8" }}
                onClick={handleRead}
              >
                {/* <FontAwesomeIcon icon={faCheckDouble} className="me-2" /> */}
                <svg
                  className="me-1"
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="15"
                  viewBox="0 0 14 14"
                  fill="none"
                >
                  <path
                    d="M1.45834 8.0686L3.50001 10.2077L4.09734 9.58177M9.62501 3.79102L6.08826 7.49635M4.37501 8.0686L6.41668 10.2077L12.5417 3.79102"
                    stroke="black"
                    stroke-width="0.7"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <span>Mark all as read</span>
              </div>
            </div>
            {notificationLoading ? (
              <div className="px-3">
                <CardSkeleton
                  count={10}
                  display={"flex"}
                  gap={"10px"}
                  height={150}
                />
              </div>
            ) : (
              <div className={`d-grid align-items-center ${style.cardGrid}`}>
                {webSocketNotificationData?.map((notification, index) => (
                  <div
                    onClick={() => handleIdRead(notification)}
                    key={index}
                    className="col-12 m-2 col-md-6 col-lg-6 col-xl-3 col-l-6"
                  >
                    <Card padding="20px" borderRadius="5px" width="97%">
                      <div
                        className={`${style.cardContainer} justify-content-between align-items-center`}
                      >
                        <div>
                          <div
                            className="d-flex justify-content-between p-1 fw-bold align-items-center "
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
                          {notification?.notificationType !=
                            "TIN_COMPLETED" && (
                            <div className="d-flex p-1 fw-bold align-items-center ">
                              <span
                                className={`${style.cardContent} fw-bold text-gray-600 text-truncate`}
                              >
                                {notification?.fromUserDetails?.firstName}{" "}
                                {notification?.fromUserDetails?.lastName}
                              </span>
                              {notification?.userFromAliasName && (
                                <div
                                  id="table-btn"
                                  name="table-btn"
                                  className="d-flex mx-4 justify-content-center align-items-center"
                                >
                                  <span
                                    style={{
                                      borderRadius: "5px",
                                      fontSize: "12px",
                                    }}
                                    data-testid="table-custom"
                                    name="table-custom"
                                    className="px-2 w-full font1 text-ellipsis tableButton cursor-default pointer-events-none"
                                  >
                                    {notification?.userFromAliasName
                                      .toString()
                                      .replace(/_/g, " ")
                                      .replace(/,\s*/g, ", ")}
                                  </span>
                                </div>
                              )}
                            </div>
                          )}

                          <div className="d-flex p-1 align-items-center ">
                            <Tooltip title={notification?.content}>
                              <span
                                className={`${style.cardContent} text-gray-600 text-truncate`}
                              >
                                {notification?.content}
                              </span>
                            </Tooltip>
                          </div>

                          <div className="d-flex pt-3 justify-content-between align-items-center">
                            {notification?.notificationType !=
                            "TIN_COMPLETED" ? (
                              <Button
                                className="text-white"
                                style={{ backgroundColor: "#3A88F8" }}
                                // onClick={() => gotoPatientDetails(notification)}
                                disabled
                              >
                                Go to File
                              </Button>
                            ) : (
                              <div>&nbsp;</div>
                            )}

                            <div className="px-1" style={{ color: "#7E7B7B" }}>
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
            )}
          </>
        )
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
    notificationLoading: state?.reviewer?.dashboard?.notificationLoader,
  }),
  {
    patientDetails: allActions.getPatientDetails,
    getNotificationData: webSocketActions.websocketNotificationAction,
    getNotificationList: dashbaordActions.notificationAction,
    getRoutedData: allPatientSyncAction.getRoutedData,
    postUnReadCount: dashbaordActions.unReadCountPostAction,
  }
);
export default enhancer(Notification);
