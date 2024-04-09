import { createActionThunk } from "../../../utils/redux";
import * as network from "./network";

export const workFlowAction = createActionThunk(
  "WORKFLOWDATA",
  network.workFlow
);
export const dailyTaskAction = createActionThunk(
  "DAILYTASK",
  network.dailyTask
);
export const accuracyAction = createActionThunk(
  "ACCURACY",
  network.accuracy
);

export const completedScoreAction = createActionThunk(
  "COMPLETED",
  network.completedScrore
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
  "TENENTLOGO",
  network.tenentLogo
);