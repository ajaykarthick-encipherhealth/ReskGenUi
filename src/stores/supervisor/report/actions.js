import { createActionThunk } from "../../../utils/redux";
import * as network from "./network";

export const reviewerReport = createActionThunk(
  "REVIEWER",
  network.reviewerApi
);
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
  "Audit",
  network.teamApi
);