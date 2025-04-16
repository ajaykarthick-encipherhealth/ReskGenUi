import { combineReducers } from "redux";
import { handleActions } from "redux-actions";
import {
  batchUpload,
  getAllBatches,
  getBatchInfo,
  activeTab,
  upoloadFiles,
  getCreateBatch,
  getRoutedData,
  getSupervisorName,
  providerRoasterExcelAction,
  practiceRoasterExcelAction,
  patientRoasterExcelAction,
  providerRoasterAction,
  patientRoasterAction,
  praticeRoasterAction,
  tinRoasterExcelAction,
  tinRoasterAction,
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
const getStateDetails = handleActions(
  {
    [getRoutedData.toString()]: (state, { payload }) => payload,
  },
  ""
);
const getSupervisorDetails = handleActions(
  {
    [getSupervisorName.toString()]: (state, { payload }) => payload,
  },
  ""
);

const patientSyncReducer = combineReducers({
  allBatches: createReducer(getAllBatches),
  getBatch: createReducer(getBatchInfo),
  batchUpload: createReducer(batchUpload),
  routedData: getStateDetails,
  supervisorUserName: getSupervisorDetails,
  providerRoasterExcelUpload: createReducer(providerRoasterExcelAction),
  practiceRoasterExcelUpload: createReducer(practiceRoasterExcelAction),
  patientRoasterExcelUpload: createReducer(patientRoasterExcelAction),
  tinRoasterExcelUpload: createReducer(tinRoasterExcelAction),
  providerRoaster: createReducer(providerRoasterAction),
  practiceRoaster: createReducer(praticeRoasterAction),
  patientRoaster: createReducer(patientRoasterAction),
  tinRoaster: createReducer(tinRoasterAction),


  // loaders
  getBatchLoader: getReportLoading(getBatchInfo),
  batchLoader: getReportLoading(getAllBatches),
  allBatchesLoader: getReportLoading(getAllBatches),
  uploadFilesLoader: getReportLoading(upoloadFiles),
  createBatchLoader: getReportLoading(getCreateBatch),
  tinRoasterLoader: getReportLoading(tinRoasterAction),
  practiceLoader: getReportLoading(praticeRoasterAction),
  patientLoader: getReportLoading(patientRoasterAction),
  providerLoader: getReportLoading(providerRoasterAction),
});

export default patientSyncReducer;
