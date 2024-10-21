import { combineReducers } from "redux";
import { handleActions } from "redux-actions";
import { getAllPatientListAction, getColorAction,getPatientAction,calendarAction ,graphContentAction} from "./actions";

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

const comparisonReducer = combineReducers({
  patientList: createReducer(getAllPatientListAction),
  getAllColor: createReducer(getColorAction),
  getPatient:createReducer(getPatientAction),
  getCalendarData: createReducer(calendarAction),
  getGraphData: createReducer(graphContentAction)
});

export default comparisonReducer;
