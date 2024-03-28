import { GET_PATIENT_DETAILS ,GET_MEAT_QUERY,GET_SECTION_COLOR,GET_HCC_FILE,GET_DOS_PAGE,GET_RADIOLOGY_DETAILS,GET_RADIOLOGY_FILE} from "../../actions/ReviewerAction/PatientDetailsAction";

  const initialState = {
    patientDetails: null,
    meatQueryList:null,
    sectionColorList:null,
    hccFileDetails:null,
    dosPageNumberList:null,
    radiologyDeatils:null,
    radiologyFileDetails:null,
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
    if (action.type === GET_HCC_FILE) {
      return {
        ...state,
        hccFileDetails: action.payload,
      };
    }
    if (action.type === GET_DOS_PAGE) {
      return {
        ...state,
        dosPageNumberList: action.payload,
      };
    }
    if (action.type === GET_RADIOLOGY_DETAILS) {
      return {
        ...state,
        radiologyDeatils: action.payload,
      };
    }
    if (action.type === GET_RADIOLOGY_FILE) {
      return {
        ...state,
        radiologyFileDetails: action.payload,
      };
    }
    return state;
  };
  