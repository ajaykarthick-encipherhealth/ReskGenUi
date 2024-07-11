import { createActionThunk } from "../../../utils/redux";
import * as network from "./network";

export const reviewerReport = createActionThunk(
  "REVIEWER",
  network.reviewerApi
);
export const reviewerCheckAllReport = createActionThunk(
  "REVIEWER_CHECK_ALL",
  network.checkAllApi
);
export const sentReport = createActionThunk(
  "SENT",
  network.sentApi
);
export const receivedReport = createActionThunk(
  "RECEIVED",
  network.receivedApi
);