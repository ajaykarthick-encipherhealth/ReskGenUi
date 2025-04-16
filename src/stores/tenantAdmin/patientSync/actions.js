import { createAction } from "redux-actions";
import { createActionThunk } from "../../../utils/redux";
import * as network from "./network";

export const batchUpload = createActionThunk(
  "BATCH_UPLOAD",
  network.batchUploadCall
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
export const upoloadFiles=createActionThunk(
  'UPOLOAD_FILES',
  network.uploadFiles
)
export const getTriggerBatch=createActionThunk(
  'TRIGGER_BATCH',
  network.triggerBatch
)
export const getRoutedData = createAction("GET_ROUTED_DATA");

export const getSupervisorName =createAction("SELECTED_SUPERVISOR_USER");

export const providerRoasterExcelAction=createActionThunk(
  'PROVIDER_ROASTER_EXCEL',
  network.providerRoasterExcel
)
export const practiceRoasterExcelAction=createActionThunk(
  'PRACTICE_ROASTER_EXCEL',
  network.practiceRoasterExcel
)
export const patientRoasterExcelAction=createActionThunk(
  'PATIENT_ROASTER_EXCEL',
  network.patientRoasterExcel
)
export const tinRoasterExcelAction=createActionThunk(
  'TIN_ROASTER_EXCEL',
  network.tinRoasterExcel
)
export const providerRoasterAction=createActionThunk(
  'PROVIDER_ROASTER',
  network.providerRoaster
)

export const praticeRoasterAction=createActionThunk(
  'PRACTICE_ROASTER',
  network.practiceRoaster
)

export const patientRoasterAction=createActionThunk(
  'PATIENT_ROASTER',
  network.patientRoaster
)

export const tinRoasterAction=createActionThunk(
  'TIN_ROASTER',
  network.tinRoaster
)
