import { combineReducers } from "redux";
import { handleActions } from "redux-actions";
import {
  getAllICDCodes,
  createICDCodes,
  getSimpleSearch,
  getSemanticSearch,
  updateSemantic,
  deleteICDCodes,
  getSuggestedCodes
} from "./actions";

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

const searchReducer = combineReducers({
  icdCodes: createReducer(getAllICDCodes),
  createIcdCode: createReducer(createICDCodes),
  deleteICDCodes: createReducer(deleteICDCodes),
  getSimpleSearch: createReducer(getSimpleSearch),
  getSemanticSearch: createReducer(getSemanticSearch),
  updateSemantic: createReducer(updateSemantic),
  getSuggestedCodes: createReducer(getSuggestedCodes)
});

export default searchReducer;
