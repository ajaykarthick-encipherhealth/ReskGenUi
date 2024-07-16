import { combineReducers } from "redux";
import { handleActions } from "redux-actions";
import {
  userStatusAction,
  auditorStatusAction,
  allocatedStatusAction,
  reviewerStatusAction,
  organizationStatusAction,
  getAccuracyWorkflow,
} from "./action";

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

const getStatusLoading = (type) =>
  handleActions(
    {
      [type.START]: () => true,
      [type.SUCCEEDED]: () => false,
      [type.FAILED]: () => false,
    },
    false
  );

const workFlowReducer = combineReducers({
  userStatus: createReducer(userStatusAction),
  auditorStatus: createReducer(auditorStatusAction),
  allocatedStatus: createReducer(allocatedStatusAction),
  reviewerStatus: createReducer(reviewerStatusAction),
  organizationStatus: createReducer(organizationStatusAction),
  userLoader: getStatusLoading(userStatusAction),
  auditorLoader: getStatusLoading(auditorStatusAction),
  allocatedLoader: getStatusLoading(allocatedStatusAction),
  reviewerLoader: getStatusLoading(reviewerStatusAction),
  organizationLoader: getStatusLoading(organizationStatusAction),
  getAccuracyWorkflow: createReducer(getAccuracyWorkflow),
});

export default workFlowReducer;
