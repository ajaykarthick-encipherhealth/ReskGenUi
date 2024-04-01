import { combineReducers } from "redux";
import { handleActions } from "redux-actions";
import { workFlowAction } from "./actions";


const getWorkFlow = handleActions(
  {
    [workFlowAction.SUCCEEDED]: (state, { payload }) => {
      return payload;
    },
  },
  {}
);

export default combineReducers({
  getWorkFlow,
});
