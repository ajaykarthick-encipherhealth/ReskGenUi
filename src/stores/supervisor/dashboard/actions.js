import { createActionThunk } from "../../../utils/redux";
import * as network from "./network";



export const supervisorWorkFlowAction = createActionThunk(
  "WORKFLOWDATA",
  network.supervisorWorkFlow
);
// export const dailyTaskAction = createActionThunk(
//   "DAILYTASK",
//   network.dailyTask
// );
// export const accuracyAction = createActionThunk(
//   "ACCURACY",
//   network.accuracy
// );

// export const completedScoreAction = createActionThunk(
//   "COMPLETED",
//   network.completedScrore
// );

// export const holdStatusAction = createActionThunk(
//   "HOLD_STATUS",
//   network.holdStatus
// );

