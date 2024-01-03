import {LIST} from '../../actions/adminAction/patientsActions';

const initialState = {
  patients: null,

};

export const AdminPatientsListReducer = (state = initialState, action) => {
  if (action.type === LIST) {
    return {
      ...state,
      patients: action.payload,
    };
  }
  return state;
};
