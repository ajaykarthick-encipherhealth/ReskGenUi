import { combineReducers } from "redux";
import { handleActions } from "redux-actions";
import { getUsers,getIndividualUsers,getCurrentUserInfo,getCurrentUserAction,getWorkQueueList} from "./actions";

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

const UsersReducer = combineReducers({
  getUsersList: createReducer(getUsers),
  usersLoading: getReportLoading(getUsers),
  getIndividualUsersList: createReducer(getIndividualUsers),
  individualUserLoading: getReportLoading(getWorkQueueList),
  currentUser: createReducer(getCurrentUserInfo),
  user: createReducer(getCurrentUserAction),
  workQueueList:createReducer(getWorkQueueList),
});

export default UsersReducer;
