import {LIST} from '../../actions/adminAction/usersAction';

const initialState = {
  usersData: null,

};

export const AdminUsersReducer = (state = initialState, action) => {
  if (action.type === LIST) {
    return {
      ...state,
      usersData: action.payload,
    };
  }
  return state;
};
