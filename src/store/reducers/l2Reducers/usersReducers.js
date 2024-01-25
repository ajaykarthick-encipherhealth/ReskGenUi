import { USERS ,INDIVIAULUSER} from "../../actions/l2Action/userActions";


  const initialState = {
    data: null,
    userData:null
    
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
    return state;
  };
  