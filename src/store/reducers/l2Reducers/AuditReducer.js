import { PATIENTS_LIST ,SEARCH_PATIENT,FILTERATION,PATIENT_ID,WORK_LIST_FILTER} from "../../actions/l2Action/AuditorAction";

const initialState = {
  patientsList: null,
  searchPatient:null,
  filteredList:null,
  patiendId:null,
  workListFilter:null,
  
};

export const WorkReducers = (state = initialState, action) => {
  if (action.type === PATIENTS_LIST) {
    return {
      ...state,
      patientsList: action.payload,
    };
  }
  if (action.type === WORK_LIST_FILTER) {
    return {
      ...state,
      workListFilter: action.payload,
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