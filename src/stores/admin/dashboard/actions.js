import { createAction } from "redux-actions";
import { createActionThunk } from "../../../utils/redux";
import * as network from "./network";

export const workFlowAction = createActionThunk(
  "WORKFLOW_DATA",
  network.workFlow
);
export const dailyTaskAction = createActionThunk(
  "DAILY_TASK",
  network.dailyTask
);
export const accuracyAction = createActionThunk("ACCURACY", network.accuracy);

export const completedScoreAction = createActionThunk(
  "COMPLETED",
  network.completedScore
);

export const holdStatusAction = createActionThunk(
  "HOLD_STATUS",
  network.holdStatus
);

export const notificationAction = createActionThunk(
  "NOTIFICATION",
  network.notification
);

export const tenentLogoAction = createActionThunk(
  "TENANT_LOGO",
  network.tenentLogo
);

export const teamChartAction = createActionThunk(
  "TEAM_CHART",
  network.getTeamChartData
);

export const getSelectUserList = createActionThunk(
  "DASHBOARD_SELECTED_USERS_LIST",
  network.usersList
);
export const getDeliveryStatus = createActionThunk(
  "DASHBOARD_DELIVERY_STATUS",
  network.deliveryStatus
);
export const getDateRange = createAction("DATE_RANGE");
