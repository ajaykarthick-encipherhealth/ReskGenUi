import { createAction } from "redux-actions";
import { createActionThunk } from "../../../utils/redux";
import * as network from "./network";

export const getNotificationList = createActionThunk(
  "GET_NOTIFICATION_LIST",
  network.getNotifications
);
export const getPostNotificationList = createActionThunk(
  "GET_POST_NOTIFICATION_LIST",
  network.getPostNotifications
);