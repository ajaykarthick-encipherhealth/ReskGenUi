import { PATIENTS_LIST ,SEARCH_PATIENT} from "../actions/PatientsActions";

const initialState = {
  patientsList: null,
  searchPatient:null
};

export const PatientsReducer = (state = initialState, action) => {
  if (action.type === PATIENTS_LIST) {
    return {
      ...state,
      patientsList: action.payload,
    };
  }
  if (action.type === SEARCH_PATIENT) {
    return {
      ...state,
      searchPatient: action.payload,
    };
  }
  return state;
};
