import {
  REPORT_PATIENTS_DETAILS,
  SELECTEDROW,
  SEARCH,
  EXPORT,
  SENT_REPORT,
  RECEIVED_REPORT,
  REPORT_DETAILS,
  FILEDETAILS,
  REPORT
} from "../actions/ReportActions";

const initialState = {
  details: null,
  row: null,
  usersList: null,
  exportRes: null,
  sentDetails: null,
  receivedDetails: null,
  getReport: null,
  uploadFile: null,
  reportInfo:null
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
  if (action.type === FILEDETAILS) {
    return {
      ...state,
      uploadFile: action.payload,
    };
  }
  if(action.type===REPORT){
    return {
      ...state,
      reportInfo:action.payload
    }
  }
  return state;
};
