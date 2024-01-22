import {
  LOADING_TOGGLE_ACTION,
  LOGIN_CONFIRMED_ACTION,
  LOGIN_FAILED_ACTION,
  LOGOUT_ACTION,
  SIGNUP_CONFIRMED_ACTION,
  SIGNUP_FAILED_ACTION,
  PATIENT_DETAILS,
  SELECTEDROLE,
  CODER,
  VERIFYCODE
} from "../actions/AuthActions";

const initialState = {
  auth: {
    email: "",
    idToken: "",
    localId: "",
    expiresIn: "",
    refreshToken: "",
  },
  errorMessage: "",
  successMessage: "",
  showLoading: false,
  selectedRole: null,
  // count : false,
  codeDetails: null,
  qrcode:""
};

const initialStatePatient = {
  patientDetails: {},
};

export function AuthReducer(state = initialState, action) {
  if (action.type === SIGNUP_CONFIRMED_ACTION) {
    return {
      ...state,
      auth: action.payload,
      errorMessage: "",
      successMessage: "Signup Successfully Completed",
      showLoading: false,
    };
  }
  if (action.type === LOGIN_CONFIRMED_ACTION) {
    return {
      ...state,
      auth: action.payload,
      errorMessage: "",
      successMessage: "Login Successfully Completed",
      showLoading: false,
    };
  }

  if (action.type === LOGOUT_ACTION) {
    return {
      ...state,
      errorMessage: "",
      successMessage: "",
      auth: {
        email: "",
        idToken: "",
        localId: "",
        expiresIn: "",
        refreshToken: "",
      },
    };
  }

  if (
    action.type === SIGNUP_FAILED_ACTION ||
    action.type === LOGIN_FAILED_ACTION
  ) {
    return {
      ...state,
      errorMessage: action.payload,
      successMessage: "",
      showLoading: false,
    };
  }

  if (action.type === LOADING_TOGGLE_ACTION) {
    return {
      ...state,
      showLoading: action.payload,
    };
  }
  if (action.type === SELECTEDROLE) {
    return {
      ...state,
      selectedRole: action.payload,
    };
  }
  if (action.type === CODER) {
    return {
      ...state,
      codeDetails: action.payload,
    };
  }
  if (action.type === VERIFYCODE) {
    return {
      ...state,
      qrcode: action.payload,
    };
  }
  return state;
  // if (action.type === NAVTOGGLE) {

  //     return {
  //         ...state,
  //         count: !state.count,
  //     };

  // if (action.type === PATIENT_DETAILS) {
  //     return {
  //         ...state,
  //         auth: action.payload,
  //         errorMessage: '',
  //         successMessage: 'Patient Details Completed',
  //         showLoading: false,
  //     };
  // }
  // }
  return state;
}
export function PatientStore(state = initialStatePatient, action) {
  if (action.type === PATIENT_DETAILS) {
    return {
      patientDetails: action.payload,
    };
  }
  // }
  return state;
}
