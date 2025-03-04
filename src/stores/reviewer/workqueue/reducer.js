import { combineReducers } from "redux";
import { handleActions } from "redux-actions";
import { patientsAction,flagsAction ,getPatientDetails, reviewerFilterList,getReviewerPatients} from "./actions";

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
  const getReportLoading=(type) => handleActions(
    {
      [type.START]: () => true,
      [type.SUCCEEDED]: () => false,
      [type.FAILED]: () => false,
    },
    false
  );
  const getPatientReviewerDetailsState = (action) =>
    handleActions(
      {
        [action.toString()]: (state, { payload }) => payload,
      },
      ""
    );
const dashbaordReducer = combineReducers({
  patients: createReducer(patientsAction),
  patientsLoading:getReportLoading(getReviewerPatients),
  flags:createReducer(flagsAction),
  patientDetails:getPatientReviewerDetailsState(getPatientDetails),
  reviewerPatientFilterList: getPatientReviewerDetailsState(reviewerFilterList),
  getReviewerPatients:createReducer(getReviewerPatients)
});

export default dashbaordReducer;
