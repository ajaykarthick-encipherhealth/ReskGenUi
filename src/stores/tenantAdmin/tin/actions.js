import { createAction } from "redux-actions";
import { createActionThunk } from "../../../utils/redux";
import * as network from "./network";

export const getAllocationRoutedData = createAction("GET_ALLOCATION_ROUTED_DATA");
export const getProjectActiveTab = createAction("GET_TIN_ACTIVETAB");