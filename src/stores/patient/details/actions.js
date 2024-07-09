import { createAction } from "redux-actions";
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
export const getFlagDetailsAction = createActionThunk(
  "GET_FLAG_DETAILS",
  network.getFlagsList
);
export const getProviderSection = createActionThunk(
  "GET_PROVIDER",
  network.getProviderAndCaptured
);
export const getValideCode = createActionThunk(
  "GET_VALID_CODE",
  network.isValideCode
);

export const isCodeAlready = createActionThunk(
  "GET_VALID_CODE",
  network.isCodePracent
);

export const getSelectedDos = createAction("GET_SELECTED_DOS");

export const manuallyAdd = createActionThunk(
  "MANUALLY_ADDED",
  network.manuallyAddCode
);

export const diseaseEdit = createActionThunk(
  "DISEASE_EDIT",
  network.diseaseEdit
);
export const diseaseEditMeat = createActionThunk(
  "DISEASE_EDIT_MEAT",
  network.diseaseEditMeat
);

export const radiologyDetailsActionSetEmpty = createActionThunk(
  "RADIOLOGY_DETAILS",
  network.radiologyDetailsSetEmpty
);

export const labDetailsActionSetEmpty = createActionThunk(
  "LAB_DETAILS",
  network.radiologyDetailsSetEmpty
);

export const radiologyDetailsActionFileSetEmpty = createActionThunk(
  "RADIOLOY_FILE__DETAILS",
  network.radiologyDetailsSetEmpty
);

export const labDetailsActionSetFileEmpty = createActionThunk(
  "LAB_FILE_DETAILS",
  network.radiologyDetailsSetEmpty
);

export const getAllProcessYearAction = createActionThunk(
  "PROCESSED_YEAR",
  network.getAllProcessYear
);

export const radiologyDosDeatilsAction = createActionThunk(
  "RADIOLOGY_DOS_LIST",
  network.radiologydosWiseList
);

export const labDosDeatilsAction = createActionThunk(
  "LAB_DOS_LIST",
  network.labdosWiseList
);