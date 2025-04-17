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


