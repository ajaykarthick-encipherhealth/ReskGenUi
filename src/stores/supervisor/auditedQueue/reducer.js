import { combineReducers } from "redux";
import { handleActions } from "redux-actions";
import { getpatientsList, getFilteredList, getPatientID,getSearchPatients,getPriorityChange,getWorkListFilter } from "./actions";

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

const getReportLoading = (type) =>
  handleActions(
    {
      [type.START]: () => true,
      [type.SUCCEEDED]: () => false,
      [type.FAILED]: () => false,
    },
    true
  );

  const getSelectedDetails = (action) =>
    handleActions(
      {
        [action.toString()]: (state, { payload }) => payload,
      },
      ""
    );

const AuditedReducer = combineReducers({
  PatientsList: createReducer(getpatientsList),
  getSearchPatients: createReducer(getSearchPatients),
  getPriorityChange: createReducer(getPriorityChange),
  filteredList: createReducer(getWorkListFilter),
  loading: getReportLoading(getWorkListFilter),
  // reducers
  selectedFilteredList: getSelectedDetails(getFilteredList),
  selectedPatientID: getSelectedDetails(getPatientID),
});

export default AuditedReducer;
