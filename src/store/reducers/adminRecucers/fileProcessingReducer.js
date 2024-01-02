import { PATIENTS_LIST,SELECTEDROW_FILEUPLOAD,COMPLETED_REPORT} from '../../actions/adminAction/fileProcessingActions';

const initialState = {
  patientsList: null,
  selectedFile:null,
  rowDetails:null
};

export const AdminPatientsReducer = (state = initialState, action) => {
  if (action.type === PATIENTS_LIST) {
    return {
      ...state,
      patientsList: action.payload,
    };
  }
  if (action.type === SELECTEDROW_FILEUPLOAD) {
    return {
      ...state,
      selectedFile: action.payload,
    };
  }
  if (action.type === COMPLETED_REPORT) {
    return {
      ...state,
      rowDetails: action.payload,
    };
  }
  return state;
};
