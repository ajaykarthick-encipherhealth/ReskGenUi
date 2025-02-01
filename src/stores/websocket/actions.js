import { createActionThunk } from "../../utils/redux";
import * as network from "./network";

export const websocketAction = createActionThunk(
  "WEB_SOCKET_DETAILS",
  network.websocketList
);
export const websocketNotificationAction = createActionThunk(
  "WEB_SOCKET_NOTIFICATION",
  network.websocketNotificationList
);
export const exceptionAction = createActionThunk(
  "EXCEPTION_MAIL",
  network.exceptionMail
);