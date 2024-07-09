import { combineReducers } from "redux";
import { handleActions } from "redux-actions";
import {
  HccCodes,
  getAllRafScore,
  RafCounts,
  FilesCount,
  ComputingStatus,
  top10Diseases,
  topOigCodes,
  computingTileStatus,
  rafScore,
} from "./action";

const initialState = {
  loading: true,
  data: null,
  error: null,
};

const createReducer = (actionType) =>
  handleActions(
    {
      [actionType?.STARTED]: (state, action) => ({
        ...state,
        loading: true,
        error: null,
      }),
      [actionType?.SUCCEEDED]: (state, action) => ({
        ...state,
        loading: false,
        data: action.payload,
        error: null,
      }),
      [actionType?.FAILED]: (state, action) => ({
        ...state,
        loading: false,
        error: action.payload,
      }),
    },
    initialState
  );

const getReportLoading = (type) =>
  handleActions(
    {
      [type.START]: () => true,
      [type.SUCCEEDED]: () => false,
      [type.FAILED]: () => false,
    },
    false
  );

const tenantAdminDefault = combineReducers({
  allHccCodes: createReducer(HccCodes),
  allRafCounts: createReducer(RafCounts),
  allFilesCounts: createReducer(FilesCount),
  allComputingStatus: createReducer(ComputingStatus),
  allRafScoreData: createReducer(getAllRafScore),
  allTop10Diseases: createReducer(top10Diseases),
  allTopOigCodes: createReducer(topOigCodes),
  allComputingTileStatus: createReducer(computingTileStatus),
  allRafScore: createReducer(rafScore),
  rafScoreLoader: createReducer(rafScore),
});

export default tenantAdminDefault;
