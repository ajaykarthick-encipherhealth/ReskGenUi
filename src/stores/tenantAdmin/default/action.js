import { createActionThunk } from "../../../utils/redux";
import * as network from "./network";

export const HccCodes = createActionThunk(
  "GET_ALL_HCC_CODES",
  network.getAllHccCodes
);

export const RafCounts = createActionThunk(
  "GET_ALL_RAF_COUNTS_REVENIEW",
  network.getAllRaf
);

export const FilesCount = createActionThunk(
  "GET_ALL_FILES_COUNT",
  network.getAllFilesCount
);

export const ComputingStatus = createActionThunk(
  "GET_ALL_COMPUTING_STATUS_CHART",
  network.getAllComputing
);

export const RafCountScore = createActionThunk(
  "GET_ALL_RAF_COUNTS_SCORE",
  network.getAllRafScore
);
export const top10Diseases = createActionThunk(
  "GET_TOP10_DISEASES",
  network.getTop10Diseases
);
export const topOigCodes  = createActionThunk(
  "GET_TOP10_DISEASES",
  network.getTopOigCodes
);

