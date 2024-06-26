import { useEffect } from "react";
import { connect } from "react-redux";
import useWebSocket from "react-use-websocket";
import { actions as webSocketActions } from "../../stores/websocket";

const ConnectWebSocket = ({
  webSocketData,
  getWebSocketAllResult,
  getNotificationData,
  webSocketNotificationData,
  notificationResponse,
}) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const WS_URL =
    "wss://local.hcc.encipherhealth.com/chatservice/chatservice/websocket?token=Bearer " +
    token;

  const { lastJsonMessage } = useWebSocket(WS_URL, {
    share: false,
    shouldReconnect: () => true,
  });

  useEffect(() => {
    if (lastJsonMessage) {
      getWebSocketAllResult(lastJsonMessage);
    }
  }, [lastJsonMessage]);

  useEffect(() => {
    console.log(webSocketData)
    if (webSocketData && webSocketData?.webSocketType == "NOTIFICATION") {
      var dataMap = null;
      var oldNotification = notificationResponse?.notificationList?.content;
      if (webSocketNotificationData) {
        dataMap = webSocketNotificationData;
      }
      if (dataMap) {
        var push = [...[webSocketData], ...dataMap];
        getNotificationData(push);
      } else {
        var push = [...[webSocketData], ...oldNotification];
        getNotificationData(push);
      }
    }
  }, [webSocketData]);

  return <></>;
};

const enhancer = connect(
  (state) => ({
    webSocketData: state?.webSocket?.webSocketDetails?.data,
    webSocketNotificationData:
      state?.webSocket?.webSocketNotificationDetails?.data,
    notificationResponse:
      state?.reviewer?.dashboard?.notification?.data?.response,
  }),
  {
    getWebSocketAllResult: webSocketActions.websocketAction,
    getNotificationData: webSocketActions.websocketNotificationAction,
  }
);
export default enhancer(ConnectWebSocket);
