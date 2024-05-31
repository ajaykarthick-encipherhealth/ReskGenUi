
import { combineReducers } from "redux";
import { handleActions } from "redux-actions";
import { codifyAction } from "./actions";
import {codesAction} from "./actions";
import { riskadjustmentAction } from "./actions";

const initialState = {
  loading: true,
  data: null,
  error: null,
};

const createReducer = (actionType) =>
  handleActions(
    {
      [actionType.STARTED]: (state, action) => ({
        ...state,
        loading: true,
        error: null,
      }),
      [actionType.SUCCEEDED]: (state, action) => ({
        ...state,
        loading: false,
        data: action.payload,
        error: null,
      }),
      [actionType.FAILED]: (state, action) => ({
        ...state,
        loading: false,
        error: action.payload,
      }),
    },
    initialState
  );
  
const dashbaordReducer = combineReducers({
  
  codify:createReducer(codifyAction),
  codes:createReducer(codesAction),
  riskadjustment:createReducer(riskadjustmentAction),
});

export default dashbaordReducer;
