import { createActionThunk } from "../../utils/redux";
import * as network from "./network";

export const batchUpload = createActionThunk(
  "BATCH_UPLOAD",
  network.batchUploadCall
);
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

export const uploadFileAction = createActionThunk(
  "UPLOAD_FILE",
  network.handleUploadFile
);

export const getAllOrganizationAction = createActionThunk(
  "GET_ALL_ORGANIZATION",
  network.getAllOrganization
);
export const getAllUsersAction = createActionThunk(
  "GET_ALL_USERS",
  network.getallUsers
);
export const getAllPatientAction = createActionThunk(
  "GET_ALL_PATIENT",
  network.getAllPatient
);
export const getAllTrackingAction = createActionThunk(
  "GET_ALL_TARACKING",
  network.getAllTracking
);
export const getAllFileProcessAction = createActionThunk(
  "GET_ALL_FILE_PROCESS",
  network.getAllFileProcess
);
export const getAllBatches=createActionThunk(
  'GET_ALL_BATCHES',
  network.allBatches
)
export const getCreateBatch=createActionThunk(
  'CREATE_BATCHES',
  network.createBatch
)
export const getBatchInfo=createActionThunk(
  'GET_BATCH_INFO',
  network.batchDetails
)