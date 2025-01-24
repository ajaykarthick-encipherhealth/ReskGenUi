import { createActionThunk } from "../../../../utils/redux";
import * as network from "./network";

export const InvalidCounts = createActionThunk(
  "INVALID_COUNT",
  network.getInvalidDashboard
);
