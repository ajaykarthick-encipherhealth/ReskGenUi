
import { combineReducers } from "redux";
import { handleActions } from "redux-actions";
import { codifyAction } from "./actions";
import {codesAction} from "./actions";
import { riskadjustmentAction } from "./actions";
import {searchesAction} from "./actions";
import {autoCompleteAction} from "./actions";
import {indexesAction} from "./actions";
import{codify} from './network'

const initialState = {
  loading: false,
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
  codifyLoader:getCodifyLoading(codifyAction)
  
});

export default codifyReducer;
