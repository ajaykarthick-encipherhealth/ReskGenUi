import { createAction } from "redux-actions";
import { createActionThunk } from "../../../utils/redux";
import * as network from "./network";

export const adminReport = createActionThunk(
  "REVIEWER",
  network.adminApi
);


export const adminCheckAllReport = createActionThunk(
  "ADMIN_CHECK_ALL",
  network.checkAllApi
);

export const selectedRow = createAction("SELECTED_ROW");
export const activeTab = createAction("ACTIVE_TAB");
export const selectedReport=createAction("SELECTED_REPORT")
export const getReportActiveTab=createAction("GET_REPORT_ACTIVE_TAB")
export const updateSentReport = createActionThunk(
  "UPDATE_SENT",
  network.updateSent
);
// usersList
export const getUsersList = createActionThunk(
  "USERS_LIST",
  network.usersList
);
export const getUsersLists = createActionThunk(
  "USERS_LIST",
  network.usersLists
);
export const getExportDetails = createActionThunk(
  "GET_EXPORT_DETAILS",
  network.exportData
);
export const GetSelectedReport = createActionThunk(
  "GET_SELECT_DETATILES",
  network.getSelectedReport
);
export const sentReport = createActionThunk(
  "SENT",
  network.sentApi
);
export const receivedReport = createActionThunk(
  "RECEIVED",
  network.receivedApi
);

export const getSelectedReportDetails = createActionThunk(
  "SELECT_REPORT_DETAILS",
  network.selectedReportDetails
);
