import { combineReducers } from "redux";
import { handleActions } from "redux-actions";
import {
  getAllReviewerList,
  getAllCheckedReviewers,
  getAllSupervisorList,
  getSelectedSupervisorList,
  getAllCheckListForSupervisor,
  getFilterOptions,
  getAllAllocationList,
  getAllocatedCount,
  updateAllocationList
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
const patientsAllocationReducer = combineReducers({
  reviewersList: createReducer(getAllReviewerList),
  loader: getReportLoading(getAllReviewerList),
  checkedLoader: getReportLoading(getAllCheckedReviewers),
  filterOptions:createReducer(getFilterOptions),
  // supervisorAllocation
  supervisorsList: createReducer(getAllSupervisorList),
  supervisorLoaders: getReportLoading(getAllSupervisorList),
  selectedList: createReducer(getSelectedSupervisorList),
  selectedLoader: getReportLoading(getSelectedSupervisorList),
  supervisorCheckedList: createReducer(getAllCheckListForSupervisor),
  supervisorCheckedLoader: getReportLoading(getAllCheckListForSupervisor),
  allocationList:createReducer(getAllAllocationList),
  allocationCount:createReducer(getAllocatedCount),
  updateAllocationData:createReducer(updateAllocationList),
  supervisorListLoader:getReportLoading(getAllAllocationList),
  supervisorLoader:getReportLoading(getSelectedSupervisorList)

});

export default patientsAllocationReducer;
