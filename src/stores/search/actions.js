import { createActionThunk } from "../../utils/redux";
import * as network from "./network";

export const getAllICDCodes = createActionThunk(
  "GET_ALL_ICD_CODES",
  network.icdCodes
);

export const createICDCodes = createActionThunk(
  "CREATE_ICD_CODES",
  network.createIcdCode
);

export const deleteICDCodes = createActionThunk(
  "DELETE_ICD_CODES",
  network.deleteIcdCode
);

export const getSimpleSearch = createActionThunk(
  "GET_SIMPLE_SEARCH",
  network.getSimple
);

export const getSemanticSearch = createActionThunk(
  "GET_SEMANTIC_SEARCH",
  network.getSemantic
);

export const updateSemantic = createActionThunk(
  "UPDATE_SEMANTIC",
  network.updateSemantic
);