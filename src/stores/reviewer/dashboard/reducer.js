
import { combineReducers } from "redux";
import { handleActions } from "redux-actions";
import { workFlowAction,dailyTaskData, dailyTaskAction, accuracyAction,completedScoreAction, holdStatusAction, notificationAction, tenentLogoAction,reviewerFilterList } from "./actions";

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


  const getUsersDetailsLoading=(type) => handleActions(
  {
    [type.START]: () => true,
    [type.SUCCEEDED]: () => false,
    [type.FAILED]: () => false,
  },
  false
);
const getDailyTaskDatas = (action) =>
  handleActions(
    {
      [action.toString()]: (state, { payload }) => payload,
    },
    ""
  );
const dashbaordReducer = combineReducers({
  workFlow: createReducer(workFlowAction),
  dailyTask: createReducer(dailyTaskAction),
  accuracyLoading: getUsersDetailsLoading(accuracyAction),
  accuracy: createReducer(accuracyAction),
  completedScore:createReducer(completedScoreAction),
  completedScoreLoading: getUsersDetailsLoading(completedScoreAction),
  holdStatus:createReducer(holdStatusAction),
  notification:createReducer(notificationAction),
  tenentLogo:createReducer(tenentLogoAction),
  dailyTaskDatas: getDailyTaskDatas(dailyTaskData),
  reviwerPatientFilterList:createReducer(reviewerFilterList),
});

export default dashbaordReducer;