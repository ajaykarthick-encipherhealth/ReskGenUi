import { combineReducers } from "redux";
import { handleActions } from "redux-actions";
import {
  codingGuidelinesAction,
  configurationSettingsAction,
  configurationUpdateSettings,
  emrConnectAction,
  fhirConnectAction,
  fhirInstructionsAction,
  fhirListAction,
  fhirOrgSubmiAction,
  getFlags,
  healthMetricAddAction,
  createClientAction,
  fhirServicesAction,
  updateSettingsAction,createProjectAction ,getProjectAction} from "./actions";

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

const tenantAminSettingsReducer = combineReducers({
  configurationSettings: createReducer(configurationSettingsAction),
  getFlagsList: createReducer(getFlags),
  configurationUpdateSettings: createReducer(configurationUpdateSettings),
  codingGuidelines: createReducer(codingGuidelinesAction),
  updateSetting: createReducer(updateSettingsAction),
  fhirInstructions: createReducer(fhirInstructionsAction),
  fhirConnectStatus: createReducer(fhirConnectAction),
  fhirList: createReducer(fhirListAction),
  fhirServicesList: createReducer(fhirServicesAction),
  createProject:createReducer(createProjectAction),
  getProject:createReducer(getProjectAction),
  getProjectLoader:getReportLoading(getProjectAction),
  createClient:createReducer(createClientAction),
  clientCreationLoading:getReportLoading(createClientAction),
  projectCreationLoading:getReportLoading(createProjectAction)
});



export default tenantAminSettingsReducer;
