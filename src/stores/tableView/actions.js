import { createActionThunk } from "../../utils/redux";
import * as network from "./network";



export const tableViewAction = createActionThunk(
  "TABLE_VIEW",
  network.getTableView
);


