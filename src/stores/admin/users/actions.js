import { createActionThunk } from "../../../utils/redux";
import * as network from "./network";

export const getAllOrganizationAction = createActionThunk(
  "GET_ALL_ORGANIZATION",
  network.getAllOrganization
);
export const getAllUsersAction = createActionThunk(
  "GET_ALL_USERS",
  network.getallUsers
);
export const getAddUser = createActionThunk(
  "ADD_USER",
  network.AddUser
);
export const getEnableUser = createActionThunk(
  "ENABLE_USER",
  network.enableUser
);