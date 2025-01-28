
import { combineReducers } from "redux";
import { handleActions } from "redux-actions";
import {indexesAction,addCodesAction,autoCompleteAction,searchesAction,riskadjustmentAction,codesAction,codifyAction} from "./actions";
import{codify} from './network'
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


  const getCodifyLoading=(type) => handleActions(
  {
    [type.START]: () => true,
    [type.SUCCEEDED]: () => false,
    [type.FAILED]: () => false,
  },
  false
);
  
const codifyReducer = combineReducers({
  
  codify:createReducer(codifyAction),
  codes:createReducer(codesAction),
  riskadjustment:createReducer(riskadjustmentAction),
  searches:createReducer(searchesAction),
  autocomplete:createReducer(autoCompleteAction),
  indexes:createReducer(indexesAction),
  indexesLoading:getCodifyLoading(indexesAction),
  codifyLoader:getCodifyLoading(codifyAction),
  addCodes:createReducer(addCodesAction),
  codesLoader:getCodifyLoading(codesAction),
  
});

export default codifyReducer;
