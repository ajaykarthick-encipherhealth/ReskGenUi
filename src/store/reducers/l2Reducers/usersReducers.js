import { USERS } from "../../actions/l2Actions/userActions";

  const initialState = {
    data: null,
    
  };
  
  export const L1UsersReducer = (state = initialState, action) => {
    if (action.type === USERS) {
      return {
        ...state,
        data: action.payload,
      };
    }
  
    return state;
  };
  