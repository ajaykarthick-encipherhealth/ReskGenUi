import {
  REPORT_PATIENTS_DETAILS,
  SENT_REPORT,
  RECEIVED_REPORT,
  REPORT_DETAILS,
} from "../actions/ReportActions";

const initialState = {
  details: null,
  sentDetails: null,
  receivedDetails: null,
  getReport: null,
};

export const ReportReducer = (state = initialState, action) => {
  if (action.type === REPORT_PATIENTS_DETAILS) {
    return {
      ...state,
      details: action.payload,
    };
  }
  if (action.type === SENT_REPORT) {
    return {
      ...state,
      sentDetails: action.payload,
    };
  }
  if (action.type === RECEIVED_REPORT) {
    return {
      ...state,
      receivedDetails: action.payload,
    };
  }
  if (action.type === REPORT_DETAILS) {
    return {
      ...state,
      getReport: action.payload,
    };
  }
  return state;
};
