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
import { workFlowAction, dailyTaskAction, accuracyAction,completedScoreAction, holdStatusAction, notificationAction, tenentLogoAction,teamChartAction, getSelectUserList,getDeliveryStatus, getDateRange } from "./actions";

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

const getDateRangesData = (action) =>
  handleActions(
    {
      [action.toString()]: (state, { payload }) => payload,
    },
    ""
  );
const dashbaordReducer = combineReducers({
  workFlow: createReducer(workFlowAction),
  workFlowLoader: getUsersDetailsLoading(workFlowAction),
  dailyTask: createReducer(dailyTaskAction),
  dailyTaskLoading:getUsersDetailsLoading(dailyTaskAction),
  accuracyLoading: getUsersDetailsLoading(accuracyAction),
  accuracy: createReducer(accuracyAction),
  completedScore:createReducer(completedScoreAction),
  completedScoreLoading: getUsersDetailsLoading(completedScoreAction),
  holdStatus:createReducer(holdStatusAction),
  notification:createReducer(notificationAction),
  tenentLogo:createReducer(tenentLogoAction),
  teamChartData:createReducer(teamChartAction),
  teamChartLoader:getUsersDetailsLoading(teamChartAction),
  managersList:createReducer(getSelectUserList),
  deliveryStatus:createReducer(getDeliveryStatus),
  deliveryStatusLoader:getUsersDetailsLoading(getDeliveryStatus),
  dateRanges:getDateRangesData(getDateRange)
});

export default dashbaordReducer;
