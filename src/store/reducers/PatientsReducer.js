import { PATIENTS_LIST } from "../actions/PatientsActions";

const initialState = {
  patientsList: null,
};

export const PatientsReducer = (state = initialState, action) => {
  if (action.type === PATIENTS_LIST) {
    return {
      ...state,
      patientsList: action.payload,
    };
  }
  return state;
};
