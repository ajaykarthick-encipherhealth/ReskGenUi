import { combineReducers } from "redux";
import { handleActions } from "redux-actions";
import { adminApi } from "./network";
import {
  activeTab,
  adminCheckAllReport,
  adminReport,
  getExportDetails,
  getReportActiveTab,
  getUsersList,
  getUsersLists,
  selectedReport,
  selectedRow,
  updateSentReport,
  receivedReport,
  GetSelectedReport,
  sentReport,
  getSelectedReportDetails
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

const getReportLoading = (type) =>
  handleActions(
    {
      [type.START]: () => true,
      [type.SUCCEEDED]: () => false,
      [type.FAILED]: () => false,
    },
    false
  );

const getActiveTabData = (action) =>
  handleActions(
    {
      [action.toString()]: (state, { payload }) => payload,
    },
    ""
  );
const getActiveTabDataReport = (action) =>
  handleActions(
    {
      [action.toString()]: (state, { payload }) => payload,
    },
    ""
  );
const getActiveSelectedReport = (action) =>
  handleActions(
    {
      [action.toString()]: (state, { payload }) => payload,
    },
    ""
  );
const selectedRowReport = (action) =>
  handleActions(
    {
      [action.toString()]: (state, { payload }) => payload,
    },
    ""
  );

const ReportReducer = combineReducers({
  admin: createReducer(adminReport),
  adminLoader: getReportLoading(adminReport),
  checkedData: createReducer(adminCheckAllReport),
  checkedLoader: getReportLoading(adminCheckAllReport),
  selectedRow: selectedRowReport(selectedRow),
  activeTab: getActiveTabData(activeTab),
  updateSentReport: createReducer(updateSentReport),
  usersList: createReducer(getUsersList),
  usersLists: createReducer(getUsersLists),
  selectedReport: getActiveSelectedReport(selectedReport),
  exportData: createReducer(getExportDetails),
  getReportActiveTab: getActiveTabDataReport(getReportActiveTab),
  receivedReport: createReducer(receivedReport),
  GetSelectedReport: createReducer(GetSelectedReport),
  sentReport: createReducer(sentReport),
  uploadFile:createReducer(getSelectedReportDetails),
});

export default ReportReducer;
