import { combineReducers } from "redux";
import { handleActions } from "redux-actions";
import { receivedReport, reviewerReport, sentReport } from "./actions";

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


  const getReportLoading=(type) => handleActions(
  {
    [type.START]: () => true,
    [type.SUCCEEDED]: () => false,
    [type.FAILED]: () => false,
  },
  false
);

const ReportReducer = combineReducers({
  reviewer: createReducer(reviewerReport),
  reviewerLoader: getReportLoading(reviewerReport),
  sent: createReducer(sentReport),
  sentLoader: getReportLoading(sentReport),
  received: createReducer(receivedReport),
  receivedLoader: getReportLoading(receivedReport)

});

export default ReportReducer;