import {
  ENABLEMFA,
  VALIDATE_CODE,
  VERIFYCODE,
  FILTER,
  PROFILE_URL,
  CODER,
  CURRENTUSER_INFO,
  ACCURACYSCRORE,
  PATIENT_DETAILS,
} from "../actions";
import { CHATBOT } from "../../../store/actions/DashboardActions";

const initialState = {
  codeDetails: null,
  qrcode: "",
  accuracy: "",
  filterList: null,
  url: false,
  userInfo: null,
  chatReply: null,
};
const initialStatePatient = {
  patientDetails: {},
};
export function AuthReducer(state = initialState, action) {
  if (action.type === VALIDATE_CODE) {
    return {
      ...state,
      details: action.payload,
    };
  }
  if (action.type === VERIFYCODE) {
    return {
      ...state,
      qrcode: action.payload,
    };
  }
  if (action.type === ENABLEMFA) {
    return {
      ...state,
      mfa: action.payload,
    };
  }
  if (action.type === ACCURACYSCRORE) {
    return {
      ...state,
      accuracy: action.payload,
    };
  }
  if (action.type === FILTER) {
    return {
      ...state,
      filterList: action.payload,
    };
  }
  if (action.type === PROFILE_URL) {
    return {
      ...state,
      url: action.payload,
    };
  }
  if (action.type === CURRENTUSER_INFO) {
    return {
      ...state,
      userInfo: action.payload,
    };
  }
  if (action.type === CHATBOT) {
    return {
      ...state,
      chatReply: action.payload,
    };
  }
  if (action.type === CODER) {
    return {
      ...state,
      codeDetails: action.payload,
    };
  }
  return state;
}

export function PatientStore(state = initialStatePatient, action) {
  if (action.type === PATIENT_DETAILS) {
    return {
      patientDetails: action.payload,
    };
  }
  return state;
}
