import { createActionThunk } from "../../../utils/redux";
import * as network from "./network";

export const patientDetailsAction = createActionThunk(
  "PATIENT_DETAILS",
  network.patientDetails
);
export const patientIdDetailsAction = createActionThunk(
  "PATIENT_ID_DETAILS",
  network.patientIdDetails
);
export const patientHccFileAction = createActionThunk(
  "PATIENT_HCC_FILE",
  network.patientHccFile
);
export const dosDeatilsAction = createActionThunk(
  "DOS_LIST",
  network.dosWiseList
);
export const dosPageNumberAction = createActionThunk(
  "DOS_PAGE_LIST",
  network.dosPageNumerList
);
export const meatQueryAction = createActionThunk(
  "MEAT_QUERY_LIST",
  network.meatQuery
);
export const radiologyDetailsAction = createActionThunk(
  "RADIOLOGY_DETAILS",
  network.radiologyDetails
);
export const radiologyFileAction = createActionThunk(
  "RADIOLOY_FILE__DETAILS",
  network.patientHccFile
);
export const labDetailsAction = createActionThunk(
  "LAB_DETAILS",
  network.labDetails
);
export const labFileAction = createActionThunk(
  "LAB_FILE_DETAILS",
  network.patientHccFile
);