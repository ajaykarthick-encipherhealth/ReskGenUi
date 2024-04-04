// import { combineReducers } from "redux";
// import { handleActions } from "redux-actions";
// import { workFlowAction } from "./actions";

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
import { workFlowAction, dailyTaskAction, accuracyAction,completedScoreAction } from "./actions";

const initialState = {
  loading: true,
  data: null,
  error: null,
};

const createReducer = (actionType) =>
  handleActions(
    {
      [actionType.REQUESTED]: (state, action) => ({
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

const rootReducer = combineReducers({
  workFlow: createReducer(workFlowAction),
  dailyTask: createReducer(dailyTaskAction),
  accuracy: createReducer(accuracyAction),
  completedScore:createReducer(completedScoreAction)
});

export default rootReducer;
