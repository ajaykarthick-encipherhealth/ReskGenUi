import { createActionThunk } from "../../../utils/redux";
import * as network from "./network";

export const getAllList = createActionThunk(
  "LIST",
  network.allocatedGetList
);

export const getSupervisorsList = createActionThunk(
  "L2_LIST",
  network.l2List
);

export const getSelectedSupervisorList = createActionThunk(
  "SELECTED_SUPERVISOR",
  network.selectedList
);