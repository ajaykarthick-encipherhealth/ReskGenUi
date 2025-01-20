

import { combineReducers } from "redux";
import { handleActions } from "redux-actions";
import {
  accuracyAction,
  dailyTaskAction,
  dailyTaskData,
  getDailyTaskData,
  holdStatusAction,
  supervisorWorkFlowAction,
  completedChartAction,
  getUserByIndividualAction
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

const getUsersDetailsLoading = (type) =>
  handleActions(
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
const dashboardReducer = combineReducers({
  workFlow: createReducer(supervisorWorkFlowAction),
  workFlowLoading: getUsersDetailsLoading(supervisorWorkFlowAction),
  dailyTask: createReducer(dailyTaskAction),
  dailyTaskLoader:getUsersDetailsLoading(dailyTaskAction),
  dailyTaskDatas: getDailyTaskDatas(dailyTaskData),
  accuracyLoading: getUsersDetailsLoading(accuracyAction),
  accuracy: createReducer(accuracyAction),
  completedChart: createReducer(completedChartAction),
  completedChartLoading: getUsersDetailsLoading(completedChartAction),
  // completedScore: createReducer(completedScoreAction),
  // completedScoreLoading: getUsersDetailsLoading(completedScoreAction),
  holdStatus: createReducer(holdStatusAction),
  // notification: createReducer(notificationAction),
  // tenentLogo: createReducer(tenentLogoAction),
  individualUser: createReducer(getUserByIndividualAction),
});

export default dashboardReducer;
