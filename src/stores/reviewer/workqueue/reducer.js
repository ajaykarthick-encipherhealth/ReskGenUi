import { combineReducers } from "redux";
import { handleActions } from "redux-actions";
import { loadDashboard } from "./actions";

const dashboard = handleActions(
  {
    [loadDashboard.SUCCEEDED]: (state, { payload }) => {
      return payload;
    },
  },
  {}
);

export default combineReducers({
  dashboard,
});
