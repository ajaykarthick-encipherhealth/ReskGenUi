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
