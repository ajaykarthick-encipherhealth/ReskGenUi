import { createActionThunk } from "../../utils/redux";
import * as network from "./network";

export const loadDashboard = createActionThunk(
  "DASHBOARD",
  network.loadDashboard
);