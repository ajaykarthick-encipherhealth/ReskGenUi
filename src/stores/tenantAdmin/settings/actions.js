import { createActionThunk } from "../../../utils/redux";
import * as network from "./network";

export const configurationSettingsAction = createActionThunk(
  "CONFIGURATION_SETTINGS",
  network.configurationSettings
);

export const codingGuidelinesAction = createActionThunk(
  "CODING_GUIDELINES",
  network.codingGuidelines
);

export const updateSettingsAction = createActionThunk(
  "UPDATE_SETTINGS",
  network.updateSettings
);

export const manualAddAction = createActionThunk(
  "MANUAL_ADD",
  network.manualAdd
);

export const healthMetricAddAction = createActionThunk(
  "HEALTH_METRIC_ADD",
  network.healthMetricAdd
);