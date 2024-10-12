import { createAction } from "redux-actions";
import { createActionThunk } from "../../../utils/redux";
import * as network from "./network";



export const supervisorWorkFlowAction = createActionThunk(
  "WORKFLOWDATA",
  network.supervisorWorkFlow
);
export const dailyTaskAction = createActionThunk(
  "DAILYTASK",
  network.dailyTask
);
// export const accuracyAction = createActionThunk(
//   "ACCURACY",
//   network.accuracy
// );

// export const completedScoreAction = createActionThunk(
//   "COMPLETED",
//   network.completedScrore
// );

export const holdStatusAction = createActionThunk(
  "HOLD_STATUS",
  network.holdStatus
);

export const accuracyAction = createActionThunk(
  "ACCURACY",
  network.accuracy
);

export const notificationAction = createActionThunk(
  "NOTIFICATION",
  network.notification
);
export const completedChartAction = createActionThunk(
  "COMPLETEDCHART",
  network.CompletedStatus
);

export const getUserByIndividualAction = createActionThunk(
  "INDIVIDUALUSER",
  network.userByIndividual
);

export const dailyTaskData = createAction("GET_DAILY_TASK_DATA");
