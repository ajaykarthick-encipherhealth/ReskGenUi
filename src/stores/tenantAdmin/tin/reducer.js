import { combineReducers } from "redux";
import { handleActions } from "redux-actions";
import { getAllocationRoutedData ,getProjectActiveTab,pageRendering,  getAddProvider,
  getProviderNPIList,
  getProviderNameList,} from "./actions";

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

const getAllocationDetails = handleActions(
  {
    [getAllocationRoutedData.toString()]: (state, { payload }) => payload,
  },
  ""
);
const getProjectActiveTabDetails = handleActions(
  {
    [getProjectActiveTab.toString()]: (state, { payload }) => payload,
  },
  ""
);
const getPageRendering = handleActions(
  {
    [pageRendering.toString()]: (state, { payload }) => payload,
  },
  false
);




const tinPatientReducer = combineReducers({
  allocationRoutedData:getAllocationDetails,
  activeTabRoutedData:getProjectActiveTabDetails,
  getPageRendering: getPageRendering,
  getAddProvider:createReducer(getAddProvider),
  getProviderNameList:createReducer(getProviderNameList),
  getProviderNPIList:createReducer(getProviderNPIList),
  getProviderNameLoad:getReportLoading(getProviderNameList),

});

export default tinPatientReducer;
