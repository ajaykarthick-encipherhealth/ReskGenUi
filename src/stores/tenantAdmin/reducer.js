import { combineReducers } from "redux";
import { handleActions } from "redux-actions";
import {
  batchUpload,
  getAllFileProcessAction,
  getAllOrganizationAction,
  getAllPatientAction,
  getAllTrackingAction,
  getAllUsersAction,
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
  batchUpload: createReducer(batchUpload),
  allOrganization: createReducer(getAllOrganizationAction),
  allUsers: createReducer(getAllUsersAction),
  allPatients: createReducer(getAllPatientAction),
  allTracking: createReducer(getAllTrackingAction),
  allFileProcessing: createReducer(getAllFileProcessAction),
});

export default searchReducer;
