import { USERS ,INDIVIAULUSER,CLICK_USER_DETAILS} from "../../actions/l2Action/userActions";



  const initialState = {
    data: null,
    userData:null,
    userDetails:null
    
  };
  
  export const L2UserReducers = (state = initialState, action) => {
    if (action.type === USERS) {
      return {
        ...state,
        data: action.payload,
      };
    }
    if (action.type === INDIVIAULUSER) {
      return {
        ...state,
        userData: action.payload,
      };
    }
    if (action.type === CLICK_USER_DETAILS) {
      return {
        ...state,
        userDetails: action.payload,
      };
    }
    return state;
  };
  