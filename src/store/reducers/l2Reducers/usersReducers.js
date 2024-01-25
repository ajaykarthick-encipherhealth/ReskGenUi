import { USERS } from "../../actions/l2Action/userActions";


  const initialState = {
    data: null,
    
  };
  
  export const L2UsersReducer = (state = initialState, action) => {
    if (action.type === USERS) {
      return {
        ...state,
        data: action.payload,
      };
    }
  
    return state;
  };
  