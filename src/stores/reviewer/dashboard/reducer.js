import { combineReducers } from "redux";
import { handleActions } from "redux-actions";
import { workFlowAction } from "./actions";


const WorkFlowData = handleActions(
  {
    [workFlowAction.SUCCEEDED]: (state, { payload }) => {
      return payload;
    },
  },
  {}
);

export default combineReducers({
  response:WorkFlowData
});
