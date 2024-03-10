import { PATIENTS_LIST ,SEARCH_PATIENT,FILTERATION,PATIENT_ID,PATIENTS_LIST_FILTER} from "../actions/PatientsActions";

const initialState = {
  patientsList: null,
  searchPatient:null,
  filteredList:null,
  patiendId:null,
  patientsListFilter:null,
};

export const PatientsReducer = (state = initialState, action) => {
  if (action.type === PATIENTS_LIST) {
    return {
      ...state,
      patientsList: action.payload,
    };
  }
  if (action.type === PATIENTS_LIST_FILTER) {
    return {
      ...state,
      patientsListFilter: action.payload,
    };
  }
  if (action.type === SEARCH_PATIENT) {
    return {
      ...state,
      searchPatient: action.payload,
    };
  }
  if (action.type === FILTERATION) {
    return {
      ...state,
      filteredList: action.payload,
    };
  }
  if (action.type === PATIENT_ID) {
    return {
      ...state,
      patiendId: action.payload,
    };
  }
  return state;
};