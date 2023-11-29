import { combineReducers } from "redux";
import { handleActions } from "redux-actions";
import { loadFilterPatientList,loadTimelineList } from "./actions";

const filterPatientList = handleActions(
  {
    [loadFilterPatientList.SUCCEEDED]: (state, { payload }) => {
      return payload;
    },
  },
  {}
);

const timeLineList = handleActions(
  {
    [loadTimelineList.SUCCEEDED]: (state, { payload }) => {
      return payload;
    },
  },
  {}
);

export default combineReducers({
  filterPatientList,
  timeLineList,
});
