import { combineReducers } from "redux";
import { handleActions } from "redux-actions";
import { dosDeatilsAction, dosPageNumberAction, labDetailsAction, labFileAction, meatQueryAction, patientDetailsAction,patientHccFileAction, radiologyDetailsAction, radiologyFileAction } from "./actions";

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

const patientDetailsReducer = combineReducers({
  patientResult:createReducer(patientDetailsAction),
  hccFileResult:createReducer(patientHccFileAction),
  dosResult:createReducer(dosDeatilsAction),
  dosPageNumberResult:createReducer(dosPageNumberAction),
  meatQueryResult:createReducer(meatQueryAction),
  radiologyResult:createReducer(radiologyDetailsAction),
  radiologyFileResult:createReducer(radiologyFileAction),
  labResult:createReducer(labDetailsAction),
  labFileResult:createReducer(labFileAction),
});

export default patientDetailsReducer;
