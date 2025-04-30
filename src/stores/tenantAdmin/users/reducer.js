import { combineReducers } from "redux";
import { handleActions } from "redux-actions";
import { getAllOrganizationAction, getAllUsersAction,getUsers,usersAssigned } from "./actions";

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

const tenantAminUsersReducer = combineReducers({
  allOrganization: createReducer(getAllOrganizationAction),
  allUsers: createReducer(getAllUsersAction),
  getAllUsersData:createReducer(getUsers),
  assignedUsers:createReducer(usersAssigned),

  // loaders
  allOrganizationLoader: getReportLoading(getAllOrganizationAction),
  allUsersLoading: getReportLoading(getAllUsersAction),
  usersLoader:getReportLoading(getUsers)
});

export default tenantAminUsersReducer;
