import { GET_PATIENT_DETAILS ,GET_MEAT_QUERY,GET_SECTION_COLOR} from "../../actions/ReviewerAction/PatientDetailsAction";

  const initialState = {
    patientDetails: null,
    meatQueryList:null,
    sectionColorList:null,
  };
  
  export const ReviewerReducers = (state = initialState, action) => {
    if (action.type === GET_PATIENT_DETAILS) {
      return {
        ...state,
        patientDetails: action.payload,
      };
    }
    if (action.type === GET_MEAT_QUERY) {
      return {
        ...state,
        meatQueryList: action.payload,
      };
    }
    if (action.type === GET_SECTION_COLOR) {
      return {
        ...state,
        sectionColorList: action.payload,
      };
    }
    return state;
  };
  