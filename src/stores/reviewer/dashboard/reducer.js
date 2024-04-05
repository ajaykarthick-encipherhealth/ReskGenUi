// import { combineReducers } from "redux";
// import { handleActions } from "redux-actions";
// import { workFlowAction } from "./actions";]


// const getUsersDetailsLoading = handleActions(
//   {
//     [getUsersDetails.START]: () => true,
//     [getUsersDetails.SUCCEEDED]: () => false,
//     [getUsersDetails.FAILED]: () => false,
//   },
//   false
// );

// const WorkFlowData = handleActions(
//   {
//     [workFlowAction.SUCCEEDED]: (state, { payload }) => {
//       return payload;
//     },
//   },
//   {}
// );

// export default combineReducers({
//   response:WorkFlowData
// });

import { combineReducers } from "redux";
import { handleActions } from "redux-actions";
import { workFlowAction, dailyTaskAction, accuracyAction,completedScoreAction, holdStatusAction, notificationAction } from "./actions";

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

const dashbaordReducer = combineReducers({
  workFlow: createReducer(workFlowAction),
  dailyTask: createReducer(dailyTaskAction),
  accuracy: createReducer(accuracyAction),
  completedScore:createReducer(completedScoreAction),
  holdStatus:createReducer(holdStatusAction),
  notification:createReducer(notificationAction)
});

export default dashbaordReducer;
