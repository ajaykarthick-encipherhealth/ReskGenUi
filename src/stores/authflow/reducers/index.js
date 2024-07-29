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
  AUTHENTICATION,
  VERIFYMFA
} from "../actions";
import { CHATBOT } from "../../../store/actions/DashboardActions";
export const PDF_URL='PDF_URL'

export const pdfUrl=(url)=>{
  return(
    {
      type: PDF_URL,
      payload: url,
    }
  )
}
const initialState = {
  codeDetails: null,
  qrcode: "",
  accuracy: "",
  filterList: null,
  url: false,
  userInfo: null,
  chatReply: null,
  pdfUrl:null,
  authInfo:null,
  verifyMfa:null
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
  if (action.type === PDF_URL) {
    return {
      ...state,
      pdfUrl: action.payload,
    };
  }
  if(action.type === AUTHENTICATION){
    return{
      ...state,
      authInfo:action.payload
    }
  }
  if(action.type === VERIFYMFA){
    return{
      ...state,
      verifyMfa:action.payload
    }
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

const filterInitialState = {
  auditAllocatedBy: [],
  patientAllocated: [],
  auditedAssigned: [],
  organization: [],
  allocatedBy: [],
};

const filterReducer = (state = filterInitialState, action) => {
  switch (action.type) {
    case 'SET_FILTERS_AUDITALLOCATEDBY':
      return { ...state, auditAllocatedBy: action.payload };
    case 'SET_FILTERS_PATIENTALLOCATED':
      return { ...state, patientAllocated: action.payload };
    case 'SET_FILTERS_AUDITEDASSIGNED':
      return { ...state, auditedAssigned: action.payload };
    case 'SET_FILTERS_ALLOCATEDBY':
      return { ...state, allocatedBy: action.payload };
    default:
      return state;
  }
};

export default filterReducer;