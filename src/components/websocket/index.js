import { useEffect } from "react";
import { connect } from "react-redux";
import useWebSocket from "react-use-websocket";
import { actions as webSocketActions } from "../../stores/websocket";

const ConnectWebSocket = ({ webSocketData, getWebSocketAllResult }) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const WS_URL =
    "wss://local.hcc.encipherhealth.com/chatservice/chatservice/websocket?token=Bearer " +
    token;

  const { lastJsonMessage } = useWebSocket(WS_URL, {
    share: false,
    shouldReconnect: () => true,
  });

  // useEffect(() => {
  //   var dataPush = [];
  //   if (webSocketData) {
  //     dataPush = [...webSocketData, ...[lastJsonMessage]];
  //   }
  //   console.log(lastJsonMessage);
  //   console.log(dataPush);
  //   if (lastJsonMessage) {
  //     getWebSocketAllResult([lastJsonMessage]);
  //   }
  // }, [lastJsonMessage]);

  useEffect(() => {
    if (lastJsonMessage) {
      console.log(lastJsonMessage)
      getWebSocketAllResult(lastJsonMessage);
    }
  }, [lastJsonMessage]);

  return <></>;
};

const enhancer = connect(
  (state) => ({
    webSocketData: state?.webSocket?.webSocketDetails?.data,
  }),
  {
    getWebSocketAllResult: webSocketActions.websocketAction,
  }
);
export default enhancer(ConnectWebSocket);
