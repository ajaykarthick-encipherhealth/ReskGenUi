import { createActionThunk } from "../../../utils/redux";
import * as network from "./network";

export const getUploadRadiologyFile= createActionThunk(
  "GET_UPLOAD_PATIENT_RADIOLOGY_FILE",
  network.uploadRadiologyFile
);
export const getUploadFile= createActionThunk(
  "GET_UPLOAD_PATIENT_FILE",
  network.uploadFile
);
export const uploadFilesRadiology= createActionThunk(
  "GET_UPLOAD_PATIENT_FILE_RADIOLOGY",
  network.uploadFilesRadiology
);

export const getAddPatient= createActionThunk(
  "GET_ADD_PATIENT",
  network.addPatient
);
export const getUsersList = createActionThunk(
  "GET_BY_USERS",
  network.getUsers
);







