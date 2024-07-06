import { createActionThunk } from "../../../utils/redux";
import * as network from "./network";

export const patientsAction = createActionThunk(
  "PATIENTS_LIST",
  network.PatientsList
);

export const getTrackingList = createActionThunk(
  "TRACKING",
  network.TrackingList
);