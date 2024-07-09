import { combineReducers } from "redux";
import { handleActions } from "redux-actions";
import {
  codingGuidelinesAction,
  configurationSettingsAction,
  configurationUpdateSettings,
  getFlags,
  healthMetricAddAction,
  manualAddAction,
  updateSettingsAction, } from "./actions";

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
  // manualAdd: createReducer(manualAddAction),
  // healthMetricAdd: createReducer(healthMetricAddAction),
});
// configurationSettings: createReducer(configurationSettingsAction),
// getFlagsList: createReducer(getFlags),
// configurationUpdateSettings: createReducer(configurationUpdateSettings),
// codingGuidelines: createReducer(codingGuidelinesAction),
// updateSetting: createReducer(updateSettingsAction),
// manualAdd: createReducer(manualAddAction),
// healthMetricAdd: createReducer(healthMetricAddAction),


export default tenantAminSettingsReducer;
