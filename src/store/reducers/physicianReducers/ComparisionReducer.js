import { COMPARISON } from "../../../services/physicianService/comparisionService";

const initialState = {
    data:null,
  };


  export const PhysicianComparisonReducer = (state = initialState, action) => {
    if (action.type === COMPARISON) {
      return {
        ...state,
        data: action.payload,
      };
    }
   
    return state;
};