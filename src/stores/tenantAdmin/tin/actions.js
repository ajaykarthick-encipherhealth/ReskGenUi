import { createAction } from "redux-actions";
import { createActionThunk } from "../../../utils/redux";
import * as network from "./network";

export const getAllocationRoutedData = createAction(
  "GET_ALLOCATION_ROUTED_DATA"
);
export const getProjectActiveTab = createAction("GET_TIN_ACTIVETAB");
export const pageRendering = createAction("PAGE_RENDERING");

// add provider
export const getAddProvider = createActionThunk(
  "GET_ADD_PROVIDER",
  network.addProvider
);

//NPI List
export const getProviderNPIList = createActionThunk(
  "GET_PROVIDER_NPI_LIST",
  network.getProviderNPIList
);

//NPI Name List
export const getProviderNameList = createActionThunk(
  "GET_PROVIDER_NAME_LIST",
  network.getProviderNameList
);
