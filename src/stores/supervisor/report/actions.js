import { createActionThunk } from "../../../utils/redux";
import * as network from "./network";


export const sentReport = createActionThunk(
  "SENT",
  network.sentApi
);
export const receivedReport = createActionThunk(
  "RECEIVED",
  network.receivedApi
);
export const auditReport = createActionThunk(
  "Audit",
  network.auditApi
);
export const teamReport = createActionThunk(
  "TEAM_REPORT",
  network.teamApi
);
export const auditCHeckList = createActionThunk(
  "AUDIT_CHECKED_LIST",
  network.auditCheck
);
export const teamCHeckList = createActionThunk(
  "TEAM_CHECKED_LIST",
  network.teamCheck
);

export const getSentDetails = createActionThunk(
  "SEND_REPORT_DETAILS",
  network.sendReport
);

export const getReceivedDetails = createActionThunk(
  "REC_REPORT_DETAILS",
  network.receivedReport
);

export const getSelectedReportDetails = createActionThunk(
  "SELECT_REPORT_DETAILS",
  network.selectedReportDetails
);