import { createActionThunk } from "../../../utils/redux";
import * as network from "./network";

export const adminReport = createActionThunk(
  "REVIEWER",
  network.adminApi
);
export const sentReport = createActionThunk(
  "SENT",
  network.sentApi
);
export const receivedReport = createActionThunk(
  "RECEIVED",
  network.receivedApi
);
export const adminCheckAllReport = createActionThunk(
  "ADMIN_CHECK_ALL",
  network.checkAllApi
);