import { GET_FIHR_LIST } from "../../actions/tanantAdminAction/FihrActions";

  const initialState = {
    fihr_list: null,
  };
  
  export const TanantAdminService = (state = initialState, action) => {
    if (action.type === GET_FIHR_LIST) {
      return {
        ...state,
        fihr_list: action.payload,
      };
    }
    return state;
  };
  