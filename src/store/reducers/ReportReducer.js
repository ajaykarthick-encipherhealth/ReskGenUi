import {
  REPORT_PATIENTS_DETAILS,
  SELECTEDROW,
  SEARCH,
  EXPORT,
} from "../actions/ReportActions";

const initialState = {
  details: null,
  row: null,
  usersList: null,
  exportRes: null,
};

export const ReportReducer = (state = initialState, action) => {
  if (action.type === REPORT_PATIENTS_DETAILS) {
    return {
      ...state,
      details: action.payload,
    };
  }
  if (action.type === SELECTEDROW) {
    return {
      ...state,
      row: action.payload,
    };
  }
  if (action.type === SEARCH) {
    return {
      ...state,
      usersList: action.payload,
    };
  }
  if (action.type === EXPORT) {
    return {
      ...state,
      exportRes: action.payload,
    };
  }
  return state;
};
