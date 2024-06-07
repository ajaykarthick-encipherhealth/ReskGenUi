import { createActionThunk } from "../../utils/redux";
import * as network from "./network";

export const batchUpload = createActionThunk(
  "BATCH_UPLOAD",
  network.batchUploadCall
);
export const getAllOrganizationAction = createActionThunk(
  "GET_ALL_ORGANIZATION",
  network.getAllOrganization
);
export const getAllUsersAction = createActionThunk(
  "GET_ALL_USERS",
  network.getallUsers
);
export const getAllPatientAction = createActionThunk(
  "GET_ALL_PATIENT",
  network.getAllPatient
);