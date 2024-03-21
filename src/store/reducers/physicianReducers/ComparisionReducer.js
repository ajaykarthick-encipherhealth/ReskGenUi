import { COMPARISON,COLORS } from "../../../services/physicianService/comparisionService";

const initialState = {
    data:null,
    colors:null
  };


  export const PhysicianComparisonReducer = (state = initialState, action) => {
    if (action.type === COMPARISON) {
      return {
        ...state,
        data: action.payload,
      };
    }
    if (action.type === COLORS) {
      return {
        ...state,
        colors: action.payload,
      };
    }
   
    return state;
};