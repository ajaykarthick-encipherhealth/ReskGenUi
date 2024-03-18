import {LIST, TRACKING} from '../../actions/physicianAction/patientsActions';

const initialState = {
  patients: null,
  tracking: [],

};

export const PhyicianReducer = (state = initialState, action) => {
  if (action.type === LIST) {
    return {
      ...state,
      patients: action.payload,
    };
  }
  return state;
};
  