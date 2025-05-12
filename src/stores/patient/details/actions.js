import { createAction } from "redux-actions";
import { createActionThunk } from "../../../utils/redux";
import * as network from "./network";

export const patientDetailsActionCall = createActionThunk(
  "PATIENT_DETAILS_call",
  network.patientDetailsBasedOnACtionType
);
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
export const labPDFDetails = createActionThunk(
  "LAB_PDF_DETAILS",
  network.labPDFData
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
export const isDeleteFlag = createActionThunk(
  "DELETE_FLAG",
  network.deleteflag
);

export const isDeleteNotes = createActionThunk(
  "DELETE_NOTES",
  network.deleteNotes
);

export const isDeleteComments = createActionThunk(
  "DELETE_COMMENTS",
  network.deleteComments
);

export const isAddNotes = createActionThunk(
  "ADD_NOTES",
  network.addNotes
);

export const isAddComments = createActionThunk(
  "ADD_COMMENTS",
  network.addComments
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
export const activeLabels = createActionThunk(
  "ACTIVE_LABEL",
  network.activeLabel
);

export const suggestedToValidMove = createActionThunk(
  "MEAT_VALID_MOVE",
  network.suggestedToValid
);

export const getSelectedDosPageNumber = createAction(
  "GET_SELECTED_DOS_PAGE_NUMBER"
);

export const getCurrentDiseaseType = createAction("GET_CURRENT_DISEASE_TYPE");

export const getAddProviderAndDOS = createActionThunk(
  "GET_MANUALLY_ADD_PROVIDER_AND_DOS",
  network.manuallyAddDosAndProvider
);
export const getAddProviderAndDOSList = createActionThunk(
  "PROVIDER_AND_DOS_LIST_IN_MANUALLY_ADD",
  network.manuallyAddDosAndProviderList
);
export const storeFileIdAction = createAction("STORE_FILE_ID");
export const getPatientID = createAction("PATIENT_ID");
export const stroeFileIdPreAction = createAction("STORE_FILE_ID_PRE");
export const getSubmitMeatQuery = createActionThunk(
  "SUBMIT_MEAT_QUERY",
  network.submitMeatQuery
);
export const getUpdateMeatQuery = createActionThunk(
  "UPDATE_MEAT_QUERY",
  network.updateMeatQuery
);
export const getPatientListFilter = createActionThunk(
  "PATIENT_LIST_FILTER",
  network.patientListFilter
);
export const getManuallyAddComboCode = createActionThunk(
  "MANUALLY_ADD_COMBO_CODE",
  network.manuallyAddComboCode
);
export const getCommentListAction = createActionThunk(
  "GET_COMMENT_LIST",
  network.getCommentList
);
export const getFlagCharts = createActionThunk(
  "GET_FLAG_CHARTS",
  network.getFlagCharts
);
export const patientDetailsLoad = createAction("PATIENT_DETAILS_LOAD");

export const revertDetails = createActionThunk(
  "GET_REVERT_DETAILS",
  network.getRevertDetails
);
export const confirmRevertDetails = createActionThunk(
  "GET_CONFIRM_REVERT_DETAILS",
  network.confirmRevert
);

export const getProxyStatus = createActionThunk(
  "GET_CONFIRM_REVERT_DETAILS",
  network.getStatus
);
export const getQuery = createActionThunk(
  "GET_QUERY",
  network.getQueryDetails
);

export const getQueryApproval = createActionThunk(
  "GET_QUERY_APPROVAL",
  network.queryApproval
);

export const raiseQueryAction = createActionThunk(
  "RAISE_QUERY",
  network.raiseQuery
);
export const getAllRolesAction = createActionThunk(
  "GET_ALL_ROLES_QUERIED",
  network.getAllRoles
);
export const updateReEvaluate = createActionThunk(
  "UPDATE_REEVALUATE",
  network.reEvaluate
);



