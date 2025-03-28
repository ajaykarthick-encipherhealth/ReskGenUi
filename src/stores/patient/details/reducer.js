import { combineReducers } from "redux";
import { handleActions } from "redux-actions";
import {
  dosDeatilsAction,
  dosPageNumberAction,
  getFlagDetailsAction,
  getProviderSection,
  labDetailsAction,
  labFileAction,
  meatQueryAction,
  patientDetailsAction,
  patientHccFileAction,
  patientIdDetailsAction,
  radiologyDetailsAction,
  radiologyFileAction,
  getValideCode,
  isCodeAlready,
  getSelectedDos,
  manuallyAdd,
  diseaseEdit,
  diseaseEditMeat,
  getAllProcessYearAction,
  radiologyDosDeatilsAction,
  labDosDeatilsAction,
  getSelectedDosPageNumber,
  getCurrentDiseaseType,
  activeLabels,
  labPDFDetails,
  isDeleteNotes,
  isDeleteComments,
  getAddProviderAndDOSList,
  isAddNotes,
  isAddComments,
  isDeleteFlag,
  storeFileIdAction,
  stroeFileIdPreAction,
  getPatientID,
  patientDetailsLoad,
  getCommentListAction,
  getFlagCharts,
} from "./actions";


const initialState = {
  loading: true,
  data: null,
  error: null,
};
const createReducer = (actionType) =>
  handleActions(
    {
      [actionType.STARTED]: (state, action) => ({
        ...state,
        loading: true,
        error: null,
      }),
      [actionType.SUCCEEDED]: (state, action) => ({
        ...state,
        loading: false,
        data: action.payload,
        error: null,
      }),
      [actionType.FAILED]: (state, action) => ({
        ...state,
        loading: false,
        error: action.payload,
      }),
    },
    initialState
  );

const getStoreFileIdDetails = handleActions(
  {
    [storeFileIdAction.toString()]: (state, { payload }) => payload,
  },
  null
);
const getStoreFileIdDetailsPre = handleActions(
  {
    [stroeFileIdPreAction.toString()]: (state, { payload }) => payload,
  },
  null
);

const getSelectedDosDetails = handleActions(
  {
    [getSelectedDos.toString()]: (state, { payload }) => payload,
  },
  ""
);
const getSelectedDetails = (action) =>
  handleActions(
    {
      [action.toString()]: (state, { payload }) => payload,
    },
    ""
  );

  const patientsLoading =  handleActions(
    {
      [patientDetailsLoad.toString()]: (state, { payload }) => payload,
    },
    true
  );

const getPatientsLoading = (type) =>
  handleActions(
    {
      [type.START]: () => true,
      [type.SUCCEEDED]: () => false,
      [type.FAILED]: () => false,
    },
    false
  );
const patientDetailsReducer = combineReducers({
  patientResult: createReducer(patientDetailsAction),
  patientIdResult: createReducer(patientIdDetailsAction),
  loading: getPatientsLoading(patientDetailsAction),
  hccFileResult: createReducer(patientHccFileAction),
  dosResult: createReducer(dosDeatilsAction),
  dosPageNumberResult: createReducer(dosPageNumberAction),
  meatQueryResult: createReducer(meatQueryAction),
  radiologyResult: createReducer(radiologyDetailsAction),
  radiologyFileResult: createReducer(radiologyFileAction),
  labResult: createReducer(labDetailsAction),
  labFileResult: createReducer(labFileAction),
  labFileResultLoad: getPatientsLoading(labFileAction),
  flagsDetailsResult: createReducer(getFlagDetailsAction),
  sectionDetails: createReducer(getProviderSection),
  deleteFlag: createReducer(isDeleteFlag),
  deleteNotes: createReducer(isDeleteNotes),
  deleteComments: createReducer(isDeleteComments),
  addNotes: createReducer(isAddNotes),
  addComments: createReducer(isAddComments),
  isCodeAlready: createReducer(isCodeAlready),
  getValidCode: createReducer(getValideCode),
  getSelectedDosDetails: getSelectedDosDetails,
  selectedDosPageNumber: getSelectedDetails(getSelectedDosPageNumber),
  currentDiseaseType: getSelectedDetails(getCurrentDiseaseType),
  patientsLoading: patientsLoading,
  manuallyAdd: createReducer(manuallyAdd),
  diseaseEdit: createReducer(diseaseEdit),
  diseaseEditMeat: createReducer(diseaseEditMeat),
  processedYear: createReducer(getAllProcessYearAction),
  radiologyDosResult: createReducer(radiologyDosDeatilsAction),
  labDosResult: createReducer(labDosDeatilsAction),
  activeLabel: createReducer(activeLabels),
  labPDFDetails: createReducer(labPDFDetails),
  dosAndProvidersList: createReducer(getAddProviderAndDOSList),
  dosAndProvidersListLoader: getPatientsLoading(getAddProviderAndDOSList),
  getStoreFileIdDetails: getStoreFileIdDetails,
  getStoreFileIdDetailsPre: getStoreFileIdDetailsPre,
  fileLoading: getPatientsLoading(patientHccFileAction),
  selectPatientId: createReducer(getPatientID),
  getCommentList: createReducer(getCommentListAction),
  CommentListLoader: getPatientsLoading(getCommentListAction),
  getFlagChartsList: createReducer(getFlagCharts),
  getFlagChartsLoader: getPatientsLoading(getFlagCharts),
});

export default patientDetailsReducer;
