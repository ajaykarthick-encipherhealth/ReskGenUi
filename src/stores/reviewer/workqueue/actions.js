import { createActionThunk } from "../../../utils/redux";
import * as network from "./network";

export const patientsAction = createActionThunk(
  "PATIENTS_LIST",
  network.patientsList
);