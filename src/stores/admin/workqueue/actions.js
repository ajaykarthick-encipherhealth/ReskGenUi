import { createAction } from "redux-actions";
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
export const getPatientDetails = createAction(
  "GET_ALL_PATIENTS_FILES"
);
export const getAddPatient= createActionThunk(
  "GET_ADD_PATIENT",
  network.addPatient
);
export const getUploadFile= createActionThunk(
  "GET_UPLOAD_PATIENT_FILE",
  network.uploadFile
);
export const getUploadRadiologyFile= createActionThunk(
  "GET_UPLOAD_PATIENT_RADIOLOGY_FILE",
  network.uploadRadiologyFile
);