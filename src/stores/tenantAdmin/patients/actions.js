import { createActionThunk } from "../../../utils/redux";
import * as network from "./network";

export const getAllOrganizationAction = createActionThunk(
  "GET_ALL_ORGANIZATION",
  network.getAllOrganization
);
export const getAllBatchAction = createActionThunk(
  "GET_ALL_BATCH",
  network.getAllBatch
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

export const getRetreggerPatient = createActionThunk(
  "GET_RETREGGER_PATINET",
  network.getRetreggerPatient
);
