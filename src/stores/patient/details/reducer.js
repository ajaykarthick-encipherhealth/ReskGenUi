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
  labDosDeatilsAction
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

const getSelectedDosDetails = handleActions(
  {
    [getSelectedDos.toString()]: (state, { payload }) => payload,
  },
  ""
);

const patientDetailsReducer = combineReducers({
  patientResult: createReducer(patientDetailsAction),
  patientIdResult: createReducer(patientIdDetailsAction),
  hccFileResult: createReducer(patientHccFileAction),
  dosResult: createReducer(dosDeatilsAction),
  dosPageNumberResult: createReducer(dosPageNumberAction),
  meatQueryResult: createReducer(meatQueryAction),
  radiologyResult: createReducer(radiologyDetailsAction),
  radiologyFileResult: createReducer(radiologyFileAction),
  labResult: createReducer(labDetailsAction),
  labFileResult: createReducer(labFileAction),
  flagsDetailsResult: createReducer(getFlagDetailsAction),
  sectionDetails: createReducer(getProviderSection),
  isCodeAlready: createReducer(isCodeAlready),
  getValidCode: createReducer(getValideCode),
  getSelectedDosDetails: getSelectedDosDetails,
  manuallyAdd: createReducer(manuallyAdd),
  diseaseEdit: createReducer(diseaseEdit),
  diseaseEditMeat: createReducer(diseaseEditMeat),
  processedYear: createReducer(getAllProcessYearAction),
  radiologyDosResult: createReducer(radiologyDosDeatilsAction),
  labDosResult: createReducer(labDosDeatilsAction),


});

export default patientDetailsReducer;
