import { createActionThunk } from "../../../utils/redux";
import * as network from "./network";

export const getAllTrackingAction = createActionThunk(
  "GET_ALL_TRACKING",
  network.getAllTracking
);
export const getCustomUsersAction=createActionThunk(
  'GET_CUSTOM_USERS',
  network.getCustomAllUsers
)
export const getAllFileProcessAction = createActionThunk(
  "GET_ALL_FILE_PROCESS",
  network.getAllFileProcess
);