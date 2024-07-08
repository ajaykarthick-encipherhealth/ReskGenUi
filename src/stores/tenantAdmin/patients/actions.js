import { createActionThunk } from "../../../utils/redux";
import * as network from "./network";

export const getAllOrganizationAction = createActionThunk(
  "GET_ALL_ORGANIZATION",
  network.getAllOrganization
);

export const getAllPatientAction = createActionThunk(
  "GET_ALL_PATIENT",
  network.getAllPatient
);