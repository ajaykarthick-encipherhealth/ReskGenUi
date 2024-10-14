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

export const submitPatientId = createActionThunk(
  "SUBMIT_PATIENT_ID",
  network.submitPatientId
);
export const uploadFiles = createActionThunk(
  "UPLOAD_FILES",
  network.uploadFiles
);

export const uploadFilesRadiology = createActionThunk(
  "UPLOAD_FILES_RADIOLOGY",
  network.uploadFilesRadiology
);
