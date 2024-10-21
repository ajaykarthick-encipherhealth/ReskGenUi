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
export const getAddUser = createActionThunk("ADD_USERS_LIST", network.AddUser);
export const addPatient = createActionThunk("ADD_PATIENTS_IN_USER", network.addPatient);

export const getEnableUser = createActionThunk(
  "ENABLE_USER_USERS_MODULE",
  network.enableUser
);
