import { combineReducers } from "redux";
import { handleActions } from "redux-actions";
import { loadFilterPatientList } from "./actions";

const filterPatientList = handleActions(
  {
    [loadFilterPatientList.SUCCEEDED]: (state, { payload }) => {
      return payload;
    },
  },
  {}
);

export default combineReducers({
  filterPatientList,
});
