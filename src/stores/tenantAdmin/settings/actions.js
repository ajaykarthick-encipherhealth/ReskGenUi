import { createActionThunk } from "../../../utils/redux";
import * as network from "./network";

export const batchUpload = createActionThunk(
  "BATCH_UPLOAD",
  network.batchUploadCall
);

export const configurationSettingsAction = createActionThunk(
  "CONFIGURATION_SETTINGS",
  network.configurationSettings
);
export const getFlags = createActionThunk(
  "GET_FLAGES",
  network.configurationFlags
);

export const configurationUpdateSettings = createActionThunk(
  "CONFIGURATION_UPDATE_SETTINGS",
  network.configurationUpdateSettings
);
export const updateChatAudit = createActionThunk(
  "UPDATE_CHAT_AUDIT",
  network.updateChatAuditConf
);
export const updateMedical = createActionThunk(
  "UPDATE_MEDICAL",
  network.updateMedicalCoding
);
export const updateInsulinConfig = createActionThunk(
  "UPDATE_INULIN_CONFIG",
  network.updateInsulinConfigs
);
export const updateMedication = createActionThunk(
  "UPDATE_MEDICAL",
  network.updateMedications
);
export const updateFlags = createActionThunk(
  "UPDATE_FLAGS",
  network.updateFlag
);
export const deleteFlags = createActionThunk(
  "DELETE_FLAG",
  network.deleteFlag
);
export const codingGuidelinesAction = createActionThunk(
  "CODING_GUIDELINES",
  network.codingGuidelines
);

export const updateSettingsAction = createActionThunk(
  "UPDATE_SETTINGS",
  network.updateSettings
);
export const getAllOrganizationAction = createActionThunk(
  "GET_ALL_ORGANIZATION",
  network.getAllOrganization
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
export const getCustomUsersAction=createActionThunk(
  'GET_CUSTOM_USERS',
  network.getCustomAllUsers
)
export const updateDirectCode = createActionThunk(
  "UPDATE_DIRECT_CODE",
  network.updateDirectCodes
);
export const updateComorbidCondition = createActionThunk(
  "UPDATE_COMORBID_CONDITION",
  network.updateComorbidConditions
);
export const updateCriticalCondition = createActionThunk(
  "UPDATE_CRITICAL_CONDITION",
  network.updateCriticalConditions
);
export const updateHistoryCode = createActionThunk(
  "UPDATE_HISTORY_CODE",
  network.updateHistoryCodes
);
export const updateDownCodes = createActionThunk(
  "UPDATE_DOWN_CODES",
  network.updateDownCode
);
export const updateRafConfigs = createActionThunk(
  "UPDATE_DOWN_CODES",
  network.updateRafConfig
);
export const uploadFiles = createActionThunk(
  "GET_FILE_PROCESS_SETTINGS",
  network.uploadFile
);
export const editHealthMetric = createActionThunk(
  "EDIT_HEALTH_METRIC",
  network.editHealthMertic
);
export const editComoridConditions = createActionThunk(
  "EDIT_COMORID_CONDITIONS",
  network.editComoridCondition
);
export const deleteComoridConditions = createActionThunk(
  "DELETE_COMORID_CONDITIONS",
  network.deleteComoridCondition
);
export const addManually = createActionThunk(
  "ADD_MANUALLY_SETTINGS",
  network.addManually
);
export const addHealthMetric = createActionThunk(
  "ADD_HEALTH_METRIC",
  network.addHealthMetric
);