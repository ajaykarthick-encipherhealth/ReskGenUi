import { combineReducers } from "redux";
import { handleActions } from "redux-actions";
import { getAllOrganizationAction, getAllUsersAction } from "./actions";

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

const getReportLoading = (type) =>
  handleActions(
    {
      [type.START]: () => true,
      [type.SUCCEEDED]: () => false,
      [type.FAILED]: () => false,
    },
    false
  );

const adminUsersReducer = combineReducers({
  allOrganization: createReducer(getAllOrganizationAction),
  allUsers: createReducer(getAllUsersAction),

  // loaders
  allOrganizationLoader: getReportLoading(getAllOrganizationAction),
  allUsersLoading: getReportLoading(getAllUsersAction),
});

export default adminUsersReducer;
