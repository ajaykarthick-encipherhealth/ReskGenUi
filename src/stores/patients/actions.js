import { createActionThunk } from "../../utils/redux";
import * as network from "./network";

export const loadFilterPatientList = createActionThunk(
  "PATIENT",
  network.loadFilterPatientList
);

export const loadTimelineList = createActionThunk(
  "PATIENT",
  network.loadTimelineList
);