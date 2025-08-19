import { createActionThunk } from "../../utils/redux";
import * as network from "./network";


export const tableViewAction = createActionThunk(
  "TABLE_VIEW",
  network.getTableView
);
export const tableDynamicColumn = createActionThunk(
  "TABLE_DYNAMIC_COLUMN",
  network.dynamicColumn
);
export const tableDynamicChecked = createActionThunk(
  "TABLE_DYNAMIC_COLUMN_CHECKED",
  network.getTableViewChecked
);
export const tinDynamicChecked = createActionThunk(
  "TABLE_Tin_COLUMN_CHECKED",
  network.getTinViewChecked
);
export const tableDynamicColumnReset = createActionThunk(
  "TABLE_DYNAMIC_COLUMN_RESET",
  network.dynamicColumnReset
);
export const getTableStatusAction = createActionThunk(
  "GET_TABLE_STATUS_ACTION",
  network.getStatusTableView
);
export const getTinCountAction = createActionThunk(
  "GET_TIN_STATUS_ACTION",
  network.getTinCount
);
export const setTinStatus = createActionThunk(
  "TIN_STATUS_ACTION",
  network.changeTinStatus
);
export const tinData = createActionThunk(
  "TIN_VIEW_DATA",
  network.getTableView
);