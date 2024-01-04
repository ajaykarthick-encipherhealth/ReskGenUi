import {LIST, TRACKING} from '../../actions/adminAction/patientsActions';

const initialState = {
  patients: null,
  tracking: [],

};

export const AdminPatientsListReducer = (state = initialState, action) => {
  if (action.type === LIST) {
    return {
      ...state,
      patients: action.payload,
    };
  }
  if (action.type === TRACKING) {
    return {
      ...state,
      tracking: action.payload,
    };
  }
  return state;
};
